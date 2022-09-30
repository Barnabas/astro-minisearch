import { HastNode, HastElement, toText } from "hast-util-to-text";
import { visit } from "unist-util-visit";
import EmojiRegex from "emoji-regex";

import {
  AstroRehypePlugin,
  GlobResult,
  PlaintextPluginOptions,
  SearchDocument,
  Section,
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
        return { url, heading, text, ...other };
      });
      documents.push(...newDocs);
    })
  );
  return documents;
}

/* As of Astro v1.4.0, rehype plugins do not yet have a document tree with headings that have IDs. 
  As far as we're concerned, the internal function rehypeCollectHeadings (in 
  astro/packages/markdown/remark/src/rehype-collect-headings.ts) has not run yet.
*/

export function toPlaintextTree(
  tree: HastNode,
  options: PlaintextPluginOptions
): string[][] | string {
  const headingTags = options.headingTags || [];
  const sections: Section[] = [];
  const spaceRegex = /\s\s+/g;

  let section: Section = { heading: "", text: "" };

  function addSection() {
    let { heading, text } = section;

    if (options.removeEmoji) {
      heading = heading.replace(emojiRegex, "");
      text = text.replace(emojiRegex, "");
    }

    sections.push({
      heading: heading.replace(spaceRegex, " ").trim(),
      text: text.replace(spaceRegex, " ").trim(),
    });
  }

  visit(tree, ["element", "text"], (node) => {
    if (node.type === "element") {
      const el = node as HastElement;
      if (headingTags.includes(el.tagName)) {
        let heading = toText(node);
        if (!heading) return;
        addSection(); // add current section before starting another
        section = { heading, text: "" };
      }
    } else if (node.type === "text") {
      const text = toText(node);
      if (section.text.length > 0 || section.heading !== text) {
        section.text += text + " ";
      }
    }
  });
  addSection(); // add the last section

  const output = sections
    .filter((s) => s.text.length > 0)
    .map((s) => [s.heading, s.text]);

  // output text if only one section, no heading
  return output.length === 1 && output[0][0] === "" ? output[0][1] : output;
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
