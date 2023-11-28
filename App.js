import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/Login";
import WelcomeScreen from "./screens/Welcome";
import SignupScreen from "./screens/Signup";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IndexScreen from "./screens/EmployeeIndex";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Employee" component={IndexScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
