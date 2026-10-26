/* Firebase girişi isteğe bağlıdır. Boş bırakırsan "Google ile giriş" düğmesi gizlenir ve ilerleme yalnızca cihazda saklanır.
   Doldurmak için: Firebase Console > Proje ayarları > Uygulamalarınız > Web uygulaması > firebaseConfig değerlerini aşağıya yapıştır.
   Ayrıca Authentication'da "Google" sağlayıcısını aç, Firestore Database oluştur ve yetkili alan adlarına
   <kullanici>.github.io adresini ekle. */
window.FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
