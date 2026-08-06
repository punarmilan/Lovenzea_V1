import React, { useState, useEffect } from 'react';
import RequestFilters from './RequestFilters';
import PendingRequests from './PendingRequests';
import AcceptedRequests from './AcceptedRequest';
import SentRequests from './SentRequest';
import RequestPagination from './RequestPagination';

const Requests = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [filters, setFilters] = useState({
    allRequests: true,
    photoRequests: false,
    phoneRequests: false
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load active tab from localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  // Save active tab to localStorage
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
  };


  // Handle filter changes
  const handleFilterChange = (filterName) => {
    if (filterName === 'allRequests') {
      setFilters({
        allRequests: true,
        photoRequests: false,
        phoneRequests: false
      });
    } else {
      const newFilters = {
        ...filters,
        [filterName]: !filters[filterName],
        allRequests: false
      };

      // If no specific filter is checked, check "All Requests"
      if (!newFilters.photoRequests && !newFilters.phoneRequests) {
        newFilters.allRequests = true;
      }

      setFilters(newFilters);
    }
  };

  return (
    <div className="min-h-screen pb-20  pt-4 xs:pt-6 sm:pt-8 overflow-x-hidden">
            
      <div className="max-w-7xl mx-auto">


        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 animate-fadeIn">
          {/* Filters Sidebar */}
          <RequestFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
          />

          {/* Content Area */}
          <main className="bg-theme-surface rounded-2xl shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex flex-col md:flex-row border-b-2 border-theme-border bg-gradient-to-b from-white to-gray-50">
              <button
                onClick={() => handleTabChange('pending')}
                className={`flex-1 px-6 py-5 text-base font-semibold transition-all duration-300 relative ${activeTab === 'pending'
                  ? 'text-red-500 bg-theme-surface'
                  : 'text-gray-400 hover:bg-red-50 hover:text-red-500'
                  }`}
              >
                Pending Requests
                {activeTab === 'pending' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500"></div>
                )}
              </button>

              <button
                onClick={() => handleTabChange('accepted')}
                className={`flex-1 px-6 py-5 text-base font-semibold transition-all duration-300 relative ${activeTab === 'accepted'
                  ? 'text-red-500 bg-theme-surface'
                  : 'text-gray-400 hover:bg-red-50 hover:text-red-500'
                  }`}
              >
                Accepted Requests
                {activeTab === 'accepted' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500"></div>
                )}
              </button>

              <button
                onClick={() => handleTabChange('sent')}
                className={`flex-1 px-6 py-5 text-base font-semibold transition-all duration-300 relative ${activeTab === 'sent'
                  ? 'text-red-500 bg-theme-surface'
                  : 'text-gray-400 hover:bg-red-50 hover:text-red-500'
                  }`}
              >
                Sent Requests
                {activeTab === 'sent' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500"></div>
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-10 min-h-[500px]">
              {activeTab === 'pending' && <PendingRequests filters={filters} sortBy={sortBy} filterBy={filterBy} />}
              {activeTab === 'accepted' && <AcceptedRequests filters={filters} sortBy={sortBy} filterBy={filterBy} />}
              {activeTab === 'sent' && <SentRequests filters={filters} sortBy={sortBy} filterBy={filterBy} />}
            </div>
          </main>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Work+Sans:wght@400;500;600&display=swap');

        .font-playfair {
          font-family: 'Playfair Display', serif;
        }

        .font-worksans {
          font-family: 'Work Sans', sans-serif;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
          animation-fill-mode: both;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
};

export default Requests;