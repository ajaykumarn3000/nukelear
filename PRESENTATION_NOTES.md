# Nukelear — Bug Audit & Fix Procedure

This document records exactly what was audited, what was found, and what was
changed in this copy of the Nukelear CLI. Use it as your speaking notes.

## 1. What we did (procedure)

1. Extracted and read through the full Nukelear source (`index.ts`,
   `utils.ts`, `tli.ts`, `config.ts`, `eslint.config.js`, `tsconfig.json`).
2. Installed dependencies (`npm install`) and ran the existing checks:
   - `npx tsc --noEmit` — type-check (passed, 0 errors)
   - `npx eslint .` — lint (passed, 0 errors)
   - `npm run build` — full build (passed)
3. Since the automated checks passed, we manually reviewed the *logic* and
   *configuration* rather than relying only on the tools — this is how the
   two issues below were found.
4. Fixed both issues directly in source.
5. Re-ran type-check, lint, and build to confirm nothing broke.
6. Built a disposable demo project (`demo-project/`) with realistic clutter
   folders to demonstrate the tool live.

## 2. Bug #1 — ESLint configured with browser globals instead of Node.js globals

**File:** `eslint.config.js`, line 15

**Before:**
```js
languageOptions: { globals: globals.browser },
```

**After:**
```js
languageOptions: { globals: globals.node },
```

**Why it's a bug:** Nukelear is a Node.js CLI tool — it uses `process`,
`__dirname`, `Buffer`, etc. — never `window` or `document`. Configuring
ESLint with `globals.browser` tells the linter to treat browser-only
variables as valid and doesn't register Node.js's own globals. It didn't
cause visible failures only because TypeScript's own compiler separately
catches undefined identifiers — but it's a real misconfiguration that
could let genuine errors slip past lint in a plain-JS file, or falsely
flag/allow the wrong globals as the project evolves.

**Verification:** `npx eslint .` still passes after the fix (confirmed).

## 3. Bug #2 — No guard for an empty technology selection

**File:** `index.ts`, inside `main()`

**Before:**
```ts
const technologies = Object.keys(options).length
  ? Object.keys(options)
  : await getTechnology();

const dirsToNuke = new Set<string>();
```

**After:**
```ts
const technologies = Object.keys(options).length
  ? Object.keys(options)
  : await getTechnology();

if (technologies.length === 0) {
  p.outro('No technologies selected. Nothing to scan, exiting.');
  return process.exit(0);
}

const dirsToNuke = new Set<string>();
```

**Why it's a bug:** If a user runs the interactive prompt and confirms with
zero technologies ticked, `dirsToNuke` stays empty. Nothing in it can ever
match a folder name, so `findTargetDirectories` still walks the **entire**
directory tree from scratch — reading every file and subfolder — only to
report "No target directories found to nuke" at the end. On a large project
this is a slow, pointless full scan.

**Fix:** Short-circuit immediately after collecting `technologies`, before
the scan ever starts.

**Verification:** `npx tsc --noEmit`, `npx eslint .`, and `npm run build`
all still pass after the fix (confirmed).

## 4. Demo project (`demo-project/`)

A disposable, self-contained test project bundled in this zip so you can
demo the tool without touching real work:

```text
demo-project/
├── node_modules/bundle.bin   (~20MB fake dependency weight)
├── dist/build.bin            (~5MB fake build output)
├── .next/cache.bin           (~8MB fake Next.js cache)
├── backend/venv/lib.bin      (~10MB fake Python venv)
├── backend/__pycache__/      (empty, matches Python config)
├── .vscode/                  (empty, matches VS Code config)
├── .DS_Store                 (macOS junk file)
├── src/app.js                (real source file — should NOT be touched)
└── backend/main.py           (real source file — should NOT be touched)
```

Total size: ~44 MB before cleanup.

**To reset it before your presentation** (in case you already nuked it
once while practicing), run from inside this folder:
```bash
bash reset-demo.sh
```

## 6. Live demo script (CLI)

```bash
# 1. Show the size before
du -sh demo-project

# 2. Run interactively (arrow keys + spacebar to select Node.js + Python, then Enter)
npx tsx index.ts demo-project

# 3. Confirm "Yes" when asked to nuke

# 4. Show the size after
du -sh demo-project
```

Talking point: `src/app.js` and `backend/main.py` are never listed or
touched — only regenerable clutter folders are targeted.

## 7. Browser version (`nukelear-web.html`)

A standalone, self-contained web page that reuses the exact same target
directory configuration (`node_modules`, `dist`, `.next`, `venv`,
`.vscode`, `.DS_Store`, etc.) but runs entirely in the browser using the
**File System Access API** — no install, no terminal.

**How to use it:**
1. Open `nukelear-web.html` directly in **Chrome, Edge, Brave, or Opera**
   (Safari and Firefox do not support the File System Access API and the
   page will show a warning banner if opened there).
2. Tick the technologies to scan for.
3. Click "Choose Folder…" and grant access to a project folder (e.g. this
   package's `demo-project/`).
4. Review the matched folders and their live-computed sizes, uncheck
   anything you want to keep, click "Nuke Selected", and confirm.

This is a good closing demo piece — it visually reinforces the same
per-item selection control discussed in Bug #2 and the CLI's confirmation
step, just in a GUI.

