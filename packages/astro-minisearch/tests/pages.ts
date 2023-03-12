import { test } from "uvu";
import * as assert from "uvu/assert";
import { pagesGlobToDocuments, pageToDocuments } from "../src";
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
    "abc.md": async () => ({
      url: "/abc",
      frontmatter: { title: "letters", txt: "bye" },
    }),
  };

  const docs = await pagesGlobToDocuments(fakeGlobResult, {
    contentKey: "txt",
  });
  assert.is(docs.length, 1);
  assert.is(docs[0].url, "/abc");
  assert.is(docs[0].title, "letters");
  assert.is(docs[0].text, "bye");
});

test("pageToDocuments", () => {
  const contentKey = "plainText";
  const page = {
    url: "/xyz",
    frontmatter: {
      title: "XYZ",
      [contentKey]: [
        ["", "This is the top"],
        ["Section", "Here is section 1"],
        ["Section", "Here is section 2"],
      ],
    },
  };

  const docs = pageToDocuments(page, contentKey);
  assert.is(docs.length, 3);
  assert.is(docs[0].url, "/xyz");
  assert.is(docs[0].title, "XYZ");
  assert.is(docs[0].text, "This is the top");
  assert.is(docs[1].url, "/xyz#section");
  assert.is(docs[2].url, "/xyz#section-1");
});

test.run();
