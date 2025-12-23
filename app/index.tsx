import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions, StyleSheet, Platform, Animated } from 'react-native';
import { Link } from 'expo-router';
import { MonoText } from '@/components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.logoContainer}>
                        <Image source={require("@/assets/images/Logo.png")} style={styles.logo} />
                        <Text style={styles.appName}>Lumina</Text>
                    </View>
                </Animated.View>

                <Animated.View style={[styles.imageContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.imageWrapper}>
                        <Image source={require("@/assets/images/Home.png")} style={styles.heroImage} resizeMode='cover' />
                    </View>
                </Animated.View>

                <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.title}>Find, Book and Rent a Truck to Transport your Crops Easily</Text>
                    <MonoText style={styles.subtitle}>Get a truck whenever and wherever you need it to transport your crops</MonoText>
                </Animated.View>

                <Animated.View style={[styles.actionContainer, { opacity: fadeAnim }]}>
                    <Link href="/role" asChild>
                        <TouchableOpacity style={styles.secondaryButton}>
                            <Text style={styles.secondaryButtonText}>Grow Market</Text>
                        </TouchableOpacity>
                    </Link>

                    <Link href="/role" asChild>
                        <TouchableOpacity style={styles.primaryButton}>
                            <View style={styles.primaryButtonContent}>
                                <Image source={require("@/assets/images/Logo.png")} style={styles.buttonLogo} />
                                <Text style={styles.primaryButtonText}>Get Started</Text>
                            </View>
                            <View style={styles.chevronContainer}>
                                <Ionicons name="chevron-forward" size={24} color="#BDBDBD" style={{ marginRight: -8 }} />
                                <Ionicons name="chevron-forward" size={24} color="#757575" style={{ marginRight: -8 }} />
                                <Ionicons name="chevron-forward" size={24} color="#000000" />
                            </View>
                        </TouchableOpacity>
                    </Link>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 10
    },
    header: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    logo: {
        width: 55,
        height: 55,
    },
    appName: {
        fontFamily: 'Satisfy_400Regular',
        fontSize: 48,
        color: '#000',
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    imageWrapper: {
        width: width * 0.9,
        height: 320,
        borderRadius: 30,
        overflow: 'hidden',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        marginBottom: 35,
        paddingHorizontal: 10,
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
        fontFamily: 'Poppins_600SemiBold',
        marginBottom: 12,
        color: '#1A1A1A',
        lineHeight: 34,
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    actionContainer: {
        gap: 25,
        alignItems: 'center',
    },
    secondaryButton: {
        paddingVertical: 12,
        paddingHorizontal: 35,
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: '#1A1A1A',
    },
    secondaryButtonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#1A1A1A',
    },
    primaryButton: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#F5F5F5',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    primaryButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    buttonLogo: {
        width: 45,
        height: 45,
    },
    primaryButtonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
    },
    chevronContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})
