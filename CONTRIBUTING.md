# Contributing to Nukelear

Thank you for your interest in contributing to Nukelear! We welcome and
encourage contributions from the community. Whether you're fixing bugs, adding
features, improving documentation, or helping with issues, every contribution
makes Nukelear better for everyone.

Before you start, please review our [Code of Conduct](./CODE_OF_CONDUCT.md) and
[Security Policy](./SECURITY.md).

## Ways to Contribute

- 🐛 **Bug Reports**: Found a bug?
  [Open an issue](https://github.com/ajaykumarn3000/nukelear/issues/new?template=bug_report.md)
- 💡 **Feature Requests**: Have an idea?
  [Share it with us](https://github.com/ajaykumarn3000/nukelear/issues/new?template=feature_request.md)
- 📝 **Documentation**: Help improve our documentation
- 🔧 **Code**: Submit pull requests with improvements or new features
- 🧪 **Testing**: Help test new features or report edge cases
- 💬 **Community**: Help answer questions and support other users

## Development Process

### Prerequisites

- Node.js 18.0 or higher
- npm 7.0 or higher (or yarn/pnpm)
- Git
- GitHub account

### Getting Started

#### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/nukelear.git
cd nukelear
```

#### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Create a new branch for your feature/fix
git checkout -b feature/amazing-feature
# or
git checkout -b fix/bug-description
```

#### 3. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments/documentation for complex logic
- Update documentation if you add features
- Ensure backward compatibility

#### 4. Test Your Changes

```bash
# Run linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Check code formatting
npm run format:check

# Format code with Prettier
npm run format

# Build the project
npm run build

# Test the CLI locally
npm link
nukelear

# Test with specific flags
npm run dev -- my-app --next --ts --tools
npm run dev -- my-app --react --js

# Unlink when done
npm unlink -g nukelear
```

#### 5. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/). Please
follow this format:

```bash
# Good commit messages
git commit -m "feat: add support for Yarn package manager"
git commit -m "fix: resolve issue with TypeScript template generation"
git commit -m "docs: update README with new installation instructions"
```

#### 6. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/amazing-feature

# Open a Pull Request on GitHub
```

### Pull Request Guidelines

When submitting a pull request:

1. **Title**: Use a clear, descriptive title (ideally following conventional
   commits)
2. **Description**: Explain what your PR does and why it's needed
3. **Linked Issues**: Reference any related issues with `Closes #123`
4. **Tests**: Verify your changes work with different flag combinations
5. **Documentation**: Update README or other docs if needed
6. **Formatting**: Ensure code is formatted with Prettier
7. **Linting**: Fix any ESLint issues before submitting

### Review Process

- A maintainer will review your PR
- We might request changes or ask clarifying questions
- Once approved, your PR will be merged
- Your contribution will be credited in the release notes

## Commit Convention

| Type       | Description              | Example                               |
| ---------- | ------------------------ | ------------------------------------- |
| `feat`     | New features             | `feat: add Vue.js framework support`  |
| `fix`      | Bug fixes                | `fix: resolve template copying issue` |
| `docs`     | Documentation changes    | `docs: add contribution guidelines`   |
| `style`    | Code style changes       | `style: fix indentation in utils.ts`  |
| `refactor` | Code refactoring         | `refactor: simplify CLI prompt logic` |
| `perf`     | Performance improvements | `perf: optimize template generation`  |
| `test`     | Adding or updating tests | `test: add unit tests for utils`      |
| `build`    | Build system changes     | `build: update TypeScript config`     |
| `ci`       | CI/CD changes            | `ci: add GitHub Actions workflow`     |
| `chore`    | Maintenance tasks        | `chore: update dependencies`          |

## Code Style Guidelines

- **Language**: Use TypeScript for all new code
- **Formatting**: Follow the existing Prettier configuration (run
  `npm run format`)
- **Linting**: Ensure ESLint passes without errors (run `npm run lint:fix`)
- **Comments**: Add JSDoc comments for public functions
- **Naming**: Use descriptive variable and function names
- **Async/Await**: Prefer async/await over promises for readability
- **Error Handling**: Use try/catch for proper error handling
- **Type Safety**: Leverage TypeScript's type system, avoid `any`

### Example Code Style

```typescript
/**
 * Validates a project name according to npm package name rules.
 * @param name - The project name to validate
 * @returns True if valid, false otherwise
 */
function validateProjectName(name: string): boolean {
	// Implementation...
}
```

## Testing Guidelines

While Nukelear doesn't have automated tests yet, we ask that you:

- **Test manually**: Try different flag combinations
  - `npm run dev -- test-app --next --ts --tools`
  - `npm run dev -- test-app --react --js`
  - `npm run dev -- test-app --express --ts`
- **Verify generated projects**: Build and run generated projects
- **Test edge cases**: Try invalid inputs, special characters, etc.
- **Cross-platform testing**: If possible, test on Windows, macOS, and Linux

### Testing Checklist

- [ ] Interactive mode works
- [ ] Non-interactive (flag) mode works
- [ ] Help (`--help`) and version (`--version`) flags work
- [ ] Tool validation works (invalid combinations are rejected)
- [ ] Generated projects have correct structure
- [ ] Git initialization works (or is skipped with `--no-git`)

## Documentation Guidelines

- **Keep it clear and concise**: Avoid jargon; explain technical terms
- **Include examples**: Show how to use new features
- **Update README**: Document new flags, tools, or behavior
- **Update CONTRIBUTING.md**: Add guidelines for new features if needed
- **Use proper Markdown**: Follow Markdown best practices
- **Spell check**: Use a spell checker before submitting
- **Link references**: Link to relevant sections and external docs

## Issue Reporting

When reporting bugs, please include:

- **Environment**: OS, Node.js version, npm/yarn/pnpm version
- **Nukelear Version**: Output of `nukelear --version` or
  `npx nukelear@latest --version`
- **Steps to Reproduce**: Clear, step-by-step instructions to reproduce the bug
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Error Messages**: Full error messages and stack traces
- **Additional Context**: Screenshots, logs, or other relevant information

### Creating a Bug Report

1. Check [existing issues](https://github.com/ajaykumarn3000/nukelear/issues) to
   avoid duplicates
2. Use the bug report template on GitHub
3. Provide as much detail as possible

## Feature Request Guidelines

When suggesting new features:

- **Use Case**: Explain why this feature would be valuable
- **Proposed Solution**: Describe how you envision it working
- **Alternatives**: Consider and mention alternative approaches
- **Implementation**: If you're willing to implement it, let us know!

### Creating a Feature Request

1. Use
   [GitHub Discussions](https://github.com/ajaykumarn3000/nukelear/discussions)
   for feature ideas
2. Describe the use case and problem you're trying to solve
3. Provide examples of how you'd like to use the feature

<!-- ## Recognition

All contributors will be recognized in our README and release notes. We
appreciate every contribution, no matter how small! -->

## Getting Help

- **GitHub Discussions**:
  [Ask questions](https://github.com/ajaykumarn3000/nukelear/discussions) about
  development
- **Existing Issues**: Check
  [existing issues](https://github.com/ajaykumarn3000/nukelear/issues) for
  context
- **Code Review**: Review `index.ts`, `utils.ts`, and `tli.ts` to understand
  patterns
- **Community**: Join the conversation in issues and pull requests
- **Email**: Reach out to
  [ajaykumarn3000@gmail.com](mailto:ajaykumarn3000@gmail.com)

## Additional Resources

- [Nukelear README](./README.md) - Full documentation
- [Security Policy](./SECURITY.md) - Report vulnerabilities
- [Code of Conduct](./CODE_OF_CONDUCT.md) - Community standards
- [License](./LICENSE) - MIT License
