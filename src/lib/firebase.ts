import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  type User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc, 
  getDocs, 
  where, 
  limit, 
  getDoc,
  getDocFromServer,
  updateDoc
} from 'firebase/firestore';

// Import the Firebase configuration from the source of truth
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize the App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
// Respect the named database if provided in the config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Tests the connection to Firestore.
 */
export async function testFirestoreConnection() {
  try {
    // Try to fetch a non-existent document to test connectivity
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    console.log("Firestore connection test successful.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firestore connection failed: The client is offline. Please check your Firebase configuration.");
    }
    // Other errors (like 403) are handled by security rules or are expected for non-existent docs
  }
}

// Export Firebase functions and types
export { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc, 
  getDocs, 
  where, 
  limit, 
  getDoc,
  getDocFromServer,
  updateDoc,
  type User
};
