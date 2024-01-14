import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

import auth from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function register(email, password, username) {
    try {
      // Create user in authentication system
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Store additional user data in Firestore
      const usersCollection = collection(auth.firestore(), 'users');
      await addDoc(usersCollection, {
        uid: user.uid,
        displayName: username,
        email: email,
        // Add more fields as needed
      });

      // Update user profile in authentication system
      await updateProfile(user, { displayName: username });

    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function updateUserProfile(user, profile) {
    return updateProfile(user, profile);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    error,
    setError,
    login,
    register,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
