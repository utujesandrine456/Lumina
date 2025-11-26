import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import * as Location from 'expo-location';
const screenHeight = Dimensions.get('window').height;
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomBar from '@/components/BottomBar';
import UniversalMap from '@/components/UniversalMap';

export default function Landing() {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: -1.5000, 
    longitude: 29.8000,
  });
  
  const [region, setRegion] = useState({
    latitude: -1.5000, 
    longitude: 29.8000,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [locationPermission, setLocationPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  const mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#f5f5f5" }]
    },
    {
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#616161" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#f5f5f5" }]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#bdbdbd" }]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{ "color": "#eeeeee" }]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#757575" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [{ "color": "#e5e5e5" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9e9e9e" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#ffffff" }]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#757575" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{ "color": "#dadada" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#616161" }]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9e9e9e" }]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [{ "color": "#e5e5e5" }]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [{ "color": "#eeeeee" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#c9c9c9" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9e9e9e" }]
    }
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to track your position');
        return;
      }
      
      setLocationPermission(true);

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      
      const { latitude, longitude } = location.coords;
      setCurrentLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10, 
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setCurrentLocation({ latitude, longitude });
        }
      );
      return () => subscription.remove();
    })();
  }, []);

  return (
    <View style={{ height: screenHeight - 64}}>
      <UniversalMap style={styles.map} initialRegion={region}  region={region} customMapStyle={mapStyle}>
        <UniversalMap.Marker coordinate={currentLocation} tracksViewChanges={false} anchor={{ x: 0.5, y: 0.5 }}>
        </UniversalMap.Marker>
      </UniversalMap>

      <View style={styles.bookingCard}>
        <Link href="/crops" asChild>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Now</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </Link>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput placeholder='Search destination...' placeholderTextColor="#999" style={styles.searchInput} />
        </TouchableOpacity>
      </View>
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  bookingCard: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 30,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  bookButton: {
    width: '100%',
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bookButtonText: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#d1d1d1ff',
    marginVertical: 20,
  },
  searchContainer: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1.4,
    borderColor: '#616161ff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 12,
  },
  searchInput: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    flex: 1,
    color: '#333',
    outlineColor: 'white'
  },
});