import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { mixpanel } from "../utils/mixpanel";

export default function StyleProfileScreen({ navigation, route }: any) {
  const clickRetakeQuizButton = () => {
    mixpanel.track("click_retake_modus_quiz_button");
    navigation.navigate("ModusQuizNavigation");
  };

  const clickFindYourSeasonalColorButton = () => {
    mixpanel.track("click_seasonal_colors_quiz_button");
    navigation.navigate("SeasonalColorsQuizNavigation");
  };

  return (
    <>
      <SafeAreaView style={styles.profileScreenContainer}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={clickRetakeQuizButton} style={styles.styleProfileButton}>
            <Text style={styles.modusTypeText}>Retake Modus Type Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clickFindYourSeasonalColorButton} style={styles.styleProfileButton}>
            <Text style={styles.modusTypeText}>Take the Seasonal Colors Quiz</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    marginTop: 20,
  },
  styleProfileButton: {
    alignSelf: "center",
    borderWidth: 1,
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: "#d7d7d7",
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
