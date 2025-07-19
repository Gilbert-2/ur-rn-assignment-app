import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>QR Code Manager</Text>
        <Text style={styles.subtitle}>Scan • Create • Manage</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.signupButton} 
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    letterSpacing: 1,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  signupButton: {
    backgroundColor: '#2E7D32',
    width: '100%',
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signupText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 25,
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: '#2E7D32',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginText: {
    color: '#2E7D32',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
