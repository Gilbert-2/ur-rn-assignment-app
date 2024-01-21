import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { Camera } from "expo-camera";
import Axios from "axios";
import Consistants from "../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const QRCodeScanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const cameraRef = React.useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    sendToAPI(data);
  };

  const sendToAPI = async (data) => {
    let dataObj = { qrcode: data };
    try {
      const BASE_URL = Consistants.REACT_APP_BASE_URL;
      const response = await Axios({
        method: "post",
        url: `${BASE_URL}/qrcode/update`,
        data: dataObj,
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("access_token")}`,
        },
      });
      Alert.alert(response.data.message);
    } catch (error) {
      console.log(">>>>>>", error.message);
      console.error("Error sending data to API:", error);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      {scanned && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
});

export default QRCodeScanner;
