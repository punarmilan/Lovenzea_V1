import React, { useState, useEffect } from 'react';
import {
    Clock, ChevronLeft, ChevronRight, Lock, Users, Star,
    Share2, Printer, Copy, CheckCircle, Smartphone,
    MessageSquare, Home, MapPin, Briefcase, GraduationCap,
    Info, ExternalLink, HeartHandshake, Circle, Phone,
    MessageCircle, ChevronDown, Flag, Ban, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDisplayName } from '../../utils/mockData';
import { useNavigate } from 'react-router-dom';
import PremiumLock from '../../components/PremiumLock';

const TodayMatchView = ({
    profile,
    myProfile,
    onNext,
    onPrev,
    currentIndex,
    total,
    onShortlist = null,
    isShortlisted = false,
    onRemoveShortlist = null,
    onConnect = null,
    requestSent = false,
    onChat = null,
    onWhatsApp = null,
    onCall = null,
    onReport = null,
    preferenceMatch = null
}) => {
    const [subTab, setSubTab] = useState('detailed');
    const [timeLeft, setTimeLeft] = useState('');
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = React.useRef(null);
    const navigate = useNavigate();

    // Reset photo index when profile changes
    useEffect(() => {
        setCurrentPhotoIndex(0);
    }, [profile?.id]);

    const allPhotos = [
        profile.profilePhotoUrl || profile.img,
        profile.photoUrl2,
        profile.photoUrl3,
        profile.photoUrl4,
        profile.photoUrl5,
        profile.photoUrl6
    ].filter(Boolean);

    const isLocked = profile.premiumVisible === false;
    const isPremium = profile.isPremium;

    const handleViewPlans = () => {
        navigate('/payment');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            const diff = midnight - now;

            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            return `${hours}h : ${minutes}m : ${seconds}s`;
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        setTimeLeft(calculateTimeLeft());

        return () => clearInterval(timer);
    }, []);

    const displayName = formatDisplayName(
        profile.fullName || profile.name,
        profile.displayNameVisibility,
        profile.profileId || `SH${profile.id}`
    );

    const preferences = preferenceMatch?.matchList || [];
    const matchCount = preferenceMatch?.matchedCount || 0;
    const totalCount = preferenceMatch?.totalPreferences || 0;
    const matchPercentage = preferenceMatch?.matchPercentage || 0;

    if (!profile) return null;

    return (
        <div className="max-w-4xl mx-auto py-2 px-4 md:px-0">
            {/* Title */}
            <h2 className="text-center text-theme-text-secondary text-[15px] mb-4">
                Here are Today's top Matches for you. Connect with them now!
            </h2>

            {/* Countdown and Pager Bar */}
            <div className="bg-theme-surface rounded-t-lg border border-theme-border px-4 py-2 flex justify-between items-center text-[13px] mb-[-1px] relative z-10 shadow-sm">
                <div className="flex items-center gap-2 text-theme-text-secondary">
                    <span>Time left to Connect</span>
                    <div className="flex items-center gap-1.5 text-rose-500 font-bold">
                        <Clock className="w-4 h-4" />
                        <span>{timeLeft}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onPrev}
                            className="flex items-center gap-1 text-blue-500 font-bold hover:underline"
                        >
                            <ChevronLeft className="w-4 h-4" /> Prev
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white shadow-sm ring-1 ring-gray-100 flex items-center justify-center overflow-hidden">
                                {profile.img ? (
                                    <img src={profile.img} className="w-full h-full object-cover grayscale opacity-50" alt="" />
                                ) : (
                                    <Users className="w-4 h-4 text-gray-400" />
                                )}
                            </div>
                            <span className="text-gray-300">|</span>
                            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white shadow-sm ring-1 ring-gray-100 flex items-center justify-center overflow-hidden">
                                {profile.img ? (
                                    <img src={profile.img} className="w-full h-full object-cover opacity-50 grayscale" alt="" />
                                ) : (
                                    <Users className="w-4 h-4 text-gray-400" />
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onNext}
                            className="flex items-center gap-1 text-blue-500 font-bold hover:underline"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Profile Card */}
            <div className="bg-theme-surface border-x border-y md:border-t-0 border-theme-border shadow-sm overflow-hidden mb-6 rounded-lg md:rounded-none md:rounded-b-lg">
                <div className="p-4 flex flex-col md:flex-row gap-6">
                    {/* Left: Image */}
                    <div className="w-full md:w-[220px] flex-shrink-0">
                        <div className="relative group">
                            <div className={`w-full h-[280px] rounded shadow-sm border bg-gray-50 flex items-center justify-center overflow-hidden ${isPremium ? 'border-amber-400 border-2' : 'border-gray-100'} ${isLocked ? 'blur-lg scale-110' : ''}`}>
                                {allPhotos.length > 0 ? (
                                    <img
                                        src={allPhotos[currentPhotoIndex]}
                                        alt={displayName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Users className="w-16 h-16 text-gray-200" />
                                )}
                            </div>
                            {isLocked && <PremiumLock onViewPlans={handleViewPlans} />}
                            
                            {isPremium && (
                                <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-md z-20">
                                    <Star size={10} className="fill-white" />
                                    PREMIUM PLUS
                                </div>
                            )}

                             {allPhotos.length > 1 && (
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/40 text-white text-[11px] px-2 py-0.5 rounded-full flex items-center gap-2 z-20">
                                    <ChevronLeft
                                        className="w-3.5 h-3.5 cursor-pointer hover:text-rose-400 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentPhotoIndex(prev => (prev === 0 ? allPhotos.length - 1 : prev - 1));
                                        }}
                                    />
                                    <span>{currentPhotoIndex + 1} of {allPhotos.length}</span>
                                    <ChevronRight
                                        className="w-3.5 h-3.5 cursor-pointer hover:text-rose-400 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentPhotoIndex(prev => (prev === allPhotos.length - 1 ? 0 : prev + 1));
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Middle: Info */}
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center justify-between w-full mb-1">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        {displayName} 
                                        {isLocked ? (
                                            <Lock className="w-3.5 h-3.5 text-rose-500 opacity-60" />
                                        ) : isPremium ? (
                                            <div className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded font-bold border border-amber-200 flex items-center gap-1">
                                                <Star className="w-2.5 h-2.5 fill-amber-500" /> Premium
                                            </div>
                                        ) : null}
                                        <span className="bg-green-100 text-green-600 text-[10px] px-1.5 py-0.5 rounded font-bold">2-Way</span>
                                    </h3>
                                    <div className="relative" ref={dropdownRef}>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-400 cursor-pointer transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        />

                                        <AnimatePresence>
                                            {isDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    className="absolute right-0 mt-2 w-48 bg-theme-surface rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                                                >
                                                    <button
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors text-left font-normal"
                                                        onClick={() => {
                                                            setIsDropdownOpen(false);
                                                            if (isShortlisted) {
                                                                if (onRemoveShortlist) onRemoveShortlist();
                                                            } else {
                                                                if (onShortlist) onShortlist();
                                                            }
                                                        }}
                                                    >
                                                        <Star className={`w-4 h-4 ${isShortlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                                                        {isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                                                    </button>
                                                    <button
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left font-normal"
                                                        onClick={() => {
                                                            setIsDropdownOpen(false);
                                                            if (onReport) onReport();
                                                        }}
                                                    >
                                                        <Flag className="w-4 h-4" />
                                                        Report User
                                                    </button>
                                                    <div className="h-px bg-gray-100 my-1 mx-2"></div>
                                                    <button
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors text-left font-normal"
                                                        onClick={() => {
                                                            setIsDropdownOpen(false);
                                                            // Add block logic here
                                                        }}
                                                    >
                                                        <Ban className="w-4 h-4" />
                                                        Block User
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 md:gap-6 text-[13px] mt-1.5 text-theme-text-secondary">
                                    <span className="flex items-center gap-2 cursor-pointer hover:text-rose-500 transition-colors whitespace-nowrap">
                                        <MessageCircle className="w-4 h-4 text-green-500" /> Online {profile.updatedAt ? 'recently' : '20h ago'}
                                    </span>
                                    <span className="flex items-center gap-2 cursor-pointer hover:text-rose-500 transition-colors whitespace-nowrap">
                                        <Users className="w-4 h-4 text-rose-400" /> You & {profile.gender?.toLowerCase() === 'male' ? 'Him' : 'Her'}
                                    </span>
                                    <span className="flex items-center gap-2 cursor-pointer hover:text-rose-500 transition-colors whitespace-nowrap">
                                        <Star className="w-4 h-4 text-amber-500" /> Astro
                                    </span>
                                </div>
                            </div>
                            <div className="border-l border-gray-100 ml-6 pl-6 min-w-[150px]">
                                <div className="flex flex-col items-center">
                                    <div className="w-full space-y-2 text-center">
                                        <p className="text-[11px] text-theme-text-secondary italic mb-2">
                                            <span 
                                                onClick={() => navigate('/payment')}
                                                className="text-blue-500 font-bold cursor-pointer hover:underline"
                                            >
                                                Upgrade
                                            </span> to<br />Contact her directly
                                        </p>
                                        <button
                                            onClick={() => {
                                                if (!requestSent && onConnect) {
                                                    onConnect();
                                                }
                                            }}
                                            disabled={requestSent}
                                            className={`w-full py-2 px-3 rounded-full text-[13px] font-bold text-white flex items-center justify-center gap-2 shadow-md transition-all ${requestSent ? 'bg-pink-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700 shadow-pink-100 hover:shadow-lg'}`}
                                        >
                                            {requestSent ? (<><CheckCircle className="w-4 h-4" /> Request Sent</>) : 'Connect Now'}
                                        </button>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { if (onCall) onCall(); }}
                                                className="flex-1 py-1.5 px-3 border border-theme-border rounded-full text-[12px] font-bold text-blue-500 flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
                                            >
                                                <Phone className="w-3.5 h-3.5" /> Call
                                            </button>
                                            <button
                                                onClick={() => { if (onWhatsApp) onWhatsApp(); }}
                                                className="flex-1 py-1.5 px-3 border border-theme-border rounded-full text-[12px] font-bold text-green-500 hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                                            </button>
                                        </div>
                                        {onChat && (
                                            <button
                                                onClick={() => onChat()}
                                                className="w-full py-1.5 px-3 border border-theme-border rounded-full text-[12px] font-bold text-blue-400 hover:bg-blue-50 flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <MessageCircle className="w-3.5 h-3.5" /> LovenZea Chat
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="my-4 border-gray-100" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2.5 text-[14px]">
                            <div className="space-y-2">
                                <p className="text-theme-text-secondary">{profile.age} yrs, {profile.height}, {profile.rashi || 'Libra'}</p>
                                <p className="text-theme-text-secondary">{profile.motherTongue}</p>
                                <p className="text-theme-text-secondary">{profile.religion}, {profile.caste}{profile.subCaste ? `: ${profile.subCaste}` : ''}</p>
                                <p className="text-theme-text-secondary">{profile.education}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-theme-text-secondary">{profile.maritalStatus}</p>
                                <p className="text-theme-text-secondary">{profile.state || 'Maharashtra'}</p>
                                <p className="text-theme-text-secondary">{profile.profession}</p>
                                <p className="text-theme-text-secondary">Earns {profile.income}</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-50">
                            {requestSent ? (
                                <p className="text-[13px] text-pink-600 font-medium">
                                    Invitation sent. {profile.gender === 'male' ? 'He' : 'She'} hasn't viewed it yet.
                                </p>
                            ) : (
                                <p className="text-[13px] text-gray-400">
                                    Send an invitation to connect with {profile.gender === 'male' ? 'him' : 'her'}.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sub-Tabs Area */}
                <div className="border-t border-gray-100 px-6 flex items-center justify-between mt-2">
                    <div className="flex">
                        <button
                            onClick={() => setSubTab('detailed')}
                            className={`px-4 py-3 text-[13px] font-bold border-b-2 transition-all
                                ${subTab === 'detailed' ? 'border-rose-500 text-rose-500' : 'border-transparent text-theme-text-secondary'}`}
                        >
                            Detailed Profile
                        </button>
                        <button
                            onClick={() => setSubTab('preferences')}
                            className={`px-4 py-3 text-[13px] font-bold border-b-2 transition-all
                                ${subTab === 'preferences' ? 'border-rose-500 text-rose-500' : 'border-transparent text-theme-text-secondary'}`}
                        >
                            Partner Preferences
                        </button>
                    </div>
                    <div className="flex gap-4 text-gray-400">
                        <Share2 className="w-5 h-5 cursor-pointer hover:text-theme-text-secondary" />
                        <Printer className="w-5 h-5 cursor-pointer hover:text-theme-text-secondary" />
                    </div>
                </div>
            </div>

            {/* Sub-Contents Area */}
            <div className="bg-theme-surface border border-theme-border rounded-lg shadow-sm p-4 sm:p-8 md:p-10 mb-10">
                <AnimatePresence mode="wait">
                    {subTab === 'detailed' ? (
                        <motion.div
                            key="detailed"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="space-y-12"
                        >
                            {/* About Section */}
                            <SectionLayout icon={<Users className="w-5 h-5 text-gray-400" />} title={`About ${displayName.split(' ')[0]}`}>
                                <div className="flex gap-3 mb-4">
                                    <div className="flex items-center gap-2 text-[11px] text-theme-text-secondary border border-theme-border rounded px-2 py-0.5">
                                        ID: {String(profile.profileId || profile.id).toUpperCase().replace('-', '')} <Copy className="w-3 h-3 hover:text-rose-500 cursor-pointer" />
                                    </div>
                                    <div className="text-[11px] text-theme-text-secondary border border-theme-border rounded px-2 py-0.5">
                                        Profile Managed By {profile.profileCreatedBy || 'Self'}
                                    </div>
                                </div>
                                <p className="text-[14px] leading-relaxed text-theme-text-secondary">
                                    {profile.bio || "Thank you for visiting my profile. I have completed my education and currently working professionally. I am looking for a suitable partner who is understanding and has similar values."}
                                </p>
                            </SectionLayout>

                            {/* Hobbies & Interests */}
                            <SectionLayout icon={<Star className="w-5 h-5 text-gray-400" />} title="Hobbies & Interests">
                                <div className="flex flex-wrap gap-2">
                                    {(profile.hobbies || "").split(',').filter(h => h.trim() !== "").map((hobby, idx) => (
                                        <div key={idx} className="flex items-center gap-2 border border-theme-border rounded-full px-4 py-1.5 text-[13px] text-gray-700 bg-gray-50/50">
                                            <Circle className="w-1.5 h-1.5 fill-rose-400 text-rose-400" />
                                            {hobby.trim()}
                                        </div>
                                    ))}
                                </div>
                            </SectionLayout>

                            {/* Contact Details */}
                            <SectionLayout icon={<Smartphone className="w-5 h-5 text-gray-400" />} title="Contact Details">
                                <div className="bg-amber-50 border border-amber-100 p-5 rounded relative overflow-hidden group">
                                    <div className="opacity-30 blur-[2px] space-y-2">
                                        <p className="flex items-center gap-3 text-[13px] font-medium text-amber-900 font-serif">
                                            Contact Number: +91 7XXXXXXXXX
                                        </p>
                                        <p className="flex items-center gap-3 text-[13px] font-medium text-amber-900 font-serif">
                                            Email ID: XXXXXXXXXX@gmail.com
                                        </p>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center gap-3">
                                        <div className="bg-theme-surface p-1.5 rounded-full shadow-sm">
                                            <Lock className="w-4 h-4 text-rose-500" />
                                        </div>
                                        <p className="text-[13px] text-gray-800">
                                            <span 
                                                onClick={() => navigate('/payment')}
                                                className="text-blue-500 font-bold hover:underline cursor-pointer"
                                            >
                                                Upgrade Now
                                            </span> to view details.
                                        </p>
                                    </div>
                                </div>
                            </SectionLayout>

                            {/* Lifestyle */}
                            <SectionLayout icon={<Info className="w-5 h-5 text-gray-400" />} title="Lifestyle">
                                <div className="border border-gray-100 rounded-lg p-3 w-[100px] flex flex-col items-center gap-2">
                                    <div className="text-green-500">
                                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <span className="text-[12px] font-medium text-theme-text-secondary">Vegetarian</span>
                                </div>
                            </SectionLayout>

                            {/* Background */}
                            <SectionLayout icon={<Home className="w-5 h-5 text-gray-400" />} title="Background">
                                <div className="space-y-3.5 text-[14px] text-theme-text-secondary">
                                    <p className="flex items-center gap-3 font-medium"><Users className="w-4 h-4 text-blue-300" /> {profile.religion}, {profile.motherTongue}</p>
                                    <p className="flex items-center gap-3 font-medium"><Users className="w-4 h-4 text-blue-300" /> {profile.caste}{profile.subCaste ? `, ${profile.subCaste}` : ''}</p>
                                    <p className="flex items-center gap-3 font-medium"><MapPin className="w-4 h-4 text-rose-400" /> Lives in {profile.location}</p>
                                    {profile.grewUpIn && (
                                        <p className="flex items-center gap-3 font-medium"><MapPin className="w-4 h-4 text-gray-400" /> Grew up in {profile.grewUpIn}</p>
                                    )}
                                </div>
                            </SectionLayout>

                            {/* Horoscope Details */}
                            <SectionLayout icon={<Star className="w-5 h-5 text-gray-400" />} title="Horoscope Details">
                                <div className="bg-[#fff9e6] border border-[#ffe082] border-dashed rounded-lg p-8 flex flex-col items-center text-center">
                                    <div className="text-amber-200 mb-3">
                                        <ExternalLink className="w-10 h-10" />
                                    </div>
                                    <p className="text-[13px] text-theme-text-secondary mb-2">For the common interest of members, quickly enter your horoscope details & unhide her info.</p>
                                    <button className="text-blue-500 font-bold text-[13px] hover:underline">Add My Details »</button>
                                </div>
                            </SectionLayout>

                            {/* Family Details */}
                            <SectionLayout icon={<Home className="w-5 h-5 text-gray-400" />} title="Family Details">
                                <div className="space-y-4 text-[14px] text-theme-text-secondary">
                                    <div className="flex items-start gap-3">
                                        <Users className="w-4 h-4 text-blue-300 mt-0.5" />
                                        <div>
                                            <p>Father {profile.fatherStatus || 'runs a business'},</p>
                                            <p>Mother {profile.motherStatus || 'is a homemaker'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="w-4 h-4 text-orange-300" />
                                        <p>{profile.brothersCount || 1} Brother, {profile.sistersCount || 2} Sisters</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-rose-400" />
                                        <p>{profile.familyLocation || 'Ahmednagar, Maharashtra, India'}</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="bg-green-100 p-0.5 rounded mt-0.5"><Lock className="w-3 h-3 text-green-600" /></div>
                                        <div>
                                            <p className="font-bold text-gray-800">Family Financial Status</p>
                                            <p><span className="font-bold">{profile.familyFinancialStatus || 'Aspiring'}</span> - Annual family income is up to 10 lakhs</p>
                                        </div>
                                    </div>
                                </div>
                            </SectionLayout>

                            {/* Education & Career */}
                            <SectionLayout icon={<GraduationCap className="w-5 h-5 text-gray-400" />} title="Education & Career">
                                <div className="space-y-4 text-[14px] text-gray-700">
                                    <p className="flex items-center gap-3"><GraduationCap className="w-4 h-4 text-blue-500/70" /> {profile.education} {profile.educationField ? `- ${profile.educationField}` : ''}</p>
                                    {profile.college && (
                                        <p className="flex items-center gap-3"><Home className="w-4 h-4 text-gray-400" /> {profile.college}</p>
                                    )}
                                    <p className="flex items-center gap-3"><Briefcase className="w-4 h-4 text-blue-500/70" /> {profile.profession} {profile.company ? `at ${profile.company}` : ''}</p>
                                    <p className="flex items-start gap-3">
                                        <span className="bg-green-100 p-0.5 rounded mt-0.5"><Lock className="w-3 h-3 text-green-600" /></span>
                                        <span>Earns {profile.income}</span>
                                    </p>
                                </div>
                            </SectionLayout>

                            {/* What She Is Looking For */}
                            <SectionLayout icon={<HeartHandshake className="w-5 h-5 text-gray-400" />} title="What She Is Looking For">
                                <div className="flex flex-col items-center mb-10 w-full">
                                    <div className="flex items-center gap-8 md:gap-16 justify-center w-full px-4">
                                        <div className="text-center">
                                            <div className="w-16 h-16 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden mx-auto">
                                                {profile.img ? (
                                                    <img src={profile.img} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Users className="w-8 h-8 text-gray-300" />
                                                )}
                                            </div>
                                            <p className="text-[10px] mt-1 font-bold text-gray-400 uppercase">Her Preferences</p>
                                        </div>
                                        <div className="relative flex-1 max-w-[200px] border-b border-dashed border-gray-300 pb-1 text-center hidden sm:block">
                                            <span className="text-[11px] bg-gray-100 px-3 py-1 rounded-full text-theme-text-secondary font-medium">
                                                You match {matchCount}/{totalCount} ({matchPercentage}%)
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-16 h-16 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden mx-auto">
                                                {myProfile?.profilePhotoUrl ? (
                                                    <img src={myProfile.profilePhotoUrl} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Users className="w-8 h-8 text-gray-300" />
                                                )}
                                            </div>
                                            <p className="text-[10px] mt-1 font-bold text-gray-400 uppercase">You match</p>
                                        </div>
                                    </div>
                                </div>

                                                <div className="space-y-4 px-2">
                                                    {preferences.map((item, i) => (
                                                        <div key={i} className="flex justify-between items-center text-[13px] border-b border-gray-50 pb-2">
                                                            <div className="w-[200px]">
                                                                <span className="text-pink-400 block text-[11px] font-bold tracking-tight uppercase mb-0.5">{item.fieldLabel}</span>
                                                                <span className="text-gray-700 font-medium leading-tight">{item.prefValue}</span>
                                                            </div>
                                                            <div className="flex-1 flex justify-end pr-10">
                                                                {item.isMatch ? (
                                                                    <div className="w-5 h-5 bg-theme-success rounded-full flex items-center justify-center">
                                                                        <Check className="w-3 h-3 text-white" strokeWidth={4} />
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-gray-300 font-light text-lg">—</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                            </SectionLayout>

                            <div className="text-center pt-8 border-t border-gray-50">
                                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-blue-500 text-[13px] font-bold hover:underline">
                                    Back to Top ↑
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        /* Preferences Tab Content (Simpler version for Today Match) */
                        <motion.div
                            key="preferences"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="max-w-2xl mx-auto py-4"
                        >
                            <div className="text-center mb-10">
                                <h2 className="text-[20px] font-bold text-gray-800">Her Partner Preferences</h2>
                                <p className="text-[14px] text-theme-text-secondary">Based on your Profile</p>
                            </div>
                            <div className="space-y-1">
                                {preferences.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 px-2">
                                        <div className="w-1/3 text-[14px] font-medium text-theme-text-secondary uppercase">{item.fieldLabel}</div>
                                        <div className="w-1/2 text-[14px] font-bold text-gray-800">{item.prefValue}</div>
                                        <div>
                                            {item.isMatch ? (
                                                <div className="w-5 h-5 bg-theme-success rounded-full flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" strokeWidth={4} />
                                                </div>
                                            ) : (
                                                <div className="text-gray-300 font-light text-lg">—</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const SectionLayout = ({ icon, title, children }) => (
    <div className="relative pl-10 md:pl-12">
        <div className="absolute left-0 top-0 w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center bg-theme-surface z-10 shadow-sm">
            {icon}
        </div>
        <div className="absolute left-5 top-10 bottom-[-48px] w-px bg-gray-100 z-0"></div>
        <h3 className="text-[16px] font-bold text-rose-500 mb-6 flex items-center gap-4">
            {title}
            <div className="h-px bg-gray-100 flex-1"></div>
        </h3>
        <div className="pb-4">{children}</div>
    </div>
);

export default TodayMatchView;
