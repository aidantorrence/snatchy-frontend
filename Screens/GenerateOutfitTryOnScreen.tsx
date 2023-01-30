import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { outfitImages, themes } from "../data/assets";
import { useStore } from "../utils/firebase/useAuthentication";
import {
  useFonts,
  LobsterTwo_400Regular,
  LobsterTwo_400Regular_Italic,
  LobsterTwo_700Bold,
  LobsterTwo_700Bold_Italic,
} from "@expo-google-fonts/lobster-two";
import { useMutation } from "react-query";
import { postPrediction, postTraining } from "../data/api";

export default function GenerateOutfitTryOnScreen({ navigation, route }: any) {
  const [fontsLoaded] = useFonts({
    LobsterTwo_400Regular,
    LobsterTwo_400Regular_Italic,
    LobsterTwo_700Bold,
    LobsterTwo_700Bold_Italic,
  });
  const [pressedOutfit, setPressedOutfit] = useState(new Array(outfitImages.length).fill(false));
  const [selectedThemes, setSelectedThemes] = useState(new Array(themes.length).fill(false));
  const chosenUser = route?.params?.chosenUser;
  const user = useStore((state) => state.user);
  const { mutate: mutateCreatePrediction } = useMutation(
    () =>
      postPrediction({
        outfit: outfitImages.find((image, index) => pressedOutfit[index]),
        themes: themes.filter((theme, index) => selectedThemes[index]),
        celebrity: chosenUser,
        uid: user?.uid,
      }),
    {
      onSuccess: (data) => {
        navigation.navigate("GenerateOutfitResults", {
          results: data,
          isCelebrity: true,
        });
      },
    }
  );

  const { mutate: mutateCreateTraining } = useMutation(
    () =>
      postTraining({
        outfit: outfitImages.find((image, index) => pressedOutfit[index]),
        themes: themes.filter((theme, index) => selectedThemes[index]),
        celebrity: chosenUser,
        uid: user?.uid,
        images: route?.params?.images,
      }),
    {
      onSuccess: (data) => {
        navigation.navigate("GenerateOutfitResults", {
          results: data,
        });
      },
    }
  );

  const generateOutfits = async () => {
    if (chosenUser) {
      mutateCreatePrediction();
    } else {
      mutateCreateTraining();
    }
  };

  return !fontsLoaded ? (
    <SafeAreaView style={styles.screenAreaView}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.myselfText}>Trying on {chosenUser ? chosenUser : "Yourself"} </Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.someoneElse}>Choose Someone Else</Text>
        </Pressable>
      </View>
      <View style={styles.topButtonsContainer}>
        <Pressable>
          <FastImage
            source={
              !pressedOutfit.includes(true) ? require("../assets/clothing-selected.jpg") : require("../assets/clothing.jpg")
            }
            style={styles.icon}
          />
        </Pressable>
        <Pressable>
          <FastImage
            source={
              pressedOutfit.includes(true) ? require("../assets/background-selected.jpg") : require("../assets/background.jpg")
            }
            style={styles.icon}
          />
        </Pressable>
        <Pressable onPress={generateOutfits} disabled={!pressedOutfit.includes(true) || !selectedThemes.includes(true)}>
          <FastImage
            source={
              pressedOutfit.includes(true) && selectedThemes.includes(true)
                ? require("../assets/generate_selected.jpg")
                : require("../assets/generate.jpg")
            }
            style={styles.generateButton}
          />
        </Pressable>
      </View>
      {!pressedOutfit.includes(true) ? (
        <Pressable>
          <FastImage source={require("../assets/image_group.jpg")} resizeMode="contain" style={styles.mainImage} />
        </Pressable>
      ) : (
        <View style={styles.selectionsContainer}>
          <Pressable onPress={() => setPressedOutfit(new Array(outfitImages.length).fill(false))}>
            <FastImage source={{ uri: outfitImages[pressedOutfit.findIndex((el) => el)] }} style={styles.selectedOutfit} />
            <FastImage
              source={require("../assets/trash-can.jpg")}
              resizeMode="contain"
              style={styles.trashCanIconSelectedOutfit}
            />
          </Pressable>
          <Pressable>
            <FastImage source={require("../assets/plus_icon.jpg")} style={styles.plusIcon} />
          </Pressable>
          {selectedThemes.filter((bool) => bool).length ? (
            <View style={styles.selectedThemesContainer}>
              {selectedThemes.map((bool, idx) => {
                if (bool)
                  return (
                    <Pressable
                      key={idx}
                      onPress={() =>
                        setSelectedThemes(
                          selectedThemes.map((item, i) => {
                            if (i === idx) {
                              return !item;
                            }
                            return item;
                          })
                        )
                      }
                    >
                      <FastImage source={themes[idx].imgSrc} style={styles.selectedThemes} />
                      <FastImage source={require("../assets/trash-can.jpg")} resizeMode="contain" style={styles.trashCanIcon} />
                    </Pressable>
                  );
              })}
            </View>
          ) : (
            <Pressable>
              <FastImage source={require("../assets/question_icon.jpg")} style={styles.questionIcon} />
            </Pressable>
          )}
        </View>
      )}
      {!pressedOutfit.includes(true) ? (
        <View style={styles.outfitsTitle}>
          <Text style={styles.outfitsTitleText}>Choose an outfit to try on:</Text>
          <FlatList
            numColumns={3}
            key={"_"}
            data={outfitImages}
            renderItem={({ item, index }: any) => {
              return (
                <Pressable
                  onPress={() =>
                    setPressedOutfit(
                      pressedOutfit.map((item, i) => {
                        if (i === index) {
                          return !item;
                        }
                        return item;
                      })
                    )
                  }
                  style={styles.imageContainer}
                >
                  <FastImage source={typeof item === "string" ? { uri: item } : item} style={[styles.image]} />
                </Pressable>
              );
            }}
            keyExtractor={(item, idx) => "_" + idx.toString()}
          />
        </View>
      ) : (
        <View style={styles.outfitsTitle}>
          <Text style={styles.outfitsTitleText}>Choose up to 3 themes:</Text>
          <FlatList
            key={"#"}
            numColumns={4}
            data={themes}
            renderItem={({ item, index }: any) => {
              return (
                <Pressable
                  disabled={selectedThemes.filter((bool) => bool).length >= 3 && !selectedThemes[index]}
                  onPress={() => {
                    setSelectedThemes(
                      selectedThemes.map((item, i) => {
                        if (i === index) {
                          return !item;
                        }
                        return item;
                      })
                    );
                  }}
                  style={styles.themeContainer}
                >
                  <FastImage
                    source={item.imgSrc}
                    style={[styles.theme, selectedThemes[index] && styles.selectedTheme]}
                  ></FastImage>
                  <Text style={styles.themeText}>{item.name}</Text>
                </Pressable>
              );
            }}
            keyExtractor={(item, idx) => "#" + idx.toString()}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 15,
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
