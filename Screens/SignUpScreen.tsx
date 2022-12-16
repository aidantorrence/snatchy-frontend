import { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as ImagePicker from "expo-image-picker";
import { StyleSheet, Text, View, TextInput, Button, SafeAreaView, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import Checkbox from "expo-checkbox";
import auth from "@react-native-firebase/auth";

import { useMutation, useQueryClient } from "react-query";
import { postUser } from "../data/api";
import uploadImageAsync from "../utils/firebase/uploadImage";
import analytics from "@react-native-firebase/analytics";
import FastImage from "react-native-fast-image";
import { mixpanel } from "../utils/mixpanel";
import { useStore } from "../utils/firebase/useAuthentication";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const initialFormState = {
  userImage: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};
const SignUpScreen: React.FC<StackScreenProps<any>> = ({ navigation, route }) => {
  const [error, setError] = useState('');
  const firebaseAuth = auth();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [formData, setFormData] = useState(initialFormState) as any;
  const [value, setValue] = useState({
    email: "",
    password: "",
    error: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  const queryClient = useQueryClient();
  const mutation: any = useMutation((data) => postUser(data), {
    onSuccess: (data) => {
      setUser({ ...data, ...user });
      queryClient.setQueryData("currentUser", data);
    },
  });

  async function signUp() {
    if (formData.firstName === "" || formData.lastName === "") {
      setValue({
        ...value,
        error: "First and Last Name are required",
      });
      return;
    }
    if (formData.email === "" || formData.password === "") {
      setValue({
        ...value,
        error: "Email and password are mandatory.",
      });
      return;
    }
    if (!isChecked) {
      setValue({
        ...value,
        error: "You must agree to the terms and conditions.",
      });
      return;
    }

    try {
      const { user } = await firebaseAuth.createUserWithEmailAndPassword(formData.email, formData.password);
      mutation.mutate({
        uid: user.uid,
        ...formData,
        password: undefined,
      });
      analytics().logSignUp({ method: "email" });
      mixpanel.track("sign_up");
      // navigation.goBack();
      // navigation.navigate(route.name);
      // navigation.navigate("HomeTabs", {
      //   screen: "CreateStack",
      //   //   params: {
      //   //     screen: "ShippingDetails",
      //   //     id,
      //   //     ownerId,
      //   //   },
      // });
    } catch (error: any) {
      setValue({
        ...value,
        error: error?.message,
      });
    }
  }
  const handleTermsAndConditionsPress = () => {
    WebBrowser.openBrowserAsync("https://github.com/aidantorrence/Instaheat-Documents/blob/main/Terms%20And%20Conditions.md");
  };

  const launchPhotosAlert = () => {
    setError("")
    Alert.alert("Take a Photo", "Select from Camera Roll", [
      {
        text: "Take a Photo",
        onPress: () => pickImage(true),
      },
      {
        text: "Select from Camera Roll",
        onPress: () => pickImage(false),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };
  const pickImage = async (takePhoto: boolean) => {
    // clear form error
    // setError({ ...error, images: "" });

    let result: any;

    if (takePhoto) {
      // take a photo
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      // if permission not granted, return
        if (status !== "granted") { 
          setError("camera access is required, go to settings -> looksmax -> camera to enable camera access")
          return;
        }

      result = await ImagePicker.launchCameraAsync();
      analytics().logEvent("take_profile_picture");
      mixpanel.track("take_profile_picture");
    } else {
      // No permissions request is necessary for launching the image library
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.1,
      });
      analytics().logEvent("select_profile_picture");
      mixpanel.track("select_profile_picture");
    }

    if (!result?.canceled) {
      uploadImageAsync(result.uri).then((url) => {
        formData.userImage = url;
        setFormData({ ...formData });
      });
      analytics().logEvent("upload_profile_picture");
      mixpanel.track("upload_profile_picture");
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {!!value.error && (
        <View style={styles.error}>
          <Text>{value.error}</Text>
        </View>
      )}
      <KeyboardAwareScrollView contentContainerStyle={styles.containerContent} style={styles.container}>
        <TouchableOpacity style={styles.imageButton} onPress={launchPhotosAlert}>
          {formData.userImage ? (
            <>
              <FastImage source={{ uri: formData.userImage }} style={styles.images} />
              <Text style={styles.imageText}>Replace Photo</Text>
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
          <TextInput
            placeholder="Email"
            style={styles.control}
            value={formData.email}
            onChangeText={(text: string) => setFormData({ ...formData, email: text })}
          />

          <TextInput
            placeholder="Password"
            style={styles.control}
            value={formData.password}
            onChangeText={(text: string) => setFormData({ ...formData, password: text })}
            secureTextEntry={true}
          />
          <View style={styles.checkboxContainer}>
            <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setIsChecked} />
            <View>
              <Text> Agree to the </Text>
            </View>
            <TouchableOpacity onPress={handleTermsAndConditionsPress}>
              <Text style={styles.linkText}>Terms and Conditions</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={signUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() =>navigation.navigate('SignIn')}>
            <Text style={styles.signInButtonText}>Already signed up? Sign in instead</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
    color: 'red',
    width: 280,
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
    alignItems: 'center',
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
    color: '#666',
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
    backgroundColor: '#666',
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
    borderBottomWidth: .5,
    fontSize: 16,
  },
  error: {
    marginTop: 10,
    padding: 10,
    color: "#fff",
    backgroundColor: "#D54826FF",
  },

});

export default SignUpScreen;
