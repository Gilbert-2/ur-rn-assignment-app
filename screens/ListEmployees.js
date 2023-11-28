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
import Axios from "axios";

const ListEmployeeScreen = () => {
  const BASE_URL = Consistants.REACT_APP_BASE_URL;
  const [employeesList, setEmployeesList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectItem, setSelectedItem] = useState({});
  _viewDetails = (itemId) => {
    setSelectedItem(employeesList.find(({ id }) => id == itemId));
    setModalVisible(true);
  };
  _getEmployees = async () => {
    try {
      const response = await Axios({
        method: "get",
        url: `${BASE_URL}/employees`,
      });
      setEmployeesList(response.data.employees);
    } catch (error) {
      Alert.alert("Failed to fetch employees list");
    }
  };
  useEffect(() => {
    _getEmployees();
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
              <Text style={styles.modalText}>Name : {selectItem.name}</Text>
              <Text style={styles.modalText}>Email : {selectItem.email}</Text>
              <Text style={styles.modalText}>
                Phone number : {selectItem.tel}
              </Text>
              <Text style={styles.modalText}>
                Address : {selectItem.address}
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
        List of all employees
      </Text>
      <FlatList
        data={employeesList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => _viewDetails(item.id)}>
            <Text style={styles.item}>{item.name}</Text>
          </Pressable>
        )}
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

export default ListEmployeeScreen;
