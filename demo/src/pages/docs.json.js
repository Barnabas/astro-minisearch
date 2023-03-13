import { getCollection } from "astro:content";
import {
  pagesGlobToDocuments,
  collectionToDocuments,
  getDocuments,
} from "@barnabask/astro-minisearch";

// make sure this route is static even if SSR is enabled
export const prerender = true;

export async function get() {
  // demonstrate the intermediate step of the documents to be indexed
  const body = await getDocuments([
    pagesGlobToDocuments(import.meta.glob(`./**/*.md*`)),
    collectionToDocuments(getCollection("blog"), "/blog/"),
  ]);
  return { body: JSON.stringify(body) };
}
