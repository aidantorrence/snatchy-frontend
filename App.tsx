import { Image, View, Text, SafeAreaView, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { getFocusedRouteNameFromRoute, NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { icons } from "./utils/icons";
import EditProfileScreen from "./Screens/EditProfileScreen";
import ViewListingScreen from "./Screens/ViewListingScreen";
import ViewProfileScreen from "./Screens/ViewProfileScreen";
import EditListingScreen from "./Screens/EditListingScreen";
import OfferScreen from "./Screens/OfferScreen";
import TradeScreen from "./Screens/TradeScreen";
import { useLayoutEffect } from "react";
import HomeScreen from "./Screens/HomeScreen";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import CreateListingScreen from "./Screens/CreateListingScreen";
import SignInScreen from "./Screens/SignInScreen";
import SignUpScreen from "./Screens/SignUpScreen";
import useAuthentication from "./utils/firebase/useAuthentication";
import PaymentScreen from "./Screens/PaymentScreen";
import ShippingDetailsScreen from "./Screens/ShippingDetailsScreen";

function Icon({ imgSrc }: any) {
  return (
    <View style={{ paddingTop: 15 }}>
      <Image source={imgSrc} resizeMode="contain" style={{ width: 33, height: 33 }} />
    </View>
  );
}

const Stack = createStackNavigator();

function CreateScreenStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CreateListing" options={{ headerTitle: "Create a Listing" }} component={CreateListingScreen} />
      <Stack.Screen name="ViewProfile" options={{ headerTitle: "", title: "" }} component={ViewProfileScreen} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App({ navigation, route }: any) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="ShippingDetails" options={{ headerTitle: "", title: "" }} component={ShippingDetailsScreen} />
          <Stack.Screen name="Payment" options={{ headerTitle: "", title: "" }} component={PaymentScreen} />
          <Stack.Screen name="HomeTabs" options={{ headerTitle: "", title: "" }} component={HomeTabs} />
          <Stack.Screen name="ViewListing" options={{ headerTitle: "Listing", title: "" }} component={ViewListingScreen} />
          <Stack.Screen name="EditListing" options={{ headerTitle: "Edit Listing", title: "" }} component={EditListingScreen} />
          <Stack.Screen name="SignUp" options={{ headerTitle: "", title: "" }} component={SignUpScreen} />
          <Stack.Screen name="SignIn" options={{ headerTitle: "", title: "" }} component={SignInScreen} />
          {/* <Stack.Screen name="Sign In" component={SignInScreen} />
          <Stack.Screen name="Sign Up" component={SignOutScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

function HomeTabs() {
  const user = useAuthentication();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {},
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <Icon imgSrc={focused ? icons.homeFocused : icons.home} />,
        }}
      />
      <Tab.Screen
        name="CreateStack"
        component={user ? CreateScreenStackNavigation : SignUpScreen}
        options={{
          tabBarIcon: ({ focused }) => <Icon imgSrc={focused ? icons.createFocused : icons.create} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={user ? EditProfileScreen : SignUpScreen}
        options={{
          tabBarIcon: ({ focused }) => <Icon imgSrc={focused ? icons.profileFocused : icons.profile} />,
        }}
      />
    </Tab.Navigator>
  );
}
