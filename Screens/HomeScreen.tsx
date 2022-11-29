import AsyncStorage from "@react-native-async-storage/async-storage";
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
} from "react-native";
import { QueryCache, useQuery } from "react-query";
import { useStore } from "../utils/firebase/useAuthentication";
import { fetchOutfits } from "../data/api";
import { modusTypes } from "./QuizSuccessScreen";
import { FlashList } from "@shopify/flash-list";
import analytics from "@react-native-firebase/analytics";
import FastImage from "react-native-fast-image";
import { mixpanel } from "../utils/mixpanel";
const queryCache = new QueryCache({});

export default function HomeScreen({ navigation }: any) {
  // AsyncStorage.clear();
  queryCache.clear();
  const user = useStore((state) => state.user);
  const {
    isFetching: isFetchingOutfits,
    data: outfitsData,
    error: outfitsError,
  } = useQuery(["outfits", user?.uid], () => fetchOutfits(user?.uid));

  const handlePress = (outfit: any) => {
    navigation.navigate("ViewOutfit", {
      id: outfit.id,
      ownerId: outfit.ownerId,
    });
    analytics().logViewItem({
      items: [
        {
          item_id: outfit.id.toString(),
          item_name: outfit.description,
        },
      ],
    });
    mixpanel.track("View Outfit", {
      id: outfit.id.toString(),
      ownerId: outfit.ownerId,
    });
  };

  let outfits = outfitsData?.filter((outfit: any) => {
    if (!user?.currentModusTypes?.length) {
      return !outfit?.kibbeTypes.length || (outfit?.kibbeTypes || []).includes(modusTypes[user?.modusType]);
    } else {
      return (outfit?.kibbeTypes || []).some((item: any) => (user?.currentModusTypes || []).includes(item));
    }
  });

  outfits = outfits
    ?.filter((outfit: any) => {
      if (!user?.currentSeasonalColors?.length) {
        return outfits;
      } else {
        return (outfit?.seasonalColors || []).some((item: any) => (user?.currentSeasonalColors || []).includes(item));
      }
    })
    .sort((a: any, b: any) => {
      return (
        new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime() ||
        b?.upvotes - b?.downvotes - (a?.upvotes - a?.downvotes)
      );
    });

  function Item({ item }: any) {
    return (
      <>
        <View style={{ flexDirection: "row", marginLeft: 5, marginBottom: 5, alignItems: "center" }}>
          {item?.owner?.userImage ? (
            <FastImage source={{ uri: item.owner.userImage }} style={styles.userImage} />
          ) : (
            <FastImage source={require("../assets/Monkey_Profile_Logo.png")} style={styles.userImage} />
          )}
          <Text style={styles.subTitle}>{item.owner.firstName + " " + item.owner.lastName}</Text>
          {item.owner.userType === "EXPERT" ? (
            <FastImage source={require("../assets/Verified_Logo_2.png")} style={styles.verifedImage} />
          ) : null}
        </View>
        <TouchableOpacity onPress={() => handlePress(item)} style={styles.item}>
          <FastImage source={{ uri: item.imagesThumbnails[0] || item.images[0] }} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </>
    );
  }

  const handleProfilePress = (uid: any) => {
    navigation.navigate("ViewProfile", {
      ownerId: uid,
    });
  };
  const handleModusTypePress = () => {
    navigation.navigate("ModusTypeFilter");
    analytics().logEvent("modus_type_filter_click");
    mixpanel.track("Modus Type Filter Click");
  };
  const handleSeasonalColorPress = () => {
    navigation.navigate("SeasonalColorFilter");
    analytics().logEvent("seasonal_color_filter_click");
    mixpanel.track("Seasonal Color Filter Click");
  };

  const handleFilterPress = () => {
    navigation.navigate("Filter");
  };

  return (
    <>
      {isFetchingOutfits ? (
        <SafeAreaView style={styles.screenAreaView}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.container}>
          <View style={styles.filterContainer}>
            <View style={styles.filter}>
              <Text style={styles.filterText}>Filter by:</Text>
            </View>
            <View style={styles.filterType}>
              <TouchableOpacity onPress={handleModusTypePress}>
                <Text style={styles.filterTypeText}>MODUS TYPE</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSeasonalColorPress}>
                <Text style={styles.filterTypeText}>SEASONAL COLOR</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.filter}>
              <Text style={styles.filterPlaceholder}>Filter by:</Text>
            </View>
          </View>
          {/* <TouchableOpacity 
            onPress={handleFilterPress} 
            style={styles.filterButton}>
            <FastImage source={require("../assets/Filter_Logo.png")} style={styles.filterLogo} />
          </TouchableOpacity> */}
          <FlashList
            horizontal={false}
            numColumns={2}
            estimatedItemSize={8}
            data={outfits}
            renderItem={({ item }: any) => (
              <View style={styles.itemContainer}>
                <Item item={item} />
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginBottom: 10,
    borderColor: "lightgray",
    borderBottomWidth: 0.25,
    borderTopWidth: 0.25,
    paddingVertical: 6,
  },
  filter: {
    flex: 1,
  },
  filterType: {
    flexDirection: "row",
  },
  filterText: {
    fontSize: 11,
  },
  filterTypeText: {
    fontSize: 11,
    marginHorizontal: 5,
  },
  filterPlaceholder: {
    fontSize: 11,
    color: "white",
  },
  screenAreaView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: 'center',
    marginBottom: 3,
    marginLeft: 10,
  },
  userImage: {
    marginRight: 5,
    height: 17,
    width: 17,
    borderRadius: 25,
  },
  verifedImage: {
    marginLeft: 2,
    height: 10,
    width: 10,
    borderRadius: 25,
  },
  ownerName: {
    fontWeight: "bold",
  },
  itemContainer: {},
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tags: {
    flexDirection: "row",
    margin: 5,
    marginRight: 5,
    padding: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  expertTag: {
    flexDirection: "row",
    margin: 5,
    marginRight: 5,
    padding: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: "blue",
  },
  tagsText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    marginRight: 5,
  },
  expertTagText: {
    fontSize: 10,
    fontWeight: "bold",
    marginRight: 5,
    color: "white",
  },
  filterButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  filterLogo: {
    width: 20,
    height: 20,
    marginRight: 20,
    marginBottom: 20,
  },
  column: {
    // width: "50%",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  item: {
    alignItems: "center",
    marginRight: Dimensions.get("window").width * 0.02,
    // paddingBottom: 20,
    // paddingLeft: 20,
    // paddingRight: 20,
  },
  descriptionContainer: {
    marginBottom: 5,
  },
  description: {
    paddingHorizontal: 5,
    marginTop: 2,
    fontSize: 11,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 10,
    fontWeight: "bold",
  },
  conditionAndSize: {
    fontSize: 16,
    color: "gray",
  },
  priceCanTradeContainer: {
    width: "15%",
    alignItems: "center",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailsContainer: {
    flexDirection: "row",
  },
  title: {
    alignItems: "center",
    marginBottom: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    width: Dimensions.get("window").width * 0.49,
    height: Dimensions.get("window").height * 0.35,
    resizeMode: "cover",
  },
  sellerName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  canTrade: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  seasonalColors: {
    flexDirection: "row",
    margin: 5,
    marginRight: 5,
    padding: 10,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: "#1DA1F2",
  },
  kibbeTypes: {
    flexDirection: "row",
    margin: 5,
    marginRight: 5,
    padding: 10,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: "#F487D2",
  },
  aesthetic: {
    flexDirection: "row",
    margin: 5,
    marginRight: 5,
    padding: 10,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: "#555555",
  },
  occasions: {
    flexDirection: "row",
    margin: 5,
    marginRight: 5,
    padding: 10,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: "lightgray",
  },
});
