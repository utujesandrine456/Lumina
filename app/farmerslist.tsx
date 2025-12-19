import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';

export default function FarmersList() {
    const router = useRouter();
    const { farmers, setSelectedFarmers, selectedFarmers } = useDriverStore();
    const [selectedIds, setSelectedIds] = useState<string[]>(selectedFarmers);

    const toggleSelection = (farmerId: string) => {
        const newSelection = selectedIds.includes(farmerId)
            ? selectedIds.filter(id => id !== farmerId)
            : [...selectedIds, farmerId];
        setSelectedIds(newSelection);
    };

    const handleContinue = () => {
        if (selectedIds.length === 0) {
            return;
        }
        setSelectedFarmers(selectedIds);
        router.push('/createtransportrequest');
    };

    const renderFarmer = ({ item }: { item: any }) => {
        const isSelected = selectedIds.includes(item.id);
        
        return (
            <TouchableOpacity
                style={[styles.farmerCard, isSelected && styles.selectedCard]}
                onPress={() => toggleSelection(item.id)}
            >
                <View style={styles.farmerInfo}>
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                        {isSelected && <Ionicons name="checkmark" size={16} color="#FFF" />}
                    </View>
                    <View style={styles.farmerDetails}>
                        <Text style={styles.farmerName}>{item.name}</Text>
                        <Text style={styles.farmerLocation}>{item.location}</Text>
                        <View style={styles.cropInfo}>
                            <Text style={styles.cropText}>{item.crop}</Text>
                            <Text style={styles.quantityText}>• {item.quantity} kg</Text>
                        </View>
                        <Text style={styles.harvestDate}>
                            Harvest: {new Date(item.harvestDate).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Select Farmers</Text>
                <View style={{ width: 24 }} />
            </View>

            {farmers.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="people-outline" size={64} color="#BDBDBD" />
                    <Text style={styles.emptyText}>No farmers registered yet</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push('/registerfarmer')}
                    >
                        <Text style={styles.addButtonText}>Register First Farmer</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={farmers}
                        renderItem={renderFarmer}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                    {selectedIds.length > 0 && (
                        <View style={styles.footer}>
                            <Text style={styles.selectedCount}>
                                {selectedIds.length} farmer{selectedIds.length > 1 ? 's' : ''} selected
                            </Text>
                            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                                <Text style={styles.continueButtonText}>Continue</Text>
                                <Ionicons name="arrow-forward" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#000',
    },
    listContent: {
        padding: 20,
    },
    farmerCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    selectedCard: {
        borderColor: '#000',
        borderWidth: 2,
    },
    farmerInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#BDBDBD',
        marginRight: 12,
        marginTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    farmerDetails: {
        flex: 1,
    },
    farmerName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#000',
        marginBottom: 4,
    },
    farmerLocation: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        marginBottom: 8,
    },
    cropInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    cropText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#000',
    },
    quantityText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#757575',
        marginLeft: 4,
    },
    harvestDate: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#757575',
        marginTop: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#757575',
        marginTop: 16,
        marginBottom: 24,
    },
    addButton: {
        backgroundColor: '#000',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    addButtonText: {
        color: '#FFF',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        backgroundColor: '#FFF',
    },
    selectedCount: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#000',
        marginBottom: 12,
        textAlign: 'center',
    },
    continueButton: {
        backgroundColor: '#000',
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    continueButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
});

