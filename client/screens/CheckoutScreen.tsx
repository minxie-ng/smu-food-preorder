import React, { useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
  StyleSheet,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { OrderStackParamList } from "@/navigation/OrderStackNavigator";
import { TIME_SLOTS, simulateOrderSubmission } from "@/data/timeSlotAvailability";

type NavigationProp = NativeStackNavigationProp<OrderStackParamList, "Checkout">;

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
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [blockedTime, setBlockedTime] = useState<string | null>(null);
  const [showSlotError, setShowSlotError] = useState(false);
  const [rejectedSlots, setRejectedSlots] = useState<Set<string>>(new Set());

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
    const selectedTime = pickupTime || "Now";
    
    if (rejectedSlots.has(selectedTime)) {
      setBlockedTime(selectedTime);
      setShowUnavailableModal(true);
      return;
    }
    
    const result = simulateOrderSubmission(selectedTime);
    
    if (!result.success && result.errorCode === "SLOT_FULL") {
      setBlockedTime(result.blockedTime || selectedTime);
      setRejectedSlots(prev => new Set([...prev, result.blockedTime || selectedTime]));
      setShowUnavailableModal(true);
      return;
    }
    
    setShowSlotError(false);
    placeOrder();
    navigation.navigate("Confirmation");
  };

  const handleChooseAnotherTime = () => {
    setShowUnavailableModal(false);
    setShowSlotError(true);
    setShowTimeSlots(true);
  };

  const handleBrowseOtherVendors = () => {
    setShowUnavailableModal(false);
    navigation.goBack();
  };

  const handleTimeSlotPress = (slotTime: string, isRejected: boolean) => {
    if (isRejected) return;
    
    setPickupTime(slotTime);
    setShowTimeSlots(false);
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
              <Feather name="shopping-bag" size={20} color={Colors.light.textSecondary} />
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
              <MaterialCommunityIcons name="silverware-fork-knife" size={20} color={Colors.light.textSecondary} />
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

          {showSlotError ? (
            <View style={styles.helperTextContainer}>
              <Feather name="alert-circle" size={14} color={Colors.light.error} />
              <ThemedText style={styles.helperText}>
                That slot just filled up. Pick another time to continue.
              </ThemedText>
            </View>
          ) : null}

          {showTimeSlots ? (
            <View style={styles.timeSlotsContainer}>
              {TIME_SLOTS.map((slot) => {
                const isSelected = (pickupTime || "Now") === slot.time;
                const isRejected = rejectedSlots.has(slot.time);
                
                return (
                  <Pressable
                    key={slot.time}
                    disabled={isRejected}
                    style={[
                      styles.timeSlotChip,
                      isSelected && !isRejected && styles.timeSlotChipSelected,
                      isRejected && styles.timeSlotChipDisabled,
                    ]}
                    onPress={() => handleTimeSlotPress(slot.time, isRejected)}
                  >
                    <ThemedText
                      style={[
                        styles.timeSlotText,
                        isSelected && !isRejected && styles.timeSlotTextSelected,
                        isRejected && styles.timeSlotTextDisabled,
                      ]}
                    >
                      {slot.time}
                    </ThemedText>
                    {isRejected ? (
                      <ThemedText style={styles.unavailableLabel}>Full</ThemedText>
                    ) : null}
                  </Pressable>
                );
              })}
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

      <Modal
        visible={showUnavailableModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUnavailableModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Feather name="clock" size={32} color={Colors.light.error} />
            </View>
            <ThemedText style={styles.modalTitle}>Time slot unavailable</ThemedText>
            <ThemedText style={styles.modalMessage}>
              {blockedTime} is fully booked. Please choose another pickup time.
            </ThemedText>
            <View style={styles.modalActions}>
              <Pressable
                onPress={handleChooseAnotherTime}
                style={({ pressed }) => [
                  styles.modalPrimaryButton,
                  pressed && { backgroundColor: Colors.light.primaryDark },
                ]}
              >
                <ThemedText style={styles.modalPrimaryButtonText}>
                  Choose another time
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={handleBrowseOtherVendors}
                style={({ pressed }) => [
                  styles.modalSecondaryButton,
                  pressed && { backgroundColor: Colors.light.surface2 },
                ]}
              >
                <ThemedText style={styles.modalSecondaryButtonText}>
                  Browse other vendors
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  helperTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.light.errorLight,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
  },
  helperText: {
    ...Typography.small,
    color: Colors.light.error,
    flex: 1,
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
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  timeSlotChipSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  timeSlotChipDisabled: {
    backgroundColor: Colors.light.surface3,
    borderColor: Colors.light.border,
    opacity: 0.6,
  },
  timeSlotText: {
    ...Typography.captionBold,
    color: Colors.light.text,
  },
  timeSlotTextSelected: {
    color: Colors.light.white,
  },
  timeSlotTextDisabled: {
    color: Colors.light.textMuted,
  },
  unavailableLabel: {
    ...Typography.small,
    color: Colors.light.textMuted,
    fontStyle: "italic",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  modalContent: {
    backgroundColor: Colors.light.surface1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.errorLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    ...Typography.h3,
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  modalMessage: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  modalActions: {
    width: "100%",
    gap: Spacing.md,
  },
  modalPrimaryButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  modalPrimaryButtonText: {
    ...Typography.bodyBold,
    color: Colors.light.white,
  },
  modalSecondaryButton: {
    backgroundColor: Colors.light.surface2,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  modalSecondaryButtonText: {
    ...Typography.bodyBold,
    color: Colors.light.textSecondary,
  },
});
