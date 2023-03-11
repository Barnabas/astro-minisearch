import { Root } from "hast-util-to-text/lib";
import { Options as MiniSearchOptions } from "minisearch";
import { z } from "zod";

// from withastro/astro/packages/astro-rss/src/index.ts
const globResultValidator = z.record(z.function().returns(z.promise(z.any())));
export type GlobResult =  z.infer<typeof globResultValidator>;

export interface AstroVFile {
  data: { astro: { frontmatter: Record<string, any> } };
}

export type AstroRehypePlugin = (tree: Root, file: AstroVFile) => void;

export type PluginOptions = z.infer<typeof pluginOptionValidator>;

export const pluginOptionValidator = z.object({
  /** Frontmatter property to store plain text output, default "plainText". */
  contentKey: z.string().default("plainText"),

  /** If true, strip emoji out of text */
  removeEmoji: z.boolean().default(true),

  /** Tags to consider headings and make separate search documents.
   * Default = ["h2", "h3"]
   */
  headingTags: z.array(z.string()).default(["h2", "h3"])
})

export type SearchIndexOptions = MiniSearchOptions<SearchDocument>;

export type SearchDocument = {
  url?: string;
  heading?: string;
  title: string;
  text: string;
};

// internal type for assembling document sections
export type Section = { heading: string; text: string };
