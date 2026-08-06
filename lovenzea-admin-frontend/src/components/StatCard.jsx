import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color = 'rose', trend, subtitle, onClick }) => {
  const colorMap = {
    rose: {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      glow: 'hover:border-rose-500/40 hover:shadow-rose-950/30',
      gradient: 'from-rose-500 to-pink-600',
    },
    indigo: {
      bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      glow: 'hover:border-indigo-500/40 hover:shadow-indigo-950/30',
      gradient: 'from-indigo-500 to-purple-600',
    },
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'hover:border-emerald-500/40 hover:shadow-emerald-950/30',
      gradient: 'from-emerald-500 to-teal-600',
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'hover:border-amber-500/40 hover:shadow-amber-950/30',
      gradient: 'from-amber-500 to-orange-600',
    },
    cyan: {
      bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glow: 'hover:border-cyan-500/40 hover:shadow-cyan-950/30',
      gradient: 'from-cyan-500 to-blue-600',
    }
  };

  const scheme = colorMap[color] || colorMap.rose;

  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 sm:p-6 rounded-3xl transition-all duration-300 relative overflow-hidden group ${
        onClick ? 'cursor-pointer' : ''
      } ${scheme.glow}`}
    >
      {/* Background soft glow on hover */}
      <div className={`absolute -right-10 -bottom-10 w-32 h-32 bg-gradient-to-br ${scheme.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 rounded-full`} />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className={`p-3.5 rounded-2xl border ${scheme.bg} transition-transform duration-300 group-hover:scale-110`}>
          <Icon size={22} />
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-xs relative z-10">
          <span className={`px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${
            trend.startsWith('+') ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
          }`}>
            {trend.startsWith('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </span>
          <span className="text-slate-500 ml-2 font-medium">vs last cycle</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
