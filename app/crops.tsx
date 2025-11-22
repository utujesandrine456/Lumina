import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions, Platform } from "react-native";
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width);


export default function Crops() {
    type CropName = 'Maize' | 'Beans' | 'Potato' | 'Sweet Potato' | 'Rice' | 'Casava';

    const images: Record<CropName, any> = {
        Maize: require("@/assets/images/maize.jpeg"),
        Beans: require("@/assets/images/beans.jpg"),
        Potato: require("@/assets/images/potato.jpeg"),
        "Sweet Potato": require("@/assets/images/sweet-potatoes.jpg"),
        Rice: require("@/assets/images/rice.jpeg"),
        Casava: require("@/assets/images/casava.jpeg"),
    };

    const cropsdata: { id: number, name: CropName, price: number }[] = [
        { id: 1, name: 'Maize', price: 13 },
        { id: 2, name: 'Beans', price: 10 },
        { id: 3, name: 'Potato', price: 20 },
        { id: 4, name: 'Sweet Potato', price: 16 },
        { id: 5, name: 'Rice', price: 22 },
        { id: 6, name: 'Casava', price: 11 }
    ];

    const [selectedCrop, setSelectedCrop] = useState<number[]>([]);

    const toggleSelection = (id: number) => {
        if(selectedCrop.includes(id)){
            setSelectedCrop(selectedCrop.filter(item => item != id));
        }else{
            setSelectedCrop([...selectedCrop, id]);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.header}>
                    <Text style={styles.headerTitle}>Select Produce</Text>
                    <Text style={styles.headerSubtitle}>Choose the crops you want to trade</Text>
                </Animated.View>

                <View style={styles.grid}>
                    {cropsdata.map((crop, index) => (
                        <Animated.View
                            key={crop.id}
                            entering={FadeInDown.delay(200 + index * 100).duration(800).springify()}
                        >
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => toggleSelection(crop.id)}
                                style={{
                                    ...styles.card,
                                    ...(selectedCrop.includes(crop.id) ? styles.cardSelected : {})
                                }}
                            >
                                <Image source={images[crop.name]} style={styles.cardImage} resizeMode="cover" />

                                {selectedCrop.includes(crop.id) && (
                                    <View style={styles.selectedOverlay}>
                                        <View style={styles.checkmarkBadge}>
                                            <Ionicons name="checkmark" size={16} color="#FFF" />
                                        </View>
                                    </View>
                                )}

                                <View style={[styles.cardInfo, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                                    <Text style={styles.cropName}>{crop.name}</Text>
                                    <Text style={styles.cropPrice}>{crop.price} Frw/Kg</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                <Animated.View style={styles.actionsContainer}>
                    <Link
                        href={{
                            pathname: "/cropprofile",
                            params: {selected: selectedCrop.join(',') }
                        }}
                        asChild
                    >
                        <TouchableOpacity style={styles.detailsButton}>
                            <Text style={styles.detailsButtonText}>View Details</Text>
                        </TouchableOpacity>
                    </Link>

                    <Link href="/trucks" asChild>
                        <TouchableOpacity
                            style={{
                                ...styles.confirmButton,
                                ...(!selectedCrop ? styles.disabledButton : {})
                            }}
                            disabled={!selectedCrop}
                        >
                            <Text style={styles.confirmButtonText}>Confirm Selection</Text>
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
    scrollContent: {
        padding: 24,
        paddingBottom: 50,
    },
    header: {
        marginBottom: 32,
    },
    headerTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 32,
        color: '#1A1A1A',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#757575',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    card: {
        width: COLUMN_WIDTH - 50,
        height: COLUMN_WIDTH / 2,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: '#FFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#ffff',
    },
    cardSelected: {
        borderColor: '#2E7D32',
        transform: [{ scale: 0.98 }],
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    selectedOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(46, 125, 50, 0.2)',
        zIndex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        padding: 12,
    },
    checkmarkBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#2E7D32',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    cardInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        overflow: 'hidden',
    },
    cropName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#FFF',
        marginBottom: 4,
    },
    cropPrice: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#E0E0E0',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
        gap: 16,
    },
    detailsButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    detailsButtonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#000',
    },
    confirmButton: {
        flex: 1.5,
        flexDirection: 'row',
        paddingVertical: 16,
        borderRadius: 10,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    disabledButton: {
        backgroundColor: '#BDBDBD',
        elevation: 0,
    },
    confirmButtonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#FFF',
    },
});


