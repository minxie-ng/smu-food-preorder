import React from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { MenuItem } from "@/data/mockData";
import { OrderStackParamList } from "@/navigation/OrderStackNavigator";

type NavigationProp = NativeStackNavigationProp<OrderStackParamList, "VendorMenu">;

export default function VendorMenuScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { selectedVendor, addToCart, removeFromCart, getItemQuantity, getCartTotal, getCartItemCount } =
    useApp();
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const cartTotal = getCartTotal();
  const cartItemCount = getCartItemCount();

  if (!selectedVendor) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No vendor selected</ThemedText>
      </ThemedView>
    );
  }

  const handleContinue = () => {
    navigation.navigate("Checkout");
  };

  const renderMenuItem = (item: MenuItem) => {
    const quantity = getItemQuantity(item.id);

    return (
      <View key={item.id} style={[styles.menuItem, { backgroundColor: Colors.light.surface1 }]}>
        <View style={styles.itemInfo}>
          <ThemedText style={styles.itemName}>{item.name}</ThemedText>
          <ThemedText style={styles.itemDescription}>
            {item.description}
          </ThemedText>
          <ThemedText style={styles.itemPrice}>
            ${item.price.toFixed(2)}
          </ThemedText>
        </View>
        <View style={styles.quantityControls}>
          <Pressable
            onPress={() => removeFromCart(item.id)}
            disabled={quantity === 0}
            style={({ pressed }) => [
              styles.quantityButton,
              { 
                backgroundColor: quantity === 0 ? Colors.light.surface2 : Colors.light.surface3,
                borderColor: Colors.light.border,
              },
              quantity === 0 && styles.quantityButtonDisabled,
              pressed && quantity > 0 && { backgroundColor: Colors.light.backgroundElevated },
            ]}
          >
            <Feather 
              name="minus" 
              size={18} 
              color={quantity === 0 ? Colors.light.textMuted : Colors.light.white} 
            />
          </Pressable>
          <View style={styles.quantityDisplay}>
            <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
          </View>
          <Pressable
            onPress={() => addToCart(item)}
            style={({ pressed }) => [
              styles.quantityButton,
              { 
                backgroundColor: Colors.light.primary,
                borderColor: Colors.light.primary,
              },
              pressed && { backgroundColor: Colors.light.primaryDark },
            ]}
          >
            <Feather name="plus" size={18} color={Colors.light.white} />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors.light.backgroundRoot }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: cartItemCount > 0 ? 140 + tabBarHeight : tabBarHeight + Spacing.lg,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.vendorInfoBar, { backgroundColor: Colors.light.surface1 }]}>
          <View style={styles.infoItem}>
            <Feather name="map-pin" size={14} color={Colors.light.textSecondary} />
            <ThemedText style={styles.infoText}>
              {selectedVendor.location}
            </ThemedText>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Feather name="clock" size={14} color={Colors.light.textSecondary} />
            <ThemedText style={styles.infoText}>
              {selectedVendor.prepTime}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.sectionTitle}>Menu</ThemedText>

        {selectedVendor.menuItems.map(renderMenuItem)}
      </ScrollView>

      {cartItemCount > 0 ? (
        <View style={[styles.cartBar, { backgroundColor: Colors.light.surface2, bottom: tabBarHeight }]}>
          <View style={styles.cartSummary}>
            <View style={styles.cartInfo}>
              <View style={[styles.cartBadge, { backgroundColor: Colors.light.primary }]}>
                <ThemedText style={styles.cartBadgeText}>{cartItemCount}</ThemedText>
              </View>
              <ThemedText style={styles.cartLabel}>
                {cartItemCount === 1 ? "item" : "items"} in cart
              </ThemedText>
            </View>
            <ThemedText style={styles.cartTotal}>${cartTotal.toFixed(2)}</ThemedText>
          </View>
          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.continueButton,
              { backgroundColor: Colors.light.primary },
              pressed && { backgroundColor: Colors.light.primaryDark },
            ]}
          >
            <ThemedText style={styles.continueButtonText}>Continue to Checkout</ThemedText>
            <Feather name="arrow-right" size={20} color={Colors.light.white} />
          </Pressable>
        </View>
      ) : null}
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
  vendorInfoBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  infoDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.light.border,
    marginHorizontal: Spacing.lg,
  },
  infoText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.light.white,
    marginBottom: Spacing.lg,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  itemInfo: {
    flex: 1,
    marginRight: Spacing.lg,
  },
  itemName: {
    ...Typography.bodyBold,
    color: Colors.light.white,
    marginBottom: Spacing.xs,
  },
  itemDescription: {
    ...Typography.small,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  itemPrice: {
    ...Typography.bodyBold,
    color: Colors.light.primary,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  quantityButton: {
    width: Spacing.minTouchTarget,
    height: Spacing.minTouchTarget,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonDisabled: {
    opacity: 0.6,
  },
  quantityDisplay: {
    minWidth: 32,
    alignItems: "center",
  },
  quantityText: {
    ...Typography.bodyBold,
    color: Colors.light.white,
  },
  cartBar: {
    position: "absolute",
    left: 0,
    right: 0,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    ...Shadows.elevated,
  },
  cartSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  cartInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  cartBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    ...Typography.smallBold,
    color: Colors.light.white,
  },
  cartLabel: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
  },
  cartTotal: {
    ...Typography.h3,
    color: Colors.light.white,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  continueButtonText: {
    ...Typography.bodyBold,
    color: Colors.light.white,
  },
});
