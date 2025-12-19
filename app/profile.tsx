import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import DriverBottomBar from '@/components/DriverBottomBar';
import { useDriverStore } from '@/constants/store';

export default function Profile() {
    const router = useRouter();
    const { currentUser, drivers, updateDriver } = useDriverStore();
    const driver = useMemo(() => drivers.find(d => d.id === currentUser?.id), [drivers, currentUser]);
    const [availability, setAvailability] = useState(driver?.availability ?? true);

    if (!currentUser) {
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontFamily: 'Poppins_500Medium', fontSize: 20}}>No user logged in</Text>
            </View>
        );
    }

    const toggleAvailability = () => {
        const next = !availability;
        setAvailability(next);
        if (driver) {
            updateDriver(driver.id, { availability: next });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Driver Profile</Text>
                    <View style={{ width: 24 }} />
                </View>

                <Animated.View entering={FadeInDown.delay(150).springify()} style={styles.card}>
                    <View style={styles.avatarRow}>
                        <Ionicons name="person-circle" size={72} color="#000" />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.name}>{currentUser.name}</Text>
                            <Text style={styles.sub}>{driver?.plateNumber || 'Plate not set'}</Text>
                            <Text style={styles.sub}>{currentUser.phone}</Text>
                        </View>
                        <View style={styles.availabilityPill}>
                            <View style={[styles.dot, { backgroundColor: availability ? '#00C853' : '#BDBDBD' }]} />
                            <Text style={styles.pillText}>{availability ? 'Available' : 'Unavailable'}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Ionicons name="car-outline" size={18} color="#000" />
                        <Text style={styles.rowText}>{driver?.vehicleModel || 'Vehicle type not set'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Ionicons name="speedometer-outline" size={18} color="#000" />
                        <Text style={styles.rowText}>{driver?.capacity ? `${driver.capacity} kg capacity` : 'Capacity not set'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Ionicons name="star" size={18} color="#000" />
                        <Text style={styles.rowText}>{(driver?.rating || 4.9).toFixed(1)} rating</Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(250).springify()} style={styles.card}>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.sectionTitle}>Availability</Text>
                            <Text style={styles.sub}>Toggle to stop receiving jobs</Text>
                        </View>
                        <Switch
                            value={availability}
                            onValueChange={toggleAvailability}
                            trackColor={{ false: '#D6D6D6', true: '#000' }}
                            thumbColor={'#FFF'}
                        />
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(350).springify()} style={styles.card}>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.sectionTitle}>Manage Jobs</Text>
                            <Text style={styles.sub}>See pending requests and accept/decline</Text>
                        </View>
                        <TouchableOpacity style={styles.cta} onPress={() => router.push('/driverjobs')}>
                            <Text style={styles.ctaText}>Open Jobs</Text>
                            <Ionicons name="arrow-forward" size={18} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
            <DriverBottomBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 80,
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
    card: {
        marginHorizontal: 20,
        marginTop: 16,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    avatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    name: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 18,
        color: '#000',
    },
    sub: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: '#757575',
    },
    availabilityPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    pillText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 12,
        color: '#000',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 6,
    },
    rowText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#000',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#000',
        marginBottom: 4,
    },
    cta: {
        backgroundColor: '#000',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ctaText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#FFF',
    },
});