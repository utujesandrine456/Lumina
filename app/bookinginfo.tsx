import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useDriverStore } from '@/constants/store';

const { width } = Dimensions.get('window');

export default function BookingInfo() {
    const router = useRouter();
    const { trip } = useDriverStore();

    const driverDetails = {
        name: "John Doe",
        rating: 4.9,
        trips: 124,
        vehicle: "Daihatsu • RAD 246 F",
        image: require("@/assets/images/Farmer.jpg"),
        phone: "+250 788 123 456"
    };

    const pricing = {
        base: 5000,
        distance: 12000, 
        service: 1000,
        total: 18000
    };

    const handleConfirm = () => {
        Alert.alert(
            "Booking Confirmed!",
            "Your driver has been notified and is on the way.",
            [
                {
                    text: "Go to Dashboard",
                    onPress: () => router.push('/farmerdashboard')
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1A1A1A', '#000000']}
                style={styles.headerBackground}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Confirm Booking</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                    {/* Driver Card */}
                    <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.card}>
                        <View style={styles.driverHeader}>
                            <Image source={driverDetails.image} style={styles.driverImage} />
                            <View style={styles.driverInfo}>
                                <Text style={styles.driverName}>{driverDetails.name}</Text>
                                <View style={styles.ratingContainer}>
                                    <Ionicons name="star" size={16} color="#FFD700" />
                                    <Text style={styles.ratingText}>{driverDetails.rating} ({driverDetails.trips} trips)</Text>
                                </View>
                                <Text style={styles.vehicleText}>{driverDetails.vehicle}</Text>
                            </View>
                            <TouchableOpacity style={styles.callButton}>
                                <Ionicons name="call" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Route Card */}
                    <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.card}>
                        <Text style={styles.sectionTitle}>Trip Details</Text>
                        <View style={styles.routeContainer}>
                            <View style={styles.routeLeft}>
                                <View style={styles.dot} />
                                <View style={styles.line} />
                                <View style={[styles.dot, styles.destinationDot]} />
                            </View>
                            <View style={styles.routeRight}>
                                <View style={styles.locationItem}>
                                    <Text style={styles.locationLabel}>Pickup</Text>
                                    <Text style={styles.locationText}>{trip.pickupLocation || "Musanze, Ruhengeri"}</Text>
                                    <Text style={styles.timeText}>{new Date(trip.bookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                                </View>
                                <View style={styles.locationItem}>
                                    <Text style={styles.locationLabel}>Destination</Text>
                                    <Text style={styles.locationText}>{trip.destination || "Kigali, Nyabugogo"}</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>


                    <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.card}>
                        <Text style={styles.sectionTitle}>Payment Breakdown</Text>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Base Fare</Text>
                            <Text style={styles.paymentValue}>{pricing.base.toLocaleString()} Frw</Text>
                        </View>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Distance (15km)</Text>
                            <Text style={styles.paymentValue}>{pricing.distance.toLocaleString()} Frw</Text>
                        </View>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Service Fee</Text>
                            <Text style={styles.paymentValue}>{pricing.service.toLocaleString()} Frw</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>{pricing.total.toLocaleString()} Frw</Text>
                        </View>
                    </Animated.View>

                </ScrollView>

                <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.footer}>
                    <Link href="/payment" asChild>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
                            <Ionicons name="arrow-forward" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </Link>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 120,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#FFF',
    },
    content: {
        padding: 24,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#1A1A1A',
        marginBottom: 16,
    },
    driverHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    driverImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
    },
    driverInfo: {
        flex: 1,
    },
    driverName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    ratingText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: '#757575',
        marginLeft: 4,
    },
    vehicleText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 13,
        color: '#1A1A1A',
        marginTop: 4,
    },
    callButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    routeContainer: {
        flexDirection: 'row',
    },
    routeLeft: {
        alignItems: 'center',
        marginRight: 16,
        paddingVertical: 8,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#E8F5E9',
    },
    destinationDot: {
        backgroundColor: '#1A1A1A',
        borderColor: '#F5F5F5',
    },
    line: {
        width: 2,
        flex: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 4,
    },
    routeRight: {
        flex: 1,
        gap: 24,
    },
    locationItem: {
        justifyContent: 'center',
    },
    locationLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#9E9E9E',
        marginBottom: 2,
    },
    locationText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 15,
        color: '#1A1A1A',
    },
    timeText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#4CAF50',
        marginTop: 2,
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    paymentLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
    },
    paymentValue: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#1A1A1A',
    },
    divider: {
        height: 1,
        backgroundColor: '#F5F5F5',
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#1A1A1A',
    },
    totalValue: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 20,
        color: '#1A1A1A',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
    },
    confirmButton: {
        backgroundColor: '#1A1A1A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 20,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    confirmButtonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#FFF',
    },
});