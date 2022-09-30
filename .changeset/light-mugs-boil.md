---
"@barnabask/astro-minisearch": minor
---

Refactor to include headings text in separate field

During testing, it became clear that search the search results UI needs to display the heading text.
Otherwise it's impossible to differentiate search results.

Heading IDs were previously generated by the plain text plugin.
To allow for handmade plaintext without knowing the final IDs, the format was changed from key/value pairs to array-of-arrays.
Now the heading IDs are generated by `getDocuments`.

Old version:

```yml
plainText:
  '': This is the top of the page.
  section-1: Section 1 Here is some content for section 1. 
  section-2: Section 2 Here is other text for section 2. 
```

New version:

```yml
- - ''
  - This is the top of the page
- - Section 1
  - Here is some content for section 1.
- - Section 2
  - This is other text for section 2.
```