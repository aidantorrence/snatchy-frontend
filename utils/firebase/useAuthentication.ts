import { getAuth, initializeAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useEffect } from 'react';
import { useState } from 'react';
import { getReactNativePersistence } from 'firebase/auth/react-native';

// Import it from your preferred package.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { app } from './uploadImage';

// Provide it to initializeAuth.
const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

export default function useAuthentication() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribeFromAuthStateChanged = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(user);
      } else {
        // User is signed out
        setUser(undefined);
      }
    });

    return unsubscribeFromAuthStateChanged;
  }, []);

  return user;
}