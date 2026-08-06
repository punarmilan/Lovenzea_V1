import React from 'react';

const Pagination = ({ currentPage, totalPages }) => {
    return (
        <div className="flex items-center justify-center gap-4 mt-8">
            <button
                disabled={currentPage === 1}
                className="px-6 py-3 bg-theme-surface border-2 border-[#e8dfd6] rounded-xl text-[#6b5d55] font-medium transition-all duration-300 hover:border-[#d4145a] hover:text-[#d4145a] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#e8dfd6] disabled:hover:text-[#6b5d55] disabled:hover:translate-y-0"
            >
                ← Prev
            </button>

            <span className="text-[#6b5d55] font-medium">
                Showing {currentPage}-{currentPage} of {totalPages}
            </span>

            <button
                disabled={currentPage === totalPages}
                className="px-6 py-3 bg-theme-surface border-2 border-[#e8dfd6] rounded-xl text-[#6b5d55] font-medium transition-all duration-300 hover:border-[#d4145a] hover:text-[#d4145a] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#e8dfd6] disabled:hover:text-[#6b5d55] disabled:hover:translate-y-0"
            >
                Next →
            </button>
        </div>
    );
};

export default Pagination;