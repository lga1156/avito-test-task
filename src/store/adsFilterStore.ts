import { create } from 'zustand';

type ViewMode = 'grid' | 'list';

interface AdsFilterState {
  page: number;
  searchInput: string;
  selectedCategories: string[];
  needsRevision: boolean;
  sortValue: string;
  viewMode: ViewMode;

  setPage: (page: number) => void;
  setSearchInput: (value: string) => void;
  setSelectedCategories: (categories: string[]) => void;
  setNeedsRevision: (value: boolean) => void;
  setSortValue: (value: string) => void;
  setViewMode: (mode: ViewMode) => void;
  resetFilters: () => void;
}

const initialState = {
  page: 1,
  searchInput: '',
  selectedCategories: [],
  needsRevision: false,
  sortValue: 'newest',
};

export const useAdsFilterStore = create<AdsFilterState>((set) => ({
  ...initialState,
  viewMode: 'grid',

  setPage: (page) => set({ page }),
  setSearchInput: (searchInput) => set({ searchInput, page: 1 }),
  setSelectedCategories: (selectedCategories) => set({ selectedCategories, page: 1 }),
  setNeedsRevision: (needsRevision) => set({ needsRevision, page: 1 }),
  setSortValue: (sortValue) => set({ sortValue, page: 1 }),
  setViewMode: (viewMode) => set({ viewMode }),
  resetFilters: () => set(initialState),
}));
