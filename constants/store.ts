import { create } from 'zustand';


export type UserRole = 'adminfarmer' | 'driver' | 'admindriver';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Crop {
  id: string;
  name: string;
}

export interface Farmer {
  id: string;
  cooperativeId: string;
  name: string;
  phone: string;
  crops: Crop[];
  location?: string;
}

export interface Cooperative {
  id: string;
  name: string;
  officerName: string;
  phone: string;
  pin: string;
  location?: string;
  farmers: Farmer[];
  status: 'pending' | 'verified';
}

export interface Driver {
  id: string;
  cooperativeId?: string;
  name: string;
  phone: string;
  pin: string;
  nationalId: string;
  licenseNumber: string;
  vehicleType?: string;
  plateNumber: string;
  available: boolean;
  verified: boolean;
  coordinates?: Coordinates;
  avatar?: string;
  rating?: number;
  capacity?: number;
}

export interface TransportRequest {
  id: string;
  cooperativeId: string;
  farmers?: Farmer[];
  cropType: string;
  quantity: string;
  totalWeight?: number;
  pickupLocation: string;
  pickupPhoto?: string;
  destination: string;
  pickupDate?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'in-progress' | 'completed';
  driverId?: string;
  createdAt: number;
  bookingTime?: string;

  pricePerKg?: number;
  pricePerKm?: number;
  distance?: number;
  totalPrice?: number;
  priceLocked?: boolean;

  pickupCoordinates?: Coordinates;
  destinationCoordinates?: Coordinates;
  chatOpen?: boolean;
  chat?: {
    id: string;
    sender: string;
    text: string;
    timestamp: string;
  }[];

  driver?: Driver;
  rating?: number;
  ratingComment?: string;
  pickupTimestamp?: number;
  pickupWeight?: number;
  deliveryTimestamp?: number;
  deliveryWeight?: number;

  acceptedAt?: string;
}

export interface ChatMessage {
  id: string;
  requestId?: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

export interface CurrentUser {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  cooperativeId?: string;
  pin?: number
}



interface AppState {
  currentUser: CurrentUser | null;
  cooperatives: Cooperative[];
  drivers: Driver[];
  requests: TransportRequest[];
  messages: ChatMessage[];
  nearbyDrivers: Driver[];
  selectedFarmers: string[];

  setNearbyDrivers: (drivers: Driver[]) => void;
  setSelectedFarmers: (ids: string[]) => void;

  setCurrentUser: (user: CurrentUser | null) => void;
  logout: () => void;

  addCooperative: (coop: Cooperative) => void;
  updateCooperative: (id: string, updates: Partial<Cooperative>) => void;
  addFarmerToCoop: (coopId: string, farmer: Farmer) => void;
  removeFarmerFromCoop: (coopId: string, farmerId: string) => void;


  addDriver: (driver: Driver) => void;
  updateDriver: (id: string, updates: Partial<Driver>) => void;
  rateDriver: (requestId: string, rating: number, comment?: string) => void;
  removeDriver: (id: string) => void;
  setDriverAvailability: (id: string, available: boolean) => void;
  updateDriverLocation: (id: string, coords: Coordinates) => void;

  createRequest: (request: TransportRequest) => void;
  updateRequestStatus: (id: string, status: TransportRequest['status'], driverId?: string) => void;
  updateRequest: (id: string, updates: Partial<TransportRequest>) => void;

  addMessage: (msg: ChatMessage) => void;

  getCoopFarmers: (coopId: string) => Farmer[];
  getCoopRequests: (coopId: string) => TransportRequest[];
  getDriverRequests: (driverId: string) => TransportRequest[];
}

export const useDriverStore = create<AppState>((set, get) => ({
  currentUser: null,
  cooperatives: [],
  drivers: [],
  requests: [],
  messages: [],
  selectedFarmers: [],
  nearbyDrivers: [],

  setNearbyDrivers: (drivers) => set({ nearbyDrivers: drivers }),
  setSelectedFarmers: (ids) => set({ selectedFarmers: ids }),

  setCurrentUser: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),

  addCooperative: (coop) => set((state) => ({ cooperatives: [...state.cooperatives, coop] })),

  updateCooperative: (id, updates) => set((state) => ({
    cooperatives: state.cooperatives.map((c) => c.id === id ? { ...c, ...updates } : c)
  })),

  addFarmerToCoop: (coopId, farmer) => set((state) => ({
    cooperatives: state.cooperatives.map((c) => {
      if (c.id === coopId) {
        return { ...c, farmers: [...c.farmers, farmer] };
      }
      return c;
    })
  })),

  removeFarmerFromCoop: (coopId, farmerId) => set((state) => ({
    cooperatives: state.cooperatives.map((c) => {
      if (c.id === coopId) {
        return { ...c, farmers: c.farmers.filter(f => f.id !== farmerId) };
      }
      return c;
    })
  })),

  addDriver: (driver) => set((state) => ({ drivers: [...state.drivers, driver] })),

  updateDriver: (id, updates) => set((state) => ({
    drivers: state.drivers.map((d) => d.id === id ? { ...d, ...updates } : d)
  })),

  rateDriver: (requestId, rating, comment) => set((state) => {
    // 1. Update the request with the rating
    const updatedRequests = state.requests.map(r =>
      r.id === requestId ? { ...r, rating, ratingComment: comment } : r
    );

    // 2. Find the request to get the driverId
    const request = state.requests.find(r => r.id === requestId);
    if (!request || !request.driverId) return { requests: updatedRequests };

    // 3. Recalculate driver average rating
    const driverId = request.driverId;
    const driverRequests = updatedRequests.filter(r => r.driverId === driverId && r.rating);

    if (driverRequests.length === 0) return { requests: updatedRequests };

    const total = driverRequests.reduce((sum, r) => sum + (r.rating || 0), 0);
    const avg = total / driverRequests.length;

    // 4. Update the driver
    const updatedDrivers = state.drivers.map(d =>
      d.id === driverId ? { ...d, rating: avg } : d
    );

    return {
      requests: updatedRequests,
      drivers: updatedDrivers
    };
  }),

  setDriverAvailability: (id, available) => set((state) => ({
    drivers: state.drivers.map((d) => d.id === id ? { ...d, available } : d)
  })),

  updateDriverLocation: (id, coords) => set((state) => ({
    drivers: state.drivers.map((d) => d.id === id ? { ...d, coordinates: coords } : d)
  })),

  removeDriver: (id) => set((state) => ({
    drivers: state.drivers.filter((d) => d.id !== id)
  })),

  createRequest: (request) => set((state) => ({ requests: [request, ...state.requests] })),

  updateRequestStatus: (id, status, driverId) => set((state) => ({
    requests: state.requests.map((r) =>
      r.id === id ? { ...r, status, driverId: driverId ?? r.driverId } : r
    )
  })),

  updateRequest: (id, updates) => set((state) => ({
    requests: state.requests.map((r) =>
      r.id === id ? { ...r, ...updates } : r
    )
  })),

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

  getCoopFarmers: (coopId) => {
    const coop = get().cooperatives.find(c => c.id === coopId);
    return coop ? coop.farmers : [];
  },

  getCoopRequests: (coopId) => {
    return get().requests.filter(r => r.cooperativeId === coopId);
  },

  getDriverRequests: (driverId) => {
    return get().requests.filter(r =>
      (r.status === 'pending') || (r.driverId === driverId)
    );
  }
}));
