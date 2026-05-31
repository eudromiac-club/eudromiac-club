export const USER_STATUS_LABEL: Record<string, string> = {
  pending_kyc: 'REPROCANN pendiente',
  under_review: 'En revisión',
  active: 'Activo',
  rejected: 'Rechazado',
  suspended: 'Suspendido',
  inactive: 'Inactivo',
};

export const USER_STATUS_COLOR: Record<string, string> = {
  pending_kyc: 'border-border text-muted-foreground',
  under_review: 'border-brand/60 text-brand',
  active: 'border-green-500/60 text-green-400',
  rejected: 'border-destructive/50 text-destructive',
  suspended: 'border-yellow-500/60 text-yellow-400',
  inactive: 'border-muted-foreground/50 text-muted-foreground',
};

export const USER_STATUS_ORDER = [
  'pending_kyc',
  'under_review',
  'active',
  'rejected',
  'suspended',
  'inactive',
] as const;
