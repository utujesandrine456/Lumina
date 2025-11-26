import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions  } from "react-native";
import {useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import BottomBar from '@/components/BottomBar';
import DriverBottomBar from '@/components/DriverBottomBar';
import { useDriverStore } from '@/constants/store';
import Icon from "react-native-vector-icons/Ionicons";


const { height } = Dimensions.get('window');
export default function Location() {
    const router = useRouter();
    const { userRole, trip, driverLocation } = useDriverStore();
    const isDriver = userRole === 'driver';

    const [pickup, setPickup] = useState(trip.pickupLocation || "Musanze, Ruhengeri");
    const [destination, setDestination] = useState(trip.destination || "Kigali, Nyabugogo");
    const [currentLoc, setCurrentLoc] = useState(driverLocation || "Musanze, Ruhengeri");


    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.contentContainer} pointerEvents="box-none">
                <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.inputCard}>
                    {isDriver ? (
                        <View style={styles.inputRow}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="navigate-circle" size={24} color="#2196F3" />
                            </View>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputLabel}>Current Location</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentLoc}
                                    onChangeText={setCurrentLoc}
                                    placeholder="Enter your current location"
                                    placeholderTextColor="#9E9E9E"
                                />
                            </View>
                        </View>
                    ) : (

                        <>
                        <View></View>
                            <View style={styles.inputRow}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="radio-button-on" size={20} color="#4CAF50" />
                                    <View style={styles.verticalLine} />
                                </View>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputLabel}>Pickup Location</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            value={pickup}
                                            onChangeText={setPickup}
                                            placeholder="Enter pickup location"
                                            placeholderTextColor="#9E9E9E"
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.inputRow}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="location" size={20} color="#F44336" />
                                </View>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputLabel}>Destination</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            value={destination}
                                            onChangeText={setDestination}
                                            placeholder="Enter destination"
                                            placeholderTextColor="#9E9E9E"
                                        />
                                    </View>
                                </View>
                            </View>
                        </>
                    )}
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(400).springify()} style={{backgroundColor: "#000", padding: 12, paddingHorizontal: 15, outline: 'none', borderRadius: 6, marginHorizontal: 30, marginBottom: 20}}>
                    <Text style={{fontFamily: 'Poppins_500Medium', color: 'white', textAlign: 'center'}}>Confirm & Pay</Text>
                    <Icon name="" size={20} color="#000"/>
                </Animated.View>

            </SafeAreaView>
            {isDriver ? <DriverBottomBar /> : <BottomBar />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffff',
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
        height: height,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    headerTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        overflow: 'hidden',
    },
    inputCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginTop: 20,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconContainer: {
        alignItems: 'center',
        marginRight: 16,
        marginTop: 4,
        width: 24,
    },
    verticalLine: {
        width: 2,
        height: 40,
        backgroundColor: '#E0E0E0',
        marginVertical: 4,
    },
    inputWrapper: {
        flex: 1,
        marginBlock: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#757575',
        marginBottom: 4,
    },
    input: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#535353ff',
        padding: 5,
        height: 32,
        outlineColor: 'white',
        flex: 1,
        width: '80%',
        borderWidth: 1,
        borderRadius: 5
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginLeft: 40,
        marginVertical: 12,
    },
    actionContainer: {
        marginBottom: 20,
    },
    findButton: {
        borderWidth: 1.5,
        borderColor: '#3f3f3fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 12,
        gap: 8,
    },
    findButtonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#FFF',
    },
});
