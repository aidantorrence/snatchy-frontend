import React, { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Dimensions } from "react-native";
import { useUpdateUser } from "../data/mutations";
import { useStore } from "../utils/firebase/useAuthentication";
import { mixpanel } from "../utils/mixpanel";

export default function QuizRestrictedScreen({ navigation, route }: any) {
  const { mutate } = useUpdateUser() as any;
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [quizAnswersObj, setQuizAnswersObj] = useState(route.params.quizAnswersObj) as any;
  const answers = ["Yes it almost looks like I'm being choked even at the right size", "No I can pull it off if I want to"];
  const [selectedAnswer, setSelectedAnswer] = useState(new Array(answers.length).fill(false));

  function handleAnswerSelection(answer: any, index: number) {
    const newSelectedAnswer = new Array(answers.length).fill(false);
    newSelectedAnswer[index] = true;
    setSelectedAnswer(newSelectedAnswer);
    setQuizAnswersObj({ ...quizAnswersObj, restricted: answer });
  }

  function handleNextPageNavigate() {
    if (!selectedAnswer.includes(true)) return;
    mixpanel.track("quiz_restricted_next_button_clicked", {
      restricted: quizAnswersObj.restricted,
    });

    switch (quizAnswersObj.restricted) {
      case "Yes it almost looks like I'm being choked even at the right size":
        mutate({ uid: user?.uid, modusType: "FN" });
        setUser({ ...user, modusType: "FN" });
        navigation.navigate("QuizSuccess", { modusType: "FN" });
        break;
      case "No I can pull it off if I want to":
        mutate({ uid: user?.uid, modusType: "D" });
        setUser({ ...user, modusType: "D" });
        navigation.navigate("QuizSuccess", { modusType: "D" });
        break;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Do you look restricted if you button your shirt to the neck?</Text>
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
