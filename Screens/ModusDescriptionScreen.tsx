import { setUser } from "@sentry/react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { useQuery } from "react-query";
import { fetchUser } from "../data/api";
import { useUpdateUser } from "../data/mutations";
import { useStore } from "../utils/firebase/useAuthentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const modusTypes = {
  D: "Queen",
  DC: "Boss",
  FG: "Coquette",
  FN: "Supermodel",
  R: "Siren",
  SC: "Lady",
  SD: "Feline",
  SG: "Ingenue",
  SN: "Vixen",
  TR: "Femme Fatale",
} as any;

export const modusTypesReverse = {
  Queen: "D",
  Boss: "DC",
  Coquette: "FG",
  Supermodel: "FN",
  Siren: "R",
  Lady: "SC",
  Feline: "SD",
  Ingenue: "SG",
  Vixen: "SN",
  "Femme Fatale": "TR",
} as any;

const celebrities = {
  Queen: [
    "Zendaya",
    "Taylor Swift",
    "Alessandra Ambrosio",
    "Tilda Swinton",
    "Amal Clooney",
    "Jamie Lee Curtis",
    "Olivia Culpo",
    "Keira Knightley",
    "Celine Dion",
    "Cate Blanchett",
    "Jamie Lee Curtis",
    "Michelle Dockery",
    "Alexis Smith",
    "Anjelica Huston",
    "Joan Crawford",
    "Katharine Hepburn",
  ],
  Boss: [
    "Megan Fox",
    "Victoria Justice",
    "Courtney Cox",
    "Alexa Chung",
    "Natalie Portman",
    "Nina Dobrev",
    "Daisy Ridley",
    "Olivia Munn",
    "Olivia Wilde",
    "Olivia Palermo",
    "Zoe Saldana",
    "Fan Bing Bing",
    "Rose (Blackpink)",
    "Momo (Twice)",
    "Yoona (SNSD)",
    "Victoria Song",
    "Krystal Jung",
    "Jackie Kennedy",
  ],
  Coquette: ['Doja Cat',
    'Ariana Grande',
    'Emma Roberts',
    'Lily-Rose Depp',
    'Victoria Beckham',
    'Lily Collins',
    'Lady Gaga',
    'Amy Winehouse',
    'Madison Beer',
    'Valkyrae',
    'Zoe Kravitz',
    'Kiernan Shipka',
    'Jennie (Blackpink)',
    'Liza Koshy',
    'Avril Lavigne',
    'Penelope Cruz',
    'Jennifer Love-Hewitt',
    'Coco Chanel',
    'Audrey Hepburn'],
  Supermodel: [
    "Angelina Jolie",
    "Kendall Jenner",
    "Gigi Hadid",
    "Hailey Bieber",
    "Cara Delevigne",
    "Giselle Bundchen",
    "Naomi Campbell",
    "Heidi Klum",
    "Adriana Lima",
    "Emily Ratajkowski",
    "Jennifer Aniston",
    "Brooke Shields",
    "Cameron Diaz",
    "Julia Roberts",
    "Jennifer Lawrence",
    "Charlize Theron",
    "Nicole Kidman",
    "Gwyneth Paltrow",
    "Princess Diana",
    "Dua Lipa",
    "Lisa (Blackpink)",
    "Sana (Twice)",
    "Jeongyeon (Twice)",
    "Jeon Somi",
  ],
  Siren: ['Beyonce',
    'Amanda Seyfried',
    'Marilyn Monroe',
    'Christina Ricci',
    'Drew Barrymore',
    'Madonna',
    'Cardi B',
    'Kate Winslet',
    'Helena Bonham Carter',
    'Emilia Clarke',
    'Holliday Grainger',
    'Elizabeth Taylor',
    'Dolly Parton',
    'Dahyun (Twice)'],
  Lady: [
    "Dianna Agron",
    "Dakota Johnson",
    "Lupita Nyong'o",
    "Jessica Alba",
    "Leighton Meester",
    "Alison Brie",
    "Lea Seydoux",
    "Naomi Scott",
    "Adelaide Kane",
    "Mina (Twice)",
    "Jisoo (Blackpink)",
    "Miyeon ((G)-IDLE)",
    "Carolina Herrera",
    "Marion Cotillard",
    "Grace Kelly",
    "Naomi Watts",
  ],
  Feline: [
    "Priyanka Chopra",
    "Christina Hendricks",
    "Tyra Banks",
    "Ashley Graham",
    "Adele",
    "Bella Hadid",
    "Charli Howard",
    "Monica Bellucci",
    "Megan Thee Stallion",
    "Jennifer Hudson",
    "Salma Abu Deif",
    "Anya Taylor-Joy",
    "Jameela Jamil",
    "Eiza Gonzalez",
    "Tzuyu (Twice)",
    "Karina (aespa)",
    "Ava Gardner",
    "Sophia Loren",
    "Sofia Vergara",
  ],
  Ingenue: ['Reese Witherspoon',
    'Vanessa Hudgens',
    'Vanessa Morgan',
    'Janelle Monae',
    'Lucy Hale',
    'Halle Berry',
    'Winona Ryder',
    'Jenna Coleman',
    'Alexa Demie',
    'Mary-Kate Olsen',
    'Ashley Olsen',
    'Maisie Williams',
    'PONY Syndrome',
    'Bella Poarch',
    'Chaeyoung (Twice)',
    'Nayeon (Twice)',
    'Ahin (Momoland)',
    'Judy Garland'],
  Vixen: [
    "Britney Spears",
    "Kim Kardashian",
    "Florence Pugh",
    "Camila Mendes",
    "Aishwarya Rai",
    "Katy Perry",
    "Demi Lovato",
    "Billie Eilish",
    "Shakira",
    "Scarlett Johansson",
    "Hilary Duff",
    "Elizabeth Olsen",
    "Ashley Benson",
    "Kate Upton",
    "Jennifer Lopez",
    "Kat Dennings",
    "Chloe Sevigny",
    "Alivia Silverstone",
    "Kamala Harris",
    "Fergie",
    "Julianne Hough",
    "Jihyo (Twice)",
  ],
  "Femme Fatale": ['Mila Kunis',
    'Camila Cabello',
    'Selena Gomez',
    'Rachel McAdams',
    'Rachel Bilson',
    'Salma Hayek',
    'Leigh-Anne Pinnock',
    'Janel Parrish',
    'Jessica Jung',
    'Chungha',
    'Lia (ITZY)',
    'Shuhua ((G)-IDLE)',
    'Jane Seymour',
    'Jean Harlow',
    'Hedy Lamarr',
    'Vivien Leigh,'],
} as any;

export default function ModusDescriptionScreen({ navigation, route, refetch }: any) {
  const modusAppearances = {
    D: `Your body is characterized by its length (literal or simply the impression of length) as you have long limbs. Your flesh gives the impression of firmness and sleekness even at a higher weight. Your silhouette appears elongated even at higher weights. Your bones appear to be sharp and refined.`,
    DC: `Your body is characterized by its balance. Your flesh is not overly soft nor firm (regardless of weight). Your silhouette is of a moderate length, and you may appear trim and compact. Your bone structure contains some slight sharp edges, although it is not primarily characterized by sharpness. Your silhouette appears balanced rather than elongated even at lower weights.`,
    FG: `Your silhouette is characterized by its petite appearance. You have firm flesh even at a higher weight and you notice some sharpness in the body. Your bone structure is straight with some slight angular edges. You may have slightly long limbs, but elongation is not the first thing that comes to mind when others see you.`,
    FN: `Your body is characterized by its length (literal or simply the impression of length). Your flesh remains firm even at higher weights. You have a strong, statuesque frame that can “stand up” against clothing. Your body has a natural structure to it which makes you a great “hanger” for clothing (that's why a lot of fashion models share your type!)`,
    R: `Your silhouette is characterized by its petite appearance. You have soft flesh even at a lower weight. You can see only round shapes in your silhouette. You find you have little bone structure and so your flesh dominates your appearance. There is little to no sharpness whatsoever in your silhouette.`,
    SC: `Your body is characterized by its balance. Your flesh is not overly soft nor firm (regardless of weight). Your silhouette is of a moderate length. Your silhouette contains some circular shapes. Your bone structure contains some slight soft edges. Your silhouette appears balanced rather than rounded even at higher weights.`,
    SD: `Your body is characterized by its length (literal or simply the impression of length). Your flesh is soft even at a low weight. You can see some appearance of circles in your silhouette (for example a rounded hip shape). Your soft flesh and roundedness are juxtaposed against the sharpness of your bones.`,
    SG: `Your silhouette is characterized by its petite appearance. You have soft flesh even at a lower weight and you notice some roundness in the body. Your bone structure has some slight angular edges. While you have some rounded shapes in your silhouette, even at higher weights, you notice some sharpness first in your bone structure before you notice roundedness.`,
    SN: `Your body is characterized by soft flesh (even at a lower weight) and rounded shapes in the silhouette. These rounded fleshy shapes are accompanied by roundness in your bone structure. Your rounded flesh & bone structure works to support and enhance the appearance of your curves. Your silhouette appears moderate to short in length.`,
    TR: `Your silhouette is characterized by its petite appearance. You have soft flesh even at a lower weight and notice rounded shapes in your silhouette. You may see a bit of sharpness in your bone structure. Even though you have some slight sharp edges, you notice roundedness in your flesh before you notice the small bit of sharpness of your bone structure.`,
  } as any;
  const modusStylings = {
    D: `Long and tailored pieces with sharp touches and unbroken vertical lines suit you best. Asymmetric silhouettes further highlight your sleekness & elegance. Go for fabrics that are tightly woven and somewhat stiff such as tweed, twills, faille, stiff brocades, and heavy satin. Waist emphasis is not required, although you can flaunt your waist by wearing stiff fabrics that show off your angularity (forming an X-shape). You look best in elongated and angular jewelry that contains sharp geometric shapes such as triangles and rectangles.`,
    DC: `You are suited best by tailored, minimalist and symmetrical styles. You can handle tiny dashes of sharp detailing to highlight your cool sophistication. Opt for triangle silhouettes with the focal point being your shoulders for a clean and crisp look. Higher-quality fabrics with moderate weights work best on you. Turtlenecks and slight v-necks are some of your best necklines. Sleek, symmetrical, and minimal jewelry with sharp edges look great on you, as do slightly chunkier geometric pieces.`,
    FG: `You are suited best by wearing sharp or geometric shapes and shorter pieces so not to overwhelm your petite frame. You may be able to get away with some avant-garde styles that others can’t. Staccato silhouettes (i.e., contrast between your top and bottom pieces) highlight your animated, electric beauty. Fitted but not skin-tight garments serve as a good foundation for your outfits. Staple pieces for you include sharp-edged jackets/coats and angular crop tops. Small, angular, or avant-garde jewelry with a tiny bit of roundedness flatter you best.`,
    FN: `Because your body already has structure, it doesn’t need structure in clothing. In fact, structured clothing will fight against the natural structure you have. A relaxed style of clothing lets your bone structure shine. Elongated, sweeping lines and shoulder emphasis bring out your statuesque figure. Go for oversized details such as large (or no) lapels. You look great mixing and matching rough textures like leather with soft, thick ones like shantung. You can layer together bold jewelry with large, chunky organic shapes (like gems) to achieve your "wow" factor.`,
    R: `You look best in curve-hugging clothing with ornate and rounded details. Opt for outfits with soft fabric (i.e., velvet, silk, angora), soft edges, and intricate accessories to further bring out your dreamy, enchanting beauty. Your ideal outfit has a sharply-defined waistline with a soft, clingy silhouette. Your top and bottom pieces should blend together fluidly so not to disrupt your soft silhouette. Small, delicate, rounded, and ornate jewelry looks fantastic on you.`,
    SC: `You are flattered best by smooth, minimalist, and symmetrical styles that hug your curves. Choose rounded details and lighter-weight fabrics to highlight your soft sophistication. When wearing tailored pieces, go for airier fabrics with smooth shaping and soft seams. Soft, luxurious textiles like silk, cashmere, and crepe work wonders on you. Seek out silhouettes with soft waist emphasis and tapered sleeves. Small, minimal, symmetrical jewelry with rounded shapes (i.e., a pair of pearl earrings) bring out your feminine elegance.`,
    SD: `Long pieces with unbroken vertical lines that hug your curves suit you best. You can also handle occasional sharp details. A bit of glam in your look doesn’t overpower you. You look best in geometric silhouettes that are softened by flowing, lightweight fabrics. Cowl necklines and slits further add to your glamor. High-waisted pants, jumpsuits, and jeans will accentuate your curves and emphasize your long legs. Large, bold jewelry with some rounded, ornate details look stunning on you.`,
    SG: `You look best in curve-hugging clothing and shorter pieces so not to overwhelm your petite frame. Staccato silhouettes (i.e., contrast between your top and bottom pieces) and crisp, slightly soft fabrics further bring out your doll-like features. Opt for fitted pieces with sharp edges (i.e., tailoring at the shoulders and necklines) that honor your curves. Round geometric prints with contrasting colors look chic on you. Go for small, detailed jewelry with a mix of sharp and soft lines that sit close to the neck.`,
    SN: `You are flattered by curve-hugging clothing with rounded details. Choose clothes with soft, flowing fabrics and slight waist definition to accentuate your curves. Show off your modelesque shoulders by wearing loose and open necklines. When wearing tailored pieces, go for ones with soft shoulders rather than sharp edges. Pants and skirts should be flat in the hip area and have soft outlines. When choosing jewelry, go for rounded shapes with organic or handcrafted features (like gems).`,
    TR: `You look best in curve-hugging clothing with ornate and rounded details. Opt for outfits with soft fabric (i.e., velvet, silk, angora), slightly sharp edges, and intricate accessories to further bring out your enigmatic, magnetic beauty. Your ideal outfit has a sharply-defined waistline and slightly sharp shoulders, with a soft, clingy silhouette. Your top and bottom pieces should blend together fluidly so not to disrupt your soft silhouette. Small, delicate, rounded, and ornate jewelry looks fantastic on you.`,
  } as any;

  const modusImages = {
    D: <Image source={require(`../assets/D_Queen.png`)} style={styles.image} />,
    DC: <Image source={require(`../assets/DC_Boss.png`)} style={styles.image} />,
    FG: <Image source={require(`../assets/FG_Coquette.png`)} style={styles.image} />,
    FN: <Image source={require(`../assets/FN_Supermodel.png`)} style={styles.image} />,
    R: <Image source={require(`../assets/R_Siren.png`)} style={styles.image} />,
    SC: <Image source={require(`../assets/SC_Lady.png`)} style={styles.image} />,
    SD: <Image source={require(`../assets/SD_Feline.png`)} style={styles.image} />,
    SG: <Image source={require(`../assets/SG_Ingenue.png`)} style={styles.image} />,
    SN: <Image source={require(`../assets/SN_Vixen.png`)} style={styles.image} />,
    TR: <Image source={require(`../assets/TR_Femme_Fatale.png`)} style={styles.image} />,
  } as any;

  const user = useStore((state) => state.user);
  const { data: userData, isLoading } = useQuery(["currentUser", user?.uid], () => fetchUser(user?.uid), {
    enabled: !!user?.uid,
  });

  const modusType = route?.params?.modusType || user?.modusType || userData?.modusType;

  return isLoading ? (
    <Text>Loading</Text>
  ) : (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>{modusImages[modusType]}</View>
        <View>
          <Text style={styles.headerText}>{modusTypes[modusType]}</Text>
        </View>
        <View style={styles.description}>
          <Text style={styles.subHeaderText}>Appearance</Text>
          <Text style={styles.descriptionText}>{modusAppearances[modusType]}</Text>
        </View>
        <View style={styles.description}>
          <Text style={styles.subHeaderText}>Styling</Text>
          <Text style={styles.descriptionText}>{modusStylings[modusType]}</Text>
        </View>
        <View>
          <View>
            <Text style={styles.secondaryHeaderText}>Celebrities</Text>
            {celebrities[modusTypes[modusType]]?.map((celebrity: any, index: any) => (
              <Text style={styles.celebrityText} key={index} >{celebrity}</Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  celebrityText: {
    textAlign: 'center',
  },
  subHeaderText: {
    fontWeight: "bold",
    textAlign: 'center',
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
    textAlign: 'center',
  },
  descriptionText: {
    marginHorizontal: 10,
    marginBottom: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  image: {
    width: Dimensions.get("window").width,
    height: 300,
    resizeMode: "cover",
  },
  headerText: {
    fontSize: 25,
    marginTop: 5,
    fontWeight: "bold",
    // textDecorationLine: "underline",
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
