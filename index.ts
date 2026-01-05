#!/usr/bin/env node

import * as p from '@clack/prompts';
import { chalkStderr } from 'chalk';
import packageJSON from './package.json' with { type: 'json' };
import { nukeItConfig } from './nukeit.config.js';
import { getTechnology, selectDirectories, confirmNuke } from './tli.js';
import { findTargetDirectories, nukeDirectories } from './utils.js';
import { Command, Option } from 'commander';
import path from 'node:path';
import fs from 'node:fs';

const { green } = chalkStderr;

const handleSigTerm = () => process.exit(0);

process.on('SIGINT', handleSigTerm);
process.on('SIGTERM', handleSigTerm);

async function main() {
	const program = new Command(packageJSON.name)
		.version(
			packageJSON.version,
			'-v, --version',
			'Output the current version of NukeIt.'
		)
		.argument('<directory>')
		.usage('<directory> [options]')
		.helpOption('-h, --help', 'Display this help message.');
	for (const tool of nukeItConfig) {
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

	const technologies = Object.keys(options).length
		? Object.keys(options)
		: await getTechnology();

	const dirsToNuke = new Set<string>();

	for (const tech of technologies) {
		const toolConfig = nukeItConfig.find(tool => tool.value === tech);
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

	const isConfirmed = await confirmNuke();

	if (isConfirmed) {
		await nukeDirectories(confirmedDirs);

		p.outro('Nuking completed successfully!');
	} else {
		p.outro('Nuking operation cancelled.');
	}
}

main().catch(err => {
	console.error(err);
	p.outro('An error occurred: ' + err.message);
	process.exit(1);
});
