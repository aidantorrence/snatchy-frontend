import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert, SafeAreaView, Image, TouchableOpacity } from "react-native";
import { CardField, StripeProvider, useConfirmPayment, useStripe } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchListing, fetchPaymentSheetParams, fetchUser, updateUser } from "../data/api";
import { LinearGradient } from "expo-linear-gradient";
import useAuthentication from "../utils/firebase/useAuthentication";

export default function PaymentScreen({ route, navigation }: any) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { id, ownerId, isOffer, offerPrice, itemsWanted, additionalFunds } = route.params;
  const user = useAuthentication();
  const { data, isLoading: isUserLoading } = useQuery(`user-${user.uid}`, () => fetchUser(user.uid));
  const { data: listingData, isLoading: isListingLoading } = useQuery(`listing-${id}`, () => fetchListing(id));
  const price = isOffer ? offerPrice : listingData?.price;
  const { data: paymentSheetData, isLoading: isLoadingPaymentSheet } = useQuery(`payment-sheet`, () =>
    fetchPaymentSheetParams(data?.customerId, itemsWanted, listingData)
  );
  const queryClient = useQueryClient();
  const mutation: any = useMutation((data) => updateUser(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(`user-${user.uid}`);
    },
  });

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } = paymentSheetData;
    if (!data?.customerId) mutation.mutate({ uid: user.uid, customerId: customer });

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
    });
    if (!error) {
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
    }
  };

  useEffect(() => {
    if (!isLoadingPaymentSheet) initializePaymentSheet();
  }, [isLoadingPaymentSheet]);
  const handleShippingDetails = () => {
    navigation.navigate("PaymentStack", {
      screen: "ShippingDetails",
      params: {
        screen: "ShippingDetails",
        id,
        ownerId,
      },
    });
  };
  return (
    <StripeProvider publishableKey={Constants?.manifest?.extra?.publishableKey}>
      <SafeAreaView style={styles.container}>
        {additionalFunds === undefined ? (
          <View style={styles.listingContainer}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: listingData?.images[0] }} style={styles.image} />
            </View>
            <View style={styles.listingDetailsContainer}>
              <Text style={styles.title}>{listingData?.name}</Text>
              <Text style={styles.detailTitle}>
                <Text>Size: </Text>
                <Text style={styles.detailValue}>{listingData?.size}</Text>
              </Text>
            </View>
          </View>
        ) : null}
        <View style={styles.calcContainer}>
          <View style={styles.detailContainer}>
            {additionalFunds === undefined ? (
              <>
                <Text style={styles.detailTitle}>{`${isOffer ? "Offer " : "Listing "}Price`}</Text>
                <View style={styles.detailValueContainer}>
                  <Text style={styles.detailValue}>${Math.round(price)}</Text>
                </View>
              </>
            ) : additionalFunds > 0 ? (
              <>
                <Text style={styles.detailTitle}>{"Added Cash"}</Text>
                <View style={styles.detailValueContainer}>
                  <Text style={styles.detailValue}>${Math.round(additionalFunds)}</Text>
                </View>
              </>
            ) : null}
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
        {additionalFunds !== null ? (
          <View style={styles.calcContainer}>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>Sales Tax</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>${Math.round((additionalFunds || price) * 0.0725)}</Text>
              </View>
            </View>
          </View>
        ) : null}
        <View style={styles.divider} />
        <View style={styles.calcContainer}>
          <View style={styles.detailContainer}>
            <Text style={styles.detailTitle}>Total</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>${Math.round(additionalFunds === undefined ? price * 1.0725 + 20 : additionalFunds > 0 ? additionalFunds * 1.0725 + 20 : 20)}</Text>
            </View>
          </View>
        </View>
        {data?.address ? (
          <>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Shipping Details</Text>
              <Image source={require("../assets/Edit_Logo.png")} style={styles.editLogo} />
            </View>
            <View style={styles.cardContainer}>
              <View style={styles.addressContainer}>
                <Text style={styles.addressText}>
                  {data?.address} {data.optionalAddress}{" "}
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
        {data?.address ? (
          <TouchableOpacity style={styles.submitButtonContainer} onPress={openPaymentSheet}>
            <LinearGradient
              colors={["#aaa", "#aaa", "#333"]}
              locations={[0, 0.3, 1]}
              style={styles.submitButton}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.submitButtonText}>Review Payment</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : null}
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
    backgroundColor: "rgba(255,0,0,0.45)",
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
