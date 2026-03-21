'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

/**
 * Initializes Firebase. 
 * We check if the API key is valid before trying to get Auth or Firestore 
 * to avoid "invalid-api-key" errors during initial setup.
 */
export function initializeFirebase() {
  const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  
  // We only initialize services if a valid API key is present.
  // This prevents the app from crashing if keys aren't set up yet.
  const auth = firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined" 
    ? getAuth(firebaseApp) 
    : null;
    
  const firestore = firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined"
    ? getFirestore(firebaseApp)
    : null;

  return { firebaseApp, auth, firestore };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
