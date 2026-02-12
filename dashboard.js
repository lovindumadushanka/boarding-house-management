// Dashboard Logic
import { auth, db } from './firebase-config.js';
import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let currentUser = null;
let currentUserData = null;

// Initialize Dashboard
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        await loadUserData();
        await initializeDashboard();
    } else {
        window.location.href = 'index.html';
    }
});

// Load current user data
async function loadUserData() {
    try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
            currentUserData = { id: userDoc.id, ...userDoc.data() };

            // Update UI with user info
            document.getElementById('userNameDisplay').textContent = currentUserData.name;
            const roleBadge = document.getElementById('userRoleBadge');
            roleBadge.textContent = currentUserData.role.toUpperCase();
            roleBadge.className = currentUserData.role === 'admin'
                ? 'px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800'
                : 'px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Initialize dashboard based on role
async function initializeDashboard() {
    if (currentUserData.role === 'admin') {
        document.getElementById('adminSection').classList.remove('hidden');
        await loadAdminDashboard();
    } else {
        document.getElementById('memberSection').classList.remove('hidden');
        await loadMemberDashboard();
    }

    await updateSummaryCards();
}

// Load Admin Dashboard
async function loadAdminDashboard() {
    // Load all members
    await loadAllMembers();

    // Event listeners for admin buttons
    document.getElementById('manageMembersBtn').addEventListener('click', showManageMembersModal);
    document.getElementById('manageBillsBtn').addEventListener('click', showManageBillsModal);
    document.getElementById('viewPaymentsBtn').addEventListener('click', showAllPaymentsModal);
    document.getElementById('monthlyReportBtn').addEventListener('click', showMonthlyReportModal);
}

// Load Member Dashboard
async function loadMemberDashboard() {
    await loadMemberPaymentInfo();
    await loadPaymentHistory();

    document.getElementById('makePaymentBtn').addEventListener('click', showMakePaymentModal);
}

// Load all members (Admin)
async function loadAllMembers() {
    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const membersList = document.getElementById('membersList');
        membersList.innerHTML = '';

        usersSnapshot.forEach((doc) => {
            const member = { id: doc.id, ...doc.data() };
            if (member.role === 'member') {
                const memberCard = createMemberCard(member);
                membersList.appendChild(memberCard);
            }
        });
    } catch (error) {
        console.error('Error loading members:', error);
    }
}

// Create member card element
function createMemberCard(member) {
    const div = document.createElement('div');
    div.className = 'bg-gray-50 p-4 rounded-lg flex justify-between items-center card-hover';
    div.innerHTML = `
        <div>
            <p class="font-semibold text-gray-800">${member.name}</p>
            <p class="text-sm text-gray-600">${member.email}</p>
            <p class="text-sm text-indigo-600 font-medium mt-1">Monthly Rent: Rs. ${member.monthlyRent || 0}</p>
        </div>
        <div class="flex space-x-2">
            <button onclick="editMember('${member.id}')" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
                Edit
            </button>
            <button onclick="deleteMember('${member.id}')" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">
                Delete
            </button>
        </div>
    `;
    return div;
}

// Load member payment info
async function loadMemberPaymentInfo() {
    try {
        // Get current month bills
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const billsDoc = await getDoc(doc(db, 'bills', currentMonth));

        let electricityShare = 0;
        let waterShare = 0;

        if (billsDoc.exists()) {
            const billData = billsDoc.data();
            const activeMembers = await getActiveMembersCount();
            electricityShare = activeMembers > 0 ? Math.round(billData.electricity / activeMembers) : 0;
            waterShare = activeMembers > 0 ? Math.round(billData.water / activeMembers) : 0;
        }

        // Update UI
        document.getElementById('memberRent').textContent = `Rs. ${currentUserData.monthlyRent || 0}`;
        document.getElementById('memberElectricity').textContent = `Rs. ${electricityShare}`;
        document.getElementById('memberWater').textContent = `Rs. ${waterShare}`;

        // Calculate arrears
        const arrears = await calculateMemberArrears(currentUser.uid);
        document.getElementById('memberArrears').textContent = `Rs. ${arrears}`;

    } catch (error) {
        console.error('Error loading payment info:', error);
    }
}

// Get active members count
async function getActiveMembersCount() {
    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        let count = 0;
        usersSnapshot.forEach((doc) => {
            const user = doc.data();
            if (user.role === 'member' && user.active !== false) {
                count++;
            }
        });
        return count;
    } catch (error) {
        console.error('Error counting members:', error);
        return 0;
    }
}

// Calculate member arrears
async function calculateMemberArrears(userId) {
    try {
        const paymentsQuery = query(
            collection(db, 'payments'),
            where('userId', '==', userId),
            where('status', '==', 'unpaid')
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);

        let totalArrears = 0;
        paymentsSnapshot.forEach((doc) => {
            const payment = doc.data();
            totalArrears += payment.amount || 0;
        });

        return totalArrears;
    } catch (error) {
        console.error('Error calculating arrears:', error);
        return 0;
    }
}

// Load payment history
async function loadPaymentHistory() {
    try {
        const paymentsQuery = query(
            collection(db, 'payments'),
            where('userId', '==', currentUser.uid),
            orderBy('month', 'desc')
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);

        const historyDiv = document.getElementById('paymentHistory');
        historyDiv.innerHTML = '';

        if (paymentsSnapshot.empty) {
            historyDiv.innerHTML = '<p class="text-gray-500 text-center py-4">No payment history yet</p>';
            return;
        }

        paymentsSnapshot.forEach((doc) => {
            const payment = { id: doc.id, ...doc.data() };
            const paymentCard = createPaymentCard(payment);
            historyDiv.appendChild(paymentCard);
        });
    } catch (error) {
        console.error('Error loading payment history:', error);
    }
}

// Create payment card element
function createPaymentCard(payment) {
    const div = document.createElement('div');
    div.className = 'bg-gray-50 p-4 rounded-lg';

    const statusClass = payment.status === 'paid' ? 'badge-paid' :
        payment.status === 'partial' ? 'badge-partial' : 'badge-unpaid';

    div.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <div>
                <p class="font-semibold text-gray-800">${formatMonth(payment.month)}</p>
                <p class="text-sm text-gray-600">Amount: Rs. ${payment.amount}</p>
            </div>
            <span class="${statusClass}">${payment.status.toUpperCase()}</span>
        </div>
        ${payment.paidDate ? `<p class="text-xs text-gray-500">Paid on: ${new Date(payment.paidDate).toLocaleDateString()}</p>` : ''}
    `;
    return div;
}

// Update summary cards
async function updateSummaryCards() {
    try {
        let totalPaid = 0;
        let totalDue = 0;
        let thisMonthStatus = 'Unpaid';

        if (currentUserData.role === 'admin') {
            // Admin sees all payments
            const paymentsSnapshot = await getDocs(collection(db, 'payments'));
            paymentsSnapshot.forEach((doc) => {
                const payment = doc.data();
                if (payment.status === 'paid') {
                    totalPaid += payment.amount || 0;
                } else {
                    totalDue += payment.amount || 0;
                }
            });
        } else {
            // Member sees own payments
            const paymentsQuery = query(
                collection(db, 'payments'),
                where('userId', '==', currentUser.uid)
            );
            const paymentsSnapshot = await getDocs(paymentsQuery);

            const currentMonth = new Date().toISOString().slice(0, 7);

            paymentsSnapshot.forEach((doc) => {
                const payment = doc.data();
                if (payment.status === 'paid') {
                    totalPaid += payment.amount || 0;
                } else {
                    totalDue += payment.amount || 0;
                }

                if (payment.month === currentMonth) {
                    thisMonthStatus = payment.status === 'paid' ? 'Paid ✅' : 'Unpaid ❌';
                }
            });
        }

        document.getElementById('totalPaid').textContent = `Rs. ${totalPaid.toLocaleString()}`;
        document.getElementById('totalDue').textContent = `Rs. ${totalDue.toLocaleString()}`;
        document.getElementById('thisMonthStatus').textContent = thisMonthStatus;

    } catch (error) {
        console.error('Error updating summary cards:', error);
    }
}

// Format month string
function formatMonth(monthStr) {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
});

// Modal Functions (will be implemented in modals.js)
function showManageMembersModal() {
    window.showManageMembersModal();
}

function showManageBillsModal() {
    window.showManageBillsModal();
}

function showAllPaymentsModal() {
    window.showAllPaymentsModal();
}

function showMonthlyReportModal() {
    window.showMonthlyReportModal();
}

function showMakePaymentModal() {
    window.showMakePaymentModal();
}

// Make functions globally accessible
window.editMember = async function (memberId) {
    window.editMemberModal(memberId);
};

window.deleteMember = async function (memberId) {
    if (confirm('Are you sure you want to delete this member?')) {
        try {
            await deleteDoc(doc(db, 'users', memberId));
            await loadAllMembers();
            alert('Member deleted successfully');
        } catch (error) {
            console.error('Error deleting member:', error);
            alert('Error deleting member');
        }
    }
};

// Export for use in modals
window.currentUser = currentUser;
window.currentUserData = currentUserData;
window.loadAllMembers = loadAllMembers;
window.updateSummaryCards = updateSummaryCards;
window.loadPaymentHistory = loadPaymentHistory;
window.loadMemberPaymentInfo = loadMemberPaymentInfo;
