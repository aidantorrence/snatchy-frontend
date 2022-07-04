import React from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useMutation, useQueryClient } from "react-query";
import { postUser } from "../data/api";

const SignUpScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });
  const queryClient = useQueryClient();
  const mutation: any = useMutation((data) => postUser(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
  });

  const auth = getAuth();

  async function signUp() {
    if (value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: "Email and password are mandatory.",
      });
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, value.email, value.password);
      mutation.mutate({
        uid: user.uid,
        email: user.email,
      });
      navigation.navigate("HomeTabs");
    } catch (error: any) {
      setValue({
        ...value,
        error: error?.message,
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text>Signup screen!</Text>

      {!!value.error && (
        <View style={styles.error}>
          <Text>{value.error}</Text>
        </View>
      )}

      <View style={styles.controls}>
        <TextInput
          placeholder="Email"
          style={styles.control}
          value={value.email}
          onChangeText={(text: string) => setValue({ ...value, email: text })}
        />

        <TextInput
          placeholder="Password"
          style={styles.control}
          value={value.password}
          onChangeText={(text: string) => setValue({ ...value, password: text })}
          secureTextEntry={true}
        />

        <Button title="Sign up" style={styles.control} onPress={signUp} />
        <Button
          title="Already signed up?  Sign in instead"
          style={styles.control}
          onPress={() => navigation.navigate("SignIn")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  controls: {
    flex: 1,
  },

  control: {
    marginTop: 10,
  },

  error: {
    marginTop: 10,
    padding: 10,
    color: "#fff",
    backgroundColor: "#D54826FF",
  },
});

export default SignUpScreen;
