// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAALYOEpP92tXPCs2_f9AkOLrpUl0QjRyg',
  authDomain: 'mo-coffee-tea.firebaseapp.com',
  projectId: 'mo-coffee-tea',
  storageBucket: 'mo-coffee-tea.appspot.com',
  messagingSenderId: '318890858088',
  appId: '1:318890858088:web:46af4437d20ac8dd8a4ddd',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
