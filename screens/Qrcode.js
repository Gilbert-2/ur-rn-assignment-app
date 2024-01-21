import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import Consistants from "../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";

const QrcodeScreen = () => {
  const BASE_URL = Consistants.REACT_APP_BASE_URL;
  const [qrcode, setQrcode] = useState("");
  const [state, setState] = useState({
    station_id: "",
    amount: "",
  });
  _saveQrcode = async () => {
    try {
      let data = {
        station_id: state.station_id,
        amount: state.amount,
      };
      const response = await Axios({
        method: "post",
        url: `${BASE_URL}/create-qrcode`,
        data: data,
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("access_token")}`,
        },
      });
      setQrcode(response.data.data.qrcode);
      resetState();
    } catch (error) {
      Alert.alert("Failed to generate qrcode");
    }
  };
  const resetState = () => {
    setState({
      station_id: "",
      amount: "",
    });
  };
  useEffect(() => {
    setQrcode("");
  }, []);
  return (
    <>
      {qrcode ? (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Scan this QR Code</Text>
          <QRCode value={qrcode} size={200} />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Station id"
              value={state.station_id}
              placeholderTextColor="#003f5c"
              onChangeText={(text) => setState({ ...state, station_id: text })}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="amount"
              value={state.amount}
              placeholderTextColor="#003f5c"
              onChangeText={(text) => setState({ ...state, amount: text })}
            />
          </View>
          <TouchableOpacity onPress={_saveQrcode} style={styles.loginBtn}>
            <Text style={styles.loginText}>Generate qrcode </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
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
  sectionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
  },
  highlight: {
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    marginTop: 10,
  },
  textInput: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: "center",
    marginRight: 20,
    marginVertical: 20,
    borderRadius: 20,
    width: 162,
    borderWidth: 1,
    borderStyle: "solid",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  newButton: {
    backgroundColor: "deepskyblue",
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 75,
    borderRadius: 20,
    paddingBottom: 17,
  },
  Button: {
    backgroundColor: "deepskyblue",
    marginTop: 32,
    marginRight: 50,
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 20,
    paddingBottom: 17,
  },
});

export default QrcodeScreen;
