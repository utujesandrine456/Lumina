import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import { useRouter, Link } from 'expo-router';
import {MonoText} from '@/components/StyledText';
import { Ionicons } from '@expo/vector-icons';


export default function HomeScreen(){
    return(
    <>
        <ScrollView>
            <View>
                <View style={{ display: 'flex', gap: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBlock: 10}}>
                    <Text style={{ fontFamily: 'Satisfy_400Regular', fontSize: 52, fontWeight: '400', textAlign: 'center'}}>Lumina</Text>
                </View>
                <Image source={require("@/assets/images/Logo.png")} style={{ position: 'relative', left:30, top:10}}></Image>
                <View style={{display: 'flex', position: 'relative', top: -60}}>
                    <Image source={require("@/assets/images/HomeImage.png")} style={{marginHorizontal: 'auto'}}></Image>
                    <View style={{position: 'relative', left: -20, top: -50}}>
                        <TouchableOpacity style={{borderColor: 'black', borderWidth: 2, paddingHorizontal: 20, paddingVertical: 10, alignSelf: 'flex-end', borderRadius: 25 }}>
                            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 18}}>Grow Market</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ position: 'relative', top: -60}}>
                    <Text style={{ textAlign: 'center', fontSize: 26, marginHorizontal: 10, fontFamily: 'Poppins_600SemiBold'}}>Find , Book and Rent a Truck to Transport your Crops Easily </Text>
                    <MonoText style={{ textAlign: 'center', fontSize: 20, fontWeight: '500', color: '#5E5E5E', marginBlock: 16}}>Get a truck whenever and wherever you need it to transport your crops </MonoText>
                </View>
                <View style={{marginBottom: 20 }}>
                    <TouchableOpacity style={{paddingHorizontal: 20, paddingVertical: 8, alignSelf: 'center', borderRadius: 50, elevation: 5, shadowColor: '#000', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.25, shadowRadius: 5, display: 'flex', gap: 40,alignItems: 'center', flexDirection: 'row' }}>
                        <Image source={require("@/assets/images/Logo.png")} style={{width: 55, height: 55}}></Image>
                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 20, textAlign: 'center'}}>Get Started</Text>
                        <Link href="/signup">
                            <TouchableOpacity>
                                <View style={{ display: 'flex', flexDirection:'row'}}>
                                    <Ionicons name="chevron-forward" size={26} color="#BDBDBD" style={{marginRight: -5}} />
                                    <Ionicons name="chevron-forward" size={26} color="#7A7A7A" style={{marginRight: -5}}/>
                                    <Ionicons name="chevron-forward" size={26} color="black" />
                                </View>
                            </TouchableOpacity>
                        </Link>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
            
    </>
    )
}