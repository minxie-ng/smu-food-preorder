import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";
import OrderStackNavigator from "@/navigation/OrderStackNavigator";
import HistoryStackNavigator from "@/navigation/HistoryStackNavigator";
import { useTheme } from "@/hooks/useTheme";
import { Colors, BorderRadius } from "@/constants/theme";

export type MainTabParamList = {
  OrderTab: undefined;
  HistoryTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="OrderTab"
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Colors.light.surface1,
          borderTopWidth: 1,
          borderTopColor: Colors.light.border,
          elevation: 0,
          height: 60,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={80}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="OrderTab"
        component={OrderStackNavigator}
        options={{
          title: "Order",
          tabBarIcon: ({ color, size }) => (
            <Feather name="shopping-bag" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryStackNavigator}
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Feather name="clock" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
