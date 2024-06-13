// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzBiQ0I-kvKdaGwUQcR09fc__u5gECg8A",
  authDomain: "divya-kala-academy.firebaseapp.com",
  projectId: "divya-kala-academy",
  storageBucket: "divya-kala-academy.appspot.com",
  messagingSenderId: "657110681659",
  appId: "1:657110681659:web:510db543d977090060741e",
  measurementId: "G-7B3382JQN6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const googleProvider = new GoogleAuthProvider();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const databaseStorage = getStorage(app);

