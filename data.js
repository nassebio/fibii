/* Nasse Biology — içerik verisi (BİY.11.1.5 · Duyu reseptörleri ve duyu organları) */

const KAZANIM = 'BİY.11.1.5: Duyu reseptörlerini ve duyu organlarını niteliklerine, yapılarına ve işlevlerine göre ayırt etme, gruplandırma ve doğru biçimde etiketleme.';

/* ---------------- KONU ANLATIMI (Maarif modeli: Merak Et → Öğren → Bağ Kur → Becerini Dene) ---------------- */
const TOPICS = [
{
 id: 'uyaran', code: '1.5.1', ico: '⚡', title: 'Uyaran, Reseptör ve Uyartı',
 merak: 'Gözlerini kapattığında çevrenden hangi bilgiler sana ulaşmaya devam eder? Bu bilgileri hangi organlarınla algılarsın?',
 flow: ['Uyaran', 'Reseptör', 'Uyartı (impuls)', 'Nöron', 'Merkezî sinir sistemi', 'Yorumlama'],
 ogren: `
  <p>Canlılar yaşamları boyunca iç ve dış çevreden gelen <b>uyaranlara</b> maruz kalır. Uyaranlar <b>ışık, ses (mekanik etki), sıcaklık, mekanik temas (dokunma, basınç)</b> ve <b>kimyasal maddeler</b> olabilir.</p>
  <p>Hayvanlarda uyaranların nöronlarda meydana getirdiği <b>kimyasal ve elektriksel değişimlere uyartı (impuls)</b> denir.</p>
  <p>Canlının uyarana tepki verebilmesi için sırasıyla uyaranın <b>reseptörlerle alınması, dönüştürülmesi, iletilmesi ve yorumlanması</b> gerekir.</p>
  <ul>
   <li><b>Duyu organı:</b> Yapısında duyu reseptörleri bulunan, uyaranları alan özel organlardır (göz, kulak, burun, dil, deri).</li>
   <li><b>Duyu reseptörü:</b> Uyaranı algılayıp sinir sisteminin kullanabileceği uyartıya dönüştüren yapıdır. <b>Özelleşmiş epitel hücresi</b> (duyu epiteli) ya da <b>nöron</b> yapısında olabilir.</li>
   <li>Uyartı nöronlarla beyin ve omuriliğe (merkezî sinir sistemi) taşınır, burada değerlendirilir (bütünleştirme) ve gerekli tepki oluşturulur.</li>
  </ul>`,
 bag: 'Bir kameranın görüntü sensörü ışığı elektrik sinyaline çevirir. Gözdeki retina da ışığı algılayıp elektrik sinyaline dönüştürür. Peki algı yalnızca duyu organında mı oluşur? Sinyal beyne iletilmezse ne olur?',
 note: 'Bu kazanımda amaç ayrıntılı sinir fizyolojisi öğretmek değil; uyaran–reseptör–nöron ilişkisini kavramak ve sınıflandırabilmektir.',
 m3: 'noron', sim: null,
 check: { q: 'Bir uyaranın tepkiye dönüşmesi için doğru sıralama hangisidir?', o: ['Uyaran → Reseptör → Uyartı → Nöron → Merkezî sinir sistemi', 'Uyaran → Nöron → Reseptör → Uyartı → Merkezî sinir sistemi', 'Reseptör → Uyaran → Merkezî sinir sistemi → Nöron', 'Uyartı → Uyaran → Reseptör → Nöron'], a: 0, e: 'Uyaran önce reseptör tarafından algılanır ve uyartıya dönüştürülür; uyartı nöronlarla merkezî sinir sistemine taşınıp yorumlanır.' }
},
{
 id: 'sinif', code: '1.5.1', ico: '🧪', title: 'Reseptörlerin Sınıflandırılması',
 merak: 'Işık, ses, sıcaklık ve koku neden aynı yapıyla algılanmaz? Bir reseptörü belirli bir uyarana uygun hâle getiren özellik ne olabilir?',
 flow: null,
 ogren: `
  <p>Duyu organlarında yer alan reseptörler aldıkları <b>uyaran çeşidine</b> göre gruplandırılır. Reseptörler fiziksel ve kimyasal uyaranları algılayarak uyartıya dönüştürür.</p>
  <table class="tbl"><tr><th>Reseptör</th><th>Algıladığı uyaran</th><th>Uyaran türü</th><th>Bulunduğu yerler</th></tr>
   <tr><td><b>Mekanoreseptör</b></td><td>Dokunma, basınç, gerilme, hareket, ses dalgaları</td><td>Fiziksel</td><td>Deri, kulak</td></tr>
   <tr><td><b>Kemoreseptör</b></td><td>Kimyasal maddeler (koku, tat)</td><td>Kimyasal</td><td>Burun, dil</td></tr>
   <tr><td><b>Termoreseptör</b></td><td>Sıcak, soğuk gibi ısı değişimleri</td><td>Fiziksel</td><td>Çoğunlukla deri ve dil</td></tr>
   <tr><td><b>Ağrı reseptörü (nosiseptör)</b></td><td>Doku hasarına yol açabilecek uyaranlar</td><td>Fiziksel ve kimyasal</td><td>Serbest sinir uçları; beyin hariç tüm vücut</td></tr>
   <tr><td><b>Elektromanyetik reseptör</b></td><td>Işık, elektrik, manyetizma</td><td>Fiziksel</td><td>Gözde fotoreseptörler (örnek)</td></tr>
  </table>
  <p>Mekanoreseptörler, termoreseptörler ve fotoreseptörler <b>fiziksel</b>; ağrı reseptörleri <b>fiziksel ve kimyasal</b>; kemoreseptörler ise <b>kimyasal</b> uyaranları algılar.</p>`,
 bag: 'Sıcak çay bardağına dokunduğunda hangi reseptörler uyarılır? Bardak çok sıcaksa hangi reseptör devreye girer?',
 note: 'Reseptörleri fiziksel ve kimyasal uyaranlara göre ayırma ve gruplandırma düzeyinde çalışılır.',
 m3: 'deri', sim: null,
 check: { q: 'Koku ve tadın algılanmasını sağlayan reseptörler hangisidir?', o: ['Mekanoreseptör', 'Kemoreseptör', 'Termoreseptör', 'Elektromanyetik reseptör'], a: 1, e: 'Koku ve tat molekülleri kimyasal uyaranlardır; bunları kemoreseptörler algılar (burun ve dil).' }
},
{
 id: 'organ', code: '1.5.1', ico: '👁️', title: 'Duyu Organları ve Reseptörleri',
 merak: 'Göz, kulak, burun, dil ve deri; hangisinde hangi reseptör var? Hepsinin reseptörü aynı yapıda mıdır?',
 flow: null,
 ogren: `
  <table class="tbl"><tr><th>Duyu organı</th><th>Reseptör çeşidi</th><th>Reseptörün yapısı</th><th>İşlevi</th></tr>
   <tr><td><b>Göz</b></td><td>Fotoreseptör (elektromanyetik)</td><td>Nöron (çubuk ve koni hücreleri)</td><td>Işığı algılar</td></tr>
   <tr><td><b>Kulak</b></td><td>Mekanoreseptör</td><td>Duyu epiteli (tüylü duyu hücreleri)</td><td>Ses ve dengeyle ilişkili mekanik uyaranları algılar</td></tr>
   <tr><td><b>Burun</b></td><td>Kemoreseptör</td><td>Nöron (koku reseptör nöronları)</td><td>Koku moleküllerini algılar</td></tr>
   <tr><td><b>Dil</b></td><td>Kemoreseptör</td><td>Duyu epiteli (tat tomurcukları)</td><td>Tat moleküllerini algılar</td></tr>
   <tr><td><b>Deri</b></td><td>Mekanoreseptör, termoreseptör, nosiseptör</td><td>Nöron (serbest sinir uçları ve kapsüllü yapılar)</td><td>Dokunma, basınç, sıcaklık değişimleri ve doku hasarına yol açabilecek uyaranları algılar</td></tr>
  </table>
  <p>Duyu organları, yapılarındaki duyu reseptörleri ile uyaranları alan özel organlardır. Reseptörlerde oluşan elektriksel sinyaller nöronlarla merkezî sinir sistemine iletilir.</p>`,
 bag: 'Kulak yalnızca işitmeden mi sorumludur? Dengeyle ilişkili mekanik uyaranları da algıladığını düşün.',
 note: 'Göz uyumu ve görme kusurları, denge ile ilgili konum alma ayrıntıları bu kazanımda işlenmez.',
 m3: 'goz', sim: null,
 check: { q: 'Aşağıdakilerden hangisi duyu epiteli yapısında reseptör bulunduran bir duyu organıdır?', o: ['Burun', 'Göz', 'Dil', 'Deri'], a: 2, e: 'Dildeki tat tomurcukları duyu epiteli yapısındadır. Burun, göz ve deride reseptörler nöron yapısındadır.' }
},
{
 id: 'hayvan', code: '1.5.1', ico: '🐍', title: 'Hayvanlarda Duyu Çeşitliliği',
 merak: 'Aynı ortamda bulunan canlılar çevre hakkında aynı bilgiyi mi algılar?',
 flow: null,
 ogren: `
  <p>Bazı hayvanlar insanların algılayamadığı ya da çok farklı düzeyde algıladığı uyaranları algılar:</p>
  <ul>
   <li><b>Yayın balığı:</b> Derisindeki tat alma tomurcuklarında bulunan kemoreseptörler sayesinde tüm vücuduyla tat alabilir.</li>
   <li><b>Yusufçuk:</b> Bileşik gözü otuz bine yakın gözcükten oluşur; geniş görüş alanı sağlar, hareketli nesneleri algılamada çok başarılıdır.</li>
   <li><b>Yunus:</b> Başındaki özel organdan yayılan ses dalgaları engellere çarpıp geri döner ve işitme organlarıyla algılanır.</li>
   <li><b>Alman çoban köpeği:</b> Burnundaki gelişmiş kemoreseptörlerle iz sürer, kimyasal maddeleri bulabilir.</li>
   <li><b>Yıldız burunlu köstebek:</b> Burnundaki 22 uzantı dokunma duyusundan sorumludur (mekanoreseptör); toprak altında avını bulur.</li>
   <li><b>Çukur engereği:</b> Gözlerinin altındaki pit organdaki termoreseptörlerle avından yayılan ısıyı algılar; karanlıkta bile avını bulur.</li>
  </ul>
  <p>Aynı çevre, farklı canlılar için farklı anlamlar taşıyabilir.</p>`,
 bag: 'Bir uyaranı algılayamasaydın günlük yaşamında en çok ne değişirdi? Farklı canlılarda hangi duyular yaşam için daha kritik olabilir?',
 note: 'Hayvan örnekleri reseptör çeşidini ve uyaran türünü ayırt etmek için kullanılır.',
 m3: null, sim: null,
 check: { q: 'Çukur engereğinin karanlıkta avını bulmasını sağlayan reseptör hangisidir?', o: ['Kemoreseptör', 'Mekanoreseptör', 'Termoreseptör', 'Fotoreseptör'], a: 2, e: 'Pit organdaki termoreseptörler avın yaydığı ısıyı algılar.' }
},
{
 id: 'noron', code: '1.5.2', ico: '🧠', title: 'Nöronun Yapısı',
 merak: 'Bir sinir hücresinin boyu bir metreyi aşabilir mi? Uyartı bu kadar uzun yolu nasıl alır?',
 flow: null,
 ogren: `
  <p>Sinir hücresine <b>nöron</b> denir. Nöron; uyarıları almayı, değerlendirmeyi ve oluşturulan cevapları kas, salgı bezleri gibi yapılara iletmeyi sağlar. Bir nöron <b>hücre gövdesi, dendrit ve akson</b> olmak üzere üç temel kısımdan oluşur.</p>
  <h4>Hücre gövdesi</h4>
  <p>Çekirdek, organeller ve sitoplazmayı bulundurur. Nöronlarda enerji ihtiyacı fazla olduğundan çok sayıda <b>mitokondri</b> bulunur. Sitoplazmadaki ince telcikler olan <b>nörofibriller</b> nörona şekil verir ve hücre içinde madde taşınmasında görev alır.</p>
  <h4>Dendritler</h4>
  <p>Hücre gövdesinden çıkan çok sayıdaki kısa ve dallanmış uzantılardır. Diğer nöron ve reseptörlerden gelen uyarıları alır, elektrik sinyalleri hâlinde hücre gövdesine iletir.</p>
  <h4>Akson, akson ucu ve sinaptik uçlar</h4>
  <p>Akson, hücre gövdesinden çıkan, dendrite göre daha kalın ve uzun uzantıdır. Aksonların sonlandığı ve dallanarak genişlediği bölgeye <b>akson ucu</b> denir. Her dal, uyarıyı alıcı hücreye aktaran <b>sinaptik uç</b> ile sonlanır. Dallanmanın çok olması nöronun etki alanını genişletir.</p>
  <h4>Aksonun uzunluğu, çapı ve miyelin kılıf</h4>
  <ul>
   <li>Aksonun boyu milimetre ile metre ölçeği arasında değişir. Örneğin omurilikten ayaktaki kasa ulaşan motor nöron (siyatik sinir) bir metreden uzundur.</li>
   <li><b>Akson çapı</b> ne kadar kalınsa uyartının iletimi o kadar hızlıdır.</li>
   <li><b>Schwann hücreleri</b> akson etrafında lipoprotein yapılı <b>miyelin kılıfı</b> oluşturur. Miyelin kılıf aksonun elektriksel yalıtımını sağlayarak uyartı iletimini hızlandırır.</li>
   <li>Miyelin kılıfın kesintiye uğradığı yere <b>Ranvier boğumu</b> denir.</li>
   <li>İskelet kaslarına giden sinirler genellikle miyelinlidir; iç organlara ve düz kaslara giden sinirlerde genellikle miyelin kılıf bulunmaz.</li>
  </ul>`,
 bag: 'Kollarını sallarken kasına giden sinirlerin hızlı olması neden önemlidir? İç organlara giden sinirlerin daha yavaş olması sorun yaratır mı?',
 note: 'Glia hücrelerinin çeşitlerine girilmez.',
 m3: 'noron', sim: null,
 check: { q: 'Miyelin kılıfın kesintiye uğradığı yere ne ad verilir?', o: ['Sinaptik uç', 'Ranvier boğumu', 'Dendrit', 'Akson ucu'], a: 1, e: 'Miyelin kılıflar arasında kalan yalıtımsız boşluklara Ranvier boğumu denir.' }
},
{
 id: 'esik', code: '1.5.2.a', ico: '📏', title: 'Eşik Değer ve Ya Hep Ya Hiç Yasası',
 merak: 'Yüzüne çok hafif bir tüy değse hissetmeyebilirsin; biraz daha kuvvetli dokunursan hissedersin. Sınır nerede başlıyor?',
 flow: null,
 ogren: `
  <p>Fiziksel ve kimyasal ortamdaki değişiklikler sinirsel uyartılara dönüştürülebilir. Belli bir nöronda bir uyartının oluşabilmesi için gerekli olan <b>en düşük uyaran şiddetine eşik değer (eşik şiddeti)</b> denir.</p>
  <p>Bir nöron eşik değeri ve üzerindeki uyarılara <b>maksimum ve aynı şiddette</b> tepki verir; eşik değerin altındaki uyarılara tepki vermediğinden uyartı oluşturmaz. Buna <b>“ya hep ya hiç yasası”</b> denir.</p>
  <h4>Sinir demetinde merdiven etkisi</h4>
  <p>Birçok nörondan oluşan <b>sinir demetinde (sinir kordonu)</b> bu kurala uyulmaz. Çünkü farklı aksonlar farklı eşik değerlere sahip olduğundan tepki şiddeti kademeli artar. Belli bir değerden sonra uyarı şiddeti artsa bile tepki şiddeti değişmez. Bu duruma <b>merdiven etkisi</b> denir.</p>`,
 bag: 'Tek bir sinir teli ile sinir kordonunun uyaran şiddetine verdiği tepkiyi grafikte karşılaştır: biri basamak, biri merdiven gibidir.',
 note: 'Eşik değer ve ya hep ya hiç yasası; iyon kanallarının moleküler çalışması anlatılmadan, kavram düzeyinde ele alınır.',
 m3: 'noron', sim: 'esik',
 check: { q: 'Tek bir nöronda uyaran şiddeti eşik değerin çok üzerine çıkarılırsa tepki şiddeti nasıl değişir?', o: ['Giderek artar', 'Değişmez, maksimum düzeyde kalır', 'Giderek azalır', 'Hiç tepki oluşmaz'], a: 1, e: 'Ya hep ya hiç yasasına göre eşik ve üzerindeki uyarılara nöron aynı ve maksimum şiddette tepki verir.' }
},
{
 id: 'siddet', code: '1.5.2.a', ico: '🌡️', title: 'Uyaran Şiddeti, Uyartı Sıklığı ve Sayısı',
 merak: 'Ilık bir bardak ile kaynar bir bardağa dokununca beynin farkı nasıl anlıyor?',
 flow: null,
 ogren: `
  <p>Bir sinir demetinde uyaran şiddeti arttıkça <b>uyarılan nöron sayısı</b> ve <b>uyartı sayısı</b> artar ve böylece uyarıya daha güçlü yanıt verilir. Bu nedenle verilen tepkinin şiddeti de artar.</p>
  <p>Beyindeki duyu merkezleri, gelen <b>uyartıların sıklığına ve sayısına</b> göre uyarının şiddetini belirler.</p>
  <p>Ilık bir nesneye dokunulduğunda az sıklıkta ve sayıda uyartı oluşur. Sıcak bir nesneye dokunulduğunda ise daha sık ve fazla sayıda uyartı oluşur; bu nedenle nesne sıcak olarak algılanır (örneğin 20 °C ve 45 °C’lik cisimler).</p>
  <div class="callout">Sinir teli → tepki şiddeti değişmez · Sinir kordonu → tepki şiddeti artabilir. Uyartı iletim hızı değişmez; uyartı sayısı ve canlının tepki şiddeti artar.</div>
  <p>Nöronlarda uyartı iletimi, iyon geçişlerine dayandığı için <b>elektriksel</b>, ATP harcanmasını gerektirdiği için <b>kimyasaldır</b>; yani <b>elektrokimyasal</b> bir süreçtir.</p>`,
 bag: 'Duş suyunun sıcaklığını artırdığında beynine giden uyartıların sıklığı ve sayısı nasıl değişir?',
 note: 'Sinir tellerinde ve demetlerinde iletim hızı değişmez; yalnızca uyartı sayısı ve sıklığı değişir.',
 m3: null, sim: 'spike',
 check: { q: 'Sıcak bir nesneye dokunulduğunda ılık nesneye göre ne değişir?', o: ['Uyartı iletim hızı artar', 'Uyartı sayısı ve sıklığı artar', 'Akson çapı kalınlaşır', 'Miyelin kılıf kalınlaşır'], a: 1, e: 'Uyaran şiddeti arttıkça uyarılan nöron ve uyartı sayısı ile sıklığı artar; iletim hızı değişmez.' }
},
{
 id: 'zar', code: '1.5.2.a', ico: '🔋', title: 'Zar Potansiyeli: Polarizasyon, Depolarizasyon, Repolarizasyon',
 merak: 'Bir sinir hücresi “elektrik yüklü” bir hücre midir? Uyartı ilerlerken zarda ne değişir?',
 flow: ['Polarizasyon', 'Depolarizasyon', 'Repolarizasyon', 'Polarizasyon'],
 ogren: `
  <p>Nöronlarda uyartının ilerleme yönü <b>dendritten aksona</b> doğrudur. Uyartı iletiminin olmadığı durumda nöron dinlenme hâlindedir.</p>
  <ul>
   <li><b>Dinlenme potansiyeli (zar potansiyeli):</b> Dinlenme hâlindeki nöronun akson zarının iç ve dış tarafı arasındaki elektriksel yük farkıdır. Hücre içi negatif (−), hücre dışı pozitif (+) yüklüdür. Bu olaya <b>polarizasyon (kutuplaşma)</b> denir.</li>
   <li><b>Depolarizasyon:</b> Nöron uyarıldığında pozitif iyonlar hücre içine girer; hücre içi pozitif, hücre dışı negatif olur.</li>
   <li><b>Aksiyon potansiyeli:</b> Depolarizasyon sonucu oluşan iyon değişimi akson boyunca devam eder ve uyartı iletilir. Zar potansiyelinde kısa süre içinde görülen bu değişikliklere aksiyon potansiyeli denir.</li>
   <li><b>Repolarizasyon:</b> Depolarize olmuş bölgede pozitif iyonlar tekrar hücre dışına çıkar; hücre dışı pozitif, hücre içi negatif olur ve zar dinlenme hâline döner. <b>Repolarizasyon olmadan o bölgeden ikinci bir uyartı geçemez.</b></li>
  </ul>`,
 bag: 'Bir dalganın stadyumda ilerlemesine benzetebilir misin? Her bölge sırayla yük değiştirir ve eski hâline döner.',
 note: 'Polarizasyon, depolarizasyon ve repolarizasyon yalnızca tanım düzeyinde ele alınır; iyon kanalı ve pompalarının çeşitleri ile moleküler çalışma mekanizmalarına girilmez.',
 m3: 'noron', sim: 'ap',
 check: { q: 'Depolarizasyon sırasında zarın iç ve dış yükü nasıldır?', o: ['İç negatif, dış pozitif', 'İç pozitif, dış negatif', 'İç ve dış pozitif', 'İç ve dış negatif'], a: 1, e: 'Pozitif iyonlar hücre içine girer; hücre içi pozitif, hücre dışı negatif olur.' }
},
{
 id: 'sinaps', code: '1.5.2.a', ico: '🔗', title: 'Sinaps ve Nöronlar Arası İletim',
 merak: 'Uyartı bir nörondan diğerine nasıl atlar? Aralarında boşluk varsa elektrik geçebilir mi?',
 flow: ['Akson ucu', 'Sinaptik kesecik', 'Nörotransmitter', 'Reseptör', 'Komşu hücre'],
 ogren: `
  <p><b>Sinaps:</b> Nöronların birbiriyle veya alıcı hücrelerle (kas hücresi, hormon salgılayan hücre) iletişime geçtiği bağlantı noktalarıdır. Nöronlar arasındaki uyartı iletimi genellikle bir nöronun <b>akson ucundan</b> diğer nöronun <b>dendritine</b> doğru tek yönlüdür.</p>
  <h4>Elektriksel ve kimyasal sinaps</h4>
  <ul>
   <li><b>Elektriksel sinaps:</b> Uyartı doğrudan nörondan nörona geçer, hızlı tepkilere yol açar. Daha çok omurgasızlarda bulunur.</li>
   <li><b>Kimyasal sinaps:</b> Omurgalılarda daha yaygındır. Hücreler birbirine çok yaklaşır ama fiziksel olarak temas etmez; aralarında <b>sinaps boşluğu</b> bulunur.</li>
  </ul>
  <h4>Kimyasal sinapsta uyartı iletimi</h4>
  <p>Aksonun sinaps boşluğunda sonlanan ucuna <b>sinaptik yumru (sinaptik uç)</b> denir. İçinde kimyasal madde (<b>nörotransmitter</b>) bulunan <b>sinaptik keseciklere</b> sahiptir. Elektrokimyasal iletimle ulaşan uyartı sinaps boşluğunu bu şekilde geçemez (kopan kablodan elektrik geçmemesi gibi). Nörotransmitterler sinaps boşluğuna dökülür, komşu hücrenin zarındaki <b>reseptörlere</b> bağlanır ve uyartı aktarılır.</p>
  <h4>Seçici direnç</h4>
  <p>Bir nöron birden çok nöronla sinaps yapabilir ve oluşan uyartıların tümü her sinapstan geçmez. <b>Kolaylaştırıcı sinapslarda</b> nörotransmitterler depolarizasyona neden olarak uyartı iletimini sağlar; <b>durdurucu sinapslarda</b> yüksek polarizasyona (hiperpolarizasyon) yol açarak iletimi engeller. Böylece gereksiz tepkiler verilmez.</p>
  <h4>Nörotransmitterin etkisinin sonlandırılması</h4>
  <p>Görevini tamamlayan nörotransmitterler sinaps boşluğundaki <b>enzimlerle parçalanarak</b> etkisiz hâle getirilir veya nöron tarafından <b>tekrar hücre içine alınır</b>. Böylece komşu hücrenin sürekli uyarılması engellenir ve ortam yeni bir uyarıya hazır hâle gelir.</p>`,
 bag: 'Bir kavşaktaki trafik ışığını düşün: bazı sinapslar “geç” der (kolaylaştırıcı), bazıları “dur” (durdurucu).',
 note: 'Uyartının diğer nörona aktarılması genel düzeyde ele alınır; nörotransmitter çeşitleri ve kimyasal sinyal iletiminin ayrıntılı mekanizmalarına girilmez.',
 m3: 'sinaps', sim: 'sinaps',
 check: { q: 'Uyartının sinaps boşluğundan geçmesini sağlayan kimyasal haberciler hangileridir?', o: ['Miyelin', 'Nörotransmitter maddeler', 'Nörofibriller', 'Ranvier boğumları'], a: 1, e: 'Sinaptik keseciklerden salınan nörotransmitterler komşu hücrenin reseptörlerine bağlanarak uyartıyı aktarır.' }
},
{
 id: 'teknoloji', code: '1.5', ico: '📷', title: 'Biyoloji ve Teknoloji: Göz–Kamera, Kulak–Mikrofon',
 merak: 'Gözün ve kulağın çalışması ile kamera ve mikrofonun çalışması arasında nasıl bir ilişki kurabilirsin?',
 flow: ['Işık', 'Algılayıcı yüzey', 'Elektrik sinyali'],
 ogren: `
  <p>Gözün ışığı algılama özelliği dijital fotoğraf makinesinin sensörüne benzetilebilir. İkisinde de üzerine düşen ışığı algılayan ve bunu görüntüye dönüştürmek için elektrik sinyaline çeviren algılayıcı yüzeyler bulunur. Bu işlev <b>gözde retina</b>, <b>fotoğraf makinesinde görüntü sensörü</b> tarafından yerine getirilir.</p>
  <p>Retinada oluşan <b>ters görüntü</b>, görme sinirleri ile beyne ulaştığında düzeltilir. Dijital kameralarda ise ters görüntü, cihaza yüklenen yazılımlarla düzeltilir.</p>
  <p>İşitme organlarının çalışması mikrofonun sesleri algılamasına benzer. Ses dalgaları önce <b>kulak zarını</b> titreştirir; bu titreşim orta kulakta güçlendirilerek <b>iç kulaktaki özel hücreler</b> tarafından elektrik sinyallerine dönüştürülür. Mikrofonda ise ses dalgaları bir <b>diyaframı</b> titreştirir; titreşim farklı yöntemlerle elektrik sinyaline çevrilir.</p>`,
 bag: 'Hem canlı duyu organları hem teknolojik cihazlar çevreden gelen uyarıları algılayıp işlenebilir sinyallere dönüştürür.',
 note: 'Göz uyumu ve görme kusurları verilmez.',
 m3: 'goz', sim: null,
 check: { q: 'Gözde ışığı algılayıp elektrik sinyaline çeviren yapı, kamerada hangi yapıya karşılık gelir?', o: ['Objektif', 'Görüntü sensörü', 'Yazılım', 'Diyafram'], a: 1, e: 'Retina ↔ görüntü sensörü; kulaktaki iç kulak hücreleri ↔ mikrofonun diyaframı sonrası dönüştürücü.' }
}
];

/* ---------------- SORU BANKASI (çoktan seçmeli) ---------------- */
const BANK = [
 { t: 'uyaran', q: 'Hayvanlarda uyaranların nöronlarda meydana getirdiği kimyasal ve elektriksel değişimlere ne denir?', o: ['Tepki', 'Uyartı (impuls)', 'Uyaran', 'Sinaps'], a: 1, e: 'Uyaranın nöronda oluşturduğu kimyasal ve elektriksel değişimlere uyartı (impuls) denir.' },
 { t: 'uyaran', q: 'Duyu reseptörleri hangi yapıda olabilir?', o: ['Yalnızca kas hücresi', 'Özelleşmiş epitel hücresi veya nöron', 'Yalnızca miyelin kılıf', 'Yalnızca akson ucu'], a: 1, e: 'Duyu reseptörleri özelleşmiş epitel hücresi (duyu epiteli) ya da nöron yapısında olabilir.' },
 { t: 'uyaran', q: 'Aşağıdakilerden hangisi kimyasal bir uyarandır?', o: ['Işık', 'Basınç', 'Koku molekülü', 'Sıcaklık'], a: 2, e: 'Koku ve tat molekülleri kimyasal uyaranlardır.' },
 { t: 'uyaran', q: 'Tepki verebilmek için uyaranın izlediği doğru sıra hangisidir?', o: ['Alınma → İletim → Dönüştürülme → Yorumlanma', 'Alınma → Dönüştürülme → İletim → Yorumlanma', 'Yorumlanma → Alınma → İletim → Dönüştürülme', 'İletim → Alınma → Yorumlanma → Dönüştürülme'], a: 1, e: 'Reseptörle alınma, uyartıya dönüştürülme, nöronlarla iletilme ve merkezî sinir sisteminde yorumlanma.' },
 { t: 'sinif', q: 'Mekanoreseptörler hangi yapılarda bulunur?', o: ['Burun ve dil', 'Deri ve kulak', 'Yalnızca göz', 'Yalnızca dil'], a: 1, e: 'Mekanoreseptörler deri ve kulak yapısında yer alır.' },
 { t: 'sinif', q: 'Kemoreseptörler hangi duyu organlarında bulunur?', o: ['Burun ve dil', 'Göz ve kulak', 'Deri ve kulak', 'Göz ve deri'], a: 0, e: 'Koku ve tat algısı burun ve dildeki kemoreseptörlerle sağlanır.' },
 { t: 'sinif', q: 'Doku hasarına duyarlı reseptörlere ne ad verilir?', o: ['Termoreseptör', 'Mekanoreseptör', 'Nosiseptör (ağrı reseptörü)', 'Fotoreseptör'], a: 2, e: 'Ağrı reseptörleri (nosiseptörler) serbest sinir uçlarıdır ve beyin hariç tüm vücutta bulunur.' },
 { t: 'sinif', q: 'Gözdeki fotoreseptörler hangi reseptör grubuna örnektir?', o: ['Kemoreseptör', 'Mekanoreseptör', 'Elektromanyetik reseptör', 'Termoreseptör'], a: 2, e: 'Işık, elektrik ve manyetizmayı algılayanlara elektromanyetik reseptör denir; fotoreseptörler bunlara örnektir.' },
 { t: 'sinif', q: 'Sıcak ve soğuk gibi ısı değişimlerini algılayan reseptörler çoğunlukla nerede bulunur?', o: ['Deri ve dil', 'Göz ve kulak', 'Burun ve kulak', 'Yalnızca beyin'], a: 0, e: 'Termoreseptörler çoğunlukla deri ve dilde bulunur.' },
 { t: 'sinif', q: 'Hangisi hem fiziksel hem kimyasal uyaranları algılayabilir?', o: ['Mekanoreseptör', 'Kemoreseptör', 'Ağrı reseptörü', 'Termoreseptör'], a: 2, e: 'Ağrı reseptörleri doku hasarına yol açan hem fiziksel hem kimyasal uyaranları algılar.' },
 { t: 'organ', q: 'Aşağıdakilerden hangisinde reseptörler nöron yapısındadır?', o: ['Kulaktaki tüylü duyu hücreleri', 'Dildeki tat tomurcukları', 'Burundaki koku reseptör nöronları', 'Hiçbiri'], a: 2, e: 'Koku reseptörleri nörondur; kulak ve dil reseptörleri duyu epitelidir.' },
 { t: 'organ', q: 'Kulaktaki duyu reseptörleri aşağıdakilerden hangisini algılar?', o: ['Yalnızca ışığı', 'Ses ve dengeyle ilişkili mekanik uyaranları', 'Koku moleküllerini', 'Yalnızca ısıyı'], a: 1, e: 'Kulak mekanoreseptörleri ses ve dengeyle ilişkili mekanik uyaranları algılar.' },
 { t: 'organ', q: 'Derideki reseptörlerle ilgili hangisi doğrudur?', o: ['Yalnızca dokunmayı algılar', 'Mekano-, termo- ve nosiseptörler bulunur', 'Yalnızca kemoreseptör içerir', 'Duyu epiteli yapısındadır'], a: 1, e: 'Deride mekanoreseptör, termoreseptör ve nosiseptör bulunur; yapıları nöron (serbest sinir uçları ve kapsüllü yapılar) şeklindedir.' },
 { t: 'hayvan', q: 'Yayın balığının tüm vücuduyla tat alabilmesini sağlayan yapı hangisidir?', o: ['Derideki tat tomurcuklarının kemoreseptörleri', 'Yüzgeçlerdeki termoreseptörler', 'Gözdeki fotoreseptörler', 'Kuyruk mekanoreseptörleri'], a: 0, e: 'Derideki tat alma tomurcuklarında bulunan kemoreseptörler tat algısını sağlar.' },
 { t: 'hayvan', q: 'Yıldız burunlu köstebeğin burnundaki uzantılar hangi duyudan sorumludur?', o: ['Tat', 'Dokunma', 'Işık', 'Isı'], a: 1, e: 'Burundaki 22 uzantı dokunma duyusundan sorumludur (mekanoreseptör).' },
 { t: 'hayvan', q: 'Yunusların engellerden kaçabilmesi hangi uyaranın algılanmasına dayanır?', o: ['Işık', 'Geri dönen ses dalgaları', 'Koku molekülleri', 'Isı'], a: 1, e: 'Yayılan ses dalgaları engellere çarpıp geri döner ve işitme organlarıyla algılanır.' },
 { t: 'noron', q: 'Bir nöronun üç temel kısmı hangisidir?', o: ['Hücre gövdesi, dendrit, akson', 'Çekirdek, miyelin, Ranvier', 'Dendrit, sinaps, reseptör', 'Akson, Schwann, glia'], a: 0, e: 'Nöron; hücre gövdesi, dendrit ve akson olmak üzere üç temel kısımdan oluşur.' },
 { t: 'noron', q: 'Diğer nöron ve reseptörlerden gelen uyarıları alıp hücre gövdesine ileten yapı hangisidir?', o: ['Akson', 'Dendrit', 'Miyelin kılıf', 'Sinaptik uç'], a: 1, e: 'Dendritler uyarıları alır ve elektrik sinyalleri hâlinde hücre gövdesine iletir.' },
 { t: 'noron', q: 'Nöronlarda çok sayıda mitokondri bulunmasının nedeni nedir?', o: ['Enerji ihtiyacının fazla olması', 'Miyelin üretmesi', 'Kalıtsal bilgiyi taşıması', 'Nörotransmitterleri parçalaması'], a: 0, e: 'Nöronlarda enerji ihtiyacı fazladır; bu yüzden çok sayıda mitokondri bulunur.' },
 { t: 'noron', q: 'Nörofibrillerin görevi nedir?', o: ['Uyartıyı hızlandırmak', 'Nörona şekil vermek ve hücre içinde madde taşınmasında görev almak', 'Nörotransmitter üretmek', 'Elektriksel yalıtım sağlamak'], a: 1, e: 'Nörofibriller sitoplazmadaki ince telciklerdir; nörona şekil verir ve madde taşınmasında görev alır.' },
 { t: 'noron', q: 'Akson çapı ile iletim hızı arasındaki ilişki hangisidir?', o: ['Çap arttıkça hız azalır', 'Çap arttıkça hız artar', 'İlişki yoktur', 'Çap yalnızca tepki şiddetini etkiler'], a: 1, e: 'Akson çapı ne kadar kalınsa uyartının iletimi o kadar hızlıdır.' },
 { t: 'noron', q: 'Miyelin kılıfı oluşturan hücreler hangisidir?', o: ['Schwann hücreleri', 'Fotoreseptörler', 'Mitokondriler', 'Çubuk hücreleri'], a: 0, e: 'Schwann (Şivan) hücreleri akson etrafında lipoprotein yapılı miyelin kılıfı oluşturur.' },
 { t: 'noron', q: 'Hangi sinirler genellikle miyelin kılıfa sahip değildir?', o: ['İskelet kaslarına giden sinirler', 'İç organlara ve düz kaslara giden sinirler', 'Motor nöronlar', 'Siyatik sinir'], a: 1, e: 'İskelet kaslarına giden sinirler genellikle miyelinli; iç organlara ve düz kaslara gidenler genellikle miyelinsizdir.' },
 { t: 'esik', q: 'Eşik değer nedir?', o: ['Nöronun en yüksek tepki şiddeti', 'Uyartı oluşması için gereken en düşük uyaran şiddeti', 'Uyartının iletim hızı', 'Sinaps boşluğunun genişliği'], a: 1, e: 'Belli bir nöronda uyartı oluşabilmesi için gerekli en düşük uyaran şiddetine eşik değer denir.' },
 { t: 'esik', q: 'Tek bir nöronda eşik değerin altındaki uyaranlara ne olur?', o: ['Zayıf tepki oluşur', 'Tepki oluşmaz', 'Maksimum tepki oluşur', 'İletim hızı azalır'], a: 1, e: 'Ya hep ya hiç yasasına göre eşik altında uyartı oluşmaz.' },
 { t: 'esik', q: 'Sinir demetinde tepki şiddetinin kademeli artmasının nedeni nedir?', o: ['Aksonların farklı eşik değerlere sahip olması', 'Tüm aksonların aynı eşik değerde olması', 'Miyelin kılıfın kalınlaşması', 'Sinapsların durması'], a: 0, e: 'Farklı aksonlar farklı eşik değerlere sahip olduğundan tepki şiddeti kademeli artar (merdiven etkisi).' },
 { t: 'esik', q: 'Belli bir uyaran şiddetinden sonra sinir demetinin tepkisinin sabit kalmasına ne denir?', o: ['Merdiven etkisi', 'Depolarizasyon', 'Repolarizasyon', 'Sinaps etkisi'], a: 0, e: 'Tepki kademeli artıp belli bir değerden sonra değişmiyorsa merdiven etkisi gözlenir.' },
 { t: 'siddet', q: 'Uyaran şiddeti arttıkça sinir demetinde hangisi artmaz?', o: ['Uyarılan nöron sayısı', 'Uyartı sayısı', 'Uyartı iletim hızı', 'Tepki şiddeti'], a: 2, e: 'İletim hızı değişmez; uyartı sayısı, sıklığı ve tepki şiddeti artar.' },
 { t: 'siddet', q: 'Nöronlarda uyartı iletimi neden elektrokimyasal bir süreçtir?', o: ['İyon geçişlerine dayandığı ve ATP harcandığı için', 'Yalnızca ATP üretildiği için', 'Miyelin kılıf bulunduğu için', 'Sinaps olduğu için'], a: 0, e: 'İyon geçişlerine dayandığı için elektriksel, ATP harcanması gerektiği için kimyasaldır.' },
 { t: 'zar', q: 'Dinlenme hâlindeki nöronda akson zarının yük dağılımı nasıldır?', o: ['İç negatif, dış pozitif', 'İç pozitif, dış negatif', 'İç ve dış nötr', 'İç ve dış pozitif'], a: 0, e: 'Dinlenme potansiyelinde hücre içi negatif, hücre dışı pozitiftir (polarizasyon).' },
 { t: 'zar', q: 'Depolarizasyonda ne gerçekleşir?', o: ['Pozitif iyonlar hücre dışına çıkar', 'Pozitif iyonlar hücre içine girer', 'Nörotransmitter parçalanır', 'Miyelin kılıf oluşur'], a: 1, e: 'Nöron uyarıldığında pozitif iyonlar hücre içine girer.' },
 { t: 'zar', q: 'Zarın dinlenme hâline geri dönmesine ne ad verilir?', o: ['Polarizasyon', 'Depolarizasyon', 'Repolarizasyon', 'Sinaps'], a: 2, e: 'Pozitif iyonların tekrar hücre dışına çıkmasıyla zar dinlenme hâline döner: repolarizasyon.' },
 { t: 'zar', q: 'Bir bölgeden ikinci bir uyartı ne zaman geçebilir?', o: ['Depolarizasyon sürerken', 'Repolarizasyon tamamlandıktan sonra', 'Hiçbir zaman', 'Miyelin kılıf kalkınca'], a: 1, e: 'Repolarizasyon olmadan o bölgeden ikinci bir uyartı geçemez.' },
 { t: 'sinaps', q: 'Nöronlar arasındaki uyartı iletimi genellikle hangi yönde gerçekleşir?', o: ['Dendritten akson ucuna', 'Akson ucundan diğer nöronun dendritine', 'Hücre gövdesinden akson ucuna', 'Çift yönlü, her zaman'], a: 1, e: 'Genellikle bir nöronun akson ucundan diğer nöronun dendritine doğru tek yönlüdür.' },
 { t: 'sinaps', q: 'Omurgalılarda hangi sinaps türü daha yaygındır?', o: ['Elektriksel sinaps', 'Kimyasal sinaps', 'Mekanik sinaps', 'Termik sinaps'], a: 1, e: 'Omurgalılarda kimyasal sinaps, omurgasızlarda elektriksel sinaps daha yaygındır.' },
 { t: 'sinaps', q: 'Kimyasal sinapslarda nöronlar arasında ne bulunur?', o: ['Sinaps boşluğu', 'Miyelin kılıf', 'Ranvier boğumu', 'Çekirdek'], a: 0, e: 'Hücreler fiziksel olarak temas etmez; aralarında sinaps boşluğu vardır.' },
 { t: 'sinaps', q: 'Durdurucu sinapslarda nörotransmitterler neye yol açar?', o: ['Depolarizasyona', 'Hiperpolarizasyona', 'Aksiyon potansiyeli artışına', 'Miyelin yapımına'], a: 1, e: 'Durdurucu sinapslar yüksek polarizasyona (hiperpolarizasyon) yol açarak uyartı iletimini engeller.' },
 { t: 'sinaps', q: 'Nörotransmitterlerin etkisi nasıl sonlandırılır?', o: ['Enzimlerle parçalanma veya geri alınma', 'Miyelin ile sarılma', 'Çekirdeğe taşınma', 'Ranvier boğumundan geçme'], a: 0, e: 'Enzimlerle parçalanır veya nöron tarafından tekrar hücre içine alınır.' },
 { t: 'teknoloji', q: 'Kulaktaki kulak zarına teknolojik cihazlarda benzer yapı hangisidir?', o: ['Diyafram', 'Objektif', 'Görüntü sensörü', 'Yazılım'], a: 0, e: 'Ses dalgaları mikrofonda diyaframı, kulakta kulak zarını titreştirir.' },
 { t: 'teknoloji', q: 'Retinada oluşan ters görüntü nerede düzeltilir?', o: ['Beyinde', 'Kornea’da', 'Mercekte', 'Retinada'], a: 0, e: 'Görme sinirleri ile beyne ulaştığında düzeltilir; kameralarda bu iş yazılımla yapılır.' }
];

/* ---------------- BAĞLAM TEMELLİ SORULAR ---------------- */
/* parts.a: kabul edilen anahtar ifadeler (normalize edilir; "+" ile bağlananların hepsi geçmeli) */
const BAGLAM = [
 { id: 'bt1', topic: 'esik', title: 'Laboratuvarda tek motor nöron',
   ctx: `<p>Bir biyoloji laboratuvarında araştırmacılar, izole edilmiş tek bir motor nöron üzerinde uyaran şiddetinin impuls oluşumu ve iletimi üzerindeki etkisini incelemektedir. Nörona ilk olarak düşük şiddette bir uyarı uygulanmış ve hücre zarında hiçbir elektriksel yük değişimi (aksiyon potansiyeli) gözlenmemiştir.</p>
   <p>Araştırmacılar uyarı şiddetini kademeli olarak artırdıklarında, hücrenin elektriksel tepki vermeye başladığı kritik bir sınır değere ulaşmış ve aksiyon potansiyeli tetiklenmiştir. Bu sınır değerin üzerindeki çok daha güçlü uyarılarda ise nöronda oluşan aksiyon potansiyelinin şiddetinde veya hızında hiçbir artış olmadığı, oluşan elektriksel tepkinin hep aynı maksimum seviyede kaldığı tespit edilmiştir.</p>`,
   ask: 'Yukarıdaki gözlemde açıklandığı gibi, tek bir sinir hücresinin belirli bir sınır değerin altındaki uyarılara hiç tepki vermeyip bu sınır değer ve üzerindeki tüm uyarılara aynı ve maksimum şiddette tepki vermesini ifade eden biyolojik kuralın/yasanın adını yazınız; tek bir nöronda impuls oluşturulabilmesi için gerekli en düşük uyaran şiddeti sınırına ne ad verildiğini belirtiniz.',
   parts: [{ l: 'Kuralın / yasanın adı', a: ['ya hep ya hic', 'yahepyahic'] }, { l: 'En düşük uyaran şiddeti sınırının adı', a: ['esik'] }],
   model: 'Yasa: ya hep ya hiç yasası. Sınır: eşik değer (eşik şiddeti).' },
 { id: 'bt2', topic: 'esik', title: 'Sinir kordonunda artan uyarı',
   ctx: `<p>Bir fizyoloji deneyinde kurbağa siyatik sinirinden çok sayıda aksonu bir arada taşıyan sinir kordonu hazırlanmıştır. Sinire uygulanan uyaran şiddeti adım adım artırılırken tepki şiddeti de basamak basamak artmış, ancak belli bir uyaran şiddetinden sonra uyaran artsa bile tepki şiddetinde değişim gözlenmemiştir.</p>`,
   ask: 'Bu durumun (kademeli artıp sabitlenen tepkinin) adını yazınız ve tek sinir telindeki durumdan farklı olarak tepkinin kademeli artmasının nedenini açıklayınız.',
   parts: [{ l: 'Olayın adı', a: ['merdiven'] }, { l: 'Kademeli artışın nedeni', a: ['farkli+esik', 'esik+degerler'] }],
   model: 'Merdiven etkisi. Sinir demetindeki farklı aksonların farklı eşik değerlere sahip olması nedeniyle uyaran arttıkça daha fazla akson uyarılır ve tepki kademeli artar.' },
 { id: 'bt3', topic: 'siddet', title: 'Ilık ve sıcak bardak',
   ctx: `<p>Bir öğrenci elini önce 20 °C’lik bir bardağa, ardından 45 °C’lik bir bardağa dokundurmuştur. Elindeki sinir liflerinden alınan kayıtlarda, 45 °C’lik bardağa dokunulduğunda aynı sürede çok daha fazla sayıda uyartı oluştuğu ve uyartıların daha sık aralıklarla geldiği görülmüştür. Öğrenci ikinci bardağı “sıcak” olarak algılamıştır.</p>`,
   ask: 'Beynin bardağı sıcak olarak algılamasını sağlayan değişimi (uyartıların hangi özellikleri) yazınız ve sıcaklık değişimlerini algılayan reseptörün adını belirtiniz.',
   parts: [{ l: 'Beynin ayırt ettiği özellikler', a: ['sik+say', 'sayi+sik', 'sik'] }, { l: 'Reseptörün adı', a: ['termoreseptor'] }],
   model: 'Uyartıların sıklığı ve sayısı artar. Isı değişimlerini termoreseptörler algılar.' },
 { id: 'bt4', topic: 'hayvan', title: 'Karanlıkta avlanan yılan',
   ctx: `<p>Bir doğa belgeselinde çukur engereğinin tamamen karanlık bir mağarada bir kemirgeni yakalaması gösterilmektedir. Araştırmacılar yılanın gözlerinin altındaki pit organının kapatıldığında avını bulmakta zorlandığını gözlemlemiştir.</p>`,
   ask: 'Pit organda bulunan ve avdan yayılan ısıyı algılayan reseptör çeşidini yazınız; bu reseptörün algıladığı uyaranın fiziksel mi kimyasal mı olduğunu belirtiniz.',
   parts: [{ l: 'Reseptör çeşidi', a: ['termoreseptor'] }, { l: 'Uyaran türü', a: ['fiziksel'] }],
   model: 'Termoreseptör; ısı fiziksel bir uyarandır.' },
 { id: 'bt5', topic: 'hayvan', title: 'Tat alan balık',
   ctx: `<p>Bir akvaryumda yetiştirilen yayın balıkları, suya karışan yiyecek moleküllerini derilerindeki tat alma tomurcukları sayesinde tüm vücutlarıyla algılayabilmekte ve yiyeceklerin yerini bulabilmektedir. Tat yoğunluğu arttıkça balıklar kaynağa doğru yönelmektedir.</p>`,
   ask: 'Bu algıyı sağlayan reseptör çeşidini ve algılanan uyaranın türünü (fiziksel/kimyasal) yazınız.',
   parts: [{ l: 'Reseptör çeşidi', a: ['kemoreseptor'] }, { l: 'Uyaran türü', a: ['kimyasal'] }],
   model: 'Kemoreseptör; algılanan uyaran kimyasaldır.' },
 { id: 'bt6', topic: 'hayvan', title: 'Toprak altındaki avcı',
   ctx: `<p>Yıldız burunlu köstebek, toprak altında hiç ışık olmamasına rağmen burnundaki yirmi iki uzantı sayesinde solucanları çok hızlı bulur. Araştırmacılar bu uzantıların toprak parçacıklarına temas ederek çevrenin “dokunma haritasını” çıkardığını belirtmiştir.</p>`,
   ask: 'Bu uzantılardaki reseptör çeşidini yazınız ve insanda bu reseptör tipinin bulunduğu iki yapıyı belirtiniz.',
   parts: [{ l: 'Reseptör çeşidi', a: ['mekanoreseptor'] }, { l: 'İnsanda bulunduğu yapılar', a: ['deri+kulak', 'kulak+deri'] }],
   model: 'Mekanoreseptör; insanda deri ve kulakta bulunur.' },
 { id: 'bt7', topic: 'hayvan', title: 'Ses dalgalarıyla yön bulan yunus',
   ctx: `<p>Bir yunus, başındaki özel bir organdan ses dalgaları yayarak bulanık sularda engellerden kaçmakta ve balık sürüsünün yerini tespit etmektedir. Geri dönen dalgalar işitme organı tarafından algılanmaktadır.</p>`,
   ask: 'Geri dönen ses dalgalarını algılayan reseptör çeşidini ve bu reseptörlerin insandaki bulunduğu duyu organını yazınız.',
   parts: [{ l: 'Reseptör çeşidi', a: ['mekanoreseptor'] }, { l: 'Duyu organı', a: ['kulak'] }],
   model: 'Mekanoreseptör; insanda kulakta bulunur.' },
 { id: 'bt8', topic: 'noron', title: 'İki farklı sinir',
   ctx: `<p>Bir araştırmacı, akson çapları eşit iki sinirde iletim hızını ölçmüştür. Birincisi bacaktaki iskelet kasına giden motor nöron, ikincisi bağırsağın düz kaslarına giden bir nörondur. Birinci sinirde iletim hızının belirgin biçimde yüksek olduğu görülmüştür. Mikroskopta birinci sinirin aksonu çevresinde, Schwann hücreleri tarafından oluşturulan ve aralıklarla kesintiye uğrayan lipoprotein yapılı bir örtü bulunmuştur.</p>`,
   ask: 'Birinci sinirdeki iletimi hızlandıran örtü yapının adını ve bu örtünün kesintiye uğradığı yerlere ne denildiğini yazınız.',
   parts: [{ l: 'Örtü yapının adı', a: ['miyelin'] }, { l: 'Kesintiye uğradığı yer', a: ['ranvier'] }],
   model: 'Miyelin kılıf; kesintiye uğradığı yerler Ranvier boğumlarıdır. Miyelin, elektriksel yalıtım sağlayarak uyartı iletimini hızlandırır.' },
 { id: 'bt9', topic: 'zar', title: 'Dinlenmedeki nöronun zarı',
   ctx: `<p>Bir araştırmacı, dinlenme hâlindeki bir nöronun akson zarının iki yüzü arasındaki elektriksel yük farkını ölçmüştür. Daha sonra nöronu uyardığında pozitif iyonların hızla hücre içine girdiğini ve zarın iç yüzünün pozitif, dış yüzünün negatif yüklü hâle geldiğini kaydetmiştir.</p>`,
   ask: 'Dinlenme hâlinde hücre içinin yükünü (pozitif/negatif) yazınız ve uyarıldığında zarda görülen bu yük değişiminin adını belirtiniz.',
   parts: [{ l: 'Dinlenmede hücre içi yükü', a: ['negatif'] }, { l: 'Yük değişiminin adı', a: ['depolarizasyon'] }],
   model: 'Hücre içi negatif (polarizasyon). Pozitif iyonlar içeri girince olan değişim depolarizasyondur.' },
 { id: 'bt10', topic: 'zar', title: 'Dalga gibi ilerleyen uyartı',
   ctx: `<p>Akson üzerinde bir uyartı ilerlerken depolarize olmuş bölgede pozitif iyonlar tekrar hücre dışına çıkmakta ve zar dinlenme hâline dönmektedir. Araştırmacılar bu geri dönüş tamamlanmadan aynı bölgeden ikinci bir uyartının geçemediğini belirlemiştir.</p>`,
   ask: 'Zarın dinlenme hâline dönmesini sağlayan olayın adını yazınız ve bu olay tamamlandığında hücre dışının yükünü belirtiniz.',
   parts: [{ l: 'Olayın adı', a: ['repolarizasyon'] }, { l: 'Hücre dışının yükü', a: ['pozitif'] }],
   model: 'Repolarizasyon; hücre dışı pozitif, hücre içi negatif olur.' },
 { id: 'bt11', topic: 'sinaps', title: 'Kimyasal haberciler',
   ctx: `<p>Elektron mikroskobuyla incelenen bir sinapsta, akson ucundaki sinaptik yumruda içi madde dolu keseciklerin zara kaynaşıp içeriklerini iki hücre arasındaki boşluğa bıraktığı görülmüştür. Bu maddeler karşı hücrenin zarındaki reseptörlere bağlanmış ve uyartı komşu hücreye aktarılmıştır.</p>`,
   ask: 'Keseciklerden salınan kimyasal maddelerin adını ve hücreler arasındaki boşluğun adını yazınız.',
   parts: [{ l: 'Kimyasal maddenin adı', a: ['norotransmitter', 'nerotransmitter', 'transmitter'] }, { l: 'Boşluğun adı', a: ['sinaps boslugu', 'sinaps+bosluk'] }],
   model: 'Nörotransmitter madde; sinaps boşluğu.' },
 { id: 'bt12', topic: 'sinaps', title: 'Dur diyen sinaps',
   ctx: `<p>Bir nöron birden fazla nöronla sinaps yapmaktadır. A sinapsında salınan nörotransmitterler karşı hücrede depolarizasyona yol açarak uyartının iletilmesini sağlarken, B sinapsında salınan nörotransmitterler zarın polarizasyonunu daha da artırarak uyartı iletimini engellemektedir.</p>`,
   ask: 'A ve B sinapslarının türlerini sırasıyla yazınız.',
   parts: [{ l: 'A sinapsı', a: ['kolaylastirici'] }, { l: 'B sinapsı', a: ['durdurucu'] }],
   model: 'A: kolaylaştırıcı sinaps, B: durdurucu sinaps (hiperpolarizasyon). Bu seçici direnç sayesinde gereksiz tepkiler verilmez.' },
 { id: 'bt13', topic: 'sinaps', title: 'Neden sürekli uyarılmıyoruz?',
   ctx: `<p>Bir sinaps boşluğuna bırakılan nörotransmitterler görevini tamamladığında iki yoldan etkisiz hâle getirilmektedir: bir kısmı boşluktaki enzimler tarafından değiştirilirken diğer kısmı akson ucundaki zardan geçerek yeniden nörona alınmaktadır. Bu mekanizma çalışmasaydı komşu hücre sürekli uyarılacaktı.</p>`,
   ask: 'Enzimlerin nörotransmitterlere ne yaptığını ve ikinci yolun adını yazınız.',
   parts: [{ l: 'Enzimlerin etkisi', a: ['parcala'] }, { l: 'İkinci yol', a: ['tekrar', 'geri al', 'hucre icine'] }],
   model: 'Enzimler nörotransmitterleri parçalar; ikinci yolda nörotransmitterler tekrar hücre içine alınır.' },
 { id: 'bt14', topic: 'teknoloji', title: 'Göz mü, kamera mı?',
   ctx: `<p>Bir mühendis dijital kameranın görüntü sensörü ile gözü karşılaştırmaktadır. İkisinde de ışık algılayıcı bir yüzeye düşer ve elektrik sinyaline çevrilir. Ancak her ikisinde de bu yüzeyde oluşan görüntünün ters olduğunu, daha sonra düzeltildiğini belirtmektedir.</p>`,
   ask: 'Gözde görüntü sensörüne karşılık gelen yapının adını yazınız ve ters görüntünün insanda nerede düzeltildiğini belirtiniz.',
   parts: [{ l: 'Gözdeki karşılığı', a: ['retina'] }, { l: 'Düzeltildiği yer', a: ['beyin'] }],
   model: 'Retina; ters görüntü görme sinirleriyle beyne ulaştığında beyinde düzeltilir (kamerada yazılım düzeltir).' },
 { id: 'bt15', topic: 'teknoloji', title: 'Kulak ve mikrofon',
   ctx: `<p>Bir ses mühendisi, mikrofonun ses dalgalarıyla titreşen diyaframından yola çıkarak kulağın çalışmasını açıklamak istemektedir. Kulakta ses dalgalarının ilk titreştirdiği yapı zar şeklindedir; titreşim orta kulakta güçlendirildikten sonra iç kulaktaki özel hücrelerde elektrik sinyaline dönüştürülür.</p>`,
   ask: 'Ses dalgalarının kulakta ilk titreştirdiği yapının adını yazınız ve iç kulaktaki özel hücrelerin ait olduğu reseptör çeşidini belirtiniz.',
   parts: [{ l: 'İlk titreşen yapı', a: ['kulak zari', 'zar'] }, { l: 'Reseptör çeşidi', a: ['mekanoreseptor'] }],
   model: 'Kulak zarı; iç kulaktaki tüylü duyu hücreleri mekanoreseptördür.' },
 { id: 'bt16', topic: 'sinif', title: 'Dikene basan ayak',
   ctx: `<p>Çıplak ayakla yürüyen bir kişi sivri bir dikene bastığında ayağını anında geri çekmiştir. Deride dokuyu tehlikeye atabilecek bu uyaranı algılayan yapılar, serbest sinir uçları şeklinde dallanan nöron uzantılarıdır ve beyin dışında tüm vücutta bulunur.</p>`,
   ask: 'Bu uyaranı algılayan reseptörün adını yazınız ve bu reseptörün yapısının nöron mu duyu epiteli mi olduğunu belirtiniz.',
   parts: [{ l: 'Reseptörün adı', a: ['nosiseptor', 'agri'] }, { l: 'Reseptör yapısı', a: ['noron'] }],
   model: 'Ağrı reseptörü (nosiseptör); serbest sinir uçları nöron yapısındadır.' },
 { id: 'bt17', topic: 'sinif', title: 'Göçmen kuşun pusulası',
   ctx: `<p>Bazı göçmen kuşların dünyanın manyetik alanındaki değişimleri algılayarak yönlerini bulduğu düşünülmektedir. Işık, elektrik ve manyetizma gibi elektromanyetik enerjinin değişik formlarını algılayan reseptörlere özel bir ad verilir. İnsan gözündeki ışığı algılayan hücreler de bu gruptadır.</p>`,
   ask: 'Bu reseptör grubunun adını yazınız ve gözdeki örneğini belirtiniz.',
   parts: [{ l: 'Reseptör grubu', a: ['elektromanyetik'] }, { l: 'Gözdeki örnek', a: ['fotoreseptor', 'cubuk', 'koni'] }],
   model: 'Elektromanyetik reseptörler; gözdeki fotoreseptörler (çubuk ve koni hücreleri).' },
 { id: 'bt18', topic: 'organ', title: 'Dil ve burun',
   ctx: `<p>Bir öğrenci “Burun yalnızca koku, dil yalnızca tat alır; ikisinin reseptörleri de aynı yapıdadır” demiştir. Öğretmeni, her ikisinin de kimyasal uyaranları algıladığını ancak burundaki koku reseptörlerinin nöron, dildeki tat tomurcuklarının ise farklı bir yapıda olduğunu belirtmiştir.</p>`,
   ask: 'Burun ve dildeki reseptörlerin ortak çeşidini ve dildeki reseptörlerin yapısını yazınız.',
   parts: [{ l: 'Ortak reseptör çeşidi', a: ['kemoreseptor'] }, { l: 'Dildeki reseptörün yapısı', a: ['duyu epiteli', 'epitel'] }],
   model: 'Kemoreseptör; dildeki tat tomurcukları duyu epiteli yapısındadır.' }
];
