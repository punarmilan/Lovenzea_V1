import { useState } from "react";
import SortComponent from "./SortComponent";
import FilterComponent from "./FilterComponent";
import EmptyStateInbox from "./EmptyStateInbox";

export default function InboxPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [sortBy, setSortBy] = useState("relevant");
    const [filterBy, setFilterBy] = useState("all");

    const handleSortChange = (value) => {
        setSortBy(value);
        console.log("Sorting by:", value);
        // Implement your sorting logic here
    };

    const handleFilterChange = (value) => {
        setFilterBy(value);
        console.log("Filtering by:", value);
        // Implement your filtering logic here
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        console.log("Active tab:", tab);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar - Sort & Filter */}
                    <aside className="lg:w-80 flex-shrink-0">
                        <div className="sticky top-6 space-y-6">
                            <SortComponent
                                onSortChange={handleSortChange}
                                defaultValue={sortBy}
                            />
                            <FilterComponent
                                onFilterChange={handleFilterChange}
                                defaultValue={filterBy}
                            />
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-theme-surface rounded-lg shadow-sm border border-theme-border overflow-hidden">
                            {/* Tabs */}
                            <div className="border-b border-theme-border">
                                <div className="flex">
                                    <button
                                        onClick={() => handleTabChange("all")}
                                        className={`flex-1 px-6 py-4 text-base font-medium transition-colors relative ${activeTab === "all"
                                            ? "text-red-500"
                                            : "text-theme-text-secondary hover:text-gray-800"
                                            }`}
                                    >
                                        All Requests
                                        {activeTab === "all" && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleTabChange("filtered")}
                                        className={`flex-1 px-6 py-4 text-base font-medium transition-colors relative ${activeTab === "filtered"
                                            ? "text-red-500"
                                            : "text-theme-text-secondary hover:text-gray-800"
                                            }`}
                                    >
                                        Filtered Out
                                        {activeTab === "filtered" && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="min-h-[600px]">
                                {activeTab === "all" ? (
                                    <EmptyStateInbox />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center py-16 px-4">
                                        <div className="text-center max-w-md">
                                            <div className="mb-6">
                                                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                                                    <svg
                                                        className="w-12 h-12 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <h2 className="text-2xl font-normal text-gray-700 mb-4">
                                                No Filtered Out Requests
                                            </h2>
                                            <p className="text-theme-text-secondary">
                                                Profiles you filter out will appear here
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}