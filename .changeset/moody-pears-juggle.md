---
"@barnabask/astro-minisearch": major
---

Index Astro v2 content collections.

A new addition to Astro v2 is [content collections].
Now you can index content collections alongside the traditional page-based routes.
Unlike pages, content collections don't have a URL so you have to supply the content root URL.
The [README](/packages/astro-minisearch/README.md) and demo has been updated with examples.

[content collections]: https://docs.astro.build/en/guides/content-collections/

### Potentially breaking changes

* The MiniSearch library was updated to v6.
* The function `getDocuments` was removed because it was incompatible with content collections.
* The arguments to the function `getSearchIndex` have changed.
  In the past it was possible to pass in either `import.meta.glob` output or search documents,
  but now it only allows a simple array of search documents and requires conversion functions.
* The internal function `mapGlobResult` has been renamed to `pagesGlobToDocuments` and exposed.
* Now using Zod for options and page frontmatter validation, which may result in new behavior.
