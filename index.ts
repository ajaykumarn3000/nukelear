#!/usr/bin/env node

import * as p from '@clack/prompts';
import { chalkStderr } from 'chalk';
import packageJSON from './package.json' with { type: 'json' };
import { config } from './config.js';
import {
	getTechnology,
	selectDirectories,
	maybePreviewDirectories,
	confirmNuke,
	confirmPermanentDelete,
	printStorageStats,
	printTrashList,
} from './tli.js';
import {
	findTargetDirectories,
	nukeDirectories,
	trashDirectories,
	getPathSize,
	listTrash,
	restoreFromTrash,
	deleteTrashEntry,
	emptyTrash,
} from './utils.js';
import { Command, Option } from 'commander';
import path from 'node:path';
import fs from 'node:fs';

const { green, cyan } = chalkStderr;

const handleSigTerm = () => process.exit(0);

process.on('SIGINT', handleSigTerm);
process.on('SIGTERM', handleSigTerm);

async function main() {
	const program = new Command(packageJSON.name)
		.version(
			packageJSON.version,
			'-v, --version',
			'Output the current version of Nukelear.'
		)
		.argument('<directory>')
		.usage('<directory> [options]')
		.helpOption('-h, --help', 'Display this help message.')
		.option(
			'--permanent',
			'Delete permanently instead of moving items to the Recycle Bin.'
		)
		.option(
			'--list-trash',
			'List everything currently in the Recycle Bin for this project and exit.'
		)
		.option(
			'--restore <id>',
			'Restore a single Recycle Bin item by id (see --list-trash) and exit.'
		)
		.option(
			'--empty-trash',
			'Permanently delete everything in the Recycle Bin for this project and exit.'
		);
	for (const tool of config) {
		program.addOption(
			new Option(`--${tool.value}`, `${tool.directories.join(', ')}`)
		);
	}

	program.parse(process.argv);

	const options = program.opts();
	const { args } = program;

	const projectName = args[0];

	const basePath = path.resolve(process.cwd(), projectName);

	if (!fs.existsSync(basePath)) {
		p.outro(`The directory ${green(projectName)} does not exist.`);
		return process.exit(1);
	}

	// --- Recycle Bin management commands (exit early) -----------------------
	if (options.listTrash) {
		printTrashList(listTrash(basePath));
		return process.exit(0);
	}

	if (options.restore) {
		try {
			const entry = restoreFromTrash(basePath, options.restore);
			p.outro(`Restored ${green(entry.relativePath)} from the Recycle Bin.`);
		} catch (error) {
			p.outro(`Could not restore: ${error}`);
			return process.exit(1);
		}
		return process.exit(0);
	}

	if (options.emptyTrash) {
		const count = emptyTrash(basePath);
		p.outro(`Permanently deleted ${cyan(String(count))} item(s) from the Recycle Bin.`);
		return process.exit(0);
	}

	// --- Known technology / config flags (--python, --node, etc.) -----------
	const toolFlagKeys = new Set(config.map(tool => tool.value));
	const selectedToolFlags = Object.keys(options).filter(key =>
		toolFlagKeys.has(key)
	);

	const technologies = selectedToolFlags.length
		? selectedToolFlags
		: await getTechnology();

	if (technologies.length === 0) {
		p.outro('No technologies selected. Nothing to scan, exiting.');
		return process.exit(0);
	}

	const dirsToNuke = new Set<string>();

	for (const tech of technologies) {
		const toolConfig = config.find(tool => tool.value === tech);
		if (toolConfig) {
			toolConfig.directories.forEach(dir => dirsToNuke.add(dir));
		}
	}

	const foundDirs = await findTargetDirectories(basePath, dirsToNuke);
	if (foundDirs.size === 0) {
		p.outro('No target directories found to nuke.');
		return process.exit(0);
	}

	const confirmedDirs = await selectDirectories(foundDirs);

	if (confirmedDirs.length === 0) {
		p.outro('Nothing selected. Nothing to do, exiting.');
		return process.exit(0);
	}

	await maybePreviewDirectories(confirmedDirs);

	const goPermanent = options.permanent
		? true
		: await confirmPermanentDelete();

	const isConfirmed = await confirmNuke(
		goPermanent
			? 'permanently delete the selected items'
			: 'move the selected items to the Recycle Bin'
	);

	if (isConfirmed) {
		const beforeSize = getPathSize(basePath);
		const freedSize = confirmedDirs.reduce(
			(sum, dir) => sum + getPathSize(dir),
			0
		);

		if (goPermanent) {
			await nukeDirectories(confirmedDirs);
		} else {
			await trashDirectories(basePath, confirmedDirs);
		}

		const afterSize = getPathSize(basePath);
		printStorageStats({ before: beforeSize, freed: freedSize, after: afterSize });

		p.outro(
			goPermanent
				? 'Nuking completed successfully!'
				: `Nuking completed! Items moved to the Recycle Bin — run with ${cyan(
						'--list-trash'
					)} to see them, or ${cyan('--restore <id>')} to bring one back.`
		);
	} else {
		p.outro('Nuking operation cancelled.');
	}
}

main().catch(err => {
	console.error(err);
	p.outro('An error occurred: ' + err.message);
	process.exit(1);
});
