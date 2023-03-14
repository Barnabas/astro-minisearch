import MiniSearch from "minisearch";
import type { EndpointOutput } from "astro";
import { SearchDocument, SearchIndexOptions } from "./types.js";

const optionDefaults: SearchIndexOptions = {
  idField: "url",
  fields: ["title", "heading", "text"],
  storeFields: ["title", "heading"],
};

/** 
 * Represents all possible acceptable inputs for the search documents functions.
 * This includes an array or nested array of search documents, 
 * as well as a promise or array of promises that resolve to an array of search documents.  
 */
export type SearchDocumentsInput =
  | SearchDocument[]
  | SearchDocument[][]
  | Promise<SearchDocument[]>
  | Promise<SearchDocument[]>[];

/** 
 * Unravels all possible search inputs and resolve them to a simple array of search documents.
 * Also removes documents with duplicate or missing URLs and outputs a warning.
 */
export async function getDocuments(
  input: SearchDocumentsInput
): Promise<SearchDocument[]> {
  let documents: SearchDocument[] = [];
  if (Array.isArray(input)) {
    documents = (await Promise.all(input)).flat(2);
  } else {
    // single promise: Promise<SearchDocument[]>
    documents = (await input);
  }

  const docsMap = new Map<string, SearchDocument>();
  let [missing, duplicate] = [0, 0];
  documents.forEach((doc) => {
    if (typeof doc.url !== "string") {
      missing++;
    } else if (docsMap.has(doc.url)) {
      duplicate++;
    } else {
      docsMap.set(doc.url, doc);
    }
  });
  if (docsMap.size < documents.length) {
    console.warn(
      `WARNING: ${duplicate} duplicate URLs and ${missing} missing URLs in search index.`
    );
  }
  return Array.from(docsMap.values());
}

/**
 * Generate the MiniSearch object from a list of prepared search documents.
 * 
 * @param documentsInput search documents or promises from other functions
 * @param options search index options
 * @returns a populated MiniSearch object
 */
export async function generateIndex(
  documentsInput: SearchDocumentsInput,
  options?: SearchIndexOptions
): Promise<MiniSearch> {
  const docs = await getDocuments(documentsInput);
  const opts: SearchIndexOptions = { ...optionDefaults, ...options };
  const miniSearch = new MiniSearch(opts);
  miniSearch.addAll(docs);
  return miniSearch;
}

/** Load a MiniSearch object from a string or JSON object. */
export function loadIndex(json: string | any, options?: SearchIndexOptions) {
  const opts: SearchIndexOptions = { ...optionDefaults, ...options };
  if (typeof json === "string") {
    return MiniSearch.loadJSON(json, opts);
  }
  return MiniSearch.loadJS(json, opts);
}

/** 
 * Helper function to both generate an index and output a static endpoint. 
 * @see [Astro docs on static endpoints]()
*/
export async function getSearchIndex(
  documentsInput: SearchDocumentsInput,
  options?: SearchIndexOptions
): Promise<EndpointOutput> {
  const index = await generateIndex(documentsInput, options);

  return { body: JSON.stringify(index) };
}
