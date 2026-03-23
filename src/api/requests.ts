// src/api/requests.ts
import { api } from './axios';
import type { AdsListResponse, Ad, ItemUpdateIn } from '../types';
const PAGE_SIZE = 10;

interface FetchAdsParams {
  page: number;
  search?: string;
  categories?: string[];
  needsRevision?: boolean;
  sortColumn?: string;
  sortDirection?: string;
}

export const fetchAds = async ({
  page,
  search,
  categories,
  needsRevision,
  sortColumn,
  sortDirection,
}: FetchAdsParams): Promise<AdsListResponse> => {
  const skip = (page - 1) * PAGE_SIZE;

  const response = await api.get('/items', {
    params: {
      PAGE_SIZE,
      skip,
      ...(search ? { q: search } : {}),

      ...(categories && categories.length > 0 ? { categories } : {}),

      ...(needsRevision ? { needsRevision: true } : {}),
      ...(sortColumn ? { sortColumn } : {}),
      ...(sortDirection ? { sortDirection } : {}),
    },
  });

  return response.data;
};

export const fetchAdById = async (id: string): Promise<Ad> => {
  const response = await api.get(`/items/${id}`);
  return response.data;
};

export const updateAd = async (id: string, data: ItemUpdateIn): Promise<void> => {
  // Promise<Ad>?
  await api.put(`/items/${id}`, data);
};
