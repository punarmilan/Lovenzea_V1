import React, { useState } from 'react';
import { Search, MapPin, Heart, Star, ChevronDown, Check, Globe, RefreshCw, SlidersHorizontal, User } from 'lucide-react';

const FilterBar = ({ 
    filters, 
    onFilterChange, 
    onSearch, 
    onReset,
    onOpenMoreFilters 
}) => {
    const [keyword, setKeyword] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(keyword);
    };

    return (
        <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 p-4 mb-6 transition-all duration-300">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search by name, city or profession"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-pink-100 focus:bg-theme-surface transition-all text-sm outline-none text-gray-700"
                />
            </form>

            {/* Main Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                <button onClick={onOpenMoreFilters} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-theme-border text-sm text-theme-text-secondary hover:border-pink-300 hover:text-pink-600 transition-colors">
                    <User className="w-4 h-4 text-pink-500" />
                    Age: {filters.ageFrom && filters.ageTo ? `${filters.ageFrom}-${filters.ageTo}` : 'Any'}
                    <ChevronDown className="w-3 h-3" />
                </button>

                <button onClick={onOpenMoreFilters} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-theme-border text-sm text-theme-text-secondary hover:border-pink-300 hover:text-pink-600 transition-colors">
                    <Globe className="w-4 h-4 text-pink-500" />
                    Religion: {filters.religion?.length > 0 ? filters.religion[0] : 'Any'}
                    <ChevronDown className="w-3 h-3" />
                </button>

                <button onClick={onOpenMoreFilters} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-theme-border text-sm text-theme-text-secondary hover:border-pink-300 hover:text-pink-600 transition-colors">
                    <Star className="w-4 h-4 text-pink-500" />
                    Caste: {filters.caste?.length > 0 ? filters.caste[0] : 'Any'}
                    <ChevronDown className="w-3 h-3" />
                </button>

                <button onClick={onOpenMoreFilters} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-theme-border text-sm text-theme-text-secondary hover:border-pink-300 hover:text-pink-600 transition-colors">
                    <MapPin className="w-4 h-4 text-pink-500" />
                    Location: {filters.city?.length > 0 ? filters.city[0] : 'Any'}
                    <ChevronDown className="w-3 h-3" />
                </button>

                <button onClick={onOpenMoreFilters} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-theme-border text-sm text-theme-text-secondary hover:border-pink-300 hover:text-pink-600 transition-colors">
                    <Heart className="w-4 h-4 text-pink-500" />
                    Marital: {filters.maritalStatus?.length > 0 ? filters.maritalStatus[0] : 'Any'}
                    <ChevronDown className="w-3 h-3" />
                </button>

                <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                <button 
                    onClick={onOpenMoreFilters}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 text-pink-600 text-sm font-medium hover:bg-pink-100 transition-colors ml-auto sm:ml-0"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    More Filters
                </button>
            </div>

            {/* Quick Toggles and Sort */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-2">
                    <button 
                        onClick={() => onFilterChange('onlineNow', !filters.onlineNow)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filters.onlineNow ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-theme-text-secondary border border-transparent hover:bg-gray-100'}`}
                    >
                        <span className="w-2 h-2 rounded-full bg-theme-success"></span>
                        Online Now
                    </button>
                    
                    <button 
                        onClick={() => onFilterChange('verified', !filters.verified)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filters.verified ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-50 text-theme-text-secondary border border-transparent hover:bg-gray-100'}`}
                    >
                        <Check className="w-4 h-4 text-blue-500" />
                        Verified
                    </button>
                    
                    <button 
                        onClick={() => onFilterChange('premium', !filters.premium)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filters.premium ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'bg-gray-50 text-theme-text-secondary border border-transparent hover:bg-gray-100'}`}
                    >
                        <Star className="w-4 h-4 text-yellow-500" />
                        Premium
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-theme-text-secondary">
                        <span className="hidden sm:inline">Sort by:</span>
                        <select 
                            value={filters.sort || 'Best Match'}
                            onChange={(e) => onFilterChange('sort', e.target.value)}
                            className="bg-gray-50 border border-theme-border text-gray-700 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block p-1.5 outline-none cursor-pointer font-medium"
                        >
                            <option value="Best Match">Best Match</option>
                            <option value="Recently Joined">Recently Joined</option>
                            <option value="Youngest First">Youngest First</option>
                            <option value="Oldest First">Oldest First</option>
                        </select>
                    </div>

                    <button 
                        onClick={onReset}
                        className="flex items-center gap-1.5 text-pink-500 hover:text-pink-600 text-sm font-medium transition-colors"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
