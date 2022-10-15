import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { Alert, Button, SafeAreaView, StyleSheet, View } from "react-native";
import { API_URL } from "../data/api";

export default function CheckoutScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch(`${API_URL}/payment-sheet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    } catch (e) {
      console.log(e);
    }
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

    console.log("paymentIntent", paymentIntent);
    console.log("ephemeralKey", ephemeralKey);
    console.log("customer", customer);

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
    });
    if (!error) {
      setLoading(true);
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
    initializePaymentSheet();
  }, []);

  return (
    <StripeProvider publishableKey={Constants?.expoConfig?.extra?.publishableKey}>
      <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Button disabled={!loading} title="Checkout" onPress={openPaymentSheet} />
      </View>
      </SafeAreaView>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 200,
    height: 200,
  },
});
