import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";

const SignupScreen = ({ navigation }) => {
  const onPressLogin = () => {
    navigation.navigate("Login");
  };

  const onPressSignUp = () => {
    console.log(state);
  };
  const [state, setState] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    tel: "",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Sign up</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="First name"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setState({ firstName: text })}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Last name"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setState({ lastName: text })}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setState({ email: text })}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setState({ password: text })}
        />
      </View>
      <TouchableOpacity onPress={onPressSignUp} style={styles.loginBtn}>
        <Text style={styles.loginText}>Signup </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressLogin}>
        <Text style={styles.forgotAndSignUpText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 27,
    color: "green",
    marginBottom: 40,
  },
  inputView: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
    borderBottomWidth: 1,
  },
  forgotAndSignUpText: {
    fontSize: 11,
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "green",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
});

export default SignupScreen;
