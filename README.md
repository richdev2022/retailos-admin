# RetailOS Admin Portal

React + TypeScript admin portal for the RetailOS multi-tenant retail SaaS.

## Tech stack
- Vite + React 18 + TypeScript (strict)
- TailwindCSS + hand-written shadcn-style UI components
- react-router-dom v6, @tanstack/react-query, axios
- recharts, zustand, sonner, react-hook-form + zod

## Modules
- Dashboard — platform KPIs (businesses, users, subscribers, MRR, errors, health)
- Businesses — search, filter, suspend/reactivate, view subscription history
- Users — search, suspend/reactivate, revoke sessions, view activity
- Subscription plans — CRUD with configurable entitlements
- Payment submissions — review queue, approve/reject with notes
- Subscriptions — list, extend, trial, suspend
- Support tickets — queue, assign, respond, escalate
- Audit logs — paginated, filterable
- Platform config — countries, currencies, categories, feature flags
- System health — uptime, error rate, p95 latency
- Settings — admin profile, password, MFA, sessions

## Quick start
```bash
npm install
cp .env.example .env   # defaults to VITE_USE_MOCK=true
npm run dev            # http://localhost:5174
npm run build
```

## Default mock admin login
- Email: `admin@retailos.com`
- Password: (any) — mock accepts any password

## Environment variables
| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_URL` | Backend base URL | `http://localhost:4000` |
| `VITE_USE_MOCK` | Use mock data | `true` |

## Docker
```bash
docker build -t retailos-admin .
docker run -p 5174:80 retailos-admin
```
