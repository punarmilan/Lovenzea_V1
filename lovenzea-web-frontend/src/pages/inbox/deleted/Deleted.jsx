import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Check, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { fetchDeclinedByMe, fetchDeclinedByThem } from '../../../Slice/MatchSlice';
import { formatDisplayName } from '../../../utils/mockData';
import PremiumLock from '../../../components/PremiumLock';

const Deleted = () => {
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { declinedByMe, declinedByThem, loading } = useSelector((state) => state.match);

  useEffect(() => {
    dispatch(fetchDeclinedByMe());
    dispatch(fetchDeclinedByThem());
  }, [dispatch]);

  const normalizeInvitation = (req, type) => {
    // If declined by me (received requests), show the sender
    // If declined by them (sent requests), show the receiver
    const profile = type === 'me' ? req.senderProfile : req.receiverProfile;
    if (!profile) return null;

    return {
      id: req.id,
      name: formatDisplayName(profile.fullName, profile.displayNameVisibility, profile.id) || "Member",
      age: profile.age || "N/A",
      height: profile.height || "N/A",
      language: profile.motherTongue || "N/A",
      caste: profile.caste || "N/A",
      location: `${profile.city || ''}, ${profile.state || ''}`.trim().replace(/^,|,$/g, ''),
      education: profile.educationLevel || profile.education || "N/A",
      profession: profile.occupation || profile.profession || "N/A",
      online: 'Online 1d ago',
      date: new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      image: profile.profilePhotoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
      verified: true,
      isPremium: profile.isPremium || false,
      premiumVisible: profile.premiumVisible,
      type: type // 'me' or 'them'
    };
  };

  const declinedByMeList = declinedByMe.map(req => normalizeInvitation(req, 'me')).filter(i => i !== null);
  const declinedByThemList = declinedByThem.map(req => normalizeInvitation(req, 'them')).filter(i => i !== null);

  const filterOptions = [
    { id: 'all', label: 'All Requests', count: declinedByMeList.length + declinedByThemList.length },
    { id: 'cancelledByMe', label: 'Cancelled by me', count: declinedByMeList.length },
    { id: 'cancelledByThem', label: 'Cancelled by them', count: declinedByThemList.length }
  ];

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setCurrentPage(1);
  };

  const getFilteredInvitations = () => {
    if (activeFilter === 'cancelledByMe') {
      return declinedByMeList;
    }
    if (activeFilter === 'cancelledByThem') {
      return declinedByThemList;
    }
    return [...declinedByMeList, ...declinedByThemList];
  };

  const filteredInvitations = getFilteredInvitations();
  const hasInvitations = filteredInvitations.length > 0;
  const totalPages = Math.ceil(filteredInvitations.length / itemsPerPage) || 1;

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Empty State Component
  const EmptyState = () => (
    <div className="bg-theme-surface rounded-lg shadow-sm border border-theme-border p-12 sm:p-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <svg className="w-32 h-32 mx-auto" viewBox="0 0 200 200" fill="none">
            {/* Mailbox */}
            <rect x="60" y="100" width="80" height="60" rx="4" fill="#EF4444" />
            <rect x="60" y="100" width="80" height="30" rx="4" fill="#DC2626" />
            <circle cx="100" cy="115" r="3" fill="white" />

            {/* Flag */}
            <rect x="145" y="90" width="4" height="40" fill="#991B1B" />
            <path d="M149 90 L149 105 L165 97.5 Z" fill="#DC2626" />

            {/* Character head */}
            <circle cx="100" cy="65" r="25" fill="white" stroke="#E5E7EB" strokeWidth="2" />
            <circle cx="92" cy="62" r="3" fill="#374151" />
            <circle cx="108" cy="62" r="3" fill="#374151" />
            <path d="M 90 72 Q 100 78 110 72" stroke="#374151" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Hair buns */}
            <circle cx="75" cy="50" r="8" fill="#DC2626" />
            <circle cx="125" cy="50" r="8" fill="#DC2626" />

            {/* Body */}
            <rect x="85" y="85" width="30" height="20" rx="15" fill="#EF4444" />

            {/* Ground shadow */}
            <ellipse cx="100" cy="165" rx="40" ry="8" fill="#E5E7EB" opacity="0.5" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          There are no Deleted Invitations
        </h3>
        <p className="text-theme-text-secondary text-sm">
          {activeFilter === 'cancelledByMe'
            ? "You haven't cancelled any invitations yet."
            : "No one has declined your invitations."}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
          Deleted Invitations
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-theme-surface rounded-lg shadow-sm border border-theme-border overflow-hidden">
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-4 sm:px-6 py-4 border-b border-theme-border">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              </div>
              <div className="p-4 sm:p-6 space-y-2">
                {filterOptions.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => handleFilterChange(filter.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${activeFilter === filter.id
                      ? 'bg-rose-50 text-rose-700 border-2 border-rose-500'
                      : 'bg-theme-surface text-gray-700 border-2 border-theme-border hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${activeFilter === filter.id
                          ? 'bg-rose-500 border-rose-500'
                          : 'border-gray-300'
                          }`}
                      >
                        {activeFilter === filter.id && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{filter.label}</span>
                    </div>
                    {filter.count > 0 && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${activeFilter === filter.id
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-gray-100 text-theme-text-secondary'
                        }`}>
                        {filter.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Invitations List */}
          <div className="flex-1">
            {hasInvitations ? (
              <>
                <div className="space-y-4">
                  {filteredInvitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="bg-theme-surface rounded-lg shadow-sm border border-theme-border hover:shadow-md transition-shadow duration-200 overflow-hidden"
                    >
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                          {/* Profile Image */}
                          <div className="flex-shrink-0 mx-auto sm:mx-0">
                            <div className="relative">
                                  <img
                                    src={invitation.image}
                                    alt={invitation.name}
                                    className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 ${invitation.isPremium ? 'border-amber-400 shadow-md' : 'border-white'} shadow-md ${invitation.premiumVisible === false ? 'blur-md' : ''}`}
                                  />
                                  {invitation.premiumVisible === false && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                      <PremiumLock />
                                    </div>
                                  )}
                                  {invitation.isPremium && (
                                    <div className="absolute -top-1 -left-1 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-md z-10">
                                      <Star size={10} className="fill-white" />
                                      PLUS
                                    </div>
                                  )}
                            </div>
                          </div>

                          {/* Profile Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                                  {invitation.name}
                                </h3>
                                {invitation.verified && (
                                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                  </div>
                                )}
                                {invitation.isPremium && (
                                  <div className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-200 flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-amber-500" /> Premium
                                  </div>
                                )}
                              </div>
                              <span className="text-sm text-theme-text-secondary whitespace-nowrap">
                                {invitation.date}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-2 h-2 bg-theme-success rounded-full animate-pulse"></div>
                              <span className="text-sm text-green-600 font-medium">
                                {invitation.online}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
                              <div>
                                <span className="font-medium">
                                  {invitation.age} yrs, {invitation.height}
                                </span>
                              </div>
                              <div>
                                <span>{invitation.language}, {invitation.caste}</span>
                              </div>
                              <div>
                                <span>{invitation.location}</span>
                              </div>
                              <div>
                                <span>{invitation.education}</span>
                              </div>
                              <div className="sm:col-span-2">
                                <span>{invitation.profession}</span>
                              </div>
                            </div>

                            {/* Declined Message */}
                            <div className="mt-4 bg-rose-50 border border-rose-200 rounded-lg p-3">
                              <p className="text-sm text-rose-700 font-medium">
                                {invitation.type === 'me'
                                  ? "You Declined this Invitation. This member cannot be contacted."
                                  : "She Declined your Invitation. This member cannot be contacted."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-theme-surface rounded-lg shadow-sm border border-theme-border px-4 sm:px-6 py-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  <div className="text-sm text-theme-text-secondary">
                    Showing <span className="font-semibold text-gray-900">1-{itemsPerPage}</span> of{' '}
                    <span className="font-semibold text-gray-900">18</span>
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deleted;