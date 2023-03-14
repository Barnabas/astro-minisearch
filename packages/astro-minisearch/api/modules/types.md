[Astro MiniSearch](../README.md) / types

# Module: types

## Table of contents

### Type Aliases

- [ContentEntry](types.md#contententry)
- [GlobResult](types.md#globresult)
- [PluginOptions](types.md#pluginoptions)
- [SearchDocument](types.md#searchdocument)
- [SearchIndexOptions](types.md#searchindexoptions)
- [Section](types.md#section)

### Variables

- [pluginOptionValidator](types.md#pluginoptionvalidator)

## Type Aliases

### ContentEntry

Ƭ **ContentEntry**: `Object`

ContentEntry class to match the one in "astro:content", 
which we can't access outside of an Astro project.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `render` | () => `Promise`<{ `headings`: { `depth`: `number` ; `slug`: `string` ; `text`: `string`  }[] ; `remarkPluginFrontmatter`: `Record`<`string`, `any`\>  }\> |
| `slug` | `string` |

___

### GlobResult

Ƭ **GlobResult**: `z.infer`<typeof `globResultValidator`\>

___

### PluginOptions

Ƭ **PluginOptions**: `z.infer`<typeof [`pluginOptionValidator`](types.md#pluginoptionvalidator)\>

___

### SearchDocument

Ƭ **SearchDocument**: `Object`

Represents a search document that will be given to the indexer. 
Although called "document", it's more of the content for one destination.
For example, it may only the single section of a document.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `heading?` | `string` |
| `text` | `string` |
| `title` | `string` |
| `url?` | `string` |

___

### SearchIndexOptions

Ƭ **SearchIndexOptions**: `MiniSearchOptions`<[`SearchDocument`](types.md#searchdocument)\>

**`See`**

[MiniSearch API](https://lucaong.github.io/minisearch/modules/_minisearch_.html#searchoptions-1)

___

### Section

Ƭ **Section**: `Object`

Internal type for assembling document sections

#### Type declaration

| Name | Type |
| :------ | :------ |
| `heading` | `string` |
| `text` | `string` |

## Variables

### pluginOptionValidator

• `Const` **pluginOptionValidator**: `ZodObject`<{ `contentKey`: `ZodDefault`<`ZodString`\> ; `headingTags`: `ZodDefault`<`ZodArray`<`ZodString`, ``"many"``\>\> ; `removeEmoji`: `ZodDefault`<`ZodBoolean`\>  }, ``"strip"``, `ZodTypeAny`, { `contentKey`: `string` ; `headingTags`: `string`[] ; `removeEmoji`: `boolean`  }, { `contentKey`: `undefined` \| `string` ; `headingTags`: `undefined` \| `string`[] ; `removeEmoji`: `undefined` \| `boolean`  }\>

Plugin options [Zod](https://zod.dev/) schema
