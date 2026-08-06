import React, { useState } from 'react';
import { FaHeart, FaStar, FaCamera, FaMapMarkerAlt, FaIdCard, FaRing, FaUserCircle, FaLanguage } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function HeroOfMyProfile() {
    const [profileImage, setProfileImage] = useState(null);
    const [isPremium] = useState(true);
    const [profileData, setProfileData] = useState({
        id: 'MAT123456',
        age: '27',
        height: '5\' 8"',
        maritalStatus: 'Never Married',
        postedBy: 'Self',
        religion: 'Hindu',
        community: 'Other',
        location: 'Pune',
        motherTongue: 'Marathi'
    });

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
                toast.success('Profile picture updated successfully!', {
                    position: "top-center",
                    autoClose: 2000,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleExpressInterest = () => {
        toast.success('Interest expressed successfully! 💕', {
            position: "top-center",
            autoClose: 2000,
        });
    };

    const triggerFileInput = () => {
        document.getElementById('profile-image-input').click();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-2 sm:p-4 lg:p-6">

            <div className="max-w-7xl mx-auto">
                {/* Profile Card */}
                <div className="bg-gradient-to-br from-pink-600 via-rose-600 to-pink-700 rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden">

                    {/* Premium Badge - Positioned Absolutely */}
                    {isPremium && (
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg flex items-center gap-1 sm:gap-2 z-20">
                            <FaStar className="text-xs sm:text-sm" /> PREMIUM
                        </div>
                    )}

                    <div className="relative p-4 sm:p-6 lg:p-8">
                        {/* Flexbox Layout for Desktop/Tablet */}
                        <div className="flex flex-col lg:flex-row justify-content-center items-center lg:items-start gap-4 sm:gap-6 lg:gap-8">

                            {/* Left Section - Profile Image */}
                            <div className="flex-shrink-0  ">
                                <div className="relative">
                                    <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-2xl sm:rounded-3xl overflow-hidden border-4 sm:border-5 border-white shadow-2xl bg-pink-100 flex items-center justify-center">
                                        {profileImage ? (
                                            <img
                                                src={profileImage}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FaUserCircle className="w-full h-full text-pink-300" />
                                        )}
                                    </div>
                                    <button
                                        onClick={triggerFileInput}
                                        className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-pink-500 text-white p-2 sm:p-2.5 lg:p-3 rounded-full shadow-lg hover:bg-pink-600 transition-all hover:scale-110 transform"
                                        title="Change Profile Picture"
                                    >
                                        <FaCamera className="text-sm sm:text-base" />
                                    </button>
                                    <input
                                        id="profile-image-input"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Middle Section - Profile Info */}
                            <div className="flex-grow w-full lg:w-auto">
                                {/* Profile ID and Status */}
                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-4 sm:mb-5">
                                    <span className="bg-theme-surface/20 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                                        {profileData.id}
                                    </span>
                                    <span className="text-white/95 text-xs sm:text-sm font-medium">• Online Now</span>
                                </div>

                                {/* Info Grid */}
                                <div className="bg-theme-surface/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-5 border border-white/20">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">

                                        {/* Age / Height */}
                                        <div className="flex items-center gap-3 bg-theme-surface/10 rounded-lg lg:rounded-xl p-3 sm:p-3.5 lg:p-4 border border-white/10 hover:bg-theme-surface/15 transition-all">
                                            <div className="flex-shrink-0 bg-theme-surface/20 rounded-lg p-2 sm:p-2.5">
                                                <FaIdCard className="text-white text-base sm:text-lg lg:text-xl" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="text-white/70 text-xs sm:text-sm font-medium mb-0.5">Age / Height</div>
                                                <div className="text-white font-bold text-sm sm:text-base lg:text-lg truncate">{profileData.age} / {profileData.height}</div>
                                            </div>
                                        </div>

                                        {/* Marital Status */}
                                        <div className="flex items-center gap-3 bg-theme-surface/10 rounded-lg lg:rounded-xl p-3 sm:p-3.5 lg:p-4 border border-white/10 hover:bg-theme-surface/15 transition-all">
                                            <div className="flex-shrink-0 bg-theme-surface/20 rounded-lg p-2 sm:p-2.5">
                                                <FaRing className="text-white text-base sm:text-lg lg:text-xl" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="text-white/70 text-xs sm:text-sm font-medium mb-0.5">Marital Status</div>
                                                <div className="text-white font-bold text-sm sm:text-base lg:text-lg truncate">{profileData.maritalStatus}</div>
                                            </div>
                                        </div>

                                        {/* Posted by */}
                                        <div className="flex items-center gap-3 bg-theme-surface/10 rounded-lg lg:rounded-xl p-3 sm:p-3.5 lg:p-4 border border-white/10 hover:bg-theme-surface/15 transition-all">
                                            <div className="flex-shrink-0 bg-theme-surface/20 rounded-lg p-2 sm:p-2.5">
                                                <FaUserCircle className="text-white text-base sm:text-lg lg:text-xl" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="text-white/70 text-xs sm:text-sm font-medium mb-0.5">Posted by</div>
                                                <div className="text-white font-bold text-sm sm:text-base lg:text-lg truncate">{profileData.postedBy}</div>
                                            </div>
                                        </div>

                                        {/* Religion / Community */}
                                        <div className="flex items-center gap-3 bg-theme-surface/10 rounded-lg lg:rounded-xl p-3 sm:p-3.5 lg:p-4 border border-white/10 hover:bg-theme-surface/15 transition-all">
                                            <div className="flex-shrink-0 bg-theme-surface/20 rounded-lg p-2 sm:p-2.5">
                                                <FaStar className="text-white text-base sm:text-lg lg:text-xl" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="text-white/70 text-xs sm:text-sm font-medium mb-0.5">Religion / Community</div>
                                                <div className="text-white font-bold text-sm sm:text-base lg:text-lg truncate">{profileData.religion}, {profileData.community}</div>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-center gap-3 bg-theme-surface/10 rounded-lg lg:rounded-xl p-3 sm:p-3.5 lg:p-4 border border-white/10 hover:bg-theme-surface/15 transition-all">
                                            <div className="flex-shrink-0 bg-theme-surface/20 rounded-lg p-2 sm:p-2.5">
                                                <FaMapMarkerAlt className="text-white text-base sm:text-lg lg:text-xl" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="text-white/70 text-xs sm:text-sm font-medium mb-0.5">Location</div>
                                                <div className="text-white font-bold text-sm sm:text-base lg:text-lg truncate">{profileData.location}</div>
                                            </div>
                                        </div>

                                        {/* Mother Tongue */}
                                        <div className="flex items-center gap-3 bg-theme-surface/10 rounded-lg lg:rounded-xl p-3 sm:p-3.5 lg:p-4 border border-white/10 hover:bg-theme-surface/15 transition-all">
                                            <div className="flex-shrink-0 bg-theme-surface/20 rounded-lg p-2 sm:p-2.5">
                                                <FaLanguage className="text-white text-base sm:text-lg lg:text-xl" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="text-white/70 text-xs sm:text-sm font-medium mb-0.5">Mother Tongue</div>
                                                <div className="text-white font-bold text-sm sm:text-base lg:text-lg truncate">{profileData.motherTongue}</div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* Right Section - Express Interest Button */}
                            <div className="flex-shrink-0 w-full lg:w-auto lg:min-w-[200px] xl:min-w-[240px] flex items-center justify-center lg:justify-end mt-4 lg:mt-0">
                                <button
                                    onClick={handleExpressInterest}
                                    className="w-full lg:w-auto bg-theme-surface text-pink-600 hover:bg-pink-50 px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 rounded-xl lg:rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg"
                                >
                                    <FaHeart className="text-base sm:text-lg" /> Express Interest
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Additional Demo Section */}
                <div className="mt-4 sm:mt-6 bg-theme-surface rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Dynamic Profile Data</h3>
                    <p className="text-sm sm:text-base text-theme-text-secondary">All profile information is dynamically loaded from state and can be easily updated through API calls or user actions.</p>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3 border border-theme-border">
                            <div className="text-xs text-theme-text-secondary mb-1">Profile ID</div>
                            <div className="font-semibold text-sm">{profileData.id}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 border border-theme-border">
                            <div className="text-xs text-theme-text-secondary mb-1">Status</div>
                            <div className="font-semibold text-sm text-green-600">Online Now</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 border border-theme-border">
                            <div className="text-xs text-theme-text-secondary mb-1">Membership</div>
                            <div className="font-semibold text-sm text-yellow-600">Premium</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}