import React  from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, StyleSheet} from "react-native";
import { MonoText } from '@/components/StyledText';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {useState} from 'react';


export default function FSignup(){
    const [remember, setRemember] = useState(false);

    return (
    <>
        <ScrollView contentContainerStyle={{ }}>
            <View style={{ paddingBlock: 30, backgroundColor: 'white'}}>
                <View style={{ display: 'flex', gap: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={require("@/assets/images/Logo.png")} ></Image>
                    <Text style={{ fontFamily: 'Satisfy_400Regular', fontSize: 52, fontWeight: '400'}}>Lumina</Text>
                </View>
                
                <Text style={styles.titlecontainer}>Sign Up As Farmer</Text>
                <MonoText style={{ fontSize: 16, textAlign: 'center', color: '#5E5E5E', marginBlock: 10, marginHorizontal: 5}}>Sign up for free so as to be able to transport your crops to any location.</MonoText>
                <View style={{ marginHorizontal: 30, marginBlock: 30}}> 
                    <Text style={styles.label}>Username:</Text>
                    <TextInput style={styles.input} placeholder="Username"/>
                    <Text style={styles.label}>Phone Number:</Text>
                    <TextInput style={styles.input} placeholder="Phone Number"  keyboardType="email-address" />
                    <Text style={styles.label}>Password:</Text>
                    <TextInput style={styles.input} placeholder="Password"   />
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRemember(!remember)}>
                        <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
                            {remember && <Ionicons name="checkmark" size={16} color="white" />}
                        </View>
                        <MonoText style={styles.checkboxLabel}>Remember me</MonoText>
                    </TouchableOpacity>
                </View>

                <Link href="/otp" style={{marginHorizontal: 'auto'}} asChild>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonTextcontainer}>Sign Up</Text>
                    </TouchableOpacity>
                </Link>
                
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBlock: 20}}>
                    <View style={{ width: 150, height:1, backgroundColor: '#C1C1C1'}}></View>
                    <MonoText style={{ color: '#767676ff'}}>or</MonoText>
                    <View style={{ width: 150, height:1, backgroundColor: '#C1C1C1'}}></View>
                </View>
                
                <View>
                    <TouchableOpacity style={styles.iconButton}>
                        <Image source={require('@/assets/images/download.jpeg')} style={{ width: 40, height: 40}}/>
                    </TouchableOpacity>
                </View>
                <Text style={{ color: '#767676ff', textAlign: 'center', marginBlock: 20, fontSize: 17, fontFamily: 'Poppins_500Medium'}}>Already have an  Account? <Link href="/Flogin"><MonoText style={{ textDecorationLine: 'underline', marginLeft: 10, fontWeight: 'bold'}}>Login</MonoText></Link></Text>
            </View>
        </ScrollView>
    </>
    )
}


const styles  = StyleSheet.create({
    label:{
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
        backgroundColor: "#F9FAFB",
        color: '#CCCCCC'
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
    iconButton: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
}) 