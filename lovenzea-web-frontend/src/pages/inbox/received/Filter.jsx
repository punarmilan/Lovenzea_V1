import { useState } from "react";

export default function FilterComponent({ onFilterChange, defaultValue = "all" }) {
    const [filterBy, setFilterBy] = useState(defaultValue);

    const handleFilterChange = (value) => {
        setFilterBy(value);
        if (onFilterChange) {
            onFilterChange(value);
        }
        console.log("Filtering by:", value);
    };

    const filterOptions = [
        { value: "all", label: "All Requests", isNew: false },
        { value: "blue-tick", label: "Blue Tick Members", isNew: true },
        { value: "super-connects", label: "Super Connects", isNew: false },
        { value: "premium", label: "Premium Members", isNew: false },
        { value: "online", label: "Members online now", isNew: false },
        { value: "phone-verified", label: "Phone verified Members", isNew: false },
        { value: "with-photos", label: "Members with Photos", isNew: false }
    ];

    return (
        <div className="w-full bg-theme-surface rounded-lg overflow-hidden shadow-sm border border-theme-border mt-6">
            {/* Header */}
            <div className="bg-gray-200 px-5 py-3.5 border-b border-gray-300">
                <h3 className="text-lg font-medium text-gray-700 text-center">Filter</h3>
            </div>

            {/* Filter Options */}
            <div className="p-5 space-y-3">
                {filterOptions.map((option) => (
                    <label
                        key={option.value}
                        className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors relative"
                    >
                        <div className="relative flex items-center justify-center">
                            <input
                                type="radio"
                                name="filter"
                                value={option.value}
                                checked={filterBy === option.value}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                className="w-5 h-5 cursor-pointer appearance-none border-2 border-gray-400 rounded-full checked:border-[6px] checked:border-blue-600 transition-all"
                            />
                        </div>
                        <span className="text-[15px] text-gray-700 select-none flex-1">
                            {option.label}
                        </span>
                        {option.isNew && (
                            <span className="bg-blue-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                NEW
                            </span>
                        )}
                    </label>
                ))}
            </div>
        </div>
    );
}