/* Nasse Fizik — Atış simülasyonları (Maarif: Merak et → Hipotez kur → Dene → Veri/Grafik → Sonuç) */
(function () {
  const F = PHFMT, rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI;
  const GC = { type: 'select', k: 'g', label: 'Yerçekimi ivmesi', opts: PH_G, val: 10 };
  const B = (name, color, x0, y0, vx, vy, g, o) => Object.assign({ name, color, x0, y0, vx, vy, g }, o || {});
  const polar = (v, a) => [v * Math.cos(rad(a)), v * Math.sin(rad(a))];
  const flight = (y0, vy, g) => (vy + Math.sqrt(vy * vy + 2 * g * y0)) / g; /* yere iniş süresi (düz zemin) */
  const MC = (q, o, a, e) => ({ q, o, a, e });

  window.SIMF = {};

  /* ============ 1. SERBEST DÜŞME ============ */
  SIMF.serbest = {
    title: 'Serbest Düşme Laboratuvarı', ico: '🍎', topic: 'serbest-dusme',
    merak: 'Bir taş ve bir tüy aynı yükseklikten bırakılıyor. Gerçek hayatta taş önce yere iner; peki bunun nedeni yerçekimi mi, yoksa başka bir şey mi? Ay’da astronot David Scott bir çekiç ile bir tüyü aynı anda bırakmıştı…',
    hip: [
      { q: 'Havanın olmadığı (vakum) ortamda taş ve tüy aynı yükseklikten aynı anda bırakılırsa ne olur?', o: ['Taş önce yere düşer', 'Tüy önce yere düşer', 'İkisi aynı anda yere düşer'], a: 2, why: 'Serbest düşmede ivme (g) kütleden bağımsızdır. Hava direnci yoksa tüm cisimler aynı g ile düşer; süre t = √(2h/g) ikisi için de aynıdır.' },
      { q: 'Bırakma yüksekliği 4 katına çıkarılırsa (aynı gezegende) düşme süresi kaç katı olur?', o: ['2 katı', '4 katı', '16 katı', 'Değişmez'], a: 0, why: 'h = ½gt² olduğundan t = √(2h/g). h dört katına çıkınca t iki katına çıkar (√4 = 2).' },
      { q: 'Aynı yükseklikten bırakılan cisim, Ay’da (g = 1,6 m/s²) Dünya’dakine göre nasıl düşer?', o: ['Daha kısa sürede', 'Aynı sürede', 'Daha uzun sürede'], a: 2, why: 't = √(2h/g) ve g küçüldüğü için t büyür; Ay’da düşme daha yavaştır.' }
    ],
    gorev: ['Önce hava direncini KAPALI tut; taş ve tüyün düşüşünü izle, “değerler” tablosunda aynı t’de aynı y’yi karşılaştır.', 'Hava direncini AÇ ve yeniden fırlat. Hangi cisim neden geç iniyor?', 'Yüksekliği 20 m, sonra 80 m yap; düşme sürelerini “Ölçüm al” ile tabloya kaydet. Süre–yükseklik ilişkisini yorumla.', 'g’yi Ay, Mars ve Jüpiter’e getir; aynı yükseklik için süreleri karşılaştır. “Stroboskop”u açıp ardışık saniyelerde alınan yolların oranına bak (1 : 3 : 5…).'],
    cfg: () => ({
      controls: [{ k: 'h', label: 'Bırakma yüksekliği', min: 5, max: 120, step: 1, val: 45, unit: 'm' }, GC, { type: 'check', k: 'air', label: 'Hava direnci var (taş hafif, tüy çok etkilenir)', val: false }],
      vis: { vx: false, v: false, vy: true, strobe: true, proj: true }, graph: 'yt', graphs: ['yt', 'vyt', 'vt', 'ayt'],
      tableParams: [['h', 'h (m)'], ['g', 'g']],
      build: P => ({ bodies: [B('Taş', '#aab6c8', -2, P.h, 0, 0, P.g, { k: P.air ? .0006 : 0, r: 8 }), B('Tüy', '#ffe27a', 2, P.h, 0, 0, P.g, { k: P.air ? .35 : 0, r: 6 })] }),
      view: P => [-6, 6, 0, P.h],
      banner: (P, bs) => 'Yere iniş süreleri → Taş: ' + F(bs[0].st.T) + ' s · Tüy: ' + F(bs[1].st.T) + ' s',
      formulas: P => { const t = Math.sqrt(2 * P.h / P.g); return [`t = √(2h/g) = √(2·${F(P.h, 0)}/${F(P.g, 1)}) = <b>${F(t)} s</b>`, `Yere çarpma hızı v = g·t = <b>${F(P.g * t)} m/s</b>  (veya v = √(2gh))`, `Her saniyede alınan yol oranı: 1 : 3 : 5 : … (ilk saniyede ½g = ${F(P.g / 2, 1)} m)`]; }
    }),
    gozlem: [MC('Hava direncinin olmadığı ortamda aynı yükseklikten bırakılan taş ve tüy için hangisi doğrudur?', ['Taş daha büyük ivmeyle düşer', 'İkisi de aynı ivmeyle düşer ve aynı anda yere çarpar', 'Tüy daha büyük ivmeyle düşer', 'Yere çarpma hızları farklıdır'], 1, 'Serbest düşmede ivme g’dir ve kütleden bağımsızdır; v = gt, h = ½gt² bağıntıları iki cisim için de aynıdır.'),
      MC('Serbest düşen bir cismin hızı ilk 3 saniyede (g = 10 m/s²) nasıl değişir?', ['10, 20, 30 m/s (düzgün artar)', '10, 40, 90 m/s', 'Sabit 10 m/s', '10, 10, 10 m/s'], 0, 'v = g·t olduğundan hız her saniye 10 m/s artar: 10, 20, 30 m/s.')]
  };

  /* ============ 2. DÜŞEY ATIŞ ============ */
  SIMF.dusey = {
    title: 'Düşey Atış (Yukarı ve Aşağı)', ico: '⬆️', topic: 'dusey-atis',
    merak: 'Bir topu dik yukarı attığında tepe noktasında anlık olarak durur. Peki o anda ivmesi sıfır mıdır? Çıkış süresi ile iniş süresi aynı mıdır?',
    hip: [
      { q: 'Dik yukarı atılan cismin en yüksek noktasında hızı ve ivmesi nasıldır?', o: ['Hızı sıfır, ivmesi sıfır', 'Hızı sıfır, ivmesi g (aşağı yönlü)', 'Hızı v₀, ivmesi g', 'Hızı sıfır, ivmesi yukarı yönlü'], a: 1, why: 'Tepe noktasında hız anlık sıfırdır ama yerçekimi ivmesi (g) o anda da etkir ve aşağı yönlüdür. İvme sıfır olsaydı cisim orada asılı kalırdı.' },
      { q: 'Başlangıç noktasından aynı seviyeye geri dönerken (h₀ = 0) cismin hızının büyüklüğü, atış hızına göre nasıldır?', o: ['Daha küçüktür', 'Eşittir (yönü zıttır)', 'Daha büyüktür'], a: 1, why: 'Hava direnci yoksa mekanik enerji korunur; aynı seviyede hız büyüklüğü v₀’a eşittir, yönü aşağıdır.' },
      { q: 'v₀ = 20 m/s ile dik yukarı atılan cisim (g = 10 m/s²) en fazla kaç metre yükselir?', o: ['10 m', '20 m', '40 m', '2 m'], a: 1, why: 'H = v₀²/(2g) = 400/20 = 20 m.' }
    ],
    gorev: ['v₀’ı 20 m/s, h₀’ı 0 yap. Tepe noktasında t, y, v_y değerlerini “Ölçüm al” ile kaydet.', 'v_y–t grafiğini seç. Eğimin neyi gösterdiğini yorumla (eğim = ivme).', 'v₀’ı negatif yap (aşağı doğru atış) ve h₀’ı 40 m seç; yere iniş süresini ve hızını kaydet.', 'Stroboskopu aç: çıkışta ve inişte aynı yüksekliklerde hız büyüklüklerini karşılaştır.'],
    cfg: () => ({
      controls: [{ k: 'v0', label: 'Başlangıç hızı (+ yukarı, − aşağı)', min: -40, max: 40, step: 1, val: 20, unit: 'm/s' }, { k: 'h0', label: 'Başlangıç yüksekliği', min: 0, max: 60, step: 1, val: 0, unit: 'm' }, GC],
      vis: { vx: false, v: false, vy: true, a: true, proj: true, strobe: true }, graph: 'vyt', graphs: ['yt', 'vyt', 'vt', 'ayt', 'Et'], energy: true,
      tableParams: [['v0', 'v₀'], ['h0', 'h₀']],
      build: P => ({ bodies: [B('Top', '#ff7a7a', 0, P.h0, 0, P.v0, P.g, { r: 8 })] }),
      view: P => [-3, 3, 0, Math.max(P.h0, P.h0 + P.v0 * P.v0 / (2 * P.g) * (P.v0 > 0 ? 1 : 0)) + 1],
      banner: (P, bs) => 'Çıkış: ' + (P.v0 > 0 ? F(P.v0 / P.g) : '—') + ' s · Toplam uçuş süresi: ' + F(bs[0].st.T) + ' s',
      formulas: P => { const th = P.v0 > 0 ? P.v0 / P.g : 0, Hm = P.h0 + (P.v0 > 0 ? P.v0 * P.v0 / (2 * P.g) : 0), T = flight(P.h0, P.v0, P.g), vl = Math.sqrt(P.v0 * P.v0 + 2 * P.g * P.h0); return [`Çıkış süresi t_çıkış = v₀/g = <b>${F(th)} s</b>`, `Maksimum yükseklik H = h₀ + v₀²/(2g) = <b>${F(Hm)} m</b>`, `Yere iniş süresi T = (v₀+√(v₀²+2gh₀))/g = <b>${F(T)} s</b>`, `Yere çarpma hızı |v| = √(v₀²+2gh₀) = <b>${F(vl)} m/s</b>`]; }
    }),
    gozlem: [MC('Dik yukarı atılan bir cismin hareketi için hangisi yanlıştır?', ['Çıkış süresi ile iniş süresi (aynı seviyeye) eşittir', 'En üst noktada ivme sıfırdır', 'Yükselirken hız azalır', 'İvme tüm hareket boyunca g’dir'], 1, 'İvme tüm hareket boyunca g’dir ve aşağı yönlüdür; tepe noktasında yalnızca hız sıfırdır.'),
      MC('v₀ = 30 m/s ile dik yukarı atılan cismin (g = 10 m/s²) tepe noktasına çıkma süresi kaç saniyedir?', ['1 s', '2 s', '3 s', '6 s'], 2, 't = v₀/g = 30/10 = 3 s.')]
  };

  /* ============ 3. YATAY ATIŞ ============ */
  SIMF.yatay = {
    title: 'Yatay Atış', ico: '➡️', topic: 'yatay-atis',
    merak: 'Bir uçurumdan yatay fırlatılan top ile aynı anda serbest bırakılan top… Hangisi önce yere düşer? Yatay hız düşme süresini değiştirir mi?',
    hip: [
      { q: 'Aynı yükseklikte, aynı anda biri yatay atılan biri serbest bırakılan iki top için hangisi doğrudur?', o: ['Serbest bırakılan top önce düşer', 'Yatay atılan top önce düşer', 'İkisi aynı anda yere düşer'], a: 2, why: 'Düşey hareket yatay hareketten bağımsızdır. İkisinin de düşeydeki başlangıç hızı sıfırdır ve ivmesi g’dir; bu yüzden aynı anda iner.' },
      { q: 'Yatay hız (vₓ) iki katına çıkarılırsa menzil (R) ne olur? (yükseklik sabit)', o: ['Değişmez', 'İki katı olur', 'Dört katı olur', 'Yarıya iner'], a: 1, why: 'R = vₓ·t ve t yalnızca yüksekliğe bağlıdır; vₓ iki katına çıkınca R iki katı olur.' },
      { q: 'Yatay atışta hareket boyunca hangi bileşen sabit kalır?', o: ['Yatay hız vₓ', 'Düşey hız v_y', 'Bileşke hız büyüklüğü', 'Hız yönü'], a: 0, why: 'Yatayda ivme yoktur (hava direnci yok), vₓ sabittir. v_y = g·t artar; bileşke hız büyür ve yönü sürekli değişir.' }
    ],
    gorev: ['“Aynı anda serbest bırakılan top”u açık tut. Stroboskopta aynı t’de iki topun y değerlerini karşılaştır.', 'vₓ’i 10, 20, 30 m/s yap; her seferinde t ve R değerlerini tabloya kaydet. t değişiyor mu?', 'Yüksekliği 20 m ve 80 m yap; t ve R nasıl değişti? Formüllerle kontrol et.', 'Yere çarpma anındaki v_y ve bileşke hızı ile yön açısını (yatayla yaptığı açı) kaydet.'],
    cfg: () => ({
      controls: [{ k: 'h', label: 'Yükseklik', min: 5, max: 100, step: 1, val: 45, unit: 'm' }, { k: 'vx', label: 'Yatay atış hızı vₓ', min: 1, max: 40, step: 1, val: 15, unit: 'm/s' }, GC, { type: 'check', k: 'cmp', label: 'Aynı anda serbest bırakılan top', val: true }],
      vis: { a: false, strobe: true, proj: true }, graph: 'yt', tableParams: [['h', 'h'], ['vx', 'vₓ']], graphs: ['yt', 'xt', 'vxt', 'vyt', 'vt', 'yx'],
      build: P => ({ bodies: [B('Yatay atış', '#ff7a7a', 0, P.h, P.vx, 0, P.g, { r: 8 })].concat(P.cmp ? [B('Serbest', '#6bd0ff', 0, P.h, 0, 0, P.g, { r: 6, noVec: true })] : []) }),
      view: P => [-2, 10, 0, P.h],
      banner: (P, bs) => 'Düşme süresi: ' + F(bs[0].st.T) + ' s · Menzil: ' + F(bs[0].st.R) + ' m',
      formulas: P => { const t = Math.sqrt(2 * P.h / P.g), vy = P.g * t, v = Math.hypot(P.vx, vy); return [`Düşme süresi t = √(2h/g) = <b>${F(t)} s</b>`, `Menzil R = vₓ·t = <b>${F(P.vx * t)} m</b>`, `Yere çarpma: v_y = g·t = <b>${F(vy)} m/s</b>, |v| = √(vₓ²+v_y²) = <b>${F(v)} m/s</b>`, `Yön: tanθ = v_y/vₓ → θ = <b>${F(deg(Math.atan2(vy, P.vx)), 1)}°</b> (yatayın altında)`]; }
    }),
    gozlem: [MC('Yatay atışta düşme süresi hangi niceliğe bağlıdır?', ['Yalnızca yüksekliğe (ve g’ye)', 'Yatay hıza', 'Hem yatay hıza hem yüksekliğe', 'Kütleye'], 0, 't = √(2h/g); yatay hız süreyi etkilemez.'),
      MC('Yatay atılan bir cismin yörüngesi nasıldır?', ['Doğru', 'Parabol', 'Çember', 'Hiperbol'], 1, 'x = vₓt, y = h − ½gt² → y, x’in ikinci dereceden fonksiyonudur: parabol.')]
  };

  /* ============ 4. EĞİK ATIŞ ============ */
  SIMF.egik = {
    title: 'Eğik Atış (Yerden)', ico: '🎯', topic: 'egik-atis',
    merak: 'Futbolda en uzağa vuruş için topa kaç derece açıyla vurmalısın? 30°, 45° ve 60° atışlarının menzilleri arasında ne ilişki var?',
    hip: [
      { q: 'Hava direnci yokken, aynı hızla yerden atılan cisim hangi atış açısında en uzağa gider?', o: ['30°', '45°', '60°', '90°'], a: 1, why: 'R = v₀² sin2θ / g; sin2θ en büyük değerini 2θ = 90° yani θ = 45° iken alır.' },
      { q: 'Aynı hızla atılan cisimler için θ = 30° ve θ = 60° atışlarının menzilleri nasıldır?', o: ['30° daha büyük', '60° daha büyük', 'Eşit', 'Belirlenemez'], a: 2, why: 'Tamamlayıcı açılarda (θ ve 90°−θ) sin2θ aynıdır; menzil eşittir. Ancak 60° atışta yükseklik ve uçuş süresi daha büyüktür.' },
      { q: 'En yüksek noktada cismin hızı nasıldır?', o: ['Sıfır', 'v₀ cosθ (yatay)', 'v₀ sinθ (düşey)', 'v₀'], a: 1, why: 'En üst noktada yalnızca düşey bileşen sıfırdır; yatay bileşen vₓ = v₀cosθ aynen kalır.' }
    ],
    gorev: ['v₀ = 25 m/s için θ = 15°, 30°, 45°, 60°, 75° atışlarını yap; her birinin R, H, T değerlerini “Ölçüm al” ile tabloya yaz.', '“Tamamlayıcı açı”yı aç: θ ve 90°−θ yörüngelerini karşılaştır. Menzil, yükseklik ve süre ilişkisi nedir?', 'Tepe noktasında v, vₓ ve v_y değerlerini oku. Bileşke hız neye eşit?', 'Hava direncini aç ve 45°’de menzil değişimine bak. En uzak menzil için en uygun açı değişti mi?'],
    cfg: () => ({
      controls: [{ k: 'v0', label: 'Atış hızı v₀', min: 5, max: 60, step: 1, val: 25, unit: 'm/s' }, { k: 'th', label: 'Atış açısı θ', min: 0, max: 90, step: 1, val: 45, unit: '°' }, GC, { type: 'check', k: 'comp', label: 'Tamamlayıcı açıyı (90°−θ) karşılaştır', val: false }, { type: 'check', k: 'air', label: 'Hava direnci', val: false }],
      vis: { a: false, proj: true }, graph: 'yx', graphs: ['yt', 'xt', 'vxt', 'vyt', 'vt', 'yx', 'ayt'], tableParams: [['v0', 'v₀'], ['th', 'θ']],
      build: P => { const k = P.air ? .003 : 0, c = polar(P.v0, P.th), d = polar(P.v0, 90 - P.th); return { bodies: [B('θ', '#ff7a7a', 0, 0, c[0], c[1], P.g, { k, r: 8 })].concat(P.comp ? [B('90°−θ', '#58d6ff', 0, 0, d[0], d[1], P.g, { k, r: 7, noVec: true })] : []) }; },
      banner: (P, bs) => 'R = ' + F(bs[0].st.R) + ' m · H = ' + F(bs[0].st.H) + ' m · T = ' + F(bs[0].st.T) + ' s' + (bs[1] ? ' | tamamlayıcı R = ' + F(bs[1].st.R) + ' m' : ''),
      formulas: P => { const [vx, vy] = polar(P.v0, P.th); return [`v₀ₓ = v₀cosθ = <b>${F(vx)} m/s</b>, v₀y = v₀sinθ = <b>${F(vy)} m/s</b>`, `Çıkış süresi t_H = v₀y/g = <b>${F(vy / P.g)} s</b>, uçuş süresi T = 2v₀y/g = <b>${F(2 * vy / P.g)} s</b>`, `Maks. yükseklik H = v₀y²/(2g) = <b>${F(vy * vy / (2 * P.g))} m</b>`, `Menzil R = v₀²sin2θ/g = <b>${F(P.v0 * P.v0 * Math.sin(rad(2 * P.th)) / P.g)} m</b>` + (P.air ? ' (hava direnci kapalıyken geçerli)' : '')]; }
    }),
    gozlem: [MC('Aynı v₀ hızıyla yerden yapılan iki eğik atışta (hava direnci yok) 30° ve 60° için hangisi doğrudur?', ['Menzilleri eşittir; 60° atış daha yüksek ve daha uzun süre havada kalır', 'Menzili 30° olan daha büyüktür', 'Yükseklikleri eşittir', 'Uçuş süreleri eşittir'], 0, 'R aynıdır (sin60° = sin120°). H ∝ sin²θ ve T ∝ sinθ olduğundan 60° atışta ikisi de büyüktür.'),
      MC('v₀ = 20 m/s, θ = 30°, g = 10 m/s² ise tepe noktasındaki hız kaç m/s’dir?', ['0', '10', '10√3 ≈ 17,3', '20'], 2, 'Tepe noktasında v = vₓ = v₀cosθ = 20·cos30° = 10√3 ≈ 17,3 m/s.')]
  };

  /* ============ 5. YÜKSEKTEN EĞİK ATIŞ ============ */
  SIMF.yuksek = {
    title: 'Yüksekten Atış (Yukarı / Aşağı Eğik)', ico: '🏔️', topic: 'yuksekten-atis',
    merak: 'Bir binanın tepesinden aynı hızla biri yukarı, biri yatay, biri aşağı doğru üç top atılıyor. Yere çarpma hızları ve süreleri aynı mıdır?',
    hip: [
      { q: 'Aynı yükseklikten aynı büyüklükte v₀ ile atılan (yukarı eğik, yatay, aşağı eğik) üç cismin yere çarpma hız büyüklükleri (hava direnci yok) nasıldır?', o: ['Yukarı atılan en büyük', 'Aşağı atılan en büyük', 'Üçü de eşit', 'Yatay atılan en küçük'], a: 2, why: 'Mekanik enerji korunur: ½mv² = ½mv₀² + mgh. Hız büyüklüğü yalnızca v₀ ve h’a bağlıdır, yöne bağlı değildir. Ancak süreler farklıdır.' },
      { q: 'Aynı v₀ ile atılan bu üç cisimden hangisi yere en geç ulaşır?', o: ['Yukarı eğik atılan', 'Yatay atılan', 'Aşağı eğik atılan'], a: 0, why: 'Yukarı atılan cisim önce yükselip sonra alçalmak zorundadır; düşey yolu en uzun olan odur.' },
      { q: 'Atış açısı θ > 0 olan yüksekten atışta yere çarpma anında hızın yatayla yaptığı açı, atış açısına göre nasıldır?', o: ['Daha küçüktür', 'Aynıdır', 'Daha büyüktür'], a: 2, why: 'Yatay bileşen sabittir ama düşey bileşen yere inerken büyür; çarpma açısı genellikle atış açısından büyüktür.' }
    ],
    gorev: ['h₀ = 40 m, v₀ = 20 m/s için θ = +30°, 0°, −30° atışlarını sırayla yap; T, R ve yere çarpma hızını tabloya kaydet.', 'Hız büyüklüklerinin eşit çıkmasını mekanik enerji korunumuyla açıkla.', 'Hangi açıda menzil en büyük? Bu açı yerden atışta olduğu gibi 45° mi?', 'Formül panelindeki T ve R değerlerini simülasyonla karşılaştır.'],
    cfg: () => ({
      controls: [{ k: 'h0', label: 'Atış yüksekliği', min: 0, max: 80, step: 1, val: 40, unit: 'm' }, { k: 'v0', label: 'Atış hızı v₀', min: 0, max: 40, step: 1, val: 20, unit: 'm/s' }, { k: 'th', label: 'Açı θ (+ yukarı, − aşağı)', min: -80, max: 80, step: 1, val: 30, unit: '°' }, GC],
      vis: { a: false, proj: true }, graph: 'yx', tableParams: [['h0', 'h₀'], ['v0', 'v₀'], ['th', 'θ']],
      build: P => { const c = polar(P.v0, P.th); return { bodies: [B('Top', '#ff7a7a', 0, P.h0, c[0], c[1], P.g, { r: 8 })] }; },
      banner: (P, bs) => 'T = ' + F(bs[0].st.T) + ' s · R = ' + F(bs[0].st.R) + ' m · yere çarpma hızı = ' + F(bs[0].st.vl) + ' m/s',
      formulas: P => { const [vx, vy] = polar(P.v0, P.th), T = flight(P.h0, vy, P.g), vf = Math.sqrt(P.v0 * P.v0 + 2 * P.g * P.h0); return [`v₀ₓ = <b>${F(vx)} m/s</b>, v₀y = <b>${F(vy)} m/s</b>`, `Uçuş süresi T = (v₀y + √(v₀y² + 2gh₀))/g = <b>${F(T)} s</b>`, `Menzil R = v₀ₓ·T = <b>${F(vx * T)} m</b>`, `Yere çarpma hızı |v| = √(v₀² + 2gh₀) = <b>${F(vf)} m/s</b>`]; }
    }),
    gozlem: [MC('Bir binanın tepesinden aynı büyüklükte hızla, biri yukarı biri aşağı eğik iki taş atılıyor (hava direnci yok). Hangisi doğrudur?', ['Yere çarpma hızları eşittir; yukarı atılan geç ulaşır', 'Aşağı atılan hem daha hızlı çarpar hem erken ulaşır', 'Çarpma hızı yukarı atılanda büyüktür', 'İkisi aynı anda yere çarpar'], 0, 'Enerji korunumundan |v| aynıdır; ancak yukarı atılan daha uzun yol kat ettiğinden daha geç iner.'),
      MC('h₀ = 80 m’den v₀ = 0 ile (serbest bırakma) yere çarpma hızı (g = 10 m/s²) kaçtır?', ['20 m/s', '30 m/s', '40 m/s', '80 m/s'], 2, 'v = √(2gh) = √(2·10·80) = √1600 = 40 m/s.')]
  };

  /* ============ 6. EĞİK DÜZLEMDE ATIŞ ============ */
  SIMF.duzlem = {
    title: 'Eğik Düzlemde Atış', ico: '📐', topic: 'egik-duzlem-atis',
    merak: 'Bir tepenin yamacında yukarıya doğru atılan bir top ile aşağıya doğru atılan top aynı hızda atılsa da neden farklı uzaklıklara düşer? Ekseni eğik düzleme göre seçersek hareketi daha kolay çözebilir miyiz?',
    hip: [
      { q: 'Eğik düzlemden düzleme göre φ açısıyla atılan cismin uçuş süresi, düzlem boyunca ve düzleme dik eksende nasıl yorumlanır?', o: ['Süreyi yalnızca düzleme dik hareket belirler', 'Süreyi yalnızca düzlem boyunca hareket belirler', 'Süre atış hızına bağlı değildir', 'Süre eğimden bağımsızdır'], a: 0, why: 'Düzleme dik eksende hareket “yukarı atış” gibidir (ivme g cosα). Cisim düzleme geri döndüğünde dik eksendeki konumu sıfırdır: T = 2v₀sinφ/(g cosα).' },
      { q: 'Düzlem eksenlerinde (x′ düzlem boyunca, y′ düzleme dik) yerçekimi ivmesinin bileşenleri nelerdir?', o: ['a_x′ = g sinα (düzlem boyunca), a_y′ = g cosα (dik)', 'a_x′ = g cosα, a_y′ = g sinα', 'a_x′ = 0, a_y′ = g', 'a_x′ = g, a_y′ = 0'], a: 0, why: 'g vektörü düzlem boyunca g sinα ve düzleme dik g cosα bileşenlerine ayrılır (düzlemi aşağı çeken bileşen g sinα).' },
      { q: 'Aynı v₀ ile düzleme göre en büyük menzil (düzlem boyunca) için φ açısı ne olur? (α yukarı eğimli)', o: ['45°', '45° − α/2', '45° + α/2', '90°'], a: 1, why: 'Yukarı eğimli düzlemde L = 2v₀² sinφ cos(φ+α) / (g cos²α) en büyük değerini φ = 45° − α/2 iken alır (düzleme göre). Düz zeminde α = 0 için 45° bulunur.' }
    ],
    gorev: ['α = 20°, v₀ = 20 m/s, φ = 40° için “düzlem eksenleri”ni göster. a_x′ ve a_y′ değerlerini formül panelinden oku.', 'α’yı 0°, +20°, −20° yap (φ sabit). Düzlem boyunca menzil L nasıl değişiyor? Tabloya kaydet.', 'φ’yi 10°’den 80°’ye değiştir; en büyük L’yi veren φ’yi bul ve 45° − α/2 ile karşılaştır.', 'Uçuş süresini T = 2v₀sinφ/(g cosα) ile doğrula.'],
    incline: true,
    cfg: () => ({
      incline: true,
      controls: [{ k: 'al', label: 'Düzlemin eğimi α (− aşağı eğim)', min: -40, max: 40, step: 1, val: 20, unit: '°' }, { k: 'v0', label: 'Atış hızı v₀', min: 5, max: 50, step: 1, val: 20, unit: 'm/s' }, { k: 'ph', label: 'Düzleme göre atış açısı φ', min: 5, max: 85, step: 1, val: 40, unit: '°' }, GC],
      vis: { a: false, proj: false, axes: true }, graph: 'yx', tableParams: [['al', 'α'], ['v0', 'v₀'], ['ph', 'φ']],
      build: P => { const c = polar(P.v0, P.al + P.ph), ta = Math.tan(rad(P.al)); return { alpha: P.al, full: true, ground: x => ta * x, bodies: [B('Top', '#ff7a7a', 0, 0, c[0], c[1], P.g, { r: 8 })] }; },
      banner: (P, bs) => 'Düzlem boyunca menzil L = ' + F(bs[0].st.L) + ' m · T = ' + F(bs[0].st.T) + ' s · yatay menzil = ' + F(bs[0].st.R) + ' m',
      formulas: P => { const ca = Math.cos(rad(P.al)), sa = Math.sin(rad(P.al)), T = 2 * P.v0 * Math.sin(rad(P.ph)) / (P.g * ca), L = 2 * P.v0 * P.v0 * Math.sin(rad(P.ph)) * Math.cos(rad(P.ph + P.al)) / (P.g * ca * ca); return [`Düzlem eksenlerinde ivme: a_x′ = −g sinα = <b>${F(-P.g * sa)} m/s²</b>, a_y′ = −g cosα = <b>${F(-P.g * ca)} m/s²</b>`, `Başlangıç hızı bileşenleri: v₀ₓ′ = v₀cosφ = <b>${F(P.v0 * Math.cos(rad(P.ph)))} m/s</b>, v₀y′ = v₀sinφ = <b>${F(P.v0 * Math.sin(rad(P.ph)))} m/s</b>`, `Uçuş süresi T = 2v₀sinφ/(g cosα) = <b>${F(T)} s</b>`, `Düzlem boyunca menzil L = 2v₀²sinφ·cos(φ+α)/(g cos²α) = <b>${F(L)} m</b>`, `Yerden bakınca atış açısı β = α + φ = <b>${F(P.al + P.ph, 0)}°</b>`]; }
    }),
    gozlem: [MC('Eğim açısı α olan eğik düzlemde, düzlem boyunca (x′) ve düzleme dik (y′) eksenlerde yerçekimi ivmesinin büyüklükleri sırasıyla nedir?', ['g sinα ve g cosα', 'g cosα ve g sinα', 'g ve 0', '0 ve g'], 0, 'g vektörü eksenlere ayrılırsa düzlem boyunca g sinα, düzleme dik g cosα bulunur.'),
      MC('Eğik düzlemden düzleme dik doğrultuda atılan (φ = 90°) cismin düzlem boyunca konumu nasıl değişir?', ['Değişmez (düzlem üzerinde yer değiştirmez), yalnızca g sinα ile düzlem boyunca ivmelenir', 'Sabit hızla düzlem boyunca gider', 'Düzlemden uzaklaşır', 'Hiç hareket etmez'], 0, 'x′ yönünde başlangıç hızı yoktur, ancak g sinα ivmesi vardır; cisim düzlem boyunca aşağıya doğru kayar.')]
  };

  /* ============ 7. AYNI ANDA ============ */
  SIMF.karsilastir = {
    title: 'Aynı Anda Bırak: Üç Hareketin Yarışı', ico: '🏁', topic: 'atis-karsilastirma',
    merak: 'Aynı yükseklikten aynı anda üç cisim hareket ediyor: biri serbest bırakılıyor, biri yatay atılıyor, biri yukarı doğru eğik atılıyor. Yere iniş sırası ne olur?',
    hip: [
      { q: 'Hangi cisim yere ilk ulaşır?', o: ['Serbest bırakılan (A)', 'Yatay atılan (B)', 'Yukarı eğik atılan (C)', 'A ve B birlikte, C daha sonra'], a: 3, why: 'A ve B’nin düşey başlangıç hızı sıfır olduğundan aynı anda iner (t = √(2h/g)). C’nin yukarı yönlü düşey hızı olduğu için daha geç iner.' },
      { q: 'C cisminin düşey başlangıç hızı aşağı doğru olsaydı (aşağı eğik atış) ne olurdu?', o: ['C en geç iner', 'C en erken iner', 'A, B, C aynı anda iner'], a: 1, why: 'Aşağı yönlü düşey başlangıç hızı düşey yolu daha kısa sürede aldırır; C en erken yere ulaşır.' }
    ],
    gorev: ['Varsayılan değerlerle simülasyonu çalıştır, sırayı gözle ve her cismin iniş süresini tabloya kaydet.', 'C’nin düşey hızını sıfır yap (yatay atış): ne olur?', 'C’nin düşey hızını negatif (aşağı) yap ve iniş sıralamasını yeniden belirle.', 'Stroboskopla A ve B’nin aynı t’de aynı yükseklikte olduğunu doğrula.'],
    cfg: () => ({
      controls: [{ k: 'h', label: 'Yükseklik', min: 10, max: 80, step: 1, val: 45, unit: 'm' }, { k: 'vxB', label: 'B’nin yatay hızı', min: 1, max: 30, step: 1, val: 15, unit: 'm/s' }, { k: 'vxC', label: 'C’nin yatay hızı', min: 1, max: 30, step: 1, val: 10, unit: 'm/s' }, { k: 'vyC', label: 'C’nin düşey hızı (+ yukarı)', min: -20, max: 25, step: 1, val: 12, unit: 'm/s' }, GC],
      vis: { v: false, vx: false, vy: false, strobe: true, proj: true }, graph: 'yt', graphs: ['yt', 'xt', 'vyt', 'yx'], tableParams: [['h', 'h']],
      build: P => ({ bodies: [B('A serbest', '#6bd0ff', 0, P.h, 0, 0, P.g, { r: 7 }), B('B yatay', '#ffb04d', 3, P.h, P.vxB, 0, P.g, { r: 7 }), B('C eğik', '#ff6bd6', 6, P.h, P.vxC, P.vyC, P.g, { r: 7 })] }),
      view: P => [-2, 30, 0, P.h + 12],
      banner: (P, bs) => 'İniş süreleri → A: ' + F(bs[0].st.T) + ' s · B: ' + F(bs[1].st.T) + ' s · C: ' + F(bs[2].st.T) + ' s',
      formulas: P => [`A ve B: t = √(2h/g) = <b>${F(Math.sqrt(2 * P.h / P.g))} s</b>`, `C: t = (v_y + √(v_y² + 2gh))/g = <b>${F(flight(P.h, P.vyC, P.g))} s</b>`]
    }),
    gozlem: [MC('Aynı yükseklikten aynı anda biri serbest bırakılan, biri yatay atılan iki cisim için hangisi doğrudur?', ['Aynı anda yere düşerler', 'Yatay atılan daha geç düşer', 'Serbest bırakılan daha geç düşer', 'Kütlelerine bağlıdır'], 0, 'Düşey hareketleri özdeştir.'),
      MC('Düşey başlangıç hızı yukarı olan cisim aynı yükseklikteki serbest bırakılan cisimle karşılaştırıldığında yere…', ['daha geç iner', 'daha erken iner', 'aynı anda iner', 'hiç inmez'], 0, 'Önce yükselmesi gerektiği için uçuş süresi uzar.')]
  };

  /* ============ 8. MAYMUN – AVCI ============ */
  SIMF.maymun = {
    title: 'Maymun ve Avcı (Hedefe Atış)', ico: '🐒', topic: 'egik-atis',
    merak: 'Bir avcı ağaçtaki maymunu doğrudan nişan alıp ateş ediyor. Maymun, silah patladığı anda kendini ağaçtan bırakıyor. Mermi maymunu ıskalar mı, vurur mu?',
    hip: [
      { q: 'Avcı maymuna doğrudan nişan alıyor ve maymun ateşle aynı anda serbest düşüyor. Mermi maymunun üzerinden mi geçer, altından mı, yoksa vurur mu? (mermi yeterince hızlı)', o: ['Maymunun üstünden geçer', 'Maymunu vurur', 'Maymunun altından geçer'], a: 1, why: 'Mermi nişan doğrusundan ½gt² kadar aşağı sapar; maymun da aynı sürede aynı ½gt² kadar düşer. İkisi de aynı düşey sapmayı yaptığı için nişan doğrusu üzerinde buluşurlar.' },
      { q: 'Mermi hızı artırılırsa isabet yeri nasıl değişir?', o: ['Maymun daha yüksekte vurulur', 'Maymun daha alçakta vurulur', 'İsabet yeri değişmez'], a: 0, why: 'Mermi daha çabuk ulaşacağından maymun daha az düşmüş olur; çarpışma daha yüksekte olur.' }
    ],
    gorev: ['Varsayılan ayarla fırlat ve isabeti gözle. İsabet zamanı ve konumunu tabloya kaydet.', 'Mermi hızını artır ve azalt; isabet yerinin değişimini incele.', 'g’yi Ay, Mars’a çevir: yine isabet oluyor mu? Neden?', '“Maymuna tam nişan” kutusunu kapat ve avcıyı biraz yukarı/aşağı nişan aldır; isabet koşulunu yorumla.'],
    cfg: () => ({
      controls: [{ k: 'd', label: 'Ağaca uzaklık', min: 15, max: 70, step: 1, val: 40, unit: 'm' }, { k: 'hm', label: 'Maymunun yüksekliği', min: 10, max: 45, step: 1, val: 25, unit: 'm' }, { k: 'v0', label: 'Mermi hızı', min: 20, max: 90, step: 1, val: 40, unit: 'm/s' }, GC, { type: 'check', k: 'aim', label: 'Maymuna tam nişan al', val: true }, { k: 'off', label: 'Nişan sapması (kapalıysa)', min: -10, max: 10, step: 1, val: 3, unit: '°', show: P => !P.aim }],
      vis: { v: false, vx: false, vy: false, strobe: true, a: false }, graph: 'yt', graphs: ['yt', 'xt', 'yx'], tableParams: [['d', 'd'], ['hm', 'h'], ['v0', 'v₀']],
      build: P => { const a = deg(Math.atan2(P.hm, P.d)) + (P.aim ? 0 : P.off), c = polar(P.v0, a); return { collide: [0, 1, 1.1], bodies: [B('Mermi', '#ff5a5a', 0, 0, c[0], c[1], P.g, { r: 5, noVec: true }), B('Maymun', '#c98b4a', P.d, P.hm, 0, 0, P.g, { r: 11, emoji: '🐒', noVec: true })] }; },
      view: P => [-2, P.d + 6, 0, P.hm + 3],
      draw: (x, o) => { const P = o.P; x.strokeStyle = 'rgba(255,255,255,.35)'; x.setLineDash([6, 6]); x.beginPath(); x.moveTo(o.wx(0), o.wy(0)); x.lineTo(o.wx(P.d), o.wy(P.hm)); x.stroke(); x.setLineDash([]); x.font = '22px sans-serif'; x.fillText('🔫', o.wx(0) - 12, o.wy(0) - 2); x.fillText('🌳', o.wx(P.d) + 8, o.wy(0) - 4); },
      banner: (P, bs, t, hit) => hit ? 'İsabet! t = ' + F(hit.t) + ' s, yükseklik = ' + F(hit.y) + ' m' : (P.aim ? 'Mermi hızı yeterliyse isabet olur.' : 'Nişan sapmalı: isabet olmayabilir.'),
      formulas: P => { const a = Math.atan2(P.hm, P.d), t = P.d / (P.v0 * Math.cos(a)); return [`Nişan açısı tanθ = h/d → θ = <b>${F(deg(a), 1)}°</b>`, `Mermi x = d noktasına <b>${F(t)} s</b> sonra ulaşır.`, `O sürede iki cisim de ½gt² = <b>${F(.5 * P.g * t * t)} m</b> düşer; çarpışma yüksekliği ≈ <b>${F(P.hm - .5 * P.g * t * t)} m</b> (≥0 ise isabet)`]; }
    }),
    gozlem: [MC('Maymun ve avcı deneyinde, ateşle aynı anda düşmeye başlayan maymun için mermi neden isabet eder?', ['Mermi ve maymun aynı düşey ivmeyle düşer; nişan doğrusuna göre aynı düşey sapmayı yaparlar', 'Mermi yerçekiminden etkilenmez', 'Maymun yerçekiminden etkilenmez', 'Mermi çok hızlıdır'], 0, 'İki cisim de g ile ivmelenir. Nişan doğrusuna göre bağıl hareketleri düz bir doğru boyunca yaklaşmadır.'),
      MC('Mermi hızı iki katına çıkarılırsa (isabet olduğu varsayımıyla) çarpışma ne zaman olur?', ['Daha erken ve daha yüksekte', 'Daha geç ve daha yüksekte', 'Daha erken ve daha alçakta', 'Aynı anda'], 0, 'Mermi daha çabuk gelir; maymun daha az düşmüştür.')]
  };

  /* ============ 9. ENERJİ ============ */
  SIMF.enerji = {
    title: 'Atışlarda Mekanik Enerji', ico: '🔋', topic: 'enerji-atis',
    merak: 'Atılan bir cismin kinetik ve potansiyel enerjisi hareket boyunca nasıl değişir? Toplamları sabit midir? Hava direnci girerse ne olur?',
    hip: [
      { q: 'Hava direnci yokken atılan cismin mekanik enerjisi (Eₖ + Eₚ) hareket boyunca ne olur?', o: ['Artar', 'Azalır', 'Sabit kalır'], a: 2, why: 'Yalnızca yerçekimi (korunumlu kuvvet) iş yaptığı için mekanik enerji korunur: Eₖ azalırken Eₚ artar ve tersi.' },
      { q: 'Eğik atışta tepe noktasında kinetik enerji nasıldır?', o: ['Sıfırdır', 'En büyük değerindedir', 'Başlangıçtaki kinetik enerjinin cos²θ katıdır', 'Başlangıçtaki kinetik enerjinin sin²θ katıdır'], a: 2, why: 'Tepe noktasında hız vₓ = v₀cosθ olduğundan Eₖ = ½m(v₀cosθ)² = Eₖ₀cos²θ.' },
      { q: 'Hava direnci varsa mekanik enerji nasıl değişir?', o: ['Korunur', 'Azalır (ısıya dönüşür)', 'Artar'], a: 1, why: 'Hava direnci cisme yaptığı negatif iş nedeniyle mekanik enerjiyi azaltır; enerji ısı olarak yayılır.' }
    ],
    gorev: ['Enerji–t grafiğinde Eₖ, Eₚ ve toplamı izle. Toplam eğri neden yatay?', 'θ’yı 30° ve 80° yap; tepe noktasındaki Eₖ değerlerini karşılaştır.', 'Hava direncini aç (değerlendirme: toplam eğri azalıyor mu?).', 'Kütleyi artır; Eₖ ve Eₚ değişimini incele (hız ve yükseklik değişir mi?).'],
    cfg: () => ({
      energy: true,
      controls: [{ k: 'm', label: 'Kütle', min: 1, max: 10, step: .5, val: 2, unit: 'kg' }, { k: 'v0', label: 'Atış hızı', min: 5, max: 50, step: 1, val: 25, unit: 'm/s' }, { k: 'th', label: 'Açı θ', min: 0, max: 90, step: 1, val: 60, unit: '°' }, { k: 'h0', label: 'Başlangıç yüksekliği', min: 0, max: 40, step: 1, val: 0, unit: 'm' }, GC, { type: 'check', k: 'air', label: 'Hava direnci', val: false }],
      vis: { a: false, proj: true }, graph: 'Et', graphs: ['Et', 'yt', 'vt', 'yx'], tableParams: [['m', 'm'], ['v0', 'v₀'], ['th', 'θ']],
      build: P => { const c = polar(P.v0, P.th); return { bodies: [B('Cisim', '#ff7a7a', 0, P.h0, c[0], c[1], P.g, { k: P.air ? .003 : 0, r: 8 })] }; },
      banner: (P, bs) => 'Başlangıç Eₘ = ' + F(.5 * P.m * P.v0 * P.v0 + P.m * P.g * P.h0, 0) + ' J',
      formulas: P => { const e0 = .5 * P.m * P.v0 * P.v0, ep0 = P.m * P.g * P.h0, [vx] = polar(P.v0, P.th); return [`Başlangıç: Eₖ₀ = ½mv₀² = <b>${F(e0)} J</b>, Eₚ₀ = mgh₀ = <b>${F(ep0)} J</b>, toplam = <b>${F(e0 + ep0)} J</b>`, `Tepe noktasında Eₖ = ½m(v₀cosθ)² = <b>${F(.5 * P.m * vx * vx)} J</b>`, `Yere çarpma hızı v = √(v₀² + 2gh₀) = <b>${F(Math.sqrt(P.v0 * P.v0 + 2 * P.g * P.h0))} m/s</b> (hava direnci yokken)`]; }
    }),
    gozlem: [MC('Hava direnci yokken atılan bir cismin çıkış sırasında enerjileri için hangisi doğrudur?', ['Eₖ azalır, Eₚ artar, toplam sabit', 'Eₖ artar, Eₚ azalır', 'Eₖ ve Eₚ birlikte artar', 'Eₖ sabit kalır'], 0, 'Yükselirken hız azalır (Eₖ↓), yükseklik artar (Eₚ↑); toplam korunur.'),
      MC('m = 2 kg, v₀ = 10 m/s ile yerden dik yukarı atılan cismin (g = 10) tepe noktasındaki potansiyel enerjisi kaç J’dür?', ['20 J', '50 J', '100 J', '200 J'], 2, 'Eₚ = Eₖ₀ = ½·2·10² = 100 J (enerji korunumu).')]
  };

  /* ============ 10. HIZ BİLEŞENLERİ ============ */
  SIMF.bilesen = {
    title: 'Hız Vektörünü Bileşenlerine Ayır', ico: '📏', topic: 'vektor-bilesen',
    merak: 'Eğik atılan bir cismin hareketini neden “yatay” ve “düşey” olmak üzere iki ayrı harekete bölerek inceleriz? Açı değişince bileşenler nasıl değişir?',
    hip: [
      { q: 'v₀ sabit tutulup θ 0°’den 90°’ye artırılırsa v₀ₓ ve v₀y nasıl değişir?', o: ['v₀ₓ artar, v₀y azalır', 'v₀ₓ azalır, v₀y artar', 'İkisi de artar', 'İkisi de azalır'], a: 1, why: 'v₀ₓ = v₀cosθ azalır, v₀y = v₀sinθ artar. θ = 0° iken yalnızca yatay, θ = 90° iken yalnızca düşey bileşen vardır.' },
      { q: 'Hangi açıda v₀ₓ = v₀y olur?', o: ['30°', '45°', '60°', '90°'], a: 1, why: 'cosθ = sinθ ⇒ θ = 45° (tanθ = 1).' },
      { q: 'v₀ = 50 m/s ve θ = 37° için (sin37° = 0,6; cos37° = 0,8) v₀ₓ kaç m/s’dir?', o: ['30', '40', '50', '25'], a: 1, why: 'v₀ₓ = 50·0,8 = 40 m/s; v₀y = 50·0,6 = 30 m/s (3-4-5 üçgeni).' }
    ],
    gorev: ['θ = 37° ve v₀ = 50 m/s yap. Bileşenleri üçgen üzerinde oku, ölçüm al.', 'θ = 53° yap (3-4-5 üçgeninin diğer açısı). Bileşenlerin yer değiştirdiğini gözle.', 'θ = 0° ve θ = 90° için bileşenlerin ne olduğunu gör.', 'v₀ₓ² + v₀y² = v₀² olduğunu tablodaki değerlerle doğrula (Pisagor).'],
    cfg: () => ({
      controls: [{ k: 'v0', label: 'Atış hızı v₀', min: 5, max: 50, step: 1, val: 30, unit: 'm/s' }, { k: 'th', label: 'Açı θ', min: 0, max: 90, step: 1, val: 37, unit: '°' }, GC],
      vis: { v: true, vx: true, vy: true, a: false, proj: true }, graph: 'vyt', graphs: ['vxt', 'vyt', 'vt', 'yx'], tableParams: [['v0', 'v₀'], ['th', 'θ']],
      build: P => { const c = polar(P.v0, P.th); return { bodies: [B('Cisim', '#ff7a7a', 0, 0, c[0], c[1], P.g, { r: 7 })] }; },
      draw: (x, o) => { const P = o.P, c = polar(P.v0, P.th), s = Math.min(3.2, 150 / P.v0), X0 = o.wx(0) + 10, Y0 = o.wy(0) - 10; x.strokeStyle = 'rgba(255,255,255,.5)'; x.setLineDash([4, 4]); x.beginPath(); x.moveTo(X0, Y0); x.lineTo(X0 + c[0] * s, Y0); x.lineTo(X0 + c[0] * s, Y0 - c[1] * s); x.stroke(); x.setLineDash([]); x.strokeStyle = '#fff'; x.lineWidth = 2.6; x.beginPath(); x.moveTo(X0, Y0); x.lineTo(X0 + c[0] * s, Y0 - c[1] * s); x.stroke(); x.beginPath(); x.arc(X0, Y0, 26, -rad(P.th), 0); x.strokeStyle = '#ffd34d'; x.stroke(); x.fillStyle = '#ffd34d'; x.font = '700 12px Nunito'; x.fillText('θ=' + P.th + '°', X0 + 30, Y0 - 6); x.fillStyle = '#ff9b54'; x.fillText('v₀ₓ=' + F(c[0], 1), X0 + c[0] * s / 2 - 20, Y0 + 14); x.fillStyle = '#5ee08a'; x.fillText('v₀y=' + F(c[1], 1), X0 + c[0] * s + 6, Y0 - c[1] * s / 2); x.fillStyle = '#fff'; x.fillText('v₀=' + P.v0, X0 + c[0] * s / 2 - 28, Y0 - c[1] * s / 2 - 8); },
      formulas: P => { const [vx, vy] = polar(P.v0, P.th); return [`v₀ₓ = v₀·cosθ = ${P.v0}·${F(Math.cos(rad(P.th)), 3)} = <b>${F(vx)} m/s</b>`, `v₀y = v₀·sinθ = ${P.v0}·${F(Math.sin(rad(P.th)), 3)} = <b>${F(vy)} m/s</b>`, `Pisagor: √(v₀ₓ² + v₀y²) = <b>${F(Math.hypot(vx, vy))} m/s</b> = v₀`, `tanθ = v₀y / v₀ₓ = <b>${F(vx ? vy / vx : Infinity, 3)}</b>`]; }
    }),
    gozlem: [MC('θ = 60°, v₀ = 40 m/s için v₀ₓ ve v₀y değerleri nedir? (sin60° ≈ 0,87; cos60° = 0,5)', ['20 ve ≈34,8 m/s', '≈34,8 ve 20 m/s', '40 ve 0', '20 ve 20 m/s'], 0, 'v₀ₓ = 40·0,5 = 20 m/s; v₀y = 40·0,87 ≈ 34,8 m/s.'),
      MC('Hızın yatay bileşeni ile düşey bileşeni birbirine …', ['dik (birbirinden bağımsız) doğrultulardadır', 'paraleldir', 'aynı doğrultudadır', 'zıt yönlüdür'], 0, 'Bileşenler birbirine diktir; bu yüzden hareketler birbirinden bağımsız incelenir.')]
  };

  window.SIMF_ORDER = ['bilesen', 'serbest', 'dusey', 'yatay', 'egik', 'yuksek', 'duzlem', 'karsilastir', 'maymun', 'enerji'];
})();
