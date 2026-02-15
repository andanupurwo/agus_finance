// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Determine which Firebase config to use based on environment variable
export const environment = import.meta.env.VITE_ENVIRONMENT || "prod";

const config = {
  prod: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY_PROD,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_PROD,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_PROD,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_PROD,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_PROD,
    appId: import.meta.env.VITE_FIREBASE_APP_ID_PROD
  },
  dev: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY_DEV,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_DEV,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_DEV,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_DEV,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_DEV,
    appId: import.meta.env.VITE_FIREBASE_APP_ID_DEV
  }
};

// Your web app's Firebase configuration
export const firebaseConfig = config[environment];

console.log(`Firebase initialized with environment: ${environment}`);
// Debug log to verify config (masking sensitive data)
console.log('Firebase Config loaded:', {
  projectId: firebaseConfig?.projectId,
  authDomain: firebaseConfig?.authDomain,
  hasApiKey: !!firebaseConfig?.apiKey
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Enable Google Sign-In popup instead of redirect
googleProvider.setCustomParameters({
  prompt: 'select_account'
});


// If you want to use emulators, uncomment the following lines and configure them manually
// if (window.location.hostname === "localhost") {
//   connectFirestoreEmulator(db, 'localhost', 8080);
//   connectAuthEmulator(auth, "http://localhost:9099");
// }

