import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Consistants from "../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";

const ListQrcodeScreen = () => {
  const BASE_URL = Consistants.REACT_APP_BASE_URL;
  const [qrcodesList, setQrcodesList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectItem, setSelectedItem] = useState({});
  const [loading, setLoading] = useState(true);

  _viewDetails = (itemId) => {
    setSelectedItem(qrcodesList.find(({ id }) => id == itemId));
    setModalVisible(true);
  };

  _getQrcodes = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");
      const apiUrl = `${Consistants.REACT_APP_BASE_URL}/api/qrcodes`;
      console.log("Fetching QR codes from:", apiUrl);
      console.log("With headers:", { Authorization: `Bearer ${token}` });
      const response = await Axios({
        method: "get",
        url: apiUrl,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.qrcodes && Array.isArray(response.data.qrcodes)) {
        setQrcodesList(response.data.qrcodes);
      } else {
        setQrcodesList([]);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.qrcodes === "No qrcodes found"
      ) {
        setQrcodesList([]);
      } else {
        console.log(error);
        Alert.alert("Failed to fetch QR codes");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteQrcode = async (id) => {
    Alert.alert(
      "Delete QR Code",
      "Are you sure you want to delete this QR code?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("access_token");
              const apiUrl = `${Consistants.REACT_APP_BASE_URL}/api/qrcodes/${id}`;
              const response = await Axios({
                method: "delete",
                url: apiUrl,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              Alert.alert("Success", response.data.message || "QR code deleted");
              _getQrcodes();
            } catch (error) {
              Alert.alert("Error", "Failed to delete QR code");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    _getQrcodes();
  }, []);

  const renderQRCodeItem = ({ item }) => {
    if (item.status !== "VALID") return null;

    return (
      <View style={styles.qrCodeCard}>
        <TouchableOpacity 
          style={styles.qrCodeContent}
          onPress={() => _viewDetails(item.id)}
        >
          <View style={styles.qrCodeInfo}>
            <View style={styles.plateNumberContainer}>
              <MaterialCommunityIcons 
                name="car" 
                size={20} 
                color="#2E7D32" 
                style={styles.plateIcon}
              />
              <Text style={styles.plateNumber}>{item.plate_number}</Text>
            </View>
            <View style={styles.statusContainer}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
          </View>
          <View style={styles.qrCodeMeta}>
            <Text style={styles.metaText}>Station: {item.station_id}</Text>
            <Text style={styles.metaText}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteQrcode(item.id)}
        >
          <MaterialCommunityIcons name="delete" size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons 
        name="qrcode" 
        size={80} 
        color="#ccc" 
      />
      <Text style={styles.emptyTitle}>No QR Codes Found</Text>
      <Text style={styles.emptySubtitle}>
        Generate your first QR code to see it here
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My QR Codes</Text>
        <Text style={styles.subtitle}>Manage your active QR codes</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={qrcodesList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderQRCodeItem}
          ListEmptyComponent={EmptyState}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          style={styles.flatList}
        />
      )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>QR Code Details</Text>
                <TouchableOpacity 
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <MaterialCommunityIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Plate Number</Text>
                  <Text style={styles.detailValue}>{selectItem.plate_number}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{selectItem.status}</Text>
                  </View>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Station</Text>
                  <Text style={styles.detailValue}>{selectItem.station_id}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Created</Text>
                  <Text style={styles.detailValue}>
                    {selectItem.created_at ? 
                      new Date(selectItem.created_at).toLocaleString() : 
                      'N/A'
                    }
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 20,
  },
  flatList: {
    flex: 1,
  },
  qrCodeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  qrCodeContent: {
    flex: 1,
    padding: 16,
  },
  qrCodeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  plateNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plateIcon: {
    marginRight: 8,
  },
  plateNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  qrCodeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 0,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  modalButton: {
    backgroundColor: '#2E7D32',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ListQrcodeScreen;
