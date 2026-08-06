import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Phone, MessageCircle, MessageSquare, ChevronDown, Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchSentRequests } from '../../../Slice/MatchSlice';
import { openChatWith } from '../../../Slice/ChatSlice';
import { formatDisplayName } from '../../../utils/mockData';
import PremiumLock from '../../../components/PremiumLock';

const SentInvitations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filterAll, setFilterAll] = useState(true);
  const [filterViewed, setFilterViewed] = useState(false);
  const [filterNotViewed, setFilterNotViewed] = useState(false);

  const { sentRequests, loading } = useSelector((state) => state.match);

  useEffect(() => {
    dispatch(fetchSentRequests());
  }, [dispatch]);

  const normalizeInvitation = (req) => {
    const profile = req.receiverProfile;
    if (!profile) return null;

    return {
      id: req.id,
      name: formatDisplayName(profile.fullName, profile.displayNameVisibility, profile.id) || "Member",
      receiverUserId: profile.userId || profile.id,
      receiverName: profile.fullName || "Member",
      receiverPhoto: profile.profilePhotoUrl || null,
      status: 'Online 1d ago',
      age: profile.age || "N/A",
      height: profile.height || "N/A",
      language: profile.motherTongue || "N/A",
      caste: profile.caste || "N/A",
      location: `${profile.city || ''}, ${profile.state || ''}`.trim().replace(/^,|,$/g, ''),
      profession: profile.occupation || profile.profession || "N/A",
      education: profile.educationLevel || profile.education || "N/A",
      message: 'Hi, it is nice connecting with you. I liked your profile and would like to take this forward.',
      sentDate: new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      verified: true,
      isPremium: profile.isPremium || false,
      premiumVisible: profile.premiumVisible,
      viewed: false,
      image: profile.profilePhotoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop'
    };
  };

  const allInvitations = sentRequests.map(normalizeInvitation).filter(i => i !== null);

  // Filter logic
  const getFilteredInvitations = () => {
    if (filterViewed) {
      return allInvitations.filter(inv => inv.viewed);
    }
    if (filterNotViewed) {
      return allInvitations.filter(inv => !inv.viewed);
    }
    return allInvitations;
  };

  const invitations = getFilteredInvitations();

  const handleFilterAll = () => {
    setFilterAll(true);
    setFilterViewed(false);
    setFilterNotViewed(false);
  };

  const handleFilterViewed = () => {
    setFilterAll(false);
    setFilterViewed(true);
    setFilterNotViewed(false);
  };

  const handleFilterNotViewed = () => {
    setFilterAll(false);
    setFilterViewed(false);
    setFilterNotViewed(true);
  };

  const handleCall = (id) => {
    window.location.href = `/call/${id}`;
  };

  const handleWhatsApp = (id) => {
    window.location.href = `/whatsapp/${id}`;
  };

  const handleShadiChat = (invitation) => {
    dispatch(openChatWith({
      id: invitation.receiverUserId,
      fullName: invitation.receiverName,
      profilePhotoUrl: invitation.receiverPhoto,
      displayNameVisibility: null
    }));
  };

  return (
    <div className="min-h-screen pb-20  pt-4 xs:pt-6 sm:pt-8 overflow-x-hidden">
      <div className="w-full mx-auto p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1600px]">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <div className="bg-theme-surface/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-white/50 p-4 md:p-6 lg:sticky lg:top-4 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Filters
                </h3>
              </div>
              <div className="space-y-2 md:space-y-4">
                <label className="flex items-center justify-between cursor-pointer group p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-200">
                  <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={filterAll}
                        onChange={handleFilterAll}
                        className="w-4 h-4 md:w-5 md:h-5 text-pink-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 cursor-pointer transition-all duration-200"
                      />
                    </div>
                    <span className="text-sm md:text-base font-medium text-gray-700 group-hover:text-pink-600 transition-colors truncate">
                      All Requests
                    </span>
                  </div>
                  <span className="ml-2 bg-pink-100 text-pink-600 text-xs font-bold px-2 md:px-2.5 py-0.5 md:py-1 rounded-full flex-shrink-0">
                    {allInvitations.length}
                  </span>
                </label>
                <label className="flex items-center justify-between cursor-pointer group p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200">
                  <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={filterViewed}
                        onChange={handleFilterViewed}
                        className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer transition-all duration-200"
                      />
                    </div>
                    <span className="text-sm md:text-base font-medium text-gray-700 group-hover:text-emerald-600 transition-colors truncate">
                      Viewed by them
                    </span>
                  </div>
                  <span className="ml-2 bg-emerald-100 text-emerald-600 text-xs font-bold px-2 md:px-2.5 py-0.5 md:py-1 rounded-full flex-shrink-0">
                    {allInvitations.filter(inv => inv.viewed).length}
                  </span>
                </label>
                <label className="flex items-center justify-between cursor-pointer group p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-200">
                  <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={filterNotViewed}
                        onChange={handleFilterNotViewed}
                        className="w-4 h-4 md:w-5 md:h-5 text-amber-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 cursor-pointer transition-all duration-200"
                      />
                    </div>
                    <span className="text-sm md:text-base font-medium text-gray-700 group-hover:text-amber-600 transition-colors truncate">
                      Not Viewed by them
                    </span>
                  </div>
                  <span className="ml-2 bg-amber-100 text-amber-600 text-xs font-bold px-2 md:px-2.5 py-0.5 md:py-1 rounded-full flex-shrink-0">
                    {allInvitations.filter(inv => !inv.viewed).length}
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="mb-4 md:mb-6 lg:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent mb-1 md:mb-2">
                Sent invitations
              </h2>
              <p className="text-sm md:text-base text-theme-text-secondary">
                {invitations.length} {invitations.length === 1 ? 'invitation' : 'invitations'} found
              </p>
            </div>

            {invitations.length === 0 ? (
              <div className="bg-theme-surface/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-white/50 p-8 md:p-12 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-lg md:text-xl font-semibold text-gray-700 mb-1 md:mb-2">No invitations found</p>
                <p className="text-sm md:text-base text-theme-text-secondary">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {invitations.map((invitation, index) => (
                  <div
                    key={invitation.id}
                    className="bg-theme-surface/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-300 overflow-hidden group animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-4 sm:p-5 md:p-6 lg:p-8">
                      <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                        {/* Profile Image */}
                        <div 
                          className="flex-shrink-0 mx-auto sm:mx-0 cursor-pointer"
                          onClick={() => navigate(`/matches/${invitation.receiverUserId}`)}
                        >
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl md:rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <img
                              src={invitation.image}
                              alt={invitation.name}
                              className={`relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-2xl md:rounded-3xl object-cover ring-2 md:ring-4 ${invitation.isPremium ? 'ring-amber-400' : 'ring-white'} shadow-xl ${invitation.premiumVisible === false ? 'blur-md' : ''}`}
                            />
                            {invitation.premiumVisible === false && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                <PremiumLock />
                              </div>
                            )}
                            {invitation.isPremium && (
                              <div className="absolute -top-2 -left-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-md z-10">
                                <Star size={10} className="fill-white" />
                                PLUS
                              </div>
                            )}
                            <div className="absolute -bottom-1.5 -right-1.5 md:-bottom-2 md:-right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2.5 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-bold shadow-lg">
                              {invitation.age} yrs
                            </div>
                          </div>
                        </div>

                        {/* Profile Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 md:mb-4 gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                                <h3 
                                  className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate hover:text-pink-500 cursor-pointer transition-colors"
                                  onClick={() => navigate(`/matches/${invitation.receiverUserId}`)}
                                >
                                  {invitation.name}
                                  {invitation.isPremium && (
                                    <div className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-200 flex items-center gap-1 ml-1.5 mt-0.5">
                                      <Star className="w-3 h-3 fill-amber-500" /> Premium
                                    </div>
                                  )}
                                </h3>
                                {invitation.verified && (
                                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-0.5 md:p-1 shadow-md flex-shrink-0">
                                    <Check className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={3} />
                                  </div>
                                )}
                                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-400 cursor-pointer hover:text-pink-500 transition-colors flex-shrink-0" />
                              </div>
                              <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                                <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full flex-shrink-0 ${invitation.status.includes('now') ? 'bg-theme-success animate-pulse' : 'bg-gray-400'}`}></div>
                                <p className="text-xs sm:text-sm font-medium text-theme-text-secondary truncate">{invitation.status}</p>
                              </div>
                            </div>
                            <div className="bg-gradient-to-r from-pink-100 to-rose-100 px-2.5 py-1 md:px-4 md:py-1.5 rounded-full self-start flex-shrink-0">
                              <span className="text-xs md:text-sm font-semibold text-pink-700 whitespace-nowrap">{invitation.sentDate}</span>
                            </div>
                          </div>

                          {/* Info Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-5">
                            <div className="flex items-center gap-1.5 md:gap-2 text-gray-700 min-w-0">
                              <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-pink-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="text-xs sm:text-sm font-medium truncate">{invitation.height}</span>
                            </div>
                            <div className="flex items-center gap-1.5 md:gap-2 text-gray-700 min-w-0">
                              <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-pink-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                              </svg>
                              <span className="text-xs sm:text-sm font-medium truncate">{invitation.language}, {invitation.caste}</span>
                            </div>
                            <div className="flex items-center gap-1.5 md:gap-2 text-gray-700 min-w-0">
                              <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-pink-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-xs sm:text-sm font-medium truncate">{invitation.location}</span>
                            </div>
                            {invitation.education && (
                              <div className="flex items-center gap-1.5 md:gap-2 text-gray-700 min-w-0">
                                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-pink-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                </svg>
                                <span className="text-xs sm:text-sm font-medium truncate">{invitation.education}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 md:gap-2 sm:col-span-2 min-w-0">
                              <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-pink-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="text-sm sm:text-base font-semibold text-gray-900 truncate">{invitation.profession}</span>
                            </div>
                          </div>

                          {/* Message */}
                          <div className="relative bg-gradient-to-r from-blue-50 to-cyan-50 border-l-2 md:border-l-4 border-blue-400 p-3 md:p-4 rounded-lg md:rounded-xl mb-3 md:mb-4 group-hover:shadow-md transition-shadow duration-300">
                            <svg className="hidden sm:block absolute top-2 md:top-3 left-2 md:left-3 w-4 h-4 md:w-5 md:h-5 text-blue-400 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                            </svg>
                            <p className="text-xs sm:text-sm text-gray-700 sm:pl-7 leading-relaxed">{invitation.message}</p>
                          </div>
                        </div>

                        {/* Action Buttons - Desktop */}
                        <div className="hidden lg:flex flex-col gap-2.5 md:gap-3 flex-shrink-0 items-end w-full lg:w-auto lg:min-w-[160px] xl:min-w-[180px]">
                          <p className="text-xs text-center text-blue-600 hover:text-blue-700 cursor-pointer mb-0.5 md:mb-1 font-medium leading-tight">
                            Upgrade to<br />Contact her directly
                          </p>

                          <button
                            onClick={() => handleCall(invitation.id)}
                            className="flex items-center justify-center gap-1.5 md:gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full"
                          >
                            <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>Call</span>
                          </button>

                          <button
                            onClick={() => handleWhatsApp(invitation.id)}
                            className="flex items-center justify-center gap-1.5 md:gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full"
                          >
                            <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>WhatsApp</span>
                          </button>

                          <button
                            onClick={() => handleShadiChat(invitation)}
                            className="flex items-center justify-center gap-1.5 md:gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full"
                          >
                            <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>LovenZea Chat</span>
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons - Mobile & Tablet */}
                      <div className="lg:hidden mt-4 md:mt-6">
                        <p className="text-xs text-center text-blue-600 hover:text-blue-700 cursor-pointer mb-3 md:mb-4 font-medium">
                          Upgrade to Contact her directly
                        </p>

                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                          <button
                            onClick={() => handleCall(invitation.id)}
                            className="flex items-center justify-center gap-1.5 md:gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2.5 md:px-6 md:py-3.5 rounded-lg md:rounded-xl text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                          >
                            <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>Call</span>
                          </button>

                          <button
                            onClick={() => handleWhatsApp(invitation.id)}
                            className="flex items-center justify-center gap-1.5 md:gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2.5 md:px-6 md:py-3.5 rounded-lg md:rounded-xl text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                          >
                            <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>WhatsApp</span>
                          </button>

                          <button
                            onClick={() => handleShadiChat(invitation)}
                            className="flex items-center justify-center gap-1.5 md:gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 py-2.5 md:px-6 md:py-3.5 rounded-lg md:rounded-xl text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 xs:col-span-2 sm:col-span-3"
                          >
                            <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>LovenZea Chat</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SentInvitations;