const assert = require("assert");
const fs = require("fs");
const AlisaDB = require("alisa.db");

const dbFile = "__test.json";
const db = new AlisaDB(dbFile, { autoWrite: true, cache: true });

console.log("Running tests for alisa.db\n===========================");

// Clean start
db.deleteAll();
assert.deepStrictEqual(db.toJSON(), {});

// Basic set/get
assert.strictEqual(db.set("name", "Ali").name, "Ali");
assert.strictEqual(db.get("name"), "Ali");
assert.strictEqual(db.has("name"), true);
assert.strictEqual(db.has("nonexistent"), false);

// Delete
assert.strictEqual(db.delete("name"), "Ali");
assert.strictEqual(db.get("name"), undefined);

// Bulk insert / getMany
const many = { a: 1, b: 2, c: 3 };
db.setMany(many);
assert.deepStrictEqual(db.getMany(["a", "c"]), { a: 1, c: 3 });

// Math
assert.strictEqual(db.set("count", 10).count, 10);
assert.strictEqual(db.add("count", 5), 15);
assert.strictEqual(db.substr("count", 3), 12);
assert.strictEqual(db.multi("count", 2), 24);
assert.strictEqual(db.division("count", 4), 6);

// Array ops
assert.deepStrictEqual(db.set("list", []).list, []);
db.push("list", "a");
db.pushAll("list", ["b", "c"]);
assert.deepStrictEqual(db.get("list"), ["a", "b", "c"]);
assert.deepStrictEqual(db.pop("list"), ["c"]);
assert.deepStrictEqual(db.unshift("list", "z"), ["z", "a", "b"]);
assert.deepStrictEqual(db.shift("list", 2), ["z", "a"]);

// typeof
assert.strictEqual(db.typeof("list"), "array");
assert.strictEqual(db.typeof("count"), "number");

// filter/find
assert.strictEqual(db.find((k, v) => k === "count"), 6);
assert.deepStrictEqual(db.filter((k, v) => typeof v === "number"), { a: 1, b: 2, c: 3, count: 6 });

// Reset / Create / Destroy
assert.deepStrictEqual(db.reset(), {});
db.create("newfile.json", { hello: "world" });
assert.strictEqual(new AlisaDB("newfile.json").get("hello"), "world");
db.destroy("newfile.json");
assert.strictEqual(fs.existsSync("newfile.json"), false);

// Events
let gotSet = false;
db.on("set", ({ key }) => {
  if (key === "eventKey") gotSet = true;
});
db.set("eventKey", 42);
assert.ok(gotSet, "Event 'set' should trigger");

// Final cleanup
db.destroy();
console.log("\n✅ All tests passed successfully!");
