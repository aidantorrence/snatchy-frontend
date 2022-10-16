import { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as ImagePicker from "expo-image-picker";
import { StyleSheet, Text, View, TextInput, Button, SafeAreaView, TouchableOpacity, Image, Alert } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import Checkbox from "expo-checkbox";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useMutation, useQueryClient } from "react-query";
import { postUser } from "../data/api";
import uploadImageAsync from "../utils/firebase/uploadImage";

const initialFormState = {
  userImage: "",
  firstName: "",
  lastName: "",
  sellerName: "",
  email: "",
  password: "",
};
const SignUpScreen: React.FC<StackScreenProps<any>> = ({ navigation, route }) => {
  const [formData, setFormData] = useState(initialFormState) as any;
  const [value, setValue] = useState({
    email: "",
    password: "",
    error: "",
  });
  const [isChecked, setIsChecked] = useState(false);

  const queryClient = useQueryClient();
  const mutation: any = useMutation((data) => postUser(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("currentUser");
      queryClient.invalidateQueries("userTrades");
      queryClient.invalidateQueries("userOffers");
    },
  });

  const auth = getAuth();

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
      const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      mutation.mutate({
        uid: user.uid,
        ...formData,
        password: undefined,
      });
      // navigation.goBack();
      // navigation.navigate(route.name);
      navigation.navigate("HomeTabs", {
        screen: "CreateStack",
        //   params: {
        //     screen: "ShippingDetails",
        //     id,
        //     ownerId,
        //   },
      });
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
    // clear form error
    // setError({ ...error, images: "" });

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

    if (!result?.cancelled) {
      uploadImageAsync(result.uri).then((url) => {
        formData.userImage = url;
        setFormData({ ...formData });
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {!!value.error && (
        <View style={styles.error}>
          <Text>{value.error}</Text>
        </View>
      )}

      {/* <Text style={styles.title}>GET STARTED</Text> */}
      <TouchableOpacity style={styles.imageContainer} onPress={launchPhotosAlert}>
        <Image
          source={formData.userImage ? { uri: formData.userImage } : require("../assets/Default_Profile.png")}
          style={styles.images}
        />
      </TouchableOpacity>
      <Text style={styles.profile}>Add Profile Photo</Text>
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
          placeholder="Shop Name (optional)"
          style={styles.control}
          value={formData.sellerName}
          onChangeText={(text: string) => setFormData({ ...formData, sellerName: text })}
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
        <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.signInButtonText}>Already signed up? Sign in instead</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  linkText: {
    color: "darkblue",
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    margin: 10,
  },
  imageContainer: {
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
    color: "#2b414d",
    fontSize: 16,
  },
  images: {
    borderRadius: 500,
    width: 120,
    height: 120,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#2b414d",
    borderRadius: 50,
    padding: 10,
    width: 150,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2b414d",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  controls: {
    flex: 1,
  },

  control: {
    paddingVertical: 10,
    borderColor: "#2b414d",
    borderBottomWidth: 1,
    fontSize: 20,
  },

  error: {
    marginTop: 10,
    padding: 10,
    color: "#fff",
    backgroundColor: "#D54826FF",
  },
});

export default SignUpScreen;
