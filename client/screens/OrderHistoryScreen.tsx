import React, { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { Order } from "@/data/mockData";

export default function OrderHistoryScreen() {
  const { orders } = useApp();
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return Colors.light.primary;
      case "Ready":
        return Colors.light.primary;
      case "Picked Up":
      case "Completed":
        return Colors.light.success;
      default:
        return Colors.light.textSecondary;
    }
  };

  const getStatusBackground = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return Colors.light.primaryLight;
      case "Ready":
        return Colors.light.primaryLight;
      case "Picked Up":
      case "Completed":
        return Colors.light.successLight;
      default:
        return Colors.light.surface2;
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const renderOrder = (order: Order) => {
    const isExpanded = expandedOrder === order.id;

    return (
      <Pressable
        key={order.id}
        onPress={() => toggleExpand(order.id)}
        style={({ pressed }) => [
          styles.orderCard,
          { backgroundColor: Colors.light.surface1 },
          pressed && { backgroundColor: Colors.light.surface2 },
        ]}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderHeaderLeft}>
            <ThemedText style={styles.orderNumber}>
              {order.orderNumber}
            </ThemedText>
            <ThemedText style={styles.orderDate}>
              {formatDate(order.createdAt)}
            </ThemedText>
          </View>
          <View style={styles.orderHeaderRight}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusBackground(order.status) }]}>
              <ThemedText style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {order.status}
              </ThemedText>
            </View>
            <View style={[styles.expandIcon, { backgroundColor: Colors.light.surface2 }]}>
              <Feather
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={16}
                color={Colors.light.textSecondary}
              />
            </View>
          </View>
        </View>

        <View style={styles.orderSummary}>
          <ThemedText style={styles.vendorName}>{order.vendor.name}</ThemedText>
          <ThemedText style={styles.orderTotal}>
            ${order.total.toFixed(2)}
          </ThemedText>
        </View>

        {isExpanded ? (
          <View style={[styles.orderDetails, { borderTopColor: Colors.light.border }]}>
            <View style={styles.detailRow}>
              <Feather name="map-pin" size={14} color={Colors.light.textSecondary} />
              <ThemedText style={styles.detailText}>
                {order.vendor.location}
              </ThemedText>
            </View>
            <View style={styles.detailRow}>
              <Feather name="clock" size={14} color={Colors.light.textSecondary} />
              <ThemedText style={styles.detailText}>
                Pickup: {order.pickupTime}
              </ThemedText>
            </View>
            <View style={styles.detailRow}>
              <Feather name="package" size={14} color={Colors.light.textSecondary} />
              <ThemedText style={styles.detailText}>
                {order.takeOut ? "Take Out" : "Dine In"}
              </ThemedText>
            </View>
            <View style={styles.detailRow}>
              <Feather name="edit-3" size={14} color={Colors.light.textSecondary} />
              <ThemedText style={styles.detailText}>
                {order.needsCutlery ? "Cutlery Included" : "No Cutlery"}
              </ThemedText>
            </View>
            {order.orderNote ? (
              <View style={styles.detailRow}>
                <Feather name="file-text" size={14} color={Colors.light.textSecondary} />
                <ThemedText style={styles.detailText}>
                  Note: {order.orderNote}
                </ThemedText>
              </View>
            ) : null}
            <View style={[styles.itemsList, { backgroundColor: Colors.light.surface2 }]}>
              {order.items.map((item) => (
                <View key={item.menuItem.id} style={styles.itemRow}>
                  <ThemedText style={styles.itemText}>
                    {item.quantity}x {item.menuItem.name}
                  </ThemedText>
                  <ThemedText style={styles.itemPrice}>
                    ${(item.menuItem.price * item.quantity).toFixed(2)}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </Pressable>
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors.light.backgroundRoot }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: tabBarHeight + Spacing.lg,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: Colors.light.surface1 }]}>
              <Feather name="shopping-bag" size={48} color={Colors.light.textSecondary} />
            </View>
            <ThemedText style={styles.emptyTitle}>No Orders Yet</ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              Your order history will appear here
            </ThemedText>
          </View>
        ) : (
          <>
            <ThemedText style={styles.sectionTitle}>Recent Orders</ThemedText>
            {orders.map(renderOrder)}
          </>
        )}
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
  sectionTitle: {
    ...Typography.smallBold,
    color: Colors.light.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.light.white,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
  },
  orderCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  orderNumber: {
    ...Typography.h3,
    color: Colors.light.primary,
    letterSpacing: 1,
  },
  orderDate: {
    ...Typography.small,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    ...Typography.smallBold,
  },
  expandIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  orderSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vendorName: {
    ...Typography.caption,
    color: Colors.light.white,
  },
  orderTotal: {
    ...Typography.bodyBold,
    color: Colors.light.primary,
  },
  orderDetails: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  detailText: {
    ...Typography.small,
    color: Colors.light.textSecondary,
  },
  itemsList: {
    marginTop: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: {
    ...Typography.caption,
    color: Colors.light.white,
  },
  itemPrice: {
    ...Typography.captionBold,
    color: Colors.light.textSecondary,
  },
});
