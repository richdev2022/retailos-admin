import * as React from 'react';
import { cn } from '@/lib/utils';

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <DropdownMenuContext.Provider value={{ open, setOpen }}>{children}</DropdownMenuContext.Provider>
    </div>
  );
}
const DropdownMenuContext = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

export function DropdownMenuTrigger({ children, asChild }: { children: React.ReactElement; asChild?: boolean }) {
  const ctx = React.useContext(DropdownMenuContext)!;
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    ctx.setOpen(!ctx.open);
  };
  if (asChild) {
    return React.cloneElement(children, { onClick: handleClick });
  }
  return <span onClick={handleClick}>{children}</span>;
}

export function DropdownMenuContent({ children, className, align = 'end' }: { children: React.ReactNode; className?: string; align?: 'start' | 'end' }) {
  const ctx = React.useContext(DropdownMenuContext)!;
  React.useEffect(() => {
    if (!ctx.open) return;
    const close = () => ctx.setOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [ctx]);
  if (!ctx.open) return null;
  return (
    <div className={cn('absolute z-50 mt-1 min-w-[10rem] overflow-hidden rounded-md border bg-popover p-1 shadow-md', align === 'end' ? 'right-0' : 'left-0', className)}>
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  const ctx = React.useContext(DropdownMenuContext)!;
  return (
    <button
      onClick={() => { onClick?.(); ctx.setOpen(false); }}
      className={cn('flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground', className)}
    >
      {children}
    </button>
  );
}

export function DropdownMenuLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{children}</div>;
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-border" />;
}
