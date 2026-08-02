import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore"

// Storage requiere el plan Blaze en Firebase; se postergó su activación.
// Cuando el proyecto lo tenga habilitado, agregar acá:
// import { getStorage } from "firebase/storage"
// export const storage = getStorage(app)

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

// Caché local persistente: en una red de celular inestable, Firestore
// muestra al instante los últimos datos guardados en el dispositivo en vez
// de dejar la pantalla esperando la respuesta de red (causa típica de
// pantallas en blanco o de carga colgada al recargar con mala señal).
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
})
