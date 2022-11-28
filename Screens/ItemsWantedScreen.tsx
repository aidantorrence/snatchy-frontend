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
import FastImage from 'react-native-fast-image'

const img = "https://1.kixify.com/sites/default/files/imagecache/product_full/product/2020/04/27/p_30009391_171134591_240382.jpg";
const userImages = [img, img, img];

const ListHeader = () => {
  return (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderText}>Select Listing(s) to Trade For</Text>
    </View>
  );
};

export default function ItemsWantedScreen({ navigation, route }: any) {
  const [additionalFunds, setAdditionalFunds] = useState(null) as any;
  const { id, ownerId } = route.params;
  const { data, isLoading } = useQuery(`user-${ownerId}`, () => fetchUser(ownerId));
  const listings = [data.listings.find((l: any) => l.id === id), ...data.listings.filter((l: any) => l.id !== id)];
  const [isChecked, setIsChecked] = useState([true, ...new Array(data.listings.length - 1).fill(false)]);

  const handlePress = () => {
    navigation.navigate("TradeStack", {
      screen: "ItemsToTrade",
      params: {
        screen: "ItemsToTrade",
        id,
        ownerId,
        itemsWanted: listings.filter((l: any, i: number) => isChecked[i]),
      },
    });
  };
  const handleChange = (index: number) => {
    const newIsChecked = isChecked.slice();
    newIsChecked[index] = !isChecked[index];
    setIsChecked(newIsChecked);
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>Select Listing(s) to Trade For</Text>
        </View>
        {listings.map((item, index) => (
          <View key={item.id} style={styles.itemContainer}>
            <Checkbox style={styles.checkbox} value={isChecked[index]} onValueChange={() => handleChange(index)} />
            <TouchableOpacity onPress={() => handlePress(item)} style={styles.card}>
              <FastImage source={{ uri: item.images[0] }} style={styles.image} />
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
        ))}
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
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
});
