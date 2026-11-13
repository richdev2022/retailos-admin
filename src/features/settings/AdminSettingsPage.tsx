import * as React from 'react';
import { ShieldAlert, KeyRound, Smartphone, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { formatRelative } from '@/lib/utils';

export default function AdminSettingsPage() {
  const { user } = useAuthStore();
  const [mfa, setMfa] = React.useState(true);

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Settings" description="Manage your admin account, security and sessions." icon={<ShieldAlert className="h-5 w-5" />} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Your admin account information</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={user?.fullName ?? 'Admin'} className="h-16 w-16 text-lg" />
              <div>
                <p className="font-medium">{user?.fullName}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <Badge variant="accent" className="mt-1">{user?.role.replace('_', ' ')}</Badge>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input defaultValue={user?.fullName} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input defaultValue={user?.email} disabled />
            </div>
            <Button variant="outline" onClick={() => toast.info('Profile update requires backend integration')}>Save profile</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5" /> Password</CardTitle><CardDescription>Change your admin password</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5"><Label>Current password</Label><Input type="password" placeholder="********" /></div>
            <div className="space-y-1.5"><Label>New password</Label><Input type="password" placeholder="********" /></div>
            <div className="space-y-1.5"><Label>Confirm new password</Label><Input type="password" placeholder="********" /></div>
            <Button variant="outline" onClick={() => toast.info('Password change requires backend integration')}>Update password</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5" /> Multi-factor authentication</CardTitle><CardDescription>Add an extra layer of security</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div><p className="font-medium">Authenticator app</p><p className="text-xs text-muted-foreground">Use Google Authenticator or similar</p></div>
              <Switch checked={mfa} onCheckedChange={setMfa} />
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 text-sm">
              <p className="font-medium text-success flex items-center gap-2"><Smartphone className="h-4 w-4" /> MFA is enabled</p>
              <p className="mt-1 text-xs text-muted-foreground">Last used {formatRelative(user?.lastLoginAt ?? new Date().toISOString())}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><LogOut className="h-5 w-5" /> Active sessions</CardTitle><CardDescription>Devices currently signed in</CardDescription></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <div>
                <p className="font-medium">This device</p>
                <p className="text-xs text-muted-foreground">Chrome on macOS \u00b7 Lagos, NG</p>
                <p className="text-xs text-muted-foreground">Last active {formatRelative(user?.lastLoginAt ?? new Date().toISOString())}</p>
              </div>
              <Badge variant="success">Current</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
