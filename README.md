# 🏠 WG Kasası

Haydar, Sude ve Ezgi'nin WG'sinde ortak alınan eşyaların parasını adil bölmek için küçük bir site.

- Herkesin **kendi alanı** var: aldığı şeyin adını ve € tutarını yazıyor.
- En altta **otomatik hesaplaşma** var: kim ne kadar harcadı, payına ne düştü, **kim kime ne kadar göndermeli** (en az transferle).
- Para gönderilince **“Ödendi”** butonuna basılıyor, hesap güncelleniyor.
- Kategoriler ürün adından otomatik tahmin ediliyor (ör. “Tuvalet kağıdı” → 🧻 Banyo).
- **Detaylı** ekleme: tarih, not, kategori ve harcamanın **sadece bazı kişiler arasında** bölünmesi (ör. sadece Sude & Ezgi).
- Düzenleme, silme (geri alınabilir), kişi listesini temizleme, **her şeyi sıfırlama**.
- Excel'e aktarma (CSV), JSON yedek indirme / yükleme.
- Açık / koyu tema, telefona uygulama gibi eklenebilir (Ana Ekrana Ekle).

### 🧹 Putzplan

Üstteki **Putzplan** sekmesinde (doğrudan link: `…/ev/#putz`):

- Her hafta **sadece bir kişi** temizlik yapar; sıra **Haydar → Sude → Ezgi** şeklinde her pazartesi otomatik geçer.
- Sırası gelen kişi haftanın **hangi gününde** temizleyeceğini seçer.
- Yapılacaklar listesi işaretlenir: **1) Ortak alanların süpürülmesi, 2) Banyo ve klozet temizlemesi, 3) Mutfak ocağını silmek.**
  Üçü de işaretlenince hafta “Temizlendi ✓” olur (ya da direkt **Temizledim** butonu).
- Biri o hafta yoksa haftasını başka biriyle **takas** edebilir.
- **Temizlik skoru**: kim kaç kez temizledi, kim kaçırdı, kimin sırası ne zaman.
- **Sıra ayarları**: bu hafta sıranın kimde olduğu ve sıranın yönü değiştirilebilir.

Kurulum gerektirmeyen tek dosyalık statik bir site: `index.html`, `styles.css`, `app.js`, `config.js`.

---

## 1) GitHub Pages ile yayınlama

1. GitHub'da repo → **Settings** → **Pages**
2. **Source:** `Deploy from a branch`
3. **Branch:** `main` / `/ (root)` → **Save**
4. 1–2 dakika sonra site şu adreste açılır: **https://haydarsahin0.github.io/ev/**

## 2) Firebase kurulumu (üç kişinin aynı veriyi görmesi için — ~5 dk)

GitHub Pages sadece dosya sunar; veriyi paylaşmak için ücretsiz bir Firebase veritabanı kullanılıyor.
Bu adım yapılmazsa site **Yerel mod**da çalışır ve veriler sadece o telefonda kalır.

1. <https://console.firebase.google.com> → **Proje ekle** (ör. `wg-kasasi`). Google Analytics gerekmez.
2. Sol menü **Build → Realtime Database → Create database** → konum **Belgium (europe-west1)** → **Start in locked mode**.
3. **Rules** sekmesine şunu yapıştır ve **Publish**:
   ```json
   {
     "rules": {
       "wg": {
         ".read": "auth != null",
         ".write": "auth != null"
       }
     }
   }
   ```
4. Sol menü **Build → Authentication → Get started → Sign-in method → Anonymous → Enable**.
5. Proje ayarları (⚙️) → **Genel** → aşağıda **Uygulamalarınız** → **Web (`</>`)** → bir isim ver → çıkan `firebaseConfig` nesnesini kopyala.
6. Bu repodaki **`config.js`** dosyasını aç (GitHub'da kalem ikonu ile düzenlenebilir) ve `firebase: null` yerine yapıştır:
   ```js
   window.WG_CONFIG = {
     firebase: {
       apiKey: "AIza...",
       authDomain: "wg-kasasi.firebaseapp.com",
       databaseURL: "https://wg-kasasi-default-rtdb.europe-west1.firebasedatabase.app",
       projectId: "wg-kasasi",
       appId: "1:...:web:...",
     },
     path: "wg",
   };
   ```
   > `databaseURL` mutlaka olmalı. Config'de yoksa Realtime Database sayfasının üstündeki adresi kopyala.
7. Commit et. Bir dakika sonra sağ üstte **“Canlı senkron”** yazısını görürsün — artık linki Sude ve Ezgi'ye gönderebilirsin. 🎉

> Firebase web ayarları gizli değildir, repoda durması normaldir. Veriye sadece siteyi açan kişiler erişebilir;
> link sizde kaldığı sürece yeterli. Ücretsiz Spark planı bu kullanım için fazlasıyla yeter.

## Hesaplama nasıl çalışıyor?

- Her harcama, seçilen kişiler arasında eşit bölünür (varsayılan: üç kişi).
- **Bakiye = ödediği − payına düşen + gönderdiği ödemeler − aldığı ödemeler**
- Pozitif bakiye alacaklı, negatif bakiye borçlu demektir. Borçlular en büyük alacaklıdan başlayarak eşleştirilir, böylece en az sayıda transfer çıkar.
- Tutarlar kuruş (cent) cinsinden tam sayı olarak tutulur, yuvarlama hatası olmaz.

## Yeni dönem

Ay sonunda herkes ödeştiğinde **Araçlar → Yedek indir** ile yedek al, sonra **Her şeyi sıfırla** ile temiz bir sayfa aç.
