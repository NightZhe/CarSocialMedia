export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  transmission: 'automatic' | 'manual';
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  condition: 'excellent' | 'good' | 'fair';
  description: string;
  images: string[];
  features: string[];
  isAvailable: boolean;
  createdAt: string;
  views: number;
}

export interface FilterState {
  search: string;
  minPrice: number | '';
  maxPrice: number | '';
  transmission: string;
  fuelType: string;
  condition: string;
}

export type AppMode = 'customer' | 'merchant';
