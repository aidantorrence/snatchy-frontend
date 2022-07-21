import { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { useQuery } from "react-query";
import { fetchUser } from "../data/api";
import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import useAuthentication from "../utils/firebase/useAuthentication";

const img = "https://1.kixify.com/sites/default/files/imagecache/product_full/product/2020/04/27/p_30009391_171134591_240382.jpg";
const userImages = [img, img, img];

const ListHeader = () => {
  return (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderText}>Select Listing(s) To Trade</Text>
    </View>
  );
};

export default function ItemsToTradeScreen({ navigation, route }: any) {
  const { id, ownerId, itemsWanted } = route.params;
  const user = useAuthentication();
  const { data, isLoading } = useQuery(`user-${user?.uid}`, () => fetchUser(user?.uid));
  const [isChecked, setIsChecked] = useState(new Array(data?.listings?.length).fill(false));

  const handlePress = () => {
    navigation.navigate("TradeStack", {
      screen: "TradeSummary",
      params: {
        screen: "TradeSummary",
        id,
        ownerId,
        itemsWanted,
        itemsToTrade: data?.listings?.filter((l: any, i: number) => isChecked[i]),
      },
    });
  };
  const handleChange = (index: number) => {
    const newIsChecked = isChecked.slice();
    newIsChecked[index] = !isChecked[index];
    setIsChecked(newIsChecked);
  };
  const handleCreateListing = () => {
    navigation.navigate("HomeTabs", {
      screen: "CreateStack",
      params: {
        screen: "CreateStack",
      },
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        {!data?.listings.length ? (
          <TouchableOpacity style={styles.createListingButton} onPress={handleCreateListing}>
            <Text style={styles.createListingButtonText}>Create a New Listing</Text>
          </TouchableOpacity>
        ) : (
          <FlatList
            data={data?.listings}
            renderItem={({ item, index }: any) => (
              <View style={styles.itemContainer}>
                <Checkbox style={styles.checkbox} value={isChecked[index]} onValueChange={() => handleChange(index)} />
                <TouchableOpacity onPress={() => handlePress()} style={styles.card}>
                  <Image source={{ uri: item.images[0] }} style={styles.image} />
                  <View style={styles.detailsContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.detailsText}>
                      {item.size}
                      {item.gender[0]} · {item.price}
                    </Text>
                    <Text style={styles.detailsText}>{item.condition}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={ListHeader}
          />
        )}
        {data?.listings.length ? (
          <TouchableOpacity onPress={handlePress} style={styles.buttonContainer}>
            <LinearGradient
              colors={["#aaa", "#aaa", "#333"]}
              locations={[0, 0.3, 1]}
              style={styles.button}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    borderRadius: 7,
  },
  inputContainer: {
    padding: 20,
  },
  detailsText: {
    fontSize: 16,
    marginVertical: 3,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 3,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    flex: 1,
  },
  listHeader: {
    flex: 1,
    padding: 10,
  },
  listHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    padding: 15,
    alignItems: "center",
    borderRadius: 27,
    margin: 20,
    paddingLeft: 30,
    paddingRight: 30,
  },
  buttonContainer: {
    alignItems: "center",
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkbox: {
    marginRight: 20,
  },
  image: {
    height: 70,
    width: 70,
  },
  titleContainer: {
    flexDirection: "row",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  userImagesContainer: {
    flexDirection: "row",
  },
  userImages: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    margin: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 28,
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    fontWeight: "bold",
    fontSize: 28,
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
  createListingButton: {
    backgroundColor: "rgba(255,0,0,0.45)",
    margin: 20,
    borderRadius: 7,
    borderWidth: 1,
  },
  createListingButtonText: {
    padding: 10,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
