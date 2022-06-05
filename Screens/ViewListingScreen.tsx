import { View, Text, SafeAreaView, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

const defaultProfile = "https://creativeloafing.com/dl39257?display&x=1040&y=780";
const sneakerImage =
  "https://www.domusweb.it/content/dam/domusweb/it/speciali/assoluti-del-design/gallery/2021/gli-assoluti-20-sneaker-imperdibili/gallery/domus-assoluti-sneaker-converse-all-star.jpg.foto.rmedium.png";

const userImages = [defaultProfile, defaultProfile, defaultProfile];

export default function ViewListingScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.navigate("ViewProfile")} style={styles.userContainer}>
          <Image source={{ uri: defaultProfile }} style={{ width: 20, height: 20, borderRadius: 40 }} />
          <Text style={styles.username}>Sneak Seller ATL</Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Image source={{ uri: sneakerImage }} style={{ width: 300, height: 300 }} />
        </View>
        <Text style={styles.name}>Converse 500s</Text>
        <View style={styles.subHeader}>
          <Text style={[styles.description, styles.subHeaderText]}> $379</Text>
          <Text style={[styles.description, styles.subHeaderText]}>Size: 11</Text>
          <Text style={styles.description}>No box</Text>
        </View>
        <View>
          <Text style={styles.description}>Condition: Used - Excellent</Text>
          <Text style={styles.description}>Details:</Text>
          <Text style={styles.body}>Heel drag at the bottom</Text>
          <Text style={styles.body}>Discoloration</Text>
          <Text style={styles.body}>Small stain on the front</Text>
        </View>
        <Text style={styles.header}>Other listings</Text>
        <View style={styles.userImagesContainer}>
          {userImages.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.userImages} />
          ))}
        </View>
      </ScrollView>
        <View style={styles.footerButtons}>
          <TouchableOpacity style={[styles.button, { backgroundColor: "white" }]}>
            <Text style={styles.buttonText}>Trade</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: "gray" }]}>
            <Text style={styles.buttonText}>Make Offer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: "red" }]}>
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  subHeader: {
    flexDirection: "row",
  },
  subHeaderText: {
    marginRight: 20,
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  buttonText: {
    fontSize: 20,
  },
  button: {
    backgroundColor: "red",
    borderWidth: 0.5,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  userImagesContainer: {
    flexDirection: "row",
  },
  userImages: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    margin: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 28,
  },
  username: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  header: {
    fontWeight: "bold",
    fontSize: 28,
    marginTop: 10,
    marginBottom: 5,
  },
  description: {
    fontWeight: "bold",
    fontSize: 20,
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
});
