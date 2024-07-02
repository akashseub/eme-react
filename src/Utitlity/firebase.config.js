// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4UaIj34VIosoY5TfA6qB4yElzMRikkwI",
  authDomain: "emeisltd-aae83.firebaseapp.com",
  projectId: "emeisltd-aae83",
  storageBucket: "emeisltd-aae83.appspot.com",
  messagingSenderId: "237367844238",
  appId: "1:237367844238:web:165cbeb72050d5e24d58df",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export default auth;
