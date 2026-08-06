import React from 'react';

const RequestFilters = ({ filters, onFilterChange, sortBy, setSortBy, filterBy, setFilterBy }) => {
    const profileFilterOptions = [
        { value: "all", label: "All Profiles" },
        { value: "premium", label: "Premium Members" },
        { value: "verified", label: "Verified Members" },
        { value: "with-photos", label: "With Photos" }
    ];

    const sortOptions = [
        { value: "newest", label: "Newest first" },
        { value: "oldest", label: "Oldest first" },
        { value: "relevant", label: "Most relevant" }
    ];

    return (
        <aside className="space-y-6 lg:sticky lg:top-5 h-fit">
            {/* Request Type Filters */}
            <div className="bg-theme-surface rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-5 pb-3 border-b-2 border-theme-border">
                    Request Type
                </h2>
                <div className="space-y-3">
                    <label className="flex items-center cursor-pointer group transition-all duration-300 hover:translate-x-1">
                        <input
                            type="checkbox"
                            checked={filters.allRequests}
                            onChange={() => onFilterChange('allRequests')}
                            className="w-5 h-5 text-red-500 rounded focus:ring-2 focus:ring-red-500 cursor-pointer accent-red-500"
                        />
                        <span className={`ml-3 text-base font-medium transition-colors ${filters.allRequests ? 'text-red-500 font-semibold' : 'text-theme-text-secondary'}`}>
                            All Requests
                        </span>
                    </label>

                    <label className="flex items-center cursor-pointer group transition-all duration-300 hover:translate-x-1">
                        <input
                            type="checkbox"
                            checked={filters.photoRequests}
                            onChange={() => onFilterChange('photoRequests')}
                            className="w-5 h-5 text-red-500 rounded focus:ring-2 focus:ring-red-500 cursor-pointer accent-red-500"
                        />
                        <span className={`ml-3 text-base font-medium transition-colors ${filters.photoRequests ? 'text-red-500 font-semibold' : 'text-theme-text-secondary'}`}>
                            Photo Requests
                        </span>
                    </label>

                    <label className="flex items-center cursor-pointer group transition-all duration-300 hover:translate-x-1">
                        <input
                            type="checkbox"
                            checked={filters.phoneRequests}
                            onChange={() => onFilterChange('phoneRequests')}
                            className="w-5 h-5 text-red-500 rounded focus:ring-2 focus:ring-red-500 cursor-pointer accent-red-500"
                        />
                        <span className={`ml-3 text-base font-medium transition-colors ${filters.phoneRequests ? 'text-red-500 font-semibold' : 'text-theme-text-secondary'}`}>
                            Phone Requests
                        </span>
                    </label>
                </div>
            </div>

            {/* Sort By Filter */}
            <div className="bg-theme-surface rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-5 pb-3 border-b-2 border-theme-border">
                    Sort By
                </h2>
                <div className="space-y-3">
                    {sortOptions.map((option) => (
                        <label key={option.value} className="flex items-center cursor-pointer group transition-all duration-300 hover:translate-x-1">
                            <input
                                type="radio"
                                name="sortBy"
                                value={option.value}
                                checked={sortBy === option.value}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-5 h-5 text-red-500 cursor-pointer accent-red-500"
                            />
                            <span className={`ml-3 text-base font-medium transition-colors ${sortBy === option.value ? 'text-red-500 font-semibold' : 'text-theme-text-secondary'}`}>
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Profile Filter */}
            <div className="bg-theme-surface rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-5 pb-3 border-b-2 border-theme-border">
                    Filter By Profile
                </h2>
                <div className="space-y-3">
                    {profileFilterOptions.map((option) => (
                        <label key={option.value} className="flex items-center cursor-pointer group transition-all duration-300 hover:translate-x-1">
                            <input
                                type="radio"
                                name="profileFilter"
                                value={option.value}
                                checked={filterBy === option.value}
                                onChange={(e) => setFilterBy(e.target.value)}
                                className="w-5 h-5 text-red-500 cursor-pointer accent-red-500"
                            />
                            <span className={`ml-3 text-base font-medium transition-colors ${filterBy === option.value ? 'text-red-500 font-semibold' : 'text-theme-text-secondary'}`}>
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default RequestFilters;