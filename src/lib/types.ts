export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type MoneyField = { minor: string; major: number };

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: 'SUPER_ADMIN' | 'OPERATIONS_ADMIN' | 'SUPPORT_ADMIN' | 'FINANCE_ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  lastLoginAt: string | null;
  createdAt: string;
}

export interface AdminBusiness {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string | null;
  ownerPhone: string;
  category: string | null;
  country: string;
  currency: string;
  subscriptionStatus: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'CANCELLED';
  planName: string;
  userCount: number;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface AdminUserAccount {
  id: string;
  fullName: string;
  email: string | null;
  phone: string;
  status: 'ACTIVE' | 'SUSPENDED';
  businessCount: number;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceMinor: string;
  interval: 'MONTHLY' | 'YEARLY';
  features: string[];
  productLimit: number | null;
  staffLimit: number | null;
  branchLimit: number | null;
  cloudSync: boolean;
  advancedReports: boolean;
  dataExport: boolean;
  trialDays: number;
  gracePeriodDays: number;
  active: boolean;
  popular?: boolean;
}

export interface PaymentSubmission {
  id: string;
  businessName: string;
  planName: string;
  amountMinor: string;
  reference: string;
  proofUrl: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedAt: string | null;
  reviewerName: string | null;
}

export interface AdminSubscription {
  id: string;
  businessName: string;
  planName: string;
  status: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'CANCELLED';
  startDate: string;
  endDate: string | null;
  graceEndsAt: string | null;
}

export interface SupportTicket {
  id: string;
  subject: string;
  businessName: string;
  requesterName: string;
  requesterEmail: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assigneeName: string | null;
  createdAt: string;
  updatedAt: string;
  messages: Array<{ author: string; body: string; timestamp: string; isStaff: boolean }>;
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  targetLabel: string;
  details: Record<string, unknown>;
  ipAddress: string | null;
  timestamp: string;
}

export interface PlatformConfig {
  countries: string[];
  currencies: string[];
  businessCategories: string[];
  featureFlags: Record<string, boolean>;
  announcements: Array<{ id: string; title: string; body: string; active: boolean }>;
  policyVersions: { terms: string; privacy: string };
}

export interface SystemHealth {
  uptime: string;
  errorRate: number;
  p95ResponseMs: number;
  queueDepth: number;
  dbConnections: { used: number; max: number };
  recentErrors: Array<{ timestamp: string; endpoint: string; status: number; message: string }>;
}

export interface DashboardMetrics {
  totalBusinesses: number;
  activeBusinesses: number;
  freePlanBusinesses: number;
  paidSubscribers: number;
  expiredSubscriptions: number;
  mrr: MoneyField;
  subscriptionRevenue: MoneyField;
  newRegistrations7d: number;
  cancellations30d: number;
  apiErrors24h: number;
  systemStatus: 'healthy' | 'degraded' | 'down';
  registrationTrend: Array<{ date: string; count: number }>;
  mrrTrend: Array<{ date: string; value: number }>;
  planDistribution: Array<{ plan: string; count: number }>;
  recentActivity: Array<{ id: string; type: string; description: string; timestamp: string }>;
}
