import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

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

export { onAuthStateChanged, doc, getDoc, setDoc, onSnapshot };
export type { FirebaseUser };
