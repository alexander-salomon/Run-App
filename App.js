import { StyleSheet, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import UserData from "./screens/UserData";
import RunData from "./screens/RunData";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
        <Stack.Screen name="UserData" component={UserData}></Stack.Screen>
        <Stack.Screen name="RunData" component={RunData}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FF7B44",
  },
};

const styles = StyleSheet.create({});
