import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, View, Text, SafeAreaView, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useQuery } from "react-query";
import { fetchListings } from "../data/api";
import { useStore } from "../utils/firebase/useAuthentication";
import { QueryCache } from "react-query";
const queryCache = new QueryCache({});
const defaultProfile = "https://yt3.ggpht.com/-2lcjvQfkrNY/AAAAAAAAAAI/AAAAAAAAAAA/ouxs6ZByypg/s900-c-k-no/photo.jpg";
import Swiper from "react-native-swiper";


function ListHeader() {
  return (
    <View style={styles.title}>
      <Text style={styles.titleText}>INSTAHEAT</Text>
    </View>
  );
}
export default function HomeScreen({ navigation }: any) {
  // AsyncStorage.clear();
  // queryCache.clear();
  const user = useStore((state) => state.user);
  const { isLoading: isLoadingListings, data: listingsData, error: listingsError } = useQuery(["listings", user?.uid], () => fetchListings(user?.uid));

  const handlePress = (listing: any) => {
    navigation.navigate("ViewListing", {
      id: listing.id,
      ownerId: listing.ownerId,
    });
    // navigation.navigate("CreateStack", {
    //   screen: "ViewListing",
    //   params: {
    //     screen: "ViewListing",
    //     id,
    //   },
    // });
  };

  function Item({ item }: any) {
    return (
      <Swiper style={{ height: 300 }}>
        {item.images.map((image: any, index: any) => {
          return (
            <TouchableOpacity key={index} onPress={() => handlePress(item)} style={styles.item}>
              <Image source={{ uri: image }} style={styles.image} />
            </TouchableOpacity>
          );
        })}
      </Swiper>
    );
  }
  
  const handleProfilePress = (uid: any) => {
    navigation.navigate("ViewProfile", {
      ownerId: uid,
    });
  };

  return (
    <>
      {isLoadingListings ? (
        <Text>Loading</Text>
      ) : (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={listingsData}
            renderItem={({ item }: any) => (
              <>
                <TouchableOpacity onPress={() => handleProfilePress(item.owner.uid)} style={styles.userInfo}>
                  <Image source={{ uri: item.owner.userImage || defaultProfile }} style={styles.userImage} />
                  <Text style={styles.sellerName}>{item.owner.sellerName}</Text>
                </TouchableOpacity>
                <Item item={item} />
                <View style={styles.detailsContainer}>
                  <View style={styles.nameConditionSizeContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.conditionAndSize}>
                      {item.condition} Size {item.size}
                    </Text>
                  </View>
                  <View style={styles.priceCanTradeContainer}>
                    <Text style={styles.price}>{item.price}</Text>
                    {item.canTrade ? <Image style={styles.canTrade} source={require("../Trade.png")} /> : null}
                  </View>
                </View>
              </>
            )}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={ListHeader}
          />
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  item: {
    alignItems: "center",
    // paddingBottom: 20,
    // paddingLeft: 20,
    // paddingRight: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  conditionAndSize: {
    fontSize: 16,
    color: "gray",
  },
  nameConditionSizeContainer: {
    width: "85%",
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
    padding: 10,
  },
  title: {
    alignItems: "center",
    paddingBottom: 20,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 300,
  },
  userImage: {
    borderRadius: 50,
    width: 25,
    height: 25,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    paddingVertical: 10,
    paddingLeft: 10,
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
});
