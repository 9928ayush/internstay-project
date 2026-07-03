import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // your config
  apiKey: "AIzaSyC2Hc0kqVjfDOqr77zRm8E6_ZgH_u8VPkE",
  authDomain: "healstay-51f3f.firebaseapp.com",
  projectId: "healstay-51f3f",
  storageBucket: "healstay-51f3f.appspot.com",
  messagingSenderId: "911923766229",
  appId: "1:911923766229:web:3a95675698cc8d31e5d35c",
  measurementId: "G-SPQBLFLKH8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider(); // ✅ FIXED



