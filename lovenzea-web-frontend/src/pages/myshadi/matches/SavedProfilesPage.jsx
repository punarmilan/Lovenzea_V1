import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, User, MapPin, Globe, MessageCircle, Activity, ExternalLink, ShieldCheck, Zap, Crown, ThumbsDown } from 'lucide-react';
import { fetchSentRequests, fetchShortlist, sendConnectionRequest, withdrawConnectionRequest, addToShortlistServer, removeFromShortlistServer } from '../../../Slice/MatchSlice';
import { openChatWith } from '../../../Slice/ChatSlice';
import { useNavigate } from 'react-router-dom';
import { formatDisplayName } from '../../../utils/mockData';
import toast from 'react-hot-toast';
import MyShadiLayout from '../../../layouts/MyShadiLayout';

const SavedProfilesPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('liked'); // 'liked' or 'shortlisted'

    const { sentRequests, shortlistedProfiles, loading } = useSelector((state) => state.match);

    useEffect(() => {
        if (activeTab === 'liked') {
            dispatch(fetchSentRequests());
        } else {
            dispatch(fetchShortlist());
        }
    }, [dispatch, activeTab]);

    const getFormattedMatches = (list) => {
        if (!list || list.length === 0) return [];
        return list.map(m => {
            // Depending on the API, the user object might be nested or direct
            const profile = m.receiverProfile || m; 
            return {
                id: profile.userId || profile.id,
                name: formatDisplayName(profile.fullName, profile.displayNameVisibility, profile.id) || "Unknown Profile",
                age: profile.age || 25,
                height: profile.height || "5'4\"",
                maritalStatus: profile.maritalStatus || "Never Married",
                religion: profile.religion ? `${profile.religion}${profile.caste ? `, ${profile.caste}` : ''}` : "Hindu",
                city: profile.city ? `${profile.city}${profile.state ? `, ${profile.state}` : ''}` : "India",
                language: profile.motherTongue || "Hindi",
                profession: profile.occupation || "Not specified",
                bio: profile.aboutMe || "I am simple, loving and career oriented person.",
                image: profile.profilePhotoUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80",
                online: profile.isOnline,
                matchScore: Math.floor(Math.random() * (99 - 80 + 1) + 80),
            };
        });
    };

    const displayProfiles = activeTab === 'liked' ? getFormattedMatches(sentRequests) : getFormattedMatches(shortlistedProfiles);

    return (
        <MyShadiLayout>
            <div className="w-full min-h-screen bg-transparent p-4 sm:p-8 font-sans">
                <div className="max-w-[1200px] mx-auto">
                    
                    {/* Header Section */}
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-theme-pinkxl font-black text-gray-900 tracking-tight">Saved Profiles</h1>
                            <p className="text-sm text-theme-text-secondary mt-1 font-medium">Keep track of profiles you've interacted with.</p>
                        </div>
                    </div>

                    {/* Modern Tabs */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-8">
                        <button
                            onClick={() => setActiveTab('liked')}
                            className={`flex-1 py-3 px-6 rounded-full font-bold text-[13px] transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'liked'
                                    ? 'bg-[#FFF9E6]/80 backdrop-blur-sm text-theme-pink border border-[#F2E5B8] shadow-sm'
                                    : 'bg-theme-surface text-theme-text-secondary border border-theme-border hover:bg-gray-50'
                            }`}
                        >
                            <Heart size={16} className={activeTab === 'liked' ? 'fill-[#D4AF37]' : ''} />
                            Liked Profiles
                        </button>
                        <button
                            onClick={() => setActiveTab('shortlisted')}
                            className={`flex-1 py-3 px-6 rounded-full font-bold text-[13px] transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'shortlisted'
                                    ? 'bg-[#FFF9E6]/80 backdrop-blur-sm text-theme-pink border border-[#F2E5B8] shadow-sm'
                                    : 'bg-theme-surface text-theme-text-secondary border border-theme-border hover:bg-gray-50'
                            }`}
                        >
                            <Star size={16} className={activeTab === 'shortlisted' ? 'fill-[#D4AF37]' : ''} />
                            Shortlisted Profiles
                        </button>
                    </div>

                    {/* Profiles List */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {loading ? (
                            <div className="text-center py-20 text-gray-400 font-semibold animate-pulse">Loading profiles...</div>
                        ) : displayProfiles.length === 0 ? (
                            <div className="dashboard-card-bg rounded-[32px] p-12 text-center border border-white/50 flex flex-col items-center">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${activeTab === 'liked' ? 'bg-pink-50 text-pink-500' : 'bg-indigo-50 text-indigo-500'}`}>
                                    {activeTab === 'liked' ? <Heart size={32} /> : <Star size={32} />}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Profiles Found</h3>
                                <p className="text-theme-text-secondary text-sm">You haven't {activeTab === 'liked' ? 'liked' : 'shortlisted'} any profiles yet.</p>
                            </div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {displayProfiles.map((match, index) => (
                                    <motion.div
                                        key={match.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        onClick={() => navigate(`/matches/${match.id}`)}
                                        className="bg-theme-surface rounded-[32px] p-5 border border-white/60 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer"
                                    >
                                        <div className="flex flex-col sm:flex-row gap-5">
                                            {/* Left: Image Container */}
                                            <div className="w-full sm:w-[160px] h-[220px] sm:h-auto rounded-[20px] border border-white/40 shadow-sm overflow-hidden relative flex-shrink-0">
                                                <img 
                                                    src={match.image} 
                                                    alt={match.name} 
                                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/70 to-transparent">
                                                    <div className="bg-theme-surface/90 backdrop-blur-sm w-fit px-2 py-0.5 rounded-full text-[10px] font-black text-gray-800 flex items-center gap-1 shadow-sm">
                                                        <Activity size={12} className="text-green-500" /> {match.matchScore}%
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Right: Details Container */}
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-1.5">
                                                            <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none">{match.name}</h2>
                                                            <ShieldCheck size={16} className="text-blue-500" />
                                                        </div>
                                                        {match.online && (
                                                            <span className="bg-green-100 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                                <Zap size={10} /> Online
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Compact Details Grid */}
                                                    <div className="grid grid-cols-2 gap-y-2 gap-x-2 mb-3 mt-2">
                                                        <div className="flex items-center gap-1.5 text-[11px] text-theme-text-secondary font-medium">
                                                            <User size={12} className="text-gray-400" /> {match.age} Yrs, {match.height}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[11px] text-theme-text-secondary font-medium">
                                                            <Heart size={12} className="text-gray-400" /> {match.maritalStatus}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[11px] text-theme-text-secondary font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                                            <MapPin size={12} className="text-gray-400" /> {match.city}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[11px] text-theme-text-secondary font-medium">
                                                            <Globe size={12} className="text-gray-400" /> {match.religion}
                                                        </div>
                                                    </div>
                                                    
                                                    <p className="text-[12px] text-theme-text-secondary leading-snug mb-4 line-clamp-2 pr-2">
                                                        {match.bio} <span className="text-theme-pink font-semibold cursor-pointer">... More</span>
                                                    </p>
                                                </div>
                                                
                                                {/* Bottom Section: Pills and Actions */}
                                                <div className="flex flex-col gap-3 mt-auto">
                                                    <div className="flex flex-wrap gap-2">
                                                        {match.online && (
                                                            <span className="bg-green-50 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-green-100">
                                                                <Zap size={10} /> Online
                                                            </span>
                                                        )}
                                                        <span className="bg-[#FFF9E6]/80 backdrop-blur-sm text-theme-pink text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-[#F2E5B8]">
                                                            <Crown size={10} /> Premium
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Buttons Grid */}
                                                    <div className="grid grid-cols-2 gap-2 w-full">
                                                        {activeTab === 'shortlisted' && (
                                                            <>
                                                                <button onClick={(e) => { 
                                                                    e.stopPropagation(); 
                                                                    const isLiked = sentRequests?.some(r => r.receiverProfileId === match.id || r.receiverId === match.id);
                                                                    if (isLiked) {
                                                                        dispatch(withdrawConnectionRequest(match.id)).unwrap().then(() => toast.success('Like removed!')).catch(err => toast.error(err.message || 'Failed to remove like'));
                                                                    } else {
                                                                        dispatch(sendConnectionRequest(match.id)).unwrap().then(() => toast.success('Profile Liked!')).catch(err => toast.error(err.message || 'Failed to like profile'));
                                                                    }
                                                                }} className={`py-2 text-[11px] border border-[#C5A059] font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 w-full col-span-1 ${sentRequests?.some(r => r.receiverProfileId === match.id || r.receiverId === match.id) ? 'bg-gradient-to-r from-theme-primary to-theme-pink text-white hover:opacity-90' : 'bg-theme-surface/40 backdrop-blur-sm hover:bg-theme-surface/60 text-theme-pink'}`}>
                                                                    <Heart size={14} className={sentRequests?.some(r => r.receiverProfileId === match.id || r.receiverId === match.id) ? 'text-white fill-white' : 'text-theme-pink'} /> {sentRequests?.some(r => r.receiverProfileId === match.id || r.receiverId === match.id) ? 'Liked' : 'Like'}
                                                                </button>
                                                                <button onClick={(e) => { 
                                                                    e.stopPropagation(); 
                                                                    dispatch(removeFromShortlistServer(match.id)).unwrap().then(() => toast.success('Removed from Shortlist!')).catch(err => toast.error(err.message || 'Failed to remove'));
                                                                }} className="py-2 bg-theme-surface/40 backdrop-blur-sm border border-rose-200 hover:bg-theme-surface/60 text-rose-500 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 w-full col-span-1">
                                                                    <ThumbsDown size={14} /> Dislike
                                                                </button>
                                                            </>
                                                        )}
                                                        
                                                        {activeTab === 'liked' && (
                                                            <>
                                                                <button onClick={(e) => { 
                                                                    e.stopPropagation();
                                                                    const isShortlisted = shortlistedProfiles?.some(p => p.id === match.id || p.userId === match.id);
                                                                    if (isShortlisted) {
                                                                        dispatch(removeFromShortlistServer(match.id)).unwrap().then(() => toast.success('Removed from shortlist!')).catch(err => toast.error(err.message || 'Failed to remove'));
                                                                    } else {
                                                                        dispatch(addToShortlistServer(match)).unwrap().then(() => toast.success('Profile Shortlisted!')).catch(err => toast.error(err.message || 'Failed to shortlist profile'));
                                                                    }
                                                                }} className={`py-2 text-[11px] border border-[#C5A059] font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 w-full col-span-1 ${shortlistedProfiles?.some(p => p.id === match.id || p.userId === match.id) ? 'bg-gradient-to-r from-theme-primary to-theme-pink text-white hover:opacity-90' : 'bg-theme-surface/40 backdrop-blur-sm hover:bg-theme-surface/60 text-theme-pink'}`}>
                                                                    <Star size={14} className={shortlistedProfiles?.some(p => p.id === match.id || p.userId === match.id) ? 'text-white fill-white' : 'text-theme-pink'} /> {shortlistedProfiles?.some(p => p.id === match.id || p.userId === match.id) ? 'Shortlisted' : 'Shortlist'}
                                                                </button>
                                                                <button onClick={(e) => { 
                                                                    e.stopPropagation(); 
                                                                    dispatch(withdrawConnectionRequest(match.id)).unwrap().then(() => toast.success('Removed from Liked profiles!')).catch(err => toast.error(err.message || 'Failed to remove like'));
                                                                }} className="py-2 bg-theme-surface/40 backdrop-blur-sm border border-rose-200 hover:bg-theme-surface/60 text-rose-500 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 w-full col-span-1">
                                                                    <ThumbsDown size={14} /> Dislike
                                                                </button>
                                                            </>
                                                        )}
                                                        
                                                        <button onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            navigate('/my-shadi/chats', {
                                                                state: {
                                                                    openChatUser: {
                                                                        id: match.id,
                                                                        fullName: match.name,
                                                                        profilePhotoUrl: match.image
                                                                    }
                                                                }
                                                            });
                                                        }} className="py-2.5 bg-theme-surface/40 backdrop-blur-sm border border-theme-border hover:bg-theme-surface/80 text-gray-700 text-[11px] font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 w-full col-span-1">
                                                            <MessageCircle size={14} className="text-gray-400" /> Message
                                                        </button>
                                                        
                                                        <button onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            const isLiked = sentRequests?.some(r => r.receiverProfileId === match.id || r.receiverId === match.id);
                                                            if (isLiked) {
                                                                toast('Request already sent', { icon: 'ℹ️' });
                                                            } else {
                                                                dispatch(sendConnectionRequest(match.id)).unwrap().then(() => toast.success('Connection Request Sent!')).catch(err => toast.error(err.message || 'Failed to send request'));
                                                            }
                                                        }} className={`py-2.5 bg-gradient-to-r from-theme-primary to-theme-pink hover:from-[#b59049] hover:to-[#7c5d29] text-white text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md w-full col-span-1 ${sentRequests?.some(r => r.receiverProfileId === match.id || r.receiverId === match.id) ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                                            <MessageCircle size={14} className="text-white fill-white" /> Connect
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>
        </MyShadiLayout>
    );
};

export default SavedProfilesPage;
