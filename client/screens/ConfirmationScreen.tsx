import React, { useEffect } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { OrderStackParamList } from "@/navigation/OrderStackNavigator";

type NavigationProp = NativeStackNavigationProp<OrderStackParamList, "Confirmation">;

export default function ConfirmationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { currentOrder, clearCurrentOrder } = useApp();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    return () => {
      clearCurrentOrder();
    };
  }, [clearCurrentOrder]);

  if (!currentOrder) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No order found</ThemedText>
      </ThemedView>
    );
  }

  const handleViewHistory = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "VendorList" }],
      })
    );
    navigation.getParent()?.navigate("HistoryTab");
  };

  const handleOrderAgain = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "VendorList" }],
      })
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: Colors.light.success + "20" }]}>
            <Feather name="check" size={48} color={Colors.light.success} />
          </View>
          <ThemedText style={styles.successTitle}>Order Confirmed!</ThemedText>
          <ThemedText style={[styles.successSubtitle, { color: theme.textSecondary }]}>
            Your order has been placed successfully
          </ThemedText>
        </View>

        <View style={[styles.orderNumberCard, { backgroundColor: Colors.light.primary }]}>
          <ThemedText style={styles.orderNumberLabel}>Order Number</ThemedText>
          <ThemedText style={styles.orderNumber}>{currentOrder.orderNumber}</ThemedText>
        </View>

        <View style={[styles.orderDetails, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Feather name="shopping-bag" size={18} color={Colors.light.primary} />
            </View>
            <View style={styles.detailContent}>
              <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
                Vendor
              </ThemedText>
              <ThemedText style={styles.detailValue}>{currentOrder.vendor.name}</ThemedText>
              <ThemedText style={[styles.detailSubvalue, { color: theme.textSecondary }]}>
                {currentOrder.vendor.location}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Feather name="clock" size={18} color={Colors.light.primary} />
            </View>
            <View style={styles.detailContent}>
              <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
                Pickup Time
              </ThemedText>
              <ThemedText style={styles.detailValue}>{currentOrder.pickupTime}</ThemedText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Feather name="list" size={18} color={Colors.light.primary} />
            </View>
            <View style={[styles.detailContent, styles.itemsContent]}>
              <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
                Items
              </ThemedText>
              {currentOrder.items.map((item) => (
                <View key={item.menuItem.id} style={styles.orderItem}>
                  <ThemedText style={styles.orderItemText}>
                    {item.quantity}x {item.menuItem.name}
                  </ThemedText>
                  <ThemedText style={styles.orderItemPrice}>
                    ${(item.menuItem.price * item.quantity).toFixed(2)}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.totalRow, { borderTopColor: theme.border }]}>
            <ThemedText style={styles.totalLabel}>Total</ThemedText>
            <ThemedText style={[styles.totalAmount, { color: Colors.light.primary }]}>
              ${currentOrder.total.toFixed(2)}
            </ThemedText>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Pressable
            onPress={handleViewHistory}
            style={({ pressed }) => [
              styles.secondaryButton,
              { borderColor: Colors.light.primary },
              pressed && { backgroundColor: Colors.light.primary + "10" },
            ]}
          >
            <Feather name="list" size={18} color={Colors.light.primary} />
            <ThemedText style={[styles.secondaryButtonText, { color: Colors.light.primary }]}>
              View in History
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={handleOrderAgain}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: Colors.light.primary },
              pressed && { backgroundColor: Colors.light.primaryDark },
            ]}
          >
            <Feather name="refresh-cw" size={18} color="#FFFFFF" />
            <ThemedText style={styles.primaryButtonText}>Order Again</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
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
  successContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  successTitle: {
    ...Typography.h1,
    marginBottom: Spacing.xs,
  },
  successSubtitle: {
    fontSize: 14,
  },
  orderNumberCard: {
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  orderNumberLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  orderNumber: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 2,
  },
  orderDetails: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  detailRow: {
    flexDirection: "row",
    paddingVertical: Spacing.sm,
  },
  detailIconContainer: {
    width: 36,
    alignItems: "center",
    paddingTop: 2,
  },
  detailContent: {
    flex: 1,
  },
  itemsContent: {
    gap: Spacing.xs,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  detailSubvalue: {
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderItemText: {
    fontSize: 14,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: "500",
  },
  totalRow: {
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
    fontSize: 20,
    fontWeight: "700",
  },
  actionButtons: {
    gap: Spacing.md,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
