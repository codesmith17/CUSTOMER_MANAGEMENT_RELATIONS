// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBsBnDzdgOFpFtjaDR0TR1DCjtCOJfm4Fo",
    authDomain: "xenoproject-3abcc.firebaseapp.com",
    projectId: "xenoproject-3abcc",
    storageBucket: "xenoproject-3abcc.appspot.com",
    messagingSenderId: "367087316592",
    appId: "1:367087316592:web:449603023a64ee44608eb5"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();

// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({
    prompt: "select_account "
});
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);