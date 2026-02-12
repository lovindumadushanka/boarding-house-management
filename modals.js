// Modal Management and Forms
import { db, auth } from './firebase-config.js';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    where
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Create modal backdrop
function createModal(title, content) {
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = `
        <div class="modal-backdrop" id="currentModal">
            <div class="modal-content">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl font-bold text-gray-800">${title}</h3>
                    <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                ${content}
            </div>
        </div>
    `;
}

// Close modal
window.closeModal = function () {
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = '';
};

// Manage Members Modal
window.showManageMembersModal = function () {
    const content = `
        <form id="addMemberForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Member Name</label>
                <input type="text" id="newMemberName" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" id="newMemberEmail" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Monthly Rent (Rs.)</label>
                <input type="number" id="newMemberRent" required min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
            </div>
            <button type="submit" class="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold">
                Add Member
            </button>
        </form>
        <div id="addMemberMessage" class="hidden mt-4 p-3 rounded-lg text-sm"></div>
    `;

    createModal('Add New Member', content);

    document.getElementById('addMemberForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await addNewMember();
    });
};

// Add new member
async function addNewMember() {
    const name = document.getElementById('newMemberName').value;
    const email = document.getElementById('newMemberEmail').value;
    const rent = parseInt(document.getElementById('newMemberRent').value);
    const messageDiv = document.getElementById('addMemberMessage');

    try {
        // Note: In a real app, you'd create the auth account too
        // For now, we'll just create the Firestore document
        const newMemberId = 'member_' + Date.now();

        await setDoc(doc(db, 'users', newMemberId), {
            name: name,
            email: email,
            role: 'member',
            monthlyRent: rent,
            createdAt: new Date().toISOString(),
            active: true
        });

        messageDiv.className = 'mt-4 p-3 rounded-lg text-sm bg-green-50 border border-green-200 text-green-700';
        messageDiv.textContent = 'Member added successfully!';
        messageDiv.classList.remove('hidden');

        setTimeout(() => {
            closeModal();
            window.loadAllMembers();
        }, 1500);

    } catch (error) {
        console.error('Error adding member:', error);
        messageDiv.className = 'mt-4 p-3 rounded-lg text-sm bg-red-50 border border-red-200 text-red-700';
        messageDiv.textContent = 'Error adding member. Please try again.';
        messageDiv.classList.remove('hidden');
    }
}

// Edit Member Modal
window.editMemberModal = async function (memberId) {
    try {
        const memberDoc = await getDoc(doc(db, 'users', memberId));
        const member = memberDoc.data();

        const content = `
            <form id="editMemberForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Member Name</label>
                    <input type="text" id="editMemberName" value="${member.name}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Monthly Rent (Rs.)</label>
                    <input type="number" id="editMemberRent" value="${member.monthlyRent || 0}" required min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select id="editMemberStatus" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                        <option value="true" ${member.active !== false ? 'selected' : ''}>Active</option>
                        <option value="false" ${member.active === false ? 'selected' : ''}>Inactive</option>
                    </select>
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
                    Update Member
                </button>
            </form>
            <div id="editMemberMessage" class="hidden mt-4 p-3 rounded-lg text-sm"></div>
        `;

        createModal('Edit Member', content);

        document.getElementById('editMemberForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await updateMember(memberId);
        });

    } catch (error) {
        console.error('Error loading member:', error);
    }
};

// Update member
async function updateMember(memberId) {
    const name = document.getElementById('editMemberName').value;
    const rent = parseInt(document.getElementById('editMemberRent').value);
    const active = document.getElementById('editMemberStatus').value === 'true';
    const messageDiv = document.getElementById('editMemberMessage');

    try {
        await updateDoc(doc(db, 'users', memberId), {
            name: name,
            monthlyRent: rent,
            active: active
        });

        messageDiv.className = 'mt-4 p-3 rounded-lg text-sm bg-green-50 border border-green-200 text-green-700';
        messageDiv.textContent = 'Member updated successfully!';
        messageDiv.classList.remove('hidden');

        setTimeout(() => {
            closeModal();
            window.loadAllMembers();
        }, 1500);

    } catch (error) {
        console.error('Error updating member:', error);
        messageDiv.className = 'mt-4 p-3 rounded-lg text-sm bg-red-50 border border-red-200 text-red-700';
        messageDiv.textContent = 'Error updating member. Please try again.';
        messageDiv.classList.remove('hidden');
    }
}

// Manage Bills Modal
window.showManageBillsModal = function () {
    const currentMonth = new Date().toISOString().slice(0, 7);

    const content = `
        <form id="manageBillsForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <input type="month" id="billMonth" value="${currentMonth}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Electricity Bill (Rs.)</label>
                <input type="number" id="billElectricity" required min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="0">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Water Bill (Rs.)</label>
                <input type="number" id="billWater" required min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="0">
            </div>
            <button type="submit" class="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold">
                Save Bills
            </button>
        </form>
        <div id="billMessage" class="hidden mt-4 p-3 rounded-lg text-sm"></div>
    `;

    createModal('Manage Monthly Bills', content);

    // Load existing bills if any
    loadExistingBills(currentMonth);

    document.getElementById('manageBillsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveBills();
    });
};

// Load existing bills
async function loadExistingBills(month) {
    try {
        const billDoc = await getDoc(doc(db, 'bills', month));
        if (billDoc.exists()) {
            const bill = billDoc.data();
            document.getElementById('billElectricity').value = bill.electricity || 0;
            document.getElementById('billWater').value = bill.water || 0;
        }
    } catch (error) {
        console.error('Error loading bills:', error);
    }
}

// Save bills
async function saveBills() {
    const month = document.getElementById('billMonth').value;
    const electricity = parseInt(document.getElementById('billElectricity').value);
    const water = parseInt(document.getElementById('billWater').value);
    const messageDiv = document.getElementById('billMessage');

    try {
        await setDoc(doc(db, 'bills', month), {
            month: month,
            electricity: electricity,
            water: water,
            updatedAt: new Date().toISOString()
        });

        messageDiv.className = 'mt-4 p-3 rounded-lg text-sm bg-green-50 border border-green-200 text-green-700';
        messageDiv.textContent = 'Bills saved successfully!';
        messageDiv.classList.remove('hidden');

        setTimeout(() => {
            closeModal();
        }, 1500);

    } catch (error) {
        console.error('Error saving bills:', error);
        messageDiv.className = 'mt-4 p-3 rounded-lg text-sm bg-red-50 border border-red-200 text-red-700';
        messageDiv.textContent = 'Error saving bills. Please try again.';
        messageDiv.classList.remove('hidden');
    }
}

// View All Payments Modal
window.showAllPaymentsModal = async function () {
    try {
        const paymentsSnapshot = await getDocs(collection(db, 'payments'));
        const usersSnapshot = await getDocs(collection(db, 'users'));

        // Create user map
        const userMap = {};
        usersSnapshot.forEach((doc) => {
            userMap[doc.id] = doc.data().name;
        });

        let tableRows = '';
        paymentsSnapshot.forEach((doc) => {
            const payment = { id: doc.id, ...doc.data() };
            const userName = userMap[payment.userId] || 'Unknown';
            const statusClass = payment.status === 'paid' ? 'badge-paid' :
                payment.status === 'partial' ? 'badge-partial' : 'badge-unpaid';

            tableRows += `
                <tr>
                    <td>${userName}</td>
                    <td>${formatMonth(payment.month)}</td>
                    <td>Rs. ${payment.amount}</td>
                    <td><span class="${statusClass}">${payment.status.toUpperCase()}</span></td>
                    <td>${payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '-'}</td>
                </tr>
            `;
        });

        const content = `
            <div class="overflow-x-auto">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>Member</th>
                            <th>Month</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Paid Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows || '<tr><td colspan="5" class="text-center text-gray-500">No payments found</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;

        createModal('All Payments', content);

    } catch (error) {
        console.error('Error loading payments:', error);
    }
};

// Monthly Report Modal
window.showMonthlyReportModal = async function () {
    const currentMonth = new Date().toISOString().slice(0, 7);

    try {
        const paymentsQuery = query(
            collection(db, 'payments'),
            where('month', '==', currentMonth)
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);

        let totalExpected = 0;
        let totalPaid = 0;
        let totalDue = 0;

        paymentsSnapshot.forEach((doc) => {
            const payment = doc.data();
            totalExpected += payment.amount || 0;
            if (payment.status === 'paid') {
                totalPaid += payment.amount || 0;
            } else {
                totalDue += payment.amount || 0;
            }
        });

        const billDoc = await getDoc(doc(db, 'bills', currentMonth));
        let electricity = 0;
        let water = 0;

        if (billDoc.exists()) {
            const bill = billDoc.data();
            electricity = bill.electricity || 0;
            water = bill.water || 0;
        }

        const content = `
            <div class="space-y-4">
                <div class="bg-blue-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600">Month</p>
                    <p class="text-xl font-bold text-blue-600">${formatMonth(currentMonth)}</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-green-50 p-4 rounded-lg">
                        <p class="text-sm text-gray-600">Total Expected</p>
                        <p class="text-xl font-bold text-green-600">Rs. ${totalExpected.toLocaleString()}</p>
                    </div>
                    <div class="bg-emerald-50 p-4 rounded-lg">
                        <p class="text-sm text-gray-600">Total Paid</p>
                        <p class="text-xl font-bold text-emerald-600">Rs. ${totalPaid.toLocaleString()}</p>
                    </div>
                    <div class="bg-red-50 p-4 rounded-lg">
                        <p class="text-sm text-gray-600">Total Due</p>
                        <p class="text-xl font-bold text-red-600">Rs. ${totalDue.toLocaleString()}</p>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-lg">
                        <p class="text-sm text-gray-600">Collection Rate</p>
                        <p class="text-xl font-bold text-purple-600">${totalExpected > 0 ? Math.round((totalPaid / totalExpected) * 100) : 0}%</p>
                    </div>
                </div>
                
                <div class="border-t pt-4">
                    <h4 class="font-semibold text-gray-800 mb-3">Utility Bills</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-yellow-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-600">Electricity</p>
                            <p class="text-xl font-bold text-yellow-600">Rs. ${electricity.toLocaleString()}</p>
                        </div>
                        <div class="bg-cyan-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-600">Water</p>
                            <p class="text-xl font-bold text-cyan-600">Rs. ${water.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        createModal('Monthly Report', content);

    } catch (error) {
        console.error('Error generating report:', error);
    }
};

// Make Payment Modal (Member)
window.showMakePaymentModal = function () {
    const currentMonth = new Date().toISOString().slice(0, 7);

    const content = `
        <form id="makePaymentForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <input type="month" id="paymentMonth" value="${currentMonth}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Amount (Rs.)</label>
                <input type="number" id="paymentAmount" required min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="0">
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p class="text-sm text-yellow-800">
                    ⚠️ This will mark the payment as "Pending" until admin approves it.
                </p>
            </div>
            <button type="submit" class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">
                Submit Payment Request
            </button>
        </form>
        <div id="paymentMessage" class="hidden mt-4 p-3 rounded-lg text-sm"></div>
    `;

    createModal('Make Payment', content);

    document.getElementById('makePaymentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitPayment();
    });
};

// Submit payment
async function submitPayment() {
    const month = document.getElementById('paymentMonth').value;
    const amount = parseInt(document.getElementById('paymentAmount').value);
    const messageDiv = document.getElementById('paymentMessage');

    try {
        const paymentId = `payment_${auth.currentUser.uid}_${month}`;

        await setDoc(doc(db, 'payments', paymentId), {
            userId: auth.currentUser.uid,
            month: month,
            amount: amount,
            status: 'pending',
            createdAt: new Date().toISOString()
        });

        messageDiv.className = 'mt-4 p-3 rounded-lg text-sm bg-green-50 border border-green-200 text-green-700';
        messageDiv.textContent = 'Payment request submitted successfully!';
        messageDiv.classList.remove('hidden');

        setTimeout(() => {
            closeModal();
            window.loadPaymentHistory();
            window.loadMemberPaymentInfo();
            window.updateSummaryCards();
        }, 1500);

    } catch (error) {
        console.error('Error submitting payment:', error);
        messageDiv.className = 'mt-4 p-3 rounded-lg text-sm bg-red-50 border border-red-200 text-red-700';
        messageDiv.textContent = 'Error submitting payment. Please try again.';
        messageDiv.classList.remove('hidden');
    }
}

// Helper function
function formatMonth(monthStr) {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

// Load modals script in dashboard
const script = document.createElement('script');
script.type = 'module';
script.src = 'js/modals.js';
document.head.appendChild(script);
