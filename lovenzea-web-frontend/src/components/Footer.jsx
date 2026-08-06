import React from 'react';
import projectLogo from '../assets/image/project_logo_transperent.png';
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Linkedin,
    ShieldCheck,
    Heart,
    ShieldAlert,
    FileText,
    Lock,
    Tag,
    MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const navItems = [
        { name: 'About Us', href: '/about-us' },
        { name: 'VIP LovenZea', href: '/vip-LovenZea' },
        { name: 'LovenZea Blog', href: '/blog' },
        { name: 'Success Stories', href: '/success-stories' },
        { name: 'LovenZea Centres', href: '/centres' },
        { name: 'Contact Us', href: '/contact-us' },
        { name: 'LovenZea Live', href: '/live' },
        { name: 'Work With Us', href: '/work-with-us' }
    ];

    const socialLinks = [
        { name: 'Facebook', href: '#', icon: <Facebook className="w-5 h-5" /> },
        { name: 'Instagram', href: '#', icon: <Instagram className="w-5 h-5" /> },
        { name: 'YouTube', href: '#', icon: <Youtube className="w-5 h-5" /> },
        { name: 'LinkedIn', href: '#', icon: <Linkedin className="w-5 h-5" /> },
        { name: 'Twitter', href: '#', icon: <Twitter className="w-5 h-5" /> }
    ];

    const featureCards = [
        {
            icon: <ShieldAlert className="w-6 h-6 text-[#ff2d7a] group-hover:scale-110 transition-transform duration-300" />,
            title: 'Be Safe Online',
            desc: 'Tips & resources for your safety',
            href: '/safety'
        },
        {
            icon: <FileText className="w-6 h-6 text-[#3bb8ff] group-hover:scale-110 transition-transform duration-300" />,
            title: 'Grievance Officer Details',
            desc: 'Raise a concern or contact officer',
            href: '/grievance'
        },
        {
            icon: <Lock className="w-6 h-6 text-[#ff2d7a] group-hover:scale-110 transition-transform duration-300" />,
            title: 'Privacy Policy',
            desc: 'Your privacy matters to us',
            href: '/privacy'
        },
        {
            icon: <FileText className="w-6 h-6 text-[#3bb8ff] group-hover:scale-110 transition-transform duration-300" />,
            title: 'Terms of Use',
            desc: 'Read terms and conditions',
            href: '/terms'
        },
        {
            icon: <Tag className="w-6 h-6 text-[#ff2d7a] group-hover:scale-110 transition-transform duration-300" />,
            title: 'Offer Terms',
            desc: 'Latest offers & conditions',
            href: '/offer-terms'
        }
    ];

    const handleChatClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative bg-[#050816] text-white overflow-hidden font-sans border-t border-white/10">
            {/* Glowing background highlights */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] rounded-full bg-pink-900/10 blur-[120px] pointer-events-none"></div>

            {/* Subtle glowing particles/dots background styling */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,45,122,0.03)_1px,transparent_1px),radial-gradient(circle_at_70%_60%,rgba(59,184,255,0.03)_1px,transparent_1px)] bg-[length:32px_32px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8 relative z-10">
                {/* 1. Top Navigation */}
                <div className="flex flex-col items-center mb-6">
                    <nav className="flex flex-wrap justify-center gap-3 mb-5">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-[#ff2d7a]/50 text-white hover:text-white text-xs font-bold transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-[0_0_15px_rgba(255,45,122,0.3)]"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    {/* Thin glowing divider */}
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff2d7a]/45 to-transparent"></div>
                </div>

                {/* 2. Brand Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-6">
                    {/* Left: Logo and Tagline */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-3 mb-3">
                            
                            <div className="flex items-center gap-0">
                                <img src={projectLogo} alt="LovenZea Logo" className="w-16 h-16 sm:w-20 sm:h-20 object-cover drop-shadow-xl hover:scale-105 transition-transform duration-300" />
                                <span className="text-xl sm:text-2xl font-black tracking-tighter text-white drop-shadow-sm flex items-center ml-[1px]">
                                    LOVEN<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2d7a] to-rose-500">ZEA</span>
                                </span>
                            </div>

                              
                        </div>
                        <p className="text-gray-400 text-sm font-medium tracking-wide">
                            The World's No.1 Matchmaking Service
                        </p>
                    </div>

                    {/* Right: Circular Social Buttons */}
                    <div className="flex items-center gap-3">
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                aria-label={social.name}
                                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 hover:border-[#ff2d7a]/50 hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-[0_0_15px_rgba(255,45,122,0.3)]"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* 3. Feature Cards (5 premium glassmorphic cards in one container - horizontal layout to reduce height) */}
                <div className="bg-white/[0.01] backdrop-blur-md border border-white/5 rounded-2xl p-4 sm:p-5 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {featureCards.map((card, idx) => (
                            <Link
                                key={idx}
                                to={card.href}
                                className="group relative flex flex-row items-center gap-3.5 p-3 rounded-xl bg-white/10 border border-white/20 hover:border-[#ff2d7a]/50 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                            >
                                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors shrink-0">
                                    {card.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-bold text-xs group-hover:text-[#ff2d7a] transition-colors truncate">
                                        {card.title}
                                    </h4>
                                    <p className="text-gray-300 text-[10px] leading-tight mt-0.5 line-clamp-1">
                                        {card.desc}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 4. Bottom Information Bar (Floating glass card) */}
                <div className="bg-white/[0.02] backdrop-blur-lg border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
                    
                    {/* Left: Verified Badge */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                            <ShieldCheck className="w-5 h-5 text-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                        </div>
                        <div>
                            <p className="text-xs font-black tracking-[3px] text-green-400">100% VERIFIED PROFILES</p>
                            <p className="text-[10px] text-gray-500 font-bold mt-0.5">Since 2026</p>
                        </div>
                    </div>

                    {/* Center: Copyright */}
                    <div className="text-center">
                        <p className="text-xs font-semibold text-gray-400">
                            © 2026–2027 <span className="text-[#ff2d7a] font-black hover:underline cursor-pointer">LovenZea.com</span>
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                            The World's No.1 Matchmaking Service
                        </p>
                    </div>

                    {/* Right: Creator Badge */}
                    <div className="text-center lg:text-right">
                        <p className="text-[9px] font-black tracking-[2px] text-gray-500">CREATED BY</p>
                        <p className="text-xs font-bold text-[#ff2d7a] tracking-wide mt-0.5 drop-shadow-[0_0_6px_rgba(255,45,122,0.3)]">
                            LOVENZEA PVT LTD
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;