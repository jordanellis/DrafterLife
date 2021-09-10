import * as firebase from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1JGPFS1oakSuuAq0ls3tMKBiA8g-e-UU",
  authDomain: "drafterlife-2d6e7.firebaseapp.com",
  projectId: "drafterlife-2d6e7",
  storageBucket: "drafterlife-2d6e7.appspot.com",
  messagingSenderId: "393565763781",
  appId: "1:393565763781:web:28939103e47b56321a18ac",
  measurementId: "G-5GW4ZGFDC7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = getFirestore();

export default db;