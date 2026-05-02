export function formatCurrency(amount: number): string {
  return `€ ${amount.toFixed(2).replace('.', ',')}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('nl-BE', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export const paymentMethodLabels: Record<string, string> = {
  cash: 'Cash',
  transfer: 'Overschrijving',
  invoice: 'Factuur',
};

export const paymentStatusLabels: Record<string, string> = {
  paid: 'Betaald',
  pending: 'Wacht',
  overdue: 'Te laat',
};

export const paymentStatusColors: Record<string, string> = {
  paid: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  overdue: 'bg-red-50 text-red-700',
};

export const statusLabels: Record<string, string> = {
  active: 'Actief',
  paused: 'Gepauzeerd',
  inactive: 'Inactief',
};
