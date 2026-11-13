import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LifeBuoy } from 'lucide-react';
import { adminSupportService } from '@/lib/services';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { formatRelative, formatDateTime } from '@/lib/utils';
import type { SupportTicket } from '@/lib/types';

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  OPEN: 'default', IN_PROGRESS: 'warning', WAITING_CUSTOMER: 'secondary', RESOLVED: 'success', CLOSED: 'secondary',
};

export default function SupportTicketsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'tickets'], queryFn: adminSupportService.list });
  const [selected, setSelected] = React.useState<SupportTicket | null>(null);
  const [reply, setReply] = React.useState('');
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => adminSupportService.respond(selected!.id, reply),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'tickets'] }); toast.success('Reply sent'); setReply(''); },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to send reply'),
  });

  React.useEffect(() => {
    if (data && selected) {
      const updated = data.find((t) => t.id === selected.id);
      if (updated) setSelected(updated);
    }
  }, [data, selected]);

  return (
    <div className="space-y-6">
      <PageHeader title="Support Tickets" description="Customer support requests across all businesses." icon={<LifeBuoy className="h-5 w-5" />} />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          {isLoading ? <div className="h-40 animate-pulse rounded-lg bg-muted" /> : (data ?? []).length === 0 ? (
            <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No tickets.</CardContent></Card>
          ) : (
            (data ?? []).map((t) => (
              <Card key={t.id} className={`cursor-pointer p-4 transition-colors hover:bg-muted/30 ${selected?.id === t.id ? 'border-accent' : ''}`} onClick={() => setSelected(t)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-medium">{t.subject}</p>
                    <p className="text-xs text-muted-foreground">{t.businessName} \u00b7 {t.requesterName}</p>
                    <p className="text-xs text-muted-foreground">{formatRelative(t.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={STATUS_VARIANT[t.status]}>{t.status.replace('_', ' ')}</Badge>
                    {t.priority === 'HIGH' && <Badge variant="destructive">High</Badge>}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
        <Card className="p-4">
          {selected ? (
            <div className="flex h-full flex-col">
              <div className="border-b pb-3">
                <p className="font-medium">{selected.subject}</p>
                <p className="text-xs text-muted-foreground">{selected.businessName} \u00b7 {selected.requesterEmail}</p>
              </div>
              <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto py-4">
                {selected.messages.map((m, i) => (
                  <div key={i} className={`flex ${m.isStaff ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 text-sm ${m.isStaff ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>
                      <p className="mb-1 text-xs font-medium">{m.author}</p>
                      <p>{m.body}</p>
                      <p className="mt-1 text-[10px] opacity-70">{formatDateTime(m.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t pt-3">
                <Textarea rows={2} placeholder="Type your reply..." value={reply} onChange={(e) => setReply(e.target.value)} />
                <Button variant="accent" className="w-full" disabled={!reply.trim() || mutation.isPending} onClick={() => mutation.mutate()}>{mutation.isPending ? 'Sending...' : 'Send reply'}</Button>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Select a ticket to view conversation
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
