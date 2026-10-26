/* Nasse Fizik — oyunlar */
const FGAMES = {
  hedef: { title: 'Top Atışı: Hedefi Vur', ico: '🎯', desc: '5 seviye, doğru hız ve açıyı bul, engelleri aş.', fn: gameHedef },
  bilesen: { title: 'Bileşen Ustası', ico: '📏', desc: 'Hızı vₓ ve v_y bileşenlerine ayır.', fn: gameBilesen },
  tur: { title: 'Hangi Atış?', ico: '🔎', desc: 'Stroboskop görüntüsünden atış türünü tanı.', fn: gameTur },
  formul: { title: 'Formül Eşleştirme', ico: '🧩', desc: 'Nicelikleri doğru formüllerle eşleştir.', fn: gameFormul }
};

/* ---- 1. HEDEF ---- */
function gameHedef(box) {
  const LV = [
    { tx: 40, tw: 6, g: 10, y: 0, hint: 'Menzil R = v₀² sin2θ / g. 45° ile deneyebilirsin.' },
    { tx: 70, tw: 6, g: 10, y: 0, hint: 'Aynı formül: 70 = v₀² sin2θ/10.' },
    { tx: 70, tw: 6, g: 10, y: 0, wall: { x: 30, h: 12 }, hint: 'Duvarın üstünden aşmak için daha dik bir açı gerekebilir.' },
    { tx: 55, tw: 8, g: 10, y: 10, hint: 'Hedef 10 m yüksekte bir platformda; top inerken platform seviyesinden geçmeli.' },
    { tx: 60, tw: 6, g: 3.7, y: 0, wall: { x: 35, h: 20 }, hint: 'Mars’ta g = 3,7 m/s²: aynı hız daha uzağa gider.' }
  ];
  let lv = 0, shots = 0, stars = 0, anim = null;
  const wrap = document.createElement('div'); wrap.className = 'game'; box.appendChild(wrap);
  wrap.innerHTML = `<div class="prog" id="hs"></div><canvas id="hc" style="width:100%;border-radius:16px;border:1px solid var(--line);display:block"></canvas>
  <div class="ctl"><label class="sl">Hız: <b id="hv">25</b> m/s<input type="range" id="hV" min="10" max="50" value="25"></label><label class="sl">Açı: <b id="ha">45</b>°<input type="range" id="hA" min="5" max="85" value="45"></label><button class="btn" id="hf">💥 Ateş!</button><button class="btn ghost" id="hh">💡 İpucu</button></div><div id="hm"></div>`;
  const cv = wrap.querySelector('#hc'), x = cv.getContext('2d'); const W = Math.min(720, box.clientWidth || 600), Hh = Math.round(W * .52), dpr = Math.min(devicePixelRatio || 1, 2); cv.width = W * dpr; cv.height = Hh * dpr; cv.style.height = Hh + 'px'; x.setTransform(dpr, 0, 0, dpr, 0, 0);
  const XM = 100, sc = (W - 40) / XM, wx = X => 20 + X * sc, wy = Y => Hh - 24 - Y * sc, $ = s => wrap.querySelector(s);
  let ball = null, trail = [];
  function draw() {
    const L = LV[lv]; x.clearRect(0, 0, W, Hh); const g = x.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, '#16407a'); g.addColorStop(1, '#0a2347'); x.fillStyle = g; x.fillRect(0, 0, W, Hh);
    x.fillStyle = '#2f7a4a'; x.fillRect(0, wy(0), W, Hh); x.strokeStyle = 'rgba(255,255,255,.08)'; x.fillStyle = 'rgba(255,255,255,.5)'; x.font = '10px Nunito'; for (let i = 0; i <= XM; i += 10) { x.beginPath(); x.moveTo(wx(i), 0); x.lineTo(wx(i), wy(0)); x.stroke(); x.fillText(i, wx(i) - 5, wy(0) + 12); }
    if (L.y) { x.fillStyle = '#8a6a3a'; x.fillRect(wx(L.tx - L.tw / 2 - 2), wy(L.y), (L.tw + 4) * sc, L.y * sc); }
    x.fillStyle = '#ff5a5a'; x.fillRect(wx(L.tx - L.tw / 2), wy(L.y) - 5, L.tw * sc, 5); x.font = '22px sans-serif'; x.fillText('🎯', wx(L.tx) - 11, wy(L.y) - 8);
    if (L.wall) { x.fillStyle = '#a0a8b8'; x.fillRect(wx(L.wall.x) - 4, wy(L.wall.h), 8, L.wall.h * sc); }
    x.font = '24px sans-serif'; x.fillText('🔫', wx(0) - 12, wy(0) - 2);
    const a = +$('#hA').value * Math.PI / 180; x.strokeStyle = 'rgba(255,211,77,.6)'; x.setLineDash([4, 4]); x.beginPath(); x.moveTo(wx(0), wy(0)); x.lineTo(wx(0) + Math.cos(a) * 50, wy(0) - Math.sin(a) * 50); x.stroke(); x.setLineDash([]);
    x.strokeStyle = '#ffd34d'; x.lineWidth = 2; x.beginPath(); trail.forEach((p, i) => i ? x.lineTo(wx(p[0]), wy(p[1])) : x.moveTo(wx(p[0]), wy(p[1]))); x.stroke(); x.lineWidth = 1;
    if (ball) { x.fillStyle = '#fff'; x.beginPath(); x.arc(wx(ball.x), wy(ball.y), 6, 0, 7); x.fill(); }
    $('#hs').textContent = `Seviye ${lv + 1}/${LV.length} · g = ${LV[lv].g} m/s² · atış: ${shots} · ⭐ ${stars}`;
  }
  function fire() {
    if (anim) return; const L = LV[lv], v = +$('#hV').value, a = +$('#hA').value * Math.PI / 180, vx = v * Math.cos(a), vy = v * Math.sin(a); shots++; trail = []; let t = 0, last = performance.now(), done = false;
    function step(now) {
      const dt = Math.min(.03, (now - last) / 1000) * 1.6; last = now; t += dt; const X = vx * t, Y = vy * t - .5 * L.g * t * t; ball = { x: X, y: Y }; trail.push([X, Y]);
      let res = null; const py = trail.length > 1 ? trail[trail.length - 2][1] : 0;
      if (L.wall && X >= L.wall.x && trail.length > 1 && trail[trail.length - 2][0] < L.wall.x && Y < L.wall.h) res = 'wall';
      else if (vy - L.g * t < 0 && py >= L.y && Y <= L.y) { res = Math.abs(X - L.tx) <= L.tw / 2 ? 'hit' : 'miss'; }
      else if (Y < 0 && t > .05) res = 'miss';
      draw(); if (res) { anim = null; ball = null; end(res, X); return; } anim = requestAnimationFrame(step);
    }
    anim = requestAnimationFrame(step);
  }
  function end(res, X) {
    const m = $('#hm'); draw();
    if (res === 'hit') { const st = shots <= 2 ? 3 : shots <= 4 ? 2 : 1; stars += st; m.innerHTML = `<div class="result good">🎉 İSABET! ${'⭐'.repeat(st)} <button class="btn" id="hn">${lv < LV.length - 1 ? 'Sonraki seviye →' : 'Bitir 🏁'}</button></div>`; $('#hn').onclick = () => { if (lv < LV.length - 1) { lv++; shots = 0; trail = []; m.innerHTML = ''; draw(); } else { award('g_hedef', 40, 'Hedef Vurma tamam!'); m.innerHTML = `<div class="result good">🏆 Tüm seviyeler bitti! Toplam ⭐ ${stars}</div>`; } }; }
    else m.innerHTML = `<div class="result warn">${res === 'wall' ? '🧱 Duvara çarptı!' : '❌ Iskaladın (' + (X).toFixed(1).replace('.', ',') + ' m).'} Hedef ${LV[lv].tx} m. Tekrar dene!</div>`;
  }
  $('#hV').oninput = e => { $('#hv').textContent = e.target.value; draw(); }; $('#hA').oninput = e => { $('#ha').textContent = e.target.value; draw(); };
  $('#hf').onclick = fire; $('#hh').onclick = () => { $('#hm').innerHTML = `<div class="result good">💡 ${LV[lv].hint}</div>`; };
  draw(); return () => { if (anim) cancelAnimationFrame(anim); };
}

/* ---- 2. BİLEŞEN USTASI ---- */
function gameBilesen(box) {
  const TR = { 30: [.5, .866], 37: [.6, .8], 45: [.707, .707], 53: [.8, .6], 60: [.866, .5] };
  const rounds = []; for (let i = 0; i < 6; i++) { const th = shuffle([30, 37, 45, 53, 60])[0], v = shuffle([10, 20, 25, 30, 40, 50])[0]; rounds.push({ th, v }); }
  let i = 0, score = 0; const wrap = document.createElement('div'); wrap.className = 'game'; box.appendChild(wrap);
  function show() {
    if (i >= rounds.length) { wrap.innerHTML = `<div class="result ${score >= 5 ? 'good' : 'warn'}">Oyun bitti: <b>${score}/${rounds.length}</b> ${score >= 5 ? '🎉' : '— tekrar dene'}</div>`; if (score >= 5) award('g_bilesen', 30, 'Bileşen Ustası!'); return; }
    const r = rounds[i], [s, c] = TR[r.th];
    wrap.innerHTML = `<div class="prog">Tur ${i + 1}/${rounds.length} · Skor ${score}</div><div class="stmt">v₀ = ${r.v} m/s, θ = ${r.th}°<br><small>sin${r.th}° = ${String(s).replace('.', ',')} · cos${r.th}° = ${String(c).replace('.', ',')}</small></div>
    <label class="fld">v₀ₓ (m/s)<input type="text" id="bx" inputmode="decimal" autocomplete="off"></label><label class="fld">v₀y (m/s)<input type="text" id="by" inputmode="decimal" autocomplete="off"></label><button class="btn" id="bk">Kontrol et</button><div class="fb"></div>`;
    wrap.querySelector('#bk').onclick = () => { const a = NUM(wrap.querySelector('#bx').value), b = NUM(wrap.querySelector('#by').value), ox = r.v * c, oy = r.v * s, ok = Math.abs(a - ox) <= .4 && Math.abs(b - oy) <= .4; if (ok) score++; wrap.querySelector('.fb').innerHTML = `<div class="result ${ok ? 'good' : 'warn'}">${ok ? '✅ Doğru!' : '❌ Doğrusu:'} v₀ₓ = v₀cosθ = ${(ox).toFixed(1).replace('.', ',')} m/s · v₀y = v₀sinθ = ${(oy).toFixed(1).replace('.', ',')} m/s <button class="btn" id="bn">Sonraki →</button></div>`; wrap.querySelector('#bn').onclick = () => { i++; show(); }; };
  }
  show();
}

/* ---- 3. HANGİ ATIŞ? ---- */
function gameTur(box) {
  const TYPES = [['serbest', 'Serbest düşme'], ['dusey', 'Dik yukarı atış'], ['yatay', 'Yatay atış'], ['egik', 'Eğik atış (yerden)'], ['asagi', 'Yüksekten aşağı eğik atış'], ['yukari', 'Yüksekten yukarı eğik atış']];
  const rounds = shuffle(TYPES.concat(TYPES)).slice(0, 8); let i = 0, score = 0; const wrap = document.createElement('div'); wrap.className = 'game'; box.appendChild(wrap);
  function pts(type) {
    const g = 10, out = [], P = { serbest: [0, 40, 0, 0], dusey: [0, 0, 0, 20], yatay: [0, 40, 12, 0], egik: [0, 0, 12, 16], asagi: [0, 40, 12, -10], yukari: [0, 30, 10, 12] }[type];
    const [x0, y0, vx, vy] = P; let T = 0; if (y0 === 0 && vy === 0) T = 0; for (let t = 0; t < 12; t += .01) { if (y0 + vy * t - 5 * t * t < 0 && t > .02) { T = t; break; } } if (!T) T = Math.sqrt(2 * y0 / g);
    const n = 10, arr = []; for (let k = 0; k <= n; k++) { const t = T * k / n; arr.push([x0 + vx * t + (type === 'dusey' ? (t > T / 2 ? 6 : -6) : 0), y0 + vy * t - 5 * t * t]); } return arr;
  }
  function show() {
    if (i >= rounds.length) { wrap.innerHTML = `<div class="result ${score >= 6 ? 'good' : 'warn'}">Oyun bitti: <b>${score}/${rounds.length}</b> ${score >= 6 ? '🎉' : '— tekrar dene'}</div>`; if (score >= 6) award('g_tur', 30, 'Atış dedektifi!'); return; }
    const r = rounds[i]; wrap.innerHTML = `<div class="prog">Tur ${i + 1}/${rounds.length} · Skor ${score}</div><p>Eşit zaman aralıklarıyla çekilen stroboskop görüntüsü hangi atışa aittir?</p><canvas id="tc" style="width:100%;max-width:560px;border-radius:16px;border:1px solid var(--line);display:block"></canvas><div class="opts" id="to"></div><div class="fb"></div>`;
    const cv = wrap.querySelector('#tc'), W = Math.min(560, box.clientWidth || 500), H = Math.round(W * .55), dpr = Math.min(devicePixelRatio || 1, 2); cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px'; const x = cv.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const p = pts(r[0]), mx = Math.max(20, ...p.map(a => a[0])) + 4, my = Math.max(20, ...p.map(a => a[1])) + 4, sc = Math.min((W - 40) / mx, (H - 40) / my); const wx = X => 24 + X * sc, wy = Y => H - 24 - Y * sc;
    x.fillStyle = '#0d315c'; x.fillRect(0, 0, W, H); x.fillStyle = '#2f7a4a'; x.fillRect(0, wy(0), W, H); x.fillStyle = '#ffd34d'; p.forEach((a, k) => { x.globalAlpha = .4 + .6 * k / p.length; x.beginPath(); x.arc(wx(a[0]), wy(a[1]), 6, 0, 7); x.fill(); }); x.globalAlpha = 1; x.fillStyle = '#fff'; x.font = '12px Nunito'; if (r[0] === 'dusey') x.fillText('çıkış (sol) ve iniş (sağ) yan yana çizildi', 10, 16);
    const opts = shuffle(TYPES), box2 = wrap.querySelector('#to'); opts.forEach(o => { const b = document.createElement('button'); b.className = 'opt'; b.textContent = o[1]; b.onclick = () => { const ok = o[0] === r[0]; if (ok) score++; box2.querySelectorAll('button').forEach(z => z.disabled = true); b.classList.add(ok ? 'ok' : 'bad'); wrap.querySelector('.fb').innerHTML = `<div class="result ${ok ? 'good' : 'warn'}">${ok ? '✅ Doğru!' : '❌ Doğrusu: ' + r[1]} <button class="btn" id="tn">Sonraki →</button></div>`; wrap.querySelector('#tn').onclick = () => { i++; show(); }; }; box2.appendChild(b); });
  }
  show();
}

/* ---- 4. FORMÜL EŞLEŞTİRME ---- */
function gameFormul(box) {
  const ROWS = [['Serbest düşme süresi', 't = √(2h/g)'], ['Dik yukarı atışta maksimum yükseklik', 'H = v₀² / 2g'], ['Eğik atışta menzil (yerden)', 'R = v₀² sin2θ / g'], ['Yatay atışta menzil', 'R = vₓ·√(2h/g)'], ['Eğik atışta uçuş süresi (yerden)', 'T = 2v₀ sinθ / g'], ['Eğik düzlemde düzleme dik ivme bileşeni', 'g·cosα'], ['Eğik atışta tepe noktasında hız', 'v₀·cosθ'], ['Yüksekten atışta yere çarpma hızı', '√(v₀² + 2gh₀)']];
  const FOR = ROWS.map(r => r[1]), wrap = document.createElement('div'); wrap.className = 'game'; box.appendChild(wrap);
  const sel = id => `<select data-id="${id}"><option value="">Seç…</option>${shuffle(FOR).map(o => `<option>${o}</option>`).join('')}</select>`;
  wrap.innerHTML = `<table class="tbl"><tr><th>Nicelik</th><th>Formül</th></tr>${ROWS.map((r, i) => `<tr><td>${r[0]}</td><td>${sel(i)}</td></tr>`).join('')}</table><button class="btn" id="fk">Kontrol et</button><div class="fb"></div>`;
  wrap.querySelector('#fk').onclick = () => { let ok = 0; wrap.querySelectorAll('select').forEach((s, i) => { const g = s.value === ROWS[i][1]; s.className = g ? 'ok' : 'bad'; if (g) ok++; }); wrap.querySelector('.fb').innerHTML = `<div class="result ${ok === ROWS.length ? 'good' : 'warn'}">${ok}/${ROWS.length} doğru ${ok === ROWS.length ? '🎉' : ''}</div>`; if (ok === ROWS.length) award('g_formul', 30, 'Formül ustası!'); };
}
