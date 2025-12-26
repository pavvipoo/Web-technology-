import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyForDevelopment_ReplaceWithYours",
  authDomain: "replit-github-explorer.firebaseapp.com",
  projectId: "replit-github-explorer",
  storageBucket: "replit-github-explorer.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
};

const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
