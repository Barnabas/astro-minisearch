import { toText } from "hast-util-to-text";
import type { Node, Element } from "hast-util-to-text/lib";
import { visit } from "unist-util-visit";
import EmojiRegex from "emoji-regex";

import {
  AstroRehypePlugin,
  PluginOptions,
  Section,
  pluginOptionValidator,
} from "./types.js";

const emojiRegex = EmojiRegex();

export function toPlaintextTree(
  tree: Node,
  options: Partial<PluginOptions>
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
      const el = node as Element;
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

export function plainTextPlugin(options: Partial<PluginOptions> = {}) {
  const opts: PluginOptions = pluginOptionValidator.parse(options);
  const contentKey = opts.contentKey;

  return function plugin(): AstroRehypePlugin {
    return (tree: Node, { data }) => {
      if (!data || !data.astro || !data.astro.frontmatter) return;
      const frontmatter = data.astro.frontmatter;
      if (frontmatter[contentKey] === undefined) {
        frontmatter[contentKey] = toPlaintextTree(tree, opts);
      }
    };
  };
}
