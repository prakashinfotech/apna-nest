# Git Standards

This document defines the Git workflow and commit standards for the ApnaNest project.

## Branching Strategy

- **main**: The stable production branch. Should always be deployable.
- **Feature Branches**: `feat/description-of-feature`
- **Bug Fix Branches**: `fix/description-of-bug`
- **Hotfix Branches**: `hotfix/urgent-fix`
- **Documentation**: `docs/description`
- **Chore/Refactor**: `chore/description` or `refactor/description`

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format
`<type>(<scope>): <description>`

### Types
- **feat**: A new feature.
- **fix**: A bug fix.
- **docs**: Documentation only changes.
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
- **refactor**: A code change that neither fixes a bug nor adds a feature.
- **perf**: A code change that improves performance.
- **test**: Adding missing tests or correcting existing tests.
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation.

### Rules
- Use the imperative, present tense: "change" not "changed" nor "changes".
- No period at the end of the subject line.
- Scope is optional but recommended for large monorepos (e.g., `feat(frontend): add search bar`).

## Pull Requests

- **Size**: Keep PRs small and focused. Large PRs are harder to review and more likely to contain bugs.
- **Description**: 
  - What was changed?
  - Why was it changed?
  - How was it tested?
  - Any breaking changes?
- **Review**: All PRs must be reviewed by at least one other person (or AI subagent if authorized).
- **CI/CD**: Ensure all tests pass and the build is successful before merging.

## Workflow (Vibe Coding Style)

1. **Explore**: Understand the task and the codebase.
2. **Plan**: Describe the intended changes.
3. **Code**: Implement the changes.
4. **Test**: Verify the changes with automated tests.
5. **Commit**: Use a clear commit message.
6. **Push/PR**: Open a PR for review.
