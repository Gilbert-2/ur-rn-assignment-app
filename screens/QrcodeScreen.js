import React from "react";
import QRCode from "react-native-qrcode-svg";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

const QrcodeScreen = ({ route, navigation }) => {
  const {
    qrcode = "",
    amount = "",
    plate_number = "",
    status = "PENDING",
    station_id = "",
    created_by = "",
  } = route.params || {};

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Payment QR Code</Text>
          <Text style={styles.subtitle}>Show this QR code to the driver for payment</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.qrWrapper}>
            <QRCode value={qrcode} size={220} />
          </View>
          <View style={styles.detailsSection}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.detailValue}>{amount ? `RWF ${amount}` : '-'}</Text>
            {plate_number ? (
              <>
                <Text style={styles.detailLabel}>Plate Number:</Text>
                <Text style={styles.detailValue}>{plate_number}</Text>
              </>
            ) : null}
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.detailValue, status === 'PENDING' ? styles.statusPending : styles.statusCompleted]}>{status}</Text>
          </View>
          <View style={styles.waitingSection}>
            <Text style={styles.waitingText}>
              {status === 'PENDING' ? 'Waiting for driver to scan and confirm...' : 'Transaction completed!'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.newQrButton} onPress={() => navigation.goBack()}>
          <Text style={styles.newQrButtonText}>Generate New QR Code</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default QrcodeScreen;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
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
    marginBottom: 30,
    width: '100%',
  },
  qrWrapper: {
    marginBottom: 24,
    alignItems: 'center',
  },
  detailsSection: {
    marginBottom: 18,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 15,
    color: '#888',
    fontWeight: '500',
    marginTop: 6,
  },
  detailValue: {
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
  waitingSection: {
    marginTop: 10,
    alignItems: 'center',
  },
  waitingText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
    textAlign: 'center',
  },
  newQrButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 30,
  },
  newQrButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
