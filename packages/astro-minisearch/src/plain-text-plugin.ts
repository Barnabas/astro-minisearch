import { HastNode, HastElement, toText } from "hast-util-to-text";
import { visit } from "unist-util-visit";
import EmojiRegex from "emoji-regex";
import Slugger from "github-slugger";

import {
  AstroRehypePlugin,
  GlobResult,
  PlaintextPluginOptions,
  SearchDocument,
} from "./types.js";

const defaultOptions = {
  contentKey: "plainText",
  removeEmoji: true,
  headingTags: ["h2", "h3"],
};

const emojiRegex = EmojiRegex();

export async function mapGlobResult(
  items: GlobResult,
  options?: PlaintextPluginOptions
): Promise<SearchDocument[]> {
  const documents: SearchDocument[] = [];
  const opts: PlaintextPluginOptions = { ...defaultOptions, ...options };
  const contentKey = opts.contentKey || defaultOptions.contentKey;

  await Promise.all(
    Object.values(items).map(async (getInfo) => {
      const { url, frontmatter } = await getInfo();

      // Make sure the result of glob is the right shape
      if (!url) throw new Error("missing url");
      if (!frontmatter) throw new Error("missing frontmatter");

      const { [contentKey]: textData, ...other } = frontmatter;
      let texts: [string | null, string][];

      if (!textData) {
        return;
      } else if (typeof textData === "string") {
        // if plain text was a simple string, treat like an object with null key
        texts = [[null, textData]];
      } else {
        // output a separate search document for each key
        texts = Object.entries<string>(textData);
      }

      const newDocs: SearchDocument[] = texts.map(([headingId, text]) => {
        return {
          url: headingId ? [url, headingId].join("#") : url,
          text,
          ...other,
        };
      });
      documents.push(...newDocs);
    })
  );
  return documents;
}

/* As of Astro v1.3.0, rehype plugins do not yet have a document tree with headings that have IDs. 
  As far as we're concerned, the internal function rehypeCollectHeadings (in 
  astro/packages/markdown/remark/src/rehype-collect-headings.ts) has not run yet, so we have to use
  github-slugger here and hope it ends up being the same.
*/

export function toPlaintextTree(
  tree: HastNode,
  options: PlaintextPluginOptions
): Record<string, string> | string {
  const headingTags = options.headingTags || [];
  const output: Record<string, string> = {};
  const slugger = new Slugger();
  const whitespaceRegex = /\s\s+/g;
  let key = "";

  visit(tree, ["element", "text"], (node) => {
    if (node.type === "element") {
      const el = node as HastElement;
      if (headingTags.includes(el.tagName)) {
        key = slugger.slug(toText(node));
      }
    } else if (node.type === "text" && node.value.trim().length > 0) {
      if (output[key] === undefined) {
        output[key] = "";
      } else {
        output[key] += " ";
      }

      let text = toText(node);
      if(options.removeEmoji) text = text.replace(emojiRegex, "");
      output[key] += text.replace(whitespaceRegex, " ");
    }
  });

  return key === "" ? output[""] : output;
}

export function plainTextPlugin(options?: PlaintextPluginOptions) {
  const opts: PlaintextPluginOptions = { ...defaultOptions, ...options };
  const contentKey = opts.contentKey || defaultOptions.contentKey;

  return function plugin(): AstroRehypePlugin {
    return (tree: HastNode, { data }) => {
      if (!data || !data.astro || !data.astro.frontmatter) return;
      const frontmatter = data.astro.frontmatter;
      if (frontmatter[contentKey] === undefined) {
        frontmatter[contentKey] = toPlaintextTree(tree, opts);
      }
    };
  };
}
