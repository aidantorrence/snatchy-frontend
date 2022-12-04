import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, TouchableOpacity, Dimensions } from "react-native";
import { useUpdateUser } from "../data/mutations";
import { useStore } from "../utils/firebase/useAuthentication";
import { mixpanel } from "../utils/mixpanel";

export default function QuizClothingScreen({ navigation, route }: any) {
  const { mutate } = useUpdateUser() as any;
  const setUser = useStore((state) => state.setUser);
  const user = useStore((state) => state.user);
  const [quizAnswersObj, setQuizAnswersObj] = useState(route.params.quizAnswersObj) as any;
  const answers = ["I can take it or leave it", "It's a strict requirement"];
  const [selectedAnswer, setSelectedAnswer] = useState(new Array(answers.length).fill(false));

  function handleAnswerSelection(answer: any, index: number) {
    const newSelectedAnswer = new Array(answers.length).fill(false);
    newSelectedAnswer[index] = true;
    setSelectedAnswer(newSelectedAnswer);
    setQuizAnswersObj({ ...quizAnswersObj, clothing: answer });
  }

  function handleNextPageNavigate() {
    if (!selectedAnswer.includes(true)) return;
    mixpanel.track("quiz_clothing_screen_next_button_clicked", {
      clothing: quizAnswersObj.clothing,
    });

    switch (quizAnswersObj.clothing) {
      case "I can take it or leave it":
        switch (quizAnswersObj.limbLength) {
          case "Short":
            mutate({ uid: user?.uid, modusType: "FG" });
            setUser({ ...user, modusType: "FG" });
            navigation.navigate("QuizSuccess", { modusType: "FG" });
            break;
          case "Moderate":
            mutate({ uid: user?.uid, modusType: "DC" });
            setUser({ ...user, modusType: "DC" });
            navigation.navigate("QuizSuccess", { modusType: "DC" });
            break;
          case "Long and Lanky":
            navigation.navigate("QuizRestricted", { quizAnswersObj });
            break;
          case undefined:
            navigation.navigate("QuizRestricted", { quizAnswersObj });
            break;
        }
      case "It's a strict requirement":
        switch (quizAnswersObj.limbLength) {
          case "Short":
            navigation.navigate("QuizThickMaterials", { quizAnswersObj });
            break;
          case "Moderate":
            navigation.navigate("QuizAsymmetry", { quizAnswersObj });
            break;
          case "Long and Lanky":
            mutate({ uid: user?.uid, modusType: "SD" });
            setUser({ ...user, modusType: "SD" });
            navigation.navigate("QuizSuccess", { modusType: "SD" });
            break;
          case undefined:
            mutate({ uid: user?.uid, modusType: "SD" });
            setUser({ ...user, modusType: "SD" });
            navigation.navigate("QuizSuccess", { modusType: "SD" });
            break;
        }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Do you look your best when clothing cinches at the waist?</Text>
      </View>
      {answers.map((answer: any, index: number) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleAnswerSelection(answer, index)}
            style={[styles.button, index === selectedAnswer.findIndex((el) => el) ? styles.selected : styles.unselected]}
          >
            <Text style={[styles.buttonText, index === selectedAnswer.findIndex((el) => el) ? styles.selectedButtonText : undefined]}>{answer}</Text>
          </TouchableOpacity>
        );
      })}
      <View style={styles.controlsButtonContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.continueButton}>
        <Text style={styles.continueButtonText}>BACK</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNextPageNavigate} style={styles.continueButton}>
        <Text style={styles.continueButtonText}>NEXT</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 20,
  },
  controlsButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 16,
    textAlign: 'center',
  },
  introText: {
    fontSize: 20,
    margin: 20,
    textAlign: "center",
  },
  unselected: {
  },
  selected: {
    backgroundColor: "#F487D2",
    shadowOpacity: 0.50,
  },
  selectedButtonText: {
    color: 'white',
    fontWeight: '500',
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
    fontSize: 13,
    textAlign: "center",
  },
  continueButtonText: {
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    marginTop: 30,
    backgroundColor: "white",
    width: Dimensions.get("window").width * 0.9,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 3.27,
    padding: 18,
    elevation: 3,
  },
  continueButton: {
    marginTop: 40,
    borderRadius: 8,
    padding: 15,
    marginHorizontal:  Dimensions.get("window").width * 0.01,
    width: Dimensions.get("window").width * 0.44,
    backgroundColor: '#f2f2f2',
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
