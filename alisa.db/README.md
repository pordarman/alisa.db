## ![alisa.db Logo](https://i.hizliresim.com/aug2sp9.png)

# Kaynak dosyası

- [alisa.db](https://github.com/pordarman/alisa.db)

<br>

# Yaratıcı(lar)

- [Ali (Fearless Crazy)](https://github.com/pordarman)

<br>

# Sosyal medya hesapları

- Ali: [İnstagram](https://www.instagram.com/ali.celk/) - [Discord](https://discord.com/users/488839097537003521) - [Spotify](https://open.spotify.com/user/215jixxk4morzgq5mpzsmwwqa?si=41e0583b36f9449b)

<br>

# Nasıl indirilir?

- İlk önce bir tane [node.js](https://nodejs.org/en/) dosyası oluşturuyoruz (Eğer bilgisayarınızda [node.js](https://nodejs.org/en/) indirmediyseniz [Buraya tıklayarak](https://nodejs.org/en/) node.js indirebilirsiniz)

- Sonra oluşturduğunuz dosyanın klasörüne "shift + sağ tık" yaparak PowerShell terminalini açıyoruz

![PowerShell terminalini açma](https://i.hizliresim.com/namhujn.png)

- Sonra çıkan yere **npm i alisa.db** yazıyoruz ve enter tuşuna basıyoruz

![alisa.db modülünü indirme](https://i.hizliresim.com/8f3yk6t.png)

- Ve artık **alisa.db** modülünü indirmiş bulunmaktayız tebrikleerr 🎉🎉



<br>

# Nedir bu modül?

- Bu modül JSON database'si kullanan insanlara kolaylık etme amacıyla kurulmuştur

- İçinde neredeyse her şeyi özelleştirebileceğiniz komutlar, bilgiler bulunmaktadır

- Herhangi bir gelir gütmeksizin, sadece insanlara yardımcı olabilmek amacıyla yapılmıştır

<br>

# Peki nasıl kullanılır?

Çok basit, önce herhangi bir node.js dosyası açıp onun içine şunları yazmalısınız:
<br>
```js
const Database = new (require("alisa.db"))()
```
Bunu yazdıktan sonra **bütün** komutlara erişim sağlayabilirsiniz

<br>

# Örnek

Şimdi isterseniz database'ye nasıl veri yazdıracağınızı kısaca anlatayım
<br>

```js
// Database'ye veri yazdırma
Database.set("hello", "World!")

// Bunu yazdıktan sonra database.json dosyasında şu veriler oluşur:
```
![Database'ye veri yazdırma](https://i.hizliresim.com/mnt8zwz.png)
  
Gördüğünüz gibi kullanımı gayet basit ve anlaşılır.

<br>

Ve eğer isterseniz tek bir veri kaydetmek yerine aynı anda birden fazla veri de kaydedebilirsiniz.
```js
// Database'ye çoklu veri yazdırma
Database.setMany({ hello: "World", test: "Test", alisa: "alisa.db", version: "0.0.3" })

// Bunu yazdıktan sonra database.json dosyasında şu veriler oluşur:
```
![Database'ye çoklu veri yazdırma](https://i.hizliresim.com/lzfojym.png)

Gördüğünüz gibi burada ise teker teker yazdırmak yerine birden fazla veri yazdırarak zamandan ve bellekten tasarruf edebiliriz.

<br>

# Peki neden alisa.db?

- İlk nedeni aşırı basit olması ve hata verme olasılığının daha az olması

- İkinci nedeni ise açık kaynaklı modül olmasından dolayı isterseniz kendinize özel bir şekilde düzenlenebilir olması

- Üçüncü nedeni ise... Şeyy, sanırım başka neden kalmadı :( Belki beni mutlu etmek için olabilir 👉👈

<br>


# Güncelleme v0.1.5

- Bazı yazım hataları giderildi

- `.getValue()` ve `.hasValue()` komutları daha da iyileştirildi

- `.getManyValue()`, `.hasSomeValue()` ve `.hasEveryValue()` komutları eklendi

- `.clone()` komutu eklendi

<br>

Modülün daha **stabil** ve **performanslı** çalışması için en son sürümde kullanmayı lütfen unutmayınız!

<br>

# Ve son olarak

- Eğer bu modüle destek olmak isterseniz bana [github](https://github.com/pordarman) üzerinden istekte bulunursanız size seve seve yardımcı olurum.

- Buraya kadar okuduğunuz için teşekkür ederim, iyi ki varsınız 💗

- Sonraki modüllerimde görüşmek üzere hoşçakalın!!

<br>

![kalp kalp kalp](https://gifdb.com/images/high/drake-heart-hands-aqm0moab2i6ocb44.webp)