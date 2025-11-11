import React  from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions} from "react-native";
import { MonoText } from '@/components/StyledText';
import TopBar from '@/components/TopBar';
const screenWidth = Dimensions.get('window').width; 
import { Ionicons } from '@expo/vector-icons';


export default function Location(){
    return (
        <> 
            <TopBar title="Location"></TopBar>
            <ScrollView>
                <View>
                    <Image source={require('@/assets/images/Location.png')} style={{ height: 350 , width: screenWidth}} ></Image>
                </View>
                <View style={{ backgroundColor: 'black', borderTopRightRadius: 30, borderTopLeftRadius: 30}}>
                    <View style={{ width: 40, height: 6, borderRadius: 10, backgroundColor: '#D9D9D9', marginBlock: 15, marginHorizontal: 'auto'}}></View>
                    <View style={{marginHorizontal: 10, backgroundColor: 'white', paddingHorizontal: 30, borderRadius: 20, marginBlock: 20, display: 'flex', flexDirection: 'row', gap: 20}}>
                        <View style={{ justifyContent: 'center'}}>
                            <Text style={{fontFamily: 'Poppins_600SemiBold', fontSize: 20}}>Volvo Truck</Text>
                            <MonoText style={{ fontSize: 16, color: 'black', gap: 10}}>Prack: <Text style={{ fontSize: 13, color: '#5b5b5bff'}}>RAD 123 F</Text></MonoText>
                            <MonoText style={{ fontSize: 16, color: 'black'}}>Capacity: <Text style={{ fontSize: 13, color: '#5b5b5bff'}}>12.5 Ton</Text></MonoText>
                        </View>
                        <Image source={require('@/assets/images/daihatsu.jpg')} style={{ width: 195, height: 100, borderTopLeftRadius: 100, borderBottomRightRadius: 20, borderTopRightRadius: 20}} resizeMode="cover"></Image>
                    </View>
                    <View style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 20, marginHorizontal: 20 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 60, marginBlock: 10}}>
                            <MonoText style={{fontWeight: 'bold', color: '#5b5b5bff'}} >Distance</MonoText>
                            <MonoText style={{fontWeight: 'bold', color: '#5b5b5bff'}}>Time</MonoText>
                            <MonoText style={{fontWeight: 'bold', color: '#5b5b5bff'}}>Total Fare</MonoText>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 60, marginBottom: 15}}>
                            <MonoText>40.8 Km</MonoText>
                            <MonoText>35 min</MonoText>
                            <MonoText>60,000 Frw</MonoText>
                        </View>
                    </View>
                    <View style={{ display: 'flex', marginHorizontal: 50, marginBlock: 20}}>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 10}}>
                            <Ionicons name="location-outline" size={32} color="#23DD23" />
                            <MonoText style={{color: 'white', fontSize: 19, fontWeight: 'bold'}}>Pick Up</MonoText>
                        </View>
                        <MonoText style={{ color: '#C8C8C8', textAlign: 'center'}}>Musanze, Ruhengeri, Kinigi</MonoText>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 10}}>
                            <Ionicons name="location-outline" size={32} color="#DD2323" />
                            <MonoText style={{ color: 'white', fontSize: 19, fontWeight: 'bold'}}>Drop Off</MonoText>
                        </View>
                        <MonoText style={{color: '#C8C8C8', textAlign: 'center'}}>Kigali, Nyabugogo Market</MonoText>
                    </View>
                    <View style={{marginBlock: 20}}>
                        <TouchableOpacity style={{backgroundColor: 'white', paddingHorizontal: 24, paddingVertical: 12, alignSelf: 'center', borderRadius: 25 }}>
                            <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 18}}>Agree & Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    )
}