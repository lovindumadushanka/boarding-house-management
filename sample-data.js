// Sample Data Initialization Script
// This script helps you set up initial test data in your Firestore database
// Run this in your browser console after logging in as admin

import { db } from './firebase-config.js';
import { collection, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Sample members data
const sampleMembers = [
    {
        id: 'member_001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'member',
        monthlyRent: 10000,
        active: true,
        createdAt: new Date().toISOString()
    },
    {
        id: 'member_002',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'member',
        monthlyRent: 12000,
        active: true,
        createdAt: new Date().toISOString()
    },
    {
        id: 'member_003',
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        role: 'member',
        monthlyRent: 10000,
        active: true,
        createdAt: new Date().toISOString()
    },
    {
        id: 'member_004',
        name: 'Alice Williams',
        email: 'alice.williams@example.com',
        role: 'member',
        monthlyRent: 11000,
        active: true,
        createdAt: new Date().toISOString()
    },
    {
        id: 'member_005',
        name: 'Charlie Brown',
        email: 'charlie.brown@example.com',
        role: 'member',
        monthlyRent: 10000,
        active: false,
        createdAt: new Date().toISOString()
    }
];

// Sample bills data for last 3 months
const sampleBills = [
    {
        month: '2025-12',
        electricity: 22000,
        water: 7500,
        updatedAt: new Date('2025-12-01').toISOString()
    },
    {
        month: '2026-01',
        electricity: 25000,
        water: 8000,
        updatedAt: new Date('2026-01-01').toISOString()
    },
    {
        month: '2026-02',
        electricity: 23500,
        water: 7800,
        updatedAt: new Date('2026-02-01').toISOString()
    }
];

// Sample payments data
const samplePayments = [
    // December 2025 - All paid
    {
        id: 'payment_member_001_2025-12',
        userId: 'member_001',
        month: '2025-12',
        amount: 15500,
        status: 'paid',
        paidDate: '2025-12-05T10:30:00.000Z',
        createdAt: '2025-12-01T08:00:00.000Z'
    },
    {
        id: 'payment_member_002_2025-12',
        userId: 'member_002',
        month: '2025-12',
        amount: 17500,
        status: 'paid',
        paidDate: '2025-12-06T14:20:00.000Z',
        createdAt: '2025-12-01T08:00:00.000Z'
    },
    {
        id: 'payment_member_003_2025-12',
        userId: 'member_003',
        month: '2025-12',
        amount: 15500,
        status: 'paid',
        paidDate: '2025-12-04T09:15:00.000Z',
        createdAt: '2025-12-01T08:00:00.000Z'
    },
    {
        id: 'payment_member_004_2025-12',
        userId: 'member_004',
        month: '2025-12',
        amount: 16500,
        status: 'paid',
        paidDate: '2025-12-07T11:45:00.000Z',
        createdAt: '2025-12-01T08:00:00.000Z'
    },

    // January 2026 - Mixed status
    {
        id: 'payment_member_001_2026-01',
        userId: 'member_001',
        month: '2026-01',
        amount: 16250,
        status: 'paid',
        paidDate: '2026-01-05T10:30:00.000Z',
        createdAt: '2026-01-01T08:00:00.000Z'
    },
    {
        id: 'payment_member_002_2026-01',
        userId: 'member_002',
        month: '2026-01',
        amount: 18250,
        status: 'paid',
        paidDate: '2026-01-06T14:20:00.000Z',
        createdAt: '2026-01-01T08:00:00.000Z'
    },
    {
        id: 'payment_member_003_2026-01',
        userId: 'member_003',
        month: '2026-01',
        amount: 16250,
        status: 'partial',
        createdAt: '2026-01-01T08:00:00.000Z'
    },
    {
        id: 'payment_member_004_2026-01',
        userId: 'member_004',
        month: '2026-01',
        amount: 17250,
        status: 'unpaid',
        createdAt: '2026-01-01T08:00:00.000Z'
    },

    // February 2026 - Current month
    {
        id: 'payment_member_001_2026-02',
        userId: 'member_001',
        month: '2026-02',
        amount: 15950,
        status: 'pending',
        createdAt: '2026-02-01T08:00:00.000Z'
    },
    {
        id: 'payment_member_002_2026-02',
        userId: 'member_002',
        month: '2026-02',
        amount: 17950,
        status: 'paid',
        paidDate: '2026-02-03T10:00:00.000Z',
        createdAt: '2026-02-01T08:00:00.000Z'
    },
    {
        id: 'payment_member_003_2026-02',
        userId: 'member_003',
        month: '2026-02',
        amount: 15950,
        status: 'unpaid',
        createdAt: '2026-02-01T08:00:00.000Z'
    },
    {
        id: 'payment_member_004_2026-02',
        userId: 'member_004',
        month: '2026-02',
        amount: 16950,
        status: 'unpaid',
        createdAt: '2026-02-01T08:00:00.000Z'
    }
];

// Function to initialize sample data
export async function initializeSampleData() {
    console.log('Starting sample data initialization...');

    try {
        // Add sample members
        console.log('Adding sample members...');
        for (const member of sampleMembers) {
            await setDoc(doc(db, 'users', member.id), member);
            console.log(`✓ Added member: ${member.name}`);
        }

        // Add sample bills
        console.log('Adding sample bills...');
        for (const bill of sampleBills) {
            await setDoc(doc(db, 'bills', bill.month), bill);
            console.log(`✓ Added bill for: ${bill.month}`);
        }

        // Add sample payments
        console.log('Adding sample payments...');
        for (const payment of samplePayments) {
            await setDoc(doc(db, 'payments', payment.id), payment);
            console.log(`✓ Added payment: ${payment.id}`);
        }

        console.log('✅ Sample data initialization complete!');
        console.log('You can now refresh the dashboard to see the data.');

        return {
            success: true,
            message: 'Sample data added successfully'
        };

    } catch (error) {
        console.error('❌ Error initializing sample data:', error);
        return {
            success: false,
            message: error.message
        };
    }
}

// Function to clear all sample data
export async function clearSampleData() {
    console.log('⚠️ This will delete all sample data!');
    console.log('To implement clearing, you would need to delete documents from Firestore.');
    console.log('This is left as an exercise to prevent accidental data deletion.');
}

// Make function available globally for console use
window.initializeSampleData = initializeSampleData;
window.clearSampleData = clearSampleData;

// Instructions
console.log(`
═══════════════════════════════════════════════════════════
  SAMPLE DATA INITIALIZATION SCRIPT
═══════════════════════════════════════════════════════════

To add sample data to your database:

1. Make sure you're logged in as an admin
2. Open browser console (F12)
3. Run: initializeSampleData()

This will add:
- 5 sample members (4 active, 1 inactive)
- Bills for last 3 months
- Payment records with various statuses

Note: This is for testing purposes only!

═══════════════════════════════════════════════════════════
`);
