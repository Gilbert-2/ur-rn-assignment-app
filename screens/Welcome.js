import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Management portal</Text>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.signup}>Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.login}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {},
  text: {
    color: "green",
    marginTop: "25%",
    marginLeft: "20%",
    fontSize: 27,
  },
  signup: {
    backgroundColor: "white",
    width: "75%",
    borderRadius: 25,
    textAlign: "center",
    fontWeight: "bold",
    marginLeft: "11%",
    padding: "2%",
    fontSize: 20,
    marginTop: "50%",
  },
  login: {
    backgroundColor: "green",
    color: "white",
    width: "75%",
    borderRadius: 25,
    textAlign: "center",
    fontWeight: "bold",
    marginLeft: "11%",
    padding: "2%",
    fontSize: 20,
    marginTop: "10%",
  },
});
