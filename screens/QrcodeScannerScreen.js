import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const QRCodeScanner = ({ navigation }) => {
  const [manualQRCode, setManualQRCode] = useState("");
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch QR code details after scanning
  const fetchQrcodeDetails = async (qrcodeString) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await fetch('http://192.168.1.66:8000/api/qrcode/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ qrcode: qrcodeString })
      });
      const responseText = await response.text();
      let result = JSON.parse(responseText);
      if (response.ok) {
        navigation.navigate('ConfirmTransaction', { qrcode: qrcodeString, ...result.data });
      } else {
        Alert.alert("Error", result.message || "Failed to fetch QR code details");
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch QR code details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = () => {
    if (manualQRCode.trim()) {
      fetchQrcodeDetails(manualQRCode.trim());
    } else {
      Alert.alert("Error", "Please enter a QR code");
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setManualQRCode("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>QR Code Scanner</Text>
        <Text style={styles.subtitle}>Enter QR code manually or test API connection</Text>
      </View>

      <View style={styles.content}>
        {!scanned ? (
          <View style={styles.scanSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enter QR Code</Text>
              <TextInput
                style={styles.textInput}
                value={manualQRCode}
                onChangeText={setManualQRCode}
                placeholder="Paste or type QR code here"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity 
              style={[styles.scanButton, loading && { backgroundColor: '#ccc' }]}
              onPress={handleManualSubmit}
              disabled={loading}
            >
              <Text style={styles.scanButtonText}>{loading ? 'Processing...' : 'Process QR Code'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.successSection}>
            <Text style={styles.successText}>QR Code Processed Successfully!</Text>
            <TouchableOpacity 
              style={styles.scanAgainButton}
              onPress={resetScanner}
            >
              <Text style={styles.scanAgainText}>Scan Another QR Code</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.testSection}>
          <TouchableOpacity 
            style={styles.testButton}
            onPress={() => Alert.alert('Test', 'Test Server Connection button pressed.')}
          >
            <Text style={styles.testButtonText}>Test Server Connection</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scanSection: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  scanButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successSection: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center',
  },
  scanAgainButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  scanAgainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  testSection: {
    marginTop: 'auto',
    marginBottom: 40,
  },
  testButton: {
    backgroundColor: '#666',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QRCodeScanner;
