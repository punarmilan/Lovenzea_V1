import React from 'react';
import { Lock, ChevronRight } from 'lucide-react';

const PremiumLock = ({ onViewPlans }) => (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/10 backdrop-blur-[2px]">
        <div className="bg-theme-surface/20 backdrop-blur-md p-4 rounded-full mb-3 border border-white/30 shadow-xl">
            <Lock size={32} className="text-white fill-white/10" />
        </div>
        <p className="text-white font-bold text-sm mb-1 drop-shadow-md">Visible to</p>
        <p className="text-white font-bold text-sm mb-3 drop-shadow-md">Premium Members</p>
        <button
            onClick={(e) => {
                e.stopPropagation();
                onViewPlans();
            }}
            className="flex items-center gap-1 text-white bg-theme-surface/20 hover:bg-theme-surface/30 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold border border-white/30 transition-all"
        >
            View Plans <ChevronRight size={14} />
        </button>
    </div>
);

export default PremiumLock;
