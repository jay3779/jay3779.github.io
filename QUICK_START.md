# Quick Start - Monorepo Redistribution

This guide gets a fresh clone running quickly.

## 1) Install Dependencies

```bash
cd <workspace-root>
npm install
```

The root workspace uses npm workspaces with packages under `packages/*`.

## 2) Blog Platform Smoke Check

```bash
cd packages/blog-platform
npm test
npm run build
```

Expected result: tests pass and the static blog output is generated in `packages/blog-platform/docs`.

## 3) VS Code Extension Smoke Check

```bash
cd packages/vscode-extension
npm install
npm run compile
```

Optional extension package build:

```bash
npm run package
```

## 4) Local CLI Smoke Check (`aah-cli`)

```bash
cd packages/aah-cli
npm install
npm test
```

Generate a post URL from the command line:

```bash
node aah-cli.js post --title "CLI Post" --text "# CLI Post\n\nGenerated locally" --json
```

## 5) Layout Reference

```text
packages/
  blog-platform/
  vscode-extension/
  aah-cli/
docs/
README.md
QUICK_START.md
package.json
```

## Redistribution Notes

- This workspace is intentionally cleaned of one-off and deprecated files.
- Package `node_modules` and generated build binaries are excluded and should be regenerated.
- Historical migration/support docs remain under `docs/`.
