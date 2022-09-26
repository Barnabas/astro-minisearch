import MiniSearch, { AsPlainObject } from "minisearch";

import { SearchDocument, SearchIndexOptions } from "./types.js";

const defaultOptions: SearchIndexOptions = {
  idField: "url",
  fields: ["title", "text"],
  storeFields: ["title"],
};


export function generateIndex(
  items: SearchDocument[],
  options?: SearchIndexOptions
): MiniSearch {
  const opts: SearchIndexOptions = { ...defaultOptions, ...options };
  const miniSearch = new MiniSearch(opts);
  miniSearch.addAll(items);
  return miniSearch;
}

export function loadIndex(json: AsPlainObject, options?: SearchIndexOptions) {
  const opts: SearchIndexOptions = { ...defaultOptions, ...options };
  return MiniSearch.loadJS(json, opts);
}
