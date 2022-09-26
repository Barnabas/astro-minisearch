import type { HastNode } from "hast-util-to-text";
import { Options as MiniSearchOptions } from "minisearch";

// from withastro/astro/packages/astro-rss/src/index.ts
export type GlobResult = Record<string, () => Promise<{ [key: string]: any }>>;

export interface AstroVFile {
  data: { astro: { frontmatter: Record<string, any> } };
}

export type AstroRehypePlugin = (tree: HastNode, file: AstroVFile) => void;

export type PlaintextPluginOptions = {
  /** Frontmatter property to store plain text output, default "plainText". */
  contentKey?: string;

  /** If true, strip emoji out of text */
  removeEmoji?: boolean;

  /** Tags to consider headings and make separate search documents.
   * Default = ["h2", "h3"]
   */
  headingTags?: string[]; 
};

export type SearchIndexOptions = MiniSearchOptions<SearchDocument>;

export type Frontmatter = {
  title: string;
};

export type SearchDocument = {
  url?: string;
  title: string;
  text: string;
};
