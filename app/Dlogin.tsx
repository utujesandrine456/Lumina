import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions, TextInput, StyleSheet } from "react-native";
import { MonoText } from '@/components/StyledText';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useDriverStore } from '@/constants/store';


export default function Login() {
    const { setUserRole } = useDriverStore();
    const [remember, setRemember] = useState(false);

    return (
        <>
            <ScrollView contentContainerStyle={{}}>
                <View style={{ paddingBlock: 30, backgroundColor: 'white' }}>
                    <View style={{ display: 'flex', gap: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={require("@/assets/images/Logo.png")} style={{}}></Image>
                        <Text style={{ fontFamily: 'Satisfy_400Regular', fontSize: 52, fontWeight: '400', textAlign: 'center' }}>Lumina</Text>
                    </View>

                    <Text style={styles.titlecontainer}>Login</Text>
                    <MonoText style={{ fontSize: 16, textAlign: 'center', color: '#5E5E5E', marginBlock: 10, marginHorizontal: 5 }}>Login to get linked with your data on your dashboard.</MonoText>
                    <View style={{ marginHorizontal: 30, marginBlock: 30 }}>
                        <Text style={styles.label}>National ID:</Text>
                        <TextInput style={styles.input} placeholder="National ID" keyboardType="email-address" />
                        <Text style={styles.label}>Password:</Text>
                        <TextInput style={styles.input} placeholder="Password" />
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRemember(!remember)}>
                            <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
                                {remember && <Ionicons name="checkmark" size={16} color="white" />}
                            </View>
                            <MonoText style={styles.checkboxLabel}>Remember me</MonoText>
                        </TouchableOpacity>


                        <TouchableOpacity>
                            <MonoText style={styles.forgot}>Forgot Password?</MonoText>
                        </TouchableOpacity>
                    </View>

                    <Link href="/driverdashboard" asChild>
                        <TouchableOpacity style={styles.button} onPress={() => setUserRole('driver')}>
                            <Text style={styles.buttonTextcontainer}>Login</Text>
                        </TouchableOpacity>
                    </Link>

                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBlock: 20 }}>
                        <View style={{ width: 150, height: 1, backgroundColor: '#C1C1C1' }}></View>
                        <MonoText style={{ color: '#767676ff' }}>or</MonoText>
                        <View style={{ width: 150, height: 1, backgroundColor: '#C1C1C1' }}></View>
                    </View>

                    <View>
                        <TouchableOpacity style={styles.iconButton}>
                            <Image source={require('@/assets/images/download.jpeg')} style={{ width: 40, height: 40 }} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: '#767676ff', textAlign: 'center', marginBlock: 20, fontSize: 17, fontFamily: 'Poppins_500Medium' }}>Don’t have an  Account? <Link href='/Dsignup'><MonoText style={{ textDecorationLine: 'underline', marginLeft: 10, fontWeight: 'bold' }}>Sign up</MonoText></Link></Text>

                </View>
            </ScrollView>
        </>
    )
}


const styles = StyleSheet.create({
    label: {
        fontSize: 18,
        fontFamily: 'Poppins_500Medium',
        marginBlock: 12,
    },
    titlecontainer: {
        fontSize: 30,
        fontFamily: "Poppins_600SemiBold",
        marginBlock: 15,
        textAlign: "center",
        paddingBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#b5b5b5ff",
        borderRadius: 30,
        padding: 12,
        paddingLeft: 20,
        marginBottom: 14,
        fontSize: 15,
        fontFamily: "Poppins_400Regular",
        backgroundColor: "#fff",
        color: '#3a3a3aff'
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        paddingVertical: 10,
        borderRadius: 30,
        paddingHorizontal: 45,
        alignSelf: 'center'
    },
    buttonTextcontainer: {
        color: "#fff",
        fontSize: 17,
        fontFamily: "Poppins_500Medium",
        marginLeft: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 30,
        marginBottom: 20
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#a0a0a0ff',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    checkboxLabel: {
        fontSize: 15,
    },
    forgot: {
        fontSize: 15,
        color: '#000',
    },
    iconButton: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
}) 