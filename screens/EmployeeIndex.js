import EmployeeScreen from "./Emplyee";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ListEmployees from "./ListEmployees";
const Tab = createBottomTabNavigator();
export default function Index({ route }) {
  console.log("Routes params", route);
  return (
    <Tab.Navigator
      initialRouteName="List"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Profile" component={EmployeeScreen} />
      <Tab.Screen name="Settings" component={EmployeeScreen} />
      <Tab.Screen name="New" component={EmployeeScreen} />
      <Tab.Screen
        name="List"
        component={ListEmployees}
        // options={{
        //   tabBarIcon: ({ focused }) => (
        //     <Image
        //       source={
        //         focused
        //           ? require("../../assets/img/homeProfile.png")
        //           : require("../../assets/img/profileFill.png")
        //       }
        //       resizeMode={"contain"}
        //       style={{
        //         height: 25,
        //         width: 25,
        //         marginTop: 7,
        //       }}
        //     />
        //   ),
        // }}
      />
    </Tab.Navigator>
  );
}
