# Catalyst Catalog - Local Setup

This project was built in Firebase Studio using Next.js, React, and Tailwind CSS.

## How to use this project on your computer:

1. **Copy the Files**: Create a folder on your computer and copy all the files from this project into it.
2. **Install Node.js**: Make sure you have Node.js installed on your computer.
3. **Install Dependencies**: Open your terminal in the project folder and run:
   ```bash
   npm install
   ```
4. **Set Up Firebase**: 
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Create a new project.
   - Add a "Web App" to get your Firebase configuration.
   - Create a file named `.env.local` in your project root and add your keys:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```
5. **Run the Project**:
   ```bash
   npm run dev
   ```
6. **View the App**: Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `src/app`: The pages and logic of the website.
- `src/components`: Reusable parts like the Navbar and Product Cards.
- `src/firebase`: Connection to the database and login system.
