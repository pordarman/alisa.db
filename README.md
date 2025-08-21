## [![Alisa Logo](https://i.hizliresim.com/aug2sp9.png)](https://www.npmjs.com/package/alisa.db/)


[![Package Name](https://img.shields.io/badge/Package%20name-alisa.db-red)](https://www.npmjs.com/package/alisa.db/)
[![Package size](https://img.shields.io/bundlejs/size/alisa.db?label=Package%20size)](https://www.npmjs.com/package/alisa.db/)
[![Version](https://img.shields.io/npm/v/alisa.db.svg?label=Package%20version)](https://www.npmjs.com/package/alisa.db/)
[![License](https://img.shields.io/npm/l/alisa.db.svg?label=License)](https://www.npmjs.com/package/alisa.db/)

[![NPM](https://nodei.co/npm/alisa.db.png?downloads=true)](https://www.npmjs.com/package/alisa.db/)

# Source file

- [alisa.db](https://github.com/pordarman/alisa.db)

<br>

# Creator(s)

- [Ali (Fearless Crazy)](https://github.com/pordarman)

<br>

# Social media accounts

- Ali: [Instagram](https://www.instagram.com/ali.celk/) - [Discord](https://discord.com/users/488839097537003521) - [Spotify](https://open.spotify.com/user/215jixxk4morzgq5mpzsmwwqa?si=41e0583b36f9449b)

<br>

# How to download?

- First we create a [node.js](https://nodejs.org/en/) file (If you have not downloaded [node.js](https://nodejs.org/en/) to computer before, you can download node.js by [clicking here](https://nodejs.org/en/))

- Then we open the PowerShell terminal by "shift + right click" on the folder of the file you created.

![Opening the PowerShell terminal](https://i.hizliresim.com/gbwgora.png)

- Then we write **npm i alisa.db** and press enter.

![Download the alisa.db module](https://i.hizliresim.com/sqavkev.png)

- And now we have downloaded the **alisa.db** module, congratulations 🎉🎉



<br>

# alisa.db
A blazing-fast, feature-rich and fully customizable local JSON database module for Node.js projects.

## 📦 Installation
```bash
npm install alisa.db
```

## ✨ Features
- Type-safe, event-driven architecture
- Built-in cache support for better performance
- Auto write functionality (or manual save via `.writeAll()`)
- Full support for multiple files
- Rich utility methods: CRUD, math ops, array ops, filter/search, etc.
- Built-in event system: `.on()`, `.off()`, `.emit()`
- TypeScript & ESM support (types included)

---

## 🚀 Getting Started

### Initialization
```js
const AlisaDB = require("alisa.db");

// Using string
const db = new AlisaDB("database.json");

// Using config object
const db = new AlisaDB("data.json", {
  autoWrite: true,
  cache: true,
  spaces: 2
});
```

### CRUD Operations
```js
db.set("username", "Fearless");
db.get("username"); // "Fearless"
db.has("username"); // true
db.delete("username");
db.get("username", "Anonymous"); // default fallback
```

### Bulk Operations
```js
db.setMany({ x: 1, y: 2, z: 3 });
db.getMany(["x", "z"]); // { x: 1, z: 3 }
db.deleteMany(["x", "y"]);
db.deleteAll();
```

### Array Utilities
```js
db.push("roles", "admin");
db.pushAll("roles", ["mod", "dev"]);
db.pop("roles");
db.unshift("roles", "founder");
db.shift("roles", 2);
```

### Mathematical Modifiers
```js
db.set("coins", 100);
db.add("coins", 50);
db.substr("coins", 30);
db.multi("coins", 2);
db.division("coins", 4);
```

### Advanced Queries
```js
db.find((key, value) => value === "admin");
db.filter((key, value) => typeof value === "number");
db.findAndDelete((k, v) => v === 0);
db.filterAndDelete((k, v) => k.startsWith("temp"), 3);
```

### Introspection & Export
```js
db.toJSON();     // Full object
db.toArray();    // Object.entries()
db.keys();       // All keys
db.values();     // All values
db.typeof("roles"); // "array"
```

### File Management
```js
db.clone("backup.json");
db.reset();
db.destroy();
db.create("newfile.json", { hello: "world" }, true);
```

---

## 📡 Event System

AlisaDB provides a fully extensible event system. Every change, read, write, or delete operation can trigger a custom listener.

You can track nearly everything:
```js
db.on("get", ({ key, value }) => console.log("Accessed", key, value));
db.on("delete", ({ key }) => console.warn("Deleted:", key));
```

This is very useful for:
- Debugging database activity
- Logging or auditing file changes
- Reacting to specific state changes (e.g. auto-backup on set)

All listener callbacks receive an object with contextual information. For example:
```js
{
  fileName: "db.json",
  file: { /* The file */ },
  key: "userId",
  value: "Storme",
  isFound: true,
  rawData: "Storme"
}
```
You can listen to any change happening in the database:
```js
db.on("set", ({ key, value }) => {
  console.log(`Set ${key} =`, value);
});

db.set("user", "Ali"); // triggers the above listener
```

Remove listeners with:
```js
const fn = console.log;
db.on("delete", fn);
db.off("delete", fn);
```

Supported events: `set`, `get`, `delete`, `push`, `add`, `writeFile`, `writeCache`, `reset`, `destroy`, `clone`, `create`, etc.

---

## 💾 Auto Write & Cache
```js
const db = new AlisaDB("database.json", { autoWrite: true, cache: true });

// Or manually save changes to disk:
db.writeAll();
```

---

## 🧩 Multi-file support
```js
db.set("greeting", "hello", "english.json");
db.set("greeting", "merhaba", "turkish.json");
```

You can manage unlimited JSON files via `fileName` parameters.

---

## 🔧 Utility Methods
```js
db.has("key");
db.hasAny(["k1", "k2"]);
db.hasAll(["k1", "k2"]);
db.getMany(["k1", "k2"]);
db.getFromValue("Ali");
db.filter((k, v) => typeof v === "number");
```

---

<br>

# And finally

- If you want to support this module, if you request me on [github](https://github.com/pordarman), I will be happy to help you.

- Thank you for reading this far, i love you 💗

- See you in my next modules!

<br>

![lovee](https://gifdb.com/images/high/drake-heart-hands-aqm0moab2i6ocb44.webp)
