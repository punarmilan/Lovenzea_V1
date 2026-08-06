import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAcceptedByMe, fetchAcceptedByHer } from '../../../Slice/MatchSlice';
import Sidebar from './Sidebar';
import ProfileCard from './ProfileCard';
import Pagination from './Pagination';
import PaymentModal from './PaymentModel';
import { formatDisplayName } from '../../../utils/mockData';
import { openChatWith } from '../../../Slice/ChatSlice';

// Main App Component
export default function App() {
    const dispatch = useDispatch();
    const [activeFilter, setActiveFilter] = useState('me');
    const [sortBy, setSortBy] = useState('newest');
    const [filterBy, setFilterBy] = useState('all');
    const [showPayment, setShowPayment] = useState(false);

    const { acceptedByMe, acceptedByHer, loading } = useSelector((state) => state.match);

    useEffect(() => {
        dispatch(fetchAcceptedByMe());
        dispatch(fetchAcceptedByHer());
    }, [dispatch]);

    const normalizeProfile = (req) => {
        const profile = activeFilter === 'me' ? req.senderProfile : req.receiverProfile;
        if (!profile) return null;

        return {
            id: profile.id,
            name: formatDisplayName(profile.fullName, profile.displayNameVisibility, profile.id) || "Member",
            image: profile.profilePhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formatDisplayName(profile.fullName, profile.displayNameVisibility, profile.id) || 'User')}&background=random`,
            online: profile.isOnline || false,
            onlineTime: '1d ago',
            date: new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
            dateObj: new Date(req.createdAt),
            age: profile.age ? `${profile.age} yrs` : "N/A",
            height: profile.height || "N/A",
            languages: profile.motherTongue || "N/A",
            location: `${profile.city || ''}, ${profile.state || ''}`.trim().replace(/^,|,$/g, ''),
            education: profile.educationLevel || profile.education || "N/A",
            profession: profile.occupation || profile.profession || "N/A",
            verified: profile.verificationStatus === "VERIFIED",
            isPremium: profile.isPremium || false,
            premiumVisible: profile.premiumVisible,
            hasPhoto: !!profile.profilePhotoUrl
        };
    };

    const getProcessedProfiles = () => {
        const requests = activeFilter === 'me' ? acceptedByMe : acceptedByHer;
        let profiles = requests.map(normalizeProfile).filter(p => p !== null);

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
            if (sortBy === 'relevant') {
                if (a.isPremium && !b.isPremium) return -1;
                if (!a.isPremium && b.isPremium) return 1;
                return b.dateObj - a.dateObj;
            }
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
                        Accepted Invitations ({currentProfiles.length})
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] gap-4 sm:gap-6">
                    <Sidebar
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        filterBy={filterBy}
                        setFilterBy={setFilterBy}
                    />

                    <main className="flex flex-col gap-4 sm:gap-6">
                        {loading ? (
                            <div className="text-center py-20 text-theme-text-secondary">Loading requests...</div>
                        ) : currentProfiles.length > 0 ? (
                            currentProfiles.map((profile) => (
                                <ProfileCard
                                    key={profile.id}
                                    profile={profile}
                                    onUpgrade={() => setShowPayment(true)}
                                    onChat={() => {
                                        dispatch(openChatWith({
                                            id: profile.id,
                                            fullName: profile.name,
                                            profilePhotoUrl: profile.image,
                                            displayNameVisibility: null
                                        }));
                                    }}
                                    onWhatsApp={() => {
                                        if (profile.phone) window.open(`https://wa.me/${profile.phone}`, '_blank');
                                        else Swal.fire({ text: "Phone number not available.", confirmButtonColor: '#8C6D39' });
                                    }}
                                    onCall={() => {
                                        if (profile.phone) window.open(`tel:${profile.phone}`, '_self');
                                        else Swal.fire({ text: "Phone number not available.", confirmButtonColor: '#8C6D39' });
                                    }}
                                />
                            ))
                        ) : (
                            <div className="bg-theme-surface rounded-lg shadow-md p-10 text-center text-theme-text-secondary">
                                No accepted requests found matching your filters.
                            </div>
                        )}
                        <Pagination currentPage={1} totalPages={1} />
                    </main>
                </div>
            </div>

            {showPayment && <PaymentModal onClose={() => setShowPayment(false)} />}
        </div>
    );
}
