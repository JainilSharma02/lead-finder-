import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Search, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/search', icon: Search, label: 'Find Leads' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full bg-surface border-r border-surface-border">
      <div className="flex flex-col px-6 py-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-background font-bold">
            L
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-foreground">Lead Finder Pro</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-background'
                  : 'text-foreground-muted hover:bg-surface-raised hover:text-foreground'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <button 
          onClick={toggleTheme} 
          className="flex items-center gap-3 w-full rounded-lg px-4 py-3 text-sm font-medium text-foreground-muted hover:bg-surface-raised hover:text-foreground transition-all mb-4"
        >
          {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          <span>Toggle Theme</span>
        </button>
        
        <div className="flex items-center gap-3 p-4 bg-surface-raised rounded-xl border border-surface-border">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-background">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
          </div>
          <button onClick={handleLogout} className="text-foreground-muted hover:text-foreground transition-colors p-1">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      {/* Desktop sidebar rail */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block z-40">
        <NavContent />
      </aside>

      {/* Mobile topbar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-surface-border bg-surface px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-background font-bold">
            L
          </div>
          <span className="font-display font-bold tracking-tight text-foreground">Lead Finder Pro</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-1 text-foreground-muted" aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
              onClick={() => setMobileOpen(false)} 
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 left-0 flex w-72 flex-col bg-surface shadow-2xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-4 z-50 p-2 text-foreground-muted"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <NavContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="lg:pl-64 min-h-screen">
        <div className="mx-auto max-w-7xl p-6 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
