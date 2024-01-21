import QrcodeScreen from "./Qrcode";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ListQrcodes from "./ListQrcodes";
import QRCodeScanner from "./QrcodeScannerScreen";
const Tab = createBottomTabNavigator();
export default function Index({ route }) {
  return (
    <Tab.Navigator
      initialRouteName="List"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Settings" component={QrcodeScreen} />
      <Tab.Screen name="New" component={QrcodeScreen} />
      <Tab.Screen name="Unused" component={ListQrcodes} />
      <Tab.Screen name="Scan" component={QRCodeScanner} />
    </Tab.Navigator>
  );
}
