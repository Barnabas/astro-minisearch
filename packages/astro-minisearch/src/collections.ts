import { ContentEntry, SearchDocument, Section } from "./types";

/**
 * Converts an Astro content collection to an array of {@link types!SearchDocument}s.
 * Generally the first argument will be the output of
 * [`getCollection`](https://docs.astro.build/en/reference/api-reference/#getcollection).

 * @param collection - a content collection or a promise that will resolve to one
 * @param baseUrl - the absolute URL for the root of the collection when output
 * 
 * @example
 * ```ts
 * collectionToDocuments(getCollection("blog"), "/blog/");
 * ``` 
 */
export async function collectionToDocuments(
  collection: ContentEntry[] | Promise<ContentEntry[]>,
  baseUrl: string = ""
): Promise<SearchDocument[]> {
  const documents: SearchDocument[] = [];

  await Promise.all(
    (await collection).map(async (entry) => {
      const { headings, remarkPluginFrontmatter: frontmatter } =
        await entry.render();
      const { plainText: textData, title, ...other } = frontmatter;
      let sections: Section[] = [];

      if (typeof textData === "string") {
        // if plain text was a simple string, treat like an object with null key
        sections = [{ heading: "", text: textData }];
      } else if (Array.isArray(textData)) {
        sections = textData.map(([heading, text]) => {
          return { heading, text };
        });
      }
      const newDocs: SearchDocument[] = sections.map(({ heading, text }) => {
        const entryUrl = new URL(baseUrl + entry.slug, "file://");
        if (heading) {
          entryUrl.hash = headings.find((h) => h.text === heading)?.slug || "";
        }
        const url = entryUrl.toString().substring(7); // strip off 'file://'
        return { url, title, heading, text, ...other };
      });
      documents.push(...newDocs);
    })
  );

  return documents;
}
