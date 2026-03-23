import type { Ad } from '../types';
import { paramLabels } from '../constants/adLabels';

const expectedParamsByCategory: Record<string, string[]> = {
  auto: ['brand', 'model', 'yearOfManufacture', 'transmission', 'mileage', 'enginePower'],
  real_estate: ['type', 'address', 'area', 'floor'],
  electronics: ['type', 'brand', 'model', 'condition', 'color'],
};

export const getMissingFields = (ad: Ad): string[] => {
  const missing: string[] = [];

  if (!ad.description) missing.push('Описание');

  const expectedParams = expectedParamsByCategory[ad.category] ?? [];
  const paramsObj = (ad.params ?? {}) as Record<string, string | number | undefined>;

  expectedParams.forEach((param) => {
    const val = paramsObj[param];
    if (val === undefined || val === null || val === '' || val === 0) {
      missing.push(paramLabels[param] ?? param);
    }
  });

  return missing;
};
