import * as React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange(false); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 w-full max-w-lg">{children}</div>
    </div>,
    document.body,
  );
}

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('max-h-[90vh] overflow-y-auto rounded-xl border bg-card p-6 shadow-xl', className)}>
      {children}
    </div>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 flex items-start justify-between gap-2">{children}</div>;
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn('font-heading text-lg font-semibold', className)}>{children}</h2>;
}

export function DialogDescription({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-sm text-muted-foreground">{children}</p>;
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 flex justify-end gap-2">{children}</div>;
}

export function DialogClose({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
      <X className="h-4 w-4" />
    </button>
  );
}
