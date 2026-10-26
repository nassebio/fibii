/* Nasse Fizik — Atış simülasyon motoru (2B, sabit ivme, isteğe bağlı hava direnci, eğik düzlem, çoklu cisim) */
(function () {
  const fmt = (v, d) => { if (!isFinite(v)) return '—'; if (Math.abs(v) < 5e-10) v = 0; return v.toFixed(d === undefined ? 2 : d).replace('.', ','); };
  const nice = x => { const e = Math.pow(10, Math.floor(Math.log10(x))), f = x / e; return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * e; };
  const rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI;
  window.PHFMT = fmt;
  const GSEL = [['10', 'Dünya (g = 10 m/s²)'], ['9.8', 'Dünya (g = 9,8 m/s²)'], ['1.6', 'Ay (g = 1,6 m/s²)'], ['3.7', 'Mars (g = 3,7 m/s²)'], ['24.8', 'Jüpiter (g = 24,8 m/s²)']];
  window.PH_G = GSEL;

  function simulate(b, gfun) {
    const dt = .004, tmax = 150; let t = 0, x = b.x0, y = b.y0, vx = b.vx, vy = b.vy;
    const T = [0], X = [x], Y = [y], VX = [vx], VY = [vy];
    while (t < tmax) {
      let ax = b.ax || 0, ay = -b.g;
      if (b.k) { const sp = Math.hypot(vx, vy); ax -= b.k * sp * vx; ay -= b.k * sp * vy; }
      const nx = x + vx * dt + .5 * ax * dt * dt, ny = y + vy * dt + .5 * ay * dt * dt, nvx = vx + ax * dt, nvy = vy + ay * dt;
      if (!b.stay && ny < gfun(nx)) {
        const g0 = y - gfun(x), g1 = ny - gfun(nx); let f = g0 - g1 !== 0 ? g0 / (g0 - g1) : 0; f = Math.max(0, Math.min(1, f));
        T.push(t + f * dt); X.push(x + (nx - x) * f); Y.push(y + (ny - y) * f); VX.push(vx + (nvx - vx) * f); VY.push(vy + (nvy - vy) * f); b.landed = true; break;
      }
      t += dt; x = nx; y = ny; vx = nvx; vy = nvy; T.push(t); X.push(x); Y.push(y); VX.push(vx); VY.push(vy);
    }
    b.S = { T, X, Y, VX, VY };
  }
  function at(b, t) {
    const S = b.S, n = S.T.length; if (n < 2) return { x: S.X[0], y: S.Y[0], vx: S.VX[0], vy: S.VY[0], t: 0 };
    t = Math.max(0, Math.min(t, S.T[n - 1])); let i = Math.min(Math.floor(t / .004), n - 2);
    while (i < n - 2 && S.T[i + 1] < t) i++; while (i > 0 && S.T[i] > t) i--;
    const d = S.T[i + 1] - S.T[i], f = d > 0 ? (t - S.T[i]) / d : 0, L = (a) => a[i] + (a[i + 1] - a[i]) * f;
    return { t, x: L(S.X), y: L(S.Y), vx: L(S.VX), vy: L(S.VY) };
  }
  window.PH_at = at;

  window.PHLab = function (box, cfg) {
    const root = document.createElement('div'); root.className = 'phlab'; box.appendChild(root);
    const P = {}; (cfg.controls || []).forEach(c => P[c.k] = c.val);
    const vis = Object.assign({ v: true, vx: true, vy: true, a: false, path: true, strobe: false, proj: false, lab: true, axes: false }, cfg.vis || {});
    let full = false, bodies = [], gfun = () => 0, alpha = 0, Tmax = 1, t = 0, playing = false, speed = 1, graph = cfg.graph || 'yt', hitInfo = null, rows = [], raf = 0, alive = true, msg = '';
    /* ---- arayüz ---- */
    root.innerHTML = `<div class="phcv"><canvas class="phmain"></canvas><div class="phbanner"></div></div>
      <div class="phbar"><button class="btn" data-a="play">▶ Fırlat</button><button class="btn ghost" data-a="reset">⏮ Başa al</button>
        <label class="phsp">Hız <select data-a="speed"><option value=".1">0,1×</option><option value=".25">0,25×</option><option value=".5">0,5×</option><option value="1" selected>1×</option><option value="2">2×</option></select></label>
        <input type="range" class="phscrub" min="0" max="1000" value="0"><span class="phtime">t = 0,00 s</span></div>
      <div class="phgrid"><div class="phctl"></div>
        <div class="phright"><div class="phvis"></div><div class="phread"></div></div></div>
      <div class="phgraphbox"><div class="phgbar"></div><canvas class="phgraph"></canvas></div>
      <div class="phform"></div>
      <div class="phdata"><div class="phdbar"><b>📋 Veri tablosu</b><button class="btn alt" data-a="rec">📌 Ölçüm al (şu an)</button><button class="btn ghost" data-a="clr">🗑 Temizle</button></div><div class="phtbl"></div></div>`;
    const $ = s => root.querySelector(s), cv = $('.phmain'), x = cv.getContext('2d'), gc = $('.phgraph'), gx = gc.getContext('2d');
    /* kontroller */
    const ctlBox = $('.phctl');
    (cfg.controls || []).forEach(c => {
      const w = document.createElement('div'); w.className = 'phc'; w.dataset.k = c.k;
      if (c.type === 'select') w.innerHTML = `<label>${c.label}<select data-k="${c.k}">${c.opts.map(o => `<option value="${o[0]}" ${String(o[0]) === String(c.val) ? 'selected' : ''}>${o[1]}</option>`).join('')}</select></label>`;
      else if (c.type === 'check') w.innerHTML = `<label class="chk"><input type="checkbox" data-k="${c.k}" ${c.val ? 'checked' : ''}> ${c.label}</label>`;
      else w.innerHTML = `<label>${c.label}: <b data-v="${c.k}">${fmt(c.val, c.dec === undefined ? (c.step < 1 ? 1 : 0) : c.dec)}</b> ${c.unit || ''}<input type="range" data-k="${c.k}" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.val}"></label>`;
      ctlBox.appendChild(w);
    });
    ctlBox.addEventListener('input', e => {
      const el = e.target, k = el.dataset.k; if (!k) return; const c = cfg.controls.find(z => z.k === k);
      P[k] = el.type === 'checkbox' ? el.checked : (el.tagName === 'SELECT' ? parseFloat(el.value) : parseFloat(el.value));
      if (el.type === 'range') root.querySelector(`[data-v="${k}"]`).textContent = fmt(P[k], c.dec === undefined ? (c.step < 1 ? 1 : 0) : c.dec);
      rebuild(true);
    });
    function syncUI() { cfg.controls.forEach(c => { const el = ctlBox.querySelector(`[data-k="${c.k}"]`), ok = c.show ? c.show(P) : true; el.closest('.phc').style.display = ok ? '' : 'none'; if (el.type === 'range') { el.value = P[c.k]; const v = root.querySelector(`[data-v="${c.k}"]`); if (v) v.textContent = fmt(P[c.k], c.dec === undefined ? (c.step < 1 ? 1 : 0) : c.dec); } else if (el.type === 'checkbox') el.checked = !!P[c.k]; else el.value = P[c.k]; }); }
    /* görünüm seçenekleri */
    const visBox = $('.phvis'); const VIS = [['v', 'v (bileşke hız)'], ['vx', 'vₓ'], ['vy', 'v_y'], ['a', 'ivme'], ['path', 'yörünge'], ['strobe', 'stroboskop'], ['proj', 'izdüşümler'], ['lab', 'değerler']];
    if (cfg.incline) VIS.push(['axes', 'düzlem eksenleri']);
    visBox.innerHTML = '<b>Göster:</b> ' + VIS.map(v => `<label class="chk sm"><input type="checkbox" data-vis="${v[0]}" ${vis[v[0]] ? 'checked' : ''}> ${v[1]}</label>`).join('');
    visBox.addEventListener('change', e => { const k = e.target.dataset.vis; if (k) vis[k] = e.target.checked; });
    /* grafik seçici */
    const GR = [['yt', 'y–t'], ['xt', 'x–t'], ['vxt', 'vₓ–t'], ['vyt', 'v_y–t'], ['vt', '|v|–t'], ['ayt', 'a_y–t'], ['yx', 'yörünge y–x'], ['Et', 'enerji–t']];
    (cfg.graphs ? GR.filter(g => cfg.graphs.includes(g[0])) : GR).forEach(g => { const b = document.createElement('button'); b.className = 'btn ghost sm' + (g[0] === graph ? ' on' : ''); b.textContent = g[1]; b.dataset.g = g[0]; $('.phgbar').appendChild(b); });
    $('.phgbar').addEventListener('click', e => { const g = e.target.dataset.g; if (!g) return; graph = g; $$('.phgbar button').forEach(b => b.classList.toggle('on', b.dataset.g === g)); });
    const $$ = s => [...root.querySelectorAll(s)];
    /* düğmeler */
    root.addEventListener('click', e => {
      const a = e.target.closest('[data-a]'); if (!a) return; const k = a.dataset.a;
      if (k === 'play') { if (t >= Tmax - 1e-6) t = 0; playing = !playing; if (playing) hitInfo = hitInfo; }
      if (k === 'reset') { t = 0; playing = false; }
      if (k === 'rec') record();
      if (k === 'clr') { rows = []; drawTable(); }
      $('[data-a="play"]').textContent = playing ? '⏸ Duraklat' : (t > 0 && t < Tmax ? '▶ Devam' : '▶ Fırlat');
    });
    $('[data-a="speed"]').onchange = e => { speed = parseFloat(e.target.value); };
    $('.phscrub').oninput = e => { t = e.target.value / 1000 * Tmax; playing = false; $('[data-a="play"]').textContent = '▶ Devam'; };
    /* ---- model kurulumu ---- */
    function rebuild(keepRows) {
      if (cfg.constrain) cfg.constrain(P); syncUI();
      const m = cfg.build(P); bodies = m.bodies; alpha = m.alpha || 0; full = !!m.full; const ta = Math.tan(rad(alpha));
      gfun = m.ground || (xx => xx > 0 ? ta * xx : 0);
      bodies.forEach(b => { b.landed = false; simulate(b, gfun); });
      hitInfo = null;
      if (m.collide) { const [i, j, r] = m.collide, A = bodies[i].S, B = bodies[j].S, n = Math.min(A.T.length, B.T.length); for (let q = 0; q < n; q++) if (Math.hypot(A.X[q] - B.X[q], A.Y[q] - B.Y[q]) < r) { hitInfo = { t: A.T[q], x: A.X[q], y: A.Y[q] }; [A, B].forEach(S => { S.T.length = S.X.length = S.Y.length = S.VX.length = S.VY.length = q + 1; }); break; } }
      Tmax = Math.max(...bodies.map(b => b.S.T[b.S.T.length - 1])); if (Tmax < .05) Tmax = .05;
      bodies.forEach(b => stats(b));
      t = 0; playing = false; $('[data-a="play"]').textContent = '▶ Fırlat'; fit(); if (!keepRows) rows = []; drawTable(); drawForm();
    }
    function stats(b) {
      const S = b.S, n = S.T.length; let im = 0; for (let i = 0; i < n; i++) if (S.Y[i] > S.Y[im]) im = i;
      const l = n - 1; b.st = { T: S.T[l], R: S.X[l] - S.X[0], xl: S.X[l], yl: S.Y[l], H: S.Y[im], tH: S.T[im], xH: S.X[im], vlx: S.VX[l], vly: S.VY[l], vl: Math.hypot(S.VX[l], S.VY[l]), L: Math.hypot(S.X[l] - S.X[0], S.Y[l] - S.Y[0]), v0x: S.VX[0], v0y: S.VY[0], v0: Math.hypot(S.VX[0], S.VY[0]) };
    }
    /* ---- ölçek ---- */
    let W = 600, H = 380, sc = 1, ox = 0, oy = 0;
    function fit() {
      W = Math.max(280, cv.parentNode.clientWidth || 600); H = Math.round(Math.max(270, Math.min(430, W * .56)));
      const dpr = Math.min(window.devicePixelRatio || 1, 2); cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px'; x.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gh = 150; gc.width = W * dpr; gc.height = gh * dpr; gc.style.height = gh + 'px'; gx.setTransform(dpr, 0, 0, dpr, 0, 0); gc._h = gh;
      let x0 = 0, x1 = 0, y0 = 0, y1 = 0;
      bodies.forEach(b => { const S = b.S; for (let i = 0; i < S.T.length; i += 5) { x0 = Math.min(x0, S.X[i]); x1 = Math.max(x1, S.X[i]); y0 = Math.min(y0, S.Y[i]); y1 = Math.max(y1, S.Y[i]); } x0 = Math.min(x0, S.X[S.X.length - 1]); x1 = Math.max(x1, S.X[S.X.length - 1]); y0 = Math.min(y0, S.Y[S.Y.length - 1]); y1 = Math.max(y1, S.Y[S.Y.length - 1]); });
      if (cfg.view) { const v = cfg.view(P); if (v) { x0 = Math.min(x0, v[0]); x1 = Math.max(x1, v[1]); y0 = Math.min(y0, v[2]); y1 = Math.max(y1, v[3]); } }
      const ta = Math.tan(rad(alpha)); if (alpha) { y0 = Math.min(y0, ta * x1, ta * x0, 0); y1 = Math.max(y1, ta * x1, ta * x0); }
      let xs = x1 - x0, ys = y1 - y0; if (xs < 1) xs = 1; if (ys < 1) ys = 1;
      const padX = 56, padT = 26, padB = 34; sc = Math.min((W - padX - 20) / (xs * 1.06), (H - padT - padB) / (ys * 1.12));
      ox = padX + ((W - padX - 20) - xs * sc) / 2 - x0 * sc; oy = H - padB - ((H - padT - padB) - ys * sc) / 2 + y0 * sc - (y0 < 0 ? 0 : 0);
      oy = H - padB + y0 * sc - ((H - padT - padB) - ys * sc) / 2;
    }
    const wx = X => ox + X * sc, wy = Y => oy - Y * sc;
    new ResizeObserver(() => { if (alive) { fit(); } }).observe(cv.parentNode);
    /* ---- çizim ---- */
    function arrow(x1, y1, x2, y2, col, lab, w) {
      const d = Math.hypot(x2 - x1, y2 - y1); if (d < 3) return; const a = Math.atan2(y2 - y1, x2 - x1);
      x.strokeStyle = col; x.fillStyle = col; x.lineWidth = w || 2.2; x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.stroke();
      x.beginPath(); x.moveTo(x2, y2); x.lineTo(x2 - 9 * Math.cos(a - .4), y2 - 9 * Math.sin(a - .4)); x.lineTo(x2 - 9 * Math.cos(a + .4), y2 - 9 * Math.sin(a + .4)); x.closePath(); x.fill();
      if (lab) { x.font = '700 12px Nunito,sans-serif'; x.fillText(lab, x2 + 6, y2 - 5); }
    }
    function drawScene() {
      x.clearRect(0, 0, W, H); const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0e3a6e'); g.addColorStop(1, '#09213f'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      /* ızgara */
      const xr0 = -ox / sc, xr1 = (W - ox) / sc, yr0 = (oy - H) / sc, yr1 = oy / sc, step = nice((xr1 - xr0) / 9);
      x.lineWidth = 1; x.font = '11px Nunito,sans-serif'; x.fillStyle = 'rgba(200,225,255,.7)'; x.textAlign = 'center';
      for (let gxv = Math.ceil(xr0 / step) * step; gxv <= xr1; gxv += step) { const px = wx(gxv); x.strokeStyle = 'rgba(255,255,255,.07)'; x.beginPath(); x.moveTo(px, 0); x.lineTo(px, H); x.stroke(); if (px > 36 && px < W - 8) x.fillText(fmt(gxv, step < 1 ? 1 : 0), px, H - 6); }
      x.textAlign = 'right'; for (let gyv = Math.ceil(yr0 / step) * step; gyv <= yr1; gyv += step) { const py = wy(gyv); x.strokeStyle = 'rgba(255,255,255,.07)'; x.beginPath(); x.moveTo(0, py); x.lineTo(W, py); x.stroke(); if (py > 14 && py < H - 14) x.fillText(fmt(gyv, step < 1 ? 1 : 0), 38, py + 4); }
      x.textAlign = 'left'; x.fillStyle = '#a9c6e6'; x.fillText('x (m)', W - 40, H - 18); x.fillText('y (m)', 6, 14);
      /* zemin / eğik düzlem */
      const ta = Math.tan(rad(alpha)); x.beginPath();
      if (alpha && full) { const xe = xr1 + 5, x00 = xr0 - 5; x.moveTo(wx(x00), wy(ta * x00)); x.lineTo(wx(xe), wy(ta * xe)); x.lineTo(wx(xe), H + 60); x.lineTo(wx(x00), H + 60); }
      else if (alpha) { const xe = xr1 + 5, x00 = xr0 - 5; x.moveTo(wx(x00), wy(0)); x.lineTo(wx(0), wy(0)); x.lineTo(wx(xe), wy(ta * xe)); x.lineTo(wx(xe), H + 40); x.lineTo(wx(x00), H + 40); }
      else { x.moveTo(0, wy(0)); x.lineTo(W, wy(0)); x.lineTo(W, H + 40); x.lineTo(0, H + 40); }
      x.closePath(); const gg = x.createLinearGradient(0, wy(0), 0, wy(0) + 70); gg.addColorStop(0, '#3a7a4b'); gg.addColorStop(1, '#1c3d2b'); x.fillStyle = gg; x.fill(); x.strokeStyle = '#7fe0a0'; x.lineWidth = 2; x.stroke();
      if (cfg.draw) cfg.draw(x, { wx, wy, sc, P, t, bodies, alpha });
      /* gövdeler */
      bodies.forEach((b, bi) => {
        const S = b.S, col = b.color || '#ffd34d', cur = at(b, Math.min(t, b.S.T[b.S.T.length - 1]));
        if (vis.path) { x.strokeStyle = col; x.globalAlpha = .28; x.setLineDash([5, 5]); x.lineWidth = 1.6; x.beginPath(); for (let i = 0; i < S.T.length; i += 4) { const px = wx(S.X[i]), py = wy(S.Y[i]); i ? x.lineTo(px, py) : x.moveTo(px, py); } x.lineTo(wx(S.X[S.X.length - 1]), wy(S.Y[S.Y.length - 1])); x.stroke(); x.setLineDash([]); x.globalAlpha = 1; }
        x.strokeStyle = col; x.lineWidth = 2.6; x.beginPath(); for (let i = 0; i < S.T.length && S.T[i] <= cur.t; i += 2) { const px = wx(S.X[i]), py = wy(S.Y[i]); i ? x.lineTo(px, py) : x.moveTo(px, py); } x.lineTo(wx(cur.x), wy(cur.y)); x.stroke();
        if (vis.strobe) { const dtS = nice(Tmax / 10); x.fillStyle = col; for (let q = 0; q * dtS <= cur.t + 1e-9; q++) { const s = at(b, q * dtS); x.globalAlpha = .45; x.beginPath(); x.arc(wx(s.x), wy(s.y), 5, 0, 7); x.fill(); x.globalAlpha = 1; x.fillStyle = '#fff'; x.font = '10px Nunito'; x.fillText(fmt(q * dtS, dtS < 1 ? 1 : 0) + ' s', wx(s.x) + 7, wy(s.y) - 6); x.fillStyle = col; } }
        if (b.st && vis.lab && bi === 0 && !b.noMarks) { /* tepe */
          if (b.st.tH > .01 && b.st.tH < b.st.T - .01 && cur.t >= b.st.tH) { x.fillStyle = '#fff'; x.beginPath(); x.arc(wx(b.st.xH), wy(b.st.H), 4, 0, 7); x.fill(); x.font = '700 11px Nunito'; x.fillText('tepe: ' + fmt(b.st.H, 1) + ' m', wx(b.st.xH) + 6, wy(b.st.H) - 6); }
          if (cur.t >= b.st.T - 1e-6 && b.landed) { x.fillStyle = '#ff6b6b'; x.beginPath(); x.arc(wx(b.st.xl), wy(b.st.yl), 5, 0, 7); x.fill(); x.fillText('R = ' + fmt(b.st.R, 1) + ' m', wx(b.st.xl) - 24, wy(b.st.yl) - 10); }
        }
        if (vis.proj) { x.strokeStyle = col; x.globalAlpha = .6; x.setLineDash([3, 4]); x.lineWidth = 1.3; x.beginPath(); x.moveTo(wx(cur.x), wy(cur.y)); x.lineTo(wx(cur.x), wy(0)); x.moveTo(wx(cur.x), wy(cur.y)); x.lineTo(wx(0), wy(cur.y)); x.stroke(); x.setLineDash([]); x.globalAlpha = 1; x.fillStyle = col; x.font = '700 11px Nunito'; x.textAlign = 'center'; x.fillText('x=' + fmt(cur.x, 1), wx(cur.x), wy(0) + 13 > H - 2 ? H - 2 : wy(0) + 13); x.textAlign = 'left'; x.fillText('y=' + fmt(cur.y, 1), wx(0) + 4, wy(cur.y) - 4); }
        /* vektörler */
        const spMax = Math.max(1, ...bodies.map(z => z.st ? Math.max(z.st.v0, z.st.vl, 1) : 1)), vs = 62 / spMax, px = wx(cur.x), py = wy(cur.y);
        if (b.noVec) { } else {
          if (vis.vx) { x.fillStyle = '#ff9b54'; arrow(px, py, px + cur.vx * vs, py, '#ff9b54', 'vₓ=' + fmt(cur.vx, 1)); }
          if (vis.vy) { x.fillStyle = '#5ee08a'; arrow(px, py, px, py - cur.vy * vs, '#5ee08a', 'v_y=' + fmt(cur.vy, 1)); }
          if (vis.v) { x.fillStyle = '#ffffff'; arrow(px, py, px + cur.vx * vs, py - cur.vy * vs, '#ffffff', 'v=' + fmt(Math.hypot(cur.vx, cur.vy), 1), 2.8); }
          if (vis.a) { const gs = 46 / Math.max(b.g, 1); x.fillStyle = '#ff6bd6'; arrow(px - 14, py, px - 14, py + b.g * gs, '#ff6bd6', 'g'); }
        }
        if (vis.axes && cfg.incline) { const ca = Math.cos(rad(alpha)), sa = Math.sin(rad(alpha)); x.fillStyle = '#9fe'; arrow(wx(0), wy(0), wx(0) + ca * 70, wy(0) - sa * 70, '#7fffd4', "x′ (düzlem)"); arrow(wx(0), wy(0), wx(0) - sa * 70, wy(0) - ca * 70, '#ffb3ff', "y′ (dik)"); }
        /* cisim */
        x.fillStyle = col; x.strokeStyle = '#fff'; x.lineWidth = 2; x.beginPath(); x.arc(px, py, b.r || 7, 0, 7); x.fill(); x.stroke();
        if (b.emoji) { x.font = '18px sans-serif'; x.fillText(b.emoji, px - 9, py + 6); }
      });
      if (hitInfo && t >= hitInfo.t - 1e-6) { x.font = '800 20px Baloo 2'; x.fillStyle = '#ffd34d'; x.fillText('💥 İSABET!', wx(hitInfo.x) + 10, wy(hitInfo.y) - 10); }
    }
    function curve(kind, b) {
      const S = b.S, n = S.T.length, step = Math.max(1, Math.floor(n / 500)), px = [], py = [];
      for (let i = 0; i < n; i += step) {
        const sp = Math.hypot(S.VX[i], S.VY[i]); let v;
        switch (kind) { case 'xt': px.push(S.T[i]); v = S.X[i]; break; case 'yt': px.push(S.T[i]); v = S.Y[i]; break; case 'vxt': px.push(S.T[i]); v = S.VX[i]; break; case 'vyt': px.push(S.T[i]); v = S.VY[i]; break; case 'vt': px.push(S.T[i]); v = sp; break;
          case 'ayt': px.push(S.T[i]); v = -b.g - (b.k ? b.k * sp * S.VY[i] : 0); break; case 'yx': px.push(S.X[i]); v = S.Y[i]; break; }
        py.push(v);
      } return [px, py];
    }
    function drawGraph() {
      const w = W, h = gc._h; gx.clearRect(0, 0, w, h); gx.fillStyle = 'rgba(0,0,0,.28)'; gx.fillRect(0, 0, w, h);
      const series = []; // [xs, ys, color, label]
      if (graph === 'Et') { const b = bodies[0], S = b.S, m = P.m || 1, xs = [], ek = [], ep = [], em = [], step = Math.max(1, Math.floor(S.T.length / 400)); for (let i = 0; i < S.T.length; i += step) { xs.push(S.T[i]); const e1 = .5 * m * (S.VX[i] ** 2 + S.VY[i] ** 2), e2 = m * b.g * S.Y[i]; ek.push(e1); ep.push(e2); em.push(e1 + e2); } series.push([xs, ek, '#ffb04d', 'Eₖ'], [xs, ep, '#5ee08a', 'Eₚ'], [xs, em, '#ffffff', 'E_mek']); }
      else bodies.forEach(b => { const [a, c] = curve(graph, b); series.push([a, c, b.color || '#ffd34d', b.name || '']); });
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity; series.forEach(s => { s[0].forEach(v => { x0 = Math.min(x0, v); x1 = Math.max(x1, v); }); s[1].forEach(v => { y0 = Math.min(y0, v); y1 = Math.max(y1, v); }); });
      if (graph !== 'yx') x0 = 0; if (y0 > 0 && graph !== 'yx') y0 = 0; if (y1 < 0) y1 = 0; if (y1 - y0 < 1e-6) { y1 += 1; y0 -= 1; } if (x1 - x0 < 1e-6) x1 = x0 + 1;
      const L = 48, R = w - 12, T = 12, B = h - 22, X = v => L + (v - x0) / (x1 - x0) * (R - L), Y = v => B - (v - y0) / (y1 - y0) * (B - T);
      gx.strokeStyle = 'rgba(255,255,255,.12)'; gx.fillStyle = '#a9c6e6'; gx.font = '10px Nunito'; gx.lineWidth = 1;
      const sy = nice((y1 - y0) / 4), sx = nice((x1 - x0) / 6); gx.textAlign = 'right';
      for (let v = Math.ceil(y0 / sy) * sy; v <= y1 + 1e-9; v += sy) { gx.beginPath(); gx.moveTo(L, Y(v)); gx.lineTo(R, Y(v)); gx.stroke(); gx.fillText(fmt(v, sy < 1 ? 1 : 0), L - 4, Y(v) + 3); }
      gx.textAlign = 'center'; for (let v = Math.ceil(x0 / sx) * sx; v <= x1 + 1e-9; v += sx) { gx.beginPath(); gx.moveTo(X(v), T); gx.lineTo(X(v), B); gx.stroke(); gx.fillText(fmt(v, sx < 1 ? 1 : 0), X(v), B + 12); }
      if (y0 < 0 && y1 > 0) { gx.strokeStyle = 'rgba(255,255,255,.4)'; gx.beginPath(); gx.moveTo(L, Y(0)); gx.lineTo(R, Y(0)); gx.stroke(); }
      gx.textAlign = 'left'; gx.fillStyle = '#cfe3ff'; const names = { yt: 'y (m) – t (s)', xt: 'x (m) – t (s)', vxt: 'vₓ (m/s) – t (s)', vyt: 'v_y (m/s) – t (s)', vt: '|v| (m/s) – t (s)', ayt: 'a_y (m/s²) – t (s)', yx: 'y (m) – x (m)', Et: 'Enerji (J, m=' + fmt(P.m || 1, 1) + ' kg) – t (s)' }; gx.font = '700 11px Nunito'; gx.fillText(names[graph] || '', L + 6, T + 10);
      series.forEach((s, si) => { gx.strokeStyle = s[2]; gx.lineWidth = 2.2; gx.beginPath(); s[0].forEach((v, i) => { const px = X(v), py = Y(s[1][i]); i ? gx.lineTo(px, py) : gx.moveTo(px, py); }); gx.stroke(); if (graph === 'Et') { gx.fillStyle = s[2]; gx.fillText(s[3], R - 150 + si * 50, T + 10); } });
      /* anlık nokta */
      bodies.forEach((b, bi) => { const c = at(b, Math.min(t, b.S.T[b.S.T.length - 1])), sp = Math.hypot(c.vx, c.vy); let a, v; if (graph === 'Et') { return; } switch (graph) { case 'xt': a = c.t; v = c.x; break; case 'yt': a = c.t; v = c.y; break; case 'vxt': a = c.t; v = c.vx; break; case 'vyt': a = c.t; v = c.vy; break; case 'vt': a = c.t; v = sp; break; case 'ayt': a = c.t; v = -b.g - (b.k ? b.k * sp * c.vy : 0); break; case 'yx': a = c.x; v = c.y; break; } gx.fillStyle = b.color || '#ffd34d'; gx.strokeStyle = '#fff'; gx.beginPath(); gx.arc(X(a), Y(v), 5, 0, 7); gx.fill(); gx.stroke(); });
      if (graph === 'Et') { const c = at(bodies[0], t), m = P.m || 1; const tt = c.t; gx.strokeStyle = '#fff'; gx.setLineDash([3, 3]); gx.beginPath(); gx.moveTo(X(tt), T); gx.lineTo(X(tt), B); gx.stroke(); gx.setLineDash([]); }
    }
    function drawRead() {
      let html = '<table class="tbl phrt"><tr><th></th><th>t (s)</th><th>x (m)</th><th>y (m)</th><th>vₓ (m/s)</th><th>v_y (m/s)</th><th>|v| (m/s)</th><th>yön (°)</th>' + (cfg.energy ? '<th>Eₖ (J)</th><th>Eₚ (J)</th>' : '') + '</tr>';
      bodies.forEach(b => { const c = at(b, Math.min(t, b.S.T[b.S.T.length - 1])), sp = Math.hypot(c.vx, c.vy), m = P.m || 1; html += `<tr><td><i class="dot" style="background:${b.color}"></i>${b.name || ''}</td><td>${fmt(c.t)}</td><td>${fmt(c.x)}</td><td>${fmt(c.y)}</td><td>${fmt(c.vx)}</td><td>${fmt(c.vy)}</td><td>${fmt(sp)}</td><td>${fmt(deg(Math.atan2(c.vy, c.vx)), 1)}</td>${cfg.energy ? `<td>${fmt(.5 * m * sp * sp)}</td><td>${fmt(m * b.g * c.y)}</td>` : ''}</tr>`; });
      $('.phread').innerHTML = html + '</table>';
    }
    function drawForm() {
      const f = cfg.formulas ? cfg.formulas(P, bodies) : null; $('.phform').innerHTML = f ? `<b>📐 Formüllerle kontrol</b><div class="phfl">${f.map(z => `<div class="fl">${z}</div>`).join('')}</div>` : '';
    }
    function record() {
      bodies.forEach(b => { const c = at(b, Math.min(t, b.S.T[b.S.T.length - 1])); rows.push({ n: b.name || '', t: c.t, x: c.x, y: c.y, vx: c.vx, vy: c.vy, v: Math.hypot(c.vx, c.vy), p: Object.assign({}, P) }); });
      if (rows.length > 40) rows.splice(0, rows.length - 40); drawTable(); if (cfg.onRecord) cfg.onRecord(rows);
    }
    function drawTable() {
      const keys = cfg.tableParams || []; $('.phtbl').innerHTML = rows.length ? '<table class="tbl"><tr><th>#</th>' + (bodies.length > 1 ? '<th>cisim</th>' : '') + keys.map(k => `<th>${k[1]}</th>`).join('') + '<th>t (s)</th><th>x (m)</th><th>y (m)</th><th>vₓ</th><th>v_y</th><th>|v|</th></tr>' + rows.map((r, i) => `<tr><td>${i + 1}</td>${bodies.length > 1 ? `<td>${r.n}</td>` : ''}${keys.map(k => `<td>${fmt(r.p[k[0]], 1)}</td>`).join('')}<td>${fmt(r.t)}</td><td>${fmt(r.x)}</td><td>${fmt(r.y)}</td><td>${fmt(r.vx)}</td><td>${fmt(r.vy)}</td><td>${fmt(r.v)}</td></tr>`).join('') + '</table>' : '<small>Henüz ölçüm yok. Simülasyonu durdur veya ilerlet, sonra “Ölçüm al”a bas; her satır o andaki değerleri ve ayarlarını saklar.</small>';
    }
    /* ---- döngü ---- */
    let last = performance.now();
    function loop(now) {
      if (!alive) return; raf = requestAnimationFrame(loop); const dt = Math.min(.05, (now - last) / 1000); last = now;
      if (playing) { t += dt * speed; if (t >= Tmax) { t = Tmax; playing = false; $('[data-a="play"]').textContent = '↺ Tekrar'; if (cfg.onFinish) cfg.onFinish(bodies); } }
      $('.phscrub').value = Math.round(t / Tmax * 1000); $('.phtime').textContent = 't = ' + fmt(t) + ' s';
      drawScene(); drawGraph(); drawRead();
      $('.phbanner').textContent = cfg.banner ? (cfg.banner(P, bodies, t, hitInfo) || '') : '';
    }
    rebuild(); raf = requestAnimationFrame(loop);
    const api = { P, get t() { return t; }, set t(v) { t = v; }, get bodies() { return bodies; }, get rows() { return rows; }, setParam(k, v) { P[k] = v; rebuild(true); }, play() { playing = true; }, record, rebuild, hit: () => hitInfo, destroy() { alive = false; cancelAnimationFrame(raf); root.remove(); } };
    return api;
  };
})();
