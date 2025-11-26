import * as Location from 'expo-location';

export async function getCurrentCoordinates(){
    const {status} = await Location.requestForegroundPermissionsAsync();

    if(status != "granted"){
        alert("Permission to access GPS was denied");
        return null;
    }

    const location = await Location.getCurrentPositionAsync({});

    return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
    };
}