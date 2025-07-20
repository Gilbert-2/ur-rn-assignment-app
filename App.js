import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/Login";
import WelcomeScreen from "./screens/Welcome";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IndexScreen from "./screens/QrcodeIndex";
import ConfirmTransaction from "./screens/ConfirmTransaction";
import TransactionResult from "./screens/TransactionResult";
import ForgotPasswordScreen from "./screens/ForgotPassword";
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
        <Stack.Screen name="Signup" component={require('./screens/Signup').default} />
        <Stack.Screen name="Qrcode" component={IndexScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ConfirmTransaction" component={ConfirmTransaction} />
        <Stack.Screen name="TransactionResult" component={TransactionResult} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
