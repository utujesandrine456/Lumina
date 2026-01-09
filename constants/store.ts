import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';


export type UserRole = 'adminfarmer' | 'driver' | 'admindriver';

export interface CurrentUser {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  cooperativeId?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  location: string;
  cropType?: string;
}

export interface Cooperative {
  id: string;
  name: string;
  officerName: string;
  location?: string;
  phone: string;
  pin: string;
  status: 'pending' | 'verified';
  farmers: Farmer[];
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  pin?: string;
  nationalId?: string;
  licenseNumber?: string;
  plateNumber?: string;
  vehicleType?: string;
  capacity?: number;
  available?: boolean;
  verified?: boolean;
  rating?: number;
  role?: 'driver';
  cooperativeId?: string;
  coordinates?: Coordinates;
}

export interface TransportRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  cooperativeId?: string;
  driverId?: string;
  pickupLocation: string;
  destination: string;
  cropType: string;
  quantity: string;
  totalWeight?: string;
  bookingTime?: string | number;
  createdAt?: string | number;
  harvestDate?: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'rejected';
  priceLocked?: boolean;
  chatOpen?: boolean;
  rating?: number;
  ratingComment?: string;
}

export interface ChatMessage {
  id: string;
  requestId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
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

  findUserByCredentials: (phone: string, pin: string) => { role: UserRole; data: Driver | Cooperative } | null;
}

export const useDriverStore = create<AppState>()(
  persist(
    (set, get) => ({
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
        const updatedRequests = state.requests.map(r =>
          r.id === requestId ? { ...r, rating, ratingComment: comment } : r
        );

        const request = state.requests.find(r => r.id === requestId);
        if (!request || !request.driverId) return { requests: updatedRequests };

        const driverId = request.driverId;
        const driverRequests = updatedRequests.filter(r => r.driverId === driverId && r.rating);

        if (driverRequests.length === 0) return { requests: updatedRequests };

        const total = driverRequests.reduce((sum, r) => sum + (r.rating || 0), 0);
        const avg = total / driverRequests.length;

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
      },

      findUserByCredentials: (phone, pin) => {
        const coop = get().cooperatives.find(c => c.phone === phone && c.pin === pin);
        if (coop) {
          return { role: 'adminfarmer', data: coop };
        }

        const driver = get().drivers.find(d => d.phone === phone && d.pin === pin);
        if (driver) {
          if (driver.cooperativeId) {
            return { role: 'admindriver', data: driver };
          }
          return { role: 'driver', data: driver };
        }

        return null;
      }
    }),
    {
      name: 'lumina-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
