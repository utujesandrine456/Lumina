import React  from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, StyleSheet} from "react-native";
import { MonoText } from '@/components/StyledText';
import { Link } from 'expo-router';
import TopBar from '@/components/TopBar';
import { FontAwesome } from '@expo/vector-icons';


export default function Trucks(){
    type TruckName = 'Daihatsu' | 'Volvo' | 'Long Shashi' | 'Toyota' | 'Land Cruiser' | 'Land Lover';

    const images:Record<TruckName, any> = {
        Daihatsu: require("@/assets/images/daihatsu.jpg"),
        Volvo: require("@/assets/images/daihatsu.jpg"),
        "Long Shashi": require("@/assets/images/daihatsu.jpg"),
        Toyota: require("@/assets/images/daihatsu.jpg"),
        "Land Cruiser": require("@/assets/images/daihatsu.jpg"),
        "Land Lover": require("@/assets/images/daihatsu.jpg"),
    };


    const cropsdata: {id: number,name: TruckName, price: string}[] = [
        {id: 1, name: 'Daihatsu', price: '60 Km/hr'},
        {id: 2, name: 'Volvo', price: '120 Km/hr'},
        {id: 3, name: 'Long Shashi', price: '58 Km/hr'},
        {id: 4, name: 'Toyota', price: '30 Km/hr'},
        {id: 5, name: 'Land Cruiser', price: '89 Km/hr'},
        {id: 6, name: 'Land Lover', price: '68 Km/hr'}
    ]


    return (
        <>  
            <TopBar title='Trucks' ></TopBar>
            <ScrollView>
                <View style={{ backgroundColor: 'white'}}>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', textAlign: 'center', fontSize: 28, marginBlock: 20}}>Choose A Truck</Text>
                    <View style={{flexDirection: 'row',flexWrap: 'wrap',justifyContent: 'space-between',paddingHorizontal: 10,}}>
                        {cropsdata.map((crop) => (
                            <View key={crop.id} style={{ width: '48%', backgroundColor: '#fff', borderRadius: 10, marginBottom: 15, padding: 10, alignItems: 'center', elevation: 3, }}>
                                <Image source={images[crop.name]} style={{ width: 140, height: 90, borderRadius: 20 }} resizeMode="cover"/>
                                <MonoText style={{ fontWeight: '600', marginTop: 10 }}>{crop.name}</MonoText>
                                <MonoText style={{ color: 'gray', fontSize: 14 }}>{crop.price}</MonoText>
                            </View>
                        ))}

                        <Text style={{ fontSize: 26, fontFamily: 'Poppins_600SemiBold', textAlign: 'center', marginBlock: 30}}>Book A Transport For Your Crops ?</Text>
                        <View style={{marginBottom: 20 , marginHorizontal: 'auto'}}>
                            <FontAwesome name="hand-o-down" size={60} color="black" style={{transform: [ { translateY: -20}] , marginBlock: 20, marginHorizontal: 'auto'}} />
                            <TouchableOpacity style={{paddingHorizontal: 20, paddingVertical: 8, alignSelf: 'center', borderRadius: 50, elevation: 5, shadowColor: '#000', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.25, shadowRadius: 5, display: 'flex', gap: 40, alignItems: 'center', flexDirection: 'row' }}>
                                <Image source={require("@/assets/images/Logo.png")} style={{width: 55, height: 55}}></Image>
                                <Link href="/signup"><Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 20, textAlign: 'center'}}>Book Transport</Text></Link>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </>
    )
}