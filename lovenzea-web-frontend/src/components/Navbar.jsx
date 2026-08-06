import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronDown, MessageSquare, Bell, Search, User, HelpCircle, ShieldCheck, CreditCard, Phone, Mail, Heart } from 'lucide-react';
import { fetchSubscriptionDetails } from '../Slice/UserSlice';

const Navbar = () => {
    const [showHelp, setShowHelp] = useState(false);
    const [showPremium, setShowPremium] = useState(false);
    
    const dispatch = useDispatch();
    const { user, isAuthenticated, subscriptionDetails } = useSelector((state) => state.user);

    useEffect(() => {
        if (isAuthenticated && !subscriptionDetails) {
            dispatch(fetchSubscriptionDetails());
        }
    }, [isAuthenticated, subscriptionDetails, dispatch]);

    const isPremiumActive = subscriptionDetails?.active;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <nav className="bg-gradient-to-r from-[#8C6D39] via-[#C5A059] to-[#8C6D39] text-white shadow-md sticky top-0 z-[100] border-b border-[#8C6D39]/30">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center gap-0">
                            <img src={projectLogo} alt="LovenZea Logo" className="w-14 h-14 sm:w-16 sm:h-16 object-cover drop-shadow-xl hover:scale-105 transition-transform duration-300" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-white to-[#FCFAF7] bg-clip-text text-transparent font-serif drop-shadow-sm flex items-center ml-[1px]">
                                LovenZea
                            </span>
                        </div>
                        {isPremiumActive && (
                            <span className="bg-white text-[#8C6D39] text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-[#FCFAF7]">
                                Premium
                            </span>
                        )}
                    </div>

                    {/* Center Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavItem icon={<User className="w-4 h-4" />} label="My LovenZea" />
                        <NavItem icon={<Bell className="w-4 h-4" />} label="Matches" />
                        <NavItem icon={<Search className="w-4 h-4" />} label="Search" />
                        <NavItem icon={<MessageSquare className="w-4 h-4" />} label="Inbox" />
                        <NavItem icon={<Heart className="w-4 h-4" />} label="Truth Life" />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-6">
                        {isPremiumActive ? (
                            /* Premium Dropdown */
                            <div className="relative">
                                <button
                                    onMouseEnter={() => setShowPremium(true)}
                                    onMouseLeave={() => setShowPremium(false)}
                                    className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full border border-white/20 transition-all cursor-pointer"
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="text-sm font-bold">Premium</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>

                                {showPremium && (
                                    <div 
                                        onMouseEnter={() => setShowPremium(true)}
                                        onMouseLeave={() => setShowPremium(false)}
                                        className="absolute right-0 mt-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 text-gray-800"
                                    >
                                        {/* Header */}
                                        <div className="bg-gradient-to-r from-[#8C6D39] to-[#C5A059] p-4 text-white">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="font-bold text-lg">Premium Membership</h3>
                                                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Active</span>
                                            </div>
                                            <p className="text-white/90 text-xs opacity-90">Plan: {subscriptionDetails?.planName || 'N/A'}</p>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 space-y-4">
                                            {/* Validity */}
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center space-x-2 text-gray-600">
                                                    <CreditCard className="w-4 h-4" />
                                                    <span>Valid Till:</span>
                                                </div>
                                                <span className="font-bold text-gray-900">{formatDate(subscriptionDetails?.expiryDate)}</span>
                                            </div>

                                            {/* Connects Balance */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-700">Contact Views Balance</span>
                                                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                        {subscriptionDetails?.balance} Left
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div 
                                                        className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                                                        style={{ width: `${(subscriptionDetails?.balance / subscriptionDetails?.totalConnects) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-[10px] text-gray-500">
                                                    <span>Used: {subscriptionDetails?.usedConnects}</span>
                                                    <span>Total: {subscriptionDetails?.totalConnects}</span>
                                                </div>
                                            </div>

                                            {/* Extra Benefits */}
                                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
                                                <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                                                    <Phone className="w-3 h-3 text-blue-600" />
                                                    <span className="text-[10px] font-bold text-blue-700">Phone Balance</span>
                                                </div>
                                                <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                                                    <Mail className="w-3 h-3 text-purple-600" />
                                                    <span className="text-[10px] font-bold text-purple-700">SMS Balance</span>
                                                </div>
                                            </div>

                                            {/* Action */}
                                            <button className="w-full bg-[#8C6D39] hover:bg-[#7C5D29] text-white py-2 rounded-lg text-sm font-bold transition-colors mt-2">
                                                Upgrade / Renew
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button className="bg-white hover:bg-white/95 text-[#8C6D39] px-4 py-2 rounded-full text-sm font-bold transition-all shadow-md active:scale-95">
                                Upgrade Now
                            </button>
                        )}

                        {/* Help Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowHelp(!showHelp)}
                                className="flex items-center space-x-1 text-white/90 hover:text-white transition-colors"
                            >
                                <HelpCircle className="w-5 h-5" />
                                <span className="text-sm font-medium hidden sm:inline">Help</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {showHelp && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border z-50 overflow-hidden text-gray-800">
                                    <div className="p-4">
                                        <h3 className="font-bold mb-3 border-b pb-2 text-gray-900">How can we help?</h3>
                                        <div className="space-y-1">
                                            <div className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                                <p className="font-semibold text-sm">Chat with us (24x7)</p>
                                                <p className="text-[11px] text-gray-500">Get instant responses</p>
                                            </div>
                                            <div className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                                <p className="font-semibold text-sm">Submit a ticket</p>
                                                <p className="text-[11px] text-gray-500">Write to Customer Care</p>
                                            </div>
                                            <div className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                                <p className="font-semibold text-sm">Contact Support</p>
                                                <p className="text-[11px] text-gray-500">Call us for immediate help</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavItem = ({ icon, label }) => (
    <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
        {icon}
        <span className="font-medium">{label}</span>
    </button>
);

export default Navbar;