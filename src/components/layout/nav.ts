import {
  LayoutDashboard, Building2, Users, CreditCard, Wallet, Receipt,
  LifeBuoy, ScrollText, Settings, Activity, ShieldAlert,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem { label: string; to: string; icon: LucideIcon; }
export interface NavSection { title: string; items: NavItem[]; }

export const navSections: NavSection[] = [
  { title: 'Overview', items: [{ label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard }] },
  {
    title: 'Operations',
    items: [
      { label: 'Businesses', to: '/businesses', icon: Building2 },
      { label: 'Users', to: '/users', icon: Users },
      { label: 'Subscriptions', to: '/subscriptions', icon: CreditCard },
      { label: 'Payment Submissions', to: '/payments', icon: Wallet },
      { label: 'Plans', to: '/plans', icon: Receipt },
    ],
  },
  {
    title: 'Support & Insights',
    items: [
      { label: 'Support Tickets', to: '/support', icon: LifeBuoy },
      { label: 'Audit Logs', to: '/audit', icon: ScrollText },
      { label: 'System Health', to: '/health', icon: Activity },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { label: 'Platform Config', to: '/config', icon: Settings },
      { label: 'Settings', to: '/settings', icon: ShieldAlert },
    ],
  },
];
