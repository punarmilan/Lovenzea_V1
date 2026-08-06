import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewMatches, fetchDailyMatches, fetchAllMatches, fetchNearMeMatches } from '../Slice/MatchSlice';

const MatchesNav = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const {
        newMatches,
        dailyMatches,
        allMatches,
        nearMeMatches,
        hasFetched
    } = useSelector((state) => state.match);
    const [activeTab, setActiveTab] = useState('new');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) {
            setActiveTab(tab);
        } else {
            setActiveTab('new');
        }
    }, [location.search]);

    useEffect(() => {
        // Ensure we have the latest counts from the database without infinite looping
        if (!hasFetched.new) dispatch(fetchNewMatches());
        if (!hasFetched.today) dispatch(fetchDailyMatches());
        if (!hasFetched.my) dispatch(fetchAllMatches());
        if (!hasFetched.near) dispatch(fetchNearMeMatches());
    }, [dispatch, hasFetched]);

    const tabs = [
        { id: 'new', label: 'New Matches', count: newMatches.length },
        // { id: 'today', label: "Today's Match", count: dailyMatches.length },
        { id: 'my', label: 'My Matches', count: allMatches.length },
        { id: 'near', label: 'Near Me', count: nearMeMatches.length },
        { id: 'more', label: 'More Matches', count: allMatches.length },
    ];

    return (
        <div className="bg-theme-surface border-b border-theme-border sticky top-0 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-2 sm:px-3">
                <div className="flex items-center justify-start sm:justify-center gap-0.5 sm:gap-2 overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.id}
                            to={`/matches?tab=${tab.id}`}
                            className={`
                                relative py-2 px-2 sm:px-4 transition-all duration-300 block font-medium text-center min-w-fit whitespace-nowrap
                                ${activeTab === tab.id
                                    ? tab.id === 'today'
                                        ? 'bg-[#ff5a60] text-white'
                                        : 'text-rose-500 border-b-2 border-rose-500'
                                    : 'text-theme-text-secondary hover:text-rose-500'}
                            `}
                        >
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs sm:text-[13px] font-bold uppercase tracking-tight">{tab.label}</span>
                                {tab.count !== undefined && (
                                    tab.id === 'today' ? (
                                        <span className={`flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-sm text-[10px] font-bold ${activeTab === tab.id ? 'bg-[#4caf50] text-white' : 'bg-gray-100 text-theme-text-secondary'}`}>
                                            {tab.count}
                                        </span>
                                    ) : (
                                        <span className={`text-xs ${activeTab === tab.id ? 'text-rose-500' : 'text-gray-400'}`}>
                                            ({tab.count})
                                        </span>
                                    )
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MatchesNav;
