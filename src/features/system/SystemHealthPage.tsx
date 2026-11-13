import { useQuery } from '@tanstack/react-query';
import { Activity, Clock, AlertTriangle, Database, Server } from 'lucide-react';
import { adminHealthService } from '@/lib/services';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';

export default function SystemHealthPage() {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'health'], queryFn: adminHealthService.get });
  return (
    <div className="space-y-6">
      <PageHeader title="System Health" description="Real-time platform metrics and error monitoring." icon={<Activity className="h-5 w-5" />} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Uptime" value={isLoading ? '' : data?.uptime ?? ''} loading={isLoading} icon={<Clock className="h-5 w-5" />} accent="success" />
        <StatCard label="Error rate" value={isLoading ? '' : `${data?.errorRate ?? 0}%`} loading={isLoading} icon={<AlertTriangle className="h-5 w-5" />} accent={data && data.errorRate > 1 ? 'destructive' : 'success'} />
        <StatCard label="p95 response" value={isLoading ? '' : `${data?.p95ResponseMs ?? 0} ms`} loading={isLoading} icon={<Activity className="h-5 w-5" />} accent={data && data.p95ResponseMs > 500 ? 'warning' : 'accent'} />
        <StatCard label="Queue depth" value={isLoading ? '' : String(data?.queueDepth ?? 0)} loading={isLoading} icon={<Server className="h-5 w-5" />} accent="primary" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" /> Database connections</CardTitle><CardDescription>Connection pool utilization</CardDescription></CardHeader>
          <CardContent>
            {isLoading ? <div className="h-16 animate-pulse rounded-lg bg-muted" /> : data && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{data.dbConnections.used} / {data.dbConnections.max} connections</span>
                  <Badge variant={data.dbConnections.used / data.dbConnections.max > 0.8 ? 'destructive' : 'success'}>{Math.round((data.dbConnections.used / data.dbConnections.max) * 100)}%</Badge>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-accent" style={{ width: `${(data.dbConnections.used / data.dbConnections.max) * 100}%` }} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Recent errors (24h)</CardTitle><CardDescription>Most recent API errors</CardDescription></CardHeader>
          <CardContent>
            {isLoading ? <div className="h-32 animate-pulse rounded-lg bg-muted" /> : (data?.recentErrors ?? []).length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No recent errors.</p>
            ) : (
              <div className="space-y-2">
                {data?.recentErrors.map((err, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                    <div>
                      <p className="font-mono text-xs">{err.endpoint}</p>
                      <p className="text-xs text-muted-foreground">{err.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={err.status >= 500 ? 'destructive' : 'warning'}>{err.status}</Badge>
                      <span className="text-xs text-muted-foreground">{formatDateTime(err.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
