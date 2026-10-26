/* Nasse Biology — Burun, koku epiteli, dil ve tat tomurcuğu 3B modelleri (ayrıntılı, prosedürel) */
(function () {
  const SKIN = 0xf0b9a0, PINK = 0xff9aa8;
  function extrudeSide(pts, depth, mat, bev) {
    const c = new THREE.SplineCurve(pts.map(p => new THREE.Vector2(p[0], p[1]))), sh = new THREE.Shape(c.getPoints(90));
    const geo = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: !!bev, bevelThickness: bev || 0, bevelSize: bev || 0, bevelSegments: 3, curveSegments: 12 }).rotateY(-Math.PI / 2);
    geo.translate(depth / 2, 0, 0); return new THREE.Mesh(geo, mat);
  }

  /* ---------- Baş sagittal kesiti: çizim verileri (z = öne, y = yukarı) ---------- */
  const HD = {
    OUT: [[1.15, -6.3], [1.2, -5.1], [1.55, -4.75], [2.15, -4.5], [2.6, -4.2], [2.85, -3.7], [2.72, -3.25], [2.86, -2.9], [2.78, -2.58], [2.98, -2.3], [2.95, -1.85], [3.05, -1.58], [3.35, -1.48], [3.62, -1.36], [3.76, -1.08], [3.6, -.5], [3.33, .15], [3.08, .72], [3.18, 1.25], [3.17, 2.2], [2.62, 3.5], [1.5, 4.42], [0, 4.85], [-1.6, 4.7], [-3.1, 3.9], [-4.2, 2.5], [-4.65, .8], [-4.4, -.7], [-3.6, -1.8], [-3.0, -2.6], [-2.65, -3.6], [-2.55, -6.3]],
    NOSE: [[3.05, .78], [3.33, .15], [3.6, -.5], [3.76, -1.08], [3.62, -1.36], [3.35, -1.48], [3.05, -1.58], [2.98, -.4]],
    HOLE: [[3.42, -1.36], [3.48, -.95], [3.3, -.35], [3.02, .2], [2.7, .62], [2.25, .95], [1.7, 1.04], [1.0, 1.04], [.42, .95], [.05, .62], [-.12, .15], [-.38, -.05], [-.62, -.35], [-.72, -.9], [-.72, -1.8], [-.7, -3.0], [-.66, -4.2], [-.6, -5.2], [-.55, -6.2], [-.2, -6.2], [-.18, -5.2], [-.12, -4.2], [-.2, -3.6], [-.25, -2.9], [-.2, -2.25], [-.12, -1.75], [.1, -1.45], [.45, -1.25], [1.5, -1.22], [2.5, -1.25], [3.1, -1.32]],
    NAS: [[3.42, -1.36], [3.48, -.95], [3.3, -.35], [3.02, .2], [2.7, .62], [2.25, .95], [1.7, 1.04], [1.0, 1.04], [.42, .95], [.05, .62], [-.12, .15], [-.38, -.05], [-.45, -.6], [-.12, -1.0], [.45, -1.25], [1.5, -1.22], [2.5, -1.25], [3.1, -1.32]],
    PHA: [[-.38, -.05], [-.62, -.35], [-.72, -.9], [-.72, -1.8], [-.7, -3.0], [-.66, -4.2], [-.6, -5.2], [-.55, -6.2], [-.2, -6.2], [-.18, -5.2], [-.12, -4.2], [-.2, -3.6], [-.25, -2.9], [-.2, -2.25], [-.12, -1.75], [.1, -1.45], [.45, -1.25], [-.12, -1.0], [-.45, -.6]],
    SKULL: [[3.0, .85], [3.02, 2.25], [2.48, 3.42], [1.38, 4.28], [0, 4.62], [-1.55, 4.48], [-3.0, 3.72], [-4.0, 2.42], [-4.38, .82], [-4.15, -.55], [-3.5, -1.45], [-2.55, -1.78], [-2.1, -1.72], [-1.6, -1.62], [-1.3, -1.2], [-.8, -.5], [-.42, .05], [.08, .66], [.4, 1.08], [1.8, 1.12], [2.65, 1.05]],
    BRAIN: [[2.72, 1.32], [2.72, 2.3], [2.22, 3.25], [1.25, 3.98], [0, 4.3], [-1.45, 4.15], [-2.78, 3.45], [-3.7, 2.32], [-4.05, .95], [-3.95, .2], [-3.35, .12], [-2.6, .28], [-1.9, .52], [-1.35, .78], [-.95, .98], [-.55, .95], [-.15, .85], [.25, 1.12], [.6, 1.3], [1.2, 1.32], [2.0, 1.32]],
    CBL: [[-1.95, .35], [-2.4, .22], [-3.0, .08], [-3.6, -.05], [-3.95, -.45], [-3.75, -.95], [-3.2, -1.3], [-2.55, -1.38], [-2.05, -1.05], [-1.8, -.55]],
    STEM: [[-.55, .95], [-.95, .98], [-1.3, .78], [-1.55, .3], [-1.65, -.2], [-1.85, -.75], [-2.05, -1.25], [-2.2, -1.75], [-2.25, -2.6], [-2.28, -6.3], [-1.98, -6.3], [-1.95, -2.6], [-1.85, -1.75], [-1.55, -1.2], [-1.2, -.75], [-.95, -.35], [-.75, .1], [-.6, .5]],
    TONGUE: [[-.1, -2.3], [.3, -1.85], [1.0, -1.6], [1.8, -1.58], [2.35, -1.75], [2.62, -2.05], [2.5, -2.3], [2.1, -2.45], [1.95, -2.8], [2.05, -3.4], [1.95, -3.85], [1.4, -4.0], [.7, -3.75], [.15, -3.3], [-.08, -2.8]],
    HPAL: [[.55, -1.24], [1.5, -1.24], [2.5, -1.27], [3.0, -1.33], [3.0, -1.5], [2.5, -1.46], [1.5, -1.42], [.6, -1.4]],
    SPAL: [[.6, -1.25], [.45, -1.26], [.1, -1.46], [-.12, -1.76], [-.2, -2.05], [-.12, -2.22], [.05, -2.06], [.25, -1.76], [.6, -1.42]],
    MAND: [[2.35, -2.62], [2.6, -2.72], [2.78, -3.25], [2.64, -4.1], [2.2, -4.36], [1.6, -4.3], [1.62, -4.05], [2.12, -3.9], [2.3, -3.3]],
    MAX: [[2.55, -1.3], [3.0, -1.33], [3.06, -1.55], [2.96, -1.82], [2.66, -1.76]]
  };
  const HZ0 = -4.9, HZ1 = 4.0, HY0 = -6.5, HY1 = 5.1;
  function smoothPts(pts, n) { const c = new THREE.CatmullRomCurve3(pts.map(p => V3(p[0], p[1], 0)), true, 'centripetal'); return c.getSpacedPoints(n || 200).slice(0, -1).map(v => [v.x, v.y]); }
  function headTex() {
    const W = 1400, H = Math.round(W * (HY1 - HY0) / (HZ1 - HZ0)), K = W / (HZ1 - HZ0), r = srand(19);
    const P = (z, y) => [(z - HZ0) * K, (HY1 - y) * K];
    return canvasTex(W, H, c => {
      const path = (pts) => { const s = smoothPts(pts, 240); c.beginPath(); s.forEach((p, i) => { const q = P(p[0], p[1]); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); };
      const poly = (pts, fill, stroke, lw) => { path(pts); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 3; c.stroke(); } };
      const dots = (pts, n, cols, rmin, rmax) => { c.save(); path(pts); c.clip(); for (let i = 0; i < n; i++) { c.fillStyle = cols[i % cols.length]; c.beginPath(); c.ellipse(r() * W, r() * H, rmin + r() * (rmax - rmin), rmin + r() * (rmax - rmin) * .7, r() * 3, 0, 7); c.fill(); } c.restore(); };
      c.fillStyle = '#d58c80'; c.fillRect(0, 0, W, H);
      /* boyun ve yüz kasları */
      c.save(); path(HD.OUT); c.clip(); for (let i = 0; i < 260; i++) { const z = -2.5 + r() * 1.6, y = -6.3 + r() * 4.2, [x0, y0] = P(z, y); c.strokeStyle = 'rgba(150,55,60,.28)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + (r() - .5) * 10, y0 + 40 + r() * 30); c.stroke(); } c.restore();
      /* kafatası */
      poly(HD.SKULL, '#e4d3ae', '#c8b183', 4); dots(HD.SKULL, 1600, ['rgba(160,130,85,.5)', 'rgba(248,238,214,.7)'], 1.5, 6);
      c.fillStyle = '#6a3c3c'; [[2.82, 1.62, .13, .3], [-.2, .3, .2, .18]].forEach(([z, y, a, b]) => { const [x, yy] = P(z, y); c.beginPath(); c.ellipse(x, yy, a * K, b * K, 0, 0, 7); c.fill(); });
      /* beyin */
      poly(HD.BRAIN, '#efb5ad'); c.save(); path(HD.BRAIN); c.clip();
      c.lineCap = 'round'; c.lineJoin = 'round'; for (let i = 0; i < 150; i++) { let z = -4.1 + r() * 6.9, y = .8 + r() * 3.6; let [x, yy] = P(z, y); const pts = [[x, yy]]; let a = r() * 6.3; for (let k = 0; k < 9; k++) { a += (r() - .5) * 1.5; x += Math.cos(a) * 34; yy += Math.sin(a) * 34; pts.push([x, yy]); } const st = (col, w, dx) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); pts.forEach((p, k) => k ? c.lineTo(p[0] + dx, p[1] + dx) : c.moveTo(p[0] + dx, p[1] + dx)); c.stroke(); }; st('rgba(255,226,220,.5)', 24, -7); st('rgba(165,82,88,.8)', 9, 0); }
      c.strokeStyle = '#f7e4dc'; c.lineWidth = .2 * K; c.lineCap = 'round'; c.beginPath(); let q = P(1.1, 2.2); c.moveTo(q[0], q[1]); q = P(.1, 2.85); let q2 = P(-1.4, 2.65); c.quadraticCurveTo(q[0], q[1] - 30, q2[0], q2[1]); q = P(-1.8, 2.2); c.lineTo(q[0], q[1]); c.stroke(); c.restore();
      poly(HD.BRAIN, null, '#b77a78', 3);
      /* beyincik */
      poly(HD.CBL, '#e9a5a2'); c.save(); path(HD.CBL); c.clip(); const [cx, cy] = P(-2.55, -.5); for (let k = 0; k < 26; k++) { c.strokeStyle = k % 2 ? 'rgba(150,70,80,.55)' : 'rgba(255,230,225,.6)'; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, 10 + k * 7, 0, 7); c.stroke(); } c.strokeStyle = 'rgba(255,240,235,.8)'; c.lineWidth = 6; for (let k = 0; k < 7; k++) { const a = Math.PI * .55 + k * .28; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * 120, cy - Math.sin(a) * 100); c.stroke(); } c.restore(); poly(HD.CBL, null, '#a8676c', 3);
      /* beyin sapı ve omurilik */
      poly(HD.STEM, '#f1cdbb', '#c99a86', 3); c.save(); path(HD.STEM); c.clip(); for (let i = 0; i < 40; i++) { const [x, y] = P(-1.9 + r() * .3, -6 + r() * 6.5); c.strokeStyle = 'rgba(200,150,130,.4)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (r() - .5) * 6, y + 60); c.stroke(); } c.restore();
      /* omurlar */
      for (let y = -1.95; y > -6.4; y -= .66) { poly([[-1.65, y], [-.95, y], [-.95, y - .52], [-1.65, y - .52]], '#e4d3ae', '#c8b183', 3); dots([[-1.65, y], [-.95, y], [-.95, y - .52], [-1.65, y - .52]], 60, ['rgba(160,130,85,.5)'], 1.5, 4); poly([[-1.6, y - .54], [-1.0, y - .54], [-1.0, y - .64], [-1.6, y - .64]], '#c6d3e6'); poly([[-2.4, y - .05], [-2.8, y - .12], [-2.8, y - .4], [-2.4, y - .45]], '#e4d3ae', '#c8b183', 2); }
      { const [x, y] = P(-.9, -1.72); c.fillStyle = '#e4d3ae'; c.beginPath(); c.ellipse(x, y, .14 * K, .1 * K, 0, 0, 7); c.fill(); }
      /* damak, dil, çene, dişler, dudaklar */
      poly(HD.TONGUE, '#c4505c', '#9c3a46', 3); c.save(); path(HD.TONGUE); c.clip(); const [tx, ty] = P(1.2, -4.0); for (let k = 0; k < 40; k++) { const a = Math.PI * (.15 + k / 40 * .75); c.strokeStyle = 'rgba(150,40,55,.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx + Math.cos(a) * 400, ty - Math.sin(a) * 300); c.stroke(); } c.restore();
      c.strokeStyle = '#4a2026'; c.lineWidth = 5; c.beginPath(); smoothPts([[-.1, -2.28], [.3, -1.83], [1.0, -1.57], [1.8, -1.55], [2.35, -1.72], [2.6, -2.02]], 60).slice(0, 50).forEach((p, i) => { const q = P(p[0], p[1] + .02); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.stroke();
      poly(HD.HPAL, '#e4d3ae', '#c8b183', 3); poly(HD.SPAL, '#d4747a', '#a9505a', 3);
      poly(HD.MAND, '#e4d3ae', '#c8b183', 3); poly(HD.MAX, '#e4d3ae', '#c8b183', 3);
      poly([[2.66, -1.74], [2.86, -1.76], [2.8, -2.3], [2.7, -2.32]], '#f8f4e8', '#cfc6b0', 3); poly([[2.6, -2.36], [2.74, -2.34], [2.74, -2.78], [2.6, -2.76]], '#f8f4e8', '#cfc6b0', 3);
      poly([[2.86, -1.85], [3.0, -1.95], [3.0, -2.3], [2.8, -2.34]], '#c65b66'); poly([[2.76, -2.4], [2.9, -2.45], [2.88, -2.85], [2.74, -2.84]], '#c65b66');
      /* burun kemiği ve kıkırdağı */
      c.strokeStyle = '#e4d3ae'; c.lineWidth = .12 * K; c.lineCap = 'round'; c.beginPath(); q = P(3.02, .78); c.moveTo(q[0], q[1]); q = P(3.22, .2); c.lineTo(q[0], q[1]); c.stroke();
      c.strokeStyle = '#dbe6ee'; c.lineWidth = .1 * K; c.beginPath(); q = P(3.22, .15); c.moveTo(q[0], q[1]); q = P(3.48, -.5); c.lineTo(q[0], q[1]); q = P(3.6, -1.05); c.lineTo(q[0], q[1]); c.stroke();
      /* deri + yağ bandı */
      path(HD.OUT); c.strokeStyle = '#efcf8a'; c.lineWidth = .3 * K; c.stroke(); c.strokeStyle = '#c9846f'; c.lineWidth = .13 * K; c.stroke();
    });
  }
  function mucosaTex() { return canvasTex(512, 512, (c, w, h) => { const r = srand(4); c.fillStyle = '#c95e6b'; c.fillRect(0, 0, w, h); for (let i = 0; i < 300; i++) { c.strokeStyle = r() < .5 ? 'rgba(240,150,160,.4)' : 'rgba(140,40,60,.35)'; c.lineWidth = 2 + r() * 3; c.beginPath(); const x = r() * w, y = r() * h; c.moveTo(x, y); c.bezierCurveTo(x + 20, y + (r() - .5) * 20, x + 40, y + (r() - .5) * 20, x + 70, y + (r() - .5) * 10); c.stroke(); } }); }
  /* düz yüz (x = xx düzleminde, +x'e bakar) — uv baş dokusuna göre */
  function capGeo(outer, holes, xx) {
    const toS = p => new THREE.Vector2(-p[0], p[1]);
    const sh = new THREE.Shape(smoothPts(outer, 260).map(toS)); (holes || []).forEach(hp => sh.holes.push(new THREE.Path(smoothPts(hp, 200).map(toS))));
    const geo = new THREE.ShapeGeometry(sh), p = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, (-p.getX(i) - HZ0) / (HZ1 - HZ0), (p.getY(i) - HY0) / (HY1 - HY0));
    uv.needsUpdate = true; geo.rotateY(Math.PI / 2); geo.translate(xx || 0, 0, 0); return geo;
  }
  /* yarım kubbe (baş derisi): kenarı x=0 düzlemindeki çizgi, kubbe −x yönünde */
  function domeGeo(outline, C, Wf, NP) {
    const E = smoothPts(outline, 240), NSg = E.length, pos = [], idx = []; NP = NP || 16;
    for (let i = 0; i <= NSg; i++) { const e = E[i % NSg]; for (let k = 0; k <= NP; k++) { const ph = k / NP * Math.PI / 2, cz = C[0] + (e[0] - C[0]) * Math.cos(ph), cy = C[1] + (e[1] - C[1]) * Math.cos(ph); pos.push(-Wf(cy, cz) * Math.sin(ph), cy, cz); } }
    for (let i = 0; i < NSg; i++) for (let k = 0; k < NP; k++) { const a = i * (NP + 1) + k, b = a + NP + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals(); return geo;
  }
  function wallGeo(pts, x0, x1) {
    const E = smoothPts(pts, 200), pos = [], idx = []; E.forEach(e => { pos.push(x0, e[1], e[0], x1, e[1], e[0]); });
    for (let i = 0; i < E.length; i++) { const j = (i + 1) % E.length, a = i * 2, b = j * 2; idx.push(a, b, a + 1, a + 1, b, b + 1); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals(); return geo;
  }

  /* ============ BURUN (baş sagittal kesiti ve koku yolu) ============ */
  M3.burun = {
    title: 'Burun', ico: '👃', tag: 'Kemoreseptör · Nöron', cam: [10.5, 1.6, 2.6], target: [0, .3, 0], labScale: .8,
    clip: { axis: 'x', min: -2.4, max: .3, def: 0, on: false },
    layers: [['Dış burun', 'dis'], ['Burun boşluğu ve konkalar', 'bos'], ['Koku epiteli ve koku siniri', 'koku'], ['Kalbur kemik, koku soğanı ve beyin', 'beyin'], ['Baş (kesit)', 'bas'], ['Koku molekülleri', 'mol']],
    task: 'Koku moleküllerinin burun deliğinden girip burun boşluğunun üst kısmındaki koku epiteline ulaşma yolunu izle. Koku reseptörlerine, koku sinirine, koku soğanına ve koku yoluna tıkla. Koku uyartılarının talamusa uğramadan koku merkezine gittiğine dikkat et; reseptörlerin çeşidini ve yapısını (nöron) yaz.',
    q: { q: 'Burundaki koku reseptörleri için hangisi doğrudur?', o: ['Mekanoreseptör, duyu epiteli', 'Kemoreseptör, nöron', 'Fotoreseptör, nöron', 'Termoreseptör, duyu epiteli'], a: 1, e: 'Koku molekülleri kimyasal uyarandır; koku reseptör nöronları kemoreseptördür.' },
    build() {
      const { g, sels, ticks, S, G } = B(), api = { sniff: .18 };
      const tex = headTex(), capMat = () => mt(0xffffff, { map: tex, roughness: .8, side: THREE.DoubleSide });
      /* baş kubbesi + kesit yüzeyi */
      const OUTN = HD.OUT.filter(p => !HD.NOSE.slice(1, 6).some(q => q[0] === p[0] && q[1] === p[1]));
      const Wf = y => (1.0 + 1.75 * (y < -5.2 ? 0 : y > -2 ? 1 : (y + 5.2) / 3.2)) * (y > 3.6 ? 1 - .22 * Math.min(1, (y - 3.6) / 1.3) : 1);
      g.add(G(new THREE.Mesh(domeGeo(OUTN, [-.6, .5], (y) => Wf(y)), mt(0xd89a82, { roughness: .6, side: THREE.DoubleSide })), 'bas'));
      g.add(G(new THREE.Mesh(capGeo(HD.OUT, [HD.HOLE], 0), capMat()), 'bas'));
      const nose = S(new THREE.Mesh(domeGeo(HD.NOSE, [3.12, -.55], () => .62, 12), mt(0xdc9c84, { roughness: .55, side: THREE.DoubleSide })), 'Dış burun', 'Havanın (ve içindeki koku moleküllerinin) burun deliklerinden burun boşluğuna girdiği, dışarıdan görünen bölümdür. İçinde kemik ve kıkırdak destek bulunur.', 'Hava yolu', 'dis'); g.add(nose);
      g.add(G(at(ellip(.2, .03, .14, mt(0x2a1414)), -.34, -1.36, 3.3), 'dis'));
      /* bölge katmanları (tıklanabilir) */
      const reg = (pts, n, inf, tag, grp, k) => { const m = S(new THREE.Mesh(capGeo(pts, null, .004 + k * .002), capMat()), n, inf, tag, grp); m.userData.low = true; g.add(m); return m; };
      reg(HD.SKULL, 'Kafatası kemiği', 'Beyni saran ve koruyan kemik yapıdır. Burun boşluğunun tavanındaki delikli kalbur kemik de kafatasının bir parçasıdır.', 'Koruma', 'beyin', 0);
      reg(HD.BRAIN, 'Beyin', 'Duyu organlarından gelen uyartıları değerlendirip algıya dönüştürür. Koku, beynin koku merkezinde algılanır.', 'Algının oluştuğu yer', 'beyin', 1);
      reg(HD.CBL, 'Beyincik', 'Beynin arka-alt kısmındaki yapıdır; vücudun dengesi ve hareketlerin uyumu ile ilgilidir.', 'Denge · koordinasyon', 'beyin', 2);
      reg(HD.STEM, 'Beyin sapı ve omurilik', 'Beyni omuriliğe bağlayan yapı ve omurilik; uyartıların beyin ile vücut arasında iletilmesini sağlar.', 'İletim yolu', 'beyin', 2);
      reg(HD.HPAL, 'Damak (burun boşluğunun tabanı)', 'Burun boşluğunu ağız boşluğundan ayıran yapıdır. Ön kısmı kemik (sert damak), arka kısmı kas (yumuşak damak) yapılıdır.', 'Boşluk tabanı', 'bos', 3);
      reg(HD.SPAL, 'Damak (burun boşluğunun tabanı)', 'Burun boşluğunu ağız boşluğundan ayıran yapının arka, yumuşak kısmıdır (yumuşak damak); yutkunurken burun boşluğunu kapatır.', 'Boşluk tabanı', 'bos', 3);
      reg(HD.TONGUE, 'Dil', 'Ağız boşluğunun tabanındaki kaslı organdır. Üzerindeki tat tomurcuklarıyla tadı algılar; koku ile birlikte lezzetin algılanmasına katkı sağlar.', 'Tat organı', 'bos', 3);
      /* burun boşluğu oyuğu */
      const LX = -.62, muc = mucosaTex();
      const cav = S(new THREE.Mesh(capGeo(HD.NAS, null, LX), mt(0xffffff, { map: muc, roughness: .7, side: THREE.DoubleSide })), 'Burun boşluğu', 'Burun deliklerinden giren havanın geçtiği boşluktur. Duvarları mukusla kaplıdır; hava burada ısınır, nemlenir ve temizlenir. Koku molekülleri boşluğun üst kısmındaki koku epiteline ulaşır.', 'Hava yolu', 'bos'); cav.userData.low = true; g.add(cav);
      const ph = S(new THREE.Mesh(capGeo(HD.PHA, null, LX + .002), mt(0xffffff, { map: muc, roughness: .7, side: THREE.DoubleSide })), 'Yutak (boğaz)', 'Burun boşluğunun arkada devam ettiği, havanın soluk borusuna, besinin yemek borusuna doğru ilerlediği ortak yoldur.', 'Hava yolu', 'bos'); ph.userData.low = true; g.add(ph);
      g.add(G(new THREE.Mesh(wallGeo(HD.HOLE, LX, 0), mt(0xb24f5d, { roughness: .7, side: THREE.DoubleSide })), 'bos'));
      /* konkalar */
      [[.62, .82, .66, .16, .2, 'Üst konka', 'Burun boşluğunun yan duvarındaki kıvrımlardan en üsttekidir; koku epiteline yakındır. Kıvrımlar hava ile temas yüzeyini artırır.'], [.05, 1.0, 1.05, .2, .3, 'Orta konka', 'Burun boşluğunun yan duvarındaki orta kıvrımdır; havanın yönlenmesini ve nemlenmesini sağlar.'], [-.72, 1.18, 1.32, .24, .36, 'Alt konka', 'En alttaki ve en büyük burun kıvrımıdır; solunan havayı nemlendirir ve ısıtır.']].forEach(([y, z, rz, ry, rx, nm, inf]) => {
        const c = S(ellip(rx, ry, rz, mt(0xd8697a, { roughness: .55 }), 28), nm, inf, 'Hava yolunu şekillendirir', 'bos'); at(c, LX, y, z); c.rotation.x = -.12; g.add(c);
        const lip = G(ellip(rx * .7, ry * .45, rz * .96, mt(0xe98a96, { roughness: .5 }), 20), 'bos'); at(lip, LX + rx * .55, y - ry * .55, z); lip.rotation.x = -.12; g.add(lip);
      });
      /* koku epiteli + reseptörler */
      const epi = S(new THREE.Mesh(capGeo([[1.95, 1.0], [1.1, 1.02], [.45, .93], [.12, .62], [.2, .52], [.6, .74], [1.2, .8], [1.95, .82]], null, LX + .01), mt(0xffb02e, { emissive: 0x6a3900, side: THREE.DoubleSide })), 'Koku epiteli', 'Burun boşluğunun üst kısmındaki, koku reseptörlerinin bulunduğu özel dokudur. Koku molekülleri buradaki mukusta çözünür ve reseptörleri uyarır.', 'Kemoreseptör · nöron', 'koku'); g.add(epi);
      const RN = 15, rcp = [], rr = srand(7); for (let i = 0; i < RN; i++) { const z = .5 + i / (RN - 1) * 1.35, x = -.45 + rr() * .4; rcp.push([x, .84 + (z > 1.6 ? .05 : 0) - (z < .7 ? .06 : 0), z]); }
      const rc = S(instMesh(new THREE.SphereGeometry(1, 12, 10), mt(0x9b6be8, { emissive: 0x1a0a33, roughness: .4 }), RN, (i, d) => { d.position.set(...rcp[i]); d.scale.set(.045, .1, .045); }), 'Koku reseptörleri', 'Koku epitelindeki, koku moleküllerini algılayan duyu hücreleridir. Nöron yapısında kemoreseptörlerdir; uçlarındaki tüycükler mukusa uzanır, aksonları kalbur kemikten geçerek koku soğanına ulaşır.', 'Kemoreseptör · nöron', 'koku'); g.add(rc);
      rcp.forEach(([x, y, z], i) => {
        for (let k = 0; k < 4; k++) g.add(G(cylBetween([x, y - .08, z], [x + (rr() - .5) * .1, y - .22, z + (rr() - .5) * .1], .006, mt(0x6ee7ff)), 'koku'));
        g.add(S(curveTube([[x, y + .08, z], [x * .6, .98, z + (rr() - .5) * .04], [.035, 1.1, z], [.04, 1.27, z * .98 + .02]], .012, mt(0xffd34d, { emissive: 0x3a2900 }), 12), 'Koku siniri', 'Koku reseptör nöronlarının aksonlarından oluşan sinirdir; reseptörlerde oluşan uyartıları kalbur kemikteki deliklerden geçirerek koku soğanına taşır.', 'Uyartıyı iletir', 'koku'));
      });
      /* kalbur kemik */
      const cr = S(new THREE.Mesh(new THREE.BoxGeometry(.66, .07, 1.5), mt(0xe8dcc0, { roughness: .8 })), 'Kalbur kemik', 'Koku siniri liflerinin geçtiği, delikli ince kemik plakadır. Burun boşluğu ile kafatası boşluğu (koku soğanı) arasında yer alır.', 'Delikli kemik plaka', 'beyin'); at(cr, -.29, 1.1, 1.15); cr.scale.x = 1.06; g.add(cr);
      /* koku soğanı, yolu, merkezi, talamus */
      const bulb = S(ellip(.2, .14, .64, mt(0xf2c94c, { emissive: 0x2a1e00, roughness: .45 }), 28), 'Koku soğanı', 'Koku sinirlerinin sonlandığı, uyartıların nöronlarla merkezî sinir sistemine aktarıldığı yapıdır.', 'Uyartının iletimi', 'beyin'); at(bulb, -.05, 1.36, 1.15); g.add(bulb);
      const trP = [[0, 1.4, .55], [.04, 1.55, 0], [.05, 1.78, -.45], [.05, 1.95, -.8]];
      const tract = S(curveTube(trP, .06, mt(0xf2c94c, { emissive: 0x2a1e00 }), 30), 'Koku yolu', 'Koku soğanından beyindeki koku merkezine giden sinirsel yoldur. Koku uyartıları, diğer duyulardan farklı olarak talamusa uğramadan koku merkezine ulaşır.', 'Uyartıyı beyne taşır', 'beyin'); g.add(tract);
      const ctr = S(ellip(.18, .22, .28, mt(0x5fe0d0, { emissive: 0x0d4a44, roughness: .3 }), 24), 'Beyin (koku merkezi)', 'Beyinde kokunun algılandığı bölgedir. Koku soğanından gelen uyartılar burada yorumlanır ve koku algılanır. Koku, tat ile birlikte besinin lezzetinin algılanmasına katkı sağlar.', 'Algının oluştuğu yer', 'beyin'); at(ctr, 0, 1.98, -1.02); g.add(ctr);
      const tal = S(ellip(.2, .3, .38, mt(0xb9a3cf, { roughness: .45 }), 24), 'Talamus', 'Beynin ortasındaki yapıdır. Koku dışındaki duyulardan gelen uyartıların çoğu beyin kabuğuna ulaşmadan önce talamustan geçer; koku uyartıları ise talamusa uğramadan doğrudan koku merkezine gider.', 'Duyu uyartılarının aktarım merkezi', 'beyin'); at(tal, 0, 1.3, -.78); g.add(tal);
      { const f = pathFollower(0xffffff, .07, [V3(-.25, .84, 1.1), V3(-.15, 1.0, 1.1), V3(-.08, 1.28, 1.12), V3(0, 1.4, .55), V3(.04, 1.55, 0), V3(.05, 1.78, -.45), V3(.05, 1.95, -.8)], .2, 0); g.add(G(f.orb, 'koku')); ticks.push(t => f.tick(t)); }
      /* koku molekülleri */
      const mol = [], colors = [0xffd34d, 0x6ee7b7, 0xff7ab8, 0x8ab4ff];
      const toEp = new THREE.CatmullRomCurve3([V3(-.3, -2.2, 4.5), V3(-.32, -1.6, 3.35), V3(-.3, -.9, 2.7), V3(-.28, -.1, 2.0), V3(-.25, .55, 1.4), V3(-.22, .78, 1.05)]);
      const toTh = new THREE.CatmullRomCurve3([V3(-.3, -2.2, 4.5), V3(-.32, -1.6, 3.35), V3(-.3, -1.0, 2.4), V3(-.3, -.95, 1.0), V3(-.32, -.6, -.05), V3(-.35, -1.6, -.48), V3(-.35, -3.2, -.46), V3(-.3, -5.8, -.38)]);
      for (let i = 0; i < 46; i++) { const m = new THREE.Mesh(i % 3 === 0 ? new THREE.OctahedronGeometry(.06) : i % 3 === 1 ? new THREE.BoxGeometry(.08, .08, .08) : new THREE.SphereGeometry(.055, 8, 8), new THREE.MeshBasicMaterial({ color: colors[i % 4] })); g.add(G(m, 'mol')); mol.push({ m, u: Math.random(), s: .07 + Math.random() * .05, jx: (Math.random() - .5) * .18, jz: (Math.random() - .5) * .1, ep: Math.random() }); }
      ticks.push((t, dt) => mol.forEach(o => { o.u += dt * o.s * (api.flow === undefined ? 1 : api.flow); if (o.u > 1) { o.u = 0; o.ep = Math.random(); } const c = o.ep < api.sniff ? toEp : toTh; const p = c.getPoint(o.u); o.m.position.set(p.x + o.jx, p.y + o.jz * Math.sin(o.u * 9), p.z + o.jz); o.m.rotation.x += dt * 2; o.m.rotation.y += dt * 1.5; }));
      return { g, sels, ticks, api };
    }
  };

  /* ============ KOKU EPİTELİ (ayrıntı) ============ */
  M3.kokuepiteli = {
    title: 'Koku Epiteli (ayrıntı)', ico: '🌸', tag: 'Kemoreseptör · Nöron', cam: [6.5, 2.4, 8.2], target: [0, 1.4, 0], labScale: .8,
    layers: [['Mukus tabakası ve tüycükler', 'muk'], ['Koku reseptör nöronları', 'nor'], ['Destek ve bazal hücreler', 'des'], ['Kalbur kemik ve koku soğanı', 'bul'], ['Koku molekülleri', 'mol']],
    task: 'Koku moleküllerinin mukus tabakasında çözünüp tüycüklerdeki reseptörlere bağlanmasını izle. Koku reseptörünün bir nöron olduğuna ve aksonunun kalbur kemikten geçerek koku soğanına ulaştığına dikkat et.',
    q: { q: 'Koku reseptörleri nöron yapısındadır ve ......... uyarılır. Boşluğa ne gelmelidir?', o: ['ışıkla', 'kimyasal maddelerle (koku molekülleriyle)', 'basınçla', 'sıcaklıkla'], a: 1, e: 'Koku reseptör nöronları kemoreseptördür; havadaki koku molekülleri (kimyasal uyaran) mukusta çözünüp tüycüklerdeki reseptörlere bağlanınca uyarılır.' },
    build() {
      const { g, sels, ticks, S, G } = B(), api = { N: [], act: [0, 0, 0] };
      const rr = srand(41), TC = [0xff6b6b, 0x59e08a, 0x6b8aff];
      /* katmanlar */
      const muk = S(new THREE.Mesh(new THREE.BoxGeometry(5, 1.1, 2.8), glass(0xfff2a8, .3)), 'Mukus tabakası', 'Koku epitelini örten sıvı tabakadır. Havadaki koku molekülleri burada çözünür ve tüycüklerdeki reseptörlere ulaşır.', 'Koku moleküllerinin çözündüğü yer', 'muk'); muk.userData.low = true; at(muk, 0, -.45, 0); g.add(muk);
      const lam = S(new THREE.Mesh(new THREE.BoxGeometry(5, .09, 2.8), mt(0xb9a083)), 'Taban zarı (epitel tabanı)', 'Koku epitelinin tabanında yer alan ince zardır; bazal hücreler buraya oturur.', 'Epitelin alt sınırı', 'des'); at(lam, 0, 2.3, 0); g.add(lam);
      const xs = [-2, -1.2, -.4, .4, 1.2, 2], zs = [-.8, .6];
      let k = 0;
      xs.forEach((x, ix) => zs.forEach((z, iz) => {
        const type = (ix + iz) % 3, c = TC[type], zz = z + (ix % 2 ? .2 : -.1);
        const knob = S(new THREE.Mesh(new THREE.SphereGeometry(.1, 12, 10), mt(c, { emissive: 0x000000 })), 'Koku reseptör nöronu', 'Koku molekülünü algılayıp elektrik sinyaline dönüştüren duyu hücresidir; nöron yapısındadır (kemoreseptör). Her nöron belirli koku moleküllerine duyarlı reseptörler taşır.', 'Kemoreseptör · nöron', 'nor'); at(knob, x, .15, zz); g.add(knob);
        const den = S(cylBetween([x, .15, zz], [x, 1.25, zz], .05, mt(c, { emissive: 0x000000 })), 'Koku reseptör nöronu', 'Koku molekülünü algılayıp elektrik sinyaline dönüştüren duyu hücresidir; nöron yapısındadır (kemoreseptör).', 'Kemoreseptör · nöron', 'nor'); g.add(den);
        const body = S(ellip(.19, .3, .19, mt(c, { emissive: 0x000000 }), 16), 'Koku reseptör nöronu', 'Koku molekülünü algılayıp elektrik sinyaline dönüştüren duyu hücresidir; nöron yapısındadır (kemoreseptör).', 'Kemoreseptör · nöron', 'nor'); at(body, x, 1.55, zz); g.add(body);
        const ax = S(curveTube([[x, 1.85, zz], [x, 2.6, zz], [x + (rr() - .5) * .3, 3.35, zz], [x * .9, 3.95, zz * .9]], .028, mt(0xffd34d, { emissive: 0x2b2100 }), 24), 'Akson (koku siniri lifi)', 'Koku reseptör nöronunun aksonudur; kalbur kemikteki delikten geçerek koku soğanına ulaşır ve uyartıyı iletir.', 'Uyartıyı iletir', 'nor'); g.add(ax);
        const cil = []; for (let j = 0; j < 6; j++) { const a = j / 6 * 6.283, pts = [[x, .15, zz], [x + Math.cos(a) * .25, -.2, zz + Math.sin(a) * .25], [x + Math.cos(a + .6) * .55, -.55 - rr() * .1, zz + Math.sin(a + .6) * .55], [x + Math.cos(a + 1.1) * .85, -.85 - rr() * .1, zz + Math.sin(a + 1.1) * .6]]; const t = S(curveTube(pts, .012, mt(c, { emissive: new THREE.Color(c).multiplyScalar(.15).getHex() }), 14), 'Koku tüycükleri (silyum)', 'Koku reseptör nöronunun mukus içine uzanan tüycükleridir. Koku moleküllerinin bağlandığı reseptör proteinleri bu tüycüklerin zarında bulunur.', 'Reseptörlerin bulunduğu bölge', 'muk'); g.add(t); cil.push(t); }
        const glom = S(new THREE.Mesh(new THREE.SphereGeometry(.17, 14, 12), mt(c, { emissive: 0x000000 })), 'Glomerül (koku soğanı)', 'Aynı tür reseptör nöronların aksonlarının toplandığı küçük yuvarlak yapıdır; uyartı burada sonraki nöronlara aktarılır.', 'Sinaps bölgesi', 'bul'); at(glom, x * .9, 4.0, zz * .9); g.add(glom);
        api.N.push({ type, knob, den, body, ax, glom, cil, curve: new THREE.CatmullRomCurve3([V3(x, .15, zz), V3(x, 1.25, zz), V3(x, 1.85, zz), V3(x, 2.6, zz), V3(x * .9, 3.95, zz * .9)]), pulses: [], x, z: zz, a: 0 });
      }));
      /* destek hücreleri */
      for (let i = 0; i < 9; i++) { const x = -2.4 + i * .6 + .0, z = (i % 2 ? .1 : -.2); const d = S(new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, 2.1, 12), glass(0x9fc9ff, .22)), 'Destek hücresi', 'Reseptör nöronlarının arasında yer alan, onlara destek olan ve mukusu besleyen hücrelerdir.', 'Destek', 'des'); at(d, x, 1.2, z + (i % 3 - 1) * .5); g.add(d); }
      for (let i = 0; i < 16; i++) { const b = S(ellip(.13, .1, .13, mt(0x8c7bb8), 10), 'Bazal hücre', 'Epitelin tabanında bulunan, yaşlanan reseptör nöronlarının yerine yenisini oluşturabilen kök hücrelerdir.', 'Yenilenme', 'des'); at(b, -2.3 + (i % 8) * .65, 2.15, (i < 8 ? -.9 : .8)); g.add(b); }
      /* kalbur kemik */
      const plate = S(new THREE.Mesh(new THREE.BoxGeometry(5, .24, 2.8), mt(0xe8e4d6, { transparent: true, opacity: .9 })), 'Kalbur kemik', 'Delikli ince kemik plakadır; koku nöronlarının aksonları buradaki deliklerden geçerek koku soğanına ulaşır.', 'Delikli kemik plaka', 'bul'); at(plate, 0, 3.3, 0); g.add(plate);
      api.N.forEach(n => g.add(G(at(new THREE.Mesh(new THREE.TorusGeometry(.09, .03, 8, 14).rotateX(Math.PI / 2), mt(0x222222)), n.x * .95, 3.42, n.z * .95), 'bul')));
      const bulb = S(ellip(2.9, .75, 1.7, glass(0xb48cf0, .35), 28), 'Koku soğanı', 'Reseptör nöronlarının aksonlarının ulaştığı, uyartının merkezî sinir sistemine aktarıldığı yapıdır.', 'Uyartının iletimi', 'bul'); bulb.userData.low = true; at(bulb, 0, 4.15, 0); g.add(bulb);
      for (let i = 0; i < 6; i++) { const mi = S(ellip(.16, .14, .16, mt(0x7a4cd6), 10), 'Mitral hücre', 'Koku soğanındaki nöronlardır; glomerüldeki aksonlardan sinyal alıp koku yoluyla beyne iletir.', 'Uyartıyı beyne taşır', 'bul'); at(mi, -2 + i * .8, 4.4, (i % 2 ? .4 : -.4)); g.add(mi); }
      const tr = S(curveTube([[1.9, 4.4, 0], [2.8, 4.5, 0], [4.0, 4.5, 0], [5.0, 4.6, 0]], .12, mt(0xf5c542, { emissive: 0x2b2100 }), 24), 'Koku yolu', 'Koku soğanından beyne giden sinirsel yoldur.', 'Uyartıyı beyne taşır', 'bul'); g.add(tr);
      /* hareketli moleküller */
      const mol = []; for (let i = 0; i < 40; i++) { const t = i % 3; const m = new THREE.Mesh(t === 0 ? new THREE.BoxGeometry(.13, .13, .13) : t === 1 ? new THREE.OctahedronGeometry(.1) : new THREE.SphereGeometry(.09, 8, 8), new THREE.MeshBasicMaterial({ color: TC[t] })); g.add(G(m, 'mol')); mol.push({ m, t, u: Math.random(), x: (rr() - .5) * 4.4, z: (rr() - .5) * 2.2 }); }
      api.moleculeRate = 1; api.molType = -1; /* -1: hepsi */
      ticks.push((tm, dt) => mol.forEach(o => { o.u += dt * .13 * api.moleculeRate; if (o.u > 1) { o.u = 0; o.x = (rr() - .5) * 4.4; o.z = (rr() - .5) * 2.2; } o.m.visible = api.molType < 0 || api.molType === o.t; o.m.position.set(o.x + Math.sin(tm * 2 + o.u * 7) * .1, -2.3 + o.u * 2.1, o.z); o.m.rotation.x += dt * 2; o.m.rotation.y += dt * 2; }));
      /* etkinlik */
      api.stim = (type, v) => { api.N.forEach(n => { if (type < 0 || n.type === type) n.a = Math.max(n.a, v); }); };
      const pool = []; for (let i = 0; i < 60; i++) { const o = glow(0xffffff, .075); o.visible = false; g.add(G(o, 'nor')); pool.push({ o, n: null, u: 0, on: false }); }
      let acc = 0;
      ticks.push((tm, dt) => {
        acc += dt;
        api.N.forEach(n => {
          n.a = Math.max(0, n.a - dt * .35); const e = n.a, c = new THREE.Color(TC[n.type]);
          [n.knob, n.den, n.body, n.glom].forEach(m => { if (m.material.emissive) m.material.emissive.copy(c).multiplyScalar(e * .9); });
          n.cil.forEach(m => m.material.emissive.copy(c).multiplyScalar(.15 + e * .8));
          if (e > .12 && acc > .18 / Math.max(.3, e) && Math.random() < .35) { const f = pool.find(p => !p.on); if (f) { f.on = true; f.n = n; f.u = 0; f.o.visible = true; } }
        });
        if (acc > .2) acc = 0;
        pool.forEach(p => { if (!p.on) return; p.u += dt * .5; if (p.u >= 1) { p.on = false; p.o.visible = false; return; } p.o.position.copy(p.n.curve.getPoint(p.u)); });
      });
      return { g, sels, ticks, api };
    }
  };

  /* ============ DİL ============ */
  function tongueTopY(x, z) { const a = x / (1.3 * (1 - .5 * Math.pow(Math.max(0, z) / 2.4, 2))), q = a * a + (z / 2.4) * (z / 2.4); return q >= 1 ? 0 : .42 * Math.sqrt(1 - q); }
  function tongueTex() { return canvasTex(512, 512, (c, w, h) => { const r = srand(13); c.fillStyle = '#d06676'; c.fillRect(0, 0, w, h); for (let i = 0; i < 9000; i++) { c.fillStyle = r() < .6 ? 'rgba(248,178,186,.5)' : 'rgba(150,40,60,.3)'; c.beginPath(); c.arc(r() * w, r() * h, .8 + r() * 1.6, 0, 7); c.fill(); } }); }
  function papillaTex() {
    const W = 512, H = 342, X0 = -.9, X1 = .9, Y0 = -.7, Y1 = .5, K = W / (X1 - X0), P = (x, y) => [(x - X0) * K, (Y1 - y) * K];
    return canvasTex(W, H, c => {
      const r = srand(21); c.fillStyle = '#d97886'; c.fillRect(0, 0, W, H);
      for (let i = 0; i < 160; i++) { const [x, y] = P(-.9 + r() * 1.8, -.7 + r() * .7); c.strokeStyle = 'rgba(255,200,205,.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 15, y - 8, x + 30, y + (r() - .5) * 10); c.stroke(); }
      const OUTL = [[-.9, .25], [-.45, .25], [-.4, -.15], [-.32, -.15], [-.3, .42], [-.15, .5], [.15, .5], [.3, .42], [.32, -.15], [.4, -.15], [.45, .25], [.9, .25]];
      c.strokeStyle = '#f2b4bc'; c.lineWidth = .16 * K; c.lineJoin = 'round'; c.beginPath(); OUTL.forEach((p, i) => { const q = P(p[0], p[1] - .02); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.stroke();
      c.strokeStyle = 'rgba(200,110,125,.6)'; c.lineWidth = 1; for (let i = 0; i < 400; i++) { const k = Math.floor(r() * (OUTL.length - 1)), u = r(), a = OUTL[k], b = OUTL[k + 1], [x, y] = P(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - .02 - (r() - .5) * .1); c.beginPath(); c.arc(x, y, 3 + r() * 2, 0, 7); c.stroke(); }
      const ln = (pts, col, wd) => { c.strokeStyle = col; c.lineWidth = wd; c.lineCap = 'round'; c.beginPath(); pts.forEach((p, i) => { const q = P(p[0], p[1]); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.stroke(); };
      ln([[-.9, -.55], [-.3, -.5], [0, -.42], [.4, -.5], [.9, -.55]], '#c63a3a', 9); ln([[-.9, -.62], [-.3, -.6], [.2, -.58], [.9, -.64]], '#3a52b8', 9);
      [[-.22, .1], [.22, .1], [0, .25], [-.25, -.05], [.25, -.05]].forEach(([x, y]) => ln([[x * .2, -.7], [x * .5, -.35], [x * .9, y]], '#f2c94c', 5));
    });
  }
  M3.dil = {
    title: 'Dil', ico: '👅', tag: 'Kemoreseptör · Duyu epiteli', cam: [1.6, 4.6, 7.0], target: [.9, .3, .1], labScale: .8,
    layers: [['Filiform papilla (tat tomurcuğu yok)', 'fil'], ['Mantar şekilli papilla', 'fun'], ['Çevrili ve yaprak şekilli papilla', 'cir'], ['Tat tomurcukları', 'bud'], ['Dudaklar, dişler ve diş eti', 'agiz'], ['Papilla (büyütülmüş kesit)', 'zoom'], ['“Dil haritası” efsanesi (yanlış)', 'mit', 'off']],
    task: 'Parlayan sarı tat tomurcuklarını bul ve tıkla; hangi papillalarda bulunduklarını not et. Sağdaki büyütülmüş papilla kesitinde tat tomurcuklarının papillanın yan duvarlarına nasıl gömüldüğünü incele. Tat tomurcuklarının reseptör çeşidini ve yapısını (duyu epiteli) belirle. “Dil haritası efsanesi” katmanını açıp gerçekle karşılaştır.',
    q: { q: 'Dildeki tat tomurcukları için hangisi doğrudur?', o: ['Nöron yapısında mekanoreseptör', 'Duyu epiteli yapısında kemoreseptör', 'Nöron yapısında fotoreseptör', 'Duyu epiteli yapısında nosiseptör'], a: 1, e: 'Tat tomurcukları duyu epiteli yapısındadır ve kimyasal uyaranları (tat molekülleri) algılayan kemoreseptörler içerir. Dilde ayrıca termoreseptörler de bulunur.' },
    build() {
      const { g, sels, ticks, S, G } = B(), api = {};
      const geo = new THREE.SphereGeometry(1, 96, 64); const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) { let x = pos.getX(i) * 1.3, y = pos.getY(i) * .42, z = pos.getZ(i) * 2.4; const tp = 1 - .5 * Math.pow(Math.max(0, z) / 2.4, 2); x *= tp; if (y > 0) y -= .045 * Math.exp(-Math.pow(x / .1, 2)) * (z > -1.2 ? 1 : 0) * (z < 2.1 ? 1 : .4); if (y < 0) y *= .8; pos.setXYZ(i, x, y, z); }
      geo.computeVertexNormals();
      const body = S(new THREE.Mesh(geo, mt(0xffffff, { map: tongueTex(), roughness: .7 })), 'Dil gövdesi', 'Kas yapılı, hareketli bir organdır. Yüzeyindeki papillalarda tat tomurcukları bulunur. Dilde kemoreseptörlerin yanı sıra termoreseptörler de yer alır.', 'Duyu organı', 'fil'); g.add(body);
      const rr = srand(17);
      /* filiform */
      const fil = S(instMesh(new THREE.ConeGeometry(.016, .05, 5), mt(0xd98793, { roughness: .9 }), 1600, (i, d) => { let x, z; do { x = (rr() * 2 - 1) * 1.3; z = (rr() * 2 - 1) * 2.4; } while (tongueTopY(x, z) <= .03); d.position.set(x, tongueTopY(x, z) + .012, z); d.rotation.set((rr() - .5) * .5, 0, (rr() - .5) * .5); }), 'Filiform (iplik şekilli) papilla', 'Dil yüzeyini kaplayan, en çok sayıdaki küçük çıkıntılardır. Dile pürüzlü bir doku verir; tat tomurcuğu bulundurmaz.', 'Dil yüzeyi · tat tomurcuğu yok', 'fil'); g.add(fil);
      /* mantar şekilli papillalar + tomurcuk */
      const funPos = []; for (let i = 0; i < 120 && funPos.length < 56; i++) { const tip = rr() < .55; const z = tip ? .7 + rr() * 1.5 : -.6 + rr() * 2.3; const w = 1.3 * (1 - .5 * Math.pow(Math.max(0, z) / 2.4, 2)) * Math.sqrt(Math.max(0, 1 - (z / 2.4) ** 2)); const x = (tip ? (rr() * 2 - 1) : (rr() < .5 ? -1 : 1) * (.7 + rr() * .3)) * w * .92; if (tongueTopY(x, z) > .03) funPos.push([x, z]); }
      const fun = S(instMesh(new THREE.SphereGeometry(.06, 12, 8), mt(0xc8344f, { roughness: .5 }), funPos.length, (i, d) => { const [x, z] = funPos[i]; d.position.set(x, tongueTopY(x, z) + .035, z); d.scale.set(1, .7, 1); }), 'Mantar şekilli papilla', 'Özellikle dil ucunda ve kenarlarında bulunan, mantara benzeyen kırmızımsı papillalardır. Üst yüzeylerinde tat tomurcukları bulunur.', 'Tat tomurcuğu içerir', 'fun'); g.add(fun);
      const bud = []; funPos.forEach(([x, z]) => { const b = S(new THREE.Mesh(new THREE.SphereGeometry(.026, 8, 8), mt(0xffd34d, { emissive: 0xaa8000 })), 'Tat tomurcuğu', 'Tat tomurcukları duyu epiteli yapısındadır. İçlerindeki kemoreseptörler (tat reseptör hücreleri) tat moleküllerini algılar; uyartılar nöronlarla merkezî sinir sistemine iletilir.', 'Kemoreseptör · duyu epiteli', 'bud'); at(b, x, tongueTopY(x, z) + .085, z); g.add(b); bud.push(b); });
      /* çevrili papillalar (V şekli) */
      for (let i = 0; i < 9; i++) { const side = i - 4, x = side * .2, z = -1.3 + Math.abs(side) * .13; const y = tongueTopY(x, z);
        const cp = S(new THREE.Mesh(new THREE.CylinderGeometry(.1, .11, .1, 20), mt(0xbf5266, { roughness: .5 })), 'Çevrili papilla', 'Dilin arka kısmında “V” şeklinde dizilmiş, etrafı oluklu büyük papillalardır. Kenarlarında çok sayıda tat tomurcuğu bulunur.', 'Tat tomurcuğu içerir', 'cir'); at(cp, x, y + .03, z); g.add(cp);
        const tr = G(at(new THREE.Mesh(new THREE.TorusGeometry(.145, .025, 8, 24).rotateX(Math.PI / 2), mt(0x7a2b3a)), x, y + .0, z), 'cir'); g.add(tr);
        for (let k = 0; k < 4; k++) { const a = k * 1.57 + .4, b = S(new THREE.Mesh(new THREE.SphereGeometry(.023, 8, 8), mt(0xffd34d, { emissive: 0xaa8000 })), 'Tat tomurcuğu', 'Tat tomurcukları duyu epiteli yapısındadır. İçlerindeki kemoreseptörler tat moleküllerini algılar.', 'Kemoreseptör · duyu epiteli', 'bud'); at(b, x + Math.cos(a) * .115, y + .02, z + Math.sin(a) * .115); g.add(b); bud.push(b); } }
      /* yaprak şekilli papilla */
      [-1, 1].forEach(sd => { for (let i = 0; i < 7; i++) { const z = -1.5 + i * .17, x = sd * (1.05 - Math.abs(z + 1) * .25); const f = S(new THREE.Mesh(new THREE.BoxGeometry(.2, .1, .035), mt(0xb04a5e)), 'Yaprak şekilli papilla', 'Dilin arka yan kenarlarında bulunan, yaprağa benzeyen kıvrımlı papillalardır; tat tomurcukları içerir.', 'Tat tomurcuğu içerir', 'cir'); at(f, x, tongueTopY(x * .9, z) + .02, z); f.rotation.y = Math.PI / 2; f.rotation.z = sd * .2; g.add(f); const b = S(new THREE.Mesh(new THREE.SphereGeometry(.02, 8, 8), mt(0xffd34d, { emissive: 0xaa8000 })), 'Tat tomurcuğu', 'Tat tomurcukları duyu epiteli yapısındadır.', 'Kemoreseptör · duyu epiteli', 'bud'); at(b, x, tongueTopY(x * .9, z) + .09, z); g.add(b); bud.push(b); } });
      ticks.push(t => bud.forEach((b, i) => b.scale.setScalar(1 + Math.sin(t * 3 + i) * .22)));
      const root = S(ellip(1.1, .3, .5, mt(0xc75d6c, { roughness: .7 }), 24), 'Dil kökü', 'Dilin arka, yutağa bakan bölümüdür.', 'Dil', 'fil'); at(root, 0, -.02, -2.45); g.add(root);
      /* — AĞIZ: dudaklar, dişler, diş eti — */
      const archPts = (t0, t1, s, y) => { const p = []; for (let i = 0; i <= 30; i++) { const t = t0 + (t1 - t0) * i / 30; p.push(V3(1.6 * t * s, y, 2.75 + (s - 1) * .5 - 2.4 * t * t)); } return p; };
      const toothMat = mt(0xf6f1e4, { roughness: .25 });
      const tooth = (t, y, up) => { const at_ = Math.abs(t), w = at_ < .25 ? .075 : at_ < .4 ? .08 : at_ < .62 ? .11 : .15, h = at_ < .4 ? .17 : .13, d = at_ < .4 ? .065 : w; const m = S(ellip(w, h, d, toothMat, 14), 'Dişler', 'Besinleri koparıp öğütür; çiğnenen besinin tükürükle karışması tadın algılanmasını kolaylaştırır.', 'Ağız', 'agiz'); m.position.set(1.6 * t, y + (up ? -h * .6 : h * .6), 2.75 - 2.4 * t * t); m.rotation.y = -Math.atan2(-4.8 * t, 1.6); g.add(m); };
      [.07, .2, .33, .47, .6, .76, .93].forEach(t => { tooth(t, -.02, 0); tooth(-t, -.02, 0); });
      const gum = mt(0xdf7482, { roughness: .55 });
      g.add(S(curveTube(archPts(-1, 1, 1, -.08), .16, gum, 80), 'Diş eti', 'Dişlerin köklerini saran ve çene kemiğini örten pembe dokudur.', 'Ağız', 'agiz'));
      const lip = mt(0xc95463, { roughness: .45 });
      g.add(S(curveTube(archPts(-.62, .62, 1.12, -.16), .25, lip, 60), 'Dudaklar', 'Ağzın girişini çevreleyen, kaslı ve duyarlı yapılardır. Dudak derisinde çok sayıda dokunma reseptörü bulunur.', 'Ağız', 'agiz'));
      g.add(G(at(new THREE.Mesh(new THREE.CircleGeometry(1, 40).rotateX(-Math.PI / 2), mt(0xb4505e, { roughness: .7 })), 0, -.24, .2), 'agiz')); g.children[g.children.length - 1].scale.set(1.75, 1, 2.6);
      /* — BÜYÜTÜLMÜŞ PAPİLLA KESİTİ — */
      const Z = new THREE.Group(); Z.position.set(3.9, .55, -.5); Z.scale.setScalar(1.35); g.add(Z);
      const sh = new THREE.Shape(); [[-.9, -.7], [.9, -.7], [.9, .25], [.45, .25], [.4, -.15], [.32, -.15], [.3, .42], [.15, .5], [-.15, .5], [-.3, .42], [-.32, -.15], [-.4, -.15], [-.45, .25], [-.9, .25]].forEach((p, i) => i ? sh.lineTo(p[0], p[1]) : sh.moveTo(p[0], p[1]));
      const ptex = papillaTex(); ptex.repeat.set(1 / 1.8, 1 / 1.2); ptex.offset.set(.9 / 1.8, .7 / 1.2); ptex.wrapS = ptex.wrapT = THREE.ClampToEdgeWrapping;
      const pg = new THREE.ExtrudeGeometry(sh, { depth: .7, bevelEnabled: false }); pg.translate(0, 0, -.35);
      const pap = S(new THREE.Mesh(pg, mt(0xffffff, { map: ptex, roughness: .7 })), 'Papilla (büyütülmüş kesit)', 'Dil yüzeyindeki küçük çıkıntılardır. Bu kesitte çevrili bir papilla görülüyor: papillanın yan duvarlarında ve çevresindeki oluğun kenarlarında tat tomurcukları bulunur. Altındaki bağ dokuda sinir lifleri ve kan damarları yer alır.', 'Tat tomurcuklarını taşır', 'zoom'); Z.add(pap);
      [[-.31, .02], [-.31, .2], [-.31, .34], [.31, .02], [.31, .2], [.31, .34], [-.41, .05], [.41, .05]].forEach(([x, y]) => { const b = S(ellip(.045, .085, .05, mt(0x8f6ad6, { emissive: 0x241240, roughness: .35 }), 14), 'Tat tomurcuğu', 'Tat tomurcukları duyu epiteli yapısındadır. İçlerindeki kemoreseptörler tat moleküllerini algılar. Ayrıntısı için “Tat Tomurcuğu” modelini incele.', 'Kemoreseptör · duyu epiteli', 'zoom'); b.position.set(x, y, .36); Z.add(b); });
      const lab = labelSprite('Papilla (büyütülmüş)', .7); lab.position.set(0, -1.05, 0); Z.add(G(lab, 'zoom'));
      { const P0 = V3(0, tongueTopY(0, -1.3) + .05, -1.3); g.add(G(at(new THREE.Mesh(new THREE.TorusGeometry(.3, .02, 8, 40).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xffffff })), P0.x, P0.y + .04, P0.z), 'zoom'));
        [[-.9 * 1.35, .5 * 1.35], [-.9 * 1.35, -.7 * 1.35]].forEach(([dx, dy]) => { const ln = new THREE.Line(new THREE.BufferGeometry().setFromPoints([P0.clone().add(V3(.3, .05, 0)), V3(3.9 + dx, .55 + dy, -.5 + .35 * 1.35)]), new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: .12, gapSize: .08 })); ln.computeLineDistances(); g.add(G(ln, 'zoom')); }); }
      /* efsane haritası */
      const tex = canvasTex(256, 420, (x, w, h) => { x.clearRect(0, 0, w, h); const z = [['#ff5da8', 'TATLI', .75, 1], ['#ffd34d', 'TUZLU', .5, .75], ['#59e08a', 'EKŞİ', .2, .5], ['#6b8aff', 'ACI', 0, .2]]; x.globalAlpha = .65; z.forEach(([c, t, a, b]) => { x.fillStyle = c; x.fillRect(0, h * (1 - b), w, h * (b - a)); }); x.globalAlpha = 1; x.fillStyle = '#fff'; x.font = '800 26px sans-serif'; x.textAlign = 'center'; z.forEach(([c, t, a, b]) => x.fillText(t, w / 2, h * (1 - (a + b) / 2) + 8)); x.fillStyle = 'rgba(255,60,60,.95)'; x.font = '800 34px sans-serif'; x.fillText('✖ EFSANE', w / 2, 36); });
      const mit = G(new THREE.Mesh(new THREE.PlaneGeometry(3.0, 5.0).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })), 'mit'); mit.position.set(0, .62, 0); mit.visible = false; g.add(mit);
      /* tat molekülleri */
      const mols = []; for (let i = 0; i < 30; i++) { const m = glow([0x6ee7b7, 0xffd34d, 0xff7ab8, 0x8ab4ff][i % 4], .05); g.add(m); mols.push({ m, p: Math.random(), x: (Math.random() - .5) * 2, z: (Math.random() - .5) * 4.4, s: .15 + Math.random() * .1 }); }
      ticks.push((t, dt) => mols.forEach(o => { o.p += dt * o.s; if (o.p > 1) o.p = 0; o.m.position.set(o.x, 2.2 - o.p * 1.9, o.z); }));
      return { g, sels, ticks, api };
    }
  };

  /* ============ TAT TOMURCUĞU (ayrıntı) ============ */
  M3.tattomurcugu = {
    title: 'Tat Tomurcuğu (ayrıntı)', ico: '🍋', tag: 'Kemoreseptör · Duyu epiteli', cam: [5.2, 2.2, 7.6], target: [0, .6, 0], labScale: .8,
    layers: [['Tükürük ve çözünen maddeler', 'sal'], ['Tat tomurcuğu (reseptör ve destek hücreleri)', 'bud'], ['Dil epiteli ve alt doku', 'epi'], ['Sinir lifleri', 'sin']],
    task: 'Tükürükte çözünen tat moleküllerinin tat gözeneğinden girip tat reseptör hücrelerinin tüycüklerine ulaşmasını izle. Beş renkteki reseptör hücrelerinin beş temel tadı (tatlı, ekşi, tuzlu, acı, umami) temsil ettiğine dikkat et. Reseptör hücrelerin duyu epiteli yapısında olduğunu, sinir liflerinin ise nöron olduğunu not et.',
    q: { q: 'Tat alma sürecinde besinlerdeki kimyasal maddeler önce nerede çözünür?', o: ['Tükürükte', 'Kan damarlarında', 'Kulak zarında', 'Miyelin kılıfta'], a: 0, e: 'Besinlerdeki kimyasal maddeler tükürükte çözünür; çözünen maddeler tat tomurcuklarındaki reseptörleri uyarır.' },
    build() {
      const { g, sels, ticks, S, G } = B(), api = { act: [0, 0, 0, 0, 0] };
      /* renkler: tatlı pembe, ekşi sarı, tuzlu mavi, acı mor, umami yeşil */
      const TCOL = [0xff6ec7, 0xffd84d, 0x4aa8ff, 0x9b5cff, 0x4fd27a], TN = ['tatlı', 'ekşi', 'tuzlu', 'acı', 'umami'];
      const rr = srand(5);
      /* dil epiteli: kaldırım taşı gibi hücreler (tomurcuğun önü açık) */
      const EC = []; for (let y = -.55; y <= 1.55; y += .3) for (let x = -2.5; x <= 2.5; x += .32) for (let z = -1.25; z <= 1.25; z += .32) { const px = x + (rr() - .5) * .1, pz = z + (rr() - .5) * .1; if (Math.hypot(px, pz) < 1.05) continue; if (pz > .35 && Math.abs(px) < 1.9) continue; EC.push([px, y + (rr() - .5) * .06, pz]); }
      const ep = S(instMesh(new THREE.SphereGeometry(1, 12, 10), mt(0xffffff, { roughness: .55 }), EC.length, (i, d) => { d.position.set(...EC[i]); d.scale.set(.17, .15, .17); }), 'Dil epiteli', 'Dilin yüzeyini örten hücre tabakasıdır; tat tomurcukları bu tabakanın içine gömülüdür.', 'Epitel doku', 'epi');
      { const c = new THREE.Color(); for (let i = 0; i < EC.length; i++) { c.setHSL(.97 + rr() * .02, .62, .66 + rr() * .07); ep.setColorAt(i, c); } ep.instanceColor.needsUpdate = true; } g.add(ep);
      const lp = S(new THREE.Mesh(new THREE.BoxGeometry(5.4, 1.2, 2.6), mt(0xc0566a, { roughness: .8 })), 'Alt doku (bağ doku)', 'Epitelin altındaki, kan damarları ve sinir liflerini bulunduran dokudur.', 'Alt doku', 'epi'); at(lp, 0, -1.4, 0); g.add(lp);
      [[.9, 0xc8302c], [.5, 0x3550c0]].forEach(([z, c]) => g.add(G(curveTube([[-2.7, -1.05, z], [-1, -1.1, z + .1], [1, -1.0, z - .05], [2.7, -1.08, z]], .09, mt(c, { roughness: .4 }), 30), 'epi')));
      const sal = S(new THREE.Mesh(new THREE.BoxGeometry(5.4, 1.3, 2.6), glass(0x9fd9ff, .18)), 'Tükürük', 'Besinlerdeki kimyasal maddelerin çözündüğü sıvıdır; çözünen maddeler tat tomurcuklarındaki reseptörlere ulaşır.', 'Çözücü sıvı', 'sal'); sal.userData.low = true; at(sal, 0, 2.4, 0); g.add(sal);
      /* tomurcuk hücreleri (soğan biçimi, iğ şekilli) */
      const N = 18, cells = [];
      const spindle = (curve, R) => { const geo = new THREE.TubeGeometry(curve, 24, 1, 10, false), p = geo.attributes.position; for (let i = 0; i <= 24; i++) { const u = i / 24, P = curve.getPointAt(u), k = R * (.25 + .95 * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.05)), .7)); for (let j = 0; j <= 10; j++) { const id = i * 11 + j, v = V3(p.getX(id), p.getY(id), p.getZ(id)).sub(P).multiplyScalar(k).add(P); p.setXYZ(id, v.x, v.y, v.z); } } geo.computeVertexNormals(); return geo; };
      for (let i = 0; i < N; i++) {
        const a = i / N * 6.283, isRec = i % 3 !== 2, t = Math.floor(i * 5 / N) % 5;
        const base = V3(Math.cos(a) * .5, -.55, Math.sin(a) * .5), top = V3(Math.cos(a) * .1, 1.5, Math.sin(a) * .1), mid = V3(Math.cos(a) * .74, .5, Math.sin(a) * .74);
        const c = new THREE.CatmullRomCurve3([base, mid, top]), col = isRec ? TCOL[t] : 0xd9c6ea;
        const m = S(new THREE.Mesh(spindle(c, isRec ? .15 : .12), mt(col, { emissive: 0x000000, roughness: .4 })), isRec ? 'Tat reseptör hücresi' : 'Destek hücresi', isRec ? 'Tat tomurcuğunun içindeki, tat moleküllerini algılayan duyu hücresidir (kemoreseptör). Duyu epiteli yapısındadır; ucundaki tüycükler tat gözeneğine uzanır. Altında sinir uçlarıyla temas eder. Renkler beş temel tadı temsil eder: tatlı (pembe), ekşi (sarı), tuzlu (mavi), acı (mor), umami (yeşil).' : 'Tat reseptör hücrelerini saran ve destekleyen hücrelerdir.', isRec ? 'Kemoreseptör · duyu epiteli · ' + TN[t] : 'Destek', 'bud');
        g.add(m); cells.push({ m, rec: isRec, t });
        g.add(G(at(ellip(.07, .1, .07, mt(new THREE.Color(col).multiplyScalar(.6).getHex()), 10), ...c.getPointAt(.45).toArray()), 'bud'));
        if (isRec) for (let k = 0; k < 3; k++) { const tf = S(cylBetween(top, top.clone().add(V3((rr() - .5) * .22, .4, (rr() - .5) * .22)), .011, mt(col, { emissive: 0x333333 }), 4), 'Tat tüycükleri', 'Reseptör hücrenin ucundaki ince uzantılardır; tat gözeneğinden içeri giren moleküller burada reseptörlere bağlanır.', 'Reseptörlerin bulunduğu uç', 'bud'); g.add(tf); }
      }
      const pore = S(new THREE.Mesh(new THREE.TorusGeometry(.22, .06, 10, 28).rotateX(Math.PI / 2), mt(0xb0566a, { roughness: .5 })), 'Tat gözeneği', 'Tat tomurcuğunun tükürükle temas ettiği küçük açıklıktır; çözünmüş tat molekülleri buradan tomurcuğa girer.', 'Moleküllerin girişi', 'bud'); at(pore, 0, 1.6, 0); g.add(pore);
      for (let i = 0; i < 8; i++) { const b = S(ellip(.1, .08, .1, mt(0x8c7bb8), 10), 'Bazal hücre', 'Tat tomurcuğunun tabanında bulunan, yıpranan tat hücrelerinin yenilenmesini sağlayan hücrelerdir.', 'Yenilenme', 'bud'); at(b, Math.cos(i * .8) * .45, -.62, Math.sin(i * .8) * .45); g.add(b); }
      /* sinirler */
      const nv = [];
      for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283 + .3; const pts = [[Math.cos(a) * .55, -.42, Math.sin(a) * .55], [Math.cos(a) * .42, -.9, Math.sin(a) * .42], [Math.cos(a) * .22, -1.35, Math.sin(a) * .22], [0, -1.85, 0]]; const t = S(curveTube(pts, .032, mt(0xffd34d, { emissive: 0x2b2100 }), 14), 'Duyu siniri lifi (nöron)', 'Tat reseptör hücrelerinden aldığı mesajı beyne taşıyan sinir hücresi uzantısıdır.', 'Uyartıyı iletir', 'sin'); g.add(t); nv.push(t); }
      const tr = S(curveTube([[0, -1.85, 0], [0, -2.5, .6], [-1.0, -3.3, 1.8], [-2.5, -4.0, 3.0]], .13, mt(0xf5c542, { emissive: 0x2b2100 }), 24), 'Tat siniri (beyne giden sinir)', 'Tat tomurcuklarından gelen sinirsel mesajları merkezî sinir sistemine (beyne) taşıyan sinirdir.', 'Uyartıyı beyne taşır', 'sin'); g.add(tr);
      { const f = pathFollower(0xffffff, .09, [V3(0, -.4, 0), V3(0, -1.85, 0), V3(0, -2.5, .6), V3(-1, -3.3, 1.8), V3(-2.5, -4.0, 3.0)], .2, 0); g.add(G(f.orb, 'sin')); ticks.push(t => f.tick(t)); }
      /* moleküller */
      const mol = []; for (let i = 0; i < 60; i++) { const t = i % 5; const m = new THREE.Mesh(t === 0 ? new THREE.SphereGeometry(.07, 8, 8) : t === 1 ? new THREE.OctahedronGeometry(.08) : t === 2 ? new THREE.BoxGeometry(.1, .1, .1) : t === 3 ? new THREE.TetrahedronGeometry(.1) : new THREE.IcosahedronGeometry(.08), new THREE.MeshBasicMaterial({ color: TCOL[t] })); g.add(G(m, 'sal')); mol.push({ m, t, u: Math.random(), ang: Math.random() * 6.283, r: Math.random() }); }
      api.molType = -1; api.rate = 1; api.dry = false;
      ticks.push((tm, dt) => mol.forEach(o => { const vis = (api.molType < 0 || api.molType === o.t); o.m.visible = vis && !api.dry; if (!o.m.visible) return; o.u += dt * .16 * api.rate; if (o.u > 1) { o.u = 0; o.ang = Math.random() * 6.283; o.r = Math.random(); api.act[o.t] = Math.min(1, api.act[o.t] + .35); } const rad = (1 - o.u) * (2.0 * (1 - o.u) + .1) * o.r + .02; o.m.position.set(Math.cos(o.ang + o.u * 3) * rad, 3.0 - o.u * 1.4, Math.sin(o.ang + o.u * 3) * rad); o.m.rotation.x += dt * 2; o.m.rotation.y += dt * 2; }));
      ticks.push((tm, dt) => { for (let i = 0; i < 5; i++) api.act[i] = Math.max(0, api.act[i] - dt * .5); cells.forEach(c => { if (!c.rec) return; const e = api.act[c.t]; c.m.material.emissive.setHex(TCOL[c.t]).multiplyScalar(e * .55); }); nv.forEach(n => { const e = Math.max(...api.act); n.material.emissive.setRGB(.17 + e * .6, .13 + e * .45, 0); }); });
      api.TN = TN; api.TCOL = TCOL;
      return { g, sels, ticks, api };
    }
  };
})();
