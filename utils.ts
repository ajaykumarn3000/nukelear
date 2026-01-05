import fs from 'fs';
import path from 'path';
import * as p from '@clack/prompts';

const SKIP_DIRS = new Set(['.git']);

export async function findTargetDirectories(
	dir: string,
	targetDirs: Set<string>,
	foundDirs: Set<string> = new Set()
): Promise<Set<string>> {
	try {
		const entries = fs.readdirSync(dir, { withFileTypes: true });
		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name);
			if (targetDirs.has(entry.name)) {
				foundDirs.add(fullPath);
			} else if (entry.isDirectory() && !SKIP_DIRS.has(entry.name)) {
				try {
					await findTargetDirectories(fullPath, targetDirs, foundDirs);
				} catch (error) {
					// Handle permission errors gracefully
					if (
						error instanceof Error &&
						'code' in error &&
						error.code !== 'EACCES'
					) {
						console.error(`Error traversing ${fullPath}:`, error.message);
					}
				}
			}
		}
	} catch (error) {
		if (error instanceof Error && 'code' in error && error.code !== 'EACCES') {
			console.error(`Error reading directory ${dir}:`, error.message);
		}
	}
	return foundDirs;
}

export async function nukeDirectories(directories: string[]) {
	await p.tasks(
		directories.map(dir => {
			return {
				title: `Nuking ${dir}`,
				task: async () => {
					try {
						fs.rmSync(dir, { recursive: true, force: true });
						return `Nuked ${dir}`;
					} catch (error) {
						return `Failed to nuke ${dir}: ${error}`;
					}
				},
			};
		})
	);
}
