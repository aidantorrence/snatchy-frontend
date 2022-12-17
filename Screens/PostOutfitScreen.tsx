import React, { useEffect, useState } from "react";
import {
  Dimensions,
  TouchableOpacity,
  Modal,
  Text,
  Image,
  View,
  StyleSheet,
  SafeAreaView,
  Button,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchOutfits, fetchUser, postOutfit } from "../data/api";
import { DropDownForm, InputForm, MultiDropDownForm } from "../Components/Forms";
import uploadImageAsync from "../utils/firebase/uploadImage";
import useAuthentication, { useStore } from "../utils/firebase/useAuthentication";
import analytics from "@react-native-firebase/analytics";
import FastImage from "react-native-fast-image";
import { mixpanel } from "../utils/mixpanel";
import { Linking } from "react-native";

const modalOptions = {
  kibbeTypes: ["", "Queen", "Boss", "Coquette", "Supermodel", "Siren", "Lady", "Feline", "Ingenue", "Vixen", "Femme Fatale"],
  occasions: [
    "",
    "Athletic",
    "Beach",
    "Black Tie",
    "Casual",
    "Clubbing",
    "Cocktail",
    "Date",
    "Festival",
    "Holiday",
    "Lounge",
    "Office",
    "Smart Casual",
    "Wedding",
  ],
  aesthetic: [
    "",
    "Academia / Preppy",
    "Insta Baddie / Y2K",
    "Indie",
    "Goth / Grunge / Punk",
    "Artsy",
    "E-person",
    "Soft / VSCO",
    "Cottage-core",
    "Norm-core",
  ],
  seasonalColors: [
    "",
    "Spring",
    "Summer",
    "Autumn",
    "Winter",
  ],
  postReason: ["", "Inspiration", "Feedback"],
} as any;

const initialFormState = {
  images: [],
  kibbeTypes: [],
  description: "",
  occasions: [],
  aesthetic: "",
  seasonalColors: [],
  purchaseLink: "",
  postReason: "",
};
export default function PostOutfitScreen({ navigation }: any) {
  const user = useStore((state) => state.user);
  const { data: userData, isLoading } = useQuery(["currentUser", user?.uid], () => fetchUser(user?.uid), {
    enabled: !!user?.uid,
  });
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(initialFormState))) as any;
  const [error, setError] = useState({
    images: "",
    kibbeTypes: "",
    description: "",
    occasions: "",
    aesthetic: "",
    seasonalColors: "",
    purchaseLink: "",
    postReasons: "",
  }) as any;
  const [optionsModalIsVisible, setOptionsModalIsVisible] = useState(false);
  const [confirmModalIsVisible, setConfirmModalIsVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState("");
  const [modalValue, setModalValue] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [focusedState, setFocusedState] = useState({
    description: false,
    purchaseLink: false,
  });
  const queryClient = useQueryClient();
  const { mutate, isMutationLoading }: any = useMutation((data) => postOutfit(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("currentUser");
      queryClient.invalidateQueries({ queryKey: ["outfits"] });
    },
  });

  // const {
  //   data: outfitsData,
  //   refetch,
  // } = useQuery(["outfits", user?.uid], () => fetchOutfits(user?.uid));

  useEffect(() => {
    launchPhotosAlert();
  }, []);

  const validateForm = () => {
    let isValid = true;
    if (!formData.images.length) {
      setError({ ...error, images: "A photo is required" });
      isValid = false;
    }
    for (const key in formData) {
      if (["purchaseLink", "kibbeTypes", "seasonalColors", "aesthetic", "occasions"].includes(key)) continue;
      if ((Array.isArray(formData[key]) && formData[key]?.length === 0) || formData[key] === "") {
        setError((err: any) => ({ ...err, [key]: "This field is required" }));
        isValid = false;
      }
    }
    return isValid;
  };

  const handleSubmit = () => {
    const isValid = validateForm();
    if (isValid) setConfirmModalIsVisible(true);
  };

  const outfit = {
    ...formData,
    ownerId: user?.uid,
  };

  const cameraAccessAlert = () => {
    Alert.alert("LooksMax Would Like Access to Your Camera", "", [
      {
        text: "OK",
        onPress: () => Linking.openSettings(),
      },
      {
        text: "Don't Allow",
        style: "cancel",
      },
    ]);
  };

  const editPhoto = (index?: number) => {
    if (index !== undefined) {
      Alert.alert("Select action", "", [
        {
          text: "Replace photo",
          onPress: () => launchPhotosAlert(index),
        },
        {
          text: "Delete photo",
          onPress: () => handleDeletePhoto(index),
        },
      ]);
    } else {
      launchPhotosAlert();
    }
  };

  const handleDeletePhoto = (index: number) => {
    const filteredImages = formData.images.filter((img: any, idx: number) => idx !== index);
    setFormData({ ...formData, images: filteredImages });
  };

  const handleURLPasteComplete = (value: any) => {
    setFormData({ ...formData, images: [...formData.images, value] });
    setOptionsModalIsVisible(false);
  };

  const pasteURL = () =>
    Alert.prompt("Enter image URL", "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: handleURLPasteComplete,
      },
    ]);

  const launchPhotosAlert = (index?: number) => {
    Alert.alert("Take a Photo", "Select from Camera Roll", [
      {
        text: "Take a Photo",
        onPress: () => pickImage(true, index),
      },
      {
        text: "Select from Camera Roll",
        onPress: () => pickImage(false, index),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const pickImage = async (takePhoto: boolean, index: number | undefined) => {
    // clear form error
    setError({ ...error, images: "" });
    setPhotoLoading(true);

    try {
      let result: any;

      if (takePhoto) {
        // take a photo
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        // if permission not granted, return
        if (status !== "granted") { 
          cameraAccessAlert();
          setPhotoLoading(false);
          return;
        }

        result = await ImagePicker.launchCameraAsync();
      } else {
        // No permissions request is necessary for launching the image library
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 0.1,
        });
      }
      if (!result.canceled) {
        const url = await uploadImageAsync(result.uri);
        if (index !== undefined) {
          formData.images[index] = url;
          setFormData({ ...formData, images: [...formData.images] });
        } else {
          setFormData({ ...formData, images: [...formData.images, url] });
        }
      }
    } catch (e) {
      setPhotoLoading(false);
    }
    setPhotoLoading(false);
  };

  const openOptionsModal = (val: string) => {
    setCurrentModal(val);
    setOptionsModalIsVisible(true);
  };
  const handlePickerSelect = (val: string) => {
    setModalValue(val);
  };
  const handlePost = () => {
    if (!validateForm()) return;
    mutate(outfit);
    setFormData(JSON.parse(JSON.stringify(initialFormState)));
    navigation.navigate("Home");
    analytics().logEvent("outfit_posted", { ...outfit });
    mixpanel.track("Outfit Created", { ...outfit });
  };
  const handleOptionsModalClose = () => {
    if (["occasions", "kibbeTypes", "seasonalColors"].includes(currentModal)) {
      if (modalValue && !formData[currentModal].includes(modalValue)) formData[currentModal].push(modalValue);
      setFormData({ ...formData });
    } else {
      formData[currentModal] = modalValue;
      setFormData({ ...formData });
    }
    setOptionsModalIsVisible(false);
    setModalValue("");
  };

  return isLoading ? (
    <SafeAreaView style={styles.screenAreaView}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  ) : (
    <>
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.detailsContainer}>
            <TouchableOpacity style={styles.imageButton} onPress={() => editPhoto()}>
              {formData.images.length ? (
                <>
                  <FastImage source={{ uri: formData.images[0] }} style={styles.uploadedImage} />
                  <Text style={styles.imageText}>Replace Photo</Text>
                </>
              ) : photoLoading ? (
                <ActivityIndicator size="large" />
              ) : (
                <View style={styles.imageContainer}>
                  <FastImage source={require("../assets/Plus_Button.png")} style={styles.addPhoto} />
                  <Text style={styles.placeholderImageText}>Upload Outfit</Text>
                  {error.images ? <Text style={styles.error}>{error.images}</Text> : null}
                </View>
              )}
            </TouchableOpacity>
          </View>
          <InputForm
            formData={formData}
            setFormData={setFormData}
            focusedState={focusedState}
            setFocusedState={setFocusedState}
            setError={setError}
            error={error}
            field="description"
          />
          <InputForm
            formData={formData}
            setFormData={setFormData}
            focusedState={focusedState}
            setFocusedState={setFocusedState}
            setError={setError}
            error={error}
            field="content"
          />
          <DropDownForm
            formData={formData}
            setFormData={setFormData}
            error={error}
            setError={setError}
            field="postReason"
            openOptionsModal={openOptionsModal}
          />
          <MultiDropDownForm
            formData={formData}
            setFormData={setFormData}
            error={error}
            setError={setError}
            field="kibbeTypes"
            openOptionsModal={openOptionsModal}
          />
          <MultiDropDownForm
            formData={formData}
            setFormData={setFormData}
            error={error}
            setError={setError}
            field="seasonalColors"
            openOptionsModal={openOptionsModal}
          />
          <InputForm
            formData={formData}
            setFormData={setFormData}
            focusedState={focusedState}
            setFocusedState={setFocusedState}
            setError={setError}
            error={error}
            field="purchaseLink"
          />
          <TouchableOpacity onPress={handlePost} disabled={photoLoading} style={[styles.completeButton, styles.buttonContainer]}>
            <Text style={styles.completeButtonText}>Post</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={optionsModalIsVisible}
        onRequestClose={() => {
          setOptionsModalIsVisible(!optionsModalIsVisible);
        }}
      >
        <SafeAreaView style={styles.optionsModalContainer}>
          <View style={styles.optionsModal}>
            <View style={styles.toolbar}>
              <View style={styles.toolbarRight}>
                <Button title="Done" onPress={handleOptionsModalClose} />
              </View>
            </View>
            <Picker
              style={{ width: Dimensions.get("window").width, backgroundColor: "#e1e1e1" }}
              selectedValue={modalValue}
              onValueChange={handlePickerSelect}
            >
              {(modalOptions[currentModal] || []).map((val: string) => (
                <Picker.Item key={val} label={val} value={val} />
              ))}
            </Picker>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screenAreaView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderImageText: {
    fontSize: 10,
  },
  imageText: {
    fontSize: 15,
    color: "gray",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imageButton: {
    alignItems: "center",
    paddingTop: 7,
    paddingBottom: 12,
  },
  imageContainer: {
    alignItems: "center",
    paddingTop: 7,
    paddingBottom: 12,
    borderRadius: 500,
    width: 140,
  },
  images: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  uploadedImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width,
    marginBottom: 5,
  },
  addPhoto: {
    width: 25,
    height: 25,
    marginBottom: 5,
    opacity: 0.7,
  },
  dropDownCaret: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  dropDownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsPlaceholder: {
    fontSize: 25,
    color: "gray",
    paddingVertical: 3,
  },
  detailsAnswer: {
    fontSize: 25,
    fontWeight: "bold",
    paddingVertical: 3,
  },
  detailsTitle: {
    fontSize: 14,
    color: "gray",
    paddingVertical: 3,
  },
  error: {
    color: "red",
    fontSize: 10,
    fontWeight: "bold",
  },
  detailsContainer: {
    marginHorizontal: 20,
    borderColor: "#aaa",
    paddingVertical: 5,
  },
  buttonText: {},
  descriptionContainer: {
    marginTop: 20,
    marginLeft: 20,
  },
  picker: {
    margin: 20,
  },
  conditionContainer: {
    marginTop: 20,
    marginLeft: 20,
  },
  conditionText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  conditionValueText: {
    fontSize: 20,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  conditionPlaceHolderText: {
    fontSize: 20,
    color: "#bbb",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  genderContainer: {
    marginTop: 20,
    marginLeft: 20,
  },
  genderText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  genderValueText: {
    fontSize: 20,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  genderPlaceHolderText: {
    fontSize: 20,
    color: "#bbb",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  sizeContainer: {
    marginTop: 20,
    marginLeft: 20,
  },
  sizeText: {
    fontSize: 20,
    fontWeight: "bold",
    // borderBottomWidth: 1,
    // borderTopWidth: 1,
  },
  optionsModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0, .8)",
  },
  optionsModal: {
    position: "absolute",
    bottom: 0,
  },
  confirmModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0, .9)",
    justifyContent: "flex-end",
  },
  confirmModalTextContainer: {
    borderRadius: 25,
    backgroundColor: "white",
    margin: 20,
  },
  confirmModalText: {
    fontSize: 25,
    paddingVertical: 5,
    paddingHorizontal: 30,
    lineHeight: 33,
    textAlign: "center",
  },
  toolbar: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  toolbarRight: {
    alignSelf: "flex-end",
  },
  switchContainer: {
    marginTop: 20,
    marginLeft: 20,
  },
  switchText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  completeButton: {
    padding: 10,
    alignSelf: "center",
    borderRadius: 10,
    margin: 20,
    paddingLeft: 30,
    paddingRight: 30,
    width: 210,
  },
  confirmButton: {
    padding: 15,
    alignItems: "center",
    borderRadius: 27,
    margin: 20,
    paddingLeft: 30,
    paddingRight: 30,
  },
  completeButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    backgroundColor: "#f287d2",
    alignItems: "center",
  },
  closeIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    // position: "absolute",
    // top: 0,
  },
  closeIconContainer: {
    flex: 1,
    alignItems: "flex-end",
    marginHorizontal: 20,
  },
});
