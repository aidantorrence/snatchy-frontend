import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { celebrities } from "../data/assets";
import {
  useFonts,
  LobsterTwo_400Regular,
  LobsterTwo_400Regular_Italic,
  LobsterTwo_700Bold,
  LobsterTwo_700Bold_Italic,
} from "@expo-google-fonts/lobster-two";

export default function GenerateOutfitIntroScreen({ navigation, route }: any) {
  const [chosenUser, setChosenUser] = useState("currentUser");
  const [fontsLoaded] = useFonts({
    LobsterTwo_400Regular,
    LobsterTwo_400Regular_Italic,
    LobsterTwo_700Bold,
    LobsterTwo_700Bold_Italic,
  });
  const handleNavigateNextPage = (chosenUser: any) => {
    if (chosenUser === "currentUser") {
      console.log('chosenUser chosen', chosenUser)
      navigation.navigate("GenerateOutfitChooseSelfies", {
        screen: "GenerateOutfitChooseSelfies",
        params: {
          screen: "GenerateOutfitChooseSelfies",
          chosenUser,
        },
      });
    } else {
      navigation.navigate("GenerateOutfitTryOn", { chosenUser });
    }
  };

  return !fontsLoaded ? (
    <SafeAreaView style={styles.screenAreaView}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Who do you want to try the outfit on?</Text>
        </View>
        <Pressable
          onPress={() => {
            setChosenUser("currentUser");
          }}
          style={styles.myselfTextContainer}
        >
          <Text style={styles.myselfText}>Myself</Text>
        </Pressable>
        <View style={styles.someoneElseContainer}>
          <Text style={styles.myselfText}>Someone Else</Text>
          <Text style={styles.chooseBelowText}>(choose from below)</Text>
        </View>
        <View style={styles.flashListContainer}>
          <FlatList
            numColumns={3}
            data={celebrities}
            renderItem={({ item }: any) => {
              return (
                <Pressable style={styles.imageContainer} onPress={() => setChosenUser(item?.name)}>
                  <FastImage source={item.imgSrc} style={[styles.image, chosenUser === item?.name && styles.chosenImage]} />
                  <Text style={styles.imageText}>{item.name}</Text>
                </Pressable>
              );
            }}
            keyExtractor={(item) => item.id}
          />
        </View>
      <View style={styles.buttonContainer}>
        <Pressable onPress={() => handleNavigateNextPage(chosenUser)} style={styles.continueButton}>
          <Text style={styles.continueButtonText}>NEXT</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  someoneElseContainer: {
    marginTop: 45,
  },
  chosenImage: {
    borderColor: "purple",
    borderWidth: 2,
    borderRadius: 40,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  imageText: {
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    width: Dimensions.get("window").width * 0.29,
  },
  imageContainer: {
    marginHorizontal: (Dimensions.get("window").width * 0.13) / 6,
    marginBottom: 20,
  },
  flashListContainer: {
    flex: 1,
    marginTop: 40,
    marginBottom: 25,
    // marginLeft: Dimensions.get("window").width * .032,
    // width: Dimensions.get("window").width * 1,
  },
  screenAreaView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  myselfTextContainer: {
    marginTop: 69,
  },
  myselfText: {
    fontSize: 30,
    fontFamily: "LobsterTwo_700Bold_Italic",
    textAlign: "center",
  },
  chooseBelowText: {
    fontSize: 25,
    color: "gray",
    fontFamily: "LobsterTwo_700Bold_Italic",
    textAlign: "center",
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 55,
    justifyContent: "center",
  },
  title: {
    width: Dimensions.get("window").width * 0.43,
    textAlign: "center",
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    // alignItems: "center",
  },
  image: {
    width: Dimensions.get("window").width * 0.29,
    height: Dimensions.get("window").width * 0.29,
  },
  continueButtonText: {
    fontSize: 16,
    textAlign: "center",
  },
  continueButton: {
    marginVertical: 10,
    borderRadius: 8,
    padding: 15,
    width: Dimensions.get("window").width * 0.9,
    backgroundColor: "#f2f2f2",
  },
});
