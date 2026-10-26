/* Nasse Fizik — ana uygulama (yönlendirme, konu, simülasyon (araştırma-sorgulama), soru bankası, açık uçlu bağlam soruları) */
const $ = (s, e) => (e || document).querySelector(s);
const $$ = (s, e) => [...(e || document).querySelectorAll(s)];
const view = $('#view');
let cleanup = null;
const KEY = 'nasse_fiz_v1';
let S = { xp: 0, done: {}, streak: 0, last: '' };
try { S = Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { }
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
const level = () => Math.floor(S.xp / 120) + 1;
function hud() { $('#hudLvl').textContent = 'Sv ' + level(); $('#hudXp').textContent = S.xp + ' XP'; $('#hudStreak').textContent = '🔥 ' + S.streak; $('#hudBar').style.width = (S.xp % 120) / 120 * 100 + '%'; }
function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = msg; document.body.appendChild(t); setTimeout(() => t.classList.add('show'), 20); setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2600); }
function confetti() { for (let i = 0; i < 26; i++) { const c = document.createElement('i'); c.className = 'cf'; c.style.left = Math.random() * 100 + 'vw'; c.style.background = ['#a78bfa', '#2ecc71', '#ffd34d', '#4da3ff', '#ff7ab8'][i % 5]; c.style.animationDelay = Math.random() * .4 + 's'; document.body.appendChild(c); setTimeout(() => c.remove(), 2200); } }
function award(key, xp, msg) {
  if (S.done[key]) return false; S.done[key] = 1; const before = level(); S.xp += xp; save(); hud();
  toast(`⭐ +${xp} XP · ${msg || 'Harika!'}`); confetti(); if (level() > before) setTimeout(() => toast('🚀 Seviye atladın! Sv ' + level()), 900); return true;
}
(function streak() { const d = new Date().toISOString().slice(0, 10); if (S.last !== d) { const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10); S.streak = S.last === y ? S.streak + 1 : 1; S.last = d; save(); } })();
function h(html, cls) { const d = document.createElement('div'); if (cls) d.className = cls; d.innerHTML = html; return d; }
function norm(s) { return String(s).toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[₀-₉²³]/g, m => ({ '²': '2', '³': '3' }[m] || '')).replace(/[^a-z0-9 /^]/g, ' ').replace(/\s+/g, ' ').trim(); }
function matchAny(input, list) { const n = norm(input), ns = n.replace(/ /g, ''); if (!n) return false; return list.some(g => g.split('+').every(t => { const tt = norm(t); return n.includes(tt) || ns.includes(tt.replace(/ /g, '')); })); }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function flowHTML(arr) { return `<div class="flow">${arr.map((x, i) => `<span class="chip" style="animation-delay:${i * .12}s">${x}</span>${i < arr.length - 1 ? '<i class="arr">➜</i>' : ''}`).join('')}</div>`; }
function makeMC(spec, o) {
  o = o || {}; const order = o.shuffle ? shuffle(spec.o.map((t, i) => i)) : spec.o.map((t, i) => i);
  const d = h(`<div class="qt">${spec.q}</div><div class="opts">${order.map((oi, k) => `<button class="opt" data-i="${oi}"><b>${'ABCD'[k]}</b> ${spec.o[oi]}</button>`).join('')}</div><div class="fb"></div>`, 'qbox'); let locked = false;
  $$('.opt', d).forEach(b => b.onclick = () => { if (locked) return; const i = +b.dataset.i, good = i === spec.a; locked = true; $$('.opt', d).forEach(x => { x.disabled = true; if (+x.dataset.i === spec.a) x.classList.add('ok'); }); if (!good) b.classList.add('bad'); $('.fb', d).innerHTML = `<div class="${good ? 'good' : 'warn'} result">${good ? '✅ Doğru!' : '❌ Yanlış.'} ${spec.e || ''}</div>`; if (good && o.key) award(o.key, o.xp || 10, o.msg); if (o.onAnswer) o.onAnswer(good); });
  return d;
}
const taskBox = t => h(`<b>🎯 Görev</b><p>${t}</p>`, 'task');
const simsOfTopic = id => (window.SIMF_ORDER || []).filter(k => SIMF[k].topic === id);
const ROUTES = {};
const NUM = x => parseFloat(String(x).replace(',', '.').replace(/[^0-9eE+\-.]/g, ''));

/* ---------- ANA SAYFA ---------- */
ROUTES.home = () => {
  const done = k => Object.keys(S.done).filter(x => x.startsWith(k)).length;
  const secs = [['#/konu', '📖', 'Konu Anlatımı', done('k_'), FTOPICS.length], ['#/sim', '🔬', 'Simülasyon Laboratuvarı', done('sim_'), SIMF_ORDER.length], ['#/oyun', '🎮', 'Oyunlar', done('g_'), Object.keys(FGAMES).length], ['#/soru', '📝', 'Soru Bankası', done('q_'), FBANK.length], ['#/baglam', '🧠', 'Açık Uçlu Bağlam Soruları', done('bt_'), FBAGLAM.length]];
  const badges = [['🍎', 'Serbest Düşme Ustası', S.done.sim_serbest], ['🎯', 'Eğik Atış Uzmanı', S.done.sim_egik], ['📐', 'Eğik Düzlem Kaşifi', S.done.sim_duzlem], ['🧪', 'Hipotez Avcısı', done('sim_') >= 4], ['🏆', 'Bağlam Ustası', done('bt_') >= 6], ['🔐', 'Kaçış Ustası', store.get('escape_best', null) !== null]];
  view.innerHTML = '';
  view.appendChild(h(`<div class="hero"><div class="orbit"><span>🚀</span><span>🎯</span><span>🍎</span><span>⚽</span><span>🏹</span><span>🌍</span></div><h1>Nasse Fizik</h1><p class="sub">11. sınıf · Atışlar</p><p class="kaz">${FKAZANIM}</p><div class="credit">Los Galacticos · Selahattin Eren</div><a class="btn big" href="#/sim">🔬 Laboratuvara gir</a></div>`));
  view.appendChild(h(`<div class="grid">${secs.map(s => `<a class="tile" href="${s[0]}"><div class="ti">${s[1]}</div><b>${s[2]}</b><div class="pbar"><i style="width:${s[4] ? Math.min(100, s[3] / s[4] * 100) : 0}%"></i></div><small>${s[3]} / ${s[4]}</small></a>`).join('')}<a class="tile" href="escape.html"><div class="ti">🔐</div><b>Kaçış Odası</b><small>Biyoloji + Fizik</small></a></div>`));
  view.appendChild(h(`<h3>🔬 Her simülasyonda: Merak Et → Hipotez Kur → Dene → Veri/Grafik → Sonuç</h3><p>Maarif modelinin sorgulama basamaklarını izleyerek her simülasyona önce <b>hipotezini kurarsın</b>, sonra denersin, ölçümlerini tabloya yazarsın ve hipotezinle sonucu karşılaştırırsın.</p><div class="orgs">${SIMF_ORDER.map(k => `<a class="orgchip" href="#/sim/${k}"><span>${SIMF[k].ico}</span>${SIMF[k].title}</a>`).join('')}</div>`, 'sec'));
  view.appendChild(h(`<h3>🏅 Rozetler</h3><div class="badges">${badges.map(b => `<div class="badge ${b[2] ? 'on' : ''}"><span>${b[0]}</span>${b[1]}</div>`).join('')}</div>`, 'sec'));
  view.appendChild(h(`<h3>Kapsam</h3><p>Bu site 11. sınıf fizik “Atışlar” konusuna göredir: vektörlerin bileşenleri, serbest düşme, düşey atış, yatay atış, eğik atış, yüksekten atış ve eğik düzlemde atış. Hesaplamalarda <b>g = 10 m/s²</b> alınır; hava direnci ihmal edilir (simülasyonlarda isteğe bağlı olarak eklenebilir). Biyoloji ile birlikte çalışmak için üstteki “Ders seç” bağlantısını kullan.</p>`, 'sec'));
};

/* ---------- KONU ---------- */
ROUTES.konu = id => {
  view.innerHTML = '';
  if (!id) { view.appendChild(h('<h2>📖 Konu Anlatımı</h2><p class="sub"><b>Merak Et → Öğren → Bağ Kur → Becerini Dene</b></p>')); view.appendChild(h(`<div class="grid">${FTOPICS.map((t, i) => `<a class="tile" href="#/konu/${t.id}"><div class="ti">${t.ico}</div><b>${i + 1}. ${t.title}</b><small>${t.code}${S.done['k_' + t.id] ? ' · ✅' : ''}</small></a>`).join('')}</div>`)); return; }
  const i = FTOPICS.findIndex(t => t.id === id), t = FTOPICS[i]; if (!t) return;
  const sims = simsOfTopic(t.id);
  const wrap = h(`<a class="back" href="#/konu">← Konular</a><div class="topic"><span class="code">${t.code}</span><h2>${t.ico} ${t.title}</h2>
   <div class="step s1"><h4>🔍 Merak Et</h4><p>${t.merak}</p></div>${t.flow ? flowHTML(t.flow) : ''}
   <div class="step s2"><h4>📖 Öğren</h4>${t.ogren}</div><div class="step s3"><h4>🧩 Bağ Kur</h4><p>${t.bag}</p></div>
   <div class="step s4 note"><h4>⚠️ Kapsam Notu</h4><p>${t.note}</p></div>
   <div class="links">${sims.map(k => `<a class="btn alt" href="#/sim/${k}">🔬 ${SIMF[k].title}</a>`).join('')}</div>
   <div class="step s5"><h4>✅ Becerini Dene</h4></div></div>`);
  $('.s5', wrap).appendChild(makeMC(t.check, { key: 'k_' + t.id, xp: 15, msg: 'Konu pekişti!' }));
  wrap.appendChild(h(`${i > 0 ? `<a class="btn ghost" href="#/konu/${FTOPICS[i - 1].id}">← Önceki</a>` : '<span></span>'}${i < FTOPICS.length - 1 ? `<a class="btn" href="#/konu/${FTOPICS[i + 1].id}">Sonraki →</a>` : `<a class="btn" href="#/baglam">Bağlam sorularına geç →</a>`}`, 'nav2'));
  view.appendChild(wrap);
};

/* ---------- SİMÜLASYON (Merak → Hipotez → Deney → Sonuç) ---------- */
ROUTES.sim = id => {
  view.innerHTML = '';
  if (!id || !SIMF[id]) {
    view.appendChild(h('<h2>🔬 Simülasyon Laboratuvarı</h2><p class="sub">Bilim insanı gibi çalış: <b>Merak et → Hipotez kur → Dene → Veri topla → Sonuç yaz</b></p>'));
    view.appendChild(h(`<div class="grid">${SIMF_ORDER.map(k => `<a class="tile" href="#/sim/${k}"><div class="ti">${SIMF[k].ico}</div><b>${SIMF[k].title}</b><small>${S.done['sim_' + k] ? '✅ tamamlandı' : 'başla'}</small></a>`).join('')}</div>`)); return;
  }
  const D = SIMF[id], hkey = 'fiz_h_' + id; let saved = store.get(hkey, null), lab = null, unlocked = !!saved;
  view.appendChild(h(`<a class="back" href="#/sim">← Simülasyonlar</a><h2>${D.ico} ${D.title}</h2>`));
  const steps = h('', 'inq'); const names = ['🔍 Merak et', '💡 Hipotez kur', '🧪 Dene', '📊 Veri ve sonuç', '✅ Gözlem'];
  steps.innerHTML = names.map((n, i) => `<span class="isp" data-i="${i}">${n}</span>`).join('<i class="arr">➜</i>'); view.appendChild(steps);
  const mark = n => $$('.isp', steps).forEach(s => s.classList.toggle('on', +s.dataset.i <= n));
  mark(unlocked ? 2 : 1);
  view.appendChild(h(`<h4>🔍 1. Merak Et</h4><p>${D.merak}</p>`, 'step s1'));
  /* hipotez */
  const hs = h(`<h4>💡 2. Hipotez Kur</h4><p class="hint">Simülasyonu çalıştırmadan önce tahminini seç ve gerekçeni yaz. Doğru ya da yanlış olması önemli değil; bilim insanları da önce hipotez kurar.</p>`, 'step s2');
  D.hip.forEach((q, qi) => {
    const c = h(`<div class="qt">${qi + 1}. ${q.q}</div><div class="opts">${q.o.map((o, oi) => `<label class="opt hopt"><input type="radio" name="h${qi}" value="${oi}" ${saved && saved.c[qi] === oi ? 'checked' : ''}> ${o}</label>`).join('')}</div><label class="fld">Gerekçem (neden böyle düşünüyorsun?)<textarea rows="2" data-r="${qi}" placeholder="Hipotezimi şu nedenle seçtim…">${saved ? (saved.r[qi] || '') : ''}</textarea></label>`, 'qbox'); hs.appendChild(c);
  });
  const hsave = h('<button class="btn">💾 Hipotezlerimi kaydet ve laboratuvara geç</button>').firstChild, hskip = h('<button class="btn ghost">Şimdilik atla</button>').firstChild; hs.appendChild(h('', 'btns')); hs.lastChild.append(hsave, hskip); view.appendChild(hs);
  /* deney */
  const ds = h(`<h4>🧪 3. Dene</h4>`, 'step s3'); ds.appendChild(h('<b>📋 Görevler</b><ol class="tasks">' + D.gorev.map(g => `<li><label><input type="checkbox"> ${g}</label></li>`).join('') + '</ol>', 'task'));
  const lock = h('🔒 Önce hipotezlerini kaydet (yukarıda).', 'lockmsg'); const labBox = h('', 'labbox'); ds.append(lock, labBox); view.appendChild(ds);
  /* sonuç */
  const rs = h(`<h4>📊 4. Veri ve Sonuç</h4><p class="hint">Deneyde en az bir ölçüm al (“📌 Ölçüm al” düğmesi). Sonra hipotezlerini sına.</p>`, 'step s4'); const rbox = h(''); const rbtn = h('<button class="btn" disabled>🔎 Hipotezlerimi sına</button>').firstChild; rs.append(rbtn, rbox); view.appendChild(rs);
  const gs = h(`<h4>✅ 5. Gözlem Soruları</h4>`, 'step s5'); D.gozlem.forEach((q, qi) => gs.appendChild(makeMC(q, { key: 'simq_' + id + qi, xp: 10, msg: 'Gözlemini doğru yorumladın!', onAnswer: () => { if ($$('.qbox .result', gs).length >= D.gozlem.length) award('sim_' + id, 30, 'Simülasyon tamamlandı!'); } }))); view.appendChild(gs);
  const topic = FTOPICS.find(t => t.id === D.topic); if (topic) view.appendChild(h(`<a class="btn alt" href="#/konu/${D.topic}">📖 Konu anlatımı: ${topic.title}</a>`, 'links'));
  function openLab() { if (lab) return; unlocked = true; lock.style.display = 'none'; mark(2); lab = PHLab(labBox, Object.assign({}, D.cfg(), { onRecord: rows => { rbtn.disabled = rows.length < 1; mark(3); } })); window._lab = lab; }
  hsave.onclick = () => { const c = D.hip.map((q, qi) => { const r = $(`input[name=h${qi}]:checked`, hs); return r ? +r.value : null; }); if (c.some(v => v === null)) { toast('⚠️ Her soru için bir tahmin seç.'); return; } saved = { c, r: D.hip.map((q, qi) => $(`[data-r="${qi}"]`, hs).value) }; store.set(hkey, saved); toast('💡 Hipotezler kaydedildi!'); openLab(); ds.scrollIntoView({ behavior: 'smooth' }); };
  hskip.onclick = () => { openLab(); ds.scrollIntoView({ behavior: 'smooth' }); };
  if (unlocked) openLab();
  rbtn.onclick = () => {
    const mine = saved ? saved.c : []; let good = 0;
    rbox.innerHTML = D.hip.map((q, qi) => { const ok = mine[qi] === q.a; if (ok) good++; return `<div class="qbox"><div class="qt">${qi + 1}. ${q.q}</div><div class="${mine[qi] === undefined || mine[qi] === null ? 'warn' : ok ? 'good' : 'warn'} result">${mine[qi] === undefined || mine[qi] === null ? 'Hipotez kurmadın.' : (ok ? '✅ Hipotezin doğrulandı: ' : '❌ Hipotezin desteklenmedi (' + q.o[mine[qi]] + '). ')}<br><b>Doğrusu: ${q.o[q.a]}</b><br>${q.why}</div></div>`; }).join('') +
      `<label class="fld">✍️ Sonuç cümlen (verilerine dayanarak yaz: “Hipotezim … Verilerim … gösterdi. Bu yüzden …”)<textarea rows="3" id="sonuc" placeholder="Sonucumu şöyle yazıyorum…"></textarea></label><button class="btn" id="ssave">Sonucumu kaydet</button><div class="fb"></div>`;
    $('#ssave', rbox).onclick = () => { const v = $('#sonuc', rbox).value.trim(); if (v.length < 25) { toast('✍️ Sonucunu en az bir cümleyle yaz.'); return; } store.set('fiz_s_' + id, v); $('.fb', rbox).innerHTML = '<div class="good result">✅ Sonucun kaydedildi. Şimdi gözlem sorularını yanıtla!</div>'; award('simr_' + id, 20, 'Bilimsel sonuç yazdın!'); mark(4); gs.scrollIntoView({ behavior: 'smooth' }); };
    mark(4); $('.fb', rbox);
  };
  cleanup = () => { if (lab) lab.destroy(); window._lab = null; };
};

/* ---------- SORU BANKASI ---------- */
ROUTES.soru = () => {
  view.innerHTML = '';
  view.appendChild(h(`<h2>📝 Soru Bankası</h2><p class="sub">${FBANK.length} soru · konu seç, 10 soruluk tur başlat. (g = 10 m/s²)</p><div class="ctl"><select id="qt"><option value="">Tüm konular</option>${FTOPICS.map(t => `<option value="${t.id}">${t.title}</option>`).join('')}</select><button class="btn" id="qs">▶ Başlat</button></div><div id="qa"></div>`));
  $('#qs').onclick = () => {
    const f = $('#qt').value; let pool = FBANK.map((q, i) => ({ q, i })).filter(x => !f || x.q.t === f); pool = shuffle(pool).slice(0, 10); let n = 0, score = 0; const qa = $('#qa');
    function next() {
      if (n >= pool.length) { const good = score >= Math.ceil(pool.length * .8); if (good && pool.length >= 5) award('qr_' + Date.now(), 20, 'Tur bonusu!'); qa.innerHTML = ''; qa.appendChild(h(`<div class="result ${good ? 'good' : 'warn'}">Tur bitti: <b>${score}/${pool.length}</b> ${good ? '🎉' : '— tekrar dene!'}</div>`)); return; }
      const it = pool[n]; qa.innerHTML = ''; qa.appendChild(h(`<div class="prog">Soru ${n + 1}/${pool.length} · Skor ${score}</div>`));
      qa.appendChild(makeMC(it.q, { shuffle: true, onAnswer: g => { if (g) { score++; award('q_' + it.i, 5, 'Doğru!'); } const b = h('<button class="btn">Sonraki →</button>'); b.firstChild.onclick = () => { n++; next(); }; qa.appendChild(b.firstChild); } }));
    }
    next();
  };
};

/* ---------- AÇIK UÇLU BAĞLAM SORULARI ---------- */
ROUTES.baglam = () => {
  view.innerHTML = '';
  view.appendChild(h(`<h2>🧠 Bağlam Temelli Açık Uçlu Sorular</h2><p class="sub">Senaryoyu oku, sayısal cevapları ve açıklamaları kendi cümlelerinle yaz. Açıklamalar <b>ölçütlere</b> göre değerlendirilir; “Model cevap” ile karşılaştır. (g = 10 m/s²)</p><div class="ctl"><select id="bf"><option value="">Tüm konular</option>${FTOPICS.map(t => `<option value="${t.id}">${t.title}</option>`).join('')}</select></div><div id="bl"></div>`));
  function list() {
    const f = $('#bf').value, bl = $('#bl'); bl.innerHTML = '';
    FBAGLAM.filter(b => !f || b.topic === f).forEach(b => {
      const c = h(`<div class="bt-h"><span>${S.done['bt_' + b.id] ? '✅' : '❓'}</span><b>${b.title}</b></div><div class="ctx">${b.ctx}</div><p class="ask"><b>Soru:</b> ${b.ask}</p>
       ${b.parts.map((p, i) => p.type === 'num' ? `<label class="fld">${p.l}<input type="text" data-i="${i}" inputmode="decimal" placeholder="Sayısal sonuç${p.unit ? ' (' + p.unit + ')' : ''}" autocomplete="off"></label>` : `<label class="fld">${p.l}<textarea rows="2" data-i="${i}" placeholder="Açıklamanı yaz…"></textarea></label>`).join('')}
       <div class="btns"><button class="btn chk">Kontrol et</button><button class="btn ghost mod">Model cevap</button>${b.sim ? `<a class="btn alt" href="#/sim/${b.sim}">🔬 Simülasyonda dene</a>` : ''}</div><div class="fb"></div>`, 'btcard');
      $('.chk', c).onclick = () => {
        let total = 0, got = 0, allNum = true, html = '';
        b.parts.forEach((p, i) => {
          const el = $(`[data-i="${i}"]`, c), val = el.value;
          if (p.type === 'num') { const v = NUM(val), ok = isFinite(v) && Math.abs(v - p.a) <= p.tol; total++; if (ok) got++; else allNum = false; el.className = ok ? 'ok' : 'bad'; html += `<div class="rub ${ok ? 'ok' : 'bad'}">${ok ? '✅' : '❌'} ${p.l}${ok ? '' : ' — ipucu: formülü ve birimleri kontrol et'}</div>`; }
          else { let m = 0; const rows = p.rubric.map(r => { const ok = matchAny(val, r.k); if (ok) m++; return `<li class="${ok ? 'ok' : 'bad'}">${ok ? '✅' : '⬜'} ${r.t}</li>`; }); total += p.rubric.length; got += m; el.className = m === p.rubric.length ? 'ok' : 'bad'; html += `<div class="rub"><b>${p.l}</b><ul class="rubl">${rows.join('')}</ul></div>`; }
        });
        const pass = got >= Math.ceil(total * .75);
        $('.fb', c).innerHTML = `<div class="result ${pass ? 'good' : 'warn'}"><b>Ölçüt puanı: ${got}/${total}</b> ${pass ? '🎉' : '— eksik ölçütleri tamamla'}${html}<small>Not: Açıklamalar anahtar kavramlara göre taranır; farklı kelimelerle de doğru yazmış olabilirsin — “Model cevap”la karşılaştır.</small></div>`;
        if (pass) { award('bt_' + b.id, 25, 'Bağlam sorusu çözüldü!'); $('.bt-h span', c).textContent = '✅'; }
      };
      $('.mod', c).onclick = () => { $('.fb', c).innerHTML = `<div class="result good"><b>Model cevap:</b> ${b.model}</div>`; };
      bl.appendChild(c);
    });
  }
  $('#bf').onchange = list; list();
};

/* ---------- OYUNLAR ---------- */
ROUTES.oyun = id => {
  view.innerHTML = '';
  if (!id || !FGAMES[id]) { view.appendChild(h('<h2>🎮 Oyunlar</h2><p class="sub">Öğrenirken eğlen!</p>')); view.appendChild(h(`<div class="grid">${Object.keys(FGAMES).map(k => `<a class="tile" href="#/oyun/${k}"><div class="ti">${FGAMES[k].ico}</div><b>${FGAMES[k].title}</b><small>${FGAMES[k].desc}${S.done['g_' + k] ? ' ✅' : ''}</small></a>`).join('')}<a class="tile" href="escape.html"><div class="ti">🔐</div><b>Biyo-Fizik Kaçış Odası</b><small>Fizik + biyoloji bulmacaları, süreye karşı yarış</small></a></div>`)); return; }
  view.appendChild(h(`<a class="back" href="#/oyun">← Oyunlar</a><h2>${FGAMES[id].ico} ${FGAMES[id].title}</h2>`));
  const off = FGAMES[id].fn(view); if (typeof off === 'function') cleanup = off;
};

function route() {
  if (cleanup) { try { cleanup(); } catch (e) { } cleanup = null; }
  const [, r, p] = (location.hash || '#/home').split('/'); const name = ROUTES[r] ? r : 'home';
  $$('nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#/' + name));
  window.scrollTo(0, 0); ROUTES[name](p); hud();
}
window.addEventListener('hashchange', route); window.addEventListener('load', route);
