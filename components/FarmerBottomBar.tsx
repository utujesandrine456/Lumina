import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";

export default function FarmerBottomBar() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs: { name: string, route: string, icon: keyof typeof Ionicons.glyphMap; }[] = [
    { name: "Dashboard", icon: "home-outline", route: "/adminfarmerdashboard" },
    { name: "Farmers", icon: "people-outline", route: "/farmerslist" },
    { name: "Drivers", icon: "car-outline", route: "/nearbydrivers" },
    { name: "Trips", icon: "map-outline", route: "/trips" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isActive = pathname.startsWith(tab.route);

        return (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(tab.route as any)}
            style={styles.tab}
          >
            {isActive && <View style={styles.topIndicator} />}
            {isActive && <View style={styles.spotlight} />}

            <Ionicons
              name={tab.icon}
              size={26}
              color={isActive ? "#fff" : "#ffffffff"}
              style={isActive ? styles.activeIcon : undefined}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 18,
    backgroundColor: "#000",
    elevation: 6,
    overflow: 'hidden'
  },

  tab: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },

  topIndicator: {
    position: "absolute",
    top: -18,
    width: 40,
    height: 5,
    backgroundColor: "#fff",
    borderRadius: 3,
  },

  spotlight: {
    position: "absolute",
    top: -40,
    width: 90,
    height: 90,
    borderLeftWidth: 40,
    borderRightWidth: 40,
    borderBottomWidth: 75,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "rgba(255,255,255,0.12)",
  },

  activeIcon: {
    textShadowColor: "rgba(255, 255, 255, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
});

