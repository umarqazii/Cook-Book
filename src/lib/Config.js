// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyACNVkFAoDfp3XpUSoXD-r8_gccopR2vZw",
  authDomain: "cookbookuploads.firebaseapp.com",
  projectId: "cookbookuploads",
  storageBucket: "cookbookuploads.appspot.com",
  messagingSenderId: "270904904627",
  appId: "1:270904904627:web:13879837eaca0eb5fe99c6"
};


const app = initializeApp(firebaseConfig);
export const imageDB = getStorage(app)