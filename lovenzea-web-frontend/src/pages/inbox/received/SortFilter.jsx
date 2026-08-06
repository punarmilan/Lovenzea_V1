import { useState } from "react";

export default function SortComponent({ onSortChange, defaultValue = "oldest" }) {
    const [sortBy, setSortBy] = useState(defaultValue);

    const handleSortChange = (value) => {
        setSortBy(value);
        if (onSortChange) {
            onSortChange(value);
        }
        console.log("Sorting by:", value);
    };

    return (
        <div className="w-full bg-theme-surface rounded-lg overflow-hidden shadow-sm border border-theme-border">
            {/* Header */}
            <div className="bg-gray-200 px-5 py-3.5 border-b border-gray-300">
                <h3 className="text-lg font-medium text-gray-700 text-center">Sort</h3>
            </div>

            {/* Sort Options */}
            <div className="p-5 space-y-3">
                {/* Most relevant */}
                <label className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
                    <div className="relative flex items-center justify-center">
                        <input
                            type="radio"
                            name="sort"
                            value="relevant"
                            checked={sortBy === "relevant"}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="w-5 h-5 cursor-pointer appearance-none border-2 border-gray-400 rounded-full checked:border-[6px] checked:border-blue-600 transition-all"
                        />
                    </div>
                    <span className="text-[15px] text-gray-700 select-none">
                        Most relevant
                    </span>
                </label>

                {/* Newest first */}
                <label className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
                    <div className="relative flex items-center justify-center">
                        <input
                            type="radio"
                            name="sort"
                            value="newest"
                            checked={sortBy === "newest"}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="w-5 h-5 cursor-pointer appearance-none border-2 border-gray-400 rounded-full checked:border-[6px] checked:border-blue-600 transition-all"
                        />
                    </div>
                    <span className="text-[15px] text-gray-700 select-none">
                        Newest first
                    </span>
                </label>

                {/* Oldest first */}
                <label className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
                    <div className="relative flex items-center justify-center">
                        <input
                            type="radio"
                            name="sort"
                            value="oldest"
                            checked={sortBy === "oldest"}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="w-5 h-5 cursor-pointer appearance-none border-2 border-gray-400 rounded-full checked:border-[6px] checked:border-blue-600 transition-all"
                        />
                    </div>
                    <span className="text-[15px] text-gray-700 select-none">
                        Oldest first
                    </span>
                </label>
            </div>
        </div>
    );
}