import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqdoVhKWOmwjLjJwjHtJnnt8WMVFrcjFY",
  authDomain: "proven-c4e44.firebaseapp.com",
  projectId: "proven-c4e44",
  storageBucket: "proven-c4e44.firebasestorage.app",
  messagingSenderId: "120156921178",
  appId: "1:120156921178:web:edec7b6e223bfe34372763",
  measurementId: "G-KQ0P9CC8HY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider("apple.com");

export { app, auth, analytics, googleProvider, appleProvider, signInWithPopup, signOut };
