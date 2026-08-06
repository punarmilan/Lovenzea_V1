import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPhotoRequests } from '../../../Slice/MatchSlice';
import EmptyState from '../requests/RequestEmpty';
import ProfileCard from '../requests/RequestProfileCard';
import Pagination from '../requests/RequestPagination';
import { formatDisplayName } from '../../../utils/mockData';

// Import images at the top of the file
import img1 from '../../../assets/image/closejpg.jpg';
import img2 from '../../../assets/image/full-view.jpg';
import img3 from '../../../assets/image/side-face.jpg';

const SentRequests = ({ filters, sortBy, filterBy }) => {
    const dispatch = useDispatch();
    const { photoRequestsSent, loading } = useSelector((state) => state.match);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        dispatch(fetchPhotoRequests());
    }, [dispatch]);

    const normalizeRequest = (req) => {
        const profile = req.receiverProfile;
        if (!profile) return null;

        return {
            id: req.id,
            name: formatDisplayName(profile.fullName, profile.displayNameVisibility, profile.id) || "Member",
            age: profile.age || "N/A",
            height: profile.height || "N/A",
            language: `${profile.motherTongue || ''}, ${profile.caste || ''}`.trim().replace(/^,|,$/g, ''),
            location: `${profile.city || ''}, ${profile.state || ''}`.trim().replace(/^,|,$/g, ''),
            education: profile.educationLevel || profile.education || "N/A",
            employment: profile.occupation || profile.profession || "N/A",
            onlineStatus: profile.isOnline ? 'Online now' : 'Away',
            requestType: req.requestType === 'PHOTO' ? 'Photo Request Sent' : 'Request Sent',
            requestDate: new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            dateObj: new Date(req.createdAt),
            requestMessage: req.requestType === 'PHOTO' ? 'You requested her to add Photo on' : 'You sent a request on',
            hasCrown: profile.isPremium || false,
            isVerified: profile.verificationStatus === 'VERIFIED',
            isPremium: profile.isPremium || false,
            premiumVisible: profile.premiumVisible,
            hasPhoto: !!profile.profilePhotoUrl,
            avatar: '👤',
            img: profile.profilePhotoUrl || img1,
        };
    };

    const sentRequests = photoRequestsSent.map(normalizeRequest).filter(r => r !== null);

    // Filter and sort profiles
    const getFilteredProfiles = () => {
        let processed = [...sentRequests];

        // 1. Apply Request Type filters (Photo/Phone)
        if (!filters.allRequests) {
            processed = processed.filter(profile => {
                if (filters.photoRequests && profile.requestType.includes('Photo')) return true;
                if (filters.phoneRequests && profile.requestType.includes('Phone')) return true;
                return false;
            });
        }

        // 2. Apply Granular Profile filters
        if (filterBy !== 'all') {
            processed = processed.filter(profile => {
                switch (filterBy) {
                    case 'premium': return profile.isPremium;
                    case 'verified': return profile.isVerified;
                    case 'with-photos': return profile.hasPhoto;
                    default: return true;
                }
            });
        }

        // 3. Apply Sorting
        processed.sort((a, b) => {
            if (sortBy === 'newest') return b.dateObj - a.dateObj;
            if (sortBy === 'oldest') return a.dateObj - b.dateObj;
            if (sortBy === 'relevant') {
                if (a.isPremium && !b.isPremium) return -1;
                if (!a.isPremium && b.isPremium) return 1;
                return b.dateObj - a.dateObj;
            }
            return 0;
        });

        return processed;
    };

    const filteredProfiles = getFilteredProfiles();
    const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);

    // Reset to page 1 when filters or sorting change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, sortBy, filterBy]);

    // Page change handler
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Get current page items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProfiles.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="animate-fadeIn">
            {currentItems.length > 0 ? (
                <>
                    {/* Render profile cards */}
                    {currentItems.map((profile, index) => (
                        <ProfileCard key={profile.id} profile={profile} index={index} />
                    ))}

                    {/* Always show pagination when there are items */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredProfiles.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                </>
            ) : (
                <EmptyState
                    message="There are no Sent Requests"
                    submessage="Requests you've sent to other members will appear here"
                />
            )}
        </div>
    );
};

export default SentRequests;