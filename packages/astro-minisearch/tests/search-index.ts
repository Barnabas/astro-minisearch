import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as search from "../src/search-index";

test("generateIndex", () => {
    assert.type(search.generateIndex, "function");
    const index = search.generateIndex([]);
    assert.is(index.documentCount, 0);
});

test.run();