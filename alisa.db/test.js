/**
 * 
 * NOT!!! Aşağıdaki komutların açıklamalarını okumadan önce bilmeniz gerekenler!!!!
 * 
 * Aşağıda komutların ne işe yaradıklarını açıklarken bazı yerlerde "key" ve "value" kelimelerini kullanıyorum.
 * Eğer bunların ne anlama geldiğini bilmiyorsanız lütfen aşağıdaki yere bakınız yoksa komutun tam olarak ne işe yaradığını tam olarak anlayamayabilirsiniz!
 * 
 * Eğer biliyorsanız buraya bakmanız gerek yok
 */


/**
 * Şimdi key ve value dediğimiz şey nedir?
 * 
 * "key" ve "value" sadece bir Object ifadede bulunur. Eğer bir yerde "key" veya "value" yazısının geçtiğini duyuyorsanız onun bir Object yani obje olduğunu anlamalısınız
 * 
 * Hemen bir örnek vererek açıklayayım
 */

({
    key: "value",
    anotherKey: [],
    anotherKey2: {},
    anotherKey3: "anotherValue"
})

/**
 * Buradaki "key:", "anotherKey:", "anotherKey2:" ve "anotherKey3:" bizim key değerlerimiz. Yani "key:" key'ine karışık gelen değer "value"'dir
 * 
 * Aynı zamanda "anotherKey2:" key'ine karşılık gelen değer {} dir
 * 
 * Ve yukarıda da anlaşıldığı üzere "value", [], {} ve "anotherValue" değerlerimiz ise bizim value değerlerimizdir
 * 
 * 
 * Şimdi aşağıdaki komutlara geçebilirsiniz
 */





// İlk önce alisa.db modülünü tanımlıyoruz
const alisadb = require("./index") // Siz "./index" yerine "alisa.db" yazınız

// Sonra yeni bir tane database oluşturuyoruz
const Database = new alisadb("database.json") // Buraya ise varsayılan olarak dosyamızın adını giriyoruz


/**
 * Ana komutlar
 */


// Bu database.json dosyasındaki bütün key değerlerini çağırır
Database.keys()


// Bu da database.json dosyasındaki bütün value değerlerini çağırır
Database.values()


/**
 * Veri yazdırma komutları
 */


// Bu database.json dosyasına { "key": "value" } değerini yazdırır
Database.set("key", "value")


// Bu ise teker teker yapmak yerine hepsini aynı anda yazdırır
Database.setMany({ key1: "value1", key2: "value2", key3: "value3" })


// Bu ise database.json dosyasının içindeki her şeyi siler ve sizin girdiğiniz veriyi yazar
Database.setFile({ alisa: "o7", array: ["1", "2", "3"], hello: "World!", anyObject: { anyKey: "anyValue", anyArray: ["alisa", "db", "is", "awesome"], anyObjectAgain: {} }, what: "the", fuck: "bro!?" })

/**
 * Veriyi bulma komutları
 */


// Bu database.json dosyasında "key" diye bir veri var ise onu çağırır
Database.get("key")
Database.fetch("key")


// Bu database.json dosyasında girdiğiniz değerle aynı bir value değeri var ise onu çağırır
Database.getValue("bro!?")
Database.getValue({ anyKey: "anyValue", anyArray: ["alisa", "db", "is", "awesome"], anyObjectAgain: {} })


// Bu database.json dosyasında girdiğiniz verilerin hepsini çağırır
Database.getMany(["key", "alisa", "array"]) // [undefined, "o7", ["1", "2", "3"]]
Database.fetchMany(["key", "alisa", "array"]) // [undefined, "o7", ["1", "2", "3"]]



// Bu database.json dosyasındaki bütün veriyi çağırır
Database.getAll()
Database.fetchAll()
Database.all()
Database.toJSON()
// Yukarıdakilerin hepsi JSON (yani Object) formatında çağırılır

Database.toArray()

// Bu komut ise Array halinde çağırılır


/**
 * Veriyi kontrol etme komutları
 */


// Bu database.json dosyasında "key" diye bir verinin olup olmadığını kontrol eder
Database.has("key")
Database.exists("key")


// Bu girdiğiniz verilerden en az 1 tanesinin olup olmadığını kontrol eder
Database.hasSome(["ali", "alisa", "key"])
Database.existsSome(["ali", "alisa", "key"])


// Bu girdiğiniz verilerin hepsinin olup olmadığını kontrol eder (Eğer 1 tanesi bile bulunamadıysa false döndürür)
Database.hasAll(["ali", "alisa", "key"])
Database.existsAll(["ali", "alisa", "key"])


/**
 * Fonksiyon kullanarak istediğiniz verileri çekme komutları 
 */


// Bu database.json dosyasındaki key verisinin içinde "a" harfi bulunan ilk veriyi çağırır
Database.find(object => object.key.includes("a"))
Database.includes("a") // İkisi aynı şey

Database.find(object => object.key.startsWith("a"))
Database.startsWith("a") // Bu ikisi de aynı şey


// Bu database.json dosyasındaki key verisinin içinde "a" harfi bulunan bütün verileri çağırır
Database.filter(object => object.key.includes("a"))


// Bu database.json dosyasındaki key verilerinin en az birisinin içinde "a" harfi olup olmadığını kontrol eder 
Database.some(object => object.key.includes("a"))


// Bu database.json dosyasındaki bütün key verilerinin içinde "a" harfi bulunup bulunmadığını kontrol eder
Database.every(object => object.key.includes("a"))


// Bu ise database.json dosyasındaki belirttiğiniz veri var ise onu siler
Database.findAndDelete(object => object.key.includes("alisao7"))


// Bu ise database.json dosyasındaki belirttiğiniz veriler var ise bütün verileri siler
Database.filterAndDelete(object => object.key.includes("alisao7"))


/**
 * Veri silme komutları
 */


// Bu database.json dosyasındaki "key" verisini siler
Database.delete("key")


// Bu ise database.json dosyasındaki girdiğiniz addaki bütün verileri siler
Database.deleteMany(["key", "alisa", "value"])


// Bu ise database.json dosyasındaki bütün verileri siler
Database.deleteAll()


/**
 * Array komutları
 */


// Bu database.json dosyasındaki "key" verisine karşılık gelen Array'in sonuna yeni bir veri ekler
Database.push("key", "veri")


// Bu ise verinin sonuna birden çok veri ekler
Database.pushAll("key", ["veri1", "veri2", "veri3"])


// Bu da Array'in en sonundaki veriyi siler
Database.pop("key")
Database.pop("key", 5) // Bu da 1 veri yerine 5 veri siler


// Bu database.json dosyasındaki "key" verisine karşılık gelen Array'in başına yeni bir veri ekler
Database.unshift("key", "veri")


// Bu ise verinin başına birden çok veri ekler
Database.unshiftAll("key", ["veri1", "veri2", "veri3"])


// Bu da Array'in en başındaki veriyi siler
Database.shift("key")
Database.shift("key", 5) // Bu da 1 veri yerine 5 veri siler


/**
 * Dört işlem komutları
 */


// Bu database.json dosyasındaki "key" verisinin değerini arttırır
Database.add("key")
Database.add("key", 5) // Bu da 1 yerine 5 ekler


// Bu database.json dosyasındaki "key" verisinin değerini azaltır
Database.substr("key")
Database.substr("key", 5) // Bu da 1 yerine 5 çıkartır
Database.substr("key", 4, true) // Bu ise sayının eksi (-)'lere düşüp düşmeceğini kontrol eder


// Bu database.json dosyasındaki "key" verisinin değerini çarparak arttırır
Database.multi("key", 5)


// Bu database.json dosyasındaki "key" verisinin değerini böler
Database.division("key", 5)
Database.division("key", 4, true) // Bu ise sayının virgüllü olup olmayacağını kontrol eder


/**
 * Sıfırlama/silme/oluşturma komutları
 */


// Bu database.json dosyasındaki bütün verileri siler
Database.deleteAll()
Database.reset()


// Bu da direkt database.json dosyasını siler
Database.destroy()


// Bu ise database.json adında yeni bir dosya oluşturur
Database.create("database.json")


/**
 * Diğer komutlar
 */


// Bu ise "key" verisine karşılık gelen verinin tipini gösterir
Database.typeof("key")