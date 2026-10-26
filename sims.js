/* Nasse Biology — simülasyonlar (her birinin öncesinde görev, sonrasında gözlem sorusu var) */
const SIMS = {
  esik: { title: 'Eşik Değer ve Merdiven Etkisi', ico: '📏', topic: 'esik' },
  ap: { title: 'Aksiyon Potansiyeli Dalgası', ico: '🔋', topic: 'zar' },
  sinaps: { title: 'Kimyasal Sinaps', ico: '🔗', topic: 'sinaps' },
  spike: { title: 'Sıcaklık ve Uyartı Sıklığı', ico: '🌡️', topic: 'siddet' }
};
const SIM_META = {
  esik: {
    task: 'Önce “Tek nöron” modunda uyaran şiddetini 0’dan 100’e doğru kademeli artırıp her adımda “Uyaran uygula” düğmesine bas. Sonra “Sinir demeti” moduna geçip aynı işlemi tekrar et. Tepki grafiğinin iki modda nasıl farklılaştığını gözle.',
    q: { q: 'Gözlemine göre sinir demetinde tepki şiddetinin kademeli artmasının nedeni nedir?', o: ['Aksonların farklı eşik değerlere sahip olması', 'Tüm aksonların aynı eşik değere sahip olması', 'Uyartı iletim hızının artması', 'Miyelin kılıfın kalınlaşması'], a: 0, e: 'Sinir demetinde farklı aksonlar farklı eşik değerlere sahiptir; uyaran arttıkça daha fazla akson uyarılır ve tepki kademeli artar (merdiven etkisi). Tek nöron ise ya hep ya hiç yasasına uyar.' }
  },
  ap: {
    task: '“Uyartı gönder” düğmesine bas ve dalga ilerlerken akson bölgelerinin yüklerini izle. Her bölgenin sırasıyla hangi evrelerden (polarizasyon, depolarizasyon, repolarizasyon) geçtiğine dikkat et. “Yavaş çekim”i açarak dış (üst) ve iç (alt) yükleri karşılaştır.',
    q: { q: 'Gözlemine göre bir bölgeden ikinci bir uyartının geçebilmesi için ne tamamlanmalıdır?', o: ['Depolarizasyon', 'Repolarizasyon', 'Miyelin kılıf oluşumu', 'Sinaps oluşumu'], a: 1, e: 'Repolarizasyon olmadan o bölgeden ikinci bir uyartı geçemez; bölge dinlenme potansiyeline dönmelidir.' }
  },
  sinaps: {
    task: 'Önce “Kolaylaştırıcı sinaps” seçiliyken uyartı gönder ve komşu hücrenin tepkisini gözle. Sonra “Durdurucu sinaps” seçip aynısını yap. Ardından nörotransmitterleri “Enzimle parçala” ve “Geri al” düğmeleriyle ortadan kaldırıp farkı izle.',
    q: { q: 'Durdurucu sinapsta komşu hücrede ne gözlemledin?', o: ['Depolarizasyon oluştu, uyartı iletildi', 'Hiperpolarizasyon oluştu, uyartı iletilmedi', 'Nörotransmitter hiç salınmadı', 'Miyelin kılıf oluştu'], a: 1, e: 'Durdurucu sinapslarda nörotransmitterler yüksek polarizasyona (hiperpolarizasyon) yol açarak uyartı iletimini engeller; böylece gereksiz tepkiler verilmez.' }
  },
  spike: {
    task: 'Sıcaklık kaydırıcısını 20 °C’de başlat, sonra 45 °C’ye doğru artır. Her sıcaklıkta kaç nöronun uyarıldığını ve uyartıların ne kadar sık geldiğini gözle.',
    q: { q: 'Sıcaklık arttıkça sinir liflerinde hangi değişim gözlendi?', o: ['İletim hızı arttı', 'Uyartı sayısı ve sıklığı arttı', 'Akson çapı kalınlaştı', 'Uyartı oluşmadı'], a: 1, e: 'Uyaran şiddeti arttıkça uyarılan nöron sayısı, uyartı sayısı ve sıklığı artar; beyin sıcaklığı bu sıklık ve sayıya göre algılar. İletim hızı değişmez.' }
  }
};

function cv(box, h) {
  const c = document.createElement('canvas'); const w = Math.min(box.clientWidth || 340, 760);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  c.width = w * dpr; c.height = h * dpr; c.style.width = '100%'; c.style.maxWidth = w + 'px'; c.style.height = 'auto'; c.style.aspectRatio = w + '/' + h;
  const x = c.getContext('2d'); x.scale(dpr, dpr); c.W = w; c.H = h; box.appendChild(c); return [c, x];
}
function rr(x, a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }

/* ---- Her sim bir "dispose" fonksiyonu döndürür ---- */
function simEsik(box) {
  const ctl = document.createElement('div'); ctl.className = 'ctl';
  ctl.innerHTML = `<div class="seg"><label><input type="radio" name="em" value="s" checked> Tek nöron</label><label><input type="radio" name="em" value="d"> Sinir demeti</label></div>
  <label class="sl">Uyaran şiddeti: <b id="ev">0</b><input type="range" id="er" min="0" max="100" value="0"></label>
  <div class="btns"><button class="btn" id="eu">⚡ Uyaran uygula</button><button class="btn alt" id="ea">▶ Otomatik tara</button><button class="btn ghost" id="ec">Temizle</button></div>`;
  box.appendChild(ctl);
  const [c, x] = cv(box, 300);
  const out = document.createElement('div'); out.className = 'readout'; box.appendChild(out);
  let pts = { s: [], d: [] }, mode = 's', cur = 0, raf, sweep = null;
  const TH = [15, 25, 35, 45, 55, 65, 75, 85], SINGLE = 30;
  const resp = (i, m) => m === 's' ? (i >= SINGLE ? 100 : 0) : TH.filter(t => i >= t).length / TH.length * 100;
  function draw() {
    x.clearRect(0, 0, c.W, c.H);
    const L = 48, R = c.W - 16, T = 18, Bt = c.H - 40;
    x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(L, T); x.lineTo(L, Bt); x.lineTo(R, Bt); x.stroke();
    x.fillStyle = '#cfe8ff'; x.font = '12px Nunito,sans-serif'; x.textAlign = 'center';
    x.fillText('Uyaran şiddeti →', (L + R) / 2, c.H - 10);
    x.save(); x.translate(14, (T + Bt) / 2); x.rotate(-Math.PI / 2); x.fillText('Tepki şiddeti →', 0, 0); x.restore();
    const px = v => L + v / 100 * (R - L), py = v => Bt - v / 100 * (Bt - T);
    const col = mode === 's' ? '#4de1c0' : '#ffd34d';
    x.strokeStyle = col; x.fillStyle = col; x.lineWidth = 2;
    const arr = pts[mode].slice().sort((a, b) => a[0] - b[0]);
    if (arr.length > 1) { x.beginPath(); arr.forEach((p, i) => i ? x.lineTo(px(p[0]), py(p[1])) : x.moveTo(px(p[0]), py(p[1]))); x.stroke(); }
    arr.forEach(p => { x.beginPath(); x.arc(px(p[0]), py(p[1]), 4, 0, 7); x.fill(); });
    x.strokeStyle = '#ff7a9a'; x.setLineDash([5, 4]); x.beginPath(); x.moveTo(px(cur), T); x.lineTo(px(cur), Bt); x.stroke(); x.setLineDash([]);
    const r = resp(cur, mode); x.fillStyle = '#fff'; x.beginPath(); x.arc(px(cur), py(r), 6, 0, 7); x.fill();
    if (mode === 'd') { const n = TH.filter(t => cur >= t).length; out.innerHTML = `Uyarılan akson: <b>${n}/8</b> · Tepki şiddeti: <b>%${Math.round(r)}</b>`; }
    else out.innerHTML = `Nöron tepkisi: <b>${r ? 'VAR (maksimum, %100)' : 'YOK (uyartı oluşmadı)'}</b>`;
  }
  const rg = ctl.querySelector('#er'), ev = ctl.querySelector('#ev');
  rg.oninput = () => { cur = +rg.value; ev.textContent = cur; draw(); };
  ctl.querySelectorAll('[name=em]').forEach(r => r.onchange = () => { mode = r.value; draw(); });
  ctl.querySelector('#eu').onclick = () => { const r = resp(cur, mode); pts[mode] = pts[mode].filter(p => p[0] !== cur); pts[mode].push([cur, r]); draw(); };
  ctl.querySelector('#ec').onclick = () => { pts = { s: [], d: [] }; sweep = null; draw(); };
  ctl.querySelector('#ea').onclick = () => { pts[mode] = []; sweep = 0; };
  (function loop() { raf = requestAnimationFrame(loop); if (sweep !== null) { cur = Math.min(100, sweep); rg.value = cur; ev.textContent = Math.round(cur); pts[mode].push([cur, resp(cur, mode)]); sweep += 2; if (sweep > 102) sweep = null; draw(); } })();
  draw();
  return () => cancelAnimationFrame(raf);
}

function simAP(box) {
  const ctl = document.createElement('div'); ctl.className = 'ctl';
  ctl.innerHTML = `<div class="btns"><button class="btn" id="ag">⚡ Uyartı gönder</button><label class="chk"><input type="checkbox" id="as"> Yavaş çekim</label></div>
  <div class="legend"><span class="lg l1"></span>Polarizasyon (dış +, iç −) <span class="lg l2"></span>Depolarizasyon (dış −, iç +) <span class="lg l3"></span>Repolarizasyon (dış +, iç − hâline dönüş)</div>`;
  box.appendChild(ctl);
  const [c, x] = cv(box, 260);
  const out = document.createElement('div'); out.className = 'readout'; out.textContent = 'Uyartı bekleniyor…'; box.appendChild(out);
  let p = -10, raf, last = performance.now();
  const N = 16, slow = ctl.querySelector('#as');
  ctl.querySelector('#ag').onclick = () => { p = -1; };
  function state(i) { const d = p - i; if (p < -5 || d < 0) return 0; if (d < 1.2) return 1; if (d < 3) return 2; return 0; }
  function draw() {
    x.clearRect(0, 0, c.W, c.H);
    const L = 30, wSeg = (c.W - 60) / N, y0 = 100, hh = 60;
    x.fillStyle = '#cfe8ff'; x.font = '12px Nunito,sans-serif'; x.textAlign = 'left'; x.fillText('Dendrit / hücre gövdesi', 6, 22); x.textAlign = 'right'; x.fillText('Akson ucu', c.W - 6, 22);
    x.textAlign = 'center'; x.fillText('Uyartının ilerleme yönü →', c.W / 2, 22);
    for (let i = 0; i < N; i++) {
      const s = state(i), X = L + i * wSeg; const colors = ['#2a6fdb', '#e5484d', '#f59e0b'];
      x.fillStyle = colors[s]; rr(x, X + 1, y0, wSeg - 2, hh, 6); x.fill();
      x.fillStyle = '#fff'; x.font = 'bold 15px Nunito,sans-serif';
      const o = s === 1 ? '−' : '+', n = s === 1 ? '+' : '−';
      x.fillText(o, X + wSeg / 2, y0 - 12); x.fillText(n, X + wSeg / 2, y0 + hh + 22);
    }
    x.fillStyle = '#9fc4ff'; x.font = '12px Nunito,sans-serif'; x.textAlign = 'left'; x.fillText('Hücre dışı', 6, y0 - 12); x.fillText('Hücre içi', 6, y0 + hh + 22);
    const idx = Math.round(p);
    if (p < -5) out.textContent = 'Uyartı bekleniyor…';
    else if (p > N + 3) out.textContent = 'Uyartı aksonun ucuna ulaştı; tüm bölgeler tekrar polarizasyonda.';
    else out.innerHTML = `Dalga <b>${Math.max(1, Math.min(N, idx + 1))}. bölgede</b>: kırmızı = depolarizasyon, turuncu = repolarizasyon.`;
  }
  (function loop(now) { raf = requestAnimationFrame(loop); const dt = (now - last) / 1000; last = now; if (p > -5 && p < N + 4) p += dt * (slow.checked ? 1.2 : 5); draw(); })(performance.now());
  return () => cancelAnimationFrame(raf);
}

function simSinaps(box) {
  const ctl = document.createElement('div'); ctl.className = 'ctl';
  ctl.innerHTML = `<div class="seg"><label><input type="radio" name="st" value="f" checked> Kolaylaştırıcı sinaps</label><label><input type="radio" name="st" value="i"> Durdurucu sinaps</label></div>
  <div class="btns"><button class="btn" id="sg">⚡ Uyartı gönder</button><button class="btn alt" id="se">✂️ Enzimle parçala</button><button class="btn alt" id="sb">↩️ Geri al</button></div>`;
  box.appendChild(ctl);
  const [c, x] = cv(box, 340);
  const out = document.createElement('div'); out.className = 'readout'; out.textContent = 'Uyartı göndererek başla.'; box.appendChild(out);
  let parts = [], raf, post = 0, type = 'f', sig = -1, last = performance.now(), cleared = '';
  ctl.querySelectorAll('[name=st]').forEach(r => r.onchange = () => { type = r.value; parts = []; post = 0; cleared = ''; out.textContent = 'Uyartı göndererek başla.'; });
  ctl.querySelector('#sg').onclick = () => { sig = 0; parts = []; post = 0; cleared = ''; out.textContent = 'Uyartı akson ucuna ulaşıyor…'; };
  ctl.querySelector('#se').onclick = () => { parts.forEach(p => { if (p.st === 'rest' || p.st === 'bound') p.st = 'break'; }); cleared = 'e'; out.textContent = 'Enzimler nörotransmitterleri parçalıyor; ortam yeni uyarıya hazırlanıyor.'; };
  ctl.querySelector('#sb').onclick = () => { parts.forEach(p => { if (p.st === 'rest' || p.st === 'bound') p.st = 'back'; }); cleared = 'b'; out.textContent = 'Nörotransmitterler tekrar hücre içine alınıyor.'; };
  function draw(dt) {
    const W = c.W, mid = W / 2; x.clearRect(0, 0, W, c.H);
    x.fillStyle = '#2f6fe0'; rr(x, mid - 120, 20, 240, 110, 40); x.fill();
    x.fillStyle = '#cfe8ff'; x.font = '12px Nunito,sans-serif'; x.textAlign = 'center'; x.fillText('Akson ucu (sinaptik yumru)', mid, 16);
    for (let i = 0; i < 4; i++) { x.fillStyle = 'rgba(255,255,255,.25)'; x.beginPath(); x.arc(mid - 75 + i * 50, 80, 20, 0, 7); x.fill(); x.fillStyle = '#ffc93c'; for (let k = 0; k < 4; k++) { x.beginPath(); x.arc(mid - 75 + i * 50 + Math.cos(k * 1.6) * 8, 80 + Math.sin(k * 1.6) * 8, 3, 0, 7); x.fill(); } }
    const pc = post > 0 ? (type === 'f' ? '#f5c542' : '#e5484d') : '#8f6be8';
    x.fillStyle = pc; rr(x, mid - 160, 250, 320, 70, 28); x.fill();
    x.fillStyle = '#cfe8ff'; x.fillText('Komşu hücre (dendrit zarı)', mid, 338);
    for (let i = 0; i < 4; i++) { x.fillStyle = '#2a4ec9'; x.fillRect(mid - 110 + i * 70, 238, 24, 14); }
    x.fillStyle = '#9fc4ff'; x.fillText('Sinaps boşluğu', mid + 190 > W ? W - 55 : mid + 190, 190);
    if (sig >= 0 && sig < 1) { sig += dt * .8; x.fillStyle = '#fff'; x.beginPath(); x.arc(mid, 0 + sig * 40, 8, 0, 7); x.fill(); if (sig >= 1) { for (let i = 0; i < 36; i++) { const k = i % 4; parts.push({ x: mid - 75 + k * 50 + (Math.random() - .5) * 20, y: 95, tx: mid - 105 + (i % 4) * 70 + 12, st: 'fall', v: 40 + Math.random() * 40, wob: Math.random() * 6 }); } out.textContent = 'Nörotransmitterler sinaps boşluğuna salındı.'; } }
    parts.forEach(p => {
      if (p.st === 'fall') { p.y += p.v * dt; p.x += (p.tx - p.x) * dt * .8 + Math.sin(p.y / 12 + p.wob) * .4; if (p.y >= 232) { p.y = 232; p.st = 'bound'; } }
      else if (p.st === 'break') { p.y += dt * 20; p.a = (p.a === undefined ? 1 : p.a) - dt * .5; }
      else if (p.st === 'back') { p.y -= dt * 70; p.x += (mid - p.x) * dt * .5; if (p.y < 100) p.a = 0; }
      const a = p.a === undefined ? 1 : Math.max(0, p.a); if (a <= 0) return;
      x.globalAlpha = a; x.fillStyle = p.st === 'break' ? '#c9a21a' : '#ffc93c'; x.beginPath(); x.arc(p.x, p.y, p.st === 'break' ? 2 : 4, 0, 7); x.fill(); x.globalAlpha = 1;
    });
    const bound = parts.filter(p => p.st === 'bound').length;
    if (bound > 8 && !cleared) { post = 1; out.innerHTML = type === 'f' ? '✅ <b>Kolaylaştırıcı sinaps:</b> depolarizasyon → uyartı komşu hücreye iletildi.' : '⛔ <b>Durdurucu sinaps:</b> hiperpolarizasyon (yüksek polarizasyon) → uyartı iletilmedi.'; }
    if (post > 0) { x.fillStyle = '#fff'; x.font = 'bold 16px Nunito,sans-serif'; x.fillText(type === 'f' ? '→ uyartı iletilir' : '✖ uyartı engellenir', mid, 290); }
  }
  (function loop(now) { raf = requestAnimationFrame(loop); const dt = Math.min((now - last) / 1000, .05); last = now; draw(dt); })(performance.now());
  return () => cancelAnimationFrame(raf);
}

function simSpike(box) {
  const ctl = document.createElement('div'); ctl.className = 'ctl';
  ctl.innerHTML = `<label class="sl">Nesnenin sıcaklığı: <b id="tv">20</b> °C<input type="range" id="tr" min="20" max="45" value="20"></label>`;
  box.appendChild(ctl);
  const [c, x] = cv(box, 240);
  const out = document.createElement('div'); out.className = 'readout'; box.appendChild(out);
  let T = 20, raf, last = performance.now(), off = 0, trains = [];
  const rg = ctl.querySelector('#tr'), tv = ctl.querySelector('#tv');
  rg.oninput = () => { T = +rg.value; tv.textContent = T; trains = []; };
  function rate() { return 1.2 + (T - 20) / 25 * 8; }
  function fibers() { return 1 + Math.round((T - 20) / 25 * 3); }
  (function loop(now) {
    raf = requestAnimationFrame(loop); const dt = (now - last) / 1000; last = now; off += dt * 90;
    x.clearRect(0, 0, c.W, c.H); const f = fibers(), r = rate();
    for (let k = 0; k < 4; k++) {
      const y = 40 + k * 48, on = k < f; x.strokeStyle = on ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.12)'; x.lineWidth = 1; x.beginPath(); x.moveTo(60, y); x.lineTo(c.W - 10, y); x.stroke();
      x.fillStyle = on ? '#ffd34d' : '#6b7fa5'; x.font = '12px Nunito,sans-serif'; x.textAlign = 'left'; x.fillText('Nöron ' + (k + 1), 4, y + 4);
      if (!on) continue; x.strokeStyle = '#ff9a5c'; x.lineWidth = 2;
      const gap = 90 / r; for (let s = ((off + k * 17) % gap); s < c.W - 70; s += gap) { const sx = c.W - 10 - s; x.beginPath(); x.moveTo(sx, y); x.lineTo(sx + 2, y - 22); x.lineTo(sx + 4, y); x.stroke(); }
    }
    const nm = T <= 25 ? 'ılık / serin' : T <= 38 ? 'ılık' : 'sıcak';
    out.innerHTML = `Uyarılan nöron: <b>${f}</b> · Uyartı sıklığı: <b>${r < 3 ? 'az' : r < 6 ? 'orta' : 'çok'}</b> · Beynin algısı: <b>${nm}</b>`;
  })(performance.now());
  return () => cancelAnimationFrame(raf);
}
const SIM_FN = { esik: simEsik, ap: simAP, sinaps: simSinaps, spike: simSpike };
