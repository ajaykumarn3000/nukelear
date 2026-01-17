# Security Policy

Nukelear takes the security of our users and the integrity of this open-source
project very seriously.

## Reporting Security Vulnerabilities

If you believe you have discovered a security vulnerability in Nukelear, we
encourage you to let us know right away. **Please do not disclose the
vulnerability publicly until we have had a chance to address it.**

### How to Report

We prefer that you use GitHub's **private vulnerability reporting** feature to
disclose potential security vulnerabilities:

1. Navigate to the
   [Nukelear repository](https://github.com/ajaykumarn3000/nukelear)
2. Click the **Security** tab
3. Click **Report a vulnerability**
4. Fill out the vulnerability report form with as much detail as possible

### Alternative Contact

If you're unable to use GitHub's vulnerability reporting feature, you can email
your report to: [ajaykumarn3000@gmail.com](mailto:ajaykumarn3000@gmail.com)

Please include:

- Description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact
- Suggested fix (if you have one)

## What to Expect

- We will acknowledge receipt of your report within 48 hours
- We will investigate the vulnerability promptly
- We will keep you informed of our progress
- We will credit you in the security advisory (if you wish)
- We aim to release a patch within a reasonable timeframe

## Security Best Practices

When using Nukelear:

- **Keep dependencies updated**: Regularly update Nukelear and its dependencies
- **Review generated code**: Always review the code scaffolded by Nukelear
- **Follow framework guidelines**: Adhere to security best practices for your
  chosen framework (Next.js, React, Express)
- **Environment variables**: Store sensitive data in environment variables,
  never commit them to version control
- **Dependency audits**: Use `npm audit` or `pnpm audit` to check for
  vulnerabilities in your projects

## Scope

This security policy applies to:

- The Nukelear CLI tool itself
- Generated project scaffolding
- Dependencies included by default

It does **not** apply to:

- Issues in generated project code (responsibility of the developer)
- Third-party frameworks or tools used by generated projects
- Projects generated with custom tools not provided by Nukelear

## Thank You

Thank you for helping us keep Nukelear and its community safe. We appreciate
your responsible disclosure and commitment to security.

For more information, see our [Contributing Guidelines](./CONTRIBUTING.md).
