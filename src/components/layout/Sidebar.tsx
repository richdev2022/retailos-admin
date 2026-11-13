import { NavLink } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { navSections } from './nav';
import { cn } from '@/lib/utils';

export function Sidebar() {
  return (
    <div className="flex h-full w-60 flex-col border-r bg-card">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="font-heading text-sm font-semibold">RetailOS</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Admin Portal</p>
        </div>
      </div>
      <nav className="scrollbar-thin flex-1 overflow-y-auto p-3">
        {navSections.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{section.title}</p>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="border-t p-3 text-xs text-muted-foreground">
        <p>RetailOS Admin v1.0</p>
        <p className="mt-1">&copy; 2026 RetailOS</p>
      </div>
    </div>
  );
}
