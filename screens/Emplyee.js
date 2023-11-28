import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

import Consistants from "../config/config";
import Axios from "axios";

const EmployeeScreen = () => {
  const BASE_URL = Consistants.REACT_APP_BASE_URL;
  _saveEmployee = async () => {
    try {
      let data = {
        name: state.firstName.concat(" " + state.lastName),
        email: state.email,
        address: state.address,
        tel: state.tel,
      };
      const response = await Axios({
        method: "post",
        url: `${BASE_URL}/create-employee`,
        data: data,
      });
      // reset the form values in the state
      resetState();
      Alert.alert(response.data?.message);
    } catch (error) {
      Alert.alert("Failed to save employee details");
    }
  };

  const [state, setState] = useState({
    email: "",
    address: "",
    firstName: "",
    lastName: "",
    tel: "",
  });
  const resetState = () => {
    setState({
      email: "",
      address: "",
      firstName: "",
      lastName: "",
      tel: "",
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="First name"
          value={state.firstName}
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setState({ ...state, firstName: text })}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Last name"
          value={state.lastName}
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setState({ ...state, lastName: text })}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Tel"
          value={state.tel}
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setState({ ...state, tel: text })}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          value={state.email}
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setState({ ...state, email: text })}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Address"
          value={state.address}
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setState({ ...state, address: text })}
        />
      </View>
      <TouchableOpacity onPress={_saveEmployee} style={styles.loginBtn}>
        <Text style={styles.loginText}>Add employee </Text>
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
    borderRadius: 5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
});

export default EmployeeScreen;
