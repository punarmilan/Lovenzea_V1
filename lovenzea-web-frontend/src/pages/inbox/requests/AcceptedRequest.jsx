import React, { useState } from 'react';
import EmptyState from '../requests/RequestEmpty';
import ProfileCard from '../requests/RequestProfileCard';
import Pagination from '../requests/RequestPagination';

const AcceptedRequests = ({ filters }) => {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Sample data - replace with your API data
    const acceptedRequests = [
        // Example structure:
        // {
        //   id: 1,
        //   name: 'Jane Smith',
        //   age: 24,
        //   height: "5' 4\"",
        //   language: 'Marathi, Hindi',
        //   location: 'Pune',
        //   education: 'M.Com',
        //   employment: 'Accountant',
        //   onlineStatus: 'Online 2 hours ago',
        //   requestType: 'Photo Request',
        //   requestDate: '12 Jan 2026',
        //   requestMessage: 'You accepted their Photo request on',
        //   hasCrown: false,
        //   isVerified: true
        // }
    ];

    // Filter profiles based on selected filters
    const getFilteredProfiles = () => {
        // If "All Requests" is selected, return everything
        if (filters.allRequests) {
            return acceptedRequests;
        }

        // Filter based on specific request types
        return acceptedRequests.filter(profile => {
            if (filters.photoRequests && profile.requestType.includes('Photo')) return true;
            if (filters.phoneRequests && profile.requestType.includes('Phone')) return true;
            return false;
        });
    };

    const filteredProfiles = getFilteredProfiles();

    // Calculate total pages based on filtered results
    const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);

    // Get current page items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProfiles.slice(indexOfFirstItem, indexOfLastItem);

    // Page change handler
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        // Optional: Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="animate-fadeIn">
            {currentItems.length > 0 ? (
                <>
                    {/* Render profile cards */}
                    {currentItems.map((profile, index) => (
                        <ProfileCard key={profile.id} profile={profile} index={index} />
                    ))}

                    {/* Always show pagination when there are items */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredProfiles.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                </>
            ) : (
                // Show empty state when no items
                <EmptyState
                    message="There are no Accepted Requests"
                    submessage="Accepted requests from other members will appear here"
                />
            )}
        </div>
    );
};

export default AcceptedRequests;