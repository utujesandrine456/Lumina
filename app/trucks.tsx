import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width - 48;

export default function Trucks() {
    type TruckName = 'Daihatsu' | 'Volvo' | 'Shashi' | 'Toyota' | 'Cruiser' | 'Suzuki';

    const images: Record<TruckName, any> = {
        Daihatsu: require("@/assets/images/DaihatsuRB.png"),
        Volvo: require("@/assets/images/Howo.jpg"),
        Shashi: require("@/assets/images/Camion.jpg"),
        Toyota: require("@/assets/images/Isuzu.jpg"),
        Cruiser: require("@/assets/images/shashi.jpeg"),
        Suzuki: require("@/assets/images/Closed.webp"),
    };

    const trucksdata: { id: number, name: TruckName, price: number, status: string, type: string, numberofseats: number }[] = [
        { id: 1, name: 'Daihatsu', price: 21, status: 'green', type: 'Manual', numberofseats: 2 },
        { id: 2, name: 'Volvo', price: 27, status: 'yellow', type: 'Manual', numberofseats: 3 },
        { id: 3, name: 'Shashi', price: 18, status: 'red', type: 'Manual', numberofseats: 4 },
        { id: 4, name: 'Toyota', price: 12, status: 'yellow', type: 'Manual', numberofseats: 2 },
        { id: 5, name: 'Cruiser', price: 23, status: 'green', type: 'Manual', numberofseats: 1 },
        { id: 6, name: 'Suzuki', price: 32, status: 'red', type: 'Manual', numberofseats: 3 }
    ];

    const [selectedTruck, setSelectedTruck] = useState<number | null>(null);

    const toggleSelection = (id: number) => {
        setSelectedTruck(selectedTruck === id ? null : id);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Link href="/role" asChild>
                    <TouchableOpacity style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                </Link>
                <View>
                    <Text style={styles.headerTitle}>Choose Truck</Text>
                    <Text style={styles.headerSubtitle}>Select a vehicle for transport</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.grid}>
                    {trucksdata.map((truck, index) => (
                        <Animated.View
                            key={truck.id}
                            entering={FadeInUp.delay(index * 100).springify()}
                            style={styles.cardContainer}
                        >
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => toggleSelection(truck.id)}
                                style={{
                                    ...styles.card,
                                    ...(selectedTruck === truck.id ? styles.cardSelected : {})
                                }}
                            >
                                <Image source={images[truck.name]} style={styles.cardImage} resizeMode="cover" />

                                {selectedTruck === truck.id && (
                                    <View style={styles.checkBadge}>
                                        <Ionicons name="checkmark" size={16} color="#FFF" />
                                    </View>
                                )}

                                <View style={{ ...styles.cardInfo, backgroundColor: 'rgba(0,0,0,0.7)' }}>
                                    <View>
                                        <Text style={styles.truckName}>{truck.name}</Text>
                                        <Text style={styles.truckType}>{truck.type} • {truck.numberofseats} Seats</Text>
                                    </View>
                                    <View style={styles.priceTag}>
                                        <Text style={styles.truckPrice}>{truck.price}</Text>
                                        <Text style={styles.priceUnit}>Frw/Km</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                <Animated.View style={styles.actionsContainer}>
                    <Link
                        href={{
                            pathname: "/truckprofile",
                            params: { initialIndex: selectedTruck ? trucksdata.findIndex(t => t.id === selectedTruck) : 0 }
                        }}
                        asChild
                    >
                        <TouchableOpacity style={styles.detailsButton}>
                            <Text style={styles.detailsButtonText}>View Details</Text>
                        </TouchableOpacity>
                    </Link>

                    <Link href="/datetime" asChild>
                        <TouchableOpacity
                            style={{
                                ...styles.confirmButton,
                                ...(!selectedTruck ? styles.disabledButton : {})
                            }}
                            disabled={!selectedTruck}
                        >
                            <Text style={styles.confirmButtonText}>Confirm Truck</Text>
                            <Ionicons name="arrow-forward" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </Link>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    headerTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#1A1A1A',
        textAlign: 'center',
    },
    headerSubtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
        textAlign: 'center',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100,
    },
    grid: {
        gap: 20,
    },
    cardContainer: {
        width: '100%',
    },
    card: {
        width: '100%',
        height: 220,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#FFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    cardSelected: {
        borderColor: '#1565C0', // Blue for trucks/drivers
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    checkBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#1565C0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
        zIndex: 10,
    },
    cardInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    truckName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#FFF',
        marginBottom: 4,
    },
    truckType: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    priceTag: {
        alignItems: 'flex-end',
    },
    truckPrice: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 20,
        color: '#FFF',
    },
    priceUnit: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    actionsContainer: {
        marginTop: 32,
        flexDirection: 'row',
        gap: 16,
    },
    detailsButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    detailsButtonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#1A1A1A',
    },
    confirmButton: {
        flex: 1.5,
        flexDirection: 'row',
        paddingVertical: 16,
        borderRadius: 16,
        backgroundColor: '#1A1A1A',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    disabledButton: {
        backgroundColor: '#E0E0E0',
        opacity: 0.8,
    },
    confirmButtonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#FFF',
    },
});