import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

const AdvancedFiltersDrawer = ({ 
    isOpen, 
    onClose, 
    filters, 
    filterOptions,
    onFilterChange,
    onApply 
}) => {
    const [openSections, setOpenSections] = useState({
        basic: true,
        location: false,
        career: false,
        lifestyle: false,
        family: false,
        astrology: false
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    if (!isOpen) return null;

    const renderSelect = (label, key, options) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <select
                value={filters[key]?.[0] || ''}
                onChange={(e) => onFilterChange(key, e.target.value ? [e.target.value] : [])}
                className="w-full bg-gray-50 border border-theme-border text-gray-700 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block p-2.5 outline-none transition-colors"
            >
                <option value="">Any {label}</option>
                {options?.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );

    const renderInput = (label, key, placeholder, type = "text") => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <input
                type={type}
                value={filters[key] || ''}
                onChange={(e) => onFilterChange(key, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-gray-50 border border-theme-border text-gray-700 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block p-2.5 outline-none transition-colors"
            />
        </div>
    );

    const drawerContent = (
        <div className="fixed inset-0 z-[99999] flex justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-theme-surface h-full shadow-2xl flex flex-col animate-slide-left">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5 text-pink-600" />
                        <h2 className="text-lg font-bold text-gray-800">Advanced Filters</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-theme-text-secondary hover:text-gray-800"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    
                    {/* Basic Section */}
                    <div className="mb-4 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <button 
                            onClick={() => toggleSection('basic')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <span className="font-semibold text-gray-800">Basic Details</span>
                            {openSections.basic ? <ChevronUp className="w-4 h-4 text-theme-text-secondary"/> : <ChevronDown className="w-4 h-4 text-theme-text-secondary"/>}
                        </button>
                        {openSections.basic && (
                            <div className="p-4 bg-theme-surface">
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Age From</label>
                                        <input type="number" value={filters.ageFrom || ''} onChange={(e) => onFilterChange('ageFrom', e.target.value)} className="w-full bg-gray-50 border border-theme-border text-sm rounded-lg p-2.5 outline-none focus:border-pink-500" placeholder="18" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Age To</label>
                                        <input type="number" value={filters.ageTo || ''} onChange={(e) => onFilterChange('ageTo', e.target.value)} className="w-full bg-gray-50 border border-theme-border text-sm rounded-lg p-2.5 outline-none focus:border-pink-500" placeholder="50" />
                                    </div>
                                </div>
                                {renderSelect("Religion", "religion", filterOptions.religion)}
                                {renderSelect("Caste", "caste", filterOptions.caste)}
                                {renderSelect("Sub Caste", "subCaste", filterOptions.subCaste)}
                                {renderSelect("Marital Status", "maritalStatus", filterOptions.maritalStatus)}
                                {renderSelect("Mother Tongue", "motherTongue", filterOptions.motherTongue)}
                            </div>
                        )}
                    </div>

                    {/* Location Section */}
                    <div className="mb-4 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <button 
                            onClick={() => toggleSection('location')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <span className="font-semibold text-gray-800">Location</span>
                            {openSections.location ? <ChevronUp className="w-4 h-4 text-theme-text-secondary"/> : <ChevronDown className="w-4 h-4 text-theme-text-secondary"/>}
                        </button>
                        {openSections.location && (
                            <div className="p-4 bg-theme-surface">
                                {renderSelect("Country", "country", filterOptions.country)}
                                {renderSelect("State", "state", filterOptions.state)}
                                {renderSelect("City", "city", filterOptions.city)}
                            </div>
                        )}
                    </div>

                    {/* Career Section */}
                    <div className="mb-4 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <button 
                            onClick={() => toggleSection('career')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <span className="font-semibold text-gray-800">Education & Career</span>
                            {openSections.career ? <ChevronUp className="w-4 h-4 text-theme-text-secondary"/> : <ChevronDown className="w-4 h-4 text-theme-text-secondary"/>}
                        </button>
                        {openSections.career && (
                            <div className="p-4 bg-theme-surface">
                                {renderSelect("Education Level", "educationLevel", filterOptions.educationLevel)}
                                {renderSelect("Occupation", "occupation", filterOptions.occupation)}
                                {renderSelect("Annual Income", "annualIncome", filterOptions.annualIncome)}
                            </div>
                        )}
                    </div>

                    {/* Lifestyle Section */}
                    <div className="mb-4 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <button 
                            onClick={() => toggleSection('lifestyle')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <span className="font-semibold text-gray-800">Lifestyle</span>
                            {openSections.lifestyle ? <ChevronUp className="w-4 h-4 text-theme-text-secondary"/> : <ChevronDown className="w-4 h-4 text-theme-text-secondary"/>}
                        </button>
                        {openSections.lifestyle && (
                            <div className="p-4 bg-theme-surface">
                                {renderSelect("Diet", "diet", filterOptions.diet)}
                                {renderSelect("Smoking", "smokingHabit", filterOptions.smokingHabit)}
                                {renderSelect("Drinking", "drinkingHabit", filterOptions.drinkingHabit)}
                            </div>
                        )}
                    </div>

                    {/* Astrology Section */}
                    <div className="mb-4 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <button 
                            onClick={() => toggleSection('astrology')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <span className="font-semibold text-gray-800">Astrology</span>
                            {openSections.astrology ? <ChevronUp className="w-4 h-4 text-theme-text-secondary"/> : <ChevronDown className="w-4 h-4 text-theme-text-secondary"/>}
                        </button>
                        {openSections.astrology && (
                            <div className="p-4 bg-theme-surface">
                                {renderSelect("Manglik Status", "manglikStatus", filterOptions.manglikStatus)}
                                {renderSelect("Rashi", "rashi", filterOptions.rashi)}
                                {renderSelect("Gotra", "gotra", filterOptions.gotra)}
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                    <button 
                        onClick={() => {
                            Object.keys(filters).forEach(k => onFilterChange(k, null));
                        }}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-theme-border text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    >
                        Clear All
                    </button>
                    <button 
                        onClick={() => {
                            onApply();
                            onClose();
                        }}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-700 transition-colors shadow-sm"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
            
            {/* Styles for animation */}
            <style jsx>{`
                @keyframes slide-left {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-left {
                    animation: slide-left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #e5e7eb;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );

    return ReactDOM.createPortal(drawerContent, document.body);
};

export default AdvancedFiltersDrawer;
