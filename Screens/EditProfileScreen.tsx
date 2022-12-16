import { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchUser, updateUser } from "../data/api";
import { useStore } from "../utils/firebase/useAuthentication";
import * as ImagePicker from "expo-image-picker";
import uploadImageAsync from "../utils/firebase/uploadImage";
import FastImage from "react-native-fast-image";
import Checkbox from "expo-checkbox";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { mixpanel } from "../utils/mixpanel";
import { Linking } from 'react-native';

export default function EditProfileScreen({ navigation, route }: any) {
  const user = useStore((state) => state.user);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [error, setError] = useState('');

  const queryClient = useQueryClient();
  const mutation: any = useMutation((data) => updateUser(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("currentUser");
      queryClient.invalidateQueries("outfits");
    },
  });
  const { data: userData, isLoading } = useQuery(["currentUser", user?.uid], () => fetchUser(user?.uid), {
    enabled: !!user?.uid,
    onSuccess: (data) => {
      setFormData({
        firstName: data?.firstName,
        lastName: data?.lastName,
        userImage: data?.userImage,
      });
    },
  });

  const [formData, setFormData] = useState({
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    userImage: userData?.userImage,
  });

  const cameraAccessAlert = () => {
  Alert.alert("LooksMax Would Like Access to Your Camera", "Camera access can be configured in your Settings", [
    {
      text: "OK",
      onPress: () => Linking.openSettings(),
    },
    {
      text: "Don't Allow",
      style: "cancel",
    },
  ]);
  
  }

  const launchPhotosAlert = () => {
    Alert.alert("Take a Photo", "Select from Camera Roll", [
      {
        text: "Take a Photo",
        onPress: () => pickImage(true),
      },
      {
        text: "Select from Camera Roll",
        onPress: () => pickImage(false),
      },
    ]);
  };
  const pickImage = async (takePhoto: boolean) => {
    setError("")
    // clear form error
    // setError({ ...error, images: "" });
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
        mixpanel.track("take_profile_picture");
      } else {
        // No permissions request is necessary for launching the image library
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 0.1,
        });
        mixpanel.track("select_profile_picture");
      }

      if (!result?.canceled) {
        uploadImageAsync(result.uri).then((url) => {
          formData.userImage = url as any;
          setFormData({ ...formData });
        });
      }
      mixpanel.track("upload_profile_picture");
    } catch (e) {
      setPhotoLoading(false);
    }
    setPhotoLoading(false);
  };

  const handleUpdatePress = async () => {
    mutation.mutateAsync({
      ...formData,
      uid: user?.uid,
    });
    navigation.goBack();
  };

  return isLoading ? (
    <SafeAreaView style={styles.screenAreaView}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.safeAreaContainer}>
      <KeyboardAwareScrollView contentContainerStyle={styles.containerContent} style={styles.container}>
        <TouchableOpacity style={styles.imageButton} onPress={launchPhotosAlert}>
          {formData.userImage ? (
            <>
              <FastImage source={{ uri: formData.userImage }} style={styles.images} />
              <Text style={styles.imageText}>Replace Photo</Text>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </>
          ) : photoLoading ? (
            <ActivityIndicator size="large" />
          ) : (
            <View style={styles.imageContainer}>
              <FastImage source={require("../assets/Plus_Button.png")} style={styles.addPhoto} />
              <Text style={styles.placeholderImageText}>Add Profile Photo</Text>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.controls}>
          <TextInput
            placeholder="First Name"
            style={styles.control}
            value={formData.firstName}
            onChangeText={(text: string) => setFormData({ ...formData, firstName: text })}
          />
          <TextInput
            placeholder="Last Name"
            style={styles.control}
            value={formData.lastName}
            onChangeText={(text: string) => setFormData({ ...formData, lastName: text })}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleUpdatePress}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
    color: 'red',
    width: 280,
  },
  screenAreaView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageButton: {
    flex: 1,
    flexBasis: 1,
    alignItems: "center",
    paddingTop: 7,
    paddingBottom: 12,
  },
  imageText: {
    fontSize: 15,
    color: "gray",
  },
  addPhoto: {
    width: 25,
    height: 25,
    marginBottom: 5,
    opacity: 0.7,
  },
  placeholderImageText: {
    fontSize: 10,
  },
  linkText: {
    color: "pink",
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    margin: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  profile: {
    fontSize: 14,
    color: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signInButton: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  signInButtonText: {
    color: "#666",
    fontSize: 16,
  },
  images: {
    borderRadius: 500,
    width: 120,
    height: 120,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#666",
    borderRadius: 50,
    padding: 10,
    width: 150,
  },
  title: {
    marginTop: 20,
    alignItems: "center",
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  safeAreaContainer: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  container: {
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  containerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  controls: {},

  control: {
    paddingVertical: 7,
    borderColor: "black",
    borderBottomWidth: 0.5,
    fontSize: 16,
    width: Dimensions.get("window").width - 40,
  },
  error: {
    marginTop: 10,
    padding: 10,
    color: "#fff",
    backgroundColor: "#D54826FF",
  },
});
