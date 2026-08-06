import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useDispatch } from 'react-redux';
import { sendReferralInvite } from '../../Slice/UserSlice';
import { toast } from 'react-hot-toast';

const ReferPage = () => {
    const [email, setEmail] = useState('');
    const [referralsSent, setReferralsSent] = useState([]);

    const [isSending, setIsSending] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email.trim()) {
            setIsSending(true);
            try {
                await dispatch(sendReferralInvite({ email })).unwrap();
                toast.success(`Invitation sent successfully to ${email}`);
                setReferralsSent([...referralsSent, { email, date: new Date().toLocaleDateString() }]);
                setEmail('');
            } catch (err) {
                toast.error(err || 'Failed to send invitation');
            } finally {
                setIsSending(false);
            }
        }
    };

    const benefits = [
        {
            icon: '👥',
            title: 'Spread the Word',
            description: 'Share with friends who are looking for their perfect match',
            color: 'from-purple-50 to-purple-100 border-purple-200'
        },
        {
            icon: '🎯',
            title: 'Earn Rewards',
            description: 'Get exclusive benefits when your referrals join',
            color: 'from-blue-50 to-blue-100 border-blue-200'
        },
        {
            icon: '❤️',
            title: 'Help Others',
            description: 'Be a part of someone\'s love story',
            color: 'from-green-50 to-green-100 border-green-200'
        },
        {
            icon: '🎁',
            title: 'Premium Access',
            description: 'Unlock premium features with successful referrals',
            color: 'from-orange-50 to-orange-100 border-orange-200'
        },
        {
            icon: '⭐',
            title: 'Priority Support',
            description: 'Get priority customer support as a referrer',
            color: 'from-yellow-50 to-yellow-100 border-yellow-200'
        },
        {
            icon: '💰',
            title: 'Cash Rewards',
            description: 'Earn cash rewards for successful matches',
            color: 'from-pink-50 to-pink-100 border-pink-200'
        }
    ];

    return (
        <div className="min-h-screen p-4 lg:p-8 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <Sidebar />
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-theme-surface rounded-2xl shadow-xl p-6 lg:p-8 border border-rose-100">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 font-serif">Refer A Friend</h1>

                            {/* Main Referral Section */}
                            <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 rounded-2xl p-8 border-2 border-rose-200 mb-8">
                                <div className="text-center mb-6">
                                    <div className="text-6xl mb-4">🎁</div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Send Invites</h2>
                                    <p className="text-lg text-gray-700">Help someone find a match. Refer LovenZea.com to friends!</p>
                                </div>

                                <div className="max-w-md mx-auto">
                                    <p className="text-sm text-red-600 mb-4 font-medium text-center">
                                        Become a paid member to avail referral benefits - <a href="#" className="text-cyan-600 hover:underline">Click here</a>
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter friend's email"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSending}
                                            className={`w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-6 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl ${isSending ? 'opacity-50 cursor-not-allowed' : 'hover:from-rose-600 hover:to-pink-600'}`}
                                        >
                                            {isSending ? '⏳ Sending...' : '📧 Send Invitation'}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Benefits Grid */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Referral Benefits</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {benefits.map((benefit, index) => (
                                        <div key={index} className={`bg-gradient-to-br ${benefit.color} rounded-xl p-6 border hover:shadow-lg transition-all duration-300`}>
                                            <div className="text-3xl mb-3">{benefit.icon}</div>
                                            <h3 className="font-bold text-gray-800 mb-2">{benefit.title}</h3>
                                            <p className="text-theme-text-secondary text-sm">{benefit.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Referral History */}
                            {referralsSent.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Your Referrals</h2>
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                                        <div className="space-y-3">
                                            {referralsSent.map((referral, index) => (
                                                <div key={index} className="bg-theme-surface rounded-lg p-4 shadow-sm flex justify-between items-center">
                                                    <div>
                                                        <p className="font-semibold text-gray-800">✉️ {referral.email}</p>
                                                        <p className="text-sm text-theme-text-secondary">Sent on {referral.date}</p>
                                                    </div>
                                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                                        Sent
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* How It Works */}
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">How Referral Works</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                                            1
                                        </div>
                                        <h3 className="font-bold text-gray-800 mb-2">Send Invite</h3>
                                        <p className="text-theme-text-secondary text-sm">Share invitation with your friends via email</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                                            2
                                        </div>
                                        <h3 className="font-bold text-gray-800 mb-2">Friend Joins</h3>
                                        <p className="text-theme-text-secondary text-sm">Your friend registers and creates a profile</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                                            3
                                        </div>
                                        <h3 className="font-bold text-gray-800 mb-2">Earn Rewards</h3>
                                        <p className="text-theme-text-secondary text-sm">Get rewards and benefits when they subscribe</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReferPage;