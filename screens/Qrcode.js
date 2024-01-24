import React, { useEffect, useState, useRef } from "react";
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
import { SelectList } from "react-native-dropdown-select-list";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
Notifications.scheduleNotificationAsync({
  content: {
    title: "Payment request",
    body: "Show the qrcode to the attendant",
  },
  trigger: null,
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
    ).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

const QrcodeScreen = ({ navigation }) => {
  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Original Title",
      body: "And here is the body!",
      data: { someData: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }
  const [selected, setSelected] = React.useState("");

  const data = [
    { key: "1", value: "SP" },
    { key: "2", value: "Meru" },
    { key: "3", value: "Engine" },
    { key: "4", value: "OXY" },
    { key: "5", value: "Descentre" },
    { key: "6", value: "Merez" },
  ];

  const BASE_URL = Consistants.REACT_APP_BASE_URL;
  const [qrcode, setQrcode] = useState("");
  const [state, setState] = useState({
    station_id: "",
    amount: "",
  });
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  _saveQrcode = async () => {
    try {
      let data = {
        station_id: selected ?? 1,
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
      await sendPushNotification(expoPushToken);
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
    const unsubscribe = navigation.addListener("focus", () => {
      setQrcode("");
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <>
      {qrcode ? (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Scan this QR Code</Text>
          <QRCode value={qrcode} size={200} />
        </View>
      ) : (
        <View style={styles.container}>
          <SelectList
            setSelected={(val) => setSelected(val)}
            data={data}
            save="key"
            boxStyles={styles.inputSelect}
          />
          <View style={styles.inputView}></View>

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
  inputSelect: {
    width: "80%",
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderRadius: 0,
    height: 50,
    justifyContent: "center",
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
