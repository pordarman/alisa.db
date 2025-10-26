// @ts-check
/**
 * Database's options
 * @typedef {Object} Options
 * @property {Number} [spaces=2] How many spaces to use for indentation in the output json files
 * @property {Boolean} [autoWrite=true] Sets whether to automatically write to the JSON file when a data is added or changed.
 * @property {Boolean} [cache=false] You set whether to cache the database file (If you cache it, the performance of the module will increase, but the probability of error will also increase)
 */

const DatabaseError = require("./src/.js/DatabaseError");
const errorCodes = require("./src/.js/errorCodes");
const fs = require("fs");

/**
 * Checks if the entered objects are the same
 * @param {Object<String, any>} object1 - First object
 * @param {Object<String, any>} object2 - Second object
 * @returns {Boolean} - Returns true if the objects are the same, otherwise it returns false
 */
function sameObject(object1, object2) {
    const objectEnt1 = Object.entries(object1);
    const objectEnt2 = Object.entries(object2);

    if (objectEnt1.length != objectEnt2.length) return false;

    for (const [key, value_1] of objectEnt1) {
        if (!(key in object2) || !sameValue(value_1, object2[key])) return false;
    }
    return true
}


/**
 * Checks if the entered values are the same
 * @param {*} value1 - First value
 * @param {*} value2 - Second value
 * @returns {Boolean} - Returns true if the values are the same, otherwise it returns false
 */
function sameValue(value1, value2) {
    // If the values are the same, it returns true
    if (value1 === value2) return true;

    const type1 = Object.prototype.toString.call(value1);
    const type2 = Object.prototype.toString.call(value2);

    // If the types of the values are different, it returns false
    if (type1 !== type2) return false;

    switch (type1) {
        case "[object Object]":
            return sameObject(value1, value2);

        case "[object Array]":
            return sameArray(value1, value2);

        default:
            return false;
    }
}

/**
 * Checks if the entered Arrays are the same
 * @param {Array<any>} array1 - First array
 * @param {Array<any>} array2 - Second array
 * @returns {Boolean} - Returns true if the arrays are the same, otherwise it returns false
 */

function sameArray(array1, array2) {
    const length = array1.length;
    if (length != array2.length) return false;

    return array1.every((value, index) => sameValue(value, array2[index]));
}


/**
 * Removes the .json extension from the file name
 * @param {String} fileName - File name
 * @returns {String} - Returns the file name without the .json extension
 */
function removeJsonAtEnd(fileName) {
    return fileName.endsWith(".json") ? fileName.slice(0, -5) : fileName;
}


module.exports = class Database {

    /**
     * Default file name
     * @type {String}
     */
    #DEFAULT_FILE_NAME;

    /**
     * Cache setting
     * @type {Object<string, object>|null}
     */
    #cache;

    /**
     * Spaces setting
     * @type {number}
     */
    #spaces;

    /**
     * AutoWrite setting
     * @type {Boolean}
     */
    #autoWrite;

    /**
     * Listeners
     * @type {Map<String, Set<Function>>}
     */
    #listeners = new Map();


    /**
     * You only need to define it once
     * @param {String} fileName -
     * @param {Options} options - Database's options
     * @example
     * // First we define our module
     * const AlisaDB = require("alisa.db");
     * 
     * // Then, if we want, we add the data we want and customize our database further.
     * const Database = new AlisaDB();
     * 
     * const Database_1 = new AlisaDB("alisa.db.json");
     * 
     * const Database_2 = new AlisaDB("alisa.json", { cache: true, autoWrite: false, spaces: 4 });
     */

    constructor(fileName = "database", options = {}) {

        const {
            cache = false,
            spaces = 4,
            autoWrite = true
        } = options;

        // If the fileName is not string or empty string, set to default "database"
        this.#DEFAULT_FILE_NAME = typeof fileName != "string" || fileName.length == 0 ?
            "database" :
            removeJsonAtEnd(fileName);

        if (!fs.existsSync(`${this.#DEFAULT_FILE_NAME}.json`)) fs.writeFileSync(`${this.#DEFAULT_FILE_NAME}.json`, "{}");

        this.#autoWrite = Boolean(autoWrite);

        // Save in cache (This caching can also be used for multiple files)
        this.#cache = cache ? { [this.#DEFAULT_FILE_NAME]: JSON.parse(fs.readFileSync(`${this.#DEFAULT_FILE_NAME}.json`, "utf-8")) } : null;

        this.#spaces = Number(spaces);

        if (isNaN(this.#spaces)) this.#spaces = 4;
        if (this.#spaces < 0) this.#spaces = 0;

        // If both autoWrite and cache features are turned off, it will give an error because no matter how much data is written, there will be no change in the database
        if (this.#autoWrite === false && this.#cache === undefined) throw new DatabaseError("AutoWrite and cache cannot be turned off at the same time!");
    }



    // #region Private

    /**
     * @param {String} fileName - File name
     * @private
     */
    _getFile(fileName) {
        fileName = removeJsonAtEnd(fileName);
        if (this.#cache !== null) {
            // If the file is already in cache, return it
            const cache = this.#cache[fileName];
            if (cache) {
                this.emit("getFile", { fileName, file: cache, fromCache: true, saveCache: false, fromFile: false });
                return cache;
            }

            // If the file is not in cache, read it from the file system and add it to the cache and return it
            this.#cache[fileName] = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"));
            this.emit("getFile", { fileName, file: this.#cache[fileName], fromCache: false, saveCache: true, fromFile: false });
            return this.#cache[fileName];
        }

        const data = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"));
        this.emit("getFile", { fileName, data, fromCache: false, saveCache: false, fromFile: true });
        return data;
    }


    /**
     * @param {String} fileName - File name
     * @param {Object} file - File
     * @private
     */
    _writeAndCache(fileName, file) {
        if (this.#autoWrite) {
            fs.writeFileSync(`${fileName}.json`, JSON.stringify(file, null, this.#spaces));
            this.emit("writeFile", { fileName, file });
        }
        if (this.#cache) {
            this.#cache[fileName] = file;
            this.emit("writeCache", { fileName, file });
        }
    }
    // #endregion


    /**
     * Version of database
     * @return {String}
     */

    get version() {
        return `v1.0.5`
    }



    /**
     * Data written when using Object.prototype.toString.call(Database) command
     * @return {String}
     */

    get [Symbol.toStringTag]() {
        return "Database"
    }




    // #region Main

    /**
     * Returns the key values of all data in the JSON file
     * @param {String} fileName - File name (Optional)
     * @return {Array<String>}
     */

    keys(fileName = this.#DEFAULT_FILE_NAME) {
        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        return Object.keys(this._getFile(fileName));
    }



    /**
     * Returns the values of all data in the JSON file
     * @param {String} fileName - File name (Optional)
     * @return {Array<any>}
     */

    values(fileName = this.#DEFAULT_FILE_NAME) {
        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        return Object.values(this._getFile(fileName));
    }



    /**
     * If you have the database's cache setting open, use this command to save all the information in the cache to JSON files.
     * @param {String|Array<String>} fileName - If you only want one file to be saved, enter the name of the file. If you want specific multiple files to be saved, enter the file names in Array
     * @return {Boolean}
     */

    writeAll(fileName) {
        // If the cache feature is turned off, it will give an error because there is no data to write
        if (!this.#cache || Object.prototype.toString.call(this.#cache) !== "[object Object]") return false;

        /** @param {String} fileName */
        const writeFile = (fileName) => {
            if (this.#cache == null) return;
            fs.writeFileSync(`${fileName}.json`, JSON.stringify(this.#cache[fileName] || {}, null, this.#spaces));
        }

        if (typeof fileName == "string") {
            writeFile(fileName);
            return true;
        } else if (Array.isArray(fileName)) {
            fileName.forEach(file => {
                writeFile(file);
            });
            return true;
        }

        Object.entries(this.#cache).forEach(([file, data]) => {
            fs.writeFileSync(`${file}.json`, JSON.stringify(data, null, this.#spaces));
        });

        return true;
    }


    /**
     * Writes new data to JSON file or replaces existing data
     * @param {String} key - Name of key
     * @param {Object|Date|String|Array<any>|null} value - The value corresponding to the typed key
     * @param {String} fileName - File name (Optional)
     * @return {Object}
     * @example
     * 
     * // Writes the word "World" against the "hello" key value
     * Database.set("hello", "World") // { "hello": "World" }
     * 
     * // Writes the word "value" against the "key" key value in ./test.json
     * Database.set("key", "value", "test") // { "key": "value!" }
     * 
     * // Writes the word "Crazy" against the "Fearless" key value in ./database/fearless.json
     * Database.set("Fearless", "Crazy", "database/fearless.json") // { "Fearless": "Crazy" }
     */

    set(key, value, fileName = this.#DEFAULT_FILE_NAME) {
        if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput);
        if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput);

        if (!(1 in arguments)) throw new DatabaseError("value value is missing", errorCodes.missingInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        file[key] = value;
        this.emit("set", { fileName, file, key, value });

        this._writeAndCache(fileName, file);
        return file;
    }



    /**
     * Writes new multiple data to JSON file or replaces existing data
     * @param {Array<[string, any]>|Object<String,any>} items - Data to be written or changed
     * @param {String} fileName - File name (Optional)
     * @return {void}
     * @example
     * 
     * // Use this command to print multiple data to file
     * Database.setMany(
     *  { 
     *   hello: "World", 
     *   key: "value", 
     *   array: ["1", "2", "3"] 
     *  }
     * ) // { hello: "World", key: "value", array: ["1", "2", "3"] })
     * 
     * // To print to another file, enter the path of the file as the 2nd parameter
     * Database.setMany([
     * ["hello", "World"], 
     * ["key", "value"], 
     * ["array", ["1", "2", "3"]]
     * ], "test") // { hello: "World", key: "value", array: ["1", "2", "3"] }
     */

    setMany(items, fileName = this.#DEFAULT_FILE_NAME) {
        if (!items) throw new DatabaseError("items value is missing", errorCodes.missingInput);
        if (!Array.isArray(items) && Object.prototype.toString.call(items) != "[object Object]") throw new DatabaseError("items value must be an Array or Object type", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        let file = this._getFile(fileName);
        if (Array.isArray(items)) items = Object.fromEntries(items);

        file = {
            ...file,
            ...items
        };
        this.emit("setMany", { fileName, file, items });

        this._writeAndCache(fileName, file);
    }



    /**
     * Deletes all data in the JSON file and writes the data you entered
     * @param {Object} input - Data to be written to JSON file
     * @param {String} fileName - File name (Optional)
     * @return {Object}
     * @example
     * 
     * // Deletes all data in the JSON file and writes the data you entered
     * Database.setFile(
     *  { 
     *   hello: "World", 
     *   key: "value", 
     *   array: ["1", "2", "3"] 
     *  }
     * ) // { hello: "World", key: "value", array: ["1", "2", "3"] }
     * 
     * // If you want to change a specific file, enter the path of the file as the 2nd parameter
     * Database.setMany([
     * ["hello", "World"], 
     * ["key", "value"], 
     * ["array", ["1", "2", "3"]]
     * ], "database/fearless.json");
     */

    setFile(input, fileName = this.#DEFAULT_FILE_NAME) {
        if (!input) throw new DatabaseError("input value is missing", errorCodes.missingInput);
        if (!Array.isArray(input) && Object.prototype.toString.call(input) != "[object Object]") throw new DatabaseError("input value must be an Array or Object type", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        if (Array.isArray(input)) input = Object.fromEntries(input);

        this.emit("setFile", { fileName, file: input, input });
        this._writeAndCache(fileName, input);
        return input;
    }



    /**
     * Commands to pull data from database
     */


    /**
     * Pulls specified data from JSON file
     * @param {String} key - Name of key
     * @param {any} defaultValue - If there is no such data, the default data to return
     * @param {String} fileName - File name (Optional)
     * @return {any|undefined}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.set("hello", "World") // { hello: "World" }
     * 
     * // If there is a data named "hello" in the database, it returns that data
     * Database.get("hello") // "World"
     * 
     * // If there is no data to return, it returns undefined by default
     * Database.get("hello3") // undefined
     * 
     * // If there is no data to return, it returns the data you entered
     * Database.get("hello3", "There is no such data!") // "There is no such data!"
     */

    get(key, defaultValue = undefined, fileName = this.#DEFAULT_FILE_NAME) {
        if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput);
        if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);

        const value = key in file ? file[key] : defaultValue;

        this.emit("get", { fileName, file, key, isFound: key in file, rawData: file[key], value });
        return value;
    }



    /**
     * Pulls multiple specified data from JSON file
     * @param {Array<String>} keys - Keys
     * @param {any} defaultValue - Default data to be returned if no data is available
     * @param {String} fileName - File name (Optional)
     * @return {any|Object}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // If you only want to get a single piece of data, use the .get() command
     * Database.get("hello") // "World"
     * 
     * // Enter the names of the keys in the array to pull multiple data
     * Database.getMany(["hello", "ali", "umm"]) // { hello: "World", ali: "King", umm: "Are you there?" }
     * 
     * // Returns an Array if at least 1 of the values you entered were found
     * Database.getMany(["hello", "alisa", "fear"]) // { hello: "World" }
     * 
     * // Returns the value you entered if none of the values you entered were found
     * Database.getMany(["ali", "test"], "No data found!") // "No data found!"
     */

    getMany(keys, defaultValue = {}, fileName = this.#DEFAULT_FILE_NAME) {
        if (!keys) throw new DatabaseError("keys value is missing", errorCodes.missingInput);
        if (!Array.isArray(keys)) throw new DatabaseError("keys value must be an Array", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        let isFound = false;

        /** @type {Object<string, any>} */
        const result = {};

        keys.forEach(key => {
            if (key in file) {
                result[key] = file[key];
                isFound = true;
            }
        });

        this.emit("getMany", { fileName, file, keys, rawData: result, isFound, result: (isFound ? result : defaultValue) });
        return isFound ? result : defaultValue;
    }



    /**
     * Pulls all data from JSON file
     * @param {String} fileName - File name (Optional)
     * @return {Object}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // Use this command to pull all data
     * Database.getAll() // { "ali": "King", "hello": "World", "umm": "Are you there?", "ilost": ["i lost.."] }
     * 
     * // If you want to pull data from another file, enter the path of that file
     * Database.getAll("so a filename.json");
     */

    getAll(fileName = this.#DEFAULT_FILE_NAME) {
        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const data = this._getFile(fileName);

        this.emit("getAll", { fileName, data });
        return data;
    }


    /**
     * Pulls the key corresponding to the specified value from the JSON file
     * @param {Array<any>|Object|String|null|Number} value - Name of value
     * @param {String} fileName - File name (Optional)
     * @return {String|any|undefined}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.set("hello", "World") // { hello: "World" }
     * 
     * // If there is a value named "World" in the database, it returns that data
     * Database.getFromValue("World") // "hello"
     * 
     * // If there is no data to return, it returns undefined by default
     * Database.getFromValue("hello") // undefined
     * 
     * // If there is no data to return, it returns the data you entered
     * Database.getFromValue("hello", "There is no such data!") // "There is no such data!"
     */

    getFromValue(value, defaultValue = undefined, fileName = this.#DEFAULT_FILE_NAME) {
        if (!value) throw new DatabaseError("value value is missing", errorCodes.missingInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        const rawResult = Object.entries(file).find(([_, value_1]) => sameValue(value, value_1));
        const values = rawResult ? rawResult[0] : defaultValue;

        this.emit("getFromValue", { fileName, file, value, rawData: rawResult, values });
        return values;
    }

    /**
     * Pulls keys corresponding to specified value values from JSON file
     * @param {Array<any>} values - Values
     * @param {any} defaultValue - Default data to be returned if no data is available
     * @param {String} fileName - File name (Optional)
     * @return {any|Object}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // If you only want to retrieve a single data, use the .getFromValue() command
     * Database.getFromValue("World") // "hello"
     * 
     * // Enter values in array to pull multiple data
     * Database.getManyFromValue(["World", "King", ["i lost.."]]) // ["hello", "ali", "ilost"]
     * 
     * // Returns an Array if at least 1 of the values you entered were found
     * Database.getManyFromValue([["i lost.."], "alisa", "fear"]) // ["ilost", undefined, undefined]
     * 
     * // Returns the value you entered if none of the values you entered were found
     * Database.getManyFromValue(["ali", "test"], "No data found!") // "No data found!"
     */

    getManyFromValue(values, defaultValue = undefined, fileName = this.#DEFAULT_FILE_NAME) {
        if (!values) throw new DatabaseError("values is missing", errorCodes.missingInput);

        if (!Array.isArray(values)) throw new DatabaseError("values must be an Array", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        
        /** @type {Object<string, any>} */
        const result = [];

        values.forEach(value => {
            const key = Object.entries(file).find(([_, value_1]) => sameValue(value, value_1))?.[0];
            if (key) result.push(key);
        });
        const res = result.length > 0 ? (result.length == 1 ? result[0] : result) : defaultValue;

        this.emit("getManyFromValue", { fileName, file, values, rawData: result, result: res });
        return res;
    }



    /**
     * Commands to check data from database
     */


    /**
     * Checks if the specified key from the JSON file exists
     * @param {String} key - Name of key
     * @param {String} fileName - File name (Optional)
     * @return {Boolean}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.set("hello", "World") // { hello: "World" }
     * 
     * // It returns true if there is a data named "hello" in the database
     * Database.has("hello") // true
     * 
     * // Returns false if there is no data to return
     * Database.has("hello3") // false
     */

    has(key, fileName = this.#DEFAULT_FILE_NAME) {
        if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput);
        if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        const hasKey = key in file;

        this.emit("has", { fileName, file, key, result: hasKey });
        return hasKey;
    }


    /**
     * Checks if at least one of the specified key values from the JSON file exists
     * @param {Array<String>} keys - Keys
     * @param {String} fileName - File name (Optional)
     * @return {Boolean}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // If you only want to check one piece of data, use the .has() command
     * Database.has("hello") // true
     * 
     * // Enter the names of the keys in the array to check multiple data
     * Database.hasAny(["hello", "Alisa", "Fearless"]) // true
     * 
     * // Returns false if none of the values you entered were found
     * Database.hasAny(["alisa", "test"]) // false
     */

    hasAny(keys, fileName = this.#DEFAULT_FILE_NAME) {
        if (!keys) throw new DatabaseError("keys value is missing", errorCodes.missingInput);
        if (!Array.isArray(keys)) throw new DatabaseError("keys value must be an Array", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        let foundedKey;
        const file = this._getFile(fileName);
        const hasKey = keys.some(key => {
            foundedKey = key in file ? key : undefined;
            return foundedKey;
        });

        this.emit("hasAny", { fileName, file, keys, result: hasKey, foundedKey });
        return hasKey;
    }



    /**
     * Checks if all of the key values specified from the JSON file are present
     * @param {Array<String>} keys - Keys
     * @param {String} fileName - File name (Optional)
     * @return {Boolean}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // If you only want to check one piece of data, use the .has() command
     * Database.has("hello") // true
     * 
     * // Enter the names of the keys in the array to check multiple data
     * Database.hasAll(["hello", "Alisa", "Fearless"]) // true
     * 
     * // Returns false if at least one of the key values you entered does not exist
     * Database.hasAll(["hello", "Alisa", "test"]) // false
     */

    hasAll(keys, fileName = this.#DEFAULT_FILE_NAME) {
        if (!keys) throw new DatabaseError("keys value is missing", errorCodes.missingInput);
        if (!Array.isArray(keys)) throw new DatabaseError("keys value must be an Array", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        const hasKey = keys.every(key => key in file);

        this.emit("hasAll", { fileName, file, keys, result: hasKey });
        return hasKey;
    }



    /**
     * Checks whether value corresponds to the specified value from the JSON file
     * @param {Array<String>|Object|String|null|Number} value - Name of value
     * @param {String} fileName - File name (Optional)
     * @return {Boolean}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.set("hello", "World") // { hello: "World" }
     * 
     * // It returns true if there is a value named "World" in the database
     * Database.hasValue("World") // true
     * 
     * // Returns false if there is no value named "World"
     * Database.hasValue("hello") // false
     */

    hasValue(value, fileName = this.#DEFAULT_FILE_NAME) {
        if (!value) throw new DatabaseError("value value is missing", errorCodes.missingInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        const hasValue = Object.values(file).some(value_1 => sameValue(value, value_1));

        this.emit("hasValue", { fileName, file, value, result: hasValue });
        return hasValue;
    }



    /**
     * Checks if there is at least one value corresponding to the specified value from the JSON file
     * @param {Array<any>} values - Values
     * @param {String} fileName - File name (Optional)
     * @return {any|Object}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // If you only want to retrieve a single data, use the .hasValue() command
     * Database.hasValue("World") // true
     * 
     * // Enter values in array to pull multiple data
     * Database.hasAnyValue(["World", "o7", "String"]) // true
     * 
     * // Returns true if at least 1 of the values you entered were found
     * Database.hasAnyValue([[1, 2, 3], "King", "fear"]) // true
     * 
     * // Returns false if none of the values you entered were found
     * Database.hasAnyValue(["ali", "test"]) // false
     */

    hasAnyValue(values, fileName = this.#DEFAULT_FILE_NAME) {
        if (!values) throw new DatabaseError("values is missing", errorCodes.missingInput);
        if (!Array.isArray(values)) throw new DatabaseError("values must be an Array", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        const fileValues = Object.values(file);
        const hasValue = values.some(value => fileValues.some(value_1 => sameValue(value, value_1)));

        this.emit("hasAnyValue", { fileName, file, values, result: hasValue });
        return hasValue;
    }



    /**
     * Checks if all value corresponding to specified value from JSON file exists
     * @param {Array<any>} values - Values
     * @param {String} fileName - File name (Optional)
     * @return {any|Object}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // If you only want to retrieve a single data, use the .hasValue() command
     * Database.hasValue("World") // true
     * 
     * // Enter values in array to pull multiple data
     * Database.hasAllValue(["King", "World", "Are you there?"]) // true
     * 
     * // Returns false if at least 1 of the value you entered is not found
     * Database.hasAllValue([[1, 2, 3], "alisa", "fear"]) // false
     */

    hasAllValue(values, fileName = this.#DEFAULT_FILE_NAME) {
        if (!values) throw new DatabaseError("values is missing", errorCodes.missingInput);
        if (!Array.isArray(values)) throw new DatabaseError("values must be an Array", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        const fileValues = Object.values(file);
        const hasValue = values.every(value => fileValues.some(value_1 => sameValue(value, value_1)));

        this.emit("hasAllValue", { fileName, file, values, result: hasValue });
        return hasValue;
    }
    // #endregion


    // #region Listeners
    /**
     * Listens for the specified event and executes the callback function when the event occurs
     * @param {String} event - Event name
     * @param {Function} listener - Callback function to be executed when the event occurs
     * @returns {Database}
     * @example
     * const listener = () => console.log("Event triggered!");
     * Database.on("get", listener); // Adds the listener
     */
    on(event, listener) {
        if (typeof event != "string") throw new DatabaseError("event value must be a string", errorCodes.invalidInput);
        if (typeof listener != "function") throw new DatabaseError("listener value must be a function", errorCodes.invalidInput);

        if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
        this.#listeners.get(event)?.add(listener);
        return this;
    }


    /**
     * Removes the specified event listener
     * @param {String} event - Event name
     * @param {Function} listener - Callback function to be removed
     * @returns {Database}
     * @example
     * const listener = () => console.log("Event triggered!");
     * Database.on("get", listener);
     * Database.off("get", listener); // Removes the listener
     */
    off(event, listener) {
        if (typeof event != "string") throw new DatabaseError("event value must be a string", errorCodes.invalidInput);
        if (typeof listener != "function") throw new DatabaseError("listener value must be a function", errorCodes.invalidInput);

        this.#listeners.get(event)?.delete(listener);
        return this;
    }

    /**
     * Emits the specified event with the provided payload
     * @param {String} event - Event name
     * @param {any} payload - Payload to be passed to the listener
     * @returns {Database}
     * @example
     * Database.emit("get", { key: "hello" }); // Emits the event with the payload
     */
    emit(event, payload) {
        for (const listener of this.#listeners.get(event) || []) {
            try {
                listener(payload);
            } catch (err) {
                console.error("[Database] Listener error:", err);
            }
        }
        return this;
    }
    // #endregion

    /**
     * Returns the first data you define from the JSON file 
     * @param {(key: String, value: any, index: Number, thisArgs: Array<any>) => {}} callback - for the find function
     * @param {String} fileName - File name (Optional)
     * @return {any}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: "i lost.."
     *  }
     * );
     * 
     * // Then let's return the data we want using the command
     * Database.find((key, value) => {
     * 
     *   // Returns the first data containing the word "ali" in the key data of the object
     *   return key.includes("ali");
     * 
     * }) // "King"
     * 
     * // This is another way of calling
     * Database.find((key, value) => {
     * 
     *   // Returns the first data of the object whose value is Array
     *   return Array.isArray(value);
     * 
     * }) // undefined
     */

    find(callback, fileName = this.#DEFAULT_FILE_NAME) {
        if (typeof callback != "function") throw new DatabaseError("callback value must be a function value", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        const entries = Object.entries(file);

        for (let i = 0; i < entries.length; i++) {
            const [key, value] = entries[i];
            if (callback(key, value, i, entries)) {
                this.emit("find", { fileName, file, key, value, isFound: true });
                return value;
            }
        }

        this.emit("find", { fileName, file, isFound: false });
        return undefined;
    }



    /**
     * Returns the data you define from the JSON file, filtering it 
     * @param {(key: String, value: any, index: Number, thisArgs: Array<any> ) => {}} callback - for the filter function
     * @param {String} fileName - File name (Optional)
     * @return {Object}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: "i lost.."
     *  }
     * );
     * 
     * // Then let's filter the data we want using the command
     * Database.filter((key, value) => {
     * 
     *   // Filter data containing the word "ali" in the key data of the object
     *   return key.includes("ali");
     * 
     * }) // { ali: "King", hello: "World" }
     * 
     * // This is another way of calling
     * Database.filter((key, value) => {
     * 
     *   // Returns data whose object's value is Array
     *   return Array.isArray(value);
     * 
     * }) // {}
     */

    filter(callback, fileName = this.#DEFAULT_FILE_NAME) {
        if (typeof callback != "function") throw new DatabaseError("callback value must be a function value", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        const entries = Object.entries(file);

        /** @type {Object<string, any>} */
        const result = {};

        for (let i = 0; i < entries.length; i++) {
            const [key, value] = entries[i];
            if (callback(key, value, i, entries)) result[key] = value;
        }

        this.emit("filter", { fileName, file, result });
        return result;
    }



    /**
     * Returns data containing the word you entered from the JSON file 
     * @param {String} key - for the filter function
     * @param {String} fileName - File name (Optional)
     * @return {Object}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   aliv2: ["heyy"],
     *   umm: "Are you there?", 
     *   ilost: "i lost.."
     *  }
     * );
     * 
     * // Then let's filter the data we want using the command
     * Database.includes("ali") // { ali: "King", aliv2: ["heyy"] }
     */

    includes(key, fileName = this.#DEFAULT_FILE_NAME) {
        if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput);
        if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput);

        return this.filter(objectKey => objectKey.includes(key), fileName);
    }



    /**
     * Returns data starting with the word you entered from the JSON file 
     * @param {String} key - for the filter function
     * @param {String} fileName - File name (Optional)
     * @return {Object}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   aliv2: ["heyy"],
     *   umm: "Are you there?", 
     *   ilost: "i lost.."
     *  }
     * );
     * 
     * // Then let's filter the data we want using the command
     * Database.startsWith("ali") // { ali: "King", aliv2: ["heyy"] }
     */

    startsWith(key, fileName = this.#DEFAULT_FILE_NAME) {
        if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput);
        if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput);

        return this.filter(objectKey => objectKey.startsWith(key), fileName);
    }



    /**
     * Checks if at least one of the data you defined from the JSON file exists
     * @param {(key: String, value: any, index: Number, thisArgs: Array<any>) => {}} callback - for some function
     * @param {String} fileName - File name (Optional)
     * @return {Boolean}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: "i lost.."
     *  }
     * );
     * 
     * // Then let's check the data we want using the command
     * Database.some((key, value) => {
     * 
     *   // Checks whether there is a word containing the word "ali" in the key data of the object
     *   return key.includes("ali");
     * 
     * }) // true
     * 
     * // This is another way of calling
     * Database.some((key, value) => {
     * 
     *   // It checks whether the object's value data is Array or not
     *   return Array.isArray(value);
     * 
     * }) // false
     */

    some(callback, fileName = this.#DEFAULT_FILE_NAME) {
        if (typeof callback != "function") throw new DatabaseError("callback value must be a function value", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        const entries = Object.entries(file);
        const result = entries.some(([key, value], index) => callback(key, value, index, entries));

        this.emit("some", { fileName, file, result });
        return result;
    }



    /**
     * Performs the specified action for each item in the database
     * @param {(key: String, value: any, index: Number, thisArgs: Array<any> ) => {}} callback - for forEach function
     * @param {String} fileName - File name (Optional)
     * @return {undefined}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: "i lost.."
     *  }
     * );
     * 
     * // Let's perform the specified operation for each item
     * Database.forEach((key, value) => {
     * 
     *   // Let's print all the key data in the database to the console
     *   console.log(key);
     * 
     * });
     * 
     * // This is another way of calling
     * Database.forEach((key, value) => {
     * 
     *   // Let's print the key whose value is Array to the console
     *   if (Array.isArray(value)) {
     * 
     *     console.log(`${key} has an array value`);
     *   
     *   }
     * 
     * });
     */

    forEach(callback, fileName = this.#DEFAULT_FILE_NAME) {
        if (typeof callback != "function") throw new DatabaseError("callback value must be a function value", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        const entries = Object.entries(file);

        this.emit("forEach", { fileName, file });
        entries.forEach(([key, value], index) => callback(key, value, index, entries));
    }



    /**
     * Checks if all of the data you defined from the JSON file exists
     * @param {(key: String, value: any, index: Number, thisArgs: Array<any>) => {}} callback - for every function
     * @param {String} fileName - File name (Optional)
     * @return {Boolean}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: "i lost.."
     *  }
     * );
     * 
     * // Then let's check the data we want using the command
     * Database.every((key, value) => {
     * 
     *   // Checks whether there is a word containing the word "ali" in each key data of the object
     *   return key.includes("ali");
     * 
     * }) // false
     * 
     * // This is another way of calling
     * Database.every((key, value) => {
     * 
     *   // Checks if the object's key data is a font
     *   return typeof key == "string"
     * 
     * }) // true
     */

    every(callback, fileName = this.#DEFAULT_FILE_NAME) {
        if (typeof callback != "function") throw new DatabaseError("callback value must be a function value", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        const entries = Object.entries(file);
        const result = entries.every(([key, value], index) => callback(key, value, index, entries));

        this.emit("every", { fileName, file, result });
        return result;
    }



    /**
     * Deletes the first data you defined from the JSON file 
     * @param {(key: String, value: any, index: Number, thisArgs: Array<any> ) => {}} callback - for the find function
     * @param {String} fileName - File name (Optional)
     * @return {Object|undefined}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: "i lost.."
     *  }
     * );
     * 
     * // Then let's show the data we want to delete using the command
     * Database.find((key, value) => {
     * 
     *   // Find and delete the first data containing the word "ali" in the key data of the object
     *   return key.includes("ali");
     * 
     * }) // { ali: "King" }
     * 
     * // File no longer contains "ali" data
     */

    findAndDelete(callback, fileName = this.#DEFAULT_FILE_NAME) {
        if (typeof callback != "function") throw new DatabaseError("callback value must be a function value", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        const entries = Object.entries(file);

        for (let i = 0; i < entries.length; i++) {
            const [key, value] = entries[i];
            if (callback(key, value, i, entries)) {
                this.emit("findAndDelete", { fileName, file, key, value, isFound: true });

                delete file[key];
                this._writeAndCache(fileName, file);
                return value;
            }
        }

        this.emit("findAndDelete", { fileName, file, isFound: false });
        return undefined;
    }



    /**
     * Deletes all the data you defined from the JSON file
     * @param {(key: String, value: any, index: Number, thisArgs: Array<any> ) => {}} callback - for the filter function
     * @param {Number} limit - Limit value (Optional)
     * @param {String} fileName - File name (Optional)
     * @return {Array<any>}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   aliv2: ["heyy"],
     *   umm: "Are you there?", 
     *   ilost: "i lost.."
     *  }
     * );
     * 
     * // Then let's show the data we want using the command
     * Database.filterAndDelete((key, value) => {
     * 
     *   // Find and delete all data containing the word "ali" in the key data of the object
     *   return key.includes("ali");
     * 
     * }) // [{ ali: "King" }, { aliv2: ["heyy"] }]
     * 
     * // File no longer contains "ali" and "aliv2" data
     */

    filterAndDelete(callback, limit = Infinity, fileName = this.#DEFAULT_FILE_NAME) {
        if (typeof callback != "function") throw new DatabaseError("callback value must be a function value", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        limit = Number(limit);
        if (isNaN(limit)) throw new DatabaseError("limit value must be a number", errorCodes.invalidInput);
        if (limit < 0) throw new DatabaseError("limit value must be greater than or equal to 0", errorCodes.negativeNumber);

        const file = this._getFile(fileName);

        if (limit === 0) {
            this.emit("filterAndDelete", { fileName, file, limit, result: [] });
            return [];
        }

        const entries = Object.entries(file);
        const result = [];

        for (let i = 0; i < entries.length; i++) {
            const [key, value] = entries[i];
            if (callback(key, value, i, entries)) {
                result.push(value);
                delete file[key];
                if (result.length === limit) break;
            }
        }

        this.emit("filterAndDelete", { fileName, file, limit, result });
        this._writeAndCache(fileName, file);
        return result;
    }



    /**
     * Commands to delete data from database
     */


    /**
     * Delete data from JSON file 
     * @param {String} key - The name of the key to be deleted
     * @param {String} fileName - File name (Optional)
     * @return {Object|undefined}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: "i lost.."
     *  }
     * );
     * 
     * // Then, let's enter the data we want to be deleted using the command
     * Database.delete("hello") { hello: "World" }
     */

    delete(key, fileName = this.#DEFAULT_FILE_NAME) {
        if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput);
        if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        if (!(key in file)) {
            this.emit("delete", { fileName, file, key, isFound: false });
            return undefined;
        }

        const value = file[key];
        delete file[key];

        this.emit("delete", { fileName, file, key, value, isFound: true });
        this._writeAndCache(fileName, file);
        return value;
    }



    /**
     * You delete multiple data from JSON file 
     * @param {Array<String>} keys - Keys
     * @param {String} fileName - File name (Optional)
     * @return {Array<any>}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: "i lost.."
     *  }
     * );
     * 
     * // Then let's enter the keys we want to be deleted using the command
     * Database.deleteMany(["ali", "hello", "umm"]) // "ali", "hello" and "umm" data deleted
     */

    deleteMany(keys, fileName = this.#DEFAULT_FILE_NAME) {
        if (!keys) throw new DatabaseError("keys value is missing", errorCodes.missingInput);
        if (!Array.isArray(keys)) throw new DatabaseError("keys value must be an Array", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        const result = [];

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (key in file) {
                result.push(file[key]);
                delete file[key];
            }
        }

        this.emit("deleteMany", { fileName, file, keys, result });
        this._writeAndCache(fileName, file);
        return result;
    }



    /**
     * You delete all the data in the JSON file 
     * @param {String} fileName - File name (Optional)
     * @return {Object}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: "i lost.."
     *  }
     * );
     * 
     * // Then let's delete all the data using the command
     * Database.deleteAll() // {}
     */

    deleteAll(fileName = this.#DEFAULT_FILE_NAME) {
        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const newValue = {};

        const file = this._getFile(fileName);
        this.emit("deleteAll", { fileName, file, beforeFile: file });

        this._writeAndCache(fileName, newValue);
        return newValue;
    }



    /**
     * Database's Array methods
     */


    /**
     * Adds a new data to the end of the Array of data in the JSON file
     * @param {String} key - Name of key
     * @param {Array<any>|Object|String|null|Number} item - Data to add
     * @param {String} fileName - File name (Optional)
     * @return {Array<any>}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // Then let's add a new data to the end of the Array data using the command
     * Database.push("ilost", "control") // ["i lost..", "control"]
     * 
     * // Now in the "ilost" data contains the following data ["i lost..", "control"]
     */

    push(key, item, fileName = this.#DEFAULT_FILE_NAME) {
        if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput);
        if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput);

        if (!(1 in arguments)) throw new DatabaseError("item value is missing", errorCodes.missingInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        const data = file[key] ??= [];

        if (!Array.isArray(data)) throw new DatabaseError("The data of the data must be an Array value", errorCodes.notArray);

        data.push(item);

        this.emit("push", { fileName, file, key, item, result: data });
        this._writeAndCache(fileName, file);
        return data;
    }



    /**
     * Adds multiple data to the end of Array of data in JSON file
     * @param {String} key - Name of key
     * @param {Array<any>} values - Data to add
     * @param {String} fileName - File name (Optional)
     * @return {Array<any>}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // Then let's add a new data to the end of the Array data using the command
     * Database.pushAll("ilost", ["control", "brooo", "..."]) // ["i lost..", "control", "brooo", "..."]
     * 
     * // Now in the "ilost" data contains the following data ["i lost..", "control", "brooo", "..."]
     */

    pushAll(key, values, fileName = this.#DEFAULT_FILE_NAME) {
        if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput);
        if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput);

        if (!values) throw new DatabaseError("values value is missing", errorCodes.missingInput);
        if (!Array.isArray(values)) throw new DatabaseError("values value must be an Array value", errorCodes.notArray);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        const data = file[key] ??= [];

        if (!Array.isArray(data)) throw new DatabaseError("The values of the data must be an Array value", errorCodes.notArray);

        data.push(...values);

        this.emit("pushAll", { fileName, file, key, values, result: data });
        this._writeAndCache(fileName, file);
        return data;
    }



    /**
     * Deletes the data in the JSON file at the very end of the Array
     * @param {String} key - Name of key
     * @param {Number} number - Number of data to be deleted 
     * @param {String} fileName - File name (Optional)
     * @return {Array<any>}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost..", "this life", "i cry", "broo"]
     *  }
     * );
     * 
     * // Then let's delete the data at the end of the Array data using the command
     * Database.pop("ilost") // ["broo"]
     * 
     * // If you want to delete more than one data, enter the number of data to be deleted
     * Database.pop("ilost", 2) // ["i cry", "broo"]
     * 
     * // Now in the "ilost" data the following data ["i lost..", "this life"]
     */

    pop(key, number = 1, fileName = this.#DEFAULT_FILE_NAME) {
        if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput);
        if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput);

        number = Number(number);
        if (isNaN(number)) throw new DatabaseError("number value must be a number value", errorCodes.notNumber);
        if (number < 0) throw new DatabaseError("number value must be greater than or equal to 0", errorCodes.negativeNumber);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        const data = file[key] ??= [];

        if (!Array.isArray(data)) throw new DatabaseError("The values of the data must be an Array value", errorCodes.notArray);

        const deletedValues = data.splice(-number);

        this.emit("pop", { fileName, file, key, number, deletedValues, result: data });
        this._writeAndCache(fileName, file);
        return deletedValues;
    }



    /**
     * Adds a new data to the beginning of the Array of data in the JSON file
     * @param {String} key - Name of key
     * @param {Array<any>|Object|String|null|Number} item - Data to add
     * @param {String} fileName - File name (Optional)
     * @return {Array<any>}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // Then let's add a new data to the beginning of the Array data using the command
     * Database.unshift("ilost", "i hate") // ["i hate", "i lost.."]
     * 
     * // Now in the "ilost" data the following data ["i hate", "i lost.."]
     */

    unshift(key, item, fileName = this.#DEFAULT_FILE_NAME) {
        if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput);
        if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput);

        if (!(1 in arguments)) throw new DatabaseError("item value is missing", errorCodes.missingInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        const data = file[key] ??= [];

        if (!Array.isArray(data)) throw new DatabaseError("The values of the data must be an Array value", errorCodes.notArray);

        data.unshift(item);

        this.emit("unshift", { fileName, file, key, item, result: data });
        this._writeAndCache(fileName, file);
        return data;
    }



    /**
     * Adds multiple data to the top of Array of data in JSON file
     * @param {String} key - Name of key
     * @param {Array<any>} values - Data to add
     * @param {String} fileName - File name (Optional)
     * @return {Array<any>}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // Then let's add a new data to the beginning of the Array data using the command
     * Database.unshiftAll("ilost", ["i hate", "this life", "man"]) // ["i hate", "this life", "man", "i lost.."]
     * 
     * // Now in the "ilost" data the following data ["i hate", "this life", "man", "i lost.."]
     */

    unshiftAll(key, values, fileName = this.#DEFAULT_FILE_NAME) {
        if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput);
        if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput);

        if (!values) throw new DatabaseError("values value is missing", errorCodes.missingInput);
        if (!Array.isArray(values)) throw new DatabaseError("values value must be an Array value", errorCodes.notArray);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        const data = file[key] ??= [];

        if (!Array.isArray(data)) throw new DatabaseError("The values of the data must be an Array value", errorCodes.notArray);

        data.unshift(...values);

        this.emit("unshiftAll", { fileName, file, key, values, result: data });
        this._writeAndCache(fileName, file);
        return data;
    }



    /**
     * Erases the initial data of the Array of data in the JSON file
     * @param {String} key - Name of key
     * @param {Number} number - Number of data to be deleted 
     * @param {String} fileName - File name (Optional)
     * @return {Array<any>}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost..", "this life", "i cry", "broo"]
     *  }
     * );
     * 
     * // Then let's delete the first data of the Array data using the command
     * Database.shift("ilost") // ["i lost.."]
     * 
     * // If you want to delete more than one data, enter the number of data to be deleted
     * Database.shift("ilost", 2) // ["i lost..", "this life"]
     * 
     * // Now in the "ilost" data contains the following data ["i cry", "broo"]
     */

    shift(key, number = 1, fileName = this.#DEFAULT_FILE_NAME) {
        if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput);
        if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput);

        number = Number(number);
        if (isNaN(number)) throw new DatabaseError("number value must be a number value", errorCodes.notNumber);
        if (number < 0) throw new DatabaseError("number value must be greater than or equal to 0", errorCodes.negativeNumber);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        const data = file[key] ??= [];

        if (!Array.isArray(data)) throw new DatabaseError("The values of the data must be an Array value", errorCodes.notArray);

        const deletedValues = data.splice(0, number);

        this.emit("shift", { fileName, file, key, number, deletedValues, result: data });
        this._writeAndCache(fileName, file);
        return deletedValues;
    }



    /**
     * Database's math operations commands
     */


    /**
     * Increments the value of the data in the JSON file
     * @param {String} key - Name of key
     * @param {Number} number - Number to add to data 
     * @param {String} fileName - File name (Optional)
     * @return {Number}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   heart: 15,
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // Then let's increase its value using the command
     * Database.add("heart", 15) // 30
     * 
     * // Now in the following data is written in the "heart" data 30
     */

    add(key, number = 1, fileName = this.#DEFAULT_FILE_NAME) {
        if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput);
        if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput);

        if (typeof number != "number") number = parseFloat(number);
        if (isNaN(number)) throw new DatabaseError("number value must be a number value", errorCodes.notNumber);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        let data = file[key] ??= 0;

        if (isNaN(data)) throw new DatabaseError("The value of the data must be a Number", errorCodes.notNumber);

        data += number;
        file[key] = data;

        this.emit("add", { fileName, file, key, number, result: data });
        this._writeAndCache(fileName, file);
        return data;
    }



    /**
     * Decreases the value of the data in the JSON file
     * @param {String} key - Name of key
     * @param {Number} number - Number to subtract from data 
     * @param {Boolean} goToNegative - Can the resulting number be less than 0?
     * @param {String} fileName - File name (Optional)
     * @return {Number}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   heart: 15,
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // Then let's decrease its value using the command
     * Database.substr("heart", 5) // 10
     * 
     * // Now in the following data is written in the "heart" data 10
     */

    substr(key, number = 1, goToNegative = true, fileName = this.#DEFAULT_FILE_NAME) {
        if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput);
        if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput);

        if (typeof number != "number") number = parseFloat(number);
        if (isNaN(number)) throw new DatabaseError("number value must be a number value", errorCodes.notNumber);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        let data = file[key] ??= 0;

        if (isNaN(data)) throw new DatabaseError("The value of the data must be a Number", errorCodes.notNumber);

        data -= number;
        if (!goToNegative && data < 0) data = 0;
        file[key] = data;

        this.emit("substr", { fileName, file, key, number, result: data });
        this._writeAndCache(fileName, file);
        return data;
    }



    /**
     * Multiplies the value of the data in the JSON file by the value you enter
     * @param {String} key - Name of key
     * @param {Number} number - The number to be multiplied by the data
     * @param {String} fileName - File name (Optional)
     * @return {Number}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   heart: 15,
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // Then multiply its value by the number using the command
     * Database.multi("heart", 3) // 45
     * 
     * // Now in the following data is written in the "heart" data 45
     */

    multi(key, number, fileName = this.#DEFAULT_FILE_NAME) {
        if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput);
        if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput);

        if (typeof number != "number") number = parseFloat(number);
        if (isNaN(number)) throw new DatabaseError("number value must be a number value", errorCodes.notNumber);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        let data = file[key] ??= 0;

        if (isNaN(data)) throw new DatabaseError("The value of the data must be a Number", errorCodes.notNumber);

        data *= number;
        file[key] = data;

        this.emit("multi", { fileName, file, key, number, result: data });
        this._writeAndCache(fileName, file);
        return data;
    }



    /**
     * Divides the value of the data in the JSON file by the value you enter
     * @param {String} key - Name of key
     * @param {Number} number - Number to divide by data 
     * @param {Boolean} goToDecimal - Can the resulting number be an decimal?
     * @param {String} fileName - File name (Optional)
     * @return {Number}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   heart: 15,
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // Then let's divide its value by number using the command
     * Database.division("heart", 3) // 5
     * 
     * // Now in the following data is written in the "heart" data 5
     */

    division(key, number, goToDecimal = false, fileName = this.#DEFAULT_FILE_NAME) {
        if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput);
        if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput);

        if (typeof number != "number") number = parseFloat(number);
        if (isNaN(number)) throw new DatabaseError("number value must be a number value", errorCodes.notNumber);
        if (number === 0) throw new DatabaseError("number value must be greater than 0", errorCodes.zeroNumber);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const file = this._getFile(fileName);
        let data = file[key] ??= 0;

        if (isNaN(data)) throw new DatabaseError("The value of the data must be a Number", errorCodes.notNumber);

        data /= number;
        if (!goToDecimal) data = Math.floor(data);
        file[key] = data;

        this.emit("division", { fileName, file, key, number, result: data });
        this._writeAndCache(fileName, file);
        return data;
    }



    /**
     * Commands to call all data in the database file
     */


    /**
     * Pulls all data from JSON file and returns it in JSON format
     * @param {String} fileName - File name (Optional)
     * @return {Object}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // Use this command to pull all data
     * Database.toJSON() // { "ali": "King", "hello": World", "umm": "Are you there?", "ilost": ["i lost.."] }
     * 
     * // If you want to pull data from another file, enter the path of that file
     * Database.toJSON("so a filename.json");
     */

    toJSON(fileName = this.#DEFAULT_FILE_NAME) {
        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        return this._getFile(fileName);
    }



    /**
     * Pulls all data from JSON file and returns it in Array format
     * @param {String} fileName - File name (Optional)
     * @return {Array<Object<String,any>>}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // Use this command to pull all data
     * Database.toArray() 
     * // [["ali", "King"], ["hello", World"], ["umm", "Are you there?"], ["ilost", ["i lost.."]]]
     * 
     * // If you want to pull data from another file, enter the path of that file
     * Database.toArray("so a filename.json");
     */

    toArray(fileName = this.#DEFAULT_FILE_NAME) {
        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        return Object.entries(this._getFile(fileName));
    }



    /**
     * Commands to reset the database file
     */


    /**
     * Deletes the entire JSON file
     * @param {String} fileName - File name (Optional)
     * @return {Boolean}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // Then let's delete the file completely using the command
     * Database.destroy();
     * 
     * // The JSON file has now traveled to the infinities of the universe
     */

    destroy(fileName = this.#DEFAULT_FILE_NAME) {
        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        fileName = removeJsonAtEnd(fileName);
        fs.unlinkSync(`${fileName}.json`);
        if (this.#cache) delete this.#cache[fileName];

        this.emit("destroy", { fileName, file: null });
        return true;
    }



    /**
     * Deletes all data in the JSON file
     * @param {String} fileName - File name (Optional)
     * @return {Object}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // Then let's delete the data in the file using the command
     * Database.reset();
     * 
     * // JSON file now only prints "{}" data
     */

    reset(fileName = this.#DEFAULT_FILE_NAME) {
        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const newValue = {};

        const file = this._getFile(fileName);
        this.emit("reset", { fileName, file, afterReset: newValue });
        this._writeAndCache(fileName, newValue);
        return newValue;
    }



    /**
     * Commands to create a new database file
     */


    /**
     * Creates a new JSON database file
     * @param {String} fileName - File name (Optional)
     * @return {Object}
     * @example
     * 
     * // Let's delete the database first
     * Database.destroy();
     * 
     * // Then let's create a new file using the command
     * Database.create("alisa.json");
     * 
     * // If we want to print data in the file while creating it, let's write the data as the second parameter
     * Database.create("AlisaDB.json", { ali: "Adam" });
     * 
     * // If you want to set the file you created as the default file, type true last
     * Database.create("default.json", {}, true);
     */

    create(fileName, file = {}, isDefaultFile = false) {
        if (!fileName) throw new DatabaseError("fileName is missing", errorCodes.missingInput);
        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        fileName = removeJsonAtEnd(fileName);
        if (fs.existsSync(`${fileName}.json`)) throw new DatabaseError(`A file named ${fileName}.json already exists`, errorCodes.exists);

        if (Object.prototype.toString.call(file) != "[object Object]") throw new DatabaseError("file value must be an Object type", errorCodes.invalidInput);

        this._writeAndCache(fileName, file);
        if (isDefaultFile) this.#DEFAULT_FILE_NAME = fileName;

        if (this.#cache !== null) this.#cache[fileName] = file;
        this.emit("create", { fileName, file, isDefaultFile });
        return file;
    }



    /**
     * Clones a specific JSON database file
     * @param {String} cloneFileName - The name of the file to be cloned
     * @param {String} fileName - File name (Optional)
     * @return {Object}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // Then let's command copy this JSON file to another JSON file
     * Database.clone("alisa.json");
     * 
     * // If you want, you can also enter the file name to be cloned
     * Database.clone("AlisaDB.json", "such a filename.json");
     */

    clone(cloneFileName, fileName = this.#DEFAULT_FILE_NAME) {
        if (!cloneFileName) throw new DatabaseError("The name of the file to be cloned is missing", errorCodes.missingInput);
        if (typeof cloneFileName != "string") throw new DatabaseError("cloneFileName value must be a string", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        cloneFileName = removeJsonAtEnd(cloneFileName);
        if (fs.existsSync(`${cloneFileName}.json`)) throw new DatabaseError(`A file named ${cloneFileName}.json already exists`, errorCodes.exists);

        const file = this._getFile(fileName);
        this._writeAndCache(cloneFileName, file);

        if (this.#cache !== null) this.#cache[cloneFileName] = file;
        this.emit("clone", { fileName, file, cloneFileName });
        return file;
    }



    /**
     * Other commands of the database
     */


    /**
     * Returns the type of data in the JSON file
     * @param {String} key - Name of key
     * @param {String} fileName - File name (Optional)
     * @return {"string" | "array" | "object" | "number" | "string" | "boolean" | "bigint" | "symbol" | "function" | "undefined"}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.setMany(
     *  { 
     *   ali: "King", 
     *   hello: "World", 
     *   umm: "Are you there?", 
     *   ilost: ["i lost.."]
     *  }
     * );
     * 
     * // Then let's see what type the data is using the command
     * Database.typeof("ali") // "string"
     * 
     * Database.typeof("ilost") // "array"
     */

    typeof(key, fileName = this.#DEFAULT_FILE_NAME) {
        if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput);
        if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput);

        if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput);

        const data = this._getFile(fileName)[key];
        return Array.isArray(data) ? "array" : typeof data;
    }

}
