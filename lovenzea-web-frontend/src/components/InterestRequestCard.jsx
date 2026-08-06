import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Check, MoreHorizontal } from 'lucide-react';
import noInterestDataImg from '../assets/image/no_interest_data.svg';
import {
  fetchReceivedRequests,
  fetchAcceptedByMe,
  fetchAcceptedByHer,
  fetchDeclinedByMe,
  fetchDeclinedByThem,
  acceptConnectionRequest,
  declineConnectionRequest
} from '../Slice/MatchSlice';

const tabs = [
  { id: "new", label: "New Requests", icon: <Heart size={14} className="fill-current" /> },
  { id: "accept", label: "Accepted", icon: <Check size={14} /> },
  { id: "deny", label: "Declined", icon: <X size={14} /> }
];

const InterestRequestCard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("new");

    const { 
        receivedRequests, 
        acceptedByMe, 
        acceptedByHer, 
        declinedByMe, 
        declinedByThem,
        loading 
    } = useSelector((state) => state.match);

    useEffect(() => {
        dispatch(fetchReceivedRequests());
        dispatch(fetchAcceptedByMe());
        dispatch(fetchAcceptedByHer());
        dispatch(fetchDeclinedByMe());
        dispatch(fetchDeclinedByThem());
    }, [dispatch]);

    const mapRequest = (req, isSent) => {
        const profile = isSent ? req.receiverProfile : req.senderProfile;
        if (!profile) return null;
        return {
            id: req.id,
            profileId: profile.userId,
            name: profile.fullName,
            city: profile.city || "N/A",
            age: profile.age || "N/A",
            height: profile.height || "N/A",
            job: profile.occupation || "N/A",
            date: new Date(req.createdAt).toLocaleDateString(),
            badge: profile.isPremium ? "PREMIUM" : (profile.verificationStatus === "VERIFIED" ? "VERIFIED" : null),
            image: profile.profilePhotoUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60"
        };
    };

    const getRequests = () => {
        if (activeTab === "new") {
            return (receivedRequests || []).map(r => mapRequest(r, false)).filter(Boolean);
        } else if (activeTab === "accept") {
            return [
                ...(acceptedByMe || []).map(r => mapRequest(r, false)),
                ...(acceptedByHer || []).map(r => mapRequest(r, true))
            ].filter(Boolean);
        } else if (activeTab === "deny") {
            return [
                ...(declinedByMe || []).map(r => mapRequest(r, false)),
                ...(declinedByThem || []).map(r => mapRequest(r, true))
            ].filter(Boolean);
        }
        return [];
    };

    const requests = getRequests();

    const handleAccept = (id) => {
        dispatch(acceptConnectionRequest(id)).then(() => {
            dispatch(fetchReceivedRequests());
            dispatch(fetchAcceptedByMe());
        });
    };

    const handleDecline = (id) => {
        dispatch(declineConnectionRequest(id)).then(() => {
            dispatch(fetchReceivedRequests());
            dispatch(fetchDeclinedByMe());
        });
    };

    const getBadgeCount = (tabId) => {
        if (tabId === "new") return (receivedRequests || []).length;
        if (tabId === "accept") return (acceptedByMe || []).length + (acceptedByHer || []).length;
        if (tabId === "deny") return (declinedByMe || []).length + (declinedByThem || []).length;
        return 0;
    };

    return (
        <div className="w-full bg-white/80 backdrop-blur-md border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] p-6 sm:p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF8F5] flex items-center justify-center border border-[#F8D6CB] shadow-sm">
                        <Heart className="w-5 h-5 fill-[#B54768] text-[#B54768]" />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#B54768] tracking-tight">Interest Requests</h2>
                        <p className="text-[11px] text-theme-text-secondary font-medium uppercase tracking-wider">Manage your connections</p>
                    </div>
                </div>
                
                {location.pathname !== '/inbox' && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/inbox')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-theme-text-secondary hover:text-gray-800 text-xs font-semibold transition-all duration-200 border border-theme-border"
                        >
                            <span>See All</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Modern Pill Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-8 bg-[#FFF8F5] p-2 rounded-[20px] border border-white shadow-inner w-max max-w-full overflow-x-auto">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const count = getBadgeCount(tab.id);
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                                isActive 
                                    ? "bg-gradient-to-r from-[#B54768] to-[#E88C8C] text-white shadow-lg scale-105" 
                                    : "text-gray-500 hover:text-[#B54768] hover:bg-white hover:shadow-sm"
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                            {count > 0 && (
                                <span className="ml-1 bg-white text-[#B54768] font-black text-[9px] shadow-sm px-1.5 py-0.5 rounded-full">
                                    {count}
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Content List */}
            <div className="space-y-4 min-h-[200px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-2">
                        <div className="w-8 h-8 rounded-full border-4 border-theme-border border-t-[#B54768] animate-spin" />
                        <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">Loading requests...</span>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {requests.length > 0 ? (
                            requests.map((req, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    key={req.id}
                                    className="group relative flex flex-col xl:flex-row items-center justify-between gap-4 p-4 bg-[#FFF8F5] rounded-[24px] border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex-wrap overflow-hidden p-5"
                                >
                                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                                        {/* User Image with Badge */}
                                        <div className="relative flex-shrink-0 cursor-pointer" onClick={() => navigate(`/matches/${req.profileId}`)}>
                                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-[#F8D6CB]/60 group-hover:ring-[#E88C8C]/60 transition-all duration-300">
                                                <img src={req.image} alt={req.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            {req.badge && (
                                                <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-white text-[8px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md border border-white z-10 uppercase tracking-widest ${req.badge === 'VERIFIED' ? 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-md' : 'bg-gradient-to-r from-[#B54768] to-[#E88C8C] shadow-md'}`}>
                                                    {req.badge}
                                                </span>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="text-center sm:text-left pt-2 sm:pt-0">
                                            <h3 
                                                className="font-bold text-base text-theme-text cursor-pointer hover:text-[#B54768] transition-colors"
                                                onClick={() => navigate(`/matches/${req.profileId}`)}
                                            >
                                                {req.name}
                                            </h3>
                                            <p className="text-xs text-theme-text-secondary mt-1 font-medium">
                                                {req.age} yrs <span className="opacity-50 mx-1">•</span> {req.height} <span className="opacity-50 mx-1">•</span> {req.job}
                                            </p>
                                            <div className="flex items-center justify-center sm:justify-start gap-1 mt-1 text-xs text-gray-400">
                                                <svg className="w-3 h-3 text-[#E88C8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Located in {req.city}
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-2 flex items-center justify-center sm:justify-start gap-1 bg-gray-50 w-max mx-auto sm:mx-0 px-2 py-0.5 rounded text-theme-text-secondary">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Received: {req.date}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap items-center justify-center gap-3 w-full xl:w-auto mt-2 xl:mt-0">
                                        <button 
                                            onClick={() => navigate(`/matches/${req.profileId}`)}
                                            className="px-4 py-2 border border-theme-border bg-white hover:bg-[#FFF8F5] border-[#F8D6CB] hover:border-[#E88C8C] text-[#B54768] text-xs font-bold rounded-full shadow-sm hover:shadow transition-all duration-200"
                                        >
                                            View Profile
                                        </button>
                                        {activeTab === "new" && (
                                            <>
                                                <button 
                                                    onClick={() => handleAccept(req.id)}
                                                    className="px-5 py-2 bg-gradient-to-r from-[#B54768] to-[#E88C8C] hover:from-[#E88C8C] hover:to-[#B54768] text-white border border-transparent text-xs font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1"
                                                >
                                                    <Check size={14} strokeWidth={3} /> Accept
                                                </button>
                                                <button 
                                                    onClick={() => handleDecline(req.id)}
                                                    className="px-5 py-2 border border-gray-200 bg-white text-gray-500 hover:border-[#E88C8C] hover:text-[#B54768] hover:bg-[#FFF8F5] text-xs font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1"
                                                >
                                                    <X size={14} strokeWidth={3} /> Decline
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-16 text-center"
                            >
                                <img 
                                    src={noInterestDataImg} 
                                    alt="No Requests" 
                                    className="w-48 h-48 md:w-56 md:h-56 object-contain mx-auto mb-4" 
                                />
                                <h4 className="text-base font-bold text-[#E86D8A] mb-1 font-serif">No Requests Found</h4>
                                <p className="text-xs text-[#7A6666] max-w-[280px]">You don't have any {activeTab} requests at the moment. Keep exploring profiles!</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default InterestRequestCard;
