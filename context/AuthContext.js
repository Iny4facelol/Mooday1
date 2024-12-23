"use client";
import { auth, db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
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

  async function signUp(email, password) {
    try {
      // 1. Crear el usuario con email y password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2. Actualizar el perfil con el displayName
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });
      }

      // 3. Opcional: Crear un documento en Firestore para el usuario
      const userDocRef = doc(db, "users", userCredential.user.uid);
      await setDoc(
        userDocRef,
        {
          email: email,
          displayName: displayName,
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // 4. Forzar un refresh para asegurar que tenemos la información actualizada
      await userCredential.user.reload();

      return userCredential;
    } catch (error) {
      console.error("Error in signUp:", error);
      throw error;
    }
  }

  async function updateUserDisplayName(newDisplayName) {
    try {
      console.log("currentUser:", currentUser);
      if (!currentUser) throw new Error("No user logged in");

      await updateProfile(currentUser, {
        displayName: newDisplayName,
      });

      // Actualizar también en Firestore si lo deseas
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(
        userDocRef,
        {
          displayName: newDisplayName,
        },
        { merge: true }
      );

      // Forzar refresh
      await currentUser.reload();
      setCurrentUser({ ...currentUser });

      return { success: true };
    } catch (error) {
      console.error("Error updating display name:", error);
      throw error;
    }
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
        console.log("firebasedata" ,firebaseData);
        
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
    loading,
    updateUserDisplayName,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
