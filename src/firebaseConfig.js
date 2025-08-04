// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuV__FKyOfC1wgluyPmibmo6L06sCaTIA",
  authDomain: "estoque-oficina-139d5.firebaseapp.com",
  projectId: "estoque-oficina-139d5",
  storageBucket: "estoque-oficina-139d5.firebasestorage.app",
  messagingSenderId: "643117284789",
  appId: "1:643117284789:web:1dc800dc39b2a41fad2dfc"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta Auth e Firestore prontos pra uso
export const auth = getAuth(app);
export const db = getFirestore(app);
