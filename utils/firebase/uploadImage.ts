import { getApps, initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Constants from "expo-constants";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

if (!getApps().length) {
  initializeApp(Constants.manifest?.extra as any);
}

export default async function uploadImageAsync(uri: string) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob: Blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const fileRef = ref(getStorage(), uuidv4());
  await uploadBytes(fileRef, blob);

  return await getDownloadURL(fileRef);
}
