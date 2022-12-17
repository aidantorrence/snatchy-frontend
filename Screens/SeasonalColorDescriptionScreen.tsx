import React from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Dimensions } from "react-native";
import { useQuery } from "react-query";
import { fetchUser } from "../data/api";
import { useStore } from "../utils/firebase/useAuthentication";
import FastImage from "react-native-fast-image";

const celebrities = {
  Spring: [
    "Blake Lively",
    "Alicia Keys",
    "Taylor Swift",
    "Chloe Grace Moretz",
    "Jessica Jung",
    "Cameron Diaz",
    "Scarlett Johansson",
    "Kerry Washington",
    "Nicole Kidman",
    "Charlize Theron",
    "Jada Pinkett Smith",
    "Meghan Markle",
    "Amanda Seyfried",
    "Dove Cameron",
    "Elsa Hosk",
    "Maddie Ziegler",
    "Ni Ni",
    "Erin Heatherton",
    "Emma Stone",
    "Solange",
    "Sonam Ahuja",
    "Jamie Chung",
    "Demi Lovato",
    "Nayeon (Twice)",
    "Zoe Saldana",
    "Hayden Panettiere",
    "Jaz Sinclair",
    "Lea Seydoux",
    "Tracy Ifeachor",
    "Lindsey Ellingson",
    "Bae Suzy",
    "IU (Lee Ji-eun)",
    "Wendy (Red Velvet)",
  ],
  Summer: [
    "Rihanna",
    "Alison Brie",
    "Olivia Wilde",
    "Barbara Palvin",
    "Bella Hadid",
    "Margot Robbie",
    "Tyra Banks",
    "Dakota Johnson",
    "Emily Blunt",
    "Lili Reinhart",
    "Zoe Kravitz",
    "Yael Shelbia",
    "Zoe Saldana",
    "Jang Wonyoung",
    "Nicki Minaj",
    "Tiffany Young",
    "Reese Witherspoon",
    "Slick Woods",
    "Katherine Langford",
    "Lorde",
    "Gwyneth Paltrow",
    "Naomi Watts",
    "Denise Vasi",
    "Sneha Ullal",
    "Princess Diana",
    "Natalia Vodianova",
    "Ellen Degeneres",
    "Amanda Stenberg",
    "Doutzen Kroes",
    "Danielle Leonel",
    "Uma Thurman",
    "Princess Charlene",
    "Chrishell Stubbs",
  ],
  Autumn: [
    "Beyonce",
    "Jennifer Lopez",
    "Tsutsumi Hoang",
    "Jennie Kim (Blackpink)",
    "Ana de Armas",
    "Madelaine Petsch",
    "Halle Berry",
    "Emma Watson",
    "Rashida Jones",
    "Diana Agron",
    "Adele",
    "Nicole Richie",
    "Jessica Alba",
    "Lucy Hale",
    "Mariah Carey",
    "Sarah Hyland",
    "Mikalah Sultan",
    "Minka Kelly",
    "Aubrey Plaza",
    "Alicia Herbeth",
    "Kate Moss",
    "Karlie Kloss",
    "Elizabeth Olsen",
    "Leighton Meester",
    "Kate Mara",
    "Laneya Grace",
    "Deepika Padukone",
    "Hwasa",
    "Behati Prinsloo",
    "Sarah Michelle Gellar",
    "Kate Upton",
    "Brenda Song",
    "Bar Rafaeli",
    "Lindsey Lohan",
  ],
  Winter: [
    "Selena Gomez",
    "Janelle Monae",
    "Kendall Jenner",
    "Katy Perry",
    "Constance Wu",
    "Naomi Campbell",
    "Kim Kardashian",
    "Nina Dobrev",
    "Megan Fox",
    "Olivia Munn",
    "Alexandra Daddario",
    "Ariana Grande",
    "Dua Lipa",
    "Chungha",
    "Fan Bing Bing",
    "Lilly Collins",
    "Anne Hathaway",
    "Christina Ricci",
    "Amal Clooney",
    "Lauren Graham",
    "Alexis Bledel",
    "Gemma Chan",
    "Penelope Cruz",
    "Catherine Zeta Jones",
    "Winona Ryder",
    "Mila Kunis",
    "Daisy Ridley",
    "Sara Sampaio",
  ],
} as any;

export default function SeasonalColorDescriptionScreen({ navigation, route, refetch }: any) {
  const seasonalColorAppearances = {
    Spring: `You are warm-toned with a bright and light complexion. Regardless of your hair or skin color, there is a brightness to your skin and eyes that shines through. Your complexion has a warm glow as if lit by sunlight on a bright spring day. Your hair has warm undertones, and may range from golden, caramel, or strawberry blonde, to bright auburn, to warm chocolate brown, to black with a reddish cast under sunlight. Your eyes may be blue, green, or golden brown (even leaning on the darker end). You may be naturally outgoing, adventurous, confident, and optimistic.`,
    Summer: `You are cool-toned with a soft and light complexion. Regardless of your hair or skin color, there is a muted quality to your skin and eyes, as nothing is too intense or hard-edged. Your hair has cool undertones, and may range from ash or platinum blonde, to dark rose brown, to black with a soft blue cast under sunlight. Your eyes may be any color but have soft, grayish tints. You may be naturally calm, gentle, efficient, and diplomatic.`,
    Autumn: `You are warm-toned with a muted and dark complexion. Regardless of your hair or skin color, there is a muted quality to your skin and eyes, as nothing is too intense or hard-edged. Your hair has warm undertones, and may range from caramel blonde, to dark auburn, to warm chocolate brown, to black with a reddish cast under sunlight. Your eyes may be any color but lean dark and muted. You may be naturally passionate, earthy, reliable, and loyal.`,
    Winter: `You are cool-toned with a bright and dark complexion. Regardless of your hair or skin color, there is a brightness to your skin and eyes that shines through. Your complexion has a cool glow as if lit by sunlight on a bright winter day. Your hair has cool undertones, and may range from platinum blonde, to dark brown, to black with a bluish cast under sunlight. Your eyes may be any color but usually contrast against your skin or hair. You may be naturally refined, stately, perfectionist, and a little aloof.`,
  } as any;
  const seasonalColorStylings = {
    Spring: `You look great in warm-toned colors reminiscent of a tropical island surrounded by turquoise water, a spring garden filled with beautiful flowers, and bright, colorful fruits such as limes, peaches, and bananas. Below are some colors that would flatter you:`,
    Summer: `You look great in cool-toned colors reminiscent of a Monet garden with a pond and water lilies, summer twilight skies filled with beautiful pastel shades, and refreshing rivers, lakes, and oceans. Below are some colors that would flatter you:`,
    Autumn: `You look great in warm-toned colors reminiscent of late autumn evenings when the last rays of the sun dapple the land, misty forests with colorful, crackling leaves falling from thinning treetops, and ripe produce, flowers, and nuts overflowing from a cornucopia. Below are some colors that would flatter you:`,
    Winter: `You look great in cool-toned colors reminiscent of snow-capped mountains covered with evergreen trees, crisp midnight skies dotted with silver-white stars, and intense, brilliant flowers such as roses, fuchsias, and poinsettias. Below are some colors that would flatter you:`,
  } as any;

  const seasonalColorImages = {
    Spring: <FastImage source={require(`../assets/spring.png`)} style={styles.image} />,
    Summer: <FastImage source={require(`../assets/summer.png`)} style={styles.image} />,
    Autumn: <FastImage source={require(`../assets/autumn.png`)} style={styles.image} />,
    Winter: <FastImage source={require(`../assets/winter.png`)} style={styles.image} />,
  } as any;
  const seasonalColors = {
    Spring: <FastImage source={require(`../assets/spring-colors.png`)} style={styles.colorImage} />,
    Summer: <FastImage source={require(`../assets/summer-colors.png`)} style={styles.colorImage} />,
    Autumn: <FastImage source={require(`../assets/autumn-colors.png`)} style={styles.colorImage} />,
    Winter: <FastImage source={require(`../assets/winter-colors.png`)} style={styles.colorImage} />,
  } as any;

  const user = useStore((state) => state.user);
  const { data: userData, isLoading } = useQuery(["currentUser", user?.uid], () => fetchUser(user?.uid), {
    enabled: !!user?.uid,
  });

  const seasonalColor = route?.params?.seasonalColor || user?.seasonalColor || userData?.seasonalColor;

  return isLoading ? (
    <Text>Loading</Text>
  ) : (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>{seasonalColorImages[seasonalColor]}</View>
        <View>
          <Text style={styles.headerText}>{seasonalColor}</Text>
        </View>
        <View style={styles.description}>
          <Text style={styles.subHeaderText}>Appearance</Text>
          <Text style={styles.descriptionText}>{seasonalColorAppearances[seasonalColor]}</Text>
        </View>
        <View style={styles.description}>
          <Text style={styles.subHeaderText}>Styling</Text>
          <Text style={styles.descriptionText}>{seasonalColorStylings[seasonalColor]}</Text>
        </View>
        <View>{seasonalColors[seasonalColor]}</View>
        <View>
          <View>
            <Text style={styles.secondaryHeaderText}>Celebrities</Text>
            {celebrities[seasonalColor]?.map((celebrity: any, index: any) => (
              <Text style={styles.celebrityText} key={index}>
                {celebrity}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  celebrityText: {
    textAlign: "center",
  },
  subHeaderText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    textDecorationLine: "underline",
    marginBottom: 5,
    marginHorizontal: 10,
  },
  secondaryHeaderText: {
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "underline",
    width: Dimensions.get("window").width - 20,
    marginBottom: 5,
    textAlign: "center",
  },
  descriptionText: {
    marginHorizontal: 10,
    marginBottom: 10,
    fontSize: 14,
    textAlign: "center",
  },
  image: {
    width: Dimensions.get("window").width,
    height: 300,
    resizeMode: "cover",
  },
  colorImage: {
    width: Dimensions.get("window").width,
    height: 425,
    resizeMode: "cover",
    marginBottom: 5,
  },
  headerText: {
    fontSize: 25,
    marginTop: 5,
    fontWeight: "bold",
    marginBottom: 10,
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
  continueButton: {
    marginTop: 10,
    backgroundColor: "#6F3284",
    borderRadius: 50,
    padding: 10,
    width: 150,
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
