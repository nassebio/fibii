/* Nasse Biology — 3B modeller (Three.js r128, prosedürel). Dışarıdan model dosyası gerekmez.
   Bu dosya: ortak yardımcılar + nöron + sinaps modelleri + 3B görüntüleyici (etiket, kesit, katman, odaklama) + simülasyon sahnesi.
   Duyu organı modelleri: eye3d.js, ear3d.js, chem3d.js, skin3d.js */
const M3 = {};
const M3_ORDER = ['goz', 'retina', 'kulak', 'korti', 'denge', 'burun', 'kokuepiteli', 'dil', 'tattomurcugu', 'deri', 'deriresept', 'noron', 'sinaps'];
const mt = (c, o) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .5, metalness: .05 }, o || {}));
const glass = (c, op) => mt(c, { transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide });
function B() {
  const g = new THREE.Group(), sels = [], ticks = [];
  /* S: seçilebilir parça (ad, bilgi, etiket, katman) · G: seçilemeyen ama katmana bağlı parça */
  const S = (m, n, i, t, grp) => { m.material = m.material.clone(); m.userData = { name: n, info: i, tag: t || '', grp: grp || '' }; sels.push(m); return m; };
  const G = (m, grp) => { m.userData.grp = grp; return m; };
  return { g, sels, ticks, S, G };
}
function tubeGeo(pts, r, seg) {
  const c = new THREE.CatmullRomCurve3(pts.map(p => Array.isArray(p) ? new THREE.Vector3(p[0], p[1], p[2]) : p));
  return new THREE.TubeGeometry(c, seg || Math.max(10, pts.length * 8), r, 8, false);
}
function at(m, x, y, z) { m.position.set(x, y, z); return m; }
function glow(color, r) { return new THREE.Mesh(new THREE.SphereGeometry(r || .09, 12, 12), new THREE.MeshBasicMaterial({ color })); }

/* ---- ek yardımcılar ---- */
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
function srand(seed) { let a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function cylBetween(a, b, r, mat, seg, rTop) {
  a = Array.isArray(a) ? V3(...a) : a.clone(); b = Array.isArray(b) ? V3(...b) : b.clone();
  const d = b.clone().sub(a), len = d.length() || .0001;
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop === undefined ? r : rTop, r, len, seg || 10), mat);
  m.position.copy(a).addScaledVector(d, .5); m.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize()); return m;
}
function ellip(rx, ry, rz, mat, seg) { const m = new THREE.Mesh(new THREE.SphereGeometry(1, seg || 24, Math.max(10, Math.round((seg || 24) * .75))), mat); m.scale.set(rx, ry, rz); return m; }
function canvasTex(w, h, fn) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); fn(x, w, h); const t = new THREE.CanvasTexture(c); t.anisotropy = 4; t._c = c; t._x = x; return t; }
/* Kutbu +z olan küre kabuğu (t0..t1 kutup açısı, radyan) */
function polarGeo(R, t0, t1, seg) { return new THREE.SphereGeometry(R, seg || 56, 40, 0, Math.PI * 2, t0, t1 - t0).rotateX(Math.PI / 2); }
function polarPt(R, polar, az) { return V3(R * Math.sin(polar) * Math.cos(az), R * Math.sin(polar) * Math.sin(az), R * Math.cos(polar)); }
function instMesh(geo, mat, n, fn) {
  const im = new THREE.InstancedMesh(geo, mat, n), d = new THREE.Object3D();
  for (let i = 0; i < n; i++) { d.position.set(0, 0, 0); d.quaternion.identity(); d.scale.set(1, 1, 1); fn(i, d); d.updateMatrix(); im.setMatrixAt(i, d.matrix); }
  im.instanceMatrix.needsUpdate = true; im.frustumCulled = false; return im;
}
function curveTube(pts, r, mat, seg, closed) { const c = new THREE.CatmullRomCurve3(pts.map(p => Array.isArray(p) ? V3(...p) : p), !!closed); return new THREE.Mesh(new THREE.TubeGeometry(c, seg || pts.length * 8, r, 8, !!closed), mat); }
function pathFollower(color, r, pts, speed, off) {
  const c = new THREE.CatmullRomCurve3(pts.map(p => Array.isArray(p) ? V3(...p) : p)); const orb = glow(color, r || .08);
  return { orb, curve: c, tick: t => orb.position.copy(c.getPoint((((t * (speed || .25)) + (off || 0)) % 1 + 1) % 1)) };
}
function labelSprite(text, s) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 96; const x = c.getContext('2d');
  let fs = 44; x.font = '800 ' + fs + 'px Nunito, Arial, sans-serif'; while (x.measureText(text).width > 468 && fs > 20) { fs -= 2; x.font = '800 ' + fs + 'px Nunito, Arial, sans-serif'; }
  const w = x.measureText(text).width + 36, X = (512 - w) / 2;
  x.fillStyle = 'rgba(6,24,47,.88)'; x.strokeStyle = '#22d3ee'; x.lineWidth = 4; x.beginPath(); x.roundRect ? x.roundRect(X, 14, w, 68, 26) : x.rect(X, 14, w, 68); x.fill(); x.stroke();
  x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 256, 49);
  const t = new THREE.CanvasTexture(c); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, depthWrite: false, transparent: true }));
  const k = (s || 1) * .36; sp.scale.set(k * 512 / 96, k, 1); sp.renderOrder = 999; return sp;
}
/* g içindeki tüm malzemelere kesit düzlemi uygular (plane=null kaldırır) */
function applyClip(root, plane) {
  root.traverse(o => { if (!(o.isMesh || o.isLine || o.isPoints)) return;[].concat(o.material).forEach(m => { if (m._side0 === undefined) m._side0 = m.side; m.clippingPlanes = plane ? [plane] : []; m.side = plane ? THREE.DoubleSide : m._side0; m.needsUpdate = true; }); });
}
function addLights(scene) {
  scene.add(new THREE.AmbientLight(0xffffff, .78));
  const d1 = new THREE.DirectionalLight(0xffffff, .9); d1.position.set(4, 6, 6); scene.add(d1);
  const d2 = new THREE.PointLight(0xcfe9ff, .45, 40); d2.position.set(-6, -2, 4); scene.add(d2);
  const d3 = new THREE.DirectionalLight(0xbcd8ff, .35); d3.position.set(-5, 3, -6); scene.add(d3);
}

/* ============ NÖRON ============ */
M3.noron = {
  title: 'Nöron', ico: '🧬', tag: 'Hücre gövdesi · Dendrit · Akson', cam: [0, 3, 9],
  task: 'Nöronun 7 yapısını tek tek tıkla: dendrit, hücre gövdesi, çekirdek, miyelin kılıf, Ranvier boğumu, akson ve akson ucu. Uyartının ilerleme yönünü takip et.',
  q: { q: 'Uyartı nöronda hangi yönde ilerler?', o: ['Akson ucundan dendrite', 'Dendritten aksona', 'Ranvier boğumundan çekirdeğe', 'Her zaman çift yönlü'], a: 1, e: 'Nöronlarda uyartının ilerleme yönü dendritten aksona doğrudur.' },
  build() {
    const { g, sels, ticks, S } = B();
    const soma = S(new THREE.Mesh(new THREE.SphereGeometry(.85, 32, 24), glass(0x7a6af0, .55)), 'Hücre gövdesi', 'Çekirdek, organeller ve sitoplazmayı bulundurur. Enerji ihtiyacı fazla olduğundan çok sayıda mitokondri vardır; nörofibriller nörona şekil verir.', 'Nöronun yaşamsal faaliyet merkezi');
    at(soma, -3.2, 0, 0); soma.userData.low = true; g.add(soma);
    const nuc = S(new THREE.Mesh(new THREE.SphereGeometry(.35, 24, 20), mt(0x4b2bb8)), 'Çekirdek', 'Hücrenin faaliyetlerini yönetir ve kalıtsal bilgiyi taşır.', 'Hücre gövdesi');
    at(nuc, -3.2, 0, 0); g.add(nuc);
    const dm = mt(0x4da3ff);
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2 + .3, dx = -Math.cos(a) * .2 - .2, dy = Math.sin(a), dz = Math.cos(a * 2) * .6;
      const x0 = -3.2 + Math.cos(a) * -.8, y0 = Math.sin(a) * .8;
      const ex = -3.2 - Math.abs(Math.cos(a)) * 1.9 - .6, ey = Math.sin(a) * 1.9, ez = dz;
      const d = S(new THREE.Mesh(tubeGeo([[x0, y0, 0], [(x0 + ex) / 2, (y0 + ey) / 2, ez / 2], [ex, ey, ez]], .06), dm), 'Dendrit', 'Diğer nöron ve reseptörlerden gelen uyarıları alır ve elektrik sinyalleri hâlinde hücre gövdesine iletir.', 'Uyarıyı alır');
      g.add(d);
      [-.5, .5].forEach(s => { const b = S(new THREE.Mesh(tubeGeo([[ex, ey, ez], [ex - .3, ey + s * .4, ez + s * .2], [ex - .6, ey + s * .7, ez + s * .3]], .035), dm), 'Dendrit', 'Diğer nöron ve reseptörlerden gelen uyarıları alır ve elektrik sinyalleri hâlinde hücre gövdesine iletir.', 'Uyarıyı alır'); g.add(b); });
    }
    const axon = S(new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, 6.4, 12).rotateZ(Math.PI / 2), mt(0x6f6ae0)), 'Akson', 'Hücre gövdesinden çıkan, dendrite göre daha kalın ve uzun uzantıdır. Uyartıyı akson ucuna iletir. Çap kalınlaştıkça iletim hızlanır.', 'Uyartıyı iletir');
    at(axon, -.1, 0, 0); g.add(axon);
    for (let i = 0; i < 5; i++) {
      const x = -2.0 + i * 1.0 + .43;
      const my = S(new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .8, 20).rotateZ(Math.PI / 2), mt(0xf5c542)), 'Miyelin kılıf', 'Schwann hücrelerinin akson çevresinde oluşturduğu lipoprotein yapılı örtüdür. Elektriksel yalıtım sağlar ve uyartı iletimini hızlandırır.', 'Yalıtım');
      at(my, x, 0, 0); g.add(my);
      const nd = S(new THREE.Mesh(new THREE.TorusGeometry(.13, .06, 10, 20).rotateY(Math.PI / 2), mt(0x3be0c8)), 'Ranvier boğumu', 'Miyelin kılıfın kesintiye uğradığı (yalıtımsız) yerlerdir.', 'Miyelinsiz aralık');
      at(nd, x + .5, 0, 0); g.add(nd);
    }
    const sch = S(new THREE.Mesh(new THREE.SphereGeometry(.25, 16, 12), mt(0x7de3d1)), 'Schwann hücresi', 'Akson etrafında miyelin kılıfı oluşturan hücredir.', 'Miyelini yapar');
    sch.scale.set(1.4, .6, .8); at(sch, -1.6, .33, 0); g.add(sch);
    const tx = 3.0, tp = [[1.6, 1], [2.1, .4], [2.1, -.4], [1.6, -1]];
    tp.forEach(([dx, dy]) => {
      const br = S(new THREE.Mesh(tubeGeo([[tx - .2, 0, 0], [tx + dx * .4, dy * .35, 0], [tx + dx, dy, 0]], .05), mt(0x6f6ae0)), 'Akson ucu', 'Aksonun sonlandığı ve dallanarak genişlediği bölgedir. Her dal bir sinaptik uçla sonlanır; salgılanan kimyasal maddelerle uyartı diğer hücreye aktarılır.', 'Uyartıyı aktarır');
      g.add(br);
      const bt = S(new THREE.Mesh(new THREE.SphereGeometry(.17, 16, 16), mt(0xffc93c, { emissive: 0x664400 })), 'Sinaptik uç', 'Akson ucundaki dalların sonlandığı uçtur; içindeki keseciklerde nörotransmitter bulunur ve uyartıyı alıcı hücreye aktarır.', 'Sinaps');
      at(bt, tx + dx, dy, 0); g.add(bt);
    });
    const pulse = glow(0xffffff, .18); g.add(pulse);
    ticks.push(t => { const u = (t * .22) % 1; pulse.position.set(-2.4 + u * 5.2, 0, 0); pulse.scale.setScalar(1 + Math.sin(t * 8) * .15); });
    return { g, sels, ticks };
  }
};

/* ============ SİNAPS ============ */
M3.sinaps = {
  title: 'Sinaps', ico: '🔗', tag: 'Kimyasal sinaps', cam: [5, 0, 7],
  task: 'Sinaptik kesecikleri, sinaps boşluğunu ve reseptörleri tıkla. Nörotransmitterlerin hangi yönde hareket ettiğini izle.',
  q: { q: 'Nörotransmitterler sinaps boşluğuna döküldükten sonra ne yapar?', o: ['Miyelin kılıfa bağlanır', 'Komşu hücrenin zarındaki reseptörlere bağlanır', 'Çekirdeğe girer', 'Akson ucunu parçalar'], a: 1, e: 'Nörotransmitterler komşu hücrenin zarındaki reseptörlere bağlanır ve uyartı komşu hücreye aktarılır.' },
  build() {
    const { g, sels, ticks, S } = B();
    const neck = S(new THREE.Mesh(new THREE.CylinderGeometry(.35, .7, 1.4, 24), glass(0x4da3ff, .55)), 'Akson ucu', 'Aksonun sonlanıp genişlediği bölgedir; uyartı buraya elektrokimyasal iletimle ulaşır.', 'Uyartının geldiği yer');
    at(neck, 0, 3.0, 0); g.add(neck);
    const bulb = S(new THREE.Mesh(new THREE.SphereGeometry(1.3, 36, 28), glass(0x4da3ff, .5)), 'Sinaptik yumru (sinaptik uç)', 'Aksonun sinaps boşluğunda sonlanan ucudur. İçinde nörotransmitter dolu sinaptik keseciklerle bulunur.', 'Sinaps öncesi');
    bulb.scale.set(1.1, .8, 1); at(bulb, 0, 1.4, 0); g.add(bulb);
    const vesPos = [[-.7, 1.1, .2], [0, 1.0, -.3], [.7, 1.1, .2], [-.3, 1.6, .3], [.4, 1.7, -.2]];
    vesPos.forEach(([x, y, z]) => {
      const v = S(new THREE.Mesh(new THREE.SphereGeometry(.26, 20, 16), glass(0xbfe3ff, .5)), 'Sinaptik kesecik', 'İçinde nörotransmitter madde bulunan keseciktir. Uyartı gelince içeriğini sinaps boşluğuna bırakır.', 'Nörotransmitter deposu');
      at(v, x, y, z); g.add(v);
      for (let k = 0; k < 5; k++) { const d = glow(0xffc93c, .05); at(d, x + (Math.random() - .5) * .25, y + (Math.random() - .5) * .25, z + (Math.random() - .5) * .25); g.add(d); }
    });
    const post = S(new THREE.Mesh(new THREE.SphereGeometry(1.4, 36, 28, 0, Math.PI * 2, 1.45, 1.7), mt(0xb085f0, { side: THREE.DoubleSide })), 'Komşu hücrenin zarı', 'Alıcı hücrenin (nöronun dendriti, kas veya bez hücresi) zarıdır; üzerinde nörotransmitterleri tanıyan reseptörler bulunur.', 'Sinaps sonrası');
    post.scale.set(1.6, .8, 1.5); at(post, 0, -1.9, 0); g.add(post);
    const recs = [-1.3, -.45, .45, 1.3].map(x => { const r = S(new THREE.Mesh(new THREE.BoxGeometry(.3, .4, .3), mt(0x3b6bff)), 'Reseptör', 'Nörotransmitterin bağlandığı zar proteinidir; bağlanma ile komşu hücreye uyartı aktarılır.', 'Alıcı protein'); at(r, x, -1.0 - Math.abs(x) * .06, 0); g.add(r); return r; });
    const cleft = S(new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.2, 2.2), glass(0xffe9a8, .15)), 'Sinaps boşluğu', 'Hücrelerin fiziksel olarak temas etmediği, aralarındaki boşluktur. Uyartı bu boşluğu nörotransmitterlerle geçer.', 'İki hücre arası');
    cleft.userData.low = true; at(cleft, 0, -.15, 0); g.add(cleft);
    const nts = []; for (let i = 0; i < 40; i++) { const m = glow(0xffc93c, .07); m.userData.nt = true; g.add(m); nts.push({ m, p: Math.random(), x: (Math.random() - .5) * 2.2, z: (Math.random() - .5) * 1.2, s: .18 + Math.random() * .1 }); }
    ticks.push((t, dt) => nts.forEach(o => { o.p += dt * o.s; if (o.p > 1) o.p = 0; o.m.position.set(o.x + Math.sin(o.p * 8) * .12, .6 - o.p * 1.5, o.z); }));
    const sp = glow(0xffffff, .2); g.add(sp);
    ticks.push(t => { const u = (t * .3) % 1; sp.position.set(0, 4.4 - u * 2.6, 0); sp.visible = u < .8; });
    return { g, sels, ticks };
  }
};

/* ============ GÖRÜNTÜLEYİCİ ============ */
function mount3D(box, key, onPick, opt) {
  opt = opt || {};
  const def = M3[key];
  const w = box.clientWidth || 340, h = opt.h || Math.round(Math.min(560, Math.max(320, w * .75)));
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.localClippingEnabled = true;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h); box.appendChild(renderer.domElement);
  renderer.domElement.style.touchAction = 'none';
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(45, w / h, .1, 100);
  const T0 = def.target ? V3(...def.target) : V3(0, 0, 0);
  cam.position.set(...def.cam);
  addLights(scene);
  const built = def.build(); scene.add(built.g);
  const labG = new THREE.Group(); labG.visible = false; scene.add(labG);
  const ctl = new THREE.OrbitControls(cam, renderer.domElement);
  ctl.target.copy(T0);
  ctl.enableDamping = true; ctl.dampingFactor = .08; ctl.autoRotate = opt.noAuto ? false : true; ctl.autoRotateSpeed = 1.2; ctl.minDistance = 1.2; ctl.maxDistance = 30;
  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2(); ray.params.Line.threshold = .04;
  let down = null, alive = true, selName = null, goal = null;
  const names = []; built.sels.forEach(m => { if (!names.includes(m.userData.name)) names.push(m.userData.name); });
  built.sels.forEach(m => { m.userData.baseEm = m.material.emissive ? m.material.emissive.getHex() : 0; m.userData.baseOp = m.material.opacity; });

  /* kesit */
  const cdef = def.clip || null; let clipOn = false;
  const plane = new THREE.Plane(V3(-1, 0, 0), 0);
  function setClip(on, pos) {
    if (!cdef) return; clipOn = !!on;
    const ax = cdef.axis || 'x', n = V3(ax === 'x' ? -1 : 0, ax === 'y' ? -1 : 0, ax === 'z' ? -1 : 0);
    if (cdef.flip) n.multiplyScalar(-1);
    plane.normal.copy(n); plane.constant = (cdef.flip ? -1 : 1) * (pos === undefined ? (cdef.def || 0) : pos);
    applyClip(built.g, clipOn ? plane : null);
  }
  /* katmanlar */
  const layers = def.layers || [];
  function setLayer(grp, vis) { built.g.traverse(o => { if (o.userData && o.userData.grp === grp) o.visible = vis; }); }
  /* etiketler */
  let labBuilt = false;
  function buildLabels() {
    labBuilt = true; const seen = {};
    built.sels.forEach(m => {
      const n = m.userData.name; if (seen[n] || m.userData.nolab) return; seen[n] = 1;
      const bb = new THREE.Box3().setFromObject(m); const c = bb.getCenter(V3(0, 0, 0)); const sz = bb.getSize(V3(0, 0, 0));
      const sp = labelSprite(n.split(' (')[0], def.labScale || 1); sp.position.copy(c); sp.position.y += Math.min(sz.y * .5, .6) + .12 * (def.labScale || 1); sp.userData.src = m; labG.add(sp);
    });
  }
  function setLabels(on) { if (on && !labBuilt) buildLabels(); labG.visible = !!on; }
  /* seçim */
  function highlight(name) {
    selName = name;
    built.sels.forEach(m => {
      const on = m.userData.name === name;
      if (m.material.emissive) m.material.emissive.setHex(on ? 0x2288ff : m.userData.baseEm);
      if (m.userData.hlOp !== undefined) m.material.opacity = on ? m.userData.hlOp : m.userData.baseOp;
    });
  }
  function info(name) { const m = built.sels.find(x => x.userData.name === name); return m ? m.userData : null; }
  function focus(name, zoom) {
    const ms = built.sels.filter(m => m.userData.name === name); if (!ms.length) return;
    const bb = new THREE.Box3(); ms.forEach(m => bb.expandByObject(m)); const c = bb.getCenter(V3(0, 0, 0)), sz = bb.getSize(V3(0, 0, 0)).length();
    goal = { t: c, d: zoom ? Math.max(sz * 1.9, 2.6) : null };
  }
  function visible(o) { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true; }
  function pick(ev) {
    const r = renderer.domElement.getBoundingClientRect();
    mouse.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(mouse, cam);
    const hits = ray.intersectObjects(built.sels.filter(visible), false).filter(x => !clipOn || plane.distanceToPoint(x.point) >= 0);
    const uniq = []; hits.forEach(x => { if (!uniq.some(u => u.object.userData.name === x.object.userData.name)) uniq.push(x); });
    const pri = uniq.filter(x => !x.object.userData.low); const cand = pri.length ? pri : uniq;
    let hit = cand[0]; if (hit && hit.object.userData.name === selName && cand.length > 1) hit = cand[1]; /* aynı yere tekrar tıklayınca arkadaki parça */
    if (hit) { highlight(hit.object.userData.name); focus(hit.object.userData.name, false); onPick && onPick(hit.object.userData); }
  }
  const el = renderer.domElement;
  el.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; ctl.autoRotate = false; goal = null; });
  el.addEventListener('pointerup', e => { if (down && Math.hypot(e.clientX - down[0], e.clientY - down[1]) < 6) pick(e); down = null; });
  const clock = new THREE.Clock();
  (function loop() {
    if (!alive) return; requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
    built.ticks.forEach(f => f(t, dt));
    if (goal) {
      ctl.target.lerp(goal.t, .12);
      if (goal.d) { const dir = cam.position.clone().sub(ctl.target); const L = dir.length(); dir.setLength(L + (goal.d - L) * .12); cam.position.copy(ctl.target).add(dir); }
      if (ctl.target.distanceTo(goal.t) < .01) goal = null;
    }
    if (labG.visible) labG.children.forEach(sp => { sp.visible = visible(sp.userData.src) && (!clipOn || plane.distanceToPoint(sp.position) >= 0); });
    ctl.update(); renderer.render(scene, cam);
  })();
  function onResize() { const nw = box.clientWidth; if (!nw) return; const nh = opt.h || Math.round(Math.min(560, Math.max(320, nw * .75))); renderer.setSize(nw, nh); cam.aspect = nw / nh; cam.updateProjectionMatrix(); }
  window.addEventListener('resize', onResize);
  layers.forEach(l => { if (l[2] === 'off') setLayer(l[1], false); });
  if (cdef && cdef.on) setClip(true, cdef.def);
  return {
    names, info, layers, clip: cdef, api: built.api || {}, camera: cam, scene, controls: ctl,
    select(n, zoom) { highlight(n); focus(n, zoom !== false); const i = info(n); onPick && onPick(i); },
    setLabels, setClip, setLayer, isClip() { return clipOn; },
    auto(v) { ctl.autoRotate = v; }, isAuto() { return ctl.autoRotate; },
    reset() { goal = null; cam.position.set(...def.cam); ctl.target.copy(T0); ctl.update(); highlight(null); },
    destroy() { alive = false; window.removeEventListener('resize', onResize); renderer.dispose(); box.innerHTML = ''; }
  };
}

/* ============ SİMÜLASYON SAHNESİ ============ */
function stage3D(box, o) {
  o = o || {};
  const w = box.clientWidth || 340, h = o.h || Math.round(Math.min(520, Math.max(300, w * .68)));
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.localClippingEnabled = true;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.setSize(w, h);
  renderer.domElement.style.touchAction = 'none'; renderer.domElement.className = 'st3d'; box.appendChild(renderer.domElement);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(o.fov || 45, w / h, .1, 100);
  camera.position.set(...(o.cam || [0, 2, 8])); addLights(scene);
  const ctl = new THREE.OrbitControls(camera, renderer.domElement); ctl.target.set(...(o.target || [0, 0, 0]));
  ctl.enableDamping = true; ctl.dampingFactor = .08; ctl.minDistance = 1.5; ctl.maxDistance = 30; ctl.autoRotate = !!o.auto; ctl.autoRotateSpeed = 1;
  const ticks = []; let alive = true; const clock = new THREE.Clock();
  (function loop() { if (!alive) return; requestAnimationFrame(loop); const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime; ticks.forEach(f => f(t, dt)); ctl.update(); renderer.render(scene, camera); })();
  function onResize() { const nw = box.clientWidth; if (!nw) return; const nh = o.h || Math.round(Math.min(520, Math.max(300, nw * .68))); renderer.setSize(nw, nh); camera.aspect = nw / nh; camera.updateProjectionMatrix(); }
  window.addEventListener('resize', onResize);
  return { scene, camera, renderer, ctl, ticks, tick(f) { ticks.push(f); }, dispose() { alive = false; window.removeEventListener('resize', onResize); renderer.dispose(); if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); } };
}
