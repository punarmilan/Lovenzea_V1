import React, { useEffect } from 'react';
import { Users, CheckCircle, Eye, Crown, Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardSummary } from '../Slice/DashboardSlice';

const ActivitySummary = () => {
    const dispatch = useDispatch();
    const { summary, loading } = useSelector((state) => state.dashboard);
    const { subscriptionDetails } = useSelector((state) => state.user);
    const isPremium = subscriptionDetails?.active || summary?.user?.isPremium;

    // Fetch fresh data for the logged-in user on every mount
    useEffect(() => {
        dispatch(fetchDashboardSummary());
    }, [dispatch]);

    const activities = [
        {
            icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
            title: 'Pending Invitations',
            count: Number(summary?.pendingInvitations) || 0,
            color: 'blue'
        },
        {
            icon: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
            title: 'Accepted Invitations',
            count: Number(summary?.acceptedInvitations) || 0,
            color: 'green'
        },
        {
            icon: <Eye className="w-4 h-4 sm:w-5 sm:h-5" />,
            title: 'Recent Visitors',
            count: Number(summary?.recentVisitorsCount) || 0,
            color: 'purple'
        },
    ];

    return (
        <div className='w-full px-2 sm:px-4 md:px-0'>
            <div className='space-y-3 md:space-y-6'>
                <div className="bg-theme-surface rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg p-3 sm:p-4 md:p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Year Activity Summary
                        </h2>
                        <div className="flex items-center text-xs sm:text-sm text-theme-text-secondary">
                            <Crown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-yellow-500" />
                            <span className="hidden xs:inline">Premium Features</span>
                            <span className="xs:hidden">Premium</span>
                        </div>
                    </div>

                    {/* Activity Cards */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
                        {activities.map((activity, index) => (
                            <div
                                key={index}
                                className={`bg-gradient-to-br from-${activity.color}-50 to-white p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border border-${activity.color}-100 hover:shadow-md transition-all duration-300`}
                            >
                                <div className="flex items-center justify-between mb-2 sm:mb-3">
                                    <div className={`p-1.5 sm:p-2 bg-${activity.color}-100 rounded-md sm:rounded-lg`}>
                                        <div className={`text-${activity.color}-500`}>
                                            {activity.icon}
                                        </div>
                                    </div>
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                                    ) : (
                                        <span className="text-2xl sm:text-3xl font-bold text-gray-800">{activity.count}</span>
                                    )}
                                </div>
                                <h3 className="font-semibold text-xs sm:text-sm md:text-base text-gray-700">{activity.title}</h3>
                            </div>
                        ))}
                    </div>

                    {/* Premium Benefits */}
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-pink-100">
                        <div className="flex items-center mb-3 sm:mb-4">
                            <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mr-2 sm:mr-3" />
                            <h3 className="text-sm sm:text-base md:text-xl font-bold">
                                {isPremium ? "Your Premium Benefits" : "Our Premium Members enjoy these benefits"}
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-theme-surface rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-semibold text-xs sm:text-sm md:text-base">Contacts viewed</h4>
                                    <p className="text-xs sm:text-sm text-theme-text-secondary truncate">See who viewed your profile</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-theme-surface rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-semibold text-xs sm:text-sm md:text-base">Chats initiated</h4>
                                    <p className="text-xs sm:text-sm text-theme-text-secondary truncate">Start unlimited conversations</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivitySummary;