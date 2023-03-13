import MiniSearch from "minisearch";
import type { EndpointOutput } from "astro";
import { SearchDocument, SearchIndexOptions } from "./types.js";

const optionDefaults: SearchIndexOptions = {
  idField: "url",
  fields: ["title", "heading", "text"],
  storeFields: ["title", "heading"],
};

type SearchDocumentsInput =
  | SearchDocument[]
  | SearchDocument[][]
  | Promise<SearchDocument[]>
  | Promise<SearchDocument[]>[];

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

  // remove docs with missing or duplicate URLs
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

export function loadIndex(json: string | any, options?: SearchIndexOptions) {
  const opts: SearchIndexOptions = { ...optionDefaults, ...options };
  if (typeof json === "string") {
    return MiniSearch.loadJSON(json, opts);
  }
  return MiniSearch.loadJS(json, opts);
}

export async function getSearchIndex(
  documentsInput: SearchDocumentsInput,
  options?: SearchIndexOptions
): Promise<EndpointOutput> {
  const index = await generateIndex(documentsInput, options);

  return { body: JSON.stringify(index) };
}
