import React, { useState, useMemo } from "react";
import { View, ScrollView, Pressable, StyleSheet, Switch, TextInput } from "react-native";
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
import { generateTimeSlots } from "@/data/mockData";
import { OrderStackParamList } from "@/navigation/OrderStackNavigator";

type NavigationProp = NativeStackNavigationProp<OrderStackParamList, "Checkout">;

export default function CheckoutScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    selectedVendor,
    cart,
    getCartTotal,
    needsCutlery,
    setNeedsCutlery,
    orderNote,
    setOrderNote,
    takeOut,
    setTakeOut,
    pickupTime,
    setPickupTime,
    placeOrder,
  } = useApp();
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const cartTotal = getCartTotal();

  if (!selectedVendor) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No vendor selected</ThemedText>
      </ThemedView>
    );
  }

  const handleSubmitOrder = () => {
    placeOrder();
    navigation.navigate("Confirmation");
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors.light.backgroundRoot }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight,
            paddingBottom: 100 + tabBarHeight,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.vendorHeader, { backgroundColor: Colors.light.surface1 }]}>
          <ThemedText style={styles.vendorName}>{selectedVendor.name}</ThemedText>
          <View style={styles.vendorLocationRow}>
            <Feather name="map-pin" size={12} color={Colors.light.textSecondary} />
            <ThemedText style={styles.vendorLocation}>{selectedVendor.location}</ThemedText>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: Colors.light.surface1 }]}>
          <ThemedText style={styles.sectionTitle}>Order Summary</ThemedText>
          <View style={styles.tableHeader}>
            <ThemedText style={[styles.tableHeaderText, { flex: 0.5 }]}>Qty</ThemedText>
            <ThemedText style={[styles.tableHeaderText, { flex: 2 }]}>Item</ThemedText>
            <ThemedText style={[styles.tableHeaderText, { flex: 1, textAlign: "right" }]}>
              Price
            </ThemedText>
          </View>
          {cart.map((item) => (
            <View key={item.menuItem.id} style={styles.tableRow}>
              <View style={[styles.qtyBadge, { backgroundColor: Colors.light.primaryLight }]}>
                <ThemedText style={styles.qtyText}>{item.quantity}</ThemedText>
              </View>
              <View style={{ flex: 2 }}>
                <ThemedText style={styles.itemName}>{item.menuItem.name}</ThemedText>
              </View>
              <ThemedText style={styles.itemPrice}>
                ${(item.menuItem.price * item.quantity).toFixed(2)}
              </ThemedText>
            </View>
          ))}
          <View style={styles.subtotalRow}>
            <ThemedText style={styles.subtotalLabel}>Subtotal</ThemedText>
            <ThemedText style={styles.subtotalValue}>${cartTotal.toFixed(2)}</ThemedText>
          </View>
        </View>

        <View style={[styles.toggleSection, { backgroundColor: Colors.light.surface1 }]}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <View style={[styles.toggleIcon, { backgroundColor: Colors.light.primaryLight }]}>
                <Feather name="shopping-bag" size={18} color={Colors.light.primary} />
              </View>
              <ThemedText style={styles.toggleLabel}>Take Out</ThemedText>
            </View>
            <Switch
              value={takeOut}
              onValueChange={setTakeOut}
              trackColor={{ false: Colors.light.surface3, true: Colors.light.primary }}
              thumbColor={Colors.light.white}
            />
          </View>
          <View style={[styles.toggleDivider, { backgroundColor: Colors.light.border }]} />
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <View style={[styles.toggleIcon, { backgroundColor: Colors.light.primaryLight }]}>
                <Feather name="edit-3" size={18} color={Colors.light.primary} />
              </View>
              <ThemedText style={styles.toggleLabel}>Cutlery</ThemedText>
            </View>
            <Switch
              value={needsCutlery}
              onValueChange={setNeedsCutlery}
              trackColor={{ false: Colors.light.surface3, true: Colors.light.primary }}
              thumbColor={Colors.light.white}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: Colors.light.surface1 }]}>
          <ThemedText style={styles.sectionTitle}>Order Note</ThemedText>
          <TextInput
            style={styles.noteInput}
            placeholder="Add special instructions..."
            placeholderTextColor={Colors.light.textMuted}
            value={orderNote}
            onChangeText={setOrderNote}
            multiline
          />
        </View>

        <View style={[styles.section, { backgroundColor: Colors.light.surface1 }]}>
          <ThemedText style={styles.sectionTitle}>Collection Details</ThemedText>
          
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Order Type</ThemedText>
            <View style={styles.infoValue}>
              <ThemedText style={styles.infoText}>
                {takeOut ? "Take Out" : "Dine In / Self-Collect"}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: Colors.light.border }]} />

          <Pressable style={styles.infoRow} onPress={() => setShowTimeSlots(!showTimeSlots)}>
            <ThemedText style={styles.infoLabel}>Collection Time</ThemedText>
            <View style={styles.infoValue}>
              <ThemedText style={styles.infoTextAccent}>
                {pickupTime || "Now"}
              </ThemedText>
              <Feather
                name={showTimeSlots ? "chevron-up" : "chevron-down"}
                size={18}
                color={Colors.light.primary}
              />
            </View>
          </Pressable>

          {showTimeSlots ? (
            <View style={styles.timeSlotsContainer}>
              {timeSlots.map((slot) => (
                <Pressable
                  key={slot}
                  style={({ pressed }) => [
                    styles.timeSlotChip,
                    {
                      backgroundColor:
                        (pickupTime || "Now") === slot
                          ? Colors.light.primary
                          : Colors.light.surface2,
                      borderColor:
                        (pickupTime || "Now") === slot
                          ? Colors.light.primary
                          : Colors.light.border,
                    },
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => {
                    setPickupTime(slot);
                    setShowTimeSlots(false);
                  }}
                >
                  <ThemedText
                    style={[
                      styles.timeSlotText,
                      { color: (pickupTime || "Now") === slot ? Colors.light.white : Colors.light.text },
                    ]}
                  >
                    {slot}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { backgroundColor: Colors.light.surface2, bottom: tabBarHeight },
        ]}
      >
        <View style={styles.bottomBarContent}>
          <View style={styles.totalContainer}>
            <ThemedText style={styles.totalLabel}>Total</ThemedText>
            <ThemedText style={styles.totalAmount}>${cartTotal.toFixed(2)}</ThemedText>
          </View>
          <Pressable
            onPress={handleSubmitOrder}
            style={({ pressed }) => [
              styles.submitButton,
              { backgroundColor: Colors.light.primary },
              pressed && { backgroundColor: Colors.light.primaryDark },
            ]}
          >
            <ThemedText style={styles.submitButtonText}>Submit Order</ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.lg,
  },
  vendorHeader: {
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  vendorName: {
    ...Typography.h3,
    color: Colors.light.white,
    marginBottom: Spacing.xs,
  },
  vendorLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  vendorLocation: {
    ...Typography.small,
    color: Colors.light.textSecondary,
  },
  section: {
    marginTop: Spacing.md,
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sectionTitle: {
    ...Typography.smallBold,
    color: Colors.light.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    marginBottom: Spacing.md,
  },
  tableHeaderText: {
    ...Typography.small,
    color: Colors.light.textMuted,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  qtyBadge: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  qtyText: {
    ...Typography.captionBold,
    color: Colors.light.primary,
  },
  itemName: {
    ...Typography.caption,
    color: Colors.light.white,
  },
  itemPrice: {
    ...Typography.captionBold,
    color: Colors.light.white,
    flex: 1,
    textAlign: "right",
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  subtotalLabel: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
  },
  subtotalValue: {
    ...Typography.bodyBold,
    color: Colors.light.primary,
  },
  toggleSection: {
    marginTop: Spacing.md,
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: Spacing.minTouchTarget,
  },
  toggleDivider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  toggleIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleLabel: {
    ...Typography.body,
    color: Colors.light.white,
  },
  noteInput: {
    backgroundColor: Colors.light.surface2,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    minHeight: 80,
    ...Typography.caption,
    color: Colors.light.white,
    textAlignVertical: "top",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: Spacing.minTouchTarget,
  },
  infoLabel: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
  },
  infoValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  infoText: {
    ...Typography.caption,
    color: Colors.light.white,
  },
  infoTextAccent: {
    ...Typography.captionBold,
    color: Colors.light.primary,
  },
  divider: {
    height: 1,
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  timeSlotChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  timeSlotText: {
    ...Typography.small,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    ...Shadows.elevated,
  },
  bottomBarContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    ...Typography.small,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  totalAmount: {
    ...Typography.h2,
    color: Colors.light.white,
  },
  submitButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.md,
  },
  submitButtonText: {
    ...Typography.bodyBold,
    color: Colors.light.white,
  },
});
