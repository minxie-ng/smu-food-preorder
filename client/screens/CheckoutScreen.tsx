import React, { useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { OrderStackParamList } from "@/navigation/OrderStackNavigator";

type NavigationProp = NativeStackNavigationProp<OrderStackParamList, "Checkout">;

const timeSlots = ["Now", "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM", "1:00 PM"];

export default function CheckoutScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { 
    selectedVendor, 
    cart, 
    placeOrder,
    needsCutlery,
    setNeedsCutlery,
    takeOut,
    setTakeOut,
    orderNote,
    setOrderNote,
    pickupTime,
    setPickupTime,
  } = useApp();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

  const [showTimeSlots, setShowTimeSlots] = useState(false);

  if (!selectedVendor || cart.length === 0) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: Colors.light.background }]}>
        <ThemedText style={{ color: Colors.light.text }}>No items in cart</ThemedText>
      </ThemedView>
    );
  }

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const handleSubmitOrder = () => {
    placeOrder();
    navigation.navigate("Confirmation");
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors.light.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: 120 + tabBarHeight,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.vendorHeader}>
          <ThemedText style={styles.vendorName}>{selectedVendor.name}</ThemedText>
          <View style={styles.vendorLocationRow}>
            <Feather name="map-pin" size={12} color={Colors.light.textSecondary} />
            <ThemedText style={styles.vendorLocation}>
              {selectedVendor.location}
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Order Summary</ThemedText>
          <View style={styles.tableHeader}>
            <ThemedText style={[styles.tableHeaderText, { width: 36 }]}>Qty</ThemedText>
            <ThemedText style={[styles.tableHeaderText, { flex: 1, marginLeft: Spacing.md }]}>Item</ThemedText>
            <ThemedText style={[styles.tableHeaderText, { textAlign: "right" }]}>Price</ThemedText>
          </View>
          {cart.map((item) => (
            <View key={item.menuItem.id} style={styles.tableRow}>
              <View style={styles.qtyBadge}>
                <ThemedText style={styles.qtyText}>{item.quantity}</ThemedText>
              </View>
              <ThemedText style={styles.itemName}>{item.menuItem.name}</ThemedText>
              <ThemedText style={styles.itemPrice}>
                ${(item.menuItem.price * item.quantity).toFixed(2)}
              </ThemedText>
            </View>
          ))}
          <View style={styles.totalRow}>
            <ThemedText style={styles.totalLabel}>Total</ThemedText>
            <ThemedText style={styles.totalValue}>${cartTotal.toFixed(2)}</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Options</ThemedText>
          
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Feather name="package" size={20} color={Colors.light.textSecondary} />
              <ThemedText style={styles.toggleLabel}>Take Out</ThemedText>
            </View>
            <Switch
              value={takeOut}
              onValueChange={setTakeOut}
              trackColor={{ false: Colors.light.surface3, true: Colors.light.primary }}
              thumbColor={Colors.light.white}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Feather name="edit-3" size={20} color={Colors.light.textSecondary} />
              <ThemedText style={styles.toggleLabel}>Include Cutlery</ThemedText>
            </View>
            <Switch
              value={needsCutlery}
              onValueChange={setNeedsCutlery}
              trackColor={{ false: Colors.light.surface3, true: Colors.light.primary }}
              thumbColor={Colors.light.white}
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Order Notes</ThemedText>
          <TextInput
            style={styles.notesInput}
            placeholder="Add special instructions..."
            placeholderTextColor={Colors.light.textMuted}
            value={orderNote}
            onChangeText={setOrderNote}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Collection Details</ThemedText>
          <Pressable
            onPress={() => setShowTimeSlots(!showTimeSlots)}
            style={styles.timePickerButton}
          >
            <View style={styles.timePickerContent}>
              <Feather name="clock" size={20} color={Colors.light.textSecondary} />
              <View style={styles.timePickerText}>
                <ThemedText style={styles.timePickerLabel}>Pickup Time</ThemedText>
                <ThemedText style={styles.timePickerValue}>
                  {pickupTime || "Now"}
                </ThemedText>
              </View>
            </View>
            <Feather 
              name={showTimeSlots ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={Colors.light.textSecondary} 
            />
          </Pressable>

          {showTimeSlots ? (
            <View style={styles.timeSlotsContainer}>
              {timeSlots.map((slot) => (
                <Pressable
                  key={slot}
                  style={[
                    styles.timeSlotChip,
                    (pickupTime || "Now") === slot && styles.timeSlotChipSelected,
                  ]}
                  onPress={() => {
                    setPickupTime(slot);
                    setShowTimeSlots(false);
                  }}
                >
                  <ThemedText
                    style={[
                      styles.timeSlotText,
                      (pickupTime || "Now") === slot && styles.timeSlotTextSelected,
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

      <View style={[styles.bottomBar, { bottom: tabBarHeight }]}>
        <View style={styles.bottomBarContent}>
          <View style={styles.totalContainer}>
            <ThemedText style={styles.bottomTotalLabel}>Total</ThemedText>
            <ThemedText style={styles.bottomTotalAmount}>${cartTotal.toFixed(2)}</ThemedText>
          </View>
          <Pressable
            onPress={handleSubmitOrder}
            style={({ pressed }) => [
              styles.submitButton,
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
    backgroundColor: Colors.light.surface1,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.lg,
  },
  vendorName: {
    ...Typography.h3,
    color: Colors.light.text,
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
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.light.surface1,
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
    backgroundColor: Colors.light.surface2,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    ...Typography.captionBold,
    color: Colors.light.text,
  },
  itemName: {
    ...Typography.caption,
    color: Colors.light.text,
    flex: 1,
    marginLeft: Spacing.md,
  },
  itemPrice: {
    ...Typography.captionBold,
    color: Colors.light.text,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.md,
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  totalLabel: {
    ...Typography.bodyBold,
    color: Colors.light.text,
  },
  totalValue: {
    ...Typography.h3,
    color: Colors.light.primary,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  toggleInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  toggleLabel: {
    ...Typography.body,
    color: Colors.light.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: Spacing.sm,
  },
  notesInput: {
    backgroundColor: Colors.light.surface2,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    color: Colors.light.text,
    ...Typography.caption,
    minHeight: 80,
    textAlignVertical: "top",
  },
  timePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  timePickerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  timePickerText: {
    gap: 2,
  },
  timePickerLabel: {
    ...Typography.small,
    color: Colors.light.textSecondary,
  },
  timePickerValue: {
    ...Typography.bodyBold,
    color: Colors.light.text,
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  timeSlotChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface2,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  timeSlotChipSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  timeSlotText: {
    ...Typography.captionBold,
    color: Colors.light.text,
  },
  timeSlotTextSelected: {
    color: Colors.light.white,
  },
  bottomBar: {
    position: "absolute",
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.light.navy,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.elevated,
  },
  bottomBarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalContainer: {
    gap: 2,
  },
  bottomTotalLabel: {
    ...Typography.small,
    color: Colors.light.white,
    opacity: 0.8,
  },
  bottomTotalAmount: {
    ...Typography.h3,
    color: Colors.light.white,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.sm,
  },
  submitButtonText: {
    ...Typography.bodyBold,
    color: Colors.light.white,
  },
});
