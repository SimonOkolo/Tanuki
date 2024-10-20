import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBd0h2avX-g_K79OLZ_KzrNSddj6TOoLu0",
    authDomain: "tanuki-ani.firebaseapp.com",
    projectId: "tanuki-ani",
    storageBucket: "tanuki-ani.appspot.com",
    messagingSenderId: "679369092330",
    appId: "1:679369092330:web:b1139091b0f10e9ef93b93",
    measurementId: "G-PV3E7TBMWJ"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);