import { test } from "uvu";
import * as assert from "uvu/assert";
import { collectionToDocuments } from "../src";
import { ContentEntry } from "../src/types";

const fakeCollection: ContentEntry[] = [
    {
      slug: "123",
      render: async () => ({
        headings: [],
        remarkPluginFrontmatter: {
          title: "home",
          plainText: "hi",
        },
      }),
    },
  ];

test("collectionToDocuments sync", async () => {
  const docs = await collectionToDocuments(fakeCollection, "/abc/");
  assert.is(docs.length, 1);
  assert.is(docs[0].url, "/abc/123");
  assert.is(docs[0].title, "home");
  assert.is(docs[0].text, "hi");
});

test("collectionToDocuments async", async () => {
  const getCollection = new Promise<ContentEntry[]>((resolve) => {
    resolve(fakeCollection);
  });

  const docs = await collectionToDocuments(getCollection, "/abc/");
  assert.is(docs.length, 1);
  assert.is(docs[0].url, "/abc/123");
  assert.is(docs[0].title, "home");
  assert.is(docs[0].text, "hi");
});

test.run();
