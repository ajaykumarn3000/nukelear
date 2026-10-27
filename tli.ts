import * as p from '@clack/prompts';
import { chalkStderr } from 'chalk';
import { config } from './config.js';
import { formatBytes, previewPath, type TrashEntry } from './utils.js';

const { cyan, dim, yellow } = chalkStderr;

export async function getDirectory() {
	const directoryName = await p.text({
		message: `Enter the ${cyan('directory name')}`,
	});

	if (p.isCancel(directoryName)) {
		p.cancel('Operation cancelled.');
		return process.exit(0);
	}
	return directoryName;
}

export async function getTechnology() {
	const technology = await p.multiselect({
		message: `Select ${cyan('technologies')} to nuke`,
		options: config.map(tool => ({
			value: tool.value,
			label: tool.name,
			hint: tool.directories.join(', '),
		})),
	});

	if (p.isCancel(technology)) {
		p.cancel('Operation cancelled.');
		return process.exit(0);
	}
	return technology;
}

export async function selectDirectories(directories: Set<string>) {
	const confirmedDirectories = await p.multiselect({
		message: `Select ${cyan('directories')} to nuke`,
		options: Array.from(directories).map(dir => ({
			value: dir,
			label: dir,
		})),
		initialValues: Array.from(directories),
	});
	if (p.isCancel(confirmedDirectories)) {
		p.cancel('Operation cancelled.');
		return process.exit(0);
	}
	return confirmedDirectories;
}

/** Offer to preview the contents of each selected path before deleting it. */
export async function maybePreviewDirectories(directories: string[]) {
	const wantsPreview = await p.confirm({
		message: `Preview the contents of the selected items before deleting?`,
		initialValue: false,
	});
	if (p.isCancel(wantsPreview)) {
		p.cancel('Operation cancelled.');
		return process.exit(0);
	}
	if (!wantsPreview) return;

	for (const dir of directories) {
		try {
			const info = previewPath(dir);
			const lines = [
				`${dim('Type:')} ${info.kind}`,
				`${dim('Size:')} ${formatBytes(info.size)}`,
			];
			if (info.kind === 'directory') {
				lines.push(`${dim('Items inside:')} ${info.fileCount}`);
				if (info.sampleEntries.length) {
					lines.push('');
					lines.push(...info.sampleEntries.map(e => `  ${e}`));
					if (info.truncated) lines.push(`  ${dim('… more not shown')}`);
				}
			}
			p.note(lines.join('\n'), dir);
		} catch (error) {
			p.note(`Could not preview: ${error}`, dir);
		}
	}
}

/**
 * Require the user to type the word "delete" to confirm a destructive
 * action, instead of a simple yes/no toggle.
 */
export async function confirmNuke(actionLabel = 'nuke the selected items') {
	p.log.warn(
		yellow(`Type "delete" (without quotes) to confirm you want to ${actionLabel}.`)
	);
	const typed = await p.text({
		message: `Type ${cyan('delete')} to confirm`,
		validate: value => {
			if (value.trim().toLowerCase() !== 'delete') {
				return 'You must type "delete" exactly to confirm, or Ctrl+C to cancel.';
			}
			return undefined;
		},
	});

	if (p.isCancel(typed)) {
		p.cancel('Operation cancelled.');
		return process.exit(0);
	}
	return typed.trim().toLowerCase() === 'delete';
}

export async function confirmPermanentDelete() {
	const confirmation = await p.confirm({
		message: `Skip the Recycle Bin and delete ${yellow('permanently')}? This cannot be undone.`,
		initialValue: false,
	});
	if (p.isCancel(confirmation)) {
		p.cancel('Operation cancelled.');
		return process.exit(0);
	}
	return confirmation;
}

export function printStorageStats({
	before,
	freed,
	after,
}: {
	before: number;
	freed: number;
	after: number;
}) {
	p.note(
		[
			`${dim('Project size before:')} ${formatBytes(before)}`,
			`${dim('Space freed:')}        ${cyan(formatBytes(freed))}`,
			`${dim('Project size now:')}   ${formatBytes(after)}`,
		].join('\n'),
		'Storage summary'
	);
}

export function printTrashList(entries: TrashEntry[]) {
	if (entries.length === 0) {
		p.outro('The Recycle Bin is empty.');
		return;
	}
	const lines = entries.map(
		e =>
			`${cyan(e.id)}  ${e.relativePath}  ${dim(formatBytes(e.size))}  ${dim(
				new Date(e.deletedAt).toLocaleString()
			)}`
	);
	p.note(lines.join('\n'), `Recycle Bin (${entries.length} item(s))`);
}
