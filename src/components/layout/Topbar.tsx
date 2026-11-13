import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { Avatar } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LogOut, Settings } from 'lucide-react';

export function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  return (
    <div className="flex h-14 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground">Welcome back,</p>
        <p className="font-medium">{user?.fullName ?? 'Admin'}</p>
        {user && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">{user.role.replace('_', ' ')}</span>}
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full hover:bg-muted">
              <Avatar name={user?.fullName ?? 'Admin'} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}><Settings className="h-4 w-4" /> Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { logout(); navigate('/login'); }}><LogOut className="h-4 w-4" /> Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
