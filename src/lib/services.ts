import { http, USE_MOCK, ApiError } from './api';
import * as mock from './mock-data';
import type {
  AdminUser, AdminBusiness, AdminUserAccount, SubscriptionPlan, PaymentSubmission,
  AdminSubscription, SupportTicket, AuditLog, PlatformConfig, SystemHealth, DashboardMetrics, Paginated,
} from './types';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const uid = (p: string) => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function paginate<T>(items: T[], page = 1, limit = 15): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  return { items: items.slice(start, start + limit), page, limit, total, totalPages };
}

export const adminAuthService = {
  async login(email: string, _password: string): Promise<{ user: AdminUser; accessToken: string }> {
    if (USE_MOCK) { await sleep(500); return { user: mock.mockAdmin, accessToken: 'mock-admin-token' }; }
    return http.post<{ user: AdminUser; accessToken: string }>('/auth/login', { email, password: _password });
  },
  async me(): Promise<AdminUser> {
    if (USE_MOCK) { await sleep(150); return mock.mockAdmin; }
    return http.get<AdminUser>('/auth/me');
  },
};

export const adminDashboardService = {
  async metrics(): Promise<DashboardMetrics> {
    if (USE_MOCK) { await sleep(400); return mock.mockDashboard; }
    return http.get<DashboardMetrics>('/dashboard');
  },
};

export const adminBusinessService = {
  async list(params: { search?: string; status?: string; plan?: string; category?: string; page?: number } = {}): Promise<Paginated<AdminBusiness>> {
    if (USE_MOCK) {
      await sleep(300);
      let items = [...mock.mockBusinesses];
      if (params.search) {
        const q = params.search.toLowerCase();
        items = items.filter((b) => b.name.toLowerCase().includes(q) || b.ownerEmail!.toLowerCase().includes(q) || b.ownerPhone.includes(q));
      }
      if (params.status) items = items.filter((b) => b.subscriptionStatus === params.status);
      if (params.plan) items = items.filter((b) => b.planName === params.plan);
      if (params.category) items = items.filter((b) => b.category === params.category);
      return paginate(items, params.page);
    }
    return http.get<Paginated<AdminBusiness>>('/businesses', params as Record<string, unknown>);
  },
  async get(id: string): Promise<AdminBusiness> {
    if (USE_MOCK) { await sleep(200); return mock.mockBusinesses.find((b) => b.id === id) ?? mock.mockBusinesses[0]!; }
    return http.get<AdminBusiness>(`/businesses/${id}`);
  },
  async suspend(id: string): Promise<void> {
    if (USE_MOCK) { await sleep(500); return; }
    await http.post<void>(`/businesses/${id}/suspend`);
  },
  async reactivate(id: string): Promise<void> {
    if (USE_MOCK) { await sleep(500); return; }
    await http.post<void>(`/businesses/${id}/reactivate`);
  },
};

export const adminUserService = {
  async list(params: { search?: string; page?: number } = {}): Promise<Paginated<AdminUserAccount>> {
    if (USE_MOCK) {
      await sleep(300);
      let items = [...mock.mockUsers];
      if (params.search) {
        const q = params.search.toLowerCase();
        items = items.filter((u) => u.fullName.toLowerCase().includes(q) || (u.email ?? '').toLowerCase().includes(q) || u.phone.includes(q));
      }
      return paginate(items, params.page);
    }
    return http.get<Paginated<AdminUserAccount>>('/users', params as Record<string, unknown>);
  },
  async suspend(id: string): Promise<void> {
    if (USE_MOCK) { await sleep(500); return; }
    await http.post<void>(`/users/${id}/suspend`);
  },
  async reactivate(id: string): Promise<void> {
    if (USE_MOCK) { await sleep(500); return; }
    await http.post<void>(`/users/${id}/reactivate`);
  },
  async revokeSessions(id: string): Promise<void> {
    if (USE_MOCK) { await sleep(400); return; }
    await http.post<void>(`/users/${id}/revoke-sessions`);
  },
};

export const adminPlanService = {
  async list(): Promise<SubscriptionPlan[]> {
    if (USE_MOCK) { await sleep(250); return mock.mockPlans; }
    return http.get<SubscriptionPlan[]>('/plans');
  },
  async create(body: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    if (USE_MOCK) { await sleep(600); return { ...mock.mockPlans[0]!, id: uid('plan_'), ...body } as SubscriptionPlan; }
    return http.post<SubscriptionPlan>('/plans', body);
  },
  async update(id: string, body: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    if (USE_MOCK) { await sleep(500); return { ...(mock.mockPlans.find((p) => p.id === id) ?? mock.mockPlans[0]!), ...body } as SubscriptionPlan; }
    return http.patch<SubscriptionPlan>(`/plans/${id}`, body);
  },
};

export const adminPaymentService = {
  async list(): Promise<PaymentSubmission[]> {
    if (USE_MOCK) { await sleep(300); return mock.mockPayments; }
    return http.get<PaymentSubmission[]>('/payment-submissions');
  },
  async approve(id: string): Promise<void> {
    if (USE_MOCK) { await sleep(600); return; }
    await http.post<void>(`/payment-submissions/${id}/approve`);
  },
  async reject(id: string, _note: string): Promise<void> {
    if (USE_MOCK) { await sleep(600); return; }
    await http.post<void>(`/payment-submissions/${id}/reject`, { note: _note });
  },
};

export const adminSubscriptionService = {
  async list(): Promise<AdminSubscription[]> {
    if (USE_MOCK) { await sleep(300); return mock.mockSubscriptions; }
    return http.get<AdminSubscription[]>('/subscriptions');
  },
  async extend(id: string, _days: number): Promise<void> {
    if (USE_MOCK) { await sleep(600); return; }
    await http.post<void>(`/subscriptions/${id}/extend`, { days: _days });
  },
  async applyTrial(id: string, _days: number): Promise<void> {
    if (USE_MOCK) { await sleep(600); return; }
    await http.post<void>(`/subscriptions/${id}/trial`, { days: _days });
  },
};

export const adminSupportService = {
  async list(): Promise<SupportTicket[]> {
    if (USE_MOCK) { await sleep(300); return mock.mockTickets; }
    return http.get<SupportTicket[]>('/support-tickets');
  },
  async assign(id: string, _adminId: string): Promise<void> {
    if (USE_MOCK) { await sleep(500); return; }
    await http.post<void>(`/support-tickets/${id}/assign`, { adminId: _adminId });
  },
  async respond(id: string, _message: string): Promise<void> {
    if (USE_MOCK) { await sleep(600); return; }
    await http.post<void>(`/support-tickets/${id}/respond`, { message: _message });
  },
};

export const adminAuditService = {
  async list(params: { action?: string; page?: number } = {}): Promise<Paginated<AuditLog>> {
    if (USE_MOCK) {
      await sleep(300);
      let items = [...mock.mockAuditLogs];
      if (params.action) items = items.filter((l) => l.action === params.action);
      return paginate(items, params.page);
    }
    return http.get<Paginated<AuditLog>>('/audit-logs', params as Record<string, unknown>);
  },
};

export const adminConfigService = {
  async get(): Promise<PlatformConfig> {
    if (USE_MOCK) { await sleep(250); return mock.mockConfig; }
    return http.get<PlatformConfig>('/config');
  },
  async update(body: Partial<PlatformConfig>): Promise<PlatformConfig> {
    if (USE_MOCK) { await sleep(500); return { ...mock.mockConfig, ...body }; }
    return http.patch<PlatformConfig>('/config', body);
  },
};

export const adminHealthService = {
  async get(): Promise<SystemHealth> {
    if (USE_MOCK) { await sleep(400); return mock.mockHealth; }
    return http.get<SystemHealth>('/system-health');
  },
};

export function assertNoMock(): void {
  if (USE_MOCK) throw new ApiError('Action requires real backend', 0, 'MOCK_NOT_IMPLEMENTED');
}
