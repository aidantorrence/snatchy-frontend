import { FlashList } from "@shopify/flash-list";
import React, { useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { outfitImages, outputImages, themes } from "../data/assets";
import Checkbox from "expo-checkbox";
import {
  useFonts,
  LobsterTwo_400Regular,
  LobsterTwo_400Regular_Italic,
  LobsterTwo_700Bold,
  LobsterTwo_700Bold_Italic,
} from "@expo-google-fonts/lobster-two";
import LoadingSpinner from "../Components/LoadingSpinner";
import { useMutation, useQuery } from "react-query";
import { fetchResults, updatePredictionImages } from "../data/api";
import { useStore } from "../utils/firebase/useAuthentication";

export default function GenerateOutfitResultsScreen({ navigation, route }: any) {
  const results = route?.params?.results;
  const isCelebrity = route?.params?.isCelebrity;
  const chosenUser = route?.params?.chosenUser;
  const [fontsLoaded] = useFonts({
    LobsterTwo_400Regular,
    LobsterTwo_400Regular_Italic,
    LobsterTwo_700Bold,
    LobsterTwo_700Bold_Italic,
  });
  const selected = useStore((state) => state.selected);
  const setSelected = useStore((state) => state.setSelected);

  const toggleCheckbox = (id: any) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item: any) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };
  const { data: resultsData, isLoading } = useQuery(
    `results-${results[0].id}`,
    () => fetchResults(results.map((r: any) => r.id)),
    {
      refetchInterval: (data) => (data?.every((item: any) => item?.images?.length) ? false : 2000),
      onSuccess: (data) => {},
    }
  );

  const { mutate: mutateSaveToUser } = useMutation(() => updatePredictionImages(selected, { isSaved: true }), {
    onSuccess: (data) => {
      navigation.navigate("ViewProfile");
    },
  });

  const handleSaveToUser = () => {
    mutateSaveToUser();
  };

  const groupedImages = {} as any;
  resultsData?.forEach((image: any) => {
    groupedImages[image.theme] = [...(groupedImages[image.theme] || []), ...(image.images || [])];
  });

  return !fontsLoaded ? (
    <SafeAreaView style={styles.screenAreaView}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
      {resultsData?.every((item: any) => item.images.length) ? (
        <>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Your images are ready!</Text>
            <Text style={styles.titleText}>Select ones you want to keep</Text>
            <Text style={styles.subtitleText}>Click on an image to enlarge it</Text>
          </View>
          <Pressable style={styles.completedButton} onPress={handleSaveToUser}>
            <Text style={styles.completedButtonText}>I'm done</Text>
          </Pressable>
          {Object.entries(groupedImages).map((group, idx) => (
            <React.Fragment key={idx}>
              <Text style={styles.groupHeader}>{group[0]}</Text>
              <FlatList
                style={styles.flatlist}
                numColumns={3}
                key={"_"}
                data={groupedImages[group[0]].slice(0, 6)}
                renderItem={({ item, index }: any) => (
                  <Output
                    item={item}
                    index={index}
                    toggleCheckbox={toggleCheckbox}
                    // toggleCheckbox={() => toggleCheckbox(item.id)}
                    navigation={navigation}
                    checked={selected.includes(item.id)}
                  />
                )}
                keyExtractor={(item, idx) => "_" + idx.toString()}
              />
            </React.Fragment>
          ))}
        </>
      ) : (
        <View style={styles.imageLoadingContainer}>
          <Text style={styles.imagesLoadingText}>Images loading...</Text>
          <Text style={styles.imagesDescriptionText}>
            { isCelebrity ? "This will take a few moments." : "This may take up to 30 minutes - we will notify you when they're ready!"}        
          </Text>
          <LoadingSpinner color={"gray"} />
        </View>
      )}
    </SafeAreaView>
  );
}

function Output({ item, index, toggleCheckbox, checked, navigation }: any) {
  return (
    <Pressable key={index} onPress={() => navigation.navigate("GenerateOutfitViewOutfit", { image: item })}>
      <FastImage source={{ uri: item.imageUrl }} style={styles.outputImage} />
      <Checkbox color={checked && "#F61BB2"} style={styles.checkbox} value={checked} onValueChange={() => toggleCheckbox(item.id)} />
      <FastImage source={require("../assets/share_icon.jpg")} resizeMode="contain" style={styles.shareIcon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flatlist: {
    marginBottom: 25,
  },
  groupHeader: {
    marginBottom: 10,
    fontWeight: "500",
  },
  subtitleText: {
    color: "#666666",
    marginBottom: 12,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  completedButton: {
    backgroundColor: "#F487D2",
    borderRadius: 10,
    marginBottom: 33,
  },
  completedButtonText: {
    fontSize: 15.5,
    fontWeight: "600",
    paddingVertical: 6,
    paddingHorizontal: 15,
  },
  outputImage: {
    width: Dimensions.get("window").width * 0.317,
    height: Dimensions.get("window").width * 0.317,
    marginHorizontal: Dimensions.get("window").width * 0.005,
    marginVertical: Dimensions.get("window").width * 0.0075,
  },
  checkbox: {
    backgroundColor: "white",
    borderColor: "#F61BB2",
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
  },
  shareIcon: {
    position: "absolute",
    top: 29.5,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 7,
  },
  imageLoadingContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  imagesLoadingText: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 13,
  },
  imagesDescriptionText: {
    fontSize: 14,
    textAlign: "center",
    width: Dimensions.get("window").width * 0.5,
    marginBottom: 23,
  },
  trashCanIcon: {
    position: "absolute",
    top: -5,
    right: -3,
    width: 17,
    height: 21,
  },
  trashCanIconSelectedOutfit: {
    position: "absolute",
    top: -5,
    right: 17,
    width: 17,
    height: 21,
  },
  selectedThemesContainer: {},
  selectionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  selectedOutfit: {
    width: Dimensions.get("window").width * 0.4,
    height: Dimensions.get("window").width * 0.6,
    borderRadius: 8,
    marginRight: 20,
  },
  plusIcon: {
    width: Dimensions.get("window").width * 0.22,
    height: Dimensions.get("window").width * 0.22,
    borderRadius: 8,
    marginRight: 20,
  },
  selectedThemes: {
    width: Dimensions.get("window").width * 0.18,
    height: Dimensions.get("window").width * 0.18,
    borderRadius: 8,
    marginBottom: 20,
  },
  questionIcon: {
    width: Dimensions.get("window").width * 0.15,
    height: Dimensions.get("window").width * 0.15,
    borderRadius: 8,
  },
  selectedTheme: {
    borderWidth: 3,
    borderColor: "#F61BB2",
  },
  topButtonsContainer: {
    flexDirection: "row",
  },
  mainImage: {
    width: Dimensions.get("window").width * 0.95,
    height: Dimensions.get("window").width * 0.8,
    borderRadius: 10,
    marginBottom: 15,
  },
  container: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "white",
  },
  someoneElse: {
    textAlign: "center",
    color: "#6F6F6F",
    marginBottom: 15,
  },
  screenAreaView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  myselfText: {
    marginTop: 15,
    fontSize: 25,
    fontFamily: "LobsterTwo_700Bold_Italic",
    textAlign: "center",
    marginBottom: 7,
  },
  theme: {
    width: Dimensions.get("window").width * 0.22,
    height: Dimensions.get("window").width * 0.22,
    borderRadius: 10,
    marginBottom: 5,
  },
  themeText: {
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    width: Dimensions.get("window").width * 0.22,
  },
  image: {
    width: Dimensions.get("window").width * 0.29,
    height: Dimensions.get("window").width * 0.29,
    borderRadius: 10,
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
  themeContainer: {
    marginHorizontal: (Dimensions.get("window").width * 0.09) / 6,
    marginBottom: 20,
  },
  outfitsTitle: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 5,
  },
  outfitsTitleText: {
    fontSize: 18,
    fontWeight: "500",
    padding: 15,
  },
  icon: {
    height: Dimensions.get("window").width * 0.1,
    width: Dimensions.get("window").width * 0.1,
    resizeMode: "cover",
    marginHorizontal: 15,
  },
  generateButton: {
    height: Dimensions.get("window").width * 0.1,
    width: Dimensions.get("window").width * 0.25,
    borderRadius: 10,
    marginHorizontal: 15,
  },
  continueButtonText: {
    fontSize: 16,
    textAlign: "center",
  },
  continueButton: {
    marginTop: 40,
    borderRadius: 8,
    padding: 15,
    width: Dimensions.get("window").width * 0.9,
    backgroundColor: "#f2f2f2",
  },
});
