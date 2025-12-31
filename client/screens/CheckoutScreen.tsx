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
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight,
            paddingBottom: 80 + tabBarHeight,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.vendorHeader, { backgroundColor: Colors.light.primary }]}>
          <ThemedText style={styles.vendorName}>{selectedVendor.name}</ThemedText>
          <View style={styles.vendorLocationRow}>
            <Feather name="map-pin" size={12} color="rgba(255,255,255,0.8)" />
            <ThemedText style={styles.vendorLocation}>{selectedVendor.location}</ThemedText>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.tableHeader}>
            <ThemedText style={[styles.tableHeaderText, { flex: 0.5 }]}>Qty</ThemedText>
            <ThemedText style={[styles.tableHeaderText, { flex: 2 }]}>Item</ThemedText>
            <ThemedText style={[styles.tableHeaderText, { flex: 1, textAlign: "right" }]}>
              Unit Price
            </ThemedText>
          </View>
          {cart.map((item) => (
            <View key={item.menuItem.id} style={styles.tableRow}>
              <ThemedText style={[styles.tableCell, { flex: 0.5 }]}>{item.quantity}</ThemedText>
              <View style={{ flex: 2 }}>
                <ThemedText style={styles.itemName}>{item.menuItem.name}</ThemedText>
                <ThemedText style={[styles.itemDescription, { color: Colors.light.primary }]}>
                  {item.menuItem.description}
                </ThemedText>
              </View>
              <ThemedText style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                ${item.menuItem.price.toFixed(2)}
              </ThemedText>
            </View>
          ))}
        </View>

        <View style={[styles.optionRow, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.optionLeft}>
            <Feather name="shopping-bag" size={18} color={theme.text} />
            <ThemedText style={styles.optionLabel}>Take Out</ThemedText>
          </View>
          <Switch
            value={takeOut}
            onValueChange={setTakeOut}
            trackColor={{ false: theme.border, true: Colors.light.primary }}
            thumbColor={theme.backgroundDefault}
          />
        </View>

        <View style={[styles.optionRow, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.optionLeft}>
            <Feather name="edit-3" size={18} color={theme.text} />
            <ThemedText style={styles.optionLabel}>Cutlery</ThemedText>
          </View>
          <Switch
            value={needsCutlery}
            onValueChange={setNeedsCutlery}
            trackColor={{ false: theme.border, true: Colors.light.primary }}
            thumbColor={theme.backgroundDefault}
          />
        </View>

        <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={styles.sectionTitle}>Order Note</ThemedText>
          <TextInput
            style={[
              styles.noteInput,
              { backgroundColor: theme.backgroundSecondary, color: theme.text },
            ]}
            placeholder="Add special instructions..."
            placeholderTextColor={theme.textSecondary}
            value={orderNote}
            onChangeText={setOrderNote}
            multiline
          />
        </View>

        <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={styles.sectionTitle}>Order Info</ThemedText>
          
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Order Type</ThemedText>
            <View style={styles.infoValue}>
              <ThemedText style={[styles.infoText, { color: Colors.light.primary }]}>
                {takeOut ? "Take Out" : "Dine In / Self-Collect"}
              </ThemedText>
              <Feather name="chevron-right" size={18} color={theme.textSecondary} />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <Pressable style={styles.infoRow} onPress={() => setShowTimeSlots(!showTimeSlots)}>
            <ThemedText style={styles.infoLabel}>Collection Time</ThemedText>
            <View style={styles.infoValue}>
              <ThemedText style={[styles.infoText, { color: Colors.light.primary }]}>
                {pickupTime || "Now"}
              </ThemedText>
              <Feather
                name={showTimeSlots ? "chevron-up" : "chevron-right"}
                size={18}
                color={theme.textSecondary}
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
                          : theme.backgroundSecondary,
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
                      { color: (pickupTime || "Now") === slot ? "#FFFFFF" : theme.text },
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
          { backgroundColor: theme.backgroundDefault, bottom: tabBarHeight },
        ]}
      >
        <Pressable
          onPress={handleSubmitOrder}
          style={({ pressed }) => [
            styles.submitButton,
            { backgroundColor: Colors.light.primary },
            pressed && { backgroundColor: Colors.light.primaryDark },
          ]}
        >
          <ThemedText style={styles.submitButtonText}>Submit Order</ThemedText>
          <ThemedText style={styles.submitButtonPrice}>${cartTotal.toFixed(2)}</ThemedText>
        </Pressable>
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
  },
  vendorName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  vendorLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  vendorLocation: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
  },
  section: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7F8C8D",
    marginBottom: Spacing.md,
  },
  tableHeader: {
    flexDirection: "row",
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: Spacing.md,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#7F8C8D",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: Spacing.sm,
  },
  tableCell: {
    fontSize: 14,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 12,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.md,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  optionLabel: {
    fontSize: 16,
  },
  noteInput: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    minHeight: 60,
    fontSize: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  infoText: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.xs,
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
  },
  timeSlotText: {
    fontSize: 13,
    fontWeight: "500",
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
    zIndex: 100,
    ...Shadows.card,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButtonPrice: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
