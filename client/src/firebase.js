// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-cc8c4.firebaseapp.com",
  projectId: "mern-estate-cc8c4",
  storageBucket: "mern-estate-cc8c4.firebasestorage.app",
  messagingSenderId: "732035704062",
  appId: "1:732035704062:web:aa0aa47ba643d2f1f5b1af",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
