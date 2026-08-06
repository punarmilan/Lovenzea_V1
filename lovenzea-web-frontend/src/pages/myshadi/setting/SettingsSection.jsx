import { ChevronDown } from 'lucide-react'
import React from 'react'

/**
 * SettingsSection Component
 * A premium accordion-style row for the Settings page.
 * Features smooth transitions, clean typography, and a "New" badge.
 */
function SettingsSection({ title, status, isActive, onToggle, isNew, children }) {
    return (
        <div className="bg-theme-surface overflow-hidden first:rounded-t-2xl last:rounded-b-2xl border-b border-gray-100 last:border-b-0">
            <button
                className="w-full flex items-center justify-between p-5 md:p-6 cursor-pointer hover:bg-gray-50 transition-all duration-300 group"
                onClick={onToggle}
            >
                <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-3">
                        <span className={`text-base md:text-lg font-bold transition-colors duration-300 ${isActive ? 'text-rose-600' : 'text-gray-700 group-hover:text-gray-900'}`}>
                            {title}
                        </span>
                        {isNew && (
                            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] md:text-xs px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-sm">
                                New
                            </span>
                        )}
                    </div>
                    {status && (
                        <span className="text-xs text-rose-500/80 font-medium">
                            {status}
                        </span>
                    )}
                </div>

                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-rose-50 text-rose-500 rotate-180' : 'bg-gray-50 text-gray-300 group-hover:text-gray-400'}`}>
                    <ChevronDown size={18} />
                </div>
            </button>

            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isActive ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-5 md:p-8 pt-0 border-t border-gray-50 bg-theme-surface/50">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default SettingsSection