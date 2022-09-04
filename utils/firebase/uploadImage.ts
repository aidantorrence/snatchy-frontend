import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import Constants from "expo-constants";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(Constants.manifest?.extra as any);
}

export default async function uploadImageAsync(uri: string) {
  const img = await fetch(uri);
  const blob = await img.blob();

  const fileRef = ref(getStorage(), uuidv4());
  await uploadBytesResumable(fileRef, blob);

  return await getDownloadURL(fileRef);
}
