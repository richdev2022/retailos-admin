import { cn } from '@/lib/utils';
import { initials } from '@/lib/utils';

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <div className={cn('flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent', className)}>
      {initials(name)}
    </div>
  );
}
