// import { Auth, getAuth, initializeAuth, onAuthStateChanged, User } from "firebase/auth";
import create from "zustand";
import { useEffect } from "react";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from '@react-native-firebase/auth';
import firebase, { ReactNativeFirebase } from "@react-native-firebase/app";

// const firebaseApp = !firebase.apps.length ? firebase.initializeApp(Constants.expoConfig?.extra as any) : firebase.apps[0];

// const auth = initializeAuth(firebaseApp as ReactNativeFirebase.FirebaseApp, { persistence: getReactNativePersistence(AsyncStorage) });

export const useStore = create((set: any) => ({
  user: undefined as any,
  setUser: (input: any) => set({ user: input }),
  selected: [] as any,
  setSelected: (input: any) => set({ selected: input }),
}));

export default function useAuthentication() {
  const setUser = useStore((state) => state.setUser);
  const user = useStore((state) => state.user);

  function onAuthStateChanged(user: any) {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        console.log('auth state changed')
        console.log('auth state user uid', user?.uid)
        setUser(user);
      } else {
        // User is signed out
        setUser(undefined);
      }
  }

  useEffect(() => {
    const unsubscribeFromAuthStateChanged = auth().onAuthStateChanged(onAuthStateChanged);
    return unsubscribeFromAuthStateChanged;
  }, []);

  return user;
}
