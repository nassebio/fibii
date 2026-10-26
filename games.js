/* Nasse Biology — oyunlar ve etkinlikler */
const GAMES = {
  tree: { title: 'Tanılayıcı Dallanmış Ağaç', ico: '🌳', desc: 'D/Y oklarını takip et, doğru çıkışı bul.' },
  neuron: { title: 'Nöronu Etiketle', ico: '🏷️', desc: 'Numaralı 7 yapıyı doğru adlandır.' },
  charge: { title: 'Zar Yükü Ustası', ico: '🔋', desc: 'Üç evrede zarın dış ve iç yüklerini işaretle.' },
  stim: { title: 'Uyaran–Reseptör Eşleştir', ico: '🎯', desc: 'Her uyaranı algılayan reseptörü seç.' },
  organ: { title: 'Reseptörü Tanı, Organına Yerleştir', ico: '🧩', desc: 'Organ, reseptör çeşidi ve yapıyı eşleştir.' },
  avci: { title: '3B Organ Avcısı', ico: '🎯', desc: 'İstenen parçayı 3B modelin üzerinde bul ve tıkla.' }
};
function selectHTML(opts, id) { return `<select data-id="${id}"><option value="">Seç…</option>${opts.map(o => `<option>${o}</option>`).join('')}</select>`; }

/* ---------- Dallanmış ağaç ---------- */
function gameTree(box) {
  const ST = {
    a: { t: 'Duyu organları çevresel uyarıları algılar.', v: true, D: 'b', Y: 'c', why: 'Doğru. Duyu organları, yapılarındaki reseptörlerle çevresel uyaranları alır.' },
    b: { t: 'Duyu organlarında reseptör bulunmaz.', v: false, D: 'ç', Y: 'd', why: 'Yanlış. Duyu organları yapılarındaki duyu reseptörleri ile uyaranları alan özel organlardır.' },
    c: { t: 'Burun kimyasal uyarıları algılar.', v: true, D: 'e', Y: 'f', why: 'Doğru. Burundaki kemoreseptörler koku moleküllerini (kimyasal uyaran) algılar.' },
    'ç': { t: 'Kulak sadece işitmeden sorumludur.', v: false, D: 1, Y: 2, why: 'Yanlış. Kulak ses ve dengeyle ilişkili mekanik uyaranları algılar.' },
    d: { t: 'Bazı hayvanlar insanların algılayamadığı uyaranları algılar.', v: true, D: 3, Y: 4, why: 'Doğru. Örneğin çukur engereği ısıyı, yunus geri dönen ses dalgalarını algılar.' },
    e: { t: 'Dil tat alma tomurcuklarındaki reseptörlerle tatları algılar.', v: true, D: 5, Y: 6, why: 'Doğru. Tat tomurcukları duyu epiteli yapısında kemoreseptörlerdir.' },
    f: { t: 'Deri sadece dokunma uyaranını algılar.', v: false, D: 7, Y: 8, why: 'Yanlış. Deri dokunma, basınç, sıcaklık değişimleri ve doku hasarına yol açabilecek uyaranları algılar.' }
  };
  const L = { a: 'a)', b: 'b)', c: 'c)', 'ç': 'ç)', d: 'd)', e: 'e)', f: 'f)' };
  const wrap = document.createElement('div'); wrap.className = 'game'; box.appendChild(wrap);
  function start() {
    let node = 'a'; const path = [];
    function step() {
      if (typeof node === 'number') {
        const ok = path.every(p => p.ans === ST[p.id].v);
        wrap.innerHTML = `<div class="trail">${path.map(p => `<span class="${p.ans === ST[p.id].v ? 'ok' : 'bad'}">${L[p.id]} ${p.ans ? 'D' : 'Y'}</span>`).join(' → ')} → <b>${node}. Çıkış</b></div>
        <div class="result ${ok ? 'good' : 'warn'}">${ok ? '🎉 Doğru çıkış: 3. Çıkış! Tüm ifadeleri doğru değerlendirdin.' : 'Çıkışına ulaştın ama bazı ifadeleri yanlış değerlendirdin.'}</div>
        <ul class="why">${path.map(p => `<li class="${p.ans === ST[p.id].v ? 'ok' : 'bad'}"><b>${L[p.id]}</b> ${ST[p.id].t}<br><small>${ST[p.id].why}</small></li>`).join('')}</ul>
        <div class="btns"><button class="btn" id="tr">Yeniden dene</button></div>`;
        if (ok) award('g_tree', 30, 'Dallanmış ağaç tamam!');
        wrap.querySelector('#tr').onclick = start; return;
      }
      const s = ST[node];
      wrap.innerHTML = `<div class="trail">${path.map(p => `<span>${L[p.id]} ${p.ans ? 'D' : 'Y'}</span>`).join(' → ') || 'Başlangıç'}</div>
      <div class="stmt"><b>${L[node]}</b> ${s.t}</div>
      <div class="btns"><button class="btn dbtn" data-v="1">D (Doğru)</button><button class="btn ybtn" data-v="0">Y (Yanlış)</button></div>`;
      wrap.querySelectorAll('[data-v]').forEach(b => b.onclick = () => { const ans = b.dataset.v === '1'; path.push({ id: node, ans }); node = ans ? s.D : s.Y; step(); });
    }
    step();
  }
  start();
}

/* ---------- Nöron etiketleme ---------- */
function gameNeuron(box) {
  const NAMES = ['Dendrit', 'Hücre gövdesi', 'Ranvier boğumu', 'Miyelin kılıf', 'Akson ucu', 'Çekirdek', 'Akson'];
  const FUNC = {
    'Dendrit': 'Uyarıları alır ve hücre gövdesine iletir.', 'Hücre gövdesi': 'Nöronun yaşamsal faaliyetlerinin gerçekleştiği bölümdür.',
    'Ranvier boğumu': 'Miyelin kılıfların arasında kalan yalıtımsız boşluklardır.', 'Miyelin kılıf': 'Aksonu sarar ve yalıtır; impuls iletimini hızlandırır.',
    'Akson ucu': 'İmpulsun başka bir nörona, kas veya bez hücresine aktarılmasını sağlar.', 'Çekirdek': 'Hücrenin faaliyetlerini yönetir ve kalıtsal bilgiyi taşır.', 'Akson': 'İmpulsu hücre gövdesinden akson uçlarına doğru iletir.'
  };
  const key = ['Dendrit', 'Hücre gövdesi', 'Ranvier boğumu', 'Miyelin kılıf', 'Akson ucu', 'Çekirdek', 'Akson'];
  const wrap = document.createElement('div'); wrap.className = 'game';
  wrap.innerHTML = `<svg viewBox="0 0 640 260" class="nsvg">
   <g stroke="#6fb4ff" stroke-width="4" fill="none" stroke-linecap="round">
    <path d="M95 125 L40 70 M40 70 L20 50 M40 70 L55 40 M95 135 L30 140 M95 145 L45 205 M45 205 L25 225 M45 205 L70 232 M120 100 L100 55 M100 55 L85 35 M100 55 L125 38"/>
   </g>
   <circle cx="130" cy="130" r="48" fill="#4f6df0" opacity=".9"/><circle cx="130" cy="130" r="18" fill="#1f2b86"/>
   <rect x="178" y="124" width="330" height="12" rx="6" fill="#6f6ae0"/>
   ${[0, 1, 2, 3].map(i => `<rect x="${190 + i * 80}" y="112" width="64" height="36" rx="14" fill="#f5c542"/>`).join('')}
   <g stroke="#6f6ae0" stroke-width="4" fill="none" stroke-linecap="round"><path d="M508 130 L560 90 M508 130 L570 125 M508 130 L560 170 M508 130 L545 205"/></g>
   ${[[560, 90], [570, 125], [560, 170], [545, 205]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="#ffc93c"/>`).join('')}
   <g font-family="Nunito,sans-serif" font-weight="800" font-size="15" text-anchor="middle" fill="#06182f">
    ${[[1, 22, 48], [2, 130, 70], [3, 262, 98], [4, 215, 98], [5, 590, 80], [6, 130, 135], [7, 380, 178]].map(n => `<g><circle cx="${n[1]}" cy="${n[2]}" r="13" fill="#fff"/><text x="${n[1]}" y="${n[2] + 5}">${n[0]}</text></g>`).join('')}
   </g>
   <path d="M190 168 H500" stroke="#fff" stroke-width="2" fill="none"/>
  </svg><div class="grid7">${key.map((_, i) => `<div class="lab"><b>${i + 1}.</b>${selectHTML(NAMES, i)}</div>`).join('')}</div>
  <div class="btns"><button class="btn" id="nc">Kontrol et</button></div><div class="fbk"></div>`;
  box.appendChild(wrap);
  wrap.querySelector('#nc').onclick = () => {
    let ok = 0; const rows = [];
    wrap.querySelectorAll('select').forEach((s, i) => { const good = s.value === key[i]; s.className = good ? 'ok' : 'bad'; if (good) ok++; rows.push(`<tr class="${good ? 'ok' : 'bad'}"><td>${i + 1}</td><td>${key[i]}</td><td>${FUNC[key[i]]}</td></tr>`); });
    wrap.querySelector('.fbk').innerHTML = `<div class="result ${ok === 7 ? 'good' : 'warn'}">${ok}/7 doğru ${ok === 7 ? '🎉' : '— yanlışları düzeltip tekrar dene'}</div><table class="tbl"><tr><th>No</th><th>Yapının adı</th><th>Görevi</th></tr>${rows.join('')}</table>`;
    if (ok === 7) award('g_neuron', 40, 'Nöron etiketleme tamam!');
  };
}

/* ---------- Zar yükü ---------- */
function gameCharge(box) {
  const PH = [{ n: 'Polarizasyon', o: '+', i: '−', d: 'Dinlenme: dışta pozitif, içte negatif yük.' }, { n: 'Depolarizasyon', o: '−', i: '+', d: 'Pozitif iyonlar hücre içine girer: dışta negatif, içte pozitif.' }, { n: 'Repolarizasyon', o: '+', i: '−', d: 'Pozitif iyonlar dışarı çıkar: zar dinlenme hâline döner.' }];
  const wrap = document.createElement('div'); wrap.className = 'game';
  wrap.innerHTML = `<p>Her evre için nöron zarının <b>dış</b> ve <b>iç</b> yüzündeki baskın yükü seç.</p><div class="cards3">${PH.map((p, i) => `<div class="mini"><h4>${p.n}</h4><label>Dış kısım ${selectHTML(['+', '−'], 'o' + i)}</label><label>İç kısım ${selectHTML(['+', '−'], 'i' + i)}</label><small class="d"></small></div>`).join('')}</div><div class="btns"><button class="btn" id="cc">Kontrol et</button></div><div class="fbk"></div>`;
  box.appendChild(wrap);
  wrap.querySelector('#cc').onclick = () => {
    let ok = 0; PH.forEach((p, i) => { const so = wrap.querySelector(`[data-id=o${i}]`), si = wrap.querySelector(`[data-id=i${i}]`); const a = so.value === p.o, b = si.value === p.i; so.className = a ? 'ok' : 'bad'; si.className = b ? 'ok' : 'bad'; if (a && b) ok++; wrap.querySelectorAll('.d')[i].textContent = (a && b) ? p.d : ''; });
    wrap.querySelector('.fbk').innerHTML = `<div class="result ${ok === 3 ? 'good' : 'warn'}">${ok}/3 evre doğru</div>`;
    if (ok === 3) award('g_charge', 30, 'Zar yükü ustası!');
  };
}

/* ---------- Uyaran-reseptör ---------- */
function gameStim(box) {
  const R = ['Termoreseptör', 'Elektromanyetik reseptör', 'Mekanoreseptör', 'Kemoreseptör', 'Nosiseptör'];
  const ROWS = [['🌡️ Isı', 'Fiziksel', 'Termoreseptör'], ['☀️ Işık', 'Fiziksel', 'Elektromanyetik reseptör'], ['👆 Dokunma', 'Fiziksel', 'Mekanoreseptör'], ['⬇️ Basınç', 'Fiziksel', 'Mekanoreseptör'], ['⚡ Elektrik', 'Fiziksel', 'Elektromanyetik reseptör'], ['🧲 Manyetizma', 'Fiziksel', 'Elektromanyetik reseptör'], ['🌸 Koku molekülü', 'Kimyasal', 'Kemoreseptör'], ['🍋 Tat molekülü', 'Kimyasal', 'Kemoreseptör']];
  const wrap = document.createElement('div'); wrap.className = 'game';
  wrap.innerHTML = `<table class="tbl"><tr><th>Uyaran</th><th>Uyaran türü</th><th>Algılayan reseptör</th></tr>${ROWS.map((r, i) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${selectHTML(R, i)}</td></tr>`).join('')}</table><div class="btns"><button class="btn" id="sc">Kontrol et</button></div><div class="fbk"></div>`;
  box.appendChild(wrap);
  wrap.querySelector('#sc').onclick = () => { let ok = 0; wrap.querySelectorAll('select').forEach((s, i) => { const g = s.value === ROWS[i][2]; s.className = g ? 'ok' : 'bad'; if (g) ok++; }); wrap.querySelector('.fbk').innerHTML = `<div class="result ${ok === 8 ? 'good' : 'warn'}">${ok}/8 doğru</div><p class="hint">İpucu: Işık, elektrik ve manyetizma elektromanyetik enerjinin farklı formlarıdır.</p>`; if (ok === 8) award('g_stim', 30, 'Uyaran–reseptör eşleşmesi tamam!'); };
}

/* ---------- Reseptör–organ eşleştirme ---------- */
function gameOrgan(box) {
  const ORG = ['Göz', 'Kulak', 'Burun', 'Dil', 'Deri'], TYP = ['Mekanoreseptör', 'Kemoreseptör', 'Fotoreseptör (elektromanyetik)'], STR = ['Nöron', 'Duyu epiteli'];
  const ROWS = [['💡 Işık', 'Göz', 'Fotoreseptör (elektromanyetik)', 'Nöron'], ['🖐️ Dokunma', 'Deri', 'Mekanoreseptör', 'Nöron'], ['🌸 Koku', 'Burun', 'Kemoreseptör', 'Nöron'], ['🔊 İşitme', 'Kulak', 'Mekanoreseptör', 'Duyu epiteli'], ['🍋 Tat', 'Dil', 'Kemoreseptör', 'Duyu epiteli']];
  const wrap = document.createElement('div'); wrap.className = 'game';
  wrap.innerHTML = `<table class="tbl"><tr><th>Reseptör</th><th>Duyu organı</th><th>Reseptör çeşidi</th><th>Yapısı</th></tr>${ROWS.map((r, i) => `<tr><td>${r[0]}</td><td>${selectHTML(ORG, 'o' + i)}</td><td>${selectHTML(TYP, 't' + i)}</td><td>${selectHTML(STR, 's' + i)}</td></tr>`).join('')}</table><div class="btns"><button class="btn" id="oc">Kontrol et</button></div><div class="fbk"></div>`;
  box.appendChild(wrap);
  wrap.querySelector('#oc').onclick = () => {
    let ok = 0; ROWS.forEach((r, i) => { let all = true;[['o', 1], ['t', 2], ['s', 3]].forEach(([p, k]) => { const s = wrap.querySelector(`[data-id=${p}${i}]`), g = s.value === r[k]; s.className = g ? 'ok' : 'bad'; if (!g) all = false; }); if (all) ok++; });
    wrap.querySelector('.fbk').innerHTML = `<div class="result ${ok === 5 ? 'good' : 'warn'}">${ok}/5 satır tamamen doğru</div>`;
    if (ok === 5) award('g_organ', 40, 'Reseptör–organ eşleştirme tamam!');
  };
}
/* ---------- 3B Organ Avcısı ---------- */
function gameAvci(box) {
  const KEYS = ['goz', 'kulak', 'burun', 'dil', 'deri', 'retina', 'korti', 'tattomurcugu'];
  const wrap = document.createElement('div'); wrap.className = 'game'; box.appendChild(wrap);
  const stat = document.createElement('div'); stat.className = 'prog'; const ask = document.createElement('div'); ask.className = 'avci-q'; const fb = document.createElement('div'); fb.className = 'fb';
  const slot = document.createElement('div'); wrap.append(stat, ask, slot, fb);
  let round = 0, score = 0, v = null, target = null, seq = shuffle(KEYS).slice(0, 6), locked = false;
  function next() {
    if (v) { v.destroy(); v = null; slot.innerHTML = ''; }
    if (round >= seq.length) { const good = score >= 5; ask.innerHTML = ''; fb.innerHTML = `<div class="result ${good ? 'good' : 'warn'}">Oyun bitti: <b>${score}/${seq.length}</b> ${good ? '🎉' : '— tekrar dene!'}</div>`; if (good) award('g_avci', 40, '3B Organ Avcısı tamamlandı!'); const b = document.createElement('button'); b.className = 'btn'; b.textContent = '🔁 Yeniden oyna'; b.onclick = () => { round = 0; score = 0; seq = shuffle(KEYS).slice(0, 6); fb.innerHTML = ''; next(); }; fb.appendChild(b); stat.textContent = ''; return; }
    const key = seq[round]; locked = false; fb.innerHTML = '';
    v = mount3D(slot, key, d => {
      if (!d || locked) return; locked = true;
      const ok = d.name === target; if (ok) score++;
      fb.innerHTML = `<div class="result ${ok ? 'good' : 'warn'}">${ok ? '✅ Doğru!' : `❌ Tıkladığın: <b>${d.name}</b>. Aranan: <b>${target}</b>`}</div>`;
      if (!ok) v.select(target, true);
      const b = document.createElement('button'); b.className = 'btn'; b.textContent = 'Sonraki →'; b.onclick = () => { round++; next(); }; fb.appendChild(b); stat.textContent = `Tur ${round + 1}/${seq.length} · Skor ${score}`;
    }, { h: 380, noAuto: false });
    target = v.names[Math.floor(Math.random() * v.names.length)];
    stat.textContent = `Tur ${round + 1}/${seq.length} · Skor ${score}`; ask.innerHTML = `<b>${M3[key].ico} ${M3[key].title}</b> modelinde <b>“${target}”</b> yapısını bul ve tıkla.`;
  }
  next();
  return () => { if (v) v.destroy(); };
}
const GAME_FN = { tree: gameTree, neuron: gameNeuron, charge: gameCharge, stim: gameStim, organ: gameOrgan, avci: gameAvci };
