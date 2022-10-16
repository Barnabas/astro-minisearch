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
In that file, import the `getSearchIndex` function and call the function like this:

```js
import { getSearchIndex } from "@barnabask/astro-minisearch";

export const get = () => getSearchIndex(import.meta.glob(`./**/*.md*`));
```

The `getSearchIndex` function takes two arguments.
The first argument can be either an `import.meta.glob` result or an array of documents.
The second optional argument is [the MiniSearch options](https://lucaong.github.io/minisearch/modules/_minisearch_.html#options).

If instead of the glob method you want to manually specify an array of documents to index,
be sure to specify a `url`, `title`, and `text` field for each item.
A similar example to above:

```js
import { getSearchIndex } from "@barnabask/astro-minisearch";
const postImportResult = import.meta.glob('../posts/**/*.md', { eager: true });
const posts = Object.values(postImportResult);

export const get = () => getSearchIndex(
  posts.map((post) => ({
    url: post.url,
    title: post.frontmatter.title,
    text: post.frontmatter.plainText,
  }))
);
```

This was meant to feel familiar to people with experience with [`@astro/rss`](https://docs.astro.build/en/guides/rss/).

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
