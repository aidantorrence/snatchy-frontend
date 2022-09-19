import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { InputForm } from "../Components/Forms";
import { fetchUser, updateUser } from "../data/api";
import useAuthentication, { useStore } from "../utils/firebase/useAuthentication";

export default function ShippingDetailsScreen({ navigation, route }: any) {
  const user = useStore((state) => state.user);
  const { data, isLoading: isUserLoading } = useQuery("currentUser", () => fetchUser(user?.uid));
  const [formData, setFormData] = useState({
    address: "",
    optionalAddress: "",
    city: "",
    state: "",
    zipcode: "",
    country: "United States",
  }) as any;
  const [focusedState, setFocusedState] = useState({
    name: false,
    price: false,
    size: false,
    timesWorn: false,
    scuffMarks: false,
    discoloration: false,
    looseThreads: false,
    heelDrag: false,
    toughStains: false,
  });
  const [error, setError] = useState({
    images: "",
    name: "",
    condition: "",
    size: "",
    price: "",
    canTrade: "",
    gender: "",
    boxCondition: "",
    timesWorn: "",
    scuffMarks: "",
    discoloration: "",
    looseThreads: "",
    heelDrag: "",
    toughStains: "",
  }) as any;
  const queryClient = useQueryClient();
  const mutation: any = useMutation((data) => updateUser(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("currentUser");
      queryClient.invalidateQueries("userTrades");
      queryClient.invalidateQueries("userOffers");
    },
  });
  const handleAddShippingAddress = () => {
    const isValid = validateForm();
    if (!isValid) return;
    mutation.mutate({
      uid: user.uid,
      ...formData,
    });
    // if come from offer button do something vs buy button
    navigation.goBack();
  };
  const validateForm = () => {
    let isValid = true;
    for (const key in formData) {
      if (formData[key] === "") {
        setError((err: any) => ({ ...err, [key]: "This field is required" }));
        isValid = false;
      }
    }
    return isValid;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.shippingContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Shipping Details</Text>
        </View>
        <InputForm
          formData={formData}
          setFormData={setFormData}
          focusedState={focusedState}
          setFocusedState={setFocusedState}
          setError={setError}
          error={error}
          field="address"
        />
        <InputForm
          formData={formData}
          setFormData={setFormData}
          focusedState={focusedState}
          setFocusedState={setFocusedState}
          setError={setError}
          error={error}
          field="optionalAddress"
        />
        <InputForm
          formData={formData}
          setFormData={setFormData}
          focusedState={focusedState}
          setFocusedState={setFocusedState}
          setError={setError}
          error={error}
          field="city"
        />
        <InputForm
          formData={formData}
          setFormData={setFormData}
          focusedState={focusedState}
          setFocusedState={setFocusedState}
          setError={setError}
          error={error}
          field="state"
        />
        <InputForm
          formData={formData}
          setFormData={setFormData}
          focusedState={focusedState}
          setFocusedState={setFocusedState}
          setError={setError}
          error={error}
          field="zipcode"
        />
        <InputForm
          formData={formData}
          setFormData={setFormData}
          focusedState={focusedState}
          setFocusedState={setFocusedState}
          setError={setError}
          error={error}
          field="country"
        />
        <TouchableOpacity onPress={handleAddShippingAddress} style={styles.buttonContainer}>
          <LinearGradient
            colors={["#aaa", "#aaa", "#333"]}
            locations={[0, 0.3, 1]}
            style={styles.confirmButton}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.completeButtonText}>Add</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shippingContainer: {
    width: "100%",
    padding: 20,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
  },
  titleContainer: {
    borderBottomWidth: 1,
    borderColor: "#aaa",
    marginHorizontal: 20,
    paddingVertical: 15,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  completeButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  confirmButton: {
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
  completeButton: {
    padding: 15,
    alignItems: "center",
    borderRadius: 27,
    margin: 20,
    paddingLeft: 30,
    paddingRight: 30,
    width: 160,
  },
  textInput: {},
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
