import type { EndpointOutput } from "astro";
import Slugger from "github-slugger";

import { plainTextPlugin, mapGlobResult } from "./plain-text-plugin.js";
import { generateIndex, loadIndex } from "./search-index.js";
import {
  SearchDocument,
  GlobResult,
  SearchIndexOptions,
  PlaintextPluginOptions,
} from "./types.js";

type SearchIndexItems =
  | GlobResult
  | SearchDocument[]
  | Promise<SearchDocument[]>;

function isGlobResult(items: SearchIndexItems): items is GlobResult {
  return typeof items === "object" && !Array.isArray(items);
}

export async function getDocuments(
  items: SearchIndexItems,
  options?: PlaintextPluginOptions
): Promise<SearchDocument[]> {
  const documents = await (isGlobResult(items)
    ? mapGlobResult(items, options)
    : items);
  const sluggers = new Map<string, Slugger>();

  return documents.map((document) => {
    const { url, heading } = document;
    if (!url) return document;

    // add header slugs if missing
    if (heading && !url.includes("#")) {
      if (!sluggers.has(url)) sluggers.set(url, new Slugger());
      const slug = sluggers.get(url)?.slug(heading);
      return { ...document, url: [url, slug].join("#") };
    }
    return document;
  });
}

export async function getSearchIndex(
  items: SearchIndexItems,
  options?: SearchIndexOptions & PlaintextPluginOptions
): Promise<EndpointOutput> {
  const documents = await getDocuments(items, options);
  const index = generateIndex(documents, options);

  return { body: JSON.stringify(index) };
}

export { generateIndex, loadIndex, plainTextPlugin };
