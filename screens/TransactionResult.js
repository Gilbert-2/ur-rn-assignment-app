import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const TransactionResult = ({ route, navigation }) => {
  const { success = false, message = "" } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={[styles.card, success ? styles.successCard : styles.errorCard]}>
        <Text style={[styles.icon, success ? styles.successIcon : styles.errorIcon]}>
          {success ? "✅" : "❌"}
        </Text>
        <Text style={[styles.title, success ? styles.successText : styles.errorText]}>
          {success ? "Transaction Successful" : "Transaction Failed"}
        </Text>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Qrcode")}
        >
          <Text style={styles.actionButtonText}>Start New Transaction</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Qrcode", { screen: "Home" })}
        >
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
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
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
    maxWidth: 400,
  },
  successCard: {
    borderColor: '#2E7D32',
    borderWidth: 2,
  },
  errorCard: {
    borderColor: '#D32F2F',
    borderWidth: 2,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  successIcon: {
    color: '#2E7D32',
  },
  errorIcon: {
    color: '#D32F2F',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  successText: {
    color: '#2E7D32',
  },
  errorText: {
    color: '#D32F2F',
  },
  message: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 28,
    marginTop: 4,
  },
  actionButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 14,
    width: '100%',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#eee',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TransactionResult; 