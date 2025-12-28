import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VendorListScreen from "@/screens/VendorListScreen";
import VendorMenuScreen from "@/screens/VendorMenuScreen";
import PickupTimeScreen from "@/screens/PickupTimeScreen";
import ConfirmationScreen from "@/screens/ConfirmationScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import HeaderTitle from "@/components/HeaderTitle";

export type OrderStackParamList = {
  VendorList: undefined;
  VendorMenu: undefined;
  PickupTime: undefined;
  Confirmation: undefined;
};

const Stack = createNativeStackNavigator<OrderStackParamList>();

export default function OrderStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="VendorList"
        component={VendorListScreen}
        options={{
          headerTitle: () => <HeaderTitle />,
        }}
      />
      <Stack.Screen
        name="VendorMenu"
        component={VendorMenuScreen}
        options={({ route, navigation }) => ({
          headerTitle: "Menu",
          headerBackTitle: "Back",
        })}
      />
      <Stack.Screen
        name="PickupTime"
        component={PickupTimeScreen}
        options={{
          headerTitle: "Pickup Time",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}
