/* Nasse Biology — Göz ve Retina 3B modelleri (ayrıntılı, prosedürel) */
(function () {
  /* İris dokusu: ışına göre göz bebeği çapı değişebilen tuval dokusu */
  function irisTexture() {
    const rnd = srand(11), fibres = [];
    for (let i = 0; i < 340; i++) fibres.push([rnd() * Math.PI * 2, .2 + rnd() * .3, .75 + rnd() * .25, rnd()]);
    const tex = canvasTex(256, 256, () => { });
    function draw(p) {
      const x = tex._x; x.clearRect(0, 0, 256, 256);
      const g = x.createRadialGradient(128, 128, 8, 128, 128, 126); g.addColorStop(0, '#6fb4f2'); g.addColorStop(.45, '#2f78cc'); g.addColorStop(.85, '#1a4a94'); g.addColorStop(1, '#0f2f66');
      x.fillStyle = g; x.beginPath(); x.arc(128, 128, 126, 0, 7); x.fill();
      x.lineWidth = 1.3;
      fibres.forEach(f => { x.strokeStyle = f[3] > .5 ? 'rgba(190,225,255,.40)' : 'rgba(10,40,90,.45)'; x.beginPath(); x.moveTo(128 + Math.cos(f[0]) * 126 * f[1], 128 + Math.sin(f[0]) * 126 * f[1]); x.lineTo(128 + Math.cos(f[0] + .04) * 126 * f[2], 128 + Math.sin(f[0] + .04) * 126 * f[2]); x.stroke(); });
      x.strokeStyle = 'rgba(8,24,60,.9)'; x.lineWidth = 9; x.beginPath(); x.arc(128, 128, 126 * p + 4, 0, 7); x.stroke();
      x.strokeStyle = 'rgba(190,225,255,.55)'; x.lineWidth = 3; x.beginPath(); x.arc(128, 128, 126 * Math.min(.97, p * 1.55), 0, 7); x.stroke();
      x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000'; x.beginPath(); x.arc(128, 128, 126 * p, 0, 7); x.fill(); x.globalCompositeOperation = 'source-over';
      tex.needsUpdate = true;
    }
    return { tex, draw };
  }
  function vesselTexture() {
    const r = srand(5);
    return canvasTex(512, 256, (x, w, h) => {
      x.fillStyle = '#6b2424'; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 520; i++) { x.strokeStyle = r() > .5 ? 'rgba(235,80,70,.55)' : 'rgba(120,20,40,.6)'; x.lineWidth = .8 + r() * 1.8; x.beginPath(); let px = r() * w, py = r() * h; x.moveTo(px, py); for (let k = 0; k < 6; k++) { px += (r() - .5) * 46; py += (r() - .5) * 30; x.lineTo(px, py); } x.stroke(); }
    });
  }

  function fundusTexture() {
    const r = srand(29);
    return canvasTex(512, 256, (x, w, h) => {
      const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#d9722e'); gr.addColorStop(1, '#e88a3a'); x.fillStyle = gr; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 2400; i++) { x.fillStyle = r() < .5 ? 'rgba(255,170,90,.18)' : 'rgba(170,60,20,.16)'; x.beginPath(); x.arc(r() * w, r() * h, 2 + r() * 6, 0, 7); x.fill(); }
    });
  }
  function lidGeo(a0, a1, pm, Ro, Ri, pEnd) {
    const NA = 48, NP = 16, pos = [], idx = [];
    const P = (R, p, a) => polarPt(R, p, a);
    const ring = (R, k0) => { for (let i = 0; i <= NA; i++) { const a = a0 + (a1 - a0) * i / NA, p0 = pm(a); for (let k = 0; k <= NP; k++) { const v = P(R, p0 + (pEnd - p0) * k / NP, a); pos.push(v.x, v.y, v.z); } } };
    ring(Ro); ring(Ri);
    const off = (NA + 1) * (NP + 1);
    for (let i = 0; i < NA; i++) for (let k = 0; k < NP; k++) { const a = i * (NP + 1) + k, b = a + NP + 1; idx.push(a, b, a + 1, a + 1, b, b + 1, off + a, off + a + 1, off + b, off + a + 1, off + b + 1, off + b); }
    /* kapak kenarı (yuvarlatılmış) */
    const st = pos.length / 3, RS = 5; for (let i = 0; i <= NA; i++) { const a = a0 + (a1 - a0) * i / NA, p0 = pm(a); for (let k = 0; k <= RS; k++) { const th = Math.PI * k / RS, Rr = Ro + (Ri - Ro) * (1 - Math.cos(th)) / 2, v = P(Rr, p0 - .05 * Math.sin(th), a); pos.push(v.x, v.y, v.z); } }
    for (let i = 0; i < NA; i++) for (let k = 0; k < RS; k++) { const a = st + i * (RS + 1) + k, b = a + RS + 1; idx.push(a, a + 1, b, a + 1, b + 1, b); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals(); return geo;
  }

  /* ============ GÖZ ============ */
  M3.goz = {
    title: 'Göz', ico: '👁️', tag: 'Fotoreseptör · Elektromanyetik reseptör', cam: [6.6, 1.2, 1.3], target: [0, -.1, .45], labScale: .8,
    clip: { axis: 'x', min: -1.7, max: 1.7, def: 0, on: true },
    layers: [['Sert tabaka (sklera + kornea)', 'sert'], ['Damar tabaka (koroid · iris · kirpiksi cisim)', 'damar'], ['Ağ tabaka (retina ve damarları)', 'ag'], ['Saydam ortamlar (mercek · sıvılar)', 'saydam'], ['Çubuk ve koni hücreleri', 'recep'], ['Göz kapakları ve kirpikler', 'kapak'], ['Cisim ve ışık ışınları', 'isin']],
    task: 'Önce “Kesit” düğmesiyle gözü ikiye böl. Işık ışınının kornea → göz bebeği → mercek → camsı cisim → retina yolunu izle. Üç tabakayı (sert, damar, ağ) “Katmanlar” düğmeleriyle tek tek aç/kapat; sarı benek ile kör noktanın yerini bul ve retinadaki görüntünün nasıl oluştuğunu not et.',
    q: { q: 'Gözde ışığı algılayıp elektrik sinyaline dönüştüren yapı hangisidir?', o: ['Kornea', 'Mercek', 'Retina', 'Sklera'], a: 2, e: 'Retinadaki çubuk ve koni hücreleri (fotoreseptörler) ışığı algılar ve elektrik sinyaline çevirir. Kameradaki görüntü sensörüne benzer.' },
    build() {
      const { g, sels, ticks, S, G } = B(), api = {};
      const R = 1.5, th0 = .55;
      /* 1) SERT TABAKA */
      const sk = S(new THREE.Mesh(polarGeo(R, th0, Math.PI, 72), mt(0xf4f1ea, { roughness: .32, side: THREE.DoubleSide })), 'Sert tabaka (sklera)', 'En dıştaki, gözü dış etkilerden koruyan ve göz küresine şekil veren beyaz tabakadır. Ön tarafta saydamlaşarak korneayı oluşturur. Bu modelde iç yapıları görebilmen için saydam gösterilmiştir.', 'Koruyucu · şekil verici', 'sert');
      sk.userData.low = true; g.add(sk); g.add(G(new THREE.Mesh(polarGeo(1.452, th0 + .02, Math.PI, 64), mt(0xece6da, { roughness: .5, side: THREE.DoubleSide })), 'sert'));
      const rho = R * Math.sin(th0), z0 = R * Math.cos(th0), Rc = .95, al = Math.asin(rho / Rc), zc = z0 - Rc * Math.cos(al);
      const cor = S(new THREE.Mesh(polarGeo(Rc, 0, al, 40), glass(0xcfeeff, .32)), 'Kornea', 'Sert tabakanın ön tarafta saydamlaşmış bölümüdür. Işık göze buradan girer ve ilk kırılma burada olur; yani kornea ışığın kırılmasında görev alır.', 'Işığı kırar · göze giriş', 'sert');
      cor.userData.low = true; cor.position.z = zc; g.add(cor);

      /* 2) DAMAR TABAKA: koroid + kirpiksi cisim + iris */
      const koro = S(new THREE.Mesh(polarGeo(1.44, .95, Math.PI, 56), mt(0xffffff, { map: vesselTexture(), side: THREE.DoubleSide, roughness: .8 })), 'Damar tabaka (koroid)', 'Sert tabakanın altındaki, kan damarı bakımından zengin tabakadır; gözün beslenmesine katkı sağlar. Ön tarafta kirpiksi cisim ve irisle devam eder.', 'Beslenme', 'damar');
      koro.userData.low = true; g.add(koro); g.add(G(new THREE.Mesh(polarGeo(1.402, .97, Math.PI, 56), mt(0x7a1f22, { side: THREE.DoubleSide, roughness: .8 })), 'damar'));
      const prof = [[.72, .80], [1.0, .98], [1.17, .86], [1.23, .62], [1.13, .36], [.95, .34], [.78, .5], [.72, .8]].map(p => new THREE.Vector2(p[0], p[1]));
      const cil = S(new THREE.Mesh(new THREE.LatheGeometry(prof, 56).rotateX(Math.PI / 2), mt(0xb5523b, { side: THREE.DoubleSide, roughness: .7 })), 'Kirpiksi cisim', 'Damar tabakanın merceğin çevresindeki kalınlaşmış bölümüdür. İçindeki kas, merceğin şeklini (kalınlığını) değiştirmeye yardımcı olur; yakına bakarken mercek kalınlaşır, uzağa bakarken incelir (akomodasyon).', 'Mercek şeklini ayarlar', 'damar');
      g.add(cil);
      g.add(G(instMesh(new THREE.ConeGeometry(.032, .2, 6), mt(0xd9694c), 64, (i, d) => { const a = i / 64 * Math.PI * 2; d.position.set(Math.cos(a) * .84, Math.sin(a) * .84, .58); d.quaternion.setFromUnitVectors(V3(0, 1, 0), V3(-Math.cos(a), -Math.sin(a), .05).normalize()); }), 'damar'));
      const it = irisTexture(); api.irisTex = it;
      const iris = S(new THREE.Mesh(new THREE.CircleGeometry(1.0, 64), mt(0xffffff, { map: it.tex, transparent: true, alphaTest: .04, side: THREE.DoubleSide, roughness: .55 })), 'İris', 'Gözün renkli kısmıdır; ortasındaki açıklığın (göz bebeğinin) çapını ayarlayarak göze giren ışık miktarını düzenler. Aydınlıkta göz bebeği küçülür, karanlıkta büyür.', 'Işık miktarını ayarlar', 'damar');
      { const p = iris.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, .07 * (1 - Math.hypot(p.getX(i), p.getY(i)))); p.needsUpdate = true; }
      iris.position.z = 1.0; g.add(iris);
      const pup = S(new THREE.Mesh(new THREE.CircleGeometry(1, 40), mt(0x000000, { transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })), 'Göz bebeği', 'İrisin ortasındaki açıklıktır; ışık göze bu açıklıktan geçerek girer. Çapı iris tarafından ayarlanır.', 'Işığın geçtiği açıklık', 'damar');
      pup.userData.hlOp = .55; pup.position.z = 1.075; g.add(pup);
      api.setPupil = f => { f = Math.max(.18, Math.min(.88, f)); it.draw(f); pup.scale.set(f, f, 1); api.pupil = f; };

      /* 3) SAYDAM ORTAMLAR */
      const lens = S(ellip(1, 1, 1, mt(0xe6f4ff, { transparent: true, opacity: .62, depthWrite: false, side: THREE.DoubleSide, roughness: .08, metalness: .1, emissive: 0x101820 }), 40), 'Mercek (göz merceği)', 'Işığı retina üzerinde odaklayan saydam, esnek yapıdır. Kirpiksi cisimdeki kas ve askı bağları sayesinde kalınlığı değişir: yakına bakarken kalınlaşır, uzağa bakarken incelir (akomodasyon).', 'Işığı retinaya odaklar', 'saydam');
      lens.position.z = .62; g.add(lens);
      const ligN = 72, lp = new Float32Array(ligN * 6), lgeo = new THREE.BufferGeometry(); lgeo.setAttribute('position', new THREE.BufferAttribute(lp, 3));
      const lig = S(new THREE.LineSegments(lgeo, new THREE.LineBasicMaterial({ color: 0xece6d2 })), 'Askı bağları', 'Merceği kirpiksi cisme bağlayan ince liflerdir. Kirpiksi kas kasılınca bağlar gevşer, mercek kalınlaşır; kas gevşeyince bağlar gerilir, mercek incelir.', 'Merceği asar', 'saydam');
      lig.frustumCulled = false; g.add(lig);
      api.setAccom = f => { f = Math.max(0, Math.min(1, f)); const rx = .60 - .11 * f, rz = .19 + .22 * f; lens.scale.set(rx, rx, rz); for (let i = 0; i < ligN; i++) { const a = i / ligN * Math.PI * 2, c = Math.cos(a), s = Math.sin(a); lp.set([.76 * c, .76 * s, .58, rx * c, rx * s, .62], i * 6); } lgeo.attributes.position.needsUpdate = true; api.accom = f; };
      const aq = S(ellip(.88, .88, .62, glass(0x9fd8ff, .16), 28), 'Sulu sıvı (göz içi sıvısı)', 'Kornea ile mercek arasını dolduran, gözün ön kısmının beslenmesine ve şeklini korumasına yardımcı olan saydam sıvıdır; ışığın geçişine katkı sağlar.', 'Saydam ortam', 'saydam');
      aq.userData.low = true; aq.position.z = 1.06; g.add(aq);
      const vit = S(ellip(1.3, 1.3, 1.52, glass(0xa8ffd9, .13), 36), 'Camsı sıvı (camsı cisim)', 'Merceğin arkasında göz küresinin büyük bölümünü dolduran, jelimsi saydam sıvıdır. Gözün şeklini korumaya ve ışığın retinaya geçişine katkı sağlar.', 'Şekli korur · ışığı geçirir', 'saydam');
      vit.userData.low = true; vit.position.z = -.2; g.add(vit);

      /* 4) AĞ TABAKA */
      const ret = S(new THREE.Mesh(polarGeo(1.38, 1.15, Math.PI, 64), mt(0xffffff, { map: fundusTexture(), side: THREE.DoubleSide, roughness: .7 })), 'Ağ tabaka (retina)', 'En içteki, ışığa duyarlı reseptörleri (fotoreseptörler: çubuk ve koni hücreleri) içeren tabakadır. Işık burada sinirsel sinyallere dönüştürülür. Retinada görüntü ters oluşur; beyin düzeltir.', 'Fotoreseptörler (nöron yapısında)', 'ag');
      ret.userData.low = true; g.add(ret); g.add(G(new THREE.Mesh(polarGeo(1.394, 1.15, Math.PI, 64), mt(0xf0bf45, { side: THREE.DoubleSide, roughness: .6 })), 'ag'));
      const mac = S(new THREE.Mesh(new THREE.SphereGeometry(1.384, 32, 8, 0, Math.PI * 2, Math.PI - .17, .17).rotateX(Math.PI / 2), mt(0xf0c33c, { emissive: 0x4a3600, side: THREE.DoubleSide })), 'Sarı benek', 'Retinada ışık ışınlarının odaklandığı ve görmenin en net olduğu bölgedir. Koni reseptörleri burada yoğundur; renkli ve ayrıntılı görme bu bölgede en iyidir.', 'En net görme · koni yoğun', 'ag');
      g.add(mac);
      const dl = .42, D = V3(0, -Math.sin(dl), -Math.cos(dl));
      const disc = S(new THREE.Mesh(new THREE.SphereGeometry(1.389, 24, 6, 0, Math.PI * 2, Math.PI - .1, .1).rotateX(Math.PI / 2).rotateX(-dl), mt(0xfff2cf, { emissive: 0x3a3012, side: THREE.DoubleSide })), 'Kör nokta', 'Optik sinirin gözden çıktığı bölgedir. Burada fotoreseptör (çubuk/koni) bulunmadığı için ışık algılanmaz; bu yüzden “kör nokta” denir.', 'Fotoreseptör yok', 'ag');
      g.add(disc);
      const nerve = S(cylBetween(D.clone().multiplyScalar(1.4), D.clone().multiplyScalar(3.6), .21, mt(0xf3d27e, { emissive: 0x2a2000, roughness: .5 })), 'Optik sinir (görme siniri)', 'Retinada oluşan sinirsel sinyalleri (uyartıları) beyne taşır. Gözden çıktığı yerde fotoreseptör bulunmaz (kör nokta).', 'Uyartıyı beyne iletir', 'ag');
      g.add(nerve);
      const sheath = cylBetween(D.clone().multiplyScalar(1.5), D.clone().multiplyScalar(3.5), .3, glass(0xfff4cc, .25)); g.add(G(sheath, 'ag'));
      [[-.06, .04, 0xc8302c], [-.06, -.05, 0x3550c0]].forEach(([dx, dy, c]) => g.add(S(cylBetween(D.clone().multiplyScalar(1.3).add(V3(dx, dy, 0)), D.clone().multiplyScalar(3.62).add(V3(dx, dy, 0)), .035, mt(c, { roughness: .4 })), 'Retina damarları', 'Retinayı besleyen kan damarları optik sinirin içinden göze girer ve kör noktadan çıkarak retina yüzeyine dağılır. Kırmızı: atardamar, mavi: toplardamar.', 'Beslenme', 'ag')));
      /* retina damarları */
      const e1 = V3(1, 0, 0), tw = D.clone().negate().normalize();/* kör noktadan sarı beneğe doğru */
      const base = D.clone().normalize(); const side = new THREE.Vector3().crossVectors(base, e1).normalize();
      const vm = [mt(0xc52f2a), mt(0x7d2150)];
      { const vr = srand(41), vRad = 1.372;
        const branch = (start, dir, len, w, depth, col) => { const pts = [start.clone()]; let p = start.clone(), d = dir.clone(); const n = 12; for (let s2 = 1; s2 <= n; s2++) { const axis = p.clone().normalize(); d.addScaledVector(new THREE.Vector3().crossVectors(axis, d).normalize(), (vr() - .5) * .5); d.sub(axis.clone().multiplyScalar(d.dot(axis))).normalize(); p = p.clone().addScaledVector(d, len / n).normalize().multiplyScalar(vRad); pts.push(p); } g.add(G(curveTube(pts, w, vm[col], 36), 'ag')); if (depth > 0) [5, 9].forEach(k => { const q = pts[k], axis = q.clone().normalize(), dd = pts[k + 1].clone().sub(q).normalize(), sd = new THREE.Vector3().crossVectors(axis, dd).normalize().multiplyScalar(vr() < .5 ? 1 : -1); branch(q, dd.clone().add(sd.multiplyScalar(.9)).normalize(), len * .5, w * .65, depth - 1, col); }); };
        const c0 = D.clone().multiplyScalar(vRad);
        for (let k = 0; k < 10; k++) { const psi = k / 10 * Math.PI * 2 + .2, dir0 = e1.clone().multiplyScalar(Math.cos(psi)).add(side.clone().multiplyScalar(Math.sin(psi))); branch(c0, dir0, .95 + vr() * .5, .018, 2, k % 2); } }
      {
        const vv = S(new THREE.Mesh(new THREE.SphereGeometry(.001), mt(0xc52f2a)), 'Retina damarları', 'Retinayı besleyen kan damarları kör noktadan çıkarak retina yüzeyine dağılır.', 'Beslenme', 'ag'); vv.visible = false; vv.userData.nolab = true; vv.position.set(.5, .5, -1.3); g.add(vv);
      }
      /* çubuk ve koniler (görünüm için küçük “iğneler”) */
      const rr = srand(23);
      const dirAround = (phi, az) => V3(Math.sin(phi) * Math.cos(az), Math.sin(phi) * Math.sin(az), -Math.cos(phi));
      const cones = S(instMesh(new THREE.ConeGeometry(.02, .06, 6), mt(0xe9772f, { emissive: 0x2a0a00 }), 170, (i, d) => { const phi = Math.pow(rr(), .8) * .42, dir = dirAround(phi, rr() * 6.283); d.position.copy(dir.clone().multiplyScalar(1.34)); d.quaternion.setFromUnitVectors(V3(0, 1, 0), dir.clone().negate()); }), 'Koni hücreleri', 'Aydınlıkta etkin, renkli görmeyi ve ayrıntılı görmeyi sağlayan fotoreseptörlerdir. Sarı benekte yoğundur.', 'Fotoreseptör · renkli görme', 'recep');
      const rods = S(instMesh(new THREE.CylinderGeometry(.008, .008, .065, 5), mt(0xeb9a4c, { emissive: 0x1a0a00 }), 520, (i, d) => { const phi = .5 + rr() * 1.45, dir = dirAround(phi, rr() * 6.283); if (dir.angleTo(D) < .14) { d.scale.set(0, 0, 0); } d.position.copy(dir.clone().multiplyScalar(1.34)); d.quaternion.setFromUnitVectors(V3(0, 1, 0), dir.clone().negate()); }), 'Çubuk hücreleri', 'Az ışıkta etkin olan, renkli görme sağlamayan fotoreseptörlerdir. Retinanın çevresinde yoğundur; loş ışıkta görmeyi sağlar.', 'Fotoreseptör · az ışıkta görme', 'recep');
      cones.userData.low = rods.userData.low = false; g.add(cones, rods);
      /* ön oda ve arka oda */
      { const pr = [V3(.001, 1.03, 0), V3(.9, 1.03, 0), V3(.96, 1.1, 0)]; for (let k = 0; k <= 12; k++) { const rr2 = .96 * (1 - k / 12); pr.push(V3(Math.max(.001, rr2), zc + Math.sqrt(Math.max(0, Rc * Rc - rr2 * rr2)) - .02, 0)); }
        const oo = S(new THREE.Mesh(new THREE.LatheGeometry(pr, 48).rotateX(Math.PI / 2), glass(0xbfe8ff, .1)), 'Ön oda', 'Kornea ile iris arasındaki boşluktur; içi sulu sıvı (göz içi sıvısı) ile doludur. Bu sıvı korneayı ve merceği besler.', 'Saydam ortam · sulu sıvı', 'saydam'); oo.userData.low = true; oo.userData.hlOp = .45; g.add(oo);
        const ar = S(new THREE.Mesh(new THREE.LatheGeometry([V3(.6, .95, 0), V3(.98, .97, 0), V3(1.0, .8, 0), V3(.7, .76, 0), V3(.6, .95, 0)], 48).rotateX(Math.PI / 2), glass(0xbfe8ff, .12)), 'Arka oda', 'İris ile mercek arasındaki dar boşluktur. Sulu sıvı burada kirpiksi cisim tarafından üretilir ve göz bebeğinden geçerek ön odaya akar.', 'Saydam ortam · sulu sıvı', 'saydam'); ar.userData.low = true; ar.userData.hlOp = .5; g.add(ar); }
      /* göz kapakları ve kirpikler */
      { const skin = mt(0xd99a82, { roughness: .6, side: THREE.DoubleSide });
        const up = a => .62 + .6 * Math.pow(1 - Math.sin(a), 1.15), lo = a => .9 + .45 * Math.pow(1 - Math.abs(Math.sin(a)), 1.15);
        const ul = S(new THREE.Mesh(lidGeo(.06 * Math.PI, .94 * Math.PI, up, 1.66, 1.56, 1.55), skin), 'Göz kapağı', 'Gözü dış etkilerden korur. Göz kırpıldığında gözyaşı göz yüzeyine yayılır; göz nemli ve temiz kalır. Kirpikler göze toz ve yabancı cisim girmesini önler.', 'Koruma', 'kapak'); g.add(ul);
        const ll = S(new THREE.Mesh(lidGeo(1.06 * Math.PI, 1.94 * Math.PI, lo, 1.64, 1.56, 1.5), skin), 'Göz kapağı', 'Gözü dış etkilerden korur. Göz kırpıldığında gözyaşı göz yüzeyine yayılır; göz nemli ve temiz kalır. Kirpikler göze toz ve yabancı cisim girmesini önler.', 'Koruma', 'kapak'); g.add(ll);
        const lash = (a0, a1, pm, n, upw) => S(instMesh(new THREE.CylinderGeometry(.006, .011, .3, 4).translate(0, .15, 0), mt(0x2a1a12), n, (i, d) => { const a = a0 + (a1 - a0) * (i + .5) / n, p = pm(a) - .02, base = polarPt(1.66, p, a), out = base.clone().normalize(), dir = out.clone().multiplyScalar(.55).add(V3(0, upw, .55)).normalize(); d.position.copy(base); d.quaternion.setFromUnitVectors(V3(0, 1, 0), dir); d.scale.setScalar(.75 + .5 * Math.sin(Math.PI * (i + .5) / n)); }), 'Göz kapağı', 'Gözü dış etkilerden korur. Kirpikler göze toz ve yabancı cisim girmesini önler.', 'Koruma', 'kapak');
        g.add(lash(.16 * Math.PI, .84 * Math.PI, up, 60, .5), lash(1.18 * Math.PI, 1.82 * Math.PI, lo, 40, -.5)); }
      /* nesne + ışık ışınları + ters görüntü */
      const arrowMat = mt(0x37d67a, { emissive: 0x0b3a1f });
      const oz = 4.2, obj = new THREE.Group();
      obj.add(cylBetween([0, 0, oz], [0, .78, oz], .045, arrowMat), at(new THREE.Mesh(new THREE.ConeGeometry(.12, .24, 12), arrowMat), 0, .9, oz)); g.add(G(obj, 'isin'));
      const imgMat = mt(0xffa733, { emissive: 0x442200 });
      const imgM = S(new THREE.Mesh(new THREE.ConeGeometry(.07, .16, 10), imgMat), 'Retinadaki ters görüntü', 'Retinada oluşan görüntü ters ve küçüktür. Görme sinirleri aracılığıyla beyne ulaşan bilgi, beyinde yorumlanırken düzeltilir.', 'Ters görüntü · beyin düzeltir', 'isin');
      imgM.rotation.x = Math.PI; at(imgM, 0, -.28, -1.34); g.add(imgM); g.add(G(cylBetween([0, 0, -1.34], [0, -.2, -1.34], .025, imgMat), 'isin'));
      const rayMat = new THREE.LineBasicMaterial({ color: 0xffd34d });
      [[.62, 0], [.3, 0], [-.18, 0]].forEach(([h], k) => {
        const pts = [V3(0, .9, oz), V3(0, h, 1.66), V3(0, h * .55, .9), V3(0, h * .45, .3), V3(0, -.28, -1.34)];
        const ln = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), rayMat); g.add(G(ln, 'isin'));
        const fl = pathFollower(0xffe680, .075, pts, .22, k * .33); g.add(G(fl.orb, 'isin')); ticks.push(t => fl.tick(t));
      });
      { const pts = [V3(0, 0, oz), V3(0, 0, -1.34)]; const ln = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), rayMat); g.add(G(ln, 'isin')); const fl = pathFollower(0xffe680, .07, pts, .22, .1); g.add(G(fl.orb, 'isin')); ticks.push(t => fl.tick(t)); }
      /* optik sinir boyunca giden uyartı */
      { const pts = [D.clone().multiplyScalar(1.4), D.clone().multiplyScalar(3.6)]; const fl = pathFollower(0xffffff, .1, pts, .3, 0); g.add(fl.orb); ticks.push(t => fl.tick(t)); }
      api.setPupil(.42); api.setAccom(.3);
      g.userData.api = api;
      return { g, sels, ticks, api };
    }
  };

  /* ============ RETİNA (ayrıntılı kesit) ============ */
  M3.retina = {
    title: 'Retina (ayrıntı)', ico: '🔬', tag: 'Çubuk · Koni · Nöron', cam: [6.2, 2.6, 7.4], target: [0, .2, 0], labScale: 1,
    layers: [['Reseptör katmanı (çubuk + koni)', 'rec'], ['Çift kutuplu nöronlar', 'bip'], ['Ganglion nöronları ve lifleri', 'gan'], ['Pigmentli epitel + damar tabaka', 'pig'], ['Işık ve sinyal', 'sig']],
    task: 'Işığın yukarıdan aşağıya yolunu izle. Çubuk ve koni hücrelerini ayırt et (şekilleri nasıl farklı?). Sinyalin fotoreseptörden bipolar nörona, oradan ganglion nöronuna ve optik sinire nasıl ilerlediğini takip et.',
    q: { q: 'Retinadaki fotoreseptörlerden hangisi aydınlıkta etkindir ve renkli görmeyi sağlar?', o: ['Çubuk hücreleri', 'Koni hücreleri', 'Kör nokta', 'Ganglion lifleri'], a: 1, e: 'Koni hücreleri aydınlıkta etkindir, renkli ve ayrıntılı görmeyi sağlar; sarı benekte yoğundur. Çubuk hücreleri az ışıkta etkindir ve renk ayırt etmez.' },
    build() {
      const { g, sels, ticks, S, G } = B();
      const cols = []; for (let i = 0; i < 9; i++) cols.push(-2.4 + i * .6);
      const zs = [-.6, 0, .6];
      /* reseptörler */
      const cm = [0xff6b6b, 0x59e08a, 0x6b8aff];
      let ci = 0;
      cols.forEach((x, ix) => zs.forEach((z, iz) => {
        const isCone = (ix + iz) % 3 === 1;
        if (isCone) {
          const c = cm[(ci++) % 3];
          const body = S(new THREE.Mesh(new THREE.ConeGeometry(.2, 1.15, 14), mt(c, { emissive: new THREE.Color(c).multiplyScalar(.18).getHex() })), 'Koni hücresi', 'Aydınlıkta etkin, kısa ve konik dış bölümlü fotoreseptördür. Renkli ve ayrıntılı görmeyi sağlar; sarı benekte yoğundur. Nöron yapısındadır.', 'Fotoreseptör · renkli görme', 'rec');
          body.rotation.x = Math.PI; at(body, x, -.95, z); g.add(body);
          g.add(G(at(ellip(.16, .26, .16, mt(c)), x, -.1, z), 'rec'));
        } else {
          const out = S(new THREE.Mesh(new THREE.CylinderGeometry(.075, .075, 1.35, 10), mt(0xb7d0ff, { emissive: 0x0a1a3a })), 'Çubuk hücresi', 'Az ışıkta etkin, ince ve uzun dış bölümlü fotoreseptördür. Renkli görme sağlamaz; retinanın çevresinde yoğundur. Nöron yapısındadır.', 'Fotoreseptör · loş ışıkta görme', 'rec');
          at(out, x, -.98, z); g.add(out);
          g.add(G(at(ellip(.1, .22, .1, mt(0x8fa9d8)), x, -.1, z), 'rec'));
        }
      }));
      /* bipolar nöronlar */
      const bip = [];
      cols.forEach((x, ix) => zs.forEach((z, iz) => {
        if ((ix + iz) % 2 === 0 || iz === 1) { const b = S(ellip(.17, .26, .17, mt(0x46c97a)), 'Çift kutuplu (bipolar) nöron', 'Fotoreseptörlerden aldığı sinyali ganglion nöronlarına aktaran ara nörondur.', 'Sinyali aktarır', 'bip'); at(b, x, 1.2, z); g.add(b); bip.push([x, z]); }
        if (iz === 1) g.add(G(cylBetween([x, .02, z], [x, .98, z], .02, mt(0x7de3a5)), 'bip'));
      }));
      /* ganglion nöronları + lifler */
      cols.forEach((x, ix) => { if (ix % 2 === 0) [-.4, .4].forEach((z, k) => { const gl = S(ellip(.28, .24, .28, mt(0x7a6af0)), 'Ganglion nöronu', 'Bipolar nöronlardan sinyal alır; aksonları retina yüzeyinde toplanarak optik siniri oluşturur.', 'Uyartıyı optik sinire iletir', 'gan'); at(gl, x, 2.35, z); g.add(gl); g.add(G(cylBetween([x, 1.4, z], [x, 2.12, z], .022, mt(0xa99bff)), 'gan')); }); });
      for (let k = 0; k < 4; k++) { const z = -.75 + k * .5; const fb = S(curveTube([[-2.9, 2.62, z], [-.5, 2.64, z], [1.9, 2.62, z * .4], [3.35, 2.45, 0]], .045, mt(0xc7bcff), 28), 'Optik sinir lifleri (ganglion aksonları)', 'Ganglion nöronlarının aksonlarıdır; kör noktada toplanıp optik siniri oluşturur ve sinyali beyne taşır.', 'Uyartıyı beyne taşır', 'gan'); g.add(fb); }
      const on = S(cylBetween([3.3, 2.45, 0], [5.1, 2.45, 0], .3, mt(0xf5c542, { emissive: 0x3a2c00 })), 'Optik sinir', 'Retinadaki ganglion nöronlarının aksonlarından oluşur; görme bilgisini beyne taşır.', 'Beyne giden yol', 'gan'); g.add(on);
      /* pigmentli epitel + koroid */
      const pig = S(new THREE.Mesh(new THREE.BoxGeometry(6.2, .22, 2.6), mt(0x3a2418)), 'Pigmentli epitel', 'Reseptörlerin arkasında yer alan koyu renkli tabakadır; fazla ışığı soğurur ve fotoreseptörleri besler.', 'Işığı soğurur', 'pig'); at(pig, 0, -1.78, 0); g.add(pig);
      const kor = S(new THREE.Mesh(new THREE.BoxGeometry(6.2, .5, 2.6), mt(0x7a2f2f)), 'Damar tabaka (koroid)', 'Kan damarı bakımından zengin tabakadır; retinanın beslenmesine katkı sağlar.', 'Beslenme', 'pig'); at(kor, 0, -2.14, 0); g.add(kor);
      [-1, 0, 1].forEach(z => g.add(G(cylBetween([-3, -2.14, z * .7], [3, -2.14, z * .7], .07, mt(0xd8433a)), 'pig')));
      /* ışık ve sinyal */
      const lights = [], sig = [];
      [[-1.2, 0], [0, 0], [1.2, 0], [-.6, .6], [.6, -.6]].forEach(([x, z], k) => { const o = glow(0xffe680, .09); g.add(G(o, 'sig')); lights.push({ o, x, z, off: k * .2 }); });
      ticks.push((t) => lights.forEach(l => { const u = (t * .35 + l.off) % 1; l.o.position.set(l.x, 4.3 - u * 5.4, l.z); l.o.material.opacity = 1; }));
      const sp = [[-1.2, 0]].map(([x, z]) => { const pts = [V3(x, -.5, z), V3(x, 1.2, z), V3(x, 2.3, z), V3(x - .3, 2.62, z), V3(1.9, 2.62, z * .4), V3(3.35, 2.45, 0), V3(5.1, 2.45, 0)]; return pathFollower(0xffffff, .11, pts, .17, 0); });
      sp.forEach(s => { g.add(G(s.orb, 'sig')); ticks.push(t => s.tick(t)); });
      g.position.y = 0;
      return { g, sels, ticks };
    }
  };
})();
