import React from 'react';

const Badge = ({ variant = 'default', children, size = 'sm' }) => {
  const variantMap = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    primary: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    danger: 'bg-rose-600/20 text-rose-300 border-rose-600/40',
    info: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  };

  const sizeMap = {
    xs: 'text-[10px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${variantMap[variant] || variantMap.default} ${sizeMap[size]}`}>
      {children}
    </span>
  );
};

export default Badge;
