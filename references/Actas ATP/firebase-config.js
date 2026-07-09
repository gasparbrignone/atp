const firebaseConfig = {
  apiKey: "AIzaSyBfjS9yUoyL2oreyEU54km-vgAmpGz101g",
  authDomain: "internaatp.firebaseapp.com",
  databaseURL: "https://internaatp-default-rtdb.firebaseio.com",
  projectId: "internaatp",
  storageBucket: "internaatp.firebasestorage.app",
  messagingSenderId: "195953220460",
  appId: "1:195953220460:web:2866e081086a0ab095f149",
  measurementId: "G-FVQZBMK037"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database(); // Usamos Realtime Database
const auth = firebase.auth();