
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpimSyGU83yTEZC8pT_gxNUZ32yo8GM5A",
  authDomain: "percentbetter-80e3e.firebaseapp.com",
  projectId: "percentbetter-80e3e",
  storageBucket: "percentbetter-80e3e.appspot.com",
  messagingSenderId: "362365269883",
  appId: "1:362365269883:web:5b52e7b3096858c12b6fde",
  measurementId: "G-F65JBV56JX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);