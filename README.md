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
When submitting a PR, be sure to add a changeset describing the change.

### New changesets

In the root directory run `pnpm changeset`.
Answer the questions and commit temp files to the `.changeset` directory.

### Releases

Releases are automatically handled by GitHub actions whenever a PR is merged.
