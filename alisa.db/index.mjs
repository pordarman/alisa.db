import DatabaseError from "./src/.mjs/DatabaseError.mjs";
import errorCodes from "./src/.mjs/errorCodes.mjs";
import fs from "fs";
import { version } from "./package.json";



/**
 * Checks if the entered objects are the same
 * @param {Object} object1 
 * @param {Object} object2 
 * @returns {Boolean}
 */

function sameObject(object1, object2) {
  let objectEnt1 = Object.entries(object1)
  let objectEnt2 = Object.entries(object2)
  if (objectEnt1.length != objectEnt2.length) return false
  for (const [key, value_1] of objectEnt1) {
    let obj = objectEnt2.find(a => a[0] === key)
    if (!obj || !sameValue(value_1, obj[1])) return false
  }
  return true
}

/**
 * Checks if the entered values are the same
 * @param {*} value1 
 * @param {*} value2 
 * @returns {Boolean}
 */

function sameValue(value1, value2) {
  let pro1 = Object.prototype.toString.call(value1)
  let pro2 = Object.prototype.toString.call(value2)
  if (pro1 !== pro2) return false
  switch (pro1) {
    case "[object Null]": {
      return true
    }
    case "[object String]":
    case "[object Number]":
    case "[object Boolean]": {
      return value1 === value2
    }
    case "[object Array]": {
      return sameArray(value1, value2)
    }
    case "[object Object]": {
      return sameObject(value1, value2)
    }
    default: {
      return false
    }
  }
}

/**
 * Checks if the entered Arrays are the same
 * @param {Array} array1 
 * @param {Array} array2 
 * @returns {Boolean}
 */

function sameArray(array1, array2) {
  let obj = {}
  if (array1.length != array2.length) return false
  return array1.every(value_1 => array2.some((a2, i) => {
    let isSame = sameValue(value_1, a2)
    if (!isSame || obj[i]) return false
    obj[i] = true
    return true
  }))
}


class Database {


  /**
   * You only need to define it once
   * @param {String} fileName Default file name
   */

  constructor(fileName) {

    // If a default filename is entered, set that filename as default
    if (typeof fileName == "string") {

      // If the file name ends in .json, remove .json
      if (fileName.trim().endsWith(".json")) {

        // Removing .json text
        this.DEFAULT_FILE_NAME = fileName.replace(/\.json *$/m, "")
      } else {

        // If it does not end in .json, it takes the entered value as the file name
        this.DEFAULT_FILE_NAME = fileName
      }
    } else {

      // If no value is entered or the value is not a font, the file name is defaulted to "database"
      this.DEFAULT_FILE_NAME = "database"
    }

    // If there is no JSON file with the name you entered, it will create a JSON file with the name you entered
    if (!fs.existsSync(`${this.DEFAULT_FILE_NAME}.json`)) fs.writeFileSync(`${this.DEFAULT_FILE_NAME}.json`, "{}")

  }



  /**
   * Version of database
   * @return {String}
   */

  get version() {
    return `v${version}`
  }



  /**
   * Data written when using Object.prototype.toString.call(Database) command
   * @return {String}
   */

  get [Symbol.toStringTag]() {
    return "Database"
  }




  /**
   * The main commands of the database
   */


  /**
   * Returns the key values of all data in the JSON file
   * @param {String} fileName File name (Optional)
   * @return {Array<String>}
   */

  keys(fileName = this.DEFAULT_FILE_NAME) {
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return Object.keys(dosya)
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
   * Returns the values of all data in the JSON file
   * @param {String} fileName File name (Optional)
   * @return {Array<any>}
   */

  values(fileName = this.DEFAULT_FILE_NAME) {
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return Object.values(dosya)
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
   * Commands to print data to the database
   */


  /**
   * Writes new data to JSON file or replaces existing data
   * @param {String} key Name of key
   * @param {Object|Date|String|Array|null} value The value corresponding to the typed key
   * @param {String} fileName File name (Optional)
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

  set(key, value, fileName = this.DEFAULT_FILE_NAME) {
    if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput)
    if (value === undefined) throw new DatabaseError("value value is missing", errorCodes.missingInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      dosya[key] = value
      fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
      return dosya
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
   * Writes new multiple data to JSON file or replaces existing data
   * @param {Array<Array<String,any>>|Object<String,any>} keysAndValue Data to be written or changed
   * @param {String} fileName File name (Optional)
   * @return {Object}
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

  setMany(keysAndValue, fileName = this.DEFAULT_FILE_NAME) {
    if (!keysAndValue) throw new DatabaseError("keysAndValue value is missing", errorCodes.missingInput)
    if (!Array.isArray(keysAndValue) && Object.prototype.toString.call(keysAndValue) != "[object Object]") throw new DatabaseError("keysAndValue value must be an Array or Object type", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      if (Array.isArray(keysAndValue)) keysAndValue = Object.fromEntries(keysAndValue)
      dosya = { ...dosya, ...keysAndValue }
      fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
      return dosya
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
   * Deletes all data in the JSON file and writes the data you entered
   * @param {Object} input Data to be written to JSON file
   * @param {String} fileName File name (Optional)
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
   * ], "database/fearless.json")
   */

  setFile(input, fileName = this.DEFAULT_FILE_NAME) {
    if (!input) throw new DatabaseError("input value is missing", errorCodes.missingInput)
    if (!Array.isArray(input) && Object.prototype.toString.call(input) != "[object Object]") throw new DatabaseError("input value must be an Array or Object type", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      if (Array.isArray(input)) input = Object.fromEntries(input)
      fs.writeFileSync(`${fileName}.json`, JSON.stringify(input, null, 2))
      return input
    } catch (e) {
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
   * Commands to pull data from database
   */


  /**
  * Pulls specified data from JSON file
  * @param {String} key Name of key
  * @param {any} defaultValue If there is no such data, the default data to return
  * @param {String} fileName File name (Optional)
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

  get(key, defaultValue = undefined, fileName = this.DEFAULT_FILE_NAME) {
    if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return key in dosya ? dosya[key] : defaultValue
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
  * Pulls the key corresponding to the specified value from the JSON file
  * @param {Array|Object|String|null|Number} value Name of value
  * @param {String} fileName File name (Optional)
  * @return {Object}
  * @example
  * 
  * // First, let's print some data to the database
  * Database.set("hello", "World") // { hello: "World" }
  * 
  * // If there is a value named "World" in the database, it returns that data
  * Database.getValue("World") // "hello"
  * 
  * // If there is no data to return, it returns undefined by default
  * Database.getValue("hello") // undefined
  * 
  * // If there is no data to return, it returns the data you entered
  * Database.getValue("hello", "There is no such data!") // "There is no such data!"
  */

  getValue(value, defaultValue = undefined, fileName = this.DEFAULT_FILE_NAME) {
    if (!value) throw new DatabaseError("value value is missing", errorCodes.missingInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return Object.entries(dosya).find(([key, value_1]) => sameValue(value, value_1))?.[0] ?? defaultValue
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }

  /**
    * Pulls keys corresponding to specified value values from JSON file
    * @param {Array} values Values
    * @param {any} defaultValue Default data to be returned if no data is available
    * @param {String} fileName File name (Optional)
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
    * )
    * 
    * // If you only want to retrieve a single data, use the .getValue() command
    * Database.getValue("World") // "hello"
    * 
    * // Enter values in array to pull multiple data
    * Database.getManyValue(["World", "King", ["i lost.."]]) // ["hello", "ali", "ilost"]
    * 
    * // Returns an Array if at least 1 of the values you entered were found
    * Database.getManyValue([["i lost.."], "alisa", "fear"]) // ["ilost", undefined, undefined]
    * 
    * // Returns the value you entered if none of the values you entered were found
    * Database.getManyValue(["ali", "test"], "No data found!") // "No data found!"
    */

  getManyValue(values, defaultValue = [], fileName = this.DEFAULT_FILE_NAME) {
    if (!values) throw new DatabaseError("values value is missing", errorCodes.missingInput)
    if (typeof values == "string") return this.getValue(values, (Array.isArray(defaultValue) && defaultValue.length == 0) ? undefined : defaultValue, fileName)
    if (!Array.isArray(values)) throw new DatabaseError("values value must be an Array", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      let ent = Object.entries(dosya)
      let newArray = values.map(value => ent.find(([key, value_1]) => sameValue(value, value_1))?.[0])
      return newArray.filter(a => a !== undefined).length ? newArray : defaultValue
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
    * JSON dosyasından belirtilen verileri çeker
    * @param {Array<String>} keys Keys
    * @param {any} defaultValue Default data to be returned if no data is available
    * @param {String} fileName File name (Optional)
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
    * )
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

  getMany(keys, defaultValue = {}, fileName = this.DEFAULT_FILE_NAME) {
    if (!keys) throw new DatabaseError("keys value is missing", errorCodes.missingInput)
    if (typeof keys == "string") return this.get(keys, (Object.prototype.toString.call(defaultValue) == "[object Object]" && Object.keys(defaultValue).length == 0) ? undefined : defaultValue, fileName)
    if (!Array.isArray(keys)) throw new DatabaseError("keys value must be an Array", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      let obj = {}
      keys.forEach(key => obj[key] = dosya[key])
      return Object.entries(obj).length ? obj : defaultValue
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
   * Pulls all data from JSON file
   * @param {String} fileName File name (Optional)
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
   * )
   * 
   * // Use this command to pull all data
   * Database.getAll() // { "ali": "King", "hello": "World", "umm": "Are you there?", "ilost": ["i lost.."] }
   * 
   * // If you want to pull data from another file, enter the path of that file
   * Database.getAll("so a filename.json")
   */

  getAll(fileName = this.DEFAULT_FILE_NAME) {
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return dosya
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
     * Pulls specified data from JSON file 
     * @param {String} key Name of key
     * @param {any} defaultValue If there is no such data, the default data to return
     * @param {String} fileName File name (Optional)
     * @return {any|undefined}
     * @example
     * 
     * // First, let's print some data to the database
     * Database.set("hello", "World") // { hello: "World" }
     * 
     * // If there is a key named "hello" in the database, it returns that data
     * Database.fetch("hello") // "World"
     * 
     * // If there is no data to return, it returns undefined by default
     * Database.fetch("hello3") // undefined
     * 
     * // If there is no data to return, it returns the data you entered
     * Database.fetch("hello3", "There is no such data!") // "There is no such data!"
     */

  fetch(key, defaultValue = undefined, fileName = this.DEFAULT_FILE_NAME) {
    return this.get(key, defaultValue, fileName)
  }



  /**
  * Pulls data corresponding to specified data from JSON file
  * @param {Array|Object|String|null|Number} value Name of value
  * @param {String} fileName File name (Optional)
  * @return {Object}
  * @example
  * 
  * // First, let's print some data to the database
  * Database.set("hello", "World") // { hello: "World" }
  * 
  * // If there is a value named "hello" in the database, it returns that data
  * Database.fetchValue("World") // "hello"
  * 
  * // If there is no data to return, it returns undefined by default
  * Database.fetchValue("hello") // undefined
  * 
  * // If there is no data to return, it returns the data you entered
  * Database.fetchValue("hello", "There is no such data!") // "There is no such data!"
  */

  fetchValue(value, defaultValue = undefined, fileName = this.DEFAULT_FILE_NAME) {
    return this.getValue(value, defaultValue, fileName)
  }



  /**
    * Pulls keys corresponding to specified value values from JSON file
    * @param {Array} values Values
    * @param {any} defaultValue Default data to be returned if no data is available
    * @param {String} fileName File name (Optional)
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
    * )
    * 
    * // If you only want to retrieve a single data, use the .getValue() command
    * Database.getValue("World") // "hello"
    * 
    * // Enter values in array to pull multiple data
    * Database.fetchManyValue(["World", "King", ["i lost.."]]) // ["hello", "ali", "ilost"]
    * 
    * // Returns an Array if at least 1 of the values you entered were found
    * Database.fetchManyValue([["i lost.."], "alisa", "fear"]) // ["ilost", undefined, undefined]
    * 
    * // Returns the value you entered if none of the values you entered were found
    * Database.fetchManyValue(["ali", "test"], "No data found!") // "No data found!"
    */

  fetchManyValue(values, defaultValue = [], fileName = this.DEFAULT_FILE_NAME) {
    return this.getManyValue(values, defaultValue, fileName)
  }



  /**
    * JSON dosyasından belirtilen verileri çeker
    * @param {Array<String>} keys Keys
    * @param {any} defaultValue Default data to be returned if no data is available
    * @param {String} fileName File name (Optional)
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
    * )
    * 
    * // If you only want to get a single piece of data, use the .get() command
    * Database.get("hello") // "World"
    * 
    * // Enter the names of the keys in the array to pull multiple data
    * Database.fetchMany(["hello", "ali", "umm"]) // { hello: "World", ali: "King", umm: "Are you there?" }
    * 
    * // Returns an Array if at least 1 of the values you entered were found
    * Database.fetchMany(["hello", "alisa", "fear"]) // { hello: "World" }
    * 
    * // Returns the value you entered if none of the values you entered were found
    * Database.fetchMany(["ali", "test"], "No data found!") // "No data found!"
    */

  fetchMany(keys, defaultValue = undefined, fileName = this.DEFAULT_FILE_NAME) {
    return this.getMany(keys, defaultValue, fileName)
  }



  /**
   * Pulls all data from JSON file
   * @param {String} fileName File name (Optional)
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
   * )
   * 
   * // Use this command to pull all data
   * Database.getAll() // { "ali": "King", "hello": "World", "umm": "Are you there?", "ilost": ["i lost.."] }
   * 
   * // If you want to pull data from another file, enter the path of that file
   * Database.getAll("so a filename.json")
   */

  fetchAll(fileName = this.DEFAULT_FILE_NAME) {
    return this.getAll(fileName)
  }



  /**
   * Pulls all data from JSON file
   * @param {String} fileName File name (Optional)
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
   * )
   * 
   * // Use this command to pull all data
   * Database.getAll() // { "ali": "King", "hello": "World", "umm": "Are you there?", "ilost": ["i lost.."] }
   * 
   * // If you want to pull data from another file, enter the path of that file
   * Database.getAll("so a filename.json")
   */

  all(fileName = this.DEFAULT_FILE_NAME) {
    return this.getAll(fileName)
  }



  /**
   * Commands to check data from database
   */


  /**
  * Checks if the specified key from the JSON file exists
  * @param {String} key Name of key
  * @param {String} fileName File name (Optional)
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

  has(key, fileName = this.DEFAULT_FILE_NAME) {
    if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return key in dosya
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
  * Checks whether value corresponds to the specified value from the JSON file
  * @param {Array|Object|String|null|Number} value Name of value
  * @param {String} fileName File name (Optional)
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

  hasValue(value, fileName = this.DEFAULT_FILE_NAME) {
    if (!value) throw new DatabaseError("value value is missing", errorCodes.missingInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return Object.values(dosya).some(value_1 => sameValue(value, value_1))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
    * Checks if there is at least one value corresponding to the specified value from the JSON file
    * @param {Array} values Values
    * @param {String} fileName File name (Optional)
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
    * )
    * 
    * // If you only want to retrieve a single data, use the .hasValue() command
    * Database.hasValue("World") // true
    * 
    * // Enter values in array to pull multiple data
    * Database.hasSomeValue(["World", "o7", "String"]) // true
    * 
    * // Returns true if at least 1 of the values you entered were found
    * Database.hasSomeValue([[1, 2, 3], "King", "fear"]) // true
    * 
    * // Returns false if none of the values you entered were found
    * Database.hasSomeValue(["ali", "test"]) // false
    */

  hasSomeValue(values, fileName = this.DEFAULT_FILE_NAME) {
    if (!values) throw new DatabaseError("values value is missing", errorCodes.missingInput)
    if (typeof values == "string") return this.hasValue(values, fileName)
    if (!Array.isArray(values)) throw new DatabaseError("values value must be an Array", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      let ent = Object.entries(dosya)
      return values.some(value => ent.some(([key, value_1]) => sameValue(value, value_1)))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
    * Checks if all value corresponding to specified value from JSON file exists
    * @param {Array} values Values
    * @param {String} fileName File name (Optional)
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
    * )
    * 
    * // If you only want to retrieve a single data, use the .hasValue() command
    * Database.hasValue("World") // true
    * 
    * // Enter values in array to pull multiple data
    * Database.hasEveryValue(["King", "World", "Are you there?"]) // true
    * 
    * // Returns false if at least 1 of the value you entered is not found
    * Database.hasEveryValue([[1, 2, 3], "alisa", "fear"]) // false
    */

  hasEveryValue(values, fileName = this.DEFAULT_FILE_NAME) {
    if (!values) throw new DatabaseError("values value is missing", errorCodes.missingInput)
    if (typeof values == "string") return this.hasValue(values, fileName)
    if (!Array.isArray(values)) throw new DatabaseError("values value must be an Array", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      let ent = Object.entries(dosya)
      return values.every(value => ent.some(([key, value_1]) => sameValue(value, value_1)))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
    * Checks if at least one of the specified key values from the JSON file exists
    * @param {Array} keys Keys
    * @param {String} fileName File name (Optional)
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
    * )
    * 
    * // If you only want to check one piece of data, use the .has() command
    * Database.has("hello") // true
    * 
    * // Enter the names of the keys in the array to check multiple data
    * Database.hasSome(["hello", "Alisa", "Fearless"]) // true
    * 
    * // Returns false if none of the values you entered were found
    * Database.hasSome(["alisa", "test"]) // false
    */

  hasSome(keys, fileName = this.DEFAULT_FILE_NAME) {
    if (!keys) throw new DatabaseError("keys value is missing", errorCodes.missingInput)
    if (typeof keys == "string") return this.has(keys, fileName)
    if (!Array.isArray(keys)) throw new DatabaseError("keys value must be an Array", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return keys.some(key => key in dosya)
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
   * Checks if all of the key values specified from the JSON file are present
   * @param {Array} keys Keys
   * @param {String} fileName File name (Optional)
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
   * )
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

  hasAll(keys, fileName = this.DEFAULT_FILE_NAME) {
    if (!keys) throw new DatabaseError("keys value is missing", errorCodes.missingInput)
    if (typeof keys == "string") return this.has(keys, fileName)
    if (!Array.isArray(keys)) throw new DatabaseError("keys value must be an Array", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return keys.every(key => key in dosya)
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
  * Checks if the specified data from the JSON file exists
  * @param {String} key Name of key
  * @param {String} fileName File name (Optional)
  * @return {Boolean}
  * @example
  * 
  * // First, let's print some data to the database
  * Database.set("hello", "World") // { hello: "World" }
  * 
  * // It returns true if there is a data named "hello" in the database
  * Database.exists("hello") // true
  * 
  * // Returns false if there is no data to return
  * Database.exists("hello3") // false
  */

  exists(key, fileName = this.DEFAULT_FILE_NAME) {
    return this.has(key, fileName)
  }



  /**
  * Checks whether value corresponds to the specified data from the JSON file
  * @param {Array|Object|String|null|Number} value Name of value
  * @param {String} fileName File name (Optional)
  * @return {Boolean}
  * @example
  * 
  * // First, let's print some data to the database
  * Database.set("hello", "World") // { hello: "World" }
  * 
  * // It returns true if there is a value named "World" in the database
  * Database.existsValue("World") // true
  * 
  * // Returns false if there is no value named "World"
  * Database.existsValue("hello") // false
  */

  existsValue(value, fileName = this.DEFAULT_FILE_NAME) {
    return this.hasValue(value, fileName)
  }



  /**
    * Checks if there is at least one value corresponding to the specified value from the JSON file
    * @param {Array} values Values
    * @param {String} fileName File name (Optional)
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
    * )
    * 
    * // If you only want to retrieve a single data, use the .hasValue() command
    * Database.hasValue("World") // true
    * 
    * // Enter values in array to pull multiple data
    * Database.existsSomeValue(["World", "o7", "String"]) // true
    * 
    * // Returns true if at least 1 of the values you entered were found
    * Database.existsSomeValue([[1, 2, 3], "alisa", "King"]) // true
    * 
    * // Returns false if none of the values you entered were found
    * Database.existsSomeValue(["ali", "test"]) // false
    */

  existsSomeValue(values, fileName = this.DEFAULT_FILE_NAME) {
    return this.hasSomeValue(values, fileName)
  }



  /**
    * Checks if all value corresponding to specified value from JSON file exists
    * @param {Array} values Values
    * @param {String} fileName File name (Optional)
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
    * )
    * 
    * // If you only want to retrieve a single data, use the .hasValue() command
    * Database.hasValue("World") // true
    * 
    * // Enter values in array to pull multiple data
    * Database.existsEveryValue(["King", "World", "Are you there?"]) // true
    * 
    * // Returns false if at least 1 of the value you entered is not found
    * Database.existsEveryValue([[1, 2, 3], "alisa", "fear"]) // false
    */

  existsEveryValue(values, fileName = this.DEFAULT_FILE_NAME) {
    return this.hasEveryValue(values, fileName)
  }



  /**
    * Checks if at least one of the specified data from the JSON file exists
    * @param {Array} keys Keys
    * @param {String} fileName File name (Optional)
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
    * )
    * 
    * // If you only want to check one piece of data, use the .has() command
    * Database.has("hello") // true
    * 
    * // Enter the names of the keys in the array to check multiple data
    * Database.existsSome(["hello", "Alisa", "Fearless"]) // true
    * 
    * // Returns false if none of the values you entered were found
    * Database.existsSome(["alisa", "test"]) // false
    */

  existsSome(keys, fileName = this.DEFAULT_FILE_NAME) {
    return this.hasSome(keys, fileName)
  }



  /**
    * Checks if at least one of the specified data from the JSON file exists
    * @param {Array} keys Keys
    * @param {String} fileName File name (Optional)
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
    * )
    * 
    * // If you only want to check one piece of data, use the .has() command
    * Database.has("hello") // true
    * 
    * // Enter the names of the keys in the array to check multiple data
    * Database.hasMany(["hello", "Alisa", "Fearless"]) // true
    * 
    * // Returns false if none of the values you entered were found
    * Database.hasMany(["alisa", "test"]) // false
    */

  hasMany(keys, fileName = this.DEFAULT_FILE_NAME) {
    return this.hasSome(keys, fileName)
  }



  /**
   * JSON dosyasından belirtilen verilerin hepsinin olup olmadığını kontrol eder
   * @param {Array} keys Keys
   * @param {String} fileName File name (Optional)
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
   * )
   * 
   * // If you only want to check one piece of data, use the .has() command
   * Database.has("hello") // true
   * 
   * // Enter the names of the keys in the array to check multiple data
   * Database.existsAll(["ali", "hello", "umm"]) // true
   * 
   * // Returns false if at least one of the key values you entered does not exist
   * Database.existsAll(["hello", "Alisa", "test"]) // false
   */

  existsAll(keys, fileName = this.DEFAULT_FILE_NAME) {
    return this.hasAll(keys, fileName)
  }



  /**
   * Database's functional commands
   */


  /**
   * Returns the first data you define from the JSON file 
   * @param {(element: { key: String, value: Array|Object|String|null|Number}, index: Number, array: Array) => {}} callback for the find function
   * @param {String} fileName File name (Optional)
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
   * )
   * 
   * // Then let's return the data we want using the command
   * Database.find(callback => {
   * 
   *   // Returns the first data containing the word "ali" in the key data of the object
   *   return callback.key.includes("ali")
   * 
   * }) // { ali: "King" }
   * 
   * // This is another way of calling
   * Database.find(callback => {
   * 
   *   // Returns the first data of the object whose value is Array
   *   return Array.isArray(callback.value)
   * 
   * }) // undefined
   */

  find(callback, fileName = this.DEFAULT_FILE_NAME) {
    if (typeof callback != "function") throw new DatabaseError("callback value must be a function value", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      let arrayObject = Object.entries(dosya).map(a => ({ key: a[0], value: a[1] })).find(callback)
      return { [arrayObject.key]: arrayObject.value }
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
   * Returns the data you define from the JSON file, filtering it 
   * @param {(element: { key: String, value: Array|Object|String|null|Number}, index: Number, array: Array) => {}} callback for the filter function
   * @param {String} fileName File name (Optional)
   * @return {Array}
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
   * )
   * 
   * // Then let's filter the data we want using the command
   * Database.filter(callback => {
   * 
   *   // Filter data containing the word "ali" in the key data of the object
   *   return callback.key.includes("ali")
   * 
   * }) // [{ ali: "King" }, { hello: "World" }]
   * 
   * // This is another way of calling
   * Database.filter(callback => {
   * 
   *   // Returns data whose object's value is Array
   *   return Array.isArray(callback.value)
   * 
   * }) // []
   */

  filter(callback, fileName = this.DEFAULT_FILE_NAME) {
    if (typeof callback != "function") throw new DatabaseError("callback value must be a function value", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return Object.entries(dosya).map(a => ({ key: a[0], value: a[1] })).filter(callback).map(object => ({ [object.key]: object.value }))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
   * Returns data containing the word you entered from the JSON file 
   * @param {String} key for the filter function
   * @param {String} fileName File name (Optional)
   * @return {Array}
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
   * )
   * 
   * // Then let's filter the data we want using the command
   * Database.includes("ali") // [{ ali: "King" }, { aliv2: ["heyy"] }]
   */

  includes(key, fileName = this.DEFAULT_FILE_NAME) {
    if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput)
    return this.filter(object => object.key.includes(key), fileName)
  }



  /**
   * Returns data starting with the word you entered from the JSON file 
   * @param {String} key for the filter function
   * @param {String} fileName File name (Optional)
   * @return {Array}
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
   * )
   * 
   * // Then let's filter the data we want using the command
   * Database.startsWith("ali") // [{ ali: "King" }, { aliv2: ["heyy"] }]
   */

  startsWith(key, fileName = this.DEFAULT_FILE_NAME) {
    if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput)
    return this.filter(object => object.key.startsWith(key), fileName)
  }



  /**
   * Checks if at least one of the data you defined from the JSON file exists
   * @param {(element: { key: String, value: Array|Object|String|null|Number}, index: Number, array: Array) => {}} callback for some function
   * @param {String} fileName File name (Optional)
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
   * )
   * 
   * // Then let's check the data we want using the command
   * Database.some(callback => {
   * 
   *   // Checks whether there is a word containing the word "ali" in the key data of the object
   *   return callback.key.includes("ali")
   * 
   * }) // true
   * 
   * // This is another way of calling
   * Database.some(callback => {
   * 
   *   // It checks whether the object's value data is Array or not
   *   return Array.isArray(callback.value)
   * 
   * }) // false
   */

  some(callback, fileName = this.DEFAULT_FILE_NAME) {
    if (typeof callback != "function") throw new DatabaseError("callback value must be a function value", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return Object.entries(dosya).map(a => ({ key: a[0], value: a[1] })).some(callback)
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
   * Checks if all of the data you defined from the JSON file exists
   * @param {(element: { key: String, value: Array|Object|String|null|Number}, index: Number, array: Array) => {}} callback for every function
   * @param {String} fileName File name (Optional)
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
   * )
   * 
   * // Then let's check the data we want using the command
   * Database.every(callback => {
   * 
   *   // Checks whether there is a word containing the word "ali" in each key data of the object
   *   return callback.key.includes("ali")
   * 
   * }) // false
   * 
   * // This is another way of calling
   * Database.every(callback => {
   * 
   *   // Checks if the object's key data is a font
   *   return typeof callback.key == "string"
   * 
   * }) // true
   */

  every(callback, fileName = this.DEFAULT_FILE_NAME) {
    if (typeof callback != "function") throw new DatabaseError("callback value must be a function value", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return Object.entries(dosya).map(a => ({ key: a[0], value: a[1] })).every(callback)
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
   * Deletes the first data you defined from the JSON file 
   * @param {(element: { key: String, value: Array|Object|String|null|Number}, index: Number, array: Array) => {}} callback for the find function
   * @param {String} fileName File name (Optional)
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
   * )
   * 
   * // Then let's show the data we want to delete using the command
   * Database.find(callback => {
   * 
   *   // Find and delete the first data containing the word "ali" in the key data of the object
   *   return callback.key.includes("ali")
   * 
   * }) // { ali: "King" }
   * 
   * // File no longer contains "ali" data
   */

  findAndDelete(callback, fileName = this.DEFAULT_FILE_NAME) {
    if (typeof callback != "function") throw new DatabaseError("callback value must be a function value", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      let arrayDosya = Object.entries(dosya).map(a => ({ key: a[0], value: a[1] })).find(callback)
      if (arrayDosya) {
        delete dosya[arrayDosya.key]
        fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
      }
      return arrayDosya
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
   * Deletes all the data you defined from the JSON file
   * @param {(element: { key: String, value: Array|Object|String|null|Number}, index: Number, array: Array) => {}} callback for the filter function
   * @param {String} fileName File name (Optional)
   * @return {Array}
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
   * )
   * 
   * // Then let's show the data we want using the command
   * Database.filterAndDelete(callback => {
   * 
   *   // Find and delete all data containing the word "ali" in the key data of the object
   *   return callback.key.includes("ali")
   * 
   * }) // [{ ali: "King" }, { aliv2: ["heyy"] }]
   * 
   * // File no longer contains "ali" and "aliv2" data
   */

  filterAndDelete(callback, fileName = this.DEFAULT_FILE_NAME) {
    if (typeof callback != "function") throw new DatabaseError("callback value must be a function value", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      let arrayDosya = Object.entries(dosya).map(a => ({ key: a[0], value: a[1] })).filter(callback)
      if (arrayDosya.length) {
        arrayDosya.forEach(object => delete dosya[object.key])
        fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
      }
      return arrayDosya
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
   * Commands to delete data from database
   */


  /**
     * Delete data from JSON file 
     * @param {String} key The name of the key to be deleted
     * @param {String} fileName File name (Optional)
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
     * )
     * 
     * // Then, let's enter the data we want to be deleted using the command
     * Database.delete("hello") { hello: "World" }
     */

  delete(key, fileName = this.DEFAULT_FILE_NAME) {
    if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      let veri = dosya[key]
      if (!veri) return undefined
      delete dosya[key]
      fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
      return veri
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
     * You delete multiple data from JSON file 
     * @param {Array} keys Keys
     * @param {String} fileName File name (Optional)
     * @return {Array}
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
     * )
     * 
     * // Then let's enter the keys we want to be deleted using the command
     * Database.deleteMany(["ali", "hello", "umm"]) // "ali", "hello" and "umm" data deleted
     */

  deleteMany(keys, fileName = this.DEFAULT_FILE_NAME) {
    if (!keys) throw new DatabaseError("keys value is missing", errorCodes.missingInput)
    if (typeof keys == "string") return this.delete(keys, fileName)
    if (!Array.isArray(keys)) throw new DatabaseError("keys value must be an Array", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      let array = []
      keys.forEach(key => {
        let veri = dosya[key]
        if (veri) {
          array.push({ [key]: veri })
          delete dosya[key]
        }
      })
      return array
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
     * You delete all the data in the JSON file 
     * @param {String} fileName File name (Optional)
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
     * )
     * 
     * // Then let's delete all the data using the command
     * Database.deleteAll() // {}
     */

  deleteAll(fileName = this.DEFAULT_FILE_NAME) {
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      fs.writeFileSync(`${fileName}.json`, "{}")
      return {}
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
   * Database's Array methods
   */


  /**
     * Adds a new data to the end of the Array of data in the JSON file
     * @param {String} key Name of key
     * @param {Array|Object|String|null|Number} item Data to add 
     * @param {String} fileName File name (Optional)
     * @return {Array}
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
     * )
     * 
     * // Then let's add a new data to the end of the Array data using the command
     * Database.push("ilost", "control") // ["i lost..", "control"]
     * 
     * // Now in the "ilost" data contains the following data ["i lost..", "control"]
     */

  push(key, item, fileName = this.DEFAULT_FILE_NAME) {
    if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput)
    if (item === undefined) throw new DatabaseError("item value is missing", errorCodes.missingInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
    let veri = dosya[key]
    if (!veri) veri = [item]
    else if (!Array.isArray(veri)) throw new DatabaseError("The value of the data must be an Array value", errorCodes.notArray)
    else veri.push(item)
    dosya[key] = veri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return veri
  }



  /**
     * Adds multiple data to the end of Array of data in JSON file
     * @param {String} key Name of key
     * @param {Array} array Data to add 
     * @param {String} fileName File name (Optional)
     * @return {Array}
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
     * )
     * 
     * // Then let's add a new data to the end of the Array data using the command
     * Database.pushAll("ilost", ["control", "brooo", "..."]) // ["i lost..", "control", "brooo", "..."]
     * 
     * // Now in the "ilost" data contains the following data ["i lost..", "control", "brooo", "..."]
     */

  pushAll(key, array, fileName = this.DEFAULT_FILE_NAME) {
    if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput)
    if (!array) throw new DatabaseError("array value is missing", errorCodes.missingInput)
    if (typeof array == "string") return this.push(key, array, fileName)
    if (!Array.isArray(array)) throw new DatabaseError("array'in value must be an Array", errorCodes.notArray)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
    let veri = dosya[key]
    if (!veri) veri = array
    else if (!Array.isArray(veri)) throw new DatabaseError("The value of the data must be an Array value", errorCodes.notArray)
    else veri.push(...array)
    dosya[key] = veri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return veri
  }



  /**
     * Deletes the data in the JSON file at the very end of the Array
     * @param {String} key Name of key
     * @param {Number} number Number of data to be deleted 
     * @param {String} fileName File name (Optional)
     * @return {Array}
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
     * )
     * 
     * // Then let's delete the data at the end of the Array data using the command
     * Database.pop("ilost") // ["broo"]
     * 
     * // If you want to delete more than one data, enter the number of data to be deleted
     * Database.pop("ilost", 2) // ["i cry", "broo"]
     * 
     * // Now in the "ilost" data the following data ["i lost..", "this life"]
     */

  pop(key, number = 1, fileName = this.DEFAULT_FILE_NAME) {
    if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput)
    if (number == 0) return []
    number = Number(number)
    if (isNaN(number)) throw new DatabaseError("number value must be a number value", errorCodes.notNumber)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
    let veri = dosya[key]
    if (!veri) return []
    if (!Array.isArray(veri)) throw new DatabaseError("The value of the data must be an Array value", errorCodes.notArray)
    let newVeri = []
    let deletedValues = []
    for (let i = 0; i < veri.length; i++) {
      if (veri.length - i <= number) deletedValues.push(veri[i])
      else newVeri.push(veri[i])
    }
    dosya[key] = newVeri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return deletedValues
  }



  /**
     * Adds a new data to the beginning of the Array of data in the JSON file
     * @param {String} key Name of key
     * @param {Array|Object|String|null|Number} item Data to add 
     * @param {String} fileName File name (Optional)
     * @return {Array}
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
     * )
     * 
     * // Then let's add a new data to the beginning of the Array data using the command
     * Database.unshift("ilost", "i hate") // ["i hate", "i lost.."]
     * 
     * // Now in the "ilost" data the following data ["i hate", "i lost.."]
     */

  unshift(key, item, fileName = this.DEFAULT_FILE_NAME) {
    if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput)
    if (item === undefined) throw new DatabaseError("item value is missing", errorCodes.missingInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
    let veri = dosya[key]
    if (!veri) veri = [item]
    else if (!Array.isArray(veri)) throw new DatabaseError("The value of the data must be an Array value", errorCodes.notArray)
    else veri.unshift(item)
    dosya[key] = veri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return veri
  }



  /**
     * Adds multiple data to the top of Array of data in JSON file
     * @param {String} key Name of key
     * @param {Array} array Data to add 
     * @param {String} fileName File name (Optional)
     * @return {Array}
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
     * )
     * 
     * // Then let's add a new data to the beginning of the Array data using the command
     * Database.unshiftAll("ilost", ["i hate", "this life", "man"]) // ["i hate", "this life", "man", "i lost.."]
     * 
     * // Now in the "ilost" data the following data ["i hate", "this life", "man", "i lost.."]
     */

  unshiftAll(key, array, fileName = this.DEFAULT_FILE_NAME) {
    if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput)
    if (!array) throw new DatabaseError("array value is missing", errorCodes.missingInput)
    if (typeof array == "string") return this.unshift(key, array, fileName)
    if (!Array.isArray(array)) throw new DatabaseError("array'in value must be an Array", errorCodes.notArray)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
    let veri = dosya[key]
    if (!veri) veri = array
    else if (!Array.isArray(veri)) throw new DatabaseError("The value of the data must be an Array value", errorCodes.notArray)
    else veri.unshift(...array)
    dosya[key] = veri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return veri
  }



  /**
     * Erases the initial data of the Array of data in the JSON file
     * @param {String} key Name of key
     * @param {Number} number Number of data to be deleted 
     * @param {String} fileName File name (Optional)
     * @return {Array}
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
     * )
     * 
     * // Then let's delete the first data of the Array data using the command
     * Database.shift("ilost") // ["i lost.."]
     * 
     * // If you want to delete more than one data, enter the number of data to be deleted
     * Database.shift("ilost", 2) // ["i lost..", "this life"]
     * 
     * // Now in the "ilost" data contains the following data ["i cry", "broo"]
     */

  shift(key, number = 1, fileName = this.DEFAULT_FILE_NAME) {
    if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput)
    if (number == 0) return []
    number = Number(number)
    if (isNaN(number)) throw new DatabaseError("number value must be a number value", errorCodes.notNumber)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
    let veri = dosya[key]
    if (!veri) return []
    if (!Array.isArray(veri)) throw new DatabaseError("The value of the data must be an Array value", errorCodes.notArray)
    let newVeri = []
    let deletedValues = []
    for (let i = 0; i < veri.length; i++) {
      if (i < number) deletedValues.push(veri[i])
      else newVeri.push(veri[i])
    }
    dosya[key] = newVeri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return deletedValues
  }



  /**
   * Database's math operations commands
   */


  /**
     * Increments the value of the data in the JSON file
     * @param {String} key Name of key
     * @param {Number} number Number to add to data 
     * @param {String} fileName File name (Optional)
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
     * )
     * 
     * // Then let's increase its value using the command
     * Database.add("heart", 15) // 30
     * 
     * // Now in the following data is written in the "heart" data 30
     */

  add(key, number = 1, fileName = this.DEFAULT_FILE_NAME) {
    if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput)
    if (!number && number != 0) throw new DatabaseError("number value is missing", errorCodes.missingInput)
    number = Number(number)
    if (isNaN(number)) throw new DatabaseError("number value must be a number value", errorCodes.notNumber)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
    let veri = dosya[key]
    if (!veri) veri = number
    else if (isNaN(veri)) throw new DatabaseError("The value of the data must be a Number", errorCodes.notNumber)
    else veri += number
    dosya[key] = veri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return number
  }



  /**
     * Decreases the value of the data in the JSON file
     * @param {String} key Name of key
     * @param {Number} number Number to subtract from data 
     * @param {Boolean} goToNegative Can the resulting number be less than 0?
     * @param {String} fileName File name (Optional)
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
     * )
     * 
     * // Then let's decrease its value using the command
     * Database.substr("heart", 5) // 10
     * 
     * // Now in the following data is written in the "heart" data 10
     */

  substr(key, number = 1, goToNegative = true, fileName = this.DEFAULT_FILE_NAME) {
    if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput)
    if (!number && number != 0) throw new DatabaseError("number value is missing", errorCodes.missingInput)
    number = Number(number)
    if (isNaN(number)) throw new DatabaseError("number value must be a number value", errorCodes.notNumber)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
    let veri = dosya[key]
    if (!veri) veri = 0
    else if (isNaN(veri)) throw new DatabaseError("The value of the data must be a Number", errorCodes.notNumber)
    else veri -= number
    if (veri < 0 && !goToNegative) throw new DatabaseError("The value of the data must be a Number", errorCodes.negativeNumber)
    dosya[key] = veri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return number
  }



  /**
     * Multiplies the value of the data in the JSON file by the value you enter
     * @param {String} key Name of key
     * @param {Number} number The number to be multiplied by the data
     * @param {String} fileName File name (Optional)
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
     * )
     * 
     * // Then multiply its value by the number using the command
     * Database.multi("heart", 3) // 45
     * 
     * // Now in the following data is written in the "heart" data 45
     */

  multi(key, number, fileName = this.DEFAULT_FILE_NAME) {
    if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput)
    if (!number && number != 0) throw new DatabaseError("number value is missing", errorCodes.missingInput)
    number = Number(number)
    if (isNaN(number)) throw new DatabaseError("number value must be a number value", errorCodes.notNumber)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
    let veri = dosya[key]
    if (!veri) veri = number
    else if (isNaN(veri)) throw new DatabaseError("The value of the data must be a Number", errorCodes.notNumber)
    else veri *= number
    dosya[key] = veri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return number
  }



  /**
     * Divides the value of the data in the JSON file by the value you enter
     * @param {String} key Name of key
     * @param {Number} number Number to divide by data 
     * @param {Boolean} goToInteger Can the resulting number be an integer?
     * @param {String} fileName File name (Optional)
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
     * )
     * 
     * // Then let's divide its value by number using the command
     * Database.division("heart", 3) // 5
     * 
     * // Now in the following data is written in the "heart" data 5
     */

  division(key, number, goToInteger = false, fileName = this.DEFAULT_FILE_NAME) {
    if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput)
    if (!number) throw new DatabaseError("number value is missing or equal to 0", errorCodes.missingInput)
    number = Number(number)
    if (isNaN(number)) throw new DatabaseError("number value must be a number value", errorCodes.notNumber)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
    let veri = dosya[key]
    if (!veri) veri = 1
    else if (isNaN(veri)) throw new DatabaseError("The value of the data must be a Number", errorCodes.notNumber)
    else goToInteger ? (veri /= number) : (veri /= number).toFixed(0)
    dosya[key] = veri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return number
  }



  /**
   * Commands to call all data in the database file
   */


  /**
   * Pulls all data from JSON file and returns it in JSON format
   * @param {String} fileName File name (Optional)
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
   * )
   * 
   * // Use this command to pull all data
   * Database.toJSON() // { "ali": "King", "hello": World", "umm": "Are you there?", "ilost": ["i lost.."] }
   * 
   * // If you want to pull data from another file, enter the path of that file
   * Database.toJSON("so a filename.json")
   */

  toJSON(fileName = this.DEFAULT_FILE_NAME) {
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return dosya
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
   * Pulls all data from JSON file and returns it in Array format
   * @param {String} fileName File name (Optional)
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
   * )
   * 
   * // Use this command to pull all data
   * Database.toArray() 
   * // [["ali", "King"], ["hello", World"], ["umm", "Are you there?"], ["ilost", ["i lost.."]]]
   * 
   * // If you want to pull data from another file, enter the path of that file
   * Database.toArray("so a filename.json")
   */

  toArray(fileName = this.DEFAULT_FILE_NAME) {
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return Object.entries(dosya)
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
   * Commands to reset the database file
   */


  /**
      * Deletes the entire JSON file
      * @param {String} fileName File name (Optional)
      * @return {void}
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
      * )
      * 
      * // Then let's delete the file completely using the command
      * Database.destroy()
      * 
      * // The JSON file has now traveled to the infinities of the universe..
      */

  destroy(fileName = this.DEFAULT_FILE_NAME) {
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      fs.unlinkSync(`${fileName}.json`)
      return;
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
    * Deletes all data in the JSON file
    * @param {String} fileName File name (Optional)
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
    * )
    * 
    * // Then let's delete the data in the file using the command
    * Database.reset()
    * 
    * // JSON file now only prints "{}" data
    */

  reset(fileName = this.DEFAULT_FILE_NAME) {
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      fs.writeFileSync(`${fileName}.json`, "{}")
      return {}
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
   * Commands to create a new database file
   */


  /**
    * Creates a new JSON database file
    * @param {String} fileName File name (Optional)
    * @return {Object}
    * @example
    * 
    * // Let's delete the database first
    * Database.destroy()
    * 
    * // Then let's create a new file using the command
    * Database.create("alisa.json")
    * 
    * // If we want to print data in the file while creating it, let's write the data as the second parameter
    * Database.create("alisadb.json", { ali: "Adam" })
    * 
    * // If you want to set the file you created as the default file, type true last
    * Database.create("default.json", {}, true)
    */

  create(fileName = this.DEFAULT_FILE_NAME, file = {}, isDefaultFile = false) {
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    if (fs.existsSync(`${fileName}.json`)) throw new DatabaseError(`A file named ${fileName}.json already exists`, errorCodes.exists)
    if (Object.prototype.toString.call(file) != "[object Object]") throw new DatabaseError("file value must be an Object type", errorCodes.invalidInput)
    try {
      fs.writeFileSync(`${fileName}.json`, JSON.stringify(file, null, 2))
      if (isDefaultFile) this.DEFAULT_FILE_NAME = fileName
      return file
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
    * Clones a specific JSON database file
    * @param {String} cloneFileName The name of the file to be cloned
    * @param {String} fileName File name (Optional)
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
    * )
    * 
    * // Then let's command copy this JSON file to another JSON file
    * Database.clone("alisa.json")
    * 
    * // If you want, you can also enter the file name to be cloned
    * Database.clone("alisadb.json", "öylesine bir dosya ismi.json")
    */

  clone(cloneFileName, fileName = this.DEFAULT_FILE_NAME) {
    if (!cloneFileName) throw new DatabaseError("The name of the file to be cloned is missing", errorCodes.missingInput)
    if (typeof cloneFileName != "string") throw new DatabaseError("cloneFileName value must be a string", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    cloneFileName = cloneFileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`))
      fs.writeFileSync(`${cloneFileName}.json`, JSON.stringify(dosya, null, 2))
      return dosya
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }



  /**
   * Other commands of the database
   */


  /**
    * Returns the type of data in the JSON file
    * @param {String} key Name of key
    * @param {String} fileName File name (Optional)
    * @return {String}
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
    * )
    * 
    * // Sonra komutu kullanarak verinin hangi tip olduğunu görelim
    * Database.typeof("ali") // "string"
    * 
    * Database.typeof("ilost") // "array"
    */

  typeof(key, fileName = this.DEFAULT_FILE_NAME) {
    if (!key) throw new DatabaseError("key value is missing", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key value must be a string", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName value must be a string", errorCodes.invalidInput)
    fileName = fileName.replace(/\.json *$/m, "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      let veri = dosya[key]
      if (Array.isArray(veri)) return "array"
      return typeof veri
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`File ${fileName}.json not found!`, errorCodes.missingFile)
      throw new DatabaseError("An unknown error has occurred!", errorCodes.unknown)
    }
  }

}

export default Database
