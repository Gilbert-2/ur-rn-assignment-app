import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  Pressable,
  Modal,
} from "react-native";

import Consistants from "../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";

const ListQrcodeScreen = () => {
  const BASE_URL = Consistants.REACT_APP_BASE_URL;
  const [qrcodesList, setQrcodesList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectItem, setSelectedItem] = useState({});
  _viewDetails = (itemId) => {
    setSelectedItem(qrcodesList.find(({ id }) => id == itemId));
    setModalVisible(true);
  };
  _getQrcodes = async () => {
    try {
      const response = await Axios({
        method: "get",
        url: `${BASE_URL}/qrcodes`,
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("access_token")}`,
        },
      });
      setQrcodesList(response.data.qrcodes);
    } catch (error) {
      console.log(error);
      Alert.alert("Failed to fetch qrcodes list");
    }
  };
  useEffect(() => {
    _getQrcodes();
  }, []);
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
              <Text style={styles.modalText}>
                Plate number : {selectItem.plate_number}
              </Text>
              <Text style={styles.modalText}>Status : {selectItem.status}</Text>
              <Text style={styles.modalText}>
                Station : {selectItem.station_id}
              </Text>
              <Text style={styles.modalText}>
                Date : {selectItem.created_at}
              </Text>
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Text
        style={{
          color: "green",
          fontSize: 24,
          padding: 20,
        }}
      >
        Active qrcodes
      </Text>
      <FlatList
        data={qrcodesList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.status == "VALID") {
            return (
              <Pressable onPress={() => _viewDetails(item.id)}>
                <Text style={styles.item}>{item.plate_number}</Text>
              </Pressable>
            );
          }
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: "10%",
  },

  item: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    margin: "1%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
  },
  modalText: {
    marginBottom: 15,
  },
});

export default ListQrcodeScreen;
