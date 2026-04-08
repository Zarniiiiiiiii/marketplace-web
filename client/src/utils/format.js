export function formatPrice(value) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(value) {
  return new Intl.DateTimeFormat('ro-RO').format(new Date(value));
}
