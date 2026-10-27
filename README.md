<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/banner-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="assets/banner-light.png">
  <img alt="Fallback image description" src="assets/banner-dark.png">
</picture>

[![npm version](https://badge.fury.io/js/nukelear.svg)](https://www.npmjs.com/package/nukelear)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/joel-patole/Nukelear)](https://github.com/joel-patole/Nukelear/issues)
[![GitHub stars](https://img.shields.io/github/stars/joel-patole/Nukelear)](https://github.com/joel-patole/Nukelear/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/joel-patole/Nukelear)](https://github.com/joel-patole/Nukelear/network)
[![GitHub contributors](https://img.shields.io/github/contributors/joel-patole/Nukelear)](https://github.com/joel-patole/Nukelear/graphs/contributors)

**The dual-purpose developer toolkit: recursively clean up heavy dependencies to reclaim disk storage — and upload clean project files straight to GitHub with automated secret detection.**

[⭐ Star on GitHub](https://github.com/joel-patole/Nukelear) •
[🐛 Report Bug](https://github.com/joel-patole/Nukelear/issues) •
[💡 Request Feature](https://github.com/joel-patole/Nukelear/discussions) •
[🤝 Contribute](https://github.com/joel-patole/Nukelear/blob/main/CONTRIBUTING.md)

</div>

---

## 🎯 What is Nukelear?

Nukelear is a powerful developer utility — usable as a fast terminal CLI or as an interactive browser app (**Nukelear Web**) — built around **two primary functions**:

1. 🧹 **Recursive Dependency & Storage Cleanup (CLI & Web)**  
   Scans deep, nested project structures (`Dev/`, `Projects/`, multi-repo workspaces) and safely nukes bulky dependency folders (`node_modules`, Python `.venv`, build artifacts, cache) to reclaim gigabytes of disk space in seconds.

2. ☁️ **Direct GitHub Upload with Built-in Secret Shield (Web)**  
   Uploads chosen project files directly to any GitHub repository straight from your browser via GitHub's API — no `git` command line needed. Automatically scans file contents for hardcoded credentials, API keys, passwords, and tokens, unchecks sensitive files, and lets you redact secrets on-the-fly before pushing.

---

### 1. Dependency Cleanup

#### The Problem
If you have a large, nested development folder structure (like `Dev/` containing multiple stack-specific subfolders - `python/`, `nodejs/`, `nextjs/`, etc.) and install libraries/packages for development or demonstration, those `node_modules` directories, Python `venv`, and other dependency folders can consume **gigabytes** of storage over time. Manually tracking and deleting these folders from hundreds of projects is tedious and error-prone.

#### The Solution
Nukelear scans your entire development folder structure and lets you selectively delete package files and dependency directories from all projects in one command (or a few clicks). No more forgotten `node_modules` sitting around for months or years.

### 2. Direct GitHub Upload

#### The Problem
Pushing clean code or demo projects to GitHub often requires initializing Git, setting remotes, configuring `.gitignore` to avoid pushing heavy clutter, and double-checking that local secrets (`.env`, private keys, API credentials) aren't accidentally committed.

#### The Solution
Nukelear Web's **GitHub Upload** tab connects directly to GitHub's REST API using a personal access token. It automatically skips clutter folders (`node_modules`, `.git`, `venv`, `dist`), flags sensitive filenames, deep-scans small text files for hardcoded secrets, and allows you to redact sensitive lines right in your browser before committing directly to your branch.

---

### 💻 Two Ways to Use Nukelear

- **The CLI** (`nukelear`) — Run it directly from your terminal, focused on blazing-fast recursive dependency scanning, interactive selection, and safe deletion.
- **Nukelear Web** (`nukelear-web.html`) — A single self-contained file you open in Chrome/Edge (no install needed). It provides the same cleanup engine plus a Recycle Bin, content previews, and the complete **GitHub Upload** workflow with secret detection. Full walkthrough in [🆕 New Features & How to Use Them](#-new-features--how-to-use-them) below.

---

## 🚀 Quick Start

### Using npx (Recommended)

```bash
npx nukelear@latest <directory>
```

Replace `<directory>` with the path to your root development folder.

### Install Globally

```bash
npm install -g nukelear
nukelear <directory>
```

### System Requirements

- **Node.js**: 18.0 or higher
- **npm**: 7.0 or higher (or **yarn**/**pnpm** equivalent)

---

## 📖 Usage

### Interactive Mode (Recommended)

When you run Nukelear without specifying technologies, you'll be presented with
an interactive interface:

```bash
$ npx nukelear ~/Dev

┌  nukelear
│
◇  Select technologies to nuke:
│  ◈ Node.js (node_modules, dist, build)
│  ◈ Python (venv, .venv, __pycache__)
│  ◈ Next.js (.next, node_modules, dist, build)
│  ◈ VSCode (.vscode)
│  ◈ macOS (.DS_Store)
│
◇  Confirm deletion?
│  This will permanently delete the selected directories.
```

### Non-Interactive Mode (Flags)

Skip all prompts by specifying technologies via flags:

```bash
# Delete only Node.js dependencies
nukelear ~/Dev --node

# Delete multiple technologies at once
nukelear ~/Dev --node --python

# Delete everything
nukelear ~/Dev --node --next --python --vscode --macos
```

---

## 🛠️ Supported Technologies

Nukelear can delete dependencies for the following technologies:

| Flag       | Description                            | Directories Deleted             |
| ---------- | -------------------------------------- | ------------------------------- |
| `--node`   | Node.js project dependencies           | `node_modules`, `dist`, `build` |
| `--next`   | Next.js project dependencies and cache | `.next`, `node_modules`, `dist` |
| `--python` | Python virtual environments and cache  | `venv`, `.venv`, `__pycache__`  |
| `--vscode` | VSCode workspace settings              | `.vscode`                       |
| `--macos`  | macOS system files                     | `.DS_Store`                     |

---

## ⚙️ Configuration

Nukelear's technology definitions and file mappings are defined in
`nukelear.config.ts`:

```typescript
type ConfigItem = {
	name: string;
	value: string;
	directories: string[];
};
```

Each item in the config specifies:

- **name** - Display name in the UI
- **value** - CLI flag name
- **directories** - Array of directory/file names to delete recursively

To add support for a new technology, simply add it to the `nukelearConfig` array
in `nukelear.config.ts`.

---

## 🏗️ Local Development

Want to contribute to Nukelear or test changes locally? Here's how to get
started:

### Prerequisites

- Node.js 18.0 or higher
- npm 7.0 or higher
- Git

### Clone and Setup

```bash
# Clone the repository
git clone https://github.com/joel-patole/Nukelear.git
cd Nukelear

# Install dependencies
npm install

# Run in development mode
npm run dev ~/Dev

# Build the project
npm run build

# Test the CLI locally (creates a global symlink)
npm link
nukelear ~/Dev

# Unlink when done testing
npm unlink -g nukelear
```

### Available Scripts

| Script             | Description                                                |
| ------------------ | ---------------------------------------------------------- |
| `npm run dev`      | Run the CLI in development mode with `tsx`                 |
| `npm run build`    | Build and lint the project for production                  |
| `npm run lint`     | Run ESLint to check for code issues                        |
| `npm run lint:fix` | Auto-fix ESLint issues where possible                      |
| `npm run format`   | Format code with Prettier                                  |
| `npm run clean`    | Remove the `dist` directory                                |
| `npm run deploy`   | Build and publish to npm (maintainers only)                |
| `npm run prepare`  | Run `husky` prepare script to set up git hooks (auto-run). |

---

## 📁 Project Structure

```text
nukelear/
├── index.ts              # Main CLI entry point
├── tli.ts                # Interactive TUI prompts
├── utils.ts              # Core utility functions
├── nukelear.config.ts      # Technology configuration
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
├── eslint.config.js      # ESLint configuration
├── commitlint.config.js  # Conventional commits configuration
├── dist/                 # Compiled output (created after build)
└── README.md             # This file
```

### Key Files Explained

- **index.ts** - Entry point that sets up the CLI, parses arguments, and
  orchestrates the workflow
- **tli.ts** - Terminal UI helpers that provide interactive prompts for
  selecting technologies and confirming deletion
- **utils.ts** - Core functions for scanning directories and recursively
  deleting files
- **nukelear.config.ts** - Configuration that defines supported technologies and
  their associated directories

---

## 📋 CLI Reference

### Basic Usage

```bash
nukelear <directory> [options]
```

### Options

| Flag            | Description                            |
| --------------- | -------------------------------------- |
| `-v, --version` | Output the current version of Nukelear |
| `-h, --help`    | Display help and available options     |
| `--node`        | Delete Node.js dependencies            |
| `--next`        | Delete Next.js dependencies            |
| `--python`      | Delete Python virtual environments     |
| `--vscode`      | Delete VSCode workspace settings       |
| `--macos`       | Delete macOS system files              |

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

---

## 🙏 Acknowledgments

Nukelear stands on the shoulders of giants. We're grateful to:

- **Open Source Community**: For the amazing tools and libraries we integrate
- **Tool Maintainers**: clack, chalk, and commander contributors
- **Contributors**: Everyone who has contributed code, reported issues, or
  shared feedback
- **Users**: The developer community that uses and trusts Nukelear

---

---

## 🆕 New Features & How to Use Them

This version adds a Recycle Bin, typed delete-confirmation, content
previews, storage stats, and (in the browser version) direct GitHub
uploads. Steps for each are below.

### 0. Opening Nukelear Web (the browser version)

No install, no terminal. It only works in **Chrome, Edge, Brave, or Opera**
on desktop — it needs the File System Access API, which Safari and Firefox
don't support.

1. Double-click `nukelear-web.html`, or drag it into your browser.
2. Click **"Choose Folder…"** and grant access to the project folder you
   want to clean. Its size is shown right away.
3. Pick the technologies to clean from the checkboxes — it rescans
   automatically each time you change a selection.
4. Review the matched folders. Click 👁️ next to any item to preview its
   contents before deciding to delete it.
5. Select the items you want gone and click **"Move to Recycle Bin."**
6. Type `delete` in the confirmation box to proceed.
7. Check the result panel for the amount freed and your project's size
   before/after.
8. Open the **"Recycle Bin"** tab any time to restore an item, or the
   **"GitHub Upload"** tab to push files to a repo (see below).

### 1. Recycle Bin (CLI)

Nuking no longer deletes permanently by default — items are moved into a
hidden `.nukelear-trash` folder inside your project first.

1. Run Nukelear as usual: `nukelear ~/Dev`
2. Select technologies and directories, then confirm — the items move to
   the Recycle Bin instead of being deleted outright.
3. List what's in the bin: `nukelear ~/Dev --list-trash`
4. Restore an item by its id: `nukelear ~/Dev --restore <id>`
5. Permanently empty the bin: `nukelear ~/Dev --empty-trash`
6. To skip the Recycle Bin entirely and delete for good, add `--permanent`:
   `nukelear ~/Dev --node --permanent`

### 2. Type-to-confirm (CLI & Web)

Instead of a plain yes/no prompt, you'll be asked to type the word
`delete` before anything is removed. This applies both in the terminal and
in Nukelear Web's confirmation dialog.

### 3. Preview before deleting (CLI & Web)

- **CLI:** after selecting items to nuke, answer "yes" when asked
  "Preview the contents of the selected items before deleting?" to see each
  item's type, size, and a sample of its contents.
- **Web:** click the 👁️ icon next to any matched item to preview a file's
  text or a folder's contents before deleting it.

### 4. Storage stats (CLI & Web)

After cleanup finishes, you'll see the project size before, the amount
freed, and the project size now — both in the terminal output and in
Nukelear Web's result panel.

### 5. Uploading to GitHub from Nukelear Web

The **GitHub Upload** tab in `nukelear-web.html` pushes chosen files
straight to a GitHub repository using GitHub's API — no `git` command line
needed. The target branch must already have at least one commit (e.g. a
repo created with a README); this tool commits on top of it rather than
initializing a new repo.

1. **Create a token.** On GitHub: Settings → Developer settings →
   Fine-grained tokens → Generate new token, scoped to the one repo you're
   uploading to, with **Contents: Read and write** permission.
2. Open `nukelear-web.html`, choose your project folder, then open the
   **GitHub Upload** tab.
3. Paste your token into **GitHub Personal Access Token**.
4. Paste the **repository link**, e.g. `https://github.com/you/your-repo`.
5. Set the **branch** (default `main`) and a **commit message**.
6. Click **"Scan Project Files"** — it walks your project, skipping
   `node_modules`, `.git`, `dist`, `.next`, `venv`, and similar folders. It
   also peeks inside each small text file for anything that reads like a
   hardcoded password, admin login, API key, or other credential — not
   just files with a suspicious *name*.
7. **Review the file list before uploading.** Files flagged either by name
   (`.env`, `*.pem`, `credentials.json`, etc. — badge "Looks sensitive") or
   by what's actually written inside them (badge "🔑 Secrets in content")
   are unchecked automatically. Use the filter box to find and uncheck any
   other specific file yourself.
8. **Edit a file instead of excluding it.** Click ✏️ next to any file to
   open its text right in the page. Flagged lines are listed above the
   editor — click **"Redact All Detected"** to blank them out in one go, or
   edit any line by hand. **"Save Changes"** stores that edited version as
   what gets uploaded; your real local file is left untouched unless you
   tick "Also overwrite my local file."
9. Click **"Upload Selected Files."** Progress logs live as each file is
   committed and the branch is updated.
10. If anything still flagged (by name or by content) is still checked,
    you'll get one more confirmation prompt listing exactly which files,
    before they're pushed.

**Security note:** your token is only used in your browser to call
`api.github.com` directly — it's never stored or sent anywhere else. Since
it's pasted into a plain HTML file, only use this on a machine you trust,
and use a fine-grained token scoped to just that one repo. The secret
detection (by name and by content) is a best-effort heuristic, not a
guarantee — always glance over the file list yourself before uploading.

---

<div align="center">

**Made by [Joel Patole](https://github.com/joel-patole)** · [joelpatole1@gmail.com](mailto:joelpatole1@gmail.com)

</div>
