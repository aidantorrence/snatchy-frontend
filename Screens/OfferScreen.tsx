import { useState } from "react";
import { View, Text, SafeAreaView, Image, Button, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";

const img = "https://1.kixify.com/sites/default/files/imagecache/product_full/product/2020/04/27/p_30009391_171134591_240382.jpg";

export default function OfferScreen({ navigation }: any) {
  const [offerPrice, setOfferPrice] = useState(null) as any;
  return (
    <SafeAreaView>
      <View style={styles.titleContainer}>
        <Image source={{ uri: img }} style={{ width: 20, height: 20, borderWidth: 1 }} />
        <View>
          <Text>Adidas Zebra V2</Text>
        </View>
        <View>
          <Text>Listing Price</Text>
          <Text>379</Text>
        </View>
      </View>
      <Button title="Make an Offer"></Button>
      <TextInput keyboardType="numeric" placeholder="379" onChangeText={(e): any => setOfferPrice(e)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  userImagesContainer: {},
  userImages: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    margin: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 28,
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    fontWeight: "bold",
    fontSize: 28,
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
