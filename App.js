import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Flashpage from "./screens/Flashpage";
import Menu from "./screens/Menu";
import Order from "./screens/Order";
import Createorder from "./screens/Createorder";
import History from "./screens/History";
import Setting from "./screens/Setting";
import Shift from "./screens/Shift";
import Settlement from "./screens/Settlement";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Flash">
        <Stack.Screen
          name="Flash"
          component={Flashpage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }} // Hide header for this screen
        />

        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }} // Hide header for this screen
        />

        <Stack.Screen
          name="Menu"
          component={Menu}
          options={{ headerShown: false }} // Hide header for this screen
        />

        <Stack.Screen
          name="Order"
          component={Order}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="History"
          component={History}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Setting"
          component={Setting}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Shift"
          component={Shift}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Settlement"
          component={Settlement}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Createorder"
          component={Createorder}
          options={{ headerShown: false }} // Hide header for this screen
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
