import * as React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Settings, Plus, X } from 'lucide-react';
import { adminConfigService } from '@/lib/services';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { PlatformConfig } from '@/lib/types';

export default function PlatformConfigPage() {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'config'], queryFn: adminConfigService.get });
  const [draft, setDraft] = React.useState<PlatformConfig | null>(null);
  const [newCountry, setNewCountry] = React.useState('');
  const [newCurrency, setNewCurrency] = React.useState('');
  const [newCategory, setNewCategory] = React.useState('');

  React.useEffect(() => { if (data) setDraft(data); }, [data]);

  const mutation = useMutation({
    mutationFn: () => adminConfigService.update(draft!),
    onSuccess: () => toast.success('Configuration saved'),
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  });

  if (isLoading || !draft) return <div className="h-64 animate-pulse rounded-lg bg-muted" />;

  const addCountry = () => { if (newCountry && !draft.countries.includes(newCountry)) { setDraft({ ...draft, countries: [...draft.countries, newCountry] }); setNewCountry(''); } };
  const addCurrency = () => { if (newCurrency && !draft.currencies.includes(newCurrency)) { setDraft({ ...draft, currencies: [...draft.currencies, newCurrency] }); setNewCurrency(''); } };
  const addCategory = () => { if (newCategory && !draft.businessCategories.includes(newCategory)) { setDraft({ ...draft, businessCategories: [...draft.businessCategories, newCategory] }); setNewCategory(''); } };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Configuration"
        description="Manage countries, currencies, categories, feature flags and announcements."
        icon={<Settings className="h-5 w-5" />}
        actions={<Button variant="accent" disabled={mutation.isPending} onClick={() => mutation.mutate()}>{mutation.isPending ? 'Saving...' : 'Save changes'}</Button>}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Countries</CardTitle><CardDescription>Supported countries for business registration</CardDescription></CardHeader>
          <CardContent>
            <div className="mb-3 flex flex-wrap gap-2">
              {draft.countries.map((c) => (
                <Badge key={c} variant="secondary" className="cursor-pointer" onClick={() => setDraft({ ...draft, countries: draft.countries.filter((x) => x !== c) })}>{c} <X className="ml-1 h-3 w-3" /></Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="e.g. NG" value={newCountry} onChange={(e) => setNewCountry(e.target.value.toUpperCase())} />
              <Button variant="outline" onClick={addCountry}><Plus className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Currencies</CardTitle><CardDescription>Supported currencies</CardDescription></CardHeader>
          <CardContent>
            <div className="mb-3 flex flex-wrap gap-2">
              {draft.currencies.map((c) => (
                <Badge key={c} variant="secondary" className="cursor-pointer" onClick={() => setDraft({ ...draft, currencies: draft.currencies.filter((x) => x !== c) })}>{c} <X className="ml-1 h-3 w-3" /></Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="e.g. NGN" value={newCurrency} onChange={(e) => setNewCurrency(e.target.value.toUpperCase())} />
              <Button variant="outline" onClick={addCurrency}><Plus className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Business categories</CardTitle><CardDescription>Categories selectable at business onboarding</CardDescription></CardHeader>
          <CardContent>
            <div className="mb-3 flex flex-wrap gap-2">
              {draft.businessCategories.map((c) => (
                <Badge key={c} variant="secondary" className="cursor-pointer" onClick={() => setDraft({ ...draft, businessCategories: draft.businessCategories.filter((x) => x !== c) })}>{c} <X className="ml-1 h-3 w-3" /></Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="e.g. Pharmacy" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
              <Button variant="outline" onClick={addCategory}><Plus className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Feature flags</CardTitle><CardDescription>Toggle platform-wide features</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(draft.featureFlags).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                  <span className="font-mono text-xs">{key}</span>
                  <Switch checked={value} onCheckedChange={(v) => setDraft({ ...draft, featureFlags: { ...draft.featureFlags, [key]: v } })} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Announcements</CardTitle><CardDescription>Active platform announcements shown to all retailers</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {draft.announcements.map((a) => (
              <div key={a.id} className="flex items-start justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-muted-foreground">{a.body}</p>
                </div>
                <Badge variant={a.active ? 'success' : 'secondary'}>{a.active ? 'Active' : 'Inactive'}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Policy versions</CardTitle><CardDescription>Current versions of legal policies</CardDescription></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Terms of service</Label>
              <Input value={draft.policyVersions.terms} onChange={(e) => setDraft({ ...draft, policyVersions: { ...draft.policyVersions, terms: e.target.value } })} />
            </div>
            <div className="space-y-1.5">
              <Label>Privacy policy</Label>
              <Input value={draft.policyVersions.privacy} onChange={(e) => setDraft({ ...draft, policyVersions: { ...draft.policyVersions, privacy: e.target.value } })} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
