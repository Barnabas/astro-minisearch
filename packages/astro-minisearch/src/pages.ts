import { z } from "zod";
import {
  GlobResult,
  PluginOptions,
  SearchDocument,
  Section,
  pluginOptionValidator,
} from "./types.js";

const infoValidator = z.object({
  url: z.string(),
  frontmatter: z
    .object({
      title: z.string(),
    })
    .passthrough(),
});

export async function pagesGlobToDocuments(
  items: GlobResult,
  options: Partial<PluginOptions> = {}
): Promise<SearchDocument[]> {
  const documents: SearchDocument[] = [];
  const opts = pluginOptionValidator.parse(options);
  const contentKey = opts.contentKey;

  await Promise.all(
    Object.values(items).map(async (getInfo) => {
      const info = infoValidator.parse(await getInfo());
      const { url, frontmatter } = info;

      const { [contentKey]: textData, title, ...other } = frontmatter;
      let sections: Section[] = [];

      if (!textData) {
        return;
      } else if (typeof textData === "string") {
        // if plain text was a simple string, treat like an object with null key
        sections = [{ heading: "", text: textData }];
      } else if (Array.isArray(textData)) {
        sections = textData.map(([heading, text]) => {
          return { heading, text };
        });
      }

      const newDocs: SearchDocument[] = sections.map(({ heading, text }) => {
        return { url, heading, title, text, ...other };
      });
      documents.push(...newDocs);
    })
  );
  return documents;
}
