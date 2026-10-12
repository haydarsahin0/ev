// ─────────────────────────────────────────────────────────────
//  WG Kasası — ortak senkron ayarları
//
//  Bu dosya boşken (firebase: null) site "Yerel mod"da çalışır:
//  veriler sadece o cihazın tarayıcısında durur.
//
//  Üç kişinin aynı listeyi görmesi için README.md'deki
//  "Firebase kurulumu" adımlarını izle ve aşağıyı doldur.
// ─────────────────────────────────────────────────────────────
window.WG_CONFIG = {
  firebase: {
    apiKey: "AIzaSyCSifvjHGg0RCz7MsflqMXB_up_EzwIbWM",
    authDomain: "wg-kasasi.firebaseapp.com",
    databaseURL: "https://wg-kasasi-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "wg-kasasi",
    storageBucket: "wg-kasasi.firebasestorage.app",
    messagingSenderId: "649263179444",
    appId: "1:649263179444:web:9f7b71b148de37aa8e19e1",
  },

  // Örnek:
  // firebase: {
  //   apiKey: "AIza...",
  //   authDomain: "wg-kasasi.firebaseapp.com",
  //   databaseURL: "https://wg-kasasi-default-rtdb.europe-west1.firebasedatabase.app",
  //   projectId: "wg-kasasi",
  //   appId: "1:123456789:web:abc123",
  // },

  // Veritabanında verilerin tutulduğu klasör
  path: "wg",
};
