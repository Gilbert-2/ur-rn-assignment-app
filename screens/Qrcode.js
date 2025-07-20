import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
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
  const [plateNumber, setPlateNumber] = useState("");
  const [loading, setLoading] = useState(false);

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
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);
  const _saveQrcode = async () => {
    if (!selected) {
      Alert.alert("Validation Error", "Please select a station.");
      return;
    }
    if (!state.amount || isNaN(state.amount) || Number(state.amount) <= 0) {
      Alert.alert("Validation Error", "Please enter a valid amount.");
      return;
    }
    setLoading(true);
    try {
      let data = {
        station_id: Number(selected),
        amount: Number(state.amount),
      };
      if (plateNumber.trim()) {
        data.plate_number = plateNumber.trim();
      }
      const token = await AsyncStorage.getItem("access_token");
      const response = await Axios({
        method: "post",
        url: `${Consistants.REACT_APP_BASE_URL}/api/create-qrcode`,
        data: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQrcode(response.data.data.qrcode);
      resetState();
      setPlateNumber("");
      await sendPushNotification(expoPushToken);
    } catch (error) {
      Alert.alert("Failed to generate QR code", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
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
    <ScrollView style={styles.scrollView}>
      {qrcode ? (
        <View style={styles.qrContainer}>
          <View style={styles.qrHeader}>
            <Text style={styles.qrTitle}>Payment QR Code</Text>
            <Text style={styles.qrSubtitle}>Show this to the attendant</Text>
          </View>
          
          <View style={styles.qrCodeWrapper}>
            <QRCode value={qrcode} size={250} />
          </View>
          
          <TouchableOpacity 
            style={styles.newQrButton} 
            onPress={() => setQrcode("")}
          >
            <Text style={styles.newQrButtonText}>Generate New QR Code</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Generate QR Code</Text>
            <Text style={styles.subtitle}>Create a payment QR code for your transaction</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Station</Text>
              <SelectList
                setSelected={(val) => setSelected(val)}
                data={data}
                save="key"
                boxStyles={styles.selectBox}
                inputStyles={styles.selectInput}
                dropdownStyles={styles.dropdown}
                placeholder="Choose a station"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount</Text>
              <TextInput
                style={styles.inputText}
                placeholder="Enter amount"
                value={state.amount}
                placeholderTextColor="#999"
                onChangeText={(text) => setState({ ...state, amount: text })}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Plate Number (optional)</Text>
              <TextInput
                style={styles.inputText}
                placeholder="Enter plate number"
                value={plateNumber}
                placeholderTextColor="#999"
                onChangeText={setPlateNumber}
                autoCapitalize="characters"
                maxLength={10}
              />
            </View>

            <TouchableOpacity onPress={_saveQrcode} style={[styles.generateButton, loading && styles.buttonDisabled]} disabled={loading}>
              <Text style={styles.generateButtonText}>{loading ? "Generating..." : "Generate QR Code"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  selectBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
  },
  selectInput: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  inputText: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  generateButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  qrContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  qrHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  qrTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  qrSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  qrCodeWrapper: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 30,
  },
  newQrButton: {
    backgroundColor: '#666',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  newQrButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: { backgroundColor: '#ccc' },
});

export default QrcodeScreen;
