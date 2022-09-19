import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";


export default async function uploadImageAsync(uri: string) {
  const img = await fetch(uri);
  const blob = await img.blob();

  const fileRef = ref(getStorage(), uuidv4());
  await uploadBytesResumable(fileRef, blob);

  return await getDownloadURL(fileRef);
}
