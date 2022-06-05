import React, { useState, useEffect } from "react";
import {
  Switch,
  TextInput,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
  Text,
  Image,
  View,
  StyleSheet,
  SafeAreaView,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import { useMutation, useQueryClient } from "react-query";
import { postListing } from "../data/api";
import { DropDownForm, InputForm } from "../Components/Forms";

const modalOptions = {
  condition: ["", "Brand New", "Used - Excellent", "Used - Good", "Used - Fair"],
  gender: ["", "Mens", "Womens"],
  boxCondition: ["", "Good", "Damaged", "None"],
  canTrade: ["", "Yes", "No"],
} as any;

export default function CreateListingScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    images: ["https://picsum.photos/200/300"],
    name: "",
    condition: "",
    size: "",
    price: "",
    canTrade: "",
    gender: "",
    boxCondition: "",
    timesWorn: "",
    scuffMarks: "",
    discoloration: "",
    looseThreads: "",
    heelDrag: "",
    toughStains: "",
  }) as any;
  const [error, setError] = useState({
    images: "",
    name: "",
    condition: "",
    size: "",
    price: "",
    canTrade: "",
    gender: "",
    boxCondition: "",
    timesWorn: "",
    scuffMarks: "",
    discoloration: "",
    looseThreads: "",
    heelDrag: "",
    toughStains: "",
  }) as any;
  const [optionsModalIsVisible, setOptionsModalIsVisible] = useState(false);
  const [confirmModalIsVisible, setConfirmModalIsVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState("");
  const [modalValue, setModalValue] = useState("");
  const [focusedState, setFocusedState] = useState({
    name: false,
    price: false,
    size: false,
    timesWorn: false,
    scuffMarks: false,
    discoloration: false,
    looseThreads: false,
    heelDrag: false,
    toughStains: false,
  });
  const queryClient = useQueryClient();
  const mutation: any = useMutation((data) => postListing(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
      queryClient.invalidateQueries("listings");
    },
  });
  // const validateForm = () => {
  // switch (form) {
  //   case "images":
  //     if (!formData.images.length) setError({ ...error, images: "A photo is required" });
  //     break;
  //   case "name":
  //     if (!formData.name) setError({ ...error, name: "The field is required" });
  //     break;
  //   case "size":
  //     if (!formData.size) setError({ ...error, size: "The field is required" });
  //     break;
  //   case "price":
  //     if (!formData.price) setError({ ...error, price: "The field is required" });
  //     break;
  //   case "canTrade":
  //     if (!formData.canTrade) setError({ ...error, canTrade: "The field is required" });
  //     break;
  //   case "gender":
  //     if (!formData.gender) setError({ ...error, gender: "The field is required" });
  //     break;
  //   case "boxCondition":
  //     if (!formData.boxCondition) setError({ ...error, boxCondition: "The field is required" });
  //     break;
  // }
  // };

  const validateForm = () => {
    let isValid = true;
		if (!formData.images.length) {
			setError({ ...error, images: "A photo is required" });
			isValid = false;
		}
    for (const key in formData) {
			if (['timesWorn', 'scuffMarks', 'discoloration', 'looseThreads', 'heelDrag', 'toughStains'].includes(key)) continue;
      if (formData[key] === "") {
        setError((err: any) => ({ ...err, [key]: "This field is required" }));
        isValid = false;
      }
    }
    return isValid;
  };

  const handleSubmit = () => {
    const isValid = validateForm();
		console.log(isValid)
    if (isValid) setConfirmModalIsVisible(true);
  };

  // useEffect(() => {
  // 	pickImage();
  // }, []);

  const listing = {
    name: formData.name,
    condition: formData.condition,
    size: formData.size,
    price: formData.price,
    images: formData.images,
    boxCondition: formData.boxCondition,
    canTrade: formData.canTrade,
    description: "",
    listingDefects: [
      `scuffMarks: ${formData.discoloration}`,
      `discoloration: ${formData.discoloration}`,
      `looseThreads: ${formData.looseThreads}`,
      `heelDrag: ${formData.heelDrag}`,
      `toughStains: ${formData.toughStains}`,
    ],
    ownerId: 1,
  };

  const pickImage = async () => {
		// clear form error
		setError({ ...error, images: "" });

    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setFormData({ ...formData, images: [...formData.images, result.uri] });
    }
  };

  const handleImageReselect = async (index: number) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.cancelled) {
      formData.images[index] = result.uri;
      setFormData({ ...formData, images: [...formData.images] });
    }
  };

  const openOptionsModal = (val: string) => {
    setCurrentModal(val);
    setOptionsModalIsVisible(true);
  };
  const handlePickerSelect = (val: string) => {
    setModalValue(val);
  };
  const handleConfirmButtonClick = () => {
    mutation.mutate(listing);
    setConfirmModalIsVisible(false);
    navigation.navigate("Profile");
  };
  const handleOptionsModalClose = () => {
    formData[currentModal] = modalValue;
    setFormData({ ...formData });
    setOptionsModalIsVisible(false);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.detailsContainer}>
            {/* <Text style={styles.detailsTitle}>Photos</Text> */}
            <ScrollView style={styles.imageContainer} horizontal={true}>
              {formData.images.map((image: string, index: number) => (
                <TouchableOpacity key={index} onPress={() => handleImageReselect(index)}>
                  <Image source={{ uri: image }} style={styles.images} />
                </TouchableOpacity>
              ))}
              {[0, 1, 2, 3].map((val) => (
                <TouchableOpacity key={val} onPress={pickImage}>
                  <Image source={require("../assets/Add_Photos.png")} style={styles.images} />
                </TouchableOpacity>
              ))}
            </ScrollView>
						{error.images ? <Text style={styles.error}>{error.images}</Text> : null}
          </View>
          <InputForm
            formData={formData}
            setFormData={setFormData}
            focusedState={focusedState}
            setFocusedState={setFocusedState}
						setError={setError}
            error={error}
            field="name"
          />
          <InputForm
            formData={formData}
            setFormData={setFormData}
            focusedState={focusedState}
            setFocusedState={setFocusedState}
						setError={setError}
            error={error}
            field="price"
            keyboardType="numeric"
          />
          <DropDownForm formData={formData} error={error} setError={setError} field="condition" openOptionsModal={openOptionsModal} />
          {formData.condition && formData.condition !== "Brand New" ? (
            <>
              <InputForm
                formData={formData}
                setFormData={setFormData}
                focusedState={focusedState}
                setFocusedState={setFocusedState}
								setError={setError}
                error={error}
                field="timesWorn"
                keyboardType="numeric"
              />
              <InputForm
                formData={formData}
                setFormData={setFormData}
                focusedState={focusedState}
                setFocusedState={setFocusedState}
								setError={setError}
                error={error}
                field="scuffMarks"
              />
              <InputForm
                formData={formData}
                setFormData={setFormData}
                focusedState={focusedState}
                setFocusedState={setFocusedState}
								setError={setError}
                error={error}
                field="discoloration"
              />
              <InputForm
                formData={formData}
                setFormData={setFormData}
                focusedState={focusedState}
                setFocusedState={setFocusedState}
								setError={setError}
                error={error}
                field="looseThreads"
              />
              <InputForm
                formData={formData}
                setFormData={setFormData}
                focusedState={focusedState}
                setFocusedState={setFocusedState}
								setError={setError}
                error={error}
                field="heelDrag"
              />
              <InputForm
                formData={formData}
                setFormData={setFormData}
                focusedState={focusedState}
                setFocusedState={setFocusedState}
								setError={setError}
                error={error}
                field="toughStains"
              />
            </>
          ) : null}
          <DropDownForm formData={formData} error={error} setError={setError} field="gender" openOptionsModal={openOptionsModal} />
          <InputForm
            formData={formData}
            setFormData={setFormData}
            focusedState={focusedState}
            setFocusedState={setFocusedState}
						setError={setError}
            error={error}
            field="size"
            keyboardType="numeric"
          />
          <DropDownForm formData={formData} error={error} setError={setError} field="boxCondition" openOptionsModal={openOptionsModal} />
          <DropDownForm formData={formData} error={error} setError={setError} field="canTrade" openOptionsModal={openOptionsModal} />
          <TouchableOpacity onPress={handleSubmit} style={styles.buttonContainer}>
            <LinearGradient
              // Background Linear Gradient
              colors={["#aaa", "#aaa", "#333"]}
              locations={[0, 0.3, 1]}
              style={styles.completeButton}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.completeButtonText}>Complete</Text>
            </LinearGradient>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmModalIsVisible}
        onRequestClose={() => setConfirmModalIsVisible(!confirmModalIsVisible)}
      >
        <SafeAreaView style={styles.confirmModalContainer}>
          <TouchableOpacity onPress={() => setConfirmModalIsVisible(!confirmModalIsVisible)} style={styles.closeIconContainer}>
            <Image source={require("../assets/Close_Logo.png")} style={styles.closeIcon} />
          </TouchableOpacity>
          <View style={styles.confirmModalTextContainer}>
            <Text style={styles.confirmModalText}>Every flaw must be described and photographed.</Text>
            <Text style={styles.confirmModalText}>
              If anything isn't, the item will be sent back to you and you will be charged a $10 fee.
            </Text>
            <TouchableOpacity onPress={handleConfirmButtonClick} style={styles.buttonContainer}>
              <LinearGradient
                colors={["#aaa", "#aaa", "#333"]}
                locations={[0, 0.3, 1]}
                style={styles.confirmButton}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.completeButtonText}>Confirm Listing</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    paddingTop: 7,
    paddingBottom: 12,
  },
  images: {
    width: 80,
    height: 80,
    marginRight: 30,
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
    fontSize: 14,
    fontWeight: "bold",
  },
  detailsContainer: {
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#aaa",
    paddingVertical: 5,
  },
  buttonText: {},
  nameContainer: {
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
    padding: 15,
    alignItems: "center",
    borderRadius: 27,
    margin: 20,
    paddingLeft: 30,
    paddingRight: 30,
    width: 160,
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
