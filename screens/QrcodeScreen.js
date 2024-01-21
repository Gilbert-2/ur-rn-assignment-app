import React from "react";
import QRCode from "react-native-qrcode-svg";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
const QrcodeScreen = ({ route }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Scan the QR Code</Text>
      <QRCode value={route.params.qr} size={200} />
    </View>
  );
};
export default QrcodeScreen;

const styles = StyleSheet.create({
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
