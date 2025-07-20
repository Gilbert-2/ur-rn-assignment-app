import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DashboardScreen = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    AsyncStorage.getItem("user").then((userData) => {
      if (userData) setUser(JSON.parse(userData));
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to your Dashboard!</Text>
      {user && (
        <Text style={styles.subtitle}>Hello, {user.firstname} {user.lastname} 👋</Text>
      )}
      <Text style={styles.info}>Here you can manage your QR codes, view transactions, and more.</Text>
      {/* Add more dashboard widgets or quick actions here */}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#333',
    marginBottom: 18,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default DashboardScreen; 