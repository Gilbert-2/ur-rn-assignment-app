import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ConfirmTransaction = ({ route, navigation }) => {
  // Expecting route.params to have: qrcode, amount, plate_number, station_id, etc.
  const {
    qrcode = "",
    amount = "",
    plate_number = "",
    station_id = "",
    status = "PENDING",
  } = route.params || {};

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await fetch('http://192.168.1.66:8000/api/qrcode/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ qrcode })
      });
      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
        if (response.ok) {
          navigation.replace('TransactionResult', { success: true, message: result.message || 'Transaction completed successfully.' });
        } else {
          Alert.alert("Error", result.message || "Failed to confirm transaction");
        }
      } catch (parseError) {
        Alert.alert("Error", "Server responded with non-JSON data. Status: " + response.status + "\nResponse: " + responseText.substring(0, 200));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to confirm transaction: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Confirm Transaction</Text>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>{amount ? `RWF ${amount}` : '-'}</Text>
        {plate_number ? (
          <>
            <Text style={styles.label}>Plate Number:</Text>
            <Text style={styles.value}>{plate_number}</Text>
          </>
        ) : null}
        <Text style={styles.label}>Station ID:</Text>
        <Text style={styles.value}>{station_id || '-'}</Text>
        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, status === 'PENDING' ? styles.statusPending : styles.statusCompleted]}>{status}</Text>
        <TouchableOpacity 
          style={[styles.confirmButton, loading && styles.buttonDisabled]} 
          onPress={handleConfirm} 
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmButtonText}>Confirm Payment</Text>}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 18,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    color: '#888',
    fontWeight: '500',
    marginTop: 8,
  },
  value: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statusPending: {
    color: '#FFA000',
  },
  statusCompleted: {
    color: '#2E7D32',
  },
  confirmButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 28,
    width: '100%',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  cancelButton: {
    backgroundColor: '#eee',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConfirmTransaction; 