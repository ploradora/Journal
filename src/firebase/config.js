import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAG1PVjGX54XTT-qhpDb6s0wPu_aWVfpFc",
  authDomain: "journal-1817a.firebaseapp.com",
  databaseURL: "https://journal-1817a-default-rtdb.firebaseio.com",
  projectId: "journal-1817a",
  storageBucket: "journal-1817a.appspot.com",
  messagingSenderId: "98033053399",
  appId: "1:98033053399:web:40ca2cd58da48b850b0a92",
};

initializeApp(firebase);

const db = getFirestore();
const auth = getAuth();

export { db, auth };
