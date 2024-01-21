import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Consistants from "../config/config";
import Axios from "axios";

const LoginScreen = ({ navigation }) => {
  const BASE_URL = Consistants.REACT_APP_BASE_URL;

  const onPressLogin = async (e) => {
    e.preventDefault();
    if (!state.email && !state.password) return;
    try {
      let data = {
        password: state.password,
        email: state.email,
        device_name: "just_a_phone",
      };

      const response = await Axios({
        method: "post",
        url: `${BASE_URL}/login`,
        data: data,
      });
      await AsyncStorage.setItem("access_token", response.data.token);
      // reset the form values in the state
      resetState();
      navigation.navigate("Qrcode");
    } catch (error) {
      Alert.alert("Incorrect username or password");
    }
  };
  const resetState = () => {
    setState({
      email: "",
      password: "",
    });
  };
  const onPressForgotPassword = () => {
    Alert.alert("Reset password");
  };
  const onPressSignUp = () => {
    navigation.navigate("Signup");
  };
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Sign in</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          onChangeText={(text) => setState({ ...state, email: text })}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => setState({ ...state, password: text })}
        />
      </View>
      <TouchableOpacity onPress={onPressForgotPassword}>
        <Text style={styles.forgotAndSignUpText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressLogin} style={styles.loginBtn}>
        <Text style={styles.loginText}>Login </Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={onPressSignUp}>
        <Text style={styles.forgotAndSignUpText}>Signup</Text>
      </TouchableOpacity> */}
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
    color: "white",
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

export default LoginScreen;
