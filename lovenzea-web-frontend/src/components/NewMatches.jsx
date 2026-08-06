import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Camera, Star } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { formatDisplayName } from '../utils/mockData';
import { fetchNewMatches } from '../Slice/MatchSlice';

const NewMatches = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { newMatches, loading } = useSelector((state) => state.match);

    const [matches, setMatches] = useState([]);

    React.useEffect(() => {
        dispatch(fetchNewMatches({ page: 0, size: 5 }));
    }, [dispatch]);

    React.useEffect(() => {
        if (newMatches) {
            setMatches(newMatches.map(m => ({
                id: m.userId || m.id,
                name: formatDisplayName(m.fullName, m.displayNameVisibility, m.id),
                age: m.age,
                height: m.height || "5'4\"",
                ethnicity: m.religion || "Marathi",
                location: m.city,
                profession: m.occupation,
                image: m.profilePhotoUrl,
                hasPhoto: !!m.profilePhotoUrl,
                isFavorite: false,
                isOnline: m.isOnline,
                isVerified: m.verificationStatus === 'Verified'
            })));
        }
    }, [newMatches]);

    const toggleFavorite = (id, name, e) => {
        e.stopPropagation();
        setMatches(matches.map(match =>
            match.id === id ? { ...match, isFavorite: !match.isFavorite } : match
        ));

        const match = matches.find(m => m.id === id);
        toast.info(match.isFavorite ? `Removed ${name} from favorites` : `Added ${name} to favorites`, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
        });
    };

    const handleProfileClick = (id, name) => {
        navigate(`/matches/${id}`);
    };

    const handleConnect = (id, name, e) => {
        e.stopPropagation();
        toast.success(`✓ Interest sent to ${name}`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
        });
    };

    const handleRequestPhoto = (id, name, e) => {
        e.stopPropagation();
        toast.info(`📸 Photo request sent to ${name}`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
        });
    };

    const handleMessage = (id, name, e) => {
        e.stopPropagation();
        navigate(`/chat/${id}`);
    };

    return (
        <div className=''>
            <ToastContainer />

            {/* Compact Container - Only shown on desktop/tablet (768px and larger) */}
            <div className=" bg-theme-surface rounded-md shadow-sm border border-theme-border p-3 mx-auto">

                {/* Compact Header */}
                <div className="pb-2 mb-3 border-b border-theme-border">
                    <h2 className="text-base font-semibold text-gray-800">New Matches for you</h2>
                    <p className="text-theme-text-secondary text-xs">({matches.length} matches)</p>
                </div>

                {/* Compact Matches List */}
                <div className="space-y-3">
                    {matches.map((match) => (
                        <div
                            key={match.id}
                            onClick={() => handleProfileClick(match.id, match.name)}
                            className="flex items-start gap-2 p-2 border border-theme-border rounded hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            {/* Smaller Profile Image */}
                            <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 rounded overflow-hidden border border-gray-300">
                                    {match.hasPhoto ? (
                                        <img
                                            src={match.image}
                                            alt={match.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <Camera className="w-4 h-4 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Small Status Indicators */}
                                {match.isOnline && (
                                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-theme-success rounded-full border border-white"></div>
                                )}

                                {match.isVerified && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                        <Star className="w-1.5 h-1.5 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Compact Profile Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-0.5">
                                    <h3 className="font-medium text-sm text-gray-900 truncate">
                                        {match.name}
                                    </h3>
                                    <button
                                        onClick={(e) => toggleFavorite(match.id, match.name, e)}
                                        className={`p-0.5 ${match.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                    >
                                        <Heart className={`w-3 h-3 ${match.isFavorite ? 'fill-red-500' : ''}`} />
                                    </button>
                                </div>

                                {/* Compact Details */}
                                <p className="text-xs text-theme-text-secondary mb-0.5">
                                    {match.age} yrs, {match.height}, {match.ethnicity}
                                </p>

                                <div className="text-xs text-theme-text-secondary mb-1.5">
                                    <span>{match.location}</span>
                                    {match.profession && (
                                        <span className="ml-1 font-medium truncate">{match.profession}</span>
                                    )}
                                </div>

                                {/* Compact Action Buttons */}
                                <div className="flex flex-wrap gap-1.5">
                                    <button
                                        onClick={(e) => handleConnect(match.id, match.name, e)}
                                        className="px-2 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded text-xs font-medium flex items-center gap-0.5"
                                    >
                                        <Heart className="w-2.5 h-2.5" />
                                        Connect
                                    </button>

                                    {!match.hasPhoto && (
                                        <button
                                            onClick={(e) => handleRequestPhoto(match.id, match.name, e)}
                                            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-medium flex items-center gap-0.5"
                                        >
                                            <Camera className="w-2.5 h-2.5" />
                                            Photo
                                        </button>
                                    )}

                                    <button
                                        onClick={(e) => handleMessage(match.id, match.name, e)}
                                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium flex items-center gap-0.5"
                                    >
                                        <MessageCircle className="w-2.5 h-2.5" />
                                        Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Compact Footer */}
                <div className="mt-4 pt-3 border-t border-theme-border">
                    <div className="flex justify-between items-center">
                        <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium">
                            Filter
                        </button>

                        <button
                            onClick={() => navigate('/matches')}
                            className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded text-xs font-medium"
                        >
                            View All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewMatches;
