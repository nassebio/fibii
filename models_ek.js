/* Nasse Biology — ek 3B modeller (PDF: 11.1.5 Duyu Reseptörleri ve Duyu Organları)
   Ayrıntılı nöron, sinaps, hücre gövdesi, zar potansiyeli, miyelin, sinir demeti, sinaps çeşitleri,
   hayvanlarda duyular, reseptör galerisi ve akson uzunluğu (siyatik–vagus). */
(function () {
  /* ---------- yardımcılar ---------- */
  function mergeGeos(list) {
    const pos = [], nor = [], uv = [], idx = []; let off = 0;
    list.forEach(g => {
      const p = g.attributes.position, n = g.attributes.normal, u = g.attributes.uv;
      for (let i = 0; i < p.count; i++) { pos.push(p.getX(i), p.getY(i), p.getZ(i)); if (n) nor.push(n.getX(i), n.getY(i), n.getZ(i)); else nor.push(0, 1, 0); if (u) uv.push(u.getX(i), u.getY(i)); else uv.push(0, 0); }
      if (g.index) for (let i = 0; i < g.index.count; i++) idx.push(g.index.getX(i) + off); else for (let i = 0; i < p.count; i++) idx.push(i + off);
      off += p.count;
    });
    const m = new THREE.BufferGeometry(); m.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); m.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); m.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); m.setIndex(idx); return m;
  }
  function taperGeo(pts, r0, r1, seg, rad) {
    seg = seg || 24; rad = rad || 8;
    const c = new THREE.CatmullRomCurve3(pts.map(p => Array.isArray(p) ? V3(...p) : p.clone()));
    const g = new THREE.TubeGeometry(c, seg, 1, rad, false), p = g.attributes.position;
    for (let i = 0; i <= seg; i++) { const u = i / seg, P = c.getPointAt(u), r = r0 + (r1 - r0) * u; for (let j = 0; j <= rad; j++) { const id = i * (rad + 1) + j, v = V3(p.getX(id), p.getY(id), p.getZ(id)).sub(P).multiplyScalar(r).add(P); p.setXYZ(id, v.x, v.y, v.z); } }
    g.computeVertexNormals(); return g;
  }
  function capsuleGeo(r, len, seg) { const pts = [], n = 8; for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + i / n * Math.PI / 2; pts.push(new THREE.Vector2(Math.cos(a) * r + 1e-4, -len / 2 + Math.sin(a) * r)); } for (let i = 0; i <= n; i++) { const a = i / n * Math.PI / 2; pts.push(new THREE.Vector2(Math.cos(a) * r + 1e-4, len / 2 + Math.sin(a) * r)); } return new THREE.LatheGeometry(pts, seg || 16); }
  function randPerp(d, r) { const a = Math.abs(d.y) < .9 ? V3(0, 1, 0) : V3(1, 0, 0), p1 = new THREE.Vector3().crossVectors(d, a).normalize(), p2 = new THREE.Vector3().crossVectors(d, p1).normalize(), t = r() * 6.283; return p1.multiplyScalar(Math.cos(t)).add(p2.multiplyScalar(Math.sin(t))); }
  /* dallanan ağaç (dendrit / akson ucu); geometrileri ve uçları döndürür */
  function growTree(start, dir, len, r, depth, rnd, geos, tips, opt) {
    opt = opt || {}; const spread = opt.spread || .55, shrink = opt.shrink || .68;
    const mid = start.clone().addScaledVector(dir, len * .5).addScaledVector(randPerp(dir, rnd), len * .12), end = start.clone().addScaledVector(dir, len).addScaledVector(randPerp(dir, rnd), len * .1);
    geos.push(taperGeo([start, mid, end], r, r * .72, 10, 7));
    if (depth <= 0) { tips.push({ p: end, d: end.clone().sub(mid).normalize() }); return; }
    const n = opt.n || 2;
    for (let k = 0; k < n; k++) { const nd = dir.clone().addScaledVector(randPerp(dir, rnd), spread * (.7 + rnd() * .6)).normalize(); growTree(end, nd, len * shrink, r * .7, depth - 1, rnd, geos, tips, opt); }
  }
  function canvasPlane(w, h, px, draw) {
    const t = canvasTex(px, Math.round(px * h / w), () => { }); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    m.redraw = (...a) => { draw(t._x, t._c.width, t._c.height, ...a); t.needsUpdate = true; }; m.redraw(); return m;
  }
  function signTex(s, col) { return canvasTex(64, 64, (x) => { x.fillStyle = col; x.beginPath(); x.arc(32, 32, 28, 0, 7); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 7; x.beginPath(); x.moveTo(17, 32); x.lineTo(47, 32); if (s === '+') { x.moveTo(32, 17); x.lineTo(32, 47); } x.stroke(); }); }
  function stripeTex(c1, c2, n) { return canvasTex(64, 256, (c, w, h) => { for (let i = 0; i < n; i++) { c.fillStyle = i % 2 ? c1 : c2; c.fillRect(0, i * h / n, w, h / n + 1); } }); }
  function lipidTex(head, tail) { return canvasTex(256, 128, (c, w, h) => { c.fillStyle = tail; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 1.5; for (let x = 4; x < w; x += 8) { c.beginPath(); c.moveTo(x, 14); c.lineTo(x + 2, 60); c.moveTo(x, h - 14); c.lineTo(x - 2, h - 60); c.stroke(); } c.fillStyle = head; for (let x = 4; x < w; x += 8) { c.beginPath(); c.arc(x, 9, 4.5, 0, 7); c.fill(); c.beginPath(); c.arc(x, h - 9, 4.5, 0, 7); c.fill(); } }); }
  function pedestal(g, G, x, z, col, r, py) { py = py === undefined ? -1.5 : py; const p = new THREE.Mesh(new THREE.CylinderGeometry(r || 1.25, (r || 1.25) * 1.08, .22, 40), mt(col || 0x1d3b63, { roughness: .6 })); at(p, x, py, z); g.add(G ? G(p, '') : p); const ring = new THREE.Mesh(new THREE.TorusGeometry((r || 1.25) * 1.04, .04, 8, 48).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: col === 0x1d3b63 ? 0x22d3ee : 0xffffff })); at(ring, x, py + .12, z); g.add(ring); return p; }
  function label(g, txt, x, y, z, s) { const sp = labelSprite(txt, (s || .8) * 2.1); sp.position.set(x, y, z); g.add(sp); return sp; }
  const egeo = (rx, ry, rz, seg) => new THREE.SphereGeometry(1, seg || 28, Math.round((seg || 28) * .75)).scale(rx, ry, rz);
  const NERVE = () => mt(0xf3c84b, { emissive: 0x2b2100, roughness: .45 });

  /* ================= NÖRON (ayrıntılı) ================= */
  const prevNoron = M3.noron;
  M3.noron = Object.assign({}, prevNoron, {
    title: 'Nöron', ico: '🧬', tag: 'Hücre gövdesi · Dendrit · Akson', cam: [-0.6, 3.4, 12.5], target: [-.8, 0, 0], labScale: .9,
    layers: [['Dendritler', 'den'], ['Hücre gövdesi ve içi', 'gov'], ['Akson ve miyelin', 'aks'], ['Akson ucu ve sinaptik uçlar', 'uc'], ['Uyartı (impuls)', 'imp']],
    task: 'Nöronun yapılarını tek tek tıkla: dendrit, hücre gövdesi, çekirdek, mitokondri, nörofibriller, akson, miyelin kılıf, Schwann hücresi, Ranvier boğumu, akson ucu ve sinaptik uçlar. Parlayan uyartının dendritten aksona doğru ilerleyişini ve Ranvier boğumlarında “sıçrayışını” izle.',
    build() {
      const { g, sels, ticks, S, G } = B(), rnd = srand(77), C = V3(-3.6, 0, 0);
      /* hücre gövdesi: tümsekli, dendrit köklerine doğru çekilmiş */
      const DIRS = [[-1, .55, .25], [-.75, -.6, .35], [-.2, .95, -.3], [-.35, -.9, -.4], [-.9, .1, -.75], [-.6, .2, .95], [.1, .8, .65], [.05, -.75, .75]].map(d => V3(...d).normalize());
      const sg = new THREE.IcosahedronGeometry(1, 5), sp = sg.attributes.position;
      for (let i = 0; i < sp.count; i++) { const v = V3(sp.getX(i), sp.getY(i), sp.getZ(i)).normalize(); let r = .95; DIRS.forEach(d => { r += .38 * Math.pow(Math.max(0, v.dot(d)), 14); }); r += .45 * Math.pow(Math.max(0, v.x), 10); r += .03 * Math.sin(v.x * 13) * Math.sin(v.y * 11) * Math.sin(v.z * 9); v.multiplyScalar(r); sp.setXYZ(i, v.x, v.y, v.z); }
      sg.computeVertexNormals();
      const soma = S(new THREE.Mesh(sg, mt(0x6c8dff, { transparent: true, opacity: .42, depthWrite: false, roughness: .3, side: THREE.DoubleSide })), 'Hücre gövdesi', 'Nöronun çekirdek, organeller ve sitoplazmayı bulunduran kısmıdır. Nöronlarda enerji ihtiyacı fazla olduğundan çok sayıda mitokondri vardır. Sitoplazmadaki nörofibriller nörona şekil verir ve hücre içinde madde taşınmasını sağlar.', 'Yaşamsal faaliyet merkezi', 'gov');
      soma.position.copy(C); soma.userData.low = true; g.add(soma);
      const nuc = S(ellip(.42, .4, .4, mt(0x7b3fd6, { roughness: .35, emissive: 0x1a0640 }), 32), 'Çekirdek', 'Hücrenin faaliyetlerini yönetir ve kalıtsal bilgiyi taşır.', 'Hücre gövdesinde', 'gov'); nuc.position.copy(C).add(V3(-.05, .05, 0)); g.add(nuc);
      g.add(G(at(new THREE.Mesh(new THREE.SphereGeometry(.12, 16, 12), mt(0x2a0c55)), C.x + .08, C.y + .12, C.z + .22), 'gov'));
      const mito = S(instMesh(capsuleGeo(.045, .16, 10), mt(0xff7a3a, { roughness: .4, emissive: 0x401000 }), 34, (i, d) => { let v; do { v = V3(rnd() - .5, rnd() - .5, rnd() - .5).multiplyScalar(2); } while (v.length() > 1 || v.length() < .55); d.position.copy(C).addScaledVector(v, .85); d.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); }), 'Mitokondri', 'Hücrenin enerji (ATP) üreten organelidir. Nöronların enerji ihtiyacı fazla olduğundan hücre gövdesinde çok sayıda mitokondri bulunur.', 'Enerji üretimi', 'gov'); g.add(mito);
      const fibM = mt(0xffcf5a, { emissive: 0x5a3c00, roughness: .4 });
      for (let k = 0; k < 16; k++) { const d = k < 8 ? DIRS[k] : V3(1, (rnd() - .5) * .4, (rnd() - .5) * .4).normalize(); const a = randPerp(d, rnd); const pts = [C.clone().addScaledVector(a, .5), C.clone().addScaledVector(d, .55).addScaledVector(a, .15), C.clone().addScaledVector(d, 1.05), C.clone().addScaledVector(d, k < 8 ? 1.45 : 1.6)]; g.add(S(curveTube(pts, .011, fibM, 20), 'Nörofibriller', 'Nöronun sitoplazmasındaki ince telciklerdir. Hücre gövdesinden dendrit ve aksona doğru boylu boyunca uzanarak hem nörona şekil verir hem de hücre içinde madde taşınması görevini üstlenir.', 'Şekil verme · madde taşıma', 'gov')); }
      /* dendritler */
      const dg = [], tips = [];
      DIRS.forEach(d => growTree(C.clone().addScaledVector(d, 1.15), d, 1.15, .13, 3, rnd, dg, tips, { spread: .62 }));
      const den = S(new THREE.Mesh(mergeGeos(dg), mt(0x3f6dff, { roughness: .45, emissive: 0x050f3a })), 'Dendrit', 'Hücre gövdesinden çıkan çok sayıdaki kısa ve dallanmış uzantılardır. Diğer nöron ve reseptörlerden gelen uyarıları alır, elektrik sinyalleri hâlinde hücre gövdesine iletir.', 'Uyarıyı alır', 'den'); g.add(den);
      g.add(G(instMesh(new THREE.SphereGeometry(.035, 8, 6), mt(0xbfd8ff, { emissive: 0x1a2a55 }), tips.length, (i, d) => d.position.copy(tips[i].p)), 'den'));
      /* akson tepeciği ve akson */
      const AX0 = C.x + 1.3, AX1 = 3.6;
      g.add(S(new THREE.Mesh(taperGeo([[C.x + .9, 0, 0], [C.x + 1.15, 0, 0], [AX0 + .2, 0, 0]], .42, .11, 12, 16), mt(0x5b55e0, { roughness: .4 })), 'Akson', 'Hücre gövdesinden çıkan, dendrite göre daha kalın ve uzun bir uzantıdır. Uyartıyı hücre gövdesinden akson ucuna iletir. Akson çapı ne kadar kalınsa iletim o kadar hızlıdır.', 'Uyartıyı iletir', 'aks'));
      const axon = S(cylBetween([AX0, 0, 0], [AX1 + .1, 0, 0], .11, mt(0x5b55e0, { roughness: .4 }), 16), 'Akson', 'Hücre gövdesinden çıkan, dendrite göre daha kalın ve uzun bir uzantıdır. Uyartıyı hücre gövdesinden akson ucuna iletir. Akson çapı ne kadar kalınsa iletim o kadar hızlıdır.', 'Uyartıyı iletir', 'aks'); g.add(axon);
      const NODES = [], myL = .92, gap = .2; let x = AX0 + .25;
      const myProf = []; for (let i = 0; i <= 12; i++) { const a = i / 12 * Math.PI; myProf.push(new THREE.Vector2(.13 + .18 * Math.pow(Math.sin(a), .35), -myL / 2 + i / 12 * myL)); }
      const myGeo = new THREE.LatheGeometry(myProf, 28).rotateZ(-Math.PI / 2), myMat = mt(0xf5c542, { roughness: .32, emissive: 0x2a1c00 });
      while (x + myL < AX1) {
        const m = S(new THREE.Mesh(myGeo, myMat), 'Miyelin kılıf', 'Schwann hücrelerinin akson etrafında oluşturduğu lipoprotein yapılı örtüdür. Aksonun elektriksel yalıtımını sağlayarak uyartı iletimini hızlandırır. Beyin ve omurilikten iskelet kaslarına giden sinirler genellikle miyelinlidir.', 'Yalıtım · hızlı iletim', 'aks'); at(m, x + myL / 2, 0, 0); g.add(m);
        const sc = S(ellip(.16, .06, .1, mt(0x7de3d1, { roughness: .4 }), 16), 'Schwann hücresi', 'Akson etrafında sarılarak miyelin kılıfı oluşturan hücredir. Bu çıkıntı Schwann hücresinin çekirdekli bölümüdür.', 'Miyelini oluşturur', 'aks'); at(sc, x + myL * .45, .3, (NODES.length % 2 ? -.06 : .06)); g.add(sc);
        x += myL; if (x + gap < AX1) { const nd = S(new THREE.Mesh(new THREE.TorusGeometry(.125, .035, 8, 24).rotateY(Math.PI / 2), mt(0x2fd4c0, { emissive: 0x053b33 })), 'Ranvier boğumu', 'Miyelin kılıfın kesintiye uğradığı yalıtımsız bölgelerdir. Uyartı miyelinli aksonda boğumdan boğuma “sıçrayarak” ilerler; bu da iletimi hızlandırır.', 'Miyelinsiz aralık', 'aks'); at(nd, x + gap / 2, 0, 0); g.add(nd); NODES.push(x + gap / 2); }
        x += gap;
      }
      /* akson ucu ve sinaptik uçlar */
      const tg = [], tt = [];
      [[1, .5, .2], [1, -.45, .3], [1, .1, -.55]].forEach(d => growTree(V3(AX1 + .05, 0, 0), V3(...d).normalize(), .9, .07, 2, rnd, tg, tt, { spread: .7, shrink: .75 }));
      g.add(S(new THREE.Mesh(mergeGeos(tg), mt(0x6a60ee, { roughness: .4 })), 'Akson ucu', 'Aksonların sonlandığı ve dallanarak genişlediği bölgedir. Akson ucundan salgılanan kimyasal maddelerle uyartı diğer nörona veya hedef hücreye iletilir. Dallanmanın çok olması nöronun etki alanını genişletir.', 'Uyartıyı aktarır', 'uc'));
      const bout = S(instMesh(new THREE.SphereGeometry(.12, 16, 12), mt(0xffc93c, { emissive: 0x6a4400, roughness: .3 }), tt.length, (i, d) => { d.position.copy(tt[i].p).addScaledVector(tt[i].d, .06); d.scale.set(1.15, 1, 1); }), 'Sinaptik uç', 'Akson ucundaki her dalın sonlandığı şişkin uçtur. İçindeki keseciklerde nörotransmitter madde bulunur ve uyarıları alıcı hücreye aktarır.', 'Sinaps kurar', 'uc'); g.add(bout);
      /* uyartı: dendritten gövdeye, akson boyunca boğumdan boğuma sıçrayarak, uç dala */
      const tip0 = tips[2].p, tipEnd = tt[1].p;
      const pre = new THREE.CatmullRomCurve3([tip0, C.clone().addScaledVector(DIRS[2], 1.2), C.clone(), V3(AX0, 0, 0)]), post = new THREE.CatmullRomCurve3([V3(AX1, 0, 0), V3(AX1 + .6, -.25, .15), tipEnd]);
      const imp = glow(0xffffff, .16), halo = glow(0x9fe8ff, .32); halo.material.transparent = true; halo.material.opacity = .35; g.add(G(imp, 'imp'), G(halo, 'imp'));
      const nodeX = [AX0].concat(NODES).concat([AX1]);
      ticks.push(t => {
        const T = 4.2, u = (t % T) / T; let P;
        if (u < .35) P = pre.getPointAt(u / .35);
        else if (u < .8) { const v = (u - .35) / .45 * (nodeX.length - 1), k = Math.floor(v), f = v - k, e = f < .7 ? 0 : (f - .7) / .3; P = V3(nodeX[k] + (nodeX[Math.min(k + 1, nodeX.length - 1)] - nodeX[k]) * (e * e * (3 - 2 * e)), 0, 0); }
        else P = post.getPointAt((u - .8) / .2);
        imp.position.copy(P); halo.position.copy(P); halo.scale.setScalar(1 + .25 * Math.sin(t * 12));
        bout.material.emissive.setHex(u > .95 ? 0xffaa00 : 0x6a4400);
      });
      return { g, sels, ticks };
    }
  });

  /* ================= SİNAPS (ayrıntılı) ================= */
  const prevSin = M3.sinaps;
  M3.sinaps = Object.assign({}, prevSin, {
    title: 'Sinaps', ico: '🔗', tag: 'Kimyasal sinaps', cam: [5.4, 1.6, 7.4], target: [0, .7, 0], labScale: .85,
    layers: [['Sinaptik yumru ve kesecikler', 'pre'], ['Sinaps boşluğu ve nörotransmitterler', 'gap'], ['Komşu hücre (dendrit) ve reseptörler', 'post'], ['Enzimler ve geri alım', 'son']],
    task: 'Uyartının akson ucuna gelişini izle: sinaptik keseciklerin zara kaynaşıp nörotransmitter maddeyi sinaps boşluğuna bırakmasını, bu maddelerin komşu hücrenin zarındaki reseptörlere bağlanmasını gözle. Ardından nörotransmitterlerin enzimlerle parçalanmasını ve tekrar hücre içine alınmasını bul.',
    build() {
      const { g, sels, ticks, S, G } = B(), rnd = srand(9);
      const memM = mt(0x6aa8ff, { transparent: true, opacity: .4, depthWrite: false, roughness: .25, side: THREE.DoubleSide });
      g.add(S(new THREE.Mesh(taperGeo([[0, 4.6, 0], [0, 3.6, 0], [0, 2.6, 0]], .42, .8, 16, 24), memM.clone()), 'Akson ucu', 'Aksonun sonlandığı bölgedir. Uyartı buraya elektrokimyasal iletimle ulaşır.', 'Uyartının geldiği yer', 'pre'));
      const prof = [[.8, 2.6], [1.25, 2.35], [1.6, 1.9], [1.75, 1.35], [1.7, .9], [1.45, .62], [.9, .5], [.001, .48]].map(p => new THREE.Vector2(p[0], p[1]));
      const bulb = S(new THREE.Mesh(new THREE.LatheGeometry(new THREE.SplineCurve(prof).getPoints(40), 48), memM.clone()), 'Sinaptik yumru (sinaptik uç)', 'Aksonun sinaps boşluğunda sonlanan ucudur. İçinde nörotransmitter madde dolu sinaptik kesecikler bulunur. Sinaptik yumruya elektrokimyasal iletimle ulaşan uyartı sinaps boşluğunu bu şekilde geçemez; kimyasal habercilere ihtiyaç vardır.', 'Sinaps öncesi', 'pre');
      bulb.userData.low = true; g.add(bulb);
      g.add(G(at(new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, .04, 40), mt(0x2d5bd6, { transparent: true, opacity: .6 })), 0, .5, 0), 'pre'));
      g.add(S(instMesh(capsuleGeo(.09, .32, 12), mt(0xff7a3a, { roughness: .4, emissive: 0x3a1000 }), 4, (i, d) => { d.position.set([-.9, .8, .2, -.3][i], [1.9, 1.7, 2.3, 1.45][i], [.3, -.4, .55, -.85][i]); d.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); }), 'Mitokondri', 'Sinaptik yumrudaki mitokondriler nörotransmitter salınımı için gerekli enerjiyi (ATP) sağlar.', 'Enerji', 'pre'));
      /* kesecikler */
      const VP = []; while (VP.length < 15) { const v = V3((rnd() - .5) * 2.6, 1.0 + rnd() * 1.25, (rnd() - .5) * 2.4); const rr = Math.hypot(v.x, v.z); if (rr < 1.35 - (v.y - 1.0) * .25 && VP.every(q => q.distanceTo(v) > .5)) VP.push(v); }
      const vesM = mt(0xd6ecff, { transparent: true, opacity: .5, depthWrite: false, roughness: .15 });
      VP.forEach(v => { const m = S(new THREE.Mesh(new THREE.SphereGeometry(.23, 20, 16), vesM), 'Sinaptik kesecik', 'İçinde kimyasal madde (nörotransmitter) bulunan keseciklerdir. Uyartı gelince zara kaynaşıp içeriğini sinaps boşluğuna boşaltır.', 'Nörotransmitter deposu', 'pre'); m.position.copy(v); g.add(m); });
      const ntIn = S(instMesh(new THREE.SphereGeometry(.045, 8, 6), mt(0xffc93c, { emissive: 0x6a4400 }), VP.length * 8, (i, d) => { const v = VP[i >> 3], a = (i & 7) / 8 * 6.283; d.position.set(v.x + Math.cos(a) * .12, v.y + Math.sin(a * 1.7) * .1, v.z + Math.sin(a) * .12); }), 'Nörotransmitter madde', 'Sinaptik keseciklerde depolanan kimyasal habercilerdir. Sinaps boşluğuna dökülerek komşu hücrenin zarındaki reseptörlere bağlanır ve uyartıyı aktarır.', 'Kimyasal haberci', 'pre'); g.add(ntIn);
      /* kaynaşan kesecikler */
      const DOCK = [V3(-.75, .72, .2), V3(.15, .72, -.3), V3(.85, .72, .35)];
      const dock = DOCK.map(p => { const m = S(new THREE.Mesh(new THREE.SphereGeometry(.23, 20, 16), vesM.clone()), 'Sinaptik kesecik', 'Zara kaynaşan kesecik içeriğini sinaps boşluğuna boşaltır (ekzositoz).', 'Nörotransmitter salınımı', 'pre'); m.position.copy(p); g.add(m); return m; });
      /* sinaps boşluğu */
      const cleft = S(new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, .85, 40, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff2b8, transparent: true, opacity: .07, depthWrite: false, side: THREE.DoubleSide })), 'Sinaps boşluğu', 'Nöronlar birbirine çok yaklaşır ancak fiziksel olarak temas etmez; aradaki bu boşluğa sinaps boşluğu denir. Uyartı bu boşluğu nörotransmitter maddelerle geçer.', 'İki hücre arası', 'gap'); cleft.userData.low = true; at(cleft, 0, .05, 0); g.add(cleft);
      /* komşu hücre zarı */
      const lt = lipidTex('#f2a0e0', '#9a5ad6'); lt.wrapS = THREE.RepeatWrapping; lt.repeat.set(6, 1);
      const postGeo = new THREE.CylinderGeometry(2.6, 2.6, .3, 64, 1, false); { const p = postGeo.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); p.setY(i, p.getY(i) - .08 * (x * x + z * z) / 2.6); } postGeo.computeVertexNormals(); }
      const post = S(new THREE.Mesh(postGeo, mt(0xffffff, { map: lt, roughness: .5 })), 'Komşu hücrenin zarı', 'Alıcı hücrenin (nöronun dendriti, kas veya hormon salgılayan hücre) zarıdır; üzerinde nörotransmitterleri tanıyan reseptörler bulunur.', 'Sinaps sonrası', 'post'); at(post, 0, -.55, 0); g.add(post);
      const dend = S(new THREE.Mesh(new THREE.SphereGeometry(2.6, 48, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mt(0xb27be8, { transparent: true, opacity: .38, depthWrite: false, side: THREE.DoubleSide })), 'Dendrit (alıcı nöron)', 'Uyartıyı alacak olan komşu nöronun dendritidir. Nöronlar arası iletim genellikle bir nöronun akson ucundan diğer nöronun dendritine doğru tek yönlüdür.', 'Alıcı hücre', 'post'); dend.scale.set(1, .55, 1); dend.userData.low = true; at(dend, 0, -.7, 0); g.add(dend);
      /* reseptörler */
      const RP = [[-1.3, -.2], [-.55, .5], [.3, -.55], [1.15, .2], [-.2, 1.25], [.6, 1.1], [-1.0, -1.05]];
      const recM = mt(0x5b3fe0, { roughness: .35, emissive: 0x0d0533 });
      const recs = RP.map(([x, z]) => { const grp = new THREE.Group(); grp.position.set(x, -.38, z); [-1, 1].forEach(s => { const half = S(new THREE.Mesh(new THREE.CylinderGeometry(.11, .14, .42, 14), recM.clone()), 'Reseptör', 'Komşu hücrenin zarındaki, nörotransmitterlerin bağlandığı proteinlerdir. Bağlanma ile komşu hücreye uyartı aktarılır.', 'Alıcı protein', 'post'); half.position.set(s * .11, 0, 0); grp.add(half); }); g.add(grp); return { grp, x, z, a: 0, mats: grp.children.map(c => c.material) }; });
      /* enzimler */
      const enzG = new THREE.SphereGeometry(.13, 20, 14, .5, 5.3);
      const enz = [[-1.1, .1, .8], [1.2, .15, -.7], [.1, -.05, 1.3], [-.5, .2, -1.2]].map(p => { const m = S(new THREE.Mesh(enzG, mt(0xb44fe0, { roughness: .4, side: THREE.DoubleSide })), 'Enzim', 'Sinaps boşluğundaki enzimler, görevini tamamlayan nörotransmitter maddeleri parçalayarak etkisiz hâle getirir. Böylece komşu hücrenin sürekli uyarılması engellenir.', 'Nörotransmitteri parçalar', 'son'); at(m, ...p); g.add(m); return m; });
      /* geri alım taşıyıcıları */
      const TR = [V3(-1.45, .62, -.4), V3(1.4, .62, .55)];
      TR.forEach(p => { const m = S(new THREE.Mesh(new THREE.CylinderGeometry(.13, .13, .32, 12), mt(0x22c1b0, { roughness: .35, emissive: 0x033a33 })), 'Geri alım (taşıyıcı) proteini', 'Görevini tamamlayan nörotransmitterlerin bir kısmı akson ucundaki bu proteinlerden geçerek tekrar hücre içine alınır ve yeniden kullanılır.', 'Tekrar hücre içine alma', 'son'); m.position.copy(p); g.add(m); });
      /* nörotransmitter akışı */
      const pool = []; for (let i = 0; i < 70; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(.055, 8, 6), new THREE.MeshStandardMaterial({ color: 0xffc93c, emissive: 0x6a4400 })); m.visible = false; g.add(G(m, 'gap')); pool.push({ m, on: false }); }
      const frag = []; for (let i = 0; i < 30; i++) { const m = new THREE.Mesh(new THREE.TetrahedronGeometry(.04), new THREE.MeshBasicMaterial({ color: 0xc58bff, transparent: true })); m.visible = false; g.add(G(m, 'gap')); frag.push({ m, on: false }); }
      const spark = glow(0xffffff, .2); g.add(G(spark, 'pre'));
      let lastFire = -9;
      ticks.push((t, dt) => {
        const T = 3.2, ph = t % T;
        spark.visible = ph < 1; spark.position.set(0, 4.6 - Math.min(1, ph) * 3.6, 0);
        dock.forEach((m, i) => { const open = ph > 1 && ph < 1.6; m.scale.set(1, open ? Math.max(.25, 1 - (ph - 1) * 1.6) : 1, 1); m.material.opacity = open ? .25 : .55; });
        if (ph > 1 && t - lastFire > T * .9) { lastFire = t; DOCK.forEach(d => { for (let k = 0; k < 8; k++) { const f = pool.find(p => !p.on); if (!f) break; const r = recs[Math.floor(rnd() * recs.length)]; Object.assign(f, { on: true, st: 0, p: d.clone().add(V3((rnd() - .5) * .3, -.15, (rnd() - .5) * .3)), r, fate: rnd() < .5 ? 'enz' : 'geri', u: 0 }); f.m.visible = true; f.m.position.copy(f.p); } }); }
        pool.forEach(f => {
          if (!f.on) return; f.u += dt;
          if (f.st === 0) { const tgt = V3(f.r.x, -.12, f.r.z); f.m.position.lerp(tgt, Math.min(1, dt * 2.2)); f.m.position.y += Math.sin(t * 9 + f.u * 7) * .004; if (f.m.position.distanceTo(tgt) < .06) { f.st = 1; f.u = 0; f.r.a = 1; } }
          else if (f.st === 1) { if (f.u > .5) { f.st = 2; f.u = 0; } }
          else if (f.fate === 'enz') { const e = enz[f.r.x < 0 ? 0 : 1].position; f.m.position.lerp(V3(f.m.position.x * .6 + e.x * .4, .15, f.m.position.z * .6 + e.z * .4), dt * 2); if (f.u > .8) { f.on = false; f.m.visible = false; for (let k = 0; k < 2; k++) { const q = frag.find(p => !p.on); if (q) { Object.assign(q, { on: true, u: 0, v: V3((rnd() - .5) * .6, rnd() * .3, (rnd() - .5) * .6) }); q.m.position.copy(f.m.position); q.m.visible = true; } } } }
          else { const tr = TR[f.m.position.x < 0 ? 0 : 1]; f.m.position.lerp(tr.clone().add(V3(0, f.u > .9 ? .6 : 0, 0)), dt * 1.8); if (f.u > 1.6) { f.on = false; f.m.visible = false; } }
        });
        frag.forEach(q => { if (!q.on) return; q.u += dt; q.m.position.addScaledVector(q.v, dt); q.m.rotation.x += dt * 4; q.m.material.opacity = Math.max(0, 1 - q.u); if (q.u > 1) { q.on = false; q.m.visible = false; } });
        recs.forEach(r => { r.a = Math.max(0, r.a - dt * .8); r.mats.forEach(m => m.emissive.setRGB(.05 + r.a * .9, .02 + r.a * .7, .2 + r.a * .1)); });
        enz.forEach((e, i) => e.rotation.y += dt * (1 + i * .3));
      });
      return { g, sels, ticks };
    }
  });

  /* ================= HÜCRE GÖVDESİ (yakın plan) ================= */
  M3.hucregovdesi = {
    title: 'Hücre Gövdesi (yakın plan)', ico: '🔬', tag: 'Çekirdek · Mitokondri · Nörofibril', cam: [0, 2.2, 8.4], target: [0, 0, 0], labScale: 1,
    layers: [['Hücre zarı ve sitoplazma', 'zar'], ['Çekirdek', 'cek'], ['Mitokondriler', 'mit'], ['Nörofibriller ve taşınan maddeler', 'fib'], ['Organeller', 'org'], ['Dendrit ve akson başlangıçları', 'uz']],
    task: 'Hücre gövdesinin içine bak: çekirdeği, çok sayıdaki mitokondriyi ve dendrit ile aksona doğru uzanan nörofibrilleri bul. Nörofibriller boyunca taşınan küçük keseciklerin hareketini izle; nöronlarda neden bu kadar çok mitokondri olduğunu düşün.',
    q: { q: 'Nöronlarda çok sayıda mitokondri bulunmasının nedeni nedir?', o: ['Enerji ihtiyacının fazla olması', 'Bölünme hızının yüksek olması', 'Işığı algılaması', 'Miyelin üretmesi'], a: 0, e: 'Nöronlarda enerji ihtiyacı fazladır; bu nedenle hücre gövdesinde çok sayıda mitokondri bulunur.' },
    build() {
      const { g, sels, ticks, S, G } = B(), rnd = srand(31);
      const R = 2.3, DIRS = [V3(-1, .5, .2), V3(-.6, -.8, .3), V3(-.1, 1, -.3), V3(-.3, -.85, -.6), V3(-.8, 0, -.8), V3(-.5, .3, 1), V3(1, 0, 0)].map(v => v.normalize());
      const sg = new THREE.IcosahedronGeometry(1, 5), sp = sg.attributes.position;
      for (let i = 0; i < sp.count; i++) { const v = V3(sp.getX(i), sp.getY(i), sp.getZ(i)).normalize(); let r = R; DIRS.forEach((d, k) => { r += (k === 6 ? .9 : .7) * Math.pow(Math.max(0, v.dot(d)), 12); }); r += .05 * Math.sin(v.x * 17) * Math.sin(v.y * 13) * Math.sin(v.z * 11); v.multiplyScalar(r); sp.setXYZ(i, v.x, v.y, v.z); }
      sg.computeVertexNormals();
      const zar = S(new THREE.Mesh(sg, mt(0x7ea6ff, { transparent: true, opacity: .25, depthWrite: false, roughness: .2, side: THREE.DoubleSide })), 'Hücre gövdesi (zar ve sitoplazma)', 'Hücre gövdesi nöronun çekirdek, organeller ve sitoplazmayı bulunduran kısmıdır. Sitoplazma, organellerin içinde bulunduğu sıvı ortamdır.', 'Yaşamsal faaliyet merkezi', 'zar'); zar.userData.low = true; g.add(zar);
      DIRS.forEach((d, k) => { const s = d.clone().multiplyScalar(R + (k === 6 ? .6 : .45)), e = d.clone().multiplyScalar(k === 6 ? 5.2 : 4.2); g.add(S(new THREE.Mesh(taperGeo([s, s.clone().lerp(e, .5).add(randPerp(d, rnd).multiplyScalar(.2)), e], k === 6 ? .38 : .5, k === 6 ? .2 : .12, 16, 14), mt(k === 6 ? 0x5b55e0 : 0x4a78ff, { transparent: true, opacity: .55, roughness: .35 })), k === 6 ? 'Akson başlangıcı' : 'Dendrit (başlangıcı)', k === 6 ? 'Akson, hücre gövdesinden çıkan dendrite göre daha kalın ve uzun uzantıdır; uyartıyı hücre gövdesinden uzağa iletir.' : 'Dendritler hücre gövdesinden çıkan kısa ve dallanmış uzantılardır; uyarıları alıp hücre gövdesine iletir.', k === 6 ? 'Uyartıyı iletir' : 'Uyarıyı alır', 'uz')); });
      const ctex = canvasTex(256, 128, (c, w, h) => { c.fillStyle = '#7d45d8'; c.fillRect(0, 0, w, h); for (let i = 0; i < 500; i++) { c.fillStyle = rnd() < .5 ? 'rgba(60,20,120,.5)' : 'rgba(190,150,255,.4)'; c.beginPath(); c.arc(rnd() * w, rnd() * h, 1 + rnd() * 3, 0, 7); c.fill(); } });
      const nuc = S(new THREE.Mesh(new THREE.SphereGeometry(.95, 48, 36), mt(0xffffff, { map: ctex, roughness: .5, emissive: 0x140530 })), 'Çekirdek', 'Hücrenin faaliyetlerini yönetir ve kalıtsal bilgiyi taşır. Çevresindeki çift katlı zarda bulunan porlardan madde alışverişi yapılır.', 'Yönetim merkezi', 'cek'); g.add(nuc);
      g.add(S(at(new THREE.Mesh(new THREE.SphereGeometry(.3, 24, 18), mt(0x2a0c55, { roughness: .4 })), .3, .35, .62), 'Çekirdekçik', 'Çekirdeğin içindeki yoğun bölgedir; ribozom yapımında görev alır.', 'Çekirdek içi', 'cek'));
      const pores = []; for (let i = 0; i < 70; i++) { const y = 1 - 2 * (i + .5) / 70, rr = Math.sqrt(1 - y * y), th = i * 2.39996; pores.push(V3(Math.cos(th) * rr, y, Math.sin(th) * rr)); }
      g.add(G(instMesh(new THREE.TorusGeometry(.05, .018, 6, 12), mt(0x3a1a7a), pores.length, (i, d) => { d.position.copy(pores[i]).multiplyScalar(.955); d.quaternion.setFromUnitVectors(V3(0, 0, 1), pores[i]); }), 'cek'));
      const mtex = canvasTex(128, 64, (c, w, h) => { c.fillStyle = '#ff7a3a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffd0a8'; c.lineWidth = 3; c.beginPath(); for (let x = 0; x <= w; x += 8) c.lineTo(x, x % 16 ? 10 : h - 10); c.stroke(); });
      const MP = []; while (MP.length < 46) { const v = V3(rnd() - .5, rnd() - .5, rnd() - .5).multiplyScalar(2 * R * .9); if (v.length() < R * .85 && v.length() > 1.25) MP.push(v); }
      g.add(S(instMesh(capsuleGeo(.13, .42, 14), mt(0xffffff, { map: mtex, roughness: .4, emissive: 0x2a0800 }), MP.length, (i, d) => { d.position.copy(MP[i]); d.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); }), 'Mitokondri', 'Hücrenin enerji (ATP) üreten organelleridir. Nöronlarda enerji ihtiyacı fazla olduğundan çok sayıda mitokondri bulunur. Uyartı iletimi ATP harcanmasını gerektirdiği için kimyasal bir süreçtir.', 'Enerji üretimi', 'mit'));
      const erM = mt(0x4fa8ff, { roughness: .45, transparent: true, opacity: .8 });
      for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; for (let j = 0; j < 3; j++) { const m = S(new THREE.Mesh(new THREE.TorusGeometry(1.25 + j * .13, .035, 6, 30, 1.1), erM), 'Organeller (endoplazmik retikulum)', 'Hücre gövdesinde çekirdeği saran kanal ve kese sistemi gibi organeller bulunur; protein yapımı ve madde taşınmasında görev alırlar.', 'Organeller', 'org'); m.rotation.set(rnd() * 3, a, rnd() * .6); g.add(m); } }
      const fibM = mt(0xffcf5a, { emissive: 0x5a3c00, roughness: .4 }), fibs = [];
      for (let k = 0; k < 26; k++) { const d = DIRS[k % 7], a = randPerp(d, rnd), b = randPerp(d, rnd); const pts = [a.clone().multiplyScalar(1.1).add(b.clone().multiplyScalar(.3)), d.clone().multiplyScalar(1.4).addScaledVector(a, .55), d.clone().multiplyScalar(2.1).addScaledVector(a, .25), d.clone().multiplyScalar(k % 7 === 6 ? 4.6 : 3.6).addScaledVector(a, .08)]; const c = new THREE.CatmullRomCurve3(pts); fibs.push(c); g.add(S(new THREE.Mesh(new THREE.TubeGeometry(c, 30, .018, 5), fibM), 'Nörofibriller', 'Sitoplazmadaki ince telciklerdir. Hücre gövdesinden dendrit ve aksona doğru boylu boyunca uzanarak nörona şekil verir ve hücre içinde madde taşınması görevini üstlenir.', 'Şekil · madde taşıma', 'fib')); }
      const cargo = []; for (let i = 0; i < 30; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(.07, 10, 8), mt(0x6ef7c5, { emissive: 0x0a5a40 })); g.add(S(m, 'Taşınan maddeler (kesecikler)', 'Nörofibriller boyunca hücre gövdesi ile akson/dendrit arasında taşınan maddelerdir.', 'Madde taşınması', 'fib')); cargo.push({ m, c: fibs[i % fibs.length], u: rnd(), s: (rnd() < .5 ? 1 : -1) * (.08 + rnd() * .06) }); }
      ticks.push((t, dt) => cargo.forEach(o => { o.u = (o.u + o.s * dt + 1) % 1; o.m.position.copy(o.c.getPointAt(o.u)); }));
      return { g, sels, ticks };
    }
  };

  /* ================= ZAR POTANSİYELİ ================= */
  M3.zarpot = {
    title: 'Zar Potansiyeli ve Uyartının İletimi', ico: '🔋', tag: 'Polarizasyon · Depolarizasyon · Repolarizasyon', cam: [0.5, 2.6, 10], target: [0, 0, 0], labScale: .9,
    layers: [['Akson zarı', 'zar'], ['Yükler (+ / −)', 'yuk'], ['Pozitif iyonlar', 'iyon'], ['Renk anahtarı', 'anah']],
    task: 'Akson zarının iç ve dış yüzündeki + ve − işaretlerini izle. Mavi bölgede (polarizasyon) dış +, iç −; kırmızı bölgede (depolarizasyon) dış −, iç +; mor bölgede (repolarizasyon) yükler eski hâline dönüyor. Pozitif iyonların hücre içine girip tekrar dışarı çıkışını ve uyartının dendritten aksona doğru bir dalga gibi ilerleyişini gözle.',
    q: { q: 'Depolarize olmuş bir bölgede repolarizasyon tamamlanmadan ne olur?', o: ['O bölgeden ikinci bir uyartı geçemez', 'Uyartı iki kat hızlanır', 'Miyelin kılıf oluşur', 'Hücre içi pozitif kalır ve uyartı geriye döner'], a: 0, e: 'Repolarizasyon olmadan o bölgeden ikinci bir uyartı geçemez.' },
    build() {
      const { g, sels, ticks, S, G } = B(), rnd = srand(5);
      const X0 = -5, X1 = 5, N = 20, L = (X1 - X0) / N, R = 1.05;
      const lt = lipidTex('#ffe08a', '#e8b84a'); lt.wrapS = THREE.RepeatWrapping; lt.repeat.set(2, 1);
      const segs = []; for (let i = 0; i < N; i++) { const geo = new THREE.CylinderGeometry(R, R, L * .98, 40, 1, true, Math.PI * .1, Math.PI * 1.35).rotateZ(Math.PI / 2); const m = S(new THREE.Mesh(geo, mt(0x6fa0ff, { map: lt, roughness: .45, side: THREE.DoubleSide, emissive: 0x000000 })), 'Akson zarı', 'Nöronun akson zarıdır. Dinlenme hâlinde iç yüzü negatif (−), dış yüzü pozitif (+) yüklüdür. Uyartı, bu yük dağılımının bozulması ve ardından eski hâline dönmesiyle dalga gibi ilerler. Renkler: mavi = polarizasyon, kırmızı = depolarizasyon, mor = repolarizasyon.', 'Zar potansiyeli', 'zar'); at(m, X0 + (i + .5) * L, 0, 0); g.add(m); segs.push(m); }
      g.add(S(at(new THREE.Mesh(new THREE.CylinderGeometry(R * .93, R * .93, X1 - X0, 40, 1, true).rotateZ(Math.PI / 2), mt(0x9fd7ff, { transparent: true, opacity: .14, depthWrite: false, side: THREE.DoubleSide })), 0, 0, 0), 'Hücre içi (sitoplazma)', 'Aksonun iç kısmıdır. Dinlenme hâlinde hücre içi negatif yüklüdür; depolarizasyonda pozitif iyonlar içeri girince pozitif olur.', 'İç ortam', 'zar'));
      const SOMA = S(at(new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 24), mt(0x6c8dff, { transparent: true, opacity: .55, roughness: .3 })), X0 - 1.3, 0, 0), 'Hücre gövdesi', 'Uyartı dendritlerden hücre gövdesine, oradan aksona doğru ilerler.', 'Başlangıç', 'zar'); g.add(SOMA);
      const rr = srand(2); for (let k = 0; k < 6; k++) { const d = V3(-1, (rr() - .5) * 2, (rr() - .5) * 2).normalize(); g.add(G(curveTube([V3(X0 - 1.3, 0, 0).addScaledVector(d, 1.3), V3(X0 - 1.3, 0, 0).addScaledVector(d, 2.2).add(V3(0, (rr() - .5) * .5, 0)), V3(X0 - 1.3, 0, 0).addScaledVector(d, 2.9)], .07, mt(0x4a78ff), 10), 'zar')); }
      const plus = signTex('+', '#e8473f'), minus = signTex('-', '#2f6fe0');
      const pM = new THREE.SpriteMaterial({ map: plus, depthTest: true }), mM = new THREE.SpriteMaterial({ map: minus, depthTest: true });
      const out = [], inn = [];
      for (let i = 0; i < N; i++) { const x = X0 + (i + .5) * L; [[1, 1.42], [-1, 1.42]].forEach(([s, r]) => { const sp = new THREE.Sprite(pM); sp.scale.setScalar(.32); sp.position.set(x, s * r, .25); g.add(G(sp, 'yuk')); out.push({ sp, i }); }); [[1, .62], [-1, .62]].forEach(([s, r]) => { const sp = new THREE.Sprite(mM); sp.scale.setScalar(.28); sp.position.set(x, s * r, .25); g.add(G(sp, 'yuk')); inn.push({ sp, i }); }); }
      const ionM = mt(0xff9a2e, { emissive: 0x5a2400, roughness: .3 }), ions = [];
      for (let i = 0; i < 90; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(.075, 10, 8), ionM); g.add(S(m, 'Pozitif iyonlar', 'Depolarizasyonda pozitif iyonlar hücre içine girer (iç +, dış −). Repolarizasyonda tekrar hücre dışına çıkar (dış +, iç −). Uyartı iletimi iyon geçişlerine dayandığı için elektriksel, ATP harcanmasını gerektirdiği için kimyasaldır: elektrokimyasal bir süreçtir.', 'İyon geçişleri', 'iyon')); const x = X0 + rnd() * (X1 - X0), a = rnd() * 6.283; ions.push({ m, x, a, r: 1.5 }); }
      g.add(S(instMesh(new THREE.CylinderGeometry(.09, .09, .32, 10), mt(0x8c5be8, { roughness: .4 }), 60, (i, d) => { const x = X0 + (i + .5) * (X1 - X0) / 60, a = Math.PI * .15 + (i * 2.39) % (Math.PI * 1.3); d.position.set(x, Math.cos(a) * R, -Math.sin(a) * R); d.quaternion.setFromUnitVectors(V3(0, 1, 0), V3(0, Math.cos(a), -Math.sin(a))); }), 'İyon geçiş kanalları', 'Zardaki proteinlerden oluşan geçitlerdir; iyonlar bu geçitlerden hücre içine girer ve dışına çıkar. (Kanal ve pompaların çeşitleri bu konunun kapsamında değildir.)', 'İyon geçişleri', 'zar'));
      const arrow = new THREE.Group(); arrow.add(cylBetween([-3.5, 2.35, 0], [3, 2.35, 0], .07, mt(0x22d3ee, { emissive: 0x0a4a55 })), at(new THREE.Mesh(new THREE.ConeGeometry(.2, .45, 16).rotateZ(-Math.PI / 2), mt(0x22d3ee, { emissive: 0x0a4a55 })), 3.2, 2.35, 0)); g.add(G(arrow, 'anah'));
      label(g, 'Uyartının ilerleme yönü →', 0, 2.95, 0, .6);
      [['Polarizasyon (dinlenme)', 0x3b7bff, 'Dinlenme hâlindeki nöronda hücre içi negatif (−), hücre dışı pozitif (+) yüklüdür. Bu elektriksel yük farkına dinlenme potansiyeli (zar potansiyeli), bu duruma polarizasyon (kutuplaşma) denir.'], ['Depolarizasyon', 0xff3b3b, 'Nöron uyarıldığında pozitif iyonlar hücre içine girer; hücre içi pozitif, hücre dışı negatif olur. Bu olaya depolarizasyon denir. Zar potansiyelindeki bu kısa süreli değişikliklere aksiyon potansiyeli denir.'], ['Repolarizasyon', 0xa855f7, 'Depolarize durumdaki bölgede pozitif iyonlar tekrar hücre dışına çıkar; hücre dışı pozitif, hücre içi negatif olur ve zar dinlenme hâline döner. Repolarizasyon olmadan o bölgeden ikinci bir uyartı geçemez.']].forEach(([n, c, inf], k) => { const b = S(new THREE.Mesh(new THREE.BoxGeometry(.5, .5, .5), mt(c, { emissive: new THREE.Color(c).multiplyScalar(.25).getHex() })), n, inf, 'Zar potansiyeli', 'anah'); at(b, -3.2 + k * 3.2, -2.6, 0); g.add(b); label(g, n, -3.2 + k * 3.2, -3.3, 0, .55); });
      const cBlue = new THREE.Color(0x6fa0ff), cRed = new THREE.Color(0xff5050), cPur = new THREE.Color(0xc08cff);
      ticks.push((t, dt) => {
        const W = X0 - 1 + ((t * 1.6) % (X1 - X0 + 4));
        const st = x => { const d = W - x; return d < 0 ? 0 : d < .9 ? 1 : d < 2.2 ? 2 : 0; };
        segs.forEach((m, i) => { const s = st(X0 + (i + .5) * L); m.material.color.copy(s === 1 ? cRed : s === 2 ? cPur : cBlue); });
        out.forEach(o => { o.sp.material = st(X0 + (o.i + .5) * L) === 1 ? mM : pM; });
        inn.forEach(o => { o.sp.material = st(X0 + (o.i + .5) * L) === 1 ? pM : mM; });
        ions.forEach(o => { const s = st(o.x), tr = s === 1 ? .45 : 1.6; o.r += (tr - o.r) * Math.min(1, dt * 5); o.a += dt * .3; o.m.position.set(o.x, Math.cos(o.a) * o.r, -Math.sin(o.a) * o.r * .9 + (o.r > 1.2 ? .0 : 0)); });
      });
      return { g, sels, ticks };
    }
  };

  /* ================= MİYELİNLİ / MİYELİNSİZ SİNİRLER ================= */
  M3.miyelin = {
    title: 'Miyelinli ve Miyelinsiz Sinirler', ico: '🏁', tag: 'Akson çapı · Miyelin · Hız', cam: [0, 1.4, 13.8], target: [-.2, 0, 0], labScale: .85,
    layers: [['Kalın miyelinli akson', 'l1'], ['Kalın miyelinsiz akson', 'l2'], ['İnce miyelinsiz akson', 'l3'], ['Kaslar (efektörler)', 'kas'], ['Uyartılar', 'imp']],
    task: 'Üç aksondaki uyartı yarışını izle: Miyelinli aksonda uyartı Ranvier boğumlarından “sıçrayarak” en önce ulaşıyor. Akson çapı kalın olan miyelinsiz akson, ince olandan hızlı. Miyelinli sinirin iskelet kasına, miyelinsizlerin iç organ (düz kas) duvarına gittiğine dikkat et. Soldaki kesitte miyelinin kat kat sarılmış yapısını incele.',
    q: { q: 'Aşağıdaki aksonlardan hangisinde uyartı iletimi en hızlıdır?', o: ['Kalın ve miyelinli', 'Kalın ve miyelinsiz', 'İnce ve miyelinsiz', 'Hepsi aynı hızdadır'], a: 0, e: 'Akson çapı kalınlaştıkça ve miyelin kılıf bulunduğunda uyartı iletimi hızlanır.' },
    build() {
      const { g, sels, ticks, S, G } = B(), X0 = -4.6, X1 = 3.8;
      const lanes = [{ y: 2.1, r: .15, my: true, grp: 'l1', n: 'Kalın miyelinli akson', inf: 'Çapı kalın ve miyelin kılıflı aksondur. Uyartı Ranvier boğumlarından sıçrayarak ilerlediği için iletim en hızlıdır. Beyin ve omurilikten iskelet kaslarına giden sinirler genellikle miyelinlidir.', T: 1.3 }, { y: 0, r: .15, my: false, grp: 'l2', n: 'Kalın miyelinsiz akson', inf: 'Miyelin kılıfı olmayan, çapı kalın aksondur. Uyartı zar boyunca kesintisiz ilerler; miyelinliden yavaş ama ince aksondan hızlıdır. Akson çapı kalınsa iletim hızlıdır.', T: 2.8 }, { y: -2.1, r: .06, my: false, grp: 'l3', n: 'İnce miyelinsiz akson', inf: 'Çapı ince ve miyelinsiz aksondur; uyartı iletimi en yavaştır. İç organlara ve düz kaslara giden sinirlerde genellikle miyelin kılıf bulunmaz.', T: 4.6 }];
      const myProf = []; for (let i = 0; i <= 12; i++) { const a = i / 12 * Math.PI; myProf.push(new THREE.Vector2(.16 + .2 * Math.pow(Math.sin(a), .35), -.45 + i / 12 * .9)); }
      const myGeo = new THREE.LatheGeometry(myProf, 28).rotateZ(-Math.PI / 2);
      lanes.forEach((ln, li) => {
        g.add(S(at(new THREE.Mesh(new THREE.SphereGeometry(.55, 24, 18), mt(0x6c8dff, { roughness: .35 })), X0 - .55, ln.y, 0), 'Hücre gövdesi', 'Uyartı hücre gövdesinden akson boyunca akson ucuna iletilir.', 'Başlangıç', ln.grp));
        g.add(S(cylBetween([X0, ln.y, 0], [X1, ln.y, 0], ln.r, mt(0x5b55e0, { roughness: .4 }), 14), ln.n, ln.inf, li === 0 ? 'En hızlı' : li === 1 ? 'Orta hız' : 'En yavaş', ln.grp));
        ln.nodes = [X0];
        if (ln.my) { for (let x = X0 + .15; x + .9 < X1; x += 1.1) { const m = S(new THREE.Mesh(myGeo, mt(0xf5c542, { roughness: .32, emissive: 0x2a1c00 })), 'Miyelin kılıf', 'Schwann hücrelerinin akson etrafında oluşturduğu lipoprotein yapılı örtüdür; elektriksel yalıtım sağlayarak uyartı iletimini hızlandırır.', 'Yalıtım', ln.grp); at(m, x + .45, ln.y, 0); g.add(m); g.add(S(at(ellip(.18, .07, .11, mt(0x7de3d1)), x + .4, ln.y + .34, .05), 'Schwann hücresi', 'Akson etrafına sarılarak miyelin kılıfı oluşturan hücredir.', 'Miyelin yapar', ln.grp)); const nd = S(new THREE.Mesh(new THREE.TorusGeometry(.17, .04, 8, 22).rotateY(Math.PI / 2), mt(0x2fd4c0, { emissive: 0x053b33 })), 'Ranvier boğumu', 'Miyelin kılıfın kesintiye uğradığı yerlerdir; uyartı boğumdan boğuma sıçrar.', 'Yalıtımsız aralık', ln.grp); at(nd, x + 1.0, ln.y, 0); g.add(nd); ln.nodes.push(x + 1.0); } }
        ln.nodes.push(X1);
        label(g, ln.n, -1.6, ln.y + .7, 0, .45);
        const p = glow(0xffffff, .14); const hl = glow(li === 0 ? 0xffe066 : li === 1 ? 0x9fe8ff : 0xff9fd0, .28); hl.material.transparent = true; hl.material.opacity = .4; g.add(G(p, 'imp'), G(hl, 'imp')); ln.p = p; ln.hl = hl;
      });
      /* miyelin kesiti (lameller) */
      const cx = X0 - 1.55, cy = 2.1; for (let k = 0; k < 6; k++) g.add(S(at(new THREE.Mesh(new THREE.TorusGeometry(.22 + k * .055, .022, 8, 40).rotateY(Math.PI / 2), mt(k % 2 ? 0xffe08a : 0xe8b84a, { roughness: .35 })), cx, cy, 0), 'Miyelin kılıf (kesit)', 'Schwann hücresi aksonun çevresine defalarca sarılarak kat kat (lipoprotein) bir örtü oluşturur. Bu katlar elektriksel yalıtım sağlar.', 'Kat kat yapı', 'l1'));
      g.add(G(at(new THREE.Mesh(new THREE.CircleGeometry(.17, 24).rotateY(Math.PI / 2), mt(0x5b55e0)), cx, cy, 0), 'l1'));
      /* kaslar */
      const st = stripeTex('#c33', '#e86a6a', 24); st.wrapS = st.wrapT = THREE.RepeatWrapping; st.repeat.set(1, 1);
      const skel = S(at(new THREE.Mesh(capsuleGeo(.55, 1.4, 24).rotateZ(Math.PI / 2), mt(0xffffff, { map: st, roughness: .5, emissive: 0x000000 })), X1 + 1.25, 2.1, 0), 'İskelet kası', 'Beyin ve omurilikten iskelet kaslarına giden sinirler genellikle miyelinlidir; bu sayede hızlı ve istemli hareketler yapılır. Kas, tepki organıdır (efektör).', 'Efektör', 'kas'); g.add(skel);
      const gut = S(at(new THREE.Mesh(new THREE.TorusGeometry(.75, .32, 18, 40, Math.PI * 1.5), mt(0xf08a9a, { roughness: .45, emissive: 0x000000 })), X1 + 1.2, -1.05, 0), 'Düz kas (iç organ duvarı)', 'İç organlara ve düz kaslara giden sinirlerde genellikle miyelin kılıf bulunmaz; bu organların tepkileri daha yavaştır.', 'Efektör', 'kas'); gut.rotation.z = Math.PI * .75; g.add(gut);
      ticks.push(t => lanes.forEach((ln, li) => {
        const u = (t % ln.T) / ln.T; let x;
        if (ln.my) { const v = u * (ln.nodes.length - 1), k = Math.floor(v), f = v - k, e = f < .55 ? 0 : (f - .55) / .45; x = ln.nodes[k] + (ln.nodes[Math.min(k + 1, ln.nodes.length - 1)] - ln.nodes[k]) * e * e * (3 - 2 * e); } else x = X0 + (X1 - X0) * u;
        ln.p.position.set(x, ln.y, 0); ln.hl.position.set(x, ln.y, 0);
        const flash = u > .93 ? 1 : 0; if (li === 0) { skel.scale.x = 1 - .12 * flash; skel.material.emissive.setRGB(.35 * flash, 0, 0); } else gut.material.emissive.setRGB(.25 * flash, .05 * flash, .05 * flash);
      }));
      return { g, sels, ticks };
    }
  };

  /* ================= SİNİR DEMETİ (merdiven etkisi) ================= */
  M3.sinirdemeti = {
    title: 'Sinir Demeti ve Merdiven Etkisi', ico: '🪜', tag: 'Eşik değer · Ya hep ya hiç · Merdiven etkisi', cam: [2.2, 1.6, 11.5], target: [-.3, .1, 0], labScale: .9,
    layers: [['Sinir demeti ve kılıflar', 'kilif'], ['Aksonlar (sinir telleri)', 'akson'], ['Tek sinir teli', 'tek'], ['Grafikler', 'graf']],
    task: 'Uyaran şiddeti adım adım artıyor. Demetteki her aksonun farklı bir eşik değeri var: şiddet arttıkça parlayan (uyarılan) akson sayısı artıyor ve tepki merdiven gibi kademeli yükseliyor. Alttaki tek sinir telinde ise eşik aşılınca tepki hemen en yüksek ve hep aynı (ya hep ya hiç). Grafikleri karşılaştır.',
    q: { q: 'Sinir demetinde uyaran şiddeti arttıkça tepkinin kademeli artmasının nedeni nedir?', o: ['Demetteki aksonların eşik değerlerinin farklı olması', 'Uyartı iletim hızının artması', 'Miyelin kılıfın kalınlaşması', 'Tek nöronun tepki şiddetinin artması'], a: 0, e: 'Sinir demetinde farklı aksonlar farklı eşik değerlerine sahiptir; uyaran arttıkça uyarılan akson sayısı artar (merdiven etkisi).' },
    build() {
      const { g, sels, ticks, S, G } = B(), rnd = srand(15), X0 = -4.2, X1 = 2.6;
      g.add(S(at(new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.55, X1 - X0, 48, 1, true).rotateZ(Math.PI / 2), mt(0xf1e3b5, { transparent: true, opacity: .28, depthWrite: false, side: THREE.DoubleSide, roughness: .5 })), (X0 + X1) / 2, 0, 0), 'Sinir demeti (sinir kordonu)', 'Birçok nöronun aksonunun bir arada bulunduğu yapıdır. Sinir demetinde ya hep ya hiç kuralına uyulmaz: farklı aksonların eşik değerleri farklı olduğundan uyaran şiddeti arttıkça tepki şiddeti kademeli artar (merdiven etkisi). Belli bir değerden sonra uyaran artsa bile tepki değişmez.', 'Merdiven etkisi', 'kilif'));
      const F = [V3(0, .65, .5), V3(0, .6, -.62), V3(0, -.6, .55), V3(0, -.58, -.55)];
      F.forEach(f => g.add(S(at(new THREE.Mesh(new THREE.CylinderGeometry(.62, .62, X1 - X0 + .05, 32, 1, true).rotateZ(Math.PI / 2), mt(0xdac08a, { transparent: true, opacity: .3, depthWrite: false, side: THREE.DoubleSide })), (X0 + X1) / 2, f.y, f.z), 'Akson demetçiği', 'Sinir demetinin içindeki küçük akson gruplarıdır; her biri ince bir kılıfla sarılıdır.', 'Akson grubu', 'kilif')));
      const AX = []; F.forEach(f => { for (let k = 0; k < 9; k++) { const a = k / 9 * 6.283 + rnd(), r = k === 0 ? 0 : .22 + rnd() * .25; AX.push({ y: f.y + Math.cos(a) * r, z: f.z + Math.sin(a) * r, r: .05 + rnd() * .05, th: .08 + rnd() * .84 }); } });
      AX.sort((a, b) => a.th - b.th);
      const L = X1 - X0 + .5;
      const axM = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, L, 10).rotateZ(Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .4 }), AX.length);
      const myM = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, L - .3, 10, 1, true).rotateZ(Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xf5c542, roughness: .35, transparent: true, opacity: .55, side: THREE.DoubleSide }), AX.length);
      const dd = new THREE.Object3D(); AX.forEach((a, i) => { dd.position.set((X0 + X1) / 2 + .25, a.y, a.z); dd.scale.set(1, a.r, a.r); dd.updateMatrix(); axM.setMatrixAt(i, dd.matrix); dd.scale.set(1, a.r * 1.7, a.r * 1.7); dd.position.x -= .15; dd.updateMatrix(); myM.setMatrixAt(i, dd.matrix); axM.setColorAt(i, new THREE.Color(0x5b55e0)); });
      axM.instanceColor.needsUpdate = true; axM.frustumCulled = myM.frustumCulled = false;
      g.add(S(axM, 'Akson (sinir teli)', 'Demetteki her akson (sinir teli) kendi eşik değerine sahiptir ve tek başına “ya hep ya hiç” yasasına uyar: eşik değerin altındaki uyaranlara tepki vermez, eşik ve üzerindeki uyaranlara maksimum ve aynı şiddette tepki verir. Parlayan aksonlar uyarılmış olanlardır.', 'Farklı eşik değerleri', 'akson'), S(myM, 'Miyelin kılıf', 'Aksonları saran yalıtıcı örtüdür.', 'Yalıtım', 'akson'));
      [[.95, 1.1, 0xc8302c], [-.1, 1.25, 0x3550c0]].forEach(([z, y, c]) => g.add(S(curveTube([[X0, y * .2, z], [0, y * .15, z * 1.05], [X1, y * .2, z]], .08, mt(c), 20), 'Kan damarları', 'Sinir demetini besleyen kan damarlarıdır.', 'Beslenme', 'kilif')));
      const el = new THREE.Group(); [-.25, .25].forEach(z => el.add(cylBetween([X0 - .3, 2.2, z], [X0 - .05, 1.45, z], .045, mt(0xc0c8d0, { metalness: .6, roughness: .3 })))); g.add(S(el.children[0], 'Uyarı elektrotları', 'Sinir demetine kademeli artan şiddette elektriksel uyarı veren elektrotlardır.', 'Uyaran', 'kilif'), S(el.children[1], 'Uyarı elektrotları', 'Sinir demetine kademeli artan şiddette elektriksel uyarı veren elektrotlardır.', 'Uyaran', 'kilif'));
      /* tek sinir teli */
      const TY = -2.6, single = S(cylBetween([X0, TY, 0], [X1, TY, 0], .11, mt(0x5b55e0, { emissive: 0x000000 }), 14), 'Tek sinir teli (tek nöron)', 'Tek bir nöron eşik değeri ve üzerindeki uyarılara maksimum ve aynı şiddette tepki verir; eşik değerin altındaki uyarılara tepki vermez. Buna ya hep ya hiç yasası denir. Sinir teline uygulanan uyaran şiddeti eşik değerin üzerindeyken uyartının hızı ve tepki şiddeti değişmez.', 'Ya hep ya hiç', 'tek'); g.add(single);
      label(g, 'Tek sinir teli (eşik: orta)', -.8, TY - .5, 0, .55); const TH0 = .5;
      const panel = canvasPlane(3.6, 2.2, 512, (c, w, h, s, n, hist, single) => {
        c.clearRect(0, 0, w, h); c.fillStyle = 'rgba(6,24,47,.88)'; c.fillRect(0, 0, w, h); c.strokeStyle = '#22d3ee'; c.lineWidth = 4; c.strokeRect(2, 2, w - 4, h - 4);
        c.fillStyle = '#fff'; c.font = '700 26px Nunito, sans-serif'; c.fillText('Sinir demeti: tepki şiddeti', 18, 36);
        c.strokeStyle = '#8fb3d9'; c.lineWidth = 2; c.beginPath(); c.moveTo(40, 60); c.lineTo(40, h - 40); c.lineTo(w - 20, h - 40); c.stroke();
        c.font = '18px Nunito'; c.fillStyle = '#cfe'; c.fillText('Uyaran şiddeti →', w - 180, h - 14);
        (hist || []).forEach((v, i) => { const bw = (w - 80) / 10, x = 48 + i * bw, bh = v * (h - 120); c.fillStyle = '#ffd34d'; c.fillRect(x, h - 42 - bh, bw - 6, bh); c.fillStyle = '#5ec8ff'; c.fillRect(x, h - 38, bw - 6, 6 * (i + 1) / 2); });
        c.fillStyle = '#ffd34d'; c.font = '700 22px Nunito'; c.fillText(`Uyarılan akson: ${n || 0}/${AX.length}`, 300, 64);
      });
      panel.position.set(-.8, 3.05, 0); panel.scale.setScalar(.9); g.add(S(panel, 'Grafik: merdiven etkisi', 'Sarı sütunlar tepki şiddetini gösterir: uyaran arttıkça kademeli artar, sonra sabitlenir (merdiven etkisi).', 'Grafik', 'graf'));
      const panel2 = canvasPlane(2.4, 1.3, 384, (c, w, h, hist) => { c.clearRect(0, 0, w, h); c.fillStyle = 'rgba(6,24,47,.88)'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ff7ab8'; c.lineWidth = 4; c.strokeRect(2, 2, w - 4, h - 4); c.fillStyle = '#fff'; c.font = '700 22px Nunito'; c.fillText('Tek sinir teli: ya hep ya hiç', 14, 30); (hist || []).forEach((v, i) => { const bw = (w - 40) / 10, bh = v * (h - 70); c.fillStyle = '#ff7ab8'; c.fillRect(24 + i * bw, h - 20 - bh, bw - 5, bh); }); });
      panel2.position.set(4.3, TY + .3, 0); g.add(S(panel2, 'Grafik: ya hep ya hiç', 'Pembe sütunlar: eşik değerin altında tepki yok, eşik ve üzerinde hep aynı en yüksek tepki.', 'Grafik', 'graf'));
      const pool = []; for (let i = 0; i < 50; i++) { const m = glow(0xffffff, .06); m.visible = false; g.add(G(m, 'akson')); pool.push({ m, on: false }); }
      const sp1 = glow(0xffffff, .12); g.add(G(sp1, 'tek'));
      let step = -1, acc = 0;
      ticks.push((t, dt) => {
        const k = Math.floor((t % 13) / 1.2); const s = Math.min(1, (k + 1) / 10);
        if (k !== step) { step = k; const lit = AX.filter(a => a.th <= s).length, hist = []; for (let i = 0; i <= Math.min(k, 9); i++) { const si = (i + 1) / 10; hist.push(AX.filter(a => a.th <= si).length / AX.length); } const h2 = []; for (let i = 0; i <= Math.min(k, 9); i++) h2.push((i + 1) / 10 >= TH0 ? 1 : 0); panel.redraw(s, lit, hist); panel2.redraw(h2); AX.forEach((a, i) => axM.setColorAt(i, new THREE.Color(a.th <= s ? 0xffe066 : 0x5b55e0))); axM.instanceColor.needsUpdate = true; single.material.emissive.setHex(s >= TH0 ? 0x806000 : 0x000000); }
        acc += dt; if (acc > .12) { acc = 0; const lit = AX.filter(a => a.th <= s); if (lit.length) { const a = lit[Math.floor(rnd() * lit.length)], f = pool.find(p => !p.on); if (f) { Object.assign(f, { on: true, a, x: X0 }); f.m.visible = true; } } }
        pool.forEach(f => { if (!f.on) return; f.x += dt * 4; f.m.position.set(f.x, f.a.y, f.a.z); if (f.x > X1) { f.on = false; f.m.visible = false; } });
        sp1.visible = s >= TH0; sp1.position.set(X0 + ((t * 4) % (X1 - X0)), TY, 0);
      });
      return { g, sels, ticks };
    }
  };

  /* ================= SİNAPS ÇEŞİTLERİ ================= */
  M3.sinapscesit = {
    title: 'Sinaps Çeşitleri ve Seçici Direnç', ico: '🚦', tag: 'Elektriksel · Kolaylaştırıcı · Durdurucu', cam: [0, 1.8, 13], target: [0, .2, 0], labScale: .85,
    layers: [['Elektriksel sinaps', 'el'], ['Kolaylaştırıcı (kimyasal) sinaps', 'ko'], ['Durdurucu (kimyasal) sinaps', 'du']],
    task: 'Üç sinapsı karşılaştır: Elektriksel sinapsta hücreler kanal proteinleriyle bağlı, uyartı doğrudan ve hızlı geçiyor. Kolaylaştırıcı sinapsta nörotransmitterler depolarizasyona neden olup uyartıyı geçiriyor (yeşil). Durdurucu sinapsta ise hiperpolarizasyon oluşuyor ve uyartı duruyor (kırmızı ✖). Bu seçici direnç sayesinde gereksiz tepkiler verilmez.',
    q: { q: 'Omurgalılarda daha yaygın olan, hücrelerin fiziksel olarak temas etmediği sinaps çeşidi hangisidir?', o: ['Kimyasal sinaps', 'Elektriksel sinaps', 'Ranvier boğumu', 'Miyelin kılıf'], a: 0, e: 'Omurgalılarda kimyasal sinaps daha yaygındır; hücreler arasında sinaps boşluğu bulunur.' },
    build() {
      const { g, sels, ticks, S, G } = B(), rnd = srand(4);
      const memM = c => mt(c, { transparent: true, opacity: .5, depthWrite: false, roughness: .3, side: THREE.DoubleSide });
      const bulbGeo = new THREE.LatheGeometry(new THREE.SplineCurve([[.45, 3.2], [.55, 2.4], [1.1, 1.8], [1.25, 1.2], [1.0, .75], [.001, .65]].map(p => new THREE.Vector2(...p))).getPoints(30), 40);
      const postGeo = new THREE.LatheGeometry(new THREE.SplineCurve([[.001, -.65], [1.0, -.75], [1.3, -1.25], [1.0, -2.0], [.55, -2.8], [.5, -3.2]].map(p => new THREE.Vector2(...p))).getPoints(30), 40);
      const ST = [{ x: -4.6, k: 'el', n: 'Elektriksel sinaps', c: 0x22d3ee, inf: 'Elektriksel sinapslarda uyartı doğrudan nörondan nörona geçer ve hızlı tepkilere yol açar. Bu sinapslar daha çok omurgasızlarda bulunur; omurgalıların da bazı organlarında ritmik kas kasılmalarını gerçekleştirir.' }, { x: 0, k: 'ko', n: 'Kolaylaştırıcı sinaps', c: 0x2ecc71, inf: 'Kimyasal sinapsın bir türüdür. Nörotransmitter maddeler komşu hücrede depolarizasyona neden olarak uyartı iletimini sağlar.' }, { x: 4.6, k: 'du', n: 'Durdurucu sinaps', c: 0xff4d4d, inf: 'Kimyasal sinapsın bir türüdür. Nörotransmitterler komşu hücrede yüksek polarizasyona (hiperpolarizasyon) yol açarak uyartı iletimini engeller. Böylece oluşan her uyartıyla vücuttaki bütün tepki organları uyarılmaz ve gereksiz tepkiler verilmez.' }];
      ST.forEach(st => {
        const pre = S(new THREE.Mesh(bulbGeo, memM(0x5aa0ff)), st.n, st.inf, st.k === 'el' ? 'Doğrudan geçiş · hızlı' : 'Kimyasal sinaps', st.k); pre.position.x = st.x; pre.userData.low = true; g.add(pre);
        const post = S(new THREE.Mesh(postGeo, memM(0xb27be8)), st.n, st.inf, st.k === 'el' ? 'Doğrudan geçiş · hızlı' : 'Kimyasal sinaps', st.k); post.position.x = st.x; post.userData.low = true; g.add(post); st.post = post;
        label(g, st.n, st.x, 3.85, 0, .55);
        label(g, st.k === 'el' ? 'Uyartı doğrudan geçer' : st.k === 'ko' ? 'Depolarizasyon → uyartı geçer' : 'Hiperpolarizasyon → uyartı durur', st.x, -3.75, 0, .45);
        st.spark = glow(0xffffff, .16); g.add(G(st.spark, st.k));
        st.out = glow(st.c, .16); g.add(G(st.out, st.k));
        if (st.k === 'el') {
          if (true) { st.post.position.y += .55; pre.position.y -= .55; }
          const CH = []; for (let i = -2; i <= 2; i++) for (let j = -1; j <= 1; j++) if (Math.abs(i) + Math.abs(j) < 3) CH.push([st.x + i * .32, j * .32]);
          g.add(S(instMesh(new THREE.CylinderGeometry(.11, .11, .26, 6), mt(0x8c5be8, { roughness: .35 }), CH.length, (i, d) => d.position.set(CH[i][0], 0, CH[i][1])), 'Doğrudan geçiş kanalları', 'Elektriksel sinapsta iki hücrenin zarını birbirine bağlayan kanal proteinleridir. İyonlar bu kanallardan doğrudan geçer; bu yüzden iletim çok hızlıdır.', 'Elektriksel sinaps', 'el'));
          st.ions = []; for (let i = 0; i < 18; i++) { const m = glow(0x5ff5ff, .05); g.add(G(m, 'el')); st.ions.push({ m, c: CH[i % CH.length], u: rnd() }); }
        } else {
          const ntCol = st.k === 'ko' ? 0xffc93c : 0xff5a5a;
          for (let i = 0; i < 6; i++) { const v = S(at(new THREE.Mesh(new THREE.SphereGeometry(.2, 16, 12), mt(0xd6ecff, { transparent: true, opacity: .5, depthWrite: false })), st.x + (rnd() - .5) * 1.4, 1.1 + rnd() * .8, (rnd() - .5) * 1.2), 'Sinaptik kesecik', 'İçinde nörotransmitter madde bulunan keseciklerdir.', 'Nörotransmitter deposu', st.k); g.add(v); }
          const R = []; for (let i = -2; i <= 2; i++) { const r = S(at(new THREE.Mesh(new THREE.CylinderGeometry(.1, .12, .3, 12), mt(0x5b3fe0, { emissive: 0x000000 })), st.x + i * .38, -.72, (i % 2) * .25), 'Reseptör', 'Nörotransmitterlerin bağlandığı zar proteinleridir.', 'Alıcı protein', st.k); g.add(r); R.push(r); } st.R = R;
          st.nts = []; for (let i = 0; i < 22; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(.055, 8, 6), new THREE.MeshStandardMaterial({ color: ntCol, emissive: new THREE.Color(ntCol).multiplyScalar(.4) })); g.add(S(m, st.k === 'ko' ? 'Nörotransmitter (kolaylaştırıcı)' : 'Nörotransmitter (durdurucu)', st.k === 'ko' ? 'Komşu hücrede depolarizasyona neden olarak uyartının iletilmesini sağlar.' : 'Komşu hücrede hiperpolarizasyona yol açarak uyartının iletilmesini engeller.', 'Kimyasal haberci', st.k)); st.nts.push({ m, x: st.x + (rnd() - .5) * 1.6, z: (rnd() - .5) * 1, u: rnd() }); }
          if (st.k === 'du') { const x1 = new THREE.Group(); [-1, 1].forEach(s => { const b = new THREE.Mesh(new THREE.BoxGeometry(.18, 1.1, .18), new THREE.MeshBasicMaterial({ color: 0xff3030 })); b.rotation.z = s * Math.PI / 4; x1.add(b); }); x1.position.set(st.x, -2.3, 0); g.add(G(x1, 'du')); st.X = x1; }
        }
      });
      ticks.push((t, dt) => ST.forEach(st => {
        const T = st.k === 'el' ? 1.6 : 3, ph = (t % T) / T;
        st.spark.position.set(st.x, st.k === 'el' ? 3.2 - ph * 3.6 : 3.2 - Math.min(1, ph * 2) * 2.5, 0); st.spark.visible = st.k === 'el' ? ph < .8 : ph < .5;
        if (st.k === 'el') { st.ions.forEach(o => { o.u = (o.u + dt * 1.4) % 1; o.m.position.set(o.c[0], .5 - o.u * 1.0, o.c[1]); }); st.out.visible = ph > .55; st.out.position.set(st.x, -.3 - (ph - .55) * 6, 0); st.post.material.emissive.setRGB(0, ph > .5 ? .25 : 0, ph > .5 ? .3 : 0); }
        else {
          st.nts.forEach(o => { const v = Math.max(0, Math.min(1, (ph - .45) * 3 + o.u * .2)); o.m.visible = ph > .45; o.m.position.set(o.x, .55 - v * 1.15, o.z); });
          const bound = ph > .7; st.R.forEach(r => r.material.emissive.setHex(bound ? (st.k === 'ko' ? 0x1f7a3a : 0x7a1f1f) : 0x000000));
          st.post.material.emissive.setRGB(bound && st.k === 'du' ? .0 : 0, bound && st.k === 'ko' ? .35 : 0, bound && st.k === 'du' ? .45 : 0);
          if (st.k === 'ko') { st.out.visible = ph > .78; st.out.position.set(st.x, -1 - (ph - .78) * 9, 0); } else { st.out.visible = false; st.X.visible = ph > .75; st.X.rotation.y = t * 2; }
        }
      }));
      return { g, sels, ticks };
    }
  };

  /* ================= HAYVANLARDA DUYULAR ================= */
  M3.hayvanduyu = {
    title: 'Hayvanlarda Duyu Çeşitliliği', ico: '🐍', tag: 'Bileşik göz · Pit organ · Yıldız burun · Ekolokasyon', cam: [0, 4.2, 15.5], target: [0, .2, 0], labScale: .9,
    layers: [['Yusufçuk', 'yus'], ['Yıldız burunlu köstebek', 'kos'], ['Çukur engereği', 'eng'], ['Yunus', 'yun'], ['Alman çoban köpeği', 'kop'], ['Yayın balığı', 'yay']],
    task: 'Altı hayvanın duyu yapılarını incele ve her birinin algıladığı uyaranı, reseptör çeşidini belirle: yusufçuğun bileşik gözü, köstebeğin 22 uzantılı yıldız burnu, engereğin pit organı, yunusun ses dalgaları, köpeğin burnu ve yayın balığının derisindeki tat tomurcukları.',
    q: { q: 'Yıldız burunlu köstebeğin burnundaki 22 uzantı hangi reseptör çeşidini içerir?', o: ['Mekanoreseptör', 'Termoreseptör', 'Kemoreseptör', 'Fotoreseptör'], a: 0, e: 'Uzantılar dokunma duyusundan sorumludur; dokunma mekanik bir uyarandır ve mekanoreseptörlerle algılanır.' },
    build() {
      const { g, sels, ticks, S, G } = B(), rnd = srand(21);
      const P = [[-5.2, -3.4], [0, -3.4], [5.2, -3.4], [-5.2, 2.8], [0, 2.8], [5.2, 2.8]], BY = 1.4;
      const NM = ['Yusufçuk · görme', 'Köstebek · dokunma', 'Engerek · ısı', 'Yunus · ses', 'Köpek · koku', 'Yayın balığı · tat'];
      P.forEach((p, i) => { pedestal(g, null, p[0], p[1], 0x1d3b63, 1.9, -.68 + (i < 3 ? BY : 0)); label(g, NM[i], p[0], 1.75 + (i < 3 ? BY : 0), p[1], .5); });
      /* 1 yusufçuk */
      { const o = V3(-5.2, BY, -3.4), grp = 'yus';
        const body = mt(0x2a8f7a, { roughness: .35, metalness: .3 });
        g.add(S(at(ellip(.38, .32, .34, body), o.x, o.y + .2, o.z + .6), 'Yusufçuk', 'Yusufçuk hareketli nesneleri çok iyi algılar; avını havada yakalar.', 'Hayvan', grp));
        g.add(S(at(ellip(.3, .28, .5, body), o.x, o.y + .1, o.z), 'Yusufçuk', 'Yusufçuk hareketli nesneleri çok iyi algılar; avını havada yakalar.', 'Hayvan', grp));
        g.add(S(new THREE.Mesh(taperGeo([[o.x, o.y + .1, o.z - .4], [o.x, o.y + .14, o.z - 1.4], [o.x, o.y + .2, o.z - 2.3]], .14, .06, 20, 10), body), 'Yusufçuk', 'Uzun karın bölümü.', 'Hayvan', grp));
        const wt = canvasTex(256, 64, (c, w, h) => { c.fillStyle = 'rgba(200,240,255,.35)'; c.beginPath(); c.ellipse(w / 2, h / 2, w / 2 - 2, h / 2 - 2, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(40,60,80,.6)'; c.lineWidth = 1; for (let x = 10; x < w; x += 9) { c.beginPath(); c.moveTo(x, 6); c.lineTo(x + 4, h - 6); c.stroke(); } c.beginPath(); c.moveTo(4, h / 2); c.lineTo(w - 4, h / 2); c.stroke(); });
        [[1, .15], [-1, .15], [1, -.35], [-1, -.35]].forEach(([s, dz]) => { const w = new THREE.Mesh(new THREE.PlaneGeometry(2.2, .5), new THREE.MeshBasicMaterial({ map: wt, transparent: true, side: THREE.DoubleSide, depthWrite: false })); w.rotation.x = -Math.PI / 2; w.position.set(o.x + s * 1.2, o.y + .32, o.z + dz); g.add(G(w, grp)); });
        [-1, 1].forEach(s => { const c = V3(o.x + s * .28, o.y + .32, o.z + .78), N = 420, pts = []; for (let i = 0; i < N; i++) { const y = 1 - 2 * (i + .5) / N, rr = Math.sqrt(1 - y * y), th = i * 2.39996, v = V3(Math.cos(th) * rr, y, Math.sin(th) * rr); if (v.x * s > -.2) pts.push(v); }
          const ce = S(instMesh(new THREE.CylinderGeometry(.034, .034, .04, 6), mt(0xffffff, { roughness: .2, metalness: .4 }), pts.length, (i, d) => { d.position.copy(c).addScaledVector(pts[i], .36); d.quaternion.setFromUnitVectors(V3(0, 1, 0), pts[i]); }), 'Bileşik göz (yusufçuk)', 'Yusufçuğun gözü otuz bine yakın gözcükten (ommatidyum) oluşan bileşik gözdür. Çok geniş bir görüş alanı sağlar; özellikle hareket hâlindeki nesneleri ağır çekimdeymiş gibi algılar. Işığı fotoreseptörler (elektromanyetik reseptör) algılar.', 'Fotoreseptör · ışık', grp);
          const cc = new THREE.Color(); for (let i = 0; i < pts.length; i++) { cc.setHSL(.42 + pts[i].y * .12, .8, .35 + .2 * pts[i].x * s); ce.setColorAt(i, cc); } ce.instanceColor.needsUpdate = true; g.add(ce); });
        const fly = glow(0x333333, .06); g.add(G(fly, grp)); ticks.push(t => fly.position.set(o.x + Math.sin(t * 1.7) * 1.2, o.y + .8 + Math.sin(t * 3.1) * .3, o.z + 1.6 + Math.cos(t * 1.3) * .5)); }
      /* 2 yıldız burunlu köstebek */
      { const o = V3(0, BY, -3.4), grp = 'kos', fur = mt(0x3b2a20, { roughness: .9 });
        g.add(S(at(ellip(.8, .6, 1.25, fur), o.x, o.y + .2, o.z - .3), 'Yıldız burunlu köstebek', 'Toprak altında yaşar; gözleri çok küçüktür. Avını bulmak için dokunma duyusunu kullanır.', 'Hayvan', grp));
        g.add(S(new THREE.Mesh(taperGeo([[o.x, o.y + .15, o.z + .7], [o.x, o.y + .05, o.z + 1.2]], .38, .26, 8, 18), fur), 'Yıldız burunlu köstebek', 'Burnun bulunduğu baş kısmı.', 'Hayvan', grp));
        const pink = mt(0xff8fb0, { roughness: .45, emissive: 0x2a0010 }), NC = V3(o.x, o.y + .05, o.z + 1.25), tg = [];
        for (let k = 0; k < 22; k++) { const side = k < 11 ? -1 : 1, j = k % 11, a = (j / 10 - .5) * Math.PI * 1.25 + (side < 0 ? Math.PI : 0); const d = V3(Math.cos(a), Math.sin(a), .55).normalize(); const L = .35 + .08 * Math.cos(j * .6); tg.push(taperGeo([NC.clone().addScaledVector(V3(Math.cos(a), Math.sin(a), 0), .12), NC.clone().addScaledVector(d, L * .55), NC.clone().addScaledVector(d, L)], .055, .03, 8, 8)); }
        const star = S(new THREE.Mesh(mergeGeos(tg), pink), 'Yıldız burun (22 uzantı)', 'Yıldız burunlu köstebeğin burnunda dokunma duyusundan sorumlu yirmi iki adet uzantı bulunur. Bu uzantılardaki mekanoreseptörler sayesinde toprak altındaki her yeri üç boyutlu olarak algılar ve avının yerini kolayca bulur.', 'Mekanoreseptör · dokunma', grp); g.add(star);
        [-1, 1].forEach(s => g.add(S(at(ellip(.42, .1, .3, mt(0xf2a0b8, { roughness: .6 })), o.x + s * .85, o.y - .25, o.z + .45), 'Yıldız burunlu köstebek', 'Kazmaya uygun geniş ön ayaklar.', 'Hayvan', grp)));
        const worm = S(curveTube([[o.x + .8, o.y - .5, o.z + 1.5], [o.x + .3, o.y - .46, o.z + 1.7], [o.x - .3, o.y - .5, o.z + 1.5], [o.x - .7, o.y - .46, o.z + 1.7]], .07, mt(0xd98a7a), 30), 'Solucan (av)', 'Köstebek avını dokunma uzantılarıyla bulur.', 'Av', grp); g.add(worm);
        ticks.push(t => { star.rotation.z = Math.sin(t * 9) * .03; }); }
      /* 3 çukur engereği */
      { const o = V3(5.2, BY, -3.4), grp = 'eng', skin = mt(0x8a7a3a, { roughness: .6 });
        const coil = []; for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 3.2, r = 1.1 - i / 60 * .55; coil.push(V3(o.x + Math.cos(a) * r, o.y - .42 + i / 60 * .25, o.z - .2 + Math.sin(a) * r)); }
        g.add(S(new THREE.Mesh(taperGeo(coil.reverse(), .07, .2, 120, 12), skin), 'Çukur engereği', 'Gece avlanan bir yılandır; karanlıkta bile avının yerini bulabilir.', 'Hayvan', grp));
        const neck = [V3(o.x + .55, o.y - .3, o.z - .1), V3(o.x + .4, o.y - .2, o.z + .4), V3(o.x + .1, o.y + .15, o.z + .7)]; g.add(S(new THREE.Mesh(taperGeo(neck, .2, .2, 16, 12), skin), 'Çukur engereği', 'Gece avlanan bir yılandır.', 'Hayvan', grp));
        const head = S(at(ellip(.32, .2, .55, skin), o.x, o.y + .25, o.z + 1.05), 'Çukur engereği', 'Üçgen biçimli baş.', 'Hayvan', grp); g.add(head);
        [-1, 1].forEach(s => { g.add(G(at(new THREE.Mesh(new THREE.SphereGeometry(.07, 12, 10), mt(0xffd34d, { emissive: 0x332200 })), o.x + s * .24, o.y + .35, o.z + 1.1), grp)); const pit = S(at(new THREE.Mesh(new THREE.SphereGeometry(.07, 14, 10), mt(0x1a0a0a, { emissive: 0xaa2200 })), o.x + s * .25, o.y + .24, o.z + 1.35), 'Pit organ (çukur engereği)', 'Çukur engereklerinin gözlerinin altında bulunan çukur organdır. İçindeki termoreseptörler avlarından yayılan ısıyı algılar; böylece karanlık ortamda bile avının yerini tespit eder.', 'Termoreseptör · ısı (fiziksel uyaran)', grp); g.add(pit); });
        const mouse = S(at(ellip(.28, .2, .4, mt(0xff7a3a, { emissive: 0x8a2a00 })), o.x - .4, o.y - .38, o.z + 1.6), 'Fare (ısı kaynağı)', 'Sıcakkanlı av çevresine ısı yayar; ısı fiziksel bir uyarandır.', 'Uyaran', grp); g.add(mouse);
        const waves = []; for (let i = 0; i < 4; i++) { const w = new THREE.Mesh(new THREE.TorusGeometry(.3, .025, 6, 30), new THREE.MeshBasicMaterial({ color: 0xff6a2a, transparent: true })); g.add(G(w, grp)); waves.push(w); }
        ticks.push(t => waves.forEach((w, i) => { const u = (t * .45 + i / 4) % 1; w.position.copy(mouse.position).lerp(V3(o.x, o.y + .25, o.z + 1.4), u); w.scale.setScalar(.6 + u * .6); w.lookAt(o.x, o.y + .25, o.z + 1.4); w.material.opacity = 1 - u; })); }
      /* 4 yunus */
      { const o = V3(-5.2, 0, 2.8), grp = 'yun';
        const prof = []; for (let i = 0; i <= 30; i++) { const u = i / 30; prof.push(new THREE.Vector2(.001 + .48 * Math.pow(Math.sin(Math.PI * Math.pow(u, .8)), .9) * (1 - .55 * u * u), -1.6 + u * 3.2)); }
        const dg = new THREE.LatheGeometry(prof, 32).rotateX(Math.PI / 2); const dol = S(new THREE.Mesh(dg, mt(0x7d97b3, { roughness: .35 })), 'Yunus', 'Yunuslar ses dalgalarıyla çevrelerini “görür”; bulanık sularda engellerden kaçar ve balık sürülerini bulur.', 'Hayvan', grp); dol.position.set(o.x - .4, o.y + .1, o.z); dol.rotation.y = Math.PI / 2; g.add(dol);
        g.add(S(at(ellip(.32, .3, .36, mt(0xf2d27a, { roughness: .3, emissive: 0x332000 })), o.x + .95, o.y + .32, o.z), 'Ses dalgası yayan organ (yunus)', 'Yunusların başlarında bulunan özel organdır. Buradan yayılan ses dalgaları engellere çarparak geri döner ve işitme organları tarafından algılanır. Geri dönen ses dalgaları mekanik uyarandır; mekanoreseptörlerle algılanır.', 'Ses dalgası · mekanoreseptör', grp));
        g.add(S(at(ellip(.5, .1, .14, mt(0x7d97b3)), o.x + 1.5, o.y + .02, o.z), 'Yunus', 'Gaga.', 'Hayvan', grp));
        const fin = new THREE.Mesh(new THREE.ConeGeometry(.28, .6, 4), mt(0x6a849f)); fin.position.set(o.x - .3, o.y + .7, o.z); fin.rotation.z = .5; g.add(G(fin, grp));
        const tail = new THREE.Mesh(new THREE.BoxGeometry(.12, .1, 1.1), mt(0x6a849f)); tail.position.set(o.x - 2.05, o.y + .1, o.z); g.add(G(tail, grp));
        const fish = S(at(ellip(.32, .16, .08, mt(0xffb347, { emissive: 0x442200 })), o.x + 3.0, o.y + .2, o.z + .3), 'Balık sürüsü (hedef)', 'Ses dalgaları balığa çarparak geri döner; yunus balığın yerini böyle bulur.', 'Hedef', grp); g.add(fish);
        const out = [], back = []; for (let i = 0; i < 4; i++) { const a = new THREE.Mesh(new THREE.TorusGeometry(.3, .025, 6, 30, Math.PI * .9), new THREE.MeshBasicMaterial({ color: 0x4fb3ff, transparent: true })); a.rotation.set(0, Math.PI / 2, -Math.PI * .45); g.add(G(a, grp)); out.push(a); const b = a.clone(); b.material = new THREE.MeshBasicMaterial({ color: 0xff7ab8, transparent: true }); b.rotation.y = -Math.PI / 2; g.add(G(b, grp)); back.push(b); }
        ticks.push(t => { out.forEach((w, i) => { const u = (t * .5 + i / 4) % 1; w.position.set(o.x + 1.2 + u * 1.7, o.y + .3, o.z + .1); w.scale.setScalar(.6 + u); w.material.opacity = 1 - u * .8; }); back.forEach((w, i) => { const u = (t * .5 + i / 4 + .5) % 1; w.position.set(o.x + 2.9 - u * 1.8, o.y + .25, o.z + .2); w.scale.setScalar(.5 + u * .3); w.material.opacity = .9 - u * .6; }); fish.position.y = o.y + .2 + Math.sin(t * 2) * .1; }); }
      /* 5 köpek */
      { const o = V3(0, 0, 2.8), grp = 'kop', fur = mt(0x8a5a2b, { roughness: .8 }), dark = mt(0x2a1a10, { roughness: .8 });
        g.add(S(at(ellip(.65, .6, .7, fur), o.x, o.y + .35, o.z - .3), 'Alman çoban köpeği', 'Polis ve kurtarma köpeği olarak da bilinir; güçlü koku duyusuyla iz sürer.', 'Hayvan', grp));
        g.add(S(new THREE.Mesh(taperGeo([[o.x, o.y + .2, o.z + .1], [o.x, o.y + .05, o.z + .9]], .4, .24, 10, 18), fur), 'Alman çoban köpeği', 'Uzun burun (namlu).', 'Hayvan', grp));
        const nose = S(at(ellip(.2, .15, .14, mt(0x111111, { roughness: .3 })), o.x, o.y + .1, o.z + 1.0), 'Burun (köpek) – gelişmiş kemoreseptörler', 'Alman çoban köpeğinin burnundaki gelişmiş kemoreseptörler sayesinde iz sürebilir; kimyasal maddeleri, patlayıcı maddeleri ve kayıp kişileri bulabilir. Koku molekülleri kimyasal uyarandır.', 'Kemoreseptör · koku', grp); g.add(nose);
        [-1, 1].forEach(s => { const ear = new THREE.Mesh(new THREE.ConeGeometry(.2, .55, 4), dark); ear.position.set(o.x + s * .35, o.y + .95, o.z - .4); ear.rotation.z = -s * .25; g.add(G(ear, grp)); g.add(G(at(new THREE.Mesh(new THREE.SphereGeometry(.07, 10, 8), mt(0x1a1208)), o.x + s * .25, o.y + .55, o.z + .2), grp)); });
        const mols = []; for (let i = 0; i < 24; i++) { const m = glow([0x6ee7b7, 0xff7ab8, 0xffd34d][i % 3], .05); g.add(G(m, grp)); mols.push({ m, u: rnd(), x: (rnd() - .5) * 1.6, y: rnd() * .3 }); }
        ticks.push((t, dt) => mols.forEach(q => { q.u = (q.u + dt * .3) % 1; q.m.position.set(o.x + q.x * (1 - q.u), o.y - .45 + q.y + q.u * .6, o.z + 1.8 - q.u * .8); })); }
      /* 6 yayın balığı */
      { const o = V3(5.2, 0, 2.8), grp = 'yay';
        const prof = []; for (let i = 0; i <= 30; i++) { const u = i / 30; prof.push(new THREE.Vector2(.001 + .45 * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.15)), .7) * (1 - .6 * u), -1.6 + u * 3.2)); }
        const fg = new THREE.LatheGeometry(prof, 30).rotateX(-Math.PI / 2); fg.scale(1, .7, 1);
        const tex = canvasTex(256, 128, (c, w, h) => { c.fillStyle = '#5d6b6a'; c.fillRect(0, 0, w, h); for (let i = 0; i < 260; i++) { c.fillStyle = 'rgba(255,214,77,.9)'; c.beginPath(); c.arc(rnd() * w, rnd() * h, 1.6, 0, 7); c.fill(); } });
        const fish = S(new THREE.Mesh(fg, mt(0xffffff, { map: tex, roughness: .5 })), 'Deri tat tomurcukları (yayın balığı)', 'Yayın balıkları derilerinde bulunan tat alma tomurcuklarındaki kemoreseptörler sayesinde tüm vücutlarıyla tat alabilir. Tat yoğunluğunu algılamaları yiyeceklerini bulmalarına yardımcı olur. (Sarı noktalar tat tomurcuklarını temsil eder.)', 'Kemoreseptör · tat (kimyasal uyaran)', grp);
        fish.position.set(o.x - .3, o.y, o.z); fish.rotation.y = Math.PI / 2; g.add(fish);
        const bm = mt(0x3c4645, { roughness: .6 }); [[-1, .1], [1, .1], [-1, -.1], [1, -.1]].forEach(([s, dy], k) => g.add(S(curveTube([[o.x + 1.25, o.y + dy, o.z + s * .12], [o.x + 1.6, o.y + dy - .1, o.z + s * .45], [o.x + 1.9, o.y + dy - .3, o.z + s * .7 + (k > 1 ? .1 : 0)]], .025, bm, 16), 'Bıyıklar (yayın balığı)', 'Yayın balığının ağız çevresindeki uzantılarda da çok sayıda tat tomurcuğu bulunur.', 'Kemoreseptör', grp)));
        const food = []; for (let i = 0; i < 16; i++) { const m = glow(0x8af0a0, .045); g.add(G(m, grp)); food.push({ m, u: rnd(), a: rnd() * 6.28 }); }
        ticks.push((t, dt) => { fish.rotation.z = Math.sin(t * 1.5) * .05; food.forEach(q => { q.u = (q.u + dt * .2) % 1; q.m.position.set(o.x + 2.4 - q.u * 2.6, o.y + Math.sin(q.a + t) * .5, o.z + Math.cos(q.a + t * .7) * .6); }); }); }
      return { g, sels, ticks };
    }
  };

  /* ================= RESEPTÖR GALERİSİ ================= */
  M3.reseptorgaleri = {
    title: 'Reseptör Galerisi (Reseptörü Tanı)', ico: '🧩', tag: 'Nöron · Duyu epiteli', cam: [0, 2.2, 16], target: [0, 0, 0], labScale: .9,
    layers: [['Nöron yapısındakiler (mavi halka)', 'nor'], ['Duyu epiteli yapısındakiler (yeşil halka)', 'epi']],
    task: 'Yedi reseptörü incele. Kaide halkası mavi olanlar nöron yapısında, yeşil olanlar duyu epiteli (özelleşmiş epitel hücresi) yapısındadır. Her reseptörün hangi duyu organında bulunduğunu, hangi uyaranı algıladığını ve reseptör çeşidini söyle.',
    q: { q: 'Aşağıdakilerden hangisi duyu epiteli yapısındaki bir reseptördür?', o: ['Kulaktaki tüylü duyu hücresi', 'Gözdeki çubuk hücresi', 'Burundaki koku reseptör nöronu', 'Derideki serbest sinir ucu'], a: 0, e: 'Kulaktaki tüylü duyu hücreleri ve dildeki tat reseptör hücreleri duyu epiteli yapısındadır.' },
    build() {
      const { g, sels, ticks, S, G } = B(), rnd = srand(8);
      const XS = [-7.2, -4.8, -2.4, 0, 2.4, 4.8, 7.2];
      const ring = (x, epi) => { const p = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.05, .2, 40), mt(0x1d3b63, { roughness: .6 })); at(p, x, -1.6, 0); g.add(G(p, epi ? 'epi' : 'nor')); const r = new THREE.Mesh(new THREE.TorusGeometry(1.03, .07, 8, 48).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: epi ? 0x2ecc71 : 0x3b8bff })); at(r, x, -1.48, 0); g.add(G(r, epi ? 'epi' : 'nor')); };
      const L = ['1 · Işık (Göz)', '2 · Dokunma (Deri)', '3 · Koku (Burun)', '4 · İşitme (Kulak)', '5 · Tat (Dil)', '6 · Sıcaklık (Deri)', '7 · Ağrı (Deri)'];
      XS.forEach((x, i) => { ring(x, i === 3 || i === 4); label(g, L[i], x, -2.3, .9, .42); });
      const nerve = NERVE();
      /* 1 çubuk + koni */
      { const x = XS[0], grp = 'nor', rod = mt(0xb7c7d8, { roughness: .4 }), cone = mt(0x34b06a, { roughness: .4 });
        const discs = (cx, y0, n, r0, r1, m) => { for (let k = 0; k < n; k++) { const r = r0 + (r1 - r0) * k / (n - 1); g.add(S(at(new THREE.Mesh(new THREE.CylinderGeometry(r, r, .05, 18), m), cx, y0 + k * .075, 0), m === rod ? 'Fotoreseptör: çubuk hücresi' : 'Fotoreseptör: koni hücresi', m === rod ? 'Az ışıkta etkili, renkli görme sağlamayan fotoreseptördür. Dış bölümündeki disklerde ışığa duyarlı maddeler bulunur. Nöron yapısındadır; elektromanyetik reseptörlere örnektir.' : 'Aydınlıkta etkili, renkli ve ayrıntılı görmeyi sağlayan fotoreseptördür; dış bölümü koni biçimlidir. Nöron yapısındadır.', 'Elektromanyetik reseptör · nöron', grp)); } };
        discs(x - .45, .35, 16, .16, .16, rod); discs(x + .45, .35, 12, .22, .05, cone);
        [[-.45, rod, 'Fotoreseptör: çubuk hücresi'], [.45, cone, 'Fotoreseptör: koni hücresi']].forEach(([dx, m, n]) => { g.add(S(new THREE.Mesh(taperGeo([[x + dx, .3, 0], [x + dx, -.3, 0], [x + dx, -.9, 0]], .13, .09, 10, 12), m), n, 'Gözün retinasındaki ışığa duyarlı hücredir; ışığı algılayarak elektrik sinyaline dönüştürür.', 'Elektromanyetik reseptör · nöron', grp)); g.add(S(at(new THREE.Mesh(new THREE.SphereGeometry(.14, 16, 12), mt(0xb3542a)), x + dx, -.35, 0), n, 'Hücrenin çekirdeği.', 'Fotoreseptör', grp)); for (let k = -1; k <= 1; k++) g.add(G(curveTube([[x + dx, -.9, 0], [x + dx + k * .15, -1.2, 0], [x + dx + k * .25, -1.42, 0]], .025, m, 8), grp)); }); }
      /* 2 dokunma: Pacini */
      { const x = XS[1], grp = 'nor';
        const st = stripeTex('#f6c35a', '#e09a2c', 26);
        g.add(S(at(ellip(.55, .85, .55, mt(0xffffff, { map: st, roughness: .35 }), 32), x, .35, 0), 'Mekanoreseptör: kapsüllü sinir ucu', 'Derideki dokunma ve basıncı algılayan, soğan zarı gibi katmanlı kapsüllü mekanoreseptördür (ör. Pacini cisimciği). Kapsülün ortasında bir sinir ucu bulunur; nöron yapısındadır.', 'Mekanoreseptör · nöron', grp));
        g.add(S(new THREE.Mesh(taperGeo([[x, -.5, 0], [x + .05, -1.0, 0], [x, -1.45, 0]], .06, .06, 8, 10), nerve), 'Mekanoreseptör: kapsüllü sinir ucu', 'Kapsülden çıkan sinir lifi uyartıyı merkezî sinir sistemine taşır.', 'Mekanoreseptör · nöron', grp)); }
      /* 3 koku reseptör nöronu */
      { const x = XS[2], grp = 'nor', pur = mt(0x8a5be8, { roughness: .35 });
        g.add(S(at(ellip(.3, .4, .3, pur), x, -.35, 0), 'Kemoreseptör: koku reseptör nöronu', 'Burundaki koku epitelinde bulunan duyu nöronudur. Ucundaki tüycüklere bağlanan koku molekülleri (kimyasal uyaran) nöronu uyarır; aksonu koku soğanına uzanır.', 'Kemoreseptör · nöron', grp));
        g.add(S(at(new THREE.Mesh(new THREE.SphereGeometry(.14, 14, 10), mt(0x3a1a7a)), x, -.35, .2), 'Kemoreseptör: koku reseptör nöronu', 'Hücre çekirdeği.', 'Kemoreseptör', grp));
        g.add(S(new THREE.Mesh(taperGeo([[x, 0, 0], [x + .05, .55, 0], [x, 1.05, 0]], .1, .07, 10, 10), pur), 'Kemoreseptör: koku reseptör nöronu', 'Dendrit ucu koku tüycüklerini taşır.', 'Kemoreseptör', grp));
        for (let k = 0; k < 7; k++) { const a = k / 7 * 6.283; g.add(S(curveTube([[x, 1.05, 0], [x + Math.cos(a) * .25, 1.3, Math.sin(a) * .25], [x + Math.cos(a + .5) * .5, 1.42, Math.sin(a + .5) * .45]], .016, mt(0xc9a8ff), 10), 'Koku tüycükleri', 'Koku moleküllerinin bağlandığı reseptör proteinleri bu tüycüklerin zarındadır.', 'Kemoreseptör', grp)); }
        g.add(S(new THREE.Mesh(taperGeo([[x, -.7, 0], [x - .05, -1.1, 0], [x, -1.45, 0]], .05, .04, 8, 8), nerve), 'Kemoreseptör: koku reseptör nöronu', 'Akson koku soğanına uzanır.', 'Kemoreseptör', grp));
        const mol = []; for (let i = 0; i < 8; i++) { const m = glow([0xff7ab8, 0x6ee7b7][i % 2], .045); g.add(G(m, grp)); mol.push({ m, u: rnd(), a: rnd() * 6.28 }); } ticks.push((t, dt) => mol.forEach(q => { q.u = (q.u + dt * .25) % 1; q.m.position.set(x + Math.cos(q.a) * .7 * (1 - q.u), 2.3 - q.u * .9, Math.sin(q.a) * .5 * (1 - q.u)); })); }
      /* 4 tüylü duyu hücresi */
      { const x = XS[3], grp = 'epi', cell = mt(0x2fb6b0, { roughness: .35 });
        const prof = [[.001, -.8], [.3, -.78], [.5, -.4], [.55, .3], [.5, .55], [.001, .58]].map(p => new THREE.Vector2(...p));
        g.add(S(at(new THREE.Mesh(new THREE.LatheGeometry(new THREE.SplineCurve(prof).getPoints(24), 32), cell), x, 0, 0), 'Mekanoreseptör: tüylü duyu hücresi', 'Kulaktaki işitme (Korti organı) ve denge reseptörleridir. Üst yüzündeki tüycükler titreşimle eğilince hücre uyarılır. Duyu epiteli (özelleşmiş epitel hücresi) yapısındadır.', 'Mekanoreseptör · duyu epiteli', grp));
        g.add(S(at(new THREE.Mesh(new THREE.SphereGeometry(.18, 16, 12), mt(0x1d3fb0)), x, -.3, .2), 'Mekanoreseptör: tüylü duyu hücresi', 'Hücre çekirdeği.', 'Duyu epiteli', grp));
        const hairs = new THREE.Group(); hairs.position.set(x, .58, 0); g.add(hairs);
        for (let r = 0; r < 3; r++) for (let k = -4; k <= 4; k++) { const h = .35 + r * .22, m = S(cylBetween([k * .09, 0, -.12 + r * .12], [k * .09, h, -.12 + r * .12], .022, mt(0x9ff5ee, { roughness: .3 }), 6), 'Tüycükler (stereosilya)', 'Ses titreşimleriyle eğilen tüycüklerdir; eğilme hücrede elektriksel değişime yol açar.', 'Mekanoreseptör', grp); hairs.add(m); }
        for (let k = -1; k <= 1; k++) g.add(S(curveTube([[x + k * .2, -1.45, 0], [x + k * .18, -1.0, .1], [x + k * .15, -.78, .05]], .035, nerve, 10), 'Duyu siniri lifi', 'Tüylü hücrenin tabanına temas eden sinir lifleri uyartıyı beyne taşır.', 'Nöron', grp));
        ticks.push(t => { hairs.rotation.z = Math.sin(t * 6) * .12; }); }
      /* 5 tat reseptör hücresi */
      { const x = XS[4], grp = 'epi', cell = mt(0xff6ec7, { roughness: .35 });
        g.add(S(new THREE.Mesh(taperGeo([[x, -1.0, 0], [x + .1, -.3, 0], [x + .05, .5, 0], [x, 1.0, 0]], .18, .06, 20, 14), cell), 'Kemoreseptör: tat reseptör hücresi', 'Dildeki tat tomurcuklarının içindeki duyu hücresidir. Tükürükte çözünen tat molekülleri ucundaki uzantılara bağlanınca hücre uyarılır. Duyu epiteli yapısındadır; altındaki sinir lifleriyle uyartı iletilir.', 'Kemoreseptör · duyu epiteli', grp));
        g.add(S(at(new THREE.Mesh(new THREE.SphereGeometry(.16, 14, 10), mt(0x8a1a5a)), x + .08, -.25, .12), 'Kemoreseptör: tat reseptör hücresi', 'Hücre çekirdeği.', 'Duyu epiteli', grp));
        for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; g.add(S(cylBetween([x, 1.0, 0], [x + Math.cos(a) * .12, 1.35, Math.sin(a) * .12], .014, mt(0xffb3e6), 4), 'Tat tüycükleri', 'Tat moleküllerinin bağlandığı uzantılardır.', 'Kemoreseptör', grp)); }
        g.add(S(curveTube([[x - .45, -1.45, 0], [x - .3, -1.05, 0], [x - .05, -.85, .1]], .04, nerve, 10), 'Duyu siniri lifi', 'Tat reseptör hücresinden mesaj alan sinir lifidir (nöron).', 'Nöron', grp)); }
      /* 6 termoreseptör */
      { const x = XS[5], grp = 'nor';
        const rg = new THREE.IcosahedronGeometry(.4, 3); { const p = rg.attributes.position; for (let i = 0; i < p.count; i++) { const v = V3(p.getX(i), p.getY(i), p.getZ(i)), f = 1 + .14 * Math.sin(v.x * 30) * Math.sin(v.y * 28) * Math.sin(v.z * 26); v.multiplyScalar(f); p.setXYZ(i, v.x, v.y, v.z); } rg.computeVertexNormals(); }
        const hot = S(at(new THREE.Mesh(rg, mt(0xff5a3a, { roughness: .4, emissive: 0x3a0800 })), x - .3, .6, 0), 'Termoreseptör (sıcak)', 'Sıcaklık artışını algılayan reseptördür (ör. Ruffini cisimciği). Termoreseptörler sıcak, soğuk gibi ısı değişikliklerini algılar; çoğunlukla deri ve dilde bulunur. Nöron yapısındadır.', 'Termoreseptör · nöron', grp); hot.scale.set(1, .7, .8); g.add(hot);
        const KR = []; for (let i = 0; i < 14; i++) { const a = rnd() * 6.28, b = Math.acos(rnd() * 2 - 1), r = .1 + rnd() * .12; KR.push([Math.sin(b) * Math.cos(a) * r, Math.cos(b) * r, Math.sin(b) * Math.sin(a) * r]); }
        g.add(S(instMesh(new THREE.SphereGeometry(.08, 12, 10), mt(0x3aa0ff, { roughness: .35, emissive: 0x062040 }), KR.length, (i, d) => d.position.set(x + .4 + KR[i][0], -.1 + KR[i][1], KR[i][2])), 'Termoreseptör (soğuk)', 'Sıcaklık azalmasını (soğuğu) algılayan reseptördür (ör. Krause cisimciği). Nöron yapısındadır.', 'Termoreseptör · nöron', grp));
        [[x - .3, .25], [x + .4, -.3]].forEach(([xx, y]) => g.add(S(curveTube([[xx, y, 0], [xx, (y - 1.45) / 2, .1], [x, -1.45, 0]], .045, nerve, 10), 'Termoreseptör (sıcak)', 'Reseptörden çıkan sinir lifi.', 'Termoreseptör', grp)));
        ticks.push(t => { hot.material.emissive.setRGB(.25 + .2 * Math.sin(t * 2), .03, 0); }); }
      /* 7 ağrı: serbest sinir uçları */
      { const x = XS[6], grp = 'nor', tg = [], tt = [];
        growTree(V3(x, -1.45, 0), V3(0, 1, 0), .9, .07, 3, rnd, tg, tt, { spread: .7, shrink: .72 });
        const fr = S(new THREE.Mesh(mergeGeos(tg), mt(0xffe14d, { emissive: 0x3a2a00, roughness: .4 })), 'Nosiseptör (serbest sinir uçları)', 'Doku hasarına duyarlı reseptörlere ağrı reseptörleri veya nosiseptör denir. Ağrı reseptörleri serbest sinir uçlarıdır ve beyin hariç tüm vücutta bulunur. Fiziksel ve kimyasal uyaranları algılar; nöron yapısındadır.', 'Ağrı reseptörü · nöron', grp); g.add(fr);
        ticks.push(t => { const e = Math.max(0, Math.sin(t * 2.3) * Math.sin(t * 5.1)); fr.material.emissive.setRGB(.25 + e * .7, .18 + e * .6, 0); }); }
      return { g, sels, ticks };
    }
  };

  /* ================= AKSONUN UZUNLUĞU · UYARTI NEREYE GİDER? ================= */
  M3.aksonuzunluk = {
    title: 'Uyartının Yolu: Siyatik ve Vagus Siniri', ico: '🧍', tag: 'Reseptör → Nöron → MSS → Tepki', cam: [7.5, 1.2, 12.5], target: [0, .2, 0], labScale: 1,
    layers: [['Vücut', 'vucut'], ['Beyin ve omurilik (MSS)', 'mss'], ['Siyatik sinir ve bacak', 'siy'], ['Vagus siniri ve iç organlar', 'vag'], ['Uyartılar', 'imp']],
    task: 'Ayaktaki reseptörden (mavi uyartı) omuriliğe ve beyne giden duyu yolunu, ardından omurilikten bacaktaki kasa giden motor yolu (turuncu) izle: uyartı → nöronlar → merkezî sinir sistemi → bütünleştirme → tepki (kas kasılması). Omurilikten ayağa uzanan siyatik sinirin ve beyin sapından karın bölgesine uzanan vagus sinirinin uzunluğuna dikkat et.',
    q: { q: 'Omurilikten çıkarak ayaktaki bir kasa ulaşan motor nöronun (siyatik sinir) aksonunun uzunluğu hangisine yakındır?', o: ['Bir metreden fazla', 'Birkaç mikrometre', 'Bir milimetre', 'Bir santimetre'], a: 0, e: 'Aksonun boyu milimetre ile metre ölçeği arasında değişir; siyatik sinirin uzunluğu bir metreden fazladır.' },
    build() {
      const { g, sels, ticks, S, G } = B(), rnd = srand(3);
      const skin = mt(0x8fbcff, { transparent: true, opacity: .16, depthWrite: false, roughness: .3, side: THREE.DoubleSide });
      const body = (geo, p, sc) => { const m = S(new THREE.Mesh(geo, skin), 'Vücut', 'İnsan vücudunun saydam gösterimi.', 'Vücut', 'vucut'); m.position.copy(p); if (sc) m.scale.set(...sc); m.userData.low = true; m.userData.nolab = true; g.add(m); return m; };
      body(new THREE.SphereGeometry(.62, 32, 24), V3(0, 4.15, 0), [1, 1.15, 1.1]);
      body(taperGeo([[0, 3.5, 0], [0, 3.2, 0]], .25, .28, 4, 16), V3(0, 0, 0));
      body(new THREE.SphereGeometry(1, 40, 30), V3(0, 1.9, 0), [1.15, 1.45, .62]);
      body(new THREE.SphereGeometry(1, 40, 30), V3(0, .2, 0), [1.0, .55, .58]);
      [-1, 1].forEach(s => { body(taperGeo([[s * .5, .1, 0], [s * .58, -1.6, .05], [s * .55, -3.2, 0], [s * .55, -4.4, -.05]], .42, .2, 30, 18), V3(0, 0, 0)); body(new THREE.SphereGeometry(1, 20, 14), V3(s * .55, -4.55, .25), [.18, .12, .38]); body(taperGeo([[s * 1.15, 2.9, 0], [s * 1.55, 1.5, .1], [s * 1.75, .1, .15]], .2, .12, 20, 12), V3(0, 0, 0)); });
      /* beyin ve omurilik */
      const bg = new THREE.SphereGeometry(.5, 40, 30), bp = bg.attributes.position; for (let i = 0; i < bp.count; i++) { const v = V3(bp.getX(i), bp.getY(i), bp.getZ(i)), f = 1 + .06 * Math.sin(v.x * 30) * Math.sin(v.y * 26) * Math.sin(v.z * 24); v.multiplyScalar(f); bp.setXYZ(i, v.x, v.y, v.z); } bg.computeVertexNormals();
      const brain = S(new THREE.Mesh(bg, mt(0xf0a5b0, { roughness: .6, emissive: 0x000000 })), 'Beyin', 'Merkezî sinir sisteminin bir parçasıdır. Duyu reseptörlerinden gelen uyartılar burada değerlendirilir (bütünleştirme), algı oluşur ve gerekli tepki için emir gönderilir.', 'Merkezî sinir sistemi', 'mss'); brain.scale.set(1, .85, 1.2); brain.position.set(0, 4.3, -.05); g.add(brain);
      const cordPts = [[0, 3.85, -.2], [0, 3.2, -.32], [0, 2.0, -.42], [0, .8, -.35], [0, -.1, -.3]];
      g.add(S(curveTube(cordPts, .09, mt(0xffd34d, { emissive: 0x3a2c00 }), 40), 'Omurilik', 'Merkezî sinir sisteminin bir parçasıdır. Uyartılar beyin ve omuriliğe ulaştırılır; bazı tepkiler (refleksler) doğrudan omurilikte oluşturulur.', 'Merkezî sinir sistemi', 'mss'));
      const cc = new THREE.CatmullRomCurve3(cordPts.map(p => V3(...p))); for (let k = 0; k < 22; k++) { const p = cc.getPointAt(.05 + k / 23); g.add(G(at(new THREE.Mesh(new THREE.BoxGeometry(.3, .11, .22), mt(0xe8dcc0, { transparent: true, opacity: .5 })), p.x, p.y, p.z - .13), 'mss')); }
      /* siyatik sinir */
      const siy = [[0, -.1, -.3], [.35, -.35, -.25], [.52, -1.0, -.12], [.6, -1.8, -.05], [.58, -2.8, -.02], [.56, -3.6, 0], [.55, -4.3, .05], [.55, -4.55, .45]];
      g.add(S(curveTube(siy, .055, mt(0xffb02e, { emissive: 0x3a2000 }), 80), 'Siyatik sinir (motor nöron aksonu)', 'Omurilikten çıkarak ayaktaki bir kasa ulaşan motor nöronun aksonu bir metreden uzundur. Aksonun boyu nöronun türüne göre milimetre ile metre ölçeği arasında değişebilir.', '1 metreden uzun', 'siy'));
      [[.6, -2.2, .2], [.58, -3.2, .25], [.55, -4.2, .45]].forEach(p => g.add(G(curveTube([[siy[Math.round((p[1] + .1) / -.6)] ? p[0] : p[0], p[1], 0], [p[0] + .12, p[1] - .2, p[2]]], .02, mt(0xffb02e), 6), 'siy')));
      const calf = S(at(new THREE.Mesh(egeo(.28, .7, .3), mt(0xd9534f, { transparent: true, opacity: .75, roughness: .5, emissive: 0x000000 })), .58, -3.15, -.12), 'Bacak kası (efektör)', 'Motor nöronla gelen uyartı kasa ulaşır ve kas kasılarak tepki oluşur. Kas tepki organıdır (efektör).', 'Tepki · kas kasılması', 'siy'); g.add(calf);
      const rec = S(instMesh(new THREE.SphereGeometry(.05, 8, 6), mt(0x5fe0ff, { emissive: 0x0a4a66 }), 6, (i, d) => d.position.set(.45 + (i % 3) * .08, -4.6, .45 + Math.floor(i / 3) * .12)), 'Deri reseptörleri (ayak tabanı)', 'Ayak tabanındaki deride bulunan reseptörler (ör. dokunma, ağrı) uyaranı algılayıp uyartıya dönüştürür.', 'Uyaran → uyartı', 'siy'); g.add(rec);
      /* vagus */
      const vag = [[.08, 3.7, -.2], [.18, 3.3, -.05], [.22, 2.6, .05], [.18, 2.0, .1], [.1, 1.3, .15], [-.05, .9, .2]];
      g.add(S(curveTube(vag, .045, mt(0x7de3a5, { emissive: 0x0a3a20 }), 60), 'Vagus siniri', 'Beyin sapından çıkarak göğüs ve karın bölgesine kadar uzanan vagus siniri, vücuttaki en uzun sinirlerden biridir. Kalp, akciğerler ve sindirim organlarına dallar verir.', 'En uzun sinirlerden', 'vag'));
      const heart = S(at(new THREE.Mesh(egeo(.26, .3, .22), mt(0xc8302c, { roughness: .4, emissive: 0x000000 })), -.12, 2.15, .2), 'Kalp', 'Vagus sinirinin dal verdiği organlardan biridir.', 'İç organ', 'vag'); g.add(heart);
      [-1, 1].forEach(s => g.add(S(at(ellip(.42, .7, .32, mt(0xf2a0b0, { transparent: true, opacity: .6, roughness: .5 })), s * .55, 2.3, 0), 'Akciğerler', 'Vagus siniri akciğerlere de dal verir.', 'İç organ', 'vag')));
      g.add(S(at(ellip(.42, .3, .28, mt(0xe8907a, { roughness: .5 })), -.2, 1.0, .15), 'Mide', 'Vagus sinirinin uzandığı karın organlarından biridir.', 'İç organ', 'vag'));
      g.add(S(new THREE.Mesh(new THREE.TorusKnotGeometry(.28, .08, 80, 10, 3, 4), mt(0xf0b090, { roughness: .5 })), 'Bağırsaklar', 'Vagus siniri karın bölgesindeki sindirim organlarına kadar uzanır.', 'İç organ', 'vag')); g.children[g.children.length - 1].position.set(0, .25, .15);
      [[.18, 2.0, .1, -.1, 2.15, .2], [.22, 2.6, .05, .5, 2.5, 0], [.22, 2.6, .05, -.5, 2.5, 0], [.1, 1.3, .15, -.2, 1.05, .15]].forEach(a => g.add(G(curveTube([[a[0], a[1], a[2]], [a[3], a[4], a[5]]], .02, mt(0x7de3a5), 6), 'vag')));
      label(g, '1 metreden uzun!', 2.3, -2.2, 0, .55); label(g, 'Vagus siniri', -1.9, 2.9, .4, .55); label(g, 'Siyatik sinir', 2.1, -1.2, 0, .5);
      /* cetvel */
      g.add(G(cylBetween([1.25, -.1, 0], [1.25, -4.55, 0], .02, mt(0xffffff)), 'siy')); [-.1, -4.55].forEach(y => g.add(G(cylBetween([1.12, y, 0], [1.38, y, 0], .02, mt(0xffffff)), 'siy')));
      /* uyartılar */
      const sens = new THREE.CatmullRomCurve3([V3(.5, -4.6, .45), ...siy.slice().reverse().map(p => V3(...p)), V3(0, .8, -.35), V3(0, 2.0, -.42), V3(0, 3.2, -.32), V3(0, 4.1, -.1)]);
      const mot = new THREE.CatmullRomCurve3([...siy.slice(0, 5).map(p => V3(...p)), V3(.58, -3.0, -.08)]);
      const vg = new THREE.CatmullRomCurve3(vag.map(p => V3(...p)));
      const p1 = glow(0x5fe0ff, .1), p2 = glow(0xff9f3b, .1), p3 = glow(0x9fffc0, .08); g.add(G(p1, 'imp'), G(p2, 'imp'), G(p3, 'imp'));
      ticks.push(t => { const T = 5, u = (t % T) / T; p1.visible = u < .5; if (u < .5) p1.position.copy(sens.getPointAt(u / .5)); brain.material.emissive.setRGB(u > .45 && u < .6 ? .5 : 0, u > .45 && u < .6 ? .35 : 0, 0); p2.visible = u > .55 && u < .9; if (p2.visible) p2.position.copy(mot.getPointAt((u - .55) / .35)); const c = u > .88 && u < .98 ? 1 : 0; calf.scale.set(1 + .15 * c, 1 - .12 * c, 1 + .15 * c); calf.material.emissive.setRGB(.3 * c, 0, 0); p3.position.copy(vg.getPointAt((t * .25) % 1)); heart.scale.setScalar(1 + .06 * Math.max(0, Math.sin(t * 7))); });
      return { g, sels, ticks };
    }
  };

  /* sıralama ve konu bağlantıları */
  if (typeof M3_ORDER !== 'undefined') ['hucregovdesi', 'miyelin', 'zarpot', 'sinirdemeti', 'sinapscesit', 'reseptorgaleri', 'hayvanduyu', 'aksonuzunluk'].forEach(k => { if (!M3_ORDER.includes(k)) M3_ORDER.push(k); });
})();
