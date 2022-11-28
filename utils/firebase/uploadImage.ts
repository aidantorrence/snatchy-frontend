import axios from "axios";
import storage from '@react-native-firebase/storage';
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { API_URL } from "../../data/api";

export default async function uploadImageAsync(uri: string) {
  // console.log("uploadImageAsync", uri);
  const img = await fetch(uri);
  const blob = await img.blob();

  // await blob.text().then((text) => {
  //   console.log("blob", text);
  // });

  // const formData = new FormData();
  // const file = new File([blob], "image", { type: "image/jpeg" });
  // formData.append("file", file, "image.jpg");

  const base64: any = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data)
    };
  });

  const formData = new FormData();
  formData.append("file", base64);
  
  // const formData = new FormData();
  // const extension = blob.type.split('/')[1];  
  // formData.append('image', blob, 'filename.'+ extension);

  try {
  //  const { data }: any = axios.put(`${API_URL}/upload-images`, blob, {
  //     headers: { "content-type": blob.type }
  //   });
    const { data } = await axios.post(`${API_URL}/upload-images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const fileRef = storage().ref(data);
    const url = await fileRef.getDownloadURL();
    return url
  } catch (e) {
    console.log(`${API_URL}/upload-images`, e);
  }
}

// export default async function uploadImageAsync(uri: string) {
//   const img = await fetch(uri);
//   const blob = await img.blob();

//   const fileRef = ref(getStorage(), uuidv4());
//   await uploadBytesResumable(fileRef, blob);

//   return await getDownloadURL(fileRef);
// }
