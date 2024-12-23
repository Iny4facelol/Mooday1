"use client";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import React, { useContext, useState, useEffect } from "react";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDataObj, setUserDataObj] = useState(null);
  const [loading, setLoading] = useState(true);

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    setUserDataObj(null);
    setCurrentUser(null);
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        setCurrentUser(user);
        if (!user) {
          console.log("No user Found");
          return;
        }
        console.log("Fetching User");

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        let firebaseData = {};
        if (docSnap.exists()) {
          console.log("Found User Data");
          firebaseData = docSnap.data();
          console.log(firebaseData);
        }
        setUserDataObj(firebaseData);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    setUserDataObj,
    userDataObj,
    signUp,
    logout,
    login,
    loading
  };
  return <AuthContext.Provider value={value}>
    {children}
    </AuthContext.Provider>;
};
