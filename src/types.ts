// src/types.ts
export type AdCategory = 'auto' | 'real_estate' | 'electronics';

export type AutoItemParams = {
  brand?: string;
  model?: string;
  yearOfManufacture?: number;
  transmission?: 'automatic' | 'manual';
  mileage?: number;
  enginePower?: number;
};

export type RealEstateItemParams = {
  type?: 'flat' | 'house' | 'room';
  address?: string;
  area?: number;
  floor?: number;
};

export type ElectronicsItemParams = {
  type?: 'phone' | 'laptop' | 'misc';
  brand?: string;
  model?: string;
  condition?: 'new' | 'used';
  color?: string;
};

export interface AdInList {
  id: number;
  category: AdCategory;
  title: string;
  price: number;
  needsRevision?: boolean;
  createdAt: string;
}

export interface Ad extends AdInList {
  description?: string;
  params?: AutoItemParams | RealEstateItemParams | ElectronicsItemParams;
  updatedAt?: string;
}

export interface AdsListResponse {
  items: AdInList[];
  total: number;
}

export interface ItemUpdateIn {
  category: AdCategory;
  title: string;
  description?: string;
  price: number;
  params: AutoItemParams | RealEstateItemParams | ElectronicsItemParams;
}
