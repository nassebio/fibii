/* Nasse Biology — Deri ve deri reseptörleri 3B modelleri (ayrıntılı, prosedürel) */
(function () {
  const TXT = {
    epi: 'Derinin en dış, koruyucu tabakasıdır. Üst yüzeyi ölü hücrelerden oluşur. Melanin pigmentini içerir; melanin deriye rengini verir ve zararlı ışınlardan korur. Serbest sinir uçları bu tabakaya kadar uzanır.',
    der: 'Epidermisin altındaki, kan damarları, sinirler, duyu reseptörleri, kıl kökleri ve çeşitli bezlerin bulunduğu tabakadır.',
    hip: 'Derinin en alt tabakasıdır (deri altı dokusu). Yağ dokusu bakımından zengindir; yalıtım ve darbelere karşı korumaya katkı sağlar.',
    mel: 'Epidermiste bulunan koyu renkli pigmenttir; deriye rengini verir ve zararlı ışınlara karşı korur.',
    meis: 'Dermisin üst kısmındaki papillalarda bulunan, hafif dokunmayı algılayan mekanoreseptördür. Nöron yapısındadır; kapsüllü bir yapıya sahiptir.',
    merk: 'Epidermis tabanında bulunan, sürekli hafif basıncı ve dokunmayı algılayan mekanoreseptördür; nöron ucu disk şeklindedir.',
    pac: 'Dermisin derininde ve deri altında yer alan, soğan zarı gibi katmanlı kapsüllü mekanoreseptördür. Basınç ve titreşimi algılar; nöron yapısındadır.',
    hot: 'Sıcaklık artışını algılayan termoreseptördür. Termoreseptörler çoğunlukla deri ve dilde bulunur.',
    cold: 'Sıcaklık azalmasını (soğuğu) algılayan termoreseptördür.',
    pain: 'Doku hasarına yol açabilecek fiziksel ve kimyasal uyaranları algılayan serbest sinir uçlarıdır (nosiseptör). Beyin hariç tüm vücutta bulunur; nöron yapısındadır.'
  };

  /* ---------- Deri dokuları (tuval boyama) ---------- */
  const YB = -1.6, YT = 2.0, waveY = x => 1.55 + .085 * Math.sin(x * 12.566) + .025 * Math.sin(x * 31 + 1.3);
  function sectionTex(Wu, seed) {
    const H = 720, W = Math.round(H * Wu / (YT - YB)), r = srand(seed || 3), K = H / (YT - YB);
    const py = y => (YT - y) * K, px = x => (x + Wu / 2) / Wu * W;
    return canvasTex(W, H, c => {
      /* dermis */
      c.fillStyle = '#d97b88'; c.fillRect(0, 0, W, H);
      for (let i = 0; i < 520; i++) { const x = r() * W, y = py(-.25) - r() * (py(-.25) - py(1.5)); c.strokeStyle = r() < .5 ? 'rgba(255,205,210,.45)' : 'rgba(170,70,95,.35)'; c.lineWidth = 1 + r() * 2.2; c.beginPath(); c.moveTo(x, y); c.bezierCurveTo(x + 20, y - 10 + r() * 20, x + 40, y + 10 - r() * 20, x + 60 + r() * 30, y + (r() - .5) * 18); c.stroke(); }
      /* deri altı (yağ hücreleri) */
      c.fillStyle = '#d9ad48'; c.fillRect(0, py(-.25), W, H - py(-.25));
      for (let yy = py(-.25) + 10; yy < H + 20; yy += 26) for (let xx = (yy / 26 % 2) * 14; xx < W + 20; xx += 30) { const rx = 13 + r() * 5, ry = 11 + r() * 5, cx = xx + (r() - .5) * 8, cy = yy + (r() - .5) * 8; const gr = c.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, rx); gr.addColorStop(0, '#fff2b0'); gr.addColorStop(1, '#efc95a'); c.fillStyle = gr; c.beginPath(); c.ellipse(cx, cy, rx, ry, r() * 3, 0, 7); c.fill(); c.strokeStyle = 'rgba(170,120,40,.6)'; c.lineWidth = 1.5; c.stroke(); }
      /* malpighi (dalgalı taban) */
      c.beginPath(); c.moveTo(0, py(1.9)); for (let i = 0; i <= 200; i++) { const x = -Wu / 2 + Wu * i / 200; c.lineTo(px(x), py(waveY(x))); } c.lineTo(W, py(1.9)); c.closePath(); c.fillStyle = '#c47d9c'; c.fill();
      c.save(); c.clip(); for (let i = 0; i < 900; i++) { const x = r() * W, y = py(1.9) + r() * (py(1.4) - py(1.9)); c.strokeStyle = 'rgba(110,45,85,.35)'; c.lineWidth = 1; c.beginPath(); c.ellipse(x, y, 5 + r() * 3, 4 + r() * 2, r() * 3, 0, 7); c.stroke(); } c.restore();
      c.strokeStyle = 'rgba(90,40,70,.7)'; c.lineWidth = 3; c.beginPath(); for (let i = 0; i <= 200; i++) { const x = -Wu / 2 + Wu * i / 200; i ? c.lineTo(px(x), py(waveY(x))) : c.moveTo(px(x), py(waveY(x))); } c.stroke();
      for (let i = 0; i < 160; i++) { const x = -Wu / 2 + r() * Wu; c.fillStyle = 'rgba(70,35,20,.75)'; c.beginPath(); c.arc(px(x), py(waveY(x) + .03 + r() * .05), 1.5 + r() * 2, 0, 7); c.fill(); }
      /* korun tabakası */
      c.fillStyle = '#e8c49a'; c.fillRect(0, 0, W, py(1.9)); c.strokeStyle = 'rgba(170,120,80,.55)'; c.lineWidth = 1.2; for (let k = 0; k < 6; k++) { c.beginPath(); const y = py(1.9) * (k + .5) / 6; c.moveTo(0, y); for (let x = 0; x <= W; x += 20) c.lineTo(x, y + (r() - .5) * 3); c.stroke(); }
      c.fillStyle = '#d29a78'; c.fillRect(0, 0, W, 4);
    });
  }
  function skinTopTex() {
    return canvasTex(1024, 586, (c, w, h) => {
      const r = srand(8); c.fillStyle = '#d9997e'; c.fillRect(0, 0, w, h);
      for (let i = 0; i < 7000; i++) { c.fillStyle = r() < .5 ? 'rgba(160,95,75,.16)' : 'rgba(245,195,170,.2)'; c.fillRect(r() * w, r() * h, 2 + r() * 4, 2 + r() * 4); }
      c.strokeStyle = 'rgba(140,80,62,.4)'; c.lineWidth = 1.3;
      [.6, -.6].forEach(a => { for (let i = -40; i < 80; i++) { c.beginPath(); let x = i * 26, y = 0; c.moveTo(x, y); for (let k = 0; k < 30; k++) { x += Math.sin(a) * 26 + (r() - .5) * 5; y += Math.cos(a) * 26; c.lineTo(x, y); } c.stroke(); } });
      for (let i = 0; i < 70; i++) { c.fillStyle = 'rgba(90,45,35,.55)'; c.beginPath(); c.arc(r() * w, r() * h, 1.6 + r() * 1.6, 0, 7); c.fill(); }
    });
  }
  function bandPlane(Wu, y0, y1, tex, mat) {
    const geo = new THREE.PlaneGeometry(Wu, y1 - y0), uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setY(i, ((uv.getY(i) ? y1 : y0) - YB) / (YT - YB)); uv.needsUpdate = true;
    const m = new THREE.Mesh(geo, mat || mt(0xffffff, { map: tex, roughness: .85, side: THREE.DoubleSide })); m.position.y = (y0 + y1) / 2; return m;
  }
  function strands(pts, r, n, mat, N) {
    const c = new THREE.CatmullRomCurve3(pts.map(p => Array.isArray(p) ? V3(...p) : p)), out = []; N = N || 40;
    for (let k = 0; k < n; k++) { const ph = k / n * 6.283, P = []; for (let i = 0; i <= N; i++) { const u = i / N, p = c.getPointAt(u), tg = c.getTangentAt(u), a = Math.abs(tg.y) > .9 ? V3(1, 0, 0) : V3(0, 1, 0), n1 = new THREE.Vector3().crossVectors(tg, a).normalize(), n2 = new THREE.Vector3().crossVectors(tg, n1), ang = ph + u * 5; P.push(p.clone().addScaledVector(n1, Math.cos(ang) * r).addScaledVector(n2, Math.sin(ang) * r)); } out.push(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P), N, r * .5, 5, false), mat)); }
    return out;
  }
  function stripeTex() { return canvasTex(64, 256, (c, w, h) => { for (let i = 0; i < 26; i++) { c.fillStyle = i % 2 ? '#f6d48a' : '#e7a94e'; c.fillRect(0, i * h / 26, w, h / 26 + 1); } }); }

  /* ============ DERİ ============ */
  M3.deri = {
    title: 'Deri', ico: '🖐️', tag: 'Mekano · Termo · Nosiseptör', cam: [3.2, 2.7, 8.4], target: [0, .7, 0], labScale: .8,
    layers: [['Epidermis (üst deri)', 'epi'], ['Dermis (alt deri) ve içindekiler', 'der'], ['Deri altı dokusu (yağ)', 'hip'], ['Reseptörler', 'rec'], ['Sinir ve damarlar', 'sin']],
    task: 'Deri katmanlarını (epidermis, dermis, deri altı dokusu) ve içindeki yapıları tek tek tıkla. Mekanoreseptör, termoreseptör ve ağrı reseptörünü ayırt edip her birinin hangi uyaranı algıladığını yaz; uyartının hangi yoldan beyne gittiğini izle.',
    q: { q: 'Derideki serbest sinir uçları hangi reseptöre örnektir?', o: ['Fotoreseptör', 'Ağrı reseptörü (nosiseptör)', 'Kemoreseptör', 'Elektromanyetik reseptör'], a: 1, e: 'Ağrı reseptörleri serbest sinir uçlarıdır; doku hasarına yol açabilecek uyaranları algılar.' },
    build() {
      const { g, sels, ticks, S, G } = B(), api = { rec: {} }, rr = srand(31);
      const XW = 5.6, ZW = 3.2, Xh = XW / 2, Zh = ZW / 2;
      /* — KATMAN YÜZEYLERİ (kesit duvarları) — */
      const tB = sectionTex(XW, 3), tL = sectionTex(ZW, 4), tR = sectionTex(ZW, 5), tF = sectionTex(XW, 6);
      const LAY = [[YB, -.25, 'Deri altı dokusu (hipodermis)', TXT.hip, 'Yağ · yalıtım · darbe koruması', 'hip'], [-.25, 1.6, 'Dermis (alt deri)', TXT.der, 'Reseptör · damar · sinir · bez', 'der'], [1.6, YT, 'Epidermis (üst deri)', TXT.epi, 'Koruyucu dış tabaka · melanin', 'epi']];
      const wall = (Wu, tex, place) => LAY.forEach(([y0, y1, n, i, t, grp]) => { const m = S(bandPlane(Wu, y0, y1, tex), n, i, t, grp); m.userData.low = true; place(m); g.add(m); });
      wall(XW, tB, m => { m.position.z = -Zh; });
      wall(ZW, tL, m => { m.rotation.y = Math.PI / 2; m.position.x = -Xh; });
      wall(ZW, tR, m => { m.rotation.y = Math.PI / 2; m.position.x = Xh; });
      g.add(G(at(new THREE.Mesh(new THREE.PlaneGeometry(XW, ZW).rotateX(-Math.PI / 2), mt(0xd9ad48, { roughness: .8 })), 0, YB, 0), 'hip'));
      /* ön kesit şeridi: korun + malpighi */
      const kor = S(bandPlane(XW, 1.9, YT, tF), 'Korun tabakası', 'Epidermisin en üstteki tabakasıdır. Ölü ve keratinli hücrelerden oluşur; deriyi su kaybına, mikroplara ve zararlı etkilere karşı korur. Sürekli dökülüp alttan yenilenir.', 'Epidermis · koruyucu', 'epi'); kor.position.z = Zh; g.add(kor);
      const mal = S(bandPlane(XW, 1.83, 1.9, tF), 'Malpighi tabakası', 'Epidermisin canlı hücrelerden oluşan alt tabakasıdır. Hücreler burada bölünerek korun tabakasını yeniler; deriye renk veren melanin pigmenti bu tabakada bulunur.', 'Epidermis · yenilenme · melanin', 'epi'); mal.position.z = Zh; g.add(mal);
      /* deri yüzeyi */
      const top = S(new THREE.Mesh(new THREE.PlaneGeometry(XW, ZW).rotateX(-Math.PI / 2), mt(0xffffff, { map: skinTopTex(), roughness: .75 })), 'Korun tabakası', 'Epidermisin en üstteki tabakasıdır. Ölü ve keratinli hücrelerden oluşur; deriyi su kaybına, mikroplara ve zararlı etkilere karşı korur. Sürekli dökülüp alttan yenilenir.', 'Epidermis · koruyucu', 'epi');
      top.position.y = YT; g.add(top);
      /* melanin */
      const mel = S(instMesh(new THREE.SphereGeometry(.022, 6, 5), mt(0x5a3420), 130, (i, d) => { const x = (rr() - .5) * 5.3, z = (rr() - .5) * 3.0; d.position.set(x, waveY(x) + .05 + rr() * .07, z); }), 'Melanin pigmenti', TXT.mel, 'Epidermiste · deri rengi', 'epi'); g.add(mel);
      /* — KILLAR (folikül · soğan · yağ bezi · kas · kıl kökü reseptörü) — */
      const HAIRS = [{ b: [-1.85, -.05, .4], s: [-1.45, YT, .3], t: [-.95, 3.15, .3], full: 1 }, { b: [1.0, .02, .95], s: [1.3, YT, .9], t: [1.85, 3.0, .9], full: 1 }, { b: [-.35, .1, -1.15], s: [-.05, YT, -1.1], t: [.4, 3.0, -1.1], full: 0 }];
      const fibreMat = mt(0xf3c84b, { emissive: 0x2b2100 });
      HAIRS.forEach((hh, k) => {
        const B0 = V3(...hh.b), S0 = V3(...hh.s), T0 = V3(...hh.t), ax = S0.clone().sub(B0).normalize(), side = V3(ax.y, -ax.x, 0).normalize();
        const at_ = u => B0.clone().lerp(S0, u);
        g.add(S(curveTube([B0.clone().add(ax.clone().multiplyScalar(.05)), at_(.5), S0, S0.clone().lerp(T0, .5).add(V3(0, .08, 0)), T0], .042, mt(0x3b2416, { roughness: .5 }), 50), 'Kıl', 'Kıl kökünden çıkıp epidermisin dışına uzanan, ölü ve keratinli hücrelerden oluşan yapıdır. Kılın hareketi kıl kökündeki sinir uçlarını uyarır.', 'Mekanik uyaranı iletir', 'der'));
        const fol = S(new THREE.Mesh(new THREE.CylinderGeometry(.13, .16, B0.distanceTo(S0), 18, 1, true), mt(0xd7a184, { transparent: true, opacity: .62, side: THREE.DoubleSide, depthWrite: false })), 'Kıl kökü (kıl folikülü)', 'Dermiste bulunan, kılın içinden çıktığı tüp biçimli keseciktir. Dibindeki kıl soğanında kıl hücreleri bölünerek kılı uzatır.', 'Dermiste · kılı üretir', 'der');
        fol.position.copy(at_(.5)); fol.quaternion.setFromUnitVectors(V3(0, 1, 0), ax); g.add(fol);
        const bulb = S(ellip(.19, .24, .19, mt(0xc98a6e, { roughness: .6 }), 20), 'Kıl kökü (kıl folikülü)', 'Kıl folikülünün dipteki genişlemiş kısmıdır (kıl soğanı); kıl buradan büyür.', 'Dermiste', 'der'); bulb.position.copy(B0); bulb.quaternion.setFromUnitVectors(V3(0, 1, 0), ax); g.add(bulb);
        g.add(G(at(ellip(.08, .1, .08, mt(0x8a3a3a), 12), B0.x, B0.y - .05, B0.z), 'der'));
        /* kıl kökü reseptörü: soğanı saran sinir sarmalı */
        const hp = []; for (let i = 0; i <= 70; i++) { const u = i / 70, a = u * Math.PI * 2 * 3.2, p = at_(.02 + u * .22), q = new THREE.Vector3().crossVectors(ax, side).normalize(); hp.push(p.clone().addScaledVector(side, Math.cos(a) * .21).addScaledVector(q, Math.sin(a) * .21)); }
        g.add(S(curveTube(hp, .017, mt(0xf3c84b, { emissive: 0x2b2100 }), 140), 'Kıl kökü reseptörü', 'Kıl kökünü saran serbest sinir uçlarıdır. Kıl hareket ettiğinde (örneğin bir böcek kıla dokunduğunda) uyarılır; bir mekanoreseptördür ve nöron yapısındadır.', 'Mekanoreseptör · nöron', 'rec'));
        g.add(G(curveTube([hp[0], [hp[0].x + .25, -.05, hp[0].z * .6 - .1], [hp[0].x * .5 + .2, -.15, -.3]], .02, fibreMat, 20), 'sin'));
        /* yağ bezi */
        const sgC = at_(.4).add(side.clone().multiplyScalar(.3));
        for (let j = 0; j < 7; j++) { const o = V3((rr() - .5) * .22, (rr() - .5) * .28, (rr() - .5) * .22); const sg = S(ellip(.1 + rr() * .04, .11 + rr() * .04, .1, mt(0xf3dd86, { roughness: .45 }), 14), 'Yağ bezi', 'Kıl kökünün yanında bulunan, salgısıyla kılı ve deriyi yağlayıp yumuşak tutan bezdir. Dermiste yer alır.', 'Dermiste · bez', 'der'); sg.position.copy(sgC).add(o); g.add(sg); }
        g.add(G(cylBetween(sgC, at_(.48), .04, mt(0xe9cf7a)), 'der'));
        if (hh.full) { const a0 = at_(.3).add(side.clone().multiplyScalar(-.15)), a1 = V3(B0.x - side.x * .95, 1.5, B0.z); const ms = S(curveTube([a0, a0.clone().lerp(a1, .5).add(V3(0, 0, .04)), a1], .05, mt(0xc4505a, { roughness: .6 }), 20), 'Kıl dikleştirici kas', 'Kıl kökünü epidermise bağlayan düz kastır. Üşüyünce ya da korkunca kasılır; kıl dikleşir ve deride “tavuk derisi” görünümü oluşur.', 'Dermiste · kas', 'der'); g.add(ms); }
      });
      /* — TER BEZİ — */
      const SWC = V3(2.05, -.1, .45), cp = []; for (let i = 0; i <= 160; i++) { const a = i * .42; cp.push(SWC.clone().add(V3(Math.cos(a) * .2 + Math.cos(a * 3.1) * .07, Math.sin(a * 2.3) * .13, Math.sin(a) * .2 + Math.sin(a * 2.7) * .07))); }
      g.add(S(curveTube(cp, .045, mt(0xb268c6, { roughness: .45 }), 400), 'Ter bezi', 'Dermisin alt kısmında yumak gibi kıvrılmış bezdir. Kandaki su ve tuzlardan ter üretir; ter, kanalla deri yüzeyindeki gözeneğe taşınır ve vücut sıcaklığının düzenlenmesine yardımcı olur.', 'Dermiste · bez', 'der'));
      const dp = [cp[cp.length - 1]]; for (let i = 1; i <= 26; i++) { const u = i / 26, y = SWC.y + .15 + u * (YT - SWC.y - .15), sp = y > 1.5 ? (y - 1.5) * .25 : 0; dp.push(V3(SWC.x + Math.sin(u * 14) * .04 + Math.cos(y * 30) * sp, y, SWC.z + Math.sin(y * 30) * sp)); }
      g.add(S(curveTube(dp, .03, mt(0xb87ad0, { roughness: .45 }), 120), 'Ter bezi kanalı', 'Ter bezinden çıkan terin epidermisi geçerek deri yüzeyindeki gözeneğe ulaştığı kıvrımlı kanaldır.', 'Dermiste · bez', 'der'));
      g.add(G(at(new THREE.Mesh(new THREE.CircleGeometry(.055, 14).rotateX(-Math.PI / 2), mt(0x3a1a14)), dp[dp.length - 1].x, YT + .004, dp[dp.length - 1].z), 'epi'));
      /* — KAN DAMARLARI — */
      const wav = (y, z, ph) => { const p = []; for (let i = 0; i <= 14; i++) { const x = -Xh + .02 + i / 14 * (XW - .04); p.push(V3(x, y + Math.sin(i * .9 + ph) * .05, z + Math.cos(i * .7 + ph) * .08)); } return p; };
      const art = S(curveTube(wav(-.12, .95, 0), .085, mt(0xc8302c, { roughness: .4 }), 80), 'Kan damarları', 'Dermiste ve deri altında bulunan kan damarlarıdır. Deriye oksijen ve besin taşır; genişleyip daralarak vücut ısısının düzenlenmesine yardımcı olur. Kırmızı: atardamar, mavi: toplardamar.', 'Dermiste · beslenme · ısı dengesi', 'sin'); g.add(art);
      const vein = S(curveTube(wav(-.2, .55, 1.4), .1, mt(0x3550c0, { roughness: .4 }), 80), 'Kan damarları', 'Dermiste ve deri altında bulunan kan damarlarıdır. Deriye oksijen ve besin taşır; genişleyip daralarak vücut ısısının düzenlenmesine yardımcı olur.', 'Dermiste · beslenme · ısı dengesi', 'sin'); g.add(vein);
      g.add(S(curveTube(wav(-1.0, -.5, 2.2), .11, mt(0xb52a2a, { roughness: .4 }), 80), 'Kan damarları', 'Deri altı dokusundaki daha büyük kan damarlarıdır.', 'Beslenme', 'sin'));
      g.add(S(curveTube(wav(-1.12, -.9, .7), .12, mt(0x2f47b0, { roughness: .4 }), 80), 'Kan damarları', 'Deri altı dokusundaki daha büyük kan damarlarıdır.', 'Beslenme', 'sin'));
      [-2.35, -.6, .35, 2.45].forEach((x, i) => { const z = i % 2 ? .75 : .85; const top = waveY(x) + .02; g.add(G(curveTube([[x, -.12, .95], [x + .04, .6, z], [x, top - .2, z - .05], [x + .1, top, z - .05], [x + .2, top - .2, z - .08], [x + .22, .6, z - .15], [x + .2, -.2, .58]], .02, mt(i % 2 ? 0xd8433a : 0xb83a6b), 50), 'sin')); });
      /* — YAĞ HÜCRELERİ — */
      const fp = []; for (let x = -2.55; x <= 2.6; x += .4) for (let z = -1.38; z <= 1.42; z += .4) [-1.38, -.95, -.55].forEach((y, k) => { const p = V3(x + (rr() - .5) * .14 + (k % 2) * .2, y + (rr() - .5) * .08, z + (rr() - .5) * .14 + (k % 2) * .2); if (p.distanceTo(V3(.55, -.35, -.55)) < .62 || Math.abs(p.x) > 2.62 || Math.abs(p.z) > 1.42) return; if (Math.abs(p.y + 1.0) < .2 && Math.abs(p.z + .5) < .25) return; fp.push([p, .17 + rr() * .07]); });
      const fat = S(instMesh(new THREE.SphereGeometry(1, 16, 12), mt(0xffffff, { roughness: .3, metalness: .02 }), fp.length, (i, d) => { d.position.copy(fp[i][0]); d.scale.setScalar(fp[i][1]); }), 'Yağ dokusu (yağ hücreleri)', 'Deri altı dokusunda bulunan, yağ depolayan büyük hücrelerdir. Isı yalıtımı sağlar, darbeleri sönümler ve enerji deposu olarak görev yapar.', 'Deri altı · yalıtım', 'hip');
      { const c = new THREE.Color(); for (let i = 0; i < fp.length; i++) { c.setHSL(.12 + rr() * .02, .82, .58 + rr() * .08); fat.setColorAt(i, c); } fat.instanceColor.needsUpdate = true; } g.add(fat);
      /* — SİNİR GÖVDESİ — */
      const TP = [[-1.0, 1.0, -.25], [-.4, .3, -.3], [.4, -.15, -.3], [2.8, -.15, -.3], [3.8, -.15, -.3]];
      const trunk = S(curveTube(TP, .07, mt(0xf5c542, { emissive: 0x2b2100 }), 60), 'Duyu siniri', 'Reseptörlerde oluşan uyartıları nöronlarla merkezî sinir sistemine (omurilik ve beyin) taşır.', 'Uyartıyı iletir', 'sin'); g.add(trunk);
      strands(TP, .07, 5, mt(0xe9b83a, { emissive: 0x241a00 })).forEach(m => g.add(S(m, 'Duyu siniri', 'Reseptörlerde oluşan uyartıları nöronlarla merkezî sinir sistemine (omurilik ve beyin) taşır.', 'Uyartıyı iletir', 'sin')));
      const brain = labelSprite('Beyne ➜', .8); brain.position.set(3.6, .35, -.3); g.add(brain);
      /* — RESEPTÖRLER — */
      const recs = [];
      const mkRec = (key, mesh, pos, trunkFrom) => { at(mesh, ...pos); g.add(mesh); const path = new THREE.CatmullRomCurve3([V3(...pos), V3(trunkFrom[0], trunkFrom[1], trunkFrom[2]), V3(.4, -.15, -.3), V3(2.8, -.15, -.3), V3(3.8, -.15, -.3)]); g.add(G(curveTube([pos, [(pos[0] + trunkFrom[0]) / 2 + .05, (pos[1] + trunkFrom[1]) / 2, (pos[2] + trunkFrom[2]) / 2], trunkFrom], .022, fibreMat, 16), 'sin')); const r = { key, mesh, path, a: 0 }; recs.push(r); api.rec[key] = r; return r; };
      /* Meissner: dermal papilla içinde, enine katmanlı kapsül */
      const meis = S(ellip(.12, .25, .12, mt(0xf0c24e, { emissive: 0, roughness: .45 }), 18), 'Mekanoreseptör (hafif dokunma)', TXT.meis, 'Dokunma reseptörü · Meissner cisimciği · nöron', 'rec');
      mkRec('meissner', meis, [-.3, 1.5, .55], [-.35, .6, .1]);
      for (let i = 0; i < 7; i++) g.add(G(at(new THREE.Mesh(new THREE.TorusGeometry(.11 * Math.sqrt(1 - Math.pow((i - 3) / 3.6, 2)), .016, 6, 20).rotateX(Math.PI / 2), mt(0xd59a2c)), -.3, 1.32 + i * .06, .55), 'rec'));
      /* Merkel diskleri */
      const MK = [[-.16, 0, 0], [0, .02, .1], [.15, -.01, -.04], [.04, -.02, -.15]];
      const merk = S(instMesh(new THREE.CylinderGeometry(.075, .075, .028, 16), mt(0x2fa7f0, { emissive: 0, roughness: .35 }), MK.length, (i, d) => d.position.set(...MK[i])), 'Mekanoreseptör (sürekli hafif basınç)', TXT.merk, 'Dokunma reseptörü · Merkel diskleri · nöron', 'rec');
      mkRec('merkel', merk, [.85, 1.62, -.55], [.8, .6, -.3]);
      MK.forEach(p => { g.add(G(at(ellip(.08, .06, .08, mt(0xc8a8c8), 12), .85 + p[0], 1.69 + p[1], -.55 + p[2]), 'rec')); g.add(G(curveTube([[.85 + p[0], 1.6 + p[1], -.55 + p[2]], [.84 + p[0] * .5, 1.35, -.52], [.82, 1.1, -.45]], .014, fibreMat, 10), 'rec')); });
      /* Pacini: katmanlı (soğan zarı) kapsül */
      const pac = S(ellip(.3, .55, .3, mt(0xffffff, { map: stripeTex(), transparent: true, opacity: .93, roughness: .35, emissive: 0 }), 32), 'Mekanoreseptör (basınç ve titreşim)', TXT.pac, 'Basınç reseptörü · Pacini cisimciği · nöron', 'rec');
      mkRec('pacini', pac, [.55, -.35, -.55], [.55, -.15, -.3]);
      [.8, .6, .4].forEach(k => g.add(G(at(ellip(.3 * k, .55 * k, .3 * k, glass(0xffd27a, .35), 16), .55, -.35, -.55), 'rec')));
      g.add(G(cylBetween([.55, -.95, -.55], [.55, .05, -.55], .03, fibreMat), 'rec'));
      /* Ruffini (sıcak) */
      const rgeo = new THREE.IcosahedronGeometry(.15, 3); { const p = rgeo.attributes.position; for (let i = 0; i < p.count; i++) { const v = V3(p.getX(i), p.getY(i), p.getZ(i)), f = 1 + .16 * Math.sin(v.x * 60) * Math.sin(v.y * 55) * Math.sin(v.z * 50); v.multiplyScalar(f); p.setXYZ(i, v.x, v.y, v.z); } rgeo.computeVertexNormals(); }
      const hot = S(new THREE.Mesh(rgeo, mt(0x3d86d8, { emissive: 0, roughness: .4 })), 'Termoreseptör (sıcak)', TXT.hot, 'Sıcağa duyarlı reseptör · Ruffini cisimciği · nöron', 'rec'); hot.scale.set(1.25, .9, .9);
      mkRec('hot', hot, [-.85, 1.22, -.6], [-.8, .5, -.3]);
      /* Krause (soğuk) */
      const KR = []; for (let i = 0; i < 16; i++) { const a = rr() * 6.283, b = Math.acos(rr() * 2 - 1), rad = .06 + rr() * .07; KR.push([Math.sin(b) * Math.cos(a) * rad, Math.cos(b) * rad, Math.sin(b) * Math.sin(a) * rad]); }
      const cold = S(instMesh(new THREE.SphereGeometry(.06, 12, 10), mt(0xf2c43c, { emissive: 0, roughness: .35 }), KR.length, (i, d) => d.position.set(...KR[i])), 'Termoreseptör (soğuk)', TXT.cold, 'Soğuğa duyarlı reseptör · Krause cisimciği · nöron', 'rec');
      mkRec('cold', cold, [.25, 1.36, -1.0], [.3, .6, -.3]);
      /* serbest sinir uçları */
      const painPts = [[-2.2, 1.88, .5], [-1.9, 1.84, -.5], [.15, 1.88, .15], [2.1, 1.85, -.4], [1.6, 1.86, .2]];
      const painR = { key: 'pain', meshes: [], a: 0, path: new THREE.CatmullRomCurve3([V3(.15, 1.88, .15), V3(.2, .6, -.1), V3(.4, -.15, -.3), V3(2.8, -.15, -.3), V3(3.8, -.15, -.3)]) };
      painPts.forEach(([x, y, z]) => {
        const f = S(curveTube([[x, .55, z * .4], [x - .06, 1.0, z], [x + .07, 1.45, z], [x, y, z]], .022, mt(0xffe14d, { emissive: 0x332a00 }), 18), 'Ağrı reseptörü (serbest sinir ucu)', TXT.pain, 'Sıcaklık ve ağrı reseptörü · serbest sinir uçları · nöron', 'rec'); g.add(f); painR.meshes.push(f);
        [-1, 1].forEach(s => { const b = S(curveTube([[x + .07, 1.45, z], [x + s * .12, 1.68, z + s * .05], [x + s * .2, y - .02, z + s * .1]], .014, mt(0xffe14d, { emissive: 0x332a00 }), 10), 'Ağrı reseptörü (serbest sinir ucu)', TXT.pain, 'Sıcaklık ve ağrı reseptörü · serbest sinir uçları · nöron', 'rec'); g.add(b); painR.meshes.push(b); });
        const tip = S(new THREE.Mesh(new THREE.SphereGeometry(.04, 8, 8), mt(0xffe14d, { emissive: 0x332a00 })), 'Ağrı reseptörü (serbest sinir ucu)', TXT.pain, 'Sıcaklık ve ağrı reseptörü · serbest sinir uçları · nöron', 'rec'); at(tip, x, y, z); g.add(tip); painR.meshes.push(tip);
        g.add(G(curveTube([[x, .55, z * .4], [x * .3, .2, -.2], [.4, -.15, -.3]], .018, fibreMat, 12), 'sin'));
      });
      recs.push(painR); api.rec.pain = painR;
      /* nabız havuzu */
      const pool = []; for (let i = 0; i < 40; i++) { const o = glow(0xffffff, .07); o.visible = false; g.add(G(o, 'sin')); pool.push({ o, r: null, u: 0, on: false }); }
      api.fire = (key, v) => { const r = api.rec[key]; if (r) r.a = Math.max(r.a, v === undefined ? 1 : v); };
      let acc = 0;
      ticks.push((t, dt) => {
        acc += dt;
        recs.forEach(r => {
          r.a = Math.max(0, r.a - dt * .45); const e = r.a;
          if (r.mesh && r.mesh.material.emissive) { const c = { meissner: [.9, .7, .1], merkel: [.1, .5, 1], pacini: [1, .55, .1], hot: [1, .15, .1], cold: [.1, .5, 1] }[r.key]; r.mesh.material.emissive.setRGB(c[0] * e, c[1] * e, c[2] * e); }
          if (r.meshes) r.meshes.forEach(m => m.material.emissive.setRGB(e, e * .9, 0));
          if (e > .1 && acc > .1 && Math.random() < .5 * e + .1) { const f = pool.find(p => !p.on); if (f) { f.on = true; f.r = r; f.u = 0; f.o.visible = true; } }
        });
        if (acc > .1) acc = 0;
        pool.forEach(p => { if (!p.on) return; p.u += dt * .42; if (p.u >= 1) { p.on = false; p.o.visible = false; return; } p.o.position.copy(p.r.path.getPoint(p.u)); });
      });
      return { g, sels, ticks, api };
    }
  };

  /* ============ DERİ RESEPTÖRLERİ (ayrıntı) ============ */
  M3.deriresept = {
    title: 'Deri Reseptörleri (ayrıntı)', ico: '🔍', tag: 'Mekano · Termo · Nosiseptör', cam: [0, 2.8, 13.5], target: [0, .2, 0], labScale: .9,
    task: 'Sırayla beş reseptör grubunu incele: hafif dokunma, sürekli basınç, basınç ve titreşim, ağrı, sıcaklık. Her biri için “uyaran türü – reseptör çeşidi – yapı” üçlüsünü yaz. Kapsüllü yapı hangisi? Serbest sinir ucu hangisi?',
    q: { q: 'Aşağıdakilerden hangisi basınç ve titreşimi algılayan, katmanlı kapsüllü mekanoreseptördür?', o: ['Serbest sinir ucu', 'Soğan zarı benzeri kapsüllü reseptör (Pacini)', 'Tat tomurcuğu', 'Koku nöronu'], a: 1, e: 'Dermisin derininde ve deri altında yer alan, katmanlı kapsüllü mekanoreseptör basınç ve titreşimi algılar.' },
    build() {
      const { g, sels, ticks, S, G } = B(), anim = [];
      const ped = (x, col) => { const p = G(at(new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.15, .22, 32), mt(col, { roughness: .7 })), x, -1.35, 0), ''); g.add(p); };
      const lab = (x, t1) => { const s = labelSprite(t1, 1.0); s.position.set(x, -2.0, 0); g.add(s); };
      const xs = [-6, -3, 0, 3, 6];
      /* 1 Meissner */
      ped(xs[0], 0x2c4a6a); lab(xs[0], 'Hafif dokunma');
      const cap = S(ellip(.55, 1.0, .55, glass(0x34c38f, .35), 24), 'Mekanoreseptör (hafif dokunma)', TXT.meis, 'Mekanoreseptör · nöron · kapsüllü', ''); at(cap, xs[0], -.1, 0); g.add(cap);
      for (let i = 0; i < 9; i++) g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(.48 - Math.abs(i - 4) * .04, .48 - Math.abs(i - 4) * .04, .04, 20), mt(0x7de3c0)), xs[0], -.75 + i * .16, 0));
      const ax1 = S(curveTube([[xs[0], -1.2, 0], [xs[0] + .1, -.6, .05], [xs[0] - .1, -.2, -.05], [xs[0] + .08, .2, .05], [xs[0] - .06, .6, 0]], .045, mt(0xf5c542, { emissive: 0x2b2100 }), 30), 'Sinir ucu (hafif dokunma reseptörü)', 'Kapsülün içinde kıvrılan nöron ucudur; dokunmayla şekil değiştiren kapsül nöronu uyarır.', 'Nöron', ''); g.add(ax1);
      anim.push(t => { const e = .3 + .7 * Math.max(0, Math.sin(t * 3.0)); cap.scale.set(1, 1 - .05 * e, 1); cap.material.emissive.setRGB(0, .35 * e, .2 * e); ax1.material.emissive.setRGB(.17 + .5 * e, .13 + .4 * e, 0); });
      /* 2 Merkel */
      ped(xs[1], 0x2c4a6a); lab(xs[1], 'Sürekli hafif basınç');
      for (let i = 0; i < 3; i++) { const c = S(ellip(.33, .5, .33, mt(0xc9a68a), 18), 'Epitel hücresi (Merkel hücresi)', 'Epidermis tabanında bulunan, sinir ucuyla disk şeklinde temas eden duyu epiteli hücresidir.', 'Duyu epiteli', ''); at(c, xs[1] - .6 + i * .6, .35, (i - 1) * .1); g.add(c); }
      const discs = []; for (let i = 0; i < 3; i++) { const d = S(new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .07, 20), mt(0x3ab0ff, { emissive: 0 })), 'Mekanoreseptör (sürekli hafif basınç)', TXT.merk, 'Mekanoreseptör · nöron · disk', ''); at(d, xs[1] - .6 + i * .6, -.07, (i - 1) * .1); g.add(d); discs.push(d); g.add(G(curveTube([[xs[1] - .6 + i * .6, -.1, (i - 1) * .1], [xs[1] - .3 + i * .15, -.7, 0], [xs[1], -1.2, 0]], .028, mt(0xf5c542), 12), '')); }
      anim.push(t => { const e = .55 + .1 * Math.sin(t * 1.5); discs.forEach(d => d.material.emissive.setRGB(.05 * e, .3 * e, .7 * e)); });
      /* 3 Pacini */
      ped(xs[2], 0x2c4a6a); lab(xs[2], 'Basınç ve titreşim');
      const pshells = []; for (let i = 0; i < 10; i++) { const k = 1 - i * .085; const m = S(ellip(.7 * k, 1.05 * k, .7 * k, glass(0xffb85c, .22 + i * .01), 22), 'Mekanoreseptör (basınç ve titreşim)', TXT.pac, 'Mekanoreseptör · nöron · katmanlı kapsül', ''); at(m, xs[2], -.05, 0); g.add(m); pshells.push(m); }
      const ax3 = S(cylBetween([xs[2], -1.3, 0], [xs[2], .6, 0], .06, mt(0xf5c542, { emissive: 0x2b2100 })), 'Sinir ucu (Pacini)', 'Kapsülün merkezindeki nöron ucudur; katmanlı kapsül basınç/titreşimi sinir ucuna iletir.', 'Nöron', ''); g.add(ax3);
      anim.push(t => { const v = Math.sin(t * 14) * .5 + .5; pshells.forEach((m, i) => { const k = 1 + .015 * Math.sin(t * 14 - i * .5); m.scale.set(.7 * (1 - i * .085) * k, 1.05 * (1 - i * .085) * k, .7 * (1 - i * .085) * k); }); ax3.material.emissive.setRGB(.17 + .6 * v, .13 + .4 * v, 0); });
      /* 4 Serbest sinir ucu */
      ped(xs[3], 0x2c4a6a); lab(xs[3], 'Ağrı (serbest sinir ucu)');
      const cells = []; for (let i = 0; i < 9; i++) { const c = new THREE.Mesh(new THREE.SphereGeometry(.28, 12, 10), glass(0xf3c2a2, .45)); at(c, xs[3] + (i % 3 - 1) * .55, .15 + Math.floor(i / 3) * .55, ((i * 7) % 3 - 1) * .2); g.add(G(c, '')); }
      const trees = []; [[0, 0], [-.4, .25], [.4, -.2]].forEach(([dx, dz], i) => { const base = [xs[3] + dx * .3, -1.2, dz * .3]; const br = S(curveTube([base, [xs[3] + dx * .6, -.4, dz], [xs[3] + dx, .4, dz], [xs[3] + dx * 1.2, 1.15, dz]], .04, mt(0xffe14d, { emissive: 0x332a00 }), 24), 'Ağrı reseptörü (serbest sinir ucu)', TXT.pain, 'Nosiseptör · nöron', ''); g.add(br); trees.push(br);
        [-.25, .25].forEach(s => { const sb = S(curveTube([[xs[3] + dx, .4, dz], [xs[3] + dx + s * .6, .8, dz + s * .2], [xs[3] + dx + s, 1.2, dz]], .025, mt(0xffe14d, { emissive: 0x332a00 }), 14), 'Ağrı reseptörü (serbest sinir ucu)', TXT.pain, 'Nosiseptör · nöron', ''); g.add(sb); trees.push(sb); const tp = S(new THREE.Mesh(new THREE.SphereGeometry(.06, 8, 8), mt(0xffe14d, { emissive: 0x332a00 })), 'Ağrı reseptörü (serbest sinir ucu)', TXT.pain, 'Nosiseptör · nöron', ''); at(tp, xs[3] + dx + s, 1.2, dz); g.add(tp); trees.push(tp); }); });
      anim.push(t => { const e = Math.max(0, Math.sin(t * 2.3) * Math.sin(t * 5.1)); trees.forEach(m => m.material.emissive.setRGB(.2 + e * .8, .18 + e * .7, 0)); });
      /* 5 Termoreseptörler */
      ped(xs[4], 0x2c4a6a); lab(xs[4], 'Sıcaklık (termoreseptör)');
      const hotM = S(ellip(.3, .65, .3, mt(0xff4d4d, { emissive: 0 }), 18), 'Termoreseptör (sıcak)', TXT.hot, 'Termoreseptör · nöron', ''); at(hotM, xs[4] - .7, -.1, 0); g.add(hotM);
      const coldM = S(new THREE.Mesh(new THREE.SphereGeometry(.42, 20, 16), mt(0x3aa0ff, { emissive: 0 })), 'Termoreseptör (soğuk)', TXT.cold, 'Termoreseptör · nöron', ''); at(coldM, xs[4] + .7, .0, 0); g.add(coldM);
      g.add(G(curveTube([[xs[4] - .7, -.7, 0], [xs[4] - .5, -1.2, 0]], .035, mt(0xf5c542), 8), '')); g.add(G(curveTube([[xs[4] + .7, -.4, 0], [xs[4] + .5, -1.2, 0]], .035, mt(0xf5c542), 8), ''));
      anim.push(t => { const h = .5 + .5 * Math.sin(t * 2), c = .5 + .5 * Math.sin(t * 2 + 3.1); hotM.material.emissive.setRGB(.9 * h, .1 * h, .05 * h); coldM.material.emissive.setRGB(.05 * c, .35 * c, .8 * c); });
      ticks.push((t) => anim.forEach(f => f(t)));
      return { g, sels, ticks };
    }
  };
})();
