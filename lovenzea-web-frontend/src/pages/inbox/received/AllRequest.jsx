import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SortComponent from "./SortFilter";
import FilterComponent from "./Filter";
import EmptyStateInbox from "./EmptyStateInbox";
import { fetchReceivedRequests, acceptConnectionRequest, declineConnectionRequest } from "../../../Slice/MatchSlice";
import { Check, X, MapPin, Briefcase, GraduationCap, Star } from "lucide-react";
import { formatDisplayName } from "../../../utils/mockData";
import PremiumLock from "../../../components/PremiumLock";

export default function AllRequest() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { receivedRequests, loading } = useSelector((state) => state.match);
    const [activeTab, setActiveTab] = useState("all");
    const [sortBy, setSortBy] = useState("relevant");
    const [filterBy, setFilterBy] = useState("all");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchReceivedRequests());
    }, [dispatch]);

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    const handleFilterChange = (value) => {
        setFilterBy(value);
    };

    const handleAccept = (requestId) => {
        dispatch(acceptConnectionRequest(requestId));
    };

    const handleDecline = (requestId) => {
        dispatch(declineConnectionRequest(requestId));
    };

    const getProcessedRequests = () => {
        let processed = [...receivedRequests];

        // Apply filters
        if (filterBy !== "all") {
            processed = processed.filter((req) => {
                const profile = req.senderProfile;
                if (!profile) return false;

                switch (filterBy) {
                    case "blue-tick":
                        return profile.verificationStatus === "VERIFIED";
                    case "premium":
                        return profile.isPremium === true;
                    case "online":
                        return profile.isOnline === true;
                    case "phone-verified":
                        return profile.mobileVerified === true;
                    case "with-photos":
                        return !!profile.profilePhotoUrl;
                    default:
                        return true;
                }
            });
        }

        // Apply sorting
        processed.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);

            if (sortBy === "newest") {
                return dateB - dateA;
            } else if (sortBy === "oldest") {
                return dateA - dateB;
            } else if (sortBy === "relevant") {
                // For relevant, show premium members first, then by newest
                if (a.senderProfile?.isPremium && !b.senderProfile?.isPremium) return -1;
                if (!a.senderProfile?.isPremium && b.senderProfile?.isPremium) return 1;
                return dateB - dateA;
            }
            return 0;
        });

        return processed;
    };

    const processedRequests = getProcessedRequests();

    const RequestCard = ({ request }) => {
        const profile = request.senderProfile;

        return (
            <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Profile Image */}
                    <div 
                        className="relative flex-shrink-0 cursor-pointer"
                        onClick={() => navigate(`/matches/${profile.userId}`)}
                    >
                        <img
                            src={profile.profilePhotoUrl || "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg"}
                            alt={profile.fullName}
                            className={`w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover border-2 shadow-sm ${profile.isPremium ? 'border-amber-400' : 'border-gray-100'} ${profile.premiumVisible === false ? 'blur-md' : ''}`}
                        />
                        {profile.premiumVisible === false && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                <PremiumLock />
                            </div>
                        )}
                        {profile.isPremium && (
                            <div className="absolute -top-2 -left-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-md z-10">
                                <Star size={10} className="fill-white" />
                                PLUS
                            </div>
                        )}
                    </div>

                    {/* Profile Details */}
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 
                                    className="text-lg font-bold text-gray-900 hover:text-cyan-600 transition-colors cursor-pointer flex items-center gap-2"
                                    onClick={() => navigate(`/matches/${profile.userId}`)}
                                >
                                    {formatDisplayName(profile.fullName, profile.displayNameVisibility, profile.id)}
                                    {profile.isPremium && (
                                        <div className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-200 flex items-center gap-1 mt-0.5">
                                            <Star className="w-3 h-3 fill-amber-500" /> Premium
                                        </div>
                                    )}
                                </h3>
                                <p className="text-sm text-theme-text-secondary mt-0.5">
                                    {profile.age} yrs • {profile.height} • {profile.religion}, {profile.motherTongue}
                                </p>
                            </div>
                            <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">
                                Received {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                            <div className="flex items-center gap-2 text-theme-text-secondary">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm truncate">{profile.city}, {profile.state}</span>
                            </div>
                            <div className="flex items-center gap-2 text-theme-text-secondary">
                                <Briefcase className="w-4 h-4 text-gray-400" />
                                <span className="text-sm truncate">{profile.occupation}</span>
                            </div>
                            <div className="flex items-center gap-2 text-theme-text-secondary">
                                <GraduationCap className="w-4 h-4 text-gray-400" />
                                <span className="text-sm truncate">{profile.educationLevel}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-5 flex items-center gap-3">
                            <button
                                onClick={() => handleAccept(request.id)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-theme-success hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                            >
                                <Check className="w-4 h-4" />
                                <span>Accept</span>
                            </button>
                            <button
                                onClick={() => handleDecline(request.id)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white/40 backdrop-blur-md hover:bg-red-50 text-red-500 border border-red-200 font-semibold rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                                <span>Decline</span>
                            </button>
                            <button
                                onClick={() => navigate(`/matches/${profile.userId}`)}
                                className="hidden sm:flex items-center justify-center px-4 py-2.5 text-theme-text-secondary hover:text-cyan-600 font-medium transition-colors"
                            >
                                View Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden sticky top-0 z-20 bg-white/40 backdrop-blur-md border-b border-white/50 px-4 py-3">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="flex items-center gap-2 text-gray-700 font-medium"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span>Filters & Sort</span>
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                    {/* Sidebar */}
                    <aside className={`
                        lg:w-80 xl:w-96 flex-shrink-0
                        ${isSidebarOpen ? "fixed" : "hidden"}
                        lg:block lg:static
                        inset-y-0 left-0 z-40
                        bg-white/40 backdrop-blur-md lg:bg-transparent
                        overflow-y-auto w-80 p-4 lg:p-0
                    `}>
                        <div className="sticky top-4 space-y-4 sm:space-y-6">
                            <SortComponent onSortChange={handleSortChange} defaultValue={sortBy} />
                            <FilterComponent onFilterChange={handleFilterChange} defaultValue={filterBy} />
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white/40 backdrop-blur-md rounded-lg sm:rounded-xl shadow-sm border border-white/50 overflow-hidden">
                            {/* Tabs */}
                            <div className="border-b border-white/50">
                                <div className="flex">
                                    <button
                                        onClick={() => setActiveTab("all")}
                                        className={`flex-1 px-4 sm:px-6 py-4 text-sm sm:text-base font-medium transition-all relative ${activeTab === "all" ? "text-cyan-600 bg-cyan-50/30" : "text-theme-text-secondary hover:text-gray-800"}`}
                                    >
                                        Pending Invitations ({processedRequests.length})
                                        {activeTab === "all" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 animate-in fade-in slide-in-from-bottom-1"></div>}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("filtered")}
                                        className={`flex-1 px-4 sm:px-6 py-4 text-sm sm:text-base font-medium transition-all relative ${activeTab === "filtered" ? "text-cyan-600 bg-cyan-50/30" : "text-theme-text-secondary hover:text-gray-800"}`}
                                    >
                                        Filtered Out
                                        {activeTab === "filtered" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 animate-in fade-in slide-in-from-bottom-1"></div>}
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 sm:p-6 min-h-[500px]">
                                {loading && receivedRequests.length === 0 ? (
                                    <div className="flex items-center justify-center h-64">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                                    </div>
                                ) : activeTab === "all" ? (
                                    processedRequests.length > 0 ? (
                                        <div className="space-y-4">
                                            {processedRequests.map((request) => (
                                                <RequestCard key={request.id} request={request} />
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyStateInbox />
                                    )
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <X className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-medium text-gray-900 mb-2">No Filtered Requests</h3>
                                        <p className="text-theme-text-secondary">Profiles you filter out will appear here.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
