const DatabaseError = require("./src/DatabaseError")
const errorCodes = require("./src/errorCodes")
const fs = require("fs")
const { version } = require("./package.json")

class Database {


  /**
   * Bunu sadece 1 kere tanımlamanız yeterlidir
   * @param {String} fileName Varsayılan dosyanın adı
   */

  constructor(fileName) {

    // Eğer kişi bir dosya ismi girmişse ve o dosyanın ismi yazı değerinde ise ve dosya ismi boş değil ise o dosya ismini varsayılan olarak kullanır
    this.DEFAULT_JSON_FILE_NAME = ((fileName && typeof fileName == "string" && fileName !== "") ? fileName.replace(".json", "") : "database")

    // Eğer öyle bir JSON dosyası yoksa oluşturur
    if (!fs.existsSync(`${this.DEFAULT_JSON_FILE_NAME}.json`)) fs.writeFileSync(`${this.DEFAULT_JSON_FILE_NAME}.json`, "{}")

  }



  /**
   * Database'nin sürüm versiyonu
   * @return {String}
   */

  get version() {
    return `v${version}`
  }




  /**
   * Database'in ana komutları
   */


  /**
   * JSON dosyasındaki bütün verilerin key'lerini döndürür
   * @param {String} fileName 
   * @return {Array<String>}
   */

  keys(fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return Object.keys(dosya)
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
   * JSON dosyasındaki bütün verilerin value değerlerini döndürür
   * @param {String} fileName 
   * @return {Array<any>}
   */

  values(fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return Object.values(dosya)
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
   * Database'ye veri yazdırma komutları
   */


  /**
   * JSON dosyasına yeni bir `veri yazar` veya olan `veriyi değiştirir`
   * @param {String} key Verinin adı
   * @param {Object|Date|String|Array|null} value Yazılan veriye karşılık gelen değer
   * @param {String} fileName Dosyanın adı (İsteğe göre)
   * @return {Object}
   * @example
   * 
   * // "hello" verisine karşılık "World!" verisini yazdırır
   * Database.set("hello", "World!") // { "hello": "World!" }
   * 
   * // ./test.json veri dosyasında "key" verisine karşılık "value" verisini yazdırır
   * Database.set("key", "value", "test") // { "key": "value!" }
   * 
   * // ./database/fearless.json veri dosyasında "Fearless" verisine karşılık "Crazy" verisini yazdırır
   * Database.set("Fearless", "Crazy", "database/fearless.json") // { "Fearless": "Crazy" }
   */

  set(key, value, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!key) throw new DatabaseError("key değeri eksik", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    if (!value && value === undefined) throw new DatabaseError("value değeri eksik", errorCodes.missingInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      dosya[key] = value
      fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
      return dosya
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
   * JSON dosyasına yeni birden çok `verileri yazar` veya olan `verileri değiştirir`
   * @param {Array<Array<String,any>>|Object<String,any>} keysAndValue Yazılacak veya değiştirilecek veriler
   * @param {String} fileName Dosyanın adı (İsteğe göre)
   * @return {Object}
   * @example
   * 
   * // Dosyaya birden çok veri yazdırmak için bu komutu kullanınız
   * Database.setMany(
   *  { 
   *   hello: "World!", 
   *   key: "value", 
   *   array: ["1", "2", "3"] 
   *  }
   * ) // { hello: "World!", key: "value", array: ["1", "2", "3"] })
   * 
   * // Başka bir dosyaya yazdırmak için 2. parametre olarak dosyanın yolunu giriniz
   * Database.setMany([
   * ["hello", "World!"], 
   * ["key", "value"], 
   * ["array", ["1", "2", "3"]]
   * ], "test") // { hello: "World!", key: "value", array: ["1", "2", "3"] }
   * 
   * // Dosyaya birden çok veri yazdırmak için Object veya Array değerleri giriniz
   * Database.setMany([
   * ["hello", "World!"], 
   * ["key", "value"], 
   * ["array", ["1", "2", "3"]]
   * ], "database/fearless.json") // { hello: "World!", key: "value", array: ["1", "2", "3"] }
   */

  setMany(keysAndValue, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!keysAndValue) throw new DatabaseError("keysAndValue değeri eksik", errorCodes.missingInput)
    if (!Array.isArray(keysAndValue) && Object.prototype.toString.call(keysAndValue) != "[object Object]") throw new DatabaseError("keysAndValue değeri bir Array veya Object tipi olmalıdır", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      if (Array.isArray(keysAndValue)) keysAndValue = Object.fromEntries(keysAndValue)
      dosya = { ...dosya, ...keysAndValue }
      fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
      return dosya
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
   * JSON dosyasının içindeki bütün verileri siler ve girdiğiniz veriyi yazarsınız
   * @param {Object} input JSON dosyasına yazılacak veriler
   * @param {String} fileName Dosyanın adı (İsteğe göre)
   * @return {Object}
   * @example
   * 
   * // JSON dosyasının içindeki bütün verileri siler ve girdiğiniz verileri yazar
   * Database.setFile(
   *  { 
   *   hello: "World!", 
   *   key: "value", 
   *   array: ["1", "2", "3"] 
   *  }
   * ) // { hello: "World!", key: "value", array: ["1", "2", "3"] }
   * 
   * // Eğer belirli bir dosyayı değiştirmek istiyorsanız 2. parametre olarak dosyanın yolunu giriniz
   * Database.setMany([
   * ["hello", "World!"], 
   * ["key", "value"], 
   * ["array", ["1", "2", "3"]]
   * ], "database/fearless.json") // ./database/fearless.json dosyasına yazılacak veri => { hello: "World!", key: "value", array: ["1", "2", "3"] }
   */

  setFile(input, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!input) throw new DatabaseError("input değeri eksik", errorCodes.missingInput)
    if (!Array.isArray(input) && Object.prototype.toString.call(input) != "[object Object]") throw new DatabaseError("input değeri bir Array veya Object tipi olmalıdır", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      if (Array.isArray(input)) input = Object.fromEntries(input)
      fs.writeFileSync(`${fileName}.json`, JSON.stringify(input, null, 2))
      return input
    } catch (e) {
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
   * Database'den veri çekme komutları
   */


  /**
  * JSON dosyasından belirtilen `veriyi çeker` 
  * @param {String} key Verinin adı
  * @param {any} defaultValue Eğer öyle bir veri yoksa döndürülecek varsayılan veri
  * @param {String} fileName Dosyanın adı (İsteğe göre)
  * @return {any|undefined}
  * @example
  * 
  * // İlk önce database'ye bazı veriler yazdıralım
  * Database.set("hello", "World!") // { hello: "World!" }
  * 
  * // Eğer database'de "hello" adında bir veri var ise o veriyi döndürür
  * Database.get("hello") // "World!"
  * 
  * // Eğer döndürülecek veri yok ise varsayılan olarak undefined verisini döndürür
  * Database.get("hello3") // undefined
  * 
  * // Eğer döndürülecek veri yok ise sizin girdiğiniz veriyi döndürür
  * Database.get("hello3", "Öyle bir veri yok!") // "Öyle bir veri yok!"
  */

  get(key, defaultValue = undefined, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!key) throw new DatabaseError("key değeri eksik", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      if (key in dosya) return dosya[key]
      return defaultValue
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
    * JSON dosyasından belirtilen `verileri çeker` 
    * @param {Array<String>} keys Veriler
    * @param {any} defaultValue Eğer hiçbir veri yoksa döndürülecek varsayılan veri
    * @param {String} fileName Dosyanın adı (İsteğe göre)
    * @return {Array|any}
    * @example
    * 
    * // İlk önce database'ye bazı veriler yazdıralım
    * Database.setMany(
    *  { 
    *   hello: "World!", 
    *   Alisa: "o7", 
    *   Fearless: "Crazy", 
    *   array: [1, 2, 3], 
    *   string: "String"
    *  }
    * ) // { "hello": "World!", "Alisa": "o7", "Fearless": "Crazy", "array": [1, 2, 3], "string": "String" }
    * 
    * // Eğer sadece tek bir tane veriyi çekmek istiyorsanız .get() komutunu kullanınız
    * Database.get("hello") // "World!"
    * 
    * // Birden çok veriyi çekmek için array içinde key'lerin isimlerini giriniz
    * Database.getMany(["hello", "Alisa", "Fearless"]) // ["World!", "o7", "Crazy"]
    * 
    * // Eğer girdiğiniz değerlerin en az 1 tanesi bile bulunduysa bir Array döndürür
    * Database.getMany(["hello", "alisa", "fear"]) // ["World!", undefined, undefined]
    * 
    * // Eğer girdiğiniz değerlerin hiç birisi bulunamadıysa girdiğiniz değeri döndürür
    * Database.getMany(["ali", "deneme", "test"], "Hiçbir veri bulunamadı!") // "Hiçbir veri bulunamadı!"
    */

  getMany(keys, defaultValue = [], fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!keys) throw new DatabaseError("keys değeri eksik", errorCodes.missingInput)
    if (!Array.isArray(keys)) throw new DatabaseError("keys değeri bir Array olmalıdır", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      let newArray = keys.map(keys_1 => dosya[keys_1])
      if (newArray.filter(value => value).length) return newArray
      return defaultValue
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
   * JSON dosyasından bütün verileri çeker
   * @param {String} fileName Dosyanın adı (İsteğe göre)
   * @return {Object}
   * @example
   * 
   * // İlk önce database'ye bazı veriler yazdıralım
   * Database.setMany(
   *  { 
   *   hello: "World!", 
   *   Alisa: "o7", 
   *   Fearless: "Crazy", 
   *   array: [1, 2, 3], 
   *   string: "String"
   *  }
   * ) // { "hello": "World!", "Alisa": "o7", "Fearless": "Crazy", "array": [1, 2, 3], "string": "String" }
   * 
   * // Bütün verileri çekmek için bu komutu kullanınız
   * Database.getAll() // { "hello": "World!", "Alisa": "o7", "Fearless": "Crazy", "array": [1, 2, 3], "string": "String" }
   * 
   * // Eğer başka bir dosyadaki verileri çekmek için o dosyanın yolunu giriniz
   * Database.getAll("öylesine bir dosya adı.json")
   */

  getAll(fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return dosya
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
     * JSON dosyasından belirtilen `veriyi çeker` 
     * @param {String} key Verinin adı
     * @param {any} defaultValue Eğer öyle bir veri yoksa döndürülecek varsayılan veri
     * @param {String} fileName Dosyanın adı (İsteğe göre)
     * @return {any|undefined}
     * @example
     * 
     * // İlk önce database'ye bazı veriler yazdıralım
     * Database.set("hello", "World!") // { hello: "World!" }
     * 
     * // Eğer database'de "hello" adında bir veri var ise o veriyi döndürür
     * Database.fetch("hello") // "World!"
     * 
     * // Eğer döndürülecek veri yok ise varsayılan olarak undefined verisini döndürür
     * Database.fetch("hello3") // undefined
     * 
     * // Eğer döndürülecek veri yok ise sizin girdiğiniz veriyi döndürür
     * Database.fetch("hello3", "Öyle bir veri yok!") // "Öyle bir veri yok!"
     */

  fetch(key, defaultValue = undefined, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!this) throw new DatabaseError("Lütfen .get() komutunu kullanınız", errorCodes.invalidCommand)
    return this.get(key, defaultValue, fileName)
  }



  /**
    * JSON dosyasından belirtilen `verileri çeker` 
    * @param {Array} keys Veriler
    * @param {any} defaultValue Eğer hiçbir veri yoksa döndürülecek varsayılan veri
    * @param {String} fileName Dosyanın adı (İsteğe göre)
    * @return {Array|any}
    * @example
    * 
    * // İlk önce database'ye bazı veriler yazdıralım
    * Database.setMany(
    *  { 
    *   hello: "World!", 
    *   Alisa: "o7", 
    *   Fearless: "Crazy", 
    *   array: [1, 2, 3], 
    *   string: "String"
    *  }
    * ) // { "hello": "World!", "Alisa": "o7", "Fearless": "Crazy", "array": [1, 2, 3], "string": "String" }
    * 
    * // Eğer sadece tek bir tane veriyi çekmek istiyorsanız .get() komutunu kullanınız
    * Database.get("hello") // "World!"
    * 
    * // Birden çok veriyi çekmek için array içinde key'lerin isimlerini giriniz
    * Database.fetchMany(["hello", "Alisa", "Fearless"]) // ["World!", "o7", "Crazy"]
    * 
    * // Eğer girdiğiniz değerlerin hiç birisi bulunamadıysa girdiğiniz değeri döndürür
    * Database.fetchMany(["ali", "deneme", "test"], "Hiçbir veri bulunamadı!") // "Hiçbir veri bulunamadı!"
    */

  fetchMany(keys, defaultValue = undefined, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!this) throw new DatabaseError("Lütfen .getMany() komutunu kullanınız", errorCodes.invalidCommand)
    return this.getMany(keys, defaultValue, fileName)
  }



  /**
   * JSON dosyasından bütün verileri çeker
   * @param {String} fileName Dosyanın adı (İsteğe göre)
   * @return {Object}
   * @example
   * 
   * // İlk önce database'ye bazı veriler yazdıralım
   * Database.setMany(
   *  { 
   *   hello: "World!", 
   *   Alisa: "o7", 
   *   Fearless: "Crazy", 
   *   array: [1, 2, 3], 
   *   string: "String"
   *  }
   * ) // { "hello": "World!", "Alisa": "o7", "Fearless": "Crazy", "array": [1, 2, 3], "string": "String" }
   * 
   * // Bütün verileri çekmek için bu komutu kullanınız
   * Database.fetchAll() // { "hello": "World!", "Alisa": "o7", "Fearless": "Crazy", "array": [1, 2, 3], "string": "String" }
   * 
   * // Eğer başka bir dosyadaki verileri çekmek için o dosyanın yolunu giriniz
   * Database.fetchAll("öylesine bir dosya adı.json")
   */

  fetchAll(fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!this) throw new DatabaseError("Lütfen .getAll() komutunu kullanınız", errorCodes.invalidCommand)
    return this.getAll(fileName)
  }



  /**
   * JSON dosyasından bütün verileri çeker
   * @param {String} fileName Dosyanın adı (İsteğe göre)
   * @return {Object}
   * @example
   * 
   * // İlk önce database'ye bazı veriler yazdıralım
   * Database.setMany(
   *  { 
   *   hello: "World!", 
   *   Alisa: "o7", 
   *   Fearless: "Crazy", 
   *   array: [1, 2, 3], 
   *   string: "String"
   *  }
   * ) // { "hello": "World!", "Alisa": "o7", "Fearless": "Crazy", "array": [1, 2, 3], "string": "String" }
   * 
   * // Bütün verileri çekmek için bu komutu kullanınız
   * Database.all() // { "hello": "World!", "Alisa": "o7", "Fearless": "Crazy", "array": [1, 2, 3], "string": "String" }
   * 
   * // Eğer başka bir dosyadaki verileri çekmek için o dosyanın yolunu giriniz
   * Database.all("öylesine bir dosya adı.json")
   */

  all(fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!this) throw new DatabaseError("Lütfen .getAll() komutunu kullanınız", errorCodes.invalidCommand)
    return this.getAll(fileName)
  }



  /**
   * Database'den veri kontrol etme komutları
   */


  /**
  * JSON dosyasından belirtilen `veriyi kontrol eder` 
  * @param {String} key Verinin adı
  * @param {String} fileName Dosyanın adı (İsteğe göre)
  * @return {Boolean}
  * @example
  * 
  * // İlk önce database'ye bazı veriler yazdıralım
  * Database.set("hello", "World!") // { hello: "World!" }
  * 
  * // Eğer database'de "hello" adında bir veri var ise o true döndürür
  * Database.has("hello") // true
  * 
  * // Eğer döndürülecek veri yok ise false döndürür
  * Database.has("hello3") // false
  */

  has(key, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!key) throw new DatabaseError("key değeri eksik", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return key in dosya
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
    * JSON dosyasından belirtilen verilerin en az bir tanesinin olup olmadığını `kontrol eder`
    * @param {Array} keys Veriler
    * @param {String} fileName Dosyanın adı (İsteğe göre)
    * @return {Boolean}
    * @example
    * 
    * // İlk önce database'ye bazı veriler yazdıralım
    * Database.setMany(
    *  { 
    *   hello: "World!", 
    *   Alisa: "o7", 
    *   Fearless: "Crazy", 
    *   array: [1, 2, 3], 
    *   string: "String"
    *  }
    * ) // { "hello": "World!", "Alisa": "o7", "Fearless": "Crazy", "array": [1, 2, 3], "string": "String" }
    * 
    * // Eğer sadece tek bir tane veriyi kontrol etmek istiyorsanız .has() komutunu kullanınız
    * Database.has("hello") // true
    * 
    * // Birden çok veriyi kontrol etmek için array içinde key'lerin isimlerini giriniz
    * Database.hasSome(["hello", "Alisa", "Fearless"]) // true
    * 
    * // Eğer girdiğiniz değerlerin hiç birisi bulunamadıysa false döndürür
    * Database.hasSome(["ali", "deneme", "test"]) // false
    */

  hasSome(keys, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!keys) throw new DatabaseError("keys değeri eksik", errorCodes.missingInput)
    if (!Array.isArray(keys)) throw new DatabaseError("keys değeri bir Array olmalıdır", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return keys.some(key => key in dosya)
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
   * JSON dosyasından belirtilen verilerin hepsinin olup olmadığını `kontrol eder`
   * @param {Array} keys Veriler
   * @param {String} fileName Dosyanın adı (İsteğe göre)
   * @return {Boolean}
   * @example
   * 
   * // İlk önce database'ye bazı veriler yazdıralım
   * Database.setMany(
   *  { 
   *   hello: "World!", 
   *   Alisa: "o7", 
   *   Fearless: "Crazy", 
   *   array: [1, 2, 3], 
   *   string: "String"
   *  }
   * ) // { "hello": "World!", "Alisa": "o7", "Fearless": "Crazy", "array": [1, 2, 3], "string": "String" }
   * 
   * // Eğer sadece tek bir tane veriyi kontrol etmek istiyorsanız .has() komutunu kullanınız
    * Database.has("hello") // true
    * 
    * // Birden çok veriyi kontrol etmek için array içinde key'lerin isimlerini giriniz
    * Database.hasAll(["hello", "Alisa", "Fearless"]) // true
    * 
    * // Eğer girdiğiniz değerlerin bir tanesi bile yok ise false döndürür
    * Database.hasAll(["hello", "Alisa", "test"]) // false
   */

  hasAll(keys, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!keys) throw new DatabaseError("keys değeri eksik", errorCodes.missingInput)
    if (!Array.isArray(keys)) throw new DatabaseError("keys değeri bir Array olmalıdır", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return keys.every(key => key in dosya)
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
  * JSON dosyasından belirtilen `veriyi kontrol eder` 
  * @param {String} key Verinin adı
  * @param {String} fileName Dosyanın adı (İsteğe göre)
  * @return {Boolean}
  * @example
  * 
  * // İlk önce database'ye bazı veriler yazdıralım
  * Database.set("hello", "World!") // { hello: "World!" }
  * 
  * // Eğer database'de "hello" adında bir veri var ise o true döndürür
  * Database.exists("hello") // true
  * 
  * // Eğer döndürülecek veri yok ise false döndürür
  * Database.exists("hello3") // false
  */

  exists(key, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!this) throw new DatabaseError("Lütfen .has() komutunu kullanınız", errorCodes.invalidCommand)
    return this.has(key, fileName)
  }



  /**
    * JSON dosyasından belirtilen verilerin en az bir tanesinin olup olmadığını `kontrol eder`
    * @param {Array} keys Veriler
    * @param {String} fileName Dosyanın adı (İsteğe göre)
    * @return {Boolean}
    * @example
    * 
    * // İlk önce database'ye bazı veriler yazdıralım
    * Database.setMany(
    *  { 
    *   hello: "World!", 
    *   Alisa: "o7", 
    *   Fearless: "Crazy", 
    *   array: [1, 2, 3], 
    *   string: "String"
    *  }
    * ) // { "hello": "World!", "Alisa": "o7", "Fearless": "Crazy", "array": [1, 2, 3], "string": "String" }
    * 
    * // Eğer sadece tek bir tane veriyi kontrol etmek istiyorsanız .has() komutunu kullanınız
    * Database.has("hello") // true
    * 
    * // Birden çok veriyi kontrol etmek için array içinde key'lerin isimlerini giriniz
    * Database.existsSome(["hello", "Alisa", "Fearless"]) // true
    * 
    * // Eğer girdiğiniz değerlerin hiç birisi bulunamadıysa false döndürür
    * Database.existsSome(["ali", "deneme", "test"]) // false
    */

  existsSome(keys, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!this) throw new DatabaseError("Lütfen .hasSome() komutunu kullanınız", errorCodes.invalidCommand)
    return this.hasSome(keys, fileName)
  }



  /**
    * JSON dosyasından belirtilen verilerin en az bir tanesinin olup olmadığını `kontrol eder`
    * @param {Array} keys Veriler
    * @param {String} fileName Dosyanın adı (İsteğe göre)
    * @return {Boolean}
    * @example
    * 
    * // İlk önce database'ye bazı veriler yazdıralım
    * Database.setMany(
    *  { 
    *   hello: "World!", 
    *   Alisa: "o7", 
    *   Fearless: "Crazy", 
    *   array: [1, 2, 3], 
    *   string: "String"
    *  }
    * ) // { "hello": "World!", "Alisa": "o7", "Fearless": "Crazy", "array": [1, 2, 3], "string": "String" }
    * 
    * // Eğer sadece tek bir tane veriyi kontrol etmek istiyorsanız .has() komutunu kullanınız
    * Database.has("hello") // true
    * 
    * // Birden çok veriyi kontrol etmek için array içinde key'lerin isimlerini giriniz
    * Database.hasMany(["hello", "Alisa", "Fearless"]) // true
    * 
    * // Eğer girdiğiniz değerlerin hiç birisi bulunamadıysa false döndürür
    * Database.hasMany(["ali", "deneme", "test"]) // false
    */

  hasMany(keys, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!this) throw new DatabaseError("Lütfen .hasSome() komutunu kullanınız", errorCodes.invalidCommand)
    return this.hasSome(keys, fileName)
  }



  /**
   * JSON dosyasından belirtilen verilerin hepsinin olup olmadığını `kontrol eder`
   * @param {Array} keys Veriler
   * @param {String} fileName Dosyanın adı (İsteğe göre)
   * @return {Boolean}
   * @example
   * 
   * // İlk önce database'ye bazı veriler yazdıralım
   * Database.setMany(
   *  { 
   *   hello: "World!", 
   *   Alisa: "o7", 
   *   Fearless: "Crazy", 
   *   array: [1, 2, 3], 
   *   string: "String"
   *  }
   * ) // { "hello": "World!", "Alisa": "o7", "Fearless": "Crazy", "array": [1, 2, 3], "string": "String" }
   * 
   * // Eğer sadece tek bir tane veriyi kontrol etmek istiyorsanız .has() komutunu kullanınız
    * Database.has("hello") // true
    * 
    * // Birden çok veriyi kontrol etmek için array içinde key'lerin isimlerini giriniz
    * Database.existsAll(["hello", "Alisa", "Fearless"]) // true
    * 
    * // Eğer girdiğiniz değerlerin bir tanesi bile yok ise false döndürür
    * Database.existsAll(["hello", "Alisa", "test"]) // false
   */

  existsAll(keys, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!this) throw new DatabaseError("Lütfen .hasAll() komutunu kullanınız", errorCodes.invalidCommand)
    return this.hasAll(keys, fileName)
  }



  /**
   * Database'nin fonksiyonlu komutları
   */


  /**
   * JSON dosyasından tanımladığınız ilk veriyi döndürür 
   * @param {(element: { key: String, value: any}, index: Number, array: Array) => any} callback find fonksiyonu için
   * @param {String} fileName Dosyanın adı (İsteğe göre)
   * @return {Object}
   * @example
   * 
   * // İlk önce database'ye bazı veriler yazdıralım
   * Database.setMany(
   *  { 
   *   ali: "Kral", 
   *   alifelan: "Öyle işte", 
   *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
   *   us: "Ameriga bizi gısganıyor yigenim", 
   *   bıktım: "bıktım.."
   *  }
   * )
   * 
   * // Sonra komutu kullanarak istediğimiz veriyi döndürelim
   * Database.find(callback => {
   * 
   *   // Objenin key verisinde "ali" kelimesi içeren ilk veriyi döndürür
   *   return callback.key.includes("ali")
   * 
   * }) // { ali: "Kral" }
   * 
   * // Bu da başka bir çağırma şekli
   * Database.find(callback => {
   * 
   *   // Objenin value verisi Array olan ilk veriyi döndürür
   *   return Array.isArray(callback.value)
   * 
   * }) // undefined
   */

  find(callback, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (typeof callback != "function") throw new DatabaseError("callback değeri bir fonksiyon değeri olmalıdır", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      let arrayObject = Object.entries(dosya).map(a => ({ key: a[0], value: a[1] })).find(callback)
      return { [arrayObject.key]: arrayObject.value }
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
   * JSON dosyasından tanımladığınız verileri döndürür 
   * @param {(element: { key: String, value: any}, index: Number, array: Array) => any} callback filter fonksiyonu için
   * @param {String} fileName Dosyanın adı (İsteğe göre)
   * @return {Array}
   * @example
   * 
   * // İlk önce database'ye bazı veriler yazdıralım
   * Database.setMany(
   *  { 
   *   ali: "Kral", 
   *   alifelan: "Öyle işte", 
   *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
   *   us: "Ameriga bizi gısganıyor yigenim", 
   *   bıktım: "bıktım.."
   *  }
   * )
   * 
   * // Sonra komutu kullanarak istediğimiz verileri döndürelim
   * Database.filter(callback => {
   * 
   *   // Objenin key verisinde "ali" kelimesi içeren verileri döndürür
   *   return callback.key.includes("ali")
   * 
   * }) // [{ ali: "Kral" }, { alifelan: "Öyle işte" }]
   * 
   * // Bu da başka bir çağırma şekli
   * Database.filter(callback => {
   * 
   *   // Objenin value verisi Array olan verileri döndürür
   *   return Array.isArray(callback.value)
   * 
   * }) // []
   */

  filter(callback, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (typeof callback != "function") throw new DatabaseError("callback değeri bir fonksiyon değeri olmalıdır", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return Object.entries(dosya).map(a => ({ key: a[0], value: a[1] })).filter(callback).map(object => ({ [object.key]: object.value }))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
   * JSON dosyasından girdiğiniz kelimeyi içeren veriler döndürür 
   * @param {String} key filter fonksiyonu için
   * @param {String} fileName Dosyanın adı (İsteğe göre)
   * @return {Array}
   * @example
   * 
   * // İlk önce database'ye bazı veriler yazdıralım
   * Database.setMany(
   *  { 
   *   ali: "Kral", 
   *   alifelan: "Öyle işte", 
   *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
   *   us: "Ameriga bizi gısganıyor yigenim", 
   *   bıktım: "bıktım.."
   *  }
   * )
   * 
   * // Sonra komutu kullanarak istediğimiz verileri döndürelim
   * Database.includes("ali") // [{ ali: "Kral" }, { alifelan: "Öyle işte" }]
   */

  includes(key, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!this) throw new DatabaseError("Lütfen .filter(object => object.key.includes()) komutunu kullanınız", errorCodes.invalidCommand)
    if (!key) throw new DatabaseError("key değeri eksik", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    return this.filter(object => object.key.includes(key), fileName)
  }



  /**
   * JSON dosyasından girdiğiniz kelime ile başlayan verileri döndürür 
   * @param {String} key filter fonksiyonu için
   * @param {String} fileName Dosyanın adı (İsteğe göre)
   * @return {Array}
   * @example
   * 
   * // İlk önce database'ye bazı veriler yazdıralım
   * Database.setMany(
   *  { 
   *   ali: "Kral", 
   *   alifelan: "Öyle işte", 
   *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
   *   us: "Ameriga bizi gısganıyor yigenim", 
   *   bıktım: "bıktım.."
   *  }
   * )
   * 
   * // Sonra komutu kullanarak istediğimiz verileri döndürelim
   * Database.startsWith("ali") // [{ ali: "Kral" }, { alifelan: "Öyle işte" }]
   */

  startsWith(key, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!this) throw new DatabaseError("Lütfen .filter(object => object.key.startsWith()) komutunu kullanınız", errorCodes.invalidCommand)
    if (!key) throw new DatabaseError("key değeri eksik", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    return this.filter(object => object.key.startsWith(key), fileName)
  }



  /**
   * JSON dosyasından tanımladığınız verilerden en az bir tanesinin olup olmadığını `kontrol eder` 
   * @param {(element: { key: String, value: any}, index: Number, array: Array) => any} callback some fonksiyonu için
   * @param {String} fileName Dosyanın adı (İsteğe göre)
   * @return {Boolean}
   * @example
   * 
   * // İlk önce database'ye bazı veriler yazdıralım
   * Database.setMany(
   *  { 
   *   ali: "Kral", 
   *   alifelan: "Öyle işte", 
   *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
   *   us: "Ameriga bizi gısganıyor yigenim", 
   *   bıktım: "bıktım.."
   *  }
   * )
   * 
   * // Sonra komutu kullanarak istediğimiz verileri kontrol edelim
   * Database.some(callback => {
   * 
   *   // Objenin key verisinde "ali" kelimesi içeren kelime olup olmadığını `kontrol eder`
   *   return callback.key.includes("ali")
   * 
   * }) // true
   * 
   * // Bu da başka bir çağırma şekli
   * Database.some(callback => {
   * 
   *   // Objenin value verisi Array olan var mı yok mu onu `kontrol eder`
   *   return Array.isArray(callback.value)
   * 
   * }) // false
   */

  some(callback, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (typeof callback != "function") throw new DatabaseError("callback değeri bir fonksiyon değeri olmalıdır", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return Object.entries(dosya).map(a => ({ key: a[0], value: a[1] })).some(callback)
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
   * JSON dosyasından tanımladığınız verilerin hepsinin olup olmadığını `kontrol eder`
   * @param {(element: { key: String, value: any}, index: Number, array: Array) => any} callback every fonksiyonu için
   * @param {String} fileName Dosyanın adı (İsteğe göre)
   * @return {Boolean}
   * @example
   * 
   * // İlk önce database'ye bazı veriler yazdıralım
   * Database.setMany(
   *  { 
   *   ali: "Kral", 
   *   alifelan: "Öyle işte", 
   *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
   *   us: "Ameriga bizi gısganıyor yigenim", 
   *   bıktım: "bıktım.."
   *  }
   * )
   * 
   * // Sonra komutu kullanarak istediğimiz verileri kontrol edelim
   * Database.every(callback => {
   * 
   *   // Objenin her key verisinde "ali" kelimesi içeren kelime olup olmadığını `kontrol eder`
   *   return callback.key.includes("ali")
   * 
   * }) // false
   * 
   * // Bu da başka bir çağırma şekli
   * Database.every(callback => {
   * 
   *   // Objenin key verisinin bir yazı tipi olup olmadığını `kontrol eder`
   *   return typeof callback.key == "string"
   * 
   * }) // true
   */

  every(callback, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (typeof callback != "function") throw new DatabaseError("callback değeri bir fonksiyon değeri olmalıdır", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      return Object.entries(dosya).map(a => ({ key: a[0], value: a[1] })).every(callback)
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
   * JSON dosyasından tanımladığınız ilk veriyi siler 
   * @param {(element: { key: String, value: any}, index: Number, array: Array) => any} callback find fonksiyonu için
   * @param {String} fileName Dosyanın adı (İsteğe göre)
   * @return {Object|undefined}
   * @example
   * 
   * // İlk önce database'ye bazı veriler yazdıralım
   * Database.setMany(
   *  { 
   *   ali: "Kral", 
   *   alifelan: "Öyle işte", 
   *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
   *   us: "Ameriga bizi gısganıyor yigenim", 
   *   bıktım: "bıktım.."
   *  }
   * )
   * 
   * // Sonra komutu kullanarak istediğimiz veriyi gösterelim
   * Database.find(callback => {
   * 
   *   // Objenin key verisinde "ali" kelimesi içeren ilk veriyi siler
   *   return callback.key.includes("ali")
   * 
   * }) // { ali: "Kral" }
   * 
   * // Dosyada artık "ali" verisi bulunmuyor
   */

  findAndDelete(callback, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (typeof callback != "function") throw new DatabaseError("callback değeri bir fonksiyon değeri olmalıdır", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      let arrayDosya = Object.entries(dosya).map(a => ({ key: a[0], value: a[1] })).find(callback)
      if (arrayDosya) {
        delete dosya[arrayDosya.key]
        fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
      }
      return arrayDosya
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
   * JSON dosyasından tanımladığınız verilerin hepsini siler 
   * @param {(element: { key: String, value: any}, index: Number, array: Array) => any} callback filter fonksiyonu için
   * @param {String} fileName Dosyanın adı (İsteğe göre)
   * @return {Array}
   * @example
   * 
   * // İlk önce database'ye bazı veriler yazdıralım
   * Database.setMany(
   *  { 
   *   ali: "Kral", 
   *   alifelan: "Öyle işte", 
   *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
   *   us: "Ameriga bizi gısganıyor yigenim", 
   *   bıktım: "bıktım.."
   *  }
   * )
   * 
   * // Sonra komutu kullanarak istediğimiz verileri gösterelim
   * Database.filterAndDelete(callback => {
   * 
   *   // Objenin key verisinde "ali" kelimesi içeren bütün verileri siler
   *   return callback.key.includes("ali")
   * 
   * }) // [{ ali: "Kral" }, { alifelan: "Öyle işte" }]
   * 
   * // Dosyada artık "ali" ve "alifelan" verileri bulunmuyor
   */

  filterAndDelete(callback, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (typeof callback != "function") throw new DatabaseError("callback değeri bir fonksiyon değeri olmalıdır", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      let arrayDosya = Object.entries(dosya).map(a => ({ key: a[0], value: a[1] })).filter(callback)
      if (arrayDosya.length) {
        arrayDosya.forEach(object => delete dosya[object.key])
        fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
      }
      return arrayDosya
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
   * Database'den veri silme komutları
   */

  /**
     * JSON dosyasından veri silersiniz 
     * @param {String} key Silinecek verinin adı
     * @param {String} fileName Dosyanın adı (İsteğe göre)
     * @return {Object|void}
     * @example
     * 
     * // İlk önce database'ye bazı veriler yazdıralım
     * Database.setMany(
     *  { 
     *   ali: "Kral", 
     *   alifelan: "Öyle işte", 
     *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
     *   us: "Ameriga bizi gısganıyor yigenim", 
     *   bıktım: "bıktım.."
     *  }
     * )
     * 
     * // Sonra komutu kullanarak silinmesi istediğimiz veriyi girelim
     * Database.delete("alifelan") // "alifelan" verisi silindi
     */

  delete(key, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!key) throw new DatabaseError("key değeri eksik", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      let veri = dosya[key]
      if (!veri) return;
      delete dosya[key]
      fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
      return veri
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
     * JSON dosyasından verileri silersiniz 
     * @param {Array} keys Veriler
     * @param {String} fileName Dosyanın adı (İsteğe göre)
     * @return {Array}
     * @example
     * 
     * // İlk önce database'ye bazı veriler yazdıralım
     * Database.setMany(
     *  { 
     *   ali: "Kral", 
     *   alifelan: "Öyle işte", 
     *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
     *   us: "Ameriga bizi gısganıyor yigenim", 
     *   bıktım: "bıktım.."
     *  }
     * )
     * 
     * // Sonra komutu kullanarak silinmesi istediğimiz verileri girelim
     * Database.deleteMany(["ali", "tr", "bıktım"]) // "ali", "tr" ve "bıktım" verileri silindi
     */

  deleteMany(keys, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!keys) throw new DatabaseError("keys değeri eksik", errorCodes.missingInput)
    if (!Array.isArray(keys)) throw new DatabaseError("keys değeri bir Array olmalıdır", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
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
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
     * JSON dosyasındaki bütün verileri silersiniz 
     * @param {String} fileName Dosyanın adı (İsteğe göre)
     * @return {Object}
     * @example
     * 
     * // İlk önce database'ye bazı veriler yazdıralım
     * Database.setMany(
     *  { 
     *   ali: "Kral", 
     *   alifelan: "Öyle işte", 
     *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
     *   us: "Ameriga bizi gısganıyor yigenim", 
     *   bıktım: "bıktım.."
     *  }
     * )
     * 
     * // Sonra komutu kullanarak bütün verileri silelim
     * Database.deleteAll() // { ali: "Kral", alifelan: "Öyle işte", tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", us: "Ameriga bizi gısganıyor yigenim", bıktım: "bıktım.."}
     */

  deleteAll(fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      fs.writeFileSync(`${fileName}.json`, "{}")
      return dosya
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
   * Database'nin Array metotları
   */


  /**
     * JSON dosyasındaki verinin Array'in sonuna yeni bir veri ekler
     * @param {String} key Verinin adı
     * @param {any} item Eklenecek veri 
     * @param {String} fileName Dosyanın adı (İsteğe göre)
     * @return {Array}
     * @example
     * 
     * // İlk önce database'ye bazı veriler yazdıralım
     * Database.setMany(
     *  { 
     *   ali: "Kral", 
     *   alifelan: "Öyle işte", 
     *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
     *   us: "Ameriga bizi gısganıyor yigenim", 
     *   bıktım: ["bıktım.."]
     *  }
     * )
     * 
     * // Sonra komutu kullanarak Array verisinin sonuna yeni bir veri ekleyelim
     * Database.push("bıktım", "bu hayattan..") // ["bıktım..", "bu hayattan.."]
     * 
     * // Artık "bıktım" verisinde şunlar yazıyor ["bıktım..", "bu hayattan.."]
     */

  push(key, item, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!key) throw new DatabaseError("key değeri eksik", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    if (!item && item === undefined) throw new DatabaseError("item değeri eksik", errorCodes.missingInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
    let veri = dosya[key]
    if (!veri) veri = [item]
    else if (!Array.isArray(veri)) throw new DatabaseError("Verinin değeri bir Array olmalıdır", errorCodes.isNotArray)
    else veri.push(item)
    dosya[key] = veri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return veri
  }



  /**
     * JSON dosyasındaki verinin Array'in sonuna yeni veriler ekler
     * @param {String} key Verinin adı
     * @param {Array} array Eklenecek veriler 
     * @param {String} fileName Dosyanın adı (İsteğe göre)
     * @return {Array}
     * @example
     * 
     * // İlk önce database'ye bazı veriler yazdıralım
     * Database.setMany(
     *  { 
     *   ali: "Kral", 
     *   alifelan: "Öyle işte", 
     *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
     *   us: "Ameriga bizi gısganıyor yigenim", 
     *   bıktım: ["bıktım.."]
     *  }
     * )
     * 
     * // Sonra komutu kullanarak Array verisinin sonuna yeni bir veri ekleyelim
     * Database.pushAll("bıktım", ["bu hayattan..", "yeter", "artık"]) // ["bıktım..", "bu hayattan..", "yeter", "artık"]
     * 
     * // Artık "bıktım" verisinde şunlar yazıyor ["bıktım..", "bu hayattan..", "yeter", "artık"]
     */

  pushAll(key, array, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!key) throw new DatabaseError("key değeri eksik", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    if (!array) throw new DatabaseError("array değeri eksik", errorCodes.missingInput)
    if (typeof array == "string" && this) return this.push(key, array, fileName)
    if (!Array.isArray(array)) throw new DatabaseError("array'in değeri bir Array olmalıdır", errorCodes.isNotArray)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
    let veri = dosya[key]
    if (!veri) veri = array
    else if (!Array.isArray(veri)) throw new DatabaseError("Verinin değeri bir Array olmalıdır", errorCodes.isNotArray)
    else veri.push(...array)
    dosya[key] = veri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return veri
  }



  /**
     * JSON dosyasındaki verinin Array'in en sonundaki veriyi siler
     * @param {String} key Verinin adı
     * @param {Number} number Silinecek veri sayısı 
     * @param {String} fileName Dosyanın adı (İsteğe göre)
     * @return {Array}
     * @example
     * 
     * // İlk önce database'ye bazı veriler yazdıralım
     * Database.setMany(
     *  { 
     *   ali: "Kral", 
     *   alifelan: "Öyle işte", 
     *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
     *   us: "Ameriga bizi gısganıyor yigenim", 
     *   bıktım: ["bıktım..", "bu hayattan", "ağlıcam", "ya", "of"]
     *  }
     * )
     * 
     * // Sonra komutu kullanarak Array verisinin en sonundaki veriyi silelim
     * Database.pop("bıktım") // ["of"]
     * 
     * // Eğer birden fazla veri silmek istiyorsanız içine silinecek veri sayısını yazınız
     * Database.pop("bıktım", 2) // ["ya", "of"]
     * 
     * // Artık "bıktım" verisinde şunlar yazıyor ["bıktım..", "bu hayattan"]
     */

  pop(key, number = 1, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!key) throw new DatabaseError("key değeri eksik", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    if (number == 0) return []
    number = Number(number)
    if (isNaN(number)) throw new DatabaseError("number değeri bir sayı değeri olmalıdır", errorCodes.isNotNumber)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
    let veri = dosya[key]
    let newVeri = []
    let deletedValues = []
    if (!veri) return []
    else if (!Array.isArray(veri)) throw new DatabaseError("Verinin değeri bir Array olmalıdır", errorCodes.isNotArray)
    else {
      for (let i = 0; i < veri.length; i++) {
        if (veri.length - i <= number) deletedValues.push(veri[i])
        else newVeri.push(veri[i])
      }
    }
    dosya[key] = newVeri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return deletedValues
  }



  /**
     * JSON dosyasındaki verinin Array'in en başına yeni bir veri ekler
     * @param {String} key Verinin adı
     * @param {any} item Eklenecek veri 
     * @param {String} fileName Dosyanın adı (İsteğe göre)
     * @return {Array}
     * @example
     * 
     * // İlk önce database'ye bazı veriler yazdıralım
     * Database.setMany(
     *  { 
     *   ali: "Kral", 
     *   alifelan: "Öyle işte", 
     *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
     *   us: "Ameriga bizi gısganıyor yigenim", 
     *   bıktım: ["bıktım.."]
     *  }
     * )
     * 
     * // Sonra komutu kullanarak Array verisinin sonuna yeni bir veri ekleyelim
     * Database.unshift("bıktım", "yaşamaktan") // ["yaşamaktan", "bıktım.."]
     * 
     * // Artık "bıktım" verisinde şunlar yazıyor ["yaşamaktan", "bıktım.."]
     */

  unshift(key, item, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!key) throw new DatabaseError("key değeri eksik", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    if (!item && item === undefined) throw new DatabaseError("item değeri eksik", errorCodes.missingInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
    let veri = dosya[key]
    if (!veri) veri = [item]
    else if (!Array.isArray(veri)) throw new DatabaseError("Verinin değeri bir Array olmalıdır", errorCodes.isNotArray)
    else veri.unshift(item)
    dosya[key] = veri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return veri
  }



  /**
     * JSON dosyasındaki verinin Array'in en başına yeni veriler ekler
     * @param {String} key Verinin adı
     * @param {Array} array Eklenecek veriler 
     * @param {String} fileName Dosyanın adı (İsteğe göre)
     * @return {Array}
     * @example
     * 
     * // İlk önce database'ye bazı veriler yazdıralım
     * Database.setMany(
     *  { 
     *   ali: "Kral", 
     *   alifelan: "Öyle işte", 
     *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
     *   us: "Ameriga bizi gısganıyor yigenim", 
     *   bıktım: ["bıktım.."]
     *  }
     * )
     * 
     * // Sonra komutu kullanarak Array verisinin sonuna yeni bir veri ekleyelim
     * Database.unshiftAll("bıktım", "yaşamaktan") // ["yaşamaktan", "bıktım.."]
     * 
     * // Artık "bıktım" verisinde şunlar yazıyor ["yaşamaktan", "bıktım.."]
     */

  unshiftAll(key, array, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!key) throw new DatabaseError("key değeri eksik", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    if (!array) throw new DatabaseError("array değeri eksik", errorCodes.missingInput)
    if (typeof array == "string" && this) return this.unshift(key, array, fileName)
    if (!Array.isArray(array)) throw new DatabaseError("array'in değeri bir Array olmalıdır", errorCodes.isNotArray)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
    let veri = dosya[key]
    if (!veri) veri = array
    else if (!Array.isArray(veri)) throw new DatabaseError("Verinin değeri bir Array olmalıdır", errorCodes.isNotArray)
    else veri.unshift(...array)
    dosya[key] = veri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return veri
  }



  /**
     * JSON dosyasındaki verinin Array'in en baştaki veriyi siler
     * @param {String} key Verinin adı
     * @param {Number} number Silinecek veri sayısı 
     * @param {String} fileName Dosyanın adı (İsteğe göre)
     * @return {Array}
     * @example
     * 
     * // İlk önce database'ye bazı veriler yazdıralım
     * Database.setMany(
     *  { 
     *   ali: "Kral", 
     *   alifelan: "Öyle işte", 
     *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
     *   us: "Ameriga bizi gısganıyor yigenim", 
     *   bıktım: ["bıktım..", "bu hayattan", "ağlıcam", "ya", "of"]
     *  }
     * )
     * 
     * // Sonra komutu kullanarak Array verisinin en baştaki veriyi silelim
     * Database.shift("bıktım") // ["bıktım.."]
     * 
     * // Eğer birden fazla veri silmek istiyorsanız içine silinecek veri sayısını yazınız
     * Database.shift("bıktım", 2) // ["bıktım..", "bu hayattan"]
     * 
     * // Artık "bıktım" verisinde şunlar yazıyor ["ağlıcam", "ya", "of"]
     */

  shift(key, number = 1, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!key) throw new DatabaseError("key değeri eksik", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    if (number == 0) return []
    number = Number(number)
    if (isNaN(number)) throw new DatabaseError("number değeri bir sayı değeri olmalıdır", errorCodes.isNotNumber)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
    let veri = dosya[key]
    let newVeri = []
    let deletedValues = []
    if (!veri) return []
    else if (!Array.isArray(veri)) throw new DatabaseError("Verinin değeri bir Array olmalıdır", errorCodes.isNotArray)
    else {
      for (let i = 0; i < veri.length; i++) {
        if (i < number) deletedValues.push(veri[i])
        else newVeri.push(veri[i])
      }
    }
    dosya[key] = newVeri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return deletedValues
  }



  /**
   * Database'nin matematik işlemleri komutları
   */


  /**
     * JSON dosyasındaki verinin değerini arttırır
     * @param {String} key Verinin adı
     * @param {Number} number Veriye eklenecek sayı 
     * @param {String} fileName Dosyanın adı (İsteğe göre)
     * @return {Number}
     * @example
     * 
     * // İlk önce database'ye bazı veriler yazdıralım
     * Database.setMany(
     *  { 
     *   ali: "Kral", 
     *   kalp: 15,
     *   alifelan: "Öyle işte", 
     *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
     *   us: "Ameriga bizi gısganıyor yigenim", 
     *   bıktım: ["bıktım.."]
     *  }
     * )
     * 
     * // Sonra komutu kullanarak değerini arttıralım
     * Database.add("kalp", 15) // 30
     * 
     * // Artık "kalp" verisinde şu yazıyor 30
     */

  add(key, number = 1, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!key) throw new DatabaseError("key değeri eksik", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    if (!number && number != 0) throw new DatabaseError("number değeri eksik", errorCodes.missingInput)
    number = Number(number)
    if (isNaN(number)) throw new DatabaseError("number değeri bir sayı değeri olmalıdır", errorCodes.isNotNumber)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
    let veri = dosya[key]
    if (!veri) veri = number
    else if (isNaN(veri)) throw new DatabaseError("Verinin değeri bir Number olmalıdır", errorCodes.isNotNumber)
    else veri += number
    dosya[key] = veri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return number
  }



  /**
     * JSON dosyasındaki verinin değerini azaltır
     * @param {String} key Verinin adı
     * @param {Number} number Veriden çıkarılacak sayı 
     * @param {Boolean} goToNegative Çıkan sayı 0'dan küçük olabilir mi?
     * @param {String} fileName Dosyanın adı (İsteğe göre)
     * @return {Number}
     * @example
     * 
     * // İlk önce database'ye bazı veriler yazdıralım
     * Database.setMany(
     *  { 
     *   ali: "Kral", 
     *   kalp: 15,
     *   alifelan: "Öyle işte", 
     *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
     *   us: "Ameriga bizi gısganıyor yigenim", 
     *   bıktım: ["bıktım.."]
     *  }
     * )
     * 
     * // Sonra komutu kullanarak değerini azaltalım
     * Database.substr("kalp", 5) // 10
     * 
     * // Artık "kalp" verisinde şu yazıyor 10
     */

  substr(key, number = 1, goToNegative = true, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!key) throw new DatabaseError("key değeri eksik", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    if (!number && number != 0) throw new DatabaseError("number değeri eksik", errorCodes.missingInput)
    number = Number(number)
    if (isNaN(number)) throw new DatabaseError("number değeri bir sayı değeri olmalıdır", errorCodes.isNotNumber)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
    let veri = dosya[key]
    if (!veri) veri = 0
    else if (isNaN(veri)) throw new DatabaseError("Verinin değeri bir Number olmalıdır", errorCodes.isNotNumber)
    else veri -= number
    if (veri < 0 && !goToNegative) throw new DatabaseError("Verinin değeri bir Number olmalıdır", errorCodes.negativeNumber)
    dosya[key] = veri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return number
  }



  /**
     * JSON dosyasındaki verinin değerini girdiğiniz değer ile çarpar
     * @param {String} key Verinin adı
     * @param {Number} number Veri ile çarpılacak sayı 
     * @param {String} fileName Dosyanın adı (İsteğe göre)
     * @return {Number}
     * @example
     * 
     * // İlk önce database'ye bazı veriler yazdıralım
     * Database.setMany(
     *  { 
     *   ali: "Kral", 
     *   kalp: 15,
     *   alifelan: "Öyle işte", 
     *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
     *   us: "Ameriga bizi gısganıyor yigenim", 
     *   bıktım: ["bıktım.."]
     *  }
     * )
     * 
     * // Sonra komutu kullanarak değerini azaltalım
     * Database.multi("kalp", 3) // 45
     * 
     * // Artık "kalp" verisinde şu yazıyor 45
     */

  multi(key, number, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!key) throw new DatabaseError("key değeri eksik", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    if (!number && number != 0) throw new DatabaseError("number değeri eksik", errorCodes.missingInput)
    number = Number(number)
    if (isNaN(number)) throw new DatabaseError("number değeri bir sayı değeri olmalıdır", errorCodes.isNotNumber)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
    let veri = dosya[key]
    if (!veri) veri = number
    else if (isNaN(veri)) throw new DatabaseError("Verinin değeri bir Number olmalıdır", errorCodes.isNotNumber)
    else veri *= number
    dosya[key] = veri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return number
  }



  /**
     * JSON dosyasındaki verinin değerini girdiğiniz değer ile böler
     * @param {String} key Verinin adı
     * @param {Number} number Veri ile bölünecek sayı 
     * @param {Boolean} isInteger Çıkan sayı virgüllü olabilir mi?
     * @param {String} fileName Dosyanın adı (İsteğe göre)
     * @return {Number}
     * @example
     * 
     * // İlk önce database'ye bazı veriler yazdıralım
     * Database.setMany(
     *  { 
     *   ali: "Kral", 
     *   kalp: 15,
     *   alifelan: "Öyle işte", 
     *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
     *   us: "Ameriga bizi gısganıyor yigenim", 
     *   bıktım: ["bıktım.."]
     *  }
     * )
     * 
     * // Sonra komutu kullanarak değerini azaltalım
     * Database.division("kalp", 3) // 5
     * 
     * // Artık "kalp" verisinde şu yazıyor 5
     */

  division(key, number, isInteger = false, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!key) throw new DatabaseError("key değeri eksik", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    if (!number) throw new DatabaseError("number değeri eksik veya 0'a eşit", errorCodes.missingInput)
    number = Number(number)
    if (isNaN(number)) throw new DatabaseError("number değeri bir sayı değeri olmalıdır", errorCodes.isNotNumber)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      var dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
    let veri = dosya[key]
    if (!veri) veri = 1
    else if (isNaN(veri)) throw new DatabaseError("Verinin değeri bir Number olmalıdır", errorCodes.isNotNumber)
    else isInteger ? (veri /= number) : (veri /= number).toFixed(0)
    dosya[key] = veri
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(dosya, null, 2))
    return number
  }



  /**
   * Database dosyasını sıfırlama veya sıfırlama komutları
   */


  /**
      * JSON dosyasını komple siler
      * @param {String} fileName Dosyanın adı (İsteğe göre)
      * @return {void}
      * @example
      * 
      * // İlk önce database'ye bazı veriler yazdıralım
      * Database.setMany(
      *  { 
      *   ali: "Kral", 
      *   alifelan: "Öyle işte", 
      *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
      *   us: "Ameriga bizi gısganıyor yigenim", 
      *   bıktım: ["bıktım.."]
      *  }
      * )
      * 
      * // Sonra komutu kullanarak dosyayı komple silelim
      * Database.destroy()
      * 
      * // JSON dosyası artık evrenin sonsuzluklarına doğru yolculuk yaptı..
      */

  destroy(fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      fs.unlinkSync(`${fileName}.json`)
      return;
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
    * JSON dosyasındaki bütün verileri siler
    * @param {String} fileName Dosyanın adı (İsteğe göre)
    * @return {Object}
    * @example
    * 
    * // İlk önce database'ye bazı veriler yazdıralım
    * Database.setMany(
    *  { 
    *   ali: "Kral", 
    *   alifelan: "Öyle işte", 
    *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
    *   us: "Ameriga bizi gısganıyor yigenim", 
    *   bıktım: ["bıktım.."]
    *  }
    * )
    * 
    * // Sonra komutu kullanarak dosyanın içindeki verileri silelim
    * Database.reset()
    * 
    * // JSON dosyasında artık sadece "{}" verisi yazıyor
    */

  reset(fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      fs.writeFileSync(`${fileName}.json`, "{}")
      return {}
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
   * Yeni bir database dosyası oluşturma komutları
   */


  /**
    * Yeni bir JSON database dosyası oluşturur
    * @param {String} fileName Dosyanın adı (İsteğe göre)
    * @return {Object}
    * @example
    * 
    * // İlk önce database'yi silelim
    * Database.destroy()
    * 
    * // Sonra komutu kullanarak yeni bir dosya oluşturalım
    * Database.create("alisa.json")
    * 
    * // Bu ise dosyayı oluştururken içine veri yazdırarak oluşturur
    * Database.create("alisadb.json", { ali: "Adam" })
    */

  create(fileName = this.DEFAULT_JSON_FILE_NAME, file = {}) {
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    if (fs.existsSync(`${fileName}.json`)) throw new DatabaseError(`${fileName}.json adında bir dosya zaten mevcut`, errorCodes.exists)
    if (Object.prototype.toString.call(file) != "[object Object]") throw new DatabaseError("file değeri bir Object tipi olmalıdır", errorCodes.invalidInput)
    try {
      fs.writeFileSync(`${fileName}.json`, JSON.stringify(file, null, 2))
      return file
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }



  /**
   * Database'nin diğer komutları
   */


  /**
    * JSON dosyasındaki verinin tipini döndürür
    * @param {String} key Verinin adı
    * @param {String} fileName Dosyanın adı (İsteğe göre)
    * @return {String}
    * @example
    * 
    * // İlk önce database'ye bazı veriler yazdıralım
    * Database.setMany(
    *  { 
    *   ali: "Kral", 
    *   alifelan: "Öyle işte", 
    *   tr: "RECEP TAYYİP PADİŞAHIM ÇOK YAŞA", 
    *   us: "Ameriga bizi gısganıyor yigenim", 
    *   bıktım: ["bıktım.."]
    *  }
    * )
    * 
    * // Sonra komutu kullanarak verinin hangi tip olduğunu görelim
    * Database.typeof("ali") // "string"
    * 
    * Database.typeof("bıktım") // "array"
    */

  typeof(key, fileName = this.DEFAULT_JSON_FILE_NAME) {
    if (!key) throw new DatabaseError("key değeri eksik", errorCodes.missingInput)
    if (typeof key != "string") throw new DatabaseError("key değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    if (typeof fileName != "string") throw new DatabaseError("fileName değeri bir yazı tipi olmalıdır", errorCodes.invalidInput)
    fileName = fileName.replace(".json", "")
    try {
      let dosya = JSON.parse(fs.readFileSync(`${fileName}.json`, "utf-8"))
      let veri = dosya[key]
      if (Array.isArray(veri)) return "array"
      return typeof veri
    } catch (e) {
      if (e?.errno == -4058 || e?.code == "ENOENT") throw new DatabaseError(`${fileName}.json dosyası bulunamadı!`, errorCodes.missingFile)
      throw new DatabaseError("Bilinmeyen bir hata oluştu!", errorCodes.unknown)
    }
  }

}

module.exports = Database;
