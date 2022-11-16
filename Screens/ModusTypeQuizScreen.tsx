import React from "react";
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, TouchableOpacity } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useQuery, useQueryClient } from "react-query";
import { fetchUser } from "../data/api";

const ModusTypeQuizScreen: React.FC<StackScreenProps<any>> = ({ navigation, route }) => {
  let uid = "";
  const { data: userData, isLoading, refetch } = useQuery(`currentUser`, () => fetchUser(uid));
  const queryClient = useQueryClient();

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>My arms and legs are best described as:</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text>Elongated, Narrow</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text>Elongated, Broad</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text>Moderate, Even</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text>Small, Slightly Short</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text>Small, Very Short</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    alignItems: "center",
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
    marginTop: 20,
    backgroundColor: "#2b414d",
    borderRadius: 50,
    padding: 10,
    width: 150,
  },
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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

export default ModusTypeQuizScreen;
