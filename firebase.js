// import { initializeApp } from "firebase/app";
// import storage_1, { getStorage } from "firebase/storage";
// import "firebase/firestore";
// import "firebase/compat/auth";
// import "firebase/compat/firestore";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { ref } from 'firebase/storage';

// // // // // // // // alert(process.env.NEXT_PUBLIC_API_KEY)
// // // // // // // console.log("firebaseId", process.env.NEXT_PUBLIC_API_KEY);

// // // // // // // const firebaseConfig = {
// // // // // // //   apiKey: process.env.NEXT_PUBLIC_API_KEY,
// // // // // // //   authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
// // // // // // //   databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
// // // // // // //   projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
// // // // // // //   storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
// // // // // // //   messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
// // // // // // //   appId: process.env.NEXT_PUBLIC_APP_ID,
// // // // // // //   measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
// // // // // // // };

// // // // // // // /// My Accouont
// // // // // // // // const firebaseConfig = {
// // // // // // // //   apiKey: process.env.NEXT_PUBLIC_API_KEY,
// // // // // // // //   projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
// // // // // // // //   messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
// // // // // // // //   storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET
// // // // // // // // };
// // // // // // // // collid = data
// // // // // // // // docId = qpp9STnZRxCnthWDRLMT

// // // // // // // const app = initializeApp(firebaseConfig);

// // // // // // // // Initialize Cloud Firestore and get a reference to the service
// // // // // // // const db = getFirestore(app);
// // // // // // // export const storage = getStorage(initializeApp(firebaseConfig));
// // // // // // // export const auth = getAuth();
// // // // // // // export const storage_2 = storage_1;

// // // // // // // export default db;

// // // // // // // export const imagesRef = ref(storage, 'images');

///////////////////////////////////////////---------------------Change
// alert(process.env.NEXT_PUBLIC_API_KEY)

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// import { onDocumentCreated } from "firebase-functions/v2/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const dbForCollection = getFirestore(app);
// export const db_1 = firebase.firestore();

export const storage = getStorage();
export const auth = getAuth();

// const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
// const db = getFirestore(app);
// export const storage = getStorage(initializeApp(firebaseConfig));
// export const auth = getAuth();
// export const storage_2 = storage_1;

// export default db;

// export const imagesRef = ref(storage, 'images');
