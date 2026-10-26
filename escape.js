/* Nasse — Biyo-Fizik Kaçış Odası */
(function () {
  const G = document.getElementById('game'), $ = (s, e) => (e || document).querySelector(s), $$ = (s, e) => [...(e || document).querySelectorAll(s)];
  const el = (html, cls) => { const d = document.createElement('div'); if (cls) d.className = cls; d.innerHTML = html; return d; };
  const TOTAL = 25 * 60, HINTS = 3, CODE = '47291';
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
  const norm = s => String(s).toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c').trim();
  const num = s => parseFloat(String(s).replace(',', '.').replace(/[^0-9.\-]/g, ''));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };
  let mute = false, ac = null;
  function beep(f, d, type) { if (mute) return; try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), g = ac.createGain(); o.type = type || 'sine'; o.frequency.value = f; g.gain.value = .06; o.connect(g); g.connect(ac.destination); o.start(); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + d); o.stop(ac.currentTime + d); } catch (e) { } }
  const ok = () => { beep(660, .12); setTimeout(() => beep(880, .18), 110); }, bad = () => beep(150, .3, 'sawtooth');
  function confetti() { for (let i = 0; i < 60; i++) { const c = document.createElement('i'); c.className = 'cf'; c.style.left = Math.random() * 100 + 'vw'; c.style.background = ['#ffd34d', '#ff6bd6', '#22d3ee', '#2ecc71', '#fff'][i % 5]; c.style.animationDelay = Math.random() * .8 + 's'; document.body.appendChild(c); setTimeout(() => c.remove(), 3000); } }
  const cleanups = [];

  /* ---------- Durum ---------- */
  let st = null, timerId = null;
  const fmtT = s => { s = Math.max(0, Math.floor(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
  const left = () => TOTAL - Math.floor((Date.now() - st.t0) / 1000) - st.pen;
  function hud() { $('#eTimer').textContent = '⏱ ' + fmtT(left()); $('#eTimer').style.color = left() < 180 ? '#ff6b6b' : ''; $('#eHints').textContent = '💡 ' + (HINTS - st.hints); $('#eCode').textContent = '🔑 ' + [0, 1, 2, 3, 4].map(i => st.digits[i] || '_').join(' '); }
  $('#eMute').onclick = () => { mute = !mute; $('#eMute').textContent = mute ? '🔇' : '🔊'; };

  /* ---------- Başlangıç ---------- */
  function start() {
    cleanup(); $('#eHud').style.display = 'none'; const best = store.get('escape_best', null);
    G.innerHTML = ''; G.appendChild(el(`<div class="es-wrap es-start"><div style="font-size:3rem">🧬🔐⚛️</div><h1><b>Biyo-Fizik</b> Kaçış Odası</h1>
      <div class="es-story"><p>🕒 Gece yarısı… Nasse Laboratuvarı’nda çalışırken tüm kapılar kilitlendi! Bilgisayar sadece bir şey söylüyor:</p>
      <p><i>“Çıkış kodu 5 haneli. Her odanın bekçisi bir hane saklıyor. Biyoloji ve fizik bilgini kanıtla!”</i></p>
      <p>🚪 <b>5 oda</b> + <b>çıkış kapısı</b> · ⏱ <b>25 dakika</b> · 💡 <b>3 ipucu</b> (her ipucu 60 sn götürür)<br>🔎 Parlayan eşyalara tıkla, ipuçlarını not defterinde topla, bulmacayı çöz, kodun hanesini al!</p>
      <p>📚 Konular: <b>fizik</b> (atışlar) · <b>biyoloji</b> (göz, refleks, reseptörler) · <b>karışık</b> bulmacalar (yunus yankısı, denge organı…)</p></div>
      ${best ? `<p>🏆 En iyi derecen: <b>${fmtT(best)}</b> kalan süre</p>` : ''}<button class="btn big" id="go">🚪 Odaya gir</button></div>`)); $('#go').onclick = begin;
  }
  function begin() { st = { t0: Date.now(), pen: 0, hints: 0, room: 0, digits: [], notes: [], used: {} }; $('#eHud').style.display = ''; clearInterval(timerId); timerId = setInterval(tick, 500); beep(300, .2); showRoom(); }
  function tick() { if (!st) return; hud(); if (left() <= 0) { clearInterval(timerId); lose(); } }
  function cleanup() { while (cleanups.length) { try { cleanups.pop()(); } catch (e) { } } }

  /* ---------- Oda iskeleti ---------- */
  function showRoom() {
    cleanup(); const R = ROOMS[st.room]; if (!R) return door(); hud();
    G.innerHTML = ''; const w = el('', 'es-wrap'); G.appendChild(w);
    w.appendChild(el(ROOMS.map((r, i) => `<span class="es-room ${i === st.room ? 'on' : i < st.room ? 'done' : ''}">${i < st.room ? '✅' : r.ico} ${r.name}</span>`).join('') + `<span class="es-room ${st.room >= ROOMS.length ? 'on' : ''}">🚪 Çıkış</span>`, 'es-prog'));
    const sc = el('', 'es-scene flick'); sc.style.background = R.bg; w.appendChild(sc);
    R.dec.forEach(d => { const s = document.createElement('span'); s.className = 'es-dec'; s.style.left = d[1] + '%'; s.style.top = d[2] + '%'; s.textContent = d[0]; sc.appendChild(s); });
    const say = el(R.intro, 'es-say'); w.appendChild(say);
    R.hot.forEach(hp => { const b = document.createElement('button'); b.className = 'es-hot' + (st.used[R.id + hp.id] ? ' seen' : ''); b.style.left = hp.x + '%'; b.style.top = hp.y + '%'; b.innerHTML = hp.ico + '<small>' + hp.label + '</small>'; b.onclick = () => { beep(520, .08); b.classList.add('seen'); if (hp.puzzle) { openPuzzle(); return; } say.innerHTML = hp.say; if (hp.note && !st.used[R.id + hp.id]) { st.notes.push(hp.note); } st.used[R.id + hp.id] = 1; renderBook(); }; sc.appendChild(b); });
    const box = el('', 'es-puz'); box.style.display = 'none'; w.appendChild(box);
    const hb = el('<button class="btn alt" id="hint">💡 İpucu al (−60 sn)</button>', 'btns'); w.appendChild(hb);
    const book = el('', 'es-book'); w.appendChild(book);
    function renderBook() { book.innerHTML = '<b>📓 Not defteri</b><ul>' + (st.notes.length ? st.notes.map(n => `<li>${n}</li>`).join('') : '<li><i>Henüz ipucu yok — parlayan eşyalara tıkla.</i></li>') + '</ul>'; }
    renderBook();
    $('#hint').onclick = () => { if (st.hints >= HINTS) { say.innerHTML = '💡 İpucu hakkın bitti!'; bad(); return; } const lvl = (st.used['h' + R.id] || 0); const t = R.hints[Math.min(lvl, R.hints.length - 1)]; st.used['h' + R.id] = lvl + 1; st.hints++; st.pen += 60; say.innerHTML = '💡 <b>İpucu:</b> ' + t; hud(); };
    function openPuzzle() { box.style.display = ''; box.innerHTML = ''; box.scrollIntoView({ behavior: 'smooth', block: 'center' }); R.puzzle(box, solved, wrong); }
    function wrong(msg) { bad(); st.pen += 5; hud(); box.classList.remove('es-shake'); void box.offsetWidth; box.classList.add('es-shake'); say.innerHTML = '❌ ' + (msg || 'Olmadı… (−5 sn)'); }
    function solved() { ok(); st.digits[st.room] = R.digit; st.notes.push(`🔑 ${R.name}: kod hanesi <b>${R.digit}</b>`); hud(); box.innerHTML = `<div class="result good"><h3>🔓 Kilit açıldı!</h3><p>${R.win}</p><p style="font-size:1.4rem">Kod hanesi: <b>${R.digit}</b> (${st.room + 1}. hane)</p><button class="btn" id="nx">${st.room < ROOMS.length - 1 ? 'Sonraki odaya geç →' : 'Çıkış kapısına git →'}</button></div>`; $('#nx').onclick = () => { st.room++; showRoom(); window.scrollTo(0, 0); }; }
  }

  /* ---------- Final kapısı ---------- */
  function door() {
    cleanup(); hud(); G.innerHTML = ''; const w = el('', 'es-wrap'); G.appendChild(w);
    w.appendChild(el(`<div class="es-end"><div style="font-size:4rem">🚪</div><h2>Çıkış Kapısı</h2><p>Tüm bekçilerin hanelerini sırayla gir: <b>${[0, 1, 2, 3, 4].map(i => st.digits[i]).join(' ')}</b></p>
      <p class="hint">İpucu: Haneler odaların sırasıyla dizilir. Not defterini kontrol et.</p><div class="es-code">${[0, 1, 2, 3, 4].map(i => `<input maxlength="1" inputmode="numeric" data-i="${i}">`).join('')}</div><button class="btn big" id="open">🔓 Kapıyı aç</button><div class="fb"></div></div>`));
    const ins = $$('.es-code input'); ins.forEach((inp, i) => inp.addEventListener('input', () => { if (inp.value && ins[i + 1]) ins[i + 1].focus(); }));
    $('#open').onclick = () => { const v = ins.map(i => i.value).join(''); if (v === CODE) win(); else { bad(); st.pen += 20; hud(); $('.es-code').classList.remove('es-shake'); void $('.es-code').offsetWidth; $('.es-code').classList.add('es-shake'); $('.fb', G).innerHTML = '<div class="warn result">🚨 Alarm! Yanlış kod (−20 sn). Haneleri odaların sırasıyla girmelisin.</div>'; } };
  }
  function win() {
    clearInterval(timerId); const rem = Math.max(0, left()), used = TOTAL - rem; const best = store.get('escape_best', null); const newBest = best === null || rem > best; if (newBest) store.set('escape_best', rem);
    const rank = rem > 720 ? '🧪 Efsane Bilim İnsanı' : rem > 360 ? '🔬 Usta Araştırmacı' : '🧫 Cesur Çaylak'; confetti(); [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, .25), i * 140));
    G.innerHTML = ''; G.appendChild(el(`<div class="es-wrap es-end"><div style="font-size:4rem">🎉🏃‍♀️💨</div><h2>KAÇTIN!</h2><p style="font-size:1.2rem">Laboratuvardan <b>${fmtT(used)}</b> sürede çıktın · kalan süre <b>${fmtT(rem)}</b> · kullanılan ipucu <b>${st.hints}</b></p><h3>${rank}</h3>${newBest ? '<p>🏆 Yeni rekor!</p>' : ''}
      <div class="btns" style="justify-content:center"><button class="btn big" id="again">🔁 Tekrar oyna</button><a class="btn alt" href="fizik.html">⚛️ Fizik çalış</a><a class="btn alt" href="biyoloji.html">🧬 Biyoloji çalış</a></div></div>`)); $('#again').onclick = start; $('#eHud').style.display = 'none';
  }
  function lose() { cleanup(); G.innerHTML = ''; G.appendChild(el(`<div class="es-wrap es-end"><div style="font-size:4rem">⏰💥</div><h2>Süre doldu!</h2><p>Laboratuvar alarmı çaldı. Bulduğun haneler: <b>${[0, 1, 2, 3, 4].map(i => st.digits[i] || '_').join(' ')}</b></p><button class="btn big" id="again">🔁 Tekrar dene</button></div>`)); $('#again').onclick = start; $('#eHud').style.display = 'none'; }

  /* ---------- Yardımcılar: bulmaca bileşenleri ---------- */
  function numForm(box, fields, onOk, onBad) {
    box.appendChild(el(fields.map((f, i) => `<label class="fld">${f.l}<input type="text" inputmode="decimal" data-i="${i}" autocomplete="off" placeholder="${f.u || ''}"></label>`).join('') + '<button class="btn" id="chk">🔓 Kilidi dene</button><div class="fb"></div>'));
    $('#chk', box).onclick = () => { let all = true; fields.forEach((f, i) => { const inp = $(`[data-i="${i}"]`, box), v = num(inp.value), g = isFinite(v) && Math.abs(v - f.a) <= (f.tol || .1); inp.className = g ? 'ok' : 'bad'; if (!g) all = false; }); if (all) onOk(); else onBad(); };
  }
  function cannon(box, cfg, onWin, onMiss) {
    box.appendChild(el(`<canvas style="width:100%;border-radius:14px;border:1px solid var(--line);display:block"></canvas><div class="ctl"><label class="sl">Hız: <b data-o="v">25</b> m/s<input type="range" data-i="v" min="10" max="50" value="25"></label><label class="sl">Açı: <b data-o="a">45</b>°<input type="range" data-i="a" min="5" max="85" value="45"></label><button class="btn" data-b="fire">💥 Ateş</button></div><div class="fb"></div>`));
    const cv = $('canvas', box), W = Math.min(720, box.clientWidth - 30 || 600), H = Math.round(W * .5), dpr = Math.min(devicePixelRatio || 1, 2); cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px'; const x = cv.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const XM = 80, sc = (W - 40) / XM, wx = X => 20 + X * sc, wy = Y => H - 22 - Y * sc; let trail = [], ball = null, anim = null;
    function draw() { x.clearRect(0, 0, W, H); x.fillStyle = '#10305a'; x.fillRect(0, 0, W, H); x.fillStyle = '#2f7a4a'; x.fillRect(0, wy(0), W, H); x.fillStyle = 'rgba(255,255,255,.5)'; x.font = '10px Nunito'; for (let i = 0; i <= XM; i += 10) x.fillText(i, wx(i) - 4, wy(0) + 12); x.fillStyle = '#ff5a5a'; x.fillRect(wx(cfg.tx - cfg.tw / 2), wy(0) - 5, cfg.tw * sc, 5); x.font = '22px sans-serif'; x.fillText('🎯', wx(cfg.tx) - 11, wy(0) - 8); x.fillStyle = '#b0b8c8'; x.fillRect(wx(cfg.wall.x) - 4, wy(cfg.wall.h), 8, cfg.wall.h * sc); x.font = '12px Nunito'; x.fillStyle = '#fff'; x.fillText('duvar ' + cfg.wall.h + ' m', wx(cfg.wall.x) - 24, wy(cfg.wall.h) - 6); x.font = '24px sans-serif'; x.fillText('🔫', wx(0) - 12, wy(0) - 2); x.strokeStyle = '#ffd34d'; x.lineWidth = 2; x.beginPath(); trail.forEach((p, i) => i ? x.lineTo(wx(p[0]), wy(p[1])) : x.moveTo(wx(p[0]), wy(p[1]))); x.stroke(); if (ball) { x.fillStyle = '#fff'; x.beginPath(); x.arc(wx(ball[0]), wy(ball[1]), 6, 0, 7); x.fill(); } }
    $$('input[type=range]', box).forEach(r => r.oninput = () => { $(`[data-o="${r.dataset.i}"]`, box).textContent = r.value; });
    $('[data-b=fire]', box).onclick = () => { if (anim) return; const v = +$('[data-i=v]', box).value, a = +$('[data-i=a]', box).value * Math.PI / 180, vx = v * Math.cos(a), vy = v * Math.sin(a); trail = []; let t = 0, last = performance.now(); function step(now) { const dt = Math.min(.03, (now - last) / 1000) * 1.5; last = now; t += dt; const X = vx * t, Y = vy * t - 5 * t * t; const px = trail.length ? trail[trail.length - 1][0] : 0; ball = [X, Y]; trail.push([X, Y]); let res = null; if (px < cfg.wall.x && X >= cfg.wall.x && Y < cfg.wall.h) res = 'wall'; else if (Y < 0 && t > .05) res = Math.abs(X - cfg.tx) <= cfg.tw / 2 ? 'hit' : 'miss'; draw(); if (res) { anim = null; ball = null; draw(); if (res === 'hit') onWin(); else $('.fb', box).innerHTML = `<div class="warn result">${res === 'wall' ? '🧱 Duvara çarptı!' : 'Iskaladın: ' + X.toFixed(1).replace('.', ',') + ' m'}</div>`, onMiss(); return; } anim = requestAnimationFrame(step); } anim = requestAnimationFrame(step); };
    cleanups.push(() => { if (anim) cancelAnimationFrame(anim); }); draw();
  }

  /* ---------- Göz şeması ---------- */
  const EYE = `<svg class="es-eye" viewBox="0 0 420 270"><rect width="420" height="270" fill="#0e2a4a" rx="14"/>
   <g data-n="sklera"><ellipse cx="210" cy="135" rx="150" ry="108" fill="#f3efe6" stroke="#9a8f7a" stroke-width="4"/></g>
   <g data-n="camsi sivi"><ellipse cx="225" cy="135" rx="105" ry="82" fill="#c8ecff" opacity=".85"/></g>
   <g data-n="retina"><path d="M215 28 A150 108 0 0 1 215 242" fill="none" stroke="#e86a6a" stroke-width="12"/></g>
   <g data-n="kornea"><path d="M62 90 Q40 135 62 180 Q80 135 62 90Z" fill="#bfe9ff" stroke="#5bb4e8" stroke-width="3"/></g>
   <g data-n="iris"><rect x="86" y="82" width="12" height="38" rx="4" fill="#6b4a2a"/><rect x="86" y="150" width="12" height="38" rx="4" fill="#6b4a2a"/></g>
   <g data-n="mercek"><ellipse cx="124" cy="135" rx="17" ry="34" fill="#ffe9a8" stroke="#d6a93a" stroke-width="3"/></g>
   <g data-n="sari benek"><circle cx="345" cy="135" r="9" fill="#ffd34d" stroke="#a37d00" stroke-width="2"/></g>
   <g data-n="optik sinir"><path d="M345 205 L400 240" stroke="#f5d86b" stroke-width="12" stroke-linecap="round"/></g>
   <g data-n="kor nokta"><circle cx="335" cy="188" r="9" fill="#2a2a2a" stroke="#999" stroke-width="2"/></g>
   <g pointer-events="none" fill="#fff" font-size="12" font-family="Nunito"><text x="14" y="30">👁️ Göz kesiti — parçalara tıkla</text></g></svg>`;

  /* ---------- ODALAR ---------- */
  const ROOMS = [
    { id: 'r1', name: 'Top Atış Odası', ico: '🎯', digit: 4, bg: 'linear-gradient(180deg,#1b2b55,#0a1330)',
      dec: [['🏀', 12, 70], ['⚽', 78, 72], ['🔭', 88, 18], ['🧱', 45, 55]],
      intro: '🧑‍🔬 <b>Dr. Elif:</b> Duvarın arkasındaki hedefi vur, ilk bekçiyi uyandır! Etrafı incele.',
      hot: [
        { id: 'a', ico: '🧮', label: 'Kara tahta', x: 18, y: 35, say: '🧮 Tahtada yazıyor: <b>R = v₀²·sin2θ / g</b>, g = 10 m/s². Aynı R için θ ve (90°−θ) atışları aynı yere düşer.', note: '🧮 R = v₀²·sin2θ/g (g = 10). θ ve 90°−θ aynı menzili verir.' },
        { id: 'b', ico: '📏', label: 'Cetvel', x: 50, y: 28, say: '📏 Not: “Hedef 60 m uzakta, duvar 25 m’de ve 15 m yüksekliğinde. Isı: duvarı aşmalısın!”', note: '📏 Hedef 60 m uzakta; duvar x = 25 m’de, yüksekliği 15 m.' },
        { id: 'c', ico: '📐', label: 'Açıölçer', x: 75, y: 40, say: '📐 Üzerinde yazıyor: sin37° = 0,6 · sin53° = 0,8 · sin74° = sin106° ≈ 0,96. “Menzil için v₀² sin2θ = 600 olmalı.”', note: '📐 sin37°=0,6; sin53°=0,8; sin2θ ≈ 0,96 (θ = 37° veya 53°) → v₀² ≈ 625.' },
        { id: 'p', ico: '🔫', label: 'Top (kilit)', x: 50, y: 78, puzzle: true }],
      hints: ['sin2θ ≈ 0,96 için θ = 37° veya 53° olabilir; v₀ ≈ 25 m/s. Hangisi duvarı aşar?', 'Dik açı (53°) daha yükseğe çıkar. v₀ = 25 m/s, θ = 53° dene.'],
      win: 'Top hedefi tam vurdu ve ilk bekçi uyandı!',
      puzzle: (box, solved, wrong) => { box.appendChild(el('<h3>🔫 Topu ayarla</h3><p>Hedefi (60 m) vur; ama duvarı (25 m’de, 15 m yüksek) aşmalısın.</p>')); cannon(box, { tx: 60, tw: 6, wall: { x: 25, h: 15 } }, solved, () => wrong('Yeniden ayarla (−5 sn)')); } },
    { id: 'r2', name: 'Göz Muayenehanesi', ico: '👁️', digit: 7, bg: 'linear-gradient(180deg,#0f3d3a,#071b24)',
      dec: [['🔬', 10, 30], ['💡', 88, 20], ['🧪', 85, 75], ['🪞', 15, 75]],
      intro: '🧑‍🔬 <b>Dr. Elif:</b> Burada bir oftalmolog çalışırdı. Gözün yapısını biliyorsan kapı açılır!',
      hot: [
        { id: 'a', ico: '📋', label: 'Görme tablosu', x: 20, y: 38, say: '📋 Çubuk ve koni tablosu: çubuk — az ışıkta etkin, renkli görme yok; <b>koni — aydınlıkta etkin, renkli görme, en net görme bölgesinde yoğun</b>.', note: '📋 Koni hücreleri en çok “sarı benek”te bulunur → en net görme.' },
        { id: 'b', ico: '🔎', label: 'Büyüteç', x: 52, y: 30, say: '🔎 Etiket: “Optik sinirin gözden çıktığı yerde fotoreseptör yoktur; buraya düşen ışık görülmez.”', note: '🔎 Optik sinirin çıktığı yerde fotoreseptör yok → kör nokta.' },
        { id: 'c', ico: '📖', label: 'Atlas', x: 80, y: 42, say: '📖 Atlas notu: “Damar tabakanın ön kısmında yer alan <b>iris</b>, göz bebeğinin çapını ayarlar ve göze giren ışık miktarını düzenler.”', note: '📖 İris = göz bebeğinin çapını ayarlar.' },
        { id: 'p', ico: '👁️', label: 'Göz maketi (kilit)', x: 50, y: 78, puzzle: true }],
      hints: ['Üç yapıyı sırayla bulmalısın: kör nokta → sarı benek → iris.', 'Retinada, sağ tarafta iki küçük daire var: koyu olan kör nokta, sarı olan sarı benek.'],
      win: 'Göz maketi parladı ve ikinci kilit açıldı!',
      puzzle: (box, solved, wrong) => { const Q = [['Fotoreseptörün hiç bulunmadığı bölge', 'kor nokta'], ['Koni hücrelerinin en yoğun olduğu, en net görme bölgesi', 'sari benek'], ['Göz bebeğinin çapını ayarlayan yapı', 'iris']]; let i = 0; box.appendChild(el(`<h3>👁️ Göz kesiti</h3><div id="eq" class="es-say"></div>${EYE}`)); const q = $('#eq', box); const show = () => q.innerHTML = `<b>${i + 1}/3:</b> ${Q[i][0]} — şemada tıkla.`; show(); $$('.es-eye g[data-n]', box).forEach(g => g.onclick = () => { if (g.dataset.n === Q[i][1]) { ok(); i++; if (i >= Q.length) { q.innerHTML = '✅ Hepsi doğru!'; solved(); } else show(); } else wrong('Yanlış yapı: ' + g.dataset.n + ' (−5 sn)'); }); } },
    { id: 'r3', name: 'Düşey Atış Asansörü', ico: '🛗', digit: 2, bg: 'linear-gradient(180deg,#3a2a12,#120b02)',
      dec: [['🛗', 12, 45], ['⬆️', 85, 30], ['⬇️', 85, 70], ['⚙️', 40, 18]],
      intro: '🧑‍🔬 <b>Dr. Elif:</b> Asansör kilitli! Kontrol panelinin 4 sorusunu çöz. Deney topu yardımcı olur.',
      hot: [
        { id: 'a', ico: '📜', label: 'Formül kâğıdı', x: 20, y: 30, say: '📜 Düşey atış: v = v₀ − g·t · y = v₀t − ½gt² · H = v₀²/2g · tepe noktasında v = 0 · çıkış süresi = v₀/g · g = 10 m/s².', note: '📜 H = v₀²/2g, t_çıkış = v₀/g, T = 2v₀/g, v = v₀ − g·t (g = 10).' },
        { id: 'b', ico: '🧪', label: 'Deney topu', x: 52, y: 35, say: '🧪 Panelin yanındaki deney topu v₀ = 30 m/s ile atılabiliyor! Aşağıda “Panel”i aç ve simülasyonu kullan.', note: '🧪 Panel sorularında v₀ = 30 m/s, g = 10 m/s². Simülasyonda “Ölçüm al”ı kullanabilirsin.' },
        { id: 'p', ico: '🔢', label: 'Kontrol paneli (kilit)', x: 50, y: 78, puzzle: true }],
      hints: ['Her sorunun cevabı basit: H = v₀²/2g, t = v₀/g, T = 2v₀/g.', '4. soru: t = 4 s’de v = 30 − 40 = −10 → büyüklüğü 10 m/s.'],
      win: 'Asansör kapıları açıldı!',
      puzzle: (box, solved, wrong) => { box.appendChild(el('<h3>🔢 Kontrol paneli</h3><p>Dik yukarı <b>v₀ = 30 m/s</b> ile fırlatılan top (g = 10 m/s², hava direnci yok, aynı seviyeye dönüş).</p>')); numForm(box, [{ l: '1) Çıkabileceği en büyük yükseklik (m)', a: 45, u: 'm' }, { l: '2) Tepe noktasına çıkış süresi (s)', a: 3, u: 's' }, { l: '3) Havada kalma süresi (s)', a: 6, u: 's' }, { l: '4) t = 4 s’de hızının büyüklüğü (m/s)', a: 10, u: 'm/s' }], solved, () => wrong()); const lw = el('<button class="btn ghost" id="lb">🧪 Deney topunu aç</button><div id="lab"></div>'); box.appendChild(lw); let lab = null; $('#lb', box).onclick = () => { if (lab) return; const cfg = SIMF.dusey.cfg(); cfg.controls[0].val = 30; lab = PHLab($('#lab', box), cfg); cleanups.push(() => lab && lab.destroy()); }; } },
    { id: 'r4', name: 'Refleks Koridoru', ico: '⚡', digit: 9, bg: 'linear-gradient(180deg,#3a0f3e,#10031a)',
      dec: [['🧠', 14, 30], ['🦵', 82, 70], ['🔨', 82, 28], ['⚡', 45, 15]],
      intro: '🧑‍🔬 <b>Dr. Elif:</b> Koridorun lazerleri refleks yolunu bilenlere izin verir. Reseptörleri ve refleks yayını kanıtla!',
      hot: [
        { id: 'a', ico: '🔨', label: 'Refleks çekici', x: 20, y: 38, say: '🔨 Diz kapağına vurulunca bacak sıçrar! Yol: uyaran → <b>reseptör</b> → <b>duyu nöronu</b> → <b>omurilik</b> → <b>motor nöron</b> → <b>kas</b> → tepki.', note: '🔨 Refleks yayı: Uyaran → Reseptör → Duyu nöronu → Omurilik (MSS) → Motor nöron → Kas (efektör) → Tepki.' },
        { id: 'b', ico: '📗', label: 'Reseptör kitabı', x: 55, y: 30, say: '📗 Işık → fotoreseptör · Ses/dokunma/basınç → mekanoreseptör · Koku/tat → kemoreseptör · Sıcaklık → termoreseptör · Doku hasarı → ağrı reseptörü.', note: '📗 Işık: foto · Ses/dokunma: mekano · Koku/tat: kemo · Sıcaklık: termo.' },
        { id: 'p', ico: '⚡', label: 'Lazer paneli (kilit)', x: 50, y: 78, puzzle: true }],
      hints: ['Önce omurilik sonra motor nöron, en sonda kas gelir.', 'Koku → kemoreseptör, ses titreşimi → mekanoreseptör.'],
      win: 'Lazerler söndü, koridor açıldı!',
      puzzle: (box, solved, wrong) => { const STEPS = ['Uyaran (iğne batması)', 'Duyu reseptörü', 'Duyu nöronu', 'Omurilik (MSS)', 'Motor nöron', 'Kas (efektör)', 'Tepki']; let seq = []; box.appendChild(el(`<h3>⚡ A) Refleks yayını sırala</h3><div class="es-seq" id="sq"></div><div class="es-chips" id="ch"></div><h3>⚡ B) Uyaran – reseptör eşleştir</h3><div id="mt"></div><button class="btn" id="chk2">🔓 Kilidi dene</button>`)); const render = () => { $('#sq', box).innerHTML = seq.map(s => `<span>${s}</span>`).join('') || '<i>Sırayla tıkla</i>'; }; shuffle(STEPS).forEach(s => { const b = document.createElement('button'); b.className = 'es-chip'; b.textContent = s; b.onclick = () => { b.classList.add('used'); seq.push(s); render(); }; $('#ch', box).appendChild(b); }); render(); const ret = $('#sq', box); const rs = el('<button class="btn ghost sm" id="rs">↺ Sırayı sıfırla</button>'); ret.after(rs); $('#rs', box).onclick = () => { seq = []; $$('.es-chip', box).forEach(c => c.classList.remove('used')); render(); }; const M = [['Işık', 'Fotoreseptör'], ['Ses titreşimi', 'Mekanoreseptör'], ['Koku molekülü', 'Kemoreseptör'], ['Sıcaklık değişimi', 'Termoreseptör']]; const opts = ['Fotoreseptör', 'Mekanoreseptör', 'Kemoreseptör', 'Termoreseptör']; $('#mt', box).innerHTML = M.map((m, i) => `<label class="fld">${m[0]} → <select data-m="${i}"><option value="">Seç…</option>${shuffle(opts).map(o => `<option>${o}</option>`).join('')}</select></label>`).join(''); $('#chk2', box).onclick = () => { const a = seq.join('|') === STEPS.join('|'); let b = true; M.forEach((m, i) => { const s = $(`[data-m="${i}"]`, box), g = s.value === m[1]; s.className = g ? 'ok' : 'bad'; if (!g) b = false; }); if (a && b) solved(); else wrong(!a ? 'Refleks sırası yanlış (−5 sn)' : 'Eşleştirme hatalı (−5 sn)'); }; } },
    { id: 'r5', name: 'Biyo-Fizik Köprüsü', ico: '🌉', digit: 1, bg: 'linear-gradient(180deg,#0d3350,#041220)',
      dec: [['🐬', 14, 62], ['🌊', 50, 82], ['👂', 86, 25], ['🍎', 70, 15]],
      intro: '🧑‍🔬 <b>Dr. Elif:</b> Son bekçi biyolojiyle fiziği birleştirmeni istiyor: bir yunus, bir elma ve iç kulağın sırrı!',
      hot: [
        { id: 'a', ico: '🐬', label: 'Yunus', x: 20, y: 40, say: '🐬 Yunus yankı konumlamasıyla yön bulur: gönderdiği ses cisme çarpıp döner. Mesafe = <b>ses hızı × geçen süre / 2</b>. Sudaki ses hızı ≈ 1500 m/s.', note: '🐬 Yankı: d = v·t/2 (gidiş-dönüş). Suda v ≈ 1500 m/s.' },
        { id: 'b', ico: '🍎', label: 'Elma', x: 58, y: 25, say: '🍎 Newton’un elması! Serbest düşme: t = √(2h/g), v = g·t (g = 10 m/s²).', note: '🍎 Serbest düşme: t = √(2h/g), v = g·t.' },
        { id: 'c', ico: '👂', label: 'Kulak maketi', x: 82, y: 45, say: '👂 Maket: <b>yarım daire kanalları</b> dönmeyi, <b>tulumcuk ve kesecik</b> yer çekimi ile doğrusal ivmelenmeyi algılar; <b>Korti organı</b> işitmeyi sağlar.', note: '👂 Yarım daire kanalları: dönme · Tulumcuk-kesecik: yer çekimi/doğrusal ivme · Korti: işitme.' },
        { id: 'p', ico: '🔐', label: 'Kasa (kilit)', x: 50, y: 80, puzzle: true }],
      hints: ['Yunus: d = 1500·0,4/2. Elma: t = √(2·80/10) = 4 s.', 'Asansörde yukarı hızlanınca “ağırlaşma”yı doğrusal ivmelenmeyi algılayan tulumcuk ve kesecik sağlar.'],
      win: 'Kasa açıldı! Son kod hanesi sende.',
      puzzle: (box, solved, wrong) => { box.appendChild(el('<h3>🔐 Kasa</h3><p>🐬 Bir yunus ses gönderiyor, <b>0,4 s</b> sonra yankıyı alıyor (sudaki ses hızı 1500 m/s).<br>🍎 80 m yükseklikteki bir daldan elma serbest düşüyor (g = 10 m/s²).</p>')); numForm(box, [{ l: '1) Yunusun cisme uzaklığı (m)', a: 300, tol: 1, u: 'm' }, { l: '2) Elmanın düşme süresi (s)', a: 4, u: 's' }, { l: '3) Yere çarpma hızı (m/s)', a: 40, tol: .5, u: 'm/s' }], () => { const mc = el(`<h3>4) Serbest düşen asansörde hızlanmayı (doğrusal ivmelenme) algılayan iç kulak yapıları?</h3><div class="es-chips">${['Korti organı', 'Yarım daire kanalları', 'Tulumcuk ve kesecik', 'Östaki borusu'].map(o => `<button class="es-chip">${o}</button>`).join('')}</div>`); box.appendChild(mc); $$('.es-chip', mc).forEach(b => b.onclick = () => { if (b.textContent === 'Tulumcuk ve kesecik') { solved(); } else wrong('Yanlış yapı (−5 sn)'); }); }, () => wrong('Sayısal cevaplardan biri yanlış (−5 sn)')); } }
  ];

  start();
})();
