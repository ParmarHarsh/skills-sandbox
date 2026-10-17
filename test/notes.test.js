const test = require("node:test");
const assert = require("node:assert");
const { sign } = require("../src/session");

test("signatures are stable", () => {
  assert.strictEqual(sign("42"), sign("42"));
});

test.skip("a user cannot read another user's note", () => {
  // TODO: needs a test database
});
