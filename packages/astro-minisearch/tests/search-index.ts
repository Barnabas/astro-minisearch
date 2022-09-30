import { test } from "uvu";
import * as assert from "uvu/assert";
import { generateIndex } from "../src/search-index";

test("generateIndex", () => {
  assert.type(generateIndex, "function");
  const index = generateIndex([]);
  assert.is(index.documentCount, 0);
});

test("search", () => {
  const title = "Test Title";

  const index = generateIndex([
    { title, url: "test1", text: "introduction paragraph here" },
    { title, url: "test1#first-a", heading: "First A", text: "Text one" },
    { title, url: "test1#second-b", heading: "Second B", text: "Text two" },
    { title, url: "test1#third-c", heading: "Third C", text: "Text three" },
    { title, url: "test2#first-a", heading: "First A", text: "Text one 111" },
    { title, url: "test2#second-b", heading: "Second B", text: "Text two 222" },
    { title, url: "test2#third-c", heading: "Third C", text: "Text three 333" },
  ]);

  const result1 = index.search("one");
  assert.is(result1.length, 2, "text should have results");
  assert.is(result1[0].id, "test1#first-a");
  assert.is(result1[1].id, "test2#first-a");

  const result2 = index.search("first");
  assert.is(result2.length, 2, "heading should have results");
  assert.is(result2[0].id, "test1#first-a");
  assert.is(result2[1].id, "test2#first-a");

  const result3 = index.search("title");
  assert.ok(result3.length > 1, "title should have results");

  const result4 = index.search("aardvark");
  assert.ok(result4.length === 0, "should have no results");
});

test.run();
