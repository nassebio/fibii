/* Nasse Arcade — biyoloji ve fizik için gerçek oyun tadında mini oyunlar */
(function () {
  const LW = 720, LH = 432;
  const rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.floor(Math.random() * a.length)], clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const f1 = n => (Math.round(n * 10) / 10).toString().replace('.', ',');
  let ac = null, mute = false;
  function snd(f, d, t) { if (mute) return; try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), g = ac.createGain(); o.type = t || 'sine'; o.frequency.value = f; g.gain.value = .05; o.connect(g); g.connect(ac.destination); o.start(); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + d); o.stop(ac.currentTime + d); } catch (e) { } }
  const S = { ok() { snd(660, .08); setTimeout(() => snd(990, .1), 70); }, bad() { snd(140, .25, 'sawtooth'); }, pop() { snd(420, .06, 'square'); }, jump() { snd(320, .1, 'triangle'); }, boom() { snd(90, .3, 'sawtooth'); }, win() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => snd(f, .2), i * 120)); } };
  function rr(x, px, py, w, h, r) { x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r); x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath(); }
  function txt(x, s, px, py, size, col, bold) { x.font = (bold ? '700 ' : '') + size + 'px Nunito, sans-serif'; x.fillStyle = col || '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(s, px, py); }
  function emo(x, s, px, py, size) { x.font = size + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff'; x.fillText(s, px, py); }

  /* ---------- Ortak oyun iskeleti ---------- */
  function shell(box, id, o) {
    const w = document.createElement('div'); w.className = 'arc';
    w.innerHTML = '<div class="arc-bar"><b class="a-s">Skor 0</b><span class="a-m"></span><span class="a-l"></span><button class="arc-mute" title="Ses">🔊</button></div><div class="arc-stage"><canvas></canvas><div class="arc-ov"></div></div><div class="arc-help">' + o.help + '</div>';
    box.appendChild(w);
    const cv = w.querySelector('canvas'), ov = w.querySelector('.arc-ov'), x = cv.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = LW * dpr; cv.height = LH * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const A = { x, cv, id, raf: 0, offs: [], active: false, parts: [], shake: 0, keys: {}, mx: null, onKey: null };
    try { A.best = +localStorage.getItem('arc_' + id) || 0; } catch (e) { A.best = 0; }
    const q = s => w.querySelector(s);
    w.querySelector('.arc-mute').onclick = e => { mute = !mute; e.target.textContent = mute ? '🔇' : '🔊'; };
    A.on = (t, fn, el) => { (el || window).addEventListener(t, fn, { passive: false }); A.offs.push(() => (el || window).removeEventListener(t, fn)); };
    A.pt = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * LW, y: (e.clientY - r.top) / r.height * LH }; };
    A.hud = (score, lives, mid) => { q('.a-s').textContent = 'Skor ' + score; q('.a-m').textContent = mid == null ? '🏆 ' + A.best : mid; q('.a-l').textContent = lives == null ? '' : '❤️'.repeat(Math.max(0, lives)) + '🖤'.repeat(Math.max(0, (o.lives || 3) - lives)); };
    A.overlay = (html, btn, cb) => { ov.innerHTML = html + '<button class="btn big">' + btn + '</button>'; ov.style.display = 'flex'; ov.querySelector('button').onclick = () => { ov.style.display = 'none'; cb(); }; };
    A.run = upd => { A.stop(); let last = performance.now(); const f = t => { const dt = Math.min(.033, (t - last) / 1000); last = t; upd(dt); A.raf = requestAnimationFrame(f); }; A.raf = requestAnimationFrame(f); };
    A.stop = () => cancelAnimationFrame(A.raf);
    A.burst = (px, py, col, n) => { for (let i = 0; i < (n || 14); i++) { const a = Math.random() * 6.283, v = rnd(60, 220); A.parts.push({ x: px, y: py, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, l: rnd(.4, .8), c: col || '#ffd34d' }); } };
    A.drawParts = dt => { A.parts = A.parts.filter(p => p.l > 0); for (const p of A.parts) { p.l -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 400 * dt; x.globalAlpha = clamp(p.l * 2, 0, 1); x.fillStyle = p.c; x.fillRect(p.x - 3, p.y - 3, 6, 6); } x.globalAlpha = 1; };
    A.begin = () => { x.save(); if (A.shake > 0) { x.translate(rnd(-A.shake, A.shake), rnd(-A.shake, A.shake)); A.shake = Math.max(0, A.shake - .8); } };
    A.end = () => x.restore();
    A.intro = (ico, title, desc, start) => { A.active = false; A.hud(0, o.lives === 0 ? null : (o.lives || 3)); A.overlay('<div style="font-size:3.2rem">' + ico + '</div><h2>' + title + '</h2><p>' + desc + '</p><p class="arc-best">🏆 Rekor: ' + A.best + '</p>', '▶ Başla', () => { A.active = true; start(); }); };
    A.finish = (score, thr, msg, restart) => {
      A.stop(); A.active = false; const nb = score > A.best; if (nb) { A.best = score; try { localStorage.setItem('arc_' + id, score); } catch (e) { } }
      const won = score >= thr; if (won && typeof award === 'function') award('g_' + id, 30, msg); won ? S.win() : S.bad();
      A.overlay('<div style="font-size:3rem">' + (won ? '🎉' : '💥') + '</div><h2>' + (won ? 'Harika!' : 'Oyun bitti') + '</h2><p>Skor: <b>' + score + '</b>' + (nb ? ' · 🏆 <b>Yeni rekor!</b>' : ' · rekor ' + A.best) + '</p><p class="arc-best">' + (won ? '⭐ ' + msg : 'Hedef: en az ' + thr + ' puan — tekrar dene!') + '</p>', '🔁 Tekrar oyna', () => { A.active = true; restart(); });
    };
    A.on('keydown', e => { if (!A.active) return; if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault(); if (e.repeat) { A.keys[e.key] = true; return; } A.keys[e.key] = true; if (A.onKey) A.onKey(e.key, true); });
    A.on('keyup', e => { A.keys[e.key] = false; if (A.active && A.onKey) A.onKey(e.key, false); });
    A.destroy = () => { A.stop(); A.active = false; A.offs.forEach(f => f()); };
    return A;
  }

  /* ================= BİYOLOJİ 1: UYARAN YAĞMURU ================= */
  function gUyaran(box) {
    const A = shell(box, 'uyaran', { help: '🖱️ Fare / parmakla sürükle ya da ← → tuşları. Hedef reseptörün uyaranlarını yakala; yanlış uyaran 1 can götürür.' }), x = A.x;
    const T = {
      foto: { n: 'Fotoreseptör', d: 'ışığı algılar (gözde retina)', c: '#ffd34d', it: ['💡', '☀️', '🔦', '🌈'] },
      mekano: { n: 'Mekanoreseptör', d: 'ses, dokunma ve basıncı algılar', c: '#22d3ee', it: ['🔊', '👆', '⬇️', '🎵'] },
      kemo: { n: 'Kemoreseptör', d: 'koku ve tat gibi kimyasalları algılar', c: '#2ecc71', it: ['🌸', '🍋', '🍓', '🧄'] },
      termo: { n: 'Termoreseptör', d: 'sıcaklık değişimini algılar', c: '#ff6b6b', it: ['🌡️', '🔥', '❄️', '🧊'] }
    }, keys = Object.keys(T), BY = LH - 46; let s;
    function start() { s = { score: 0, lives: 3, px: LW / 2, target: pick(keys), items: [], spawn: .3, caught: 0, combo: 0, msg: T[keys[0]].d, mt: 0 }; s.msg = ''; A.parts.length = 0; A.mx = null; A.run(frame); }
    A.on('pointermove', e => { if (A.active) A.mx = A.pt(e).x; }, A.cv); A.on('pointerdown', e => { if (A.active) A.mx = A.pt(e).x; }, A.cv); A.cv.style.touchAction = 'none';
    function frame(dt) {
      if (A.keys.ArrowLeft) { s.px -= 480 * dt; A.mx = null; } if (A.keys.ArrowRight) { s.px += 480 * dt; A.mx = null; }
      if (A.mx != null) s.px += (A.mx - s.px) * Math.min(1, dt * 14); s.px = clamp(s.px, 55, LW - 55);
      s.spawn -= dt; if (s.spawn <= 0) { s.spawn = Math.max(.36, .95 - s.score / 450); const k = Math.random() < .5 ? s.target : pick(keys); s.items.push({ k, e: pick(T[k].it), x: rnd(30, LW - 30), y: -20, v: rnd(.85, 1.15) * clamp(110 + s.score * .7, 110, 340), r: rnd(-1, 1) }); }
      for (const it of s.items) {
        it.y += it.v * dt; it.r += dt;
        if (!it.dead && it.y > BY - 16 && it.y < BY + 18 && Math.abs(it.x - s.px) < 62) {
          it.dead = true;
          if (it.k === s.target) { s.combo++; s.caught++; s.score += 10 * (1 + Math.floor(s.combo / 5)); S.ok(); A.burst(it.x, it.y, T[it.k].c, 12); if (s.caught % 6 === 0) { let nk; do { nk = pick(keys); } while (nk === s.target); s.target = nk; s.msg = '🔄 Yeni hedef: ' + T[nk].n + ' — ' + T[nk].d; s.mt = 2.6; } else if (s.combo % 5 === 0) { s.msg = '🔥 ' + s.combo + 'x kombo! Puan katlandı'; s.mt = 1.4; } }
          else { s.lives--; s.combo = 0; S.bad(); A.shake = 8; A.burst(it.x, it.y, '#ff4d4d', 16); s.msg = '❌ ' + it.e + ' bir ' + T[it.k].n + ' uyaranı!'; s.mt = 1.6; }
        } else if (!it.dead && it.y > LH + 20) { it.dead = true; if (it.k === s.target) s.combo = 0; }
      }
      s.items = s.items.filter(i => !i.dead); s.mt -= dt;
      draw(dt); A.hud(s.score, s.lives);
      if (s.lives <= 0) A.finish(s.score, 100, 'Reseptör avcısı: uyaran–reseptör eşleşmesini öğrendin!', start);
    }
    function draw(dt) {
      A.begin(); const g = x.createLinearGradient(0, 0, 0, LH); g.addColorStop(0, '#0c2a4a'); g.addColorStop(1, '#073b3a'); x.fillStyle = g; x.fillRect(0, 0, LW, LH);
      x.strokeStyle = 'rgba(255,255,255,.05)'; for (let i = 0; i < LW; i += 48) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, LH); x.stroke(); }
      const t = T[s.target]; rr(x, 120, 10, 480, 44, 22); x.fillStyle = 'rgba(0,0,0,.45)'; x.fill(); x.strokeStyle = t.c; x.lineWidth = 3; x.stroke();
      txt(x, 'Yakala: ' + t.n.toUpperCase(), LW / 2, 25, 18, t.c, true); txt(x, t.d, LW / 2, 44, 12, '#dde');
      for (const it of s.items) { x.save(); x.translate(it.x, it.y); x.rotate(Math.sin(it.r * 3) * .25); emo(x, it.e, 0, 0, 34); x.restore(); }
      rr(x, s.px - 58, BY, 116, 34, 12); x.fillStyle = t.c; x.fill(); x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(s.px - 52, BY + 4, 104, 6); txt(x, t.n, s.px, BY + 20, 12, '#06202a', true);
      if (s.combo >= 3) txt(x, s.combo + 'x', s.px, BY - 16, 18, '#fff', true);
      if (s.mt > 0) { x.globalAlpha = clamp(s.mt, 0, 1); rr(x, 90, LH / 2 - 26, 540, 52, 14); x.fillStyle = 'rgba(0,0,0,.65)'; x.fill(); txt(x, s.msg, LW / 2, LH / 2, 16, '#fff', true); x.globalAlpha = 1; }
      A.drawParts(dt); A.end();
    }
    A.intro('🌧️', 'Uyaran Yağmuru', 'Gökten uyaranlar yağıyor! Sepetinle yalnızca hedef reseptörün algıladığı uyaranları yakala. Hızlandıkça zorlaşır!', start);
    return A.destroy;
  }

  /* ================= BİYOLOJİ 2: NÖRON KOŞUSU ================= */
  function gKosu(box) {
    const A = shell(box, 'kosu', { help: '␣ Boşluk / ↑ / dokun: zıpla (havada bir kez daha basarak çift zıpla). Engellerden kaç, miyelin 🟡 topla!' }), x = A.x, GY = 340;
    const FACT = ['Miyelin kılıf impulsun iletimini hızlandırır.', 'Ranvier boğumlarında impuls “sıçrayarak” ilerler.', 'Akson impulsu hücre gövdesinden uzağa taşır.', 'Dendritler impulsu hücre gövdesine getirir.', 'Duyu nöronu impulsu merkezi sinir sistemine iletir.', 'Motor nöron impulsu efektöre (kas/bez) taşır.', 'Schwann hücreleri periferde miyelin kılıfı oluşturur.'];
    let s; function start() { s = { y: GY, vy: 0, j: 0, speed: 270, dist: 0, pick: 0, lives: 3, inv: 0, obs: [], pk: [], next: 200, msg: 'Sinir impulsu yola çıktı!', mt: 2 }; A.parts.length = 0; A.run(frame); }
    function jump() { if (!A.active || !s) return; if (s.y >= GY - 1 || s.j < 2) { s.vy = s.y >= GY - 1 ? -600 : -520; s.j = s.y >= GY - 1 ? 1 : s.j + 1; S.jump(); } }
    A.onKey = (k, d) => { if (d && (k === ' ' || k === 'ArrowUp' || k === 'w')) jump(); }; A.on('pointerdown', jump, A.cv); A.cv.style.touchAction = 'none';
    function frame(dt) {
      s.speed = Math.min(560, 270 + s.dist / 35); const dx = s.speed * dt; s.dist += dx; s.vy += 1700 * dt; s.y += s.vy * dt; if (s.y >= GY) { s.y = GY; s.vy = 0; s.j = 0; } s.inv -= dt; s.mt -= dt;
      s.next -= dx; if (s.next <= 0) { const fly = Math.random() < .3; s.obs.push(fly ? { x: LW + 40, y: GY - 78, w: 34, h: 28, e: '🦠' } : { x: LW + 40, y: GY - rnd(32, 62), w: 30, h: 0, e: '🧱', g: 1 }); if (!fly) { const o = s.obs[s.obs.length - 1]; o.h = GY + 14 - o.y; } const n = Math.floor(rnd(0, 3)); for (let i = 0; i < n; i++) s.pk.push({ x: LW + 120 + i * 46, y: GY - rnd(30, 140) }); s.next = rnd(300, 470) + s.speed * .35; }
      for (const o of s.obs) o.x -= dx; for (const p of s.pk) p.x -= dx; s.obs = s.obs.filter(o => o.x > -60); s.pk = s.pk.filter(p => p.x > -40 && !p.t);
      const px = 120, py = s.y - 16;
      for (const p of s.pk) if (Math.hypot(p.x - px, p.y - py) < 26) { p.t = 1; s.pick++; S.ok(); A.burst(p.x, p.y, '#ffd34d', 10); if (s.pick % 5 === 0) { s.msg = '💡 ' + pick(FACT); s.mt = 3; } }
      if (s.inv <= 0) for (const o of s.obs) { const cx = clamp(px, o.x, o.x + o.w), cy = clamp(py, o.y, o.y + o.h); if (Math.hypot(px - cx, py - cy) < 14) { s.lives--; s.inv = 1.4; S.boom(); A.shake = 10; A.burst(px, py, '#ff6b6b', 18); s.msg = '💥 İmpuls engele çarptı!'; s.mt = 1.4; break; } }
      const score = Math.floor(s.dist / 10) + s.pick * 5; draw(dt, px, py); A.hud(score, s.lives);
      if (s.lives <= 0) A.finish(score, 200, 'Nöron koşucusu: impuls hedefe ulaştı!', start);
    }
    function draw(dt, px, py) {
      A.begin(); const g = x.createLinearGradient(0, 0, 0, LH); g.addColorStop(0, '#1d0f3a'); g.addColorStop(1, '#0a0820'); x.fillStyle = g; x.fillRect(0, 0, LW, LH);
      x.strokeStyle = 'rgba(180,120,255,.12)'; x.lineWidth = 2; for (let i = 0; i < 5; i++) { const ox = -((s.dist * (.1 + i * .05)) % 260); for (let k = 0; k < 4; k++) { x.beginPath(); x.moveTo(ox + k * 260, 40 + i * 50); x.quadraticCurveTo(ox + k * 260 + 60, 10 + i * 50, ox + k * 260 + 130, 50 + i * 50); x.stroke(); } }
      x.fillStyle = '#2b1f55'; x.fillRect(0, GY + 14, LW, LH - GY); const off = -(s.dist % 150); for (let k = -1; k < 6; k++) { rr(x, off + k * 150, GY + 14, 128, 46, 20); x.fillStyle = '#f0c75a'; x.fill(); x.strokeStyle = '#a07d1f'; x.lineWidth = 2; x.stroke(); }
      txt(x, 'Ranvier boğumu', off + 139 + 150 * 2, GY + 70, 11, '#cdb', false); txt(x, 'miyelin kılıf', off + 64 + 150 * 2, GY + 36, 11, '#4a3500', true);
      for (const o of s.obs) { if (o.g) { x.fillStyle = '#d65a4a'; rr(x, o.x, o.y, o.w, o.h, 6); x.fill(); emo(x, '🧱', o.x + o.w / 2, o.y + 14, 22); } else emo(x, o.e, o.x + o.w / 2, o.y + o.h / 2, 32); }
      for (const p of s.pk) { x.fillStyle = 'rgba(255,211,77,.3)'; x.beginPath(); x.arc(p.x, p.y, 16, 0, 7); x.fill(); emo(x, '🟡', p.x, p.y, 22); }
      if (!(s.inv > 0 && Math.floor(s.inv * 10) % 2)) { const gl = x.createRadialGradient(px, py, 2, px, py, 30); gl.addColorStop(0, 'rgba(120,230,255,.9)'); gl.addColorStop(1, 'rgba(120,230,255,0)'); x.fillStyle = gl; x.beginPath(); x.arc(px, py, 30, 0, 7); x.fill(); x.fillStyle = '#e8fbff'; x.beginPath(); x.arc(px, py, 13, 0, 7); x.fill(); emo(x, '⚡', px, py, 16); }
      if (s.mt > 0) { x.globalAlpha = clamp(s.mt, 0, 1); rr(x, 60, 14, 600, 38, 12); x.fillStyle = 'rgba(0,0,0,.6)'; x.fill(); txt(x, s.msg, LW / 2, 33, 15, '#fff', true); x.globalAlpha = 1; }
      A.drawParts(dt); A.end();
    }
    A.intro('⚡', 'Nöron Koşusu', 'Sen bir sinir impulsusun! Akson boyunca koş, engellerin üstünden zıpla, miyelin topla. Hız arttıkça yetişmek zorlaşır!', start);
    return A.destroy;
  }

  /* ================= BİYOLOJİ 3: REFLEKS ÇEKİCİ ================= */
  function gCekic(box) {
    const A = shell(box, 'cekic', { help: '🖱️ / 👆 Doğru organa veya uyarana hızlıca tıkla! Hedef reseptör her 12 saniyede değişir. Yanlışa vurursan −5.', lives: 0 }), x = A.x;
    const T = { foto: 'Fotoreseptör', mekano: 'Mekanoreseptör', kemo: 'Kemoreseptör', termo: 'Termoreseptör' }, keys = Object.keys(T);
    const IT = [['👁️', 'Göz (retina)', 'foto'], ['🔆', 'Işık algılayan hücre', 'foto'], ['👂', 'Kulak (Korti)', 'mekano'], ['🖐️', 'Deride dokunma', 'mekano'], ['🌀', 'Denge organı', 'mekano'], ['👃', 'Burun', 'kemo'], ['👅', 'Dil (tat tomurcuğu)', 'kemo'], ['🔥', 'Deride sıcaklık', 'termo'], ['🧊', 'Deride soğuk', 'termo']];
    const HOLES = []; for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) HOLES.push({ x: 100 + c * 173, y: 180 + r * 130 });
    let s; function start() { s = { score: 0, time: 60, target: pick(keys), tt: 12, spawn: .2, mon: [], msg: '', mt: 0, hits: 0 }; A.parts.length = 0; A.run(frame); }
    A.on('pointerdown', e => { if (!A.active || !s) return; const p = A.pt(e); let best = null; for (const m of s.mon) { const h = HOLES[m.h]; if (!m.done && Math.hypot(p.x - h.x, p.y - (h.y - 28)) < 58) best = m; } if (!best) return; best.done = 1; const h = HOLES[best.h]; if (best.k === s.target) { const b = Math.round(best.life / best.max * 10); s.score += 10 + b; s.hits++; S.ok(); A.burst(h.x, h.y - 30, '#2ecc71', 14); best.res = '+' + (10 + b); } else { s.score = Math.max(0, s.score - 5); S.bad(); A.shake = 8; A.burst(h.x, h.y - 30, '#ff4d4d', 12); best.res = '−5 ✖'; } best.t2 = .5; }, A.cv); A.cv.style.touchAction = 'none';
    function frame(dt) {
      s.time -= dt; s.tt -= dt; s.mt -= dt; if (s.tt <= 0) { let nk; do { nk = pick(keys); } while (nk === s.target); s.target = nk; s.tt = 12; s.msg = '🔄 Yeni hedef: ' + T[nk]; s.mt = 2; S.pop(); }
      s.spawn -= dt; const free = HOLES.map((_, i) => i).filter(i => !s.mon.some(m => m.h === i)); if (s.spawn <= 0 && free.length && s.mon.filter(m => !m.done).length < 3) { s.spawn = Math.max(.35, .75 - (60 - s.time) / 140); const it = Math.random() < .5 ? pick(IT.filter(i => i[2] === s.target)) : pick(IT); const mx = Math.max(.75, 1.5 - (60 - s.time) / 80); s.mon.push({ h: pick(free), e: it[0], n: it[1], k: it[2], life: mx, max: mx, a: 0 }); }
      for (const m of s.mon) { m.a = Math.min(1, m.a + dt * 7); if (m.done) m.t2 -= dt; else { m.life -= dt; if (m.life <= 0) m.gone = 1; } } s.mon = s.mon.filter(m => !m.gone && !(m.done && m.t2 <= 0));
      draw(dt); A.hud(s.score, null, '⏱ ' + Math.max(0, Math.ceil(s.time)) + ' sn');
      if (s.time <= 0) A.finish(s.score, 120, 'Refleks ustası: organ–reseptör eşleşmelerini hızla tanıdın!', start);
    }
    function draw(dt) {
      A.begin(); const g = x.createLinearGradient(0, 0, 0, LH); g.addColorStop(0, '#3b2a14'); g.addColorStop(1, '#1a0f05'); x.fillStyle = g; x.fillRect(0, 0, LW, LH);
      rr(x, 110, 10, 500, 56, 20); x.fillStyle = 'rgba(0,0,0,.5)'; x.fill(); x.strokeStyle = '#ffd34d'; x.lineWidth = 3; x.stroke(); txt(x, 'VUR: ' + T[s.target].toUpperCase() + ' taşıyanlar', LW / 2, 28, 20, '#ffd34d', true); x.fillStyle = '#ffd34d'; x.fillRect(130, 48, 460 * clamp(s.tt / 12, 0, 1), 5);
      for (const h of HOLES) { x.fillStyle = '#0a0502'; x.beginPath(); x.ellipse(h.x, h.y, 62, 20, 0, 0, 7); x.fill(); x.fillStyle = '#5a3a1a'; x.beginPath(); x.ellipse(h.x, h.y - 3, 62, 18, 0, Math.PI, 0); x.fill(); }
      for (const m of s.mon) { const h = HOLES[m.h]; x.save(); x.beginPath(); x.rect(h.x - 70, h.y - 120, 140, 120 + 0); x.clip(); const up = (m.done ? 0 : 1) * m.a; const yy = h.y + 10 - 66 * up; emo(x, m.e, h.x, yy - 14, 54); x.restore(); x.save(); x.beginPath(); x.rect(h.x - 70, h.y - 120, 140, 125); x.clip(); rr(x, h.x - 56, yy + 18 - 0, 112, 20, 8); x.fillStyle = 'rgba(0,0,0,.7)'; x.fill(); txt(x, m.n, h.x, yy + 28, 11, '#fff', true); x.restore(); if (!m.done) { x.fillStyle = m.life / m.max > .4 ? '#2ecc71' : '#ff6b6b'; x.fillRect(h.x - 30, h.y + 14, 60 * clamp(m.life / m.max, 0, 1), 4); } if (m.res) txt(x, m.res, h.x, h.y - 100 - (.5 - m.t2) * 40, 22, m.res[0] === '+' ? '#2ecc71' : '#ff6b6b', true); }
      if (s.mt > 0) { x.globalAlpha = clamp(s.mt, 0, 1); txt(x, s.msg, LW / 2, LH - 24, 20, '#fff', true); x.globalAlpha = 1; }
      A.drawParts(dt); A.end();
    }
    A.intro('🔨', 'Refleks Çekici', '60 saniyen var! Çukurlardan çıkan organ ve uyaranlardan yalnızca hedef reseptörü taşıyanlara vur. Ne kadar hızlı vurursan o kadar çok puan!', start);
    return A.destroy;
  }

  /* ================= FİZİK 1: MANCINIK ================= */
  function gMancinik(box) {
    const A = shell(box, 'mancinik', { help: '🖱️ Topu sürükleyip geri çek ve bırak. Ne kadar çekersen v₀ o kadar büyük; açı çekiş yönüne göre belirlenir. Yörüngenin başı noktalarla gösterilir. (g = 10 m/s², 1 m = 8 piksel)', lives: 0 }), x = A.x;
    const SC = 8, GRD = 380, AX = 95, AY = 318, G = 10 * SC, VM = 30, MAXD = 100;
    const LV = [
      { t: [[520, GRD - 16]], w: [], b: 3 }, { t: [[430, GRD - 16], [610, GRD - 16]], w: [], b: 3 },
      { t: [[600, GRD - 16]], w: [[360, 230, 22, 150]], b: 3 }, { t: [[610, 244]], w: [[540, 260, 130, 16]], b: 3 },
      { t: [[470, GRD - 16], [560, 284], [650, GRD - 16]], w: [[330, 220, 20, 160], [520, 300, 80, 14]], b: 4 }];
    let s;
    function load(i) { const L = LV[i]; s.lv = i; s.t = L.t.map(p => ({ x: p[0], y: p[1], a: 1 })); s.w = L.w; s.b = L.b; s.ball = null; s.drag = null; s.pause = false; s.cd = 0; }
    function start() { s = { score: 0, tot: 0 }; A.parts.length = 0; load(0); A.run(frame); }
    const anchorV = d => { const dx = AX - d.x, dy = AY - d.y, L = Math.hypot(dx, dy) || 1, k = Math.min(L, MAXD); return { vx: dx / L * k / MAXD * VM, vy: -dy / L * k / MAXD * VM, sp: k / MAXD * VM, ang: Math.atan2(-dy, dx) * 180 / Math.PI }; };
    A.on('pointerdown', e => { if (!A.active || !s || s.pause || s.ball || s.b <= 0) return; const p = A.pt(e); if (Math.hypot(p.x - AX, p.y - AY) < 60) { s.drag = { x: p.x, y: p.y }; A.cv.setPointerCapture && A.cv.setPointerCapture(e.pointerId); } }, A.cv);
    A.on('pointermove', e => { if (s && s.drag) { const p = A.pt(e), dx = p.x - AX, dy = p.y - AY, L = Math.hypot(dx, dy), k = Math.min(L, MAXD); s.drag = { x: AX + dx / (L || 1) * k, y: AY + dy / (L || 1) * k }; } }, A.cv);
    A.on('pointerup', () => { if (!s || !s.drag) return; const v = anchorV(s.drag); s.drag = null; if (v.sp < 3) return; s.ball = { x: AX, y: AY, vx: v.vx * SC, vy: -v.vy * SC, age: 0, v }; s.b--; S.pop(); }, A.cv); A.cv.style.touchAction = 'none';
    function frame(dt) {
      if (!s.pause) {
        if (s.ball) {
          const b = s.ball; const n = 4, h = dt / n; for (let i = 0; i < n && s.ball; i++) {
            b.vy += G * h; b.x += b.vx * h; b.y += b.vy * h; b.age += h;
            for (const r of s.w) { const cx = clamp(b.x, r[0], r[0] + r[2]), cy = clamp(b.y, r[1], r[1] + r[3]), dx = b.x - cx, dy = b.y - cy, d = Math.hypot(dx, dy); if (d < 10) { let nx, ny; if (d > .001) { nx = dx / d; ny = dy / d; } else { nx = -1; ny = 0; } b.x = cx + nx * 10; b.y = cy + ny * 10; const dp = b.vx * nx + b.vy * ny; if (dp < 0) { b.vx -= 1.4 * dp * nx; b.vy -= 1.4 * dp * ny; S.pop(); } } }
            for (const t of s.t) if (t.a && Math.hypot(b.x - t.x, b.y - t.y) < 26) { t.a = 0; s.score += 50; S.boom(); A.burst(t.x, t.y, '#b8ff5a', 24); A.shake = 6; }
            if (b.y >= GRD - 10 || b.x > LW + 40 || b.x < -40 || b.age > 9) { s.ball = null; s.cd = .7; }
          }
        } else if (s.cd > 0) { s.cd -= dt; }
        if (!s.ball && s.cd <= 0 && s.t.every(t => !t.a) && !s.pause) { s.pause = true; const bonus = s.b * 30; s.score += bonus; const st = s.b >= 2 ? 3 : s.b >= 1 ? 2 : 1; S.win(); const last = s.lv >= LV.length - 1; if (last) { A.finish(s.score, 250, 'Mancınık ustası: yörünge bileşenlerini ustalıkla kullandın!', start); return; } A.overlay('<div style="font-size:2.6rem">' + '⭐'.repeat(st) + '</div><h2>Seviye ' + (s.lv + 1) + ' geçildi!</h2><p>Kalan top bonusu: +' + bonus + '</p>', 'Sonraki seviye ▶', () => { load(s.lv + 1); }); }
        else if (!s.ball && s.cd <= 0 && s.b <= 0 && s.t.some(t => t.a) && !s.pause) { s.pause = true; A.finish(s.score, 250, 'Mancınık ustası!', start); }
      }
      draw(dt); A.hud(s.score, null, 'Seviye ' + (s.lv + 1) + '/' + LV.length + ' · ⚪ ' + s.b);
    }
    function draw(dt) {
      A.begin(); const g = x.createLinearGradient(0, 0, 0, LH); g.addColorStop(0, '#79c4ff'); g.addColorStop(1, '#d9f0ff'); x.fillStyle = g; x.fillRect(0, 0, LW, LH);
      x.fillStyle = '#5db85a'; x.fillRect(0, GRD, LW, LH - GRD); x.fillStyle = '#3d8c3c'; x.fillRect(0, GRD, LW, 6); x.fillStyle = 'rgba(0,0,0,.35)'; x.font = '10px Nunito'; x.textAlign = 'center'; for (let m = 0; m <= 80; m += 10) { x.fillText(m + ' m', AX + m * SC, GRD + 18); x.fillRect(AX + m * SC, GRD, 1, 6); }
      for (const r of s.w) { x.fillStyle = '#8a6a4a'; rr(x, r[0], r[1], r[2], r[3], 4); x.fill(); x.strokeStyle = '#5a4128'; x.lineWidth = 2; x.stroke(); }
      for (const t of s.t) if (t.a) { emo(x, '👾', t.x, t.y, 36); }
      x.strokeStyle = '#6b4a2a'; x.lineWidth = 8; x.beginPath(); x.moveTo(AX, GRD); x.lineTo(AX, AY + 30); x.stroke(); x.beginPath(); x.moveTo(AX - 14, AY - 4); x.lineTo(AX, AY + 30); x.lineTo(AX + 14, AY - 4); x.stroke();
      const bp = s.drag || (s.ball ? null : { x: AX, y: AY });
      if (s.drag) { const v = anchorV(s.drag); x.fillStyle = 'rgba(0,0,0,.35)'; x.fillStyle = '#ffd34d'; for (let t = .05; t < 1.5; t += .06) { const px = AX + v.vx * SC * t, py = AY - v.vy * SC * t + .5 * G * t * t; x.beginPath(); x.arc(px, py, 3, 0, 7); x.fill(); }
        x.strokeStyle = '#3a2512'; x.lineWidth = 5; x.beginPath(); x.moveTo(AX - 14, AY - 4); x.lineTo(s.drag.x, s.drag.y); x.lineTo(AX + 14, AY - 4); x.stroke();
        const vx = v.vx, vy = v.vy; rr(x, 10, 50, 170, 74, 10); x.fillStyle = 'rgba(0,0,0,.55)'; x.fill(); x.textAlign = 'left'; x.fillStyle = '#fff'; x.font = '700 13px Nunito'; x.fillText('v₀ = ' + f1(v.sp) + ' m/s', 20, 68); x.fillText('θ = ' + f1(v.ang) + '°', 20, 86); x.font = '13px Nunito'; x.fillStyle = '#9ff'; x.fillText('vₓ = ' + f1(vx) + ' m/s', 20, 104); x.fillStyle = '#fc9'; x.fillText('v_y = ' + f1(vy) + ' m/s', 100, 104); }
      if (bp) { x.fillStyle = '#e63946'; x.beginPath(); x.arc(bp.x, bp.y, 10, 0, 7); x.fill(); x.fillStyle = 'rgba(255,255,255,.5)'; x.beginPath(); x.arc(bp.x - 3, bp.y - 3, 3, 0, 7); x.fill(); }
      if (s.ball) { x.fillStyle = '#e63946'; x.beginPath(); x.arc(s.ball.x, s.ball.y, 10, 0, 7); x.fill(); const v = s.ball.v; rr(x, 10, 50, 170, 24, 8); x.fillStyle = 'rgba(0,0,0,.5)'; x.fill(); txt(x, 'v₀ ' + f1(v.sp) + ' · θ ' + f1(v.ang) + '°', 95, 62, 12, '#fff', true); }
      if (!s.ball && !s.drag && s.b > 0 && s.lv === 0 && s.score === 0) txt(x, '⬅️ Topu sürükle ve bırak!', AX + 110, AY - 50, 16, '#06304a', true);
      A.drawParts(dt); A.end();
    }
    A.intro('🏹', 'Mancınık', 'Yaratıkları (👾) top atarak vur! Eğik atışta hız ve açı yörüngeyi belirler; vₓ sabit, v_y yerçekimiyle değişir. 5 seviye!', start);
    return A.destroy;
  }

  /* ================= FİZİK 2: ERZAK ATIŞI (yatay atış) ================= */
  function gErzak(box) {
    const A = shell(box, 'erzak', { help: '␣ Boşluk / dokun: kasayı bırak. Kasa uçağın yatay hızıyla (vₓ) düşer: t = √(2h/g), x = vₓ·t. Hedef tekne hareket edebilir, önünü kes! (g = 10 m/s², 1 m = 8 piksel)', lives: 0 }), x = A.x;
    const SC = 8, SEA = 372, G = 10 * SC, TOT = 10; let s;
    function newPass() { const lvl = s.n; s.plane = { x: -50, v: rnd(14, 28), y: rnd(60, 150) }; const bv = lvl < 3 ? 0 : pick([-4, -2.5, 2.5, 4]); s.boat = { x: rnd(300, 640), v: bv, w: 96 }; s.guide = lvl < 3; }
    function start() { s = { score: 0, n: 0, crate: null, res: '', rt: 0 }; A.parts.length = 0; newPass(); A.run(frame); }
    function drop() { if (!A.active || !s || s.crate || s.done) return; const p = s.plane; if (p.x < 0 || p.x > LW) return; s.crate = { x: p.x, y: p.y + 16, vx: p.v * SC, vy: 0, x0: p.x, t: 0 }; s.n++; S.pop(); }
    A.onKey = (k, d) => { if (d && k === ' ') drop(); }; A.on('pointerdown', drop, A.cv); A.cv.style.touchAction = 'none';
    function frame(dt) {
      const p = s.plane, b = s.boat; p.x += p.v * SC * dt; b.x += b.v * SC * dt; if (b.x < 220 || b.x > 660) b.v = -b.v; s.rt -= dt;
      if (s.crate) { const c = s.crate; c.t += dt; c.vy += G * dt; c.x += c.vx * dt; c.y += c.vy * dt; if (Math.random() < .5) A.parts.push({ x: c.x, y: c.y, vx: -c.vx * .1, vy: 0, l: .25, c: '#fff' });
        if (c.y >= SEA - 8) { const d = c.x - b.x; const hit = Math.abs(d) <= b.w / 2; const h = (SEA - 16 - (p.y + 16)) / SC; const tt = Math.sqrt(2 * Math.abs(h) / 10); if (hit) { const pts = 10 + (Math.abs(d) < 18 ? 10 : 0); s.score += pts; S.ok(); A.burst(c.x, SEA - 10, '#2ecc71', 20); s.res = '✅ İsabet! +' + pts + (pts > 10 ? ' (tam ortası!)' : '') + ' — kasa ' + f1(tt) + ' s düştü, ' + f1((c.x - c.x0) / SC) + ' m ileri gitti'; } else { S.bad(); A.burst(c.x, SEA - 8, '#5ac8ff', 14); s.res = '💦 ' + f1(Math.abs(d) / SC) + ' m ' + (d > 0 ? 'ileri' : 'geri') + ' düştü — kasa ' + f1(tt) + ' s düştü, ' + f1((c.x - c.x0) / SC) + ' m ileri gitti'; } s.rt = 4; s.crate = null; if (s.n >= TOT) { s.done = 1; setTimeout(() => A.finish(s.score, 80, 'Yatay atış ustası: x = vₓ·√(2h/g) bağıntısını uyguladın!', start), 1500); } else if (p.x > LW) newPass(); } }
      if (p.x > LW + 50 && !s.crate && !s.done) newPass();
      draw(dt); A.hud(s.score, null, '📦 ' + Math.max(0, TOT - s.n) + ' kasa kaldı');
    }
    function draw(dt) {
      A.begin(); const p = s.plane, b = s.boat; const g = x.createLinearGradient(0, 0, 0, SEA); g.addColorStop(0, '#2b7fd4'); g.addColorStop(1, '#bfe6ff'); x.fillStyle = g; x.fillRect(0, 0, LW, LH);
      emo(x, '☁️', 120, 40, 40); emo(x, '☁️', 480, 100, 34); x.fillStyle = '#1f6fb5'; x.fillRect(0, SEA, LW, LH - SEA); x.strokeStyle = 'rgba(255,255,255,.4)'; x.lineWidth = 2; for (let i = 0; i < 12; i++) { x.beginPath(); x.moveTo(i * 64 + (Date.now() / 40 % 64), SEA + 14); x.quadraticCurveTo(i * 64 + 16 + (Date.now() / 40 % 64), SEA + 8, i * 64 + 32 + (Date.now() / 40 % 64), SEA + 14); x.stroke(); }
      const h = (SEA - 16 - (p.y + 16)) / SC, t = Math.sqrt(2 * h / 10), xr = p.v * t;
      if (s.guide && !s.crate) { const lx = p.x + xr * SC; x.setLineDash([6, 6]); x.strokeStyle = '#fff'; x.lineWidth = 2; x.beginPath(); x.moveTo(p.x, p.y + 20); for (let tt = .05; tt <= t + .001; tt += .05) x.lineTo(p.x + p.v * SC * tt, p.y + 20 + .5 * G * tt * tt); x.stroke(); x.setLineDash([]); txt(x, '⌖', lx, SEA - 10, 26, '#fff', true); }
      rr(x, b.x - b.w / 2, SEA - 18, b.w, 22, 8); x.fillStyle = '#d7263d'; x.fill(); x.fillStyle = '#fff'; x.fillRect(b.x - 18, SEA - 18, 36, 5); emo(x, '🚢', b.x, SEA - 22, 44); if (b.v) txt(x, (b.v > 0 ? '→ ' : '← ') + f1(Math.abs(b.v)) + ' m/s', b.x, SEA + 16, 12, '#fff', true);
      emo(x, '🛩️', p.x, p.y, 44); if (s.crate) emo(x, '📦', s.crate.x, s.crate.y, 24);
      rr(x, 10, 50, 300, 66, 10); x.fillStyle = 'rgba(0,0,0,.5)'; x.fill(); x.textAlign = 'left'; x.fillStyle = '#fff'; x.font = '700 13px Nunito'; x.fillText('Uçak: vₓ = ' + f1(p.v) + ' m/s · h = ' + f1(h) + ' m', 20, 68); x.font = '13px Nunito'; x.fillStyle = '#9ff'; x.fillText('t = √(2h/g) = ' + f1(t) + ' s', 20, 86); x.fillStyle = '#fc9'; x.fillText('x = vₓ·t = ' + f1(xr) + ' m (kasa bırakıldığı yerden ileri gider)', 20, 104);
      if (!s.guide) { x.fillStyle = '#fff'; x.font = '12px Nunito'; x.textAlign = 'right'; x.fillText('Kılavuz kapalı: x’i kendin hesapla!', LW - 14, 46); } else { x.fillStyle = '#fff'; x.font = '12px Nunito'; x.textAlign = 'right'; x.fillText('⌖ = kasanın düşeceği yer (ilk 3 atış)', LW - 14, 46); }
      if (s.rt > 0 && s.res) { x.globalAlpha = clamp(s.rt, 0, 1); rr(x, 40, 140, 640, 34, 12); x.fillStyle = 'rgba(0,0,0,.65)'; x.fill(); txt(x, s.res, LW / 2, 157, 14, '#fff', true); x.globalAlpha = 1; }
      A.drawParts(dt); A.end();
    }
    A.intro('📦', 'Erzak Atışı', 'Uçaktan kasa bırak ve tekneye düşür! Yatay atışta kasa uçağın yatay hızını korur, düşeyde serbest düşer. 10 kasan var!', start);
    return A.destroy;
  }

  /* ================= FİZİK 3: POTA ATIŞI ================= */
  function gPota(box) {
    const A = shell(box, 'pota', { help: '👆 Basılı tut: güç çubuğu gidip gelir. Basılıyken fareyi / parmağı yukarı-aşağı oynatarak açıyı ayarla (veya ↑ ↓ tuşları, ␣ basılı tut). Bırakınca at!', lives: 0 }), x = A.x;
    const SC = 8, GRD = 396, BX = 70, BY = 336, G = 10 * SC; let s;
    function newHoop() { s.hx = rnd(300, 560); s.hy = rnd(190, 270); }
    function start() { s = { score: 0, time: 60, ball: null, charge: 0, dir: 1, hold: false, ang: 55, streak: 0, msg: '', mt: 0, made: 0 }; newHoop(); A.parts.length = 0; A.run(frame); }
    const vOf = () => 12 + s.charge * 18;
    function press() { if (!A.active || !s || s.ball || s.hold) return; s.hold = true; s.charge = 0; s.dir = 1; }
    function release() { if (!s || !s.hold) return; s.hold = false; if (s.ball) return; const v = vOf(), a = s.ang * Math.PI / 180; s.ball = { x: BX, y: BY, vx: v * Math.cos(a) * SC, vy: -v * Math.sin(a) * SC, rim: false, age: 0, v, a: s.ang }; S.pop(); }
    A.on('pointerdown', e => { press(); setY(e); }, A.cv); A.on('pointermove', e => { if (s && s.hold) setY(e); }, A.cv); A.on('pointerup', release, A.cv); A.on('pointercancel', release, A.cv); A.cv.style.touchAction = 'none';
    function setY(e) { if (!s) return; const p = A.pt(e); s.ang = clamp(88 - (p.y / LH) * 80, 15, 82); }
    A.onKey = (k, d) => { if (k === ' ') { d ? press() : release(); } };
    function frame(dt) {
      s.time -= dt; s.mt -= dt; if (A.keys.ArrowUp) s.ang = Math.min(82, s.ang + 40 * dt); if (A.keys.ArrowDown) s.ang = Math.max(15, s.ang - 40 * dt);
      if (s.hold) { s.charge += s.dir * 1.1 * dt; if (s.charge >= 1) { s.charge = 1; s.dir = -1; } if (s.charge <= 0) { s.charge = 0; s.dir = 1; } }
      const rL = s.hx, rR = s.hx + 56, rY = s.hy;
      if (s.ball) { const b = s.ball, n = 4, h = dt / n; for (let i = 0; i < n && s.ball; i++) {
        const py = b.y; b.vy += G * h; b.x += b.vx * h; b.y += b.vy * h; b.age += h;
        for (const c of [[rL, rY], [rR, rY]]) { const dx = b.x - c[0], dy = b.y - c[1], d = Math.hypot(dx, dy); if (d < 15) { const nx = dx / d, ny = dy / d; b.x = c[0] + nx * 15; b.y = c[1] + ny * 15; const dp = b.vx * nx + b.vy * ny; if (dp < 0) { b.vx -= 1.6 * dp * nx; b.vy -= 1.6 * dp * ny; b.rim = true; S.pop(); } } }
        if (b.x + 10 > rR + 4 && b.x - 10 < rR + 10 && b.y > rY - 80 && b.y < rY + 6) { b.x = rR + 4 - 10; b.vx = -Math.abs(b.vx) * .5; b.rim = true; S.pop(); }
        if (py < rY && b.y >= rY && b.vy > 0 && b.x > rL + 6 && b.x < rR - 6) { const swish = !b.rim; const far = s.hx > 450; const pts = 2 + (far ? 1 : 0) + (s.streak >= 2 ? 1 : 0) + (swish ? 1 : 0); s.score += pts; s.streak++; s.made++; s.msg = (swish ? '🌟 SWISH! ' : '🏀 Sayı! ') + '+' + pts + (far ? ' · uzak atış' : '') + (s.streak > 2 ? ' · seri ' + s.streak : ''); s.mt = 1.6; S.ok(); A.burst((rL + rR) / 2, rY + 10, '#ffa63d', 22); s.ball = null; newHoop(); break; }
        if (b.y > GRD - 11 || b.x > LW + 30 || b.age > 6) { s.ball = null; s.streak = 0; s.msg = '❌ Iska! v₀ = ' + f1(b.v) + ' m/s, θ = ' + f1(b.a) + '°'; s.mt = 1.6; S.bad(); }
      } }
      draw(dt); A.hud(s.score, null, '⏱ ' + Math.max(0, Math.ceil(s.time)) + ' sn · 🏀 ' + s.made);
      if (s.time <= 0) A.finish(s.score, 12, 'Pota ustası: eğik atış yörüngesini çözdün!', start);
    }
    function draw(dt) {
      A.begin(); const g = x.createLinearGradient(0, 0, 0, LH); g.addColorStop(0, '#2a1a4a'); g.addColorStop(1, '#4a2a1a'); x.fillStyle = g; x.fillRect(0, 0, LW, LH);
      x.fillStyle = '#c98a3d'; x.fillRect(0, GRD, LW, LH - GRD); x.fillStyle = '#e8b062'; x.fillRect(0, GRD, LW, 5);
      const rL = s.hx, rR = s.hx + 56, rY = s.hy;
      x.fillStyle = '#555'; x.fillRect(rR + 14, rY - 60, 6, GRD - rY + 60); x.fillStyle = '#fff'; rr(x, rR + 4, rY - 80, 10, 90, 3); x.fill(); x.strokeStyle = '#ff6a1a'; x.lineWidth = 5; x.beginPath(); x.moveTo(rL, rY); x.lineTo(rR, rY); x.stroke(); x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 1.5; for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(rL + i * 14, rY); x.lineTo(rL + 10 + i * 9, rY + 30); x.stroke(); }
      emo(x, '🧍', BX - 6, BY + 26, 54); const a = s.ang * Math.PI / 180;
      if (!s.ball) { const v = s.hold ? vOf() : 21; x.fillStyle = 'rgba(255,255,255,.75)'; for (let t = .06; t < .8; t += .07) { x.beginPath(); x.arc(BX + v * Math.cos(a) * SC * t, BY - v * Math.sin(a) * SC * t + .5 * G * t * t, 3, 0, 7); x.fill(); } x.fillStyle = '#ff8a2a'; x.beginPath(); x.arc(BX, BY, 11, 0, 7); x.fill(); }
      if (s.ball) { x.fillStyle = '#ff8a2a'; x.beginPath(); x.arc(s.ball.x, s.ball.y, 11, 0, 7); x.fill(); x.strokeStyle = '#6b2f00'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(s.ball.x - 11, s.ball.y); x.lineTo(s.ball.x + 11, s.ball.y); x.stroke(); }
      rr(x, 10, 50, 22, 120, 8); x.fillStyle = 'rgba(0,0,0,.5)'; x.fill(); const gp = s.hold ? s.charge : 0; x.fillStyle = gp > .75 ? '#ff4d4d' : gp > .4 ? '#ffd34d' : '#2ecc71'; x.fillRect(14, 166 - 112 * gp, 14, 112 * gp); txt(x, 'güç', 21, 180, 11, '#fff');
      const v = s.hold ? vOf() : null; rr(x, 40, 50, 210, 52, 10); x.fillStyle = 'rgba(0,0,0,.5)'; x.fill(); x.textAlign = 'left'; x.fillStyle = '#fff'; x.font = '700 13px Nunito'; x.fillText('θ = ' + f1(s.ang) + '°' + (v ? ' · v₀ = ' + f1(v) + ' m/s' : ''), 50, 68); x.font = '13px Nunito'; x.fillStyle = '#9ff'; x.fillText(v ? 'vₓ = ' + f1(v * Math.cos(a)) + ' m/s' : 'basılı tut ve güç seç', 50, 88); if (v) { x.fillStyle = '#fc9'; x.fillText('v_y = ' + f1(v * Math.sin(a)) + ' m/s', 140, 88); }
      if (s.mt > 0) { x.globalAlpha = clamp(s.mt, 0, 1); txt(x, s.msg, LW / 2, 30, 20, '#fff', true); x.globalAlpha = 1; }
      A.drawParts(dt); A.end();
    }
    A.intro('🏀', 'Pota Atışı', '60 saniyede olabildiğince çok sayı at! Açı ve güçle eğik atış yörüngesini ayarla. Uzak atış ve seri bonus verir, “swish” ekstra puandır!', start);
    return A.destroy;
  }

  /* ---------- Kayıt ---------- */
  function reg(target, list, wrap) {
    const old = {}; Object.keys(target).forEach(k => { old[k] = target[k]; delete target[k]; });
    list.forEach(g => { target[g.id] = wrap(g); }); Object.keys(old).forEach(k => { target[k] = old[k]; });
  }
  if (typeof GAMES !== 'undefined' && typeof GAME_FN !== 'undefined') {
    const L = [{ id: 'uyaran', title: 'Uyaran Yağmuru', ico: '🌧️', desc: 'Hedef reseptörün uyaranlarını yakala — arcade!', fn: gUyaran }, { id: 'kosu', title: 'Nöron Koşusu', ico: '⚡', desc: 'Sinir impulsu olarak engelleri aş, miyelin topla.', fn: gKosu }, { id: 'cekic', title: 'Refleks Çekici', ico: '🔨', desc: '60 sn: doğru organa hızlıca vur!', fn: gCekic }];
    reg(GAMES, L, g => ({ title: g.title, ico: g.ico, desc: g.desc })); L.forEach(g => GAME_FN[g.id] = g.fn);
  }
  if (typeof FGAMES !== 'undefined') {
    const L = [{ id: 'mancinik', title: 'Mancınık', ico: '🏹', desc: 'Sürükle-bırak, yaratıkları vur: eğik atış arcade!', fn: gMancinik }, { id: 'erzak', title: 'Erzak Atışı', ico: '📦', desc: 'Uçaktan kasa bırak, tekneyi vur (yatay atış).', fn: gErzak }, { id: 'pota', title: 'Pota Atışı', ico: '🏀', desc: '60 sn’de en çok sayıyı at (eğik atış).', fn: gPota }];
    reg(FGAMES, L, g => ({ title: g.title, ico: g.ico, desc: g.desc, fn: g.fn }));
  }
})();
