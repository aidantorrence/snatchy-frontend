import {
  deleteUser as deleteUserFirebase,
  getAuth,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth/react-native";
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
  ActivityIndicator,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { blockUser, deleteUser, fetchUser } from "../data/api";
import useAuthentication, { useStore } from "../utils/firebase/useAuthentication";
import * as WebBrowser from "expo-web-browser";
import { modusTypes } from "./QuizSuccessScreen";

export default function ViewProfileScreen({ navigation, route }: any) {
  const ownerId = route?.params?.ownerId;
  const queryClient = useQueryClient();
  const user = useStore((state) => state.user);
  let userData: any;
  let isLoading;
  const { data: currentUserData, isLoading: isCurrentUserLoading } = useQuery("currentUser", () => fetchUser(user?.uid));
  const { data: ownerData, isLoading: isOwnerLoading } = useQuery(`user-${ownerId}`, () => fetchUser(ownerId));
  if (ownerId) {
    isLoading = isOwnerLoading;
    userData = ownerData;
  } else {
    userData = currentUserData;
    isLoading = isCurrentUserLoading;
  }
  const isCurrentUser = !ownerId || user?.uid === ownerId;

  const mutateBlockUser: any = useMutation(() => blockUser(user?.uid, ownerId), {
    onSuccess: () => {
      queryClient.invalidateQueries("currentUser");
      queryClient.invalidateQueries("listings");
    },
  });

  const handlePress = (id: any) => {
    navigation.navigate("ViewOutfit", {
      id,
      ownerId: userData?.uid,
    });
  };

  const handleSettingsClick = () => {
    Alert.alert("Select action", "", [
      {
        text: "Edit Profile",
        onPress: () => navigation.navigate("EditProfile"),
      },
      {
        text: "View Settings",
        onPress: () => navigation.navigate("Settings"),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const handleBlockUser = () => {
    mutateBlockUser.mutate();
    navigation.navigate("HomeTabs");
  };

  const handleBlock = () => {
    Alert.alert("Are you sure you want to block this user?", "You will no longer see posts/messages from this user", [
      {
        text: "Block",
        onPress: handleBlockUser,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };
  const handleActionsClick = () => {
    Alert.alert("Select action", "", [
      {
        text: "Block",
        onPress: handleBlock,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  return (
    <>
      {isLoading ? (
        <SafeAreaView style={styles.screenAreaView}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.profileScreenContainer}>
          {isCurrentUser ? (
            <TouchableOpacity
              style={{ padding: 10, flexDirection: "row", justifyContent: "flex-end" }}
              onPress={handleSettingsClick}
            >
              <Image style={{ width: 15, height: 15 }} source={require("../assets/Settings.png")} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{ padding: 10, flexDirection: "row", justifyContent: "flex-end" }}
              onPress={handleActionsClick}
            >
              <Image style={{ width: 20, height: 20 }} source={require("../assets/Ellipsis_Logo.png")} />
            </TouchableOpacity>
          )}
          <View style={{ display: "flex", alignItems: "center", alignSelf: "center" }}>
            <Image
              source={userData?.userImage ? { uri: userData?.userImage } : require("../assets/Monkey_Profile_Logo.png")}
              style={{ width: 104, height: 104, borderRadius: 100 }}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 5, alignSelf: "center" }}>
            <Text style={styles.sellerName}>{userData?.firstName + " " + userData?.lastName}</Text>
            {userData?.userType === "EXPERT" ? (
              <Image source={require("../assets/Verified_Logo_2.png")} style={styles.userImage} />
            ) : null}
          </View>
          <View style={{ flexDirection: "row", alignSelf: "center", marginBottom: 20 }}>
            <Text style={styles.modusTypeText}>{modusTypes[userData?.modusType]}</Text>
          </View>
          <View>
            <FlatList
              horizontal={false}
              numColumns={3}
              columnWrapperStyle={styles.column}
              data={userData?.outfits}
              renderItem={({ item }: any) => (
                <TouchableOpacity style={styles.imagesContainer} onPress={() => handlePress(item.id)}>
                  <Image source={{ uri: item.images[0] }} style={styles.userImages} />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
            {/* {userData?.outfits?.length ? (
              <>
                <ScrollView contentContainerStyle={styles.userImagesContainer}>
                  {userData?.outfits.map((outfit: any, index: number) => (
                    <TouchableOpacity onPress={() => handlePress(outfit.id)} key={index}>
                      <Image source={{ uri: outfit.images[0] }} style={styles.userImages} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : (
              <View style={{ alignItems: "center" }}>
                <Image source={require("../assets/Banana_Logo.png")} style={styles.noOutfitsImage} />
                <Text style={{ textAlign: "center", fontSize: 20 }}>No Outfits Yet!</Text>
              </View>
            )} */}
          </View>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 12,
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
