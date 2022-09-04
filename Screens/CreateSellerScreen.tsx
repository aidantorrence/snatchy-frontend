import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { checkStripeConnectAccountStatus, createStripeConnectAccount, fetchUser } from "../data/api";
import useAuthentication from "../utils/firebase/useAuthentication";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useQuery, useQueryClient } from "react-query";
import { useEffect } from "react";

export default function CreateSellerScreen({ navigation }: any) {
  const user = useAuthentication();
  const queryClient = useQueryClient();
  const { isLoading, data: userData, error } = useQuery("currentUser", () => fetchUser(user.uid));
  const {
    isLoading: isLoadingAccount,
    data: accountData,
    error: accountError,
    refetch: refetchAccountStatus,
  } = useQuery("currentAccount", () => checkStripeConnectAccountStatus(userData?.accountId));

  useEffect(() => {
    handleCreateSeller();
  }, []);
  const handleCreateSeller = async () => {
    if (userData?.chargesEnabled) return;
    const { accountLink, accountId } = await createStripeConnectAccount(user);
    if (!accountLink) return;

    Linking.addEventListener("url", async ({ url }) => {
      await checkStripeConnectAccountStatus(accountId);
      queryClient.invalidateQueries("currentUser");
      queryClient.invalidateQueries("userTrades");
      queryClient.invalidateQueries("userOffers");
      WebBrowser.dismissBrowser();
    });
    WebBrowser.openBrowserAsync(accountLink);
  };
  return isLoading ? null : (
    <SafeAreaView>
      <Button title="Get started as a seller" onPress={handleCreateSeller} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
