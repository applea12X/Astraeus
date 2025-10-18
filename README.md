# React + Tailwind CSS + Firebase Starter

A modern web application starter template featuring React with Vite, Tailwind CSS, and Firebase integration.

## 🚀 Features

- ⚛️ **React 18** - Latest version with Vite for lightning-fast development
- 🎨 **Tailwind CSS** - Utility-first CSS framework with the new `@tailwindcss/vite` plugin
- 🔥 **Firebase** - Backend as a service with Authentication, Firestore, and Storage ready to use
- ⚡ **Vite** - Next-generation frontend tooling with HMR (Hot Module Replacement)
- 🌙 **Dark Mode Ready** - Pre-configured with dark mode support via Tailwind
- 📱 **Responsive Design** - Mobile-first approach with Tailwind's responsive utilities

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher recommended)
- npm or yarn
- A Firebase account ([Create one here](https://firebase.google.com/))

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hacktx-TFS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   
   a. Create a new project in the [Firebase Console](https://console.firebase.google.com/)
   
   b. Copy the Firebase configuration from your project settings
   
   c. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   d. Fill in your Firebase credentials in the `.env` file:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   Your app should now be running at `http://localhost:5173`

## 🏗️ Project Structure

```
hacktx-TFS/
├── src/
│   ├── components/          # React components
│   │   └── FirebaseExample.jsx
│   ├── firebase/           # Firebase configuration
│   │   └── config.js
│   ├── assets/            # Static assets
│   ├── App.jsx            # Main App component
│   ├── App.css            # App styles
│   ├── index.css          # Global styles with Tailwind imports
│   └── main.jsx           # Application entry point
├── public/                # Public static files
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore file
├── index.html           # HTML entry point
├── package.json         # Project dependencies
└── vite.config.js       # Vite configuration
```

## 🔥 Firebase Services

This template includes pre-configured Firebase services:

### Authentication
```javascript
import { auth } from './firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Sign in
await signInWithEmailAndPassword(auth, email, password);

// Sign up
await createUserWithEmailAndPassword(auth, email, password);
```

### Firestore Database
```javascript
import { db } from './firebase/config';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

// Add a document
await addDoc(collection(db, 'users'), { name: 'John', age: 30 });

// Query documents
const q = query(collection(db, 'users'), where('age', '>', 18));
const querySnapshot = await getDocs(q);
```

### Storage
```javascript
import { storage } from './firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Upload a file
const storageRef = ref(storage, 'images/photo.jpg');
await uploadBytes(storageRef, file);

// Get download URL
const url = await getDownloadURL(storageRef);
```

## 🎨 Tailwind CSS

This project uses the latest Tailwind CSS setup with the `@tailwindcss/vite` plugin. The configuration is automatically handled by the plugin.

### Using Tailwind Classes
```jsx
<div className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
  Button
</div>
```

### Dark Mode
```jsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  This adapts to the user's system preference
</div>
```

For more information, see the [Tailwind CSS Vite documentation](https://tailwindcss.com/docs/installation/using-vite).

## 📦 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## 🔒 Security Best Practices

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Use Firebase Security Rules** - Protect your database and storage
3. **Enable authentication** - Secure your Firebase services
4. **Use environment variables** - For all sensitive configuration

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Firebase Documentation](https://firebase.google.com/docs)

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Next Steps

1. Set up Firebase Authentication methods in the Firebase Console
2. Create Firestore database and set up security rules
3. Customize the Tailwind theme in your components
4. Build your amazing application! 🚀

---

Built with ❤️ using React, Tailwind CSS, and Firebase
