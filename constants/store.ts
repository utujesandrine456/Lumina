import { create } from 'zustand';

interface Coordinates{
    latitude: number;
    longitude: number;
}

interface DriverState {
    userRole: 'farmer' | 'driver' | null;
    unavailableDates: { [date: string]: { selected: boolean; selectedColor: string; textColor: string } };
    truckStatus: 'Moving' | 'Paused' | 'Stopped';
    driverCoordinates?: Coordinates;
    trip: {
        pickupLocation: string;
        destination: string;
        bookingTime: string;
        pickupCoordinates?: Coordinates;
        destinationCoordinates?: Coordinates;
    };
    driverLocation: string;
    setUserRole: (role: 'farmer' | 'driver') => void;
    setDriverLocation: (location: string) => void;
    setDriverCoordinates: (coordinates?: Coordinates) => void;
    toggleDateAvailability: (date: string) => void;
    setTruckStatus: (status: 'Moving' | 'Paused' | 'Stopped') => void;
    setTripDetails: (details: Partial<DriverState['trip']>) => void;
}


export const useDriverStore = create<DriverState>((set) => ({
    userRole: null,
    driverLocation: '',
    unavailableDates: {},
    truckStatus: 'Stopped',
    driverCoordinates: undefined,
    trip: {
        pickupLocation: '',
        destination: '',
        bookingTime: new Date().toISOString(),
    },
    setUserRole: (role: 'farmer' | 'driver') => set({ userRole: role }),
    setDriverLocation: (location) => set({ driverLocation: location }),
    setDriverCoordinates: (coordinates) => set({ driverCoordinates: coordinates }),
    toggleDateAvailability: (date) =>
        set((state) => {
            const newDates = { ...state.unavailableDates };
            if (newDates[date]) {
                delete newDates[date];
            } else {
                newDates[date] = { selected: true, selectedColor: '#FF5252', textColor: '#fff' };
            }
            return { unavailableDates: newDates };
        }),
    setTruckStatus: (status) => set({ truckStatus: status }),
    setTripDetails: (details) => set((state) => ({ trip: { ...state.trip, ...details } })),
}));


