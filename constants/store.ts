import { create } from 'zustand';

export type MobileRole = 'c-farmer' | 'c-driver' | 'driver';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Crop{
  name: string;
}

export interface Farmer{
  id: string,
  name: string,
  phone: string,
  crops: Crop[],
}

export interface Cooperative {
  id: string;
  name: string;
  officerName: string;
  pin: string;
  phone: string;
  location: string;
  status: string;
  farmers: Farmer[]
}

export interface TripFarmer {
  id: string;
  name: string;
  location: string;
  crop: string;
  quantity: number;
  harvestDate: string;
}

export interface Driver {
  id: string;
  cooperativeId: string;
  fullName: string;
  phone: string;
  nationalId: string;
  licenseNumber: string;
  vehicleType: string;
  available: boolean;
  verified: boolean;
  coordinates?: Coordinates;
  availability?: boolean;
  plateNumber?: string;
  capacity?: number;
  vehicleModel?: string;
  rating?: number;
}

export interface TransportRequest {
  id: string;
  cooperativeId: string;
  farmerId: string;
  cropType: string;
  quantityKg: number;
  destination: string;
  pickupDate: string;
  status: 'pending' | 'accepted' | 'rejected' | 'in-progress' | 'completed';
  driverId?: string;
  driverCoordinates?: Coordinates;
}

export interface ChatMessage {
  id: string;
  tripId: string;
  sender: 'c-farmer' | 'driver';
  text: string;
  createdAt: number;
}

export interface Trip {
  id: string;
  driverId: string;
  status: 'accepted' | 'in-transit' | 'delivered' | 'pending';
  pickupLocation: string;
  destination: string;
  bookingTime: string;
  farmers: TripFarmer[];
  totalWeight: number;
}

export interface CurrentUser {
  id: string;
  name: string;
  role: string;
  phone?: string;
}

interface AppState {
  currentRole: MobileRole | null;
  currentCooperativeId: string | null;
  currentDriverId: string | null;


  cooperatives: Cooperative[];
  farmers: Farmer[];
  drivers: Driver[];
  requests: TransportRequest[];
  messages: ChatMessage[];
  trips: Trip[];
  currentUser: CurrentUser | null;
  truckStatus: string;
  userRole: string;
  unavailableDates: { [date: string]: boolean };
  trip: Trip | null;
  driverLocation: string;
  driverCoordinates: Coordinates | null;
  nearbyDrivers: (Driver & { distance: number })[];


  registerCooperative: (coop: Cooperative) => void;
  setCurrentRole: (role: MobileRole | null) => void;
  setCurrentCooperative: (id: string | null) => void;
  setCurrentDriver: (id: string | null) => void;

  addFarmer: (farmer: Farmer) => void;
  addDriver: (driver: Driver) => void;

  addRequest: (request: TransportRequest) => void;
  updateRequestStatus: (
    id: string,
    status: TransportRequest['status'],
    driverId?: string
  ) => void;

  setDriverAvailability: (driverId: string, available: boolean) => void;
  updateDriverLocation: (driverId: string, coords: Coordinates) => void;
  updateRequestDriverLocation: (requestId: string, coords: Coordinates) => void;

  updateDriver: (driverId: string, updates: Partial<Driver>) => void;
  addChatMessage: (message: ChatMessage) => void;
  setUserRole: (role: string) => void;
  toggleDateAvailability: (date: string) => void;
  setTripDetails: (details: Partial<Trip>) => void;
  setDriverLocation: (location: string) => void;
  setDriverCoordinates: (coords: Coordinates) => void;
  setNearbyDrivers: (drivers: (Driver & { distance: number })[]) => void;

  addMessage: (message: ChatMessage) => void;
  setCurrentUser: (user: CurrentUser | null) => void;
  addCooperative: (cooperative: Cooperative) => void;

  logout: () => void;
}

export const useDriverStore = create<AppState>((set) => ({
  currentRole: null,
  currentCooperativeId: null,
  currentDriverId: null,

  cooperatives: [],
  farmers: [],
  drivers: [],
  requests: [],
  messages: [],
  trips: [],
  currentUser: null,

  truckStatus: 'available',
  userRole: '',
  unavailableDates: {},
  trip: null,
  driverLocation: '',
  driverCoordinates: null,
  nearbyDrivers: [],

  registerCooperative: (coop) =>
    set((state) => ({
      cooperatives: [...state.cooperatives, coop],
      currentCooperativeId: coop.id,
    })),

  setCurrentRole: (role) => set({ currentRole: role }),
  setCurrentCooperative: (id) => set({ currentCooperativeId: id }),
  setCurrentDriver: (id) => set({ currentDriverId: id }),

  addFarmer: (farmer) =>
    set((state) => ({ farmers: [...state.farmers, farmer] })),

  addDriver: (driver) =>
    set((state) => ({ drivers: [...state.drivers, driver] })),

  addRequest: (request) =>
    set((state) => ({ requests: [...state.requests, request] })),

  updateRequestStatus: (id, status, driverId) =>
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id ? { ...r, status, driverId: driverId ?? r.driverId } : r
      ),
    })),

  setDriverAvailability: (driverId, available) =>
    set((state) => ({
      drivers: state.drivers.map((d) =>
        d.id === driverId ? { ...d, available } : d
      ),
    })),

  updateDriverLocation: (driverId, coordinates) =>
    set((state) => ({
      drivers: state.drivers.map((d) =>
        d.id === driverId ? { ...d, coordinates } : d
      ),
    })),

  updateRequestDriverLocation: (requestId, coordinates) =>
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === requestId ? { ...r, driverCoordinates: coordinates } : r
      ),
    })),

  updateDriver: (driverId, updates) =>
    set((state) => ({
      drivers: state.drivers.map((d) =>
        d.id === driverId ? { ...d, ...updates } : d
      ),
    })),

  addChatMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setUserRole: (role) => set({ userRole: role }),

  toggleDateAvailability: (date) =>
    set((state) => ({
      unavailableDates: {
        ...state.unavailableDates,
        [date]: !state.unavailableDates[date]
      }
    })),

  setTripDetails: (details) =>
    set((state) => ({
      trip: state.trip ? { ...state.trip, ...details } : (details as Trip)
    })),

  setDriverLocation: (location) => set({ driverLocation: location }),

  setDriverCoordinates: (coords) => set({ driverCoordinates: coords }),

  setNearbyDrivers: (drivers) => set({ nearbyDrivers: drivers }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setCurrentUser: (user) => set({ currentUser: user }),
  
  addCooperative: (cooperative) =>
    set((state) => ({ cooperatives: [...state.cooperatives, cooperative] })),

  logout: () =>
    set({
      currentRole: null,
      currentCooperativeId: null,
      currentDriverId: null,
    }),
}));
