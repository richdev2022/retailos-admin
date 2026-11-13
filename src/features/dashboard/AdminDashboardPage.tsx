import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, CreditCard, DollarSign, AlertTriangle, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { adminDashboardService } from '@/lib/services';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRelative } from '@/lib/utils';
import { format } from 'date-fns';

const PIE_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'dashboard'], queryFn: adminDashboardService.metrics });

  const statusVariant = data?.systemStatus === 'healthy' ? 'success' : data?.systemStatus === 'degraded' ? 'warning' : 'destructive';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Dashboard"
        description="Real-time overview of the RetailOS platform."
        icon={<Activity className="h-5 w-5" />}
        actions={<Badge variant={statusVariant as 'success' | 'warning' | 'destructive'}>System: {data?.systemStatus ?? '...'}</Badge>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total businesses" value={isLoading ? '' : data?.totalBusinesses.toLocaleString() ?? ''} loading={isLoading} icon={<Building2 className="h-5 w-5" />} accent="primary" />
        <StatCard label="Active businesses" value={isLoading ? '' : data?.activeBusinesses.toLocaleString() ?? ''} loading={isLoading} icon={<Building2 className="h-5 w-5" />} accent="success" />
        <StatCard label="Paid subscribers" value={isLoading ? '' : data?.paidSubscribers.toLocaleString() ?? ''} loading={isLoading} icon={<CreditCard className="h-5 w-5" />} accent="accent" />
        <StatCard label="Expired subscriptions" value={isLoading ? '' : data?.expiredSubscriptions.toLocaleString() ?? ''} loading={isLoading} icon={<AlertTriangle className="h-5 w-5" />} accent="destructive" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Monthly recurring revenue" value={isLoading ? '' : `\u20A6${(data?.mrr.major ?? 0).toLocaleString()}`} loading={isLoading} icon={<DollarSign className="h-5 w-5" />} accent="success" />
        <StatCard label="Total revenue (12mo)" value={isLoading ? '' : `\u20A6${(data?.subscriptionRevenue.major ?? 0).toLocaleString()}`} loading={isLoading} icon={<DollarSign className="h-5 w-5" />} accent="accent" />
        <StatCard label="New registrations (7d)" value={isLoading ? '' : String(data?.newRegistrations7d ?? 0)} loading={isLoading} icon={<TrendingUp className="h-5 w-5" />} accent="primary" />
        <StatCard label="Cancellations (30d)" value={isLoading ? '' : String(data?.cancellations30d ?? 0)} loading={isLoading} icon={<TrendingDown className="h-5 w-5" />} accent="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Registration trend (14 days)</CardTitle><CardDescription>New business signups over time</CardDescription></CardHeader>
          <CardContent className="h-72">
            {isLoading ? <div className="h-full animate-pulse rounded-lg bg-muted" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.registrationTrend}>
                  <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tickFormatter={(d) => format(new Date(d), 'MMM dd')} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip labelFormatter={(d) => format(new Date(d as string), 'MMM dd, yyyy')} />
                  <Area type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={2.5} fill="url(#grad1)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Plan distribution</CardTitle><CardDescription>Businesses by current plan</CardDescription></CardHeader>
          <CardContent className="h-72">
            {isLoading ? <div className="h-full animate-pulse rounded-lg bg-muted" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data?.planDistribution} dataKey="count" nameKey="plan" cx="50%" cy="50%" outerRadius={80} label={(e) => `${e.plan}: ${e.count}`}>
                    {data?.planDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>MRR trend</CardTitle><CardDescription>Monthly recurring revenue (in millions NGN)</CardDescription></CardHeader>
        <CardContent className="h-64">
          {isLoading ? <div className="h-full animate-pulse rounded-lg bg-muted" /> : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.mrrTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tickFormatter={(d) => format(new Date(d), 'MMM dd')} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `\u20A6${v}M`} />
                <Tooltip labelFormatter={(d) => format(new Date(d as string), 'MMM dd, yyyy')} formatter={(v) => `\u20A6${v}M`} />
                <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent platform activity</CardTitle><CardDescription>Latest admin actions across the platform</CardDescription></CardHeader>
        <CardContent>
          {isLoading ? <div className="h-32 animate-pulse rounded-lg bg-muted" /> : (
            <div className="space-y-2">
              {data?.recentActivity.map((a) => (
                <div key={a.id} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
                  <Badge variant="outline" className="capitalize">{a.type}</Badge>
                  <p className="flex-1 text-muted-foreground">{a.description}</p>
                  <span className="text-xs text-muted-foreground">{formatRelative(a.timestamp)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
