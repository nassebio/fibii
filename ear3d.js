/* Nasse Biology — Kulak, Korti organı ve Denge organı 3B modelleri (ayrıntılı, prosedürel) */
(function () {
  const BONE = 0xe9dcb0, SKIN = 0xf0b9a0;
  const INFO = {
    kepce: 'Dış kulağın görünen, kıvrımlı kıkırdak yapılı bölümüdür. Ses dalgalarını toplar ve kulak yoluna yönlendirir.',
    kanal: 'Kulak kepçesinden kulak zarına uzanan kanaldır. Ses dalgalarını kulak zarına iletir.',
    zar: 'Dış kulak ile orta kulağı ayıran ince zardır. Ses dalgalarıyla titreşir. Mikrofondaki diyaframa benzer.',
    cekic: 'Orta kulaktaki üç kemikçiğin ilkidir; kulak zarına bağlıdır. Zarın titreşimini örse aktarır.',
    ors: 'Çekiç ile üzengi arasındaki kemikçiktir; titreşimi çekiçten alıp üzengiye iletir.',
    uzengi: 'Üç kemikçiğin sonuncusu ve en küçüğüdür. Titreşimi oval pencere aracılığıyla iç kulağa (salyangozun sıvısına) aktarır. Kemikçikler titreşimleri iç kulağa aktarır ve ses basıncının iletilmesine yardımcı olur.',
    ostaki: 'Orta kulağı yutağa (boğaza) bağlayan borudur. Orta kulak basıncının dış ortam basıncıyla dengelenmesini sağlar.',
    oval: 'Üzengi kemikçiğinin dayandığı zar kaplı açıklıktır; titreşimler buradan iç kulak sıvılarına geçer.',
    yuvarlak: 'İç kulak sıvılarındaki basınç değişimini dengeleyen zar kaplı açıklıktır.',
    koklea: 'İç kulakta, salyangoz kabuğuna benzeyen kıvrımlı yapıdır; işitmede görevlidir. İçindeki sıvı titreşimleri Korti organındaki reseptörlere ulaştırır.',
    korti: 'Salyangoz (koklea) içindeki işitme reseptörlerini (tüylü duyu hücreleri) içeren yapıdır. Titreşimlerin oluşturduğu hareketler tüylü hücreleri uyarır ve sinirsel mesajlar oluşur. Tüylü hücreler duyu epiteli yapısındaki mekanoreseptörlerdir.',
    yarim: 'İç kulakta birbirine dik düzlemlerde bulunan üç kanaldır. Başın dönme hareketlerinin algılanmasında görevlidir (denge).',
    tulum: 'İç kulaktaki denge organıdır. Yer çekimi, başın konumu ve doğrusal ivmelenme hakkında bilgi sağlar. Yüzeyindeki tüylü hücrelerin üstünde kalsiyum kristalleri (otolit) bulunur.',
    kesecik: 'Tulumcukla birlikte çalışan denge organıdır. Yer çekimi, başın konumu ve doğrusal ivmelenme bilgisi sağlar.',
    isitme: 'Salyangozda oluşan sinirsel mesajları (uyartıları) beyne taşıyan sinirdir.',
    denge: 'Yarım daire kanalları, tulumcuk ve keseciğin denge reseptörlerinden gelen mesajları beyne taşıyan sinirdir.',
    beyin: 'Kulaktan gelen sinirsel mesajları yorumlar: ses ve baş/vücut hareketleri burada algıya dönüşür.'
  };

  function canalPts(C, e1, e2, R, toV) {
    const gapA = Math.atan2(toV.dot(e2), toV.dot(e1)), gap = .55, pts = [], n = 54;
    for (let i = 0; i <= n; i++) { const th = gapA + gap / 2 + (2 * Math.PI - gap) * i / n; pts.push(C.clone().addScaledVector(e1, Math.cos(th) * R).addScaledVector(e2, Math.sin(th) * R)); }
    return pts;
  }
  /* Vestibüler aygıt (üç kanal + tulumcuk + kesecik). Vc: vestibül merkezi */
  function vestibular(ctx, Vc) {
    const { g, S, G } = ctx, api = { canals: [], Vc };
    const fluid = glass(0x7fe8c0, .35);
    const dirs = [
      { n: 'yatay', e1: V3(1, 0, 0), e2: V3(0, 0, 1), off: V3(.52, .32, 0), col: 0x35c58a },
      { n: 'ön', e1: V3(1, 0, 0), e2: V3(0, 1, 0), off: V3(.3, .72, .2), col: 0x3fa9f5 },
      { n: 'arka', e1: V3(0, 1, 0), e2: V3(0, 0, 1), off: V3(.12, .62, -.62), col: 0xe0a53a }
    ];
    dirs.forEach(d => {
      const C = Vc.clone().add(d.off), R = .62, toV = Vc.clone().sub(C).normalize();
      const pts = canalPts(C, d.e1, d.e2, R, toV);
      const tube = S(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 90, .075, 10, false), glass(d.col, .5)), 'Yarım daire kanalları', INFO.yarim, 'Mekanoreseptör · denge (dönme)', 'denge');
      g.add(tube);
      const amp = S(new THREE.Mesh(new THREE.SphereGeometry(.13, 16, 14), glass(d.col, .6)), 'Yarım daire kanalları', INFO.yarim, 'Mekanoreseptör · denge (dönme)', 'denge');
      amp.position.copy(pts[0]); g.add(amp);
      const cup = G(new THREE.Mesh(new THREE.ConeGeometry(.1, .2, 10), mt(0xffffff, { transparent: true, opacity: .75 })), 'denge');
      cup.position.copy(pts[0]); g.add(cup);
      const n = pts[1].clone().sub(pts[0]).normalize(); cup.quaternion.setFromUnitVectors(V3(0, 1, 0), n);
      const nrm = new THREE.Vector3().crossVectors(d.e1, d.e2).normalize();
      api.canals.push({ name: d.n, normal: nrm, cup, amp, base: cup.quaternion.clone(), axisBend: new THREE.Vector3().crossVectors(n, nrm).normalize(), pts, mat: amp.material });
    });
    const ut = S(ellip(.4, .2, .3, mt(0x35c58a, { transparent: true, opacity: .75 }), 22), 'Tulumcuk', INFO.tulum, 'Mekanoreseptör · denge (doğrusal hareket)', 'denge');
    at(ut, Vc.x + .1, Vc.y + .22, 0); g.add(ut);
    const ks = S(ellip(.2, .34, .22, mt(0x2fbf9b, { transparent: true, opacity: .75 }), 22), 'Kesecik', INFO.kesecik, 'Mekanoreseptör · denge (doğrusal hareket)', 'denge');
    at(ks, Vc.x - .05, Vc.y - .3, .05); g.add(ks);
    const rr = srand(3);
    const oto = (cx, cy, cz, ax) => instMesh(new THREE.OctahedronGeometry(.035), mt(0xffffff, { emissive: 0x444444 }), 26, (i, d) => { d.position.set(cx + (rr() - .5) * .42 * (ax === 'x' ? 1 : .2), cy + (ax === 'x' ? .0 : (rr() - .5) * .45), cz + (rr() - .5) * .3); d.rotation.set(rr() * 3, rr() * 3, rr() * 3); });
    const ou = oto(ut.position.x, ut.position.y + .09, 0, 'x'), ok = oto(ks.position.x + .1, ks.position.y, ks.position.z, 'y');
    G(ou, 'denge'); G(ok, 'denge'); g.add(ou, ok); api.otoU = ou; api.otoK = ok; api.ut = ut; api.ks = ks;
    return api;
  }

  /* ---------- Gerçekçi kulak kepçesi (prosedürel heykel) ---------- */
  const sm = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const ga = (d, w) => Math.exp(-(d / w) * (d / w));
  const segD = (px, py, ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy))); return Math.hypot(px - ax - t * dx, py - ay - t * dy); };
  const polyD = (px, py, P) => { let m = 9; for (let i = 0; i < P.length - 1; i++) m = Math.min(m, segD(px, py, P[i][0], P[i][1], P[i + 1][0], P[i + 1][1])); return m; };
  function pinnaGeo() {
    /* yerel koordinat: u = öne(+)/arkaya(−), v = yukarı, h = kafadan dışa doğru yükseklik */
    const OUT = [[.55, .95], [.47, 1.33], [.24, 1.6], [-.15, 1.72], [-.55, 1.62], [-.86, 1.3], [-1.02, .82], [-1.07, .25], [-1.0, -.28], [-.86, -.72], [-.68, -1.1], [-.52, -1.42], [-.32, -1.66], [-.04, -1.74], [.18, -1.63], [.27, -1.38], [.3, -1.08], [.4, -.8], [.55, -.55], [.66, -.2], [.66, .18], [.6, .55]];
    const curve = new THREE.CatmullRomCurve3(OUT.map(p => V3(p[0], p[1], 0)), true, 'centripetal');
    const NS = 160, NR = 40, E = curve.getSpacedPoints(NS), C = V3(-.18, .02, 0);
    const AH = [[-.08, -.86], [-.42, -.5], [-.6, -.05], [-.6, .42], [-.5, .66]], SC = [[-.5, .66], [-.45, 1.0], [-.3, 1.3]], IC = [[-.5, .66], [-.2, .74], [.2, .86]], CR = [[.58, .62], [.25, .42], [-.08, .33]];
    /* sarmal kenar (heliks) ağırlığı */
    const w0 = E.map(p => (p.y > -.95 && !(p.x > .35 && p.y < .85)) ? 1 : 0), wH = w0.map((_, i) => { let s = 0; for (let k = -8; k <= 8; k++) s += w0[(i + k + NS * 2) % NS]; return s / 17; });
    const base = u => .05 + .5 * sm(.6, -1.1, u);
    const H = (u, v, e, w) => {
      let h = base(u);
      h += w * (.17 * ga(e - .1, .075) - .08 * ga(e - .27, .08));
      h += .16 * ga(polyD(u, v, AH), .12) + .14 * ga(polyD(u, v, SC), .1) + .12 * ga(polyD(u, v, IC), .08);
      h -= .06 * ga(Math.hypot(u + .17, v - .98), .16);
      const dc = Math.hypot((u - .05) / .42, (v + .2) / .5), dy = Math.hypot((u + .08) / .36, (v - .5) / .17);
      h -= .44 * (dc < 1.15 ? .5 * (1 + Math.cos(Math.PI * dc / 1.15)) : 0) + .22 * (dy < 1.15 ? .5 * (1 + Math.cos(Math.PI * dy / 1.15)) : 0);
      h += .15 * ga(polyD(u, v, CR), .075);
      h += .2 * Math.exp(-(((u - .55) / .13) ** 2 + ((v + .1) / .22) ** 2)) + .15 * Math.exp(-((u / .17) ** 2 + ((v + .78) / .12) ** 2)) - .05 * Math.exp(-(((u - .3) / .1) ** 2 + ((v + .6) / .1) ** 2));
      h -= .28 * ga(Math.hypot(u - .27, v + .18), .12);
      h += .07 * sm(-.95, -1.35, v);
      return h;
    };
    const T = (v, e, w) => .06 + .08 * w * ga(e - .1, .1) + .16 * sm(-.95, -1.4, v);
    const pos = [], col = [], idx = [], skin = new THREE.Color(0xd8907a), deep = new THREE.Color(0x9c4747), lite = new THREE.Color(0xe7a68f), tmp = new THREE.Color();
    const push = (x, y, z, c) => { pos.push(x, y, z); col.push(c.r, c.g, c.b); return pos.length / 3 - 1; };
    const grid = (back) => {
      const start = pos.length / 3;
      for (let i = 0; i <= NS; i++) {
        const P = E[i % NS], L = P.clone().sub(C).length(), w = wH[i % NS];
        for (let k = 0; k <= NR; k++) {
          const r = 1 - Math.pow(1 - k / NR, 1.8), u = C.x + (P.x - C.x) * r, v = C.y + (P.y - C.y) * r, e = (1 - r) * L;
          const h = H(u, v, e, w), t = T(v, e, w);
          if (!back) { tmp.copy(skin).lerp(deep, Math.max(0, Math.min(1, (base(u) - h) * 1.7))); if (h - base(u) > .08) tmp.lerp(lite, Math.min(1, (h - base(u) - .08) * 3)); push(-h, v, u, tmp); }
          else { const hs = base(u) + w * .17 * ga(e - .1, .075); push(-Math.min(h - t, (h - t) * .5 + (hs - t) * .5), v, u, lite); }
        }
      }
      for (let i = 0; i < NS; i++) for (let k = 0; k < NR; k++) { const a = start + i * (NR + 1) + k, b = a + NR + 1; if (!back) idx.push(a, b, a + 1, a + 1, b, b + 1); else idx.push(a, a + 1, b, a + 1, b + 1, b); }
    };
    grid(false); grid(true);
    /* yuvarlak kenar şeridi */
    const RS = 6, st = pos.length / 3;
    for (let i = 0; i <= NS; i++) {
      const P = E[i % NS], w = wH[i % NS], n = P.clone().sub(C).setZ(0).normalize(), h = H(P.x, P.y, 0, w), t = T(P.y, 0, w), hs = base(P.x) + w * .17 * ga(-.1, .075), hb = Math.min(h - t, (h - t) * .5 + (hs - t) * .5);
      for (let k = 0; k <= RS; k++) { const th = Math.PI * k / RS, hh = h + (hb - h) * (1 - Math.cos(th)) / 2, o = (h - hb) * .5 * Math.sin(th); push(-hh, P.y + n.y * o, P.x + n.x * o, k < RS / 2 ? skin : lite); }
    }
    for (let i = 0; i < NS; i++) for (let k = 0; k < RS; k++) { const a = st + i * (RS + 1) + k, b = a + RS + 1; idx.push(a, a + 1, b, a + 1, b + 1, b); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); geo.setIndex(idx); geo.computeVertexNormals();
    return { geo, pit: V3(-H(.27, -.18, .5, 0), -.18, .27) };
  }
  /* Kemik kesit yüzeyi dokusu */
  function boneTex(X0, X1, Y0, Y1) {
    const W = 1024, Hh = Math.round(1024 * (Y1 - Y0) / (X1 - X0)), r = srand(77);
    const P = (x, y) => [(x - X0) / (X1 - X0) * W, (Y1 - y) / (Y1 - Y0) * Hh], K = W / (X1 - X0);
    return canvasTex(W, Hh, (c) => {
      c.fillStyle = '#d3c19e'; c.fillRect(0, 0, W, Hh);
      for (let i = 0; i < 2600; i++) { const x = r() * W, y = r() * Hh, s = 2 + r() * 9; c.fillStyle = r() < .6 ? 'rgba(122,98,66,.5)' : 'rgba(236,224,198,.7)'; c.beginPath(); c.ellipse(x, y, s, s * (.5 + r() * .6), r() * 3, 0, 7); c.fill(); }
      const blob = (x, y, rx, ry, fill, blur) => { const [px, py] = P(x, y); c.save(); c.filter = 'blur(' + (blur || 0) + 'px)'; c.fillStyle = fill; c.beginPath(); c.ellipse(px, py, rx * K, ry * K, 0, 0, 7); c.fill(); c.restore(); };
      /* iç kulak çevresindeki sert (yoğun) kemik */
      blob(3.2, -.6, 1.9, 2.4, 'rgba(232,214,176,.95)', 14);
      /* iç kulak yolu (sinir kanalı) */
      c.save(); c.strokeStyle = '#d4b282'; c.lineCap = 'round'; c.lineWidth = .55 * K; c.beginPath(); let p = P(3.7, -.5); c.moveTo(p[0], p[1]); p = P(5.2, .1); c.lineTo(p[0], p[1]); p = P(6.6, .25); c.lineTo(p[0], p[1]); c.stroke(); c.restore();
      /* orta kulak boşluğu */
      { const [px, py] = P(1.05, .1), gr = c.createRadialGradient(px, py, 4, px, py, 1.25 * K); gr.addColorStop(0, '#c0474a'); gr.addColorStop(.75, '#8e2a2e'); gr.addColorStop(1, 'rgba(120,30,30,0)'); c.fillStyle = gr; c.beginPath(); c.ellipse(px, py, 1.25 * K, 1.08 * K, 0, 0, 7); c.fill(); }
      /* östaki kanalı */
      c.save(); c.strokeStyle = 'rgba(176,72,70,.9)'; c.lineCap = 'round'; c.lineWidth = .38 * K; c.beginPath(); p = P(1.1, -.6); c.moveTo(p[0], p[1]); [[1.55, -1.7], [2.0, -2.6], [2.5, -3.4], [2.8, -4.4]].forEach(q => { p = P(q[0], q[1]); c.lineTo(p[0], p[1]); }); c.stroke(); c.restore();
      /* dış kulak yolu tüneli */
      c.save(); c.strokeStyle = 'rgba(150,84,70,.55)'; c.lineCap = 'round'; c.lineWidth = .4 * K; c.beginPath(); p = P(-2.95, -.2); c.moveTo(p[0], p[1]); p = P(-1.2, -.08); c.lineTo(p[0], p[1]); p = P(0, 0); c.lineTo(p[0], p[1]); c.stroke(); c.restore();
      /* sol kenar: deri + yağ */
      let q = P(-2.95, 0)[0]; c.fillStyle = '#e8a68e'; c.fillRect(0, 0, q + .1 * K, Hh); c.fillStyle = '#f2d28a'; c.fillRect(q + .1 * K, 0, .14 * K, Hh);
      c.strokeStyle = 'rgba(120,90,50,.35)'; c.lineWidth = 3; c.strokeRect(1, 1, W - 2, Hh - 2);
    });
  }
  function nerveStrands(pts, r, n, S, name, info, tag, grp, mat) {
    const c = new THREE.CatmullRomCurve3(pts.map(p => Array.isArray(p) ? V3(...p) : p)), N = 50, out = [];
    for (let k = 0; k < n; k++) {
      const ph = k / n * 6.283, P = [];
      for (let i = 0; i <= N; i++) { const u = i / N, p = c.getPointAt(u), tg = c.getTangentAt(u), a = Math.abs(tg.y) > .9 ? V3(1, 0, 0) : V3(0, 1, 0), n1 = new THREE.Vector3().crossVectors(tg, a).normalize(), n2 = new THREE.Vector3().crossVectors(tg, n1), ang = ph + u * 4, rr = r * (.7 + .3 * Math.sin(u * 9 + k)); P.push(p.clone().addScaledVector(n1, Math.cos(ang) * rr).addScaledVector(n2, Math.sin(ang) * rr)); }
      out.push(S(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P), N, r * .42, 6, false), mat), name, info, tag, grp));
    }
    return out;
  }

  /* ============ KULAK ============ */
  M3.kulak = {
    title: 'Kulak', ico: '👂', tag: 'Mekanoreseptör · Duyu epiteli', cam: [-7.6, 3.2, 10.2], target: [1.6, -.4, 0], labScale: .8,
    clip: { axis: 'z', min: -1.4, max: 1.4, def: 0, on: false, flip: true },
    layers: [['Dış kulak (kepçe · kanal · zar)', 'dis'], ['Orta kulak (kemikçikler · östaki)', 'orta'], ['İç kulak: işitme (salyangoz)', 'ic'], ['İç kulak: denge', 'denge'], ['Sinirler ve beyin', 'sinir'], ['Kafatası kemiği (kesit)', 'kemik'], ['Ses dalgaları', 'ses']],
    task: 'Ses dalgalarının soldan sağa yolunu izle: kulak kepçesi → kulak yolu → kulak zarı → çekiç-örs-üzengi → salyangoz. “Kesit” düğmesiyle kulağı aç. Salyangozdaki işitme reseptörlerini (Korti organı) ve dengeyle ilgili yarım daire kanallarını bul. Sesin elektrik sinyaline hangi bölümde dönüştüğünü yaz.',
    q: { q: 'Kulaktaki tüylü duyu hücreleri hangi reseptör çeşidine ve hangi yapıya örnektir?', o: ['Fotoreseptör – nöron', 'Mekanoreseptör – duyu epiteli', 'Kemoreseptör – nöron', 'Termoreseptör – duyu epiteli'], a: 1, e: 'Kulak mekanoreseptörleri (tüylü duyu hücreleri) duyu epiteli yapısındadır; ses ve dengeyle ilişkili mekanik uyaranları algılar.' },
    build() {
      const { g, sels, ticks, S, G } = B(), api = { amp: .02, freq: 1.6 };
      const XH = -3.05;
      /* — DIŞ KULAK: gerçekçi kulak kepçesi — */
      const pg = pinnaGeo(), piv = new THREE.Group(); piv.position.set(XH, -.2, 0); piv.rotation.x = -.2; piv.scale.setScalar(1.45); g.add(piv);
      const pin = S(new THREE.Mesh(pg.geo, mt(0xffffff, { vertexColors: true, roughness: .62, side: THREE.DoubleSide })), 'Kulak kepçesi', INFO.kepce, 'Dış kulak · ses dalgalarını toplar', 'dis');
      pin.position.set(0, .18, -.27); piv.add(pin);
      const pitW = pg.pit.clone().add(V3(0, .18, -.27)); piv.updateMatrixWorld(true); piv.localToWorld(pitW);
      /* kulak yolu: girişte dar, içeride geniş; deri ile kaplı */
      const cpts = [V3(pitW.x - .02, pitW.y, pitW.z), V3(-1.9, -.13, .07), V3(-1.0, -.05, -.04), V3(-.06, 0, 0)], ccur = new THREE.CatmullRomCurve3(cpts);
      const cgeo = new THREE.TubeGeometry(ccur, 60, 1, 18, false); { const p = cgeo.attributes.position; for (let i = 0; i <= 60; i++) { const u = i / 60, P = ccur.getPointAt(u), rad = .2 + .1 * sm(0, .3, u); for (let j = 0; j <= 18; j++) { const id = i * 19 + j, v = V3(p.getX(id), p.getY(id), p.getZ(id)).sub(P).multiplyScalar(rad).add(P); p.setXYZ(id, v.x, v.y, v.z); } } cgeo.computeVertexNormals(); }
      const canal = S(new THREE.Mesh(cgeo, mt(0xc27466, { transparent: true, opacity: .5, depthWrite: false, side: THREE.DoubleSide, roughness: .6 })), 'Dış kulak yolu', INFO.kanal, 'Dış kulak · ses dalgalarını iletir', 'dis'); canal.userData.low = true; g.add(canal);
      { const hole = G(new THREE.Mesh(new THREE.CircleGeometry(.15, 24), mt(0x3a1414, { roughness: 1 })), 'dis'); hole.position.copy(pitW).add(V3(-.03, 0, 0)); hole.lookAt(pitW.clone().add(V3(-1, 0, 0))); g.add(hole); }
      const kik = S(ellip(.36, .26, .3, mt(0xcfe6f2, { roughness: .35, transparent: true, opacity: .92 }), 22), 'Kıkırdak', 'Kulak kepçesine ve dış kulak yolunun dış bölümüne şekil veren esnek destek dokusudur. Kulak yolunun iç bölümü ise kafatası kemiği içinden geçer.', 'Dış kulak · destek', 'dis'); at(kik, -2.15, -.6, .05); kik.rotation.z = .3; g.add(kik);
      const drum = S(new THREE.Mesh(new THREE.ConeGeometry(.58, .16, 40, 1, true).rotateZ(-Math.PI / 2), mt(0xece6dc, { transparent: true, opacity: .86, side: THREE.DoubleSide, emissive: 0x1d1a14, roughness: .3 })), 'Kulak zarı', INFO.zar, 'Ses dalgalarıyla titreşir', 'dis');
      g.add(drum); g.add(G(new THREE.Mesh(new THREE.TorusGeometry(.58, .035, 8, 40).rotateY(Math.PI / 2), mt(0xd8c8b0)), 'dis'));
      /* — ORTA KULAK — */
      const mid = S(ellip(1.15, 1.0, .85, glass(0xff9fa8, .16), 28), 'Orta kulak boşluğu', 'Kulak zarının arkasındaki hava dolu boşluktur; kemikçikleri (çekiç, örs, üzengi) barındırır. Östaki borusuyla yutağa açılır.', 'Orta kulak', 'orta');
      mid.userData.low = true; at(mid, 1.05, .1, 0); g.add(mid);
      const P0 = V3(.7, .3, 0), oss = new THREE.Group(); g.add(oss); api.oss = oss; oss.position.copy(P0);
      const bm = mt(0xeedcae, { roughness: .4 }), L = a => V3(a[0], a[1], a[2] || 0).sub(P0);
      const add = (m, n, inf) => { oss.add(S(m, n, inf, 'Orta kulak · kemikçik', 'orta')); return m; };
      const tap = (a, b, r0, r1) => cylBetween(L(a), L(b), r0, bm, 12, r1);
      /* çekiç */
      add(tap([.1, -.02], [.24, .5], .028, .05), 'Çekiç', INFO.cekic); add(at(new THREE.Mesh(new THREE.SphereGeometry(.05, 10, 8), bm), ...L([.15, .42]).toArray()), 'Çekiç', INFO.cekic);
      add(tap([.24, .5], [.38, .68], .06, .07), 'Çekiç', INFO.cekic);
      const mH = add(at(ellip(.15, .19, .14, bm, 18), ...L([.44, .79]).toArray()), 'Çekiç', INFO.cekic); mH.rotation.z = -.3;
      add(tap([.38, .62, 0], [.28, .62, -.22], .025, .012), 'Çekiç', INFO.cekic);
      /* örs */
      const iB = add(at(ellip(.17, .2, .14, bm, 18), ...L([.66, .8]).toArray()), 'Örs', INFO.ors); iB.rotation.z = .25;
      add(tap([.72, .88], [.98, .98], .06, .02), 'Örs', INFO.ors);
      add(tap([.7, .66], [.86, .06], .055, .035), 'Örs', INFO.ors); add(tap([.86, .06], [.98, -.03], .035, .03), 'Örs', INFO.ors);
      add(at(new THREE.Mesh(new THREE.SphereGeometry(.045, 10, 8), bm), ...L([.99, -.04]).toArray()), 'Örs', INFO.ors);
      /* üzengi */
      add(at(new THREE.Mesh(new THREE.SphereGeometry(.055, 12, 10), bm), ...L([1.07, -.05]).toArray()), 'Üzengi', INFO.uzengi);
      add(tap([1.07, -.05], [1.2, -.06], .04, .035), 'Üzengi', INFO.uzengi);
      [-1, 1].forEach(s => add(curveTube([L([1.2, -.06, 0]), L([1.42, -.07, .16 * s]), L([1.68, -.08, .19 * s]), L([1.9, -.08, .13 * s])], .024, bm, 24), 'Üzengi', INFO.uzengi));
      add(at(ellip(.03, .085, .17, bm, 14), ...L([1.92, -.08]).toArray()), 'Üzengi', INFO.uzengi);
      ticks.push(t => { const a = api.amp, w = api.freq * 6.283; drum.position.x = Math.sin(t * w) * a * .9; oss.rotation.z = Math.sin(t * w) * a * 1.1; });
      /* östaki borusu */
      const ost = S(curveTube([[1.1, -.75, .1], [1.55, -1.7, .6], [2.0, -2.6, 1.3], [2.5, -3.3, 2.1]], .15, mt(0xd9726f, { transparent: true, opacity: .75, roughness: .55 }), 30), 'Östaki borusu', INFO.ostaki, 'Basıncı dengeler', 'orta'); g.add(ost);
      const ostE = G(at(new THREE.Mesh(new THREE.ConeGeometry(.3, .35, 16, 1, true), mt(0xd9726f, { transparent: true, opacity: .7, side: THREE.DoubleSide })), 2.62, -3.5, 2.3), 'orta'); ostE.rotation.set(-1.0, 0, -.45); g.add(ostE);
      /* — İÇ KULAK — */
      const Vc = V3(2.55, .0, 0);
      const ves = vestibular({ g, S, G }, Vc); api.ves = ves;
      const vest = S(ellip(.62, .52, .5, glass(0x8cc4f2, .3), 24), 'Vestibül (iç kulak girişi)', 'İç kulakta salyangoz ile yarım daire kanalları arasındaki bölümdür; tulumcuk ve kesecik bu bölümdedir.', 'İç kulak', 'denge'); vest.userData.low = true; at(vest, Vc.x, Vc.y, 0); g.add(vest);
      const oval = S(at(new THREE.Mesh(new THREE.CircleGeometry(.14, 20).rotateY(-Math.PI / 2), mt(0xf3e9d2, { side: THREE.DoubleSide })), 1.98, -.08, 0), 'Oval pencere', INFO.oval, 'Orta kulaktan iç kulağa geçiş', 'ic'); g.add(oval);
      /* salyangoz */
      const N = 160, cp = []; for (let i = 0; i <= N; i++) { const u = i / N, th = u * 2.75 * Math.PI * 2 + Math.PI / 2, r = 1.05 - .72 * u; cp.push(V3(3.3 + Math.cos(th) * r, -1.7 + Math.sin(th) * r, -.5 + u * 1.1)); }
      const cc = new THREE.CatmullRomCurve3(cp); api.cochCurve = cc;
      const cg = new THREE.TubeGeometry(cc, 200, .28, 16, false); { const pos = cg.attributes.position, seg = 200, rad = 17; for (let i = 0; i <= seg; i++) { const P = cc.getPointAt(i / seg), k = 1 - .55 * (i / seg); for (let j = 0; j < rad; j++) { const id = i * rad + j; const v = V3(pos.getX(id), pos.getY(id), pos.getZ(id)); v.sub(P).multiplyScalar(k).add(P); pos.setXYZ(id, v.x, v.y, v.z); } } cg.computeVertexNormals(); }
      const cochM = S(new THREE.Mesh(cg, mt(0x67aee8, { transparent: true, opacity: .55, depthWrite: false, roughness: .25, metalness: .05, side: THREE.DoubleSide })), 'Salyangoz (koklea)', INFO.koklea, 'İç kulak · işitme', 'ic'); g.add(cochM);
      { const gp = []; for (let i = 0; i <= 200; i++) { const u = i / 200, P = cc.getPointAt(u), d = V3(P.x - 3.3, P.y + 1.7, 0).normalize(), rad = .28 * (1 - .55 * u); gp.push(P.clone().addScaledVector(d, rad * .96).add(V3(0, 0, rad * .25))); } g.add(G(curveTube(gp, .022, mt(0x2e6fb4, { roughness: .4 }), 300), 'ic')); }
      const cdPts = []; for (let i = 0; i <= N; i += 2) cdPts.push(cp[i]); const duct = G(curveTube(cdPts, .06, mt(0xffd34d, { emissive: 0x332600 }), 160), 'ic'); g.add(duct);
      const M = 70; const hair = S(instMesh(new THREE.SphereGeometry(.055, 10, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .4 }), M, (i, d) => { const P = cc.getPointAt((i + .5) / M); d.position.copy(P); }), 'Korti organı (işitme reseptörleri)', INFO.korti, 'Mekanoreseptör · duyu epiteli (tüylü hücreler)', 'ic');
      const col = new THREE.Color(); for (let i = 0; i < M; i++) { col.setHSL(.55 - .5 * (i / M), .8, .55); hair.setColorAt(i, col); } hair.instanceColor.needsUpdate = true; g.add(hair);
      api.hair = hair; api.hairN = M;
      api.setHair = (fn) => { const c = new THREE.Color(); for (let i = 0; i < M; i++) { const a = fn(i / (M - 1)); c.setHSL(.6 - .55 * (i / (M - 1)), .8, .22 + .55 * a); c.lerp(new THREE.Color(0xffffff), a * .6); hair.setColorAt(i, c); } hair.instanceColor.needsUpdate = true; };
      const rnd = S(at(new THREE.Mesh(new THREE.CircleGeometry(.1, 16), mt(0xf3e9d2, { side: THREE.DoubleSide })), 2.78, -.78, .3), 'Yuvarlak pencere', INFO.yuvarlak, 'İç kulak sıvı basıncını dengeler', 'ic'); rnd.rotation.y = .4; g.add(rnd);
      /* sinirler (lif demetleri) */
      const nm = mt(0xf3c84b, { emissive: 0x2b2100, roughness: .45 }), nm2 = mt(0xe9b83a, { emissive: 0x241a00, roughness: .5 });
      const cnP = [[3.3, -1.7, .45], [3.9, -1.1, .3], [4.6, -.3, .1], [5.3, .25, 0]], vnP = [[Vc.x + .3, Vc.y + .3, 0], [3.9, .75, 0], [4.7, .55, 0], [5.3, .25, 0]], trP = [[5.3, .25, 0], [6.4, .25, 0], [7.2, .25, 0]];
      const cn = S(curveTube(cnP, .08, nm, 30), 'İşitme siniri', INFO.isitme, 'Uyartıyı beyne iletir', 'sinir'); g.add(cn);
      nerveStrands(cnP, .09, 6, S, 'İşitme siniri', INFO.isitme, 'Uyartıyı beyne iletir', 'sinir', nm2).forEach(m => g.add(m));
      const vn = S(curveTube(vnP, .06, mt(0xf6d873, { emissive: 0x2b2100 }), 30), 'Denge siniri', INFO.denge, 'Denge bilgisini beyne iletir', 'sinir'); g.add(vn);
      nerveStrands(vnP, .07, 5, S, 'Denge siniri', INFO.denge, 'Denge bilgisini beyne iletir', 'sinir', mt(0xf6d873, { emissive: 0x2b2100 })).forEach(m => g.add(m));
      const tr = S(curveTube(trP, .14, nm, 24), 'İşitme ve denge siniri (kulak siniri)', 'İşitme ve denge sinirlerinin birleşerek beyne uzandığı sinir demetidir.', 'Uyartıyı beyne iletir', 'sinir'); g.add(tr);
      nerveStrands(trP, .15, 8, S, 'İşitme ve denge siniri (kulak siniri)', 'İşitme ve denge sinirlerinin birleşerek beyne uzandığı sinir demetidir.', 'Uyartıyı beyne iletir', 'sinir', nm2).forEach(m => g.add(m));
      const br = S(new THREE.Mesh(new THREE.SphereGeometry(1.1, 48, 36), mt(0xe9a9b8, { roughness: .8 })), 'Beyin (işitme ve denge merkezi)', INFO.beyin, 'Algının oluştuğu yer', 'sinir');
      { const p = br.geometry.attributes.position; for (let i = 0; i < p.count; i++) { const v = V3(p.getX(i), p.getY(i), p.getZ(i)); const f = 1 + .07 * Math.sin(v.x * 7) * Math.sin(v.y * 6) * Math.sin(v.z * 8); v.multiplyScalar(f); p.setXYZ(i, v.x, v.y, v.z); } br.geometry.computeVertexNormals(); }
      br.scale.set(.85, 1, .95); at(br, 8.2, .6, 0); br.userData.low = true; g.add(br);
      { const f = pathFollower(0xffffff, .1, [[3.3, -1.7, .45], [3.9, -1.1, .3], [4.6, -.3, .1], [5.3, .25, 0], [7.2, .25, 0]], .22, 0); g.add(G(f.orb, 'sinir')); ticks.push(t => f.tick(t)); }
      /* — KAFATASI KEMİĞİ (kesit): arka plan — */
      const X0 = -2.95, X1 = 6.6, Y0 = -4.4, Y1 = 3.0, ZF = -1.35;
      const face = S(new THREE.Mesh(new THREE.PlaneGeometry(X1 - X0, Y1 - Y0), mt(0xffffff, { map: boneTex(X0, X1, Y0, Y1), roughness: .9 })), 'Kafatası kemiği (şakak kemiği)', 'Orta kulak ve iç kulak, kafatasının şakak kemiği içinde korunur. İç kulağı saran kemik çok serttir; dış kulak yolunun iç bölümü de bu kemiğin içinden geçer.', 'Koruma · kesit yüzeyi', 'kemik');
      face.userData.low = true; at(face, (X0 + X1) / 2, (Y0 + Y1) / 2, ZF); g.add(face);
      const blk = G(at(new THREE.Mesh(new THREE.BoxGeometry(X1 - X0, Y1 - Y0, 1.2), mt(0xdcc89c, { roughness: .9 })), (X0 + X1) / 2, (Y0 + Y1) / 2, ZF - .601), 'kemik'); g.add(blk);
      const skinW = G(at(new THREE.Mesh(new THREE.BoxGeometry(.12, Y1 - Y0, 1.22), mt(0xeaa58c, { roughness: .7 })), X0 - .06, (Y0 + Y1) / 2, ZF - .6), 'kemik'); g.add(skinW);
      /* ses dalgaları */
      const rings = []; for (let i = 0; i < 6; i++) { const r = G(new THREE.Mesh(new THREE.TorusGeometry(.9, .03, 8, 40).rotateY(Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x4fb3ff, transparent: true })), 'ses'); g.add(r); rings.push(r); }
      ticks.push(t => rings.forEach((r, i) => { const u = (t * .2 + i / 6) % 1, x = -7.5 + u * 7.3; r.position.set(x, -.1, 0); r.scale.setScalar(x < -3.4 ? .6 + u * .9 : .3); r.material.opacity = .9 * (1 - u * .6); }));
      return { g, sels, ticks, api };
    }
  };

  /* ============ KORTİ ORGANI (koklea kesiti) ============ */
  M3.korti = {
    title: 'Korti Organı (ayrıntı)', ico: '🎼', tag: 'Mekanoreseptör · Duyu epiteli', cam: [3.2, 3.4, 8.2], target: [0, .2, 0], labScale: .8,
    layers: [['Tüylü hücreler ve tüycükler', 'hc'], ['Zarlar (taban · örtü)', 'mem'], ['Sinir lifleri ve ganglion', 'sin'], ['Koklea sıvıları', 'fl']],
    task: 'Taban zarının (bazilar membran) üstündeki iç ve dış tüylü hücreleri bul. Titreşim dalgası ilerlerken tüylü hücrelerin tüycüklerinin örtü zarına nasıl değdiğini ve eğildiğini izle. Hangi yapı sinirsel mesajı beyne taşır?',
    q: { q: 'Salyangoz içindeki işitme reseptörlerini (tüylü duyu hücreleri) barındıran yapı hangisidir?', o: ['Yarım daire kanalları', 'Korti organı', 'Östaki borusu', 'Kulak zarı'], a: 1, e: 'Korti organı koklea içinde bulunur ve işitme reseptörlerini (tüylü hücreler) içerir. Titreşimlerin oluşturduğu hareketler tüylü hücreleri uyarır.' },
    build() {
      const { g, sels, ticks, S, G } = B(), api = { amp: .12, peak: .2, speed: 3 };
      const LZ = 3.4, NZ = 12, zs = []; for (let i = 0; i < NZ; i++) zs.push(-LZ / 2 + .2 + i * (LZ - .4) / (NZ - 1));
      /* sıvı odacıkları */
      const tube = S(new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, LZ, 40, 1, true).rotateX(Math.PI / 2), glass(0x9ec3ff, .13)), 'Koklea kanalı (kemik duvar)', 'Salyangozun kemik duvarlı, sıvı dolu kanalıdır. İçi taban zarı ve Reissner zarı ile üç sıvı odacığa ayrılır.', 'İç kulak', 'fl'); tube.userData.low = true; g.add(tube);
      const sv = S(new THREE.Mesh(new THREE.BoxGeometry(2.9, .95, LZ - .1), glass(0x6fa8ff, .22)), 'Üst sıvı odacığı (skala vestibüli)', 'Oval pencereden gelen titreşimlerin ilk geçtiği, sıvı dolu üst odacıktır.', 'Titreşim iletimi', 'fl'); sv.userData.low = true; at(sv, .15, 1.1, 0); g.add(sv);
      const sm = S(new THREE.Mesh(new THREE.BoxGeometry(2.7, .75, LZ - .1), glass(0xffe08a, .28)), 'Orta sıvı odacığı (koklea kanalı)', 'Korti organının bulunduğu odacıktır; taban zarı ile Reissner zarı arasındadır.', 'Korti organını içerir', 'fl'); sm.userData.low = true; at(sm, .1, .25, 0); g.add(sm);
      const st = S(new THREE.Mesh(new THREE.BoxGeometry(2.9, .95, LZ - .1), glass(0x6fa8ff, .22)), 'Alt sıvı odacığı (skala timpani)', 'Titreşimlerin yuvarlak pencereye doğru döndüğü, sıvı dolu alt odacıktır.', 'Titreşim iletimi', 'fl'); st.userData.low = true; at(st, .15, -1.05, 0); g.add(st);
      const reis = S(new THREE.Mesh(new THREE.PlaneGeometry(2.7, LZ - .1).rotateX(-Math.PI / 2), mt(0xcfe3ff, { transparent: true, opacity: .5, side: THREE.DoubleSide })), 'Reissner zarı', 'Üst ve orta sıvı odacıklarını ayıran çok ince zardır.', 'Odacık ayırıcı', 'mem'); at(reis, .1, .62, 0); g.add(reis);
      /* taban zarı (dalgalanır) */
      const bg = new THREE.PlaneGeometry(2.4, LZ - .1, 6, 70).rotateX(-Math.PI / 2), bpos = bg.attributes.position, by = new Float32Array(bpos.count); for (let i = 0; i < bpos.count; i++) by[i] = bpos.getY(i);
      const basil = S(new THREE.Mesh(bg, mt(0xe0a060, { side: THREE.DoubleSide, roughness: .6 })), 'Taban zarı (bazilar membran)', 'Orta odacığın tabanını oluşturan, titreşimle dalgalanan zardır. Üzerinde Korti organı oturur. Dalganın en çok kabardığı yer sesin frekansına bağlıdır.', 'Titreşimle hareket eder', 'mem'); at(basil, -.05, -.18, 0); g.add(basil);
      const tec = S(new THREE.Mesh(new THREE.BoxGeometry(1.5, .12, LZ - .3), mt(0xb7e3c8, { transparent: true, opacity: .6 })), 'Örtü zarı', 'Tüylü hücrelerin tüycüklerinin üstüne uzanan jelimsi zardır. Taban zarı hareket edince tüycükler örtü zarına sürtünerek eğilir.', 'Tüycükleri eğer', 'mem'); at(tec, -.05, .34, 0); g.add(tec);
      const tecL = G(new THREE.Mesh(new THREE.BoxGeometry(.12, .5, LZ - .3), mt(0xb7e3c8, { transparent: true, opacity: .6 })), 'mem'); at(tecL, -.78, .12, 0); g.add(tecL);
      /* destek hücreleri ve Corti tüneli */
      const sup = S(new THREE.Mesh(new THREE.BoxGeometry(1.7, .12, LZ - .3), mt(0xd7b48a)), 'Destek hücreleri', 'Tüylü hücreleri taşıyan ve destekleyen hücrelerdir.', 'Destek', 'hc'); at(sup, .02, -.12, 0); g.add(sup);
      /* tüylü hücreler (örnekleme: her satır 12 hücre) */
      const IH = [], OH = [[], [], []]; const cellY = -.05;
      const ihM = mt(0x3be0c8, { emissive: 0x053a33 }), ohM = mt(0xff9a5c, { emissive: 0x3a1500 });
      const ihGeo = new THREE.CylinderGeometry(.1, .1, .35, 10);
      zs.forEach(z => {
        const ih = S(new THREE.Mesh(ihGeo, ihM.clone()), 'İç tüylü hücre', 'Tek sıra hâlinde dizilmiş işitme reseptörüdür. Titreşimlerin oluşturduğu hareketle tüycükleri eğilince sinirsel mesaj oluşur. Duyu epiteli yapısındaki mekanoreseptördür.', 'Mekanoreseptör · duyu epiteli', 'hc'); at(ih, -.45, cellY, z); g.add(ih); IH.push(ih);
        const tuft = G(new THREE.Mesh(new THREE.ConeGeometry(.12, .2, 8), mt(0xffffff, { emissive: 0x555555 })), 'hc'); at(tuft, -.45, .13, z); g.add(tuft); ih.userData.tuft = tuft;
        [0, 1, 2].forEach(r => { const oh = S(new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, .42, 10), ohM.clone()), 'Dış tüylü hücre', 'Üç sıra hâlinde dizilmiş işitme reseptörleridir. Tüycükleri örtü zarına değer. Duyu epiteli yapısındaki mekanoreseptörlerdir.', 'Mekanoreseptör · duyu epiteli', 'hc'); at(oh, .2 + r * .32, cellY, z); g.add(oh); OH[r].push(oh);
          const tf = G(new THREE.Mesh(new THREE.ConeGeometry(.09, .17, 8), mt(0xffffff, { emissive: 0x555555 })), 'hc'); at(tf, .2 + r * .32, .17, z); g.add(tf); oh.userData.tuft = tf; });
      });
      /* Corti tüneli (kemer) */
      for (let i = 0; i < NZ; i++) { const z = zs[i]; g.add(G(cylBetween([-.3, -.12, z], [-.02, .1, z], .028, mt(0xf1d6b0)), 'hc')); g.add(G(cylBetween([.18, -.12, z], [-.02, .1, z], .028, mt(0xf1d6b0)), 'hc')); }
      /* sinirler */
      zs.forEach((z, i) => { const f = G(curveTube([[-.45, -.25, z], [-1.0, -.3, z], [-1.5, -.42, z * .8]], .018, mt(0xf5d56a), 12), 'sin'); g.add(f); });
      const gang = S(ellip(.4, .3, LZ / 2 - .1, mt(0xb9a7ff, { transparent: true, opacity: .75 }), 20), 'Spiral ganglion (sinir hücre gövdeleri)', 'İşitme sinirinin hücre gövdelerinin toplandığı yerdir; tüylü hücrelerden gelen uyartıyı işitme sinirine aktarır.', 'Nöron gövdeleri', 'sin'); at(gang, -1.65, -.45, 0); g.add(gang);
      const nerve = S(curveTube([[-1.65, -.45, LZ / 2 - .1], [-1.65, -.45, LZ / 2 + .3], [-2.2, -.4, LZ / 2 + 1.0], [-3.5, -.2, LZ / 2 + 1.6]], .17, mt(0xf5c542, { emissive: 0x2b2100 }), 24), 'İşitme siniri', 'Korti organındaki reseptörlerde oluşan sinirsel mesajları beyne taşır.', 'Uyartıyı beyne iletir', 'sin'); g.add(nerve);
      const sp = pathFollower(0xffffff, .1, [V3(-.45, -.25, 0), V3(-1.5, -.42, 0), V3(-1.65, -.45, LZ / 2 - .2), V3(-2.2, -.4, LZ / 2 + 1.0), V3(-3.5, -.2, LZ / 2 + 1.6)], .22, 0); g.add(G(sp.orb, 'sin')); ticks.push(t => sp.tick(t));
      /* animasyon */
      const q = V3(0, 0, 0);
      const disp = (z, t) => { const env = Math.exp(-Math.pow((z / (LZ / 2) - api.peak) * 1.9, 2)); return api.amp * env * Math.sin(5.2 * z - t * api.speed); };
      ticks.push(t => {
        for (let i = 0; i < bpos.count; i++) bpos.setY(i, by[i] + disp(bpos.getZ(i), t)); bpos.needsUpdate = true;
        zs.forEach((z, i) => { const d = disp(z, t), a = Math.min(1, Math.abs(d) / Math.max(.02, api.amp) * (api.amp / .12)); IH[i].position.y = cellY + d; IH[i].userData.tuft.position.y = .13 + d; IH[i].userData.tuft.rotation.z = d * 3.2; IH[i].material.emissive.setRGB(a * .2 * (api.amp / .12), a * .9 * (api.amp / .12), a * .75 * (api.amp / .12));
          OH.forEach((row, r) => { const o = row[i]; o.position.y = cellY + d; o.userData.tuft.position.y = .17 + d; o.userData.tuft.rotation.z = d * 3; o.material.emissive.setRGB(a * .9 * (api.amp / .12), a * .35 * (api.amp / .12), 0); }); });
        tec.position.y = .34 + disp(0, t) * .1;
      });
      /* baskın modunda hücreler seçildiğinde vurgu için emissive baz değerini koru */
      return { g, sels, ticks, api };
    }
  };

  /* ============ DENGE ORGANI (ayrıntı) ============ */
  M3.denge = {
    title: 'Denge Organı (ayrıntı)', ico: '⚖️', tag: 'Mekanoreseptör · Duyu epiteli', cam: [0, 3.2, 9.6], target: [0, .2, 0], labScale: .8,
    layers: [['Yarım daire kanalı ampullası (dönme)', 'amp'], ['Tulumcuk/kesecik maküla (doğrusal hareket)', 'mac']],
    task: 'Sol tarafta yarım daire kanalının genişlemiş kısmını (ampulla), sağ tarafta tulumcuk/kesecik yüzeyini incele. “Dönme” hareketi sırasında sıvının cupulayı nasıl eğdiğini; “Eğilme/ivmelenme” sırasında otolit tabakasının tüylü hücreleri nasıl çektiğini gözle.',
    q: { q: 'Başın dönme hareketlerini algılayan yapı hangisidir?', o: ['Tulumcuk', 'Kesecik', 'Yarım daire kanalları', 'Östaki borusu'], a: 2, e: 'Yarım daire kanalları başın dönme hareketlerinin algılanmasında görevlidir. Tulumcuk ve kesecik ise yer çekimi, baş konumu ve doğrusal ivmelenme hakkında bilgi verir.' },
    build() {
      const { g, sels, ticks, S, G } = B(), api = { cup: 0, oto: 0, auto: true }, A = new THREE.Group(), Mc = new THREE.Group(); A.position.x = -3.2; Mc.position.x = 3.2; g.add(A, Mc);
      /* AMPULLA */
      const cn = S(new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, 3.4, 24, 1, true).rotateZ(Math.PI / 2), glass(0x7fe8c0, .22)), 'Yarım daire kanalı', 'Sıvı (endolenf) dolu kanaldır. Baş dönünce sıvı eylemsizlikle geride kalarak ampullanın içindeki cupulayı eğer.', 'Mekanoreseptör · denge (dönme)', 'amp'); cn.userData.low = true; A.add(cn);
      const am = S(ellip(.95, .85, .85, glass(0x7fe8c0, .3), 28), 'Ampulla', 'Kanalın genişlemiş bölümüdür; tüylü hücreler burada bulunur.', 'Mekanoreseptör · denge (dönme)', 'amp'); am.userData.low = true; at(am, 0, 0, 0); A.add(am);
      const crista = S(new THREE.Mesh(new THREE.CylinderGeometry(.55, .62, .18, 24), mt(0xff9a5c)), 'Tüylü hücreler (ampulla)', 'Ampulla tabanında yer alan, duyu epiteli yapısındaki mekanoreseptörlerdir. Cupulanın eğilmesiyle uyarılır.', 'Duyu epiteli · mekanoreseptör', 'amp'); at(crista, 0, -.62, 0); A.add(crista);
      const cupG = new THREE.Group(); at(cupG, 0, -.55, 0); A.add(cupG);
      const cup = S(new THREE.Mesh(new THREE.SphereGeometry(.62, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), glass(0xfff4b0, .55)), 'Cupula (jelimsi kubbe)', 'Tüylü hücrelerin tüycüklerini saran jelimsi kubbedir. Sıvının hareketiyle eğilir.', 'Eğilince reseptörler uyarılır', 'amp'); cupG.add(cup);
      for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283, r = i % 2 ? .3 : .45; cupG.add(G(cylBetween([Math.cos(a) * r, 0, Math.sin(a) * r], [Math.cos(a) * r, .62 - r * .55, Math.sin(a) * r], .012, mt(0xffffff)), 'amp')); }
      for (let i = 0; i < 8; i++) { const nn = G(cylBetween([Math.cos(i) * .3, -.7, Math.sin(i) * .3], [Math.cos(i) * .12, -1.2, Math.sin(i) * .12], .03, mt(0xf5c542)), 'amp'); A.add(nn); }
      const an = S(curveTube([[0, -1.2, 0], [0, -1.6, .2], [.8, -1.9, .5], [2.4, -2.1, 1.2]], .11, mt(0xf5c542, { emissive: 0x2b2100 }), 24), 'Denge siniri', 'Denge reseptörlerinden gelen mesajları beyne taşır.', 'Uyartıyı beyne iletir', 'amp'); A.add(an);
      const fl = []; for (let i = 0; i < 22; i++) { const d = glow(0x99ffd9, .045); A.add(G(d, 'amp')); fl.push({ d, p: Math.random(), y: (Math.random() - .5) * .6, z: (Math.random() - .5) * .6 }); }
      /* MAKÜLA */
      const base = S(new THREE.Mesh(new THREE.BoxGeometry(3.4, .4, 2.4), mt(0xb9d4f0)), 'Destek hücreleri (maküla)', 'Tulumcuk ve keseciğin tabanında tüylü hücrelere destek olan hücre tabakasıdır.', 'Destek', 'mac'); at(base, 0, -.9, 0); Mc.add(base);
      const hcs = [];
      for (let i = 0; i < 12; i++) for (let j = 0; j < 4; j++) {
        const x = -1.45 + i * .26, z = -.8 + j * .53, grp = new THREE.Group(); at(grp, x, -.7, z); Mc.add(grp);
        const c = S(new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, .5, 8), mt(0xff9a5c)), 'Tüylü hücre (maküla)', 'Tulumcuk ve keseciğin yüzeyindeki duyu epiteli yapısında mekanoreseptörlerdir. Üzerindeki otolit tabakası kayınca tüycükleri eğilir.', 'Duyu epiteli · mekanoreseptör', 'mac'); c.position.y = .25; grp.add(c);
        grp.add(G(cylBetween([0, .5, 0], [0, 1.1, 0], .012, mt(0xffffff)), 'mac')); hcs.push({ grp, c });
      }
      const gel = S(new THREE.Mesh(new THREE.BoxGeometry(3.4, .45, 2.4), glass(0xfff0b0, .55)), 'Jelimsi tabaka', 'Tüycükleri saran ve üzerinde otolitleri taşıyan jelimsi tabakadır.', 'Hareketi tüycüklere aktarır', 'mac'); at(gel, 0, .38, 0); Mc.add(gel);
      const rr = srand(12); const oto = S(instMesh(new THREE.OctahedronGeometry(.085), mt(0xffffff, { emissive: 0x555555, roughness: .3 }), 90, (i, d) => { d.position.set((rr() - .5) * 3.1, .72 + rr() * .1, (rr() - .5) * 2.1); d.rotation.set(rr() * 3, rr() * 3, rr() * 3); }), 'Otolitler (kalsiyum kristalleri)', 'Jelimsi tabakanın üzerindeki küçük kalsiyum karbonat kristalleridir. Ağırdırlar; baş eğilince veya vücut hızlanınca jelle birlikte kayarak tüylü hücreleri uyarırlar.', 'Yer çekimi · doğrusal ivme', 'mac'); Mc.add(oto);
      const mn = S(curveTube([[0, -1.1, 0], [0, -1.6, .2], [-.8, -1.9, .5], [-2.4, -2.1, 1.2]], .11, mt(0xf5c542, { emissive: 0x2b2100 }), 24), 'Denge siniri', 'Denge reseptörlerinden gelen mesajları beyne taşır.', 'Uyartıyı beyne iletir', 'mac'); Mc.add(mn);
      /* hareket */
      ticks.push(t => {
        let cp = api.cup, op = api.oto; if (api.auto) { cp = Math.sin(t * .9); op = Math.sin(t * .9 + 1); }
        cupG.rotation.z = -cp * .55; cup.material.opacity = .55; crista.material.emissive.setRGB(Math.abs(cp) * .8, Math.abs(cp) * .25, 0);
        fl.forEach(f => { f.p = (f.p + (cp * .012)) % 1; if (f.p < 0) f.p += 1; f.d.position.set(-1.6 + f.p * 3.2, f.y, f.z); });
        gel.position.x = op * .35; oto.position.x = op * .35;
        hcs.forEach(h => { h.grp.rotation.z = -op * .5; h.c.material.emissive.setRGB(Math.abs(op) * .5, Math.abs(op) * .15, 0); });
      });
      const sp = pathFollower(0xffffff, .09, [V3(0, -1.2, 0), V3(0, -1.6, .2), V3(.8, -1.9, .5), V3(2.4, -2.1, 1.2)], .22, 0); A.add(G(sp.orb, 'amp')); ticks.push(t => sp.tick(t));
      const sp2 = pathFollower(0xffffff, .09, [V3(0, -1.1, 0), V3(0, -1.6, .2), V3(-.8, -1.9, .5), V3(-2.4, -2.1, 1.2)], .22, .3); Mc.add(G(sp2.orb, 'mac')); ticks.push(t => sp2.tick(t));
      return { g, sels, ticks, api };
    }
  };

  window.EAR_VEST = vestibular;
})();
