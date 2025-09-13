# Phase 10

A React-based Phase 10 card game implementation.

## Development

```bash
pnpm install
pnpm run dev
```

## Building

```bash
pnpm run build
```

## GitHub Pages Deployment

This project is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment is handled by a GitHub Actions workflow that:

1. Installs dependencies with `pnpm install`
2. Builds the project with `pnpm run build`
3. Deploys the `dist` folder to GitHub Pages

**Repository Setup Required:**
To enable GitHub Pages deployment, ensure the repository settings have:
- GitHub Pages source set to "GitHub Actions"
- The workflow has the necessary permissions to deploy

The deployed site will be available at: `https://manindark.github.io/Phase10/`