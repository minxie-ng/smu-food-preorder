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
import { vendors, Vendor } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import { OrderStackParamList } from "@/navigation/OrderStackNavigator";

type NavigationProp = NativeStackNavigationProp<OrderStackParamList, "VendorList">;

export default function VendorListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { selectVendor } = useApp();
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
    <ThemedView style={[styles.container, { backgroundColor: Colors.light.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.sectionTitle}>Available Vendors</ThemedText>
        
        {vendors.map((vendor) => (
          <Pressable
            key={vendor.id}
            onPress={() => handleVendorPress(vendor)}
            disabled={vendor.fullyBooked}
            style={({ pressed }) => [
              styles.vendorCard,
              pressed && !vendor.fullyBooked && styles.cardPressed,
              vendor.fullyBooked && styles.cardDisabled,
            ]}
          >
            <View style={styles.vendorInfo}>
              <ThemedText style={styles.vendorName}>{vendor.name}</ThemedText>
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={12} color={Colors.light.textSecondary} />
                <ThemedText style={styles.vendorLocation}>
                  {vendor.location}
                </ThemedText>
              </View>
              <View style={styles.prepTimeBadge}>
                <Feather name="clock" size={12} color={Colors.light.textSecondary} />
                <ThemedText style={styles.prepTimeText}>
                  {vendor.prepTime}
                </ThemedText>
              </View>
            </View>
            <View style={styles.arrowContainer}>
              {vendor.fullyBooked ? (
                <View style={styles.bookedBadge}>
                  <ThemedText style={styles.bookedText}>
                    Fully Booked
                  </ThemedText>
                </View>
              ) : (
                <View style={styles.arrowCircle}>
                  <Feather name="chevron-right" size={20} color={Colors.light.textSecondary} />
                </View>
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
  sectionTitle: {
    ...Typography.smallBold,
    color: Colors.light.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: Spacing.lg,
  },
  vendorCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.light.surface1,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.card,
  },
  cardPressed: {
    backgroundColor: Colors.light.surface2,
    transform: [{ scale: 0.98 }],
  },
  cardDisabled: {
    opacity: 0.5,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    ...Typography.h3,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  vendorLocation: {
    ...Typography.small,
    color: Colors.light.textSecondary,
  },
  prepTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface2,
  },
  prepTimeText: {
    ...Typography.smallBold,
    color: Colors.light.textSecondary,
  },
  arrowContainer: {
    marginLeft: Spacing.md,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.surface2,
  },
  bookedBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.light.errorLight,
  },
  bookedText: {
    ...Typography.smallBold,
    color: Colors.light.error,
  },
});
