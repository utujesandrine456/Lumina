import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyCeCidWYa6WawNSvzxbjhZmjmIQCnRnM",
  authDomain: "lumina-10987.firebaseapp.com",
  projectId: "lumina-10987",
  storageBucket: "lumina-10987.firebasestorage.app",
  messagingSenderId: "372279267930",
  appId: "1:372279267930:web:c94150c1e4138b44303e63",
  measurementId: "G-14N0ENEG8Y"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);