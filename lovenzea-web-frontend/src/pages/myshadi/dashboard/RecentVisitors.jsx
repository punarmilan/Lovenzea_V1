import React, { useEffect } from 'react';
import { Heart, Crown, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRecentVisitors, sendConnectionRequest, fetchSentRequests } from '../../../Slice/MatchSlice';
import { formatDisplayName } from '../../../utils/mockData';
import PremiumLock from '../../../components/PremiumLock';

const RecentVisitors = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { recentVisitors, sentRequests, loading } = useSelector((state) => state.match);

    useEffect(() => {
        dispatch(fetchRecentVisitors());
        dispatch(fetchSentRequests());
    }, [dispatch]);

    const visitors = (recentVisitors || []).map(v => ({
        id: v.id,
        userId: v.userId,
        name: formatDisplayName(v.fullName, v.displayNameVisibility, v.id),
        age: v.age || 'N/A',
        height: v.height || '',
        language: v.motherTongue || '',
        location: [v.city, v.state].filter(Boolean).join(', ') || '',
        image: v.profilePhotoUrl || null,
        isPremium: v.isPremium || false,
        premiumVisible: v.premiumVisible !== false,
    }));

    const handleConnect = (visitorId, userId) => {
        const receiverId = visitorId;
        if (!sentRequests.some(r => r.receiverProfileId === receiverId || r.receiverId === userId)) {
            dispatch(sendConnectionRequest(receiverId))
                .unwrap()
                .then(() => {
                    // Refresh sent requests to update UI state
                    dispatch(fetchSentRequests());
                })
                .catch((err) => {
                    console.error("Failed to send connection request:", err);
                    if (err === 'Access Denied' || err?.includes('premium')) {
                        navigate('/payment');
                    }
                });
        }
    };

    const handleViewPlans = () => {
        navigate('/payment');
    };

    if (loading && visitors.length === 0) {
        return (
            <div className="bg-gray-50 flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
                    <p className="text-theme-text-secondary font-medium">Loading visitors...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-transparent">
            <main className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold">Recent Visitors</h2>
                    <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                        {visitors.length}
                    </span>
                </div>

                {visitors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                            <Heart className="w-12 h-12 text-pink-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No visitors yet</h3>
                        <p className="text-theme-text-secondary max-w-sm">
                            When someone visits your profile, they'll appear here.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-custom cursor-pointer">
                        <div className="flex gap-4 min-w-min">
                            {visitors.map((v) => (
                                <div
                                    key={v.id}
                                    className="dashboard-card-bg rounded-3xl shadow-md hover:shadow-xl transition-all w-56 flex-shrink-0 group relative"
                                >
                                    {v.isPremium && (
                                        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full p-2">
                                            <div className="flex items-center">
                                                <Crown className="w-4 h-4 text-white" fill="white" />
                                                <span className="text-white text-xs font-bold ml-0.5">+</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="relative w-full aspect-square overflow-hidden rounded-t-3xl">
                                        {v.image ? (
                                            <img
                                                src={v.image}
                                                alt={v.name}
                                                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${v.premiumVisible === false ? 'blur-md scale-110' : ''}`}
                                                onError={(e) => { e.target.onerror = null; e.target.src = ''; }}
                                            />
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-br from-pink-50 to-pink-100 flex flex-col items-center justify-center ${v.premiumVisible === false ? 'blur-md' : ''}`}>
                                                <div className="w-20 h-20 bg-pink-200 rounded-full flex items-center justify-center mb-2">
                                                    <svg className="w-12 h-12 text-pink-300" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                    </svg>
                                                </div>
                                                <p className="text-cyan-500 font-semibold text-sm">Request a</p>
                                                <p className="text-cyan-500 font-semibold text-sm">Photo</p>
                                            </div>
                                        )}
                                        {v.premiumVisible === false && (
                                            <div className="absolute inset-0 z-20">
                                                <PremiumLock onViewPlans={handleViewPlans} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-center mb-1">{v.name}</h3>
                                        <p className="text-sm text-gray-700 text-center">
                                            {[v.age && `${v.age} yrs`, v.height, v.language].filter(Boolean).join(', ')}
                                        </p>
                                        <p className="text-sm text-theme-text-secondary text-center mb-4">{v.location}</p>
                                        <button
                                            onClick={() => handleViewProfile(v.id)}
                                            className="w-full mb-2 border-2 border-pink-500 text-pink-500 hover:bg-pink-50 font-semibold py-2 rounded-full transition-all transform active:scale-95 cursor-pointer text-sm"
                                        >
                                            View Profile
                                        </button>
                                        <button
                                            onClick={() => handleConnect(v.id, v.userId)}
                                            disabled={sentRequests.some(r => r.receiverProfileId === v.id || r.receiverId === v.userId)}
                                            className={`w-full border-2 font-semibold py-2 rounded-full transition-all transform active:scale-95 cursor-pointer text-sm ${
                                                sentRequests.some(r => r.receiverProfileId === v.id || r.receiverId === v.userId)
                                                    ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                                                    : 'border-cyan-500 text-cyan-500 hover:bg-cyan-50'
                                            }`}
                                        >
                                            {sentRequests.some(r => r.receiverProfileId === v.id || r.receiverId === v.userId) ? 'Request Sent' : 'Connect Now'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <style>{`
                .scrollbar-custom::-webkit-scrollbar { height: 8px; }
                .scrollbar-custom::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
                .scrollbar-custom::-webkit-scrollbar-thumb { background: linear-gradient(to right, #ec4899, #ef4444); border-radius: 10px; }
                .scrollbar-custom::-webkit-scrollbar-thumb:hover { background: linear-gradient(to right, #db2777, #dc2626); }
            `}</style>
        </div>
    );
};

export default RecentVisitors;