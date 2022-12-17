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
  const { seasonalColor } = route?.params;

  const seasonalColorSwitch = (seasonalColor: string) => {
    switch (seasonalColor) {
      case "Summer":
        return require("../assets/summer.png");
      case "Winter":
        return require("../assets/winter.png");
      case "Spring":
        return require("../assets/spring.png");
      case "Autumn":
        return require("../assets/autumn.png");
      default:
        return require("../assets/summer.png");
    }
  };

  const seasonalColorDescriptions = {
    Spring: `You are warm-toned with a fresh and clear complexion. Your appearance evokes freshness and vitality, and reminds people of spring in full bloom. You may be naturally outgoing, adventurous, confident, and optimistic. You look great in warm-toned colors reminiscent of a tropical island surrounded by turquoise water, a spring garden filled with beautiful flowers, and bright, colorful fruits such as limes, peaches, and bananas. `,
    Summer: `You are cool-toned with a light and soft complexion. Your appearance evokes serenity, and reminds people of chill summer days. You may be naturally calm, gentle, efficient, and diplomatic. You look great in cool-toned colors reminiscent of a Monet garden with a pond and water lilies, summer twilight skies filled with beautiful pastel shades, and refreshing rivers, lakes, and oceans.`,
    Autumn: `You are warm-toned with a muted and dark complexion. Your appearance evokes passion and mystery, and reminds people of the depths of autumn. You may be naturally passionate, earthy, reliable, and loyal. You look great in warm-toned colors reminiscent of late autumn evenings when the last rays of the sun dapple the land, misty forests with colorful, crackling leaves falling from thinning treetops, and ripe produce, flowers, and nuts overflowing from a cornucopia.`,
    Winter: `You are cool-toned with a bright and dark complexion. Your appearance evokes drama and elegance, and reminds people of icy winter days. You may be naturally refined, stately, perfectionist, and a little aloof. You look great in cool-toned colors reminiscent of snow-capped mountains covered with evergreen trees, crisp midnight skies dotted with silver-white stars, and intense, brilliant flowers such as roses, fuchsias, and poinsettias.`,
  } as any;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View>
            <Text style={styles.introText}>We found your Seasonal Color!</Text>
          </View>
          <View>
            <FastImage source={seasonalColorSwitch(seasonalColor)} style={styles.image} />
          </View>
          <View>
            <Text style={styles.headerText}>You're a{seasonalColor === 'Autumn' ? 'n' : ''} {seasonalColor}!</Text>
          </View>
          <View style={styles.description}>
            <Text style={styles.descriptionText}>{seasonalColorDescriptions[seasonalColor]}</Text>
          </View>
        </ScrollView>
        <TouchableOpacity onPress={() => navigation.navigate('HomeTabs')} style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Finish</Text>
        </TouchableOpacity>
      </SafeAreaView>
      {/* <SafeAreaView style={styles.profileScreenContainer}>
          <View style={styles.buttonsContainer}>
            <Text style={styles.congratsText}>Congrats, your seasonal color is {seasonalColor}!</Text>
            <FastImage source={seasonalColorSwitch(seasonalColor)} style={styles.uploadedImage} />
              <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('HomeTabs')}>
                <Text style={styles.continueButtonText}>COMPLETE</Text>
              </TouchableOpacity>
          </View>
        </SafeAreaView> */}
    </>
  );
}

const styles = StyleSheet.create({
  continueButton: {
    marginTop: 40,
    borderRadius: 8,
    padding: 15,
    width: Dimensions.get("window").width * 0.9,
    backgroundColor: '#f2f2f2',
  },
  continueButtonText: {
    textTransform: 'uppercase',
    fontSize: 16,
    textAlign: "center",
  },
  descriptionText: {
    marginHorizontal: 30,
    marginVertical: 15,
    fontSize: 16,
    textAlign: "auto",
  },
  image: {
    width: Dimensions.get("window").width,
    height: 300,
    resizeMode: "cover",
  },
  headerText: {
    fontSize: 30,
    marginTop: 20,
  },
  introText: {
    fontSize: 30,
    margin: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  unselected: {
    backgroundColor: "gray",
  },
  selected: {
    backgroundColor: "#111111",
  },
  title: {
    alignItems: "center",
    marginVertical: 20,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#2b414d",
    borderRadius: 50,
    padding: 10,
    width: 250,
  },
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  scrollContainer: {
    alignItems: "center",
  },
  controls: {
    flex: 1,
    width: "80%",
  },

  control: {
    paddingVertical: 10,
    borderColor: "#2b414d",
    borderBottomWidth: 1,
    fontSize: 20,
  },

  error: {
    marginTop: 10,
    padding: 10,
    color: "#fff",
    backgroundColor: "#D54826FF",
  },
});
