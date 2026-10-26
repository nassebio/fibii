/* Nasse Biology — 3B duyu organı simülasyonları (her birinin öncesinde görev, sonrasında gözlem sorusu var) */
(function () {
  const ui = (box, html, cls) => { const d = document.createElement('div'); d.className = cls || 'ctl'; d.innerHTML = html; box.appendChild(d); return d; };
  const bars = items => `<div class="bars">${items.map(([id, label, color]) => `<div class="bar"><span>${label}</span><div class="trk"><i data-b="${id}" style="background:${color}"></i></div><b data-v="${id}">0%</b></div>`).join('')}</div>`;
  const setBar = (root, id, v) => { v = Math.max(0, Math.min(1, v)); const a = root.querySelector(`[data-b="${id}"]`), b = root.querySelector(`[data-v="${id}"]`); if (a) a.style.width = Math.round(v * 100) + '%'; if (b) b.textContent = Math.round(v * 100) + '%'; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const hideGrp = (g, grp) => g.traverse(o => { if (o.userData && o.userData.grp === grp) o.visible = false; });

  Object.assign(SIMS, {
    goz: { title: 'Göz: Işık, Göz Bebeği ve Mercek', ico: '👁️', topic: 'gozyapi', m3: 'goz' },
    kulak: { title: 'Kulak: Sesin Yolculuğu', ico: '👂', topic: 'kulakyapi', m3: 'kulak' },
    denge: { title: 'Denge: Dönme ve Doğrusal Hareket', ico: '⚖️', topic: 'denge', m3: 'denge' },
    koku: { title: 'Koku: Molekül, Reseptör, Adaptasyon', ico: '🌸', topic: 'burunyapi', m3: 'kokuepiteli' },
    tat: { title: 'Tat: Tükürük, Tomurcuk ve Lezzet', ico: '🍋', topic: 'dilyapi', m3: 'tattomurcugu' },
    deri: { title: 'Deri: Hangi Uyaran, Hangi Reseptör?', ico: '🖐️', topic: 'deriyapi', m3: 'deri' }
  });
  Object.assign(SIM_META, {
    goz: {
      task: 'Önce ışık şiddeti çubuğunu 100’e, sonra 0’a getir; göz bebeğinin çapını ve çubuk/koni etkinliğini karşılaştır. Ardından “Otomatik uyum” açıkken nesneyi 6 m’den 0,25 m’ye yaklaştır ve merceğin değişimini izle. Son olarak otomatik uyumu kapat, mercek kalınlığını sabit tutup nesneyi yaklaştır; retinadaki görüntünün neden bulanıklaştığını gözle.',
      q: { q: 'Otomatik uyum açıkken nesne gözden uzaklaşmak yerine gözün yakınına getirildiğinde merceğe ne oldu?', o: ['Kalınlaştı (kirpiksi kas kasıldı, askı bağları gevşedi)', 'İncelir (kirpiksi kas kasıldı)', 'Hiç değişmedi', 'Göz bebeği gibi çapı ayarlandı'], a: 0, e: 'Yakına bakarken kirpiksi cisimdeki kas kasılır, askı bağları gevşer ve mercek kalınlaşır; uzağa bakarken mercek incelir. Bu olaya akomodasyon (uyum) denir. Işık miktarını ise iris, göz bebeğinin çapını değiştirerek ayarlar.' }
    },
    kulak: {
      task: 'Frekans çubuğunu en düşük (pes) değerden en yüksek (tiz) değere kaydır ve şiddeti artır. Sesin kulak kepçesi → kulak yolu → kulak zarı → çekiç-örs-üzengi → salyangoz → işitme siniri → beyin yolunu üstteki adımlardan izle. Salyangozda hangi bölgenin parladığını ve kulak zarı ile kemikçiklerin titreşiminin şiddetle nasıl değiştiğini not et.',
      q: { q: 'Gözlemine göre sesin elektrik sinyaline (sinirsel mesaja) dönüştüğü, salyangoz içindeki yapı hangisidir?', o: ['Kulak zarı', 'Korti organındaki tüylü duyu hücreleri', 'Östaki borusu', 'Kulak kepçesi'], a: 1, e: 'Kulak zarı ve kemikçikler titreşimi iletir; salyangoz içindeki Korti organında bulunan tüylü duyu hücreleri (mekanoreseptör, duyu epiteli) titreşimi sinirsel mesaja çevirir. İşitme siniri bu mesajı beyne taşır.' }
    },
    denge: {
      task: 'Önce “Başı döndür” düğmesiyle başı sabit hızla döndür; yarım daire kanallarındaki sıvının ve cupulanın nasıl değiştiğine bak. Birkaç saniye sonra döndürmeyi durdur ve etkinliğin nasıl değiştiğini gözle. Sonra başı yana eğ ve “İleri hızlan” düğmesine bas; tulumcuk ve keseciğin otolit tabakasındaki kaymayı izle.',
      q: { q: 'Başı uzun süre döndürdükten sonra aniden durdurunca baş dönmesi hissedilmesinin nedeni nedir?', o: ['Yarım daire kanallarındaki sıvının hareketine bir süre daha devam etmesi', 'Kulak zarının delinmesi', 'Östaki borusunun tıkanması', 'Salyangozun titreşmesi'], a: 0, e: 'Yarım daire kanalları başın dönme hareketlerini algılar. Dönme durunca kanaldaki sıvı bir süre hareketine devam eder ve reseptörleri (tüylü hücreleri) uyarmayı sürdürür; beyin hâlâ dönüyormuşuz gibi algılar. Tulumcuk ve kesecik ise yer çekimi, baş konumu ve doğrusal ivmelenmeyi algılar.' }
    },
    koku: {
      task: 'Önce yalnızca bir koku molekülü seç ve yoğunluğu yüksek tut; kokuya bağlı reseptör nöronların parlamasını ve algılanan koku şiddetinin grafikte zamanla nasıl değiştiğini izle (en az 30 sn). Sonra “Temiz hava” ile sıfırla, “Burun tıkalı” seçeneğini aç ve aynı kokuyu dene. Birden fazla koku seçip hangi reseptör nöronların uyarıldığına bak.',
      q: { q: 'Aynı kokuya uzun süre maruz kalındığında koku algısının zayıflamasına ne ad verilir?', o: ['Koku adaptasyonu', 'Ya hep ya hiç yasası', 'Merdiven etkisi', 'Depolarizasyon'], a: 0, e: 'Kokuya uzun süre maruz kalındığında duyarlılık azalır; buna koku adaptasyonu denir. Koku reseptörleri kemoreseptördür ve koku moleküllerinin burun içindeki reseptörlere ulaşmasına bağlıdır; burun tıkalıyken moleküller ulaşamadığı için koku zayıflar.' }
    },
    tat: {
      task: 'Beş temel tattan birini seç ve tat moleküllerinin tükürükte çözünüp tat gözeneğinden tomurcuğa girişini izle. Ardından “Ağız kuru” seçeneğini aç ve aynı maddeyi dene. Son olarak “Burnu tut” seçeneğini işaretleyip lezzet algısını karşılaştır.',
      q: { q: 'Ağız tamamen kuruyken tat verici madde damlatıldığında tat algısının çok zayıflamasının nedeni nedir?', o: ['Tat tomurcukları ağız kuruyken kaybolur', 'Maddeler tükürükte çözünemediği için reseptörleri uyaramaz', 'Tat reseptörleri nöron değildir', 'Beyin tat bilgisini yorumlayamaz'], a: 1, e: 'Besinlerdeki kimyasal maddeler tükürükte çözünür; çözünen maddeler tat tomurcuklarındaki reseptörleri uyarır. Tükürük yoksa madde reseptörlere ulaşamaz. Ayrıca koku ve tat birlikte lezzeti oluşturduğu için burun tutulunca lezzet algısı da azalır.' }
    },
    deri: {
      task: 'Altı uyaranı sırayla uygula (tüy, ağırlık, diyapazon, sıcak bardak, buz, iğne). Her seferinde deride hangi reseptörün parladığını, uyaranın fiziksel mi kimyasal mı olduğunu ve algının ne olduğunu not et. Şiddeti artırarak sıcak/soğuk uyaranın ağrı reseptörünü ne zaman devreye soktuğuna bak.',
      q: { q: 'Parmağına iğne battığında öncelikle uyarılan reseptör hangisidir?', o: ['Termoreseptör', 'Ağrı reseptörü (nosiseptör, serbest sinir ucu)', 'Fotoreseptör', 'Kemoreseptör'], a: 1, e: 'İğne doku hasarına yol açabilecek bir uyarandır; bunu serbest sinir uçları olan ağrı reseptörleri (nosiseptörler) algılar. Hafif dokunma, basınç ve titreşimi ise mekanoreseptörler; sıcaklık değişimini termoreseptörler algılar.' }
    }
  });

  /* ================= GÖZ ================= */
  SIM_FN.goz = function (box) {
    const ctl = ui(box, `<label class="sl">Işık şiddeti: <b id="gl">60</b><input type="range" id="gL" min="0" max="100" value="60"></label>
      <label class="sl">Nesnenin uzaklığı: <b id="gd">6.0</b> m<input type="range" id="gD" min="0" max="100" value="100"></label>
      <label class="chk"><input type="checkbox" id="gA" checked> Otomatik uyum (kirpiksi kas)</label>
      <label class="sl" id="gMw" style="display:none">Mercek kalınlığı: <b id="gm">20</b><input type="range" id="gM" min="0" max="100" value="20"></label>`);
    const st = stage3D(box, { cam: [7.4, 1.7, 3.2], target: [0, .2, 1.8], h: 460 });
    const built = M3.goz.build(), eye = built.g, api = built.api; st.scene.add(eye); hideGrp(eye, 'isin');
    const plane = new THREE.Plane(V3(-1, 0, 0), .02); applyClip(eye, plane);
    built.ticks.forEach(f => st.tick(f));
    const objMat = mt(0x37d67a, { emissive: 0x0b3a1f }), obj = new THREE.Group(); obj.add(cylBetween([0, 0, 0], [0, .78, 0], .045, objMat), at(new THREE.Mesh(new THREE.ConeGeometry(.12, .24, 12), objMat), 0, .9, 0)); st.scene.add(obj);
    const heights = [.78, .4, .0, -.4, -.78], lines = heights.map(() => { const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(5 * 3), 3)); const l = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffd34d, transparent: true })); l.frustumCulled = false; st.scene.add(l); return l; });
    const axial = new THREE.Line(new THREE.BufferGeometry().setFromPoints([V3(0, 0, 0), V3(0, 0, 1)]), new THREE.LineBasicMaterial({ color: 0xffd34d, transparent: true })); axial.frustumCulled = false; st.scene.add(axial);
    const spot = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), new THREE.MeshBasicMaterial({ color: 0xff9f3b, transparent: true, opacity: .9 })); st.scene.add(spot);
    const amb = st.scene.children.find(o => o.isAmbientLight);
    const out = ui(box, `<div class="two"><div>${bars([['pu', 'Göz bebeği çapı', '#5ec8ff'], ['ro', 'Çubuk etkinliği (az ışıkta)', '#9fc2ff'], ['co', 'Koni etkinliği (aydınlıkta, renkli)', '#ff9f6b'], ['sh', 'Görüntü netliği', '#59e08a']])}</div><div class="readout" id="gr" style="margin:0"></div></div>`, 'wrap');
    const $s = id => ctl.querySelector(id);
    let L = 60, D = 6, M = 20, auto = true, lastPf = -1;
    const dOf = s => .25 * Math.pow(24, s / 100);
    const upd = () => { L = +$s('#gL').value; D = dOf(+$s('#gD').value); M = +$s('#gM').value; auto = $s('#gA').checked; $s('#gl').textContent = L; $s('#gd').textContent = D.toFixed(2); $s('#gm').textContent = M; $s('#gMw').style.display = auto ? 'none' : ''; };
    ['#gL', '#gD', '#gM', '#gA'].forEach(i => $s(i).addEventListener('input', upd)); $s('#gA').addEventListener('change', upd); upd();
    st.tick(() => {
      const need = 1 / D, A = auto ? clamp(need, .17, 4) : .17 + M / 100 * 3.83;
      const f = (A - .17) / 3.83; api.setAccom(f);
      const pf = clamp(.86 - L * .0066, .2, .86); if (Math.abs(pf - lastPf) > .004) { api.setPupil(pf); lastPf = pf; }
      if (amb) amb.intensity = .28 + .6 * L / 100;
      const objZ = 2.6 + .9 * D; obj.position.set(0, 0, objZ);
      const zF = clamp(-1.34 + (A - need) * .38, -2.4, 1.0), yF = -.28, prr = api.pupil, S0 = V3(0, .9, objZ);
      let blur = 0, ymin = 9, ymax = -9, nOk = 0;
      heights.forEach((h, i) => {
        const yI = h * .609, ok = Math.abs(yI) <= prr * .97, p = lines[i].geometry.attributes.position, yL = h * .55;
        const pts = [S0, V3(0, h, 1.66), V3(0, yI, 1.0)];
        if (ok) { const yR = yL + (yF - yL) * (.9 + 1.34) / (.9 - zF); pts.push(V3(0, yL, .9), V3(0, yR, -1.34)); ymin = Math.min(ymin, yR); ymax = Math.max(ymax, yR); nOk++; }
        pts.forEach((v, k) => p.setXYZ(k, v.x, v.y, v.z)); for (let k = pts.length; k < 5; k++) p.setXYZ(k, pts[pts.length - 1].x, pts[pts.length - 1].y, pts[pts.length - 1].z);
        lines[i].geometry.setDrawRange(0, pts.length); p.needsUpdate = true; lines[i].material.color.setHex(ok ? 0xffd34d : 0x9a5a5a); lines[i].material.opacity = (ok ? .35 : .35) + .55 * L / 100;
      });
      blur = nOk ? ymax - ymin : 0;
      const ap = axial.geometry.attributes.position; ap.setXYZ(0, 0, 0, objZ); ap.setXYZ(1, 0, 0, -1.34); ap.needsUpdate = true; axial.material.opacity = .3 + .6 * L / 100;
      const sharp = nOk ? 1 / (1 + blur * 6) : 0, sz = .045 + blur * .55;
      spot.position.set(0, nOk ? (ymin + ymax) / 2 : yF, -1.33); spot.scale.set(sz * .6, sz, sz * .6); spot.material.opacity = (.25 + .75 * sharp) * (.2 + .8 * L / 100);
      const rod = L < 10 ? 1 : clamp(1 - (L - 10) / 70, .08, 1), cone = clamp((L - 12) / 50, 0, 1);
      setBar(out, 'pu', pf / .86); setBar(out, 'ro', rod); setBar(out, 'co', cone); setBar(out, 'sh', sharp);
      const mm = 2 + 6 * (1 - L / 100);
      out.querySelector('#gr').innerHTML = `Göz bebeği: <b>${mm.toFixed(1)} mm</b> (${L > 55 ? 'küçüldü' : L < 30 ? 'büyüdü' : 'orta'})<br>Mercek: <b>${f > .55 ? 'kalın' : f < .25 ? 'ince' : 'orta'}</b> · kirpiksi kas: <b>${f > .55 ? 'kasılı' : 'gevşek'}</b> · askı bağları: <b>${f > .55 ? 'gevşek' : 'gergin'}</b><br>Retinadaki görüntü: <b>${nOk === 0 ? 'ışık girmiyor' : sharp > .75 ? 'net (ters ve küçük)' : (zF > -1.34 ? 'bulanık (odak retinanın önünde)' : 'bulanık (odak retinanın arkasında)')}</b>`;
    });
    return () => st.dispose();
  };

  /* ================= KULAK ================= */
  SIM_FN.kulak = function (box) {
    const ctl = ui(box, `<label class="sl">Frekans: <b id="kf">1000</b> Hz <small id="kfn">(orta)</small><input type="range" id="kF" min="0" max="100" value="57"></label>
      <label class="sl">Ses şiddeti: <b id="ki">50</b><input type="range" id="kI" min="0" max="100" value="50"></label>
      <div class="btns"><button class="btn" id="kS">🔊 Sesi gönder</button><label class="chk"><input type="checkbox" id="kA"> Sesi duy</label></div>`);
    const steps = ['Kulak kepçesi', 'Kulak yolu', 'Kulak zarı', 'Çekiç-örs-üzengi', 'Oval pencere / iç kulak sıvısı', 'Korti organı (tüylü hücreler)', 'İşitme siniri', 'Beyin'];
    const path = ui(box, `<div class="flow pathrow">${steps.map((s, i) => `<span class="chip" data-i="${i}">${s}</span>${i < steps.length - 1 ? '<i class="arr">➜</i>' : ''}`).join('')}</div>`, 'wrap');
    const st = stage3D(box, { cam: [-1.5, 2.6, 10.8], target: [2.4, -.5, 0], h: 470 });
    const built = M3.kulak.build(), api = built.api; st.scene.add(built.g); hideGrp(built.g, 'ses'); built.ticks.forEach(f => st.tick(f));
    const rings = []; for (let i = 0; i < 9; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(.9, .03, 8, 40).rotateY(Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x4fb3ff, transparent: true })); st.scene.add(r); rings.push(r); }
    const out = ui(box, `<div class="two"><div>${bars([['am', 'Kulak zarı ve kemikçik titreşimi', '#5ec8ff'], ['hc', 'Korti organı: en çok uyarılan bölgedeki etkinlik', '#59e08a'], ['sp', 'İşitme sinirinde uyartı sıklığı', '#ffd34d']])}</div><div class="readout" id="kr" style="margin:0"></div></div>`, 'wrap');
    const $s = id => ctl.querySelector(id); let on = false, f = 1000, I = 50, ac = null, osc = null, gn = null;
    const fOf = s => 20 * Math.pow(1000, s / 100);
    function upd() { f = fOf(+$s('#kF').value); I = +$s('#kI').value; $s('#kf').textContent = f < 1000 ? Math.round(f) : Math.round(f); $s('#kfn').textContent = f < 250 ? '(pes)' : f < 2500 ? '(orta)' : '(tiz)'; $s('#ki').textContent = I; if (osc) { osc.frequency.value = Math.min(f, 8000); gn.gain.value = on ? .015 + I / 100 * .12 : 0; } }
    ['#kF', '#kI'].forEach(i => $s(i).addEventListener('input', upd)); upd();
    $s('#kS').onclick = () => { on = !on; $s('#kS').textContent = on ? '⏹ Sesi durdur' : '🔊 Sesi gönder'; sound(); };
    function sound() { try { if ($s('#kA').checked && on) { if (!ac) { ac = new (window.AudioContext || window.webkitAudioContext)(); osc = ac.createOscillator(); gn = ac.createGain(); osc.connect(gn); gn.connect(ac.destination); osc.start(); } upd(); } else if (gn) gn.gain.value = 0; } catch (e) { } }
    $s('#kA').addEventListener('change', sound);
    st.tick((t, dt) => {
      const lf = Math.log(f / 20) / Math.log(1000), lam = 2.6 - 2.2 * lf, I01 = I / 100;
      api.freq = 1.5 + 4 * lf; api.amp = on ? .01 + .055 * I01 : .002;
      rings.forEach((r, i) => { r.visible = on; if (!on) return; const x = -8 + ((t * 2.0 + i * lam) % (lam * 9)); const xx = x; r.position.set(xx, -.1, 0); r.scale.setScalar(xx < -3.4 ? .6 + (xx + 8) * .1 : .3); r.material.opacity = clamp(.15 + .7 * I01, 0, 1) * (xx > 0 ? 0 : 1); r.material.color.setHex(0x4fb3ff); });
      const up = 1 - lf; /* tiz sesler tabana (u=0), pes sesler uca (u=1) */
      api.setHair(u => on ? I01 * Math.exp(-Math.pow((u - up) / .09, 2)) : 0);
      const idx = on ? Math.floor((t * 1.1) % 9) : -1; path.querySelectorAll('.chip').forEach((c, i) => c.classList.toggle('lit', i === idx || (on && i === idx - 1)));
      setBar(out, 'am', on ? api.amp / .065 : .03); setBar(out, 'hc', on ? I01 : 0); setBar(out, 'sp', on ? .1 + .85 * I01 : .05);
      out.querySelector('#kr').innerHTML = on ? `Ses: <b>${f < 250 ? 'pes' : f < 2500 ? 'orta' : 'tiz'}</b> · yaklaşık <b>${Math.round(25 + I * .7)} dB</b><br>Kulak zarı ve kemikçikler <b>${I > 65 ? 'güçlü' : I > 30 ? 'orta' : 'zayıf'}</b> titreşiyor; kemikçikler titreşimi iç kulağa aktarır.<br>Salyangozda en çok uyarılan bölge: <b>${up < .33 ? 'taban (oval pencereye yakın)' : up < .66 ? 'orta' : 'uç'}</b>` : 'Sesi göndermek için düğmeye bas.';
    });
    return () => { st.dispose(); try { if (osc) osc.stop(); if (ac) ac.close(); } catch (e) { } };
  };

  /* ================= DENGE ================= */
  SIM_FN.denge = function (box) {
    const ctl = ui(box, `<div class="seg"><label><input type="radio" name="dx" value="y" checked> Yatay dönme (“hayır” der gibi)</label><label><input type="radio" name="dx" value="x"> Öne-arkaya (“evet” der gibi)</label><label><input type="radio" name="dx" value="z"> Omuza yatırma</label></div>
      <label class="sl">Dönme hızı: <b id="dv">90</b> °/sn<input type="range" id="dV" min="20" max="180" value="90"></label>
      <label class="sl">Baş eğimi (yana): <b id="dt">0</b>°<input type="range" id="dT" min="-80" max="80" value="0"></label>
      <div class="btns"><button class="btn" id="dR">🔄 Başı döndür</button><button class="btn alt" id="dF">➡️ İleri hızlan</button><button class="btn alt" id="dU">⬆️ Yukarı hızlan (asansör)</button></div>`);
    const st = stage3D(box, { cam: [0, 2.6, 11], target: [0, 0, 0], h: 460 });
    const tilt = new THREE.Group(), head = new THREE.Group(); st.scene.add(tilt); tilt.add(head);
    head.add(new THREE.Mesh(new THREE.SphereGeometry(4.3, 36, 28), glass(0xf0b9a0, .06)));
    const ves = new THREE.Group(); ves.scale.setScalar(3.0); head.add(ves);
    const vapi = EAR_VEST({ g: ves, S: m => m, G: m => m }, V3(0, 0, 0));
    const nose = new THREE.Mesh(new THREE.ConeGeometry(.3, .8, 14), mt(0xff8c6b)); nose.rotation.x = Math.PI / 2; nose.position.set(0, 0, 4.6); head.add(nose);
    const nl = labelSprite('Burun yönü', .7); nl.position.set(0, .9, 5.3); head.add(nl);
    const gl = labelSprite('Yer çekimi ↓', .8); gl.position.set(-4.8, -2.8, 0); st.scene.add(gl); st.scene.add(cylBetween([-4.8, -1.4, 0], [-4.8, -2.4, 0], .05, mt(0xffd34d)));
    const flu = vapi.canals.map(c => { const arr = []; for (let i = 0; i < 9; i++) { const o = glow(0xaaffdd, .045); ves.add(o); arr.push({ o, u: i / 9 }); } return arr; });
    const out = ui(box, `<div class="two"><div>${bars([['c0', 'Yatay kanal (hayır-dönme)', '#35c58a'], ['c1', 'Ön kanal (omuza yatırma)', '#3fa9f5'], ['c2', 'Arka kanal (evet-dönme)', '#e0a53a'], ['ut', 'Tulumcuk (yatay hareket / eğim)', '#ffd34d'], ['ks', 'Kesecik (düşey hareket)', '#ff9f6b']])}</div><div class="readout" id="dr" style="margin:0"></div></div>`, 'wrap');
    const $s = id => ctl.querySelector(id); let rot = false, axis = 'y', spd = 90, tl = 0, aF = 0, aU = 0, e = [0, 0, 0], dflt = [0, 0, 0], rad = 0;
    ctl.querySelectorAll('[name=dx]').forEach(r => r.onchange = () => { axis = r.value; });
    $s('#dV').oninput = () => { spd = +$s('#dV').value; $s('#dv').textContent = spd; }; $s('#dT').oninput = () => { tl = +$s('#dT').value; $s('#dt').textContent = tl; };
    $s('#dR').onclick = () => { rot = !rot; $s('#dR').textContent = rot ? '⏹ Döndürmeyi durdur' : '🔄 Başı döndür'; };
    $s('#dF').onclick = () => { aF = 1; }; $s('#dU').onclick = () => { aU = 1; };
    const nIdx = { y: 0, z: 1, x: 2 }; /* kanal sırası: yatay(n=y), ön(n=z), arka(n=x) */
    st.tick((t, dt) => {
      const w = rot ? spd * Math.PI / 180 : 0, ax = axis === 'y' ? V3(0, 1, 0) : axis === 'x' ? V3(1, 0, 0) : V3(0, 0, 1);
      head.rotateOnAxis(ax, w * dt); tilt.rotation.z = tl * Math.PI / 180;
      const wv = [axis === 'x' ? w : 0, axis === 'y' ? w : 0, axis === 'z' ? w : 0];
      const wCan = [wv[1], wv[2], wv[0]]; /* yatay, ön, arka */
      const tau = 2.6, maxw = Math.PI;
      vapi.canals.forEach((c, i) => { e[i] += (wCan[i] - e[i]) / tau * dt; dflt[i] = wCan[i] - e[i]; const bend = clamp(dflt[i] / maxw, -1, 1); c.cup.quaternion.copy(new THREE.Quaternion().setFromAxisAngle(c.axisBend, bend * 1.1)).multiply(c.base); c.mat.emissive && c.mat.emissive.setRGB(Math.abs(bend) * .8, Math.abs(bend) * .3, 0);
        flu[i].forEach(p => { p.u = (p.u + (-dflt[i]) * dt * .25 + 1) % 1; const idx = Math.floor(p.u * (c.pts.length - 1)); p.o.position.copy(c.pts[idx]); }); });
      aF = Math.max(0, aF - dt * .8); aU = Math.max(0, aU - dt * .8);
      const gW = V3(0, -1, 0).applyQuaternion(tilt.quaternion.clone().multiply(head.quaternion).invert());
      const aW = V3(0, aU * .9, aF * 0).add(V3(0, 0, 0)), aH = V3(0, aU, aF).applyQuaternion(head.quaternion.clone().invert()).multiplyScalar(.9);
      const f = gW.clone().add(aH);
      vapi.otoU.position.set(f.x * .12, 0, f.z * .12); vapi.otoK.position.set(f.x * .06, (f.y + 1) * .16, 0);
      const uAct = clamp(Math.hypot(f.x, f.z), 0, 1), kAct = clamp(Math.abs(f.y + 1) * 1.1 + Math.abs(f.x) * .2, 0, 1);
      [0, 1, 2].forEach(i => setBar(out, 'c' + i, Math.abs(dflt[i]) / maxw * 1.1)); setBar(out, 'ut', uAct); setBar(out, 'ks', kAct);
      const act = Math.max(...dflt.map(Math.abs)); const moving = rot;
      out.querySelector('#dr').innerHTML = moving ? `Baş dönüyor → kanal sıvısı geride kalıp cupulayı eğiyor; <b>etkinlik kısa sürede azalıyor</b> (sıvı kanalla birlikte dönmeye başlar).` : act > .12 ? `Baş durdu ama sıvı hâlâ hareket ediyor → cupula ters yöne eğiliyor: <b>beyin hâlâ dönüyormuşsun gibi algılar (baş dönmesi)</b>.` : (uAct > .15 || kAct > .15 ? `Tulumcuk/kesecik: <b>${aF > .1 || aU > .1 ? 'doğrusal ivmelenme' : 'başın eğimi / yer çekimi'}</b> otolitleri kaydırıyor.` : 'Baş sabit: yarım daire kanalları dinlenmede, otolitler yer çekimini algılıyor.');
    });
    return () => st.dispose();
  };

  /* ================= KOKU ================= */
  SIM_FN.koku = function (box) {
    const ctl = ui(box, `<div class="seg"><label><input type="checkbox" class="kt" value="0" checked> 🌹 Gül (küp şekilli molekül)</label><label><input type="checkbox" class="kt" value="1"> ☕ Kahve (üçgen şekilli)</label><label><input type="checkbox" class="kt" value="2"> 🍋 Limon (küre şekilli)</label></div>
      <label class="sl">Koku yoğunluğu: <b id="kc">60</b><input type="range" id="kC" min="0" max="100" value="60"></label>
      <div class="btns"><button class="btn" id="kS">👃 Kokla</button><label class="chk"><input type="checkbox" id="kB"> Burun tıkalı (nezle)</label><button class="btn ghost" id="kT">🌬️ Temiz hava (sıfırla)</button></div>`);
    const st = stage3D(box, { cam: [6.8, 2.8, 8.4], target: [0, 1.5, 0], h: 450 });
    const built = M3.kokuepiteli.build(), api = built.api; st.scene.add(built.g); built.ticks.forEach(f => st.tick(f));
    const [c, x] = cv(box, 180); const out = ui(box, `<div class="two"><div>${bars([['s0', 'Gül reseptörü duyarlılığı', '#ff6b6b'], ['s1', 'Kahve reseptörü duyarlılığı', '#59e08a'], ['s2', 'Limon reseptörü duyarlılığı', '#6b8aff'], ['pp', 'Algılanan koku şiddeti', '#ffd34d']])}</div><div class="readout" id="kr" style="margin:0"></div></div>`, 'wrap');
    const sel = [true, false, false], sens = [1, 1, 1], hist = []; let conc = 60, snf = 0, blocked = false, acc = 0, time = 0;
    ctl.querySelectorAll('.kt').forEach(k => k.onchange = () => { sel[+k.value] = k.checked; });
    ctl.querySelector('#kC').oninput = e => { conc = +e.target.value; ctl.querySelector('#kc').textContent = conc; };
    ctl.querySelector('#kS').onclick = () => { snf = 1; }; ctl.querySelector('#kB').onchange = e => { blocked = e.target.checked; };
    ctl.querySelector('#kT').onclick = () => { sens[0] = sens[1] = sens[2] = 1; hist.length = 0; };
    function draw() {
      x.clearRect(0, 0, c.W, c.H); const L = 44, R = c.W - 12, T = 14, Bt = c.H - 30;
      x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(L, T); x.lineTo(L, Bt); x.lineTo(R, Bt); x.stroke();
      x.fillStyle = '#cfe8ff'; x.font = '12px Nunito,sans-serif'; x.textAlign = 'center'; x.fillText('Zaman (son 60 sn) →', (L + R) / 2, c.H - 8); x.save(); x.translate(12, (T + Bt) / 2); x.rotate(-Math.PI / 2); x.fillText('Algılanan koku →', 0, 0); x.restore();
      if (hist.length > 1) { x.strokeStyle = '#ffd34d'; x.lineWidth = 2.4; x.beginPath(); hist.forEach((p, i) => { const X = L + (i / 400) * (R - L), Y = Bt - p * (Bt - T); i ? x.lineTo(X, Y) : x.moveTo(X, Y); }); x.stroke(); }
    }
    st.tick((t, dt) => {
      time += dt; snf = Math.max(0, snf - dt / 1.6);
      const anySel = sel.some(Boolean), reach = blocked ? .12 : 1;
      api.molType = !anySel ? 99 : sel.filter(Boolean).length === 1 ? sel.indexOf(true) : -1; api.moleculeRate = anySel ? .4 + conc / 60 * (blocked ? .3 : 1) : 0;
      let P = 0;
      for (let i = 0; i < 3; i++) {
        const s = sel[i] ? conc / 100 * reach * (1 + snf * 1.5) : 0, act = clamp(s * sens[i], 0, 1);
        sens[i] += dt * (-.09 * s * sens[i] + .012 * (1 - sens[i])); sens[i] = clamp(sens[i], .03, 1);
        if (act > .02) api.stim(i, clamp(act * 1.15, 0, 1)); P = Math.max(P, act); setBar(out, 's' + i, sens[i]);
      }
      setBar(out, 'pp', P); acc += dt; if (acc > .15) { acc = 0; hist.push(P); if (hist.length > 400) hist.shift(); } draw();
      out.querySelector('#kr').innerHTML = !anySel ? 'Bir koku seç.' : `Algı: <b>${P > .55 ? 'güçlü koku' : P > .25 ? 'orta koku' : P > .06 ? 'zayıf koku' : 'koku yok'}</b><br>${blocked ? 'Burun tıkalı: moleküller koku epiteline çok az ulaşıyor.' : 'Aynı kokuya maruz kaldıkça ilgili reseptörlerin duyarlılığı azalıyor (<b>koku adaptasyonu</b>).'}<br>Uyarılan reseptör nöronlar: <b>${sel.map((v, i) => v ? ['gül', 'kahve', 'limon'][i] : '').filter(Boolean).join(' + ') || '—'}</b>`;
    });
    draw();
    return () => st.dispose();
  };

  /* ================= TAT ================= */
  SIM_FN.tat = function (box) {
    const names = ['Tatlı 🍬', 'Ekşi 🍋', 'Tuzlu 🧂', 'Acı ☕', 'Umami 🍖'];
    const ctl = ui(box, `<div class="seg">${names.map((n, i) => `<label><input type="radio" name="tt" value="${i}" ${i === 0 ? 'checked' : ''}> ${n}</label>`).join('')}</div>
      <label class="sl">Madde miktarı: <b id="tc">60</b><input type="range" id="tC" min="0" max="100" value="60"></label>
      <div class="btns"><label class="chk"><input type="checkbox" id="tD"> Ağız kuru (tükürük yok)</label><label class="chk"><input type="checkbox" id="tN"> Burnu tut (koku yok)</label></div>`);
    const st = stage3D(box, { cam: [5.6, 2.6, 7.6], target: [0, .8, 0], h: 450 });
    const built = M3.tattomurcugu.build(), api = built.api; st.scene.add(built.g); built.ticks.forEach(f => st.tick(f));
    const out = ui(box, `<div class="two"><div>${bars([['ta', 'Tat tomurcuğu etkinliği', '#ffd34d'], ['sm', 'Tat algısı (beyin)', '#ff9f6b'], ['fl', 'Lezzet algısı (tat + koku)', '#59e08a']])}</div><div class="readout" id="tr" style="margin:0"></div></div>`, 'wrap');
    let sel = 0, conc = 60, dry = false, nose = false, perc = 0;
    ctl.querySelectorAll('[name=tt]').forEach(r => r.onchange = () => { sel = +r.value; });
    ctl.querySelector('#tC').oninput = e => { conc = +e.target.value; ctl.querySelector('#tc').textContent = conc; };
    ctl.querySelector('#tD').onchange = e => { dry = e.target.checked; }; ctl.querySelector('#tN').onchange = e => { nose = e.target.checked; };
    st.tick((t, dt) => {
      api.molType = sel; api.rate = .3 + conc / 45; api.dry = dry || conc < 3;
      const tgt = (dry ? .04 : 1) * conc / 100 * clamp(api.act[sel] * 1.6 + .25, 0, 1); perc += (tgt - perc) * Math.min(1, dt * 3);
      setBar(out, 'ta', api.act[sel]); setBar(out, 'sm', perc); setBar(out, 'fl', perc * (nose ? .55 : 1));
      out.querySelector('#tr').innerHTML = dry ? '<b>Ağız kuru:</b> madde tükürükte çözünemedi → tat reseptörlerine ulaşamadı → tat algısı çok zayıf.' : `Madde tükürükte çözünür → tat gözeneğinden tomurcuğa girer → tat reseptör hücreleri (duyu epiteli) uyarılır → sinir lifleri (nöron) beyne taşır.<br>Algı: <b>${names[sel].split(' ')[0]}</b>${nose ? ' · <b>burun tutulu:</b> koku katkısı yok, lezzet zayıf' : ' · koku ile birlikte lezzet oluşur'}<br><small>Not: Dilin her bölgesinde beş temel tadı algılayan tat tomurcukları bulunur; “bölgesel tat haritası” geçerli değildir.</small>`;
    });
    return () => st.dispose();
  };

  /* ================= DERİ ================= */
  SIM_FN.deri = function (box) {
    const STIM = [
      { k: 'tuy', n: '🪶 Tüy (hafif dokunma)', rec: [['meissner', .95], ['merkel', .35]], type: 'Fiziksel (mekanik)', rc: 'Mekanoreseptör', yap: 'Nöron (kapsüllü yapı)', alg: 'hafif dokunma', x: -.3, z: .55 },
      { k: 'agirlik', n: '⚖️ Ağırlık (sürekli basınç)', rec: [['merkel', .95], ['pacini', .5], ['meissner', .3]], type: 'Fiziksel (mekanik)', rc: 'Mekanoreseptör', yap: 'Nöron (disk / kapsüllü yapı)', alg: 'basınç', x: .5, z: -.2 },
      { k: 'fork', n: '📳 Diyapazon (titreşim)', rec: [['pacini', 1], ['meissner', .5]], type: 'Fiziksel (mekanik)', rc: 'Mekanoreseptör', yap: 'Nöron (kapsüllü yapı)', alg: 'titreşim', x: .5, z: -.5 },
      { k: 'sicak', n: '🔥 Sıcak bardak', rec: [['hot', .95]], type: 'Fiziksel (ısı)', rc: 'Termoreseptör (sıcak)', yap: 'Nöron', alg: 'sıcaklık artışı', x: -.85, z: -.6, pain: .8 },
      { k: 'buz', n: '🧊 Buz', rec: [['cold', .95]], type: 'Fiziksel (ısı)', rc: 'Termoreseptör (soğuk)', yap: 'Nöron', alg: 'soğuk', x: .25, z: -1.0, pain: .85 },
      { k: 'igne', n: '📍 İğne', rec: [['pain', 1], ['merkel', .2]], type: 'Fiziksel (doku hasarı)', rc: 'Ağrı reseptörü (nosiseptör)', yap: 'Nöron (serbest sinir ucu)', alg: 'ağrı', x: .15, z: .15 }
    ];
    const ctl = ui(box, `<div class="seg">${STIM.map((s, i) => `<label><input type="radio" name="ds" value="${i}" ${i === 0 ? 'checked' : ''}> ${s.n}</label>`).join('')}</div>
      <label class="sl">Uyaran şiddeti: <b id="di">50</b><input type="range" id="dI" min="5" max="100" value="50"></label>
      <div class="btns"><button class="btn" id="dG">▶ Uyaranı uygula</button></div>`);
    const st = stage3D(box, { cam: [3.4, 2.6, 8.8], target: [.3, 1.2, 0], h: 470 });
    const built = M3.deri.build(), api = built.api; st.scene.add(built.g); built.ticks.forEach(f => st.tick(f));
    const props = new THREE.Group(); st.scene.add(props);
    function prop(k) {
      const g = new THREE.Group();
      if (k === 'tuy') { g.add(cylBetween([0, 0, 0], [0, .9, 0], .02, mt(0xeeeeee)), at(ellip(.22, .02, .06, mt(0xffffff), 12), 0, .12, 0), at(ellip(.2, .02, .05, mt(0xffffff), 12), 0, .3, 0)); }
      else if (k === 'agirlik') { g.add(at(new THREE.Mesh(new THREE.BoxGeometry(.6, .5, .6), mt(0x7a8aa0)), 0, .25, 0)); }
      else if (k === 'fork') { g.add(cylBetween([0, 0, 0], [0, .35, 0], .04, mt(0xc9d3e0)), at(new THREE.Mesh(new THREE.BoxGeometry(.05, .8, .06), mt(0xdfe6f0)), -.09, .8, 0), at(new THREE.Mesh(new THREE.BoxGeometry(.05, .8, .06), mt(0xdfe6f0)), .09, .8, 0)); g.userData.fork = true; }
      else if (k === 'sicak') { g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(.32, .26, .6, 20), mt(0xd9534f, { emissive: 0x551100 })), 0, .3, 0)); }
      else if (k === 'buz') { g.add(at(new THREE.Mesh(new THREE.BoxGeometry(.5, .5, .5), glass(0xaee3ff, .75)), 0, .25, 0)); }
      else { g.add(at(new THREE.Mesh(new THREE.ConeGeometry(.06, .7, 12).rotateX(Math.PI), mt(0xc0c8d0)), 0, .35, 0), cylBetween([0, .7, 0], [0, 1.3, 0], .035, mt(0x555a60))); }
      return g;
    }
    const out = ui(box, `<div class="two"><div>${bars([['mn', 'Mekanoreseptörler', '#34c38f'], ['th', 'Termoreseptörler', '#ff7a5c'], ['pn', 'Ağrı reseptörleri', '#ffe14d']])}</div><div class="readout" id="dr" style="margin:0"></div></div>`, 'wrap');
    let cur = 0, I = 50, phase = -1, pt = 0, cobj = null, act = { mn: 0, th: 0, pn: 0 };
    const $s = id => ctl.querySelector(id);
    ctl.querySelectorAll('[name=ds]').forEach(r => r.onchange = () => { cur = +r.value; });
    $s('#dI').oninput = e => { I = +e.target.value; $s('#di').textContent = I; };
    $s('#dG').onclick = () => { if (phase >= 0) return; props.clear(); cobj = prop(STIM[cur].k); const s = STIM[cur]; cobj.position.set(s.x, 3.6, s.z); props.add(cobj); phase = 0; pt = 0; };
    st.tick((t, dt) => {
      const s = STIM[cur];
      if (phase >= 0 && cobj) {
        pt += dt; const y0 = 3.6, y1 = 2.04 + (s.k === 'igne' ? -.2 : 0) - (s.k === 'agirlik' ? .0 : 0);
        if (phase === 0) { cobj.position.y = y0 + (y1 - y0) * Math.min(1, pt / 1.0); if (pt >= 1) { phase = 1; pt = 0; } }
        else if (phase === 1) {
          cobj.position.y = y1 - (s.k === 'agirlik' || s.k === 'tuy' ? .02 : 0);
          if (cobj.userData.fork) cobj.children.forEach((c, i) => { if (i > 1) c.position.x = (i === 2 ? -1 : 1) * (.09 + Math.sin(t * 40) * .02); });
          if (pt % .5 < dt + .001) { const k = I / 100; s.rec.forEach(([r, v]) => { if (r === 'pacini' && s.k === 'agirlik') { if (pt < .6) api.fire(r, v * k); } else api.fire(r, v * Math.min(1, k * 1.1 + .1)); }); if (s.pain && I > 75) api.fire('pain', (I - 60) / 40 * s.pain); }
          if (pt > 2.8) { phase = 2; pt = 0; }
        } else { cobj.position.y = y1 + (y0 - y1) * Math.min(1, pt / .8); if (pt >= .8) { phase = -1; props.clear(); cobj = null; } }
      }
      const rr = api.rec, mnA = Math.max(rr.meissner.a, rr.merkel.a, rr.pacini.a), thA = Math.max(rr.hot.a, rr.cold.a), pnA = rr.pain.a;
      setBar(out, 'mn', mnA); setBar(out, 'th', thA); setBar(out, 'pn', pnA);
      const painNow = s.pain && I > 75 && phase === 1;
      out.querySelector('#dr').innerHTML = `<b>${s.n}</b><br>Uyaran türü: <b>${s.type}</b><br>Reseptör: <b>${s.rc}</b>${painNow ? ' <b>+ ağrı reseptörü</b> (doku hasarı riski)' : ''}<br>Reseptörün yapısı: <b>${s.yap}</b><br>Beynin algısı: <b>${painNow ? 'ağrı' : s.alg}</b>`;
    });
    return () => st.dispose();
  };
})();
