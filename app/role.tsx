import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform, Animated } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDriverStore } from '@/constants/store';

const { width } = Dimensions.get('window');

export default function RoleScreen() {
    const { setUserRole } = useDriverStore();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.backgroundContainer}>
                {/* Decorative background circles - slightly adjusted for smoother look */}
                <View style={[styles.bubble, styles.bubble1]} />
                <View style={[styles.bubble, styles.bubble2]} />
                <View style={[styles.bubble, styles.bubble3]} />
            </View>

            <View style={styles.contentContainer}>
                <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <Text style={styles.title}>Choose Your Role</Text>
                    <Text style={styles.subtitle}>How would you like to join Lumina?</Text>
                </Animated.View>

                <View style={styles.cardsContainer}>
                    <Link href="/login" asChild>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setUserRole('cooperative')}>
                            <Animated.View style={[
                                styles.card,
                                {
                                    opacity: fadeAnim,
                                    transform: [{
                                        translateY: slideAnim.interpolate({
                                            inputRange: [0, 50],
                                            outputRange: [0, 80] // Stagger effect simulation
                                        })
                                    }]
                                }
                            ]}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="people" size={32} color="#4CAF50" />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>Cooperative Officer</Text>
                                    <Text style={styles.cardDescription}>Register farmers, book drivers, manage transport.</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#BDBDBD" />
                            </Animated.View>
                        </TouchableOpacity>
                    </Link>

                    <Link href="/login" asChild>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setUserRole('driver')}>
                            <Animated.View style={[
                                styles.card,
                                {
                                    opacity: fadeAnim,
                                    transform: [{
                                        translateY: slideAnim.interpolate({
                                            inputRange: [0, 50],
                                            outputRange: [0, 100] // More stagger
                                        })
                                    }]
                                }
                            ]}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="car" size={32} color="#2196F3" />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>Cooperative Driver</Text>
                                    <Text style={styles.cardDescription}>Receive trip requests, update trip status and register drivers.</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#BDBDBD" />
                            </Animated.View>
                        </TouchableOpacity>
                    </Link>
                </View>

                <Animated.View style={[styles.footer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
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
    backgroundContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
        zIndex: -1,
    },
    bubble: {
        position: 'absolute',
        borderRadius: 150,
        opacity: 0.4,
        backgroundColor: '#E8F5E8',
    },
    bubble1: { width: 200, height: 200, top: -50, left: -50 },
    bubble2: { width: 180, height: 180, top: 40, right: -60, backgroundColor: '#E3F2FD' },
    bubble3: { width: 150, height: 150, top: '20%', left: '10%', opacity: 0.2 },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 50,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 28,
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 10,
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
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.08)',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#F5F5F5'
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
        fontSize: 28,
        color: '#1A1A1A',
        textAlign: 'center',
    },
});