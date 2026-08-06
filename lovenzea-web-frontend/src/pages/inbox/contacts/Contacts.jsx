import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { fetchViewedContacts } from '../../../Slice/UserSlice';
import Sidebar from './Sidebar';
import ContactProfileCard from './ContactProfileCard';
import { formatDisplayName } from '../../../utils/mockData';
import { openChatWith } from '../../../Slice/ChatSlice';

export default function Contacts() {
    const dispatch = useDispatch();
    const [sortBy, setSortBy] = useState('newest');
    const [filterBy, setFilterBy] = useState('all');

    const { viewedContacts, viewedContactsLoading, user } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchViewedContacts());
    }, [dispatch]);

    const normalizeProfile = (item) => {
        // item might be the profile directly or an object containing profile and metadata
        const profile = item.viewedProfile || item; 
        if (!profile) return null;

        return {
            id: profile.id,
            name: formatDisplayName(profile.fullName, profile.displayNameVisibility, profile.id) || "Member",
            image: profile.profilePhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formatDisplayName(profile.fullName, profile.displayNameVisibility, profile.id) || 'User')}&background=random`,
            online: profile.isOnline || false,
            onlineTime: 'recently',
            date: item.viewedAt ? new Date(item.viewedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Recently',
            dateObj: item.viewedAt ? new Date(item.viewedAt) : new Date(),
            age: profile.age ? `${profile.age} yrs` : "N/A",
            height: profile.height || "N/A",
            languages: profile.motherTongue || "N/A",
            location: `${profile.city || ''}, ${profile.state || ''}`.trim().replace(/^,|,$/g, ''),
            education: profile.educationLevel || profile.education || "N/A",
            profession: profile.occupation || profile.profession || "N/A",
            verified: profile.verificationStatus === "VERIFIED",
            isPremium: profile.isPremium || false,
            premiumVisible: profile.premiumVisible,
            hasPhoto: !!profile.profilePhotoUrl,
            phone: profile.mobile || profile.phone || "Not Shared",
            gender: profile.gender
        };
    };

    const getProcessedProfiles = () => {
        let profiles = viewedContacts.map(normalizeProfile).filter(p => p !== null);

        // Apply filters
        if (filterBy !== 'all') {
            profiles = profiles.filter(p => {
                switch (filterBy) {
                    case 'premium': return p.isPremium;
                    case 'verified': return p.verified;
                    case 'with-photos': return p.hasPhoto;
                    default: return true;
                }
            });
        }

        // Apply sorting
        profiles.sort((a, b) => {
            if (sortBy === 'newest') return b.dateObj - a.dateObj;
            if (sortBy === 'oldest') return a.dateObj - b.dateObj;
            return 0;
        });

        return profiles;
    };

    const currentProfiles = getProcessedProfiles();

    return (
        <div className="min-h-screen bg-[#f5f5f5] py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
            <div className="max-w-[1600px] mx-auto">
                <header className="mb-4 sm:mb-6 lg:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#4a4a4a]">
                        Viewed Contacts ({currentProfiles.length})
                    </h1>
                    <p className="text-theme-text-secondary mt-1">History of profiles whose contact details you have viewed.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] gap-4 sm:gap-6">
                    <Sidebar
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        filterBy={filterBy}
                        setFilterBy={setFilterBy}
                    />

                    <main className="flex flex-col gap-4 sm:gap-6">
                        {viewedContactsLoading ? (
                            <div className="bg-theme-surface rounded-lg shadow-md p-10 text-center text-theme-text-secondary">
                                <div className="animate-spin inline-block w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full mb-4"></div>
                                <p>Loading viewed contacts...</p>
                            </div>
                        ) : currentProfiles.length > 0 ? (
                            currentProfiles.map((profile) => (
                                <ContactProfileCard
                                    key={profile.id}
                                    profile={profile}
                                    onChat={() => {
                                        dispatch(openChatWith({
                                            id: profile.id,
                                            fullName: profile.name,
                                            profilePhotoUrl: profile.image,
                                            displayNameVisibility: null
                                        }));
                                    }}
                                    onWhatsApp={() => {
                                        if (profile.phone && profile.phone !== "Not Shared") {
                                            const cleanPhone = profile.phone.replace(/\D/g, '');
                                            window.open(`https://wa.me/${cleanPhone}`, '_blank');
                                        } else {
                                            Swal.fire({ text: "Phone number not available.", confirmButtonColor: '#8C6D39' });
                                        }
                                    }}
                                    onCall={() => {
                                        if (profile.phone && profile.phone !== "Not Shared") {
                                            window.open(`tel:${profile.phone}`, '_self');
                                        } else {
                                            Swal.fire({ text: "Phone number not available.", confirmButtonColor: '#8C6D39' });
                                        }
                                    }}
                                />
                            ))
                        ) : (
                            <div className="bg-theme-surface rounded-lg shadow-md p-10 text-center text-theme-text-secondary">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No viewed contacts yet</h3>
                                <p>Profiles whose contacts you unlock will appear here.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
