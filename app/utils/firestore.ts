import { firebaseFirestore } from "@/services/firebase";
import { FirestoreCall, FirestoreUser } from "@/types/firestore";
import { TwilioCallStatus } from "@/types/twilio";
import {
  deleteField,
  doc,
  DocumentSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export const FIRESTORE_USER_COLLECTION = "users";
export const FIRESTORE_CALL_COLLECTION = "calls";

export const firestoreUserFromDoc = (doc: DocumentSnapshot): FirestoreUser => {
  const data = doc.data();
  return {
    id: doc.id,
    lastLogin: data?.lastLogin?.toDate(),
    createdAt: data?.createdAt?.toDate(),
    activeCallSid: data?.activeCallSid,
  };
};

export const firestoreCallFromDoc = (doc: DocumentSnapshot): FirestoreCall => {
  const data = doc.data();
  return {
    id: doc.id,
    createdAt: data?.createdAt?.toDate(),
    updatedAt: data?.updatedAt?.toDate(),
    status: data?.status,
    recordingUrl: data?.recordingUrl,
    transcriptUrl: data?.transcriptUrl,
    transcriptText: data?.transcriptText,
  };
};

export const setActiveCall = async (
  userId: string,
  callSid: string,
  status: TwilioCallStatus
) => {
  const currentUserId = userId;

  const userDocRef = doc(
    firebaseFirestore,
    FIRESTORE_USER_COLLECTION,
    currentUserId
  );

  const userData: Partial<FirestoreUser> = {
    activeCallSid: callSid,
  };
  await setDoc(userDocRef, userData);

  const callDocRef = doc(firebaseFirestore, FIRESTORE_CALL_COLLECTION, callSid);

  const callData: Partial<FirestoreCall> = {
    status,
  };
  await setDoc(
    callDocRef,
    {
      ...callData,
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );

  return callSid;
};

export const removeActiveCall = async (userId: string) => {
  const currentUserId = userId;

  const userDocRef = doc(
    firebaseFirestore,
    FIRESTORE_USER_COLLECTION,
    currentUserId
  );

  await updateDoc(userDocRef, {
    activeCallSid: deleteField(),
  });
};
