/**
 * 
 * NOTE!!! What you need to know before reading the descriptions of the commands below!!!!
 * 
 * I use the words "key" and "value" in some places while explaining what the commands do below
 * If you don't know what they mean, please see the place below or you may not understand exactly what the command does!
 * 
 * You don't need to look here if you know
 */


/**
 * Now what do we call key and value?
 * 
 * "key" and "value" only exist in an Object expression. If you hear "key" or "value" written somewhere, you should understand that it is an Object
 * 
 * Let's explain with an example
 */

 ({
    key: "value",
    anotherKey: [],
    anotherKey2: {},
    anotherKey3: "anotherValue"
})

/**
 * Here "key:", "anotherKey:", "anotherKey2:" and "anotherKey3:" are our key values. So the mixed value for the "key:" key is "value"
 * 
 * Also the value corresponding to "anotherKey2:" is {}
 * 
 * And as understood above, our "value", [], {} and "anotherValue" values are our value values
 * 
 * 
 * Now you can proceed to the following commands
 */





// First we define the alisa.db module
import alisadb from "./index.mjs" // You replace "./index.mjs" with "alisa.db"

// Then we create a new database
const Database = new alisadb({ fileName: "alisa.db.json", cache: true, autoWrite: false, spaces: 4 })

// fileName = Enter your default filename where it says fileName
// cache = Set whether to cache the file or not where it says cache
// autoWrite = Set whether to automatically print the data when you print or change a data in the file.
// spaces = Set the number of spaces between the data in the JSON file



/**
 * Main commands
 */


// This calls all key values in database.json file
Database.keys()


// This calls all the values in database.json file
Database.values()

// If you set the database cache to true, it will print the cached data to the file.
Database.writeAll()


/**
 * Data print commands
 */


// This prints the value { "key": "value" } to the database.json file
Database.set("key", "value")


// This prints them all at once instead of doing it one at a time
Database.setMany({ key1: "value1", key2: "value2", key3: "value3" })


// This deletes everything in the database.json file and writes the data you entered
Database.setFile({ alisa: "o7", array: ["1", "2", "3"], hello: "World!", anyObject: { anyKey: "anyValue", anyArray: ["alisa", "db", "is", "awesome"], anyObjectAgain: {} }, what: "the", fuck: "bro!?" })


/**
 * Data pull commands
 */


// If there is a data called "key" in this database.json file, it calls it
Database.get("key")
Database.fetch("key")


// If there is a value that is the same as the value you entered in this database.json file, it calls it
Database.getValue("bro!?")
Database.getValue({ anyKey: "anyValue", anyArray: ["alisa", "db", "is", "awesome"], anyObjectAgain: {} })


// If there is a value that is the same as the values you entered in this database.json file, it calls it
Database.getValue(["bro!?", { anyKey: "anyValue", anyArray: ["alisa", "db", "is", "awesome"], anyObjectAgain: {} }])


// This will call all the data you entered in the database.json file
Database.getMany(["key", "alisa", "array"]) // [undefined, "o7", ["1", "2", "3"]]
Database.fetchMany(["key", "alisa", "array"]) // [undefined, "o7", ["1", "2", "3"]]



// This calls all data in database.json file
Database.getAll()
Database.fetchAll()
Database.all()
Database.toJSON()
// All of the above are called in JSON (i.e. Object) format

Database.toArray()
// This command is called as Array


/**
 * Commands to check data
 */


// This checks if there is a "key" in the database.json file
Database.has("key")
Database.exists("key")


// This checks if at least 1 of the data you entered exists
Database.hasSome(["ali", "alisa", "key"])
Database.existsSome(["ali", "alisa", "key"])


// This checks whether there is a value that is the same as the value you entered in the database.json file
Database.hasValue("bro!?")
Database.existsValue({ anyKey: "anyValue", anyArray: ["alisa", "db", "is", "awesome"], anyObjectAgain: {} })


// Returns true if this is equal to at least one value with the values you entered in the database.json file
Database.hasSomeValue(["bro!?", { anyKey: "anyValue", anyArray: ["alisa", "db", "is", "awesome"], anyObjectAgain: {} }]) // true
Database.existsSomeValue(["no no", "empty"]) // false


// Returns true if the values you entered in this database.json file are all equal to a value
Database.hasEveryValue(["bro!?", { anyKey: "anyValue", anyArray: ["alisa", "db", "is", "awesome"], anyObjectAgain: {} }]) // true
Database.existsEveryValue(["bro!?", "no no", "empty"]) // false


// This checks if all the data you entered are present (returns false if even 1 is not found)
Database.hasAll(["ali", "alisa", "key"])
Database.existsAll(["ali", "alisa", "key"])


/**
 * Commands to pull the data you want using functions
 */


// This allows you to pull the data you want from the database.json file
Database.find(object => object.key.includes("a"))
Database.includes("a") // They are the same thing

Database.find(object => object.key.startsWith("a"))
Database.startsWith("a") // They are the same thing


// This calls all data with letter "a" in key data in database.json file
Database.filter(object => object.key.includes("a"))


// This checks if at least one of the key data in the database.json file contains the letter "a"
Database.some(object => object.key.includes("a"))


// This checks if all key data in the database.json file contains the letter "a"
Database.every(object => object.key.includes("a"))


// This will delete the data you specified in the database.json file
Database.findAndDelete(object => object.key.includes("alisao7"))


// This will delete all the data in the database.json file, if there is any data you specified
Database.filterAndDelete(object => object.key.includes("alisao7"))


/**
 * Data wipe commands
 */


// This deletes the "key" data in the database.json file
Database.delete("key")


// This will delete all data with the name you entered in the database.json file
Database.deleteMany(["key", "alisa", "value"])


// This deletes all the data in the database.json file
Database.deleteAll()


/**
 * Array commands
 */


// Adds a new data to the end of the Array corresponding to the "key" data in this database.json file
Database.push("key", "veri")


// This adds multiple data to the end of the data
Database.pushAll("key", ["veri1", "veri2", "veri3"])


// This deletes the data at the very end of the Array
Database.pop("key")
Database.pop("key", 5) // This also deletes 5 data instead of 1 data


// Adds a new data to the beginning of the Array corresponding to the "key" data in this database.json file
Database.unshift("key", "veri")


// This adds multiple data to the beginning of the data
Database.unshiftAll("key", ["veri1", "veri2", "veri3"])


// This deletes the data at the very beginning of the Array
Database.shift("key")
Database.shift("key", 5) // This also deletes 5 data instead of 1 data


/**
 * Math operation commands
 */


// This increments the value of the "key" data in the database.json file
Database.add("key")
Database.add("key", 5) // This adds 5 instead of 1


// This reduces the value of the "key" data in the database.json file
Database.substr("key")
Database.substr("key", 5) // This subtracts 5 instead of 1
Database.substr("key", 4, true) // This checks if the number drops to minus (-)'s


// This multiplies the value of the "key" data in the database.json file
Database.multi("key", 5)


// This splits the value of the "key" data in the database.json file
Database.division("key", 5)
Database.division("key", 4, true) // This checks whether the number is integer or not


/**
 * Reset/delete/create commands
 */


// This deletes all data in database.json
Database.deleteAll()
Database.reset()


// This directly deletes the database.json file
Database.destroy()


// This creates a new file called database.json
Database.create("database.json")


/**
 * Other commands
 */


// This indicates the type of data corresponding to the "key" data
Database.typeof("key")