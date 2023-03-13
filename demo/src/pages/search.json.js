import { getCollection } from "astro:content";
import {
  getSearchIndex,
  pagesGlobToDocuments,
  collectionToDocuments,
} from "@barnabask/astro-minisearch";

// make sure this route is static even if SSR is enabled
export const prerender = true;

export async function get() {
  // output a combined search index of pages and a content collection
  return await getSearchIndex([
    pagesGlobToDocuments(import.meta.glob(`./**/*.md*`)),
    collectionToDocuments(getCollection("blog"), "/blog/"),
  ]);
}
