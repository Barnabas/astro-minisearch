import { getCollection } from "astro:content";
import {
  pagesGlobToDocuments,
  collectionToDocuments,
} from "@barnabask/astro-minisearch";

export async function get() {
  const blogCollection = getCollection("blog");

  const [pageDocs, blogDocs] = await Promise.all([
    pagesGlobToDocuments(import.meta.glob(`./**/*.md*`)),
    collectionToDocuments(blogCollection, "/blog/"),
  ]);

  return { body: JSON.stringify([...blogDocs, ...pageDocs])}
}
