import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import useAuthentication from "../utils/firebase/useAuthentication";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { chargeOffer, fetchOffersByUser, sendCancelOfferEmail, sendConfirmationEmail, sendDeclineOfferEmail, updateOffer } from "../data/api";

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
      <Tab.Screen name="Offers to Review" component={SellOffers} />
      <Tab.Screen name="Your Offers" component={BuyOffers} />
      <Tab.Screen name="Trades" component={Trades} />
    </Tab.Navigator>
  );
}

function OfferItem({ offer, direction }: any) {
  const queryClient = useQueryClient();
  const acceptMutation: any = useMutation((data) => updateOffer(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("userOffers");
    },
  });
  const cancelMutation: any = useMutation((data) => updateOffer(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("userOffers");
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
  const user = useAuthentication();
  const { data: userData, isLoading } = useQuery("userOffers", () => fetchOffersByUser(user?.uid));
  return isLoading || !userData.Seller.length ? (
    <SafeAreaView style={styles.container}>
      <Text>You don't have any offers yet!</Text>
    </SafeAreaView>
  ) : (
    <FlatList
      style={styles.flatList}
      data={userData.Seller}
      renderItem={({ item }) => <OfferItem offer={item} direction="sell" />}
    />
  );
}
function BuyOffers() {
  const user = useAuthentication();
  const { data: userData, isLoading } = useQuery("userOffers", () => fetchOffersByUser(user?.uid));
  return isLoading || !userData.Buyer.length ? (
    <SafeAreaView style={styles.container}>
      <Text>You don't have any offers yet!</Text>
    </SafeAreaView>
  ) : (
    <FlatList
      style={styles.flatList}
      data={userData.Buyer}
      renderItem={({ item }) => <OfferItem offer={item} direction="buy" />}
    />
  );
}
function Trades() {
  const user = useAuthentication();
  const { data: userData, isLoading } = useQuery("userOffers", () => fetchOffersByUser(user?.uid));
  return isLoading || !userData.Buyer.length ? (
    <SafeAreaView style={styles.container}>
      <Text>You don't have any offers yet!</Text>
    </SafeAreaView>
  ) : (
    <FlatList
      style={styles.flatList}
      data={userData.Buyer}
      renderItem={({ item }) => <OfferItem offer={item} direction="buy" />}
    />
  );
}


const styles = StyleSheet.create({
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
