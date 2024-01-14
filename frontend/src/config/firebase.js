import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA_KyZslgPIGS7uUW1J5uLR_EvTf31j-bc",
  authDomain: "chat-message-4860b.firebaseapp.com",
  projectId: "chat-message-4860b",
  storageBucket: "chat-message-4860b.appspot.com",
  messagingSenderId: "166646829529",
  appId: "1:166646829529:web:3426db23ac4ccd27fe09c8",
  measurementId: "G-3L6Y85YP36"
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export default auth;