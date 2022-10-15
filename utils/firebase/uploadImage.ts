import axios from "axios";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { API_URL } from "../../data/api";

// export default async function uploadImageAsync(uri: string) {
//   console.log("uploadImageAsync", uri);
//   const img = await fetch(uri);
//   const blob = await img.blob();
//   console.log('blob', blob)

//   const formData = new FormData();
//   let file = new File([blob], "image.jpg", { type: "image/jpeg" });
//   formData.append("file", file, "image.jpg");

//   try {
//     const { data } = await axios.post(`${API_URL}/upload-images`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     console.log(data);
//     return data;
//   } catch (e) {
//     console.log(`${API_URL}/upload-images`, e);
//   }
// }

export default async function uploadImageAsync(uri: string) {
  const img = await fetch(uri);
  const blob = await img.blob();

  const fileRef = ref(getStorage(), uuidv4());
  await uploadBytesResumable(fileRef, blob);

  return await getDownloadURL(fileRef);
}
