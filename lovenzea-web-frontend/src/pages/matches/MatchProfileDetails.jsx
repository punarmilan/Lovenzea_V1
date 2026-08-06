import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatDisplayName } from '../../utils/mockData';
import {
    logProfileView, sendConnectionRequest, fetchSentRequests,
    fetchProfileById, addToShortlistServer, fetchShortlist,
    removeFromShortlistServer, fetchPreferenceMatch
} from '../../Slice/MatchSlice';
import { fetchMyProfile } from '../../Slice/ProfileSlice';
import { openChatWith } from '../../Slice/ChatSlice';
import { trackContactView, fetchSubscriptionDetails } from '../../Slice/UserSlice';
import {
    MapPin, User, Clock, Phone, Mail, Lock, Music, Coffee,
    Briefcase, Book, Heart, ArrowLeft, ChevronDown, Share2,
    Printer, Star, Shield, MessageSquare, Copy, ExternalLink,
    Calendar, GraduationCap, Home, Users, HeartHandshake, Info,
    Flag, Ban, Check, BadgeCheck, Eye, Sparkles, Smile, X, ZoomIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumLock from '../../components/PremiumLock';

const MatchProfileDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Redux selectors
    const { sentRequests, currentProfile, shortlistedProfiles, preferenceMatch } = useSelector((state) => state.match);
    const { profile: myProfile } = useSelector((state) => state.profile);
    const { user, subscriptionDetails } = useSelector((state) => state.user);

    // State
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [lightboxPhoto, setLightboxPhoto] = useState(null);
    const dropdownRef = useRef(null);

    // Initial data fetching
    useEffect(() => {
        dispatch(fetchSentRequests());
        dispatch(fetchMyProfile());
        dispatch(fetchShortlist());
        if (!subscriptionDetails) {
            dispatch(fetchSubscriptionDetails());
        }
    }, [dispatch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isShortlisted = profile && shortlistedProfiles?.some(p => p.id === profile.rawId);

    const toggleShortlist = async () => {
        if (!profile || !profile.rawId) return;
        try {
            if (isShortlisted) {
                await dispatch(removeFromShortlistServer(profile.rawId)).unwrap();
                Swal.fire({ text: "Removed from shortlist successfully!", confirmButtonColor: '#8C6D39' });
            } else {
                await dispatch(addToShortlistServer({ id: profile.rawId })).unwrap();
                Swal.fire({ text: "Added to shortlist successfully!", confirmButtonColor: '#8C6D39' });
            }
            setIsDropdownOpen(false);
        } catch (error) {
            console.error("Shortlist error:", error);
            Swal.fire({ text: `Failed to ${isShortlisted ? 'remove' : 'add'} shortlist. Please try again.`, confirmButtonColor: '#8C6D39' });
        }
    };

    // Mapping backend DTO to local structure
    const mapBackendToLocal = (backendProfile) => {
        const MALE_AVATARS = [
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=150&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=60"
        ];

        const FEMALE_AVATARS = [
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&auto=format&fit=crop&q=60"
        ];

        const idVal = backendProfile.id || backendProfile.userId || 0;
        const isMale = (backendProfile.gender || 'female').toLowerCase() === 'male';
        const fallbackAvatar = isMale 
            ? MALE_AVATARS[idVal % MALE_AVATARS.length] 
            : FEMALE_AVATARS[idVal % FEMALE_AVATARS.length];

        const mainPhoto = backendProfile.profilePhotoUrl || fallbackAvatar;

        const photos = [
            backendProfile.profilePhotoUrl,
            backendProfile.photoUrl2,
            backendProfile.photoUrl3,
            backendProfile.photoUrl4,
            backendProfile.photoUrl5,
            backendProfile.photoUrl6
        ].filter(Boolean);

        return {
            id: backendProfile.id,
            rawId: backendProfile.id,
            userId: backendProfile.userId,
            name: formatDisplayName(
                backendProfile.fullName,
                backendProfile.displayNameVisibility,
                backendProfile.profileId
            ),
            img: mainPhoto,
            image: mainPhoto,
            allPhotos: photos.length > 0 ? photos : [mainPhoto],
            age: backendProfile.age || "N/A",
            height: backendProfile.height || "N/A",
            weight: backendProfile.weight || "N/A",
            religion: backendProfile.religion || 'Not Specified',
            caste: backendProfile.caste || 'Not Specified',
            subCaste: backendProfile.subCaste || '',
            gotra: backendProfile.gotra || '',
            manglikStatus: backendProfile.manglikStatus || 'Not Specified',
            motherTongue: backendProfile.motherTongue || 'Not Specified',
            maritalStatus: backendProfile.maritalStatus || 'Never Married',
            education: backendProfile.educationLevel || 'Not Specified',
            educationField: backendProfile.educationField || '',
            college: backendProfile.college || '',
            profession: backendProfile.occupation || 'Professional',
            location: `${backendProfile.city || ''}, ${backendProfile.state || ''}`.trim().replace(/^,/, '').trim() || (backendProfile.country || 'N/A'),
            city: backendProfile.city,
            state: backendProfile.state,
            country: backendProfile.country || 'India',
            gender: backendProfile.gender,
            managedBy: backendProfile.profileCreatedBy || 'Self',
            about: backendProfile.aboutMe || "",
            phone: backendProfile.mobileNumber || "",
            income: backendProfile.annualIncome || 'Not Specified',
            diet: backendProfile.diet || 'Not Specified',
            smokingHabit: backendProfile.smokingHabit || 'No',
            drinkingHabit: backendProfile.drinkingHabit || 'No',
            bloodGroup: backendProfile.bloodGroup || '',
            verificationStatus: backendProfile.verificationStatus,
            photoVerificationStatus: backendProfile.photoVerificationStatus,
            mobileVerified: backendProfile.mobileVerified,
            isContactViewed: backendProfile.isContactViewed,
            email: backendProfile.email,

            // Horoscope
            horoscope: {
                rashi: backendProfile.rashi,
                nakshatra: backendProfile.nakshatra,
                placeOfBirth: backendProfile.placeOfBirth,
                timeOfBirth: backendProfile.timeOfBirth,
                dateOfBirth: backendProfile.dateOfBirth
            },

            // Family
            family: {
                fatherStatus: backendProfile.fatherStatus,
                motherStatus: backendProfile.motherStatus,
                brothersCount: backendProfile.brothersCount,
                sistersCount: backendProfile.sistersCount,
                familyFinancialStatus: backendProfile.familyFinancialStatus,
                familyLocation: backendProfile.familyLocation,
                familyIncome: backendProfile.familyIncome
            },

            partnerPreference: backendProfile.partnerPreference,
            isPremium: backendProfile.isPremium,
            premiumVisible: backendProfile.premiumVisible,
            preferences: {
                age: backendProfile.partnerPreference ? `${backendProfile.partnerPreference.minAge || 18} to ${backendProfile.partnerPreference.maxAge || 70}` : "Not Specified",
                height: backendProfile.partnerPreference ? `${backendProfile.partnerPreference.minHeight || "Any"} to ${backendProfile.partnerPreference.maxHeight || "Any"}` : "Not Specified",
                maritalStatus: backendProfile.partnerPreference?.maritalStatus || "Any",
                community: backendProfile.partnerPreference?.preferredReligion || "Any",
                motherTongue: backendProfile.partnerPreference?.preferredMotherTongue || "Any",
                country: backendProfile.partnerPreference?.preferredCountry || "Any",
                state: backendProfile.partnerPreference?.preferredState || "Any",
                income: backendProfile.partnerPreference?.minAnnualIncome || "Any"
            }
        };
    };

    const handleRevealContact = async () => {
        if (!user?.isPremium || !subscriptionDetails?.active) {
            Swal.fire({ text: "Upgrade to Premium to reveal contact details.", confirmButtonColor: '#8C6D39' })
            .then(() => navigate('/payment'));
            return;
        }

        if (subscriptionDetails.balance <= 0 && !profile.isContactViewed) {
            Swal.fire({ text: "You have exhausted your contact views balance. Please upgrade your plan.", confirmButtonColor: '#8C6D39' })
            .then(() => navigate('/payment'));
            return;
        }

        try {
            await dispatch(trackContactView(profile.rawId)).unwrap();
            dispatch(fetchProfileById(profile.rawId));
        } catch (error) {
            Swal.fire({ text: error?.message || error || "Failed to reveal contact. Please try again.", confirmButtonColor: '#8C6D39' });
        }
    };

    useEffect(() => {
        if (currentProfile && id && (currentProfile.id.toString() === id || currentProfile.userId?.toString() === id)) {
            const mapped = mapBackendToLocal(currentProfile);
            setProfile(mapped);
            setSelectedPhoto(mapped.img);
            setLoading(false);
        }
    }, [currentProfile, id]);

    useEffect(() => {
        if (id && !isNaN(id)) {
            setLoading(true);
            dispatch(fetchProfileById(id));
            dispatch(fetchPreferenceMatch(id));
            dispatch(logProfileView(parseInt(id)));
        } else {
            setLoading(false);
        }
    }, [id, dispatch]);

    const isRequestSent = sentRequests.some(r => r.receiverProfileId === profile?.id || r.receiverId === profile?.userId);

    const handleSendInterest = () => {
        if (!profile) return;
        const receiverId = profile.id;
        if (!isRequestSent) {
            dispatch(sendConnectionRequest(receiverId));
        }
    };

    const handleOpenChat = () => {
        if (!profile) return;
        const targetUserId = profile.userId || profile.id;
        
        // Navigate to the chat page and pass the user details in state
        navigate('/my-shadi/chats', {
            state: {
                openChatUser: {
                    id: targetUserId,
                    fullName: profile.name,
                    profilePhotoUrl: profile.img
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6">
                <div className="space-y-4 w-full max-w-5xl">
                    <div className="h-12 bg-[#EBDCCB]/30 rounded-xl animate-pulse w-1/4"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 h-[500px] bg-[#EBDCCB]/20 rounded-3xl animate-pulse"></div>
                        <div className="lg:col-span-2 space-y-6">
                            <div className="h-20 bg-[#EBDCCB]/25 rounded-3xl animate-pulse"></div>
                            <div className="h-40 bg-[#EBDCCB]/20 rounded-3xl animate-pulse"></div>
                            <div className="h-80 bg-[#EBDCCB]/15 rounded-3xl animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-8 text-center font-sans">
                <div className="dashboard-card-bg border border-theme-border rounded-[32px] p-8 max-w-md shadow-xl">
                    <Smile className="w-16 h-16 text-theme-pink mx-auto mb-4 animate-bounce" />
                    <h2 className="text-2xl font-bold font-serif text-[#4A3728] mb-2">Profile Not Found</h2>
                    <p className="text-theme-text-secondary mb-6 text-sm">We couldn't retrieve the matrimonial profile you're looking for.</p>
                    <button 
                        onClick={() => navigate('/matches')}
                        className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-pink hover:from-[#B59049] hover:to-[#7C5D29] text-white rounded-full font-bold shadow-md transition-all duration-200"
                    >
                        Back to Matches
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-transparent text-[#4A3728] font-sans relative overflow-hidden pb-24 lg:pb-8">
            {/* Elegant Background Ornaments */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[#EBDCCB]/20 to-transparent rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-20 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-[#EBDCCB]/30 to-transparent rounded-full blur-[150px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 relative z-10">
                {/* Back Link */}
                <div className="mb-6 flex justify-between items-center">
                    <Link to="/matches" className="inline-flex items-center gap-2 text-sm font-bold text-theme-pink hover:text-[#7C5D29] transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Matches
                    </Link>
                    
                    {/* Share / Print Header Action */}
                    <div className="flex gap-3 text-gray-400">
                        <button onClick={() => window.print()} className="p-2 bg-theme-surface/60 hover:bg-theme-surface rounded-full border border-theme-border/60 shadow-sm transition-all text-theme-pink">
                            <Printer className="w-4 h-4" />
                        </button>
                        <button onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            Swal.fire({ text: "Profile link copied to clipboard!", confirmButtonColor: '#8C6D39' });
                        }} className="p-2 bg-theme-surface/60 hover:bg-theme-surface rounded-full border border-theme-border/60 shadow-sm transition-all text-theme-pink">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* 1. LEFT STICKY PANEL (4 cols) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                        <div className="relative overflow-hidden dashboard-card-bg border border-white/40 shadow-xl rounded-[32px] p-4 flex flex-col items-center">
                            
                            {/* Main Large Image Container */}
                            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-md bg-gray-50 border border-theme-border/50 group">
                                {selectedPhoto ? (
                                    <img 
                                        src={selectedPhoto} 
                                        alt={profile.name} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                        <User className="w-20 h-20" />
                                        <span className="text-xs text-gray-400 mt-2">No photo available</span>
                                    </div>
                                )}
                                
                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                                {/* Selfie/Photo Verified Badge */}
                                {profile.photoVerificationStatus === 'VERIFIED' && (
                                    <div className="absolute top-4 right-4 bg-theme-success text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                                        <BadgeCheck className="w-3.5 h-3.5" /> PHOTO VERIFIED
                                    </div>
                                )}

                                {/* Premium Label */}
                                {profile.isPremium && (
                                    <div className="absolute top-4 left-4 bg-gradient-to-r from-theme-primary to-theme-pink text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                                        <Star className="w-3 h-3 fill-white" /> PREMIUM PLUS
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Gallery (Clickable) */}
                            {profile.allPhotos && profile.allPhotos.length > 1 && (
                                <div className="mt-4 flex flex-wrap gap-2 justify-center w-full">
                                    {profile.allPhotos.map((photo, index) => (
                                        <div 
                                            key={index}
                                            onClick={() => setSelectedPhoto(photo)}
                                            className={`w-12 h-12 rounded-lg border-2 cursor-pointer transition-all overflow-hidden ${selectedPhoto === photo ? 'border-[#C5A059] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                        >
                                            <img src={photo} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Status message below photo */}
                            <div className="mt-4 text-center">
                                {isRequestSent ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-50 text-pink-700 text-xs font-semibold rounded-full border border-pink-100">
                                        <Heart className="w-3 h-3 fill-pink-500" /> Invitation Sent
                                    </span>
                                ) : (
                                    <span className="text-xs text-theme-text-secondary font-medium">
                                        Interested in {profile.gender === 'male' ? 'him' : 'her'}? Connect now.
                                    </span>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-2 w-full mt-6">
                                <button 
                                    onClick={handleOpenChat}
                                    className="flex items-center justify-center gap-1.5 py-3.5 px-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-2xl font-bold shadow-lg hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all text-xs tracking-wider uppercase whitespace-nowrap"
                                >
                                    <MessageSquare className="w-4 h-4 shrink-0" /> Chat Now
                                </button>
                                <button 
                                    onClick={handleSendInterest}
                                    disabled={isRequestSent}
                                    className={`flex items-center justify-center gap-1.5 py-3.5 px-2 text-white rounded-2xl font-bold shadow-lg hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all text-xs tracking-wider uppercase whitespace-nowrap ${isRequestSent ? 'bg-pink-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#C5A059] via-[#E47A53] to-[#C5A059]'}`}
                                >
                                    <Heart className={`w-4 h-4 shrink-0 ${isRequestSent ? 'fill-white' : ''}`} /> {isRequestSent ? 'Sent' : 'Interest'}
                                </button>
                            </div>
                        </div>

                        {/* ABOUT SECTION */}
                        <div className="dashboard-card-bg rounded-[32px] p-6 border border-white/50 shadow-md">
                            <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2 text-[#4A3728]">
                                <Smile className="w-5 h-5 text-theme-pink" /> About {profile.name}
                            </h3>
                            <p className="text-sm leading-relaxed text-theme-text-secondary">
                                {profile.about || "About information not added yet."}
                            </p>
                        </div>

                        {/* CONTACT INFO GLASS CARD */}
                        <div className="dashboard-card-bg rounded-[32px] p-6 border border-white/50 shadow-md relative overflow-hidden">
                            <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2 text-[#4A3728]">
                                <Phone className="w-5 h-5 text-theme-pink" /> Contact Information
                            </h3>
                            
                            <div className="relative rounded-2xl overflow-hidden p-5 border border-theme-border/40 bg-theme-surface/70">
                                <div className={`space-y-4 ${profile.isContactViewed ? '' : 'blur-[5px] select-none opacity-40'} transition-all duration-300`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-theme-pink">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-semibold">Mobile Number</p>
                                            <p className="text-sm font-bold text-gray-800">{profile.isContactViewed ? (profile.phone || 'N/A') : '+91 9876543210'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-theme-pink">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-semibold">Email Address</p>
                                            <p className="text-sm font-bold text-gray-800">{profile.isContactViewed ? (profile.email || 'N/A') : 'example@domain.com'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-theme-pink">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-semibold">Current Residence</p>
                                            <p className="text-sm font-bold text-gray-800">{profile.location || 'India'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Blur lock state */}
                                {!profile.isContactViewed && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-amber-50/20 backdrop-blur-[2px] p-4 text-center">
                                        <Lock className="w-8 h-8 text-theme-pink mb-2" />
                                        <p className="text-xs font-bold text-[#4A3728] mb-1">Contact details hidden</p>
                                        <button 
                                            onClick={() => Swal.fire({ text: 'Upgrade to Premium to view contact details', confirmButtonColor: '#8C6D39' }).then((result) => { if (result.isConfirmed) navigate('/payment'); })}
                                            className="px-4 py-2 mt-2 bg-gradient-to-r from-theme-primary to-theme-pink hover:from-[#B59049] hover:to-[#7C5D29] text-white rounded-full font-bold text-[10px] shadow-md transition-all duration-200"
                                        >
                                            Reveal Contact
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* HOBBIES / INTERESTS */}
                        <div className="dashboard-card-bg rounded-[32px] p-6 border border-white/50 shadow-md">
                            <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2 text-[#4A3728]">
                                <Sparkles className="w-5 h-5 text-theme-pink" /> Hobbies & Interests
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {(profile?.hobbies ? profile.hobbies.split(',').filter(h => h.trim() !== '') : []).map((hobby) => (
                                    <span key={hobby} className="px-3 py-1.5 bg-gradient-to-r from-amber-50 to-[#FFF5EB] border border-theme-border/60 text-theme-pink text-[10px] font-bold rounded-full shadow-sm">
                                        {hobby}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* 2. RIGHT SCROLLABLE DETAILS (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* HEADER GLASS CARD (Name, badges, quick info) */}
                        <div className="dashboard-card-bg rounded-[32px] p-6 md:p-8 relative border border-white/50 shadow-md">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border/30 pb-6 mb-6">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h1 className="text-3xl font-bold font-serif text-[#4A3728] leading-tight">
                                            {profile.name}
                                        </h1>
                                        {profile.verificationStatus === 'VERIFIED' && (
                                            <div className="flex items-center gap-1 bg-[#E1F7FD] text-cyan-700 text-xs px-2 py-0.5 rounded-full font-bold border border-cyan-200">
                                                <BadgeCheck className="w-4 h-4 fill-cyan-500 text-white" /> Verified
                                            </div>
                                        )}
                                        <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full border border-emerald-200 uppercase font-bold tracking-wider flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
                                        </span>
                                    </div>
                                    <p className="text-xs text-theme-text-secondary mt-2 font-medium flex items-center gap-1">
                                        Profile ID: <span className="font-mono text-theme-pink font-bold">{profile.id}</span> • Managed by {profile.managedBy}
                                    </p>
                                </div>

                                {/* Option buttons / Shortlist dropdown */}
                                <div className="relative self-start sm:self-center" ref={dropdownRef}>
                                    <button 
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-theme-surface/60 hover:bg-theme-surface rounded-full border border-theme-border/60 shadow-sm transition-all text-theme-pink font-bold text-xs"
                                    >
                                        Options <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute right-0 mt-2 w-48 dashboard-card-bg rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 overflow-hidden text-left"
                                            >
                                                <button
                                                    onClick={toggleShortlist}
                                                    className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                                >
                                                    <Star className={`w-4 h-4 ${isShortlisted ? 'fill-rose-500 text-rose-500' : 'text-theme-text-secondary'}`} />
                                                    <span>{isShortlisted ? 'Remove Shortlist' : 'Add to Shortlist'}</span>
                                                </button>
                                                <button
                                                    onClick={() => Swal.fire({ text: "Report functionality coming soon.", confirmButtonColor: '#8C6D39' })}
                                                    className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                                >
                                                    <Flag className="w-4 h-4 text-theme-text-secondary" />
                                                    <span>Report Profile</span>
                                                </button>
                                                <button
                                                    onClick={() => Swal.fire({ text: "Block functionality coming soon.", confirmButtonColor: '#8C6D39' })}
                                                    className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                                >
                                                    <Ban className="w-4 h-4" />
                                                    <span>Block User</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Quick Info Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <QuickInfoCard icon={<MapPin className="w-5 h-5" />} label="Lives In" value={profile.location || 'N/A'} />
                                <QuickInfoCard icon={<Calendar className="w-5 h-5" />} label="Age" value={`${profile.age} Years`} />
                                <QuickInfoCard icon={<User className="w-5 h-5" />} label="Height" value={profile.height} />
                                <QuickInfoCard icon={<Briefcase className="w-5 h-5" />} label="Profession" value={profile.profession} />
                            </div>
                        </div>



                        {/* PHOTO GALLERY (GRID + LIGHTBOX) */}
                        <div className="dashboard-card-bg rounded-[32px] p-6 md:p-8 border border-white/50 shadow-md">
                            <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2 text-[#4A3728]">
                                <Eye className="w-5 h-5 text-theme-pink" /> Photo Gallery
                            </h3>
                            {profile.allPhotos && profile.allPhotos.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {profile.allPhotos.map((photo, index) => (
                                        <div 
                                            key={index} 
                                            onClick={() => setLightboxPhoto(photo)}
                                            className="relative aspect-square rounded-xl overflow-hidden border border-theme-border/40 shadow-sm cursor-zoom-in group"
                                        >
                                            <img src={photo} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                                                <ZoomIn className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400 text-xs">No gallery photos added yet.</div>
                            )}
                        </div>



                        {/* PERSONAL & PROFESSIONAL INFORMATION */}
                        <div className="dashboard-card-bg rounded-[32px] p-6 md:p-8 border border-white/50 shadow-md">
                            <h3 className="text-lg font-serif font-bold mb-6 flex items-center gap-2 text-[#4A3728] border-b border-theme-border/30 pb-3">
                                <User className="w-5 h-5 text-theme-pink" /> Personal & Professional Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                <InfoRow label="Full Name" value={profile.name} />
                                <InfoRow label="Managed By" value={profile.managedBy} />
                                <InfoRow label="Age / Gender" value={`${profile.age} Years / ${profile.gender}`} />
                                <InfoRow label="Height / Weight" value={`${profile.height} / ${profile.weight}`} />
                                <InfoRow label="Religion / Caste" value={`${profile.religion} / ${profile.caste}`} />
                                <InfoRow label="Mother Tongue" value={profile.motherTongue} />
                                <InfoRow label="Marital Status" value={profile.maritalStatus} />
                                <InfoRow label="Education" value={`${profile.education} ${profile.educationField ? `(${profile.educationField})` : ''}`} />
                                <InfoRow label="College Name" value={profile.college || 'Not added'} />
                                <InfoRow label="Occupation" value={profile.profession} />
                                <InfoRow label="Annual Income" value={profile.income} />
                                <InfoRow label="Horoscope Rashi" value={profile.horoscope?.rashi || 'Not Specified'} />
                                <InfoRow label="Nakshatra" value={profile.horoscope?.nakshatra || 'Not Specified'} />
                                <InfoRow label="Birth Place" value={profile.horoscope?.placeOfBirth || 'Not Specified'} />
                                <InfoRow label="Birth Time" value={profile.horoscope?.timeOfBirth || 'Not Specified'} />
                                <InfoRow label="Diet Preference" value={profile.diet} />
                            </div>
                        </div>

                    </div>
                </div>

                {/* TWO COLUMN LAYOUT: FAMILY & PARTNER EXPECTATIONS */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
                    {/* FAMILY DETAILS CARD */}
                    <div className="dashboard-card-bg rounded-[32px] p-6 md:p-8 border border-white/50 shadow-md flex flex-col h-full">
                        <h3 className="text-lg font-serif font-bold mb-6 flex items-center gap-2 text-[#4A3728] border-b border-theme-border/30 pb-3">
                            <Home className="w-5 h-5 text-theme-pink" /> Family Information
                        </h3>
                        <div className="grid grid-cols-1 gap-y-4">
                            <InfoRow label="Father Status" value={profile.family?.fatherStatus || 'Not added'} />
                            <InfoRow label="Mother Status" value={profile.family?.motherStatus || 'Not added'} />
                            <InfoRow label="Brothers Count" value={profile.family?.brothersCount || '0'} />
                            <InfoRow label="Sisters Count" value={profile.family?.sistersCount || '0'} />
                            <InfoRow label="Financial Status" value={profile.family?.familyFinancialStatus || 'Not added'} />
                            <InfoRow label="Family Location" value={profile.family?.familyLocation || 'Not added'} />
                        </div>
                    </div>

                    {/* PARTNER PREFERENCES GLASS CARD */}
                    <div className="dashboard-card-bg rounded-[32px] p-6 md:p-8 border border-white/50 shadow-md border border-theme-border/60 bg-gradient-to-tr from-[#FFFDFB] to-[#FAF5EF] flex flex-col h-full">
                        <h3 className="text-lg font-serif font-bold mb-6 flex items-center gap-2 text-[#4A3728] border-b border-theme-border/30 pb-3">
                            <HeartHandshake className="w-5 h-5 text-theme-pink" /> Partner Expectations
                        </h3>
                        
                        {preferenceMatch ? (
                            <div className="space-y-3 flex-1">
                                <div className="bg-[#8C6D39]/5 border border-[#8C6D39]/10 rounded-xl p-2.5 mb-3 text-center">
                                    <p className="text-[13px] font-semibold text-theme-pink">
                                        🎉 You match {preferenceMatch.matchedCount} of {preferenceMatch.totalPreferences} expectations 🎉
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {preferenceMatch.matchList.map((pref, i) => (
                                        <div key={i} className="flex justify-between items-center px-3 py-2 bg-theme-surface/50 rounded-lg border border-theme-border/30">
                                            <div>
                                                <span className="text-[10px] uppercase font-bold text-gray-400 block">{pref.fieldLabel}</span>
                                                <span className="text-xs font-bold text-gray-700">{pref.prefValue}</span>
                                            </div>
                                            <div className="flex-shrink-0">
                                                {pref.isMatch ? (
                                                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                                    </span>
                                                ) : (
                                                    <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs">—</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <p className="text-center py-6 text-xs text-gray-400">Expectations not specified.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* LIGHTBOX / IMAGE PREVIEW MODAL */}
            {lightboxPhoto && (
                <div 
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 cursor-zoom-out"
                    onClick={() => setLightboxPhoto(null)}
                >
                    <button className="absolute top-4 right-4 bg-theme-surface/10 hover:bg-theme-surface/20 p-2.5 rounded-full text-white transition-all">
                        <X className="w-6 h-6" />
                    </button>
                    <img src={lightboxPhoto} alt="" className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain animate-zoomIn" />
                </div>
            )}

            {/* Mobile Actions Removed - Displayed inline under photo instead */}
            {/* Custom Styles */}
            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.72);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    box-shadow: 0 16px 36px rgba(140, 109, 57, 0.08);
                    border-radius: 28px;
                    transition: all 0.3s ease;
                }
                .glass-card:hover {
                    box-shadow: 0 20px 48px rgba(140, 109, 57, 0.12);
                    border-color: rgba(255, 255, 255, 0.8);
                }
                @keyframes zoomIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-zoomIn {
                    animation: zoomIn 0.25s ease-out;
                }
            `}</style>

        </div>
    );
};

const QuickInfoCard = ({ icon, label, value }) => (
    <div className="bg-theme-surface/60 p-4 rounded-2xl border border-theme-border/30 flex flex-col items-center text-center shadow-sm hover:bg-theme-surface hover:shadow-md transition-all duration-200">
        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-theme-pink mb-2.5">
            {icon}
        </div>
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-0.5">{label}</span>
        <span className="text-xs font-bold text-[#4A3728] leading-tight line-clamp-2">{value}</span>
    </div>
);

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-100/60 last:border-b-0">
        <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-theme-magenta"></span>
            <span className="text-xs font-medium text-theme-text-secondary">{label}</span>
        </div>
        <span className="text-xs font-bold text-gray-800 text-right max-w-[200px] truncate">{value || 'Not added'}</span>
    </div>
);

export default MatchProfileDetails;
