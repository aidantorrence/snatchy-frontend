import { setUser } from "@sentry/react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { useQuery } from "react-query";
import { fetchUser } from "../data/api";
import { useUpdateUser } from "../data/mutations";
import { useStore } from "../utils/firebase/useAuthentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import analytics from "@react-native-firebase/analytics";
import FastImage from "react-native-fast-image";

export const modusTypes = {
  D: "Queen",
  DC: "Boss",
  FG: "Coquette",
  FN: "Supermodel",
  R: "Siren",
  SC: "Lady",
  SD: "Feline",
  SG: "Ingenue",
  SN: "Vixen",
  TR: "Femme Fatale",
} as any;

export default function QuizSuccessScreen({ navigation, route, refetch }: any) {
  const { mutate } = useUpdateUser() as any;
  const modusDescriptions = {
    D: `Your body is characterized by its length (literal or simply the impression of length). Your flesh gives the impression of firmness even at a higher weight. Your bones appear to be sharp. Long and tailored pieces with sharp touches suit you best.`,
    DC: `Your body is characterized by its balance. Your flesh is not overly soft nor firm (regardless of weight). Your silhouette is of a moderate length. You are suited best by tailored, minimalist and symmetrical styles. You can handle tiny dashes of sharp detailing.`,
    FG: `Your silhouette is characterized by its short appearance. You have firm flesh even at a higher weight and you notice some sharpness in the body. You are suited best by wearing sharp or geometric shapes and often shorter pieces so not to overwhelm your petite frame. You may be able to get away with some avant-garde styles that others can’t.`,
    FN: `Your body is characterized by its length (literal or simply the impression of length). Your flesh remains firm even at higher weights. You have a strong frame that can “stand up” against clothing. Your body has a natural structure to it which makes you a great “hanger” for clothing. Because your body already has structure, it doesn’t need structure in clothing. In fact, structured clothing will fight against the natural structure you have. A relaxed style of clothing lets your bone structure shine.`,
    R: `Your silhouette is characterized by its short appearance. You have soft flesh even at a lower weight. You can see only round shapes in your silhouette. You find you have little bone structure and so your flesh dominates your appearance. You look best in curve-hugging clothing with ornate and rounded details.`,
    SC: `Your body is characterized by its balance. Your flesh is not overly soft nor firm (regardless of weight). Your silhouette is of a moderate length. Your silhouette contains some circular shapes. You are flattered best by tailored, minimalist and symmetrical styles that hug your curves. Choose rounded details.`,
    SD: `Your body is characterized by its length (literal or simply the impression of length). Your flesh is soft even at a low weight. You can see some appearance of circles in your silhouette (for example a rounded hip shape). Your soft flesh and roundedness are juxtaposed against the sharpness of your bones. Long pieces that hug your curves suit you best. You can also handle occasional sharp details. A bit of glam in your look doesn’t overpower you.`,
    SG: `Your silhouette is characterized by its short appearance. You have soft flesh even at a lower weight and you notice some roundness in the body. You look best in curve-hugging clothing and shorter pieces so not to overwhelm your petite frame.`,
    SN: `Your body is characterized by soft flesh (even at a lower weight) and rounded shapes in the silhouette. These rounded fleshy shapes are accompanied by roundness in your bone structure. Your rounded flesh + bone structure works to support and enhance the appearance of your curves. Your silhouette appears moderate to short in length. You are flattered by curve- hugging clothing with rounded details.`,
    TR: `Your silhouette is characterized by its short appearance. You have soft flesh even at a lower weight and notice rounded shapes in your silhouette. You may see a bit of sharpness in your bone structure. You look best in curve-hugging clothing with ornate and rounded details.`,
  } as any;

  const modusImages = {
    D: <FastImage source={require(`../assets/D_Queen.png`)} style={styles.image} />,
    DC: <FastImage source={require(`../assets/DC_Boss.png`)} style={styles.image} />,
    FG: <FastImage source={require(`../assets/FG_Coquette.png`)} style={styles.image} />,
    FN: <FastImage source={require(`../assets/FN_Supermodel.png`)} style={styles.image} />,
    R: <FastImage source={require(`../assets/R_Siren.png`)} style={styles.image} />,
    SC: <FastImage source={require(`../assets/SC_Lady.png`)} style={styles.image} />,
    SD: <FastImage source={require(`../assets/SD_Feline.png`)} style={styles.image} />,
    SG: <FastImage source={require(`../assets/SG_Ingenue.png`)} style={styles.image} />,
    SN: <FastImage source={require(`../assets/SN_Vixen.png`)} style={styles.image} />,
    TR: <FastImage source={require(`../assets/TR_Femme_Fatale.png`)} style={styles.image} />,
  } as any;

  // AsyncStorage.clear();
  const user = useStore((state) => state.user);
  const { data: userData, isLoading } = useQuery(["currentUser", user?.uid], () => fetchUser(user?.uid), {
    enabled: !!user?.uid,
  });

  function handleNextPageNavigate() {
    mutate({ uid: user?.uid, hasSeenModusType: true });
    // navigation.navigate('QuizIntro')
    // navigation?.navigate('HomeTabs');
    // navigation.pop(1);
    // navigation.navigate("HomeTabs", {
    //   screen: "CreateStack",
    //   //   params: {
    //   //     screen: "ShippingDetails",
    //   //     id,
    //   //     ownerId,
    //   //   },
    // });
    // navigation.navigate("");
  }

  const modusType = user?.modusType || userData?.modusType || route?.params?.modusType;

  return isLoading ? (
    <Text>Loading</Text>
  ) : (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>
          <Text style={styles.introText}>We found your Modus Type!</Text>
        </View>
        <View>{modusImages[modusType]}</View>
        <View>
          <Text style={styles.headerText}>You're a {modusTypes[modusType]}!</Text>
        </View>
        <View style={styles.description}>
          <Text style={styles.descriptionText}>{modusDescriptions[modusType]}</Text>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={handleNextPageNavigate} style={styles.continueButton}>
        <Text style={styles.continueButtonText}>Finish</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  continueButtonText: {
    fontSize: 16,
    textAlign: "center",
    color: 'white',
    fontWeight: 'bold',
  },
  continueButton: {
    marginTop: 40,
    borderRadius: 8,
    padding: 15,
    marginHorizontal:  Dimensions.get("window").width * 0.01,
    width: Dimensions.get("window").width * 0.44,
    backgroundColor: "#6F3284",
  },
  descriptionText: {
    marginHorizontal: 30,
    marginVertical: 15,
    fontSize: 16,
    textAlign: "auto",
  },
  image: {
    width: Dimensions.get("window").width,
    height: 300,
    resizeMode: "cover",
  },
  headerText: {
    fontSize: 30,
    marginTop: 20,
  },
  introText: {
    fontSize: 30,
    margin: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  unselected: {
    backgroundColor: "gray",
  },
  selected: {
    backgroundColor: "#111111",
  },
  title: {
    alignItems: "center",
    marginVertical: 20,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#2b414d",
    borderRadius: 50,
    padding: 10,
    width: 250,
  },
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  scrollContainer: {
    alignItems: "center",
  },
  controls: {
    flex: 1,
    width: "80%",
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
