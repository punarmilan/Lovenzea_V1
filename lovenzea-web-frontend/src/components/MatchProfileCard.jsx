import React from 'react';
import { Heart, User, Star, MapPin, Briefcase, GraduationCap, IndianRupee, Sparkles, MessageCircle, Phone, Mail, ChevronDown, Check, Globe, Flag, Ban, Lock, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import PremiumLock from '../components/PremiumLock';

const MatchProfileCard = ({ profile, layout = 'grid', onConnect = null, requestSent = false, onSendRequest = null, isRequestSent = false, onShortlist = null, isShortlisted = false, onRemoveShortlist = null, onChat = null, onReport = null }) => {
    const navigate = useNavigate();
    const isGrid = layout === 'grid';
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);

    // Map ProfileDTO fields to internal names for consistency
    const displayName = profile.fullName || profile.name || "User " + profile.id;
    
    const MALE_AVATARS = [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=60"
    ];

    const FEMALE_AVATARS = [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&auto=format&fit=crop&q=60"
    ];

    const idVal = profile.id || profile.userId || 0;
    const isMale = (profile.gender || 'female').toLowerCase() === 'male';
    const fallbackAvatar = isMale 
        ? MALE_AVATARS[idVal % MALE_AVATARS.length] 
        : FEMALE_AVATARS[idVal % FEMALE_AVATARS.length];

    const photoUrl = profile.profilePhotoUrl || profile.img || fallbackAvatar;
    const age = profile.age;
    const height = profile.height;
    const location = profile.city ? `${profile.city}${profile.state ? ', ' + profile.state : ''}` : (profile.location || 'Location N/A');
    const occupation = profile.occupation || profile.profession || 'Profession N/A';
    const religionBase = profile.religion || '';
    const casteBase = profile.caste || '';
    const community = religionBase + (casteBase ? `: ${casteBase}` : '');
    const matchPercentage = profile.matchPercentage || 0;
    const matchReasons = profile.topMatchReasons || [];

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isLocked = profile.premiumVisible === false;

    const handleViewPlans = () => {
        navigate('/payment');
    };

    // Helper for online status
    const isOnline = profile.isOnline;

    const formatLastActive = (lastActive) => {
        if (!lastActive) return 'Offline';
        const date = new Date(lastActive);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    // Layout-specific rendering: Compact Grid (Mockup Style)
    if (layout === 'compact-grid') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-theme-surface rounded-lg shadow-md border border-theme-border overflow-hidden flex flex-col w-full max-w-[240px] mx-auto min-h-[420px]"
            >
                {/* Image Section */}
                <div
                    className="relative aspect-[4/5] overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/matches/${idVal}`)}
                >
                    <img
                        src={photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff&size=400&bold=true`}
                        alt={displayName}
                        className={`w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500 ${isLocked ? 'blur-lg scale-110' : ''}`}
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff&size=400&bold=true`;
                        }}
                    />

                    {isLocked && <PremiumLock onViewPlans={handleViewPlans} />}

                    {/* Premium Badge */}
                    {profile.isPremium && (
                        <div className="absolute top-2 left-2 bg-[#ff5a60] text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                            <Star size={10} className="fill-white" />
                            Plus
                        </div>
                    )}
                    
                    {/* Match Percentage Badge */}
                    {matchPercentage > 0 && (
                        <div className="absolute top-2 right-2 bg-theme-success/90 backdrop-blur-sm text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg border border-white/20">
                            <Sparkles size={10} className="fill-white" />
                            {matchPercentage}% Match
                        </div>
                    )}

                    {/* Dropdown for Compact Grid */}
                    <div className="absolute top-2 right-2" ref={dropdownRef}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsDropdownOpen(!isDropdownOpen);
                            }}
                            className="w-7 h-7 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                        >
                            <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="absolute right-0 mt-2 w-48 bg-theme-surface rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                                >
                                    <button
                                        className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-gray-700 hover:bg-theme-lavender hover:text-[#0F766E] transition-colors text-left"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsDropdownOpen(false);
                                            if (isShortlisted) onRemoveShortlist?.();
                                            else onShortlist?.();
                                        }}
                                    >
                                        <Star size={14} className={isShortlisted ? 'fill-theme-primary text-theme-primary' : ''} />
                                        {isShortlisted ? 'Remove Shortlist' : 'Add to Shortlist'}
                                    </button>
                                    <button
                                        className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsDropdownOpen(false);
                                            onReport?.();
                                        }}
                                    >
                                        <Flag size={14} />
                                        Report User
                                    </button>
                                    <div className="h-px bg-gray-100 my-1 mx-2"></div>
                                    <button
                                        className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-gray-400 hover:bg-gray-100 transition-colors text-left"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        <Ban size={14} />
                                        Block User
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Online Status Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <div className="flex items-center gap-1.5 text-white">
                            <span className="text-[10px] font-medium opacity-90">
                                {isOnline ? 'Online now' : `Last active: ${formatLastActive(profile.lastActive)}`}
                            </span>
                            <div className="w-5 h-5 flex items-center justify-center">
                                <MessageCircle size={14} className={`${isOnline ? 'text-green-400 fill-green-400' : 'text-gray-400 fill-gray-400'}`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-3 flex flex-col flex-grow">
                    <h3
                        className="text-[#0F766E] font-bold text-[15px] truncate hover:underline cursor-pointer mb-1"
                        onClick={() => navigate(`/matches/${idVal}`)}
                    >
                        {displayName}
                    </h3>

                    <div className="space-y-0.5 mb-3">
                        <p className="text-[12px] text-theme-text-secondary leading-tight">
                            {age} yrs, {height}, {religionBase}, {profile.motherTongue || 'Marathi'}
                        </p>
                        <p className="text-[12px] text-theme-text-secondary leading-tight truncate">
                            {casteBase || 'Community'}
                        </p>
                        <p className="text-[12px] text-theme-text-secondary leading-tight truncate">
                            {location}
                        </p>
                    </div>

                    {/* Match Reasons (Explainability) for Compact Grid */}
                    {matchReasons.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {matchReasons.slice(0, 2).map((reason, idx) => (
                                <span key={idx} className="bg-green-50 text-green-700 text-[9px] px-2 py-0.5 rounded-full font-bold border border-green-100 italic">
                                    {reason}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Action Section */}
                    <div className="mt-auto border-t border-gray-100 pt-3 flex flex-col items-center">
                        <p className="text-[13px] text-theme-text-secondary font-medium mb-3">Connect with {profile.gender?.toLowerCase() === 'male' ? 'him' : 'her'}?</p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!(requestSent || isRequestSent)) {
                                    if (onConnect) onConnect();
                                    else if (onSendRequest) onSendRequest();
                                }
                            }}
                            disabled={requestSent || isRequestSent}
                            className={`w-full py-2 rounded font-bold text-sm transition-all shadow-sm ${requestSent || isRequestSent
                                ? 'bg-gradient-to-r from-amber-200 to-amber-400 text-amber-900 cursor-not-allowed flex items-center justify-center gap-1'
                                : 'bg-gradient-to-r from-theme-primary to-theme-pink text-white hover:from-[#115E59] hover:to-[#16A085]'
                                }`}
                        >
                            {requestSent || isRequestSent ? <><Check className="w-4 h-4" /> Sent</> : 'Yes'}
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Layout-specific rendering: List Mode (Legacy)
    if (layout === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -2, shadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                onClick={() => navigate(`/matches/${idVal}`)}
                className="group bg-theme-surface rounded-xl shadow-sm border border-theme-border overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row relative cursor-pointer"
            >
                {/* Left: Image Section */}
                <div
                    className="relative w-full md:w-64 h-72 md:h-auto overflow-hidden cursor-pointer flex-shrink-0"
                    onClick={() => navigate(`/matches/${idVal}`)}
                >
                    <img
                        src={photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff&size=600&bold=true`}
                        alt={displayName}
                        className={`w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 ${(requestSent || isRequestSent) ? 'opacity-60 grayscale' : ''} ${isLocked ? 'blur-lg scale-110' : ''}`}
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff&size=600&bold=true`;
                        }}
                    />

                    {isLocked && <PremiumLock onViewPlans={handleViewPlans} />}

                    {/* Corner Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <span className="bg-theme-primary text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider animate-pulse">
                            New
                        </span>
                        {profile.isPremium && (
                            <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                                <Star size={16} className="fill-amber-900 text-amber-900" />
                            </div>
                        )}
                    </div>

                    {/* Image Navigation Dots (Mock) */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1 bg-black/30 backdrop-blur-md rounded-full">
                        <div className="w-1.5 h-1.5 bg-theme-surface rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-theme-surface/50 rounded-full"></div>
                    </div>
                </div>

                {/* Middle: Info Section */}
                <div className="flex-1 p-6 flex flex-col min-w-0 border-r border-gray-100/50">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <h3
                                className="text-xl font-extrabold text-gray-900 truncate hover:text-theme-primary cursor-pointer transition-colors"
                                onClick={() => navigate(`/matches/${idVal}`)}
                            >
                                {displayName}
                            </h3>
                            <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                                <Check size={12} className="text-white stroke-[4]" />
                            </div>
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDropdownOpen(!isDropdownOpen);
                                    }}
                                    className="text-gray-400 hover:text-theme-text-secondary transition-colors"
                                >
                                    <ChevronDown size={20} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            className="absolute right-0 mt-2 w-48 bg-theme-surface rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                                        >
                                            <button
                                                className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-gray-700 hover:bg-theme-lavender hover:text-[#0F766E] transition-colors text-left"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsDropdownOpen(false);
                                                    if (isShortlisted) onRemoveShortlist?.();
                                                    else onShortlist?.();
                                                }}
                                            >
                                                <Star size={14} className={isShortlisted ? 'fill-theme-primary text-theme-primary' : ''} />
                                                {isShortlisted ? 'Remove Shortlist' : 'Add to Shortlist'}
                                            </button>
                                            <button
                                                className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsDropdownOpen(false);
                                                    onReport?.();
                                                }}
                                            >
                                                <Flag size={14} />
                                                Report User
                                            </button>
                                            <div className="h-px bg-gray-100 my-1 mx-2"></div>
                                            <button
                                                className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-gray-400 hover:bg-gray-100 transition-colors text-left"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                <Ban size={14} />
                                                Block User
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Status & Badges */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className={`flex items-center gap-2 text-[12px] font-bold ${isOnline ? 'text-green-600' : 'text-theme-text-secondary'}`}>
                            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-theme-success animate-ping' : 'bg-gray-400'}`}></span>
                            {isOnline ? 'Online' : `Active ${formatLastActive(profile.lastActive)}`}
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold text-theme-text-secondary">
                            <div className="flex items-center gap-1.5 hover:text-theme-primary cursor-pointer transition-colors">
                                <Heart size={14} className="text-theme-primary" />
                                You & {profile.gender?.toLowerCase() === 'male' ? 'Him' : 'Her'}
                            </div>
                            <div className="flex items-center gap-1.5 hover:text-amber-500 cursor-pointer transition-colors">
                                <Star size={14} className="text-amber-400" />
                                Astro
                            </div>
                        </div>
                    </div>

                    {/* Rich Details Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-y-3 gap-x-8 mb-6">
                        <div className="text-[14px]">
                            <span className="text-theme-text-secondary font-medium">{age} yrs, {height}</span>
                        </div>
                        <div className="text-[14px]">
                            <span className="text-theme-text-secondary font-medium">{profile.maritalStatus || 'Never Married'}</span>
                        </div>
                        <div className="text-[14px]">
                            <span className="text-theme-text-secondary font-medium">{religionBase}, {casteBase || 'Community'}</span>
                        </div>
                        <div className="text-[14px]">
                            <span className="text-theme-text-secondary font-medium">{location}</span>
                        </div>
                        <div className="text-[14px]">
                            <span className="text-theme-text-secondary font-medium">{profile.motherTongue || 'Hindi'}</span>
                        </div>
                        <div className="text-[14px]">
                            <span className="text-theme-text-secondary font-medium">{occupation}</span>
                        </div>
                    </div>

                    {/* Bio Snippet */}
                    <div className="relative group/bio">
                        <p className="text-[13px] text-theme-text-secondary leading-relaxed line-clamp-2 italic">
                            {profile.aboutMe || "There are some things that would help you know me better. In terms of education, I have completed my Graduation..."}
                            <button className="ml-1.5 text-cyan-600 font-bold hover:underline">More</button>
                        </p>
                    </div>

                    {/* Match Reasons (Explainability) for List Layout */}
                    {matchReasons.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {matchReasons.slice(0, 3).map((reason, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 bg-green-50/50 text-green-700 px-3 py-1 rounded-full border border-green-100">
                                    <Check size={10} className="stroke-[3]" />
                                    <span className="text-[11px] font-bold italic">{reason}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Connect Action Section */}
                <div className="w-full md:w-56 bg-gray-50/50 p-6 flex flex-col items-center justify-center text-center gap-4">
                    <p className="text-sm font-bold text-theme-text-secondary">Like this profile?</p>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!(requestSent || isRequestSent)) {
                                if (onConnect) onConnect();
                                else if (onSendRequest) onSendRequest();
                            }
                        }}
                        disabled={requestSent || isRequestSent}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${requestSent || isRequestSent
                            ? 'bg-theme-lavender text-theme-primary border-2 border-theme-border'
                            : 'bg-theme-surface text-green-500 border-2 border-green-500 hover:bg-green-50'
                            }`}
                    >
                        {requestSent || isRequestSent ? (
                            <Check size={28} className="stroke-[3]" />
                        ) : (
                            <Check size={28} className="stroke-[3]" />
                        )}
                    </motion.button>

                    <button
                        onClick={() => !(requestSent || isRequestSent) && (onConnect ? onConnect() : onSendRequest?.())}
                        className="text-[14px] font-extrabold text-cyan-600 hover:underline"
                    >
                        {requestSent || isRequestSent ? 'Request Sent' : 'Connect Now'}
                    </button>
                </div>

                {/* Dropdown in List Mode (Floating) */}
                <div className="absolute bottom-4 right-4 md:top-4 md:right-auto md:left-[calc(64px+16px)]">
                    {/* If we want to keep the dropdown button, we can add it here or use the name's chevron */}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            onClick={() => navigate(`/matches/${idVal}`)}
            className="group bg-theme-surface rounded-2xl shadow-sm border border-theme-border overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col relative cursor-pointer"
        >
            {/* Image Section */}
            <div
                className="relative h-72 overflow-hidden cursor-pointer"
            >
                <img
                    src={photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff&size=600&bold=true`}
                    alt={displayName}
                    className={`w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 ${(requestSent || isRequestSent) ? 'opacity-60 grayscale' : ''} ${isLocked ? 'blur-lg scale-110' : ''}`}
                    onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff&size=600&bold=true`;
                    }}
                />

                {isLocked && <PremiumLock onViewPlans={handleViewPlans} />}

                {/* Image Overlays */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {profile.isPremium && (
                        <span className="bg-amber-400 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 uppercase tracking-wider">
                            <Sparkles size={10} className="fill-amber-950" />
                            Premium
                        </span>
                    )}
                </div>

                <div className="absolute top-3 right-3" ref={dropdownRef}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDropdownOpen(!isDropdownOpen);
                        }}
                        className="w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
                    >
                        <ChevronDown size={18} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 mt-2 w-48 bg-theme-surface rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                            >
                                <button
                                    className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-gray-700 hover:bg-theme-lavender hover:text-[#0F766E] transition-colors text-left"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDropdownOpen(false);
                                        if (isShortlisted) onRemoveShortlist?.();
                                        else onShortlist?.();
                                    }}
                                >
                                    <Star size={14} className={isShortlisted ? 'fill-theme-primary text-theme-primary' : ''} />
                                    {isShortlisted ? 'Remove Shortlist' : 'Add to Shortlist'}
                                </button>
                                <button
                                    className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDropdownOpen(false);
                                        onReport?.();
                                    }}
                                >
                                    <Flag size={14} />
                                    Report User
                                </button>
                                <div className="h-px bg-gray-100 my-1 mx-2"></div>
                                <button
                                    className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-gray-400 hover:bg-gray-100 transition-colors text-left"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    <Ban size={14} />
                                    Block User
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Verification Badge */}
                <div className="absolute bottom-3 left-3">
                    <div className="bg-theme-surface/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                        <div className="w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
                            <Check size={10} className="text-white stroke-[4]" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter">Verified</span>
                    </div>
                </div>

                {(requestSent || isRequestSent) && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="bg-theme-primary text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-2">
                            <Check size={14} className="stroke-[3]" />
                            Request Sent
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5 flex-grow flex flex-col">
                <div className="flex items-center justify-between mb-3">
                    <h3
                        className="text-lg font-bold text-gray-800 truncate hover:text-theme-primary cursor-pointer transition-colors"
                        onClick={() => navigate(`/matches/${profile.id}`)}
                    >
                        {displayName}
                    </h3>
                    <span className={`flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${isOnline ? 'text-green-600 bg-green-50' : 'text-theme-text-secondary bg-gray-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-theme-success animate-pulse' : 'bg-gray-400'}`}></span>
                        {isOnline ? 'ONLINE' : formatLastActive(profile.lastActive).toUpperCase()}
                    </span>
                </div>

                {/* Match Percentage & Reasons (Default Layout) */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    {matchPercentage > 0 && (
                        <div className="flex items-center gap-1.5 bg-green-600 text-white px-2 py-0.5 rounded-lg text-[11px] font-black shadow-sm">
                            <Sparkles size={11} className="fill-white" />
                            {matchPercentage}%
                        </div>
                    )}
                    {matchReasons.slice(0, 2).map((reason, idx) => (
                        <div key={idx} className="bg-green-50 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-green-100 flex items-center gap-1">
                            <div className="w-1 h-1 bg-theme-success rounded-full"></div>
                            {reason}
                        </div>
                    ))}
                </div>

                {/* Main Details Grid */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                    <div className="flex items-center gap-2 text-[13px] text-theme-text-secondary">
                        <User size={14} className="text-gray-400" />
                        <span>{age} yrs, {height}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-theme-text-secondary">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="truncate">{location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-theme-text-secondary">
                        <Globe size={14} className="text-gray-400" />
                        <span className="truncate">{community}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-theme-text-secondary">
                        <Briefcase size={14} className="text-gray-400" />
                        <span className="truncate">{occupation}</span>
                    </div>
                </div>

                {/* About Snippet */}
                <p className="text-[13px] text-theme-text-secondary line-clamp-2 italic mb-6 leading-relaxed">
                    "{profile.aboutMe || "I am a caring and family oriented person looking for a compatibility match..."}"
                </p>

                {/* Action Row */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!(requestSent || isRequestSent)) {
                                if (onConnect) onConnect();
                                else if (onSendRequest) onSendRequest();
                            }
                        }}
                        disabled={requestSent || isRequestSent}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${requestSent || isRequestSent
                            ? 'bg-theme-lavender text-theme-primary shadow-none border border-theme-border'
                            : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 shadow-cyan-100'
                            }`}
                    >
                        {requestSent || isRequestSent ? (
                            <>
                                <Check size={16} className="stroke-[3]" />
                                Sent
                            </>
                        ) : (
                            'Connect Now'
                        )}
                    </motion.button>

                    {onChat && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onChat?.(profile.userId || profile.id);
                            }}
                            className="w-10 h-10 bg-theme-lavender rounded-xl flex items-center justify-center text-theme-primary hover:bg-theme-primary hover:text-white transition-all shadow-sm"
                            title="Start Chat"
                        >
                            <MessageCircle size={20} />
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MatchProfileCard;
