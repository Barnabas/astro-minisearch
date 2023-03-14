[Astro MiniSearch](../README.md) / collections

# Module: collections

## Table of contents

### Functions

- [collectionToDocuments](collections.md#collectiontodocuments)

## Functions

### collectionToDocuments

▸ **collectionToDocuments**(`collection`, `baseUrl?`): `Promise`<[`SearchDocument`](types.md#searchdocument)[]\>

Converts an Astro content collection to an array of [SearchDocument](types.md#searchdocument)s.
Generally the first argument will be the output of
[`getCollection`](https://docs.astro.build/en/reference/api-reference/#getcollection).

**`Example`**

```ts
collectionToDocuments(getCollection("blog"), "/blog/");
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `collection` | [`ContentEntry`](types.md#contententry)[] \| `Promise`<[`ContentEntry`](types.md#contententry)[]\> | `undefined` | a content collection or a promise that will resolve to one |
| `baseUrl` | `string` | `""` | the absolute URL for the root of the collection when output |

#### Returns

`Promise`<[`SearchDocument`](types.md#searchdocument)[]\>
