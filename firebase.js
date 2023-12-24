import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore();

export const saveData = (params) =>
  addDoc(collection(db, "lists"), { ...params });

export const onGetDatas = (callback) =>
  onSnapshot(collection(db, "lists"), callback);

export const deleteData = (id) => deleteDoc(doc(db, "lists", id));

export const updateData = (id, newFields) =>
  updateDoc(doc(db, "lists", id), newFields);
