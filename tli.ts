import * as p from '@clack/prompts';
import { chalkStderr } from 'chalk';
import { wipeItConfig } from './wipeit.config.js';

const { cyan } = chalkStderr;
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
		options: wipeItConfig.map(tool => ({
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

export async function confirmNuke() {
	const confirmation = await p.confirm({
		message: `Are you sure you want to nuke the selected directories?`,
		initialValue: true,
	});

	if (p.isCancel(confirmation)) {
		p.cancel('Operation cancelled.');
		return process.exit(0);
	}
	return confirmation;
}
