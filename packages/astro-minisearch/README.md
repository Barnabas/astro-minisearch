# @barnabask/astro-minisearch

This package adds MiniSearch support to your Astro project.
It contains a rehype plugin that helps extract text from Markdown and MDX files.
It also contains helper functions for generating a static JSON search index.

## Installation

A more automatic installation using the Astro CLI is not yet available.
In the meantime, manual installation steps below.

Add the `astro-minisearch` package like so:

```sh
npm install @barnabask/astro-minisearch
```

### Configuring the plaintext plugin

The plaintext Rehype plugin can populate a frontmatter property of each Markdown page with a plaintext version of the the final content.
You can skip this if you want, but then you'll have to manually update the frontmatter yourself.
Adjust your `astro.config.*` file as follows:

__`astro.config.mjs`__

```js
import { defineConfig } from "astro/config";
import { plainTextPlugin } from "@barnabask/astro-minisearch";

export default defineConfig({
  site: "http://example.com",
  markdown: {
    rehypePlugins: [plainTextPlugin()],
    extendDefaultPlugins: true,
  },
});
```

Double check that you added it to `rehypePlugins` and not `remarkPlugins`.
Also be sure that you added it as a function call with parentheses like `plainTextPlugin()`, not `plainTextPlugin`.
It is possible to supply options to the plugin like this (default values shown):

```js
plainTextPlugin({
  // Frontmatter property to store plain text output.
  contentKey: "plainText";

  // If true, strip emoji out of text.
  removeEmoji: true;

  // Tags to consider headings and make separate search documents.
  headingTags: ["h2", "h3"]; 
})
```

Once the plugin is installed and configured, all of your Markdown pages should have a new frontmatter property.
You can inspect is using Astro's built in [Debug component](https://docs.astro.build/en/reference/api-reference/#debug-).
After configuring this plugin and adding the following line to your page or layout:

```jsx
<Debug {frontmatter.plainText} />
```

...you may see some output like this (obviously with your own content):

```js
[
  [
    "",
    "Welcome to Astro! This is the docs starter template...."
  ],
  [
    "Getting Started",
    "To get started with this theme, check out the README.md..."
  ]
]
```

Configuration success! Congratulations.

### Generating a search index

Create a `search.json.js` file under your `src/pages/` directory.
The output page will be called `search.json` but you can rename it or move it if you want.
Here's an example that fetches local static markdown files and two Astro content collections and then outputs a search index:

```js
import { getCollection } from "astro:content";
import {
  getSearchIndex,
  pagesGlobToDocuments,
  collectionToDocuments,
} from "@barnabask/astro-minisearch";

export async function get() {
  const articlesCollection = getCollection("articles");
  const blogCollection = getCollection("blog");

  const [articleDocs, blogDocs, pageDocs] = await Promise.all([
    pagesGlobToDocuments(import.meta.glob(`./**/*.md*`)),
    collectionToDocuments(articlesCollection, "/articles/"),
    collectionToDocuments(blogCollection, "/blog/"),
  ]);

  return getSearchIndex([...articleDocs, ...blogDocs, ...pageDocs]);
}
```

The function `pagesGlobToDocuments` converts a the output of [`import.meta.glob`] to search documents.

The function `collectionToDocuments` converts a the output of [`getCollection`] to search documents.
There are two arguments:

1. An array of [`CollectionEntry`] items, which is the resolved output of `getCollection`, and
2. The absolute root URL where the collection will be rendered

The function `getSearchIndex` outputs search index JSON and takes two arguments:

1. An array of search documents, and
2. [MiniSearch options] (optional)

If, instead of the conversion methods above, you want to manually specify an array of search documents to index,
be sure to specify at least the properties `url`, `title`, and `text` field for each item.

[`import.meta.glob`]: https://vitejs.dev/guide/features.html#glob-import
[`getCollection`]: https://docs.astro.build/en/reference/api-reference/#getcollection
[`CollectionEntry`]: https://docs.astro.build/en/reference/api-reference/#collection-entry-type
[MiniSearch options]: https://lucaong.github.io/minisearch/modules/_minisearch_.html#options

## Next steps

This package is only for generating a static search index file when your Astro site is built.
To actually do the search at runtime, you'll either need some client-side JavaScript or you'll need to enable SSR and render search results on the server.

This package does provide a function called `loadIndex` as a convenience for SSR scenarios.
Something like this should work:

__`search.astro`__

```jsx
---
import { loadIndex } from "@barnabask/astro-minisearch";
import searchData from "./search.json";

const query = Astro.url.searchParams.get("query");
let results = [];

if (query) {
  const searchIndex = loadIndex(searchData);
  results = searchIndex.search(query);
}
---
<form action="search" method="GET">
  <input type="text" name="query" />
  <button type="submit">Search</button>
</form>
<ul>
  {results.map((result) => (
    <li>
      <a href={result.url}>{result.title}</a>
    </li>
  ))}
</ul>
```

## Frontmatter

You can still generate a the search index without the plaintext plugin.
Or you may want to control the searchable content for a specific page, or prevent a page from being included in the search index later.
In those cases you should supply a `plainText` frontmatter property (or whatever property name you standardize on) manually.
The plaintext plugin will not overwrite manually specified plaintext properties.

To replace the text, you can specify the plaintext value as a string, like this:

```yml
plainText: All about the aardvark.
```

```markdown
This page is about a certain burrowing mammal native to Africa.
```

If your page has multiple sections, you can use a YAML array of arrays.
Each sub item in the list has a header first, then the rest of the text after.
The "header" for text that comes before any headers can be a blank string. For example:

```yml
plainText:
- - ''
  - This is the top of the page
- - Section 1
  - Here is some content for section 1.
- - Section 2
  - This is other text for section 2.
```

```markdown
This is the top of the page.

## Section 1

Here is some content for section 1.

## Section 2

This is other text for section 2.
```

To prevent a page from being added to the search index, set the plaintext field to false or a blank string.

```yml
plainText: false
```
