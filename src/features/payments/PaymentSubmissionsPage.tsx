import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wallet, Check, X, ExternalLink } from 'lucide-react';
import { adminPaymentService } from '@/lib/services';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from 'sonner';
import { formatMoney, formatRelative, formatDateTime } from '@/lib/utils';
import type { PaymentSubmission } from '@/lib/types';

const STATUS_VARIANT: Record<string, 'default' | 'success' | 'destructive'> = {
  PENDING: 'default', APPROVED: 'success', REJECTED: 'destructive',
};

export default function PaymentSubmissionsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'payments'], queryFn: adminPaymentService.list });
  const [confirm, setConfirm] = React.useState<{ id: string; action: 'approve' | 'reject'; business: string } | null>(null);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'approve' | 'reject' }) =>
      action === 'approve' ? adminPaymentService.approve(id) : adminPaymentService.reject(id, 'Rejected by admin'),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'payments'] }); toast.success('Decision recorded'); },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Action failed'),
  });
  const pending = (data ?? []).filter((p) => p.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Payment Submissions" description="Review and verify manual bank transfer payments." icon={<Wallet className="h-5 w-5" />} actions={<Badge variant={pending > 0 ? 'warning' : 'secondary'}>{pending} pending</Badge>} />
      {isLoading ? <div className="h-32 animate-pulse rounded-lg bg-muted" /> : (data ?? []).length === 0 ? (
        <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No payment submissions yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {(data ?? []).map((p: PaymentSubmission) => (
            <Card key={p.id} className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{p.businessName}</p>
                    <Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.planName} plan \u00b7 Reference: <span className="font-mono text-foreground">{p.reference}</span></p>
                  <p className="text-xs text-muted-foreground">Submitted {formatRelative(p.submittedAt)} \u00b7 {formatDateTime(p.submittedAt)}</p>
                  {p.reviewedAt && <p className="text-xs text-muted-foreground">Reviewed by {p.reviewerName} {formatRelative(p.reviewedAt)}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-heading text-lg font-semibold">{formatMoney(p.amountMinor)}</p>
                    {p.proofUrl && <a href={p.proofUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-accent hover:underline">View proof <ExternalLink className="h-3 w-3" /></a>}
                  </div>
                  {p.status === 'PENDING' && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setConfirm({ id: p.id, action: 'approve', business: p.businessName })}><Check className="h-4 w-4 text-success" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setConfirm({ id: p.id, action: 'reject', business: p.businessName })}><X className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(v) => !v && setConfirm(null)}
        title={confirm?.action === 'approve' ? 'Approve payment?' : 'Reject payment?'}
        description={confirm?.action === 'approve'
          ? `Approving "${confirm?.business}"'s payment will activate or extend their subscription.`
          : `Rejecting "${confirm?.business}"'s payment. The business will be notified.`}
        confirmLabel={confirm?.action === 'approve' ? 'Approve' : 'Reject'}
        destructive={confirm?.action === 'reject'}
        onConfirm={() => confirm && mutation.mutate({ id: confirm.id, action: confirm.action })}
      />
    </div>
  );
}
