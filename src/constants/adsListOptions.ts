export const PAGE_SIZE = 10;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'price_asc', label: 'Сначала дешевле' },
  { value: 'price_desc', label: 'Сначала дороже' },
  { value: 'title_asc', label: 'По названию (А-Я)' },
  { value: 'title_desc', label: 'По названию (Я-А)' },
];

export const SORT_MAP: Record<string, { sortColumn: string; sortDirection: string }> = {
  newest: { sortColumn: 'createdAt', sortDirection: 'desc' },
  oldest: { sortColumn: 'createdAt', sortDirection: 'asc' },
  price_asc: { sortColumn: 'price', sortDirection: 'asc' },
  price_desc: { sortColumn: 'price', sortDirection: 'desc' },
  title_asc: { sortColumn: 'title', sortDirection: 'asc' },
  title_desc: { sortColumn: 'title', sortDirection: 'desc' },
};
