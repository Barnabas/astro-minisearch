import { z } from "zod";
import Slugger from "github-slugger";
import {
  GlobResult,
  PluginOptions,
  SearchDocument,
  Section,
  pluginOptionValidator,
} from "./types.js";

type Page = z.infer<typeof pageValidator>;

const pageValidator = z.object({
  url: z.string(),
  frontmatter: z.record(z.any()),
});
const sluggers = new Map<string, Slugger>();

function slugifyUrl(url: string, heading?: string): string {
  if (!url || !heading || url.includes("#")) return url;
  const slugger = sluggers.get(url) || new Slugger();
  if (!sluggers.has(url)) sluggers.set(url, slugger);
  return [url, slugger.slug(heading)].join("#");
}

export function pageToDocuments(
  page: Page,
  contentKey: string
): SearchDocument[] {
  const { url, frontmatter } = page;

  const { [contentKey]: textData, title, ...other } = frontmatter;
  let sections: Section[] = [];

  if (!textData) {
    return [];
  } else if (typeof textData === "string") {
    // if plain text was a simple string, treat like an object with null key
    sections = [{ heading: "", text: textData }];
  } else if (Array.isArray(textData)) {
    sections = textData.map(([heading, text]) => {
      return { heading, text };
    });
  }

  return sections.map(({ heading, text }) => {
    return { url: slugifyUrl(url, heading), heading, title, text, ...other };
  });
}

export async function pagesGlobToDocuments(
  pages: GlobResult,
  options: Partial<PluginOptions> = {}
): Promise<SearchDocument[]> {
  const documents: SearchDocument[] = [];
  const opts = pluginOptionValidator.parse(options);
  const contentKey = opts.contentKey;

  await Promise.all(
    Object.values(pages).map(async (getInfo) => {
      const page: Page = pageValidator.parse(await getInfo());
      documents.push(...pageToDocuments(page, contentKey));
    })
  );
  return documents;
}
