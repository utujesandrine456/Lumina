import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, LayoutAnimationConfig } from 'react-native-reanimated';
import { useDriverStore } from '@/constants/store';

const { width } = Dimensions.get('window');

export default function RoleScreen() {
    const { setUserRole } = useDriverStore();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={{ width: 150, height: 150, backgroundColor: 'black', position: 'absolute', borderRadius: 150, top: -40, left: -80 }}></View>
                <View style={{ width: 150, height: 150, backgroundColor: 'black', position: 'absolute', borderRadius: 150, top: -40, right: -80 }}></View>
                <View style={{ width: 150, height: 150, backgroundColor: 'black', position: 'absolute', borderRadius: 150, top: -80, left: 0 }}></View>
                <View style={{ width: 150, height: 150, backgroundColor: 'black', position: 'absolute', borderRadius: 150, top: -80, right: 0 }}></View>
                <View style={{ width: 150, height: 150, backgroundColor: 'black', position: 'absolute', borderRadius: 150, top: -100, left: '30%' }}></View>

                <Animated.View entering={FadeInDown.delay(100).duration(1000).springify()} style={styles.header}>
                    <Text style={styles.title}>Choose Your Role</Text>
                    <Text style={styles.subtitle}>How would you like to join Lumina?</Text>
                </Animated.View>

                <View style={styles.cardsContainer}>
                    <Link href="/Fsignup" asChild>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => setUserRole('farmer')}>
                            <Animated.View entering={FadeInDown.delay(300).duration(1000).springify()} style={styles.card}>
                                <View style={{ ...styles.iconContainer, backgroundColor: '#E8F5E9' }}>
                                    <Ionicons name="leaf" size={32} color="#2E7D32" />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>Farmer</Text>
                                    <Text style={styles.cardDescription}>I want to sell my crops and manage my farm.</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#BDBDBD" />
                            </Animated.View>
                        </TouchableOpacity>
                    </Link>

                    <Link href="/Dsignup" asChild>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => setUserRole('driver')}>
                            <Animated.View entering={FadeInDown.delay(500).duration(1000).springify()} style={styles.card}>
                                <View style={{ ...styles.iconContainer, backgroundColor: '#E3F2FD' }}>
                                    <Ionicons name="car" size={32} color="#1565C0" />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>Driver</Text>
                                    <Text style={styles.cardDescription}>I want to transport goods and earn money.</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#BDBDBD" />
                            </Animated.View>
                        </TouchableOpacity>
                    </Link>
                </View>

                <Animated.View entering={FadeInUp.delay(700).duration(1000).springify()} style={styles.footer}>
                    <Text style={styles.footerText}>Enjoy Services With Lumina</Text>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 32,
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
    },
    cardsContainer: {
        gap: 20,
        marginBottom: 60,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
        marginBottom: 4,
    },
    cardDescription: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: '#757575',
        lineHeight: 18,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    footerText: {
        fontFamily: 'Satisfy_400Regular',
        fontSize: 36,
        color: '#1A1A1A',
        textAlign: 'center',
    },
});