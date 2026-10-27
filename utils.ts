import fs from 'fs';
import path from 'path';
import * as p from '@clack/prompts';

const SKIP_DIRS = new Set(['.git', '.nukelear-trash']);
const TRASH_DIR_NAME = '.nukelear-trash';
const TRASH_INDEX_FILE = '.index.json';

export type TrashEntry = {
	id: string;
	originalPath: string;
	relativePath: string;
	trashedName: string;
	size: number;
	deletedAt: string;
};

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

/** Human-readable byte formatting, e.g. 1536 -> "1.5 KB". */
export function formatBytes(bytes: number): string {
	if (bytes <= 0) return '0 B';
	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	let value = bytes;
	let i = 0;
	while (value >= 1024 && i < units.length - 1) {
		value /= 1024;
		i++;
	}
	return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

/** Recursively sum the size in bytes of a file or directory. */
export function getPathSize(targetPath: string): number {
	let total = 0;
	try {
		const stat = fs.lstatSync(targetPath);
		if (stat.isSymbolicLink()) return 0;
		if (stat.isFile()) return stat.size;
		if (stat.isDirectory()) {
			const entries = fs.readdirSync(targetPath);
			for (const entry of entries) {
				total += getPathSize(path.join(targetPath, entry));
			}
		}
	} catch {
		// Permission errors, races, etc. — ignore and treat as 0.
	}
	return total;
}

export type PreviewInfo = {
	kind: 'file' | 'directory';
	size: number;
	fileCount: number;
	sampleEntries: string[];
	truncated: boolean;
};

/** Build a quick summary of a path's contents for a pre-delete preview. */
export function previewPath(targetPath: string, sampleLimit = 15): PreviewInfo {
	const stat = fs.lstatSync(targetPath);
	if (stat.isFile()) {
		return {
			kind: 'file',
			size: stat.size,
			fileCount: 1,
			sampleEntries: [],
			truncated: false,
		};
	}

	const sampleEntries: string[] = [];
	let fileCount = 0;
	let truncated = false;

	const walk = (dir: string) => {
		let entries: fs.Dirent[] = [];
		try {
			entries = fs.readdirSync(dir, { withFileTypes: true });
		} catch {
			return;
		}
		for (const entry of entries) {
			fileCount++;
			if (sampleEntries.length < sampleLimit) {
				sampleEntries.push(
					path.relative(targetPath, path.join(dir, entry.name)) +
						(entry.isDirectory() ? '/' : '')
				);
			} else {
				truncated = true;
			}
			if (entry.isDirectory()) {
				walk(path.join(dir, entry.name));
			}
		}
	};
	walk(targetPath);

	return {
		kind: 'directory',
		size: getPathSize(targetPath),
		fileCount,
		sampleEntries,
		truncated,
	};
}

function getTrashRoot(basePath: string): string {
	const trashRoot = path.join(basePath, TRASH_DIR_NAME);
	fs.mkdirSync(trashRoot, { recursive: true });
	return trashRoot;
}

function readTrashIndex(basePath: string): TrashEntry[] {
	const indexPath = path.join(getTrashRoot(basePath), TRASH_INDEX_FILE);
	try {
		return JSON.parse(fs.readFileSync(indexPath, 'utf-8')) as TrashEntry[];
	} catch {
		return [];
	}
}

function writeTrashIndex(basePath: string, index: TrashEntry[]) {
	const indexPath = path.join(getTrashRoot(basePath), TRASH_INDEX_FILE);
	fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
}

export function listTrash(basePath: string): TrashEntry[] {
	return readTrashIndex(basePath);
}

/**
 * Move directories/files into the recycle bin (.nukelear-trash) instead of
 * permanently deleting them, so they can be restored later.
 */
export async function trashDirectories(
	basePath: string,
	directories: string[]
): Promise<TrashEntry[]> {
	const trashRoot = getTrashRoot(basePath);
	const index = readTrashIndex(basePath);
	const newEntries: TrashEntry[] = [];

	await p.tasks(
		directories.map(dir => {
			return {
				title: `Moving ${dir} to Recycle Bin`,
				task: async () => {
					try {
						const size = getPathSize(dir);
						const id = `${Date.now()}_${Math.random()
							.toString(36)
							.slice(2, 8)}`;
						const trashedName = `${id}__${path.basename(dir)}`;
						fs.renameSync(dir, path.join(trashRoot, trashedName));
						const entry: TrashEntry = {
							id,
							originalPath: dir,
							relativePath: path.relative(basePath, dir),
							trashedName,
							size,
							deletedAt: new Date().toISOString(),
						};
						index.push(entry);
						newEntries.push(entry);
						return `Moved ${dir} to Recycle Bin (${formatBytes(size)})`;
					} catch (error) {
						return `Failed to move ${dir} to Recycle Bin: ${error}`;
					}
				},
			};
		})
	);

	writeTrashIndex(basePath, index);
	return newEntries;
}

/** Permanently delete directories/files without going through the recycle bin. */
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

/** Restore a single recycle-bin entry back to its original location. */
export function restoreFromTrash(basePath: string, id: string): TrashEntry {
	const index = readTrashIndex(basePath);
	const entry = index.find(e => e.id === id);
	if (!entry) {
		throw new Error(`No Recycle Bin item found with id "${id}".`);
	}
	const trashRoot = getTrashRoot(basePath);
	const trashedPath = path.join(trashRoot, entry.trashedName);
	if (!fs.existsSync(trashedPath)) {
		throw new Error(`Recycle Bin item "${id}" is missing on disk.`);
	}
	fs.mkdirSync(path.dirname(entry.originalPath), { recursive: true });
	if (fs.existsSync(entry.originalPath)) {
		throw new Error(
			`Cannot restore: ${entry.originalPath} already exists. Move or remove it first.`
		);
	}
	fs.renameSync(trashedPath, entry.originalPath);
	writeTrashIndex(
		basePath,
		index.filter(e => e.id !== id)
	);
	return entry;
}

/** Permanently delete one recycle-bin entry. */
export function deleteTrashEntry(basePath: string, id: string): void {
	const index = readTrashIndex(basePath);
	const entry = index.find(e => e.id === id);
	if (!entry) {
		throw new Error(`No Recycle Bin item found with id "${id}".`);
	}
	const trashedPath = path.join(getTrashRoot(basePath), entry.trashedName);
	fs.rmSync(trashedPath, { recursive: true, force: true });
	writeTrashIndex(
		basePath,
		index.filter(e => e.id !== id)
	);
}

/** Permanently empty the entire recycle bin. */
export function emptyTrash(basePath: string): number {
	const index = readTrashIndex(basePath);
	const trashRoot = path.join(basePath, TRASH_DIR_NAME);
	fs.rmSync(trashRoot, { recursive: true, force: true });
	return index.length;
}
