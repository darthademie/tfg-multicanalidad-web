// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"

export const environment = {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  firebaseConfig: {
    apiKey: "AIzaSyDmXf1E4k5Hf5XbtxSbbo5reZB7taGUtbw",
    authDomain: "bbdd-multicanalidad.firebaseapp.com",
    databaseURL: "https://bbdd-multicanalidad-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "bbdd-multicanalidad",
    storageBucket: "bbdd-multicanalidad.appspot.com",
    messagingSenderId: "632604922699",
    appId: "1:632604922699:web:56c5d5c55c2436cb5a4ece",
    measurementId: "G-5052ZK4VYZ"
  },
    production: true
};

// Initialize Firebase
export const fapp = initializeApp(environment.firebaseConfig);
export const db = getDatabase(fapp);