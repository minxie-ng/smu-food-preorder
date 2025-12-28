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
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { vendors, Vendor } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import { OrderStackParamList } from "@/navigation/OrderStackNavigator";

type NavigationProp = NativeStackNavigationProp<OrderStackParamList, "VendorList">;

export default function VendorListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { selectVendor } = useApp();
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

  const handleVendorPress = (vendor: Vendor) => {
    if (!vendor.fullyBooked) {
      selectVendor(vendor);
      navigation.navigate("VendorMenu");
    }
  };

  return (
    <ThemedView style={styles.container} background="root">
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
        {vendors.map((vendor) => (
          <Pressable
            key={vendor.id}
            onPress={() => handleVendorPress(vendor)}
            disabled={vendor.fullyBooked}
            style={({ pressed }) => [
              styles.vendorCard,
              { backgroundColor: theme.backgroundDefault },
              pressed && !vendor.fullyBooked && styles.cardPressed,
              vendor.fullyBooked && styles.cardDisabled,
            ]}
          >
            <View style={styles.vendorInfo}>
              <ThemedText style={styles.vendorName}>{vendor.name}</ThemedText>
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={12} color={theme.textSecondary} />
                <ThemedText style={[styles.vendorLocation, { color: theme.textSecondary }]}>
                  {vendor.location}
                </ThemedText>
              </View>
              <View style={[styles.prepTimeBadge, { backgroundColor: Colors.light.secondary + "20" }]}>
                <Feather name="clock" size={12} color={Colors.light.secondary} />
                <ThemedText style={[styles.prepTimeText, { color: Colors.light.secondary }]}>
                  {vendor.prepTime}
                </ThemedText>
              </View>
            </View>
            <View style={styles.arrowContainer}>
              {vendor.fullyBooked ? (
                <View style={[styles.bookedBadge, { backgroundColor: Colors.light.error + "15" }]}>
                  <ThemedText style={[styles.bookedText, { color: Colors.light.error }]}>
                    Fully Booked
                  </ThemedText>
                </View>
              ) : (
                <Feather name="chevron-right" size={24} color={theme.textSecondary} />
              )}
            </View>
          </Pressable>
        ))}
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
  vendorCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  cardDisabled: {
    opacity: 0.5,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  vendorLocation: {
    fontSize: 12,
  },
  prepTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  prepTimeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  arrowContainer: {
    marginLeft: Spacing.md,
  },
  bookedBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  bookedText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
