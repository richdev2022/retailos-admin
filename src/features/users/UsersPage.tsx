import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users as UsersIcon, Search, Ban, CheckCircle2, LogOut } from 'lucide-react';
import { adminUserService } from '@/lib/services';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from 'sonner';
import { formatDate, formatRelative } from '@/lib/utils';
import type { AdminUserAccount } from '@/lib/types';

export default function UsersPage() {
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [confirm, setConfirm] = React.useState<{ id: string; action: 'suspend' | 'reactivate' | 'revoke'; name: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', { search, page }],
    queryFn: () => adminUserService.list({ search: search || undefined, page }),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'suspend' | 'reactivate' | 'revoke' }) => {
      if (action === 'suspend') return adminUserService.suspend(id);
      if (action === 'reactivate') return adminUserService.reactivate(id);
      return adminUserService.revokeSessions(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Action completed');
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Action failed'),
  });

  const columns: Column<AdminUserAccount>[] = [
    { key: 'name', header: 'User', cell: (u) => (
      <div>
        <p className="font-medium">{u.fullName}</p>
        <p className="text-xs text-muted-foreground">{u.email ?? u.phone}</p>
      </div>
    ) },
    { key: 'phone', header: 'Phone', cell: (u) => <span className="text-sm">{u.phone}</span> },
    { key: 'biz', header: 'Businesses', align: 'center', cell: (u) => <span className="text-sm">{u.businessCount}</span> },
    { key: 'status', header: 'Status', cell: (u) => u.status === 'ACTIVE' ? <Badge variant="success">Active</Badge> : <Badge variant="destructive">Suspended</Badge> },
    { key: 'last', header: 'Last login', cell: (u) => <span className="text-sm text-muted-foreground">{u.lastLoginAt ? formatRelative(u.lastLoginAt) : 'Never'}</span> },
    { key: 'joined', header: 'Joined', cell: (u) => <span className="text-sm text-muted-foreground">{formatDate(u.createdAt)}</span> },
    { key: 'actions', header: '', align: 'right', cell: (u) => (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="sm" onClick={() => setConfirm({ id: u.id, action: 'revoke', name: u.fullName })} title="Revoke sessions"><LogOut className="h-3 w-3" /></Button>
        {u.status === 'ACTIVE' ? (
          <Button variant="ghost" size="sm" onClick={() => setConfirm({ id: u.id, action: 'suspend', name: u.fullName })}><Ban className="h-3 w-3" /> Suspend</Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setConfirm({ id: u.id, action: 'reactivate', name: u.fullName })}><CheckCircle2 className="h-3 w-3" /> Reactivate</Button>
        )}
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Manage all registered users on the platform." icon={<UsersIcon className="h-5 w-5" />} />
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by name, email or phone..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={isLoading}
        rowKey={(u) => u.id}
        page={page}
        totalPages={data?.totalPages}
        total={data?.total}
        onPageChange={setPage}
        emptyTitle="No users found"
      />
      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(v) => !v && setConfirm(null)}
        title={confirm?.action === 'suspend' ? 'Suspend user?' : confirm?.action === 'reactivate' ? 'Reactivate user?' : 'Revoke all sessions?'}
        description={confirm?.action === 'revoke' ? `This will sign "${confirm?.name}" out of all devices immediately.` : `This will ${confirm?.action} "${confirm?.name}".`}
        confirmLabel={confirm?.action === 'suspend' ? 'Suspend' : confirm?.action === 'reactivate' ? 'Reactivate' : 'Revoke sessions'}
        destructive
        onConfirm={() => confirm && mutation.mutate({ id: confirm.id, action: confirm.action })}
      />
    </div>
  );
}
