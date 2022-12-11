import {
  View,
  Text,
  SafeAreaView,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { blockUser, deleteUser, fetchUser, postSeasonalColorInput } from "../data/api";
import useAuthentication, { useStore } from "../utils/firebase/useAuthentication";
import { modusTypes } from "./QuizSuccessScreen";
import FastImage from "react-native-fast-image";
import { useUpdateUser } from "../data/mutations";
import uploadImageAsync from "../utils/firebase/uploadImage";
import * as ImagePicker from "expo-image-picker";
import { mixpanel } from "../utils/mixpanel";
import { useState } from "react";
import { ScreenStackHeaderBackButtonImage } from "react-native-screens";

export default function SeasonalColorsQuizIntroScreen({ navigation, route }: any) {
  const { mutate } = useUpdateUser() as any;
  const [isButtonClickLoading, setIsButtonClickLoading] = useState(false);
  const queryClient = useQueryClient();
  const user = useStore((state) => state.user);
  const [image, setImage] = useState(undefined as string | undefined);
  const [photoLoading, setPhotoLoading] = useState(false);
  const { data: currentUserData, isLoading: isCurrentUserLoading } = useQuery("currentUser", () => fetchUser(user?.uid));

  const isLoading = isCurrentUserLoading || isButtonClickLoading;

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
    setPhotoLoading(true);

    try {
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
          quality: 0.1,
        });
      }
      if (!result.canceled) {
        const url = await uploadImageAsync(result.uri);
        if (index !== undefined) {
          setImage(url);
        }
      }
    } catch (e) {
      setPhotoLoading(false);
    }
    setPhotoLoading(false);
  };

  const handleSubmitPicture = async () => {
    setIsButtonClickLoading(true);
    try {
      const data = await postSeasonalColorInput(user?.uid, image || "");
      mutate({ uid: user?.uid, seasonalColor: data?.Season?.Simple });
      navigation.navigate("SeasonalColorsQuizSuccess");
    } catch (e) {
      setIsButtonClickLoading(false);
    }
    setIsButtonClickLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <SafeAreaView style={styles.screenAreaView}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.profileScreenContainer}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.imageButton} onPress={launchPhotosAlert}>
              {image ? (
                <>
                  <FastImage source={{ uri: image }} style={styles.uploadedImage} />
                  <Text style={styles.imageText}>Replace Photo</Text>
                </>
              ) : photoLoading ? (
                <ActivityIndicator size="large" />
              ) : (
                <View style={styles.imageContainer}>
                  <FastImage source={require("../assets/Plus_Button.png")} style={styles.addPhoto} />
                  <Text style={styles.placeholderImageText}>Upload a Picture of Your Face</Text>
                </View>
              )}
            </TouchableOpacity>
            {image ? (
              <TouchableOpacity style={styles.continueButton} onPress={handleSubmitPicture}>
                <Text style={styles.continueButtonText}>Submit Picture</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  continueButton: {
    marginTop: 20,
    borderRadius: 8,
    padding: 15,
    marginHorizontal: Dimensions.get("window").width * 0.01,
    width: Dimensions.get("window").width * 0.44,
    backgroundColor: "#6F3284",
  },
  continueButtonText: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  placeholderImageText: {
    textAlign: 'center',
    fontSize: 15,
  },
  addPhoto: {
    width: 100,
    height: 100,
    marginBottom: 10,
    opacity: 0.7,
  },
  imageText: {
    fontSize: 15,
    color: "gray",
  },
  imageContainer: {
    alignItems: "center",
    paddingTop: 7,
    paddingBottom: 12,
    borderRadius: 500,
  },
  uploadedImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width,
    marginBottom: 5,
  },
  imageButton: {
    alignItems: "center",
    paddingTop: 7,
    paddingBottom: 12,
  },
  buttonsContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  styleProfileButton: {
    alignSelf: "center",
    borderWidth: 1,
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: "#d7d7d7",
    marginBottom: 20,
  },
  screenAreaView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userImage: {
    borderRadius: 50,
    width: 20,
    height: 20,
    marginRight: 5,
  },
  sellerName: {
    fontSize: 15,
    fontWeight: "bold",
  },
  modusTypeText: {
    fontSize: 14,
  },
  listingsHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: 20,
    marginHorizontal: 20,
  },
  profileScreenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  userImagesContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
  },
  userImages: {
    width: Dimensions.get("window").width * 0.315,
    height: Dimensions.get("window").width * 0.315,
  },
  imagesContainer: {
    marginRight: Dimensions.get("window").width * 0.03,
    marginBottom: Dimensions.get("window").width * 0.03,
  },
  noOutfitsImage: {
    width: 200,
    height: 200,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    fontWeight: "bold",
    fontSize: 22,
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
});
