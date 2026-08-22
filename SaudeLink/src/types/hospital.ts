export interface Hospital {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
  rating: number;
  isOpen: boolean;
  emergencyAvailable: boolean;
  services: string[];
  resources: {
    emergency: boolean;
    pharmacy: boolean;
    laboratory: boolean;
    maternity: boolean;
    pediatrics: boolean;
    imaging: boolean;
  };
  phone: string;
  image?: string;
}

export type HospitalNeed = 'emergency' | 'pharmacy' | 'maternity' | 'laboratory' | 'pediatrics' | 'imaging';
