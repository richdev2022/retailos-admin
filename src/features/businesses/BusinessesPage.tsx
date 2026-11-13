import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Search, Ban, CheckCircle2 } from 'lucide-react';
import { adminBusinessService } from '@/lib/services';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import type { AdminBusiness } from '@/lib/types';

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  TRIAL: 'secondary', ACTIVE: 'success', EXPIRED: 'warning', SUSPENDED: 'destructive', CANCELLED: 'secondary',
};

export default function BusinessesPage() {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [confirm, setConfirm] = React.useState<{ id: string; action: 'suspend' | 'reactivate'; name: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'businesses', { search, status, page }],
    queryFn: () => adminBusinessService.list({ search: search || undefined, status: status || undefined, page }),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'suspend' | 'reactivate' }) =>
      action === 'suspend' ? adminBusinessService.suspend(id) : adminBusinessService.reactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'businesses'] });
      toast.success('Action completed');
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Action failed'),
  });

  const columns: Column<AdminBusiness>[] = [
    { key: 'name', header: 'Business', cell: (b) => (
      <div>
        <p className="font-medium">{b.name}</p>
        <p className="text-xs text-muted-foreground">{b.ownerName} \u00b7 {b.category}</p>
      </div>
    ) },
    { key: 'plan', header: 'Plan', cell: (b) => <Badge variant={b.planName === 'Free' ? 'secondary' : 'accent'}>{b.planName}</Badge> },
    { key: 'sub', header: 'Subscription', cell: (b) => <Badge variant={STATUS_VARIANT[b.subscriptionStatus]}>{b.subscriptionStatus.replace('_', ' ')}</Badge> },
    { key: 'users', header: 'Users', align: 'center', cell: (b) => <span className="text-sm">{b.userCount}</span> },
    { key: 'status', header: 'Status', cell: (b) => b.status === 'ACTIVE' ? <Badge variant="success">Active</Badge> : <Badge variant="destructive">Suspended</Badge> },
    { key: 'created', header: 'Registered', cell: (b) => <span className="text-sm text-muted-foreground">{formatDate(b.createdAt)}</span> },
    { key: 'actions', header: '', align: 'right', cell: (b) => (
      <Button variant="ghost" size="sm" onClick={() => setConfirm({ id: b.id, action: b.status === 'ACTIVE' ? 'suspend' : 'reactivate', name: b.name })}>
        {b.status === 'ACTIVE' ? <><Ban className="h-3 w-3" /> Suspend</> : <><CheckCircle2 className="h-3 w-3" /> Reactivate</>}
      </Button>
    ) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Businesses" description="Manage all businesses on the RetailOS platform." icon={<Building2 className="h-5 w-5" />} />
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search name, email, phone..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">{status || 'All statuses'}</SelectTrigger>
          <SelectItem value="">All statuses</SelectItem>
          <SelectItem value="TRIAL">Trial</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="EXPIRED">Expired</SelectItem>
          <SelectItem value="SUSPENDED">Suspended</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </Select>
      </div>
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={isLoading}
        rowKey={(b) => b.id}
        page={page}
        totalPages={data?.totalPages}
        total={data?.total}
        onPageChange={setPage}
        emptyTitle="No businesses found"
        emptyDescription="Adjust your filters to see results."
      />
      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(v) => !v && setConfirm(null)}
        title={confirm?.action === 'suspend' ? 'Suspend business?' : 'Reactivate business?'}
        description={`This will ${confirm?.action} "${confirm?.name}". ${confirm?.action === 'suspend' ? 'The business will lose access but data is preserved.' : 'The business will regain full access.'}`}
        confirmLabel={confirm?.action === 'suspend' ? 'Suspend' : 'Reactivate'}
        destructive={confirm?.action === 'suspend'}
        onConfirm={() => confirm && mutation.mutate({ id: confirm.id, action: confirm.action })}
      />
    </div>
  );
}
