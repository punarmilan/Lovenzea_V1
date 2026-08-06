import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Star, MapPin, Briefcase, GraduationCap } from "lucide-react";

export default function MatchesPage() {
    const navigate = useNavigate();

    const handleBackToInbox = () => {
        navigate("/inbox");
    };

    // Sample matches data
    const matches = [
        {
            id: 1,
            name: "Priya Sharma",
            age: 26,
            location: "Mumbai, Maharashtra",
            education: "MBA",
            profession: "Software Engineer",
            image: "PS",
            matchScore: 95
        },
        {
            id: 2,
            name: "Anjali Patel",
            age: 25,
            location: "Pune, Maharashtra",
            education: "B.Tech",
            profession: "Business Analyst",
            image: "AP",
            matchScore: 92
        },
        {
            id: 3,
            name: "Neha Desai",
            age: 27,
            location: "Nagpur, Maharashtra",
            education: "M.Sc",
            profession: "Data Scientist",
            image: "ND",
            matchScore: 88
        },
        {
            id: 4,
            name: "Sneha Kulkarni",
            age: 24,
            location: "Nashik, Maharashtra",
            education: "B.Com",
            profession: "Marketing Manager",
            image: "SK",
            matchScore: 85
        }
    ];

    return (
        <div className="min-h-screen pb-20  pt-4 xs:pt-6 sm:pt-8 overflow-x-hidden">
            
            {/* Header */}
            <div className="bg-theme-surface shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBackToInbox}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-theme-text-secondary" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Your Matches</h1>
                            <p className="text-sm text-theme-text-secondary">Find your perfect match</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {matches.map((match) => (
                        <div
                            key={match.id}
                            className="bg-theme-surface rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                            {/* Profile Image Placeholder */}
                            <div className="relative h-64 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                                <div className="text-6xl font-bold text-white">
                                    {match.image}
                                </div>
                                {/* Match Score Badge */}
                                <div className="absolute top-4 right-4 bg-theme-surface rounded-full px-3 py-1 shadow-lg flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-bold text-gray-800">
                                        {match.matchScore}%
                                    </span>
                                </div>
                                {/* Favorite Icon */}
                                <button className="absolute top-4 left-4 p-2 bg-theme-surface rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                                    <Heart className="w-5 h-5 text-red-500" />
                                </button>
                            </div>

                            {/* Profile Info */}
                            <div className="p-5">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                                        {match.name}
                                    </h3>
                                    <p className="text-theme-text-secondary text-sm">{match.age} years</p>
                                </div>

                                <div className="space-y-3 mb-5">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-theme-text-secondary line-clamp-2">
                                            {match.location}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-theme-text-secondary">
                                            {match.education}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-theme-text-secondary">
                                            {match.profession}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg">
                                        Connect
                                    </button>
                                    <button className="px-4 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State if no matches */}
                {matches.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-block p-8 bg-theme-surface rounded-full shadow-lg mb-6">
                            <Heart className="w-16 h-16 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-3">
                            No Matches Yet
                        </h2>
                        <p className="text-theme-text-secondary mb-8">
                            We're working on finding the best matches for you
                        </p>
                        <button
                            onClick={handleBackToInbox}
                            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
                        >
                            Back to Inbox
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}