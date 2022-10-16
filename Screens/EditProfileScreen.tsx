import { useState } from "react";
import { View, Text, SafeAreaView, Image, Button, StyleSheet, TouchableOpacity, Alert, TextInput } from "react-native";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchUser, updateUser } from "../data/api";
import { useStore } from "../utils/firebase/useAuthentication";
import * as ImagePicker from "expo-image-picker";
import uploadImageAsync from "../utils/firebase/uploadImage";

export default function EditProfileScreen({ navigation, route }: any) {
  const user = useStore((state) => state.user);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    sellerName: "",
    userImage: '',
  });

  const queryClient = useQueryClient();
  const mutation: any = useMutation((data) => updateUser(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("currentUser");
      queryClient.invalidateQueries("listings");
    },
  });
  const { data: userData, isLoading } = useQuery(["currentUser", user?.uid], () => fetchUser(user?.uid), {
    enabled: !!user?.uid,
  });

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
        formData.userImage = url as any;
        setFormData({ ...formData });
      });
    }
  };

  const handleUpdatePress = async () => {
    mutation.mutateAsync({
      ...formData,
      uid: user?.uid,
    });
    navigation.goBack()
  }

  return (
    <>
      {isLoading ? (
        <Text>Loading</Text>
      ) : (
        <SafeAreaView style={styles.profileScreenContainer}>
          <TouchableOpacity style={{ display: "flex", alignItems: "center" }} onPress={launchPhotosAlert}>
            {userData?.userImage || formData.userImage ? (
            <Image
              source={{ uri: formData.userImage || userData?.userImage }}
              style={{ width: 120, height: 120, borderRadius: 100, borderWidth: 1 }}
            />
            ) : (
              <>
                <View style={{ borderRadius: 100, borderWidth: 1, padding: 10, marginBottom: 10 }}>
                  <Image source={require("../assets/Add_Profile_Logo.png")} style={{ width: 120, height: 120 }} />
                </View>
                <Text style={styles.caption}>Add Profile Picture</Text>
              </>
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
              placeholder="Shop Name (optional)"
              style={styles.control}
              value={formData.sellerName}
              onChangeText={(text: string) => setFormData({ ...formData, sellerName: text })}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleUpdatePress}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    backgroundColor: "#2b414d",
    borderRadius: 50,
    padding: 10,
    width: 150,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  control: {
    paddingVertical: 10,
    borderColor: "#2b414d",
    borderBottomWidth: 1,
    fontSize: 20,
  },
  controls: {
    margin: 20,
    flex: 1,
  },
  caption: {},
  profileScreenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  userImagesContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  userImages: {
    width: 80,
    height: 80,
    margin: 10,
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
  // button: {
  //   backgroundColor: "white",
  //   borderWidth: 0.5,
  //   borderRadius: 30,
  //   padding: 4,
  //   paddingTop: 1,
  //   paddingBottom: 1,
  //   marginTop: 5,
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 1,
  //   },
  //   shadowOpacity: 1,
  //   shadowRadius: 1,
  //   elevation: 2,
  //   marginRight: 15,
  // },
});
