# Boarding House Management System

A fully static web application for managing boarding house operations including member management, billing, and payment tracking.

## 🌟 Features

### For Admins
- 👥 Member management (Add/Edit/Delete)
- 💰 Set individual monthly rent for each member
- 💡 Enter monthly electricity bills (auto-divided among members)
- 💧 Enter monthly water bills (auto-divided among members)
- 📊 View all payments and generate reports
- 📈 Track outstanding amounts and collection rates

### For Members
- 📅 View payment history
- 💳 Submit payment requests
- 📊 See detailed breakdown:
  - Monthly rent
  - Electricity share
  - Water share
  - Total arrears
- ✅ Track paid/unpaid months
- 🔔 View payment status

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Tailwind CSS (CDN)
- **Authentication:** Firebase Authentication
- **Database:** Firebase Firestore
- **Hosting:** GitHub Pages (static hosting)

## 📁 Project Structure

```
boarding-house-app/
├── index.html              # Login page
├── register.html           # Registration page
├── dashboard.html          # Main dashboard
├── css/
│   └── styles.css         # Custom styles
├── js/
│   ├── firebase-config.js # Firebase configuration
│   ├── auth.js           # Authentication logic
│   ├── dashboard.js      # Dashboard functionality
│   └── modals.js         # Modal windows and forms
├── SETUP_GUIDE.md        # Detailed setup instructions
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- A Firebase account (free)
- A GitHub account (for deployment)
- Basic knowledge of Git

### Installation Steps

1. **Clone or Download this repository**
   ```bash
   git clone <your-repo-url>
   cd boarding-house-app
   ```

2. **Set up Firebase**
   - Follow the detailed instructions in [SETUP_GUIDE.md](SETUP_GUIDE.md)
   - Create a Firebase project
   - Enable Email/Password authentication
   - Create Firestore database
   - Get your Firebase configuration

3. **Configure the App**
   - Open `js/firebase-config.js`
   - Replace placeholder values with your Firebase config

4. **Test Locally**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node.js
   npx http-server -p 8000
   ```
   Open `http://localhost:8000`

5. **Deploy to GitHub Pages**
   - Push code to GitHub
   - Enable GitHub Pages in repository settings
   - Access your app at `https://yourusername.github.io/repository-name/`

## 📖 Detailed Documentation

For complete setup instructions, Firebase configuration, and deployment guide, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

## 🎯 Usage

### First Time Setup

1. **Create Admin Account**
   - Go to Register page
   - Fill in details and select "Admin" role
   - Login with your credentials

2. **Add Members**
   - Click "Manage Members"
   - Add member details and monthly rent
   - Members can register themselves with "Member" role

3. **Enter Monthly Bills**
   - Click "Manage Bills"
   - Enter electricity and water bills
   - Bills are automatically divided among active members

4. **Track Payments**
   - Members submit payment requests
   - Admin can view all payments
   - Generate monthly reports

## 🔒 Security

- Firebase Authentication for secure login
- Firestore Security Rules to protect data
- Role-based access control (Admin/Member)
- No sensitive data stored in frontend code

## 🎨 Customization

### Change Theme Colors
Edit `css/styles.css`:
```css
:root {
    --primary-color: #4f46e5;
    --secondary-color: #06b6d4;
    /* ... modify other colors */
}
```

### Modify Default Settings
Edit `js/auth.js` to change default monthly rent and other settings.

## 📊 Database Structure

### Collections

**users**
- Stores member and admin information
- Fields: name, email, role, monthlyRent, active, createdAt

**payments**
- Tracks all payment records
- Fields: userId, month, amount, status, paidDate, createdAt

**bills**
- Monthly utility bills
- Fields: month, electricity, water, updatedAt

## 🐛 Troubleshooting

### Common Issues

**Firebase not initialized**
- Check `firebase-config.js` has correct values
- Verify Firebase project is active

**Authentication errors**
- Ensure Email/Password is enabled in Firebase
- Check authorized domains include your deployment URL

**Permission denied errors**
- Verify Firestore security rules are set correctly
- Ensure user is logged in

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for more troubleshooting tips.

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (responsive design)

## 📱 Mobile Responsive

The app is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔄 Updates and Maintenance

To update the app:
1. Make changes to your code
2. Test locally
3. Commit and push to GitHub
4. GitHub Pages will auto-deploy

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Created with ❤️ for boarding house management

## 📞 Support

For detailed setup help, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

## 🎉 Acknowledgments

- Firebase for backend services
- Tailwind CSS for styling
- GitHub Pages for free hosting

---

**Version:** 1.0.0  
**Last Updated:** February 2026

## 🚦 Getting Started Checklist

- [ ] Create Firebase project
- [ ] Enable Email/Password authentication
- [ ] Create Firestore database
- [ ] Set Firestore security rules
- [ ] Get Firebase configuration
- [ ] Update `firebase-config.js`
- [ ] Test locally
- [ ] Push to GitHub
- [ ] Enable GitHub Pages
- [ ] Add GitHub Pages domain to Firebase
- [ ] Create admin account
- [ ] Add first members
- [ ] Start managing your boarding house! 🏠

---

For questions or issues, please check the [SETUP_GUIDE.md](SETUP_GUIDE.md) first!
