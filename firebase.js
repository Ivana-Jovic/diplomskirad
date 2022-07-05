// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaHro3CDGrWX1FMbydkM8tSSlaD880WLU",
  authDomain: "diplomski-55137.firebaseapp.com",
  projectId: "diplomski-55137",
  storageBucket: "diplomski-55137.appspot.com",
  messagingSenderId: "92632220826",
  appId: "1:92632220826:web:031aafd593f5b97fdecb23",
  measurementId: "G-TL1WHX4GL1",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

// const auth = app.auth();
// const provider = new firebaseConfig.auth.goo
// const analytics = getAnalytics(app);

export { app, db, storage };
