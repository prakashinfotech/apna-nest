# Contributing to ApnaNest

Thank you for helping improve ApnaNest. This guide explains the expected development and pull-request workflow.

## Before You Start

- Read the project setup instructions in [README.md](README.md).
- Search existing issues and pull requests before starting duplicate work.
- For security vulnerabilities, follow [SECURITY.md](SECURITY.md) instead of opening a public issue.

## Development Setup

Clone your fork and install the project dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/apna-nest.git
cd apna-nest

cd frontend
npm install

cd ../backend
dotnet restore
```

Configure local environment values using `.env.local`, environment variables, or .NET User Secrets. Never commit real credentials.

## Contribution Workflow

1. Create a branch from the latest `master` branch:

   ```bash
   git checkout master
   git pull origin master
   git checkout -b feature/short-description
   ```

2. Make focused changes that match the existing project structure and style.
3. Add or update tests when behavior changes.
4. Run the relevant quality checks.
5. Commit with a concise, imperative message.
6. Push your branch and open a pull request against `master`.

## Quality Checks

Run the frontend checks:

```bash
cd frontend
npm run typecheck
npm run build
npm audit
```

Run the backend checks from the repository root:

```bash
dotnet test backend/ApnaNest.sln --configuration Release
dotnet list backend package --vulnerable --include-transitive
```

If you change the notification service, also run:

```bash
cd backend/services/notification-svc
npm audit
node --check index.js
node --check routes/notify.js
```

## Security and Sensitive Data

Do not commit:

- API keys, tokens, passwords, or connection strings
- `.env` files or production configuration
- private certificates or SSH keys
- personal data, database exports, or service-account credentials

Use the tracked `.env.example` files only for safe placeholders. If a secret is committed accidentally, rotate it immediately before requesting history cleanup.

## Pull Request Checklist

- [ ] The change is focused and documented.
- [ ] Tests and builds relevant to the change pass locally.
- [ ] No secret, credential, or private data is included.
- [ ] New configuration variables are documented with safe placeholders.
- [ ] The pull request explains what changed and how it was verified.

By contributing, you agree that your contribution may be used under the repository's applicable license and company policies.
