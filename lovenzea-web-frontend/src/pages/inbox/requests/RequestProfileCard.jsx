import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import PremiumLock from '../../../components/PremiumLock';

const RequestProfileCard = ({ profile, index }) => {
    const navigate = useNavigate();
    return (
        <div
            className="bg-theme-surface border-2 border-theme-border rounded-2xl p-6 mb-5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-red-500 animate-slideUp"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="flex flex-col md:flex-row gap-5 mb-5">
                {/* Avatar */}
                <div 
                    className="relative flex-shrink-0 mx-auto md:mx-0 cursor-pointer"
                    onClick={() => navigate(`/matches/${profile.id}`)}
                >
                    {/* Avatar Circle with Image or Fallback */}
                    <div className={`w-32 h-32 rounded-full border-4 ${profile.isPremium ? 'border-amber-400' : 'border-red-500'} shadow-lg overflow-hidden bg-gradient-to-br from-pink-50 to-pink-100 relative`}>
                        <div className={`w-full h-full ${profile.premiumVisible === false ? 'blur-md' : ''}`}>
                            {profile.img ? (
                                <img
                                    src={profile.img}
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center p-2">
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <div className="absolute w-16 h-20 bg-gradient-to-b from-[#FFDAB9] to-[#F4C7A6] rounded-full top-4"></div>
                                        <div className="absolute w-20 h-16 bg-gradient-to-b from-[#4A4A4A] to-[#6B6B6B] rounded-t-full top-0"></div>
                                        <div className="absolute w-1 h-8 bg-[#3A3A3A] rounded-full top-0 left-1/2 -translate-x-1/2"></div>
                                        <div className="absolute w-8 h-16 bg-[#4A4A4A] rounded-l-full left-3 top-2 shadow-inner"></div>
                                        <div className="absolute w-8 h-16 bg-[#4A4A4A] rounded-r-full right-3 top-2 shadow-inner"></div>
                                        <div className="absolute top-10 left-8 w-2 h-2 bg-[#2C1810] rounded-full"></div>
                                        <div className="absolute top-10 right-8 w-2 h-2 bg-[#2C1810] rounded-full"></div>
                                        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#8B0000] rounded-full"></div>
                                        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-1 h-1.5 bg-[#E0B098] rounded-full"></div>
                                        <div className="absolute top-[52px] left-1/2 -translate-x-1/2 w-6 h-2 border-b-2 border-[#D4997A] rounded-b-full"></div>
                                        <div className="absolute top-12 left-4 w-2.5 h-2.5 bg-gradient-to-b from-[#FFD700] to-[#FFA500] rounded-full shadow-md"></div>
                                        <div className="absolute top-12 right-4 w-2.5 h-2.5 bg-gradient-to-b from-[#FFD700] to-[#FFA500] rounded-full shadow-md"></div>
                                        <div className="absolute top-[68px] left-1/2 -translate-x-1/2 w-8 h-6 bg-[#FFDAB9] rounded-b-lg"></div>
                                        <div className="absolute top-[88px] left-1/2 -translate-x-1/2 w-20 h-12 bg-gradient-to-b from-[#90EE90] to-[#7CCD7C] rounded-t-2xl shadow-md">
                                            <div className="absolute top-2 left-4 w-1.5 h-1.5 bg-theme-surface rounded-full opacity-80"></div>
                                            <div className="absolute top-2 right-4 w-1.5 h-1.5 bg-theme-surface rounded-full opacity-80"></div>
                                            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-theme-surface rounded-full opacity-80"></div>
                                            <div className="absolute top-7 left-6 w-1.5 h-1.5 bg-theme-surface rounded-full opacity-80"></div>
                                            <div className="absolute top-7 right-6 w-1.5 h-1.5 bg-theme-surface rounded-full opacity-80"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {profile.isPremium && (
                            <div className="absolute -top-2 -left-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-md z-20">
                                <Star size={10} className="fill-white" />
                                PLUS
                            </div>
                        )}
                        {profile.premiumVisible === false && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                                <PremiumLock />
                            </div>
                        )}
                    </div>

                    {/* Request Type Badge */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap shadow-md">
                        {profile.requestType}
                    </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center gap-3 mb-2 justify-center md:justify-start flex-wrap">
                        <h3 
                            className="text-2xl font-bold text-gray-800 hover:text-red-500 cursor-pointer transition-colors"
                            onClick={() => navigate(`/matches/${profile.id}`)}
                        >
                            {profile.name}
                        </h3>
                        {profile.isPremium && (
                            <div className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-200 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-500" /> Premium
                            </div>
                        )}
                        {profile.hasCrown && (
                            <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs shadow-sm">
                                👑
                            </div>
                        )}
                        {profile.isVerified && (
                            <div className="w-6 h-6 bg-teal-400 rounded-full flex items-center justify-center text-white font-bold shadow-sm text-xs">
                                ✓
                            </div>
                        )}
                    </div>

                    <div className="text-sm text-green-500 font-medium mb-4 flex items-center justify-center md:justify-start gap-1.5">
                        <span className="inline-block w-2 h-2 bg-theme-success rounded-full animate-pulse"></span>
                        {profile.onlineStatus}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="text-gray-700">
                            <span className="font-bold text-gray-900">Age:</span> {profile.age} yrs, {profile.height}
                        </div>
                        <div className="text-gray-700">
                            <span className="font-bold text-gray-900">Language:</span> {profile.language}
                        </div>
                        <div className="text-gray-700">
                            <span className="font-bold text-gray-900">Location:</span> {profile.location}
                        </div>
                        <div className="text-gray-700">
                            <span className="font-bold text-gray-900">Education:</span> {profile.education}
                        </div>
                        <div className="text-gray-700 md:col-span-2">
                            <span className="font-bold text-gray-900">Employment:</span> {profile.employment}
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Info Box */}
            <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 p-4 rounded-xl text-center text-sm text-gray-700 border-2 border-blue-200 shadow-inner">
                {profile.requestMessage} <span className="text-red-600 font-bold">{profile.requestDate}</span>
            </div>
        </div>
    );
};

export default RequestProfileCard;