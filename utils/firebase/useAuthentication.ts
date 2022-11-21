import { Auth, getAuth, initializeAuth, onAuthStateChanged, User } from "firebase/auth";
import create from "zustand";
import { useEffect } from "react";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from "firebase/auth/react-native";
const firebaseApp = !getApps().length ? initializeApp(Constants.expoConfig?.extra as any) : getApp();

const auth = initializeAuth(firebaseApp as FirebaseApp, { persistence: getReactNativePersistence(AsyncStorage) });

export const useStore = create((set: any) => ({
  user: undefined as any,
  setUser: (input: any) => set({ user: input }),
}));

export default function useAuthentication() {
  const setUser = useStore((state) => state.setUser);
  const user = useStore((state) => state.user);

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
