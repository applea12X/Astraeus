// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAXKSUJ24xuWGyAYQUXgfexKasU5EuLWk",
  authDomain: "hacktx-tfs.firebaseapp.com",
  projectId: "hacktx-tfs",
  storageBucket: "hacktx-tfs.firebasestorage.app",
  messagingSenderId: "16890346971",
  appId: "1:16890346971:web:c5baf47519ad58fb41bbfe",
  measurementId: "G-XRW40NDJ0K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

