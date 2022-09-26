import type { EndpointOutput } from "astro";

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

const getDocuments = async (
  items: SearchIndexItems,
  options?: PlaintextPluginOptions
): Promise<SearchDocument[]> => {
  return isGlobResult(items) ? mapGlobResult(items, options) : items;
};

const getSearchIndex = async (
  items: SearchIndexItems,
  options?: SearchIndexOptions & PlaintextPluginOptions
): Promise<EndpointOutput> => {
  const documents = await getDocuments(items, options);
  const index = generateIndex(documents, options);

  return { body: JSON.stringify(index) };
};

export {
  generateIndex,
  getDocuments,
  getSearchIndex,
  loadIndex,
  plainTextPlugin,
};
