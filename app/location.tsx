import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Dimensions, 
  ActivityIndicator,
  ScrollView,
  Keyboard,
  Alert
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import BottomBar from '@/components/BottomBar';
import DriverBottomBar from '@/components/DriverBottomBar';
import { useDriverStore } from '@/constants/store';

const { height, width } = Dimensions.get('window');

// Type definition for the store
interface StoreState {
  userRole: string;
  trip?: any;
  driverLocation?: string;
  setTrip?: (data: any) => void;
  setDriverLocation?: (location: string) => void;
  updateTrip?: (data: any) => void;
  // Add other methods your store might have
}

// Geocoding using OpenStreetMap Nominatim
const geocodeAddress = async (address: string) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=rw&limit=5`,
      {
        headers: {
          'User-Agent': 'YourAppName/1.0'
        }
      }
    );
    const data = await response.json();
    return data.map((item: any) => ({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      address: item.display_name,
      name: item.name || item.display_name.split(',')[0]
    }));
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
};

// Reverse geocoding
const reverseGeocode = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'User-Agent': 'YourAppName/1.0'
        }
      }
    );
    const data = await response.json();
    return data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
};

interface LocationData {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export default function LocationScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const { userRole, setTrip, setDriverLocation } = useDriverStore();
  const isDriver = userRole === 'driver';

  // Location states - NO manual initialization
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [pickupLocation, setPickupLocation] = useState<LocationData | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<LocationData | null>(null);
  const [driverCurrentLocation, setDriverCurrentLocation] = useState<LocationData | null>(null);

  // UI states
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeInput, setActiveInput] = useState<'destination' | null>(null); // Only destination can be searched
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);

  // Get current GPS location and start tracking
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      try {
        // Request permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Location permission is required to use this feature.',
            [{ text: 'OK' }]
          );
          setLoading(false);
          return;
        }

        // Get initial location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });
        
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        };
        
        setCurrentLocation(coords);
        
        // Get address for current location
        const address = await reverseGeocode(coords.latitude, coords.longitude);
        
        // Set location based on user role
        if (!isDriver) {
          // Passenger: Set pickup to current GPS location
          setPickupLocation({ address, coordinates: coords });
        } else {
          // Driver: Set current location to GPS location
          setDriverCurrentLocation({ address, coordinates: coords });
        }
        
        // Start watching location for real-time updates
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // Update every 5 seconds
            distanceInterval: 10, // Update every 10 meters
          },
          async (newLocation) => {
            const newCoords = {
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude
            };
            
            setCurrentLocation(newCoords);
            
            const newAddress = await reverseGeocode(newCoords.latitude, newCoords.longitude);
            
            if (!isDriver) {
              // Update pickup location as user moves
              setPickupLocation({ address: newAddress, coordinates: newCoords });
            } else {
              // Update driver's current location as they move
              setDriverCurrentLocation({ address: newAddress, coordinates: newCoords });
            }
          }
        );
        
        setLocationSubscription(subscription);
        setLoading(false);
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert('Error', 'Unable to get your current location. Please check your GPS settings.');
        setLoading(false);
      }
    })();

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isDriver]);

  // Center map on location
  const centerMapOnLocation = (coordinates: { latitude: number; longitude: number }) => {
    if (mapRef.current && coordinates) {
      mapRef.current.animateToRegion({
        ...coordinates,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    }
  };

  // Handle search with debounce (ONLY for destination)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 3) {
        setIsSearching(true);
        try {
          const results = await geocodeAddress(searchQuery);
          setSearchResults(results);
          setShowSearchResults(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle destination selection from search
  const handleLocationSelect = (result: any) => {
    const locationData: LocationData = {
      address: result.name,
      coordinates: {
        latitude: result.latitude,
        longitude: result.longitude
      }
    };

    setDestinationLocation(locationData);
    centerMapOnLocation(locationData.coordinates);
    setShowSearchResults(false);
    setSearchQuery('');
    setActiveInput(null);
    Keyboard.dismiss();
  };

  // Handle map press to set DESTINATION only
  const handleMapPress = async (event: any) => {
    if (!activeInput) {
      // Allow setting destination by tapping map
      const { latitude, longitude } = event.nativeEvent.coordinate;
      const address = await reverseGeocode(latitude, longitude);
      
      setDestinationLocation({
        address,
        coordinates: { latitude, longitude }
      });
      return;
    }

    if (activeInput === 'destination') {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      const address = await reverseGeocode(latitude, longitude);
      
      setDestinationLocation({
        address,
        coordinates: { latitude, longitude }
      });
      setActiveInput(null);
    }
  };

  // Refresh current GPS location manually
  const handleRefreshLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
      
      const address = await reverseGeocode(coords.latitude, coords.longitude);
      
      if (isDriver) {
        setDriverCurrentLocation({ address, coordinates: coords });
      } else {
        setPickupLocation({ address, coordinates: coords });
      }
      
      centerMapOnLocation(coords);
      Alert.alert('Success', 'Location updated from GPS');
    } catch (error) {
      console.error('Error refreshing location:', error);
      Alert.alert('Error', 'Unable to get your current location');
    }
  };

  // Handle confirm button
  const handleConfirm = () => {
    if (isDriver) {
      if (!driverCurrentLocation) {
        Alert.alert('Error', 'Waiting for GPS location...');
        return;
      }
      
      // Update driver location in store - adjust method name based on your store
      if ('setDriverLocation' in store && typeof store.setDriverLocation === 'function') {
        store.setDriverLocation(driverCurrentLocation.address);
      } else if ('updateDriverLocation' in store && typeof store.updateDriverLocation === 'function') {
        (store as any).updateDriverLocation(driverCurrentLocation.address);
      }
      
      Alert.alert('Success', 'Location updated successfully');
      router.back();
    } else {
      if (!pickupLocation || !destinationLocation) {
        Alert.alert('Error', 'Please set your destination');
        return;
      }
      
      const tripData = {
        pickupLocation: pickupLocation.address,
        destination: destinationLocation.address,
        pickupCoordinates: pickupLocation.coordinates,
        destinationCoordinates: destinationLocation.coordinates,
        ...(trip || {}) // Preserve existing trip data
      };
      
      // Update trip data in store - adjust method name based on your store
      if ('setTrip' in store && typeof store.setTrip === 'function') {
        store.setTrip(tripData);
      } else if ('updateTrip' in store && typeof store.updateTrip === 'function') {
        (store as any).updateTrip(tripData);
      } else if ('setTripData' in store && typeof store.setTripData === 'function') {
        (store as any).setTripData(tripData);
      } else {
        // If no setter method exists, just log the data
        console.log('Trip data:', tripData);
      }
      
      // Navigate to the next screen - UPDATE THIS ROUTE TO MATCH YOUR APP
      router.back(); // Change this to your correct route
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3f3f3f" />
        <Text style={styles.loadingText}>📡 Getting your GPS location...</Text>
        <Text style={styles.subLoadingText}>Make sure GPS is enabled</Text>
      </View>
    );
  }

  const initialRegion = currentLocation ? {
    ...currentLocation,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  } : {
    latitude: -1.9536,
    longitude: 30.0606,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
      >
        {/* Pickup Marker (GPS-based) */}
        {!isDriver && pickupLocation?.coordinates && (
          <Marker
            coordinate={pickupLocation.coordinates}
            title="Your Location (GPS)"
            description={pickupLocation.address}
          >
            <View style={styles.markerContainer}>
              <View style={styles.pulseCircle} />
              <Ionicons name="ellipse" size={30} color="#4CAF50" />
            </View>
          </Marker>
        )}

        {/* Destination Marker */}
        {!isDriver && destinationLocation?.coordinates && (
          <Marker
            coordinate={destinationLocation.coordinates}
            title="Destination"
            description={destinationLocation.address}
          >
            <View style={styles.markerContainer}>
              <Ionicons name="location" size={40} color="#F44336" />
            </View>
          </Marker>
        )}

        {/* Route line */}
        {!isDriver && pickupLocation?.coordinates && destinationLocation?.coordinates && (
          <Polyline
            coordinates={[pickupLocation.coordinates, destinationLocation.coordinates]}
            strokeColor="#2196F3"
            strokeWidth={3}
            lineDashPattern={[5, 5]}
          />
        )}

        {/* Driver Current Location Marker (GPS-based) */}
        {isDriver && driverCurrentLocation?.coordinates && (
          <Marker
            coordinate={driverCurrentLocation.coordinates}
            title="Your Location (GPS)"
            description={driverCurrentLocation.address}
          >
            <View style={styles.markerContainer}>
              <View style={styles.pulseCircle} />
              <Ionicons name="car" size={35} color="#2196F3" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity 
            onPress={handleRefreshLocation}
            style={styles.refreshButton}
          >
            <Ionicons name="refresh" size={20} color="#2196F3" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => {
              if (isDriver && driverCurrentLocation?.coordinates) {
                centerMapOnLocation(driverCurrentLocation.coordinates);
              } else if (pickupLocation?.coordinates) {
                centerMapOnLocation(pickupLocation.coordinates);
              }
            }}
            style={styles.recenterButton}
          >
            <Ionicons name="locate" size={20} color="#2196F3" />
          </TouchableOpacity>
        </View>
      </View>

      {/* GPS Status Indicator */}
      <View style={styles.gpsIndicator}>
        <View style={styles.gpsIndicatorDot} />
        <Text style={styles.gpsIndicatorText}>Live GPS</Text>
      </View>

      {/* Search Results Overlay (Destination only) */}
      {showSearchResults && searchResults.length > 0 && (
        <Animated.View 
          entering={FadeInDown.duration(300)}
          style={styles.searchResultsContainer}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            {searchResults.map((result, index) => (
              <TouchableOpacity
                key={index}
                style={styles.searchResultItem}
                onPress={() => handleLocationSelect(result)}
              >
                <Ionicons name="location-outline" size={24} color="#666" />
                <View style={styles.searchResultText}>
                  <Text style={styles.searchResultName}>{result.name}</Text>
                  <Text style={styles.searchResultAddress} numberOfLines={2}>
                    {result.address}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {/* Bottom Input Card */}
      <Animated.View 
        entering={FadeInDown.duration(500).delay(200)}
        style={styles.inputCard}
      >
        {isDriver ? (
          // Driver View - GPS Location (Read-only display)
          <View style={styles.inputRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="navigate" size={24} color="#2196F3" />
            </View>
            <View style={styles.inputWrapper}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Current Location (GPS)</Text>
                <View style={styles.liveTag}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
              <Text style={styles.locationDisplay}>
                {driverCurrentLocation?.address || 'Getting GPS location...'}
              </Text>
            </View>
          </View>
        ) : (
          // Passenger View
          <>
            <View style={styles.inputRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="ellipse" size={12} color="#4CAF50" />
                <View style={styles.verticalLine} />
                <Ionicons name="location" size={20} color="#F44336" />
              </View>
              <View style={styles.inputWrapper}>
                {/* Pickup (GPS - Read-only) */}
                <View>
                  <View style={styles.labelRow}>
                    <Text style={styles.inputLabel}>Pickup Location (GPS)</Text>
                    <View style={styles.liveTag}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveText}>LIVE</Text>
                    </View>
                  </View>
                  <Text style={styles.locationDisplay}>
                    {pickupLocation?.address || 'Getting GPS location...'}
                  </Text>
                </View>

                <View style={styles.divider} />

                {/* Destination (Searchable) */}
                <View>
                  <Text style={styles.inputLabel}>Where to?</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={activeInput === 'destination' ? searchQuery : destinationLocation?.address || ''}
                      onChangeText={setSearchQuery}
                      onFocus={() => {
                        setActiveInput('destination');
                        setSearchQuery('');
                      }}
                      placeholder="Search destination or tap map"
                      placeholderTextColor="#999"
                    />
                    {destinationLocation && (
                      <TouchableOpacity 
                        onPress={() => centerMapOnLocation(destinationLocation.coordinates)}
                        style={styles.iconButton}
                      >
                        <Ionicons name="eye-outline" size={20} color="#F44336" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Helper Text */}
        {activeInput === 'destination' && (
          <Text style={styles.helperText}>
            {isSearching ? '🔍 Searching...' : '📍 Search or tap anywhere on the map'}
          </Text>
        )}

        {/* Info Text */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={16} color="#2196F3" />
          <Text style={styles.infoText}>
            {isDriver 
              ? 'Your location updates automatically via GPS' 
              : 'Pickup uses your live GPS location. Tap map or search for destination.'}
          </Text>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity 
          style={[
            styles.findButton,
            (!isDriver && !destinationLocation) && styles.findButtonDisabled
          ]}
          onPress={handleConfirm}
          disabled={!isDriver && !destinationLocation}
        >
          <Text style={styles.findButtonText}>
            {isDriver ? 'Confirm Location' : 'Confirm & Continue'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Navigation */}
      {isDriver ? <DriverBottomBar /> : <BottomBar />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  subLoadingText: {
    marginTop: 4,
    fontSize: 12,
    color: '#999',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  recenterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  gpsIndicator: {
    position: 'absolute',
    top: 120,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  gpsIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  gpsIndicatorText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 160,
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  searchResultItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  searchResultText: {
    flex: 1,
    marginLeft: 12,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  searchResultAddress: {
    fontSize: 13,
    color: '#666',
  },
  inputCard: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: 16,
    marginTop: 8,
    width: 24,
  },
  verticalLine: {
    width: 2,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
  inputWrapper: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#757575',
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4CAF50',
  },
  locationDisplay: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    paddingVertical: 12,
  },
  iconButton: {
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  helperText: {
    fontSize: 12,
    color: '#2196F3',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 11,
    color: '#1976D2',
    lineHeight: 16,
  },
  findButton: {
    backgroundColor: '#3f3f3f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  findButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  findButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});