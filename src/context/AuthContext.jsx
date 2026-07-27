import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role || 'student');
            setUserProfile(userDoc.data());
          } else {
            setUserRole('student');
            setUserProfile(null);
          }
        } catch (err) {
          console.error('Failed to load user role:', err);
          setUserRole('student');
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const register = async (email, password, fullName, role = 'student') => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', cred.user.uid), {
      email,
      fullName,
      role,
      createdAt: serverTimestamp(),
    });
    return cred;
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const logout = () => signOut(auth);

  const value = {
    currentUser,
    userRole,
    userProfile,
    loading,
    login,
    register,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
