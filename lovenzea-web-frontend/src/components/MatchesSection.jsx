import React, { useState } from 'react';
import { Heart, Star, Users, Calendar } from 'lucide-react';

const MatchesSection = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15; // 5 columns × 3 rows

    const allMatches = [
        { name: 'Ankita A', img: 10 },
        { name: 'Sujata D', img: 11 },
        { name: 'Shrushti P', img: 12 },
        { name: 'Ashwini U', img: 13 },
        { name: 'Vaishnavi V', img: 14 },
        { name: 'Jeegisha T', img: 15 },
        { name: 'Savita V', img: 16 },
        { name: 'Akanksha Y', img: 17 },
        { name: 'Mahi P', img: 18 },
        { name: 'Sayli D', img: 19 },
        { name: 'Shivani K', img: 20 },
        { name: 'Vijaya B', img: 21 },
        { name: 'Vaishnavi M', img: 22 },
        { name: 'Pooja M', img: 23 },
        { name: 'Neha S', img: 24 },
        { name: 'Priya K', img: 25 },
        { name: 'Divya P', img: 26 },
        { name: 'Sneha R', img: 27 },
        { name: 'Riya B', img: 28 },
        { name: 'Kavya N', img: 29 },
    ];

    const totalPages = Math.ceil(allMatches.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const visibleMatches = allMatches.slice(start, start + itemsPerPage);

    return (
        <div className="w-full px-2 sm:px-4 md:px-0">
            <div className="bg-theme-surface rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg p-3 sm:p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-4 sm:mb-5 md:mb-6 gap-2 xs:gap-0">
                    <div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center">
                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-theme-primary mr-1.5 sm:mr-2" />
                            My Matches
                        </h2>
                        <p className="text-theme-text-secondary text-xs sm:text-sm mt-0.5">Last Time: 1 AM/5 AM</p>
                    </div>
                    <span className="bg-gradient-to-r from-theme-primary to-theme-pink text-white px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap">
                        20 Matches
                    </span>
                </div>

                {/* Match Categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
                    <CategoryCard title="Accepted Members" count={0} icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />} color="purple" />
                    <CategoryCard title="Shortlists & More" count={0} icon={<Star className="w-4 h-4 sm:w-5 sm:h-5" />} color="blue" />
                    <CategoryCard title="My Matches" count={20} icon={<Heart className="w-4 h-4 sm:w-5 sm:h-5" />} color="pink" />
                </div>

                {/* Match Grid with Pagination */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-sm sm:text-base md:text-lg">My Matches ({allMatches.length})</h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 rounded-md border bg-theme-surface disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                &lt;
                            </button>
                            <span className="text-xs text-theme-text-secondary font-medium whitespace-nowrap px-2">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 rounded-md border bg-theme-surface disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                &gt;
                            </button>
                        </div>
                    </div>

                    {/* 5 Columns × 3 Rows Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                        {visibleMatches.map((match, index) => (
                            <div key={index} className="group relative">
                                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100 shadow-md hover:shadow-lg transition-all cursor-pointer">
                                    <img
                                        src={`https://i.pravatar.cc/200?img=${match.img}`}
                                        alt={match.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                                        <p className="text-white text-xs font-semibold truncate">{match.name}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CategoryCard = ({ title, count, icon, color }) => {
    const colorClasses = {
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        pink: 'bg-pink-50 text-[#0F766E] border-pink-100',
    };

    return (
        <div className={`${colorClasses[color]} p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border text-center`}>
            <div className="flex justify-center mb-1 sm:mb-2">
                <div className={`p-1 sm:p-1.5 md:p-2 rounded-full bg-theme-surface ${colorClasses[color].split(' ')[0]}`}>
                    {icon}
                </div>
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold">{count}</div>
            <div className="text-[10px] sm:text-xs md:text-sm font-medium leading-tight mt-0.5 sm:mt-1">
                {title}
            </div>
        </div>
    );
};

export default MatchesSection;
