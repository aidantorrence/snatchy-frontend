import { useState } from "react";
import { SafeAreaView, StyleSheet, TextInput, View } from "react-native";

export default function ShippingDetailsScreen() {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'US',
  })
  
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TextInput
          value={formData.address}
          onChangeText={(value) => setFormData({ ...formData, address: value })}
          style={styles.textInput}
          autoCorrect={false}
        />
        <TextInput
          value={formData.city}
          onChangeText={value => setFormData({ ...formData, city: value})}
          style={styles.textInput}
          autoCorrect={false}
        />
        <TextInput
          value={formData.state}
          onChangeText={value => setFormData({ ...formData, state: value})}
          style={styles.textInput}
          autoCorrect={false}
        />
        <TextInput
          value={formData.zipcode}
          onChangeText={value => setFormData({ ...formData, zipcode: value})}
          style={styles.textInput}
          autoCorrect={false}
        />
        <TextInput
          value={formData.country}
          onChangeText={value => setFormData({ ...formData, country: value})}
          style={styles.textInput}
          autoCorrect={false}
        />
        <TextInput />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    
  },
  container: {
    flex: 1,
    justifyContent: "center",
    margin: 20,
  },
  input: {
    backgroundColor: "#efefefef",
    borderRadius: 8,
    fontSize: 20,
    height: 50,
    padding: 10,
  },
  card: {
    backgroundColor: "#efefefef",
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },
});
