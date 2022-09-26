import { test } from "uvu";
import * as assert from "uvu/assert";
import { fromHtml } from "hast-util-from-html";
import { toPlaintextTree } from "../src/plain-text-plugin";

const opts = { headingTags: ["h2", "h3"] };

test("toContentTree is a function", () => {
  assert.type(toPlaintextTree, "function");
});

test("output tree when headings found", () => {
  const doc = fromHtml(
    `<p>This is text at the top</p>
    <h2>Heading A</h2>
    <p>Text under A</p>
    <h3>Heading B</h3>
    <p>Text under B</p>
    <h4>Heading C</h4>
    <p>Text under C</p>
    `,
    { fragment: true }
  );

  const tree = toPlaintextTree(doc, opts);
  assert.is(Object.keys(tree).length, 3);
  assert.is(tree[""], "This is text at the top");
  assert.is(tree["heading-a"], "Heading A Text under A");
  assert.is(tree["heading-b"], "Heading B Text under B Heading C Text under C");
});

test("output string when no headings", () => {
  const doc = fromHtml(
    `<p>Paragraph 1</p>
    <p> <strong>Paragraph 2</strong></p>
    <p>
      Paragraph      3
    </p>`,
    { fragment: true }
  );

  const text = toPlaintextTree(doc, opts);
  assert.is(text, "Paragraph 1 Paragraph 2 Paragraph 3");
});

test("remove or keep emoji", () => {
  const doc = fromHtml(`<p>Emoji (⌚ 🧑‍🚀 ✅)</p>`, { fragment: true });

  const text1 = toPlaintextTree(doc, { removeEmoji: true });
  assert.is(text1, "Emoji ( )");

  const text2 = toPlaintextTree(doc, { removeEmoji: false });
  assert.is(text2, "Emoji (⌚ 🧑‍🚀 ✅)");
});

test.run();
