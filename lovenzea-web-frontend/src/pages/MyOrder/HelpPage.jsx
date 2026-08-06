import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import supportService from '../../services/supportService';
import { openChatWith } from '../../Slice/ChatSlice';
import { toast } from 'react-hot-toast';

const HelpPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [newTicket, setNewTicket] = useState({ subject: '', message: '', priority: 'MEDIUM' });

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const data = await supportService.getMyTickets(0, 5);
            setTickets(data.content || []);
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        if (!newTicket.subject || !newTicket.message) {
            toast.error('Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            await supportService.createTicket(newTicket);
            toast.success('Ticket created successfully!');
            setShowTicketModal(false);
            setNewTicket({ subject: '', message: '', priority: 'MEDIUM' });
            fetchTickets();
        } catch (error) {
            toast.error('Failed to create ticket');
        } finally {
            setLoading(false);
        }
    };

    const handleLiveChat = () => {
        // Support User ID is conventionally 1 or a specific admin ID in many systems
        // For now, we open a chat with a placeholder 'Support Team' identity
        dispatch(openChatWith({
            id: 1, // Assuming support admin ID is 1
            fullName: 'Support Team',
            profilePhotoUrl: 'https://ui-avatars.com/api/?name=Support+Team&background=0284c7&color=fff',
            displayNameVisibility: 'VISIBLE'
        }));
    };

    const helpTopics = [
        {
            title: 'Getting Started',
            icon: '🚀',
            description: 'Learn how to create your profile and get started',
            link: '#getting-started'
        },
        {
            title: 'Premium Membership',
            icon: '💎',
            description: 'Explore premium features and benefits',
            link: '#premium'
        },
        {
            title: 'Privacy & Security',
            icon: '🔒',
            description: 'Learn about keeping your data safe',
            link: '#privacy'
        },
        {
            title: 'Contact Support',
            icon: '📞',
            description: 'Get in touch with our support team',
            link: '#contact'
        },
        {
            title: 'Profile Management',
            icon: '👤',
            description: 'Edit and manage your profile information',
            link: '#profile'
        },
        {
            title: 'Matches & Search',
            icon: '🔍',
            description: 'Find and connect with potential matches',
            link: '#matches'
        },
        {
            title: 'My Support Tickets',
            icon: '🎫',
            description: tickets.length > 0 
                ? `You have ${tickets.length} support ticket(s). Track their status here.`
                : 'Track and manage your submitted tickets',
            link: '/my-tickets',
            isRoute: true,
            badge: tickets.filter(t => t.status === 'OPEN').length > 0 ? 'Action Needed' : null
        },
    ];

    const faqItems = [
        {
            question: 'How do I create a profile?',
            answer: 'Click on "Sign Up" and follow the simple registration process. Fill in your basic details, upload photos, and complete your profile.'
        },
        {
            question: 'What are the premium membership benefits?',
            answer: 'Premium members get unlimited messaging, advanced search filters, profile highlighting, and priority customer support.'
        },
        {
            question: 'Is my information secure?',
            answer: 'Yes, we use industry-standard encryption and security measures to protect your personal information and privacy.'
        },
        {
            question: 'How can I contact someone?',
            answer: 'You can send interest, messages, or chat requests to profiles you like. Premium members get additional contact options.'
        },
    ];

    return (
        <div className="min-h-screen p-4 lg:p-8 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-theme-surface rounded-2xl shadow-xl p-6 lg:p-8 border border-rose-100">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 font-serif">Help & Support</h1>

                            <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-6 rounded-r-lg flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-2">👋 How can we help you today?</h2>
                                    <p className="text-gray-700">Browse our help topics or contact support for assistance</p>
                                </div>
                                <button
                                    onClick={() => setShowTicketModal(true)}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md"
                                >
                                    Raise a Ticket
                                </button>
                            </div>

                            {/* Help Topics */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Browse Topics</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {helpTopics.map((topic, index) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                if (topic.isRoute) {
                                                    navigate(topic.link);
                                                } else {
                                                    window.location.hash = topic.link;
                                                }
                                            }}
                                            className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-lg border border-indigo-200 p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 relative"
                                        >
                                            {topic.badge && (
                                                <span className="absolute top-4 right-4 bg-theme-warning text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                                                    {topic.badge}
                                                </span>
                                            )}
                                            <div className="text-4xl mb-4">{topic.icon}</div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">{topic.title}</h3>
                                            <p className="text-theme-text-secondary text-sm leading-relaxed">{topic.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* FAQ Section */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Frequently Asked Questions</h2>
                                <div className="space-y-4">
                                    {faqItems.map((faq, index) => (
                                        <div key={index} className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-lg p-5 hover:shadow-lg transition-all duration-300">
                                            <h3 className="text-lg font-bold text-gray-800 mb-2">❓ {faq.question}</h3>
                                            <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Support */}
                            <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Need Immediate Assistance?</h3>
                                <p className="text-gray-700 mb-4">Our support team is available 24/7 to help you with any questions or concerns.</p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a
                                        href="tel:+918095031111"
                                        className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold text-center hover:from-rose-600 hover:to-pink-600 transition-all duration-200 shadow-md"
                                    >
                                        📞 Call: +91-8095031111
                                    </a>
                                    <button
                                        onClick={() => window.location.href = 'mailto:support@lovenzea.com'}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-md"
                                    >
                                        ✉️ Email Support
                                    </button>
                                    <button
                                        onClick={handleLiveChat}
                                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md"
                                    >
                                        💬 Live Chat
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            {/* Ticket Creation Modal */}
            {showTicketModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-theme-surface rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">Raise Support Ticket</h3>
                                <button onClick={() => setShowTicketModal(false)} className="text-white/80 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={newTicket.subject}
                                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Briefly describe your issue"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
                                <select
                                    value={newTicket.priority}
                                    onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="URGENT">Urgent</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                                <textarea
                                    value={newTicket.message}
                                    onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
                                    placeholder="Explain your problem in detail"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 shadow-lg transition-all disabled:opacity-70"
                            >
                                {loading ? 'Submitting...' : 'Submit Ticket'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HelpPage;