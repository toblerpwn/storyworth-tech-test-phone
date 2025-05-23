import {
  FIRESTORE_CALL_COLLECTION,
  FIRESTORE_USER_COLLECTION,
  firestoreCallFromDoc,
  firestoreUserFromDoc,
} from "@/app/utils/firestore";
import { FirestoreCall, FirestoreUser } from "@/types/firestore";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  getFirestore,
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
  setDoc,
  onSnapshot,
} from "firebase/firestore";

// these are NOT secrets; OK to expose
// https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
  apiKey: "AIzaSyAJVliJ4lPMrz2e3T1Jn2c8JKQ37rwfhYc",
  authDomain: "storyworth-voice-demo.firebaseapp.com",
  projectId: "storyworth-voice-demo",
  storageBucket: "storyworth-voice-demo.firebasestorage.app",
  messagingSenderId: "533513415374",
  appId: "1:533513415374:web:c672dbbdc0d6842649be9f",
};

// initialize Firebase
const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// export Firebase services
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseFirestore = getFirestore(firebaseApp);

export const getAnonymousUser = async () => {
  const user = firebaseAuth.currentUser;
  if (user) {
    return user;
  }

  // sign in anonymously
  const { user: newUser } = await signInAnonymously(firebaseAuth);
  await syncAuthUserToFirestore(newUser.uid);
  return newUser;
};

export const getAnonymousUserId = async () => {
  const user = await getAnonymousUser();
  return user.uid;
};

export const signOutAnonymousUser = async () => {
  const user = firebaseAuth.currentUser;
  if (user) {
    await firebaseAuth.signOut();
  }
  return null;
};

const syncAuthUserToFirestore = async (userId: string) => {
  // check if user already exists in Firestore
  // TODO: this should be a transaction to avoid race conditions
  const userDocRef = doc(firebaseFirestore, FIRESTORE_USER_COLLECTION, userId);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    // create a new user document
    await setDoc(userDocRef, {
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  } else {
    // update the existing user document
    await updateDoc(userDocRef, {
      lastLogin: serverTimestamp(),
    });
  }
};

export const getCurrentUserDoc = async () => {
  const authUserId = await getAnonymousUserId();
  const userDocRef = doc(
    firebaseFirestore,
    FIRESTORE_USER_COLLECTION,
    authUserId
  );
  const userDoc = await getDoc(userDocRef);
  return userDoc;
};

export const watchUserDoc = (
  docId: string,
  callback: (doc: FirestoreUser) => void
) => {
  const userDocRef = doc(firebaseFirestore, FIRESTORE_USER_COLLECTION, docId);
  const unsubscribe = onSnapshot(userDocRef, (doc) => {
    const user = firestoreUserFromDoc(doc);
    callback(user);
  });
  return unsubscribe;
};

export const watchCallSid = (
  callSid: string,
  callback: (call: FirestoreCall) => void
) => {
  const callDocRef = doc(firebaseFirestore, FIRESTORE_CALL_COLLECTION, callSid);
  const unsubscribe = onSnapshot(callDocRef, (doc) => {
    const call = firestoreCallFromDoc(doc);
    callback(call);
  });
  return unsubscribe;
};

export const setCall = async (
  callSid: string,
  options: Partial<FirestoreCall>
) => {
  const callDocRef = doc(firebaseFirestore, FIRESTORE_CALL_COLLECTION, callSid);
  await setDoc(callDocRef, {
    ...options,
    updatedAt: serverTimestamp(),
  });
};
