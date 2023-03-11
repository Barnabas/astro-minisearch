import { test } from "uvu";
import * as assert from "uvu/assert";
import { pagesGlobToDocuments } from "../src";
import { GlobResult } from "../src/types";

test("pagesGlobToDocuments defaults", async () => {
  const fakeGlobResult: GlobResult = {
    "index.md": async () => ({
      url: "",
      frontmatter: { title: "home", plainText: "hi" },
    }),
  };

  const docs = await pagesGlobToDocuments(fakeGlobResult);
  assert.is(docs.length, 1);
  assert.is(docs[0].url, "");
  assert.is(docs[0].title, "home");
  assert.is(docs[0].text, "hi");
});

test("pagesGlobToDocuments options", async () => {
  const fakeGlobResult: GlobResult = {
    "index.md": async () => ({
      url: "",
      frontmatter: { title: "home", txt: "hi" },
    }),
  };

  const docs = await pagesGlobToDocuments(fakeGlobResult, {
    contentKey: "txt",
  });
  assert.is(docs.length, 1);
  assert.is(docs[0].url, "");
  assert.is(docs[0].title, "home");
  assert.is(docs[0].text, "hi");
});

test.run();
