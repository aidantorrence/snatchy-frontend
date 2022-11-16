import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, TouchableOpacity } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useQuery, useQueryClient } from "react-query";
import { fetchUser } from "../data/api";

export default function QuizIntroScreen({ navigation, route }: any) {
  const [quizAnswersObj, setQuizAnswersObj] = useState({}) as any;
  const answers = ["5'5 or below", "5'6 to 5'7", "5'8 or above"];
  const [selectedAnswer, setSelectedAnswer] = useState(new Array(answers.length).fill(false));

  function handleAnswerSelection(answer: any, index: number) {
    const newSelectedAnswer = new Array(answers.length).fill(false);
    newSelectedAnswer[index] = true;
    setSelectedAnswer(newSelectedAnswer);
    setQuizAnswersObj({ ...quizAnswersObj, height: answer });
  }

  function handleNextPageNavigate() {
    if (!selectedAnswer.includes(true)) return;

    switch (quizAnswersObj.height) {
      case "5'5 or below":
        navigation.navigate("QuizLimbLength", { quizAnswersObj });
        break;
      case "5'6 to 5'7":
        navigation.navigate("QuizLimbLength", { quizAnswersObj });
        break;
      case "5'8 or above":
        navigation.navigate("QuizClothing", { quizAnswersObj });
        break;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>LooksMax</Text>
      </View>
      <View>
        <Text style={styles.introText}>Answer a few questions about yourself so we can recommend clothes that flatter you</Text>
      </View>
      <View>
        <Text style={styles.headerText}>What's your height?</Text>
      </View>
      {answers.map((answer: any, index: number) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleAnswerSelection(answer, index)}
            style={[styles.button, index === selectedAnswer.findIndex((el) => el) ? styles.selected : styles.unselected]}
          >
            <Text style={styles.buttonText}>{answer}</Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity onPress={handleNextPageNavigate} style={styles.continueButton}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
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
  continueButton: {
    marginTop: 60,
    backgroundColor: "#F487D2",
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
