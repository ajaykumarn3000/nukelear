# START HERE — Package Guide

This zip contains the Nukelear CLI (with two bugs fixed), a disposable
demo project, and a standalone browser version. Everything below explains
how the pieces connect and the exact order to run things in.

## What's inside

```text
nukelear-main/
├── index.ts               CLI entry point — imports config.ts, tli.ts, utils.ts
├── config.ts               Technology → clutter-directory map (shared by CLI and web page)
├── tli.ts                  Interactive terminal prompts (Clack)
├── utils.ts                 Directory scanning + deletion logic
├── eslint.config.js         FIXED: now uses Node.js globals (was browser globals)
├── package.json             Scripts: npm install / npm run build
│
├── demo-project/            Disposable ~44MB test project (safe to nuke repeatedly)
├── reset-demo.sh            Regenerates demo-project/ back to its full "dirty" state
│
├── nukelear-web.html        Standalone browser version (Chrome/Edge/Brave only)
│
└── PRESENTATION_NOTES.md    Full write-up of both bugs + before/after code + demo script
```

## How the pieces connect

- **`index.ts`** is the program that actually runs. It reads `config.ts` to
  know which folders count as clutter for each technology, calls
  functions from **`tli.ts`** to ask you questions in the terminal, and
  calls functions from **`utils.ts`** to scan the disk and delete folders.
- **`nukelear-web.html`** is completely independent — it does not import
  or require any of the `.ts` files. It has its own copy of the same
  technology → directory mapping written directly into its JavaScript, so
  it behaves identically without needing Node.js or a build step at all.
  You can literally double-click it and open it in a browser.
- **`demo-project/`** is not code — it's just a folder full of dummy files
  for the CLI or the web page to practice on. Neither `index.ts` nor
  `nukelear-web.html` references it directly; you simply point either
  tool *at* it when you run them (see below).
- **`reset-demo.sh`** only touches `demo-project/`. It doesn't need the
  CLI to be built and doesn't touch any other file.

## Run order (do this once, in this order)

1. `cd` into this folder in Terminal.
2. `npm install` — installs the CLI's dependencies (only needed for the
   terminal version, not for the web page).
3. `bash reset-demo.sh` — makes sure `demo-project/` is full before your
   first demo run.
4. Try the CLI: `npx tsx index.ts demo-project` (pick Node.js + Python in
   the menu, confirm).
5. Run `bash reset-demo.sh` again to refill it.
6. Try the web page: open `nukelear-web.html` in **Chrome**, tick Node.js
   + Python, click "Choose Folder…", select the `demo-project` folder,
   review, and nuke.

Full technical detail on the two bug fixes and why they mattered is in
`PRESENTATION_NOTES.md`.
