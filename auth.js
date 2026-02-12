// Authentication Logic
import { auth, db } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
    doc,
    setDoc,
    getDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Check if user is already logged in
onAuthStateChanged(auth, async (user) => {
    const currentPage = window.location.pathname.split('/').pop();

    if (user) {
        // User is signed in
        if (currentPage === 'index.html' || currentPage === 'register.html' || currentPage === '') {
            window.location.href = 'dashboard.html';
        }
    } else {
        // User is signed out
        if (currentPage === 'dashboard.html') {
            window.location.href = 'index.html';
        }
    }
});

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorDiv = document.getElementById('loginError');
        const successDiv = document.getElementById('loginSuccess');

        errorDiv.classList.add('hidden');
        successDiv.classList.add('hidden');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            successDiv.textContent = 'Login successful! Redirecting...';
            successDiv.classList.remove('hidden');

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);

        } catch (error) {
            console.error('Login error:', error);
            errorDiv.textContent = getErrorMessage(error.code);
            errorDiv.classList.remove('hidden');
        }
    });
}

// Register Form Handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const role = document.getElementById('registerRole').value;
        const errorDiv = document.getElementById('registerError');
        const successDiv = document.getElementById('registerSuccess');

        errorDiv.classList.add('hidden');
        successDiv.classList.add('hidden');

        try {
            // Create user account
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create user document in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name: name,
                email: email,
                role: role,
                monthlyRent: role === 'member' ? 10000 : 0, // Default rent for members
                createdAt: new Date().toISOString(),
                active: true
            });

            successDiv.textContent = 'Account created successfully! Redirecting...';
            successDiv.classList.remove('hidden');

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            console.error('Registration error:', error);
            errorDiv.textContent = getErrorMessage(error.code);
            errorDiv.classList.remove('hidden');
        }
    });
}

// Helper function to get user-friendly error messages
function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please login instead.';
        case 'auth/invalid-email':
            return 'Invalid email address.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        default:
            return 'An error occurred. Please try again.';
    }
}
