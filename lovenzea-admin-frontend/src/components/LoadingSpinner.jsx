import React from 'react';

const LoadingSpinner = ({ text = 'Loading data...' }) => {
  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-rose-500 animate-spin" />
        <div className="absolute inset-0 rounded-full blur-md bg-rose-500/20" />
      </div>
      {text && <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400 animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
