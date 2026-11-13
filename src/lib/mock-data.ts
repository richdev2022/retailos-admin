import type { AdminUser, AdminBusiness, AdminUserAccount, SubscriptionPlan, PaymentSubmission, AdminSubscription, SupportTicket, AuditLog, PlatformConfig, SystemHealth, DashboardMetrics } from './types';

const now = Date.now();
const daysAgo = (n: number) => new Date(now - n * 86400000).toISOString();
const hoursAgo = (n: number) => new Date(now - n * 3600000).toISOString();

export const mockAdmin: AdminUser = {
  id: 'adm_001',
  fullName: 'Tunde Admin',
  email: 'admin@retailos.com',
  role: 'SUPER_ADMIN',
  status: 'ACTIVE',
  lastLoginAt: hoursAgo(2),
  createdAt: daysAgo(365),
};

export const mockBusinesses: AdminBusiness[] = Array.from({ length: 48 }, (_, i) => {
  const plans = ['Free', 'Pro', 'Business', 'Enterprise'];
  const statuses = ['TRIAL', 'ACTIVE', 'EXPIRED', 'SUSPENDED', 'CANCELLED'] as const;
  const cats = ['Grocery', 'Pharmacy', 'Electronics', 'Fashion', 'Cosmetics', 'Building Materials'];
  return {
    id: `biz_${String(i + 1).padStart(3, '0')}`,
    name: ['Adaeze General Store', 'Naija Electronics Hub', 'Lagos Pharmacy', 'Bright Cosmetics', 'TechMart', 'BuildWell'][i % 6] + (i >= 6 ? ` #${Math.floor(i / 6) + 1}` : ''),
    ownerName: ['Adaeze Okonkwo', 'Emeka Nwosu', 'Dr. Bisi Adebayo', 'Fatima Bello', 'John Okafor', 'Sarah Ibrahim'][i % 6],
    ownerEmail: `owner${i + 1}@business.com`,
    ownerPhone: `+234801${String(1000000 + i).slice(-7)}`,
    category: cats[i % cats.length]!,
    country: 'NG',
    currency: 'NGN',
    subscriptionStatus: statuses[i % statuses.length],
    planName: plans[i % plans.length]!,
    userCount: 1 + (i % 12),
    status: i % 13 === 0 ? 'SUSPENDED' : 'ACTIVE',
    createdAt: daysAgo(180 - (i % 180)),
  };
});

export const mockUsers: AdminUserAccount[] = Array.from({ length: 32 }, (_, i) => ({
  id: `usr_${String(i + 1).padStart(3, '0')}`,
  fullName: ['Adaeze Okonkwo', 'Emeka Nwosu', 'Dr. Bisi Adebayo', 'Fatima Bello', 'John Okafor', 'Sarah Ibrahim'][i % 6] + (i >= 6 ? ` ${i + 1}` : ''),
  email: `user${i + 1}@example.com`,
  phone: `+234801${String(2000000 + i).slice(-7)}`,
  status: (i % 17 === 0 ? 'SUSPENDED' : 'ACTIVE') as 'ACTIVE' | 'SUSPENDED',
  businessCount: 1 + (i % 3),
  lastLoginAt: i % 4 === 0 ? null : hoursAgo(i % 48),
  createdAt: daysAgo(150 - (i % 150)),
}));

export const mockPlans: SubscriptionPlan[] = [
  {
    id: 'plan_free', name: 'Free', description: 'For small shops getting started',
    priceMinor: '0', interval: 'MONTHLY',
    features: ['50 products', '1 staff', '1 branch', 'POS', 'Stock management', 'Barcode scanning', 'Basic reports'],
    productLimit: 50, staffLimit: 1, branchLimit: 1, cloudSync: false, advancedReports: false, dataExport: false,
    trialDays: 0, gracePeriodDays: 0, active: true,
  },
  {
    id: 'plan_pro', name: 'Pro', description: 'For growing retailers',
    priceMinor: '1500000', interval: 'MONTHLY',
    features: ['Unlimited products', '1 staff', '1 branch', 'POS', 'Stock management', 'Barcode scanning', 'Advanced reports', 'Cloud sync'],
    productLimit: null, staffLimit: 1, branchLimit: 1, cloudSync: true, advancedReports: true, dataExport: true,
    trialDays: 14, gracePeriodDays: 7, active: true, popular: true,
  },
  {
    id: 'plan_business', name: 'Business', description: 'For multi-staff operations',
    priceMinor: '4500000', interval: 'MONTHLY',
    features: ['Unlimited products', '5 staff', '1 branch', 'POS', 'Stock management', 'Barcode scanning', 'Advanced reports', 'Cloud sync', 'Multi-user permissions'],
    productLimit: null, staffLimit: 5, branchLimit: 1, cloudSync: true, advancedReports: true, dataExport: true,
    trialDays: 14, gracePeriodDays: 7, active: true,
  },
  {
    id: 'plan_enterprise', name: 'Enterprise', description: 'For multi-branch chains',
    priceMinor: '12000000', interval: 'MONTHLY',
    features: ['Unlimited products', 'Configurable staff', 'Multiple branches', 'POS', 'Stock management', 'Barcode scanning', 'Advanced reports', 'Cloud sync', 'Multi-user permissions', 'Branch analytics'],
    productLimit: null, staffLimit: null, branchLimit: null, cloudSync: true, advancedReports: true, dataExport: true,
    trialDays: 30, gracePeriodDays: 14, active: true,
  },
];

export const mockPayments: PaymentSubmission[] = Array.from({ length: 14 }, (_, i) => ({
  id: `pay_${String(i + 1).padStart(3, '0')}`,
  businessName: mockBusinesses[i]!.name,
  planName: ['Pro', 'Business', 'Enterprise'][i % 3]!,
  amountMinor: ['1500000', '4500000', '12000000'][i % 3]!,
  reference: `TRF-${20251113}-${String(i + 1).padStart(3, '0')}`,
  proofUrl: i % 3 === 0 ? null : `https://proof.retailos.com/receipt-${i + 1}.png`,
  status: i < 6 ? 'PENDING' : i < 10 ? 'APPROVED' : 'REJECTED',
  submittedAt: hoursAgo(i * 6 + 2),
  reviewedAt: i < 6 ? null : hoursAgo(i * 6 - 12),
  reviewerName: i < 6 ? null : 'Tunde Admin',
}));

export const mockSubscriptions: AdminSubscription[] = mockBusinesses.slice(0, 30).map((b, i) => ({
  id: `sub_${String(i + 1).padStart(3, '0')}`,
  businessName: b.name,
  planName: b.planName,
  status: b.subscriptionStatus,
  startDate: daysAgo(120 - i),
  endDate: daysAgo(-15 + (i % 30)),
  graceEndsAt: b.subscriptionStatus === 'EXPIRED' ? daysAgo(-7) : null,
}));

export const mockTickets: SupportTicket[] = Array.from({ length: 16 }, (_, i) => {
  const statuses = ['OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED'] as const;
  return {
    id: `tkt_${String(i + 1).padStart(3, '0')}`,
    subject: ['Cannot import products', 'Receipt printer setup', 'Subscription activation delay', 'Cannot login after email change', 'POS slow on Android', 'Bulk product upload fails'][i % 6],
    businessName: mockBusinesses[i]!.name,
    requesterName: mockBusinesses[i]!.ownerName,
    requesterEmail: mockBusinesses[i]!.ownerEmail!,
    status: statuses[i % statuses.length],
    priority: (i % 4 === 0 ? 'HIGH' : i % 4 === 1 ? 'MEDIUM' : 'LOW') as 'LOW' | 'MEDIUM' | 'HIGH',
    assigneeName: i % 2 === 0 ? 'Tunde Admin' : null,
    createdAt: daysAgo(i),
    updatedAt: hoursAgo(i * 4),
    messages: [
      { author: mockBusinesses[i]!.ownerName, body: 'Initial issue report', timestamp: daysAgo(i), isStaff: false },
      ...(i > 1 ? [{ author: 'Tunde Admin', body: 'Looking into this, will get back to you shortly.', timestamp: hoursAgo(i * 4), isStaff: true }] : []),
    ],
  };
});

export const mockAuditLogs: AuditLog[] = Array.from({ length: 40 }, (_, i) => ({
  id: `log_${String(i + 1).padStart(3, '0')}`,
  actorName: ['Tunde Admin', 'Aisha Ops', 'Chidi Support', 'Ngozi Finance'][i % 4],
  actorRole: ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN', 'FINANCE_ADMIN'][i % 4]!,
  action: ['business.suspend', 'business.reactivate', 'user.revoke_session', 'payment.approve', 'payment.reject', 'plan.update', 'subscription.extend', 'subscription.trial', 'admin.login', 'support.assign'][i % 10]!,
  targetType: ['business', 'user', 'payment_submission', 'plan', 'subscription', 'support_ticket'][i % 6]!,
  targetId: `tgt_${i + 1}`,
  targetLabel: mockBusinesses[i % mockBusinesses.length]!.name,
  details: { reason: 'Policy violation', days: 7 },
  ipAddress: `102.89.${i % 255}.${(i * 7) % 255}`,
  timestamp: hoursAgo(i * 3),
}));

export const mockConfig: PlatformConfig = {
  countries: ['NG', 'GH', 'KE', 'ZA'],
  currencies: ['NGN', 'GHS', 'KES', 'ZAR', 'USD'],
  businessCategories: ['Grocery', 'Pharmacy', 'Electronics', 'Fashion', 'Cosmetics', 'Building Materials', 'General Merchandise'],
  featureFlags: { bulk_import: true, thermal_printing: false, multi_branch: true, ecommerce: false, loyalty: false },
  announcements: [
    { id: 'ann_1', title: 'Scheduled maintenance', body: 'System will be unavailable on Sunday 2-4am WAT for maintenance.', active: true },
    { id: 'ann_2', title: 'New feature: Branch analytics', body: 'Enterprise plans now support branch-level analytics.', active: true },
  ],
  policyVersions: { terms: 'v1.2', privacy: 'v1.1' },
};

export const mockHealth: SystemHealth = {
  uptime: '27d 14h 22m',
  errorRate: 0.42,
  p95ResponseMs: 287,
  queueDepth: 3,
  dbConnections: { used: 12, max: 50 },
  recentErrors: Array.from({ length: 8 }, (_, i) => ({
    timestamp: hoursAgo(i * 2),
    endpoint: ['/api/v1/sales', '/api/v1/sync/push', '/api/v1/products/import', '/api/v1/reports/dashboard'][i % 4]!,
    status: [500, 503, 422, 429][i % 4]!,
    message: ['Database timeout', 'Service unavailable', 'Validation failed', 'Rate limit exceeded'][i % 4],
  })),
};

export const mockDashboard: DashboardMetrics = {
  totalBusinesses: 1248,
  activeBusinesses: 1093,
  freePlanBusinesses: 712,
  paidSubscribers: 381,
  expiredSubscriptions: 47,
  mrr: { minor: '1875000000', major: 18750000 },
  subscriptionRevenue: { minor: '22500000000', major: 225000000 },
  newRegistrations7d: 89,
  cancellations30d: 12,
  apiErrors24h: 23,
  systemStatus: 'healthy',
  registrationTrend: Array.from({ length: 14 }, (_, i) => ({ date: daysAgo(13 - i).slice(0, 10), count: 8 + Math.round(Math.sin(i / 2) * 5) + (i % 3) })),
  mrrTrend: Array.from({ length: 14 }, (_, i) => ({ date: daysAgo(13 - i).slice(0, 10), value: 17.5 + i * 0.18 })),
  planDistribution: [
    { plan: 'Free', count: 712 },
    { plan: 'Pro', count: 268 },
    { plan: 'Business', count: 89 },
    { plan: 'Enterprise', count: 24 },
  ],
  recentActivity: mockAuditLogs.slice(0, 6).map((l) => ({
    id: l.id,
    type: l.targetType,
    description: `${l.actorName} ${l.action.replace(/[._]/g, ' ')} on ${l.targetLabel}`,
    timestamp: l.timestamp,
  })),
};
