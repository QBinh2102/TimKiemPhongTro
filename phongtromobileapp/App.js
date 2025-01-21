import Home from './components/Home/Home';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getDatabase, ref, set } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyAjAiJfAaclDPjK2B5M9sBUud4phIpb9ow",
  authDomain: "timkiemphongtro-e5cc6.firebaseapp.com",
  databaseURL: "https://timkiemphongtro-e5cc6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "timkiemphongtro-e5cc6",
  storageBucket: "timkiemphongtro-e5cc6.firebasestorage.app",
  messagingSenderId: "525846725068",
  appId: "1:525846725068:web:dbbe97f76dff3af3de5d69",
  measurementId: "G-XTCXJFP2NY"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function guiDuLieu() {
  const db = getDatabase();
  set(ref(db, 'Dia chi gui len'), {
    tenBien: "gia tri gui len"  });
}


export default function App() {
  return (
      <Home />
  );
}