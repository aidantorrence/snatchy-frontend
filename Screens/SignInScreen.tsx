import React from "react";
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, TouchableOpacity } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useQuery, useQueryClient } from "react-query";
import { fetchUser } from "../data/api";
import auth from "@react-native-firebase/auth";
import analytics from "@react-native-firebase/analytics";


const SignInScreen: React.FC<StackScreenProps<any>> = ({ navigation, route }) => {
  const firebaseAuth = auth();
  let uid = "";
  const { data: userData, isLoading, refetch } = useQuery(`currentUser`, () => fetchUser(uid));
  const queryClient = useQueryClient();
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });

  async function signIn() {
    if (value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: "Email and password are mandatory.",
      });
      return;
    }

    try {
      const { user } = await firebaseAuth.signInWithEmailAndPassword(value.email, value.password);
      analytics().logEvent("upload_profile_picture");
      navigation.navigate("HomeTabs");
    } catch (error: any) {
      setValue({
        ...value,
        error: error.message,
      });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {!!value.error && (
        <View style={styles.error}>
          <Text>{value.error}</Text>
        </View>
      )}

      <View style={styles.title}>
        <Text style={styles.titleText}>LooksMax</Text>
      </View>
      <View style={styles.controls}>
        <TextInput
          autoCorrect={false}
          placeholder="Email"
          style={styles.control}
          value={value.email}
          onChangeText={(text: string) => setValue({ ...value, email: text })}
        />

        <TextInput
          autoCorrect={false}
          placeholder="Password"
          style={styles.control}
          value={value.password}
          onChangeText={(text: string) => setValue({ ...value, password: text })}
          secureTextEntry={true}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={signIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
          <View style={styles.or}>
            <Text style={styles.orText}>----- OR -----</Text>
          </View>
          <TouchableOpacity style={styles.signUp} onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signUpButtonText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  signUpButtonText: {
    color: "#2b414d",
    fontSize: 16,
  },
  signUp: {
    marginTop: 20,
    alignItems: 'center',
  },
  or: {
    marginTop: 20,
    alignItems: 'center',
  },
  orText: {
    fontSize: 20,
  },
  title: {
    marginVertical: 20,
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
  },

  controls: {
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

export default SignInScreen;
