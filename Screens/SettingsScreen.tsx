// import { deleteUser as deleteUserFirebase, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth/react-native";
import { useState } from "react";
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, Alert, View } from "react-native";
import { deleteUser } from "../data/api";
import * as WebBrowser from "expo-web-browser";
import auth from "@react-native-firebase/auth";

export default function SettingsScreen({ navigation, route }: any) {
  const [password, setPassword] = useState("");
  const firebaseAuth = auth();
  const user = firebaseAuth.currentUser;

  let isLoading;

  const handleDeletePress = async (value: any) => {
    let credential;
    try {
      credential = await firebaseAuth.signInWithEmailAndPassword(firebaseAuth?.currentUser?.email as any, value);
    } catch (e) {
      console.log(e, "sign in failed");
    }
    try {
      await user?.delete();
      await deleteUser(credential?.user?.uid);
    } catch (e) {
      console.log(e, "delete failed");
    }
  };

  const handleDeleteAccount = async () => {
    Alert.prompt(
      "Enter password",
      "Enter your password to delete your account",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: handleDeletePress,
        },
      ],
      "secure-text"
    );
  };
  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handlePrivacyPolicy = () => {
    WebBrowser.openBrowserAsync("https://github.com/aidantorrence/Instaheat-Documents/blob/main/Privacy%20Policy.md");
  };
  const handleTermsAndConditions = () => {
    WebBrowser.openBrowserAsync("https://github.com/aidantorrence/Instaheat-Documents/blob/main/Terms%20And%20Conditions.md");
  };

  const handleLogout = () => {
    firebaseAuth.signOut();
    navigation.navigate("HomeTabs");
  };
  const handleSettingsClick = () => {
    navigation.navigate("Settings");
  };
  return (
    <>
      {isLoading ? (
        <Text>Loading</Text>
      ) : (
        <SafeAreaView style={styles.profileScreenContainer}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Settings</Text>
            </View>
            <TouchableOpacity style={styles.linkContainer} onPress={handleTermsAndConditions}>
            </TouchableOpacity>
          {/* <TouchableOpacity style={styles.linkContainer} onPress={handleEditProfile}>
            <Text>Edit Profile</Text>
          </TouchableOpacity> */}
            <TouchableOpacity style={styles.linkContainer} onPress={handleTermsAndConditions}>
              <Text style={styles.linkText}>Terms and Conditions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkContainer} onPress={handlePrivacyPolicy}>
              <Text style={styles.linkText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkContainer} onPress={handleLogout}>
              <Text style={styles.linkText}>Log Out</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkContainer} onPress={handleDeleteAccount}>
              <Text style={styles.linkText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 26,
  },
  header: {
    alignItems: "center",
    // margin: 25,
  },
  container: {
    flex: 1,
    width: "100%",
  },
  profileScreenContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  linkContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  linkText: {
    fontSize: 16, 
  }
});
