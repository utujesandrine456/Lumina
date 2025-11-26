import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Animated, { FadeInDown } from "react-native-reanimated";
import BottomBar from "@/components/BottomBar";

const historyData = [
    {
        id: "1",
        date: "Nov 24, 2025",
        from: "Kigali",
        to: "Musanze",
        status: "Completed",
        price: "45,000 Frw",
        truck: "Volvo FH16",
    },
    {
        id: "2",
        date: "Nov 20, 2025",
        from: "Huye",
        to: "Kigali",
        status: "Cancelled",
        price: "32,000 Frw",
        truck: "Daihatsu",
    },
    {
        id: "3",
        date: "Nov 15, 2025",
        from: "Rwamagana",
        to: "Kayonza",
        status: "Completed",
        price: "18,000 Frw",
        truck: "Fuso",
    },
];

export default function History() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Trip History</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {historyData.map((item, index) => (
                    <Animated.View
                        key={item.id}
                        entering={FadeInDown.delay(index * 100).springify()}
                    >
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.date}>{item.date}</Text>
                                <View style={[
                                    styles.statusBadge,
                                    { backgroundColor: item.status === "Completed" ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)" }
                                ]}>
                                    <Text style={[
                                        styles.statusText,
                                        { color: item.status === "Completed" ? "#4CAF50" : "#F44336" }
                                    ]}>
                                        {item.status}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.routeContainer}>
                                <View style={styles.locationRow}>
                                    <Ionicons name="radio-button-on" size={16} color="#4CAF50" />
                                    <Text style={styles.locationText}>{item.from}</Text>
                                </View>
                                <View style={styles.dottedLine} />
                                <View style={styles.locationRow}>
                                    <Ionicons name="location" size={16} color="#FFC107" />
                                    <Text style={styles.locationText}>{item.to}</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.cardFooter}>
                                <View style={styles.truckInfo}>
                                    <Ionicons name="bus-outline" size={16} color="#757575" />
                                    <Text style={styles.truckText}>{item.truck}</Text>
                                </View>
                                <Text style={styles.price}>{item.price}</Text>
                            </View>
                        </View>
                    </Animated.View>
                ))}
            </ScrollView>

            <BottomBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingBlock: 20,
    },
    backButton: {
        padding: 8,
        backgroundColor: "#f5f5f5",
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: "Poppins_600SemiBold",
        color: "#000",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#f0f0f0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    date: {
        color: "#000",
        fontSize: 14,
        fontFamily: "Poppins_500Medium",
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontFamily: "Poppins_600SemiBold",
    },
    routeContainer: {
        marginVertical: 8,
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    locationText: {
        color: "#333",
        fontSize: 16,
        fontFamily: "Poppins_500Medium",
    },
    dottedLine: {
        height: 20,
        borderLeftWidth: 1,
        borderLeftColor: "#ddd",
        borderStyle: "dashed",
        marginLeft: 7,
        marginVertical: 4,
    },
    divider: {
        height: 1,
        backgroundColor: "#f0f0f0",
        marginVertical: 12,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    truckInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    truckText: {
        color: "#757575",
        fontSize: 14,
        fontFamily: "Poppins_400Regular",
    },
    price: {
        color: "#4CAF50",
        fontSize: 16,
        fontFamily: "Poppins_700Bold",
    },
});
