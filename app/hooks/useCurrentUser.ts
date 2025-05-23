"use client";

import { getAnonymousUser, watchUserDoc } from "@/services/firebase";
import { FirestoreUser } from "@/types/firestore";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";

export const useAuthUser = () => {
  const [currentAuthUser, setCurrentAuthUser] = useState<User>();

  const getAuthUser = async () => {
    const user = await getAnonymousUser();
    if (user) {
      setCurrentAuthUser(user);
    } else {
      console.warn(
        "No user is signed in. This should not be possible in this environment."
      );
    }
  };

  useEffect(() => {
    getAuthUser();
  }, []);

  return currentAuthUser;
};

// if auth user is created, get the doc and respond w/ realtime status of user doc

export const useAuthUserId = () => {
  const authUser = useAuthUser();

  return authUser?.uid || null;
};

export const useAuthUserExists = () => {
  const authUser = useAuthUser();

  return Boolean(authUser);
};

// TODO: create global state w/ single instance of current user subscription
export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<FirestoreUser>();

  const authId = useAuthUserId();

  useEffect(() => {
    if (!authId) return;

    const unsubscribe = watchUserDoc(authId, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, [authId]);

  return currentUser;
};

export const useCurrentUserId = () => {
  const currentUser = useCurrentUser();

  return currentUser?.id || null;
};

export const useCurrentUserCallSid = () => {
  const currentUser = useCurrentUser();

  return currentUser?.activeCallSid || null;
};
