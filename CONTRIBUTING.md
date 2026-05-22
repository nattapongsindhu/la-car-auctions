# Contributing

This is a personal portfolio project. Contributions are welcome for bug fixes and improvements.

## Getting Started

```bash
git clone https://github.com/nattapongsindhu/la-car-auctions.git
cd la-car-auctions
npm install
npm run dev
```

## Before Submitting a PR

Run all quality checks locally:

```bash
npm run typecheck   # TypeScript validation
npm run build       # Production build
npm audit           # Dependency security check
```

All three must pass with 0 errors.

## Commit Style

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new filter option
fix: correct DMV fee calculation for 2024 vehicles
refactor: split parser into separate module
docs: update README installation steps
```

## Pull Request Requirements

- Fill out the PR template completely
- Include screenshots for any UI changes
- Do not commit secrets, API keys, or credentials
- Keep changes focused — one concern per PR
