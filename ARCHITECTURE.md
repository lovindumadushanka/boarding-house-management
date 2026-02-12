# System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐   │
│  │              │  │              │  │                        │   │
│  │  Login Page  │  │ Register Page│  │     Dashboard          │   │
│  │              │  │              │  │  ┌──────────────────┐  │   │
│  │ index.html   │  │register.html │  │  │   Admin View     │  │   │
│  │              │  │              │  │  │  - Manage Members│  │   │
│  │              │  │              │  │  │  - Set Bills     │  │   │
│  │              │  │              │  │  │  - View Payments │  │   │
│  │              │  │              │  │  │  - Reports       │  │   │
│  └──────────────┘  └──────────────┘  │  └──────────────────┘  │   │
│                                       │  ┌──────────────────┐  │   │
│                                       │  │  Member View     │  │   │
│                                       │  │  - Payment Info  │  │   │
│                                       │  │  - Submit Payment│  │   │
│                                       │  │  - View History  │  │   │
│                                       │  └──────────────────┘  │   │
│                                       │  dashboard.html        │   │
│                                       └────────────────────────┘   │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      APPLICATION LOGIC LAYER                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │
│  │                │  │                │  │                │        │
│  │ Authentication │  │   Dashboard    │  │     Modals     │        │
│  │     Logic      │  │     Logic      │  │     & Forms    │        │
│  │                │  │                │  │                │        │
│  │  - Login       │  │  - Load Data   │  │  - Add Member  │        │
│  │  - Register    │  │  - Calculate   │  │  - Edit Member │        │
│  │  - Logout      │  │  - Display     │  │  - Set Bills   │        │
│  │  - Auth State  │  │  - Role Check  │  │  - Payments    │        │
│  │                │  │                │  │  - Reports     │        │
│  │   auth.js      │  │ dashboard.js   │  │   modals.js    │        │
│  └────────────────┘  └────────────────┘  └────────────────┘        │
│                                                                       │
│  ┌────────────────────────────────────────────────────────┐         │
│  │          Firebase Configuration Module                  │         │
│  │          - Initialize Firebase                          │         │
│  │          - Auth Instance                                │         │
│  │          - Firestore Instance                           │         │
│  │          firebase-config.js                             │         │
│  └────────────────────────────────────────────────────────┘         │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      FIREBASE BACKEND LAYER                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────┐  ┌──────────────────────────────────────┐  │
│  │                    │  │                                      │  │
│  │     Firebase       │  │       Firestore Database             │  │
│  │  Authentication    │  │                                      │  │
│  │                    │  │  ┌────────────────────────────────┐ │  │
│  │  - Email/Password  │  │  │  Collection: users             │ │  │
│  │  - User Sessions   │  │  │  - userId                      │ │  │
│  │  - Security        │  │  │  - name, email, role           │ │  │
│  │                    │  │  │  - monthlyRent, active         │ │  │
│  │                    │  │  └────────────────────────────────┘ │  │
│  │                    │  │                                      │  │
│  │                    │  │  ┌────────────────────────────────┐ │  │
│  │                    │  │  │  Collection: payments          │ │  │
│  │                    │  │  │  - paymentId                   │ │  │
│  │                    │  │  │  - userId, month, amount       │ │  │
│  │                    │  │  │  - status, paidDate            │ │  │
│  │                    │  │  └────────────────────────────────┘ │  │
│  │                    │  │                                      │  │
│  │                    │  │  ┌────────────────────────────────┐ │  │
│  │                    │  │  │  Collection: bills             │ │  │
│  │                    │  │  │  - month (YYYY-MM)             │ │  │
│  │                    │  │  │  - electricity, water          │ │  │
│  │                    │  │  │  - updatedAt                   │ │  │
│  │                    │  │  └────────────────────────────────┘ │  │
│  │                    │  │                                      │  │
│  └────────────────────┘  └──────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         HOSTING LAYER                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│                         GitHub Pages                                 │
│              https://username.github.io/repo-name/                   │
│                                                                       │
│                    (or any static hosting service)                   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════
                            DATA FLOW
═══════════════════════════════════════════════════════════════════════

1. USER AUTHENTICATION FLOW:
   User → Login Page → auth.js → Firebase Auth → Dashboard

2. ADMIN WORKFLOW:
   Admin → Dashboard → Click "Manage Members" → modals.js → 
   Add Member Form → Submit → Firestore (users) → Refresh UI

3. BILLING WORKFLOW:
   Admin → Dashboard → Click "Manage Bills" → modals.js →
   Enter Bills → Submit → Firestore (bills) → Calculate Shares

4. PAYMENT WORKFLOW:
   Member → Dashboard → View Payment Info → Click "Make Payment" →
   modals.js → Submit Payment → Firestore (payments/pending) →
   Admin Reviews → Update Status → Firestore (payments/paid)

5. REPORT GENERATION:
   Admin → Dashboard → Click "Monthly Report" → modals.js →
   Query Firestore → Calculate Totals → Display Report


═══════════════════════════════════════════════════════════════════════
                        SECURITY LAYERS
═══════════════════════════════════════════════════════════════════════

Layer 1: Firebase Authentication
         - Email/Password verification
         - Session management
         - Token-based auth

Layer 2: Firestore Security Rules
         - Role-based access control
         - User can only read/write own data
         - Admin has elevated permissions

Layer 3: Frontend Route Protection
         - Auth state checking
         - Automatic redirects
         - Role verification


═══════════════════════════════════════════════════════════════════════
                    TECHNOLOGY STACK SUMMARY
═══════════════════════════════════════════════════════════════════════

Frontend:
  - HTML5 (Structure)
  - CSS3 + Tailwind CSS (Styling)
  - JavaScript ES6+ (Logic)

Backend:
  - Firebase Authentication (User Management)
  - Firebase Firestore (NoSQL Database)

Hosting:
  - GitHub Pages (Static Hosting)
  - CDN for Firebase SDKs
  - CDN for Tailwind CSS

Development:
  - No build tools required
  - No npm/node_modules
  - Pure static files
  - Version control with Git


═══════════════════════════════════════════════════════════════════════
                      BILLING CALCULATION LOGIC
═══════════════════════════════════════════════════════════════════════

Step 1: Admin enters monthly bills
        - Electricity: Rs. 25,000
        - Water: Rs. 8,000

Step 2: System counts active members
        - Query Firestore for users where active = true
        - Count = 5 members

Step 3: Calculate per-member share
        - Electricity share = 25,000 ÷ 5 = Rs. 5,000
        - Water share = 8,000 ÷ 5 = Rs. 1,600

Step 4: Calculate total for each member
        - Member A: Rent (10,000) + Electricity (5,000) + Water (1,600)
        - Total = Rs. 16,600

Step 5: Create/Update payment records
        - Create payment document in Firestore
        - Status: "unpaid"
        - Amount: Rs. 16,600


═══════════════════════════════════════════════════════════════════════
                        DEPLOYMENT ARCHITECTURE
═══════════════════════════════════════════════════════════════════════

Development:
  Local Machine → Python/Node HTTP Server → localhost:8000

Version Control:
  Local Files → Git → GitHub Repository

Production:
  GitHub Repository → GitHub Pages → Public URL
                   ↓
              Firebase Backend
                   ↓
              Real-time Data Sync


═══════════════════════════════════════════════════════════════════════
                         FILE DEPENDENCIES
═══════════════════════════════════════════════════════════════════════

index.html
  ├── css/styles.css
  ├── js/firebase-config.js
  └── js/auth.js

register.html
  ├── css/styles.css
  ├── js/firebase-config.js
  └── js/auth.js

dashboard.html
  ├── css/styles.css
  ├── js/firebase-config.js
  ├── js/dashboard.js
  └── js/modals.js (loaded by dashboard.js)

External Dependencies (CDN):
  - Tailwind CSS: https://cdn.tailwindcss.com
  - Firebase SDK: https://www.gstatic.com/firebasejs/10.7.1/


═══════════════════════════════════════════════════════════════════════
                    SCALABILITY CONSIDERATIONS
═══════════════════════════════════════════════════════════════════════

Current Capacity:
  - Members: 10-50 (optimal)
  - Firestore Reads: 50,000/day (free tier)
  - Firestore Writes: 20,000/day (free tier)
  - Storage: 1 GB (free tier)

To Scale Beyond:
  - Implement pagination for member lists
  - Add caching for frequently accessed data
  - Upgrade to Firebase Blaze plan
  - Consider Cloud Functions for complex operations
  - Implement data archiving for old records


═══════════════════════════════════════════════════════════════════════
