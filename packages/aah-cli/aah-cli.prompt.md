---
title: "AAH CLI — /cli"
description: "Generates blog posts, assets, and pushes commits to GitHub from the workspace using the aah-cli package. Workspace-scoped; can also be exposed as an MCP tool."
scope: workspace
invocation: "/cli"
version: "0.1"
author: "GitHub Copilot"
mcp_tool: true
---

Purpose
-------

Make the assistant act as a reproducible CLI that programmatically creates blog posts, updates site metadata, optionally generates assets (OG images), and commits + pushes the changes to the repository. Safe-by-default: `dry_run: true` unless explicitly overridden.

Behavior (how the prompt should be executed)
-----------------------------------------

- Parse the structured inputs listed below.
- If `content` is omitted, propose an outline then generate full markdown after user approval.
- Produce a final markdown file that includes a YAML frontmatter compatible with the repo's blog platform (title, date, author, tags, excerpt, slug, og_image).
- Save the markdown to the workspace posts directory (default: packages/blog-platform/posts/). Update the posts index (e.g., packages/blog-platform/posts/index.json or index.json) so the site can discover the post.
- Optionally call local scripts found in the workspace (for example `packages/blog-platform/scripts/generate-og-images.js`) to create assets; include generated asset paths in the frontmatter.
- Prepare the git workflow: create a branch (default `posts/<slug>`), stage files, commit with a standardized message, push the branch to origin, and optionally open a Pull Request.
- Always return a structured plan and a `dry_run` preview containing the files and git commands. If `dry_run` is `false` and `confirm` is `true`, include the exact shell commands that will be run.

Inputs (schema)
---------------

Provide the following fields when invoking `/cli`. Fields marked (required) must be supplied; others have sensible defaults. The prompt now supports choosing the git flow (`git_flow`) and whether to run build/test scripts (`run_build`).

```json
{
  "title": "string (required)",
  "author": "string (optional; default: git user)",
  "date": "ISO string (optional; default: now)",
  "tags": ["string"],
  "excerpt": "string (optional)",
  "content": "string (optional) — if omitted assistant generates content",
  "style": "string (optional; example values: 'concise','longform','technical','tutorial')",
  "slug": "string (optional; generated from title)",
  "assets": ["path or URL"],
  "git_flow": "string (optional; allowed: 'direct'|'branch'; default: 'direct') — 'direct' pushes to the target branch; 'branch' creates a feature branch",
  "branch": "string (optional; default: posts/<slug>) — used when `git_flow` is 'branch'",
  "create_pr": "boolean (optional; default: false) — if true and `git_flow` is 'branch', open a PR",
  "publish": "boolean (optional; default: false) — if true, maintainers may merge",
  "commit_message": "string (optional)",
  "run_build": "boolean (optional; default: false) — run build/test scripts before pushing",
  "dry_run": "boolean (optional; default: true)",
  "confirm": "boolean (optional; default: false) — optional flag; push no longer requires this"
}
```

Expected outputs
----------------

- `plan`: ordered list of steps the assistant will perform.
- `files`: list of files to be created/updated with path and a short preview.
- `git_commands`: list of git and shell commands that would be executed.
- `artifacts`: generated assets (OG images, image urls), if any.
- `result`: final status object with `branch`, `commit_sha` (if pushed), and `pr_url` (if created).

Files & Paths (defaults)
------------------------

- Posts directory: `packages/blog-platform/posts/`
- Index file: `packages/blog-platform/posts/index.json` or `packages/blog-platform/index.json` (repo may vary)
- OG/image generator script (example): `packages/blog-platform/scripts/generate-og-images.js`
- Adjust paths to match the workspace when invoking.

GitHub / safety rules
---------------------

- Git flow: the assistant honors the `git_flow` input (default: `direct`). If `git_flow` is `branch`, the assistant creates a feature branch named `posts/<slug>`; if `git_flow` is `direct`, it will push directly to the target branch (commonly `main`).
- Pushing to protected branches or performing network operations requires appropriate permissions; `confirm` is optional and not required for push operations.
- Require an accessible GitHub token in environment (default env var names: `GITHUB_TOKEN` or `AAH_CLI_GITHUB_TOKEN`) for remote operations.
- If `create_pr` is true and `git_flow` is `branch`, open a Pull Request using the repo's default PR flow and return the PR URL.
- Run build/index update scripts before pushing only if `run_build` is set to `true`.

MCP tool mapping (optional)
---------------------------

If exposed as an MCP tool, implement one RPC endpoint:

- POST `/mcp/aah-cli/create_post`
  - Request JSON: same as Inputs schema above
  - Response JSON: `{ plan, files, git_commands, artifacts, result, errors }`

Example invocations
-------------------

- Dry run (generate files, no push):

  `/cli title:"My New Post" tags:"release,blog" style:"concise" dry_run:true`

- Publish (create branch, push, open PR):

  `/cli title:"Release Notes v1.2" publish:true branch:"feature/release-notes" dry_run:false confirm:true`

Ambiguities / Questions (please confirm)
--------------------------------------

- Preferred posts directory (default used: `packages/blog-platform/posts/`). Confirm or provide a different path.
- Preferred Git flow: create PR (default) or push directly to `main`? Confirm.
- Where should the GitHub token be read from? (env var name; default `GITHUB_TOKEN`).
- Should the prompt run local build/test scripts before pushing? If yes, provide script path(s).

Iteration guidance
------------------

1. Draft: assistant generates a `dry_run` plan + file previews.
2. Review: user inspects generated markdown and approves changes.
3. Execute: with `dry_run:false` and `confirm:true`, assistant returns the exact commands to run and (optionally) runs them if allowed by the environment or an external runner.

Notes for integrators
--------------------

- Keep `dry_run:true` as default to avoid accidental pushes.
- For automation, set `AAH_CLI_AUTOMATED=true` and provide a scoped `AAH_CLI_GITHUB_TOKEN` in CI secrets.
- When implementing the MCP shim, validate the payload and return structured errors rather than free text so callers can programmatically react.

Next steps
----------

- Confirm the default posts path, preferred Git flow, and token location and I will update the prompt accordingly or run a dry run to generate a sample post.
