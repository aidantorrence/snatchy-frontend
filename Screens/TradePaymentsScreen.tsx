import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert, SafeAreaView, Image, TouchableOpacity, Modal } from "react-native";
import { CardField, retrieveSetupIntent, StripeProvider, useConfirmPayment, useStripe } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  fetchListing,
  fetchPaymentMethod,
  fetchPaymentSheetParams,
  fetchSetupPaymentSheetParams,
  fetchUser,
  postOffer,
  postTrade,
  sendConfirmationEmail,
  sendOfferEmail,
  sendTradeOfferEmail,
  updateUser,
} from "../data/api";
import { LinearGradient } from "expo-linear-gradient";
import useAuthentication, { useStore } from "../utils/firebase/useAuthentication";

export default function TradePaymentsScreen({ route, navigation }: any) {
  const [setupIntentClientSecret, setSetupIntentClientSecret] = useState(undefined) as any;
  const [confirmModalIsVisible, setConfirmModalIsVisible] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { id, ownerId, itemsWanted, itemsToTrade, additionalFundsBuyer, additionalFundsSeller } = route.params;
  const user = useStore((state) => state.user);
  const { data, isLoading: isUserLoading } = useQuery("currentUser", () => fetchUser(user?.uid), {
    onSuccess: () => {
      initializePaymentSheet();
    },
  });
  const { data: ownerData, isLoading } = useQuery(`user-${ownerId}`, () => fetchUser(ownerId));
  const { data: listingData, isLoading: isListingLoading } = useQuery(`listing-${id}`, () => fetchListing(id));
  const queryClient = useQueryClient();
  const useUpdateUser: any = useMutation((data) => updateUser(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("currentUser");
      queryClient.invalidateQueries("userTrades");
      queryClient.invalidateQueries("userOffers");
      initializePaymentSheet();
    },
  });
  const mutateTrade: any = useMutation((data) => postTrade(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("userTrades");
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
      useUpdateUser.mutate({
        uid: user.uid,
        paymentMethodId: setupIntent?.paymentMethodId,
        paymentLast4: paymentMethod?.card?.last4,
        paymentExpYear: paymentMethod?.card?.exp_year,
        paymentExpMonth: paymentMethod?.card?.exp_month,
      });
    }
  };

  useEffect(() => {
    if (!data) return;
    initializePaymentSheet();
  }, [data]);

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
  const handleConfirmOffer = async () => {
    mutateTrade.mutate({
      buyerId: user?.uid,
      sellerId: ownerId,
      sellerListings: itemsWanted,
      buyerListings: itemsToTrade,
      additionalFundsSeller,
      additionalFundsBuyer,
    });
    sendTradeOfferEmail(itemsWanted, itemsToTrade, ownerId, user?.uid, additionalFundsBuyer, additionalFundsSeller);
    Alert.alert("You have made an offer!", "Keep shopping!");
    navigation.navigate("HomeTabs");
  };
  return (
    <>
      <StripeProvider publishableKey={Constants?.expoConfig?.extra?.publishableKey}>
        <SafeAreaView style={styles.container}>
          <View style={styles.calcContainer}>
            <View style={styles.detailContainer}>
              {additionalFundsBuyer ? (
                <>
                  <Text style={styles.detailTitle}>{"Added Cash"}</Text>
                  <View style={styles.detailValueContainer}>
                    <Text style={styles.detailValue}>${Math.round(additionalFundsBuyer)}</Text>
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
          {additionalFundsBuyer !== null ? (
            <View style={styles.calcContainer}>
              <View style={styles.detailContainer}>
                <Text style={styles.detailTitle}>Sales Tax</Text>
                <View style={styles.detailValueContainer}>
                  <Text style={styles.detailValue}>${Math.round(additionalFundsBuyer * 0.0725)}</Text>
                </View>
              </View>
            </View>
          ) : null}
          <View style={styles.divider} />
          <View style={styles.calcContainer}>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>Total</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>${Math.round(additionalFundsBuyer * 1.0725 + 20)}</Text>
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
            <TouchableOpacity style={styles.submitButtonContainer} onPress={() => setConfirmModalIsVisible(true)}>
              <LinearGradient
                colors={["#aaa", "#aaa", "#333"]}
                locations={[0, 0.3, 1]}
                style={styles.submitButton}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.submitButtonText}>Make Offer</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : null}
        </SafeAreaView>
      </StripeProvider>
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmModalIsVisible}
        onRequestClose={() => setConfirmModalIsVisible(!confirmModalIsVisible)}
      >
        <SafeAreaView style={styles.confirmModalContainer}>
          <TouchableOpacity onPress={() => setConfirmModalIsVisible(!confirmModalIsVisible)} style={styles.closeIconContainer}>
            <Image source={require("../assets/Close_Logo.png")} style={styles.closeIcon} />
          </TouchableOpacity>
          <View style={styles.confirmModalTextContainer}>
            <Text style={styles.confirmModalText}>
              If the seller accepts your offer, you will be immediately charged the above amount.
            </Text>
            <TouchableOpacity onPress={handleConfirmOffer} style={styles.buttonContainer}>
              <LinearGradient
                colors={["#aaa", "#aaa", "#333"]}
                locations={[0, 0.3, 1]}
                style={styles.confirmButton}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.completeButtonText}>Confirm Offer</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  calcContainer: {},
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
  buttonContainer: {
    alignItems: "center",
  },
  closeIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    // position: "absolute",
    // top: 0,
  },
  closeIconContainer: {
    flex: 1,
    alignItems: "flex-end",
    marginHorizontal: 20,
  },
  confirmModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0, .9)",
    justifyContent: "flex-end",
  },
  confirmModalTextContainer: {
    borderRadius: 25,
    backgroundColor: "white",
    margin: 20,
  },
  confirmModalText: {
    fontSize: 25,
    paddingVertical: 5,
    paddingHorizontal: 30,
    lineHeight: 33,
    textAlign: "center",
  },
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
