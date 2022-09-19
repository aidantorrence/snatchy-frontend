
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { checkStripeConnectAccountStatus, createStripeConnectAccount, fetchUser } from "../data/api";
import useAuthentication, { useStore } from "../utils/firebase/useAuthentication";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useQuery, useQueryClient } from "react-query";
import { useEffect } from "react";

export default function OrderConfirmationScreen({ navigation }: any) {
  const user = useStore((state) => state.user);
  const queryClient = useQueryClient();
  const { isLoading, data: userData, error } = useQuery("currentUser", () => fetchUser(user.uid));

  return isLoading ? null : (
    <SafeAreaView>
      <Text>Your order is confirmed!  We will notify you when it has been sent.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
