import * as Location from 'expo-location';

export async function getCurrentCoordinates(){
    const {status} = await Location.requestForegroundPermissionsAsync();

    if(status != "granted"){
        alert("Permission to access GPS was denied");
        return null;
    }

    const enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
        alert("Location services are disabled. Please enable location services to continue.");
        return null;
    }

    try {
        const location = await Location.getCurrentPositionAsync({});
        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
    } catch (error) {
        alert("Unable to get current location. Please ensure location services are enabled and try again.");
        return null;
    }
}