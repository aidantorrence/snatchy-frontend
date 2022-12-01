import { Image, View, Text, SafeAreaView, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { getFocusedRouteNameFromRoute, NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { icons } from "./utils/icons";
import EditProfileScreen from "./Screens/EditProfileScreen";
import ViewProfileScreen from "./Screens/ViewProfileScreen";
import EditListingScreen from "./Screens/EditListingScreen";
import { useLayoutEffect, useRef } from "react";
import HomeScreen from "./Screens/HomeScreen";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import SignInScreen from "./Screens/SignInScreen";
import SignUpScreen from "./Screens/SignUpScreen";
import useAuthentication, { useStore } from "./utils/firebase/useAuthentication";
import PaymentScreen from "./Screens/PaymentScreen";
import ShippingDetailsScreen from "./Screens/ShippingDetailsScreen";
import ItemsWantedScreen from "./Screens/ItemsWantedScreen";
import OfferScreen from "./Screens/OfferScreen";
import ItemsToTradeScreen from "./Screens/ItemsToTradeScreen";
import TradeSummaryScreen from "./Screens/TradeSummaryScreen";
import CheckoutScreen from "./Screens/CheckoutScreen";
import { fetchUser } from "./data/api";
import CreateSellerScreen from "./Screens/CreateSellerScreen";
import OrderConfirmationScreen from "./Screens/OrderConfirmationScreen";
import SetupPaymentsScreen from "./Screens/SetupPaymentsScreen";
import MessagesScreen from "./Screens/MessagesScreen";
import ViewOfferScreen from "./Screens/ViewOffersScreen";
import TradePaymentsScreen from "./Screens/TradePaymentsScreen";
import * as Sentry from "sentry-expo";
import SettingsScreen from "./Screens/SettingsScreen";
import PostOutfitScreen from "./Screens/PostOutfitScreen";
import FilterScreen, { ModusTypeFilterScreen, SeasonalColorFilterScreen } from "./Screens/FilterScreen";
import ViewOutfitScreen from "./Screens/ViewOutfitScreen";
import ModusTypeQuizScreen from "./Screens/ModusTypeQuizScreen";
import QuizIntroScreen from "./Screens/QuizIntroScreen";
import QuizLimbLengthScreen from "./Screens/QuizLimbLengthScreen";
import QuizClothingScreen from "./Screens/QuizClothingScreen";
import QuizAsymmetryScreen from "./Screens/QuizAsymmetryScreen";
import QuizRestrictedScreen from "./Screens/QuizRestrictedScreen";
import QuizSilhouetteScreen from "./Screens/QuizSilhouetteScreen";
import QuizOrnateDetailsScreen from "./Screens/QuizOrnateDetailsScreen";
import QuizThickMaterialsScreen from "./Screens/QuizThickMaterialsScreen";
import QuizSuccessScreen from "./Screens/QuizSuccessScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModusDescriptionScreen from "./Screens/ModusDescriptionScreen";
import analytics from "@react-native-firebase/analytics";
import FastImage from "react-native-fast-image";
import Smartlook from "smartlook-react-native-wrapper";
import { mixpanel } from "./utils/mixpanel";
import { setUser } from "@sentry/react-native";
import Constants from "expo-constants";

if (Constants?.expoConfig?.extra?.env !== "development") {
  mixpanel.init();
  Smartlook.setupAndStartRecording("81e26ed67a2b57e7ec91148e4054faa7b37f03e0");
}

const queryClient = new QueryClient();

Sentry.init({
  dsn: "https://c777f53f2cd94a8198526620d7d373fb@o1411142.ingest.sentry.io/4504101948948480",
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

function Icon({ imgSrc, style }: any) {
  return (
    <View style={{ paddingTop: 8 }}>
      <FastImage source={imgSrc} resizeMode="contain" style={[styles.icon, style]} />
    </View>
  );
}

const Stack = createStackNavigator();

export function CreateScreenStackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PostOutfit" options={{ headerTitle: "" }} component={PostOutfitScreen} />
      <Stack.Screen name="ViewProfile" options={{ headerTitle: "", title: "" }} component={ViewProfileScreen} />
      <Stack.Screen name="Settings" options={{ headerTitle: "", title: "" }} component={SettingsScreen} />
    </Stack.Navigator>
  );
}
function ProfileScreenStackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ViewProfile" options={{ headerTitle: "", title: "" }} component={ViewProfileScreen} />
      <Stack.Screen name="EditProfile" options={{ headerTitle: "", title: "" }} component={EditProfileScreen} />
    </Stack.Navigator>
  );
}
function PaymentScreenStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ShippingDetails" options={{ headerTitle: "", title: "" }} component={ShippingDetailsScreen} />
      <Stack.Screen name="Payment" options={{ headerTitle: "", title: "" }} component={PaymentScreen} />
      <Stack.Screen name="Offer" options={{ headerTitle: "", title: "" }} component={OfferScreen} />
      <Stack.Screen name="SetupPayments" options={{ headerTitle: "", title: "" }} component={SetupPaymentsScreen} />
      <Stack.Screen name="OrderConfirmation" options={{ headerTitle: "", title: "" }} component={OrderConfirmationScreen} />
      <Stack.Screen name="TradePayment" options={{ headerTitle: "", title: "" }} component={TradePaymentsScreen} />
    </Stack.Navigator>
  );
}
function TradeScreenStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ItemsWanted" options={{ headerTitle: "", title: "" }} component={ItemsWantedScreen} />
      <Stack.Screen name="ItemsToTrade" options={{ headerTitle: "", title: "" }} component={ItemsToTradeScreen} />
      <Stack.Screen name="TradeSummary" options={{ headerTitle: "", title: "" }} component={TradeSummaryScreen} />
      <Stack.Screen name="PostOutfit" options={{ headerTitle: "Post an Outfit" }} component={PostOutfitScreen} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App({ navigation, route }: any) {
  const routeNameRef = useRef();
  const navigationRef = useRef() as any;
  const user = useAuthentication();
  analytics().logAppOpen();
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef?.current?.getCurrentRoute()?.name;

          if (previousRouteName !== currentRouteName) {
            await analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          }
          routeNameRef.current = currentRouteName;
        }}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            headerBackTitleVisible: false,
            headerBackImage: () => (
              <FastImage style={{ height: 30, width: 30, marginLeft: 10 }} source={require("./assets/Header_Back_Logo.png")} />
            ),
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
            },
          }}
        >
          <Stack.Screen
            name="HomeTabs"
            options={{ headerTitle: "LooksMax", title: "", headerShown: true }}
            component={HomeTabs}
          />
          <Stack.Screen name="PaymentStack" options={{ headerTitle: "", title: "" }} component={PaymentScreenStackNavigation} />
          <Stack.Screen name="TradeStack" options={{ headerTitle: "", title: "" }} component={TradeScreenStackNavigation} />
          <Stack.Screen
            name="Settings"
            options={{ headerTitle: "LooksMax", title: "", headerShown: true }}
            component={SettingsScreen}
          />
          <Stack.Screen
            name="ViewOutfit"
            options={{ headerTitle: "LooksMax", title: "", headerShown: true }}
            component={ViewOutfitScreen}
          />
          <Stack.Screen name="EditListing" options={{ headerTitle: "Edit Listing", title: "" }} component={EditListingScreen} />
          <Stack.Screen
            name="ViewProfile"
            options={{ headerTitle: "", title: "", headerShown: true }}
            component={ViewProfileScreen}
          />
          {/* <Stack.Screen name="SignupStackNavigation" options={{ headerTitle: "", title: "" }} component={SignupStackNavigation} /> */}
          <Stack.Screen name="Filter" options={{ headerTitle: "", headerShown: true }} component={FilterScreen} />
          <Stack.Screen
            name="ModusTypeFilter"
            options={{ headerTitle: "LooksMax", headerShown: true }}
            component={ModusTypeFilterScreen}
          />
          <Stack.Screen name="QuizSuccessStack" options={{ headerTitle: "", title: "" }} component={QuizSuccessStackNavigation} />
          <Stack.Screen
            name="SeasonalColorFilter"
            options={{ headerTitle: "LooksMax", headerShown: true }}
            component={SeasonalColorFilterScreen}
          />
          <Stack.Screen
            name="ModusDescription"
            options={{ headerTitle: "LooksMax", title: "", headerShown: true }}
            component={ModusDescriptionScreen}
          />
          {/* <Stack.Screen name="Sign In" component={SignInScreen} />
          <Stack.Screen name="Sign Up" component={SignOutScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

function SignupStackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignUp" options={{ headerTitle: "", title: "", headerShown: false }} component={SignUpScreen} />
      <Stack.Screen name="SignIn" options={{ headerTitle: "Sign In", title: "", headerShown: false }} component={SignInScreen} />
      {/* <Stack.Screen name="QuizIntro" options={{ headerTitle: "", title: "", headerShown: false }} component={QuizIntroScreen} />
      <Stack.Screen name="QuizLimbLength" options={{ headerTitle: "", title: "", headerShown: true }} component={QuizLimbLengthScreen} />
      <Stack.Screen name="QuizClothing" options={{ headerTitle: "", title: "", headerShown: true }} component={QuizClothingScreen} />
      <Stack.Screen name="QuizAsymmetry" options={{ headerTitle: "", title: "", headerShown: true }} component={QuizAsymmetryScreen} />
      <Stack.Screen name="QuizRestricted" options={{ headerTitle: "", title: "", headerShown: true }} component={QuizRestrictedScreen} />
      <Stack.Screen name="QuizSilhouette" options={{ headerTitle: "", title: "", headerShown: true }} component={QuizSilhouetteScreen} />
      <Stack.Screen name="QuizOrnateDetails" options={{ headerTitle: "", title: "", headerShown: true }} component={QuizOrnateDetailsScreen} />
      <Stack.Screen name="QuizThickMaterials" options={{ headerTitle: "", title: "", headerShown: true }} component={QuizThickMaterialsScreen} />
      <Stack.Screen name="ModusTypeQuiz" options={{ headerTitle: "", title: "", headerShown: true }} component={ModusTypeQuizScreen} /> */}
    </Stack.Navigator>
  );
}

function OnboardingQuizNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="QuizIntro" options={{ headerTitle: "", title: "", headerShown: false }} component={QuizIntroScreen} />
      <Stack.Screen
        name="QuizLimbLength"
        options={{ headerTitle: "", title: "", headerShown: true }}
        component={QuizLimbLengthScreen}
      />
      <Stack.Screen
        name="QuizClothing"
        options={{ headerTitle: "", title: "", headerShown: true }}
        component={QuizClothingScreen}
      />
      <Stack.Screen
        name="QuizAsymmetry"
        options={{ headerTitle: "", title: "", headerShown: true }}
        component={QuizAsymmetryScreen}
      />
      <Stack.Screen
        name="QuizRestricted"
        options={{ headerTitle: "", title: "", headerShown: true }}
        component={QuizRestrictedScreen}
      />
      <Stack.Screen
        name="QuizSilhouette"
        options={{ headerTitle: "", title: "", headerShown: true }}
        component={QuizSilhouetteScreen}
      />
      <Stack.Screen
        name="QuizOrnateDetails"
        options={{ headerTitle: "", title: "", headerShown: true }}
        component={QuizOrnateDetailsScreen}
      />
      <Stack.Screen
        name="QuizThickMaterials"
        options={{ headerTitle: "", title: "", headerShown: true }}
        component={QuizThickMaterialsScreen}
      />
      <Stack.Screen
        name="QuizSuccess"
        options={{ headerTitle: "", title: "", headerShown: true }}
        component={QuizSuccessScreen}
      />
    </Stack.Navigator>
  );
}

function QuizSuccessStackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="QuizSuccess"
        options={{ headerTitle: "", title: "", headerShown: true }}
        component={QuizSuccessScreen}
      />
    </Stack.Navigator>
  );
}

function HomeTabs() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const { isLoading } = useQuery("currentUser", () => fetchUser(user?.uid), {
    enabled: !!user?.uid,
    onSuccess: (data) => {
      if (data) {
        setUser({ ...data, ...user });
        mixpanel.registerSuperProperties({
          email: data.email,
          name: data.firstName + " " + data.lastName,
          modusType: data.modusType,
        });
        mixpanel.getPeople().set("email", data.email);
        mixpanel.getPeople().set("name", data.firstName + " " + data.lastName);
        mixpanel.getPeople().set("modusType", data.modusType);
        Smartlook.setUserIdentifier(user?.uid, {
          email: data.email,
          name: data.firstName + " " + data.lastName,
          modusType: data.modusType,
        });
      }
    },
  });

  if (user?.uid) {
    Smartlook.registerIntegrationListener(
      (visitor) => {
        mixpanel.getPeople().set({ smartlook_visitor_url: visitor });
        mixpanel.identify(user?.uid);
      },
      (dash) => {
        mixpanel.track("Smartlook session URL", { session_url: dash });
      }
    );
  }

  return isLoading ? (
    <SafeAreaView style={styles.screenAreaView}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  ) : !user?.uid ? (
    <SignupStackNavigation />
  ) : !user?.modusType ? (
    <OnboardingQuizNavigation />
  ) : !user?.hasSeenModusType ? (
    <QuizSuccessScreen />
  ) : (
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
          tabBarIcon: ({ focused }) => <Icon style={styles.centerIcon} imgSrc={focused ? icons.createFocused : icons.create} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreenStackNavigation}
        options={{
          tabBarIcon: ({ focused }) => <Icon imgSrc={focused ? icons.profileFocused : icons.profile} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screenAreaView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 36,
    height: 36,
  },
  centerIcon: {
    width: 43,
    height: 43,
  },
});
