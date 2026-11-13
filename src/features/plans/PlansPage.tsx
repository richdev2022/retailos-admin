import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Receipt, Plus, Crown, Rocket, Building2, Sparkles } from 'lucide-react';
import { adminPlanService } from '@/lib/services';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { formatMoney } from '@/lib/utils';
import type { SubscriptionPlan } from '@/lib/types';

const PLAN_ICONS: Record<string, React.ReactNode> = {
  Free: <Building2 className="h-5 w-5" />,
  Pro: <Rocket className="h-5 w-5" />,
  Business: <Crown className="h-5 w-5" />,
  Enterprise: <Sparkles className="h-5 w-5" />,
};

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  priceMinor: z.coerce.number().min(0),
  interval: z.enum(['MONTHLY', 'YEARLY']),
  productLimit: z.coerce.number().nullable(),
  staffLimit: z.coerce.number().nullable(),
  branchLimit: z.coerce.number().nullable(),
  trialDays: z.coerce.number().min(0),
  gracePeriodDays: z.coerce.number().min(0),
  cloudSync: z.boolean(),
  advancedReports: z.boolean(),
  dataExport: z.boolean(),
  active: z.boolean(),
  features: z.string(),
});
type FormValues = z.infer<typeof schema>;

export default function PlansPage() {
  const { data: plans, isLoading } = useQuery({ queryKey: ['admin', 'plans'], queryFn: adminPlanService.list });
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<SubscriptionPlan | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Plans"
        description="Configure plans, prices and entitlements."
        icon={<Receipt className="h-5 w-5" />}
        actions={<Button variant="accent" onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="h-4 w-4" /> New plan</Button>}
      />
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((i) => <div key={i} className="h-72 animate-pulse rounded-lg bg-muted" />)}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans?.map((plan) => (
            <Card key={plan.id} className={plan.popular ? 'border-accent' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">{PLAN_ICONS[plan.name] ?? <Receipt className="h-5 w-5" />}</div>
                  {plan.popular && <Badge>Popular</Badge>}
                  {!plan.active && <Badge variant="secondary">Inactive</Badge>}
                </div>
                <CardTitle className="mt-2">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-2xl font-semibold">{formatMoney(plan.priceMinor)}<span className="text-sm font-normal text-muted-foreground">/{plan.interval.toLowerCase().replace('ly', '')}</span></p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded border p-2"><p className="text-muted-foreground">Products</p><p className="font-medium">{plan.productLimit ?? '∞'}</p></div>
                  <div className="rounded border p-2"><p className="text-muted-foreground">Staff</p><p className="font-medium">{plan.staffLimit ?? '∞'}</p></div>
                  <div className="rounded border p-2"><p className="text-muted-foreground">Branches</p><p className="font-medium">{plan.branchLimit ?? '∞'}</p></div>
                </div>
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <li>Cloud sync: {plan.cloudSync ? 'Yes' : 'No'}</li>
                  <li>Advanced reports: {plan.advancedReports ? 'Yes' : 'No'}</li>
                  <li>Trial: {plan.trialDays}d \u00b7 Grace: {plan.gracePeriodDays}d</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => { setEditing(plan); setDialogOpen(true); }}>Edit plan</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <PlanDialog open={dialogOpen} onOpenChange={setDialogOpen} plan={editing} />
    </div>
  );
}

function PlanDialog({ open, onOpenChange, plan }: { open: boolean; onOpenChange: (v: boolean) => void; plan: SubscriptionPlan | null }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: plan ? {
      name: plan.name, description: plan.description, priceMinor: Number(plan.priceMinor) / 100, interval: plan.interval,
      productLimit: plan.productLimit, staffLimit: plan.staffLimit, branchLimit: plan.branchLimit,
      trialDays: plan.trialDays, gracePeriodDays: plan.gracePeriodDays,
      cloudSync: plan.cloudSync, advancedReports: plan.advancedReports, dataExport: plan.dataExport,
      active: plan.active, features: plan.features.join('\n'),
    } : undefined,
  });
  React.useEffect(() => { if (open) reset(); }, [open, reset]);
  const cloudSync = watch('cloudSync'); const advancedReports = watch('advancedReports'); const dataExport = watch('dataExport'); const active = watch('active');
  const mutation = useMutation({
    mutationFn: (v: FormValues) => {
      const body = {
        name: v.name, description: v.description, priceMinor: String(Math.round(v.priceMinor * 100)), interval: v.interval,
        productLimit: v.productLimit === 0 ? null : v.productLimit, staffLimit: v.staffLimit === 0 ? null : v.staffLimit, branchLimit: v.branchLimit === 0 ? null : v.branchLimit,
        trialDays: v.trialDays, gracePeriodDays: v.gracePeriodDays,
        cloudSync: v.cloudSync, advancedReports: v.advancedReports, dataExport: v.dataExport, active: v.active,
        features: v.features.split('\n').map((s) => s.trim()).filter(Boolean),
      };
      return plan ? adminPlanService.update(plan.id, body) : adminPlanService.create(body);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] }); toast.success(plan ? 'Plan updated' : 'Plan created'); onOpenChange(false); },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save plan'),
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle>{plan ? 'Edit plan' : 'New plan'}</DialogTitle><DialogDescription>Configure pricing and entitlements</DialogDescription></DialogHeader>
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Price (NGN)</Label>
              <Input type="number" step="0.01" {...register('priceMinor')} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea rows={2} {...register('description')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5"><Label>Product limit</Label><Input type="number" {...register('productLimit')} /></div>
            <div className="space-y-1.5"><Label>Staff limit</Label><Input type="number" {...register('staffLimit')} /></div>
            <div className="space-y-1.5"><Label>Branch limit</Label><Input type="number" {...register('branchLimit')} /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Trial days</Label><Input type="number" {...register('trialDays')} /></div>
            <div className="space-y-1.5"><Label>Grace period (days)</Label><Input type="number" {...register('gracePeriodDays')} /></div>
          </div>
          <div className="space-y-2">
            <Label>Entitlements</Label>
            <div className="flex items-center justify-between rounded-lg border p-3 text-sm"><span>Cloud sync</span><Switch checked={cloudSync} onCheckedChange={(v) => setValue('cloudSync', v)} /></div>
            <div className="flex items-center justify-between rounded-lg border p-3 text-sm"><span>Advanced reports</span><Switch checked={advancedReports} onCheckedChange={(v) => setValue('advancedReports', v)} /></div>
            <div className="flex items-center justify-between rounded-lg border p-3 text-sm"><span>Data export</span><Switch checked={dataExport} onCheckedChange={(v) => setValue('dataExport', v)} /></div>
            <div className="flex items-center justify-between rounded-lg border p-3 text-sm"><span>Plan active</span><Switch checked={active} onCheckedChange={(v) => setValue('active', v)} /></div>
          </div>
          <div className="space-y-1.5">
            <Label>Features (one per line)</Label>
            <Textarea rows={4} {...register('features')} placeholder="Unlimited products\n1 staff\nPOS" />
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="accent" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Save plan'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
