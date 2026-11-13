import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { adminAuthService } from '@/lib/services';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiError } from '@/lib/api';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});
type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'admin@retailos.com', password: '' },
  });
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (v: FormValues) => {
    setLoading(true);
    try {
      const result = await adminAuthService.login(v.email, v.password);
      setAuth(result.user, result.accessToken);
      toast.success('Welcome back, ' + result.user.fullName.split(' ')[0]);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <ShieldCheck className="h-8 w-8 text-accent" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">RetailOS Admin</h1>
          <p className="mt-1 text-sm text-slate-400">Platform administration portal</p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input id="email" type="email" className="border-slate-600 bg-slate-900/50 pl-9 text-white placeholder:text-slate-500" {...register('email')} placeholder="admin@retailos.com" />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input id="password" type="password" className="border-slate-600 bg-slate-900/50 pl-9 text-white placeholder:text-slate-500" {...register('password')} placeholder="********" />
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" variant="accent" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : <>Sign in <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-500">
            Default mock credentials are pre-filled. Click Sign in to demo.
          </p>
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">&copy; 2026 RetailOS. All rights reserved.</p>
      </div>
    </div>
  );
}
