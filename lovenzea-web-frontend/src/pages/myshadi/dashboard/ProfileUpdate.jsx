import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProfileUpdate = () => {
    const navigate = useNavigate();
    const { summary } = useSelector((state) => state.dashboard);
    const user = summary?.user;

    const handleViewMatches = () => {
        navigate('/matches');
    };

    return (
        <div className="w-full">
            {/* Header - More compact */}
            <div className="mb-4 px-1">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Profile Status</h1>
            </div>

            {/* Main Card - Reduced padding and shadows */}
            <div className="bg-theme-surface rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10">
                        {/* Left Side - Smaller Badge Illustration */}
                        <div className="flex-shrink-0">
                            <BadgeIllustration />
                        </div>

                        {/* Right Side - Content */}
                        <div className="flex-1 text-center sm:text-left space-y-3">
                            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 leading-tight">
                                {user?.fullName ? `${user.fullName}, your` : 'Your'} profile is how matches see you.
                            </h2>

                            <p className="text-theme-text-secondary text-sm md:text-base">
                                Thanks for keeping it updated! Check out your new matches.
                            </p>

                            <div className="pt-2">
                                <button
                                    onClick={handleViewMatches}
                                    className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold py-2.5 px-6 md:px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 text-sm md:text-base cursor-pointer"
                                >
                                    View Today's Matches
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Badge Illustration Component
const BadgeIllustration = () => {
    return (
        <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 z-0 [isolation:isolate]">
            {/* Floating decorative elements */}
            <div className="absolute -top-6 -left-6 w-8 h-2 bg-orange-300 rounded-full transform rotate-45 animate-pulse"></div>
            <div className="absolute -top-4 -right-4 w-6 h-6 border-4 border-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-3 -left-5 w-5 h-5 border-3 border-blue-300 rounded-full"></div>
            <div className="absolute top-1/3 -right-8 w-4 h-4 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-8 -right-6 w-2 h-8 bg-pink-300 rounded-full transform -rotate-45"></div>
            <div className="absolute top-2 -left-2 w-5 h-5 bg-cyan-200 rounded-full"></div>
            <div className="absolute bottom-1/4 -left-7 w-3 h-3 bg-green-300 rounded-full opacity-70 animate-ping"></div>

            <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Scalloped outer circle */}
                <g>
                    {/* Scalloped edge circles */}
                    {[...Array(12)].map((_, i) => {
                        const angle = (i * 30 * Math.PI) / 180;
                        const x = 100 + Math.cos(angle) * 85;
                        const y = 100 + Math.sin(angle) * 85;
                        return (
                            <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="8"
                                fill="#93C5FD"
                                className="animate-pulse"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            />
                        );
                    })}
                </g>

                {/* Main badge outer circle with gradient */}
                <defs>
                    <linearGradient id="badgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#BFDBFE', stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: '#93C5FD', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#7DD3FC', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#FCD34D', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#FBBF24', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#FB7185', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#F43F5E', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>

                {/* Main badge circle */}
                <circle cx="100" cy="100" r="70" fill="url(#badgeGradient)" filter="url(#shadow)" />

                {/* Shadow definition */}
                <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
                    </filter>
                </defs>

                {/* Inner white circle */}
                <circle cx="100" cy="100" r="50" fill="white" filter="url(#shadow)" />

                {/* Star */}
                <g transform="translate(100, 100)">
                    <path
                        d="M 0,-30 L 7,-10 L 28,-10 L 11,2 L 18,22 L 0,10 L -18,22 L -11,2 L -28,-10 L -7,-10 Z"
                        fill="url(#starGradient)"
                        stroke="#F59E0B"
                        strokeWidth="1.5"
                        className="animate-pulse"
                    />
                </g>

                {/* Ribbon */}
                <g transform="translate(100, 155)">
                    {/* Ribbon main part */}
                    <rect x="-15" y="0" width="30" height="25" fill="url(#ribbonGradient)" rx="2" />

                    {/* Ribbon tails */}
                    <path d="M -15,25 L -15,40 L -7.5,32 Z" fill="#F43F5E" />
                    <path d="M 15,25 L 15,40 L 7.5,32 Z" fill="#F43F5E" />

                    {/* Ribbon highlight */}
                    <rect x="-12" y="2" width="24" height="3" fill="white" opacity="0.3" rx="1" />
                </g>

                {/* Decorative sparkles on badge */}
                <circle cx="70" cy="70" r="2" fill="white" opacity="0.8" className="animate-ping" />
                <circle cx="130" cy="80" r="1.5" fill="white" opacity="0.6" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
                <circle cx="115" cy="120" r="2" fill="white" opacity="0.7" className="animate-ping" style={{ animationDelay: '0.6s' }} />
            </svg>

            {/* Additional floating circles outside SVG */}
            <div className="absolute top-1/4 -left-6 w-6 h-6 border-2 border-orange-300 rounded-full opacity-60"></div>
            <div className="absolute bottom-1/3 right-0 w-4 h-4 bg-yellow-200 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
    );
};

export default ProfileUpdate;