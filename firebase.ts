import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBU8QOGEb4qJsUX5dpb_9a2xJP0zTvu_-Y",
  authDomain: "nutrimais-a0c47.firebaseapp.com",
  projectId: "nutrimais-a0c47",
  storageBucket: "nutrimais-a0c47.firebasestorage.app",
  messagingSenderId: "456199774504",
  appId: "1:456199774504:web:daf15327f9af58c107f01d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;