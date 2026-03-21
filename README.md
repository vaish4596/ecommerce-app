
# 🛍️ Catalyst Catalog - Simple Online Store

A clean and high-performance e-commerce store built with **Next.js**, **Tailwind CSS**, and **Firebase**. 

---

## ✨ Features Implemented
- **Product Catalog**: Browse items with real-time price sorting and category-based filtering.
- **Dynamic Product Pages**: Dedicated pages for every item showing full descriptions and specifications.
- **Persistent Shopping Cart**: Add/remove items and manage quantities. Uses **LocalStorage** so your cart stays saved even if you refresh the page.
- **User Authentication**: Secure Login and Signup powered by **Firebase Auth** (supports Email/Password and Google Login).
- **Cloud Wishlist**: Logged-in users can save favorite items to a personal wishlist stored in **Firebase Firestore**.
- **Mock Checkout**: A realistic checkout flow that simulates payment processing and order success.
- **Responsive Design**: Fully mobile-friendly UI built with Tailwind CSS.

---

## 🛠️ Tech Stack Used
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for modern, responsive layouts.
- **Backend/Database**: [Firebase](https://firebase.google.com/) (Firestore for data, Auth for users).
- **Icons**: [Lucide React](https://lucide.dev/) for clean, scalable icons.
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type-safe, bug-free code.
- **State Management**: React Context API for global Shopping Cart state.

---

## 🔌 API Endpoints (Local)
The app uses Next.js Route Handlers to serve product data from a JSON database:

- `GET /api/products`: Returns the full list of products.
  - **Query Params**: 
    - `category`: Filter by category (e.g., `?category=Electronics`).
    - `q`: Search for products by name (e.g., `?q=phone`).
- `GET /api/products/[id]`: Returns detailed data for a specific product by its ID.

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Firebase
Create a `.env.local` file in the root folder and add your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Start Development Server
```bash
npm run dev
```

---

## 🧠 Challenges Faced
- **Hydration Mismatches**: Dealing with LocalStorage in Next.js was tricky because the server doesn't have access to the browser's storage. I solved this by using `useEffect` to load the cart data only after the client has mounted.
- **Firebase Initialization**: Preventing the app from crashing when Firebase API keys are missing. I implemented a "defensive" check in the Firebase config to ensure the app stays alive even without a connection.
- **Real-time Syncing**: Making the Wishlist update instantly across different pages. I used Firestore's `onSnapshot` listener to ensure that if you "Heart" an item on the home page, it appears in the Wishlist page immediately without a refresh.
- **Complexity Management**: Stripping down advanced UI libraries to keep the code easy to copy and understand for developers who prefer standard HTML/CSS patterns.
