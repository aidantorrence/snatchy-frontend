import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert, SafeAreaView, Image, TouchableOpacity } from "react-native";
import { CardField, StripeProvider, useConfirmPayment } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import { useQuery } from "react-query";
import { fetchUser } from "../data/api";
import { LinearGradient } from "expo-linear-gradient";

//ADD localhost address of your server
const API_URL = "http://localhost:8081";

export default function PaymentScreen({ route, navigation }: any) {
  const [email, setEmail] = useState("");
  const [cardDetails, setCardDetails] = useState(null) as any;
  const { confirmPayment, loading } = useConfirmPayment();
  const { id, ownerId, isOffer, offerPrice } = route.params;
  const { data, isLoading } = useQuery(`user-${ownerId}`, () => fetchUser(ownerId));
  const listing = data?.listings?.find((listing: any) => listing.id === id);
  const price = isOffer ? offerPrice : listing.price;

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { clientSecret, error } = await response.json();
    return { clientSecret, error };
  };
const handleShippingDetails = () => {
    navigation.navigate("PaymentStack", {
      screen: "ShippingDetails",
      params: {
        screen: "ShippingDetails",
        id,
        ownerId,
      },
    });
}
  const handlePayPress = async () => {
    //1.Gather the customer's billing information (e.g., email)
    if (!cardDetails?.complete || !email) {
      Alert.alert("Please enter Complete card details and Email");
      return;
    }
    const billingDetails = {
      email,
    };
    //2.Fetch the intent client secret from the backend
    try {
      const { clientSecret, error } = await fetchPaymentIntentClientSecret();
      //2. confirm the payment
      if (error) {
        console.log("Unable to process payment");
      } else {
        const { paymentIntent, error } = await confirmPayment(clientSecret, {
          type: "Card",
          billingDetails,
        });
        if (error) {
          alert(`Payment Confirmation Error ${error.message}`);
        } else if (paymentIntent) {
          alert("Payment Successful");
          console.log("Payment successful ", paymentIntent);
        }
      }
    } catch (e) {
      console.log(e);
    }
    //3.Confirm the payment with the card details
  };

  return (
    <StripeProvider publishableKey={Constants?.manifest?.extra?.publishableKey}>
      <SafeAreaView style={styles.container}>
        <View style={styles.listingContainer}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: listing.images[0] }} style={styles.image} />
          </View>
          <View style={styles.listingDetailsContainer}>
            <Text style={styles.title}>{listing.name}</Text>
            <Text style={styles.detailTitle}>
              <Text>Size: </Text>
              <Text style={styles.detailValue}>{listing.size}</Text>
            </Text>
          </View>
        </View>
        <View style={styles.calcContainer}>
          <View style={styles.detailContainer}>
            <Text style={styles.detailTitle}>{`${isOffer ? "Offer " : "Listing "}Price`}</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>${Math.round(price)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.calcContainer}>
          <View style={styles.detailContainer}>
            <Text style={styles.detailTitle}>Shipping</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>$20</Text>
            </View>
          </View>
        </View>
        <View style={styles.calcContainer}>
          <View style={styles.detailContainer}>
            <Text style={styles.detailTitle}>Sales Tax</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>${Math.round(price * 0.07)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.calcContainer}>
          <View style={styles.detailContainer}>
            <Text style={styles.detailTitle}>Total</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>${Math.round(price * 1.07 + 20)}</Text>
            </View>
          </View>
        </View>
        {!data.address ? (
          <>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Shipping Details</Text>
              <Image source={require("../assets/Edit_Logo.png")} style={styles.editLogo} />
            </View>
            <View style={styles.cardContainer}>
              <View style={styles.addressContainer}>
                <Text style={styles.addressText}>
                  {data.address} {data.optionalAddress}{" "}
                </Text>
                <Text style={styles.addressText}>
                  {data.city}, {data.state} {data.zipcode}
                </Text>
                <Text style={styles.addressText}>{data.country}</Text>
              </View>
            </View>
          </>
        ) : (
          <TouchableOpacity style={styles.addShippingContainer} onPress={handleShippingDetails}>
            <Text style={styles.addShippingTitle}>Add Your Shipping Address</Text>
          </TouchableOpacity>
        )}
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>Card Details</Text>
          <Image source={require("../assets/Edit_Logo.png")} style={styles.editLogo} />
        </View>
        <View style={styles.cardContainer}>
          <CardField
            postalCodeEnabled={true}
            placeholder={{
              number: "4242 4242 4242 4242",
            }}
            cardStyle={styles.cardColor}
            style={styles.card}
            onCardChange={(cardDetails) => {
              setCardDetails(cardDetails);
            }}
          />
        </View>
        <TouchableOpacity style={styles.submitButtonContainer} onPress={handlePayPress}>
          <LinearGradient
            colors={["#aaa", "#aaa", "#333"]}
            locations={[0, 0.3, 1]}
            style={styles.submitButton}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  editLogo: {
    width: 20,
    height: 20,
  },
  addressText: {
    fontSize: 16,
    paddingBottom: 3,
  },
  addressContainer: {
    paddingHorizontal: 20,
  },
  submitButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  submitButton: {
    padding: 15,
    alignItems: "center",
    borderRadius: 27,
    margin: 20,
    paddingLeft: 30,
    paddingRight: 30,
  },
  submitButtonContainer: {
    alignItems: "center",
  },
  divider: {
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 5,
    marginHorizontal: 15,
  },
  detailValueContainer: {
    width: 70,
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  listingContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  detailTitle: {
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cardColor: {
    backgroundColor: "#efefefef",
  },
  card: {
    height: 50,
    marginHorizontal: 20,
  },
  cardContainer: {
    marginVertical: 10,
  },
  cardTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingRight: 40,
    paddingTop: 10,
  },
  addShippingContainer: {
    backgroundColor: 'rgba(255,0,0,0.45)',
    margin: 20,
    borderRadius: 7,
    borderWidth: 1,
  },
  addShippingTitle: {
    padding: 10,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
