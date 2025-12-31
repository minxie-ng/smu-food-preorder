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
      <View key={item.id} style={[styles.menuItem, { backgroundColor: theme.backgroundDefault }]}>
        <View style={styles.itemInfo}>
          <ThemedText style={styles.itemName}>{item.name}</ThemedText>
          <ThemedText style={[styles.itemDescription, { color: theme.textSecondary }]}>
            {item.description}
          </ThemedText>
          <ThemedText style={[styles.itemPrice, { color: Colors.light.primary }]}>
            ${item.price.toFixed(2)}
          </ThemedText>
        </View>
        <View style={styles.quantityControls}>
          <Pressable
            onPress={() => removeFromCart(item.id)}
            disabled={quantity === 0}
            style={({ pressed }) => [
              styles.quantityButton,
              { borderColor: theme.border },
              quantity === 0 && styles.quantityButtonDisabled,
              pressed && quantity > 0 && { backgroundColor: theme.backgroundSecondary },
            ]}
          >
            <Feather name="minus" size={16} color={quantity === 0 ? theme.border : theme.text} />
          </Pressable>
          <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
          <Pressable
            onPress={() => addToCart(item)}
            style={({ pressed }) => [
              styles.quantityButton,
              { borderColor: theme.border },
              pressed && { backgroundColor: theme.backgroundSecondary },
            ]}
          >
            <Feather name="plus" size={16} color={theme.text} />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: cartItemCount > 0 ? 120 + tabBarHeight : tabBarHeight + Spacing.lg,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.vendorInfoBar, { backgroundColor: theme.backgroundSecondary }]}>
          <View style={styles.infoItem}>
            <Feather name="map-pin" size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
              {selectedVendor.location}
            </ThemedText>
          </View>
          <View style={styles.infoItem}>
            <Feather name="clock" size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
              {selectedVendor.prepTime}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.menuTitle}>Menu</ThemedText>

        {selectedVendor.menuItems.map(renderMenuItem)}
      </ScrollView>

      {cartItemCount > 0 ? (
        <View style={[styles.cartBar, { backgroundColor: theme.backgroundDefault, bottom: tabBarHeight }]}>
          <View style={styles.cartSummary}>
            <ThemedText style={styles.cartItemCount}>
              {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
            </ThemedText>
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
            <Feather name="arrow-right" size={18} color="#FFFFFF" />
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
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xl,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  infoText: {
    fontSize: 13,
  },
  menuTitle: {
    ...Typography.h2,
    marginBottom: Spacing.lg,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  itemInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  itemDescription: {
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonDisabled: {
    opacity: 0.4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    minWidth: 24,
    textAlign: "center",
  },
  cartBar: {
    position: "absolute",
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
    zIndex: 100,
    ...Shadows.card,
  },
  cartSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  cartItemCount: {
    fontSize: 14,
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: "700",
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
