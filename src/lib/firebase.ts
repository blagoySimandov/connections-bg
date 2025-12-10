// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHD4Swrly7lGQY9smI5Zi8bjifUEPldE8",
  authDomain: "connections-bulgaria.firebaseapp.com",
  projectId: "connections-bulgaria",
  storageBucket: "connections-bulgaria.firebasestorage.app",
  messagingSenderId: "956324176782",
  appId: "1:956324176782:web:3254d9e9d37bad67e8fadf",
  measurementId: "G-KWT3EX2JYH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db }
