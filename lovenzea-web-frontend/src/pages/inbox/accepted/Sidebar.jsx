import React from 'react';
import { Check } from 'lucide-react';

const Sidebar = ({ activeFilter, setActiveFilter, sortBy, setSortBy, filterBy, setFilterBy }) => {
    const filterOptions = [
        { value: "all", label: "All Accepted", isNew: false },
        { value: "premium", label: "Premium Members", isNew: false },
        { value: "verified", label: "Verified Members", isNew: false },
        { value: "with-photos", label: "Members with Photos", isNew: false }
    ];

    const sortOptions = [
        { value: "newest", label: "Newest first" },
        { value: "oldest", label: "Oldest first" },
        { value: "relevant", label: "Most relevant" }
    ];

    return (
        <aside className="space-y-6">
            {/* Type Filter */}
            <div className="bg-theme-surface rounded-lg shadow-sm border border-theme-border overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-theme-border">
                    <h3 className="font-semibold text-gray-700">Request Type</h3>
                </div>
                <div className="p-4 space-y-2">
                    <button
                        onClick={() => setActiveFilter('me')}
                        className={`w-full text-left px-4 py-2 rounded-md transition-all ${activeFilter === 'me' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                        Accepted by Me
                    </button>
                    <button
                        onClick={() => setActiveFilter('her')}
                        className={`w-full text-left px-4 py-2 rounded-md transition-all ${activeFilter === 'her' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                        Accepted by Her
                    </button>
                </div>
            </div>

            {/* Sort */}
            <div className="bg-theme-surface rounded-lg shadow-sm border border-theme-border overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-theme-border">
                    <h3 className="font-semibold text-gray-700">Sort By</h3>
                </div>
                <div className="p-4 space-y-2">
                    {sortOptions.map((option) => (
                        <label key={option.value} className="flex items-center gap-3 cursor-pointer group p-1 transition-colors">
                            <input
                                type="radio"
                                name="sort"
                                value={option.value}
                                checked={sortBy === option.value}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Granular Filters */}
            <div className="bg-theme-surface rounded-lg shadow-sm border border-theme-border overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-theme-border">
                    <h3 className="font-semibold text-gray-700">Filter By</h3>
                </div>
                <div className="p-4 space-y-2">
                    {filterOptions.map((option) => (
                        <label key={option.value} className="flex items-center gap-3 cursor-pointer group p-1 transition-colors">
                            <input
                                type="radio"
                                name="granularFilter"
                                value={option.value}
                                checked={filterBy === option.value}
                                onChange={(e) => setFilterBy(e.target.value)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
