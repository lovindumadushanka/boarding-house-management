# Quick Reference Guide

## 🔐 User Roles

### Admin
- Full access to all features
- Can manage members
- Can set bills
- Can view all payments
- Can generate reports

### Member
- View own payment information
- Submit payment requests
- View payment history
- See bill breakdowns

---

## 📋 Common Tasks

### For Admins

#### Add a New Member
1. Login as admin
2. Click **"Manage Members"**
3. Fill in:
   - Member Name
   - Email
   - Monthly Rent
4. Click **"Add Member"**

#### Set Monthly Bills
1. Click **"Manage Bills"**
2. Select month
3. Enter:
   - Electricity bill total
   - Water bill total
4. Click **"Save Bills"**
5. Bills are automatically divided among active members

#### View All Payments
1. Click **"View All Payments"**
2. See table with:
   - Member name
   - Month
   - Amount
   - Status
   - Paid date

#### Generate Monthly Report
1. Click **"Monthly Report"**
2. View:
   - Total expected
   - Total paid
   - Total due
   - Collection rate
   - Utility bills

#### Edit Member
1. Find member in list
2. Click **"Edit"**
3. Update:
   - Name
   - Monthly rent
   - Status (Active/Inactive)
4. Click **"Update Member"**

#### Delete Member
1. Find member in list
2. Click **"Delete"**
3. Confirm deletion

### For Members

#### View Payment Summary
1. Login to dashboard
2. See cards showing:
   - Monthly rent
   - Electricity share
   - Water share
   - Total arrears

#### Submit Payment
1. Click **"Mark Payment as Paid"**
2. Select month
3. Enter amount paid
4. Click **"Submit Payment Request"**
5. Wait for admin approval

#### Check Payment History
1. Scroll to **"Payment History"** section
2. View all past payments with:
   - Month
   - Amount
   - Status (Paid/Unpaid/Pending)
   - Paid date

---

## 💡 Understanding the Dashboard

### Summary Cards (Top)

**Total Paid** (Green)
- Sum of all paid amounts
- For admin: all members
- For member: own payments

**Total Due** (Red)
- Sum of all unpaid amounts
- Outstanding balance

**This Month** (Blue)
- Current month payment status
- Shows Paid ✅ or Unpaid ❌

---

## 🧮 Billing Calculations

### How Bills Are Divided

**Electricity Bill:**
```
Per Member Share = Total Electricity Bill ÷ Number of Active Members
```

**Water Bill:**
```
Per Member Share = Total Water Bill ÷ Number of Active Members
```

**Total Monthly Payment:**
```
Total = Monthly Rent + Electricity Share + Water Share
```

### Example

**Scenario:**
- 5 active members
- Electricity bill: Rs. 25,000
- Water bill: Rs. 8,000
- Member's monthly rent: Rs. 10,000

**Calculation:**
- Electricity share: 25,000 ÷ 5 = Rs. 5,000
- Water share: 8,000 ÷ 5 = Rs. 1,600
- **Total due: 10,000 + 5,000 + 1,600 = Rs. 16,600**

---

## 🎨 Payment Status Badges

| Badge | Meaning |
|-------|---------|
| **PAID** (Green) | Payment completed and verified |
| **UNPAID** (Red) | Payment not yet made |
| **PARTIAL** (Yellow) | Partial payment received |
| **PENDING** (Blue) | Payment submitted, awaiting admin approval |

---

## 🔄 Workflow

### Monthly Payment Process

1. **Admin enters bills** (start of month)
   - Enter electricity bill
   - Enter water bill

2. **Members see updated amounts**
   - Dashboard shows new totals
   - Including bill shares

3. **Members make payments**
   - Submit payment request
   - Status: PENDING

4. **Admin reviews payments**
   - View all payments
   - Verify and update status to PAID

5. **Members see confirmation**
   - Payment history updated
   - Status shows PAID

---

## 📊 Data Management

### Active vs Inactive Members

**Active Members:**
- Included in bill division
- Can login and use system
- Count towards total members

**Inactive Members:**
- Not included in bill calculations
- Cannot login
- Archived for record keeping

To change status:
1. Admin clicks **"Edit"** on member
2. Change status dropdown
3. Click **"Update Member"**

---

## 🔍 Troubleshooting

### "Permission Denied" Error
**Solution:** Make sure you're logged in and have the correct role

### Bills Not Showing
**Solution:** Admin must enter bills for the current month first

### Payment Not Appearing
**Solution:** 
- Check you selected correct month
- Verify amount is greater than 0
- Check internet connection

### Can't Login
**Solution:**
- Verify email and password
- Check if account is active
- Contact admin if member account

---

## 📱 Mobile Usage

### Navigation
- Tap menu items to navigate
- Swipe to scroll tables
- Pinch to zoom (if needed)

### Best Practices
- Use landscape mode for tables
- Portrait mode for forms
- Ensure stable internet connection

---

## 💾 Data Backup

All data is automatically stored in Firebase Firestore:
- Real-time synchronization
- Automatic backups
- No manual backup needed

---

## 🔒 Security Tips

### For Admins
- ✅ Use strong password
- ✅ Don't share admin credentials
- ✅ Regularly review member list
- ✅ Verify payments before marking as paid

### For Members
- ✅ Keep password secure
- ✅ Logout after use on shared devices
- ✅ Verify payment amounts before submitting
- ✅ Keep payment receipts

---

## 📞 Getting Help

### Check These First
1. **Dashboard summary cards** - Quick overview
2. **Payment history** - Past transactions
3. **This guide** - Common solutions

### Common Questions

**Q: How often should bills be entered?**  
A: Once per month, typically at the start

**Q: Can I edit a payment after submitting?**  
A: No, contact admin to make changes

**Q: Why is my electricity share different each month?**  
A: It depends on total bill and number of active members

**Q: Can I pay for multiple months at once?**  
A: Submit separate payment requests for each month

---

## 🎯 Best Practices

### For Admins
1. Enter bills on the same day each month
2. Review payments weekly
3. Generate monthly reports for records
4. Keep member information updated
5. Communicate payment deadlines

### For Members
1. Check dashboard regularly
2. Submit payments on time
3. Keep track of your payment history
4. Report discrepancies immediately
5. Maintain payment receipts

---

## 📈 Monthly Checklist

### Admin Monthly Tasks
- [ ] Enter electricity bill
- [ ] Enter water bill
- [ ] Review all payment requests
- [ ] Update payment statuses
- [ ] Generate monthly report
- [ ] Check for overdue payments
- [ ] Update member list if needed

### Member Monthly Tasks
- [ ] Check updated bill amounts
- [ ] Review total amount due
- [ ] Make payment
- [ ] Submit payment request
- [ ] Verify payment status updated
- [ ] Save payment confirmation

---

## 🌟 Tips for Success

1. **Consistency** - Enter data regularly
2. **Communication** - Keep members informed
3. **Verification** - Double-check amounts
4. **Records** - Keep payment history
5. **Updates** - Review dashboard frequently

---

**Need more help?** Refer to [SETUP_GUIDE.md](SETUP_GUIDE.md) for technical details.
