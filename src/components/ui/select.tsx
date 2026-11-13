import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectContextValue {
  value: string;
  onValueChange: (v: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}
const SelectContext = React.createContext<SelectContextValue | null>(null);

export function Select({ value, defaultValue = '', onValueChange, children }: { value?: string; defaultValue?: string; onValueChange?: (v: string) => void; children: React.ReactNode }) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const currentValue = value ?? internalValue;
  const handleChange = (v: string) => {
    setInternalValue(v);
    onValueChange?.(v);
    setOpen(false);
  };
  return <SelectContext.Provider value={{ value: currentValue, onValueChange: handleChange, open, setOpen }}>{children}</SelectContext.Provider>;
}

export function SelectTrigger({ className, children }: { className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(SelectContext)!;
  return (
    <button type="button" onClick={() => ctx.setOpen(!ctx.open)} className={cn('flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring', className)}>
      <span className="truncate">{children}</span>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) return null;
  return <span>{ctx.value || placeholder}</span>;
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(SelectContext)!;
  return (
    <div onClick={() => ctx.onValueChange(value)} className={cn('relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground', ctx.value === value && 'bg-accent/50')}>
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">{ctx.value === value && <Check className="h-4 w-4" />}</span>
      {children}
    </div>
  );
}
