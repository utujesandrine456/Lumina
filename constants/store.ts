import { create } from 'zustand';

export type MobileRole = 'c-farmer' | 'c-driver' | 'driver';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Crop {
  name: string;
}

export interface Farmer {
  id: string,
  name: string,
  phone: string,
  crops: Crop[],
  cooperativeId?: string;
  location?: string;
}

export interface Cooperative {
  id: string;
  name: string;
  officerName: string;
  pin: string;
  phone: string;
  location: string;
  status: string;
  farmers: Farmer[];
  tinNumber?: string;
  role?: 'adminfarmer' | 'admindriver';
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
  pin?: string;
}

export interface TransportRequest {
  id: string;
  cooperativeId: string;
  farmerId?: string; // Made optional as we might have multiple farmers
  farmers?: Farmer[]; // Added to support multiple farmers from CreateTransportRequest
  cropType: string;
  quantityKg: number;
  totalWeight?: number; // Added from CreateTransportRequest
  destination: string;
  pickupLocation: string; // Added
  pickupDate: string;
  status: 'pending' | 'accepted' | 'rejected' | 'in-progress' | 'completed';
  pricePerKg?: number; // Added from CreateTransportRequest
  pricePerKm?: number; // Added from CreateTransportRequest
  distance?: number; // Added from CreateTransportRequest
  totalPrice?: number; // Added from CreateTransportRequest
  driverId?: string;
  driverCoordinates?: Coordinates;
  pickupCoordinates?: Coordinates; // Added
  destinationCoordinates?: Coordinates; // Added
  bookingTime?: string; // Added from CreateTransportRequest
  createdAt?: number; // Added from CreateTransportRequest
  pickupPhoto?: string;
  deliveryPhoto?: string;
  pickupTimestamp?: number;
  deliveryTimestamp?: number;
  pickupWeight?: number;
  deliveryWeight?: number;
  acceptedAt?: string;
  priceLocked?: boolean;
  chatOpen?: boolean;
  chat?: {
    id: string;
    sender: string;
    text: string;
    timestamp: string;
  }[];
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
  cooperativeId?: string;
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
  updateCooperative: (id: string, updates: Partial<Cooperative>) => void;

  // Helper functions
  getCoopFarmers: (coopId: string) => Farmer[];
  getCoopRequests: (coopId: string) => TransportRequest[];
  getDriverRequests: (driverId: string) => TransportRequest[];
  addFarmerToCoop: (coopId: string, farmer: Farmer) => void;
  createRequest: (request: any) => void;
  updateRequest: (id: string, updates: Partial<TransportRequest>) => void;
  findUserByCredentials: (phone: string, pin: string) => { role: string; data: any } | null;

  // Selection state
  selectedFarmers: string[];
  setSelectedFarmers: (ids: string[]) => void;

  logout: () => void;
}

export const useDriverStore = create<AppState>((set, get) => ({
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
      cooperatives: [...state.cooperatives, {
        ...coop,
        status: 'pending',
        farmers: coop.farmers || [],
      }],
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

  updateCooperative: (id, updates) =>
    set((state) => ({
      cooperatives: state.cooperatives.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  // Helper functions - these access state via get()
  getCoopFarmers: (coopId: string) => {
    const state = get();
    return state.farmers.filter((f: Farmer) => f.cooperativeId === coopId);
  },

  getCoopRequests: (coopId: string) => {
    const state = get();
    return state.requests.filter((r: TransportRequest) => r.cooperativeId === coopId);
  },

  getDriverRequests: (driverId: string) => {
    const state = get();
    return state.requests.filter((r: TransportRequest) => r.driverId === driverId);
  },

  findUserByCredentials: (phone: string, pin: string) => {
    const state = get();

    // Normalize phone number (remove spaces, ensure consistent format)
    const normalizedPhone = phone.trim().replace(/\s+/g, '');

    // Check cooperatives (for c-farmer and c-driver roles)
    const coop = state.cooperatives.find(
      (c: Cooperative) => {
        const coopPhone = c.phone.trim().replace(/\s+/g, '');
        return coopPhone === normalizedPhone && c.pin === pin;
      }
    );

    if (coop) {
      // Use the role stored on the cooperative (adminfarmer or admindriver)
      return {
        role: coop.role || 'adminfarmer',
        data: coop,
      };
    }

    // Check drivers (for regular drivers registered by admin)
    const driver = state.drivers.find(
      (d: Driver) => {
        const driverPhone = d.phone.trim().replace(/\s+/g, '');
        // Drivers registered by admin should have phone and PIN
        return driverPhone === normalizedPhone && d.pin === pin;
      }
    );

    if (driver) {
      return {
        role: 'driver',
        data: driver,
      };
    }

    return null;
  },

  addFarmerToCoop: (coopId, farmer) =>
    set((state) => {
      const newFarmer = { ...farmer, cooperativeId: coopId };
      return {
        farmers: [...state.farmers, newFarmer],
        cooperatives: state.cooperatives.map((c) =>
          c.id === coopId
            ? { ...c, farmers: [...(c.farmers || []), newFarmer] }
            : c
        ),
      };
    }),

  createRequest: (request) =>
    set((state) => ({ requests: [...state.requests, request] })),

  updateRequest: (id, updates) =>
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),

  selectedFarmers: [],
  setSelectedFarmers: (ids) => set({ selectedFarmers: ids }),

  logout: () =>
    set({
      currentRole: null,
      currentCooperativeId: null,
      currentDriverId: null,
      selectedFarmers: [],
    }),
}));
