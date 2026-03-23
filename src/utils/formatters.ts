export const formatPrice = (price: number): string => new Intl.NumberFormat('ru-RU').format(price);

export const formatDate = (isoString?: string): string => {
  if (!isoString) return '';
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString));
};
