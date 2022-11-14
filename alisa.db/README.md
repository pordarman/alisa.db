## [![alisa.db Logo](https://i.hizliresim.com/aug2sp9.png)](https://www.npmjs.com/package/alisa.db/)


[![Package Name](https://img.shields.io/badge/Package%20name-alisa.db-red)](https://www.npmjs.com/package/alisa.db/)
[![Paket boyutu](https://img.shields.io/bundlephobia/min/alisa.db?label=Package%20size)](https://www.npmjs.com/package/alisa.db/)
[![Version](https://img.shields.io/npm/v/alisa.db.svg?label=Package%20version)](https://www.npmjs.com/package/alisa.db/)
[![License](https://img.shields.io/npm/l/alisa.db.svg?label=License)](https://www.npmjs.com/package/alisa.db/)

[![NPM](https://nodei.co/npm/alisa.db.png?downloads=true)](https://www.npmjs.com/package/alisa.db/)

# Source file

- [alisa.db](https://github.com/pordarman/alisa.db)

<br>

# Creator(s)

- [Ali (Fearless Crazy)](https://github.com/pordarman)
- [Emir (Storme)](https://github.com/PhantomStorm0)

<br>

# Social media accounts

- Ali: [Instagram](https://www.instagram.com/ali.celk/) - [Discord](https://discord.com/users/488839097537003521) - [Spotify](https://open.spotify.com/user/215jixxk4morzgq5mpzsmwwqa?si=41e0583b36f9449b)

- Emir: [Biography](https://phantomstorm.xyz/) - [Instagram](https://www.instagram.com/eavsar_emir.js/) - [Discord](https://discord.com/users/817417815396974683)

<br>

# How to download?

- First we create a [node.js](https://nodejs.org/en/) file (If you have not downloaded [node.js](https://nodejs.org/en/) to computer before, you can download node.js by [clicking here](https://nodejs.org/en/))

- Then we open the PowerShell terminal by "shift + right click" on the folder of the file you created.

![Opening the PowerShell terminal](https://i.hizliresim.com/gbwgora.png)

- Then we write **npm i alisa.db** and press enter.

![Download the alisa.db module](https://i.hizliresim.com/sqavkev.png)

- And now we have downloaded the **alisa.db** module, congratulations 🎉🎉



<br>

# What is this module?

- This module was established to facilitate people using JSON database

- This module, which contains as many commands and features as you would like, is *perfect*, just like the man/woman of your dreams

- There are commands and features that you can customize almost anything

- This module was made with the sole purpose of helping people, without generating any income

<br>

# So how to use?

It's very simple, first you have to open any node.js file and write the following in it:
<br>
```js
const alisa_db = require("alisa.db")

const Database = new alisa_db("database.json")
const Database_1 = new alisa_db({ fileName: "alisa.db.json" })
const Database_2 = new alisa_db({ cache: true })
const Database_3 = new alisa_db({ autoWrite: true, fileName: "alisa.db.json" })
```
Each database we wrote above holds a different file database data. You can increase this as much as you want.

After typing this you can access **all** commands

<br>

### **CAUTION!!**
Please make your definitions as above. If you have made a definition as below, the module will not work properly and will give an error!

```js
// Incorrect command definition

const alisa_db = require("alisa.db")

const { get, set } = new alisa_db({ fileName: "database.json", cache: true })
// This command will throw an error!


const Database = new alisa_db({ fileName: "alisa.json", cache: true })
// This command will work as it should
```

<br>

# Example

Now, if you want, let me briefly explain how to write data to the database
<br>

```js
// Printing data to database
Database.set("hello", "World!")

// After typing this, the following data is created in the database.json file:
```
![Printing data to database](https://i.hizliresim.com/mnt8zwz.png)
  
As you can see, it is very simple and understandable to use

<br>

And if you want, instead of saving a single data, you can save multiple data at the same time
```js
// Printing multiple data to database
Database.setMany({ hello: "World", test: "Test", alisa: "alisa.db", version: "0.0.3" })

// After typing this, the following data is created in the database.json file:
```
![Printing multiple data to database](https://i.hizliresim.com/lzfojym.png)

As you can see, we can save time and memory by printing multiple data instead of printing one by one

<br>

# So why alisa.db?

- The first reason is that it is overly simple and less likely to fail

- The second reason is that since it is an open source module, it can be edited in a special way if you want

- The third reason is that we are improving this module every day, making it more performance and adding new features to our strength

- The fourth reason is... Well, I guess there's no other reason :( Maybe it's just to make me happy 👉👈

<br>


# Updates
## v0.3.7

- Added `.forEach()` command

- Fixed some performance issues

## v0.3.6

- Fixed some typos in test.js and test.mjs files and transferred test files to a separate folder

## v0.3.5 - **Quick update**

- Fixed a minor bug in the README.md file

- Errors in the database have been made more understandable

## v0.3.4

- A new person has been added to the creators of the module, thumbs up 🎉🎉

- Update README.md file *again..*

- The command descriptions part of the module has been made a bit more understandable.

## v0.3.3 - **IMPORTANT UPDATE**

- "An unknown error has occurred!" bug fixed

- Some changes have been made to the database

## v0.3.2

- Added feature to set JSON spaces

- Fixed some typos

- Update README.md file

<br>

Please do not forget to use it in the latest version for more **stable** and **performance** of the module!

<br>

# And finally

- If you want to support this module, if you request me on [github](https://github.com/pordarman), I will be happy to help you.

- Thank you for reading this far, i love you 💗

- See you in my next modules!

<br>

![lovee](https://gifdb.com/images/high/drake-heart-hands-aqm0moab2i6ocb44.webp)