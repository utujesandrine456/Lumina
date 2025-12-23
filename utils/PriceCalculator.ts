export interface PriceCalculation {
    distance: number; // km
    weight: number; // kg
    pricePerKg: number;
    pricePerKm: number;
    totalPrice: number; 
}


export const calculatePrice = (
    distance: number,
    weight: number,
    pricePerKg: number,
    pricePerKm: number
): PriceCalculation => {
    const totalPrice = (weight * pricePerKg) + (distance * pricePerKm);
    return {
        distance,
        weight,
        pricePerKg,
        pricePerKm,
        totalPrice: Math.round(totalPrice * 100) / 100,
    };
};

export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 100) / 100; 
};

