import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VendorListScreen from "@/screens/VendorListScreen";
import VendorMenuScreen from "@/screens/VendorMenuScreen";
import CheckoutScreen from "@/screens/CheckoutScreen";
import ConfirmationScreen from "@/screens/ConfirmationScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import HeaderTitle from "@/components/HeaderTitle";

export type OrderStackParamList = {
  VendorList: undefined;
  VendorMenu: undefined;
  Checkout: undefined;
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
        options={{
          headerTitle: "Menu",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          headerTitle: "Your Order",
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
