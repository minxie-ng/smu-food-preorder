import React, { useEffect } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { OrderStackParamList } from "@/navigation/OrderStackNavigator";

type NavigationProp = NativeStackNavigationProp<OrderStackParamList, "Confirmation">;

export default function ConfirmationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { currentOrder, clearCurrentOrder } = useApp();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    return () => {
      clearCurrentOrder();
    };
  }, [clearCurrentOrder]);

  if (!currentOrder) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: Colors.light.navy }]}>
        <ThemedText style={{ color: Colors.light.white }}>No order found</ThemedText>
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
    <ThemedView style={[styles.container, { backgroundColor: Colors.light.navy }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing["3xl"],
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Feather name="check" size={48} color={Colors.light.white} />
          </View>
          <ThemedText style={styles.successTitle}>Order Confirmed!</ThemedText>
          <ThemedText style={styles.successSubtitle}>
            Show this number when collecting your order
          </ThemedText>
        </View>

        <View style={styles.orderNumberCard}>
          <ThemedText style={styles.orderNumberLabel}>Your Order Number</ThemedText>
          <ThemedText style={styles.orderNumber}>{currentOrder.orderNumber}</ThemedText>
          <ThemedText style={styles.collectionNote}>
            Please show this to the staff when collecting
          </ThemedText>
        </View>

        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Feather name="shopping-bag" size={16} color={Colors.light.textSecondary} />
            </View>
            <View style={styles.detailContent}>
              <ThemedText style={styles.detailLabel}>Vendor</ThemedText>
              <ThemedText style={styles.detailValue}>{currentOrder.vendor.name}</ThemedText>
              <ThemedText style={styles.detailSubvalue}>
                {currentOrder.vendor.location}
              </ThemedText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Feather name="clock" size={16} color={Colors.light.textSecondary} />
            </View>
            <View style={styles.detailContent}>
              <ThemedText style={styles.detailLabel}>Collection Time</ThemedText>
              <ThemedText style={styles.detailValue}>{currentOrder.pickupTime}</ThemedText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Feather name="package" size={16} color={Colors.light.textSecondary} />
            </View>
            <View style={styles.detailContent}>
              <ThemedText style={styles.detailLabel}>Order Type</ThemedText>
              <ThemedText style={styles.detailValue}>
                {currentOrder.takeOut ? "Take Out" : "Dine In / Self-Collect"}
              </ThemedText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Feather name="edit-3" size={16} color={Colors.light.textSecondary} />
            </View>
            <View style={styles.detailContent}>
              <ThemedText style={styles.detailLabel}>Cutlery</ThemedText>
              <ThemedText style={styles.detailValue}>
                {currentOrder.needsCutlery ? "Cutlery Included" : "No Cutlery"}
              </ThemedText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Feather name="list" size={16} color={Colors.light.textSecondary} />
            </View>
            <View style={[styles.detailContent, styles.itemsContent]}>
              <ThemedText style={styles.detailLabel}>Items</ThemedText>
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

          {currentOrder.orderNote ? (
            <>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Feather name="file-text" size={16} color={Colors.light.textSecondary} />
                </View>
                <View style={styles.detailContent}>
                  <ThemedText style={styles.detailLabel}>Order Note</ThemedText>
                  <ThemedText style={styles.detailValue}>{currentOrder.orderNote}</ThemedText>
                </View>
              </View>
            </>
          ) : null}

          <View style={styles.totalRow}>
            <ThemedText style={styles.totalLabel}>Total</ThemedText>
            <ThemedText style={styles.totalAmount}>
              ${currentOrder.total.toFixed(2)}
            </ThemedText>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Pressable
            onPress={handleViewHistory}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && { backgroundColor: Colors.light.navyLight },
            ]}
          >
            <Feather name="list" size={18} color={Colors.light.white} />
            <ThemedText style={styles.secondaryButtonText}>
              View in History
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={handleOrderAgain}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && { backgroundColor: Colors.light.primaryDark },
            ]}
          >
            <Feather name="refresh-cw" size={18} color={Colors.light.white} />
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
    backgroundColor: Colors.light.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  successTitle: {
    ...Typography.h1,
    color: Colors.light.white,
    marginBottom: Spacing.xs,
  },
  successSubtitle: {
    ...Typography.caption,
    color: Colors.light.white,
    opacity: 0.7,
    textAlign: "center",
  },
  orderNumberCard: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    alignItems: "center",
    ...Shadows.elevated,
  },
  orderNumberLabel: {
    ...Typography.small,
    color: Colors.light.white,
    opacity: 0.8,
    marginBottom: Spacing.sm,
  },
  orderNumber: {
    fontSize: 44,
    fontWeight: "700",
    color: Colors.light.white,
    letterSpacing: 4,
    marginBottom: Spacing.sm,
  },
  collectionNote: {
    ...Typography.small,
    color: Colors.light.white,
    opacity: 0.7,
    textAlign: "center",
  },
  orderDetails: {
    backgroundColor: Colors.light.surface1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  detailRow: {
    flexDirection: "row",
    paddingVertical: Spacing.sm,
  },
  detailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.light.surface2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  detailContent: {
    flex: 1,
    justifyContent: "center",
  },
  itemsContent: {
    gap: Spacing.xs,
  },
  detailLabel: {
    ...Typography.small,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    ...Typography.bodyBold,
    color: Colors.light.text,
  },
  detailSubvalue: {
    ...Typography.small,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: Spacing.sm,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderItemText: {
    ...Typography.caption,
    color: Colors.light.text,
  },
  orderItemPrice: {
    ...Typography.captionBold,
    color: Colors.light.textSecondary,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  totalLabel: {
    ...Typography.bodyBold,
    color: Colors.light.text,
  },
  totalAmount: {
    ...Typography.h2,
    color: Colors.light.primary,
  },
  actionButtons: {
    gap: Spacing.md,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.primary,
    gap: Spacing.sm,
  },
  primaryButtonText: {
    ...Typography.bodyBold,
    color: Colors.light.white,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    gap: Spacing.sm,
  },
  secondaryButtonText: {
    ...Typography.bodyBold,
    color: Colors.light.white,
  },
});
