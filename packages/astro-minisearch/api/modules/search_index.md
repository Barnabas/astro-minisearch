[Astro MiniSearch](../README.md) / search-index

# Module: search-index

## Table of contents

### Type Aliases

- [SearchDocumentsInput](search_index.md#searchdocumentsinput)

### Functions

- [generateIndex](search_index.md#generateindex)
- [getDocuments](search_index.md#getdocuments)
- [getSearchIndex](search_index.md#getsearchindex)
- [loadIndex](search_index.md#loadindex)

## Type Aliases

### SearchDocumentsInput

Ƭ **SearchDocumentsInput**: [`SearchDocument`](types.md#searchdocument)[] \| [`SearchDocument`](types.md#searchdocument)[][] \| `Promise`<[`SearchDocument`](types.md#searchdocument)[]\> \| `Promise`<[`SearchDocument`](types.md#searchdocument)[]\>[]

Represents all possible acceptable inputs for the search documents functions.
This includes an array or nested array of search documents, 
as well as a promise or array of promises that resolve to an array of search documents.

## Functions

### generateIndex

▸ **generateIndex**(`documentsInput`, `options?`): `Promise`<`MiniSearch`\>

Generate the MiniSearch object from a list of prepared search documents.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `documentsInput` | [`SearchDocumentsInput`](search_index.md#searchdocumentsinput) | search documents or promises from other functions |
| `options?` | [`SearchIndexOptions`](types.md#searchindexoptions) | search index options |

#### Returns

`Promise`<`MiniSearch`\>

a populated MiniSearch object

___

### getDocuments

▸ **getDocuments**(`input`): `Promise`<[`SearchDocument`](types.md#searchdocument)[]\>

Unravels all possible search inputs and resolve them to a simple array of search documents.
Also removes documents with duplicate or missing URLs and outputs a warning.

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`SearchDocumentsInput`](search_index.md#searchdocumentsinput) |

#### Returns

`Promise`<[`SearchDocument`](types.md#searchdocument)[]\>

___

### getSearchIndex

▸ **getSearchIndex**(`documentsInput`, `options?`): `Promise`<`EndpointOutput`\>

Helper function to both generate an index and output a static endpoint.

**`See`**

[Astro docs on static endpoints]()

#### Parameters

| Name | Type |
| :------ | :------ |
| `documentsInput` | [`SearchDocumentsInput`](search_index.md#searchdocumentsinput) |
| `options?` | [`SearchIndexOptions`](types.md#searchindexoptions) |

#### Returns

`Promise`<`EndpointOutput`\>

___

### loadIndex

▸ **loadIndex**(`json`, `options?`): `MiniSearch`<[`SearchDocument`](types.md#searchdocument)\>

Load a MiniSearch object from a string or JSON object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `any` |
| `options?` | [`SearchIndexOptions`](types.md#searchindexoptions) |

#### Returns

`MiniSearch`<[`SearchDocument`](types.md#searchdocument)\>
