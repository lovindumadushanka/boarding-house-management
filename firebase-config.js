// Firebase Configuration
// IMPORTANT: Replace these values with your own Firebase project credentials

const firebaseConfig = {
     apiKey: "AIzaSyBPhydaY4KUHDlaWbM-B1xCatXKg61Nx28",
    authDomain: "boarding-house-managemen-58dc4.firebaseapp.com",
    projectId: "boarding-house-managemen-58dc4",
    storageBucket: "boarding-house-managemen-58dc4.firebasestorage.app",
    messagingSenderId: "572772820666",
    appId: "1:572772820666:web:b8bb5be8968b4739994483"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log('Firebase initialized successfully');
