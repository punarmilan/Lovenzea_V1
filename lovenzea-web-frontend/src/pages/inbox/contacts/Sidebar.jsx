import React from 'react';

const Sidebar = ({ sortBy, setSortBy, filterBy, setFilterBy }) => {
    const sortOptions = [
        { id: 'newest', label: 'Newest first' },
        { id: 'oldest', label: 'Oldest first' },
    ];

    const filterOptions = [
        { id: 'all', label: 'All Viewed Contacts' },
        { id: 'premium', label: 'Premium Members' },
        { id: 'verified', label: 'Verified Profiles' },
        { id: 'with-photos', label: 'Members with Photos' },
    ];

    return (
        <aside className="flex flex-col gap-6">
            {/* Sort Section */}
            <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50/50 px-5 py-3 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Sort By</h3>
                </div>
                <div className="p-4 space-y-3">
                    {sortOptions.map((option) => (
                        <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="radio"
                                    name="sort"
                                    checked={sortBy === option.id}
                                    onChange={() => setSortBy(option.id)}
                                    className="w-4 h-4 text-rose-500 border-gray-300 focus:ring-rose-500 cursor-pointer accent-rose-500"
                                />
                            </div>
                            <span className={`text-sm transition-colors ${sortBy === option.id ? 'text-gray-900 font-bold' : 'text-theme-text-secondary group-hover:text-gray-900'}`}>
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50/50 px-5 py-3 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Filter</h3>
                </div>
                <div className="p-4 space-y-3">
                    {filterOptions.map((option) => (
                        <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="radio"
                                    name="filter"
                                    checked={filterBy === option.id}
                                    onChange={() => setFilterBy(option.id)}
                                    className="w-4 h-4 text-rose-500 border-gray-300 focus:ring-rose-500 cursor-pointer accent-rose-500"
                                />
                            </div>
                            <span className={`text-sm transition-colors ${filterBy === option.id ? 'text-gray-900 font-bold' : 'text-theme-text-secondary group-hover:text-gray-900'}`}>
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-rose-50/50 rounded-xl p-5 border border-rose-100">
                <h4 className="text-rose-700 font-bold text-sm mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Quick Tip
                </h4>
                <p className="text-xs text-rose-600 leading-relaxed">
                    Profiles shown here are those whose contact details you have already unlocked. You can reach out to them directly via phone or WhatsApp.
                </p>
            </div>
        </aside>
    );
};

export default Sidebar;
