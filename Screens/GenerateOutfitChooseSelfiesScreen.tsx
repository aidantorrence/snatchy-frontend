import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, Dimensions, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { selfImages } from "../data/assets";
import * as ImagePicker from "expo-image-picker";
import uploadImageAsync from "../utils/firebase/uploadImage";
import { useState } from "react";

export default function GenerateOutfitChooseSelfiesScreen({ navigation, route }: any) {
  const [photoLoading, setPhotoLoading] = useState(false);
  const [images, setImages] = useState<any>([]);

  const deleteImage = (image: any) => {
    setImages(images.filter((i: any) => i !== image));
  }

  const pickImage = async () => {
    setPhotoLoading(true);

    try {
      let result: any;

      // No permissions request is necessary for launching the image library
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 0.1,
      });
      if (!result.canceled) {
        const images = [];
        for (let i = 0; i < result.assets.length; i++) {
          const url = await uploadImageAsync(result.assets[i].uri);
          images.push(url);
        }
        setImages(images);
      }
    } catch (e) {
      setPhotoLoading(false);
    }
    setPhotoLoading(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Choose 10-20 photos of yourself:</Text>
      </View>
      <View style={styles.subTitleContainer}>
        <Text style={styles.subTitle}>For more accurate results, include full-body photos and selfies</Text>
      </View>
      {photoLoading ? (
        <ActivityIndicator size="large" />
      ) : images.length ? (
        <FlatList
          numColumns={3}
          data={[selfImages[0].imgSrc, ...images]}
          renderItem={({ item }: any) => {
            return typeof item === "string" ? (
              <Pressable onPress={() => deleteImage(item)} style={styles.imageContainer}>
                <FastImage source={{ uri: item }} style={[styles.image]} />
            <FastImage
              source={require("../assets/trash-can.jpg")}
              resizeMode="contain"
              style={styles.trashCanIconSelectedOutfit}
            />
              </Pressable>
            ) : (
              <Pressable onPress={pickImage} style={styles.imageContainer}>
                <FastImage source={require("../assets/upload_photo.jpg")} style={[styles.image]} />
              </Pressable>
            );
          }}
          keyExtractor={(item, idx) => idx.toString()}
        />
      ) : (
        <Pressable onPress={pickImage} style={[styles.imageContainer, styles.uploadContainer]}>
          <FastImage source={selfImages[0].imgSrc} style={[styles.image]} />
        </Pressable>
      )}
      <Pressable onPress={() => navigation.navigate("GenerateOutfitTryOn", { images })} style={styles.continueButton}>
        <Text style={styles.continueButtonText}>NEXT</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  trashCanIconSelectedOutfit: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 17,
    height: 21,
  },
  subTitleContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  subTitle: {
    textAlign: "center",
    width: Dimensions.get("window").width * 0.5,
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
  uploadContainer: {
    alignItems: "center",
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
    marginBottom: 20,
  },
  title: {
    width: Dimensions.get("window").width * 0.43,
    textAlign: "center",
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  image: {
    width: Dimensions.get("window").width * 0.29,
    height: Dimensions.get("window").width * 0.29,
    borderRadius: 10,
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
