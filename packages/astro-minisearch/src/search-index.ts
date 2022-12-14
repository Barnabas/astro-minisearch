import MiniSearch from "minisearch";

import { SearchDocument, SearchIndexOptions } from "./types.js";

const defaultOptions: SearchIndexOptions = {
  idField: "url",
  fields: ["title", "heading", "text"],
  storeFields: ["title", "heading"],
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

export function loadIndex(json: string | any, options?: SearchIndexOptions) {
  const opts: SearchIndexOptions = { ...defaultOptions, ...options };
  if(typeof json === "string") {
    return MiniSearch.loadJSON(json, opts);
  }
  return MiniSearch.loadJS(json, opts);
}
