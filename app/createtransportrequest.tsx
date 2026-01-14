import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import ProtectedRoute from '@/components/ProtectedRoute';
import DateTimePicker from '@react-native-community/datetimepicker';
import { calculateDistance, calculatePrice } from '@/utils/PriceCalculator';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';



export default function CreateTransportRequest() {
    const router = useRouter();
    const { getCoopFarmers, currentUser, selectedFarmers = [], createRequest, setSelectedFarmers } = useDriverStore();
    const coopId = currentUser?.cooperativeId || currentUser?.id;
    const farmers = coopId ? getCoopFarmers(coopId) : [];
    const { farmerIds } = useLocalSearchParams();

    useEffect(() => {
        if (selectedFarmers.length === 0 && farmerIds) {
            const ids = (farmerIds as string).split(',');
            setSelectedFarmers(ids);
        }
    }, [farmerIds, selectedFarmers.length]);

    const finalSelectedIds = selectedFarmers.length > 0 ? selectedFarmers : (typeof farmerIds === 'string' ? farmerIds.split(',') : []);
    const selectedFarmersData = (farmers || []).filter(f => finalSelectedIds.includes(f.id));
    const availableCrops = Array.from(new Set(selectedFarmersData.flatMap(f => f.crops.map(c => c.name))));

    const [cropTypes, setCropTypes] = useState<string[]>([]);
    const [totalWeight, setTotalWeight] = useState('');
    const [destination, setDestination] = useState('');
    const [pickupLocation, setPickupLocation] = useState('');
    const [pickupDate, setPickupDate] = useState(new Date());
    const [pricePerKg, setPricePerKg] = useState('');
    const [pricePerKm, setPricePerKm] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [distance, setDistance] = useState<number | null>(null);
    const [totalPrice, setTotalPrice] = useState<number | null>(null);
    const [pickupCoords, setPickupCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [destCoords, setDestCoords] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        if (pickupCoords && destCoords) {
            const dist = calculateDistance(
                pickupCoords.latitude,
                pickupCoords.longitude,
                destCoords.latitude,
                destCoords.longitude
            );
            setDistance(dist);
        }
    }, [pickupCoords, destCoords]);

    useEffect(() => {
        if (distance !== null && totalWeight && pricePerKg && pricePerKm) {
            const weight = parseFloat(totalWeight);
            const price = parseFloat(pricePerKg);
            const perKm = parseFloat(pricePerKm);
            if (!isNaN(weight) && !isNaN(price) && !isNaN(perKm)) {
                const calculation = calculatePrice(distance, weight, price, perKm);
                setTotalPrice(calculation.totalPrice);
            }
        } else {
            setTotalPrice(null);
        }
    }, [distance, totalWeight, pricePerKg, pricePerKm]);

    const getLocationCoordinates = async (locationName: string, isPickup: boolean) => {
        const lat = -1.9 + (Math.random() * 0.5);
        const lon = 29.7 + (Math.random() * 0.5);
        return { latitude: lat, longitude: lon };
    };

    const handleLocationChange = async (location: string, isPickup: boolean) => {
        if (isPickup) {
            setPickupLocation(location);
            if (location) {
                const coords = await getLocationCoordinates(location, true);
                setPickupCoords(coords);
            }
        } else {
            setDestination(location);
            if (location) {
                const coords = await getLocationCoordinates(location, false);
                setDestCoords(coords);
            }
        }
    };

    const toggleCrop = (crop: string) => {
        setCropTypes(prev => {
            if (prev.includes(crop)) {
                return prev.filter(c => c !== crop);
            } else {
                return [...prev, crop];
            }
        });
    };

    const handleSubmit = () => {
        const missingFields = [];
        if (cropTypes.length === 0) missingFields.push("Crop Type");
        if (!totalWeight) missingFields.push("Weight");
        if (!destination) missingFields.push("Destination");
        if (!pickupLocation) missingFields.push("Pickup Location");
        if (!pricePerKg) missingFields.push("Price/Kg");
        if (!pricePerKm) missingFields.push("Price/Km");

        if (missingFields.length > 0) {
            alert(`Please fill in: ${missingFields.join(', ')}`);
            return;
        }

        if (selectedFarmersData.length === 0) {
            alert('No farmers selected! Go back and select farmers.');
            return;
        }

        if (!distance || totalPrice === null) {
            if (!pickupCoords || !destCoords) {
                alert('Could not locate Pickup or Destination. Please try different addresses.');
            } else {
                alert('Calculating price... please wait a moment.');
            }
            return;
        }

        const trip = {
            id: Date.now().toString(),
            cooperativeId: coopId || '',
            farmers: selectedFarmersData,
            cropType: cropTypes.join(', '),
            quantity: totalWeight,
            totalWeight: parseFloat(totalWeight),
            destination,
            pickupLocation,
            pickupDate: pickupDate.toISOString(),
            pricePerKg: parseFloat(pricePerKg),
            pricePerKm: parseFloat(pricePerKm),
            distance,
            totalPrice,
            status: 'pending' as const,
            priceLocked: false,
            chatOpen: false,
            bookingTime: new Date().toISOString(),
            createdAt: Date.now(),
            pickupCoordinates: pickupCoords ? { latitude: pickupCoords.latitude, longitude: pickupCoords.longitude } : undefined,
            destinationCoordinates: destCoords ? { latitude: destCoords.latitude, longitude: destCoords.longitude } : undefined,
        };

        createRequest(trip as any);
        setSelectedFarmers([]);

        if (Platform.OS === 'web') {
            window.alert('Transport request created! Select a driver.');
        } else {
            Alert.alert('Success', 'Transport request created! Now select a driver.');
        }
        router.push({ pathname: '/nearbydrivers', params: { requestId: trip.id } });
    };

    return (
        <ProtectedRoute>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                        </TouchableOpacity>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>New Request</Text>
                        </View>
                        <View style={styles.placeholderButton} />
                    </View>

                    <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.form}>
                        <Text style={styles.sectionTitle}>Selected Farmers ({selectedFarmersData.length})</Text>
                        {selectedFarmersData.length === 0 ? (
                            <TouchableOpacity
                                style={styles.selectButton}
                                onPress={() => router.push('/farmerslist')}
                            >
                                <Ionicons name="people" size={20} color="#000" />
                                <Text style={styles.selectButtonText}>Select Farmers from List</Text>
                                <Ionicons name="arrow-forward" size={16} color="#000" />
                            </TouchableOpacity>
                        ) : (
                            selectedFarmersData.map((farmer, index) => (
                                <Animated.View
                                    key={farmer.id}
                                    entering={SlideInRight.delay(300 + index * 50).springify()}
                                    style={styles.farmerItem}
                                >
                                    <Text style={styles.farmerName}>{farmer.name}</Text>
                                    <Text style={styles.farmerDetails}>
                                        {farmer.location && farmer.location !== 'Unknown' ? farmer.location : 'Location Pending'}
                                    </Text>
                                    <View style={styles.cropsRow}>
                                        {farmer.crops.map((crop) => (
                                            <View key={crop.id} style={styles.cropTag}>
                                                <Text style={styles.cropTagText}>{crop.name}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </Animated.View>
                            ))
                        )}

                        <Text style={styles.label}>Crop Type *</Text>
                        <View style={styles.cropSelector}>
                            {availableCrops.map((crop, index) => (
                                <TouchableOpacity
                                    key={crop}
                                    style={[styles.cropOption, cropTypes.includes(crop) && styles.cropOptionSelected]}
                                    onPress={() => toggleCrop(crop)}
                                >
                                    <Text style={[styles.cropOptionText, cropTypes.includes(crop) && styles.cropOptionTextSelected]}>
                                        {crop}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Total Weight (kg) *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter total weight"
                            keyboardType="numeric"
                            value={totalWeight}
                            onChangeText={setTotalWeight}
                        />

                        <Text style={styles.label}>Pickup Location *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter pickup location"
                            value={pickupLocation}
                            onChangeText={(text) => handleLocationChange(text, true)}
                        />

                        <Text style={styles.label}>Destination *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter destination"
                            value={destination}
                            onChangeText={(text) => handleLocationChange(text, false)}
                        />

                        {distance !== null && (
                            <Animated.View entering={FadeInDown.springify()} style={styles.infoBox}>
                                <Ionicons name="location" size={20} color="#000" />
                                <Text style={styles.infoText}>Distance: {distance.toFixed(2)} km</Text>
                            </Animated.View>
                        )}

                        <Text style={styles.label}>Pickup Date *</Text>
                        {(Platform.OS === 'web' || Platform.OS === 'windows') ? (
                            <View style={{ marginBottom: 15 }}>
                                {React.createElement('input', {
                                    type: 'date',
                                    value: pickupDate.toISOString().split('T')[0],
                                    min: new Date().toISOString().split('T')[0],
                                    onChange: (e: any) => {
                                        const d = new Date(e.target.value);
                                        if (!isNaN(d.getTime())) {
                                            setPickupDate(d);
                                        }
                                    },
                                    style: {
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: '1px solid #B5B5B5',
                                        fontSize: '15px',
                                        fontFamily: 'Poppins_400Regular',
                                        width: '100%',
                                        outline: 'none',
                                        backgroundColor: '#FFF',
                                        color: '#000',
                                        boxSizing: 'border-box'
                                    }
                                })}
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.dateText}>
                                    {pickupDate.toLocaleDateString()}
                                </Text>
                                <Ionicons name="calendar-outline" size={20} color="#000" />
                            </TouchableOpacity>
                        )}

                        {showDatePicker && Platform.OS !== 'web' && Platform.OS !== 'windows' && (
                            <DateTimePicker
                                value={pickupDate}
                                mode="date"
                                display="default"
                                minimumDate={new Date()}
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) {
                                        setPickupDate(selectedDate);
                                    }
                                }}
                            />
                        )}

                        <Text style={styles.label}>Price per kg (Frw) *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter price per kg"
                            keyboardType="numeric"
                            value={pricePerKg}
                            onChangeText={setPricePerKg}
                        />

                        <Text style={styles.label}>Price per km (Frw) *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter price per km"
                            keyboardType="numeric"
                            value={pricePerKm}
                            onChangeText={setPricePerKm}
                        />

                        {totalPrice !== null && (
                            <Animated.View entering={FadeInDown.springify()} style={styles.priceBox}>
                                <View style={styles.priceRow}>
                                    <Text style={styles.priceLabel}>Total Price (Locked):</Text>
                                    <Text style={styles.priceValue}>{totalPrice.toFixed(2)} Frw</Text>
                                </View>
                                <View style={styles.priceBreakdown}>
                                    <Text style={styles.breakdownText}>
                                        ({totalWeight} kg × {pricePerKg} Frw/kg) + ({distance?.toFixed(2)} km × {pricePerKm} Frw/km)
                                    </Text>
                                </View>
                            </Animated.View>
                        )}

                        <TouchableOpacity
                            style={[styles.submitButton, totalPrice !== null && styles.submitButtonActive]}
                            onPress={handleSubmit}
                            disabled={totalPrice === null}
                        >
                            <Text style={styles.submitButtonText}>Create Request</Text>
                            <Ionicons name="lock-closed" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </ProtectedRoute>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
        zIndex: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    placeholderButton: {
        width: 44,
    },
    titleContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
    },
    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
        letterSpacing: 0.5,
    },
    form: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#000',
        marginBottom: 12,
    },
    farmerItem: {
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    farmerName: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#000',
        marginBottom: 4,
    },
    farmerDetails: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
        marginBottom: 8,
    },
    cropsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    cropTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#E0E0E0',
    },
    cropTagText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 11,
        color: '#000',
    },
    label: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#000',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#B5B5B5',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        backgroundColor: '#FFF',
        color: '#000',
    },
    cropSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    cropOption: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#FFF',
    },
    cropOptionSelected: {
        borderColor: '#000',
        backgroundColor: '#000',
    },
    cropOptionText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
    },
    cropOptionTextSelected: {
        color: '#FFF',
        fontFamily: 'Poppins_500Medium',
    },
    dateButton: {
        borderWidth: 1,
        borderColor: '#B5B5B5',
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        color: '#000',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        marginTop: 8,
    },
    infoText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#000',
    },
    priceBox: {
        backgroundColor: '#000',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    priceLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#FFF',
    },
    priceValue: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 24,
        color: '#FFF',
    },
    priceBreakdown: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
        paddingTop: 8,
    },
    breakdownText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    submitButton: {
        backgroundColor: '#E0E0E0',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    submitButtonActive: {
        backgroundColor: '#000',
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 8,
        borderStyle: 'dashed',
    },
    selectButtonText: {
        flex: 1,
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#000',
    },
});
