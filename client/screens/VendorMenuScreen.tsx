import React from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";
import { MenuItem } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import { OrderStackParamList } from "@/navigation/OrderStackNavigator";

type NavigationProp = NativeStackNavigationProp<OrderStackParamList, "VendorMenu">;

export default function VendorMenuScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    selectedVendor,
    cart,
    addToCart,
    removeFromCart,
    getItemQuantity,
  } = useApp();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

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

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const renderMenuItem = (item: MenuItem) => {
    const quantity = getItemQuantity(item.id);

    return (
      <View key={item.id} style={styles.menuItem}>
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
              styles.minusButton,
              quantity === 0 && styles.quantityButtonDisabled,
              pressed && quantity > 0 && { backgroundColor: Colors.light.borderDark },
            ]}
          >
            <Feather 
              name="minus" 
              size={18} 
              color={quantity === 0 ? Colors.light.textMuted : Colors.light.text} 
            />
          </Pressable>
          <View style={styles.quantityDisplay}>
            <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
          </View>
          <Pressable
            onPress={() => addToCart(item)}
            style={({ pressed }) => [
              styles.quantityButton,
              styles.plusButton,
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
    <ThemedView style={[styles.container, { backgroundColor: Colors.light.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: cartItemCount > 0 ? 140 + tabBarHeight : tabBarHeight + Spacing.xl,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.vendorInfoBar}>
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

        <View style={styles.menuList}>
          {selectedVendor.menuItems.map(renderMenuItem)}
        </View>
      </ScrollView>

      {cartItemCount > 0 ? (
        <View style={[styles.cartBar, { bottom: tabBarHeight }]}>
          <View style={styles.cartInfo}>
            <View style={styles.cartBadge}>
              <ThemedText style={styles.cartBadgeText}>{cartItemCount}</ThemedText>
            </View>
            <View style={styles.cartDetails}>
              <ThemedText style={styles.cartLabel}>Your Order</ThemedText>
              <ThemedText style={styles.cartTotal}>${cartTotal.toFixed(2)}</ThemedText>
            </View>
          </View>
          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.continueButton,
              pressed && { backgroundColor: Colors.light.primaryDark },
            ]}
          >
            <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
            <Feather name="arrow-right" size={18} color={Colors.light.white} />
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
    paddingBottom: Spacing.xl,
  },
  vendorInfoBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.light.surface1,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  infoText: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
  },
  infoDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.light.border,
    marginHorizontal: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.smallBold,
    color: Colors.light.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: Spacing.lg,
  },
  menuList: {
    gap: Spacing.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    backgroundColor: Colors.light.surface1,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.card,
  },
  itemInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  itemName: {
    ...Typography.bodyBold,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  itemDescription: {
    ...Typography.small,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
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
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  minusButton: {
    backgroundColor: Colors.light.surface2,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  plusButton: {
    backgroundColor: Colors.light.primary,
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityDisplay: {
    width: 32,
    alignItems: "center",
  },
  quantityText: {
    ...Typography.bodyBold,
    color: Colors.light.text,
  },
  cartBar: {
    position: "absolute",
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.light.navy,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...Shadows.elevated,
  },
  cartInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  cartBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    ...Typography.smallBold,
    color: Colors.light.white,
  },
  cartDetails: {
    gap: 2,
  },
  cartLabel: {
    ...Typography.small,
    color: Colors.light.white,
    opacity: 0.8,
  },
  cartTotal: {
    ...Typography.bodyBold,
    color: Colors.light.white,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  continueButtonText: {
    ...Typography.captionBold,
    color: Colors.light.white,
  },
});
