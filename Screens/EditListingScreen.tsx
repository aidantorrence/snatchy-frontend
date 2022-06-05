import { View, Text, SafeAreaView, Image, Button, StyleSheet, ScrollView } from "react-native";

const defaultProfile =
  "https://www.domusweb.it/content/dam/domusweb/it/speciali/assoluti-del-design/gallery/2021/gli-assoluti-20-sneaker-imperdibili/gallery/domus-assoluti-sneaker-converse-all-star.jpg.foto.rmedium.png";
const userImages = [defaultProfile, defaultProfile, defaultProfile];

export default function EditListingScreen({ navigation }: any) {

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{ alignItems: "center", alignSelf: "center" }}>
          <Image source={{ uri: defaultProfile }} style={{ width: 120, height: 120, borderWidth: 1 }} />
          <Text style={[styles.placeholder, styles.title]}>Name</Text>
          <Text style={styles.title}>Converse 500s</Text>
          <Button title="Edit"></Button>
        </View>
        <View>
          <Text style={[styles.placeholder, styles.header]}>Condition</Text>
          <Text style={styles.header}>Used - Excellent</Text>
          <Text style={styles.body}>Heel drag at the bottom</Text>
          <Text style={styles.body}>Discoloration</Text>
          <Text style={styles.body}>Small stain on the front</Text>
          <Button title="Edit"></Button>
          <Text style={[styles.placeholder, styles.header]}>Size</Text>
          <Text style={styles.header}>11</Text>
          <Button title="Edit"></Button>
          <Text style={[styles.placeholder, styles.header]}>Price</Text>
          <Text style={styles.header}>$379</Text>
          <Button title="Edit"></Button>
          <Text style={[styles.placeholder, styles.header]}>Box?</Text>
          <Text style={styles.header}>No box</Text>
          <Button title="Edit"></Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
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
  placeholder: {
    color: "gray",
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
