import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScrollText } from 'lucide-react';
import { adminAuditService } from '@/lib/services';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Select, SelectTrigger, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';
import type { AuditLog } from '@/lib/types';

const ACTIONS = ['business.suspend', 'business.reactivate', 'user.revoke_session', 'payment.approve', 'payment.reject', 'plan.update', 'subscription.extend', 'subscription.trial', 'admin.login', 'support.assign'];

export default function AuditLogsPage() {
  const [action, setAction] = React.useState('');
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'audit', { action, page }],
    queryFn: () => adminAuditService.list({ action: action || undefined, page }),
  });

  const columns: Column<AuditLog>[] = [
    { key: 'time', header: 'Timestamp', cell: (l) => <span className="text-sm text-muted-foreground">{formatDateTime(l.timestamp)}</span> },
    { key: 'actor', header: 'Actor', cell: (l) => (
      <div>
        <p className="font-medium">{l.actorName}</p>
        <p className="text-xs text-muted-foreground">{l.actorRole.replace('_', ' ')}</p>
      </div>
    ) },
    { key: 'action', header: 'Action', cell: (l) => <Badge variant="secondary" className="font-mono text-xs">{l.action}</Badge> },
    { key: 'target', header: 'Target', cell: (l) => (
      <div>
        <p className="text-sm font-medium">{l.targetLabel}</p>
        <p className="text-xs text-muted-foreground">{l.targetType}</p>
      </div>
    ) },
    { key: 'ip', header: 'IP', cell: (l) => <span className="font-mono text-xs text-muted-foreground">{l.ipAddress ?? '-'}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" description="Immutable record of all admin actions on the platform." icon={<ScrollText className="h-5 w-5" />} />
      <Select value={action} onValueChange={(v) => { setAction(v); setPage(1); }}>
        <SelectTrigger className="w-[260px]">{action || 'All actions'}</SelectTrigger>
        <SelectItem value="">All actions</SelectItem>
        {ACTIONS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
      </Select>
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={isLoading}
        rowKey={(l) => l.id}
        page={page}
        totalPages={data?.totalPages}
        total={data?.total}
        onPageChange={setPage}
        emptyTitle="No audit logs"
      />
    </div>
  );
}
