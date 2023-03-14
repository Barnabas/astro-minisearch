import { Options as MiniSearchOptions } from "minisearch";
import { z } from "zod";

// from withastro/astro/packages/astro-rss/src/index.ts
const globResultValidator = z.record(z.function().returns(z.promise(z.any())));

export type GlobResult = z.infer<typeof globResultValidator>;

export type PluginOptions = z.infer<typeof pluginOptionValidator>;

/** Plugin options [Zod](https://zod.dev/) schema */
export const pluginOptionValidator = z.object({
  /** 
   * Frontmatter property to store plain text output
   * @default "plainText". 
   */
  contentKey: z.string().default("plainText"),

  /** 
   * Strip emoji out of text 
   * @default true
   */
  removeEmoji: z.boolean().default(true),

  /** 
   * Tags to consider headings and make separate search documents.
   * @default ["h2", "h3"]
   */
  headingTags: z.array(z.string()).default(["h2", "h3"]),
});

/** @see [MiniSearch API](https://lucaong.github.io/minisearch/modules/_minisearch_.html#searchoptions-1) */
export type SearchIndexOptions = MiniSearchOptions<SearchDocument>;

/** 
 * Represents a search document that will be given to the indexer. 
 * Although called "document", it's more of the content for one destination.
 * For example, it may only the single section of a document.
*/
export type SearchDocument = {
  url?: string;
  heading?: string;
  title: string;
  text: string;
};

/** Internal type for assembling document sections  */
export type Section = { heading: string; text: string };

/**
 * ContentEntry class to match the one in "astro:content", 
 * which we can't access outside of an Astro project.
 */
export type ContentEntry = {
  slug: string;
  render: () => Promise<{
    headings: {
      depth: number;
      slug: string;
      text: string;
    }[];
    remarkPluginFrontmatter: Record<string, any>;
  }>;
}
