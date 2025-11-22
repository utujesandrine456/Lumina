import React  from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, StyleSheet} from "react-native";
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {useState} from 'react';


export default function Login(){
    return (
        <>
            <ScrollView contentContainerStyle={{ }}>
                <View style={{ paddingBlock: 30, backgroundColor: 'white'}}>
                    <View style={{ display: 'flex', gap: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={require("@/assets/images/Logo.png")} style={{}}></Image>
                        <Text style={{ fontFamily: 'Satisfy_400Regular', fontSize: 52, fontWeight: '400', textAlign: 'center'}}>Lumina</Text>
                    </View>
                    
                    <View style={{ marginHorizontal: 30, marginBlock: 30}}> 
                        <Text style={styles.label}>Phone:</Text>
                        <TextInput style={styles.input} placeholder="Phone" />
                        <Text style={styles.label}>Crop Name:</Text>
                        <TextInput style={styles.input} placeholder="Crop Name"   />
                        <Text style={styles.label}>Quantity:</Text>
                        <TextInput style={styles.input} placeholder="Quantity"   />
                    </View>
                    
                    <Link href="/location" asChild>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonTextcontainer}>Submit</Text>
                        </TouchableOpacity>
                    </Link>
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
        backgroundColor: "#fff",
        color: '#CCCCCC'
    },
    button: {
        backgroundColor: "#000",
        paddingVertical: 15,
        borderRadius: 10,
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