import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc as rawSetDoc, onSnapshot, collection, deleteDoc, getDocs, SetOptions } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

/**
 * Recursively strips undefined fields and converts them so Firestore does not reject the document.
 */
export const sanitizeForFirestore = <T>(data: T): T => {
  if (data === undefined) return null as any;
  if (data === null || typeof data !== 'object') return data;
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as any;
  }
  const cleanObj: any = {};
  for (const [key, value] of Object.entries(data as Record<string, any>)) {
    if (value !== undefined) {
      cleanObj[key] = sanitizeForFirestore(value);
    }
  }
  return cleanObj;
};

let app;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (e) {
  console.warn('Firebase app init warning:', e);
  app = getApps()[0] || initializeApp(firebaseConfig);
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

let dbInstance;
try {
  dbInstance = getFirestore(
    app,
    firebaseConfig.firestoreDatabaseId || '(default)'
  );
} catch (e) {
  console.warn('Firestore init warning:', e);
  dbInstance = getFirestore(app);
}

export const db = dbInstance;

/**
 * Safe setDoc wrapper that automatically cleans all undefined fields before sending to Firestore
 */
export const setDoc = async (docRef: any, data: any, options?: SetOptions) => {
  const sanitized = sanitizeForFirestore(data);
  if (options !== undefined) {
    return rawSetDoc(docRef, sanitized, options);
  }
  return rawSetDoc(docRef, sanitized);
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

export const logoutFirebase = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
  }
};

export { onAuthStateChanged, doc, getDoc, onSnapshot, collection, deleteDoc, getDocs };
export type { FirebaseUser };
