import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  hint?: string;
  loading?: boolean;
  accent?: 'accent' | 'success' | 'warning' | 'destructive' | 'primary';
}

const accentMap = {
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/15 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
  primary: 'bg-primary/10 text-primary',
};

export function StatCard({ label, value, icon, hint, loading, accent = 'accent' }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          {loading ? <Skeleton className="h-7 w-24" /> : <p className="font-heading text-2xl font-semibold">{value}</p>}
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        {icon && <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', accentMap[accent])}>{icon}</div>}
      </div>
    </Card>
  );
}
