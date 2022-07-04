import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { View, Text, SafeAreaView, Image, Button, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useQuery } from "react-query";
import { fetchUser } from "../data/api";

export default function OfferScreen({ route, navigation }: any) {
  const [offerPrice, setOfferPrice] = useState(null) as any;
  const { id, ownerId } = route.params;
  const { data, isLoading } = useQuery(`user-${ownerId}`, () => fetchUser(ownerId));
  const listing = data?.listings?.find((listing: any) => listing.id === id);

  const handlePress = () => {
    navigation.navigate("PaymentStack", {
      screen: "Payment",
      params: {
        screen: "Payment",
        id,
        ownerId,
        isOffer: true,
        offerPrice,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listingContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: listing.images[0] }} style={styles.image} />
        </View>
        <View style={styles.listingDetailsContainer}>
          <Text style={styles.title}>{listing.name}</Text>
          <Text style={styles.detailTitle}>
            <Text>Listing Price: </Text>
            <Text style={styles.detailValue}>${listing.price}</Text>
          </Text>
          <Text style={styles.detailTitle}>
            <Text>Size: </Text>
            <Text style={styles.detailValue}>{listing.size}</Text>
          </Text>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Make an Offer</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder={`$${listing.price}`}
          onChangeText={(e): any => setOfferPrice(e)}
        />
      </View>
      <TouchableOpacity onPress={handlePress} style={styles.buttonContainer}>
        <LinearGradient
          colors={["#aaa", "#aaa", "#333"]}
          locations={[0, 0.3, 1]}
          style={styles.confirmButton}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.completeButtonText}>Confirm</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TextInput keyboardType="numeric" placeholder="$" onChangeText={(e): any => setOfferPrice(e)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    padding: 20,
  },
  image: { padding: 20, width: 60, height: 60, borderWidth: 1 },
  imageContainer: {
    paddingVertical: 20,
    paddingLeft: 20,
  },
  listingDetailsContainer: {
    paddingVertical: 20,
    paddingLeft: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    borderRadius: 7,
  },
  detailValue: {
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 8,
  },
  detailTitle: {
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  buttonContainer: {
    alignItems: "center",
  },
  completeButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  confirmButton: {
    padding: 15,
    alignItems: "center",
    borderRadius: 27,
    margin: 20,
    paddingLeft: 30,
    paddingRight: 30,
  },
  listingContainer: {
    flexDirection: "row",
    alignItems: "center",
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
