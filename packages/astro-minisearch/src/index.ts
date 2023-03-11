import type { EndpointOutput } from "astro";
import Slugger from "github-slugger";

import { plainTextPlugin } from "./plain-text-plugin.js";
import { pagesGlobToDocuments } from "./pages";
import { generateIndex, loadIndex } from "./search-index.js";
import {
  SearchDocument,
  GlobResult,
  SearchIndexOptions,
  PluginOptions,
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
  options?: PluginOptions
): Promise<SearchDocument[]> {
  let documents: SearchDocument[] = [];
  if(isGlobResult(items)) {
    documents = await pagesGlobToDocuments(items, options);
  } else {
    documents = await items;
  }
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
  options?: SearchIndexOptions & PluginOptions
): Promise<EndpointOutput> {
  const documents = await getDocuments(items, options);
  const index = generateIndex(documents, options);

  return { body: JSON.stringify(index) };
}

export { generateIndex, loadIndex, plainTextPlugin, pagesGlobToDocuments };
