import { test } from "uvu";
import * as assert from "uvu/assert";
import { getDocuments } from "../src";

test("getDocuments", async () => {
    const title = "Test"
  const docs = await getDocuments([
    { title, url: "test1", heading: "Heading A", text: "Text 1" },
    { title, url: "test1", heading: "Heading B", text: "Text 2" },
    { title, url: "test1", heading: "Heading B", text: "Text 3" },
    { title, url: "test2", heading: "Heading B", text: "Text 4" },
  ]);

  assert.is(docs.length, 4);
  assert.is(docs[0].url, "test1#heading-a");
  assert.is(docs[1].url, "test1#heading-b");
  assert.is(docs[2].url, "test1#heading-b-1");
  assert.is(docs[3].url, "test2#heading-b");
});

test.run();
