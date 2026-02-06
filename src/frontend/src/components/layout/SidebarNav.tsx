import { Link, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, Briefcase, TrendingUp, Megaphone, Sparkles, CreditCard, BarChart3 } from 'lucide-react';
import LoginButton from '../auth/LoginButton';
import { useGetCallerUserProfile } from '../../hooks/useQueries';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/portfolios', label: 'Portfolios', icon: Briefcase },
  { path: '/sales', label: 'Sales', icon: TrendingUp },
  { path: '/marketing', label: 'Marketing', icon: Megaphone },
  { path: '/ad-generator', label: 'Ad Generator', icon: Sparkles },
  { path: '/subscription', label: 'Subscription', icon: CreditCard },
  { path: '/subscription-analytics', label: 'Subscription Analytics', icon: BarChart3 },
];

export default function SidebarNav() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/generated/caffeine-ai-logo.dim_512x512.png" 
            alt="Caffeine AI" 
            className="h-10 w-10 rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate">Caffeine AI</h1>
            {userProfile && (
              <p className="text-xs text-muted-foreground truncate">{userProfile.name}</p>
            )}
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <LoginButton />
      </div>
    </aside>
  );
}
