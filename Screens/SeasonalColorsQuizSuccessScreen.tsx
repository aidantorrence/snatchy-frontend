import {
  View,
  Text,
  SafeAreaView,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import FastImage from "react-native-fast-image";

export default function SeasonalColorsQuizSuccessScreen({ navigation, route }: any) {
  const {seasonalColor} = route?.params

  const seasonalColorSwitch = (seasonalColor: string) => {
    switch (seasonalColor) {
      case 'Summer':
        return require("../assets/summer-season.jpeg")
      case 'Winter':
        return require("../assets/winter-season.jpeg")
      case 'Spring':
        return require("../assets/spring-season.jpeg")
      case 'Autumn':
        return require("../assets/autumn-season.jpeg")
      default:
        return require("../assets/summer-season.jpeg")
    }
  }

  return (
    <>
        <SafeAreaView style={styles.profileScreenContainer}>
          <View style={styles.buttonsContainer}>
            <Text style={styles.congratsText}>Congrats, your seasonal color is {seasonalColor}!</Text>
            <FastImage source={seasonalColorSwitch(seasonalColor)} style={styles.uploadedImage} />
              <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('HomeTabs')}>
                <Text style={styles.continueButtonText}>Complete</Text>
              </TouchableOpacity>
          </View>
        </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  continueButton: {
    marginTop: 20,
    borderRadius: 8,
    padding: 15,
    marginHorizontal: Dimensions.get("window").width * 0.01,
    width: Dimensions.get("window").width * 0.44,
    backgroundColor: "#6F3284",
  },
  continueButtonText: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  uploadedImage: {
    marginTop: 20,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width,
    marginBottom: 5,
  },
  congratsText: {
    fontSize: 20,
  },
  buttonsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  styleProfileButton: {
    alignSelf: 'center',
    borderWidth: 1,
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#d7d7d7',
    marginBottom: 20,
  },
  screenAreaView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userImage: {
    borderRadius: 50,
    width: 20,
    height: 20,
    marginRight: 5,
  },
  sellerName: {
    fontSize: 15,
    fontWeight: "bold",
  },
  modusTypeText: {
    fontSize: 14,
  },
  listingsHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: 20,
    marginHorizontal: 20,
  },
  profileScreenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  userImagesContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
  },
  userImages: {
    width: Dimensions.get("window").width * 0.315,
    height: Dimensions.get("window").width * 0.315,
  },
  imagesContainer: {
    marginRight: Dimensions.get("window").width * 0.03,
    marginBottom: Dimensions.get("window").width * 0.03,
  },
  noOutfitsImage: {
    width: 200,
    height: 200,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 10,
    marginBottom: 5,
  },
  body: {
    fontSize: 22,
  },
  bio: {
    fontSize: 17,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  button: {
    backgroundColor: "white",
    borderWidth: 0.5,
    borderRadius: 30,
    padding: 4,
    paddingTop: 1,
    paddingBottom: 1,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
    marginRight: 15,
  },
});
