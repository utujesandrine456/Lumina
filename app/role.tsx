import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform, Animated, Easing } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const AnimatedBubble = ({ style, size, duration = 4000, delay = 0, colors }: { style: any, size: number, duration?: number, delay?: number, colors: readonly [string, string, ...string[]] }) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const floatAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(translateY, {
                    toValue: -20,
                    duration: duration,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                    delay: delay,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: duration,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        const breatheAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.05,
                    duration: duration * 1.2,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                    delay: delay,
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: duration * 1.2,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        floatAnimation.start();
        breatheAnimation.start();

        return () => {
            floatAnimation.stop();
            breatheAnimation.stop();
        };
    }, []);

    return (
        <Animated.View style={[
            style,
            {
                width: size,
                height: size,
                borderRadius: size / 2,
                transform: [{ translateY }, { scale }],
                overflow: 'hidden',
            }
        ]}>
            <LinearGradient
                colors={colors}
                style={{ flex: 1 }}
                start={{ x: 0.2, y: 0.2 }}
                end={{ x: 0.8, y: 0.8 }}
            />
        </Animated.View>
    );
};

export default function RoleScreen() {
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
                <AnimatedBubble
                    size={280}
                    colors={['#000', '#000']}
                    style={{ position: 'absolute', top: -80, left: -60 }}
                    duration={6000}
                    delay={0}
                />
                <AnimatedBubble
                    size={240}
                    colors={['#000', '#000']}
                    style={{ position: 'absolute', top: 0, right: -40 }}
                    duration={7000}
                    delay={1000}
                />
            </View>

            <View style={styles.contentContainer}>
                <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <Text style={styles.title}>Choose Your Role</Text>
                    <Text style={styles.subtitle}>How would you like to join Lumina?</Text>
                </Animated.View>

                <View style={styles.cardsContainer}>
                    <Link href="/register" asChild>
                        <TouchableOpacity activeOpacity={0.8}>
                            <Animated.View style={[
                                styles.card,
                                {
                                    opacity: fadeAnim,
                                    transform: [{
                                        translateY: slideAnim.interpolate({
                                            inputRange: [0, 50],
                                            outputRange: [0, 80]
                                        })
                                    }]
                                }
                            ]}>
                                <View style={[styles.iconContainer, { backgroundColor: '#fff', borderWidth: 1, borderBlockColor: '#000' }]}>
                                    <Ionicons name="people" size={32} color="#000" />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>Cooperative Officer</Text>
                                    <Text style={styles.cardDescription}>Register farmers, book drivers, manage transport.</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#000" />
                            </Animated.View>
                        </TouchableOpacity>
                    </Link>

                    <Link href="/register" asChild>
                        <TouchableOpacity activeOpacity={0.8}>
                            <Animated.View style={[
                                styles.card,
                                {
                                    opacity: fadeAnim,
                                    transform: [{
                                        translateY: slideAnim.interpolate({
                                            inputRange: [0, 50],
                                            outputRange: [0, 100]
                                        })
                                    }]
                                }
                            ]}>
                                <View style={[styles.iconContainer, { backgroundColor: '#fff', borderWidth: 1, borderBlockColor: '#000' }]}>
                                    <Ionicons name="car" size={32} color="#000" />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>Cooperative Driver</Text>
                                    <Text style={styles.cardDescription}>Receive trip requests, update trip status and register drivers.</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#000" />
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
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 120,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 28,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#ccc',
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
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.05)',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 15,
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
        fontSize: 28,
        color: '#1A1A1A',
        textAlign: 'center',
    },
});