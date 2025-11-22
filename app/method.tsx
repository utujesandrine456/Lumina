import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet,} from "react-native";
import { MonoText } from '@/components/StyledText';







const styles = StyleSheet.create({
    
    
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