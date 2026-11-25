const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

export function formatINR(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return inrFormatter.format(safe);
}

export function formatIndianNumber(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return numberFormatter.format(safe);
}
