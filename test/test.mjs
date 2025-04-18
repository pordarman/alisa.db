import { deepStrictEqual, strictEqual, ok } from "assert";
import { existsSync } from "fs";
import AlisaDB from "alisa.db";

const dbFile = "__test.json";
const db = new AlisaDB(dbFile, { autoWrite: true, cache: true });

console.log("Running tests for alisa.db\n===========================");

// Clean start
db.deleteAll();
deepStrictEqual(db.toJSON(), {});

// Basic set/get
strictEqual(db.set("name", "Ali").name, "Ali");
strictEqual(db.get("name"), "Ali");
strictEqual(db.has("name"), true);
strictEqual(db.has("nonexistent"), false);

// Delete
strictEqual(db.delete("name"), "Ali");
strictEqual(db.get("name"), undefined);

// Bulk insert / getMany
const many = { a: 1, b: 2, c: 3 };
db.setMany(many);
deepStrictEqual(db.getMany(["a", "c"]), { a: 1, c: 3 });

// Math
strictEqual(db.set("count", 10).count, 10);
strictEqual(db.add("count", 5), 15);
strictEqual(db.substr("count", 3), 12);
strictEqual(db.multi("count", 2), 24);
strictEqual(db.division("count", 4), 6);

// Array ops
deepStrictEqual(db.set("list", []).list, []);
db.push("list", "a");
db.pushAll("list", ["b", "c"]);
deepStrictEqual(db.get("list"), ["a", "b", "c"]);
deepStrictEqual(db.pop("list"), ["c"]);
deepStrictEqual(db.unshift("list", "z"), ["z", "a", "b"]);
deepStrictEqual(db.shift("list", 2), ["z", "a"]);

// typeof
strictEqual(db.typeof("list"), "array");
strictEqual(db.typeof("count"), "number");

// filter/find
strictEqual(db.find((k, v) => k === "count"), 6);
deepStrictEqual(db.filter((k, v) => typeof v === "number"), { a: 1, b: 2, c: 3, count: 6 });

// Reset / Create / Destroy
deepStrictEqual(db.reset(), {});
db.create("newfile.json", { hello: "world" });
strictEqual(new AlisaDB("newfile.json").get("hello"), "world");
db.destroy("newfile.json");
strictEqual(existsSync("newfile.json"), false);

// Events
let gotSet = false;
db.on("set", ({ key }) => {
  if (key === "eventKey") gotSet = true;
});
db.set("eventKey", 42);
ok(gotSet, "Event 'set' should trigger");

// Final cleanup
db.destroy();
console.log("\n✅ All tests passed successfully!");
