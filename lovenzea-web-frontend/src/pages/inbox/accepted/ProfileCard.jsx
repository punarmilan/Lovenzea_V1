import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Verified } from 'lucide-react';
import PremiumLock from '../../../components/PremiumLock';

const ProfileCard = ({ profile, onUpgrade, onChat, onWhatsApp, onCall }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-theme-surface rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-4 sm:gap-6 lg:gap-8">

                {/* Profile Image Section */}
                <div className="flex justify-center md:justify-start">
                    <div 
                        className="relative cursor-pointer"
                        onClick={() => navigate(`/matches/${profile.id}`)}
                    >
                        <img
                            src={profile.image}
                            alt={profile.name}
                            className={`w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full object-cover border-4 ${profile.isPremium ? 'border-amber-400' : 'border-yellow-400'} ${profile.premiumVisible === false ? 'blur-md' : ''}`}
                        />
                        {profile.premiumVisible === false && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <PremiumLock />
                            </div>
                        )}
                        {profile.isPremium && (
                            <div className="absolute -top-2 -left-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-md z-20">
                                <Star size={10} className="fill-white" />
                                PREMIUM PLUS
                            </div>
                        )}

                        {profile.online && (
                            <div className="absolute bottom-0 left-0 flex items-center gap-1.5 bg-theme-surface px-2.5 py-1 rounded-full shadow-md text-xs sm:text-sm">
                                <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                        <circle cx="12" cy="12" r="5" fill="currentColor" />
                                    </svg>
                                    <span className="text-gray-700">Online {profile.onlineTime}</span>
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Info Section */}
                <div className="flex-1 text-center md:text-left">
                    {/* Name and Date Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <h2 
                                className="text-2xl sm:text-3xl font-semibold text-gray-800 hover:text-yellow-600 cursor-pointer transition-colors"
                                onClick={() => navigate(`/matches/${profile.id}`)}
                            >
                                {profile.name}
                                {profile.isPremium && (
                                    <div className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-200 flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-amber-500" /> Premium
                                    </div>
                                )}
                            </h2>
                            {profile.verified && (
                                <span className="text-blue-500">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                </span>
                            )}
                            {/* Dropdown icon */}
                            <button className="text-gray-400 hover:text-theme-text-secondary ml-auto md:ml-2">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                        <span className="text-sm sm:text-base text-theme-text-secondary">{profile.date}</span>
                    </div>

                    {/* Profile Details */}
                    <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700">
                        <p>{profile.age}, {profile.height}</p>
                        <p>{profile.languages}</p>
                        <p>{profile.location}</p>
                        <p>{profile.education}</p>
                        <p>{profile.profession}</p>
                    </div>
                </div>

                {/* Action Buttons Section */}
                <div className="flex flex-col gap-3 sm:gap-4 w-full md:w-auto md:min-w-[200px] lg:min-w-[240px]">
                    {/* Upgrade Banner */}
                    <div className="text-center p-3 sm:p-4 bg-theme-surface border border-theme-border rounded-md">
                        <p className="text-xs sm:text-sm text-blue-600 hover:underline cursor-pointer mb-2 sm:mb-3" onClick={onUpgrade}>
                            Upgrade to
                        </p>
                        <p className="text-xs sm:text-sm text-blue-600 italic mb-3 sm:mb-4">Contact her directly</p>
                    </div>

                    {/* Call Button */}
                    <button
                        onClick={() => { if (onCall) onCall(); }}
                        className="w-full flex items-center justify-center gap-2 bg-theme-surface border border-gray-300 text-blue-500 font-medium py-2.5 sm:py-3 px-4 rounded-md hover:bg-gray-50 transition-all text-sm sm:text-base"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                        Call
                    </button>

                    {/* WhatsApp Button */}
                    <button
                        onClick={() => { if (onWhatsApp) onWhatsApp(); }}
                        className="w-full flex items-center justify-center gap-2 bg-theme-surface border border-gray-300 text-green-600 font-medium py-2.5 sm:py-3 px-4 rounded-md hover:bg-gray-50 transition-all text-sm sm:text-base"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp
                    </button>

                    {/* LovenZea Chat Button */}
                    <button
                        onClick={() => { if (onChat) onChat(); }}
                        className="w-full flex items-center justify-center gap-2 bg-theme-surface border border-gray-300 text-blue-600 font-medium py-2.5 sm:py-3 px-4 rounded-md hover:bg-gray-50 transition-all text-sm sm:text-base"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                        </svg>
                        LovenZea Chat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;