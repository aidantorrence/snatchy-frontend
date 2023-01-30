import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
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
import { useStore } from "../utils/firebase/useAuthentication";

export default function GenerateOutfitViewOutfitScreen({ navigation, route }: any) {
  const { image } = route?.params;
  const selected = useStore((state) => state.selected);
  const setSelected = useStore((state) => state.setSelected);
  const toggleCheckbox = (id: any) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item: any) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FastImage source={{ uri: image.imageUrl}} style={styles.image} />
      <View style={styles.buttonsContainer}>
        {selected.includes(image.id) ? (
          <Pressable style={[styles.buttonLeft, styles.buttonSaved ]} onPress={() => toggleCheckbox(image.id)}>
            <Text style={[styles.buttonText, styles.buttonTextSaved]}>SAVED</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.buttonLeft} onPress={() => toggleCheckbox(image.id)}>
            <Text style={styles.buttonText}>SAVE</Text>
          </Pressable>
        )}
        <Pressable style={styles.buttonRight}>
          <FastImage source={require("../assets/share_icon_3.png")} style={styles.icon} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
  },
  buttonText: {
    fontSize: 19,
    fontWeight: "500",
  },
  buttonLeft: {
    padding: 15,
    paddingHorizontal: 60,
    marginHorizontal: 9,
    backgroundColor: "#F487D2",
    borderRadius: 13,
  },
  buttonSaved: {
    backgroundColor: "#F61BB2",
  },
  buttonTextSaved: {
    color: 'white',
  },
  buttonRight: {
    padding: 10,
    paddingHorizontal: 13,
    marginHorizontal: 9,
    backgroundColor: "#F487D2",
    borderRadius: 13,
  },
  image: {
    height: Dimensions.get("window").width,
    width: Dimensions.get("window").width,
    marginBottom: 50,
  },
  container: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
});
