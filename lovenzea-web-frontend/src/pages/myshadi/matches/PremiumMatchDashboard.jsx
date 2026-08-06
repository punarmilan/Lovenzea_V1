import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import bannerBg from '../../../assets/image/banner-bg.png';
import { 
    Search, Heart, ShieldCheck, Star, ExternalLink,
    ChevronDown, RotateCcw, Crown, Zap, Calendar, User, Globe, MapPin, MessageCircle, Activity,
    CheckCircle2, Eye
} from 'lucide-react';
import { fetchNewMatches, fetchNearMeMatches, fetchRecentVisitors, searchPremiumProfiles, fetchFilterOptions, sendConnectionRequest, withdrawConnectionRequest, addToShortlistServer, removeFromShortlistServer, fetchSentRequests, fetchShortlist } from '../../../Slice/MatchSlice';
import FilterBar from '../../../components/FilterBar';
import AdvancedFiltersDrawer from '../../../components/AdvancedFiltersDrawer';
import { openChatWith } from '../../../Slice/ChatSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatDisplayName } from '../../../utils/mockData';
import {
    religionOptions, communityOptions, subCommunityOptions, 
    maritalStatusOptions, motherTongueOptions, countryOptions, 
    educationOptions, professionOptions, incomeOptions, 
    dietOptions, smokingOptions, drinkingOptions, 
    manglikOptions, rashiOptions, gotraOptions
} from '../../../constants/profileOptions';
import toast from 'react-hot-toast';

const PremiumMatchDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const tab = new URLSearchParams(location.search).get('tab') || 'new';
    
    // Fetch dynamic matches from Redux
    const { newMatches, nearMeMatches, recentVisitors, searchResults, filterOptions, sentRequests, shortlistedProfiles, loading, searchLoading } = useSelector((state) => state.match);
    const { user } = useSelector((state) => state.user);

    const [filters, setFilters] = useState({});
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    // Use static fallback lists unconditionally for filters as requested by user
    const combinedFilterOptions = useMemo(() => ({
        religion: religionOptions,
        caste: communityOptions,
        subCaste: subCommunityOptions,
        maritalStatus: maritalStatusOptions,
        motherTongue: motherTongueOptions,
        country: countryOptions,
        state: filterOptions?.state || [],
        city: filterOptions?.city || [],
        educationLevel: educationOptions,
        occupation: professionOptions,
        annualIncome: incomeOptions,
        diet: dietOptions,
        smokingHabit: smokingOptions,
        drinkingHabit: drinkingOptions,
        manglikStatus: manglikOptions.map(m => m.label),
        rashi: rashiOptions,
        gotra: gotraOptions,
    }), [filterOptions]);

    useEffect(() => {
        if (tab === 'nearme' || tab === 'near') {
            dispatch(fetchNearMeMatches({ page: 0, size: 20 }));
        } else if (tab === 'viewedme') {
            dispatch(fetchRecentVisitors({ page: 0, size: 20 }));
        } else {
            dispatch(fetchNewMatches({ page: 0, size: 20 }));
            // Only load default search profiles if we are on 'new' tab
            dispatch(searchPremiumProfiles({}));
        }
        dispatch(fetchSentRequests());
        dispatch(fetchShortlist());
        dispatch(fetchFilterOptions());
    }, [dispatch, tab]);

    const handleFilterChange = (key, value) => {
        const updatedFilters = { ...filters, [key]: value };
        setFilters(updatedFilters);
        // Instant search for toggles and sorts
        if (['sort', 'onlineNow', 'verified', 'premium'].includes(key)) {
            dispatch(searchPremiumProfiles(updatedFilters));
        }
    };

    const handleSearchSubmit = (keyword) => {
        const updated = { ...filters, keyword };
        setFilters(updated);
        dispatch(searchPremiumProfiles(updated));
    };

    const handleApplyFilters = () => {
        dispatch(searchPremiumProfiles(filters));
    };

    const handleReset = () => {
        setFilters({});
        dispatch(searchPremiumProfiles({}));
    };

    // Format dynamic user data to match our UI needs
    const getFormattedMatches = (sourceMatches) => {
        if (!sourceMatches || sourceMatches.length === 0) return [];
        return sourceMatches.map(m => {
            return {
                id: m.userId || m.id,
                name: formatDisplayName(m.fullName, m.displayNameVisibility, m.id) || "Unknown Profile",
                age: m.age || 25,
                height: m.height || "5'4\"",
                maritalStatus: m.maritalStatus || "Never Married",
                religion: m.religion ? `${m.religion}${m.caste ? `, ${m.caste}` : ''}` : "Hindu",
                city: m.city ? `${m.city}${m.state ? `, ${m.state}` : ''}` : "India",
                language: m.motherTongue || "Hindi",
                profession: m.occupation || "Not specified",
                bio: m.aboutMe || "I am simple, loving and career oriented person. I believe in honesty and strong values in a relationship.",
                image: m.profilePhotoUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80",
                online: m.isOnline,
                activeText: "Active recently",
                matchScore: Math.floor(Math.random() * (99 - 80 + 1) + 80),
                matchLabel: "Excellent Match",
                whyMatch: ["Same city", "Similar lifestyle", "Preference matched"],
                badges: ["Family Verified", "Premium"]
            };
        });
    };

    const applyLocalFilters = (profiles, currentFilters) => {
        if (!profiles || !currentFilters || Object.keys(currentFilters).length === 0) return profiles;
        
        return profiles.filter(p => {
            if (currentFilters.keyword && !p.fullName?.toLowerCase().includes(currentFilters.keyword.toLowerCase()) && !p.aboutMe?.toLowerCase().includes(currentFilters.keyword.toLowerCase())) return false;
            
            if (currentFilters.religion && p.religion !== currentFilters.religion) return false;
            if (currentFilters.caste && p.caste !== currentFilters.caste) return false;
            if (currentFilters.maritalStatus && p.maritalStatus !== currentFilters.maritalStatus) return false;
            if (currentFilters.motherTongue && p.motherTongue !== currentFilters.motherTongue) return false;
            if (currentFilters.country && p.country !== currentFilters.country) return false;
            if (currentFilters.state && p.state !== currentFilters.state) return false;
            if (currentFilters.city && p.city !== currentFilters.city) return false;
            if (currentFilters.educationLevel && p.educationLevel !== currentFilters.educationLevel) return false;
            if (currentFilters.occupation && p.occupation !== currentFilters.occupation) return false;
            if (currentFilters.diet && p.diet !== currentFilters.diet) return false;
            if (currentFilters.smokingHabit && p.smokingHabit !== currentFilters.smokingHabit) return false;
            if (currentFilters.drinkingHabit && p.drinkingHabit !== currentFilters.drinkingHabit) return false;
            if (currentFilters.manglikStatus && p.manglikStatus !== currentFilters.manglikStatus) return false;
            
            if (currentFilters.onlineNow && !p.isOnline) return false;
            
            return true;
        });
    };

    let sourceArray = newMatches;
    if (tab === 'nearme' || tab === 'near') {
        sourceArray = applyLocalFilters(nearMeMatches, filters);
    } else if (tab === 'viewedme') {
        sourceArray = applyLocalFilters(recentVisitors, filters);
    } else {
        if (Object.keys(filters).length > 0 && searchResults?.content) {
            sourceArray = searchResults.content;
        } else {
            sourceArray = newMatches;
        }
    }
    
    const displayMatches = getFormattedMatches(sourceArray);
    return (
        <div className="w-full bg-transparent min-h-[calc(100vh-7rem)] px-1 sm:px-4 pb-16 font-sans text-gray-800">
            <div className="max-w-7xl mx-auto pt-2">
                
                {/* HERO BANNER */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-full rounded-[20px] overflow-hidden shadow-sm mb-4 flex flex-col md:flex-row items-center px-6 py-3 border border-[#f1d8d1]"
                    style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
                >

                    <div className="relative z-10 w-full md:w-1/2 lg:w-3/5 text-gray-800 mb-2 md:mb-0">
                        <div className="bg-pink-100 w-max px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest text-pink-600 mb-1 border border-pink-200">
                            {tab === 'nearme' ? 'MATCHES NEAR YOU' : tab === 'viewedme' ? 'PEOPLE WHO VIEWED YOU' : 'CURATED MATCHES FOR YOU'}
                        </div>
                        <h1 className="text-xl sm:text-2xl lg:text-[28px] font-serif font-bold leading-tight mb-1 flex items-center gap-2">
                            {tab === 'nearme' ? 'Find Singles In Your Area' : tab === 'viewedme' ? 'Discover Who Is Interested' : 'Find Someone Worth Meeting'} <Heart className="inline fill-pink-500 text-pink-500 w-5 h-5 animate-pulse drop-shadow-sm" />
                        </h1>
                        <p className="text-[12px] text-theme-text-secondary max-w-sm mb-2 font-medium leading-relaxed">
                            {tab === 'nearme' ? 'Connect with matches located close to you.' : tab === 'viewedme' ? 'These members recently viewed your profile.' : 'Explore compatible profiles based on your preferences & relationship goals.'}
                        </p>
                        <div className="flex gap-3">
                            <button className="px-5 py-1.5 bg-gradient-to-r from-[#ef7f8f] to-[#c93f65] hover:from-[#df5f78] hover:to-[#b83f5d] text-white text-xs font-bold rounded-full shadow-[0_4px_10px_rgba(201,63,101,0.2)] hover:shadow-[0_6px_15px_rgba(201,63,101,0.3)] hover:-translate-y-0.5 transition-all flex items-center gap-2">
                                <User size={14} /> Explore Matches
                            </button>
                            <button className="px-5 py-1.5 bg-white border border-[#ef7f8f] hover:bg-[#fff1ed] text-[#c93f65] text-xs font-bold rounded-full transition-colors flex items-center gap-2 shadow-sm">
                                <Heart size={14} /> View Likes
                            </button>
                        </div>
                    </div>

                    <div className="relative z-10 w-full md:w-1/2 lg:w-2/5 flex justify-end">
                        <div className="flex gap-2">
                            <div className="bg-theme-surface/80 backdrop-blur-md border border-pink-100 rounded-[12px] p-2.5 w-[85px] text-center shadow-sm hover:bg-theme-surface transition-colors cursor-pointer">
                                <User className="mx-auto text-pink-500 mb-1" size={16} />
                                <p className="text-[9px] text-theme-text-secondary font-medium mb-0.5">Matches</p>
                                <p className="text-xl font-black text-gray-800">{displayMatches.length || 24}</p>
                                <p className="text-[8px] text-pink-500 mt-0.5 font-bold">+3 new</p>
                            </div>
                            <div className="bg-theme-surface/80 backdrop-blur-md border border-pink-100 rounded-[12px] p-2.5 w-[85px] text-center shadow-sm hover:bg-theme-surface transition-colors cursor-pointer">
                                <Eye className="mx-auto text-pink-500 mb-1" size={16} />
                                <p className="text-[9px] text-theme-text-secondary font-medium mb-0.5">Views</p>
                                <p className="text-xl font-black text-gray-800">56</p>
                                <p className="text-[8px] text-pink-500 mt-0.5 font-bold">+8 week</p>
                            </div>
                            <div className="bg-theme-surface/80 backdrop-blur-md border border-pink-100 rounded-[12px] p-2.5 w-[85px] text-center shadow-sm hover:bg-theme-surface transition-colors cursor-pointer">
                                <Heart className="mx-auto text-pink-500 mb-1" size={16} />
                                <p className="text-[9px] text-theme-text-secondary font-medium mb-0.5">Likes</p>
                                <p className="text-xl font-black text-gray-800">10</p>
                                <p className="text-[8px] text-pink-500 mt-0.5 font-bold">+2 week</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* FILTER / SEARCH BAR */}
                <FilterBar 
                    filters={filters} 
                    onFilterChange={handleFilterChange} 
                    onSearch={handleSearchSubmit} 
                    onReset={handleReset}
                    onOpenMoreFilters={() => setIsDrawerOpen(true)}
                    filterOptions={combinedFilterOptions}
                />

                <AdvancedFiltersDrawer 
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    filters={filters}
                    filterOptions={combinedFilterOptions}
                    onFilterChange={handleFilterChange}
                    onApply={handleApplyFilters}
                />


                {/* DYNAMIC MATCHES LIST */}
                <div className="space-y-4 mb-8">
                    {loading && displayMatches.length === 0 ? (
                        <div className="w-full flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
                        </div>
                    ) : displayMatches.length === 0 ? (
                        <div className="w-full flex flex-col items-center justify-center py-16 text-center bg-theme-surface/40 backdrop-blur-sm rounded-[24px] border border-dashed border-gray-300 shadow-sm">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400 shadow-inner">
                                <Search size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">No profiles found</h3>
                            <p className="text-sm text-theme-text-secondary mb-6 max-w-sm">
                                We couldn't find any matches matching your exact criteria. Try adjusting your filters to see more results!
                            </p>
                            <button 
                                onClick={() => {
                                    setSearchTerm('');
                                    setAgeFilter('');
                                    setReligionFilter('');
                                    setCasteFilter('');
                                    setLocationFilter('');
                                    setLanguageFilter('');
                                    setMaritalFilter('');
                                    setIsOnlineFilter(false);
                                    setIsVerifiedFilter(false);
                                    setSortBy('Best Match');
                                }}
                                className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold rounded-full transition-colors shadow-md flex items-center gap-2"
                            >
                                <RotateCcw size={14} /> Clear All Filters
                            </button>
                        </div>
                    ) : (
                        displayMatches.map((match, i) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: (i % 5) * 0.05 }}
                                key={match.id}
                                onClick={() => navigate(`/matches/${match.id}`)}
                                className="w-full dashboard-card-bg rounded-[24px] p-4 flex flex-col md:flex-row gap-6 shadow-sm border border-white/50 hover:shadow-md transition-all duration-300 cursor-pointer"
                            >
                                {/* LEFT: Image Square */}
                                <div className="relative w-full md:w-[220px] h-[220px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                    <img src={match.image} alt={match.name} className="w-full h-full object-cover" />
                                    
                                    <div className="absolute top-2 left-2 bg-[#ff336f] text-white text-[9px] font-black tracking-wider px-2 py-1 rounded shadow-md uppercase">
                                        NEW
                                    </div>
                                    
                                    <div className="absolute bottom-2 left-2 bg-gradient-to-tr from-green-600 to-green-400 text-white rounded-full w-14 h-14 flex flex-col items-center justify-center shadow-lg border-2 border-white">
                                        <span className="text-sm font-black leading-none">{match.matchScore}%</span>
                                        <span className="text-[7px] uppercase font-bold tracking-widest mt-0.5">Match</span>
                                    </div>

                                    {/* Pagination Dots */}
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-theme-surface"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-theme-surface/50"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-theme-surface/50"></div>
                                    </div>
                                </div>

                                {/* CENTER: Details */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <h2 className="text-xl font-bold font-sans text-gray-900">{match.name}</h2>
                                            <div className="bg-blue-500 rounded-full p-0.5 shadow-sm">
                                                <CheckCircle2 size={12} className="text-white" />
                                            </div>
                                        </div>

                                        {/* Sub Tags */}
                                        <div className="flex flex-wrap items-center gap-3 mb-4 text-[10px] font-bold text-theme-text-secondary">
                                            {match.online ? (
                                                <span className="flex items-center gap-1 text-green-600"><div className="w-1.5 h-1.5 rounded-full bg-theme-success"></div> Online</span>
                                            ) : (
                                                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> {match.activeText}</span>
                                            )}
                                            <span className="flex items-center gap-1"><Heart size={10} className="text-pink-400" /> You & Him</span>
                                            <span className="flex items-center gap-1"><Star size={10} className="text-yellow-400" /> Astro Match</span>
                                            <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-blue-400" /> Verified</span>
                                        </div>

                                        {/* Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 mb-4">
                                            <div className="flex items-center gap-2 text-[12px] text-theme-text-secondary font-medium">
                                                <User size={14} className="text-gray-400" /> {match.age} Yrs, {match.height}
                                            </div>
                                            <div className="flex items-center gap-2 text-[12px] text-theme-text-secondary font-medium">
                                                <Heart size={14} className="text-gray-400" /> {match.maritalStatus}
                                            </div>
                                            <div className="flex items-center gap-2 text-[12px] text-theme-text-secondary font-medium">
                                                <MapPin size={14} className="text-gray-400" /> {match.city}
                                            </div>
                                            <div className="flex items-center gap-2 text-[12px] text-theme-text-secondary font-medium">
                                                <Globe size={14} className="text-gray-400" /> {match.religion}
                                            </div>
                                            <div className="flex items-center gap-2 text-[12px] text-theme-text-secondary font-medium">
                                                <MessageCircle size={14} className="text-gray-400" /> {match.language}
                                            </div>
                                            <div className="flex items-center gap-2 text-[12px] text-theme-text-secondary font-medium">
                                                <Activity size={14} className="text-gray-400" /> {match.profession}
                                            </div>
                                        </div>

                                        <p className="text-[12px] text-theme-text-secondary leading-relaxed mb-4">
                                            {match.bio} <span className="text-pink-500 font-semibold cursor-pointer">... More</span>
                                        </p>
                                    </div>

                                    {/* Bottom Pills */}
                                    <div className="flex flex-wrap gap-2">
                                        <span className="bg-green-50 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-green-100">
                                            <Zap size={10} /> Currently online
                                        </span>
                                        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-blue-100">
                                            <ShieldCheck size={10} /> Family Verified
                                        </span>
                                        <span className="bg-yellow-50 text-yellow-700 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-yellow-100">
                                            <Crown size={10} /> Premium
                                        </span>
                                    </div>
                                </div>

                                {/* RIGHT: AI Score & Buttons */}
                                <div className="w-full md:w-full max-w-[380px] flex-shrink-0 flex flex-col md:flex-row gap-4 pt-4 md:pt-0 pl-0 md:pl-6">
                                    
                                    {/* AI Match Score Column */}
                                    <div className="flex-1 flex flex-col items-center justify-center pr-4">
                                        <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-2 text-center">AI Match Score</p>
                                        <div className="relative w-[60px] h-[60px] rounded-full border-[4px] border-[#ff336f] flex items-center justify-center mb-1">
                                            <span className="text-lg font-black text-gray-800">{match.matchScore}%</span>
                                        </div>
                                        <p className="text-[11px] font-bold text-gray-700 mb-2">{match.matchLabel}</p>
                                        
                                        <div className="w-full">
                                            <p className="text-[9px] font-bold text-[#ff336f] mb-1">Why this match?</p>
                                            <ul className="space-y-1">
                                                {match.whyMatch.map((reason, idx) => (
                                                    <li key={idx} className="flex items-center gap-1.5 text-[9.5px] font-medium text-theme-text-secondary">
                                                        <CheckCircle2 size={10} className="text-[#ff336f]" /> {reason}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Buttons Column */}
                                    <div className="flex-1 flex flex-col gap-2 justify-center">
                                        {(() => {
                                            // Check if already liked (connection request sent)
                                            const isLiked = sentRequests?.some(r => r.receiverProfileId === match.id || r.receiverId === match.id);
                                            // Check if already shortlisted
                                            const isShortlisted = shortlistedProfiles?.some(p => p.id === match.id || p.userId === match.id);
                                            
                                            return (
                                                <>
                                                    <button onClick={(e) => { 
                                                        e.stopPropagation(); 
                                                        if (isLiked) {
                                                            dispatch(withdrawConnectionRequest(match.id))
                                                                .unwrap()
                                                                .then(() => toast.success('Like removed!'))
                                                                .catch(err => toast.error(err.message || 'Failed to remove like'));
                                                        } else {
                                                            dispatch(sendConnectionRequest(match.id))
                                                                .unwrap()
                                                                .then(() => toast.success('Profile Liked!'))
                                                                .catch(err => toast.error(err.message || 'Failed to like profile'));
                                                        }
                                                    }} className={`w-full py-1.5 border border-[#D4AF37] text-[11px] font-bold rounded-full transition-colors flex items-center justify-center gap-1.5 ${isLiked ? 'bg-[#D4AF37] text-white hover:bg-[#C89B3C]' : 'bg-theme-surface hover:bg-[#FDFBF7] text-[#D4AF37]'}`}>
                                                        <Heart size={12} className={isLiked ? 'text-white fill-white' : 'text-[#D4AF37]'} /> {isLiked ? 'Liked' : 'Like'}
                                                    </button>
                                                    <button onClick={(e) => { 
                                                        e.stopPropagation(); 
                                                        if (isLiked) {
                                                            toast('Request already sent', { icon: 'ℹ️' });
                                                        } else {
                                                            dispatch(sendConnectionRequest(match.id))
                                                                .unwrap()
                                                                .then(() => toast.success('Connection Request Sent!'))
                                                                .catch(err => toast.error(err.message || 'Failed to send request'));
                                                        }
                                                    }} className={`w-full py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#C89B3C] hover:from-[#C89B3C] hover:to-[#B8860B] text-white text-[11px] font-bold rounded-full transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#D4AF37]/20 ${isLiked ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                                        <MessageCircle size={12} className="text-white fill-white" /> Connect Now
                                                    </button>
                                                    <button onClick={(e) => { 
                                                        e.stopPropagation();
                                                        if (isShortlisted) {
                                                            dispatch(removeFromShortlistServer(match.id))
                                                                .unwrap()
                                                                .then(() => toast.success('Removed from shortlist!'))
                                                                .catch(err => toast.error(err.message || 'Failed to remove'));
                                                        } else {
                                                            dispatch(addToShortlistServer(match))
                                                                .unwrap()
                                                                .then(() => toast.success('Profile Shortlisted!'))
                                                                .catch(err => toast.error(err.message || 'Failed to shortlist profile'));
                                                        }
                                                    }} className={`w-full py-1.5 border border-[#D4AF37] text-[11px] font-bold rounded-full transition-colors flex items-center justify-center gap-1.5 ${isShortlisted ? 'bg-[#D4AF37] text-white hover:bg-[#C89B3C]' : 'bg-theme-surface hover:bg-[#FDFBF7] text-[#D4AF37]'}`}>
                                                        <Star size={12} className={isShortlisted ? 'text-white fill-white' : 'text-[#D4AF37]'} /> {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                                                    </button>
                                                </>
                                            );
                                        })()}
                                        <button onClick={(e) => { 
                                            e.stopPropagation(); 
                                            dispatch(openChatWith({
                                                id: match.id,
                                                fullName: match.name,
                                                profilePhotoUrl: match.image,
                                                displayNameVisibility: 'SHOW_FULL_NAME'
                                            }));
                                        }} className="w-full py-1.5 bg-theme-surface border border-[#D4AF37] hover:bg-[#FDFBF7] text-[#D4AF37] text-[11px] font-bold rounded-full transition-colors flex items-center justify-center gap-1.5">
                                            <MessageCircle size={12} className="text-[#D4AF37]" /> Send Message
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); navigate(`/matches/${match.id}`); }} className="w-full py-1.5 bg-theme-surface border border-[#D4AF37] hover:bg-[#FDFBF7] text-[#D4AF37] text-[11px] font-bold rounded-full transition-colors flex items-center justify-center gap-1.5">
                                            <ExternalLink size={12} className="text-[#D4AF37]" /> View Profile
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* BOTTOM CTA CARD */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                    className="w-full bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 border border-pink-100"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
                            <Heart size={24} className="text-[#ff336f] fill-[#ff336f]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-gray-900 mb-0.5">Want better matches?</h3>
                            <p className="text-[11px] font-medium text-theme-text-secondary">Complete your profile, add more photos and get 3x more matches.</p>
                        </div>
                    </div>
                    <button className="w-full md:w-auto px-6 py-2 bg-[#ff336f] hover:bg-[#ff1a5d] text-white text-[11px] font-bold rounded-md shadow-md transition-colors flex items-center justify-center gap-2">
                        <Activity size={14} /> Improve My Profile
                    </button>
                </motion.div>

            </div>
        </div>
    );
};

export default PremiumMatchDashboard;
