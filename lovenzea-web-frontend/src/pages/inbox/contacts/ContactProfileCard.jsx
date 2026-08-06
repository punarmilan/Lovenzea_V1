import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MessageCircle, Phone, Video } from 'lucide-react';
import PremiumLock from '../../../components/PremiumLock';

const ContactProfileCard = ({ profile, onChat, onWhatsApp, onCall }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-theme-surface rounded-lg shadow-md p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-shadow border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-4 sm:gap-6 lg:gap-8">

                {/* Profile Image Section */}
                <div className="flex justify-center md:justify-start">
                    <div 
                        className="relative cursor-pointer group"
                        onClick={() => navigate(`/matches/${profile.id}`)}
                    >
                        <img
                            src={profile.image}
                            alt={profile.name}
                            className={`w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full object-cover border-4 ${profile.isPremium ? 'border-amber-400' : 'border-gray-100'} ${profile.premiumVisible === false ? 'blur-md' : ''}`}
                        />
                        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        
                        {profile.premiumVisible === false && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <PremiumLock />
                            </div>
                        )}
                        {profile.isPremium && (
                            <div className="absolute -top-2 -left-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-md z-20">
                                <Star size={10} className="fill-white" />
                                PREMIUM
                            </div>
                        )}

                        {profile.online && (
                            <div className="absolute bottom-1 left-2 flex items-center gap-1.5 bg-theme-surface/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm text-[10px]">
                                <div className="w-2 h-2 rounded-full bg-theme-success animate-pulse"></div>
                                <span className="text-gray-700 font-medium">Online</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Info Section */}
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
                        <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                            <h2 
                                className="text-2xl sm:text-3xl font-semibold text-gray-800 hover:text-rose-600 cursor-pointer transition-colors"
                                onClick={() => navigate(`/matches/${profile.id}`)}
                            >
                                {profile.name}
                            </h2>
                            {profile.verified && (
                                <span className="text-blue-500" title="Verified Profile">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                </span>
                            )}
                        </div>
                        <span className="text-xs sm:text-sm bg-gray-100 text-theme-text-secondary px-3 py-1 rounded-full whitespace-nowrap">Viewed on {profile.date}</span>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-theme-text-secondary">
                        <p className="flex items-center md:justify-start justify-center gap-2">
                             {profile.age}, {profile.height} • {profile.languages}
                        </p>
                        <p className="flex items-center md:justify-start justify-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {profile.location}
                        </p>
                        <p className="flex items-center md:justify-start justify-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {profile.profession}
                        </p>
                    </div>

                    {/* Contact Detail Badge - SHOWING DIRECTLY */}
                    <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-lg inline-flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex items-center gap-2 text-rose-700 font-bold">
                            <Phone className="w-4 h-4" />
                            <span>{profile.phone}</span>
                        </div>
                        <div className="h-4 w-px bg-rose-200 hidden sm:block"></div>
                        <span className="text-rose-600 text-[11px] uppercase tracking-wider font-semibold">Contact Unlocked</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 w-full md:w-56 justify-center">
                    <button
                        onClick={onCall}
                        className="w-full flex items-center justify-center gap-2 bg-theme-surface border border-theme-border text-gray-700 font-medium py-2.5 px-4 rounded-lg hover:border-rose-400 hover:text-rose-600 transition-all text-sm shadow-sm"
                    >
                        <Phone className="w-4 h-4" />
                        Call Now
                    </button>

                    <button
                        onClick={onWhatsApp}
                        className="w-full flex items-center justify-center gap-2 bg-theme-surface border border-theme-border text-gray-700 font-medium py-2.5 px-4 rounded-lg hover:border-green-400 hover:text-green-600 transition-all text-sm shadow-sm"
                    >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                    </button>

                    <button
                        onClick={onChat}
                        className="w-full flex items-center justify-center gap-2 bg-rose-500 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-rose-600 shadow-md shadow-rose-100 transition-all text-sm"
                    >
                        <MessageCircle className="w-4 h-4" />
                        LovenZea Chat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactProfileCard;
