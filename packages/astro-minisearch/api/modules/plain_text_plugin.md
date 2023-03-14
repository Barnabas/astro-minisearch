[Astro MiniSearch](../README.md) / plain-text-plugin

# Module: plain-text-plugin

## Table of contents

### Functions

- [plainTextPlugin](plain_text_plugin.md#plaintextplugin)

## Functions

### plainTextPlugin

▸ **plainTextPlugin**(`options?`): () => `AstroRehypePlugin`

A helper to extract plain text from rendered HTML and add it to Astro frontmatter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Partial`<{ `contentKey`: `string` ; `headingTags`: `string`[] ; `removeEmoji`: `boolean`  }\> | plugin options |

#### Returns

`fn`

a rehype plugin suitable for Astro

▸ (): `AstroRehypePlugin`

##### Returns

`AstroRehypePlugin`
