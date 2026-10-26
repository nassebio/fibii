/* Nasse Biology — Duyu organlarının yapıları (göz, kulak, burun, dil, deri): ek konu, soru ve bağlam içeriği.
   data.js'teki mevcut içerik aynen korunur; bu dosya yalnızca ekleme yapar. */

/* ---------- Yeni konu anlatımları (organ konusunun hemen ardına eklenir) ---------- */
(function () {
  const NEW_TOPICS = [
    {
      id: 'gozyapi', code: '1.5.1 · göz', ico: '👁️', title: 'Göz: Yapı ve Görmenin Oluşumu',
      merak: 'Karanlık bir odadan parlak güneş ışığına çıktığında gözlerin neden kısa süre rahatsız olur? Sonra neden alışırsın?',
      flow: ['Işık', 'Kornea', 'Göz bebeği', 'Mercek', 'Retina (fotoreseptör)', 'Optik sinir', 'Beyin (algı)'],
      ogren: `
  <p>Göz, <b>ışığı algılayarak görme duyusunun oluşmasını sağlayan</b> duyu organıdır. Yapısındaki fotoreseptörler <b>elektromanyetik reseptör</b> grubundandır.</p>
  <h5>Gözün üç tabakası</h5>
  <table class="tbl"><tr><th>Tabaka</th><th>Yapılar</th><th>Görev</th></tr>
  <tr><td><b>Sert tabaka (sklera)</b></td><td>Sklera, ön tarafta saydamlaşıp <b>kornea</b>yı oluşturur</td><td>Gözü dış etkilerden korur, göz küresine şekil verir; kornea ışığı kırar</td></tr>
  <tr><td><b>Damar tabaka (koroid)</b></td><td>Koroid, <b>iris</b> (göz bebeği = pupilla), <b>kirpiksi cisim</b></td><td>Damar bakımından zengindir, gözü besler; iris göz bebeğinin çapını ayarlayıp göze giren ışığı düzenler; kirpiksi cisim merceğin şeklini değiştirmeye yardımcı olur</td></tr>
  <tr><td><b>Ağ tabaka (retina)</b></td><td>Çubuk ve koni hücreleri (fotoreseptörler), çift kutuplu ve ganglion nöronları</td><td>Işığa duyarlı reseptörleri içerir; ışık burada sinirsel sinyale dönüşür</td></tr></table>
  <h5>Önemli yapılar</h5>
  <ul>
   <li><b>Kornea:</b> ışığı kırar. <b>Göz bebeği:</b> ışığın göze girdiği açıklık. <b>İris:</b> göz bebeğinin çapını ayarlar.</li>
   <li><b>Mercek:</b> ışığı retinaya odaklar. <b>Askı bağları</b> ve <b>kirpiksi kas</b> merceğin şeklini ayarlar.</li>
   <li><b>Sarı benek:</b> görmenin en net olduğu bölge; <b>koni</b> yoğundur. <b>Kör nokta:</b> optik sinirin gözden çıktığı bölge; <b>fotoreseptör yoktur</b>.</li>
   <li><b>Optik sinir:</b> sinirsel mesajları beyne taşır. <b>Camsı sıvı ve göz içi sıvıları</b> gözün şeklini korur, ışığın geçişine katkı sağlar.</li>
  </ul>
  <h5>Çubuk ve koni karşılaştırması</h5>
  <table class="tbl"><tr><th>Özellik</th><th>Çubuk</th><th>Koni</th></tr>
  <tr><td>Işık koşulu</td><td>Az ışıkta etkili</td><td>Aydınlıkta etkili</td></tr>
  <tr><td>Renkli görme</td><td>Sağlamaz</td><td>Sağlar</td></tr>
  <tr><td>Görme ayrıntısı</td><td>Daha düşük</td><td>Daha yüksek</td></tr>
  <tr><td>Yoğun oldukları yer</td><td>Retina çevresi</td><td>Sarı benek</td></tr></table>
  <h5>Görme nasıl gerçekleşir?</h5>
  <ol><li>Işık kornea ve göz bebeğinden geçer.</li><li>Mercek ışığı kırarak retinaya odaklar.</li><li>Fotoreseptörler ışığı sinirsel sinyallere dönüştürür.</li><li>Sinyaller optik sinirle beyne iletilir.</li><li>Beynin görmeyle ilgili bölgelerinde görüntü algılanır.</li></ol>
  <p><b>Ek bilgi (akomodasyon):</b> Yakına bakarken mercek kalınlaşır, uzağa bakarken incelir. Bu olaya <b>akomodasyon (uyum)</b> denir.</p>`,
      bag: 'Gözün kamerayla benzerliği: kornea + mercek = objektif, iris = diyafram, retina = görüntü sensörü. Retinada oluşan görüntü ters olur; beyin onu düzeltir.',
      note: 'Sınav notu: Sarı benek = en net görme (koni). Kör nokta = fotoreseptör yok. Akomodasyon ve görme kusurlarının ayrıntısı bu kazanımda ek bilgi niteliğindedir.',
      m3: 'goz', m3b: ['retina'], sim: 'goz',
      check: { q: 'Gözde en net görmenin gerçekleştiği bölge ile fotoreseptör bulunmayan bölge sırasıyla hangileridir?', o: ['Sarı benek – kör nokta', 'Kör nokta – sarı benek', 'Koroid – sklera', 'Kornea – iris'], a: 0, e: 'Sarı benekte koni hücreleri yoğundur ve görme en nettir. Kör noktada optik sinir gözden çıktığı için fotoreseptör bulunmaz.' }
    },
    {
      id: 'kulakyapi', code: '1.5.1 · kulak', ico: '👂', title: 'Kulak: İşitmenin Yapısı',
      merak: 'Uçakta yükselirken kulaklarının tıkandığını hiç hissettin mi? Yutkunmak ya da esnemek neden rahatlatır?',
      flow: ['Ses dalgaları', 'Kulak kepçesi', 'Dış kulak yolu', 'Kulak zarı', 'Çekiç-Örs-Üzengi', 'İç kulak sıvısı', 'Korti organı', 'İşitme siniri', 'Beyin'],
      ogren: `
  <p>Kulak iki temel görevi yerine getirir: <b>işitme</b> ve <b>denge</b>. İşitmedeki reseptörler <b>mekanoreseptördür</b> (ses dalgalarının oluşturduğu titreşim mekanik bir uyarandır).</p>
  <table class="tbl"><tr><th>Bölüm</th><th>Yapılar</th><th>Görev</th></tr>
  <tr><td><b>Dış kulak</b></td><td>Kulak kepçesi, dış kulak yolu, kulak zarı</td><td>Kepçe ses dalgalarını toplar; kulak yolu kulak zarına iletir; zar ses dalgalarıyla titreşir</td></tr>
  <tr><td><b>Orta kulak</b></td><td>Çekiç, örs, üzengi, östaki borusu</td><td>Kemikçikler titreşimi iç kulağa aktarır ve ses basıncının iletimine yardımcı olur; östaki borusu orta kulak basıncını dış ortam basıncıyla dengeler</td></tr>
  <tr><td><b>İç kulak</b></td><td>Salyangoz (koklea), yarım daire kanalları, tulumcuk, kesecik</td><td>Salyangoz işitmeyle; kanallar, tulumcuk ve kesecik dengeyle ilgilidir</td></tr></table>
  <h5>İşitme nasıl gerçekleşir?</h5>
  <p>Ses dalgaları → kulak kepçesi → dış kulak yolu → kulak zarı → çekiç, örs, üzengi → iç kulak sıvıları → <b>Korti organındaki reseptörler</b> → işitme siniri → beyin</p>
  <p><b>Korti organı</b> salyangoz (koklea) içinde bulunur ve işitme reseptörlerini (tüylü duyu hücreleri) içerir. Titreşimlerin oluşturduğu hareket tüylü hücreleri uyarır ve sinirsel mesajlar oluşur. Tüylü hücreler <b>duyu epiteli</b> yapısındadır; mesajı işitme siniri nöronları taşır.</p>
  <p><b>Orta kulakta üç kemikçik</b> bir kaldıraç sistemi gibi çalışır: büyük kulak zarındaki titreşimi küçük oval pencereye aktarır, böylece ses basıncı artar.</p>`,
      bag: 'Mikrofon: diyafram (kulak zarı) titreşir, dönüştürücü (Korti organı) elektrik sinyali üretir. Sinyali taşıyan kablo = işitme siniri.',
      note: 'Sınav notu: Salyangoz → işitme, Korti organı → işitme reseptörleri, östaki borusu → basınç dengesi, kemikçikler → titreşim iletimi.',
      m3: 'kulak', m3b: ['korti'], sim: 'kulak',
      check: { q: 'İşitme reseptörleri aşağıdaki yapılardan hangisinde bulunur?', o: ['Korti organı', 'Yarım daire kanalları', 'Östaki borusu', 'Kulak zarı'], a: 0, e: 'Korti organı salyangozun (koklea) içindedir ve tüylü duyu hücreleri (işitme reseptörleri) burada bulunur.' }
    },
    {
      id: 'denge', code: '1.5.1 · denge', ico: '⚖️', title: 'Kulak ve Denge',
      merak: 'Dönme dolaptan indiğinde neden bir süre sendelersin, oysa artık dönmüyorsun?',
      flow: ['Baş hareketi', 'Denge reseptörleri', 'Denge siniri', 'Beyin', 'Denge tepkisi'],
      ogren: `
  <p>İç kulaktaki <b>denge reseptörleri</b> baş ve vücudun hareketleriyle ilgili mesajları beyne iletir. Bu reseptörler de mekanoreseptör sınıfındadır.</p>
  <table class="tbl"><tr><th>Yapı</th><th>Algıladığı</th></tr>
  <tr><td><b>Yarım daire kanalları</b> (3 adet, birbirine dik)</td><td>Başın <b>dönme hareketleri</b></td></tr>
  <tr><td><b>Tulumcuk ve kesecik</b></td><td><b>Yer çekimi, başın konumu ve doğrusal ivmelenme</b></td></tr></table>
  <ul><li>Yarım daire kanallarının uçlarındaki genişlemelerde (ampulla) tüylü hücreler jelatinimsi bir <b>cupula</b> içine gömülüdür. Baş dönünce kanal sıvısı geride kalır ve cupulayı eğer; tüylü hücreler uyarılır.</li>
  <li>Tulumcuk ve keseciğin içinde tüylü hücrelerin üstünde, <b>otolit (kalsiyum karbonat kristalleri)</b> içeren bir jel tabaka vardır. Baş eğilince veya hız değişince otolitler kayar ve tüylü hücreleri uyarır.</li></ul>
  <p><b>Sınav notu:</b> Salyangoz işitmeyle, yarım daire kanalları dönme hareketlerinin algılanmasıyla ilişkilidir. Tulumcuk ve kesecik ise doğrusal hareket ve yer çekimiyle ilgilidir.</p>`,
      bag: 'Telefonun ivmeölçeri ve jiroskobu gibi: yarım daire kanalları dönmeyi (jiroskop), tulumcuk ve kesecik eğimi ve ivmeyi (ivmeölçer) algılar.',
      note: 'Ayrıntılı moleküler mekanizma gerekmez; hangi yapının hangi hareketi algıladığını bilmek yeterlidir.',
      m3: 'kulak', m3b: ['denge'], sim: 'denge',
      check: { q: 'Başın dönme hareketlerinin algılanmasında hangi yapı görevlidir?', o: ['Salyangoz', 'Yarım daire kanalları', 'Kulak zarı', 'Östaki borusu'], a: 1, e: 'Yarım daire kanalları dönme hareketlerini; tulumcuk ve kesecik ise yer çekimini ve doğrusal ivmelenmeyi algılar.' }
    },
    {
      id: 'burunyapi', code: '1.5.1 · burun', ico: '👃', title: 'Burun: Koku Alma Yapısı',
      merak: 'Nezle olduğunda yemeklerin tadı neden değişir? Parfüm sürdükten bir süre sonra kokuyu neden artık hissetmezsin?',
      flow: ['Koku molekülleri', 'Burun boşluğu', 'Koku epiteli', 'Koku reseptörleri', 'Koku siniri', 'Beyin'],
      ogren: `
  <p>Burun, havadaki koku verici maddeleri algılar.</p>
  <ol><li>Koku molekülleri burun boşluğuna girer.</li><li>Burun boşluğunun üst kısmındaki <b>koku epiteline</b> ulaşır ve mukus tabakasında çözünür.</li><li>Koku reseptörlerini uyarır.</li><li>Oluşan sinirsel mesajlar <b>koku siniri</b> ile beyne iletilir.</li><li>Beyin bilgiyi yorumlayarak kokuyu algılar.</li></ol>
  <ul><li>Koku reseptörleri kimyasal uyaranlara duyarlıdır; <b>kemoreseptördür</b>.</li>
  <li>Koku alma, tat alma ile birlikte besinlerin <b>lezzetinin</b> algılanmasına katkı sağlar.</li>
  <li>Kokuya uzun süre maruz kalınınca duyarlılık azalır: <b>koku adaptasyonu</b>.</li>
  <li>Koku alma, koku moleküllerinin burun içindeki reseptörlere <b>ulaşmasına</b> bağlıdır (burun tıkalıysa koku algısı azalır).</li></ul>
  <p>Koku epitelindeki reseptörler, kalbur kemikteki deliklerden geçen uzantılarla <b>koku soğanına</b> bağlanır; buradan gelen bilgi beyne gider.</p>`,
      bag: 'Kimyasal uyaran → kemoreseptör; burun ve dil birlikte lezzeti oluşturur.',
      note: 'Koku reseptörlerinin moleküler ayrıntısı kapsam dışıdır.',
      m3: 'burun', m3b: ['kokuepiteli'], sim: 'koku',
      check: { q: 'Kokuya uzun süre maruz kalındığında koku algısının zayıflamasına ne ad verilir?', o: ['Koku adaptasyonu', 'Akomodasyon', 'Merdiven etkisi', 'Eşik değer'], a: 0, e: 'Kokuya uzun süre maruz kalındığında duyarlılık azalır; buna koku adaptasyonu denir.' }
    },
    {
      id: 'dilyapi', code: '1.5.1 · dil', ico: '👅', title: 'Dil: Tat Tomurcukları ve Tat Alma',
      merak: 'Dilinin ucundaki tatlıyı mı, arkasındaki acıyı mı daha iyi algılarsın? Gerçekten dilin bölgeleri farklı tatlara mı ayrılmıştır?',
      flow: ['Kimyasal madde', 'Tükürükte çözünme', 'Tat tomurcuğu', 'Sinirsel mesaj', 'Beyin (tat algısı)'],
      ogren: `
  <p>Dil üzerinde bulunan <b>tat tomurcukları</b>, tat alma reseptörlerini içerir. Tat reseptörleri kimyasal uyaranlara duyarlıdır (<b>kemoreseptör</b>) ve <b>duyu epiteli</b> yapısındadır.</p>
  <h5>Tat alma nasıl gerçekleşir?</h5>
  <ol><li>Besinlerdeki kimyasal maddeler <b>tükürükte çözünür</b>.</li><li>Çözünen maddeler tat tomurcuklarındaki reseptörleri uyarır.</li><li>Sinirsel mesajlar oluşur.</li><li>Mesajlar ilgili sinirlerle beyne iletilir.</li><li>Beyin tat duyusunu algılar.</li></ol>
  <h5>Temel tatlar</h5>
  <table class="tbl"><tr><th>Tat</th><th>Örnek</th></tr><tr><td>Ekşi</td><td>Limon</td></tr><tr><td>Tatlı</td><td>Şeker</td></tr><tr><td>Tuzlu</td><td>Sofra tuzu</td></tr><tr><td>Acı</td><td>Bazı acı maddeler</td></tr><tr><td>Umami</td><td>Glutamatça zengin besinler</td></tr></table>
  <p><b>Önemli:</b> “Dilin farklı bölgeleri yalnızca tek bir tada duyarlıdır” düşüncesi <b>doğru değildir</b>. Temel tatlar dilin farklı bölgelerindeki reseptörlerle algılanabilir.</p>
  <p>Dilin yüzeyindeki papillalar (filiform, mantar şekilli, çevrili, yaprak şekilli) kabarıklıklardır; <b>filiform papillalarda tat tomurcuğu yoktur</b>, diğerlerinde bulunur. Her tomurcukta reseptör hücreler ve destek hücreler vardır; tat gözeneğinden giren çözünmüş maddeler reseptör hücrelere ulaşır.</p>`,
      bag: 'Lezzet = tat + koku (+ sıcaklık, doku). Burnun tutulunca besinlerin lezzeti zayıflar.',
      note: 'Papilla çeşitleri ve tomurcuk iç yapısı ek bilgidir; temel kavram tükürük → tomurcuk → sinir → beyin zinciridir.',
      m3: 'dil', m3b: ['tattomurcugu'], sim: 'tat',
      check: { q: 'Aşağıdakilerden hangisi tat alma olayı için doğrudur?', o: ['Maddeler tükürükte çözünerek tat tomurcuklarındaki reseptörleri uyarır', 'Dilin her bölgesi yalnızca tek bir tadı algılar', 'Tat reseptörleri mekanoreseptördür', 'Tat bilgisi doğrudan kasa iletilir'], a: 0, e: 'Tat reseptörleri kemoreseptördür; maddeler tükürükte çözünmeden reseptörlere ulaşamaz. Dil haritası düşüncesi doğru değildir.' }
    },
    {
      id: 'deriyapi', code: '1.5.1 · deri', ico: '🖐️', title: 'Deri: Katmanlar ve Reseptörler',
      merak: 'Parmak ucun neden saç telini bile hissederken sırtın iki noktayı ayırt etmekte zorlanır?',
      flow: ['Dokunma / basınç / sıcaklık / zarar verici uyaran', 'Deri reseptörleri', 'Duyu sinirleri', 'Beyin', 'Algı'],
      ogren: `
  <p>Deri, vücudun <b>en geniş duyu organıdır</b>. Hem koruma sağlar hem de çevresel uyaranların algılanmasına yardımcı olur.</p>
  <table class="tbl"><tr><th>Katman</th><th>Özellikleri</th></tr>
  <tr><td><b>Üst deri (epidermis)</b></td><td>Dış koruyucu tabakadır; <b>melanin</b> pigmenti içerir.</td></tr>
  <tr><td><b>Alt deri (dermis)</b></td><td>Kan damarları, sinirler, <b>duyu reseptörleri</b>, kıl kökleri ve çeşitli bezler (ter, yağ) bulunur.</td></tr>
  <tr><td><b>Deri altı dokusu (hipodermis)</b></td><td>Yağ dokusu bakımından zengindir; yalıtım ve darbelere karşı korumaya katkı sağlar.</td></tr></table>
  <h5>Derideki reseptörler</h5>
  <table class="tbl"><tr><th>Reseptör türü</th><th>Algıladığı uyaran</th></tr><tr><td>Mekanoreseptör</td><td>Dokunma, basınç, titreşim</td></tr><tr><td>Termoreseptör</td><td>Sıcaklık değişimleri</td></tr><tr><td>Ağrı reseptörleri (nosiseptör)</td><td>Dokuya zarar verebilecek uyaranlar</td></tr></table>
  <p>Reseptörlerin yapısı: Ağrı reseptörleri ve termoreseptörler <b>serbest sinir uçlarıdır (nöron)</b>; mekanoreseptörlerin bir kısmı kapsüllü yapıdadır (Meissner, Pacini gibi) ya da disk biçimli sinir ucudur (Merkel). Bu ayrıntılar ek bilgidir.</p>`,
      bag: 'Parmak uçlarında reseptör çok sıktır; sırtta seyrektir. Bu yüzden ayırt etme gücü bölgeye göre değişir.',
      note: 'Kapsüllü reseptör çeşitlerinin adlarını ezberlemek gerekmez; reseptör türü – uyaran eşleşmesi önemlidir.',
      m3: 'deri', m3b: ['deriresept'], sim: 'deri',
      check: { q: 'Derideki termoreseptörler hangi uyaranı algılar?', o: ['Sıcaklık değişimlerini', 'Işığı', 'Koku moleküllerini', 'Ses dalgalarını'], a: 0, e: 'Termoreseptörler sıcaklık değişimlerini algılar; dokunma, basınç ve titreşim mekanoreseptörlerle, zarar verici uyaranlar ağrı reseptörleriyle algılanır.' }
    },
    {
      id: 'duyuyol', code: '1.5.1 · özet', ico: '🧭', title: 'Duyu Organları: Karşılaştırma ve Algının Oluşumu',
      merak: 'Beş duyu organının ortak noktası ve farkı nedir? Algı gerçekte nerede oluşur?',
      flow: ['Uyaran', 'Reseptör', 'Duyu sinirleri', 'Beyin', 'Algı'],
      ogren: `
  <p>Duyu organlarında bulunan özel hücreler veya sinir uçları, çevreden gelen uyaranları algılar. Bu uyaranlar sinirsel mesajlara dönüştürülerek beyne iletilir. Beyin gelen mesajları yorumlayarak görme, işitme, koklama, tat alma ve dokunma duyularını oluşturur.</p>
  <table class="tbl"><tr><th>Duyu organı</th><th>Temel görevi</th><th>Reseptör / algılama özelliği</th></tr>
  <tr><td>Göz</td><td>Görme</td><td>Fotoreseptör</td></tr><tr><td>Kulak</td><td>İşitme ve denge</td><td>Mekanoreseptör</td></tr>
  <tr><td>Burun</td><td>Koku alma</td><td>Kemoreseptör</td></tr><tr><td>Dil</td><td>Tat alma</td><td>Kemoreseptör</td></tr>
  <tr><td>Deri</td><td>Dokunma, basınç, sıcaklık, ağrı</td><td>Mekanoreseptör, termoreseptör, ağrı reseptörleri</td></tr></table>
  <p><b>Ortak özellik:</b> Reseptörlerde oluşan sinirsel mesajlar ilgili sinir yollarıyla beyne iletilir ve burada yorumlanır.</p>`,
      bag: 'Aynı sinirsel mesaj, beynin hangi bölgesine giderse o duyu olarak algılanır (görme, işitme, tat…).',
      note: 'Kendini dene bölümü: sarı benek, Korti organı, kemoreseptör, yarım daire kanalları, termoreseptör.',
      m3: 'goz', m3b: ['kulak', 'burun', 'dil', 'deri'], sim: null,
      check: { q: 'Aşağıdaki eşleştirmelerden hangisi doğrudur?', o: ['Göz – fotoreseptör', 'Burun – mekanoreseptör', 'Dil – fotoreseptör', 'Kulak (işitme) – kemoreseptör'], a: 0, e: 'Göz fotoreseptör, kulak mekanoreseptör, burun ve dil kemoreseptör, deri mekanoreseptör + termoreseptör + ağrı reseptörü içerir.' }
    }
  ];
  const at = TOPICS.findIndex(t => t.id === 'organ');
  TOPICS.splice(at + 1, 0, ...NEW_TOPICS);

  /* Eski konular için 3B model eşleştirmesi (bağlam / soru kartlarında kısayol) */
  window.TOPIC_M3 = { organ: ['goz', 'kulak', 'burun', 'dil', 'deri'], teknoloji: ['goz', 'kulak'], sinif: ['deri', 'goz'], hayvan: ['goz', 'kulak'] };
  const Q = (t, q, o, a, e, extra) => BANK.push(Object.assign({ t, q, o, a, e }, extra || {}));

  /* ---------- Soru bankası (m3: ilgili 3B model, part: modelde bulunacak parça) ---------- */
  Q('gozyapi', 'Gözün sert tabakası olan sklera ön tarafta saydamlaşarak neyi oluşturur?', ['İrisi', 'Korneayı', 'Merceği', 'Retinayı'], 1, 'Sklera ön tarafta saydamlaşarak korneayı oluşturur; kornea ışığın kırılmasında görev alır.', { m3: 'goz', part: 'Kornea' });
  Q('gozyapi', 'Göz bebeğinin çapını ayarlayarak göze giren ışık miktarını düzenleyen yapı hangisidir?', ['Kornea', 'İris', 'Mercek', 'Sarı benek'], 1, 'İris, damar tabakanın ön kısmındadır ve göz bebeğinin çapını ayarlar.', { m3: 'goz', part: 'İris' });
  Q('gozyapi', 'Merceğin şeklini değiştirmeye yardımcı olan yapı aşağıdakilerden hangisidir?', ['Kirpiksi cisim', 'Optik sinir', 'Camsı sıvı', 'Kör nokta'], 0, 'Damar tabakada bulunan kirpiksi cisim (kirpiksi kas), askı bağlarıyla merceğin şeklini ayarlamaya yardımcı olur.', { m3: 'goz', part: 'Kirpiksi cisim' });
  Q('gozyapi', 'Işığı retina üzerine odaklayan yapı hangisidir?', ['Mercek', 'Sklera', 'Koroid', 'Optik sinir'], 0, 'Mercek, kornea ile birlikte ışığı kırarak retinaya odaklar.', { m3: 'goz', part: 'Mercek (göz merceği)' });
  Q('gozyapi', 'Gözde ışığa duyarlı reseptörleri içeren tabaka hangisidir?', ['Sert tabaka', 'Damar tabaka', 'Ağ tabaka (retina)', 'Kornea'], 2, 'Retina çubuk ve koni gibi fotoreseptörleri içerir; ışık burada sinirsel sinyale dönüşür.', { m3: 'goz', part: 'Ağ tabaka (retina)' });
  Q('gozyapi', 'Gözde en net görmenin gerçekleştiği, koni hücrelerinin en yoğun olduğu bölge hangisidir?', ['Kör nokta', 'Sarı benek', 'Kornea', 'Koroid'], 1, 'Sarı benekte koni yoğundur; görme en nettir.', { m3: 'goz', part: 'Sarı benek' });
  Q('gozyapi', 'Fotoreseptör bulunmayan, optik sinirin gözden çıktığı bölge hangisidir?', ['Sarı benek', 'Kör nokta', 'İris', 'Mercek'], 1, 'Kör noktada fotoreseptör yoktur; bu bölgeye düşen ışık algılanmaz.', { m3: 'goz', part: 'Kör nokta' });
  Q('gozyapi', 'Görmeyle ilgili sinirsel mesajları beyne taşıyan yapı hangisidir?', ['Optik sinir', 'İşitme siniri', 'Koku siniri', 'Kirpiksi kas'], 0, 'Optik sinir retinadan çıkan sinyalleri beyne taşır.', { m3: 'goz', part: 'Optik sinir (görme siniri)' });
  Q('gozyapi', 'Aşağıdakilerden hangisi çubuk hücrelerinin özelliğidir?', ['Renkli görmeyi sağlar', 'Sarı benekte yoğundur', 'Az ışıkta etkilidir', 'Görme ayrıntısı en yüksektir'], 2, 'Çubuklar az ışıkta etkilidir, renkli görme sağlamaz, retina çevresinde yoğundur; ayrıntı düşüktür.', { m3: 'retina', part: 'Çubuk hücresi' });
  Q('gozyapi', 'Koni hücreleriyle ilgili aşağıdaki ifadelerden hangisi doğrudur?', ['Aydınlıkta etkilidir ve renkli görmeyi sağlar', 'Retina çevresinde yoğundur', 'Karanlıkta etkilidir', 'Kör noktada yoğundur'], 0, 'Koniler aydınlıkta etkilidir, renkli görmeyi ve yüksek ayrıntıyı sağlar; sarı benekte yoğundur.', { m3: 'retina', part: 'Koni hücresi' });
  Q('gozyapi', 'Görme olayında aşağıdaki sıralamalardan hangisi doğrudur?', ['Kornea → göz bebeği → mercek → retina → optik sinir → beyin', 'Mercek → kornea → retina → göz bebeği → beyin', 'Retina → mercek → kornea → optik sinir', 'Optik sinir → retina → mercek → beyin'], 0, 'Işık kornea ve göz bebeğinden geçer, mercekle retinaya odaklanır, fotoreseptörler sinyale çevirir, optik sinir beyne iletir.', { m3: 'goz' });
  Q('gozyapi', 'Yakındaki bir nesneye bakarken göz merceğinde aşağıdakilerden hangisi gerçekleşir? (ek bilgi)', ['Mercek kalınlaşır', 'Mercek incelir', 'Göz bebeği genişler', 'Kornea kalınlaşır'], 0, 'Yakına bakarken mercek kalınlaşır, uzağa bakarken incelir; buna akomodasyon denir.', { m3: 'goz', part: 'Mercek (göz merceği)' });
  Q('gozyapi', 'Gözün damar tabakasında yer alan yapılar hangi seçenekte doğru verilmiştir?', ['Koroid, iris, kirpiksi cisim', 'Sklera, kornea', 'Retina, sarı benek', 'Mercek, camsı sıvı'], 0, 'Damar tabaka koroid, iris ve kirpiksi cisimden oluşur.', { m3: 'goz', part: 'Damar tabaka (koroid)' });
  Q('gozyapi', 'Gözün şeklinin korunmasına ve ışığın geçişine katkı sağlayan yapı hangisidir?', ['Camsı sıvı ve göz içi sıvıları', 'Kör nokta', 'Sarı benek', 'Koroid'], 0, 'Camsı sıvı ve sulu sıvı gözün şeklini korur, ışığı geçirir.', { m3: 'goz', part: 'Camsı sıvı (camsı cisim)' });
  Q('kulakyapi', 'Ses dalgalarını toplayarak dış kulak yoluna ileten yapı hangisidir?', ['Kulak kepçesi', 'Östaki borusu', 'Salyangoz', 'Üzengi'], 0, 'Kulak kepçesi ses dalgalarını toplar.', { m3: 'kulak', part: 'Kulak kepçesi' });
  Q('kulakyapi', 'Ses dalgalarıyla titreşen yapı hangisidir?', ['Kulak zarı', 'Korti organı', 'Cupula', 'Kesecik'], 0, 'Kulak zarı ses dalgalarıyla titreşir ve titreşimi kemikçiklere aktarır.', { m3: 'kulak', part: 'Kulak zarı' });
  Q('kulakyapi', 'Orta kulakta bulunan kemikçiklerin doğru sıralaması (kulak zarından iç kulağa) hangisidir?', ['Çekiç – örs – üzengi', 'Örs – çekiç – üzengi', 'Üzengi – örs – çekiç', 'Çekiç – üzengi – örs'], 0, 'Kulak zarına çekiç, ortada örs, oval pencereye üzengi bağlanır.', { m3: 'kulak', part: 'Çekiç' });
  Q('kulakyapi', 'Orta kulak basıncının dış ortam basıncıyla dengelenmesini sağlayan yapı hangisidir?', ['Östaki borusu', 'Yarım daire kanalı', 'Salyangoz', 'Kulak yolu'], 0, 'Östaki borusu orta kulağı yutakla birleştirir ve basıncı dengeler.', { m3: 'kulak', part: 'Östaki borusu' });
  Q('kulakyapi', 'İşitme reseptörleri hangi yapıda bulunur?', ['Korti organı', 'Yarım daire kanalları', 'Östaki borusu', 'Orta kulak'], 0, 'Korti organı koklea içindedir; tüylü hücreler işitme reseptörleridir.', { m3: 'korti', part: 'İç tüylü hücre' });
  Q('kulakyapi', 'İşitmede doğru sıralama hangisidir?', ['Kulak zarı → kemikçikler → iç kulak sıvısı → Korti organı → işitme siniri → beyin', 'Kemikçikler → kulak zarı → Korti organı → beyin', 'Korti organı → kulak zarı → kemikçikler → beyin', 'Kulak zarı → Korti organı → kemikçikler → beyin'], 0, 'Titreşim zardan kemikçiklere, oradan iç kulak sıvısına geçer; Korti organı sinyale çevirir.', { m3: 'kulak' });
  Q('kulakyapi', 'Kulaktaki işitme reseptörleri hangi gruba girer?', ['Mekanoreseptör', 'Fotoreseptör', 'Kemoreseptör', 'Termoreseptör'], 0, 'Ses dalgalarının oluşturduğu titreşim mekanik bir uyarandır; tüylü hücreler mekanoreseptördür.', { m3: 'korti', part: 'İç tüylü hücre' });
  Q('kulakyapi', 'Salyangoz (koklea) hangi duyuyla ilgilidir?', ['İşitme', 'Denge', 'Koku', 'Görme'], 0, 'Salyangoz işitmeyle ilgilidir.', { m3: 'kulak', part: 'Salyangoz (koklea)' });
  Q('denge', 'Başın dönme hareketlerini algılayan yapı hangisidir?', ['Yarım daire kanalları', 'Salyangoz', 'Kulak zarı', 'Kemikçikler'], 0, 'Yarım daire kanalları dönme hareketlerini algılar.', { m3: 'denge', part: 'Cupula (jelimsi kubbe)' });
  Q('denge', 'Yer çekimi, başın konumu ve doğrusal ivmelenmeyi hangi yapılar algılar?', ['Tulumcuk ve kesecik', 'Yarım daire kanalları', 'Östaki borusu', 'Korti organı'], 0, 'Tulumcuk ve kesecikteki otolitler yer çekimini ve doğrusal hareketi algılar.', { m3: 'denge', part: 'Otolitler (kalsiyum kristalleri)' });
  Q('denge', 'Kendi etrafında dönen biri aniden durunca baş dönmesi hissetmesinin nedeni nedir?', ['Kanal sıvısının hareketine bir süre devam etmesi', 'Kulak zarının delinmesi', 'Salyangozun titreşmesi', 'Kemikçiklerin kırılması'], 0, 'Sıvı bir süre hareket eder, reseptörler uyarılmaya devam eder; beyin dönüyormuş gibi algılar.', { m3: 'denge', part: 'Cupula (jelimsi kubbe)' });
  Q('denge', 'Yarım daire kanalları kaç tanedir ve nasıl yerleşmiştir?', ['3 tane, birbirine dik', '2 tane, paralel', '1 tane, yatay', '5 tane, rastgele'], 0, 'Üç yarım daire kanalı birbirine yaklaşık dik düzlemlerde yer alır; üç boyutlu dönmeleri algılar.', { m3: 'kulak', part: 'Yarım daire kanalları' });
  Q('burunyapi', 'Koku reseptörleri burun boşluğunun hangi bölümünde yer alır?', ['Üst kısımdaki koku epitelinde', 'Alt kısımdaki mukozada', 'Burun kemiğinde', 'Burun deliklerinde'], 0, 'Koku epiteli burun boşluğunun üst kısmındadır.', { m3: 'burun', part: 'Koku epiteli' });
  Q('burunyapi', 'Koku reseptörleri hangi uyarana duyarlıdır?', ['Kimyasal maddelere', 'Işığa', 'Basınca', 'Sese'], 0, 'Koku reseptörleri kemoreseptördür.', { m3: 'kokuepiteli', part: 'Koku reseptör nöronu' });
  Q('burunyapi', 'Koku bilgisini beyne taşıyan yapı hangisidir?', ['Koku siniri', 'Optik sinir', 'İşitme siniri', 'Denge siniri'], 0, 'Koku siniri (koku soğanı yoluyla) mesajı beyne taşır.', { m3: 'burun', part: 'Koku siniri' });
  Q('burunyapi', 'Nezle olunca koku alma duyusunun azalmasının nedeni nedir?', ['Moleküllerin koku reseptörlerine ulaşamaması', 'Reseptörlerin fotoreseptöre dönüşmesi', 'Kulak zarının zayıflaması', 'Tat tomurcuklarının kaybolması'], 0, 'Koku alma, moleküllerin burun içindeki reseptörlere ulaşmasına bağlıdır.', { m3: 'burun' });
  Q('burunyapi', 'Aynı kokuya uzun süre maruz kalan kişi bir süre sonra o kokuyu daha az hisseder. Bu duruma ne denir?', ['Koku adaptasyonu', 'Akomodasyon', 'Ya hep ya hiç', 'Sinaps'], 0, 'Koku adaptasyonu: uzun süreli maruz kalmada duyarlılığın azalması.', { m3: 'kokuepiteli' });
  Q('dilyapi', 'Tat alma reseptörleri dilde hangi yapıların içindedir?', ['Tat tomurcukları', 'Kemikçikler', 'Kirpiksi cisim', 'Cupula'], 0, 'Tat tomurcukları tat alma reseptörlerini içerir.', { m3: 'tattomurcugu', part: 'Tat reseptör hücresi' });
  Q('dilyapi', 'Tat tomurcuklarındaki reseptörleri uyaran maddeler ne ile ilişkiye girer?', ['Tükürükte çözünür', 'Işığa dönüşür', 'Ses dalgasına dönüşür', 'Doğrudan beyne iletilir'], 0, 'Besin maddeleri tükürükte çözünür ve tomurcuktaki reseptörleri uyarır.', { m3: 'tattomurcugu' });
  Q('dilyapi', 'Aşağıdakilerden hangisi temel tatlardan biri değildir?', ['Serin', 'Tatlı', 'Umami', 'Ekşi'], 0, 'Beş temel tat: tatlı, ekşi, tuzlu, acı, umami.', { m3: 'dil' });
  Q('dilyapi', 'Dil haritası (dilin bölgelerinin tek bir tada duyarlı olduğu) düşüncesi için ne söylenebilir?', ['Doğru değildir; temel tatlar dilin farklı bölgelerinde algılanabilir', 'Doğrudur; tatlı yalnızca uçtadır', 'Doğrudur; acı yalnızca yanlardadır', 'Dilde yalnızca bir tat vardır'], 0, 'Temel tatlar dilin farklı bölgelerindeki reseptörlerle algılanabilir.', { m3: 'dil' });
  Q('dilyapi', 'Tat ve koku birlikte neyi oluşturur?', ['Besinin lezzetini', 'Ses algısını', 'Dengeyi', 'Görme netliğini'], 0, 'Koku alma, tat almayla birlikte besinlerin lezzetinin algılanmasına katkı sağlar.', { m3: 'tattomurcugu' });
  Q('deriyapi', 'Derinin dış koruyucu tabakası ve melanin içeren katmanı hangisidir?', ['Epidermis', 'Dermis', 'Hipodermis', 'Koroid'], 0, 'Epidermis (üst deri) melanin pigmenti içerir.', { m3: 'deri', part: 'Epidermis (üst deri)' });
  Q('deriyapi', 'Kan damarları, sinirler, duyu reseptörleri, kıl kökleri ve bezler derinin hangi katmanındadır?', ['Dermis', 'Epidermis', 'Deri altı dokusu', 'Hiçbirinde'], 0, 'Dermis bu yapıları barındırır.', { m3: 'deri', part: 'Dermis (alt deri)' });
  Q('deriyapi', 'Yağ dokusu bakımından zengin, yalıtım sağlayan deri katmanı hangisidir?', ['Deri altı dokusu', 'Epidermis', 'Dermis', 'Kornea'], 0, 'Deri altı dokusu (hipodermis) yağdan zengindir.', { m3: 'deri', part: 'Deri altı dokusu (hipodermis)' });
  Q('deriyapi', 'Dokunma, basınç ve titreşimi hangi reseptör grubu algılar?', ['Mekanoreseptör', 'Termoreseptör', 'Fotoreseptör', 'Kemoreseptör'], 0, 'Mekanoreseptörler dokunma, basınç ve titreşimi algılar.', { m3: 'deriresept', part: 'Mekanoreseptör (hafif dokunma)' });
  Q('deriyapi', 'Sıcaklık değişimlerini derinin hangi reseptörleri algılar?', ['Termoreseptörler', 'Mekanoreseptörler', 'Ağrı reseptörleri', 'Fotoreseptörler'], 0, 'Termoreseptörler sıcaklık değişimini algılar.', { m3: 'deri', part: 'Termoreseptör (sıcak)' });
  Q('deriyapi', 'Dokuya zarar verebilecek uyaranları hangi reseptörler algılar?', ['Ağrı reseptörleri', 'Termoreseptörler', 'Mekanoreseptörler', 'Kemoreseptörler'], 0, 'Ağrı reseptörleri (serbest sinir uçları) zarar verici uyaranları algılar.', { m3: 'deri', part: 'Ağrı reseptörü (serbest sinir ucu)' });
  Q('deriyapi', 'Vücudun en geniş duyu organı hangisidir?', ['Deri', 'Göz', 'Kulak', 'Dil'], 0, 'Deri, vücudun en geniş duyu organıdır.', { m3: 'deri' });
  Q('duyuyol', 'Duyu algısının genel sıralaması hangisidir?', ['Uyaran → reseptör → duyu sinirleri → beyin → algı', 'Uyaran → beyin → reseptör → algı', 'Reseptör → uyaran → beyin → sinir', 'Algı → beyin → reseptör → uyaran'], 0, 'Beyin sinirsel mesajları yorumlayarak algıyı oluşturur.', { m3: 'goz' });
  Q('duyuyol', 'Burun ve dil reseptörlerinin ortak türü hangisidir?', ['Kemoreseptör', 'Fotoreseptör', 'Mekanoreseptör', 'Termoreseptör'], 0, 'Her ikisi de kimyasal uyaranları algılar.', { m3: 'dil' });
  Q('duyuyol', 'Aşağıdaki organ–reseptör eşleştirmelerinden hangisi yanlıştır?', ['Göz – mekanoreseptör', 'Kulak – mekanoreseptör', 'Burun – kemoreseptör', 'Deri – termoreseptör'], 0, 'Gözdeki reseptörler fotoreseptördür.', { m3: 'goz' });

  /* ---------- Bağlam temelli sorular ---------- */
  const B = (id, topic, title, ctx, ask, parts, model, extra) => BAGLAM.push(Object.assign({ id, topic, title, ctx, ask, parts, model }, extra || {}));
  B('bt19', 'gozyapi', 'Işıktan karanlığa geçiş',
    '<p>Güneşli bir günde sinemaya giren Elif başta hiçbir şey göremez; birkaç dakika sonra salonu seçmeye başlar ancak renkleri soluk görür. Aynı anda gözündeki iris kasları göz bebeğini genişletmiştir. Sinemadan çıktığında ise göz bebeği hızla küçülür.</p>',
    'Karanlıkta göze giren ışık miktarını artırmak için çapını ayarlayan yapının adını, karanlıkta etkin olan ve renk ayırt edemeyen reseptörün adını yazınız.',
    [{ l: 'Çapını ayarlayan yapı', a: ['iris'] }, { l: 'Karanlıkta etkin reseptör', a: ['cubuk'] }],
    'İris göz bebeğinin çapını ayarlar. Az ışıkta etkili olan, renkli görme sağlamayan fotoreseptörler çubuk hücreleridir.', { m3: 'goz', sim: 'goz' });
  B('bt20', 'gozyapi', 'Okuma ve ayrıntı',
    '<p>Bir göz doktoru, bir hastanın küçük harfleri okuyabilmesi için görüntünün retinadaki belirli bir noktaya düşmesi gerektiğini anlatıyor. Hasta ayrıca, kitabın bir noktasına bakarken bir yan noktanın bazen kaybolduğunu fark ediyor.</p>',
    'Ayrıntılı ve net görmeyi sağlayan, koni hücrelerinin yoğun olduğu bölgeyi ve optik sinirin gözden çıktığı, fotoreseptör içermeyen bölgeyi yazınız.',
    [{ l: 'En net görme bölgesi', a: ['sari benek'] }, { l: 'Fotoreseptörsüz bölge', a: ['kor nokta'] }],
    'Sarı benek en net görme bölgesidir; kör noktada optik sinir gözden çıktığı için fotoreseptör bulunmaz.', { m3: 'goz', sim: 'goz' });
  B('bt21', 'gozyapi', 'Işığın yolculuğu',
    '<p>Bir fen öğretmeni projektör ışığının bir göze düşmesini modelliyor: Işık önce saydam ön tabakadan geçiyor, ardından göz bebeğinden girip bir mercekle odaklanıyor ve arka duvardaki ışığa duyarlı katmanda sinyale çevriliyor.</p>',
    'Işığın göze girerken ilk kırıldığı saydam yapının adını, ışığı retinaya odaklayan yapının adını yazınız.',
    [{ l: 'Saydam ön yapı', a: ['kornea'] }, { l: 'Odaklayan yapı', a: ['mercek'] }],
    'Kornea ışığı kırar; mercek ışığı retinaya odaklar. Retinadaki fotoreseptörler ışığı sinyale çevirir.', { m3: 'goz', sim: 'goz' });
  B('bt22', 'gozyapi', 'Yakın ve uzak',
    '<p>Selin kitap okurken yakın, sonra pencereden dışarı bakarken uzak mesafeye odaklanıyor. Kirpiksi cisimdeki kasların çalışmasıyla gözündeki saydam bir yapının kalınlığı değişiyor.</p>',
    'Kalınlığı değişen yapının adını ve bu olaya verilen adı yazınız. (ek bilgi)',
    [{ l: 'Kalınlığı değişen yapı', a: ['mercek'] }, { l: 'Olayın adı', a: ['akomodasyon', 'uyum'] }],
    'Mercek yakına bakarken kalınlaşır, uzağa bakarken incelir. Bu olaya akomodasyon (uyum) denir.', { m3: 'goz', sim: 'goz' });
  B('bt23', 'kulakyapi', 'Uçak yolculuğu',
    '<p>Yükselen bir uçakta Ahmet kulaklarının tıkandığını hisseder. Yutkunduğunda “pop” sesiyle rahatlar. Doktoru, orta kulak ile yutak arasındaki bir kanalın basıncı dengelediğini söyler.</p>',
    'Bu kanalın adını yazınız ve orta kulaktaki üç kemikçiğin adlarını sayınız.',
    [{ l: 'Kanalın adı', a: ['ostaki'] }, { l: 'Üç kemikçik', a: ['cekic+ors+uzengi'] }],
    'Östaki borusu orta kulak basıncını dengeler. Kemikçikler: çekiç, örs, üzengi.', { m3: 'kulak', sim: 'kulak' });
  B('bt24', 'kulakyapi', 'Ses nasıl duyulur?',
    '<p>Bir konserde müzik sesi kulağa ulaşıyor. Ses dalgaları zarda titreşim yaratıyor, bu titreşim kemikçiklerle iç kulaktaki sıvıya aktarılıyor ve salyangoz içindeki tüylü hücreler sinirsel mesaj üretiyor.</p>',
    'Titreşimle uyarılan tüylü duyu hücrelerini içeren yapının adını, bu reseptörlerin mekanoreseptör mü kemoreseptör mü olduğunu yazınız.',
    [{ l: 'Reseptörleri içeren yapı', a: ['korti'] }, { l: 'Reseptör türü', a: ['mekanoreseptor'] }],
    'Korti organı; tüylü hücreler mekanoreseptördür.', { m3: 'korti', sim: 'kulak' });
  B('bt25', 'denge', 'Dönme dolap',
    '<p>Zeynep dönme dolaptan indiğinde yürürken sendeliyor, çevresi dönüyormuş gibi hissediyor. Hekim, iç kulaktaki üç dik kanalın içindeki sıvının hareketine bir süre devam ettiğini açıklıyor.</p>',
    'Başın dönme hareketlerini algılayan yapıların adını ve yer çekimi ile doğrusal ivmelenmeyi algılayan yapıların adını yazınız.',
    [{ l: 'Dönmeyi algılayan', a: ['yarim daire'] }, { l: 'Yer çekimi / doğrusal ivme', a: ['tulumcuk', 'kesecik'] }],
    'Yarım daire kanalları dönmeyi; tulumcuk ve kesecik yer çekimini ve doğrusal ivmelenmeyi algılar.', { m3: 'denge', sim: 'denge' });
  B('bt26', 'denge', 'Asansörde',
    '<p>Hızla yukarı çıkan bir asansörde Mert, kısa bir süre için “ağırlaştığını” hisseder; kapalı gözle bile asansörün yukarı hızlandığını anlar.</p>',
    'Bu hissi sağlayan, otolit içeren iç kulak yapılarının adlarını yazınız.',
    [{ l: 'Yapılar (iki tane)', a: ['tulumcuk+kesecik'] }],
    'Tulumcuk ve kesecik (içlerindeki otolitler doğrusal ivmelenmeyle kayar).', { m3: 'denge', sim: 'denge' });
  B('bt27', 'burunyapi', 'Parfüm ve nezle',
    '<p>Ece sabah parfüm sürer; yarım saat sonra kokuyu artık hissetmez ama yanından geçenler hisseder. Birkaç gün sonra nezle olur ve yemeklerin tadını da zor alır.</p>',
    'Kokuyu zamanla hissetmeme olayının adını ve koku reseptörlerinin türünü yazınız.',
    [{ l: 'Olayın adı', a: ['koku adaptasyonu', 'adaptasyon'] }, { l: 'Reseptör türü', a: ['kemoreseptor'] }],
    'Koku adaptasyonu; koku reseptörleri kemoreseptördür. Nezlede moleküller reseptörlere ulaşamadığı için koku ve lezzet azalır.', { m3: 'kokuepiteli', sim: 'koku' });
  B('bt28', 'burunyapi', 'Kokunun yolu',
    '<p>Bir kahve kokusunu alan Can’ın burnundan giren moleküller üst burun boşluğundaki özel dokuya ulaşıyor, oradaki reseptörleri uyarıyor ve oluşan mesaj bir sinirle beyne iletiliyor.</p>',
    'Reseptörlerin bulunduğu dokunun adını ve mesajı beyne taşıyan sinirin adını yazınız.',
    [{ l: 'Doku', a: ['koku epiteli'] }, { l: 'Sinir', a: ['koku siniri'] }],
    'Koku epiteli ve koku siniri.', { m3: 'burun', sim: 'koku' });
  B('bt29', 'dilyapi', 'Kuru ağız deneyi',
    '<p>Bir öğrenci kuru bir dil üzerine kuru şeker kristali koyar; başta çok az tat alır, tükürük karışınca tat belirginleşir. Başka bir deneyde burnunu tutarak bir meyve yer ve “tadı yok gibi” der.</p>',
    'Tat alma için besin maddelerinin hangi sıvıda çözünmesi gerektiğini ve tat reseptörlerinin türünü yazınız.',
    [{ l: 'Çözünme ortamı', a: ['tukuruk'] }, { l: 'Reseptör türü', a: ['kemoreseptor'] }],
    'Tükürük; tat reseptörleri kemoreseptördür. Burun tutulunca koku katkısı kaybolur ve lezzet azalır.', { m3: 'tattomurcugu', sim: 'tat' });
  B('bt30', 'dilyapi', 'Dil haritası efsanesi',
    '<p>Bir ders kitabında “tatlı dilin ucunda, acı arkada, tuzlu ve ekşi yanlarda algılanır” şeklinde bir şema vardır. Bir öğrenci dilinin her yerinde farklı tatları hissettiğini söyler.</p>',
    'Şemanın bilimsel olarak doğru olup olmadığını (doğru/yanlış) belirtiniz ve beş temel tattan ikisini yazınız.',
    [{ l: 'Şema doğru mu?', a: ['yanlis'] }, { l: 'Temel tatlardan iki örnek', a: ['tatli+eksi', 'tatli+tuzlu', 'tatli+aci', 'tatli+umami', 'eksi+tuzlu', 'eksi+aci', 'eksi+umami', 'tuzlu+aci', 'tuzlu+umami', 'aci+umami'] }],
    'Yanlış. Temel tatlar dilin farklı bölgelerindeki reseptörlerle algılanabilir. Tatlar: tatlı, ekşi, tuzlu, acı, umami.', { m3: 'dil', sim: 'tat' });
  B('bt31', 'deriyapi', 'Sıcak çay ve iğne',
    '<p>Hasan sıcak çay bardağını tutarken önce sıcaklığı hisseder, bardak çok sıcak olduğu için eli yanma tehlikesi yaşar ve hızla çeker. Başka bir gün parmağına iğne batar ve acı hisseder.</p>',
    'Sıcaklığı algılayan reseptör grubunu ve iğne batmasını algılayan reseptör grubunu yazınız.',
    [{ l: 'Sıcaklığı algılayan', a: ['termoreseptor'] }, { l: 'İğne batmasını algılayan', a: ['agri'] }],
    'Termoreseptör; ağrı reseptörü (nosiseptör).', { m3: 'deri', sim: 'deri' });
  B('bt32', 'deriyapi', 'Parmak ucu ve sırt',
    '<p>İki ucu sivri bir pergelin parmak ucuna değdirildiğinde iki ayrı nokta hissedilir; sırtta ise aynı aralık tek bir nokta gibi algılanır. Parmak uçlarında reseptör sayısı çok daha fazladır.</p>',
    'Dokunma, basınç ve titreşimi algılayan reseptör grubunu ve reseptörlerin bulunduğu deri katmanını yazınız.',
    [{ l: 'Reseptör grubu', a: ['mekanoreseptor'] }, { l: 'Deri katmanı', a: ['dermis', 'alt deri'] }],
    'Mekanoreseptörler; dermis (alt deri).', { m3: 'deriresept', sim: 'deri' });
  B('bt33', 'deriyapi', 'Güneş ve deri rengi',
    '<p>Yaz boyunca güneşte kalan Deniz’in cildi koyulaşır. Dermatolog, derinin en dış tabakasındaki bir pigmentin arttığını söyler; aynı tabaka bir koruma duvarı gibi çalışır.</p>',
    'Koyulaşmaya neden olan pigmentin adını ve içerdiği deri tabakasını yazınız.',
    [{ l: 'Pigment', a: ['melanin'] }, { l: 'Deri tabakası', a: ['epidermis', 'ust deri'] }],
    'Melanin; epidermis (üst deri).', { m3: 'deri', sim: 'deri' });
  B('bt34', 'duyuyol', 'Organ–reseptör eşleştirme',
    '<p>Bir öğrenci beş duyu organının reseptör türlerini tabloya yazmıştır: göz → fotoreseptör, kulak → mekanoreseptör, burun → kemoreseptör, dil → kemoreseptör, deri → mekanoreseptör + termoreseptör + ağrı reseptörü.</p>',
    'Tablodaki hangi iki duyu organının reseptörü aynı türdedir (kimyasal uyaran) ve gözün fotoreseptörlerinin hangi iki çeşidi vardır?',
    [{ l: 'Aynı türde iki organ', a: ['burun+dil'] }, { l: 'Fotoreseptör çeşitleri', a: ['cubuk+koni'] }],
    'Burun ve dil (kemoreseptör); çubuk ve koni.', { m3: 'goz' });
})();
