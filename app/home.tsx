import React  from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity} from "react-native";
import TopBar from '@/components/TopBar';
const screenWidth = Dimensions.get('window').width; 
const screenHeight = Dimensions.get('window').height; 
import Icon from "react-native-vector-icons/FontAwesome5";
import { Link } from 'expo-router';
import BottomBar from '@/components/BottomBar';


export default function Location(){
    return (
    <> 
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black'}}>
            <View>
                <Image source={require('@/assets/images/Location.png')} style={{ height: screenHeight - 65 , width: screenWidth}} ></Image>
                <View style={{ height: screenHeight, backgroundColor: '#0000001a', position: 'absolute', width: screenWidth}}></View>
            </View>
            <View style={{ backgroundColor: 'white', position: 'absolute', alignItems: 'center', marginHorizontal: 10, padding: 20, borderRadius: 30 }}>
                <View style={{width: 70, height: 70, backgroundColor: '#0000001a', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBlock: 20}}>
                     <View style={{
                        width: 50,
                        height: 50,
                        backgroundColor: 'black',
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        }}
                    >
                        <Icon name="map-marker-alt" size={24} color="white" />
                    </View>
                </View>
                
                <Text style={{fontFamily: 'Poppins_600SemiBold', fontSize: 28, }}>Enable Your Location</Text>
                <Text style={{fontFamily: 'Poppins_400Regular', textAlign: 'center', color: '#888888ff', marginBlock: 20, fontSize: 17}}>Choose your location to start find the request around you</Text>
                
                <TouchableOpacity style={{ backgroundColor: 'black', paddingHorizontal: 50, paddingVertical: 15, borderRadius: 10}} >
                    <Link href="/landing">
                        <Text style={{fontFamily: 'Poppins_500Medium', color: 'white', fontSize: 17}}>Use my location</Text>
                    </Link>
                </TouchableOpacity>
                <TouchableOpacity style={{marginBlock: 20}} >
                    <Link href="/">
                        <Text style={{fontFamily: 'Poppins_500Medium',fontSize: 17}}>Skip for now</Text>
                    </Link>
                </TouchableOpacity>
            </View>
            <BottomBar />
        </View>
    </>
    )
}