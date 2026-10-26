/* Nasse Biology — ana uygulama */
const $ = (s, e) => (e || document).querySelector(s);
const $$ = (s, e) => [...(e || document).querySelectorAll(s)];
const view = $('#view');
let cleanup = null, viewer = null, viewers = [];
function killViewers() { viewers.forEach(v => { try { v.destroy(); } catch (e) { } }); viewers = []; viewer = null; }

/* ---------- Durum (ilerleme) ---------- */
let S = { xp: 0, done: {}, streak: 0, last: '', name: '' };
try { S = Object.assign(S, JSON.parse(localStorage.getItem('nasse_v2') || '{}')); } catch (e) { }
function save() { localStorage.setItem('nasse_v2', JSON.stringify(S)); if (window.cloudSave) window.cloudSave(S); }
const level = () => Math.floor(S.xp / 120) + 1;
function hud() { $('#hudLvl').textContent = 'Sv ' + level(); $('#hudXp').textContent = S.xp + ' XP'; $('#hudStreak').textContent = '🔥 ' + S.streak; $('#hudBar').style.width = (S.xp % 120) / 120 * 100 + '%'; }
function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = msg; document.body.appendChild(t); setTimeout(() => t.classList.add('show'), 20); setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2600); }
function confetti() { for (let i = 0; i < 26; i++) { const c = document.createElement('i'); c.className = 'cf'; c.style.left = Math.random() * 100 + 'vw'; c.style.background = ['#22d3ee', '#2ecc71', '#ffd34d', '#4da3ff', '#ff7ab8'][i % 5]; c.style.animationDelay = Math.random() * .4 + 's'; document.body.appendChild(c); setTimeout(() => c.remove(), 2200); } }
function award(key, xp, msg) {
  if (S.done[key]) return false; S.done[key] = 1; const before = level(); S.xp += xp; save(); hud();
  toast(`⭐ +${xp} XP · ${msg || 'Harika!'}`); confetti(); if (level() > before) setTimeout(() => toast('🚀 Seviye atladın! Sv ' + level()), 900); return true;
}
(function streak() { const d = new Date().toISOString().slice(0, 10); if (S.last !== d) { const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10); S.streak = S.last === y ? S.streak + 1 : 1; S.last = d; save(); } })();

/* ---------- Yardımcılar ---------- */
function h(html, cls) { const d = document.createElement('div'); if (cls) d.className = cls; d.innerHTML = html; return d; }
function norm(s) { return String(s).toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(); }
function matchAny(input, list) { const n = norm(input), ns = n.replace(/ /g, ''); if (!n) return false; return list.some(g => g.split('+').every(t => { const tt = norm(t); return n.includes(tt) || ns.includes(tt.replace(/ /g, '')); })); }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
function flowHTML(arr) { return `<div class="flow">${arr.map((x, i) => `<span class="chip" style="animation-delay:${i * .12}s">${x}</span>${i < arr.length - 1 ? '<i class="arr">➜</i>' : ''}`).join('')}</div>`; }

/* Çoktan seçmeli kutusu */
function makeMC(spec, o) {
  o = o || {}; const order = o.shuffle ? shuffle(spec.o.map((t, i) => i)) : spec.o.map((t, i) => i);
  const d = h(`<div class="qt">${spec.q}</div><div class="opts">${order.map((oi, k) => `<button class="opt" data-i="${oi}"><b>${'ABCD'[k]}</b> ${spec.o[oi]}</button>`).join('')}</div><div class="fb"></div>`, 'qbox');
  let locked = false;
  $$('.opt', d).forEach(b => b.onclick = () => {
    if (locked) return; const i = +b.dataset.i, good = i === spec.a; locked = true;
    $$('.opt', d).forEach(x => { x.disabled = true; if (+x.dataset.i === spec.a) x.classList.add('ok'); });
    if (!good) b.classList.add('bad');
    $('.fb', d).innerHTML = `<div class="${good ? 'good' : 'warn'} result">${good ? '✅ Doğru!' : '❌ Yanlış.'} ${spec.e || ''}</div>`;
    if (good && o.key) award(o.key, o.xp || 10, o.msg);
    if (o.onAnswer) o.onAnswer(good);
  });
  return d;
}
function taskBox(t) { return h(`<b>🎯 Görev</b><p>${t}</p>`, 'task'); }
function obsBox(spec, key) { const w = h('<b>🔎 Gözlem sorusu</b>', 'obs'); w.appendChild(makeMC(spec, { key, xp: 20, msg: 'Gözlemini doğru yorumladın!' })); return w; }


/* ---------- Ortak 3B görüntüleyici (etiket · kesit · katman · bilgi) ---------- */
function buildViewer(parent, key, o) {
  o = o || {}; const def = M3[key]; const wrap = h('', 'v3wrap'); parent.appendChild(wrap);
  const box = h('', 'v3d'); wrap.appendChild(box);
  const bar = h('', 'btns v3bar'); wrap.appendChild(bar);
  const info = h('<b>Bir parçaya tıkla</b><p>Seçtiğin yapının adı, görevi ve reseptör bilgisi burada görünür. Aynı yere tekrar tıklarsan arkadaki yapı seçilir.</p>', 'info');
  const chips = h('', 'chips'); const picked = new Set(); let v;
  v = mount3D(box, key, d => {
    if (!d) return; info.innerHTML = `<b>${d.name}</b>${d.tag ? `<span class="tagp">${d.tag}</span>` : ''}<p>${d.info}</p>`;
    $$('.chip2', chips).forEach(c => c.classList.toggle('on', c.dataset.n === d.name));
    picked.add(d.name); if (o.award !== false && picked.size >= Math.min(4, v.names.length)) award('x_' + key, 5, 'Modeli keşfettin!');
    if (o.onPick) o.onPick(d);
  }, { h: o.h, noAuto: o.noAuto });
  viewers.push(v); viewer = v;
  const mk = (txt, fn, cls) => { const b = h(`<button class="btn ghost ${cls || ''}">${txt}</button>`).firstChild; b.onclick = () => fn(b); bar.appendChild(b); return b; };
  mk('⏯ Otomatik dönme', b => { v.auto(!v.isAuto()); b.classList.toggle('on', v.isAuto()); }, v.isAuto() ? 'on' : '');
  mk('🏷️ Etiketler', b => { b._on = !b._on; v.setLabels(b._on); b.classList.toggle('on', b._on); });
  if (v.clip) {
    const cb = mk('✂️ Kesit', b => { const on = !v.isClip(); v.setClip(on, +sl.value); b.classList.toggle('on', on); sw.style.display = on ? '' : 'none'; }, v.isClip() ? 'on' : '');
    var sw = h(`<label class="cutsl" style="display:${v.isClip() ? '' : 'none'}">Kesit konumu <input type="range" min="${v.clip.min}" max="${v.clip.max}" step="0.02" value="${v.clip.def || 0}"></label>`); var sl = sw.querySelector('input'); bar.appendChild(sw);
    sl.oninput = () => v.setClip(true, +sl.value);
  }
  mk('🎯 Sıfırla', () => v.reset());
  if (v.layers.length) {
    const lay = h('<span class="laylab">Katmanlar:</span>', 'layers'); wrap.appendChild(lay);
    v.layers.forEach(l => { const c = h(`<label class="lay"><input type="checkbox" ${l[2] === 'off' ? '' : 'checked'}> ${l[0]}</label>`, 'layw'); c.querySelector('input').onchange = e => v.setLayer(l[1], e.target.checked); lay.appendChild(c); });
  }
  if (!o.noChips) { wrap.appendChild(chips); v.names.forEach(n => { const c = h(n, 'chip2'); c.dataset.n = n; c.onclick = () => v.select(n); chips.appendChild(c); }); }
  wrap.appendChild(info);
  return v;
}

/* ---------- Sayfalar ---------- */
const ROUTES = {};
const NEW_TOPIC_IDS = ['gozyapi', 'kulakyapi', 'denge', 'burunyapi', 'dilyapi', 'deriyapi', 'duyuyol'];

ROUTES.home = () => {
  const done = k => Object.keys(S.done).filter(x => x.startsWith(k)).length;
  const secs = [
    ['#/konu', '📖', 'Konu Anlatımı', done('k_'), TOPICS.length], ['#/3d', '🧊', '3B Duyu Organları', done('m_'), Object.keys(M3).length],
    ['#/sim', '🔬', 'Simülasyonlar', done('sim_'), Object.keys(SIMS).length], ['#/oyun', '🎮', 'Oyunlar', done('g_'), Object.keys(GAMES).length],
    ['#/soru', '📝', 'Soru Bankası', done('q_'), BANK.length], ['#/baglam', '🧠', 'Bağlam Temelli Sorular', done('bt_'), BAGLAM.length]
  ];
  const badges = [['🥇', 'Reseptör Kaşifi', done('k_') >= 4], ['🧬', 'Nöron Mühendisi', S.done.g_neuron], ['🔋', 'Zar Potansiyeli Ustası', S.done.g_charge && S.done.sim_ap], ['🌳', 'Ağaç Avcısı', S.done.g_tree], ['🧊', '3B Gezgin', done('m_') >= 3], ['🏆', 'Bağlam Ustası', done('bt_') >= 6]];
  view.innerHTML = '';
  view.appendChild(h(`<div class="hero"><div class="orbit"><span>🧠</span><span>👁️</span><span>👂</span><span>👃</span><span>👅</span><span>🖐️</span></div>
   <h1>Nasse Biology</h1><p class="sub">11. sınıf · Duyu Reseptörleri ve Duyu Organları · Nöron ve Sinaps</p>
   <p class="kaz">${KAZANIM}</p>
   <div class="credit">Los Galacticos · Barış Köseoğlu</div>
   <a class="btn big" href="#/konu">🚀 Öğrenmeye başla</a></div>`));
  view.appendChild(h(`<div class="grid">${secs.map(s => `<a class="tile" href="${s[0]}"><div class="ti">${s[1]}</div><b>${s[2]}</b><div class="pbar"><i style="width:${s[4] ? s[3] / s[4] * 100 : 0}%"></i></div><small>${s[3]} / ${s[4]}</small></a>`).join('')}</div>`));
  view.appendChild(h(`<h3>🧊 Duyu organlarını 3B keşfet</h3><p>Her organın ayrıntılı 3B modelini aç: etiketle, kesit al, katmanları aç-kapat ve simülasyonla dene.</p><div class="orgs">${[['👁️', 'Göz', 'goz'], ['👂', 'Kulak', 'kulak'], ['👃', 'Burun', 'burun'], ['👅', 'Dil', 'dil'], ['🖐️', 'Deri', 'deri']].map(o => `<a class="orgchip" href="#/3d/${o[2]}"><span>${o[0]}</span>${o[1]}</a>`).join('')}</div>`, 'sec'));
  view.appendChild(h(`<h3>🏅 Rozetler</h3><div class="badges">${badges.map(b => `<div class="badge ${b[2] ? 'on' : ''}"><span>${b[0]}</span>${b[1]}</div>`).join('')}</div>`, 'sec'));
  view.appendChild(h(`<h3>Kapsam</h3><p>Bu site, 11. sınıf Biyoloji “1.5. Duyu Reseptörleri ve Duyu Organları” kazanımı slaytlarına göre hazırlanmıştır. Ayrıntılı moleküler mekanizmalar (iyon kanalı/pompası çeşitleri, nörotransmitter çeşitleri), glia hücre çeşitleri ve görme kusurlarının ayrıntıları kapsam dışıdır. Göz uyumu (akomodasyon) ve denge organı ile duyu organlarının ayrıntılı yapıları bu sitede <b>ek bilgi</b> olarak 3B modellerle verilmiştir.</p>`, 'sec'));
};

ROUTES.konu = (id) => {
  view.innerHTML = '';
  if (!id) {
    view.appendChild(h('<h2>📖 Konu Anlatımı</h2><p class="sub">Maarif modeline uygun: <b>Merak Et → Öğren → Bağ Kur → Becerini Dene</b></p>'));
    view.appendChild(h(`<div class="grid">${TOPICS.map((t, i) => `<a class="tile" href="#/konu/${t.id}"><div class="ti">${t.ico}</div><b>${i + 1}. ${t.title}</b><small>${t.code}${S.done['k_' + t.id] ? ' · ✅' : ''}</small></a>`).join('')}</div>`));
    return;
  }
  const i = TOPICS.findIndex(t => t.id === id), t = TOPICS[i]; if (!t) return;
  const wrap = h(`<a class="back" href="#/konu">← Konular</a><div class="topic"><span class="code">${t.code}</span><h2>${t.ico} ${t.title}</h2>
   <div class="step s1"><h4>🔍 Merak Et</h4><p>${t.merak}</p></div>
   ${t.flow ? flowHTML(t.flow) : ''}
   <div class="step s2"><h4>📖 Öğren</h4>${t.ogren}</div>
   <div class="step s3"><h4>🧩 Bağ Kur</h4><p>${t.bag}</p></div>
   <div class="step s4 note"><h4>⚠️ Kapsam Notu</h4><p>${t.note}</p></div>
   <div class="links">${t.m3 ? `<a class="btn alt" href="#/3d/${t.m3}">🧊 3B modeli incele</a>` : ''}${t.sim ? `<a class="btn alt" href="#/sim/${t.sim}">🔬 Simülasyonu dene</a>` : ''}</div>
   <div class="step s5"><h4>✅ Becerini Dene</h4></div></div>`);
  const keys = [t.m3].concat(t.m3b || []).filter((k, i, a) => k && M3[k] && a.indexOf(k) === i);
  if (keys.length) {
    const em = h('<h4>🧊 3B Model</h4>', 'step s6 embed3'); const holder = h(''); const tabs = h('', 'tabs');
    const show = k => { killViewers(); holder.innerHTML = ''; $$('.tab', tabs).forEach(x => x.classList.toggle('on', x.dataset.k === k)); buildViewer(holder, k, { h: 380, award: true }); };
    const open = () => { em.classList.add('open'); show(keys[0]); btn.style.display = 'none'; };
    keys.forEach(k => { const a = h(`${M3[k].ico} ${M3[k].title}`, 'tab'); a.dataset.k = k; a.onclick = () => show(k); tabs.appendChild(a); });
    const btn = h('<button class="btn alt">🧊 Bu sayfada 3B modeli aç</button>').firstChild; btn.onclick = open;
    em.appendChild(tabs); em.appendChild(btn); em.appendChild(holder);
    $('.links', wrap).before(em);
    if (NEW_TOPIC_IDS.includes(t.id)) setTimeout(open, 30);
    cleanup = killViewers;
  }
  $('.s5', wrap).appendChild(makeMC(t.check, { key: 'k_' + t.id, xp: 15, msg: 'Konu pekişti!' }));
  if (t.widget) { const wb = h('<h4>🧪 Etkinlik ve uygulamalar</h4>', 'step s7 widget'); $('.s5', wrap).before(wb); try { t.widget(wb); } catch (e) { console.error(e); } }
  wrap.appendChild(h(`${i > 0 ? `<a class="btn ghost" href="#/konu/${TOPICS[i - 1].id}">← Önceki</a>` : '<span></span>'}${i < TOPICS.length - 1 ? `<a class="btn" href="#/konu/${TOPICS[i + 1].id}">Sonraki →</a>` : `<a class="btn" href="#/baglam">Bağlam sorularına geç →</a>`}`, 'nav2'));
  view.appendChild(wrap);
};

ROUTES['3d'] = (key) => {
  view.innerHTML = '';
  const order = (window.M3_ORDER || Object.keys(M3)).filter(k => M3[k]); Object.keys(M3).forEach(k => { if (!order.includes(k)) order.push(k); });
  key = key && M3[key] ? key : 'goz';
  view.appendChild(h(`<h2>🧊 3B Duyu Organları ve Nöron</h2><p class="sub">Döndür, yakınlaştır (iki parmak/tekerlek) ve parçalara tıkla. <b>Etiketler</b>, <b>kesit</b> ve <b>katman</b> düğmeleriyle içini incele.</p>
   <div class="tabs">${order.map(k => `<a class="tab ${k === key ? 'on' : ''}" href="#/3d/${k}">${M3[k].ico} ${M3[k].title}</a>`).join('')}</div>`));
  const def = M3[key];
  view.appendChild(taskBox(def.task));
  buildViewer(view, key);
  const rel = Object.keys(SIMS).filter(k => SIMS[k].m3 === key);
  if (rel.length) view.appendChild(h(rel.map(k => `<a class="btn alt" href="#/sim/${k}">🔬 Simülasyon: ${SIMS[k].title}</a>`).join(' '), 'links'));
  view.appendChild(obsBox(def.q, 'm_' + key));
  cleanup = killViewers;
};

ROUTES.sim = (id) => {
  view.innerHTML = '';
  if (!id || !SIMS[id]) { view.appendChild(h('<h2>🔬 Simülasyonlar</h2><p class="sub">Her simülasyondan önce bir <b>görev</b>, sonra bir <b>gözlem sorusu</b> var.</p>')); view.appendChild(h(`<div class="grid">${Object.keys(SIMS).map(k => `<a class="tile" href="#/sim/${k}"><div class="ti">${SIMS[k].ico}</div><b>${SIMS[k].title}</b><small>${S.done['sim_' + k] ? '✅ tamamlandı' : 'başla'}</small></a>`).join('')}</div>`)); return; }
  view.appendChild(h(`<a class="back" href="#/sim">← Simülasyonlar</a><h2>${SIMS[id].ico} ${SIMS[id].title}</h2>`));
  view.appendChild(taskBox(SIM_META[id].task));
  const box = h('', 'simbox'); view.appendChild(box);
  let off = null; cleanup = () => { if (off) off(); }; requestAnimationFrame(() => { if (location.hash.split('/')[2] === id) off = SIM_FN[id](box); });
  if (SIMS[id].m3 && M3[SIMS[id].m3]) view.appendChild(h(`<a class="btn alt" href="#/3d/${SIMS[id].m3}">🧊 İlgili 3B modeli incele</a>${SIMS[id].topic ? ` <a class="btn alt" href="#/konu/${SIMS[id].topic}">📖 Konu anlatımı</a>` : ''}`, 'links'));
  view.appendChild(obsBox(SIM_META[id].q, 'sim_' + id));
};

ROUTES.oyun = (id) => {
  view.innerHTML = '';
  if (!id || !GAMES[id]) { view.appendChild(h('<h2>🎮 Oyunlar</h2><p class="sub">Ayırt et, grupla, doğru biçimde etiketle!</p>')); view.appendChild(h(`<div class="grid">${Object.keys(GAMES).map(k => `<a class="tile" href="#/oyun/${k}"><div class="ti">${GAMES[k].ico}</div><b>${GAMES[k].title}</b><small>${GAMES[k].desc}${S.done['g_' + k] ? ' ✅' : ''}</small></a>`).join('')}<a class="tile" href="escape.html"><div class="ti">🔐</div><b>Biyo-Fizik Kaçış Odası</b><small>Biyoloji + fizik bulmacalarıyla laboratuvardan kaç!</small></a></div>`)); return; }
  view.appendChild(h(`<a class="back" href="#/oyun">← Oyunlar</a><h2>${GAMES[id].ico} ${GAMES[id].title}</h2>`));
  const off = GAME_FN[id](view); if (typeof off === 'function') cleanup = off;
};

ROUTES.soru = () => {
  view.innerHTML = '';
  view.appendChild(h(`<h2>📝 Soru Bankası</h2><p class="sub">${BANK.length} soru · konu seç, 10 soruluk tur başlat.</p>
   <div class="ctl"><select id="qt"><option value="">Tüm konular</option>${TOPICS.map(t => `<option value="${t.id}">${t.title}</option>`).join('')}</select><button class="btn" id="qs">▶ Başlat</button></div><div id="qa"></div>`));
  $('#qs').onclick = () => {
    const f = $('#qt').value; let pool = BANK.map((q, i) => ({ q, i })).filter(x => !f || x.q.t === f); pool = shuffle(pool).slice(0, 10);
    let n = 0, score = 0; const qa = $('#qa');
    function next() {
      if (n >= pool.length) { const good = score >= Math.ceil(pool.length * .8); if (good && pool.length >= 5) award('qr_' + Date.now(), 20, 'Tur bonusu!'); qa.innerHTML = ''; qa.appendChild(h(`<div class="result ${good ? 'good' : 'warn'}">Tur bitti: <b>${score}/${pool.length}</b> ${good ? '🎉' : '— tekrar dene!'}</div>`)); return; }
      const it = pool[n]; qa.innerHTML = ''; qa.appendChild(h(`<div class="prog">Soru ${n + 1}/${pool.length} · Skor ${score}</div>`));
      qa.appendChild(makeMC(it.q, { shuffle: true, onAnswer: g => { if (g) { score++; award('q_' + it.i, 5, 'Doğru!'); } if (it.q.m3 && M3[it.q.m3]) { const mb = h(`<button class="btn alt">🧊 Modelde göster${it.q.part ? ': ' + it.q.part : ''}</button>`).firstChild, slot = h(''); mb.onclick = () => { mb.disabled = true; killViewers(); const v = buildViewer(slot, it.q.m3, { h: 320, award: false, noAuto: true }); if (it.q.part && v.names.includes(it.q.part)) setTimeout(() => v.select(it.q.part, true), 200); }; qa.appendChild(mb); qa.appendChild(slot); } const b = h('<button class="btn">Sonraki →</button>'); b.firstChild.onclick = () => { killViewers(); n++; next(); }; qa.appendChild(b.firstChild); } }));
    }
    next(); cleanup = killViewers;
  };
};

ROUTES.baglam = () => {
  view.innerHTML = '';
  view.appendChild(h(`<h2>🧠 Bağlam Temelli Sorular</h2><p class="sub">Senaryoyu oku, yazılı cevabını kutulara gir. Yazım farklılıklarına toleranslıdır; “Model cevap” ile karşılaştır.</p>
   <div class="ctl"><select id="bf"><option value="">Tüm konular</option>${TOPICS.map(t => `<option value="${t.id}">${t.title}</option>`).join('')}</select></div><div id="bl"></div>`));
  function list() {
    const f = $('#bf').value, bl = $('#bl'); bl.innerHTML = '';
    killViewers();
    BAGLAM.filter(b => !f || b.topic === f).forEach((b, idx) => {
      const bm = (b.m3 && M3[b.m3]) ? b.m3 : (window.TOPIC_M3 && TOPIC_M3[b.topic] ? TOPIC_M3[b.topic][0] : null);
      const c = h(`<div class="bt-h"><span>${S.done['bt_' + b.id] ? '✅' : '❓'}</span><b>${b.title}</b></div><div class="ctx">${b.ctx}</div><p class="ask"><b>Soru:</b> ${b.ask}</p>
       ${b.parts.map((p, i) => `<label class="fld">${p.l}<input type="text" data-i="${i}" placeholder="Cevabını yaz…" autocomplete="off"></label>`).join('')}
       <div class="btns"><button class="btn chk">Kontrol et</button><button class="btn ghost mod">Model cevap</button>${bm ? `<button class="btn alt m3b">🧊 3B modele bak</button>` : ''}${b.sim && SIMS[b.sim] ? `<a class="btn alt" href="#/sim/${b.sim}">🔬 Simülasyon</a>` : ''}</div><div class="fb"></div><div class="m3slot"></div>`, 'btcard');
      if (bm) $('.m3b', c).onclick = () => { const sl = $('.m3slot', c); if (sl.firstChild) { viewers = viewers.filter(v => { if (v._slot === sl) { v.destroy(); return false; } return true; }); sl.innerHTML = ''; return; } buildViewer(sl, bm, { h: 340, award: false }); viewers[viewers.length - 1]._slot = sl; };
      $('.chk', c).onclick = () => {
        let ok = 0; $$('input', c).forEach((inp, i) => { const g = matchAny(inp.value, b.parts[i].a); inp.className = g ? 'ok' : 'bad'; if (g) ok++; });
        $('.fb', c).innerHTML = `<div class="result ${ok === b.parts.length ? 'good' : 'warn'}">${ok}/${b.parts.length} bölüm doğru ${ok === b.parts.length ? '🎉' : '— ipucu: kavramın bilimsel adını yaz'}</div>`;
        if (ok === b.parts.length) { award('bt_' + b.id, 25, 'Bağlam sorusu çözüldü!'); $('.bt-h span', c).textContent = '✅'; }
      };
      $('.mod', c).onclick = () => { $('.fb', c).innerHTML = `<div class="result good"><b>Model cevap:</b> ${b.model}</div>`; };
      bl.appendChild(c);
    });
  }
  $('#bf').onchange = list; list(); cleanup = killViewers;
};

/* ---------- Yönlendirici ---------- */
function route() {
  if (cleanup) { try { cleanup(); } catch (e) { } cleanup = null; }
  const [, r, p] = (location.hash || '#/home').split('/'); const name = ROUTES[r] ? r : 'home';
  $$('nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#/' + name));
  window.scrollTo(0, 0); ROUTES[name](p); hud();
}
window.addEventListener('hashchange', route);
window.addEventListener('load', route);

/* ---------- Firebase (isteğe bağlı) ---------- */
(function firebaseInit() {
  const cfg = window.FIREBASE_CONFIG; const btn = $('#loginBtn'); if (!btn) return;
  if (!cfg || !cfg.apiKey) { btn.style.display = 'none'; return; }
  const load = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  load('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js').then(() => load('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js')).then(() => load('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js')).then(() => {
    firebase.initializeApp(cfg); const auth = firebase.auth(), db = firebase.firestore(); let uid = null;
    window.cloudSave = d => { if (uid) db.collection('users').doc(uid).set({ progress: d, name: auth.currentUser.displayName || '', t: Date.now() }, { merge: true }).catch(() => { }); };
    auth.onAuthStateChanged(u => {
      if (u) { uid = u.uid; btn.textContent = '👤 ' + (u.displayName || 'Çıkış').split(' ')[0]; btn.onclick = () => auth.signOut();
        db.collection('users').doc(uid).get().then(s => { const p = s.exists && s.data().progress; if (p && p.xp > S.xp) { S = Object.assign(S, p); localStorage.setItem('nasse_v2', JSON.stringify(S)); hud(); route(); } else cloudSave(S); }).catch(() => { }); }
      else { uid = null; btn.textContent = 'Google ile giriş'; btn.onclick = () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(e => toast('Giriş yapılamadı')); }
    });
  }).catch(() => { btn.style.display = 'none'; });
})();
