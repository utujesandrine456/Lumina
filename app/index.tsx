import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { MonoText } from '@/components/StyledText';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
    return (
        <>
            <ScrollView>
                <View>
                    <View style={{ marginBlock: 10 }}>
                        <Text style={{ fontFamily: 'Satisfy_400Regular', fontSize: 60, textAlign: 'center' }}>Lumina</Text>
                    </View>

                    <View style={{ alignItems: "flex-start", marginBottom: -80, marginLeft: 30 }}>
                        <Image source={require("../assets/images/Logo.png")} style={{ width: 60, height: 60 }} />
                    </View>

                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ width: width * 0.91, borderRadius: 20 }}>
                            <Image source={require("../assets/images/Home.png")} style={{ width: '100%', borderRadius: 20 }}resizeMode="contain"/>
                        </View>
                    </View>

                    <Link href="/register" asChild>
                        <View style={{ marginRight: 10 , alignItems: 'flex-end' }}>
                            <TouchableOpacity style={{ borderColor: 'black', borderWidth: 2, paddingHorizontal: 20, paddingVertical: 10, alignSelf: 'flex-end', borderRadius: 25, marginTop: -70 }}>
                                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 18 }}>Grow Market</Text>
                            </TouchableOpacity>
                        </View>
                    </Link>

                    <View style={{ marginBlock: 10 }}>
                        <Text style={{ textAlign: 'center', fontSize: 22, marginHorizontal: 10, fontFamily: 'Poppins_600SemiBold' }}>Find , Book and Rent a Truck to Transport your Crops Easily </Text>
                        <MonoText style={{ textAlign: 'center', fontSize: 16, fontWeight: '500', color: '#5E5E5E', marginBlock: 10 }}>Get a truck whenever and wherever you need it to transport your crops </MonoText>
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Link href="/register" asChild>
                            <TouchableOpacity style={{ backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 6, alignSelf: 'center', borderRadius: 50, elevation: 5, shadowColor: '#000', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.25, shadowRadius: 5, display: 'flex', gap: 30, alignItems: 'center', flexDirection: 'row' }}>
                                <Image source={require("@/assets/images/Logo.png")} style={{ width: 55, height: 55 }}></Image>
                                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 20, textAlign: 'center' }}>Get Started</Text>
                                <TouchableOpacity>
                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Ionicons name="chevron-forward" size={26} color="#BDBDBD" style={{ marginRight: -6 }} />
                                        <Ionicons name="chevron-forward" size={26} color="#7A7A7A" style={{ marginRight: -6 }} />
                                        <Ionicons name="chevron-forward" size={26} color="black" />
                                    </View>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </>
    )
}

