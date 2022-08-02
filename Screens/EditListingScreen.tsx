import { Picker } from "@react-native-picker/picker";
import { useRef } from "react";
import { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Button,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { EditDropDownForm, EditInputForm } from "../Components/Forms";
import { fetchListing, updateListing } from "../data/api";
import * as ImagePicker from "expo-image-picker";
import uploadImageAsync from "../utils/firebase/uploadImage";

export default function EditListingScreen({ navigation, route }: any) {
  const [formData, setFormData] = useState({
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
  });
  const [error, setError] = useState({
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
  const [editMode, setEditMode] = useState({
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
  const [currentModal, setCurrentModal] = useState("");
  const [optionsModalIsVisible, setOptionsModalIsVisible] = useState(false);
  const [inputModalIsVisible, setInputModalIsVisible] = useState(false);
  const [modalValue, setModalValue] = useState("");
  const { id } = route.params;
  const { data, isLoading } = useQuery(`listing-${id}`, () => fetchListing(id));
  const photosToAdd = 10 - data?.images?.length || 0;

  const modalOptions = {
    condition: ["", "Brand New", "Used - Excellent", "Used - Good", "Used - Fair"],
    gender: ["", "Mens", "Womens"],
    boxCondition: ["", "Good", "Damaged", "None"],
    canTrade: ["", "Yes", "No"],
  } as any;

  const queryClient = useQueryClient();
  const mutation: any = useMutation((data) => updateListing(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
      queryClient.invalidateQueries("listings");
      queryClient.invalidateQueries(`listing-${id}`);
    },
  });

  const openOptionsModal = (val: string) => {
    setCurrentModal(val);
    setOptionsModalIsVisible(true);
    setModalValue(data[val]);
  };

  const openInputModal = (val: string) => {
    setCurrentModal(val);
    setInputModalIsVisible(true);
    setModalValue(data[val]);
  };

  const handleOptionsModalClose = () => {
    mutation.mutate({
      id,
      [currentModal]: currentModal === "canTrade" ? modalValue === "Yes" : modalValue,
    });
    setModalValue("");
    setOptionsModalIsVisible(false);
  };

  const handleInputModalClose = () => {
    mutation.mutate({
      id,
      [currentModal]: modalValue,
    });
    setModalValue("");
    setInputModalIsVisible(false);
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
        { text: "Cancel", style: "cancel" },
      ]);
    } else {
      launchPhotosAlert();
    }
  };

  const launchPhotosAlert = (index?: number) => {
    Alert.alert("Take a Photo or Select from Camera Roll", "", [
      {
        text: "Take a Photo",
        onPress: () => pickImage(true, index),
      },
      {
        text: "Select from Camera Roll",
        onPress: () => pickImage(false, index),
      },
    ]);
  };

  const handleReplacePhoto = (url: string, index: number) => {
    data.images[index] = url;
    mutation.mutate({
      id,
      images: data.images,
    });
  };

  const handleDeletePhoto = (index: number) => {
    const filteredImages = data.images.filter((img: any, idx: number) => idx !== index);
    mutation.mutate({
      id,
      images: filteredImages,
    });
  };

  const pickImage = async (takePhoto: boolean, index: number | undefined) => {
    // clear form error
    setError({ ...error, images: "" });

    let result: any;

    if (takePhoto) {
      // take a photo
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      // if permission not granted, return
      if (status !== "granted") return;

      result = await ImagePicker.launchCameraAsync();
    } else {
      // No permissions request is necessary for launching the image library
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
    }

    if (!result.cancelled) {
      uploadImageAsync(result.uri).then((url) => {
        console.log(url);
        if (index !== undefined) {
          handleReplacePhoto(url, index);
        } else {
          mutation.mutate({
            id,
            images: [...data.images, url],
          });
        }
      });
    }
  };

  return (
    !isLoading && (
      <>
        <SafeAreaView style={styles.container}>
          <ScrollView>
            {/* <Text style={styles.detailsTitle}>Photos</Text> */}
            <ScrollView style={styles.imageContainer} horizontal={true}>
              {data.images.map((image: string, index: number) => (
                <TouchableOpacity key={index} onPress={() => editPhoto(index)}>
                  <Image source={{ uri: image }} style={styles.images} />
                </TouchableOpacity>
              ))}
              {Array(photosToAdd)
                .fill("")
                .map((val, idx) => (
                  <TouchableOpacity key={idx} onPress={() => editPhoto()}>
                    <Image source={require("../assets/Add_Photos.png")} style={styles.images} />
                  </TouchableOpacity>
                ))}
            </ScrollView>
            <EditInputForm
              data={data}
              formData={formData}
              setFormData={setFormData}
              editMode={editMode}
              setEditMode={setEditMode}
              setError={setError}
              error={error}
              field="name"
              openInputModal={openInputModal}
            />
            <EditInputForm
              data={data}
              formData={formData}
              setFormData={setFormData}
              editMode={editMode}
              setEditMode={setEditMode}
              setError={setError}
              error={error}
              field="price"
              openInputModal={openInputModal}
              keyboardType="numeric"
            />
            <EditDropDownForm
              data={data}
              formData={formData}
              editMode={editMode}
              setEditMode={setEditMode}
              error={error}
              setError={setError}
              field="condition"
              openOptionsModal={openOptionsModal}
            />
            {data.condition !== "Brand New" ? (
              <>
                <EditInputForm
                  data={data}
                  formData={formData}
                  setFormData={setFormData}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  setError={setError}
                  error={error}
                  field="timesWorn"
                  openInputModal={openInputModal}
                  keyboardType="numeric"
                />
                <EditInputForm
                  data={data}
                  formData={formData}
                  setFormData={setFormData}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  setError={setError}
                  error={error}
                  field="scuffMarks"
                  openInputModal={openInputModal}
                />
                <EditInputForm
                  data={data}
                  formData={formData}
                  setFormData={setFormData}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  setError={setError}
                  error={error}
                  field="discoloration"
                  openInputModal={openInputModal}
                />
                <EditInputForm
                  data={data}
                  formData={formData}
                  setFormData={setFormData}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  setError={setError}
                  error={error}
                  field="looseThreads"
                  openInputModal={openInputModal}
                />
                <EditInputForm
                  data={data}
                  formData={formData}
                  setFormData={setFormData}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  setError={setError}
                  error={error}
                  field="heelDrag"
                  openInputModal={openInputModal}
                />
                <EditInputForm
                  data={data}
                  formData={formData}
                  setFormData={setFormData}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  setError={setError}
                  error={error}
                  field="toughStains"
                  openInputModal={openInputModal}
                />
              </>
            ) : null}
            <EditDropDownForm
              data={data}
              formData={formData}
              editMode={editMode}
              setEditMode={setEditMode}
              error={error}
              setError={setError}
              field="gender"
              openOptionsModal={openOptionsModal}
            />
            <EditInputForm
              data={data}
              formData={formData}
              setFormData={setFormData}
              editMode={editMode}
              setEditMode={setEditMode}
              setError={setError}
              error={error}
              field="size"
              openInputModal={openInputModal}
              keyboardType="numeric"
            />
            <EditDropDownForm
              data={data}
              formData={formData}
              editMode={editMode}
              setEditMode={setEditMode}
              error={error}
              setError={setError}
              field="boxCondition"
              openOptionsModal={openOptionsModal}
            />
            <EditDropDownForm
              data={data}
              formData={formData}
              editMode={editMode}
              setEditMode={setEditMode}
              error={error}
              setError={setError}
              field="canTrade"
              openOptionsModal={openOptionsModal}
            />
          </ScrollView>
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
                selectedValue={modalValue || data[currentModal]}
                onValueChange={(val) => setModalValue(val)}
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
          visible={inputModalIsVisible}
          onRequestClose={() => {
            setInputModalIsVisible(!inputModalIsVisible);
          }}
        >
          <KeyboardAwareScrollView contentContainerStyle={styles.optionsModalContainer}>
            <View style={styles.optionsModal}>
              <View style={styles.inputToolbar}>
                <Text style={styles.inputToolbarText}>{currentModal}</Text>
                <Button style={styles.inputToolbarText} title="Done" onPress={handleInputModalClose} />
              </View>
              <View style={{ height: 200 }}>
                <TextInput
                  value={modalValue}
                  onChangeText={(val) => setModalValue(val)}
                  autoCorrect={false}
                  style={{ width: Dimensions.get("window").width, backgroundColor: "white", fontSize: 25 }}
                  autoFocus={true}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Modal>
      </>
    )
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    paddingTop: 7,
    paddingBottom: 12,
  },
  images: {
    width: 80,
    height: 80,
    marginRight: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  userImagesContainer: {},
  userImages: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    margin: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 28,
    marginTop: 10,
    marginBottom: 10,
  },
  placeholder: {
    color: "gray",
  },
  header: {
    fontWeight: "bold",
    fontSize: 28,
    marginTop: 10,
    marginBottom: 5,
  },
  body: {
    fontSize: 22,
  },
  bio: {
    fontSize: 17,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  button: {
    backgroundColor: "white",
    borderWidth: 0.5,
    borderRadius: 30,
    padding: 4,
    paddingTop: 1,
    paddingBottom: 1,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
    marginRight: 15,
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
  inputToolbar: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputToolbarText: {
    fontSize: 14,
    textTransform: "capitalize",
    color: "gray",
  },
  toolbar: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  toolbarRight: {
    alignSelf: "flex-end",
  },
});
