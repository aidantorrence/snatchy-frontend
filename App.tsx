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

function Icon({ imgSrc }: any) {
  return (
    <View style={{ paddingTop: 15 }}>
      <Image source={imgSrc} resizeMode="contain" style={{ width: 33 }} />
    </View>
  );
}

const Stack = createStackNavigator();

function CreateScreenStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CreateListing" options={{ headerTitle: "Create a Listing" }} component={CreateListingScreen} />
      <Stack.Screen name="ViewListing" options={{ headerTitle: "", title: "" }} component={ViewListingScreen} />
      <Stack.Screen name="ViewProfile" options={{ headerTitle: "", title: "" }} component={ViewProfileScreen} />
      <Stack.Screen name="EditListing" options={{ headerTitle: "", title: "" }} component={EditListingScreen} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App({ navigation, route }: any) {
  // useLayoutEffect(() => {
  //   const routeName = getFocusedRouteNameFromRoute(route || {});
  //   if (routeName === "ViewListing") navigation.setOptions({ tabBarStyle: { display: "none" } });
  // }, [navigation, route]);
  return (
    <QueryClientProvider client={new QueryClient()}>
      <NavigationContainer>
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
            component={CreateScreenStackNavigation}
            options={{
              tabBarIcon: ({ focused }) => <Icon imgSrc={focused ? icons.createFocused : icons.create} />,
            }}
          />
          <Tab.Screen
            name="Profile"
            component={EditProfileScreen}
            options={{
              tabBarIcon: ({ focused }) => <Icon imgSrc={focused ? icons.profileFocused : icons.profile} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
