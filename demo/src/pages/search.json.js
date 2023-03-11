import { getCollection } from "astro:content";
import {
  getSearchIndex,
  pagesGlobToDocuments,
  collectionToDocuments,
} from "@barnabask/astro-minisearch";

export async function get() {
  const blogCollection = getCollection("blog");

  const [pageDocs, blogDocs] = await Promise.all([
    pagesGlobToDocuments(import.meta.glob(`./**/*.md*`)),
    collectionToDocuments(blogCollection, "/blog/"),
  ]);

  return getSearchIndex([...blogDocs, ...pageDocs]);
}
