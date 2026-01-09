import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '@/constants/store';
import Animated, { FadeInDown } from 'react-native-reanimated';
import FarmerBottomBar from '@/components/FarmerBottomBar';

export default function FarmersList() {
    const router = useRouter();
    const { currentUser, getCoopFarmers, setSelectedFarmers, selectedFarmers } = useDriverStore();

    const coopId = currentUser?.cooperativeId || currentUser?.id;
    const farmers = coopId ? getCoopFarmers(coopId) : [];

    const [selectedIds, setSelectedIds] = useState<string[]>(selectedFarmers || []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (farmers.length === 0) {
                Alert.alert(
                    "No Farmers Found",
                    "There are no farmers registered in your cooperative yet. Would you like to register one now?",
                    [
                        { text: "Later", style: "cancel" },
                        { text: "Register Now", onPress: () => router.push('/registerfarmer') }
                    ]
                );
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [farmers.length]);

    const toggleSelection = (farmerId: string) => {
        const newSelection = selectedIds.includes(farmerId)
            ? selectedIds.filter(id => id !== farmerId)
            : [...selectedIds, farmerId];
        setSelectedIds(newSelection);
    };

    const handleContinue = () => {
        if (selectedIds.length === 0) return;
        setSelectedFarmers(selectedIds);
        router.push({ pathname: '/createtransportrequest', params: { farmerIds: selectedIds.join(',') } });
    };

    const renderFarmer = ({ item, index }: { item: any, index: number }) => {
        const isSelected = selectedIds.includes(item.id);

        return (
            <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
                <TouchableOpacity
                    style={[styles.farmerCard, isSelected && styles.selectedCard]}
                    onPress={() => toggleSelection(item.id)}
                    activeOpacity={0.8}
                >
                    <View style={styles.farmerInfo}>
                        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                            {isSelected && <Ionicons name="checkmark" size={14} color="#FFF" />}
                        </View>
                        <View style={styles.farmerDetails}>
                            <Text style={styles.farmerName}>{item.name}</Text>
                            <Text style={styles.farmerSubText}>{item.phone}</Text>
                            <View style={styles.cropsRow}>
                                {item.crops.map((c: any, i: number) => (
                                    <View key={i} style={styles.cropBadge}>
                                        <Text style={styles.cropText}>{c.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#E0E0E0" />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>All Farmers</Text>
                </View>
                <View style={styles.placeholderButton} />
            </View>

            {farmers.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="people" size={48} color="#1A1A1A" />
                    </View>
                    <Text style={styles.emptyTitle}>No Farmers Yet</Text>
                    <Text style={styles.emptyText}>Register farmers to start managing their harvest transport requests.</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push('/registerfarmer')}
                    >
                        <Text style={styles.addButtonText}>Register New Farmer</Text>
                        <Ionicons name="add" size={20} color="#FFF" />
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
                        <Animated.View entering={FadeInDown.duration(200)} style={styles.footer}>
                            <View style={styles.selectionInfo}>
                                <Text style={styles.selectedCount}>
                                    {selectedIds.length} Selected
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                                <Text style={styles.continueButtonText}>Create Request</Text>
                                <Ionicons name="arrow-forward" size={18} color="#FFF" />
                            </TouchableOpacity>
                        </Animated.View>
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
    listContent: {
        padding: 24,
        paddingBottom: 100,
    },
    farmerCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOpacity: 0.02,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    selectedCard: {
        borderColor: '#1A1A1A',
        borderWidth: 1.5,
        backgroundColor: '#FAFAFA',
    },
    farmerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    checkboxSelected: {
        backgroundColor: '#1A1A1A',
        borderColor: '#1A1A1A',
    },
    farmerDetails: {
        flex: 1,
    },
    farmerName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#1A1A1A',
        marginBottom: 2,
    },
    farmerSubText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: '#757575',
        marginBottom: 8,
    },
    cropsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    cropBadge: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    cropText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 11,
        color: '#444',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    emptyTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#1A1A1A',
        marginBottom: 8,
    },
    emptyText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    addButton: {
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#1A1A1A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    addButtonText: {
        color: '#FFF',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        paddingBottom: 32,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    selectionInfo: {

    },
    selectedCount: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#1A1A1A',
    },
    continueButton: {
        backgroundColor: '#1A1A1A',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    continueButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
    },
});
