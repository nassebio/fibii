/* Nasse — Süper Bilim Koşusu: biyoloji ve fizik konularıyla platform oyunu (Mario tarzı, özgün karakterler) */
(function () {
  const TS = 32, VW = 24, VH = 13, W = VW * TS, H = VH * TS, G = 1800, PXM = 180; /* 1 m = 180 px → g = 10 m/s² */
  const f1 = n => (Math.round(n * 100) / 100).toString().replace('.', ',');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.floor(Math.random() * a.length)];
  const shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };
  let ac = null, mute = false;
  function snd(f, d, t, v) { if (mute) return; try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), g = ac.createGain(); o.type = t || 'square'; o.frequency.value = f; g.gain.value = v || .04; o.connect(g); g.connect(ac.destination); o.start(); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + d); o.stop(ac.currentTime + d); } catch (e) { } }
  const SFX = { jump() { snd(380, .12); setTimeout(() => snd(560, .1), 50); }, coin() { snd(988, .06); setTimeout(() => snd(1318, .14), 60); }, stomp() { snd(220, .12, 'triangle', .08); }, hurt() { snd(160, .35, 'sawtooth'); }, power() { [523, 659, 784, 1046, 1318].forEach((f, i) => setTimeout(() => snd(f, .1), i * 70)); }, bump() { snd(140, .08, 'triangle', .08); }, spring() { snd(300, .2, 'sine', .07); setTimeout(() => snd(700, .2, 'sine', .07), 80); }, shoot() { snd(660, .07, 'triangle'); }, win() { [523, 659, 784, 659, 784, 1046].forEach((f, i) => setTimeout(() => snd(f, .16), i * 130)); } };

  /* ---------- seviye oluşturucu ---------- */
  function build(len, steps) {
    const g = []; for (let r = 0; r < VH; r++) g.push(new Array(len).fill('.'));
    const set = (x, y, c) => { if (x >= 0 && x < len && y >= 0 && y < VH) g[y][x] = c; };
    for (let x = 0; x < len; x++) { set(x, 11, '#'); set(x, 12, '#'); }
    const api = {
      gap: (x, w) => { for (let i = 0; i < w; i++) { set(x + i, 11, '.'); set(x + i, 12, '.'); } },
      plat: (x, y, w, c) => { for (let i = 0; i < w; i++) set(x + i, y, c || '='); },
      col: (x, y0, h, c) => { for (let i = 0; i < h; i++) set(x, y0 - i, c || '#'); },
      stairs: (x, h, dir) => { for (let i = 0; i < h; i++) api.col(x + (dir < 0 ? h - 1 - i : i), 10, i + 1); },
      q: (x, y) => set(x, y, '?'), coin: (x, y, n) => { for (let i = 0; i < (n || 1); i++) set(x + i, y, 'C'); },
      e: x => set(x, 10, 'E'), f: (x, y) => set(x, y, 'F'), spring: x => set(x, 10, 'S'), spikes: (x, w) => { for (let i = 0; i < w; i++) set(x + i, 10, '^'); },
      cannon: (x, h) => { api.col(x, 10, h); set(x, 10 - h, 'K'); }, drop: (x, y) => set(x, y, 'D'), item: (x, y) => set(x, y, 'R'), check: x => set(x, 10, 'c'), flag: x => set(x, 10, '|')
    };
    steps(api); return g;
  }

  /* ---------- tema ve içerik ---------- */
  const BIO_LEVELS = [
    { name: '1 · Duyu Organları Bahçesi', topics: ['hazirlik', 'uyaran', 'uyartiyol', 'sinif', 'resyakin', 'organ', 'gozyapi', 'kulakyapi', 'denge', 'burunyapi', 'dilyapi', 'deriyapi', 'duyuyol', 'hayvan', 'teknoloji'], sky: ['#ffd9e6', '#b5e6ff'], ground: ['#d9727f', '#f2a0a8'], end: 'Uyaranlar reseptörlerle alındı! Sıra uyartıyı taşımakta: Akson Otoyolu’na!',
      map: build(112, a => { a.coin(6, 8, 3); a.q(9, 7); a.e(14); a.plat(17, 7, 4); a.q(18, 4); a.item(19, 6); a.gap(23, 2); a.coin(22, 7, 4); a.e(28); a.e(31); a.spring(34); a.coin(34, 3, 3); a.plat(38, 6, 5); a.q(40, 3); a.f(44, 6); a.gap(47, 3); a.stairs(51, 3, 1); a.item(53, 6); a.q(57, 7); a.e(60); a.spikes(63, 2); a.check(66); a.plat(69, 8, 3); a.plat(73, 6, 3); a.q(74, 3); a.coin(73, 5, 3); a.gap(77, 3); a.item(82, 8); a.e(84); a.f(87, 5); a.q(90, 7); a.coin(93, 8, 4); a.stairs(98, 4, 1); a.flag(107); }) },
    { name: '2 · Akson Otoyolu', topics: ['noron', 'noronyakin', 'miyelinhiz', 'esik', 'demet', 'siddet'], sky: ['#1b2a5c', '#4b3b8f'], ground: ['#5b55e0', '#8a85ff'], end: 'Uyartı Ranvier boğumlarından sıçrayarak akson ucuna ulaştı! Şimdi sinapsı geç.',
      map: build(118, a => { a.coin(5, 8, 3); a.q(8, 7); a.gap(12, 3); a.plat(11, 8, 1, 'B'); for (let k = 0; k < 5; k++) { a.plat(16 + k * 5, 8 - (k % 2), 3, 'B'); } a.gap(15, 25); a.e(43); a.item(45, 7); a.q(47, 7); a.f(50, 5); a.plat(53, 7, 4, 'B'); a.q(55, 4); a.coin(53, 6, 4); a.spikes(58, 3); a.check(62); a.e(65); a.e(68); a.spring(71); a.coin(71, 2, 3); a.gap(74, 4); a.plat(75, 7, 2, 'B'); a.item(76, 6); a.drop(81, 3); a.drop(85, 3); a.q(88, 7); a.e(91); a.f(94, 6); a.gap(97, 3); a.plat(97, 8, 3, 'B'); a.stairs(102, 4, 1); a.q(108, 7); a.coin(109, 8, 3); a.flag(114); }) },
    { name: '3 · Sinaps Köprüsü', topics: ['zar', 'iletim', 'sinaps', 'sinapscesit', 'etkinlik5'], sky: ['#2a0f3e', '#7a2f6a'], ground: ['#b27be8', '#e3c2ff'], end: 'Nörotransmitterler reseptörlere bağlandı, uyartı komşu hücreye aktarıldı! Tebrikler!',
      map: build(116, a => { a.coin(5, 8, 3); a.q(8, 7); a.e(12); a.cannon(17, 2); a.plat(21, 7, 3); a.q(22, 4); a.gap(25, 3); a.item(29, 7); a.e(32); a.e(34); a.f(37, 6); a.cannon(42, 3); a.coin(45, 8, 3); a.spring(49); a.plat(52, 4, 4); a.q(53, 1); a.coin(52, 3, 4); a.gap(57, 4); a.check(63); a.spikes(66, 3); a.q(70, 7); a.e(73); a.cannon(77, 2); a.item(80, 8); a.f(83, 5); a.plat(86, 7, 3); a.q(87, 4); a.gap(90, 3); a.e(95); a.e(98); a.stairs(101, 5, 1); a.q(108, 7); a.flag(112); }) }
  ];
  const PHY_LEVELS = [
    { name: '1 · Serbest Düşme Vadisi', topics: ['hareket-temel', 'vektor-bilesen', 'serbest-dusme'], sky: ['#8fd3ff', '#e6f6ff'], ground: ['#5aa04a', '#8fd36f'], end: 'Serbest düşen kayaları atlattın! Sıra Yatay Atış Kalesi’nde.',
      map: build(112, a => { a.coin(6, 8, 3); a.q(9, 7); a.drop(13, 2); a.e(16); a.plat(19, 7, 4); a.q(20, 4); a.item(22, 6); a.gap(25, 2); a.drop(29, 2); a.drop(31, 2); a.e(34); a.spring(37); a.coin(37, 2, 3); a.plat(41, 6, 5); a.q(43, 3); a.f(46, 6); a.gap(49, 3); a.stairs(53, 3, 1); a.item(55, 6); a.check(60); a.drop(63, 1); a.drop(65, 1); a.drop(67, 1); a.q(70, 7); a.e(73); a.plat(76, 7, 3); a.coin(76, 6, 3); a.gap(80, 3); a.e(86); a.f(89, 5); a.q(92, 7); a.stairs(98, 4, 1); a.flag(107); }) },
    { name: '2 · Yatay Atış Kalesi', topics: ['dusey-atis', 'yatay-atis'], sky: ['#ffd6a8', '#ffeed9'], ground: ['#a8743a', '#d9a35f'], end: 'Topların yatay atış yörüngelerinden kaçtın! Son durak: Eğik Atış Zirvesi.',
      map: build(114, a => { a.coin(5, 8, 3); a.q(8, 7); a.cannon(14, 3); a.e(18); a.spring(21); a.coin(21, 2, 3); a.plat(24, 6, 3); a.q(25, 3); a.gap(28, 3); a.cannon(34, 4); a.item(37, 8); a.e(40); a.e(43); a.check(46); a.plat(49, 7, 4); a.q(51, 4); a.f(54, 5); a.gap(57, 3); a.cannon(63, 2); a.spikes(66, 2); a.item(69, 7); a.q(72, 7); a.spring(76); a.plat(79, 4, 3); a.coin(79, 3, 3); a.cannon(85, 3); a.e(89); a.gap(92, 3); a.q(97, 7); a.stairs(100, 4, 1); a.flag(109); }) },
    { name: '3 · Eğik Atış Zirvesi', topics: ['egik-atis', 'yuksekten-atis', 'egik-duzlem-atis', 'atis-karsilastirma', 'enerji-atis', 'gercek-atis'], sky: ['#6a7bd6', '#cbd3ff'], ground: ['#7d8794', '#b9c2cc'], end: 'Zirveye ulaştın! Atışların bütün bileşenlerini kullandın. Tebrikler!',
      map: build(116, a => { a.coin(5, 8, 3); a.q(8, 7); a.e(12); a.e(14); a.plat(17, 7, 4); a.q(19, 4); a.cannon(25, 3); a.gap(28, 3); a.item(32, 7); a.f(35, 5); a.e(38); a.drop(42, 2); a.spring(45); a.plat(48, 4, 4); a.coin(48, 3, 4); a.q(50, 1); a.gap(53, 4); a.check(59); a.e(62); a.e(64); a.cannon(68, 2); a.q(72, 7); a.spikes(75, 3); a.f(80, 6); a.plat(83, 7, 3); a.item(84, 6); a.gap(87, 3); a.cannon(92, 4); a.e(96); a.stairs(100, 5, 1); a.q(107, 7); a.flag(112); }) }
  ];
  const BIO = {
    id: 'mario_bio', title: 'Süper İmpuls', hero: 'impuls', levels: BIO_LEVELS, coinName: 'ATP', itemName: 'Reseptör',
    bank: () => (typeof BANK !== 'undefined' ? BANK : []), enemyE: 'Durdurucu nörotransmitter', enemyF: 'Enzim', shotName: 'Nörotransmitter', dropName: 'Kalsiyum kristali (otolit)', cannonName: 'Enzim fırlatıcı',
    powerName: 'Miyelin kılıf', powerTxt: '🟡 Miyelin kılıf! Yalıtım sayesinde uyartı (sen) daha hızlı ilerliyorsun ve bir darbeye dayanıklısın. X/✦ ile nörotransmitter fırlat.',
    springTxt: '🦵 Refleks yayı! Uyaran → reseptör → duyu nöronu → omurilik → motor nöron → kas: zıpla!',
    items: ['👁️ Göz: fotoreseptör (çubuk–koni), nöron yapısında.', '👂 Kulak: tüylü duyu hücreleri, mekanoreseptör, duyu epiteli.', '👃 Burun: koku reseptör nöronları, kemoreseptör.', '👅 Dil: tat tomurcukları, kemoreseptör, duyu epiteli.', '🖐️ Deri: mekano-, termo- ve ağrı reseptörleri, nöron yapısında.', '🌡️ Termoreseptörler çoğunlukla deri ve dilde bulunur.', '⚡ Ağrı reseptörleri serbest sinir uçlarıdır; beyin hariç tüm vücutta bulunur.', '🐍 Çukur engereği pit organındaki termoreseptörlerle ısıyı algılar.'],
    facts: ['ATP topladın! Uyartı iletimi ATP harcadığı için kimyasaldır.', 'Uyartı iletimi iyon geçişlerine dayandığı için elektrikseldir → elektrokimyasal.', 'Nöronlarda enerji ihtiyacı fazladır; bu yüzden çok sayıda mitokondri vardır.', 'Uyartının yönü: dendrit → hücre gövdesi → akson → akson ucu.', 'Eşik değerin altındaki uyarılar tek nöronda tepki oluşturmaz: ya hep ya hiç!', 'Sinir demetinde tepki kademeli artar: merdiven etkisi.', 'Miyelin kılıf Schwann hücrelerinden oluşur ve iletimi hızlandırır.', 'Durdurucu sinaps hiperpolarizasyonla uyartıyı engeller.'],
    hurtTxt: { E: 'Durdurucu nörotransmitter seni hiperpolarize etti! (uyartı durdu)', F: 'Enzim seni parçaladı!', '^': 'Diken! Ağrı reseptörleri (nosiseptör) uyarıldı.', K: 'Enzim topu çarptı!', D: 'Kristal düştü!', fall: 'Uyartı kayboldu! Zincir koparsa algı oluşmaz.' },
    colors: { block: '#ffcf4a', brick: '#c45a7a', myelin: '#f5c542' }
  };
  const PHY = {
    id: 'mario_fiz', title: 'Süper Atış Kaşifi', hero: 'kasif', levels: PHY_LEVELS, coinName: 'Enerji', itemName: 'Formül',
    bank: () => (typeof FBANK !== 'undefined' ? FBANK : []), enemyE: 'Sürtünme canavarı', enemyF: 'Hava direnci bulutu', shotName: 'Eğik atış topu', dropName: 'Serbest düşen kaya', cannonName: 'Yatay atış topu',
    powerName: 'Atış eldiveni', powerTxt: '🧤 Atış eldiveni! X/✦ ile 45°’lik eğik atış topları fırlat. Menzil R = v₀²·sin2θ / g.',
    springTxt: '🟢 Yay! Düşey atış: v₀ = 5,56 m/s → H = v₀²/2g ≈ 1,54 m (g = 10 m/s²)',
    items: ['📐 Serbest düşme: h = ½gt², v = g·t, v² = 2gh', '⬆️ Düşey atış: t(çıkış) = v₀/g, H = v₀²/2g', '➡️ Yatay atış: x = v₀·t, y = ½gt², t = √(2h/g)', '↗️ Eğik atış: vₓ = v₀cosθ (sabit), v_y = v₀sinθ − g·t', '🎯 Menzil: R = v₀²·sin2θ / g; en büyük menzil θ = 45°', '🏔️ Tepe noktasında v_y = 0, yalnızca vₓ kalır.', '⚖️ Hava direnci yoksa kütle hareketi etkilemez.', '🔁 θ ve 90° − θ ile atılan cisimler aynı menzile düşer.'],
    facts: ['Enerji topladın! Hava direnci yoksa mekanik enerji korunur.', 'Zıplaman bir düşey atıştır: v₀ ve g ile H = v₀²/2g.', 'Yatayda ivme yoktur: vₓ sabit kalır.', 'Düşeyde ivme g = 10 m/s², aşağı yönlüdür.', 'Aynı yükseklikten bırakılan ve yatay atılan cisimler aynı anda yere düşer.', 'Uçuş süresi düşey hareketle belirlenir.', 'Tepe noktasında hız sıfır olmaz (eğik atışta vₓ kalır).', 'Hava direnci menzili ve en büyük yüksekliği azaltır.'],
    hurtTxt: { E: 'Sürtünme canavarı hızını sıfırladı!', F: 'Hava direnci bulutu seni yavaşlattı!', '^': 'Sivri kayalar!', K: 'Yatay atış topu çarptı! (x = v₀t, y = ½gt²)', D: 'Serbest düşen kaya! h = ½gt²', fall: 'Uçuruma serbest düştün! t = √(2h/g)' },
    colors: { block: '#ffcf4a', brick: '#b5653a', myelin: '#9ad1ff' }
  };

  /* ---------- oyun ---------- */
  function makeGame(CFG) {
    return function (box) {
      const wrap = document.createElement('div'); wrap.className = 'arc'; wrap.innerHTML = `<div class="arc-bar"><b class="a-s">Skor 0</b><span class="a-m"></span><span class="a-l"></span><button class="arc-mute">🔊</button></div><div class="arc-stage"><canvas style="aspect-ratio:${W}/${H}"></canvas><div class="arc-ov"></div></div>
        <div class="pf-pad"><div class="pf-l"><button class="pf-b" data-k="L" aria-label="Sol">◀</button><button class="pf-b" data-k="R" aria-label="Sağ">▶</button></div><div class="pf-r"><button class="pf-b pf-x" data-k="X" aria-label="At">✦</button><button class="pf-b pf-j" data-k="J" aria-label="Zıpla">⤒</button></div></div>
        <div class="arc-help">⌨️ ← → / A D: koş · ␣ / ↑ / W: zıpla (uzun bas = yüksek, havada bir kez daha bas = çift zıplama) · X: fırlat (güçlenince) · ❓ bloklarına alttan vur, soruyu bil, güçlen! · Bayrağa ulaş.</div><div class="pf-phys" style="text-align:center;font-size:.85rem;opacity:.9;margin-top:4px"></div>`;
      box.appendChild(wrap);
      const cv = wrap.querySelector('canvas'), x = cv.getContext('2d'), ov = wrap.querySelector('.arc-ov'), dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = W * dpr; cv.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
      const q = s => wrap.querySelector(s), keys = {}, offs = [];
      const on = (el, t, f) => { el.addEventListener(t, f, { passive: false }); offs.push(() => el.removeEventListener(t, f)); };
      q('.arc-mute').onclick = e => { mute = !mute; e.target.textContent = mute ? '🔇' : '🔊'; };
      let best = 0; try { best = +localStorage.getItem('pf_' + CFG.id) || 0; } catch (e) { }
      let S = null, raf = 0, paused = true, map, lv = 0;
      const solid = c => '#=B?XK'.includes(c);
      const tile = (tx, ty) => (ty < 0 || ty >= VH || tx < 0 || tx >= map[0].length) ? (ty >= VH ? '.' : (tx < 0 ? '#' : '.')) : map[ty][tx];
      let asked = new Set();
      function question() { const pool = CFG.bank().filter(qq => CFG.levels[lv].topics.includes(qq.t) && !asked.has(qq.q)); const p = pool.length ? pool : CFG.bank().filter(qq => !asked.has(qq.q)); const qq = pick(p.length ? p : CFG.bank()); asked.add(qq.q); return qq; }

      function newRun() { S = { score: 0, coins: 0, lives: 3, power: false }; lv = 0; asked = new Set(); loadLevel(); }
      function loadLevel() {
        map = CFG.levels[lv].map.map(r => r.slice()); const ents = [];
        for (let ty = 0; ty < VH; ty++) for (let tx = 0; tx < map[0].length; tx++) { const c = map[ty][tx];
          if (c === 'E') { ents.push({ k: 'E', x: tx * TS + 4, y: ty * TS + 6, w: 24, h: 26, vx: -60, vy: 0, alive: true }); map[ty][tx] = '.'; }
          else if (c === 'F') { ents.push({ k: 'F', x: tx * TS + 4, y: ty * TS + 4, w: 26, h: 22, y0: ty * TS + 4, t: Math.random() * 6, vx: -40, alive: true }); map[ty][tx] = '.'; }
          else if (c === 'D') { ents.push({ k: 'D', x: tx * TS + 2, y: ty * TS + 2, w: 28, h: 28, vy: 0, state: 0, t: 0, y0: ty * TS, alive: true }); map[ty][tx] = '.'; }
          else if (c === 'K') ents.push({ k: 'K', tx, ty, cd: 1 + Math.random() });
          else if (c === 'R') { ents.push({ k: 'R', x: tx * TS + 6, y: ty * TS + 6, w: 20, h: 20, alive: true, t: Math.random() * 6 }); map[ty][tx] = '.'; } }
        S.ents = ents; S.shots = []; S.balls = []; S.parts = []; S.pops = []; S.msg = ''; S.mt = 0; S.cam = 0; S.check = null; S.time = 0;
        spawn(); S.jumpInfo = null;
        paused = true; overlay(`<div style="font-size:2.6rem">${lv === 0 ? (CFG.hero === 'impuls' ? '⚡🧠' : '🧑‍🔬🎯') : '🚩'}</div><h2>${CFG.title}</h2><h3>${CFG.levels[lv].name}</h3><p>${lv === 0 ? (CFG.hero === 'impuls' ? 'Sen bir <b>sinir impulsu</b>sun! Dendritten akson ucuna, oradan sinapsa ulaş. ❓ bloklarındaki biyoloji sorularını bil, <b>miyelin kılıf</b> gücünü kazan. ATP topla, durdurucu nörotransmitterlerin üstüne zıpla!' : 'Sen bir <b>atış kaşifi</b>sin! Zıplaman gerçek bir <b>düşey atıştır</b> (g = 10 m/s²). ❓ bloklarındaki fizik sorularını bil, <b>atış eldiveni</b>yle eğik atış topları fırlat. Serbest düşen kayalara ve yatay atış toplarına dikkat!') : 'Yeni bölüm!'}</p>`, '▶ Başla', () => { paused = false; });
      }
      function spawn() { const p = S.check || { x: 2 * TS, y: 9 * TS }; S.p = { x: p.x, y: p.y, w: 22, h: 28, vx: 0, vy: 0, on: false, face: 1, inv: 1, coy: 0, jbuf: 0, apex: 0, run: 0, air: 1 }; }
      function overlay(html, btn, cb) { ov.innerHTML = html + `<button class="btn big">${btn}</button>`; ov.style.display = 'flex'; ov.querySelector('button').onclick = () => { ov.style.display = 'none'; snd(0, 0); cb(); }; }
      function msg(t, d) { S.msg = t; S.mt = d || 2.6; }
      function hud() { q('.a-s').textContent = `Skor ${S.score}`; q('.a-m').textContent = `${CFG.levels[lv].name} · ${CFG.coinName} ${S.coins}${S.power ? ' · ' + (CFG.hero === 'impuls' ? '🟡' : '🧤') : ''}`; q('.a-l').textContent = '❤️'.repeat(Math.max(0, S.lives)); }
      function hurt(why) { const p = S.p; if (p.inv > 0) return; if (S.power && why !== 'fall') { S.power = false; p.inv = 1.6; SFX.hurt(); msg('🛡️ Gücünü kaybettin! ' + (CFG.hurtTxt[why] || '')); return; } S.lives--; SFX.hurt(); msg('💥 ' + (CFG.hurtTxt[why] || 'Ah!'), 3); burst(p.x + 11, p.y + 14, '#ff5a5a', 20);
        if (S.lives <= 0) { gameOver(false); return; } spawn(); }
      function burst(px, py, col, n) { for (let i = 0; i < (n || 12); i++) { const a = Math.random() * 6.283, v = rnd(60, 260); S.parts.push({ x: px, y: py, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, l: rnd(.4, .9), c: col }); } }
      function gameOver(won) {
        paused = true; const nb = S.score > best; if (nb) { best = S.score; try { localStorage.setItem('pf_' + CFG.id, best); } catch (e) { } }
        if (won && typeof award === 'function') award('g_' + CFG.id, 40, CFG.title + ' tamamlandı!'); won ? SFX.win() : SFX.hurt();
        overlay(`<div style="font-size:3rem">${won ? '🏆' : '💥'}</div><h2>${won ? 'Bütün bölümler tamam!' : 'Oyun bitti'}</h2><p>Skor <b>${S.score}</b> · ${CFG.coinName} ${S.coins}${nb ? ' · 🏆 Yeni rekor!' : ' · rekor ' + best}</p>`, '🔁 Yeniden oyna', newRun);
      }
      function askQ(tx, ty) {
        paused = true; const qq = question(), ord = shuf(qq.o.map((_, i) => i));
        ov.innerHTML = `<div style="font-size:2rem">❓</div><p style="font-weight:800;max-width:560px">${qq.q}</p><div style="display:grid;gap:6px;width:min(520px,92%)">${ord.map(i => `<button class="btn ghost" data-i="${i}" style="text-align:left;animation:none;margin:0">${qq.o[i]}</button>`).join('')}</div><div class="pfq"></div>`; ov.style.display = 'flex';
        ov.querySelectorAll('[data-i]').forEach(b => b.onclick = () => {
          const good = +b.dataset.i === qq.a; ov.querySelectorAll('[data-i]').forEach(z => { z.disabled = true; if (+z.dataset.i === qq.a) z.style.background = 'rgba(46,204,113,.45)'; }); if (!good) b.style.background = 'rgba(255,90,90,.45)';
          if (good) { S.score += 200; S.power = true; SFX.power(); } else SFX.bump();
          ov.querySelector('.pfq').innerHTML = `<p style="max-width:560px">${good ? '✅ Doğru! +200 · ' + CFG.powerTxt : '❌ Yanlış. ' + (qq.e || '')}</p><button class="btn big">Devam ▶</button>`;
          ov.querySelector('.pfq button').onclick = () => { ov.style.display = 'none'; paused = false; };
        });
      }
      /* tile çarpışması */
      function moveX(o, dx) { o.x += dx; const t0 = Math.floor(o.y / TS), t1 = Math.floor((o.y + o.h - 1) / TS); if (dx > 0) { const tx = Math.floor((o.x + o.w) / TS); for (let ty = t0; ty <= t1; ty++) if (solid(tile(tx, ty))) { o.x = tx * TS - o.w; return true; } } else if (dx < 0) { const tx = Math.floor(o.x / TS); for (let ty = t0; ty <= t1; ty++) if (solid(tile(tx, ty))) { o.x = (tx + 1) * TS; return true; } } return false; }
      function moveY(o, dy, isP) { o.y += dy; const t0 = Math.floor(o.x / TS), t1 = Math.floor((o.x + o.w - 1) / TS); if (dy > 0) { const ty = Math.floor((o.y + o.h) / TS); for (let tx = t0; tx <= t1; tx++) if (solid(tile(tx, ty))) { o.y = ty * TS - o.h; return 1; } } else if (dy < 0) { const ty = Math.floor(o.y / TS); let hit = 0; for (let tx = t0; tx <= t1; tx++) if (solid(tile(tx, ty))) { hit = 1; if (isP) headHit(tx, ty); } if (hit) { o.y = (ty + 1) * TS; return -1; } } return 0; }
      function headHit(tx, ty) { const c = tile(tx, ty); if (c === '?') { map[ty][tx] = 'X'; S.pops.push({ x: tx * TS, y: ty * TS, t: 0 }); askQ(tx, ty); } else if (c === '=' || c === 'B') { SFX.bump(); S.pops.push({ x: tx * TS, y: ty * TS, t: 0 }); } }
      const hitBox = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

      function update(dt) {
        const p = S.p, Lk = keys.ArrowLeft || keys.a || keys.A || keys.L, Rk = keys.ArrowRight || keys.d || keys.D || keys.R, Jk = keys[' '] || keys.ArrowUp || keys.w || keys.W || keys.J;
        S.time += dt; p.inv = Math.max(0, p.inv - dt); S.mt -= dt;
        const maxV = (S.power && CFG.hero === 'impuls') ? 300 : 230, acc = p.on ? 1600 : 1000;
        if (Lk) { p.vx = Math.max(-maxV, p.vx - acc * dt); p.face = -1; } else if (Rk) { p.vx = Math.min(maxV, p.vx + acc * dt); p.face = 1; } else { p.vx *= Math.pow(p.on ? .0008 : .3, dt); if (Math.abs(p.vx) < 5) p.vx = 0; }
        p.coy = p.on ? .1 : p.coy - dt; if (p.on) p.air = 1; p.jbuf = Jk && !p.jHeld ? .12 : p.jbuf - dt;
        if (p.jbuf > 0 && p.coy > 0) { p.vy = -640; p.on = false; p.coy = 0; p.jbuf = 0; SFX.jump(); S.jumpInfo = { v0: 640, y0: p.y, apex: p.y, done: false }; }
        else if (p.jbuf > 0 && p.air > 0 && !p.on) { p.air--; p.jbuf = 0; p.vy = -580; SFX.jump(); setTimeout(() => snd(820, .08), 60); burst(p.x + 11, p.y + p.h, CFG.hero === 'impuls' ? '#9fe8ff' : '#ffffff', 10); S.jumpInfo = { v0: 580, y0: p.y, apex: p.y, done: false, dbl: true }; }
        if (!Jk && p.vy < -260 && S.jumpInfo && !S.jumpInfo.spring) { p.vy = -260; S.jumpInfo.cut = true; }
        p.jHeld = Jk;
        p.vy = Math.min(900, p.vy + G * dt);
        moveX(p, p.vx * dt); const r = moveY(p, p.vy * dt, true); const wasOn = p.on; p.on = r === 1; if (r) p.vy = 0;
        if (S.jumpInfo) { S.jumpInfo.apex = Math.min(S.jumpInfo.apex, p.y); if (p.on && !S.jumpInfo.done) { S.jumpInfo.done = true; const v0 = S.jumpInfo.v0 / PXM, Hm = (S.jumpInfo.y0 - S.jumpInfo.apex) / PXM; q('.pf-phys').innerHTML = CFG.hero === 'kasif' ? `⬆️ ${S.jumpInfo.dbl ? 'Çift zıplamanın ikinci atışı' : 'Son zıplaman bir düşey atıştı'}: v₀ = <b>${f1(v0)} m/s</b> · ölçülen H = <b>${f1(Hm)} m</b> · kuramsal H = v₀²/2g = <b>${f1(v0 * v0 / 20)} m</b>${S.jumpInfo.cut ? ' (tuşu erken bıraktın; tam yükseklik için zıplama tuşunu basılı tut)' : ''}` : `⚡ Uyartı sıçradı: ${f1(Hm)} m · ${CFG.coinName}: ${S.coins}`; } }
        if (p.y > H + 60) { hurt('fall'); return; }
        S.cam += (clamp(p.x - W * .4, 0, map[0].length * TS - W) - S.cam) * Math.min(1, dt * 8);
        /* tile etkileşimleri: para, yay, diken, bayrak, kontrol noktası */
        const cx0 = Math.floor(p.x / TS), cx1 = Math.floor((p.x + p.w - 1) / TS), cy0 = Math.floor(p.y / TS), cy1 = Math.floor((p.y + p.h - 1) / TS);
        for (let ty = cy0; ty <= cy1; ty++) for (let tx = cx0; tx <= cx1; tx++) { const c = tile(tx, ty);
          if (c === 'C') { map[ty][tx] = '.'; S.coins++; S.score += 10; SFX.coin(); burst(tx * TS + 16, ty * TS + 16, '#ffd34d', 6); if (S.coins % 8 === 0) msg('💡 ' + pick(CFG.facts), 3.4); }
          else if (c === '^') hurt('^');
          else if (c === '|') { levelDone(); return; }
          else if (c === 'c' && (!S.check || S.check.x < tx * TS)) { S.check = { x: tx * TS, y: 9 * TS }; msg('🚩 Kontrol noktası!', 1.6); } }
        const below = tile(Math.floor((p.x + p.w / 2) / TS), Math.floor((p.y + p.h + 2) / TS));
        if (p.on && below === 'S') { p.vy = -1000; p.on = false; SFX.spring(); msg(CFG.springTxt, 3.2); S.jumpInfo = { v0: 1000, y0: p.y, apex: p.y, done: false, spring: true }; }
        else if (tile(Math.floor((p.x + p.w / 2) / TS), Math.floor((p.y + p.h - 4) / TS)) === 'S' && p.vy >= 0) { p.vy = -1000; SFX.spring(); msg(CFG.springTxt, 3.2); S.jumpInfo = { v0: 1000, y0: p.y, apex: p.y, done: false, spring: true }; }
        /* atış */
        if ((keys.x || keys.X || keys.Xb) && S.power && !(S.shotCd > 0)) { S.shotCd = .45; SFX.shoot(); const v = CFG.hero === 'kasif' ? 520 : 420, th = CFG.hero === 'kasif' ? Math.PI / 4 : Math.PI / 9; S.shots.push({ x: p.x + 11 + p.face * 12, y: p.y + 8, vx: p.face * v * Math.cos(th), vy: -v * Math.sin(th), g: CFG.hero === 'kasif' ? G : G * .35, t: 0, trail: [] }); if (CFG.hero === 'kasif') { const v0 = v / PXM; msg(`↗️ Eğik atış: v₀ = ${f1(v0)} m/s, θ = 45° → R = v₀²·sin90°/g = ${f1(v0 * v0 / 10)} m`, 2.4); } }
        S.shotCd = (S.shotCd || 0) - dt;
        S.shots = S.shots.filter(s => { s.t += dt; s.vy += s.g * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.trail.push([s.x, s.y]); if (s.trail.length > 18) s.trail.shift(); if (solid(tile(Math.floor(s.x / TS), Math.floor(s.y / TS))) || s.t > 2.5) { burst(s.x, s.y, '#fff', 6); return false; } for (const e of S.ents) if ((e.k === 'E' || e.k === 'F') && e.alive && s.x > e.x && s.x < e.x + e.w && s.y > e.y && s.y < e.y + e.h) { e.alive = false; S.score += 150; SFX.stomp(); burst(e.x + 12, e.y + 12, '#ffd34d', 14); return false; } return true; });
        /* varlıklar */
        for (const e of S.ents) {
          if (e.k === 'E' && e.alive) { e.vy = Math.min(900, (e.vy || 0) + G * dt); if (Math.abs(e.x - p.x) < W) { const hitW = moveX(e, e.vx * dt); const ahead = tile(Math.floor((e.vx > 0 ? e.x + e.w + 1 : e.x - 1) / TS), Math.floor((e.y + e.h + 4) / TS)); if (hitW || (!solid(ahead) && ahead !== 'S')) e.vx = -e.vx; } if (moveY(e, e.vy * dt)) e.vy = 0; if (e.y > H + 40) e.alive = false; }
          if (e.k === 'F' && e.alive) { e.t += dt; e.x += e.vx * dt; e.y = e.y0 + Math.sin(e.t * 2) * 40; if (solid(tile(Math.floor((e.vx < 0 ? e.x : e.x + e.w) / TS), Math.floor((e.y + 10) / TS)))) e.vx = -e.vx; }
          if ((e.k === 'E' || e.k === 'F') && e.alive && hitBox(p, e)) { if (p.vy > 60 && p.y + p.h - e.y < 16) { e.alive = false; p.vy = -420; S.score += 100; SFX.stomp(); burst(e.x + 12, e.y + 12, '#fff', 10); msg(`👟 ${e.k === 'E' ? CFG.enemyE : CFG.enemyF} etkisiz!`, 1.4); } else hurt(e.k); }
          if (e.k === 'D' && e.alive) { if (e.state === 0 && p.x + p.w > e.x - 8 && p.x < e.x + e.w + 8 && p.y > e.y) { e.state = 1; e.t = 0; } else if (e.state === 1) { e.t += dt; if (e.t > .35) { e.state = 2; e.t = 0; if (!S.dropTold) { S.dropTold = 1; msg(CFG.hero === 'kasif' ? '🪨 Serbest düşme! İlk hız 0, ivme g: h = ½gt²' : '💎 Kristal düşüyor! (Denge organındaki otolitler yer çekimini algılatır)', 3); } } } else if (e.state === 2) { e.t += dt; e.vy += G * dt; e.y += e.vy * dt; if (hitBox(p, e)) hurt('D'); if (solid(tile(Math.floor((e.x + 14) / TS), Math.floor((e.y + e.h) / TS)))) { e.alive = false; burst(e.x + 14, e.y + 28, '#c9b79a', 16); SFX.bump(); if (CFG.hero === 'kasif') msg(`🪨 Düşüş süresi ${f1(e.t)} s → h = ½gt² ≈ ${f1(.5 * 10 * e.t * e.t)} m`, 2.4); } } }
          if (e.k === 'K') { e.cd -= dt; const ex = e.tx * TS + 16, ey = e.ty * TS + 10, dx = p.x - ex; if (e.cd <= 0 && Math.abs(dx) < 13 * TS) { e.cd = 2.4; const dir = Math.sign(dx) || -1; S.balls.push({ x: ex + dir * 18, y: ey, vx: dir * 210, vy: 0, t: 0, trail: [] }); snd(120, .15, 'triangle', .07); } }
          if (e.k === 'R' && e.alive) { e.t += dt; if (hitBox(p, e)) { e.alive = false; S.score += 300; SFX.power(); msg((CFG.hero === 'kasif' ? '📜 ' : '🧬 ') + pick(CFG.items), 4); burst(e.x + 10, e.y + 10, '#7df', 14); } }
        }
        S.balls = S.balls.filter(b => { b.t += dt; b.vy += G * .5 * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.trail.push([b.x, b.y]); if (b.trail.length > 24) b.trail.shift(); if (hitBox(p, { x: b.x - 7, y: b.y - 7, w: 14, h: 14 })) { hurt('K'); return false; } if (b.y > H + 20 || solid(tile(Math.floor(b.x / TS), Math.floor(b.y / TS)))) { burst(b.x, b.y, '#888', 6); return false; } return true; });
        S.parts = S.parts.filter(q2 => { q2.l -= dt; q2.x += q2.vx * dt; q2.y += q2.vy * dt; q2.vy += 900 * dt; return q2.l > 0; });
        S.pops.forEach(pp => pp.t += dt); S.pops = S.pops.filter(pp => pp.t < .25);
        hud();
      }
      function levelDone() { paused = true; S.score += 500; SFX.win(); burst(S.p.x, S.p.y, '#ffd34d', 30); if (lv >= CFG.levels.length - 1) { setTimeout(() => gameOver(true), 400); return; } overlay(`<div style="font-size:3rem">🏁</div><h2>Bölüm tamam!</h2><p>${CFG.levels[lv].end}</p><p>Skor <b>${S.score}</b> · ${CFG.coinName} ${S.coins}</p>`, 'Sonraki bölüm ▶', () => { lv++; S.power = S.power; loadLevel(); }); }

      /* ---------- çizim ---------- */
      function rr(px, py, w, h, r) { x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r); x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath(); }
      function drawBg() {
        const L = CFG.levels[lv], g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, L.sky[0]); g.addColorStop(1, L.sky[1]); x.fillStyle = g; x.fillRect(0, 0, W, H);
        const c = S.cam;
        if (CFG.hero === 'kasif') { x.fillStyle = 'rgba(255,255,255,.75)'; for (let i = 0; i < 8; i++) { const cx = ((i * 260 - c * .25) % 2080 + 2080) % 2080 - 100, cy = 40 + (i % 3) * 30; x.beginPath(); x.arc(cx, cy, 22, 0, 7); x.arc(cx + 24, cy - 8, 26, 0, 7); x.arc(cx + 52, cy, 20, 0, 7); x.fill(); } x.fillStyle = 'rgba(70,90,120,.25)'; for (let i = 0; i < 9; i++) { const mx = ((i * 300 - c * .45) % 2700 + 2700) % 2700 - 200; x.beginPath(); x.moveTo(mx, 352); x.lineTo(mx + 150, 170 + (i % 3) * 40); x.lineTo(mx + 300, 352); x.fill(); } }
        else { for (let i = 0; i < 10; i++) { const nx = ((i * 230 - c * .3) % 2300 + 2300) % 2300 - 100, ny = 70 + (i % 4) * 55; x.strokeStyle = 'rgba(255,255,255,.18)'; x.lineWidth = 3; for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28 + i; x.beginPath(); x.moveTo(nx, ny); x.quadraticCurveTo(nx + Math.cos(a) * 30, ny + Math.sin(a) * 30 + 10, nx + Math.cos(a) * 55, ny + Math.sin(a) * 55); x.stroke(); } x.fillStyle = 'rgba(255,255,255,.22)'; x.beginPath(); x.arc(nx, ny, 12, 0, 7); x.fill(); } }
      }
      function drawTile(c, px, py, tx, ty) {
        const L = CFG.levels[lv], col = CFG.colors;
        if (c === '#') { const top = tile(tx, ty - 1) !== '#'; x.fillStyle = L.ground[0]; x.fillRect(px, py, TS, TS); x.fillStyle = 'rgba(0,0,0,.12)'; x.fillRect(px + 2, py + 18, 6, 4); x.fillRect(px + 18, py + 8, 8, 4); if (top) { x.fillStyle = L.ground[1]; x.fillRect(px, py, TS, 8); x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(px, py, TS, 2); } x.strokeStyle = 'rgba(0,0,0,.18)'; x.strokeRect(px + .5, py + .5, TS - 1, TS - 1); }
        else if (c === '=') { x.fillStyle = col.brick; x.fillRect(px, py, TS, TS); x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 2; x.strokeRect(px + 1, py + 1, TS - 2, TS - 2); x.beginPath(); x.moveTo(px, py + 16); x.lineTo(px + TS, py + 16); x.moveTo(px + 16, py); x.lineTo(px + 16, py + 16); x.moveTo(px + 8, py + 16); x.lineTo(px + 8, py + 32); x.moveTo(px + 24, py + 16); x.lineTo(px + 24, py + 32); x.stroke(); x.lineWidth = 1; }
        else if (c === 'B') { rr(px + 1, py + 3, TS - 2, TS - 6, 12); x.fillStyle = col.myelin; x.fill(); x.fillStyle = 'rgba(255,255,255,.45)'; x.fillRect(px + 6, py + 7, TS - 12, 4); x.strokeStyle = 'rgba(120,80,0,.5)'; x.stroke(); if (tile(tx + 1, ty) !== 'B') { x.fillStyle = '#2fd4c0'; x.fillRect(px + TS - 3, py + 10, 6, 12); } }
        else if (c === '?' || c === 'X') { const used = c === 'X'; rr(px + 1, py + 1, TS - 2, TS - 2, 5); x.fillStyle = used ? '#8a6a4a' : col.block; x.fill(); x.strokeStyle = used ? '#5a4128' : '#b07a00'; x.lineWidth = 2; x.stroke(); x.lineWidth = 1; if (!used) { x.fillStyle = '#7a4a00'; x.font = '800 20px Nunito, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('?', px + 16, py + 17 + Math.sin(S.time * 5 + tx) * 1.5); } x.fillStyle = 'rgba(0,0,0,.3)'; [[4, 4], [26, 4], [4, 26], [26, 26]].forEach(([a, b]) => x.fillRect(px + a, py + b, 3, 3)); }
        else if (c === 'C') { const s = Math.abs(Math.sin(S.time * 4 + tx)); x.fillStyle = CFG.hero === 'impuls' ? '#ffd34d' : '#5ff0a0'; x.beginPath(); x.ellipse(px + 16, py + 16, 4 + 8 * s, 11, 0, 0, 7); x.fill(); x.fillStyle = 'rgba(0,0,0,.45)'; x.font = '700 8px Nunito'; x.textAlign = 'center'; x.textBaseline = 'middle'; if (s > .6) x.fillText(CFG.hero === 'impuls' ? 'ATP' : 'E', px + 16, py + 16); }
        else if (c === '^') { x.fillStyle = '#ccd'; for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(px + i * 8, py + TS); x.lineTo(px + i * 8 + 4, py + 12); x.lineTo(px + i * 8 + 8, py + TS); x.fill(); } }
        else if (c === 'S') { x.fillStyle = '#2ecc71'; rr(px + 3, py + 18, TS - 6, 12, 4); x.fill(); x.strokeStyle = '#555'; x.lineWidth = 3; x.beginPath(); for (let i = 0; i < 4; i++) { x.moveTo(px + 8, py + 30 - i * 3); x.lineTo(px + 24, py + 28 - i * 3); } x.stroke(); x.lineWidth = 1; x.fillStyle = '#fff'; x.font = '700 9px Nunito'; x.textAlign = 'center'; x.fillText(CFG.hero === 'impuls' ? 'refleks' : 'yay', px + 16, py + 25); }
        else if (c === 'K') { x.fillStyle = '#333a44'; rr(px + 2, py + 6, TS - 4, TS - 6, 6); x.fill(); x.fillStyle = '#111'; x.beginPath(); x.arc(px + 16, py + 18, 7, 0, 7); x.fill(); x.fillStyle = '#ff5a5a'; x.fillRect(px + 6, py + 8, 20, 3); }
        else if (c === '|') { x.fillStyle = '#ddd'; x.fillRect(px + 14, py - 7 * TS, 4, 8 * TS); x.fillStyle = '#ffd34d'; x.beginPath(); x.arc(px + 16, py - 7 * TS, 6, 0, 7); x.fill(); x.fillStyle = CFG.hero === 'impuls' ? '#b27be8' : '#ff6b6b'; x.beginPath(); x.moveTo(px + 18, py - 6.6 * TS); x.lineTo(px + 18 + 40, py - 6.1 * TS + Math.sin(S.time * 4) * 3); x.lineTo(px + 18, py - 5.6 * TS); x.fill(); x.fillStyle = '#fff'; x.font = '700 11px Nunito'; x.textAlign = 'left'; x.fillText(CFG.hero === 'impuls' ? 'Sinaps' : 'Hedef', px + 22, py - 6.05 * TS); }
        else if (c === 'c') { x.fillStyle = '#fff'; x.fillRect(px + 14, py - 30, 3, 62); x.fillStyle = S.check && S.check.x === tx * TS ? '#2ecc71' : '#aab'; x.fillRect(px + 17, py - 30, 16, 11); }
      }
      function drawHero(p) {
        const px = p.x - S.cam, py = p.y, t = S.time, run = Math.abs(p.vx) > 20 && p.on ? Math.sin(t * 18) : 0;
        if (p.inv > 0 && Math.floor(t * 14) % 2) return;
        x.save(); x.translate(px + 11, py + 14); x.scale(p.face, 1);
        if (CFG.hero === 'impuls') {
          if (S.power) { x.strokeStyle = 'rgba(245,197,66,.9)'; x.lineWidth = 4; x.beginPath(); x.arc(0, 0, 17, 0, 7); x.stroke(); x.lineWidth = 1; }
          x.strokeStyle = '#8fa8ff'; x.lineWidth = 3; for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28 + Math.sin(t * 6 + k) * .2; x.beginPath(); x.moveTo(Math.cos(a) * 10, Math.sin(a) * 10); x.lineTo(Math.cos(a) * 16, Math.sin(a) * 16); x.stroke(); } x.lineWidth = 1;
          const gr = x.createRadialGradient(-3, -4, 2, 0, 0, 13); gr.addColorStop(0, '#fff'); gr.addColorStop(.4, '#9fe8ff'); gr.addColorStop(1, '#5b55e0'); x.fillStyle = gr; x.beginPath(); x.arc(0, 0, 12, 0, 7); x.fill();
          x.fillStyle = '#fff'; x.beginPath(); x.arc(4, -3, 4, 0, 7); x.fill(); x.fillStyle = '#123'; x.beginPath(); x.arc(5.5, -3, 2, 0, 7); x.fill();
          x.strokeStyle = '#123'; x.lineWidth = 2; x.beginPath(); x.arc(4, 3, 4, .2, 2.6); x.stroke(); x.lineWidth = 1;
          x.fillStyle = '#ffd34d'; x.beginPath(); x.moveTo(-14, 4); x.lineTo(-22, 0); x.lineTo(-17, 8); x.fill();
          x.fillStyle = '#3b2f9a'; x.fillRect(-7 + run * 3, 11, 5, 4); x.fillRect(2 - run * 3, 11, 5, 4);
        } else {
          x.fillStyle = '#2b4a8a'; x.fillRect(-7 + run * 3, 6, 6, 8); x.fillRect(1 - run * 3, 6, 6, 8); x.fillStyle = '#222'; x.fillRect(-8 + run * 3, 12, 8, 3); x.fillRect(0 - run * 3, 12, 8, 3);
          x.fillStyle = '#f2f2f2'; rr(-9, -6, 18, 14, 4); x.fill(); x.fillStyle = S.power ? '#ffb02e' : '#7aa'; x.fillRect(8, -2 + run * 2, 5, 5);
          x.fillStyle = '#f2c09a'; x.beginPath(); x.arc(0, -11, 7, 0, 7); x.fill(); x.fillStyle = '#5a3a1a'; x.beginPath(); x.arc(0, -14, 7, Math.PI, 0); x.fill();
          x.fillStyle = '#22d3ee'; rr(-1, -14, 9, 5, 2); x.fill(); x.strokeStyle = '#123'; x.strokeRect(-1, -14, 9, 5); x.fillStyle = '#123'; x.fillRect(4, -9, 3, 1.5);
          x.fillStyle = '#ffd34d'; x.font = '700 7px Nunito'; x.textAlign = 'center'; x.fillText('g', 0, 4);
        }
        x.restore();
      }
      function drawEnt(e) {
        const ex = (e.x || 0) - S.cam;
        if (e.k === 'E' && e.alive) { const w = Math.sin(S.time * 10) * 2; x.save(); x.translate(ex + 12, e.y + 13);
          if (CFG.hero === 'impuls') { x.fillStyle = '#ff5a5a'; x.beginPath(); x.arc(0, 2, 12, Math.PI, 0); x.lineTo(12, 12); x.lineTo(-12, 12); x.fill(); x.fillStyle = '#fff'; x.font = '800 12px Nunito'; x.textAlign = 'center'; x.fillText('−', 0, 9); x.fillStyle = '#fff'; x.beginPath(); x.arc(-4, -2, 3, 0, 7); x.arc(4, -2, 3, 0, 7); x.fill(); x.fillStyle = '#300'; x.fillRect(-5, -2, 2, 2); x.fillRect(3, -2, 2, 2); x.strokeStyle = '#300'; x.beginPath(); x.moveTo(-8, -7); x.lineTo(-2, -4); x.moveTo(8, -7); x.lineTo(2, -4); x.stroke(); }
          else { x.fillStyle = '#7a5230'; rr(-12, -10, 24, 22, 6); x.fill(); x.fillStyle = '#c9a070'; for (let i = -10; i < 12; i += 5) x.fillRect(i, 8 + (i % 2 ? w : -w), 3, 4); x.fillStyle = '#fff'; x.beginPath(); x.arc(-4, -3, 3.5, 0, 7); x.arc(5, -3, 3.5, 0, 7); x.fill(); x.fillStyle = '#000'; x.fillRect(-5, -3, 2, 2); x.fillRect(4, -3, 2, 2); x.fillStyle = '#fff'; x.font = '700 7px Nunito'; x.textAlign = 'center'; x.fillText('F_s', 0, 6); }
          x.restore(); }
        if (e.k === 'F' && e.alive) { x.save(); x.translate(ex + 13, e.y + 11); if (CFG.hero === 'impuls') { x.fillStyle = '#b44fe0'; x.beginPath(); const m = .3 + .3 * Math.abs(Math.sin(S.time * 8)); x.moveTo(0, 0); x.arc(0, 0, 12, (e.vx < 0 ? Math.PI : 0) + m, (e.vx < 0 ? Math.PI : 0) - m + 6.28); x.fill(); x.fillStyle = '#fff'; x.beginPath(); x.arc(0, -6, 2.5, 0, 7); x.fill(); } else { x.fillStyle = 'rgba(220,230,255,.95)'; x.beginPath(); x.arc(-7, 2, 8, 0, 7); x.arc(3, -2, 10, 0, 7); x.arc(10, 3, 7, 0, 7); x.fill(); x.strokeStyle = '#8899bb'; x.beginPath(); x.moveTo(-14, 10); x.lineTo(-22, 10); x.moveTo(-14, 4); x.lineTo(-24, 4); x.stroke(); x.fillStyle = '#334'; x.fillRect(-2, -3, 2, 2); x.fillRect(5, -3, 2, 2); } x.restore(); }
        if (e.k === 'D' && e.alive) { const sh = e.state === 1 ? Math.sin(S.time * 60) * 2 : 0; x.save(); x.translate(ex + 14 + sh, e.y + 14); if (CFG.hero === 'impuls') { x.fillStyle = '#f2f6ff'; x.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28; x.lineTo(Math.cos(a) * 14, Math.sin(a) * 14); } x.fill(); x.strokeStyle = '#99a'; x.stroke(); } else { x.fillStyle = '#8a8070'; x.beginPath(); x.moveTo(-13, -8); x.lineTo(-4, -14); x.lineTo(12, -9); x.lineTo(14, 7); x.lineTo(2, 14); x.lineTo(-12, 9); x.fill(); x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(-4, -2, 8, 3); } x.restore(); if (e.state === 0) { x.strokeStyle = 'rgba(255,255,255,.35)'; x.setLineDash([3, 4]); x.beginPath(); x.moveTo(ex + 14, e.y + 28); x.lineTo(ex + 14, 352); x.stroke(); x.setLineDash([]); } }
        if (e.k === 'R' && e.alive) { const b = Math.sin(e.t * 3) * 3; x.save(); x.translate(ex + 10, e.y + 10 + b); x.fillStyle = 'rgba(125,221,255,.35)'; x.beginPath(); x.arc(0, 0, 15, 0, 7); x.fill(); x.font = '18px "Segoe UI Emoji","Noto Color Emoji",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(CFG.hero === 'impuls' ? '🧬' : '📜', 0, 1); x.restore(); }
      }
      function draw() {
        drawBg(); const c0 = Math.floor(S.cam / TS), off = S.cam % TS;
        for (let ty = 0; ty < VH; ty++) for (let tx = c0 - 1; tx <= c0 + VW + 1; tx++) { const c = tile(tx, ty); if (c !== '.') { let py = ty * TS; const pp = S.pops.find(q2 => q2.x === tx * TS && q2.y === ty * TS); if (pp) py -= Math.sin(pp.t / .25 * Math.PI) * 8; drawTile(c, tx * TS - S.cam, py, tx, ty); } }
        S.ents.forEach(drawEnt);
        S.balls.forEach(b => { x.strokeStyle = 'rgba(255,90,90,.5)'; x.setLineDash([4, 4]); x.beginPath(); b.trail.forEach((q2, i) => i ? x.lineTo(q2[0] - S.cam, q2[1]) : x.moveTo(q2[0] - S.cam, q2[1])); x.stroke(); x.setLineDash([]); x.fillStyle = CFG.hero === 'impuls' ? '#b44fe0' : '#222'; x.beginPath(); x.arc(b.x - S.cam, b.y, 7, 0, 7); x.fill(); });
        S.shots.forEach(s => { x.strokeStyle = 'rgba(255,211,77,.6)'; x.beginPath(); s.trail.forEach((q2, i) => i ? x.lineTo(q2[0] - S.cam, q2[1]) : x.moveTo(q2[0] - S.cam, q2[1])); x.stroke(); x.fillStyle = CFG.hero === 'impuls' ? '#ffd34d' : '#ff8a2a'; x.beginPath(); x.arc(s.x - S.cam, s.y, 6, 0, 7); x.fill(); });
        drawHero(S.p);
        S.parts.forEach(q2 => { x.globalAlpha = clamp(q2.l * 2, 0, 1); x.fillStyle = q2.c; x.fillRect(q2.x - S.cam - 2, q2.y - 2, 4, 4); }); x.globalAlpha = 1;
        if (S.mt > 0 && S.msg) { x.globalAlpha = clamp(S.mt, 0, 1); x.font = '700 14px Nunito, sans-serif'; const lines = []; let cur = ''; S.msg.split(' ').forEach(w => { if (x.measureText(cur + w).width > 640) { lines.push(cur); cur = ''; } cur += w + ' '; }); lines.push(cur); rr(40, 14, W - 80, 18 + lines.length * 18, 10); x.fillStyle = 'rgba(0,0,0,.65)'; x.fill(); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'top'; lines.forEach((l, i) => x.fillText(l, W / 2, 22 + i * 18)); x.globalAlpha = 1; }
        const prog = clamp(S.p.x / (map[0].length * TS), 0, 1); x.fillStyle = 'rgba(0,0,0,.3)'; x.fillRect(W - 170, H - 18, 150, 6); x.fillStyle = '#ffd34d'; x.fillRect(W - 170, H - 18, 150 * prog, 6);
      }
      let last = performance.now();
      function loop(t) { const dt = Math.min(.033, (t - last) / 1000); last = t; if (!paused && S) { const n = 2; for (let i = 0; i < n && !paused; i++) update(dt / n); } if (S) draw(); raf = requestAnimationFrame(loop); }
      on(window, 'keydown', e => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', ' ', 'ArrowDown'].includes(e.key) && !paused) e.preventDefault(); keys[e.key] = true; });
      on(window, 'keyup', e => { keys[e.key] = false; });
      const pad = wrap.querySelector('.pf-pad'), ptr = new Map();
      const padSync = () => { ['L', 'R', 'J', 'Xb'].forEach(k => keys[k] = false); pad.querySelectorAll('.pf-b').forEach(b => b.classList.remove('on')); ptr.forEach(btn => { if (!btn) return; const k = btn.dataset.k === 'X' ? 'Xb' : btn.dataset.k; keys[k] = true; btn.classList.add('on'); }); };
      const padAt = e => { const t = document.elementFromPoint(e.clientX, e.clientY); return t && t.closest ? t.closest('.pf-b') : null; };
      on(pad, 'pointerdown', e => { e.preventDefault(); try { pad.setPointerCapture(e.pointerId); } catch (er) { } ptr.set(e.pointerId, padAt(e)); padSync(); });
      on(pad, 'pointermove', e => { if (!ptr.has(e.pointerId)) return; e.preventDefault(); const b = padAt(e); if (b !== ptr.get(e.pointerId)) { ptr.set(e.pointerId, b); padSync(); } });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => on(pad, t, e => { ptr.delete(e.pointerId); padSync(); }));
      on(wrap, 'contextmenu', e => e.preventDefault()); on(pad, 'touchstart', e => e.preventDefault()); on(pad, 'selectstart', e => e.preventDefault());
      newRun(); raf = requestAnimationFrame(loop);
      return () => { cancelAnimationFrame(raf); offs.forEach(f => f()); paused = true; };
    };
  }

  /* ---------- kayıt (oyun listesinin en başına) ---------- */
  const putFirst = (target, id, val) => { const old = Object.assign({}, target); Object.keys(target).forEach(k => delete target[k]); target[id] = val; Object.keys(old).forEach(k => { if (k !== id) target[k] = old[k]; }); };
  if (typeof GAMES !== 'undefined' && typeof GAME_FN !== 'undefined') { putFirst(GAMES, 'mario_bio', { title: 'Süper İmpuls (platform oyunu)', ico: '🍄', desc: '3 bölüm: duyu organlarından aksona, aksondan sinapsa koş! Soruları bil, güçlen.' }); GAME_FN.mario_bio = makeGame(BIO); }
  if (typeof FGAMES !== 'undefined') putFirst(FGAMES, 'mario_fiz', { title: 'Süper Atış Kaşifi (platform oyunu)', ico: '🍄', desc: '3 bölüm: serbest düşme, yatay atış, eğik atış. Zıplaman gerçek bir düşey atış!', fn: makeGame(PHY) });
  window.PF_TEST = { BIO, PHY, makeGame };
})();
