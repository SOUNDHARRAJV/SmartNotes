import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDJzqz3jPoKkqIfp9EFJ_OorZgdmSECiMc",
  authDomain: "smartnotes-976f0.firebaseapp.com",
  projectId: "smartnotes-976f0",
  storageBucket: "smartnotes-976f0.appspot.com",  
  messagingSenderId: "1032890078530",
  appId: "1:1032890078530:web:ed890dae4afc15b5b8e4db"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
