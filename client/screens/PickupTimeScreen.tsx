import React, { useState, useMemo } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { generateTimeSlots } from "@/data/mockData";
import { OrderStackParamList } from "@/navigation/OrderStackNavigator";

type NavigationProp = NativeStackNavigationProp<OrderStackParamList, "PickupTime">;

export default function PickupTimeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { selectedVendor, cart, getCartTotal, placeOrder } = useApp();
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const cartTotal = getCartTotal();

  if (!selectedVendor) {
    return (
      <ThemedView style={styles.container} background="root">
        <ThemedText>No vendor selected</ThemedText>
      </ThemedView>
    );
  }

  const handleConfirmOrder = () => {
    if (selectedSlot) {
      placeOrder(selectedSlot);
      navigation.navigate("Confirmation");
    }
  };

  return (
    <ThemedView style={styles.container} background="root">
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: 100 + insets.bottom,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.orderSummary, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.summaryHeader}>
            <ThemedText style={styles.summaryTitle}>Order Summary</ThemedText>
            <ThemedText style={[styles.vendorName, { color: theme.textSecondary }]}>
              {selectedVendor.name}
            </ThemedText>
          </View>
          <View style={styles.summaryItems}>
            {cart.map((item) => (
              <View key={item.menuItem.id} style={styles.summaryItem}>
                <ThemedText style={styles.summaryItemText}>
                  {item.quantity}x {item.menuItem.name}
                </ThemedText>
                <ThemedText style={styles.summaryItemPrice}>
                  ${(item.menuItem.price * item.quantity).toFixed(2)}
                </ThemedText>
              </View>
            ))}
          </View>
          <View style={[styles.summaryTotal, { borderTopColor: theme.border }]}>
            <ThemedText style={styles.totalLabel}>Total</ThemedText>
            <ThemedText style={[styles.totalAmount, { color: Colors.light.primary }]}>
              ${cartTotal.toFixed(2)}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.sectionTitle}>Select Pickup Time</ThemedText>

        <View style={styles.timeSlotsGrid}>
          {timeSlots.map((slot) => (
            <Pressable
              key={slot}
              onPress={() => setSelectedSlot(slot)}
              style={({ pressed }) => [
                styles.timeSlot,
                {
                  backgroundColor: selectedSlot === slot ? Colors.light.primary : theme.backgroundDefault,
                  borderColor: selectedSlot === slot ? Colors.light.primary : theme.border,
                },
                pressed && { opacity: 0.9 },
              ]}
            >
              <Feather
                name="clock"
                size={16}
                color={selectedSlot === slot ? "#FFFFFF" : theme.textSecondary}
              />
              <ThemedText
                style={[
                  styles.timeSlotText,
                  { color: selectedSlot === slot ? "#FFFFFF" : theme.text },
                ]}
              >
                {slot}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: theme.backgroundDefault, paddingBottom: insets.bottom + Spacing.lg }]}>
        <Pressable
          onPress={handleConfirmOrder}
          disabled={!selectedSlot}
          style={({ pressed }) => [
            styles.confirmButton,
            { backgroundColor: selectedSlot ? Colors.light.primary : theme.border },
            pressed && selectedSlot && { backgroundColor: Colors.light.primaryDark },
          ]}
        >
          <Feather name="check-circle" size={20} color="#FFFFFF" />
          <ThemedText style={styles.confirmButtonText}>Confirm Order</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  orderSummary: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  summaryHeader: {
    marginBottom: Spacing.md,
  },
  summaryTitle: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  vendorName: {
    fontSize: 14,
  },
  summaryItems: {
    gap: Spacing.sm,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItemText: {
    fontSize: 14,
  },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: "500",
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
  },
  sectionTitle: {
    ...Typography.h2,
    marginBottom: Spacing.lg,
  },
  timeSlotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  timeSlot: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  timeSlotText: {
    fontSize: 13,
    fontWeight: "500",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    zIndex: 100,
    ...Shadows.card,
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
