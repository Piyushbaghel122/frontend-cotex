// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAYbPAgmICw-fI-QLK9NThWsZNc8LGfgYE",
  authDomain: "projuct-46554.firebaseapp.com",
  projectId: "projuct-46554",
  storageBucket: "projuct-46554.firebasestorage.app",
  messagingSenderId: "413043827773",
  appId: "1:413043827773:web:3ad9d4d80272e0d4a07654",
  measurementId: "G-EKYS3W9YJQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { app };