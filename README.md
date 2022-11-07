>## Kaynak dosyası

- [alisa.db](https://github.com/pordarman/alisa.db)


>## Yaratıcılar

- [Ali (Fearless Crazy)](https://github.com/pordarman)

>## Sosyal medya hesapları

- Ali: [İnstagram](https://www.instagram.com/ali.celk/) - [Discord](https://discord.com/users/488839097537003521) - [Spotify](https://open.spotify.com/user/215jixxk4morzgq5mpzsmwwqa?si=41e0583b36f9449b)

>## Nedir bu modül?

- Bu modül JSON database'si kullanan insanlara kolaylık etme amacıyla kurulmuştur
- İçinde neredeyse her şeyi özelleştirebileceğiniz komutlar, bilgiler bulunmaktadır
- Herhangi bir gelir gütmeksizin, sadece insanlara yardımcı olabilmek amacıyla yapılmıştır

>## Peki nasıl kullanılır?

Çok basit, önce herhangi bir node.js dosyası açıp onun içine şunları yazmalısınız:
<br>
```js
const Database = new (require("alisa.db"))()
```
Bunu yazdıktan sonra artık istediğiniz **her şeye** erişebileceksiniz
<br>
İsterseniz database'ye veri yazdırabilirsiniz, isterseniz veriyi çekebilirsiniz tamamen sizin özgürlüğünüze kalmış
<br>
<hr>
Şimdi isterseniz database'ye nasıl veri yazdıracağınızı kısaca anlatayım
<br>

```js
// Database'ye veri yazdırma
Database.set("hello", "World!")

// Bunu yazdıktan sonra database.json dosyasında şu veriler oluşur:
```
![Database'ye veri yazdırma](https://i.hizliresim.com/mnt8zwz.png)
  
Gördüğünüz gibi kullanımı gayet basit ve anlaşılır.

<hr>

Ve eğer isterseniz tek bir veri kaydetmek yerine aynı anda birden fazla veri de kaydedebilirsiniz.
```js
// Database'ye çoklu veri yazdırma
Database.setMany({ hello: "World", test: "Test", alisa: "alisa.db", version: "0.0.3" })

// Bunu yazdıktan sonra database.json dosyasında şu veriler oluşur:
```
![Database'ye çoklu veri yazdırma](https://i.hizliresim.com/lzfojym.png)

Gördüğünüz gibi burada ise teker teker yazdırmak yerine birden fazla veri yazdırarak zamandan ve bellekten tasarruf edebiliriz.

>## Peki neden alisa.db?

- İlk nedeni aşırı basit olması ve hata verme olasılığının daha az olmasıdır.

- İkinci nedeni ise açık kaynaklı modül olmasından dolayı isterseniz kendinize özel bir şekilde düzenlenebilir olmasıdır

- Üçüncü nedeni ise... Şeyy, sanırım başka neden kalmadı :( Belki beni mutlu etmek için olabilir 



>## Ve son olarak

- Eğer bu modüle destek olmak isterseniz bana [github](https://github.com/pordarman) üzerinden istekte bulunursanız size seve seve yardımcı olurum.
<br>
<br>
- Buraya kadar okuduğunuz için teşekkür ederim, iyi ki varsınız 💗
<br>
<br>
- Sonraki modüllerimde görüşmek üzere hoşçakalın!!