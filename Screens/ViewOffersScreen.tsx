import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import useAuthentication, { useStore } from "../utils/firebase/useAuthentication";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  chargeOffer,
  chargeTrade,
  fetchOffersByUser,
  fetchPaymentMethod,
  fetchSetupPaymentSheetParams,
  fetchTradesByUser,
  sendConfirmationEmail,
  sendDeclineOfferEmail,
  sendDeclineTradeOfferEmail,
  sendTradeConfirmationEmail,
  updateOffer,
  updateTrade,
  updateUser,
} from "../data/api";
import { createStackNavigator } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { initPaymentSheet, presentPaymentSheet, retrieveSetupIntent } from "@stripe/stripe-react-native";

const Tab = createMaterialTopTabNavigator();

export default function ViewOffersScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <OfferTabs />
    </SafeAreaView>
  );
}

function OfferTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Offers Received" component={SellOffers} />
      <Tab.Screen name="Your Offers" component={BuyOffers} />
      <Tab.Screen name="Trades Received" component={SellTradeStackNavigation} />
      <Tab.Screen name="Your Trades" component={BuyTradeStackNavigation} />
    </Tab.Navigator>
  );
}

function OfferItem({ offer, direction }: any) {
  const queryClient = useQueryClient();
  const acceptMutation: any = useMutation((data) => updateOffer(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("userOffers");
      queryClient.invalidateQueries("currentUser");
      queryClient.invalidateQueries("listings");
    },
  });
  const cancelMutation: any = useMutation((data) => updateOffer(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("userOffers");
      queryClient.invalidateQueries("currentUser");
    },
  });

  const acceptOffer = async (offer: any) => {
    await chargeOffer(offer);
    sendConfirmationEmail(undefined, undefined, offer);
    const { error } = await acceptMutation.mutate({ id: offer.id, accepted: true, listingId: offer.listingId });
    if (!error) {
      Alert.alert("Offer accepted!", "Keep shopping!");
    }
  };
  const declineOffer = async (offer: any) => {
    sendDeclineOfferEmail(offer);
    cancelMutation.mutate({ id: offer.id, cancelled: true });
  };

  const handleAcceptButton = (offer: any) => {
    Alert.alert("Are you sure you want to accept this offer?", "", [
      {
        text: "Accept Offer",
        onPress: () => acceptOffer(offer),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };
  const handleCancelButton = (offer: any) => {
    Alert.alert("Are you sure you want to cancel this offer?", "", [
      {
        text: "Cancel Offer",
        onPress: () => cancelMutation.mutate({ id: offer.id, cancelled: true }),
      },
      { text: "Nevermind", style: "cancel" },
    ]);
  };
  const handleDeclineButton = (offer: any) => {
    Alert.alert("Are you sure you want to decline this offer?", "", [
      {
        text: "Decline Offer",
        onPress: () => declineOffer(offer),
      },
      { text: "Nevermind", style: "cancel" },
    ]);
  };
  return (
    <View style={styles.offerItem}>
      <Image source={{ uri: offer.listing.images[0] }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.nameText}>{offer.listing.name}</Text>
        <Text style={styles.priceText}>{offer.price}</Text>
      </View>
      {direction === "sell" ? (
        <>
          <TouchableOpacity style={styles.acceptButton} onPress={() => handleAcceptButton(offer)}>
            <Text style={styles.buttonText}>Accept Offer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => handleDeclineButton(offer)}>
            <Text style={styles.buttonText}>Reject Offer</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelButton(offer)}>
          <Text style={styles.buttonText}>Cancel Offer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function SellOffers() {
  const user = useStore((state) => state.user);
  const { data: userData, isLoading } = useQuery("userOffers", () => fetchOffersByUser(user?.uid));
  return isLoading || !userData?.SellerOffers?.length ? (
    <SafeAreaView style={styles.container}>
      <Text>You don't have any offers yet!</Text>
    </SafeAreaView>
  ) : (
    <FlatList
      style={styles.flatList}
      data={userData.SellerOffers}
      renderItem={({ item }) => <OfferItem offer={item} direction="sell" />}
    />
  );
}
function BuyOffers() {
  const user = useStore((state) => state.user);
  const { data: userData, isLoading } = useQuery("userOffers", () => fetchOffersByUser(user?.uid));
  return isLoading || !userData?.BuyerOffers?.length ? (
    <SafeAreaView style={styles.container}>
      <Text>You don't have any offers yet!</Text>
    </SafeAreaView>
  ) : (
    <FlatList
      style={styles.flatList}
      data={userData.BuyerOffers}
      renderItem={({ item }) => <OfferItem offer={item} direction="buy" />}
    />
  );
}
function BuyTrades({ navigation }: any) {
  const user = useStore((state) => state.user);
  const { data: userData, isLoading } = useQuery("userTrades", () => fetchTradesByUser(user?.uid));
  return isLoading || !userData?.BuyerTrades?.length ? (
    <SafeAreaView style={styles.container}>
      <Text>You don't have any trades yet!</Text>
    </SafeAreaView>
  ) : (
    <FlatList
      style={styles.flatList}
      data={userData.BuyerTrades}
      renderItem={({ item }) => <TradeItem navigation={navigation} trade={item} direction="buy" />}
    />
  );
}
function SellTrades({ navigation }: any) {
  const user = useStore((state) => state.user);
  const { data: userData, isLoading } = useQuery("userTrades", () => fetchTradesByUser(user?.uid));
  return isLoading || !userData?.SellerTrades?.length ? (
    <SafeAreaView style={styles.container}>
      <Text>You don't have any trades yet!</Text>
    </SafeAreaView>
  ) : (
    <FlatList
      style={styles.flatList}
      data={userData.SellerTrades}
      renderItem={({ item }) => <TradeItem trade={item} navigation={navigation} direction="sell" />}
    />
  );
}
function TradeItem({ navigation, trade, direction }: any) {
  const queryClient = useQueryClient();

  return (
    <View style={styles.tradeItem}>
      <TouchableOpacity
        style={styles.details}
        onPress={() =>
          navigation.navigate("TradeDetails", {
            trade,
          })
        }
      >
        {direction === "sell" ? (
          <Text style={styles.nameText}>You received a trade from {trade.Buyer.firstName}.</Text>
        ) : (
          <Text style={styles.nameText}>You submitted a trade against {trade.Seller.firstName}.</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
const Stack = createStackNavigator();
function BuyTradeStackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="YourTrades" component={BuyTrades} />
      <Stack.Screen name="TradeDetails" component={TradeDetails} />
    </Stack.Navigator>
  );
}
function SellTradeStackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TradesReceived" component={SellTrades} />
      <Stack.Screen name="TradeDetails" component={TradeDetails} />
    </Stack.Navigator>
  );
}
function TradeDetails({ route, navigation }: any) {
  const [setupIntentClientSecret, setSetupIntentClientSecret] = useState(undefined) as any;
  const user = useStore((state) => state.user);
  const { data: userData, isLoading } = useQuery("userTrades", () => fetchTradesByUser(user?.uid), {
    onSuccess: () => {
      initializePaymentSheet();
    },
  });
  const { trade } = route.params;
  const yourDirection = user?.uid === trade.sellerId ? "SELLER" : "BUYER";
  const yourListings = trade.tradeListings.filter((listing: any) => listing.direction === yourDirection);
  const theirListings = trade.tradeListings.filter((listing: any) => listing.direction !== yourDirection);
  const yourAddedCash = yourDirection === "SELLER" ? trade.additionalFundsSeller : trade.additionalFundsBuyer;
  const theirAddedCash = yourDirection === "SELLER" ? trade.additionalFundsBuyer : trade.additionalFundsSeller;
  const useUpdateUser: any = useMutation((data) => updateUser(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("currentUser");
      queryClient.invalidateQueries("userTrades");
      queryClient.invalidateQueries("userOffers");
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
    if (!userData) return;
    initializePaymentSheet();
  }, [userData]);

  const handleShippingDetails = () => {
    navigation.navigate("PaymentStack", {
      screen: "ShippingDetails",
    });
  };
  const queryClient = useQueryClient();
  const acceptMutation: any = useMutation((data) => updateTrade(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("userTrades");
      queryClient.invalidateQueries("currentUser");
    },
  });
  const cancelMutation: any = useMutation((data) => updateTrade(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("userTrades");
      queryClient.invalidateQueries("currentUser");
    },
  });

  const acceptTrade = async () => {
    await chargeTrade(trade.id);
    sendTradeConfirmationEmail(trade);
    await acceptMutation.mutate({ id: trade.id, accepted: true });
    Alert.alert("Trade accepted!", "Keep shopping!");
    navigation.goBack();
  };
  const declineTrade = async () => {
    sendDeclineTradeOfferEmail(trade);
    cancelMutation.mutate({ id: trade.id, cancelled: true });
    navigation.goBack();
  };
  const cancelTrade = async () => {
    cancelMutation.mutate({ id: trade.id, cancelled: true });
    navigation.goBack();
  };

  const handleAcceptButton = () => {
    Alert.alert("Are you sure you want to accept this trade?", "", [
      {
        text: "Accept Trade",
        onPress: acceptTrade,
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };
  const handleCancelButton = () => {
    Alert.alert("Are you sure you want to cancel this trade?", "", [
      {
        text: "Cancel Trade",
        onPress: cancelTrade,
      },
      { text: "Nevermind", style: "cancel" },
    ]);
  };
  const handleDeclineButton = () => {
    Alert.alert("Are you sure you want to decline this trade?", "", [
      {
        text: "Decline Trade",
        onPress: declineTrade,
      },
      { text: "Nevermind", style: "cancel" },
    ]);
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.yourListings}>
          <View>
            <Text style={styles.nameText}>Your</Text>
          </View>
          {yourListings.map(({ Listing }: any) => (
            <View key={Listing.id}>
              <Image source={{ uri: Listing.images[0] }} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.nameText}>{Listing.name}</Text>
                <Text style={styles.priceText}>{Listing.price}</Text>
              </View>
            </View>
          ))}
          {yourAddedCash ? (
            <View>
              <Text>Added cash</Text>
              <Text> {yourAddedCash}</Text>
            </View>
          ) : null}
        </View>
        <View>
          <View>
            <Text style={styles.nameText}>Their</Text>
          </View>
          {theirListings.map(({ Listing }: any) => (
            <View key={Listing.id}>
              <Image source={{ uri: Listing.images[0] }} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.nameText}>{Listing.name}</Text>
                <Text style={styles.priceText}>{Listing.price}</Text>
              </View>
            </View>
          ))}
          {theirAddedCash ? (
            <View>
              <Text>Added cash</Text>
              <Text> {theirAddedCash}</Text>
            </View>
          ) : null}
        </View>
      </View>
      {yourDirection === "SELLER" ? (
        <>
          {!userData?.address ? (
            <TouchableOpacity style={styles.addShippingContainer} onPress={handleShippingDetails}>
              <Text style={styles.addShippingTitle}>Add Your Shipping Address To Accept</Text>
            </TouchableOpacity>
          ) : null}
          {trade?.additionalFundsSeller && userData?.address && !userData?.paymentMethodId ? (
            <TouchableOpacity style={styles.submitButtonContainer} onPress={openPaymentSheet}>
              <LinearGradient
                colors={["#aaa", "#aaa", "#333"]}
                locations={[0, 0.3, 1]}
                style={styles.submitButton}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.submitButtonText}>Add Payment Method To Accept</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : null}
          {userData?.paymentMethodId ? (
            <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptButton}>
              <Text style={styles.buttonText}>Accept Trade</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.cancelButton} onPress={handleDeclineButton}>
            <Text style={styles.buttonText}>Reject </Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelButton}>
          <Text style={styles.buttonText}>Cancel </Text>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  yourListings: {},
  tradeItem: {},
  details: {},
  nameText: {},
  priceText: {},
  buttonText: {},
  acceptButton: {
    backgroundColor: "blue",
    borderRadius: 7,
    borderWidth: 1,
  },
  cancelButton: {
    backgroundColor: "rgba(255,30,30,1)",
    borderRadius: 7,
    borderWidth: 1,
  },
  flatList: {
    backgroundColor: "white",
  },
  offerItem: {
    flexDirection: "row",
  },
  image: {
    height: 30,
    width: 30,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
