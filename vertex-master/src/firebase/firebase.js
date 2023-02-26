import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
// import { getDatabase } from "firebase/database";
import {getStorage} from "firebase/storage"
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "vertex-ecommerce.firebaseapp.com",
  projectId: "vertex-ecommerce",
  storageBucket: "vertex-ecommerce.appspot.com",
  messagingSenderId: "855386645034",
  appId: "1:855386645034:web:43bfd63d6ba0fbf03b1953",
  measurementId: "G-H7FXP43LRG",
 
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app)
// export const rdb = getDatabase(app);
export const storage = getStorage(app)