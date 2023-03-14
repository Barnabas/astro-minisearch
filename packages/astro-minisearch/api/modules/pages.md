[Astro MiniSearch](../README.md) / pages

# Module: pages

## Table of contents

### Functions

- [pagesGlobToDocuments](pages.md#pagesglobtodocuments)

## Functions

### pagesGlobToDocuments

▸ **pagesGlobToDocuments**(`pages`, `options?`): `Promise`<[`SearchDocument`](types.md#searchdocument)[]\>

Converts glob output of static pages to an array of [SearchDocument](types.md#searchdocument)s.

**`Example`**

```ts
pagesGlobToDocuments(import.meta.glob('./**/*.md*'));
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pages` | `Record`<`string`, (...`args`: `unknown`[]) => `Promise`<`any`\>\> | result of of [`import.meta.glob`](https://vitejs.dev/guide/features.html#glob-import) |
| `options` | `Partial`<{ `contentKey`: `string` ; `headingTags`: `string`[] ; `removeEmoji`: `boolean`  }\> | plugin options (optional) |

#### Returns

`Promise`<[`SearchDocument`](types.md#searchdocument)[]\>
