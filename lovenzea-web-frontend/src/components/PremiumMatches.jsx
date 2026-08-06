import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Eye, Crown, Check, Star } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { formatDisplayName } from '../utils/mockData';

const PremiumMatches = () => {
    const navigate = useNavigate();
    const { summary } = useSelector((state) => state.dashboard);

    const matches = (summary?.premiumMatches || []).map(m => ({
        id: m.userId,
        name: formatDisplayName(m.user?.fullName, m.user?.displayNameVisibility, m.userId),
        age: m.age,
        height: m.user?.height,
        ethnicity: m.user?.religion, // mapping religion to ethnicity as per existing UI pattern
        location: m.city,
        profession: m.occupation,
        image: m.user?.profilePhotoUrl?.url || "https://i.pravatar.cc/100?img=1",
        isPremium: m.isPremium
    }));

    const handleConnect = (name, e) => {
        e.stopPropagation();
        toast.success(`Connected with ${name}!`, { autoClose: 1500 });
    };

    const handleViewAll = () => {
        navigate('/matches');
    };

    return (
        <div className='w-full px-2 sm:px-4 md:px-0'>
            <ToastContainer />

            {/* Responsive Container */}
            <div className="bg-theme-surface rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg border border-white/50 p-2 sm:p-3 md:p-4 lg:p-5 w-full mx-auto">

                {/* Header with Badge */}
                <div className="flex items-center justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-theme-border">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                                <Crown className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-white" />
                            </div>
                            <div className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                                <Star className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">Premium Matches</h2>
                                <span className="px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] xs:text-xs font-bold rounded-full shadow-sm">
                                    {(summary?.premiumMatches?.length || 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleViewAll}
                        className="px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-lg text-[10px] xs:text-xs font-medium flex items-center gap-1 sm:gap-1.5 transition-all hover:shadow whitespace-nowrap"
                    >
                        <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" onClick={handleViewAll} />
                        <span className="hidden xs:inline">View All</span>
                    </button>
                </div>

                {/* Matches List */}
                <div className="space-y-2 sm:space-y-3">
                    {matches.map((match) => (
                        <div
                            key={match.id}
                            onClick={() => navigate(`/matches/${match.id}`)}
                            className="group bg-theme-surface border border-theme-border rounded-lg sm:rounded-xl p-2 sm:p-2.5 md:p-3 hover:border-rose-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                            <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3">
                                {/* Profile Image */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden border-2 border-white shadow-md">
                                        <img
                                            src={match.image}
                                            alt={match.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    {/* Online Indicator */}
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-theme-success rounded-full border-2 border-white"></div>
                                </div>

                                {/* Right Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-1 sm:mb-1.5">
                                        {/* Name with Verification */}
                                        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                                            <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                                                {match.name}
                                            </h3>
                                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 flex-shrink-0" />
                                        </div>

                                        {/* Message Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/chat/${match.id}`);
                                            }}
                                            className="p-1 sm:p-1.5 bg-gray-100 hover:bg-gray-200 text-theme-text-secondary rounded-lg transition-colors flex-shrink-0"
                                        >
                                            <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </button>
                                    </div>

                                    {/* Details */}
                                    <p className="text-theme-text-secondary text-[10px] xs:text-xs mb-1.5 sm:mb-2 leading-relaxed">
                                        {match.age} yrs, {match.height}, {match.ethnicity}, {match.location}
                                    </p>

                                    {/* Profession and Connect Button */}
                                    <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                                        <p className="text-gray-800 font-medium text-[10px] xs:text-xs bg-gray-100 px-1.5 sm:px-2 md:px-2.5 py-1 sm:py-1.5 rounded-lg truncate flex-1 min-w-0">
                                            {match.profession}
                                        </p>

                                        {/* Connect Button */}
                                        <button
                                            onClick={(e) => handleConnect(match.name, e)}
                                            className="px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-lg text-[10px] xs:text-xs font-medium flex items-center gap-1 sm:gap-1.5 transition-all hover:shadow-md active:scale-95 whitespace-nowrap flex-shrink-0"
                                        >
                                            <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                            <span className="hidden xs:inline">Connect</span>
                                            <span className="xs:hidden">+</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Stats */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-theme-border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                        <div className="text-center">
                            <div className="text-xs sm:text-sm font-bold text-rose-600">{Number(summary?.recentVisitorsCount) || 0}</div>
                            <div className="text-[10px] xs:text-xs text-theme-text-secondary">Views</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs sm:text-sm font-bold text-rose-600">{Number(summary?.pendingInvitations) || 0}</div>
                            <div className="text-[10px] xs:text-xs text-theme-text-secondary">Interests</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs sm:text-sm font-bold text-rose-600">{Number(summary?.acceptedInvitations) || 0}</div>
                            <div className="text-[10px] xs:text-xs text-theme-text-secondary">Accepted</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumMatches;
