# Nasse Biology (v2)

11. sınıf Biyoloji "1.5. Duyu Reseptörleri ve Duyu Organları" slaytlarına göre hazırlanmış interaktif site.
Saf HTML/CSS/JS: derleme gerekmez, GitHub Pages'te doğrudan çalışır.

## Dosyalar (hepsi AYNI klasöre konmalı)
index.html, style.css, data.js, models3d.js, sims.js, games.js, app.js, firebase-config.js

## Yayınlama (GitHub Pages)
1. Dosyaları repo köküne yükle (mevcut eski dosyaları silip yerine koy).
2. Settings > Pages > Branch: main / root.
3. Birkaç dakika sonra https://KULLANICI.github.io/REPO/ açılır.
Yerelde denemek için VS Code "Live Server" kullan (3B modeller ve fontlar internet ister: three.js ve Google Fonts CDN).

## Firebase giriş (isteğe bağlı)
firebase-config.js içindeki değerleri doldur; Authentication > Google'ı aç, Firestore oluştur, yetkili alan adlarına github.io ekle.
Boş bırakırsan ilerleme (XP, rozet) cihazda saklanır.

## Ne değişti
- Bağlam temelli sorular yenilendi (18 senaryo, 2 bölümlü yazılı cevap, model cevap + tolerans).
- Beynin bölümleri kaldırıldı.
- 3B modeller: göz, kulak, burun, dil, deri, nöron, sinaps (tıkla-bilgi kartı, döndür, yakınlaştır, dokunmatik).
- Ayrı "Konu Anlatımı" bölümü (Maarif: Merak Et > Öğren > Bağ Kur > Becerini Dene) 11 konu.
- Slayt kapsamı: uyaran/reseptör sınıflandırma, duyu organı-reseptör tablosu, hayvan örnekleri, nöron yapısı,
  eşik değer, ya hep ya hiç, merdiven etkisi, uyartı sıklığı, zar potansiyeli, sinaps, seçici direnç, göz-kamera/kulak-mikrofon.
- 4 simülasyon (her birinde önce görev, sonra gözlem sorusu), 5 oyun, 40 soruluk soru bankası.

## İçerik düzenleme
Konular, sorular ve bağlam soruları data.js içindedir. Bağlam sorusu cevap anahtarı: parts[].a listesi
(normalize edilir; "kelime1+kelime2" yazımında ikisi de geçmelidir).


## Güncelleme: Detaylı 3B duyu organları ve simülasyonlar

Mevcut hiçbir içerik çıkarılmadı; yalnızca ekleme yapıldı.

- `lib/` : three.js r128 ve OrbitControls yerel olarak eklendi (CDN gerekmez, çevrimdışı çalışır).
- `models3d.js` : ortak 3B görüntüleyici (etiket, kesit, katman, tıklayınca bilgi, arkadaki parçayı seçme).
- `eye3d.js` : göz ve retina; `ear3d.js` : kulak, Korti organı, denge organı; `chem3d.js` : burun, koku epiteli, dil, tat tomurcuğu; `skin3d.js` : deri ve deri reseptörleri.
- `sims3d.js` : 6 yeni 3B simülasyon (göz, kulak, denge, koku, tat, deri).
- `data_duyu.js` : 7 yeni konu anlatımı, ~50 yeni soru, 16 yeni bağlam temelli soru (özet metnine göre).
- `games.js` : yeni "3B Organ Avcısı" oyunu.

GitHub'a yüklemek için bu klasörün tüm içeriğini depoya yükleyin (Pages ayarı değişmez).

---
## 🆕 Fizik bölümü ve Kaçış Odası

Tüm dosyalar TEK klasördedir (alt klasör yok). GitHub'a hepsini seçip sürükleyin.
- `index.html` → Ders seçme (Biyoloji / Fizik / Kaçış Odası)
- `biyoloji.html` → Biyoloji sitesi (eski index.html)
- `fizik.html` + `engine.js, fdata.js, fsims.js, fgames.js, fapp.js, fiz.css` → Fizik (Atışlar)
- `escape.html` + `escape.js, escape.css` → Biyo-Fizik Kaçış Odası (kod: 47291)
- `three.min.js`, `OrbitControls.js` → 3B modeller için yerel kütüphaneler
- `arcade.js` + `arcade.css` → 6 arcade oyunu (biyoloji: Uyaran Yağmuru, Nöron Koşusu, Refleks Çekici · fizik: Mancınık, Erzak Atışı, Pota Atışı)
- `pdf_ek.js` → PDF (11.1.5) ekleri: 9 yeni konu anlatımı, Etkinlik 5 (Uygulama 1–9) ve Etkinlik 15 etkileşimli çalışmaları, 32 yeni bağlam sorusu, 51 yeni test sorusu
- `models_ek.js` → Ayrıntılı nöron ve sinaps + 8 yeni 3B model (hücre gövdesi, zar potansiyeli, miyelin, sinir demeti, sinaps çeşitleri, hayvanlarda duyular, reseptör galerisi, siyatik–vagus)
- `platform.js` → Platform oyunları: Süper İmpuls (biyoloji) ve Süper Atış Kaşifi (fizik), 3’er bölüm
- Platform oyunlarına çift zıplama eklendi; dokunmatik kontroller oyun kolu düzeninde (uzun basınca kopyala/yapıştır menüsü açılmaz, parmak kaydırınca buton değişir).
- Tabu oyunu (tabu.js): biyoloji (62 kart) ve fizik (50 kart) için ayrı ayrı; 2–4 takım, süre, tur, pas hakkı, Doğru +1 / Tabu −1, tur sonu terim açıklamaları.
