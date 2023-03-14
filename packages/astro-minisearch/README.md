# @barnabask/astro-minisearch

[![@barnabask/astro-minisearch](https://img.shields.io/npm/v/@barnabask/astro-minisearch?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@barnabask/astro-minisearch)

This package adds MiniSearch support to your Astro project.
It contains a rehype plugin that helps extract text from Markdown and MDX files.
It also contains helper functions for generating  and loading a static JSON search index.

[The complete API documentation is here](./api/README.md).

## Installation

Add the package to your project:

```sh
npm install @barnabask/astro-minisearch
```

Adjust your `astro.config.*` file to add `plainTextPlugin` to `rehypePlugins` as follows:

__`astro.config.mjs`__

```js
import { defineConfig } from "astro/config";
import { plainTextPlugin } from "@barnabask/astro-minisearch";

export default defineConfig({
  site: "http://example.com",
  markdown: {
    rehypePlugins: [plainTextPlugin()]
  },
});
```

Once the plugin is installed and configured, all Markdown pages and content collections should have a new frontmatter property.
You can inspect it with Astro's [`<Debug />` component](https://docs.astro.build/en/reference/api-reference/#debug-).
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

Create a JSON endpoint file under your `src/pages/` directory named `search.json.js` or similar.
This example adds local static markdown files and two Astro content collections to a search index:

```js
import { getCollection } from "astro:content";
import {
  getSearchIndex,
  pagesGlobToDocuments,
  collectionToDocuments,
} from "@barnabask/astro-minisearch";

export async function get() {
  return await getSearchIndex([
    pagesGlobToDocuments(import.meta.glob(`./**/*.md*`)),
    collectionToDocuments(getCollection("articles"), "/articles/"),
    collectionToDocuments(getCollection("blog"), "/blog/"),
  ]);
}
```

Refer to [the API documentation](./api/README.md) for more info on
[`getSearchIndex`](./api/modules/search_index.md#getsearchindex),
[`pagesGlobToDocuments`](./api/modules/pages.md#pagesglobtodocuments), and
[`collectionToDocuments`](./api/modules/collections.md#collectiontodocuments).

## Next steps

This package is only for generating a static search index file when your Astro site is built.
To actually do the search at runtime, you'll either need some client-side JavaScript or you'll need to enable SSR and render search results on the server.

This package does provide a function called `loadIndex` as a convenience for SSR scenarios.
See the pages and endpoints in [the source code demo directory](../../demo/src/pages/) for a working example with the standard Astro blog template.

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
