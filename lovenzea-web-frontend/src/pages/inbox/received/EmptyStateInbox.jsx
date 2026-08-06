import { useNavigate } from "react-router-dom";
import { Mail, Heart, ArrowRight } from "lucide-react";

export default function EmptyStateInbox() {
    const navigate = useNavigate();

    const handleViewMatches = () => {
        navigate("/matches");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-2xl text-center">
                {/* Red Circle with Mail Icon and Heart */}
                <div className="mb-10 relative inline-block">
                    {/* Main Red Circle */}
                    <div className="relative bg-gradient-to-br from-red-500 to-red-600 rounded-full w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center shadow-2xl">
                        <Mail className="w-20 h-20 sm:w-24 sm:h-24 text-white" strokeWidth={2} />
                    </div>

                    {/* Small Heart Icon - Top Right */}
                    <div className="absolute -top-2 -right-2 sm:top-0 sm:right-0 bg-theme-surface rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-lg">
                        <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-red-500 fill-red-500" />
                    </div>
                </div>

                {/* Text Content */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 px-4 leading-tight">
                    There are no Pending Invitations to Connect
                </h1>

                {/* CTA Button */}
                <button
                    onClick={handleViewMatches}
                    className="group inline-flex items-center justify-center gap-3 px-10 sm:px-12 py-4 sm:py-5 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-lg sm:text-xl rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300 active:scale-95"
                >
                    <span>View My Matches</span>
                    <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 transform transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </div>
    );
}