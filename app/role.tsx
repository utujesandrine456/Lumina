import { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  Easing,
  Platform
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function RoleScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 700,
                easing: Easing.out(Easing.back(1)),
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }],},]}>
                <View style={styles.heroBackground} />
                <Text style={styles.title}>Choose Your Role</Text>
                <Text style={styles.subtitle}>How would you like to join Lumina?</Text>
            </Animated.View>

            <View style={styles.cardsContainer}>
                <Link href="/register" asChild>
                    <TouchableOpacity activeOpacity={0.7}>
                        <Animated.View style={[
                            styles.card,
                            styles.cardElevated,
                            {
                                opacity: fadeAnim,
                                transform: [{
                                    translateY: slideAnim.interpolate({
                                        inputRange: [0, 30],
                                        outputRange: [0, 40]
                                    })
                                }]
                            }
                        ]}>
                            <View style={[styles.iconContainer, styles.iconDark]}>
                                <Ionicons name="people" size={28} color="#FFFFFF" />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>Cooperative Officer</Text>
                                <Text style={styles.cardDescription}>
                                    Register farmers, book drivers, manage transport operations.
                                </Text>
                            </View>
                            <View style={styles.chevronContainer}>
                                <Ionicons name="chevron-forward" size={22} color="#000" />
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                </Link>

                <Link href="/register" asChild>
                    <TouchableOpacity activeOpacity={0.7}>
                        <Animated.View style={[
                            styles.card,
                            styles.cardElevated,
                            {
                                opacity: fadeAnim,
                                transform: [{
                                    translateY: slideAnim.interpolate({
                                        inputRange: [0, 30],
                                        outputRange: [0, 60]
                                    })
                                }]
                            }
                        ]}>
                            <View style={[styles.iconContainer, styles.iconDark]}>
                                <Ionicons name="car" size={28} color="#FFFFFF" />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>Cooperative Driver</Text>
                                <Text style={styles.cardDescription}>
                                    Receive trip requests, update trip status and manage your schedule.
                                </Text>
                            </View>
                            <View style={styles.chevronContainer}>
                                <Ionicons name="chevron-forward" size={22} color="#000" />
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                </Link>
            </View>
                        
        </SafeAreaView> 
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        ...(isWeb && {
            maxWidth: 400,
            alignSelf: 'center',
            width: '100%'
        })
    },

    heroBackground: {
        position: 'absolute',
        width: isWeb ? width : width * 1.4,
        height: isWeb ? height * 0.4 : height * 0.55,
        backgroundColor: '#000',
        borderBottomLeftRadius: 300,
        borderBottomRightRadius: 300,
        top: isWeb ? -height * 0.2 : -height * 0.3,
    },

    header: {
        width: '100%',
        paddingTop: isWeb ? 40 : 60,
        paddingBottom: isWeb ? 30 : 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    title: {
        fontFamily: 'Poppins_700Bold',
        fontSize: isWeb ? 28 : 34,
        color: '#FFFFFF',
        marginBottom: 6,
        textAlign: 'center',
        letterSpacing: 0.3,
    },

    subtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 15,
        color: 'rgba(255,255,255,0.75)',
        textAlign: 'center',
        lineHeight: 20,
    },

    cardsContainer: {
        width: '100%',
        paddingHorizontal: 24,
        marginTop: 30,
        gap: 20,
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 26,
        minHeight: 150,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.04)',
    },

    cardElevated: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 8,
    },

    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 18,
    },

    iconDark: {
        backgroundColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },

    cardContent: {
        flex: 1,
    },

    cardTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 19,
        color: '#000',
        marginBottom: 6,
    },

    cardDescription: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },

    chevronContainer: {
        padding: 10,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.04)',
    },
});
