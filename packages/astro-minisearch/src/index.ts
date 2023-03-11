import type { EndpointOutput } from "astro";

import { plainTextPlugin } from "./plain-text-plugin.js";
import { pagesGlobToDocuments } from "./pages";
import { generateIndex, loadIndex } from "./search-index.js";
import { SearchDocument, SearchIndexOptions } from "./types.js";
import { collectionToDocuments } from "./collections.js";

export async function getSearchIndex(
  documents: SearchDocument[],
  options?: SearchIndexOptions
): Promise<EndpointOutput> {
  const index = generateIndex(documents, options);

  return { body: JSON.stringify(index) };
}

export {
  collectionToDocuments,
  generateIndex,
  loadIndex,
  pagesGlobToDocuments,
  plainTextPlugin,
};
