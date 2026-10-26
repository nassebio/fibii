/* Nasse — Tabu (biyoloji ve fizik terimleri) */
(function () {
  const C = (w, t, d) => ({ w, t: t.split(','), d });
  const BIO = [
    C('Reseptör', 'Uyarı,Algılamak,Duyu,Hücre,Sinir', 'Uyarıları alıp elektriksel sinyale (impulsa) çeviren özelleşmiş yapı.'),
    C('Göz', 'Görmek,Retina,Işık,Bakmak,Organ', 'Işık uyarılarını algılayan görme organı.'),
    C('Retina', 'Ağ tabaka,Göz,Çubuk,Koni,Işık', 'Gözün en iç tabakası; fotoreseptörler burada bulunur.'),
    C('Çubuk hücresi', 'Retina,Loş,Gece,Rodopsin,Siyah beyaz', 'Loş ışıkta görmeyi sağlayan, rodopsin içeren fotoreseptör.'),
    C('Koni hücresi', 'Renk,Retina,Sarı leke,Parlak,Işık', 'Renkli ve keskin görmeyi sağlayan fotoreseptör.'),
    C('Sarı benek', 'Fovea,Keskin,Koni,Retina,Net', 'Konilerin en yoğun olduğu, en net görüntünün oluştuğu bölge.'),
    C('Kör nokta', 'Görme siniri,Reseptör yok,Retina,Göz,Görmek', 'Görme sinirinin gözü terk ettiği, reseptör bulunmayan bölge.'),
    C('İris', 'Renk,Göz bebeği,Kas,Göz,Halka', 'Göze rengini veren, göz bebeğinin çapını ayarlayan yapı.'),
    C('Göz bebeği', 'Pupil,İris,Delik,Işık,Büyümek', 'İrisin ortasındaki, ışığın göze girdiği açıklık.'),
    C('Kornea', 'Saydam,Ön,Göz,Tabaka,Nakil', 'Gözün önündeki saydam, ışığı kıran tabaka.'),
    C('Göz merceği', 'Lens,Kırmak,Uyum,Odak,Saydam', 'Kalınlığını değiştirerek ışığı retinaya odaklayan yapı.'),
    C('Uyum', 'Akomodasyon,Mercek,Yakın,Uzak,Kas', 'Merceğin yakın-uzak bakışa göre kalınlığını ayarlaması.'),
    C('Miyopi', 'Uzak,Görememek,Kalın kenarlı,Gözlük,Önde', 'Görüntünün retinanın önünde oluştuğu, uzağı görememe bozukluğu.'),
    C('Hipermetropi', 'Yakın,Görememek,İnce kenarlı,Gözlük,Arkada', 'Görüntünün retinanın arkasında oluştuğu göz kusuru.'),
    C('Astigmatizm', 'Kornea,Bulanık,Silindirik,Eğri,Göz', 'Kornea yüzeyindeki düzensizlikten kaynaklanan bulanık görme.'),
    C('Rodopsin', 'Pigment,Çubuk,A vitamini,Işık,Gece', 'Çubuk hücrelerindeki ışığa duyarlı pigment.'),
    C('Kulak', 'Duymak,Ses,Denge,Organ,Kepçe', 'İşitme ve denge organı.'),
    C('Kulak zarı', 'Titreşim,Ses,Orta kulak,Zar,Dış kulak', 'Dış ve orta kulağı ayıran, sesle titreşen zar.'),
    C('Çekiç', 'Örs,Üzengi,Kemik,Orta kulak,Alet', 'Orta kulaktaki üç kemikçikten ilki.'),
    C('Üzengi', 'Kemik,Çekiç,Örs,En küçük,Oval pencere', 'Vücudun en küçük kemiği; titreşimi oval pencereye iletir.'),
    C('Östaki borusu', 'Yutak,Basınç,Orta kulak,Kanal,Uçak', 'Orta kulağı yutağa bağlayıp basıncı dengeleyen kanal.'),
    C('Salyangoz', 'Koklea,Sarmal,İç kulak,Corti,İşitme', 'İşitme reseptörlerini taşıyan sarmal iç kulak yapısı.'),
    C('Corti organı', 'Tüylü hücre,Salyangoz,İşitme,Reseptör,Zar', 'Salyangozda bulunan işitme reseptörleri topluluğu.'),
    C('Yarım daire kanalları', 'Denge,Üç,Dönme,İç kulak,Sıvı', 'Dönme hareketlerini algılayan, denge ile ilgili üç kanal.'),
    C('Otolit', 'Kristal,Kalsiyum,Denge,Taş,Kese', 'Tulumcuk ve kesecikte doğrusal hareketi algılatan kireç kristalleri.'),
    C('Burun', 'Koku,Nefes,Koklamak,Yüz,Delik', 'Koku alma organı.'),
    C('Koku epiteli', 'Burun,Mukus,Reseptör,Sarı,Tavan', 'Burun boşluğunun tavanındaki koku reseptörlerini içeren bölge.'),
    C('Kemoreseptör', 'Kimyasal,Koku,Tat,Molekül,Reseptör', 'Kimyasal maddeleri algılayan reseptör türü.'),
    C('Dil', 'Tat,Ağız,Tatmak,Kas,Konuşmak', 'Tat alma organı.'),
    C('Tat tomurcuğu', 'Dil,Papilla,Tat,Por,Reseptör', 'Tat reseptör hücrelerinin toplandığı yapı.'),
    C('Papilla', 'Dil,Kabarcık,Tat,Tomurcuk,Çıkıntı', 'Dil yüzeyindeki küçük çıkıntılar.'),
    C('Umami', 'Tat,Glutamat,Lezzet,Et,Japon', 'Glutamatın verdiği "lezzetli/etsi" beşinci temel tat.'),
    C('Deri', 'Dokunma,Cilt,Organ,Epidermis,Ten', 'Vücudun en büyük organı; dokunma, basınç, sıcaklık, ağrı algılar.'),
    C('Epidermis', 'Üst deri,Deri,Tabaka,Ölü hücre,Keratin', 'Derinin en dış tabakası.'),
    C('Dermis', 'Alt deri,Deri,Reseptör,Kıl,Ter bezi', 'Epidermisin altındaki, reseptör ve bezlerin bulunduğu tabaka.'),
    C('Pacini cisimciği', 'Basınç,Deri,Soğan,Titreşim,Derin', 'Derin basınç ve titreşimi algılayan katmanlı reseptör.'),
    C('Meissner cisimciği', 'Dokunma,Hafif,Parmak ucu,Deri,Yüzey', 'Hafif dokunmayı algılayan reseptör.'),
    C('Serbest sinir ucu', 'Ağrı,Deri,Kılıf yok,Sıcaklık,Uç', 'Ağrıyı algılayan, kılıfsız sinir uçları.'),
    C('Termoreseptör', 'Sıcaklık,Soğuk,Isı,Reseptör,Deri', 'Sıcaklık değişimini algılayan reseptör.'),
    C('Mekanoreseptör', 'Basınç,Dokunma,Mekanik,Ses,Reseptör', 'Basınç, dokunma, ses gibi mekanik uyarıları algılayan reseptör.'),
    C('Fotoreseptör', 'Işık,Göz,Retina,Çubuk,Koni', 'Işığı algılayan reseptör.'),
    C('Nosiseptör', 'Ağrı,Acı,Hasar,Reseptör,Uyarı', 'Doku hasarı ve ağrıyı algılayan reseptör.'),
    C('Adaptasyon', 'Alışmak,Uyum,Reseptör,Zamanla,Azalmak', 'Sürekli uyarıya karşı reseptör tepkisinin zamanla azalması.'),
    C('Nöron', 'Sinir hücresi,Akson,Dendrit,Beyin,İmpuls', 'Sinir sisteminin temel yapı ve görev birimi.'),
    C('Akson', 'Uzun,Nöron,Uzantı,İmpuls,Miyelin', 'İmpulsu hücre gövdesinden uzağa ileten uzantı.'),
    C('Dendrit', 'Kısa,Dal,Nöron,Almak,Uzantı', 'İmpulsu alıp hücre gövdesine taşıyan kısa uzantılar.'),
    C('Miyelin kılıf', 'Yağ,Akson,Hız,Schwann,Yalıtım', 'Aksonu saran, impuls iletimini hızlandıran yalıtkan kılıf.'),
    C('Ranvier boğumu', 'Miyelin,Boşluk,Sıçrayarak,Akson,Hız', 'Miyelin kılıf aralarındaki boşluklar.'),
    C('Sinaps', 'Nöron,Bağlantı,Boşluk,Nörotransmitter,İletim', 'İki nöron ya da nöron-hedef hücre arasındaki bağlantı bölgesi.'),
    C('Nörotransmitter', 'Kimyasal,Sinaps,Kesecik,Salgı,Asetilkolin', 'Sinapsta impulsu ileten kimyasal haberci.'),
    C('Asetilkolin', 'Nörotransmitter,Kas,Sinaps,Kimyasal,Kolinesteraz', 'Kas-sinir kavşağında görev yapan nörotransmitter.'),
    C('Dinlenme potansiyeli', '-70,Zar,Polarize,Sodyum,Potasyum', 'Uyarılmamış nöronda zarın iki tarafı arasındaki yük farkı (~−70 mV).'),
    C('Depolarizasyon', 'Sodyum,Giriş,Pozitif,Zar,Uyarı', 'Na⁺ girişiyle zar içinin pozitifleşmesi.'),
    C('Repolarizasyon', 'Potasyum,Çıkış,Geri,Zar,Negatif', 'K⁺ çıkışıyla zarın tekrar negatifleşmesi.'),
    C('Sodyum-potasyum pompası', 'ATP,3 Na,2 K,Aktif taşıma,Zar', 'ATP harcayarak 3 Na⁺ dışarı, 2 K⁺ içeri pompalayan protein.'),
    C('Eşik değer', 'Uyarı,En küçük,Ya hep ya hiç,Şiddet,İmpuls', 'İmpuls oluşturabilecek en düşük uyarı şiddeti.'),
    C('Ya hep ya hiç kuralı', 'Eşik,İmpuls,Tam,Hiç,Uyarı', 'Eşik üstü uyarıda tam impuls, altında hiç impuls oluşması.'),
    C('Refrakter dönem', 'Tepkisiz,Süre,Uyarı,Nöron,Yeni impuls', 'Nöronun yeni uyarıya cevap veremediği kısa süre.'),
    C('Refleks', 'İstemsiz,Omurilik,Ani,Diz,Tepki', 'Uyarıya karşı istem dışı, hızlı tepki.'),
    C('Duyu nöronu', 'Reseptör,Taşımak,Afferent,Merkez,Nöron', 'İmpulsu reseptörden merkezi sinir sistemine taşıyan nöron.'),
    C('Motor nöron', 'Kas,Hareket,Efferent,Merkez,Nöron', 'İmpulsu merkezi sinir sisteminden kas ve bezlere taşıyan nöron.'),
    C('Ara nöron', 'Bağlantı,Omurilik,Beyin,Duyu,Motor', 'Duyu ve motor nöronlar arasında bağlantı kuran nöron.')
  ];
  const FIZ = [
    C('Serbest düşme', 'Bırakmak,İlk hız,Sıfır,Yer çekimi,Düşmek', 'İlk hızsız bırakılan cismin yalnız yer çekimi etkisindeki hareketi.'),
    C('Yer çekimi ivmesi', 'g,10,Dünya,Hızlanma,Aşağı', 'Dünya yüzeyinde cisimlere kazandırılan yaklaşık 10 m/s²’lik ivme.'),
    C('İvme', 'Hız,Değişim,Birim zaman,m/s²,Hızlanmak', 'Hızın birim zamandaki değişimi.'),
    C('Hız', 'Sürat,Yol,Zaman,m/s,Hızlı', 'Yer değiştirmenin birim zamandaki değişimi (vektörel).'),
    C('Sürat', 'Hız,Yol,Zaman,Skaler,Ne kadar', 'Alınan yolun birim zamana oranı (skaler).'),
    C('Yer değiştirme', 'Konum,Fark,Vektör,Yol,İlk-son', 'İlk ve son konum arasındaki yönlü uzaklık.'),
    C('Vektör', 'Yön,Büyüklük,Ok,Skaler,Kuvvet', 'Büyüklüğü ve yönü olan fiziksel nicelik.'),
    C('Skaler', 'Büyüklük,Yön yok,Vektör,Kütle,Sayı', 'Yalnız büyüklüğü olan nicelik.'),
    C('Bileşen', 'Vektör,x,y,Ayırmak,Parça', 'Bir vektörün eksenler üzerindeki izdüşümleri.'),
    C('Düşey atış', 'Yukarı,Aşağı,Dik,Fırlatmak,İlk hız', 'Cismin ilk hızla düşey doğrultuda atılması.'),
    C('Aşağı doğru atış', 'Düşey,İlk hız,Aşağı,Hızlanmak,Bina', 'Cismin ilk hızla aşağı yönde atılması.'),
    C('Yukarı doğru atış', 'Düşey,İlk hız,Yukarı,Yavaşlamak,Tepe', 'Cismin ilk hızla yukarı atılması.'),
    C('Yatay atış', 'Yatay,Masa,Parabol,Yükseklik,İlk hız', 'Belli yükseklikten yatay ilk hızla atılan cismin hareketi.'),
    C('Eğik atış', 'Açı,Parabol,Top,Menzil,Fırlatmak', 'Cismin yatayla açı yapacak şekilde atılması.'),
    C('Menzil', 'Uzaklık,Yatay,Eğik atış,45,Erişim', 'Atılan cismin yatayda aldığı toplam yol.'),
    C('Maksimum yükseklik', 'Tepe,En yüksek,h max,Çıkış,Yükseklik', 'Atılan cismin ulaşabildiği en büyük yükseklik.'),
    C('Tepe noktası', 'En üst,Düşey hız,Sıfır,Maksimum,Yükseklik', 'Düşey hızın sıfır olduğu, yörüngenin en üst noktası.'),
    C('Uçuş süresi', 'Zaman,Havada,Toplam,Çıkış,İniş', 'Cismin atıldığı andan yere düşene kadar geçen süre.'),
    C('Çıkış süresi', 'Tepe,Zaman,v₀/g,Yukarı,Süre', 'Cismin tepe noktasına ulaşma süresi.'),
    C('Yörünge', 'Yol,Çizgi,Parabol,Hareket,İz', 'Hareketli cismin izlediği yol.'),
    C('Parabol', 'Eğri,Yörünge,Atış,Çan,Yay', 'Yatay ve eğik atışta oluşan eğri yörünge.'),
    C('Hava direnci', 'Sürtünme,Hava,Yavaşlatmak,Paraşüt,İhmal', 'Hava içinde hareket eden cisme etki eden zıt yönlü kuvvet.'),
    C('Limit hız', 'Sabit,Hava direnci,Paraşüt,Dengelenmek,Maksimum', 'Hava direnci ağırlığa eşit olunca ulaşılan sabit hız.'),
    C('Paraşüt', 'Atlamak,Uçak,Hava direnci,Yavaş,İnmek', 'Hava direncini artırarak düşüş hızını azaltan araç.'),
    C('Ağırlık', 'Kütle,Kuvvet,mg,Newton,Kilo', 'Bir cisme etki eden yer çekimi kuvveti.'),
    C('Kütle', 'Kilogram,Madde miktarı,Ağırlık,Eylemsizlik,Terazi', 'Madde miktarının ölçüsü.'),
    C('Kuvvet', 'İtmek,Çekmek,Newton,Etki,F', 'Cismin hareket durumunu değiştirebilen etki.'),
    C('Newton', 'Birim,Kuvvet,Elma,Bilim insanı,N', 'Kuvvet birimi; aynı zamanda hareket yasalarının sahibi.'),
    C('Eylemsizlik', 'Newton,1. yasa,Durgun,Sabit hız,Direnç', 'Cismin hareket durumunu koruma eğilimi.'),
    C('Net kuvvet', 'Bileşke,Toplam,Kuvvet,F=ma,İvme', 'Cisme etki eden tüm kuvvetlerin vektörel toplamı.'),
    C('Düzgün doğrusal hareket', 'Sabit hız,İvme yok,Doğru,Eşit,Zaman', 'Sabit hızla doğru boyunca yapılan hareket.'),
    C('Düzgün hızlanan hareket', 'Sabit ivme,Artmak,Hız,Düzgün,İvme', 'İvmenin sabit olduğu, hızın düzgün arttığı hareket.'),
    C('Konum-zaman grafiği', 'x-t,Eğim,Hız,Grafik,Doğru', 'Konumun zamana göre değişimini gösteren grafik; eğimi hızı verir.'),
    C('Hız-zaman grafiği', 'v-t,Alan,Eğim,İvme,Grafik', 'Eğimi ivmeyi, altındaki alan yer değiştirmeyi veren grafik.'),
    C('Eğim', 'Grafik,Dikliş,Tanjant,Oran,Doğru', 'Grafikte düşey değişimin yatay değişime oranı.'),
    C('Kinetik enerji', 'Hareket,½mv²,Hız,Enerji,Joule', 'Cismin hareketinden dolayı sahip olduğu enerji.'),
    C('Potansiyel enerji', 'Yükseklik,mgh,Konum,Depo,Enerji', 'Cismin konumundan (yüksekliğinden) dolayı sahip olduğu enerji.'),
    C('Mekanik enerjinin korunumu', 'Kinetik,Potansiyel,Toplam,Sabit,Sürtünme', 'Sürtünmesiz ortamda kinetik + potansiyel enerjinin sabit kalması.'),
    C('Joule', 'Enerji,Birim,İş,J,Bilim insanı', 'Enerji ve iş birimi.'),
    C('Galileo', 'Pisa,Kule,Düşme,Bilim insanı,İtalyan', 'Cisimlerin kütleden bağımsız aynı ivmeyle düştüğünü gösteren bilim insanı.'),
    C('Referans noktası', 'Başlangıç,Sıfır,Konum,Gözlemci,Nokta', 'Konumun ölçüldüğü başlangıç noktası.'),
    C('Bağıl hareket', 'Gözlemci,Göre,Hız,Tren,Fark', 'Bir cismin başka bir hareketli gözlemciye göre hareketi.'),
    C('Ortalama hız', 'Toplam,Yer değiştirme,Zaman,Ortalama,Bölmek', 'Toplam yer değiştirmenin toplam süreye oranı.'),
    C('Anlık hız', 'An,O,Teğet,Hız,Eğim', 'Belli bir andaki hız; x-t grafiğinde teğetin eğimi.'),
    C('Yatay hız bileşeni', 'vx,Sabit,Yatay,Değişmez,cos', 'Atışlarda hava direnci ihmal edilince sabit kalan hız bileşeni.'),
    C('Düşey hız bileşeni', 'vy,Değişir,g,Düşey,sin', 'Yer çekimi nedeniyle her saniye 10 m/s değişen hız bileşeni.'),
    C('45 derece', 'Açı,Menzil,En büyük,Eğik atış,Yarım dik', 'Eğik atışta (aynı seviyeye) en büyük menzili veren açı.'),
    C('Tümler açılar', '90,Menzil,Eşit,30-60,Toplam', 'Toplamı 90° olan açılarla atılan cisimlerin menzilleri eşittir.'),
    C('Top güllesi', 'Atış,Savaş,Namlu,Parabol,Demir', 'Eğik atışın klasik örneği.'),
    C('Basketbol atışı', 'Pota,Top,Parabol,Sayı,Eğik', 'Günlük hayatta eğik atış örneği.')
  ];

  let ac, mute = false;
  function snd(f, d, t, v) { if (mute) return; try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), g = ac.createGain(); o.type = t || 'sine'; o.frequency.value = f; g.gain.value = v || .06; o.connect(g); g.connect(ac.destination); o.start(); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + d); o.stop(ac.currentTime + d); } catch (e) { } }
  const SFX = { ok() { snd(660, .1); setTimeout(() => snd(990, .18), 80); }, tabu() { snd(220, .1, 'sawtooth', .08); setTimeout(() => snd(140, .35, 'sawtooth', .08), 100); }, pas() { snd(440, .12, 'triangle'); }, tick() { snd(1200, .04, 'square', .03); }, end() { [784, 659, 523, 392].forEach((f, i) => setTimeout(() => snd(f, .2, 'square'), i * 150)); }, win() { [523, 659, 784, 1046, 784, 1046].forEach((f, i) => setTimeout(() => snd(f, .16), i * 130)); } };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const TCOL = ['#3aa0ff', '#ff5a6e', '#2fd47a', '#ffb02e'];

  function makeTabu(DECK, cfg) {
    return function (box) {
      let timer = null, alive = true;
      const st = { teams: [], round: 0, rounds: 3, sec: 60, pas: 3, turn: 0, deck: [], log: [] };
      box.innerHTML = '';
      const wrap = document.createElement('div'); wrap.className = 'arc tabu'; box.appendChild(wrap);
      wrap.addEventListener('contextmenu', e => e.preventDefault());
      const award2 = (k, xp, m) => { try { if (typeof award === 'function') award(k, xp, m); } catch (e) { } };

      function setup() {
        stop();
        wrap.innerHTML = `
        <div class="tb-head"><span class="tb-logo">TABU</span><span class="tb-sub">${cfg.sub}</span></div>
        <div class="tb-card tb-setup">
          <p class="tb-rule">Takımlar sırayla oynar. Anlatıcı karttaki <b>ana kelimeyi</b>, altındaki <b>yasaklı kelimeleri</b> söylemeden takım arkadaşlarına anlatır. Süre bitmeden ne kadar çok kart bilinirse o kadar puan!<br>✅ Doğru: <b>+1</b> · ⛔ Tabu (yasaklı kelime söylendi): <b>−1</b> · ⏭ Pas: puan yok (sınırlı)</p>
          <label>Takım sayısı</label><div class="tb-seg" data-s="n">${[2, 3, 4].map(n => `<button data-v="${n}" class="${n === 2 ? 'on' : ''}">${n}</button>`).join('')}</div>
          <div class="tb-names"></div>
          <label>Tur süresi</label><div class="tb-seg" data-s="sec">${[45, 60, 90, 120].map(n => `<button data-v="${n}" class="${n === 60 ? 'on' : ''}">${n} sn</button>`).join('')}</div>
          <label>Tur sayısı (her takım için)</label><div class="tb-seg" data-s="rounds">${[2, 3, 4, 5].map(n => `<button data-v="${n}" class="${n === 3 ? 'on' : ''}">${n}</button>`).join('')}</div>
          <label>Pas hakkı (tur başına)</label><div class="tb-seg" data-s="pas">${[1, 3, 5].map(n => `<button data-v="${n}" class="${n === 3 ? 'on' : ''}">${n}</button>`).join('')}</div>
          <button class="btn big tb-go">▶ Oyunu başlat</button>
          <p class="tb-mini">${DECK.length} kart · Kartlar ${cfg.ders} konularından hazırlandı.</p>
        </div>`;
        const val = { n: 2, sec: 60, rounds: 3, pas: 3 };
        const names = wrap.querySelector('.tb-names');
        const drawNames = () => { const old = [...names.querySelectorAll('input')].map(i => i.value); names.innerHTML = Array.from({ length: val.n }, (_, i) => `<input maxlength="18" style="border-color:${TCOL[i]}" value="${esc(old[i] || cfg.teams[i])}">`).join(''); };
        drawNames();
        wrap.querySelectorAll('.tb-seg').forEach(sg => sg.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; sg.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); val[sg.dataset.s] = +b.dataset.v; if (sg.dataset.s === 'n') drawNames(); }));
        wrap.querySelector('.tb-go').onclick = () => {
          st.teams = [...names.querySelectorAll('input')].map((i, k) => ({ name: i.value.trim() || cfg.teams[k], score: 0, ok: 0, tabu: 0, col: TCOL[k] }));
          st.sec = val.sec; st.rounds = val.rounds; st.pas = val.pas; st.round = 0; st.turn = 0; st.deck = shuffle(DECK); st.log = [];
          ready();
        };
      }
      const draw = () => { if (!st.deck.length) st.deck = shuffle(DECK); return st.deck.pop(); };
      const board = () => `<div class="tb-board">${st.teams.map((t, i) => `<div class="tb-team ${i === st.turn ? 'cur' : ''}" style="--c:${t.col}"><span>${esc(t.name)}</span><b>${t.score}</b></div>`).join('')}</div>`;

      function ready() {
        stop();
        const t = st.teams[st.turn];
        wrap.innerHTML = `${board()}
        <div class="tb-card tb-ready" style="--c:${t.col}">
          <div class="tb-rnd">Tur ${st.round + 1} / ${st.rounds}</div>
          <h3>Sıra <span style="color:${t.col}">${esc(t.name)}</span> takımında!</h3>
          <p>Anlatıcı telefonu/ekranı alsın, takım arkadaşları ekranı <b>görmesin</b>.<br>Rakip takım yasaklı kelimeleri takip edebilir.</p>
          <button class="btn big tb-start">⏱ ${st.sec} saniye — Başla!</button>
        </div>`;
        wrap.querySelector('.tb-start').onclick = play;
      }

      function play() {
        const t = st.teams[st.turn];
        let left = st.sec, pas = st.pas, card = draw(), turnLog = [];
        wrap.innerHTML = `${board()}
        <div class="tb-top"><div class="tb-time"><div class="tb-bar"></div><span class="tb-sec">${left}</span></div><span class="tb-pas">⏭ ${pas}</span></div>
        <div class="tb-card tb-play" style="--c:${t.col}"><div class="tb-word"></div><div class="tb-ban"></div></div>
        <div class="tb-btns"><button class="tb-b tb-no">⛔<small>Tabu −1</small></button><button class="tb-b tb-skip">⏭<small>Pas</small></button><button class="tb-b tb-yes">✅<small>Doğru +1</small></button></div>
        <div class="tb-last"></div>`;
        const $w = wrap.querySelector('.tb-word'), $b = wrap.querySelector('.tb-ban'), $s = wrap.querySelector('.tb-sec'), $bar = wrap.querySelector('.tb-bar'), $p = wrap.querySelector('.tb-pas'), $card = wrap.querySelector('.tb-play'), $last = wrap.querySelector('.tb-last'), $skip = wrap.querySelector('.tb-skip');
        const show = () => { $w.textContent = card.w; $b.innerHTML = card.t.map(x => `<span>${esc(x)}</span>`).join(''); $card.classList.remove('flip'); void $card.offsetWidth; $card.classList.add('flip'); };
        const scoreUpd = () => { const el = wrap.querySelectorAll('.tb-team b')[st.turn]; if (el) el.textContent = t.score; };
        const next = (res) => {
          turnLog.push({ c: card, r: res });
          const lab = res === 'ok' ? '✅' : res === 'tabu' ? '⛔' : '⏭';
          $last.innerHTML = `<b>${lab} ${esc(card.w)}</b> — ${esc(card.d)}`;
          card = draw(); show();
        };
        wrap.querySelector('.tb-yes').onclick = () => { t.score++; t.ok++; SFX.ok(); scoreUpd(); flash('ok'); next('ok'); };
        wrap.querySelector('.tb-no').onclick = () => { t.score--; t.tabu++; SFX.tabu(); scoreUpd(); flash('tabu'); next('tabu'); };
        $skip.onclick = () => { if (pas <= 0) return; pas--; $p.textContent = '⏭ ' + pas; if (!pas) $skip.disabled = true; SFX.pas(); next('pas'); };
        const flash = c => { $card.classList.remove('ok', 'tabu'); void $card.offsetWidth; $card.classList.add(c); };
        show();
        const t0 = performance.now();
        timer = setInterval(() => {
          if (!alive) return stop();
          const el = st.sec - (performance.now() - t0) / 1000, nl = Math.max(0, Math.ceil(el));
          $bar.style.width = Math.max(0, el / st.sec * 100) + '%';
          $bar.classList.toggle('hot', el < 10);
          if (nl !== left) { left = nl; $s.textContent = left; if (left <= 5 && left > 0) SFX.tick(); }
          if (el <= 0) { stop(); SFX.end(); summary(turnLog); }
        }, 100);
      }

      function summary(turnLog) {
        const t = st.teams[st.turn];
        const ok = turnLog.filter(x => x.r === 'ok').length, tb = turnLog.filter(x => x.r === 'tabu').length;
        wrap.innerHTML = `${board()}
        <div class="tb-card tb-sum" style="--c:${t.col}">
          <h3>⏰ Süre doldu!</h3>
          <p><b style="color:${t.col}">${esc(t.name)}</b> bu tur: ✅ ${ok} · ⛔ ${tb} → <b>${ok - tb >= 0 ? '+' : ''}${ok - tb} puan</b></p>
          <div class="tb-list">${turnLog.map(x => `<div class="tb-li ${x.r}"><b>${x.r === 'ok' ? '✅' : x.r === 'tabu' ? '⛔' : '⏭'} ${esc(x.c.w)}</b><span>${esc(x.c.d)}</span></div>`).join('') || '<p>Hiç kart oynanmadı.</p>'}</div>
          <button class="btn big tb-nx">Sıradaki takım ▶</button>
        </div>`;
        wrap.querySelector('.tb-nx').onclick = () => {
          st.turn++;
          if (st.turn >= st.teams.length) { st.turn = 0; st.round++; }
          if (st.round >= st.rounds) finish(); else ready();
        };
      }

      function finish() {
        stop(); SFX.win();
        const sorted = st.teams.slice().sort((a, b) => b.score - a.score), top = sorted[0].score, wins = sorted.filter(x => x.score === top);
        const totalOk = st.teams.reduce((s, x) => s + x.ok, 0);
        award2(cfg.key, Math.min(60, 10 + totalOk * 2), `Tabu bitti! ${totalOk} terim anlatıldı.`);
        wrap.innerHTML = `
        <div class="tb-card tb-end">
          <div class="tb-cup">🏆</div>
          <h3>${wins.length > 1 ? 'Berabere! ' + wins.map(w => esc(w.name)).join(' & ') : esc(wins[0].name) + ' kazandı!'}</h3>
          <div class="tb-rank">${sorted.map((x, i) => `<div style="--c:${x.col}"><span>${i + 1}. ${esc(x.name)}</span><span>✅${x.ok} ⛔${x.tabu}</span><b>${x.score}</b></div>`).join('')}</div>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="btn big tb-again">↻ Aynı takımlarla tekrar</button><button class="btn ghost big tb-new">⚙ Yeni ayar</button></div>
        </div>`;
        wrap.querySelector('.tb-again').onclick = () => { st.teams.forEach(x => { x.score = 0; x.ok = 0; x.tabu = 0; }); st.round = 0; st.turn = 0; ready(); };
        wrap.querySelector('.tb-new').onclick = setup;
      }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }
      setup();
      return () => { alive = false; stop(); };
    };
  }

  const BIOCFG = { sub: 'Biyoloji terimleri · Duyu organları & sinir sistemi', ders: 'biyoloji', key: 'tabu_bio', teams: ['Reseptörler', 'Nöronlar', 'Sinapslar', 'Aksonlar'] };
  const FIZCFG = { sub: 'Fizik terimleri · Hareket & atışlar', ders: 'fizik', key: 'tabu_fiz', teams: ['Parabol', 'Menzil', 'İvme', 'Vektör'] };
  if (typeof GAMES !== 'undefined' && typeof GAME_FN !== 'undefined') { GAMES.tabu_bio = { title: 'Tabu (biyoloji terimleri)', ico: '🚫', desc: `Takımlar halinde ${BIO.length} biyoloji terimini yasaklı kelimeleri söylemeden anlat!` }; GAME_FN.tabu_bio = makeTabu(BIO, BIOCFG); }
  if (typeof FGAMES !== 'undefined') FGAMES.tabu_fiz = { title: 'Tabu (fizik terimleri)', ico: '🚫', desc: `Takımlar halinde ${FIZ.length} fizik terimini yasaklı kelimeleri söylemeden anlat!`, fn: makeTabu(FIZ, FIZCFG) };
  window.TABU_DECKS = { BIO, FIZ };
})();
