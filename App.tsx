import {
  Image,
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Button,
} from "react-native";
import { getFocusedRouteNameFromRoute, NavigationContainer, useNavigation, useNavigationState } from "@react-navigation/native";
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
import { fetchUser } from "./data/api";
import OrderConfirmationScreen from "./Screens/OrderConfirmationScreen";
import SetupPaymentsScreen from "./Screens/SetupPaymentsScreen";
import TradePaymentsScreen from "./Screens/TradePaymentsScreen";
import * as Sentry from "sentry-expo";
import SettingsScreen from "./Screens/SettingsScreen";
import PostOutfitScreen from "./Screens/PostOutfitScreen";
import FilterScreen, { ModusTypeFilterScreen, SeasonalColorFilterScreen } from "./Screens/FilterScreen";
import ViewOutfitScreen from "./Screens/ViewOutfitScreen";
import ModusTypeQuizScreen from "./Screens/ModusTypeQuizScreen";
import QuizHeightScreen from "./Screens/QuizHeightScreen";
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
import Constants from "expo-constants";
import QuizMainGoalScreen from "./Screens/QuizMainGoalScreen";
import QuizShoppingExperienceScreen from "./Screens/QuizShoppingExperienceScreen";
import QuizImportantFactorsScreen from "./Screens/QuizImportantFactorsScreen";
import QuizPlatformScreen from "./Screens/QuizPlatformScreen";
import ModusTypeQuizIntroScreen from "./Screens/ModusTypeQuizIntroScreen";
import StyleProfileScreen from "./Screens/StyleProfileScreen";
import SeasonalColorsQuizIntroScreen from "./Screens/SeasonalColorsQuizIntroScreen";
import SeasonalColorsQuizSuccessScreen from "./Screens/SeasonalColorsQuizSuccessScreen";
import SeasonalColorDescriptionScreen from "./Screens/SeasonalColorDescriptionScreen";
import GenerateOutfitIntroScreen from "./Screens/GenerateOutfitIntroScreen";
import GenerateOutfitTryOnScreen from "./Screens/GenerateOutfitTryOnScreen";
import GenerateOutfitChooseSelfiesScreen from "./Screens/GenerateOutfitChooseSelfiesScreen";
import GenerateOutfitLoadingScreen from "./Screens/GenerateOutfitResultsScreen";
import GenerateOutfitResultsScreen from "./Screens/GenerateOutfitResultsScreen";
import GenerateOutfitViewOutfitScreen from "./Screens/GenerateOutfitViewOutfitScreen";

if (Constants?.expoConfig?.extra?.env !== "development") {
  mixpanel.init();
  Smartlook.setupAndStartRecording("81e26ed67a2b57e7ec91148e4054faa7b37f03e0");
}

const queryClient = new QueryClient();

Sentry.init({
  dsn: "https://c777f53f2cd94a8198526620d7d373fb@o1411142.ingest.sentry.io/4504101948948480",
  // enableInExpoDevelopment: true,
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
      <Stack.Screen name="GenerateOutfitIntro" options={{ headerTitle: "" }} component={GenerateOutfitIntroScreen} />
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
            options={{ headerTitle: "Snatchy", title: "", headerShown: false }}
            component={HomeTabs}
          />
          <Stack.Screen
            name="Settings"
            options={{ headerTitle: "Snatchy", title: "", headerShown: true }}
            component={SettingsScreen}
          />
          <Stack.Screen
            name="StyleProfile"
            options={{ headerTitle: "Snatchy", title: "", headerShown: true }}
            component={StyleProfileScreen}
          />
          <Stack.Screen name="GenerateOutfitIntro" options={{ headerTitle: "" }} component={GenerateOutfitIntroScreen} />
          <Stack.Screen
            name="SeasonalColorsQuizNavigation"
            options={{ headerTitle: "Snatchy", title: "", headerShown: true }}
            component={SeasonalColorsQuizNavigation}
          />
          <Stack.Screen
            name="ModusQuizNavigation"
            options={{ headerTitle: "Snatchy", title: "", headerShown: true }}
            component={ModusQuizNavigation}
          />
          <Stack.Screen
            name="ViewOutfit"
            options={{ headerTitle: "Snatchy", title: "", headerShown: true }}
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
            options={{ headerTitle: "Snatchy", headerShown: true }}
            component={ModusTypeFilterScreen}
          />
          <Stack.Screen name="QuizSuccessStack" options={{ headerTitle: "", title: "" }} component={QuizSuccessStackNavigation} />
          <Stack.Screen
            name="SeasonalColorFilter"
            options={{ headerTitle: "Snatchy", headerShown: true }}
            component={SeasonalColorFilterScreen}
          />
          <Stack.Screen
            name="ModusDescription"
            options={{
              headerTitle: "Snatchy",
              headerShown: true,
              headerRight: () => <Button title="Seasonal Color >" />,
            }}
            component={ModusDescriptionScreen}
          />
          <Stack.Screen
            name="SeasonalColorDescription"
            options={{ headerTitle: "Snatchy", title: "", headerShown: true }}
            component={SeasonalColorDescriptionScreen}
          />
          <Stack.Screen
            name="GenerateScreenStackNavigation"
            options={{ headerTitle: "Snatchy", title: "", headerShown: true }}
            component={GenerateScreenStackNavigation}
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
    </Stack.Navigator>
  );
}

export function GenerateScreenStackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
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
      <Stack.Screen name="GenerateOutfitIntro" options={{ headerTitle: "Snatchy" }} component={GenerateOutfitIntroScreen} />
      <Stack.Screen name="GenerateOutfitTryOn" options={{ headerTitle: "Snatchy" }} component={GenerateOutfitTryOnScreen} />
      <Stack.Screen
        name="GenerateOutfitChooseSelfies"
        options={{ headerTitle: "" }}
        component={GenerateOutfitChooseSelfiesScreen}
      />
      <Stack.Screen name="GenerateOutfitResults" options={{ headerTitle: "Snatchy" }} component={GenerateOutfitResultsScreen} />
      <Stack.Screen
        name="GenerateOutfitViewOutfit"
        options={{ headerTitle: "Snatchy" }}
        component={GenerateOutfitViewOutfitScreen}
      />
      <Stack.Screen name="PostOutfit" options={{ headerTitle: "Snatchy" }} component={PostOutfitScreen} />
      <Stack.Screen name="ViewProfile" options={{ headerTitle: "Snatchy", title: "" }} component={ViewProfileScreen} />
      <Stack.Screen name="Settings" options={{ headerTitle: "Snatchy", title: "" }} component={SettingsScreen} />
    </Stack.Navigator>
  );
}

function SeasonalColorsQuizNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="SeasonalColorsQuizIntro"
        options={{ headerTitle: "", title: "" }}
        component={SeasonalColorsQuizIntroScreen}
      />
      <Stack.Screen
        name="SeasonalColorsQuizSuccess"
        options={{ headerTitle: "", title: "" }}
        component={SeasonalColorsQuizSuccessScreen}
      />
    </Stack.Navigator>
  );
}

function ModusQuizNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ModusTypeQuizIntro"
        options={{ headerTitle: "", title: "", headerShown: false }}
        component={ModusTypeQuizIntroScreen}
      />
      <Stack.Screen name="QuizHeight" options={{ headerTitle: "", title: "", headerShown: false }} component={QuizHeightScreen} />
      <Stack.Screen name="QuizLimbLength" options={{ headerTitle: "", title: "" }} component={QuizLimbLengthScreen} />
      <Stack.Screen name="QuizClothing" options={{ headerTitle: "", title: "" }} component={QuizClothingScreen} />
      <Stack.Screen name="QuizAsymmetry" options={{ headerTitle: "", title: "" }} component={QuizAsymmetryScreen} />
      <Stack.Screen name="QuizRestricted" options={{ headerTitle: "", title: "" }} component={QuizRestrictedScreen} />
      <Stack.Screen name="QuizSilhouette" options={{ headerTitle: "", title: "" }} component={QuizSilhouetteScreen} />
      <Stack.Screen name="QuizOrnateDetails" options={{ headerTitle: "", title: "" }} component={QuizOrnateDetailsScreen} />
      <Stack.Screen name="QuizThickMaterials" options={{ headerTitle: "", title: "" }} component={QuizThickMaterialsScreen} />
      <Stack.Screen name="QuizSuccess" options={{ headerTitle: "", title: "" }} component={QuizSuccessScreen} />
    </Stack.Navigator>
  );
}

function LogoTitle({ index }: any) {
  return (
    <View style={styles.onboardingHeaderTitle}>
      {new Array(4).fill(0).map((_, i) => (
        <View key={i} style={[styles.onboardingHeaderBars, index === i ? styles.activeHeader : undefined]}></View>
      ))}
    </View>
  );
}
function OnboardingQuizNavigation() {
  const index = useNavigationState((state) => state?.routes[0]?.state?.index);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: styles.onboardingHeader,
        headerTitle: () => <LogoTitle index={index} />,
        headerLeft: () => null,
      }}
    >
      <Stack.Screen name="QuizMainGoal" options={{}} component={QuizMainGoalScreen} />
      <Stack.Screen name="QuizShoppingExperience" options={{}} component={QuizShoppingExperienceScreen} />
      <Stack.Screen name="QuizImportantFactors" options={{}} component={QuizImportantFactorsScreen} />
      <Stack.Screen name="QuizPlatform" options={{}} component={QuizPlatformScreen} />
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
        if (user?.uid)
          Smartlook.setUserIdentifier(user?.uid, {
            email: data.email,
            name: data.firstName + " " + data.lastName,
            modusType: data.modusType,
          });
      }
    },
  });

  if (user?.uid) {
    // Smartlook.registerIntegrationListener(
    //   (visitor) => {
    //     mixpanel.getPeople().set({ smartlook_visitor_url: visitor });
    //     mixpanel.identify(user?.uid);
    //   },
    //   (dash) => {
    //     mixpanel.track("Smartlook session URL", { session_url: dash });
    //   }
    // );
  }

  return isLoading ? (
    <SafeAreaView style={styles.screenAreaView}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  ) : !user?.uid ? (
    <SignupStackNavigation />
  ) : !user?.hasSeenIntroQuiz ? (
    <OnboardingQuizNavigation />
  ) : !user?.modusType ? (
    <ModusQuizNavigation />
  ) : !user?.hasSeenModusType ? (
    <QuizSuccessScreen />
  ) : (
    <Tab.Navigator
     initialRouteName="CreateStack"
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
          headerShown: true,
          headerTitle: 'Snatchy',
          tabBarIcon: ({ focused }) => <Icon style={styles.leftIcon} imgSrc={focused ? icons.homeFocused : icons.home} />,
        }}
      />
      <Tab.Screen
        name="CreateStack"
        component={GenerateScreenStackNavigation}
        options={{
          tabBarIcon: ({ focused }) => <Icon style={styles.centerIcon} imgSrc={focused ? icons.createFocused : icons.create} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreenStackNavigation}
        options={{
          headerShown: true,
          headerTitle: 'Snatchy',
          tabBarIcon: ({ focused }) => <Icon style={styles.rightIcon} imgSrc={focused ? icons.profileFocused : icons.profile} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  onboardingHeaderBars: {
    height: 4,
    width: Dimensions.get("window").width / 4 - 7,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 2.5,
  },
  activeHeader: {
    backgroundColor: "#333333",
  },
  onboardingHeaderTitle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  onboardingHeader: {
    borderBottomWidth: 0,
    shadowOpacity: 0,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
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
    width: 40,
    height: 40,
  },
  leftIcon: {
    marginLeft: 50,
    width: 32,
    height: 32,
  },
  rightIcon: {
    marginRight: 50,
    width: 30,
    height: 30,
  },
});
