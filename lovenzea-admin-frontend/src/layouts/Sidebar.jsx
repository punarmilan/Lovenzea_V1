import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Smartphone, 
  CalendarDays, 
  CheckCircle2, 
  Image as ImageIcon, 
  Flag, 
  CreditCard, 
  HelpCircle, 
  MessageSquare, 
  History, 
  LogOut,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import projectLogo from '../assets/project_logo_transperent.png';

export const MENU_ITEMS = [
  { 
    name: 'Dashboard', 
    path: '/dashboard', 
    icon: LayoutDashboard, 
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_SUB_ADMIN', 'ROLE_KYC_VERIFIER', 'ROLE_EVENT_MANAGER', 'SUPER_ADMIN', 'ADMIN'] 
  },
  { 
    name: 'Web Users & Staff', 
    path: '/users', 
    icon: Users, 
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_SUB_ADMIN', 'SUPER_ADMIN', 'ADMIN'] 
  },
  { 
    name: 'Mobile App Users', 
    path: '/mobile-users', 
    icon: Smartphone, 
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_SUB_ADMIN', 'SUPER_ADMIN', 'ADMIN'] 
  },
  { 
    name: 'Events & Speed Dates', 
    path: '/events', 
    icon: CalendarDays, 
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_EVENT_MANAGER', 'ROLE_SUB_ADMIN', 'SUPER_ADMIN', 'ADMIN', 'EVENT_MANAGER'] 
  },
  { 
    name: 'Profile Approvals (KYC)', 
    path: '/approvals', 
    icon: CheckCircle2, 
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_KYC_VERIFIER', 'ROLE_SUB_ADMIN', 'SUPER_ADMIN', 'ADMIN', 'KYC_VERIFIER'] 
  },
  { 
    name: 'Photo Moderation', 
    path: '/photos', 
    icon: ImageIcon, 
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_KYC_VERIFIER', 'ROLE_SUB_ADMIN', 'SUPER_ADMIN', 'ADMIN', 'KYC_VERIFIER'] 
  },
  { 
    name: 'Reports & Flags', 
    path: '/reports', 
    icon: Flag, 
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_SUB_ADMIN', 'SUPER_ADMIN', 'ADMIN', 'MODERATOR'] 
  },
  { 
    name: 'Subscription Plans', 
    path: '/subscriptions', 
    icon: CreditCard, 
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_SUB_ADMIN', 'SUPER_ADMIN', 'ADMIN'] 
  },
  { 
    name: 'Support Tickets', 
    path: '/support', 
    icon: HelpCircle, 
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_SUB_ADMIN', 'SUPER_ADMIN', 'ADMIN'] 
  },
  { 
    name: 'Contact Inquiries', 
    path: '/contacts', 
    icon: MessageSquare, 
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_SUB_ADMIN', 'SUPER_ADMIN', 'ADMIN'] 
  },
  { 
    name: 'System Audit Logs', 
    path: '/logs', 
    icon: History, 
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_SUB_ADMIN', 'SUPER_ADMIN', 'ADMIN'] 
  },
];

const Sidebar = ({ admin, onLogout, onCloseMobile }) => {
  const location = useLocation();

  const userRole = admin?.role || 'ROLE_ADMIN';
  const filteredItems = MENU_ITEMS.filter((item) => item.roles.includes(userRole));

  const formatRoleName = (role = '') => {
    return role.replace('ROLE_', '').replace('_', ' ');
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1322] border-r border-slate-800/80 text-slate-200">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
        <Link to="/dashboard" onClick={onCloseMobile} className="flex items-center gap-3 group">
          <div className="relative">
            <img 
              src={projectLogo} 
              alt="LovenZea Logo" 
              className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(244,63,94,0.4)] group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <div>
            <div className="flex items-center font-black tracking-tight text-xl text-white">
              <span>Loven</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-500 to-rose-600">Zea</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400">Admin Hub</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Role Badge Card */}
      <div className="mx-4 mt-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white font-extrabold text-xs shadow-lg shadow-rose-950/50 shrink-0">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{admin?.name || 'Administrator'}</p>
            <p className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider truncate">{formatRoleName(admin?.role)}</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          ACTIVE
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
          Navigation Menu
        </div>
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-950/50 font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <Icon 
                size={18} 
                className={`transition-colors shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-rose-400'
                }`} 
              />
              <span className="truncate">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Footer & Logout */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2.5 w-full px-4 py-2.5 rounded-2xl text-sm font-bold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-rose-600/20 border border-slate-800 hover:border-rose-500/30 transition-all duration-200 group"
        >
          <LogOut size={16} className="text-slate-400 group-hover:text-rose-400 transition-colors" />
          <span>Sign Out</span>
        </button>
        <p className="text-[10px] text-center text-slate-600 font-medium">LovenZea Engine v2.4 • Secured</p>
      </div>
    </div>
  );
};

export default Sidebar;
