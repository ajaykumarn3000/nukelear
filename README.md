<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/banner-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="assets/banner-light.png">
  <img alt="Fallback image description" src="assets/banner-dark.png">
</picture>

[![npm version](https://badge.fury.io/js/nukelear.svg)](https://www.npmjs.com/package/nukelear)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/ajaykumarn3000/nukelear)](https://github.com/ajaykumarn3000/nukelear/issues)
[![GitHub stars](https://img.shields.io/github/stars/ajaykumarn3000/nukelear)](https://github.com/ajaykumarn3000/nukelear/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ajaykumarn3000/nukelear)](https://github.com/ajaykumarn3000/nukelear/network)
[![GitHub contributors](https://img.shields.io/github/contributors/ajaykumarn3000/nukelear)](https://github.com/ajaykumarn3000/nukelear/graphs/contributors)

**Recursively delete package files and dependencies from nested project
folders.**

[⭐ Star on GitHub](https://github.com/ajaykumarn3000/nukelear) •
[🐛 Report Bug](https://github.com/ajaykumarn3000/nukelear/issues) •
[💡 Request Feature](https://github.com/ajaykumarn3000/nukelear/discussions) •
[🤝 Contribute](https://github.com/ajaykumarn3000/nukelear/blob/main/CONTRIBUTING.md)

</div>

---

## 🎯 What is Nukelear?

Nukelear is a powerful CLI tool designed to help developers reclaim disk storage
by efficiently deleting unwanted package files and dependency folders from
nested project structures.

### The Problem

If you have a large, nested development folder structure (like `Dev/` containing
multiple stack-specific subfolders - `python/`, `nodejs/`, `nextjs/`, etc.) and
install libraries/packages for development or demonstration, those
`node_modules` directories, Python `venv`, and other dependency folders can
consume **gigabytes** of storage over time. Manually tracking and deleting these
folders from hundreds of projects is tedious and error-prone.

### The Solution

Nukelear scans your entire development folder structure and lets you selectively
delete package files and dependency directories from all projects in one
command. No more forgotten `node_modules` sitting around for months or years.

---

## ✨ Features

- 🎯 **Recursive Scanning** - Finds and deletes unwanted files across deeply
  nested project structures
- 📦 **Multi-Technology Support** - Delete dependencies for Python, Node.js,
  Next.js, VSCode, and macOS
- 🖥️ **Interactive TUI** - User-friendly terminal interface for selecting what
  to delete
- ⚡ **Bulk Operations** - Clean up multiple projects with a single command
- 🛡️ **Safe by Default** - Review selections before confirming deletion
- 🚀 **Zero Configuration** - Works out of the box with sensible defaults

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
git clone https://github.com/ajaykumarn3000/nukelear.git
cd nukelear

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

<div align="center">

**Made with ❤️ by [Ajaykumar Nadar](https://github.com/ajaykumarn3000/)**

_Building tools that developers love to use_

[⭐ Star on GitHub](https://github.com/ajaykumarn3000/nukelear) •
[🐛 Report Bug](https://github.com/ajaykumarn3000/nukelear/issues) •
[💡 Request Feature](https://github.com/ajaykumarn3000/nukelear/discussions) •
[🤝 Contribute](https://github.com/ajaykumarn3000/nukelear/blob/main/CONTRIBUTING.md)

</div>
