import React, { useState } from 'react';
import { MoreHorizontal, Heart, Eye, ThumbsUp, MousePointer2 } from 'lucide-react';

export default function ProfileStatusCards({ user, onEditProfile }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Provide default fallback values if the user prop lacks data
    const profileImageUrl = user?.profilePhotoUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60";
    const profileCompletion = user?.profileCompletion || 50;

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full mb-8">
            {/* Left Card - Profile Image */}
            <div className="flex-[0.4]">
                <div className="bg-white/80 backdrop-blur-md p-3 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white h-[380px] flex flex-col overflow-hidden relative group">
                    <img 
                        src={profileImageUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover rounded-[20px]"
                    />
                    {/* Edit Profile Overlay */}
                    <button 
                        onClick={onEditProfile}
                        className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-[#B54768] to-[#E88C8C] text-white py-3 rounded-2xl font-bold tracking-wider shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all z-10 text-sm"
                    >
                        EDIT PROFILE
                    </button>
                </div>
            </div>

            {/* Right Card - Profile Completion */}
            <div className="flex-[0.6]">
                <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white h-[380px] flex flex-col justify-between">
                    
                    {/* Top Row: Title & Menu */}
                    <div className="flex justify-between items-center mb-2 relative">
                        <span className="text-[#B54768] font-bold text-lg">Profile Completion</span>
                        <button 
                            className="bg-[#FFF8F5] text-[#B54768] rounded-full p-2 hover:bg-white hover:shadow-md transition-all border border-[#F8D6CB]"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <MoreHorizontal size={20} />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <div className="absolute top-12 right-0 bg-white shadow-xl rounded-xl border border-[#F8D6CB]/50 py-2 w-48 z-20 text-sm text-gray-700">
                                <button onClick={onEditProfile} className="w-full text-left px-4 py-2 hover:bg-[#FFF8F5] hover:text-[#B54768] transition-colors">Edit profile</button>
                                <button className="w-full text-left px-4 py-2 hover:bg-[#FFF8F5] hover:text-[#B54768] transition-colors">View profile</button>
                                <button className="w-full text-left px-4 py-2 hover:bg-[#FFF8F5] hover:text-[#B54768] transition-colors">Profile visibility settings</button>
                            </div>
                        )}
                    </div>

                    {/* Circular Progress (CSS based) */}
                    <div className="flex justify-center my-4">
                        <div className="relative w-40 h-40 flex items-center justify-center rounded-full bg-[#FFF8F5] shadow-inner">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                {/* Background Circle */}
                                <path
                                    className="text-[#F8D6CB]/30"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                />
                                {/* Progress Circle */}
                                <path
                                    className="text-purple-600"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="url(#gradient)"
                                    strokeWidth="3"
                                    strokeDasharray={`${profileCompletion}, 100`}
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#B54768" />
                                        <stop offset="100%" stopColor="#E88C8C" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#B54768] to-[#E88C8C]">
                                {profileCompletion}%
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-4 mt-2">
                        <div className="flex items-center gap-3 bg-[#FFF8F5] p-3 rounded-2xl border border-white">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#E88C8C] shadow-sm">
                                <Heart size={18} fill="currentColor" />
                            </div>
                            <span className="font-bold text-gray-800 text-lg">12 <span className="font-medium text-xs text-gray-500 block uppercase tracking-wider">Likes</span></span>
                        </div>
                        <div className="flex items-center gap-3 bg-[#FFF8F5] p-3 rounded-2xl border border-white">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#D98C72] shadow-sm">
                                <Eye size={18} />
                            </div>
                            <span className="font-bold text-gray-800 text-lg">12 <span className="font-medium text-xs text-gray-500 block uppercase tracking-wider">Views</span></span>
                        </div>
                        <div className="flex items-center gap-3 bg-[#FFF8F5] p-3 rounded-2xl border border-white">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#B54768] shadow-sm">
                                <ThumbsUp size={18} />
                            </div>
                            <span className="font-bold text-gray-800 text-lg">12 <span className="font-medium text-xs text-gray-500 block uppercase tracking-wider">Interests</span></span>
                        </div>
                        <div className="flex items-center gap-3 bg-[#FFF8F5] p-3 rounded-2xl border border-white">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#8B5CF6] shadow-sm">
                                <MousePointer2 size={18} />
                            </div>
                            <span className="font-bold text-gray-800 text-lg">12 <span className="font-medium text-xs text-gray-500 block uppercase tracking-wider">Clicks</span></span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
