import React  from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, StyleSheet} from "react-native";
import { MonoText } from '@/components/StyledText';
import { Link } from 'expo-router';
import TopBar from '@/components/TopBar';
import { FontAwesome } from '@expo/vector-icons';


export default function Crops(){
    type CropName = 'Maize' | 'Beans' | 'Potato' | 'Sweet Potato' | 'Rice' | 'Casava';

    const images:Record<CropName, any> = {
        Maize: require("@/assets/images/maize.jpeg"),
        Beans: require("@/assets/images/beans.jpg"),
        Potato: require("@/assets/images/potato.jpeg"),
        "Sweet Potato": require("@/assets/images/sweet-potatoes.jpg"),
        Rice: require("@/assets/images/rice.jpeg"),
        Casava: require("@/assets/images/casava.jpeg"),
    };


    const cropsdata: {id: number,name: CropName, price: string}[] = [
        {id: 1, name: 'Maize', price: '13 Frw/kg'},
        {id: 2, name: 'Beans', price: '10 Frw/kg'},
        {id: 3, name: 'Potato', price: '20 Frw/kg'},
        {id: 4, name: 'Sweet Potato', price: '16 Frw/kg'},
        {id: 5, name: 'Rice', price: '22 Frw/kg'},
        {id: 6, name: 'Casava', price: '11 Frw/kg'}
    ]


    return (
        <>  
            <TopBar title='Crops' ></TopBar>
            <ScrollView>
                <View style={{ backgroundColor: 'white'}}>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', textAlign: 'center', fontSize: 28, marginBlock: 20}}>Transported Crops</Text>
                    <View style={{flexDirection: 'row',flexWrap: 'wrap',justifyContent: 'space-between',paddingHorizontal: 10,}}>
                        {cropsdata.map((crop) => (
                            <View key={crop.id} style={{ width: '48%', backgroundColor: '#fff', borderRadius: 10, marginBottom: 15, padding: 10, alignItems: 'center', elevation: 3, }}>
                                <Image source={images[crop.name]} style={{ width: 120, height: 80, borderRadius: 20 }} resizeMode="cover"/>
                                <MonoText style={{ fontWeight: '600', marginTop: 10 }}>{crop.name}</MonoText>
                                <MonoText style={{ color: 'gray', fontSize: 14 }}>{crop.price}</MonoText>
                            </View>
                        ))}

                        <Text style={{ fontSize: 26, fontFamily: 'Poppins_600SemiBold', textAlign: 'center', marginBlock: 30}}>Want To Transport Your Crops ?</Text>
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