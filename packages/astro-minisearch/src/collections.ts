import { ContentEntry, SearchDocument, Section } from "./types";

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
