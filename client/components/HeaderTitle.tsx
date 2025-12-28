import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

export default function HeaderTitle() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/icon.png")}
        style={styles.icon}
        resizeMode="contain"
      />
      <ThemedText style={styles.title}>Campus Food</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  icon: {
    width: 28,
    height: 28,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
});
