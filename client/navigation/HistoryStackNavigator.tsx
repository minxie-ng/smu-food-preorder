import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrderHistoryScreen from "@/screens/OrderHistoryScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type HistoryStackParamList = {
  OrderHistory: undefined;
};

const Stack = createNativeStackNavigator<HistoryStackParamList>();

export default function HistoryStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{
          headerTitle: "Order History",
        }}
      />
    </Stack.Navigator>
  );
}
