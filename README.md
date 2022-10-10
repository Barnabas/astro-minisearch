# Astro + MiniSearch

[Astro](https://astro.build/) is a website build tool for the modern web.
[MiniSearch](https://github.com/lucaong/minisearch) is a tiny but powerful in-memory fulltext search engine that can comfortably run both in Node and in the browser.
This project is some glue between them both.

## Directory

This is a monorepo using [PNPM workspaces](https://pnpm.io/workspaces).
Here's what's inside:

- [packages/astro-minisearch](./packages/astro-minisearch/) - the main package
- [demo](./demo/): sample search using Astro docs template

## Development

This project is using [changesets](https://github.com/changesets/changesets).
For now it is manual.

### New changesets

In the root directory run `pnpm changeset`.
Answer the questions and commit temp files to the `.changeset` directory.

### Releases

From the root project directory:

1. `pnpm changeset version` - bump versions and update changelog files
2. `pnpm install` - update lockfile
3. `pnpm build`
4. `pnpm publish -r`
