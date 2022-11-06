const Database = require("./index")

let db = new Database("database.json")

console.log(db.pop("a1", 1));