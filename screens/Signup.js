import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";

const API_URL = "http://192.168.1.66:8000";

const SignupScreen = ({ navigation }) => {
  const [state, setState] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    tel: "",
  });
  const [loading, setLoading] = useState(false);

  const onPressLogin = () => {
    navigation.navigate("Login");
  };

  const validateForm = () => {
    if (!state.firstName.trim()) {
      Alert.alert("Error", "Please enter your first name");
      return false;
    }
    if (!state.lastName.trim()) {
      Alert.alert("Error", "Please enter your last name");
      return false;
    }
    if (!state.email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return false;
    }
    if (!state.password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return false;
    }
    if (state.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const onPressSignUp = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/signup`,
        {
          firstname: state.firstName,
          lastname: state.lastName,
          email: state.email,
          password: state.password,
        }
      );
      Alert.alert("Success", "Signup successful! Please log in.");
      navigation.navigate("Login");
    } catch (error) {
      let msg = error.response?.data?.message || error.message || "Signup failed";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us to start managing QR codes</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Enter your first name"
              placeholderTextColor="#999"
              value={state.firstName}
              onChangeText={(text) => setState((s) => ({ ...s, firstName: text }))}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Enter your last name"
              placeholderTextColor="#999"
              value={state.lastName}
              onChangeText={(text) => setState((s) => ({ ...s, lastName: text }))}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={state.email}
              onChangeText={(text) => setState((s) => ({ ...s, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              value={state.password}
              onChangeText={(text) => setState((s) => ({ ...s, password: text }))}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity 
            onPress={onPressSignUp} 
            style={[styles.signupButton, loading && styles.signupButtonDisabled]}
            disabled={loading}
          >
            <Text style={styles.signupButtonText}>
              {loading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loginSection}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={onPressLogin}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputText: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  signupButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signupButtonDisabled: {
    backgroundColor: '#ccc',
  },
  signupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});

export default SignupScreen;
