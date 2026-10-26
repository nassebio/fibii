/* Nasse Fizik — 11. sınıf · Atışlar: konu anlatımı, soru bankası, açık uçlu bağlam soruları (g = 10 m/s², hava direnci ihmal) */
const FKAZANIM = '11. Sınıf Fizik · Atışlar: Serbest düşme, düşey, yatay ve eğik atış hareketlerini (eğik düzlemde atış dâhil) bileşenlerine ayırarak inceler; hareketin bileşenlerini ve niceliklerini belirler.';

const FTOPICS = [
  {
    id: 'hareket-temel', code: 'Ön bilgi', ico: '🧭', title: 'Hareketin Temelleri: Konum, Hız, İvme',
    merak: 'Bir araba 20 m/s hızla giderken bir top havaya fırlatılıyor. Topun hareketi neden araba içindeki ve dışındaki gözlemciye farklı görünür?',
    flow: ['Konum', 'Yer değiştirme', 'Hız', 'İvme'],
    ogren: `<p><b>Konum (x, y):</b> cismin seçilen orijine göre yeridir. <b>Yer değiştirme (Δx):</b> son konum − ilk konum; vektörel niceliktir.</p>
    <p><b>Hız:</b> v = Δx/Δt (ortalama). <b>İvme:</b> a = Δv/Δt. Sabit ivmeli harekette (bir boyutta):</p>
    <table class="tbl"><tr><th>Bağıntı</th><th>Anlamı</th></tr><tr><td>v = v₀ + a·t</td><td>hız–zaman</td></tr><tr><td>x = x₀ + v₀·t + ½·a·t²</td><td>konum–zaman</td></tr><tr><td>v² = v₀² + 2·a·Δx</td><td>zamansız bağıntı</td></tr></table>
    <p>Grafikler: <b>v–t grafiğinin eğimi ivmeyi</b>, grafiğin altındaki alan yer değiştirmeyi verir.</p>
    <p>İki boyutlu harekette <b>x ve y doğrultularındaki hareketler birbirinden bağımsız</b> incelenir ve zaman iki harekette de ortaktır.</p>`,
    bag: 'Atışların hepsi, “yatayda sabit hız + düşeyde sabit ivme (g)” hareketlerinin birleşimidir.', note: 'Bu bölüm atışlar için gerekli ön bilgiyi hatırlatır.', check: { q: 'v–t grafiğinde doğrunun eğimi neyi verir?', o: ['İvmeyi', 'Konumu', 'Yer değiştirmeyi', 'Kütleyi'], a: 0, e: 'Eğim = Δv/Δt = ivme.' }
  },
  {
    id: 'vektor-bilesen', code: 'Atışlar-1', ico: '📏', title: 'Vektörlerin Bileşenleri ve Bağımsızlık İlkesi',
    merak: 'Eğik atılan bir topun hızını neden iki ayrı hız gibi düşünürüz? Yatay ve düşey hareketler birbirini etkiler mi?',
    flow: ['v₀ vektörü', 'v₀ₓ = v₀cosθ', 'v₀y = v₀sinθ', 'Bağımsız hareketler'],
    ogren: `<p>Yatayla θ açısı yapan v₀ hızı iki dik bileşene ayrılır:</p>
    <table class="tbl"><tr><th>Bileşen</th><th>Formül</th><th>Not</th></tr><tr><td>Yatay</td><td>v₀ₓ = v₀·cosθ</td><td>hareket boyunca <b>sabit</b></td></tr><tr><td>Düşey</td><td>v₀y = v₀·sinθ</td><td>g ile değişir</td></tr></table>
    <ul><li>Bileşke büyüklük: v = √(vₓ² + v_y²); yön: tanα = v_y / vₓ.</li><li><b>Bağımsızlık ilkesi:</b> Yatay ve düşey hareketler birbirini etkilemez; ortak olan tek şey <b>zamandır</b>.</li><li>Sık kullanılan açılar: 37° (sin 0,6 · cos 0,8), 53° (sin 0,8 · cos 0,6), 30°, 45°, 60°.</li></ul>`,
    bag: 'Vektörleri bileşenlerine ayırdığımızda iki boyutlu karmaşık hareket, iki basit bir boyutlu harekete indirgenir.', note: 'Hava direnci ihmal edilir; g = 10 m/s² alınır.',
    check: { q: 'v₀ = 50 m/s, θ = 37° için v₀ₓ ve v₀y kaç m/s’dir? (sin37° = 0,6)', o: ['40 ve 30', '30 ve 40', '50 ve 0', '25 ve 25'], a: 0, e: 'v₀ₓ = 50·0,8 = 40, v₀y = 50·0,6 = 30 m/s.' }
  },
  {
    id: 'serbest-dusme', code: 'Atışlar-2', ico: '🍎', title: 'Serbest Düşme',
    merak: 'Ağır bir taş ile hafif bir tüy neden farklı sürede iner? Hava olmasaydı ne olurdu?',
    flow: ['v₀ = 0', 'a = g', 'v = gt', 'h = ½gt²'],
    ogren: `<p>Cismin ilk hızı sıfır olup yalnızca yerçekimi etkisinde düşmesine <b>serbest düşme</b> denir. Hava direnci yoksa tüm cisimler <b>kütleden bağımsız</b> aynı g ile düşer (g = 10 m/s², Ay’da ≈ 1,6 m/s²).</p>
    <table class="tbl"><tr><th>Büyüklük</th><th>Formül</th></tr><tr><td>Hız</td><td>v = g·t</td></tr><tr><td>Yol (yükseklik)</td><td>h = ½·g·t²</td></tr><tr><td>Zamansız</td><td>v² = 2·g·h</td></tr><tr><td>Düşme süresi</td><td>t = √(2h/g)</td></tr></table>
    <ul><li>Ardışık saniyelerde alınan yollar oranı <b>1 : 3 : 5 : 7 …</b> (g = 10 için 5 m, 15 m, 25 m…).</li><li>Hız–zaman grafiği orijinden geçen doğru, yol–zaman grafiği paraboldür.</li><li>Hava direnci varsa cisim sınır hıza ulaşabilir.</li></ul>`,
    bag: 'Yatay atışta düşey hareket tam olarak serbest düşmedir.', note: 'Başlangıç hızı sıfır olmayan düşey hareketler “düşey atış”tır.',
    check: { q: 'Serbest bırakılan cismin 3. saniye sonundaki hızı (g = 10 m/s²) kaç m/s’dir?', o: ['10', '20', '30', '45'], a: 2, e: 'v = g·t = 10·3 = 30 m/s.' }
  },
  {
    id: 'dusey-atis', code: 'Atışlar-3', ico: '⬆️', title: 'Düşey Atış (Yukarı ve Aşağı)',
    merak: 'Tepe noktasında topun hızı sıfır; peki ivmesi sıfır mıdır?',
    flow: ['v₀', 'Yükselir (v azalır)', 'Tepe: v = 0', 'İner (v artar)'],
    ogren: `<p>Cisim düşey doğrultuda v₀ ile atılırsa ivme her an <b>g, aşağı yönlüdür</b>. Yukarı yönü pozitif seçersek (a = −g):</p>
    <table class="tbl"><tr><th>Büyüklük</th><th>Formül</th></tr><tr><td>Hız</td><td>v = v₀ − g·t</td></tr><tr><td>Konum</td><td>y = h₀ + v₀·t − ½g·t²</td></tr><tr><td>Zamansız</td><td>v² = v₀² − 2g·Δy</td></tr><tr><td>Çıkış süresi</td><td>t_ç = v₀/g</td></tr><tr><td>Maks. yükseklik</td><td>H = v₀²/(2g)</td></tr><tr><td>Uçuş süresi (aynı seviye)</td><td>T = 2v₀/g</td></tr></table>
    <ul><li>Çıkış süresi = iniş süresi (aynı seviyeye dönüşte).</li><li>Aynı yükseklikteki hız büyüklükleri eşittir (yönü zıt).</li><li>Tepe noktasında v = 0 ama a = g.</li><li>Aşağı atışta v₀ aşağı yönlüdür: v = v₀ + g·t (aşağı +), h = v₀t + ½gt².</li></ul>`,
    bag: 'Eğik atışta düşey bileşen (v₀y) tam olarak bu harekettir.', note: 'Hava direnci ihmal edilir.',
    check: { q: 'v₀ = 30 m/s ile dik yukarı atılan cismin (g = 10) çıkabileceği en büyük yükseklik kaç metredir?', o: ['30', '45', '60', '90'], a: 1, e: 'H = v₀²/2g = 900/20 = 45 m.' }
  },
  {
    id: 'yatay-atis', code: 'Atışlar-4', ico: '➡️', title: 'Yatay Atış',
    merak: 'Uçurumdan yatay fırlatılan top ile serbest bırakılan top aynı anda yere iner mi?',
    flow: ['Yatay: vₓ sabit', 'Düşey: serbest düşme', 'Yörünge: parabol'],
    ogren: `<p>h yüksekliğinden yatay vₓ hızıyla atılan cismin hareketi iki bağımsız harekettir:</p>
    <table class="tbl"><tr><th>Doğrultu</th><th>Hareket</th><th>Formüller</th></tr><tr><td>Yatay (x)</td><td>sabit hızlı</td><td>x = vₓ·t</td></tr><tr><td>Düşey (y)</td><td>serbest düşme</td><td>v_y = g·t, y = ½gt²</td></tr></table>
    <ul><li>Düşme süresi t = √(2h/g) <b>yalnızca yüksekliğe</b> bağlıdır.</li><li>Menzil R = vₓ·t = vₓ·√(2h/g).</li><li>Anlık hız: v = √(vₓ² + v_y²), yön tanα = v_y/vₓ (yatayın altında).</li><li>Yörünge <b>paraboldür</b>: y = (g/2vₓ²)·x² (aşağı ölçülürse).</li><li>Aynı yükseklikten serbest bırakılan cisimle <b>aynı anda</b> yere ulaşır.</li></ul>`,
    bag: 'Yatay atış, eğik atışın θ = 0° ve tepe noktasından başlayan özel durumudur.', note: 'Yükseklik ve yatay hız bağımsız değişkenlerdir.',
    check: { q: '20 m yükseklikten yatay 10 m/s hızla atılan cismin menzili (g = 10) kaç m’dir?', o: ['10', '20', '30', '40'], a: 1, e: 't = √(2·20/10) = 2 s; R = 10·2 = 20 m.' }
  },
  {
    id: 'egik-atis', code: 'Atışlar-5', ico: '🎯', title: 'Eğik Atış',
    merak: 'En uzağa vurmak için topa kaç derece açıyla vurmalısın? 30° ve 60° neden aynı yere düşer?',
    flow: ['v₀ₓ = v₀cosθ', 'v₀y = v₀sinθ', 'Tepe: v_y = 0', 'T = 2v₀y/g'],
    ogren: `<p>Yerden v₀ hızıyla yatayla θ açısı yapacak biçimde atılan cisim için:</p>
    <table class="tbl"><tr><th>Büyüklük</th><th>Formül</th></tr><tr><td>Bileşenler</td><td>v₀ₓ = v₀cosθ · v₀y = v₀sinθ</td></tr><tr><td>Çıkış süresi</td><td>t_H = v₀sinθ / g</td></tr><tr><td>Uçuş süresi</td><td>T = 2v₀sinθ / g</td></tr><tr><td>Maks. yükseklik</td><td>H = v₀²sin²θ / (2g)</td></tr><tr><td>Menzil</td><td>R = v₀²·sin2θ / g</td></tr></table>
    <ul><li><b>Tepe noktasında:</b> v_y = 0, v = vₓ = v₀cosθ (hızın en küçük olduğu an), ivme = g.</li><li><b>Menzil en büyük θ = 45°</b> için olur (R_max = v₀²/g).</li><li><b>Tamamlayıcı açılar</b> (θ ve 90°−θ) aynı menzili verir; yükseklik ve süre farklıdır.</li><li>v₀ iki katına çıkarsa R ve H dört, T iki katına çıkar.</li><li>Aynı seviyede hız büyüklüğü v₀’dır; yön yatayın altındadır.</li></ul>`,
    bag: 'Eğik atış, yatayda sabit hızlı hareket ile düşeyde düşey atışın birleşimidir.', note: 'Hava direnci menzili azaltır; en uzak menzil için en uygun açı bu durumda 45°’den küçük olur (ek bilgi).',
    check: { q: 'v₀ = 20 m/s, θ = 30° için menzil kaç m’dir? (g = 10, sin60° ≈ 0,87)', o: ['≈ 17,4', '≈ 34,8', '40', '20'], a: 1, e: 'R = v₀²sin2θ/g = 400·0,87/10 ≈ 34,8 m.' }
  },
  {
    id: 'yuksekten-atis', code: 'Atışlar-6', ico: '🏔️', title: 'Yüksek Bir Yerden Atış',
    merak: 'Binanın tepesinden aynı hızla yukarı, yatay ve aşağı atılan taşların yere çarpma hızları farklı mıdır?',
    flow: ['h₀ ve v₀', 'Düşey: y = h₀ + v₀y t − ½gt²', 'T: y = 0', 'R = vₓ T'],
    ogren: `<p>h₀ yüksekliğinden θ açısıyla (yukarı +, aşağı −) atılan cisim için bileşenler: v₀ₓ = v₀cosθ, v₀y = v₀sinθ. Yere iniş zamanı y = 0 koşulundan bulunur:</p>
    <p>0 = h₀ + v₀y·T − ½g·T² ⇒ <b>T = [v₀y + √(v₀y² + 2g·h₀)] / g</b>, menzil R = v₀ₓ·T.</p>
    <ul><li>Yere çarpma hızı: v² = v₀² + 2g·h₀ (mekanik enerji korunumu) — <b>yöne bağlı değildir</b>.</li><li>Aynı v₀ ile atılan yukarı eğik, yatay ve aşağı eğik cisimlerin çarpma hızı büyüklükleri eşittir; yukarı atılan en geç, aşağı atılan en erken iner.</li></ul>`,
    bag: 'Enerji korunumu, hız büyüklüğünü zamanı hesaplamadan bulmanın kısa yoludur.', note: 'Hava direnci ihmal edilir.',
    check: { q: '45 m yükseklikten v₀ = 0 ile bırakılan cismin yere çarpma hızı kaç m/s’dir? (g = 10)', o: ['15', '30', '45', '90'], a: 1, e: 'v = √(2gh) = √900 = 30 m/s.' }
  },
  {
    id: 'egik-duzlem-atis', code: 'Atışlar-7', ico: '📐', title: 'Eğik Düzlemde Atış',
    merak: 'Bir yamaçtan yukarı ve aşağı doğru atılan toplar neden farklı uzaklıklara düşer? Eksenleri düzlemle çakıştırırsak işlem kolaylaşır mı?',
    flow: ['Eksen seç: x′ düzlem, y′ dik', 'g’yi ayır: g sinα, g cosα', 'Düzleme dik: yukarı atış', 'Düzlem boyunca: ivmeli hareket'],
    ogren: `<p>α eğimli düzlemden, düzleme göre φ açısıyla v₀ ile atılan cisim için eksenleri düzlem boyunca (x′) ve düzleme dik (y′) seçmek işlemi kolaylaştırır:</p>
    <table class="tbl"><tr><th>Eksen</th><th>Başlangıç hızı</th><th>İvme</th></tr><tr><td>x′ (düzlem boyunca)</td><td>v₀cosφ</td><td>−g·sinα</td></tr><tr><td>y′ (düzleme dik)</td><td>v₀sinφ</td><td>−g·cosα</td></tr></table>
    <ul><li>Uçuş süresi (dik eksen): <b>T = 2v₀sinφ / (g·cosα)</b>.</li><li>Düzlem boyunca menzil: L = v₀cosφ·T − ½g sinα·T² = <b>2v₀²sinφ·cos(φ+α) / (g·cos²α)</b>.</li><li>Yukarı eğimli düzlemde L’nin en büyük olduğu açı φ = 45° − α/2 (düzleme göre).</li><li>Yatay zeminde (α = 0) formüller eğik atışa dönüşür.</li><li>Cisim eğik düzlemde <b>kayıyorsa</b> (sürtünmesiz) ivme a = g·sinα olur.</li></ul>`,
    bag: 'Eksen seçimi serbesttir; uygun seçim işlemleri kısaltır.', note: 'Bu bölümde sürtünme ve hava direnci yoktur.',
    check: { q: 'Sürtünmesiz 30° eğimli düzlemde serbest bırakılan cismin ivmesi kaç m/s²’dir? (g = 10)', o: ['5', '10', '5√3', '0'], a: 0, e: 'a = g·sinα = 10·0,5 = 5 m/s².' }
  },
  {
    id: 'atis-karsilastirma', code: 'Atışlar-8', ico: '🏁', title: 'Atışların Karşılaştırılması',
    merak: 'Serbest düşme, düşey, yatay ve eğik atış arasında ortak ve farklı noktalar neler?',
    flow: ['Ortak: a = g (aşağı)', 'Fark: başlangıç hızı ve açısı'],
    ogren: `<table class="tbl"><tr><th>Atış</th><th>v₀ₓ</th><th>v₀y</th><th>Yörünge</th><th>Önemli nokta</th></tr>
    <tr><td>Serbest düşme</td><td>0</td><td>0</td><td>düşey doğru</td><td>t = √(2h/g)</td></tr>
    <tr><td>Düşey atış</td><td>0</td><td>±v₀</td><td>düşey doğru</td><td>H = v₀²/2g</td></tr>
    <tr><td>Yatay atış</td><td>vₓ</td><td>0</td><td>parabol</td><td>R = vₓ√(2h/g)</td></tr>
    <tr><td>Eğik atış</td><td>v₀cosθ</td><td>v₀sinθ</td><td>parabol</td><td>R = v₀²sin2θ/g</td></tr>
    <tr><td>Eğik düzlemde atış</td><td colspan="2">düzlem eksenlerinde</td><td>parabol</td><td>g sinα, g cosα</td></tr></table>
    <ul><li>Hepsinde yatay bileşen sabit (hava direnci yok), düşey ivme g.</li><li>Aynı yükseklikten aynı anda serbest bırakılan ve yatay atılan cisimler aynı anda iner.</li><li>Maymun–avcı: mermi ve maymun aynı düşey ivmeyle düştüğünden nişan doğrusunda buluşurlar.</li></ul>`,
    bag: 'Tüm atışlar aynı fizik yasalarının farklı başlangıç koşullarıdır.', note: 'Simülasyonlarda başlangıç koşullarını değiştirerek tüm atışları elde edebilirsin.',
    check: { q: 'Hangi atışta yörünge doğrusaldır?', o: ['Yatay atış', 'Eğik atış', 'Düşey atış', 'Eğik düzlemde atış'], a: 2, e: 'Düşey atışta ve serbest düşmede hareket tek doğru boyunca olur.' }
  },
  {
    id: 'enerji-atis', code: 'Atışlar-9', ico: '🔋', title: 'Atışlarda Mekanik Enerji',
    merak: 'Atılan bir topun enerjisi nereye gider, nereden gelir?',
    flow: ['Eₖ azalır', 'Eₚ artar', 'Toplam sabit'],
    ogren: `<p>Hava direnci yokken yalnızca yerçekimi (korunumlu kuvvet) etkili olduğundan <b>mekanik enerji korunur</b>: Eₖ + Eₚ = sabit.</p>
    <table class="tbl"><tr><th>Büyüklük</th><th>Formül</th></tr><tr><td>Kinetik</td><td>Eₖ = ½mv²</td></tr><tr><td>Potansiyel</td><td>Eₚ = mgh</td></tr><tr><td>Korunum</td><td>½mv₀² + mgh₀ = ½mv² + mgh</td></tr></table>
    <ul><li>Dik atışta tepe noktasında Eₖ = 0, Eₚ en büyük.</li><li>Eğik atışta tepe noktasında Eₖ = ½m(v₀cosθ)² = Eₖ₀·cos²θ.</li><li>Yere çarpma hızı yöne bağlı değildir: v = √(v₀² + 2gh₀).</li><li>Hava direnci varsa mekanik enerji azalır (ısıya dönüşür).</li></ul>`,
    bag: 'Hız büyüklüğünü zamansız bulmak için enerji korunumu en kısa yoldur.', note: 'Enerji kavramı atışlarda yardımcı araçtır.',
    check: { q: '2 kg’lık cisim 10 m/s ile dik yukarı atılıyor (g = 10). Tepe noktasında potansiyel enerjisi kaç J’dir?', o: ['20', '50', '100', '200'], a: 2, e: 'Eₚ = Eₖ₀ = ½·2·100 = 100 J.' }
  },
  {
    id: 'gercek-atis', code: 'Ek bilgi', ico: '🌍', title: 'Gerçek Dünyada Atışlar',
    merak: 'Basketbol, futbol, itfaiye hortumu, top atışı… Hepsi gerçekten parabol çizer mi?',
    flow: ['İdeal atış (parabol)', 'Hava direnci', 'Gerçek yörünge'],
    ogren: `<p>İdeal atışta hava direnci yoktur ve yörünge parabolüdür. Gerçekte <b>hava direnci</b> hızın karesiyle artar; menzil ve yükseklik azalır, yörünge asimetrik olur (inişi çıkıştan daha diktir). En uzak menzil için en iyi açı 45°’den biraz küçüktür.</p>
    <ul><li>Spor: disk, gülle, uzun atlama, basketbol şutu, futbol falsosu.</li><li>Mühendislik: itfaiye hortumu, sulama fıskiyesi, uzay mekiği fırlatma, balistik.</li><li>Biyoloji ile bağ: yunus yankısı, kuş uçuşu, çekirge sıçraması.</li></ul>`,
    bag: 'Model basit; gerçek durumda hava, rüzgâr ve dönme etkileri eklenir.', note: 'Bu konu “ek bilgi”dir; sınavda hava direnci ihmal edilir.',
    check: { q: 'Hava direnci varsa eğik atışta menzil ideal duruma göre nasıl olur?', o: ['Artar', 'Azalır', 'Değişmez', 'Her zaman iki katı olur'], a: 1, e: 'Hava direnci hızı azaltan bir kuvvettir; menzil azalır.' }
  }
];

/* ---------------- SORU BANKASI ---------------- */
const FBANK = [];
(function () {
  const Q = (t, q, o, a, e) => FBANK.push({ t, q, o, a, e });
  Q('hareket-temel', 'Bir hız–zaman grafiğinde eğri altındaki alan neyi verir?', ['İvmeyi', 'Yer değiştirmeyi', 'Kuvveti', 'Kütleyi'], 1, 'v–t grafiğinin altındaki alan yer değiştirmedir.');
  Q('hareket-temel', 'Sabit ivmeli harekette hangisi zamansız bağıntıdır?', ['v = v₀ + at', 'x = v₀t + ½at²', 'v² = v₀² + 2aΔx', 'a = Δv/Δt'], 2, 'Zamansız bağıntı v² = v₀² + 2aΔx’tir.');
  Q('vektor-bilesen', 'v₀ = 100 m/s, θ = 53° için v₀y kaç m/s’dir? (sin53° = 0,8)', ['60', '80', '100', '40'], 1, 'v₀y = 100·0,8 = 80 m/s.');
  Q('vektor-bilesen', 'Hangi açıda v₀ₓ = v₀y olur?', ['30°', '37°', '45°', '60°'], 2, 'cosθ = sinθ ⇒ θ = 45°.');
  Q('vektor-bilesen', 'Yatay ve düşey hareketlerin ortak büyüklüğü hangisidir?', ['Hız', 'İvme', 'Zaman', 'Yol'], 2, 'Bağımsız hareketlerde ortak nicelik zamandır.');
  Q('vektor-bilesen', 'vₓ = 6 m/s ve v_y = 8 m/s ise bileşke hız kaç m/s’dir?', ['10', '14', '2', '48'], 0, '√(36+64) = 10 m/s.');
  Q('serbest-dusme', 'Serbest bırakılan bir cisim 4 s sonra yere çarpıyor (g = 10). Bırakıldığı yükseklik kaç m’dir?', ['40', '80', '160', '20'], 1, 'h = ½gt² = 5·16 = 80 m.');
  Q('serbest-dusme', '5 m yükseklikten bırakılan cismin yere çarpma hızı kaç m/s’dir?', ['5', '10', '15', '25'], 1, 'v = √(2gh) = √100 = 10 m/s.');
  Q('serbest-dusme', 'Serbest düşen cismin 1., 2. ve 3. saniyelerde aldığı yollar oranı nedir?', ['1 : 2 : 3', '1 : 3 : 5', '1 : 4 : 9', '1 : 1 : 1'], 1, '5 m : 15 m : 25 m = 1 : 3 : 5.');
  Q('serbest-dusme', 'Havasız ortamda aynı yükseklikten bırakılan kurşun ve tüy için hangisi doğrudur?', ['Kurşun önce iner', 'Tüy önce iner', 'Aynı anda inerler', 'Kütleye bağlıdır'], 2, 'Serbest düşmede ivme kütleden bağımsızdır.');
  Q('serbest-dusme', 'Bir cismin yüksekliği 4 katına çıkarılırsa serbest düşme süresi kaç katına çıkar?', ['2', '4', '8', '16'], 0, 't ∝ √h, √4 = 2.');
  Q('serbest-dusme', 'Ay’da g ≈ 1,6 m/s². Aynı yükseklikten serbest bırakılan cisim Ay’da Dünya’ya göre…', ['daha erken iner', 'aynı anda iner', 'daha geç iner', 'hiç inmez'], 2, 't = √(2h/g), g küçüldüğü için t büyür.');
  Q('dusey-atis', '40 m/s ile dik yukarı atılan cismin en fazla çıktığı yükseklik kaç m’dir? (g = 10)', ['40', '80', '160', '20'], 1, 'H = v₀²/2g = 1600/20 = 80 m.');
  Q('dusey-atis', 'Dik yukarı atılan cismin tepe noktasındaki ivmesi nedir?', ['0', 'g (aşağı)', 'g (yukarı)', 'v₀'], 1, 'İvme tüm hareket boyunca g’dir ve aşağı yönlüdür.');
  Q('dusey-atis', '20 m/s ile yukarı atılan cismin 3. saniyedeki hızı kaç m/s’dir? (yukarı +)', ['+10', '−10', '+30', '−30'], 1, 'v = 20 − 10·3 = −10 m/s (aşağı).');
  Q('dusey-atis', '30 m/s ile yukarı atılan cisim toplam kaç saniye havada kalır? (aynı seviyeye dönüş)', ['3', '6', '9', '12'], 1, 'T = 2v₀/g = 6 s.');
  Q('dusey-atis', '10 m/s ile yukarı atılan cisim 15 m yüksekten atılmışsa yere kaç saniyede çarpar? (g = 10)', ['2', '3', '4', '5'], 1, '0 = 15 + 10T − 5T² ⇒ T = 3 s.');
  Q('dusey-atis', 'Dik yukarı atışta aynı yükseklikte yukarı ve aşağı doğru geçerken hız büyüklükleri…', ['eşittir', 'çıkışta büyüktür', 'inişte büyüktür', 'sıfırdır'], 0, 'Enerji korunumu: aynı yükseklikte hız büyüklüğü aynıdır.');
  Q('dusey-atis', 'Ay’da (g = 1,6) 8 m/s ile dik yukarı atılan cisim kaç m yükselir?', ['10', '20', '40', '5'], 1, 'H = 64/3,2 = 20 m.');
  Q('dusey-atis', 'v₀ = 30 m/s ile yukarı atılan cismin 3 s sonraki yüksekliği (yerden) kaç m’dir? (g = 10)', ['45', '90', '30', '60'], 0, 'y = 30·3 − 5·9 = 45 m (tepe noktası).');
  Q('yatay-atis', '45 m yükseklikten yatay 12 m/s ile atılan cismin düşme süresi kaç s’dir? (g = 10)', ['2', '3', '4', '5'], 1, 't = √(2·45/10) = 3 s.');
  Q('yatay-atis', '80 m yükseklikten yatay atılan cismin menzili 60 m ise atış hızı kaç m/s’dir? (g = 10)', ['10', '15', '20', '30'], 1, 't = 4 s, vₓ = 60/4 = 15 m/s.');
  Q('yatay-atis', 'Yatay atışta vₓ iki katına çıkarılırsa (yükseklik sabit) düşme süresi…', ['yarıya iner', 'değişmez', 'iki katına çıkar', 'dört katına çıkar'], 1, 't yalnızca yüksekliğe bağlıdır.');
  Q('yatay-atis', 'Yatay atılan cismin yere çarpmadan hemen önceki hızının yatay bileşeni…', ['sıfırdır', 'atış hızına eşittir', 'g·t’dir', 'artar'], 1, 'vₓ sabittir.');
  Q('yatay-atis', '20 m yükseklikten yatay atılan cisim yere çarptığında v_y kaç m/s olur? (g = 10)', ['10', '20', '30', '40'], 1, 't = 2 s; v_y = 20 m/s.');
  Q('yatay-atis', 'Yatay atışın yörüngesi nasıldır?', ['Doğru', 'Çember', 'Parabol', 'Elips'], 2, 'x = vₓt, y = ½gt².');
  Q('yatay-atis', 'Yatay atış ve serbest düşme için hangisi doğrudur (aynı h)?', ['Süreleri eşittir', 'Yatay atış daha uzun sürer', 'Serbest düşme daha uzun sürer', 'Menzilleri eşittir'], 0, 'Düşey hareketleri aynıdır.');
  Q('yatay-atis', 'h yüksekliği 4 katına çıkarılırsa (vₓ sabit) menzil kaç katına çıkar?', ['2', '4', '8', '16'], 0, 'R = vₓ√(2h/g) ∝ √h.');
  Q('yatay-atis', 'vₓ = 10 m/s ve v_y = 20 m/s ise yön açısı (yatayla) için tanα kaçtır?', ['0,5', '1', '2', '10'], 2, 'tanα = v_y/vₓ = 2.');
  Q('egik-atis', 'v₀ = 50 m/s, θ = 37° (sin = 0,6) için tepe noktasına çıkış süresi kaç s’dir? (g = 10)', ['2', '3', '4', '5'], 1, 't = v₀sinθ/g = 30/10 = 3 s.');
  Q('egik-atis', 'v₀ = 50 m/s, θ = 37° için maksimum yükseklik kaç m’dir?', ['30', '45', '60', '90'], 1, 'H = 30²/20 = 45 m.');
  Q('egik-atis', 'v₀ = 50 m/s, θ = 37° için menzil kaç m’dir? (sin74° ≈ 0,96)', ['120', '240', '300', '480'], 1, 'T = 6 s, vₓ = 40 → R = 240 m.');
  Q('egik-atis', 'Aynı hızla θ = 53° için menzil θ = 37° için olana göre…', ['daha büyüktür', 'daha küçüktür', 'eşittir', 'iki katıdır'], 2, '37° + 53° = 90°: tamamlayıcı açı.');
  Q('egik-atis', 'Eğik atışta tepe noktasında hız nasıldır?', ['Sıfırdır', 'v₀cosθ’dır', 'v₀sinθ’dır', 'v₀’dır'], 1, 'Yatay bileşen sabit kalır.');
  Q('egik-atis', 'Maksimum menzil için atış açısı (hava direnci yok, yerden) kaçtır?', ['30°', '45°', '60°', '90°'], 1, 'R ∝ sin2θ.');
  Q('egik-atis', 'v₀ iki katına çıkarılırsa menzil kaç katına çıkar?', ['2', '4', '8', '16'], 1, 'R ∝ v₀².');
  Q('egik-atis', 'Eğik atışta hızın büyüklüğünün en küçük olduğu an hangisidir?', ['Fırlatma', 'Tepe noktası', 'Yere çarpma', 'Hep aynı'], 1, 'Tepe noktasında v = v₀cosθ en küçüktür.');
  Q('egik-atis', 'Eğik atışta ivme tepe noktasında nedir?', ['0', 'g (aşağı)', 'g cosθ', 'v₀/t'], 1, 'İvme her an g, aşağı yönlüdür.');
  Q('egik-atis', 'v₀ = 20 m/s, θ = 60° için tepe noktasındaki hız kaç m/s’dir?', ['5', '10', '17,3', '20'], 1, 'v = v₀cos60° = 10 m/s.');
  Q('egik-atis', 'v₀ = 20 m/s, θ = 30° atışta H kaç m’dir? (g = 10)', ['2,5', '5', '10', '20'], 1, 'H = (20·0,5)²/20 = 5 m.');
  Q('egik-atis', 'Yatayla 53° açıyla atılan ve 30° açıyla atılan (aynı v₀) cisimlerden hangisi daha yüksek çıkar?', ['30°', '53°', 'Eşit', 'Belirsiz'], 1, 'H ∝ sin²θ; 53°’de daha büyük.');
  Q('yuksekten-atis', 'Bir binanın tepesinden aynı hızla biri yatay, biri yukarı, biri aşağı atılıyor. Yere çarpma hız büyüklükleri…', ['hepsi eşittir', 'aşağı atılan en büyüktür', 'yukarı atılan en büyüktür', 'yatay atılan en küçüktür'], 0, 'v² = v₀² + 2gh, yöne bağlı değil.');
  Q('yuksekten-atis', 'Yukarıdaki üç cismin yere çarpma süreleri sıralaması hangisidir?', ['aşağı < yatay < yukarı', 'yukarı < yatay < aşağı', 'hepsi eşit', 'yatay < aşağı < yukarı'], 0, 'Düşey başlangıç hızı yukarı olan en geç iner.');
  Q('yuksekten-atis', '80 m yükseklikten v₀ = 0 ile bırakılan cismin yere çarpma hızı kaç m/s’dir?', ['20', '30', '40', '80'], 2, 'v = √(2·10·80) = 40 m/s.');
  Q('yuksekten-atis', 'h₀ = 45 m’den 20 m/s ile yatay atılan cismin yere çarpma hızı kaç m/s’dir? (g = 10)', ['30', '10√13', '50', '20'], 1, 'v² = 400 + 900 = 1300 ⇒ v = 10√13 ≈ 36 m/s.');
  Q('egik-duzlem-atis', 'α = 30° eğimli sürtünmesiz düzlemde cismin ivmesi kaç m/s²’dir? (g = 10)', ['5', '10', '5√3', '2,5'], 0, 'a = g sinα = 5.');
  Q('egik-duzlem-atis', 'Eğik düzlemde düzleme dik ivme bileşeni (g’nin bileşeni) nedir?', ['g sinα', 'g cosα', 'g', '0'], 1, 'Düzleme dik bileşen g cosα’dır.');
  Q('egik-duzlem-atis', 'Eğik düzlemden φ açısıyla atılan cismin uçuş süresi hangi eksendeki harekete bağlıdır?', ['Düzlem boyunca', 'Düzleme dik', 'Yatay', 'Hiçbiri'], 1, 'Cisim dik eksende konumu sıfır olunca düzleme döner.');
  Q('egik-duzlem-atis', 'α = 0° için eğik düzlemde atış formülleri hangi atışa dönüşür?', ['Yatay atış', 'Eğik atış (yerden)', 'Serbest düşme', 'Düşey atış'], 1, 'α = 0 için düzlem yataydır.');
  Q('atis-karsilastirma', 'Hangi atışta yatay bileşen yoktur?', ['Yatay atış', 'Eğik atış', 'Düşey atış', 'Eğik düzlemde atış'], 2, 'Düşey atışta hareket tek doğrultudadır.');
  Q('atis-karsilastirma', 'Maymun–avcı deneyinde mermi maymunu neden vurur?', ['Her ikisi de aynı düşey ivmeyle düşer', 'Mermi çok hızlıdır', 'Maymun yerçekiminden etkilenmez', 'Mermi yerçekiminden etkilenmez'], 0, 'İkisi de aynı g ile ivmelenir.');
  Q('atis-karsilastirma', 'Aynı yükseklikten aynı anda serbest bırakılan ve yatay atılan iki cisim için hangisi yanlıştır?', ['Aynı anda inerler', 'Yere çarpma hızları eşittir', 'Yatay atılanın menzili vardır', 'Düşey hızları aynı t’de eşittir'], 1, 'Yatay atılanın bileşke hızı vₓ nedeniyle daha büyüktür.');
  Q('enerji-atis', 'Hava direnci yokken atılan cismin mekanik enerjisi…', ['azalır', 'artar', 'korunur', 'sıfırlanır'], 2, 'Korunumlu kuvvet: yerçekimi.');
  Q('enerji-atis', 'Eₖ₀ = 200 J ile θ = 60° atılan cismin tepe noktasındaki Eₖ kaç J’dir?', ['25', '50', '100', '200'], 1, 'Eₖ = Eₖ₀cos²60° = 200·¼ = 50 J.');
  Q('enerji-atis', 'Dik yukarı atılan cismin Eₖ’si ve Eₚ’si için hangisi doğrudur?', ['Eₖ azalırsa Eₚ artar', 'İkisi birlikte artar', 'İkisi birlikte azalır', 'İkisi de sabittir'], 0, 'Toplam sabit.');
  Q('enerji-atis', 'Hava direnci varsa atılan cismin mekanik enerjisi…', ['azalır', 'artar', 'korunur', 'iki katına çıkar'], 0, 'Direnç kuvveti negatif iş yapar.');
  Q('gercek-atis', 'Hava direnci eğik atışta menzil için en uygun açıyı genellikle nasıl etkiler?', ['45°’den küçük yapar', '45°’den büyük yapar', 'Değiştirmez', '90° yapar'], 0, 'Daha yatık atış, hava direnci etkisini azaltır.');
  Q('gercek-atis', 'Aşağıdakilerden hangisi atış hareketine örnek değildir?', ['Basketbol şutu', 'İtfaiye hortumu suyu', 'Sabit hızla düz yolda giden araba', 'Futbol uzun pası'], 2, 'Düz yolda sabit hızlı araba atış değildir.');
})();

/* ---------------- AÇIK UÇLU BAĞLAM SORULARI ---------------- */
/* parts: type 'num' (a: doğru değer, tol: bağıl/ mutlak tolerans) | type 'text' (rubric: her ölçüt için kabul edilen anahtar ifadeler; "+" hepsi geçmeli) */
const FBAGLAM = [
  {
    id: 'fb1', topic: 'serbest-dusme', sim: 'serbest', title: 'Ay’daki çekiç ve tüy',
    ctx: '<p>1971’de Apollo 15 komutanı David Scott, Ay yüzeyinde bir çekici ve bir tüyü aynı yükseklikten aynı anda bıraktı. İkisi de Ay yüzeyine aynı anda ulaştı. Ay’da yerçekimi ivmesi yaklaşık 1,6 m/s², Dünya’da ise 10 m/s²’dir. Bırakma yüksekliği 1,6 m olsun.</p>',
    ask: 'Çekiç ve tüyün aynı anda yere ulaşmasının nedenini açıklayınız ve düşme süresini hesaplayınız.',
    parts: [
      { l: 'Neden aynı anda ulaştılar? (açıklayınız)', type: 'text', rubric: [{ t: 'Ay’da hava (atmosfer) / hava direnci yoktur', k: ['hava+yok', 'atmosfer+yok', 'direnc+yok', 'vakum', 'bosluk'] }, { t: 'Düşmede ivme kütleden bağımsızdır / ikisi de aynı g ile düşer', k: ['ayni+ivme', 'kutleden+bagimsiz', 'ayni+g', 'ivme+ayni', 'kutle+etkilemez', 'kutleye+bagli+degil'] }] },
      { l: 'Düşme süresi (s)', type: 'num', a: 1.41, tol: .06, unit: 's' }
    ],
    model: 'Ay’da hava direnci yoktur; serbest düşmede ivme kütleden bağımsızdır, ikisi de g_Ay ile düşer. t = √(2h/g) = √(2·1,6/1,6) = √2 ≈ 1,41 s.'
  },
  {
    id: 'fb2', topic: 'serbest-dusme', sim: 'serbest', title: 'Kuyuya atılan taş',
    ctx: '<p>Bir öğrenci kuyuya bir taş bırakıyor ve taşın suya çarpma sesini 3 s sonra duyuyor. Sesin kuyuda yayılma süresi ihmal edilecek kadar küçüktür (g = 10 m/s²).</p>',
    ask: 'Kuyunun derinliğini ve taşın suya çarpma hızını bulunuz. Çözümünüzde kullandığınız bağıntıları yazınız.',
    parts: [
      { l: 'Kuyu derinliği (m)', type: 'num', a: 45, tol: 1, unit: 'm' },
      { l: 'Suya çarpma hızı (m/s)', type: 'num', a: 30, tol: .5, unit: 'm/s' },
      { l: 'Kullandığın bağıntı', type: 'text', rubric: [{ t: 'h = ½gt² yazılmış', k: ['1/2+g+t', 'yarim+g+t', 'gt2', 'g t2', 'gt^2', '5+t'] }, { t: 'v = g·t (veya √2gh) yazılmış', k: ['v+g+t', 'gt', 'karekok', '2gh'] }] }
    ],
    model: 'h = ½gt² = ½·10·9 = 45 m; v = g·t = 10·3 = 30 m/s.'
  },
  {
    id: 'fb3', topic: 'dusey-atis', sim: 'dusey', title: 'Voleybol pasörü',
    ctx: '<p>Bir voleybol topu pasör tarafından dik yukarı 20 m/s hızla atılıyor ve oyuncunun elinden çıktığı seviyeye geri dönüyor (g = 10 m/s², hava direnci yok).</p>',
    ask: 'Topun çıkabileceği en büyük yüksekliği, havada kalma süresini ve tepe noktasındaki ivmesini bulunuz. Tepe noktasında “ivme sıfırdır” diyen arkadaşınıza ne söylersiniz?',
    parts: [
      { l: 'Maksimum yükseklik (m)', type: 'num', a: 20, tol: .5, unit: 'm' },
      { l: 'Havada kalma süresi (s)', type: 'num', a: 4, tol: .1, unit: 's' },
      { l: 'Arkadaşınıza cevabınız', type: 'text', rubric: [{ t: 'Tepe noktasında hız sıfır ama ivme sıfır değildir', k: ['hiz+sifir', 'ivme+sifir+degil', 'ivme+g', 'ivme+10'] }, { t: 'İvmenin g olduğu ve aşağı yönlü olduğu söylenmiş', k: ['asagi+yon', 'yercekimi', 'g+asagi', 'ivme+degismez', 'ivme+sabit'] }] }
    ],
    model: 'H = v₀²/2g = 400/20 = 20 m; T = 2v₀/g = 4 s. Tepe noktasında yalnızca hız anlık sıfırdır; ivme g = 10 m/s² olup aşağı yönlüdür. İvme sıfır olsaydı top havada asılı kalırdı.'
  },
  {
    id: 'fb4', topic: 'dusey-atis', sim: 'dusey', title: 'Balkondan atılan top',
    ctx: '<p>Zeynep, 15 m yüksekliğindeki bir balkondan topu dik yukarı 10 m/s ile atıyor. Top balkondan geçip yere düşüyor (g = 10 m/s², hava direnci yok).</p>',
    ask: 'Topun yerden ulaştığı en büyük yüksekliği, yere çarpma süresini ve yere çarpma hızını hesaplayınız. Aşağı yönde atılsaydı çarpma hızı değişir miydi? Neden?',
    parts: [
      { l: 'Yerden maksimum yükseklik (m)', type: 'num', a: 20, tol: .5, unit: 'm' },
      { l: 'Yere çarpma süresi (s)', type: 'num', a: 3, tol: .1, unit: 's' },
      { l: 'Yere çarpma hızı (m/s)', type: 'num', a: 20, tol: .5, unit: 'm/s' },
      { l: 'Aşağı atılsaydı çarpma hızı değişir miydi?', type: 'text', rubric: [{ t: 'Çarpma hızının değişmeyeceği belirtilmiş', k: ['degismez', 'ayni', 'esit'] }, { t: 'Mekanik enerji korunumu / v² = v₀² + 2gh gerekçesi', k: ['enerji', 'korunum', '2gh', 'yone+bagli+degil', 'yon+etkilemez'] }] }
    ],
    model: 'H = 15 + 100/20 = 20 m; 0 = 15 + 10T − 5T² ⇒ T = 3 s; v = √(100 + 2·10·15) = 20 m/s. Aşağı atılırsa v² = v₀² + 2gh aynıdır: çarpma hızı değişmez (süre kısalır).'
  },
  {
    id: 'fb5', topic: 'yatay-atis', sim: 'yatay', title: 'Sınırdaki uçurum',
    ctx: '<p>Bir kaya tırmanıcısı 80 m yüksekliğindeki yatay bir kayalıktan bir taşı 15 m/s hızla yatay fırlatıyor (g = 10 m/s²). Taş yere çarpana dek hava direncinin ihmal edildiği varsayılacaktır.</p>',
    ask: 'Taşın havada kalma süresini, kayalığın dibinden yatay uzaklığını (menzil) ve yere çarpma anındaki hızını bulunuz. Taşın yörüngesinin şeklini belirtiniz.',
    parts: [
      { l: 'Havada kalma süresi (s)', type: 'num', a: 4, tol: .1, unit: 's' },
      { l: 'Menzil (m)', type: 'num', a: 60, tol: 1, unit: 'm' },
      { l: 'Yere çarpma hızının büyüklüğü (m/s)', type: 'num', a: 42.7, tol: 1, unit: 'm/s' },
      { l: 'Yörünge şekli', type: 'text', rubric: [{ t: 'Parabol', k: ['parabol'] }] }
    ],
    model: 't = √(2h/g) = 4 s; R = vₓ·t = 60 m; v_y = g·t = 40 m/s; v = √(15² + 40²) ≈ 42,7 m/s. Yörünge paraboldür.'
  },
  {
    id: 'fb6', topic: 'yatay-atis', sim: 'yatay', title: 'Masadan düşen top',
    ctx: '<p>1,25 m yüksekliğindeki bir masanın kenarından yatay yuvarlanan bir bilye masanın dibinden 1,5 m uzağa düşüyor (g = 10 m/s²).</p>',
    ask: 'Bilyenin masadan ayrıldığı anki hızını bulunuz. Aynı bilye masadan serbest bırakılsaydı yere kaç saniyede ulaşırdı? İki durumun sürelerini karşılaştırıp yorumlayınız.',
    parts: [
      { l: 'Masadan ayrılma hızı (m/s)', type: 'num', a: 3, tol: .1, unit: 'm/s' },
      { l: 'Serbest bırakılsa düşme süresi (s)', type: 'num', a: .5, tol: .02, unit: 's' },
      { l: 'Karşılaştırma yorumunuz', type: 'text', rubric: [{ t: 'Sürelerin eşit olduğu belirtilmiş', k: ['ayni+sure', 'esit', 'ayni+anda', 'sureler+ayni'] }, { t: 'Düşey hareketin yataydan bağımsız / yalnızca yüksekliğe bağlı olduğu açıklanmış', k: ['bagimsiz', 'yukseklige+bagli', 'yatay+etkilemez', 'serbest+dusme'] }] }
    ],
    model: 't = √(2·1,25/10) = 0,5 s; vₓ = 1,5/0,5 = 3 m/s. Serbest bırakılsa da t = 0,5 s: düşey hareket yatay hareketten bağımsızdır, süre yalnızca yüksekliğe bağlıdır.'
  },
  {
    id: 'fb7', topic: 'egik-atis', sim: 'egik', title: 'Futbolda serbest vuruş',
    ctx: '<p>Bir futbolcu topa yerden 20 m/s hızla ve yatayla 53° açıyla vuruyor (sin53° = 0,8; cos53° = 0,6; g = 10 m/s²). Hava direnci ihmal ediliyor.</p>',
    ask: 'Topun yatay ve düşey başlangıç hız bileşenlerini, havada kalma süresini, ulaştığı en büyük yüksekliği ve menzili bulunuz.',
    parts: [
      { l: 'v₀ₓ (m/s)', type: 'num', a: 12, tol: .2, unit: 'm/s' },
      { l: 'v₀y (m/s)', type: 'num', a: 16, tol: .2, unit: 'm/s' },
      { l: 'Havada kalma süresi (s)', type: 'num', a: 3.2, tol: .1, unit: 's' },
      { l: 'Maksimum yükseklik (m)', type: 'num', a: 12.8, tol: .3, unit: 'm' },
      { l: 'Menzil (m)', type: 'num', a: 38.4, tol: .6, unit: 'm' }
    ],
    model: 'v₀ₓ = 20·0,6 = 12 m/s; v₀y = 20·0,8 = 16 m/s; T = 2·16/10 = 3,2 s; H = 16²/20 = 12,8 m; R = 12·3,2 = 38,4 m.'
  },
  {
    id: 'fb8', topic: 'egik-atis', sim: 'egik', title: 'Hangi açı daha iyi?',
    ctx: '<p>İki atlet gülle atıyor (kolay anlaşılsın diye başlangıç yüksekliği ihmal ediliyor). Birinci atlet 30° açıyla, ikinci atlet 60° açıyla atıyor; ikisinin de ilk hız büyüklüğü eşit ve hava direnci yoktur.</p>',
    ask: 'İki atışın menzillerini, ulaşılan yükseklikleri ve havada kalma sürelerini karşılaştırınız. Menzil için en uygun açı kaç derecedir? Neden?',
    parts: [
      { l: 'Menzilleri', type: 'text', rubric: [{ t: 'Menzillerin eşit olduğu belirtilmiş', k: ['esit', 'ayni', 'birbirine+esit'] }, { t: 'Tamamlayıcı açı / sin2θ aynı gerekçesi', k: ['tamamlayici', 'sin2', 'sin 2', '90'] }] },
      { l: 'Yükseklik ve süre', type: 'text', rubric: [{ t: '60° atışta yükseklik daha büyük', k: ['60+yuksek', '60+buyuk', 'daha+yuksek'] }, { t: '60° atışta süre daha uzun', k: ['60+uzun', 'sure+60', 'daha+uzun+sure', 'daha+gec'] }] },
      { l: 'En uygun açı (°)', type: 'num', a: 45, tol: .5, unit: '°' }
    ],
    model: 'R = v₀²sin2θ/g; sin60° = sin120° ⇒ menzilleri eşittir (tamamlayıcı açılar). H ∝ sin²θ ve T ∝ sinθ olduğundan 60° atışta yükseklik ve süre daha büyüktür. Menzil en büyük sin2θ = 1 ⇒ θ = 45°.'
  },
  {
    id: 'fb9', topic: 'yuksekten-atis', sim: 'yuksek', title: 'Köprüden atılan taşlar',
    ctx: '<p>Üç çocuk 45 m yüksekliğindeki bir köprüden aynı 20 m/s hızla birer taş atıyor: birincisi dik yukarı, ikincisi yatay, üçüncüsü dik aşağı (g = 10 m/s², hava direnci yok).</p>',
    ask: 'Üç taşın yere çarpma hız büyüklüklerini karşılaştırınız. Yere ulaşma sürelerini küçükten büyüğe sıralayınız ve gerekçesini yazınız.',
    parts: [
      { l: 'Çarpma hızı (m/s) (hepsi için)', type: 'num', a: 36.06, tol: .8, unit: 'm/s' },
      { l: 'Süre sıralaması ve gerekçe', type: 'text', rubric: [{ t: 'Aşağı atılan en kısa sürede iner', k: ['asagi+once', 'asagi+en+kisa', 'asagi+en+erken', 'asagi+ilk'] }, { t: 'Yukarı atılan en uzun sürede iner', k: ['yukari+en+uzun', 'yukari+en+gec', 'yukari+son'] }, { t: 'Enerji korunumu / hız büyüklüklerinin eşit olduğu belirtilmiş', k: ['enerji', 'korunum', 'esit', 'ayni'] }] }
    ],
    model: 'v² = v₀² + 2gh = 400 + 900 = 1300 ⇒ v ≈ 36,1 m/s (üçü için de). Süreler: aşağı atılan < yatay atılan < yukarı atılan. Mekanik enerji korunumu nedeniyle hız büyüklüğü yöne bağlı değildir ama düşey yol uzunluğu/ilk düşey hız yönü süreyi değiştirir.'
  },
  {
    id: 'fb10', topic: 'egik-duzlem-atis', sim: 'duzlem', title: 'Yamaçta kayan kızak',
    ctx: '<p>Sürtünmesiz 30° eğimli bir yamaçta bir kızak serbest bırakılıyor (g = 10 m/s²). Bir başka çocuk aynı yamaçtan bir kartopunu düzleme dik doğrultuda 6 m/s hızla fırlatıyor.</p>',
    ask: 'Kızağın ivmesini bulunuz. Kartopunun düzleme dik doğrultudaki ivme büyüklüğünü ve düzleme geri dönme süresini hesaplayınız.',
    parts: [
      { l: 'Kızağın ivmesi (m/s²)', type: 'num', a: 5, tol: .1, unit: 'm/s²' },
      { l: 'Dik eksendeki ivme büyüklüğü (m/s²)', type: 'num', a: 8.66, tol: .1, unit: 'm/s²' },
      { l: 'Düzleme dönme süresi (s)', type: 'num', a: 1.39, tol: .05, unit: 's' }
    ],
    model: 'a = g sinα = 5 m/s²; a_dik = g cosα = 8,66 m/s²; T = 2v₀y/(g cosα) = 12/8,66 ≈ 1,39 s.'
  },
  {
    id: 'fb11', topic: 'atis-karsilastirma', sim: 'maymun', title: 'Maymun ve fotoğrafçı',
    ctx: '<p>Bir biyolog, ağaçtaki bir maymunu anestezi okuyla uyutmak için tüfeğini doğrudan maymuna doğrultuyor. Maymun, tüfeğin patlama sesini duyunca kendini serbest bırakıyor. Biyolog ok hızının yeterince büyük olduğunu biliyor.</p>',
    ask: 'Ok maymunu vurur mu, üstünden mi geçer, altından mı? Nedenini bağımsızlık ilkesine ve düşey ivmeye dayanarak açıklayınız. Ok hızı artarsa isabet yüksekliği nasıl değişir?',
    parts: [
      { l: 'Sonuç', type: 'text', rubric: [{ t: 'Okun maymunu vuracağı belirtilmiş', k: ['vurur', 'isabet', 'carpar'] }] },
      { l: 'Gerekçe', type: 'text', rubric: [{ t: 'İkisi de aynı düşey ivmeyle / aynı miktarda düşer', k: ['ayni+ivme', 'ayni+g', 'ayni+kadar', 'ayni+miktar', 'ikisi+de+duser'] }, { t: 'Yatay ve düşey hareketin bağımsızlığı / nişan doğrusu', k: ['bagimsiz', 'nisan', 'dogru'] }] },
      { l: 'Ok hızı artarsa', type: 'text', rubric: [{ t: 'Çarpışmanın daha yüksekte (maymun daha az düşmüşken) olacağı belirtilmiş', k: ['daha+yuksek', 'yukarida', 'az+duser', 'daha+az+dus'] }] }
    ],
    model: 'Vurur. Ok nişan doğrusundan ½gt² kadar aşağı sapar, maymun da aynı sürede ½gt² kadar düşer; ikisi de aynı düşey ivmeyle hareket ettiği için nişan doğrusunda buluşurlar. Ok hızı artarsa süre kısalır, maymun daha az düşmüşken çarpışma daha yüksekte olur.'
  },
  {
    id: 'fb12', topic: 'enerji-atis', sim: 'enerji', title: 'Basketbol şutu ve enerji',
    ctx: '<p>1 kg’lık bir top 3 m yüksekten yatayla 60° açıyla 10 m/s hızla basket atışında fırlatılıyor (hava direnci yok, g = 10 m/s²).</p>',
    ask: 'Topun başlangıçtaki mekanik enerjisini hesaplayınız. Tepe noktasında kinetik enerjisini bulunuz ve enerji dönüşümlerini yorumlayınız.',
    parts: [
      { l: 'Başlangıç mekanik enerjisi (J)', type: 'num', a: 80, tol: 1, unit: 'J' },
      { l: 'Tepe noktasında kinetik enerji (J)', type: 'num', a: 12.5, tol: .5, unit: 'J' },
      { l: 'Enerji dönüşümü yorumu', type: 'text', rubric: [{ t: 'Çıkışta kinetik enerjinin potansiyele dönüştüğü', k: ['kinetik+potansiyel', 'ek+ep', 'kinetik+azal'] }, { t: 'Toplamın (mekanik enerjinin) korunduğu', k: ['korun', 'sabit', 'degismez'] }] }
    ],
    model: 'E = ½·1·100 + 1·10·3 = 50 + 30 = 80 J. Tepe: vₓ = 5 m/s → Eₖ = ½·1·25 = 12,5 J. Yükselirken Eₖ azalır, Eₚ artar; toplam (hava direnci yoksa) korunur.'
  },
  {
    id: 'fb13', topic: 'gercek-atis', sim: 'egik', title: 'İtfaiye hortumu',
    ctx: '<p>Bir itfaiyeci, yangın söndürmek için hortumdan çıkan suyu 20 m/s hızla yatayla 45° açıyla fışkırtıyor (g = 10 m/s², ideal durum). Bina 20 m uzaktadır.</p>',
    ask: 'Suyun ulaşabileceği maksimum yatay uzaklığı bulunuz. Su hızını artırmadan, yangına daha uzaktan müdahale etmek istese hangi değişiklik yapılabilir? Gerçek durumda hava direnci menzili nasıl etkiler?',
    parts: [
      { l: 'Maksimum yatay uzaklık (m)', type: 'num', a: 40, tol: .5, unit: 'm' },
      { l: 'Önerdiğiniz değişiklik', type: 'text', rubric: [{ t: 'Yüksek bir noktadan veya platformdan atış / basınç (hız) artırma', k: ['yuksek', 'basinc', 'hiz+art', 'platform', 'merdiven'] }] },
      { l: 'Hava direnci etkisi', type: 'text', rubric: [{ t: 'Menzilin azalacağı', k: ['azal', 'kisal', 'dus'] }] }
    ],
    model: 'R = v₀²sin2θ/g = 400·1/10 = 40 m. Yüksek bir platformdan (h₀ > 0) atış veya hızı artırma menzili artırır. Hava direnci menzili azaltır; en uygun açı 45°’den biraz küçük olur.'
  },
  {
    id: 'fb14', topic: 'atis-karsilastirma', sim: 'karsilastir', title: 'Üç oyuncu, tek top',
    ctx: '<p>Üç çocuk 20 m yüksekliğindeki balkondan aynı anda birer top atıyor: Ali topu serbest bırakıyor, Beyza yatay 10 m/s ile atıyor, Cem ise dik yukarı 10 m/s ile atıyor (g = 10 m/s²).</p>',
    ask: 'Topların yere iniş sırasını belirtiniz. Ali ve Beyza’nın topları için süreleri bulunuz. Cem’in topu için yere iniş süresi kaç saniyedir?',
    parts: [
      { l: 'Ali ve Beyza’nın topu için süre (s)', type: 'num', a: 2, tol: .05, unit: 's' },
      { l: 'Cem’in topu için süre (s)', type: 'num', a: 3.24, tol: .1, unit: 's' },
      { l: 'İniş sırası', type: 'text', rubric: [{ t: 'Ali ve Beyza aynı anda önce iner', k: ['ali+beyza', 'ikisi+ayni', 'ayni+anda'] }, { t: 'Cem’in topu en son iner', k: ['cem+son', 'cem+en+gec', 'cem+en+uzun', 'cem+sonra'] }] }
    ],
    model: 'Ali ve Beyza: t = √(2·20/10) = 2 s (aynı anda). Cem: 0 = 20 + 10T − 5T² ⇒ T = 1 + √5 ≈ 3,24 s. Sıra: Ali = Beyza < Cem.'
  }
];
