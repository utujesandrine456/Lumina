import React from 'react';
import { View, Text, Dimensions, TouchableOpacity, TextInput } from "react-native";
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomBar from '@/components/BottomBar';
import UniversalMap from '@/components/UniversalMap';


export default function Landing() {
  return (
    <View style={{ height: screenHeight }}>
      
      <UniversalMap
        style={{ height: screenHeight - 64, width: screenWidth }}
        initialRegion={{
            latitude: -1.9441,
            longitude: 30.0619,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        }}
        >
        <UniversalMap.Marker
            coordinate={{ latitude: -1.9441, longitude: 30.0619 }}
            title="Your Location"
            description="Kigali, Rwanda"
        />
        </UniversalMap>


      {/* Center pulse effect */}
      <View style={{ position: 'absolute', top: '30%', left: '30%' }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 120, height: 120, backgroundColor: '#00000032', borderRadius: 60, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 90, height: 90, backgroundColor: '#00000032', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 60, height: 60, backgroundColor: '#000', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="location-outline" size={22} color="#fff" />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom controls */}
      <View style={{ position: 'absolute', alignSelf: 'center', top: '65%', backgroundColor: 'rgba(255,255,255,0.9)', padding: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#000' }}>
        
        {/* Book Now button */}
        <Link href="/crops" asChild>
          <TouchableOpacity style={{ width: '95%', backgroundColor: 'black', paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontFamily: 'Poppins_500Medium', fontSize: 18 }}>Book Now</Text>
          </TouchableOpacity>
        </Link>

        {/* Change destination */}
        <TouchableOpacity style={{ width: '95%', borderRadius: 6, borderWidth: 0.5, borderColor: '#000', marginTop: 20, paddingHorizontal: 30, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
          <TextInput placeholder='Change Destination' style={{ fontFamily: 'Poppins_500Medium', fontSize: 18, flex: 1 }} />
          <Ionicons name="search" size={20} color="#000" />
        </TouchableOpacity>

      </View>

      {/* Bottom navigation bar */}
      <BottomBar />

    </View>
  );
}
