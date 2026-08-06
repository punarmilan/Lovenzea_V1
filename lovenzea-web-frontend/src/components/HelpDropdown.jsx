import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import supportService from '../services/supportService';
import { toast } from 'react-hot-toast';

const HelpDropdown = () => {
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showTicketForm, setShowTicketForm] = useState(false);
    const [showContactPage, setShowContactPage] = useState(false);

    // Ticket form states
    const [ticketSubject, setTicketSubject] = useState('');
    const [ticketMessage, setTicketMessage] = useState('');
    const [ticketPriority, setTicketPriority] = useState('MEDIUM');
    const [isTicketSubmitting, setIsTicketSubmitting] = useState(false);
    const [ticketSubmitStatus, setTicketSubmitStatus] = useState(null);

    const dropdownRef = useRef(null);
    const ticketFormRef = useRef(null);
    const contactPageRef = useRef(null);
    const navigate = useNavigate();

    // Check if mobile and handle outside click
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsHelpOpen(false);
            }
            if (ticketFormRef.current && !ticketFormRef.current.contains(event.target) && showTicketForm) {
                setShowTicketForm(false);
            }
            if (contactPageRef.current && !contactPageRef.current.contains(event.target) && showContactPage) {
                setShowContactPage(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            window.removeEventListener('resize', checkMobile);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [showTicketForm, showContactPage]);

    // Prevent body scroll when dropdown or forms are open on mobile
    useEffect(() => {
        if ((isHelpOpen || showTicketForm || showContactPage) && isMobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isHelpOpen, showTicketForm, showContactPage, isMobile]);

    // Get dropdown position based on screen size
    const getDropdownPosition = () => {
        if (isMobile) {
            return 'fixed inset-0 z-50 top-auto bottom-0 rounded-t-2xl rounded-b-none max-h-[85vh] overflow-y-auto';
        }
        return 'absolute right-0 mt-2 w-80 bg-theme-surface rounded-lg shadow-xl border border-theme-border overflow-hidden';
    };

    // Get backdrop style based on screen size
    const getBackdropStyle = () => {
        if (isMobile) {
            return 'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm';
        }
        return 'fixed inset-0 z-40';
    };

    // Handle chat option click - Navigate to home page
    const handleChatClick = () => {
        setIsHelpOpen(false);
        navigate('/');
    };

    // Handle ticket option click - Show email form popup
    const handleTicketClick = () => {
        setIsHelpOpen(false);
        setShowTicketForm(true);
    };

    // Handle call option click - Show contact page popup
    const handleCallClick = () => {
        setIsHelpOpen(false);
        setShowContactPage(true);
    };

    // Handle ticket form submission
    const handleTicketSubmit = async (e) => {
        e.preventDefault();
        setIsTicketSubmitting(true);

        try {
            await supportService.createTicket({
                subject: ticketSubject,
                message: ticketMessage,
                priority: ticketPriority
            });
            setIsTicketSubmitting(false);
            setTicketSubmitStatus('success');
            toast.success('Ticket submitted successfully');

            // Reset form and close after 2 seconds
            setTimeout(() => {
                setTicketSubject('');
                setTicketMessage('');
                setTicketPriority('MEDIUM');
                setTicketSubmitStatus(null);
                setShowTicketForm(false);
            }, 2000);
        } catch (error) {
            setIsTicketSubmitting(false);
            toast.error('Failed to submit ticket. Please try again.');
        }
    };

    // Handle "My Tickets" click
    const handleMyTicketsClick = () => {
        setIsHelpOpen(false);
        navigate('/my-tickets');
    };

    // Help options data
    const helpOptions = [

        {
            id: 'tickets-view',
            icon: 'fa-solid fa-list-check',
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100',
            title: 'My Tickets',
            badge: null,
            description: 'Check status of your previous tickets',
            onClick: handleMyTicketsClick
        },
        {
            id: 'ticket',
            icon: 'fa-solid fa-ticket',
            iconColor: 'text-purple-600',
            iconBg: 'bg-purple-100',
            title: 'Submit a ticket',
            badge: null,
            description: 'Write to Customer Care for detailed assistance',
            onClick: handleTicketClick
        },
        {
            id: 'call',
            icon: 'fa-solid fa-phone',
            iconColor: 'text-red-600',
            iconBg: 'bg-red-100',
            title: 'Call on +91-9923400442',
            badge: null,
            description: 'Click for regional offices • Call 10am - 7pm (IST)',
            waitTime: 'Wait time: 5-8 mins',
            onClick: handleCallClick
        }
    ];

    const regionalNumbers = [
        { region: 'Pune Maharashtra', number: '+91-9923400442' }

    ];

    return (
        <>
            <div className="relative inline-block text-left" ref={dropdownRef}>
                {/* Help Button */}
                <button
                    onClick={() => setIsHelpOpen(!isHelpOpen)}
                    className="flex items-center gap-1 transition-colors text-sm font-medium px-2 sm:px-3 py-2 hover:opacity-90"
                    aria-label="Help"
                >
                    <i className="fa-solid fa-question-circle text-lg sm:text-xl"></i>
                    <span className="hidden md:inline ml-1">Help</span>
                    <i className={`fa-solid fa-chevron-down text-xs transition-transform ${isHelpOpen ? 'rotate-180' : ''} ml-1`}></i>
                </button>

                {/* Dropdown Menu */}
                {isHelpOpen && (
                    <>
                        <div className={getBackdropStyle()} onClick={() => setIsHelpOpen(false)}></div>
                        <div className={`${getDropdownPosition()} bg-theme-surface z-50`}>
                            {isMobile && (
                                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 pt-4 pb-4 text-white flex justify-center items-center">
                                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-1.5 bg-theme-surface/50 rounded-full"></div>
                                    <button onClick={() => setIsHelpOpen(false)} className="absolute left-4 top-3 text-white text-xl p-1">
                                        <i className="fa-solid fa-times"></i>
                                    </button>
                                    <h3 className="text-lg font-bold">Help Center</h3>
                                </div>
                            )}

                            {!isMobile && (
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold mb-1">Upgrade Now Help</h3>
                                            <p className="text-sm opacity-90">To get instant help</p>
                                        </div>
                                        <button onClick={() => setIsHelpOpen(false)} className="text-white hover:bg-theme-surface/20 p-1 rounded">
                                            <i className="fa-solid fa-times text-lg"></i>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className={`p-4 ${isMobile ? 'pt-2' : ''} space-y-4 max-h-[60vh] overflow-y-auto`}>
                                {helpOptions.map((option) => (
                                    <div
                                        key={option.id}
                                        onClick={option.onClick}
                                        className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-blue-50 active:bg-blue-100 transition-all cursor-pointer"
                                    >
                                        <div className={`w-10 h-10 ${option.iconBg} rounded-full flex items-center justify-center ${option.iconColor} flex-shrink-0`}>
                                            <i className={`${option.icon} text-xl`}></i>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className="font-semibold text-gray-800 text-sm">{option.title}</span>
                                                {option.badge && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{option.badge}</span>}
                                            </div>
                                            <p className="text-xs text-theme-text-secondary">{option.description}</p>
                                            {option.waitTime && <div className="text-orange-600 font-medium text-xs mt-1">{option.waitTime}</div>}
                                        </div>
                                        <i className="fa-solid fa-chevron-right text-gray-400 mt-2"></i>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Ticket Form Popup */}
            {showTicketForm && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={() => setShowTicketForm(false)}></div>
                    <div ref={ticketFormRef} className={`fixed z-[70] ${isMobile ? 'inset-x-0 bottom-0 rounded-t-2xl' : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-2xl'} bg-theme-surface shadow-2xl max-h-[90vh] overflow-hidden`}>
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 text-white">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold">Submit a Ticket</h3>
                                    <p className="text-sm opacity-90">For detailed assistance</p>
                                </div>
                                <button onClick={() => setShowTicketForm(false)} className="text-white hover:bg-theme-surface/20 p-2 rounded-full">
                                    <i className="fa-solid fa-times text-lg"></i>
                                </button>
                            </div>
                        </div>

                        <div className="p-5 overflow-y-auto max-h-[calc(90vh-120px)]">
                            {ticketSubmitStatus === 'success' ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i className="fa-solid fa-check text-green-600 text-2xl"></i>
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-800 mb-2">Ticket Submitted!</h4>
                                    <button onClick={() => setShowTicketForm(false)} className="bg-purple-600 text-white px-6 py-2 rounded-lg mt-4">Close</button>
                                </div>
                            ) : (
                                <form onSubmit={handleTicketSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                                        <input
                                            type="text"
                                            value={ticketSubject}
                                            onChange={(e) => setTicketSubject(e.target.value)}
                                            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Briefly describe your issue"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
                                        <select
                                            value={ticketPriority}
                                            onChange={(e) => setTicketPriority(e.target.value)}
                                            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                            <option value="URGENT">Urgent</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                        <textarea
                                            value={ticketMessage}
                                            onChange={(e) => setTicketMessage(e.target.value)}
                                            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 h-32"
                                            placeholder="Provide all relevant details..."
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isTicketSubmitting}
                                        className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 disabled:bg-gray-400"
                                    >
                                        {isTicketSubmitting ? 'Submitting...' : 'Submit Ticket'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </>
            )}

            {showContactPage && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={() => setShowContactPage(false)}></div>
                    <div ref={contactPageRef} className={`fixed z-[70] ${isMobile ? 'inset-x-0 bottom-0 rounded-t-2xl' : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-2xl'} bg-theme-surface shadow-2xl max-h-[90vh] overflow-hidden`}>
                        <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 text-white">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">Contact Us</h3>
                                <button onClick={() => setShowContactPage(false)} className="text-white hover:bg-theme-surface/20 p-2 rounded-full">
                                    <i className="fa-solid fa-times text-lg"></i>
                                </button>
                            </div>
                        </div>
                        <div className="p-5 overflow-y-auto max-h-[calc(90vh-120px)]">
                            <div className="space-y-6">
                                <div className="bg-red-50 p-4 rounded-xl text-center">
                                    <h4 className="font-bold text-gray-800 mb-2">Main Helpline</h4>
                                    <a href="tel:+919923400442" className="text-red-600 text-xl font-bold">+91-9923400442</a>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-bold text-gray-800">Regional Offices</h4>
                                    {regionalNumbers.map((item, index) => (
                                        <div key={index} className="flex justify-between p-3 border border-gray-100 rounded-lg">
                                            <span className="text-gray-700">{item.region}</span>
                                            <a href={`tel:${item.number}`} className="text-red-600 font-bold">{item.number}</a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default HelpDropdown;
