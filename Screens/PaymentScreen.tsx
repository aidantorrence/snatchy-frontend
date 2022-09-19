import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert, SafeAreaView, Image, TouchableOpacity } from "react-native";
import { CardField, retrieveSetupIntent, StripeProvider, useConfirmPayment, useStripe } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  chargeBuy,
  fetchListing,
  fetchPaymentMethod,
  fetchPaymentSheetParams,
  fetchSetupPaymentSheetParams,
  fetchUser,
  sendConfirmationEmail,
  updateUser,
} from "../data/api";
import { LinearGradient } from "expo-linear-gradient";
import useAuthentication, { useStore } from "../utils/firebase/useAuthentication";

export default function PaymentScreen({ route, navigation }: any) {
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(undefined) as any;
  const [setupIntentClientSecret, setSetupIntentClientSecret] = useState(undefined) as any;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { id, ownerId, isOffer, offerPrice, itemsWanted, additionalFunds } = route.params;
  const user = useStore((state) => state.user);
  const { data, isLoading: isUserLoading } = useQuery("currentUser", () => fetchUser(user.uid), {
    onSuccess: () => {
      initializePaymentSheet();
    },
  });
  const { data: ownerData, isLoading } = useQuery(`user-${ownerId}`, () => fetchUser(ownerId));
  const { data: listingData, isLoading: isListingLoading } = useQuery(`listing-${id}`, () => fetchListing(id));
  const price = isOffer ? offerPrice : listingData?.price;
  const queryClient = useQueryClient();
  const mutateUser: any = useMutation((data) => updateUser(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("currentUser");
      queryClient.invalidateQueries("userTrades");
      queryClient.invalidateQueries("userOffers");
      queryClient.invalidateQueries("listings");
      initializePaymentSheet();
    },
  });
  const mutatePayment: any = useMutation((data) => chargeBuy(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("currentUser");
      queryClient.invalidateQueries("userTrades");
      queryClient.invalidateQueries("userOffers");
      queryClient.invalidateQueries("listings");
    },
  });

  const initializePaymentSheet = async () => {
    const paymentSheetData = await fetchSetupPaymentSheetParams(user?.uid);
    const { setupIntent, ephemeralKey, customer } = paymentSheetData;
    setSetupIntentClientSecret(setupIntent);

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      setupIntentClientSecret: setupIntent,
    });
    if (!error) {
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (!error) {
      const { setupIntent } = await retrieveSetupIntent(setupIntentClientSecret);
      const paymentMethod = await fetchPaymentMethod(setupIntent?.paymentMethodId);
      mutateUser.mutate({
        uid: user.uid,
        paymentMethodId: setupIntent?.paymentMethodId,
        paymentLast4: paymentMethod?.card?.last4,
        paymentExpYear: paymentMethod?.card?.exp_year,
        paymentExpMonth: paymentMethod?.card?.exp_month,
      });
    }
  };

  // async function getPaymentMethod(data: any) {
  //   const paymentMethod = await fetchPaymentMethod(data?.paymentMethodId);
  //   setCurrentPaymentMethod(paymentMethod);
  // }

  // useEffect(() => {
  //   async function getPaymentMethod() {
  //     const paymentMethod = await fetchPaymentMethod(data?.paymentMethodId);
  //     setCurrentPaymentMethod(paymentMethod);
  //   }
  //   getPaymentMethod();
  // }, []);

  // const openPaymentSheet = async () => {
  //   const { error } = await presentPaymentSheet();

  //   if (!error) {
  //     mutateUser.mutate({ uid: user.uid, sold: true });
  //     sendConfirmationEmail(data, listingData, undefined);
  //     Alert.alert("Your order is confirmed!", "Keep shopping!");
  //     navigation.navigate("HomeTabs");
  //   }
  // };
  const handleBuy = async () => {
    await mutatePayment.mutate({ uid: user?.uid, listingId: listingData?.id });
    sendConfirmationEmail(data, listingData, undefined);
    Alert.alert("Your order is confirmed!", "Keep shopping!");
    navigation.navigate("HomeTabs");
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
              <Text style={styles.detailValue}>
                $
                {Math.round(
                  additionalFunds === undefined ? price * 1.0725 + 20 : additionalFunds > 0 ? additionalFunds * 1.0725 + 20 : 20
                )}
              </Text>
            </View>
          </View>
        </View>
        {data?.address ? (
          <>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Shipping Details</Text>
              <TouchableOpacity onPress={handleShippingDetails}>
                <Image source={require("../assets/Edit_Logo.png")} style={styles.editLogo} />
              </TouchableOpacity>
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
          !data?.paymentMethodId ? (
            <TouchableOpacity style={styles.submitButtonContainer} onPress={openPaymentSheet}>
              <LinearGradient
                colors={["#aaa", "#aaa", "#333"]}
                locations={[0, 0.3, 1]}
                style={styles.submitButton}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.submitButtonText}>Add Payment Method</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>Payment Details</Text>
                <TouchableOpacity onPress={openPaymentSheet}>
                  <Image source={require("../assets/Edit_Logo.png")} style={styles.editLogo} />
                </TouchableOpacity>
              </View>
              <View style={styles.cardContainer}>
                <View style={styles.addressContainer}>
                  <Text style={styles.addressText}>Card ending in {data?.paymentLast4}</Text>
                  <Text style={styles.addressText}>
                    Expires {data?.paymentExpMonth}/{data?.paymentExpYear}
                  </Text>
                </View>
              </View>
            </>
          )
        ) : null}
        {data?.address && data?.paymentMethodId ? (
          <TouchableOpacity style={styles.submitButtonContainer} onPress={handleBuy}>
            <LinearGradient
              colors={["#aaa", "#aaa", "#333"]}
              locations={[0, 0.3, 1]}
              style={styles.submitButton}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.submitButtonText}>Confirm Payment</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : null}
      </SafeAreaView>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  calcContainer: {},
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
