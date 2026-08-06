import { useNavigate } from "react-router-dom";
import { Mail, Heart, ArrowRight } from "lucide-react";

export default function EmptyStateInbox() {
    const navigate = useNavigate();

    const handleViewMatches = () => {
        navigate("/matches");
    };

    return (
        <div className="w-full h-full flex items-center justify-center py-16 px-4">
            <div className="text-center max-w-md">
                {/* Illustration Container */}
                <div className="mb-8 inline-block relative">
                    {/* Character illustration placeholder */}
                    <div className="relative w-48 h-48 mx-auto mb-4">
                        {/* Main character circle */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 bg-theme-surface rounded-full border-4 border-gray-800 relative">
                                {/* Face */}
                                <div className="absolute top-10 left-8 flex gap-3">
                                    <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                                    <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                                </div>
                                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-800 rounded-full"></div>
                            </div>

                            {/* Hair buns */}
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800 rounded-full"></div>
                            <div className="absolute -top-2 -left-2 w-8 h-8 bg-gray-800 rounded-full"></div>

                            {/* Red hearts on buns */}
                            <div className="absolute -top-1 -right-1">
                                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                            </div>
                            <div className="absolute -top-1 -left-1">
                                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                            </div>

                            {/* Body */}
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-20 h-16 bg-red-500 rounded-t-full"></div>

                            {/* Arms */}
                            <div className="absolute bottom-0 -left-6 w-12 h-3 bg-gray-200 rounded-full transform rotate-45"></div>
                            <div className="absolute bottom-0 -right-6 w-12 h-3 bg-gray-200 rounded-full transform -rotate-45"></div>
                        </div>

                        {/* Mailbox */}
                        <div className="absolute -left-12 top-1/2 transform -translate-y-1/2">
                            <div className="relative">
                                {/* Mailbox post */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-16 bg-red-800"></div>
                                {/* Mailbox */}
                                <div className="relative w-12 h-10 bg-red-600 rounded-lg">
                                    <div className="absolute top-0 left-0 right-0 h-6 bg-red-500 rounded-t-lg"></div>
                                    <div className="absolute bottom-2 left-2 w-2 h-2 bg-theme-surface rounded-full"></div>
                                </div>
                                {/* Flag */}
                                <div className="absolute -right-1 top-2 w-4 h-3 bg-yellow-400 rounded-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-normal text-gray-700 mb-2 leading-tight">
                        There are no Pending Invitations to Connect
                    </h2>
                </div>

                {/* CTA Button */}
                <button
                    onClick={handleViewMatches}
                    className="group inline-flex items-center justify-center gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium text-base rounded-full shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                    <span>View My Matches</span>
                    <ArrowRight className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </div>
    );
}