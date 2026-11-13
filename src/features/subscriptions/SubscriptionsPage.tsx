import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Calendar, Gift } from 'lucide-react';
import { adminSubscriptionService } from '@/lib/services';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import type { AdminSubscription } from '@/lib/types';

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  TRIAL: 'secondary', ACTIVE: 'success', EXPIRED: 'warning', SUSPENDED: 'destructive', CANCELLED: 'secondary',
};

export default function SubscriptionsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'subscriptions'], queryFn: adminSubscriptionService.list });
  const [action, setAction] = React.useState<{ id: string; type: 'extend' | 'trial'; business: string } | null>(null);
  const [days, setDays] = React.useState(7);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => action?.type === 'extend' ? adminSubscriptionService.extend(action.id, days) : adminSubscriptionService.applyTrial(action!.id, days),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'subscriptions'] }); toast.success('Subscription updated'); setAction(null); },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Action failed'),
  });

  const columns: Column<AdminSubscription>[] = [
    { key: 'biz', header: 'Business', cell: (s) => <span className="font-medium">{s.businessName}</span> },
    { key: 'plan', header: 'Plan', cell: (s) => <Badge variant="accent">{s.planName}</Badge> },
    { key: 'status', header: 'Status', cell: (s) => <Badge variant={STATUS_VARIANT[s.status]}>{s.status}</Badge> },
    { key: 'start', header: 'Started', cell: (s) => <span className="text-sm text-muted-foreground">{formatDate(s.startDate)}</span> },
    { key: 'end', header: 'Ends', cell: (s) => <span className="text-sm text-muted-foreground">{s.endDate ? formatDate(s.endDate) : '-'}</span> },
    { key: 'grace', header: 'Grace', cell: (s) => <span className="text-sm text-muted-foreground">{s.graceEndsAt ? formatDate(s.graceEndsAt) : '-'}</span> },
    { key: 'actions', header: '', align: 'right', cell: (s) => (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="sm" onClick={() => setAction({ id: s.id, type: 'extend', business: s.businessName })}><Calendar className="h-3 w-3" /> Extend</Button>
        <Button variant="ghost" size="sm" onClick={() => setAction({ id: s.id, type: 'trial', business: s.businessName })}><Gift className="h-3 w-3" /> Trial</Button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Subscriptions" description="All subscriptions across the platform." icon={<CreditCard className="h-5 w-5" />} />
      <DataTable
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        rowKey={(s) => s.id}
        emptyTitle="No subscriptions yet"
      />
      <Dialog open={!!action} onOpenChange={(v) => !v && setAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action?.type === 'extend' ? 'Extend subscription' : 'Apply trial'}</DialogTitle>
            <DialogDescription>{action?.type === 'extend' ? `Extend "${action?.business}" by N days` : `Apply trial to "${action?.business}"`}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="days">Days</Label>
            <Input id="days" type="number" min={1} value={days} onChange={(e) => setDays(Number(e.target.value))} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>Cancel</Button>
            <Button variant="accent" disabled={mutation.isPending} onClick={() => mutation.mutate()}>{mutation.isPending ? 'Applying...' : 'Apply'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
