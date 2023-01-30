import { FlashList } from "@shopify/flash-list";
import { Dimensions, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";

export default function GenerateOutfitIntroScreen({ navigation, route }: any) {
  function Item({ item }: any) {
    return (
      <Pressable
        onPress={() => handleProfilePress(item?.ownerId)}
        style={{ flexDirection: "row", marginLeft: 5, marginBottom: 5, alignItems: "center" }}
      >
        <FastImage source={{ uri: item.owner.userImage }} style={styles.userImage} />
        <Text style={styles.subTitle}>{item.owner.firstName + " " + item.owner.lastName}</Text>
      </Pressable>
    );
  }
  return (
    <SafeAreaView>
      <View>
        <Text>Trying on Taylor Swift</Text>
        <Text>Choose Someone Else</Text>
      </View>
      <View>
        <Pressable>
          <FastImage source={require("../assets/Plus_Button.png")} style={styles.addPhoto} />
        </Pressable>
        <Pressable>
          <FastImage source={require("../assets/Plus_Button.png")} style={styles.addPhoto} />
        </Pressable>
        <Pressable>
          <FastImage source={require("../assets/Plus_Button.png")} style={styles.addPhoto} />
        </Pressable>
      </View>
      <View>
        <FastImage source={require("../assets/Plus_Button.png")} style={styles.addPhoto} />
      </View>
      <View>
        <Text>Choose an outfit to try on:</Text>
      <View style={styles.imageContainer}>
        <FastImage source={require("../assets/Plus_Button.png")} style={styles.addPhoto} />
        <Text style={styles.placeholderImageText}>Upload Your Own Outfit</Text>
      </View>
      <FlashList
        horizontal={false}
        numColumns={2}
        estimatedItemSize={200}
        data={outfits}
        renderItem={({ item }: any) => <Item item={item} />}
        keyExtractor={(item) => item.id}
      />
      </View>
      <Pressable onPress={} style={styles.continueButton}>
        <Text style={styles.continueButtonText}>NEXT</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
