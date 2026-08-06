import React, { useState } from 'react';
import { Menu, Bell, Shield, Search, RefreshCw, ExternalLink } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { MENU_ITEMS } from './Sidebar';

const Header = ({ admin, onOpenMobileMenu }) => {
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentItem = MENU_ITEMS.find(
    (item) => item.path === location.pathname || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
  );

  const title = currentItem ? currentItem.name : 'Administration Portal';

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  return (
    <header className="glass-header sticky top-0 z-30 h-16 sm:h-20 px-4 sm:px-8 flex items-center justify-between">
      {/* Left side: Mobile menu toggle + Page title */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight truncate flex items-center gap-2">
            {title}
          </h1>
          <p className="text-[11px] font-semibold text-slate-400 hidden sm:block">
            LovenZea Matrimony Platform Management
          </p>
        </div>
      </div>

      {/* Right side: Actions + Live Indicator + Admin Badge */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Quick Refresh */}
        <button
          onClick={handleRefresh}
          title="Reload data"
          className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors hidden sm:flex items-center justify-center"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-rose-400' : ''} />
        </button>

        {/* Live System Pulse */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>System Online</span>
        </div>

        {/* Admin Profile Pill */}
        <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-800">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-rose-950/40">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-white leading-tight truncate max-w-[140px]">{admin?.name || 'Administrator'}</p>
            <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{admin?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
