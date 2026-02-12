# Boarding House Management System - Setup & Deployment Guide

## 📋 Table of Contents
1. [Firebase Setup](#firebase-setup)
2. [Configuration](#configuration)
3. [Local Testing](#local-testing)
4. [GitHub Pages Deployment](#github-pages-deployment)
5. [Firestore Database Structure](#firestore-database-structure)

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `boarding-house-management`
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Enable Email/Password Authentication

1. In Firebase Console, go to **"Build" → "Authentication"**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Enable the first toggle (Email/Password)
6. Click **"Save"**

### Step 3: Create Firestore Database

1. In Firebase Console, go to **"Build" → "Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose your Cloud Firestore location (closest to your users)
5. Click **"Enable"**

### Step 4: Configure Firestore Security Rules

1. In Firestore Database, go to **"Rules"** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     (request.auth.uid == userId || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Payments collection
    match /payments/{paymentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Bills collection
    match /bills/{billId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

3. Click **"Publish"**

### Step 5: Get Firebase Configuration

1. In Firebase Console, click the **gear icon** (⚙️) next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** (`</>`)
5. Register app with nickname: `boarding-house-web`
6. **Don't** check "Also set up Firebase Hosting"
7. Click **"Register app"**
8. Copy the `firebaseConfig` object

Example:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

---

## ⚙️ Configuration

### Update Firebase Config File

1. Open `js/firebase-config.js`
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",              // Replace with your apiKey
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",  // Replace with your authDomain
    projectId: "YOUR_PROJECT_ID",             // Replace with your projectId
    storageBucket: "YOUR_PROJECT_ID.appspot.com",   // Replace with your storageBucket
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // Replace with your messagingSenderId
    appId: "YOUR_APP_ID"                      // Replace with your appId
};
```

3. Save the file

---

## 🧪 Local Testing

### Option 1: Using Python (Recommended)

```bash
# Navigate to project folder
cd boarding-house-app

# Python 3
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000
```

Open browser: `http://localhost:8000`

### Option 2: Using Node.js

```bash
# Install http-server globally
npm install -g http-server

# Navigate to project folder
cd boarding-house-app

# Start server
http-server -p 8000
```

Open browser: `http://localhost:8000`

### Option 3: Using VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

---

## 🚀 GitHub Pages Deployment

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click **"New repository"**
3. Repository name: `boarding-house-management`
4. Select **"Public"**
5. Click **"Create repository"**

### Step 2: Push Code to GitHub

```bash
# Navigate to your project folder
cd boarding-house-app

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Boarding House Management System"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/boarding-house-management.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"**
3. Click **"Pages"** in the left sidebar
4. Under "Source", select **"main"** branch
5. Select **"/ (root)"** folder
6. Click **"Save"**
7. Wait 1-2 minutes for deployment

### Step 4: Access Your App

Your app will be available at:
```
https://YOUR_USERNAME.github.io/boarding-house-management/
```

### Step 5: Update Firebase Authorized Domains

1. Go to Firebase Console
2. Navigate to **"Authentication" → "Settings" → "Authorized domains"**
3. Click **"Add domain"**
4. Add: `YOUR_USERNAME.github.io`
5. Click **"Add"**

---

## 📊 Firestore Database Structure

### Collections

#### 1. **users**
```javascript
{
  userId: {
    name: "John Doe",
    email: "john@example.com",
    role: "member" | "admin",
    monthlyRent: 10000,
    createdAt: "2026-02-12T05:50:51.000Z",
    active: true
  }
}
```

#### 2. **payments**
```javascript
{
  paymentId: {
    userId: "user123",
    month: "2026-02",
    amount: 15000,
    status: "paid" | "unpaid" | "partial" | "pending",
    paidDate: "2026-02-12T05:50:51.000Z",
    createdAt: "2026-02-12T05:50:51.000Z"
  }
}
```

#### 3. **bills**
```javascript
{
  "2026-02": {
    month: "2026-02",
    electricity: 25000,
    water: 8000,
    updatedAt: "2026-02-12T05:50:51.000Z"
  }
}
```

---

## 👥 Initial Setup

### Create First Admin User

1. Open your deployed app
2. Click **"Register"**
3. Fill in details:
   - Name: Your Name
   - Email: admin@example.com
   - Password: (minimum 6 characters)
   - Role: **Admin**
4. Click **"Create Account"**

### Create Test Members

1. Login as admin
2. Click **"Manage Members"**
3. Add test members with:
   - Name
   - Email
   - Monthly Rent

---

## 🔧 Troubleshooting

### Issue: Firebase not initialized
**Solution:** Check that you've replaced all placeholder values in `firebase-config.js`

### Issue: Authentication not working
**Solution:** 
- Verify Email/Password is enabled in Firebase Console
- Check authorized domains include your GitHub Pages domain

### Issue: Firestore permission denied
**Solution:** 
- Verify Firestore rules are correctly set
- Make sure user is authenticated

### Issue: GitHub Pages shows 404
**Solution:**
- Wait 2-3 minutes after enabling Pages
- Check that `index.html` is in the root directory
- Verify branch and folder settings in GitHub Pages settings

---

## 📱 Features Overview

### Admin Features
- ✅ Add/Edit/Delete members
- ✅ Set monthly boarding fee per member
- ✅ Enter electricity and water bills
- ✅ View all payments
- ✅ Generate monthly reports
- ✅ See total outstanding amounts

### Member Features
- ✅ View payment history
- ✅ See monthly rent status
- ✅ View unpaid months
- ✅ Check remaining balance
- ✅ See electricity/water bill share
- ✅ Submit payment requests
- ✅ View total arrears

---

## 🎨 Customization

### Change Colors
Edit `css/styles.css` and modify CSS variables:
```css
:root {
    --primary-color: #4f46e5;
    --secondary-color: #06b6d4;
    --success-color: #10b981;
    --danger-color: #ef4444;
    --warning-color: #f59e0b;
}
```

### Modify Default Rent
Edit `js/auth.js` line 60:
```javascript
monthlyRent: role === 'member' ? 10000 : 0, // Change 10000 to your default
```

---

## 📞 Support

For issues or questions:
1. Check Firebase Console for errors
2. Check browser console (F12) for JavaScript errors
3. Verify all configuration steps were completed

---

## 📄 License

This project is open source and available for personal and commercial use.

---

**Created:** February 2026  
**Version:** 1.0.0
