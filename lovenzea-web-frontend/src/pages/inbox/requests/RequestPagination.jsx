import React from 'react';

const RequestPagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
    // Calculate the range of items being displayed
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Handler for Previous button
    const handlePrevPage = () => {
        console.log('Prev clicked, current page:', currentPage);
        if (currentPage > 1) {
            console.log('Going to page:', currentPage - 1);
            onPageChange(currentPage - 1);
        }
    };

    // Handler for Next button
    const handleNextPage = () => {
        console.log('Next clicked, current page:', currentPage, 'total pages:', totalPages);
        if (currentPage < totalPages) {
            console.log('Going to page:', currentPage + 1);
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex items-center justify-center gap-3 mt-8 pt-5">
            {/* PREV BUTTON */}
            <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 bg-theme-surface text-theme-text-secondary rounded font-medium transition-colors duration-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-theme-surface"
                type="button"
            >
                ← Prev
            </button>

            {/* DISPLAY TEXT - Shows current range */}
            <span className="text-gray-700 text-sm">
                Showing <strong>{startItem}-{endItem}</strong> of {totalItems}
            </span>

            {/* NEXT BUTTON */}
            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 bg-theme-surface text-theme-text-secondary rounded font-medium transition-colors duration-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-theme-surface"
                type="button"
            >
                Next →
            </button>
        </div>
    );
};

export default RequestPagination;