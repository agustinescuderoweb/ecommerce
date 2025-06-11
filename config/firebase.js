// Importa lo necesario
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Firestore
import { getAuth } from "firebase/auth";           // Autenticación
import { getStorage } from "firebase/storage";     // Almacenamiento

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDU9omZfuTFfO08Ev_K-95ZvjRvqd8B1H0",
  authDomain: "quickcart-13c55.firebaseapp.com",
  projectId: "quickcart-13c55",
  storageBucket: "quickcart-13c55.appspot.com", // corregido el dominio aquí
  messagingSenderId: "1000154950092",
  appId: "1:1000154950092:web:af020467ff3f85e43d9569",
  measurementId: "G-24DMG5R645"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null; // Prevención en entorno SSR

// Inicializa servicios
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Exporta lo necesario
export { app, analytics, db, auth, storage };
