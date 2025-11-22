import React  from 'react';
import { View, Text, ImageBackground, Dimensions, TouchableOpacity, TextInput, StyleSheet} from "react-native";
const screenWidth = Dimensions.get('window').width; 
const screenHeight = Dimensions.get('window').height; 
import { Link } from 'expo-router';
import Icon from "react-native-vector-icons/Ionicons";
import BottomBar from '@/components/BottomBar';
import { MonoText } from '@/components/StyledText';
import { Ionicons } from '@expo/vector-icons';




export default function Location(){
    return (
    <> 
        <View>
            <View>
                <ImageBackground source={require('@/assets/images/Location.png')} style={{ height: screenHeight -64, width: screenWidth}} ></ImageBackground>
            </View>
            <View style={{ position:'absolute', top: '14%', left: '5%'}}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width: 60,backgroundColor:'#23dd2332', height: 60, display: 'flex', flexDirection: 'row', gap: 10, marginLeft: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 50}}>
                        <View style={{width: 40, height: 40, backgroundColor: '#23DD23', alignItems: 'center', justifyContent: 'center',borderRadius: 50}}>
                            <Ionicons name="location-outline" size={22} color="#fff" />
                        </View>
                    </View>
                    <MonoText style={{ color: '#000', textAlign: 'center', marginLeft: 10, marginTop: 20, fontSize: 16}}>Musanze, Ruhengeri, Kinigi</MonoText>
                </View>
                
                <View style={{flexDirection: 'row', marginTop: 120}}>
                    <View style={{width: 60, height: 60,display: 'flex', backgroundColor: '#dd23231f', flexDirection: 'row', gap: 10, marginLeft: 35, alignItems: 'center', justifyContent: 'center',borderRadius: 50 }}>
                        <View style={{width: 40, height: 40, backgroundColor: '#DD2323', alignItems: 'center', justifyContent: 'center', borderRadius: 50}}>
                            <Ionicons name="location-outline" size={22} color="#fff" />
                        </View>
                    </View>
                    <MonoText style={{color: '#000', textAlign: 'center', marginLeft: 10, marginTop: 20, fontSize: 16}}>Kigali, Nyabugogo Market</MonoText>
                </View>
            </View>
            <View style={{position:'absolute', top: '60%', alignItems: 'center', alignSelf: 'center', padding: 20, borderRadius: 10}}>
                <Link href="/payment" asChild>
                    <TouchableOpacity style={{ backgroundColor: 'black', paddingHorizontal: 90, paddingVertical: 12, borderRadius: 10}} >
                        <Text style={{fontFamily: 'Poppins_500Medium', color: 'white', fontSize: 18}}>Pay Now</Text>
                    </TouchableOpacity>
                </Link>
            </View>
            <BottomBar/>
        </View>
    </>
    )
}

