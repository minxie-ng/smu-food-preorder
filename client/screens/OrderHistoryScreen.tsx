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
        return Colors.light.secondary;
      case "Picked Up":
      case "Completed":
        return Colors.light.success;
      default:
        return theme.textSecondary;
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
          { backgroundColor: theme.backgroundDefault },
          pressed && { opacity: 0.95 },
        ]}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderHeaderLeft}>
            <ThemedText style={[styles.orderNumber, { color: Colors.light.primary }]}>
              {order.orderNumber}
            </ThemedText>
            <ThemedText style={[styles.orderDate, { color: theme.textSecondary }]}>
              {formatDate(order.createdAt)}
            </ThemedText>
          </View>
          <View style={styles.orderHeaderRight}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + "20" }]}>
              <ThemedText style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {order.status}
              </ThemedText>
            </View>
            <Feather
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.textSecondary}
            />
          </View>
        </View>

        <View style={styles.orderSummary}>
          <ThemedText style={styles.vendorName}>{order.vendor.name}</ThemedText>
          <ThemedText style={[styles.orderTotal, { color: Colors.light.primary }]}>
            ${order.total.toFixed(2)}
          </ThemedText>
        </View>

        {isExpanded ? (
          <View style={[styles.orderDetails, { borderTopColor: theme.border }]}>
            <View style={styles.detailRow}>
              <Feather name="map-pin" size={14} color={theme.textSecondary} />
              <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>
                {order.vendor.location}
              </ThemedText>
            </View>
            <View style={styles.detailRow}>
              <Feather name="clock" size={14} color={theme.textSecondary} />
              <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>
                Pickup: {order.pickupTime}
              </ThemedText>
            </View>
            <View style={styles.detailRow}>
              <Feather name="package" size={14} color={theme.textSecondary} />
              <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>
                {order.takeOut ? "Take Out" : "Dine In"}
              </ThemedText>
            </View>
            <View style={styles.detailRow}>
              <Feather name="coffee" size={14} color={theme.textSecondary} />
              <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>
                {order.needsCutlery ? "Cutlery Included" : "No Cutlery"}
              </ThemedText>
            </View>
            {order.orderNote ? (
              <View style={styles.detailRow}>
                <Feather name="file-text" size={14} color={theme.textSecondary} />
                <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>
                  Note: {order.orderNote}
                </ThemedText>
              </View>
            ) : null}
            <View style={styles.itemsList}>
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
    <ThemedView style={styles.container}>
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
            <View style={[styles.emptyIcon, { backgroundColor: theme.backgroundSecondary }]}>
              <Feather name="shopping-bag" size={48} color={theme.textSecondary} />
            </View>
            <ThemedText style={styles.emptyTitle}>No Orders Yet</ThemedText>
            <ThemedText style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              Your order history will appear here
            </ThemedText>
          </View>
        ) : (
          orders.map(renderOrder)
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
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
  },
  orderCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.card,
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
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
  orderDate: {
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  orderSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vendorName: {
    fontSize: 14,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "700",
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
    fontSize: 13,
  },
  itemsList: {
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "500",
  },
});
