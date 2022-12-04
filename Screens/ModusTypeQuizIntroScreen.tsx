import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, TouchableOpacity, Dimensions } from "react-native";

export default function ModusTypeQuizIntroScreen({ navigation, route }: any) {


  function handleNextPageNavigate() {
    navigation.navigate("QuizHeight");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Let's answer a few short questions so we can suggest clothes that fit your body type</Text>
      </View>
      <TouchableOpacity onPress={handleNextPageNavigate} style={styles.continueButton}>
        <Text style={styles.continueButtonText}>NEXT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    margin: 20,
    marginTop: 60,
  },
  continueButtonText: {
    fontSize: 16,
    textAlign: "center",
  },
  continueButton: {
    marginTop: 40,
    borderRadius: 8,
    padding: 15,
    width: Dimensions.get("window").width * 0.9,
    backgroundColor: '#f2f2f2',
  },
  headerText: {
    fontSize: 20,
    textAlign: "center",
  },
  introText: {
    fontSize: 20,
    margin: 20,
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
