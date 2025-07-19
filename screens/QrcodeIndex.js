import QrcodeScreen from "./Qrcode";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ListQrcodes from "./ListQrcodes";
import QRCodeScanner from "./QrcodeScannerScreen";
import AccountScreen from "./AccountScreen";
const Tab = createBottomTabNavigator();
export default function Index({ route }) {
  return (
    <Tab.Navigator
      initialRouteName="New"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Settings"
        component={AccountScreen}
        options={{
          tabBarLabel: "Account",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="New"
        component={QrcodeScreen}
        options={{
          tabBarLabel: "New",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="plus" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Unused"
        component={ListQrcodes}
        options={{
          tabBarLabel: "Unused",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="radioactive"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={QRCodeScanner}
        options={{
          tabBarLabel: "Scan",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="qrcode-scan"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
