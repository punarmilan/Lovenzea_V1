import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supportService from '../../services/supportService';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTickets();
    }, [page]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const data = await supportService.getMyTickets(page);
            setTickets(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            toast.error('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPEN':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'RESOLVED':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'CLOSED':
                return 'bg-gray-100 text-gray-700 border-theme-border';
            default:
                return 'bg-gray-100 text-gray-700 border-theme-border';
        }
    };

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'URGENT':
                return 'bg-red-100 text-red-700 font-bold';
            case 'HIGH':
                return 'bg-orange-100 text-orange-700 font-bold';
            case 'MEDIUM':
                return 'bg-blue-100 text-blue-700';
            case 'LOW':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-theme-surface rounded-full shadow-sm flex items-center justify-center text-theme-text-secondary hover:text-purple-600 transition-colors"
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">My Support Tickets</h1>
                        <p className="text-sm text-theme-text-secondary">Track and manage your assistance requests</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="bg-theme-surface rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fa-solid fa-ticket text-purple-200 text-4xl"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No tickets found</h3>
                        <p className="text-theme-text-secondary mb-8 max-w-sm mx-auto">If you need help with anything, feel free to submit a support ticket via the Help menu.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
                        >
                            Return to Home
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="bg-theme-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusStyle(ticket.status)} font-bold tracking-wider`}>
                                                    {ticket.status}
                                                </span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${getPriorityStyle(ticket.priority)} font-bold tracking-wider`}>
                                                    {ticket.priority}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800">{ticket.subject}</h3>
                                            <p className="text-xs text-theme-text-secondary">
                                                Ticket ID: <span className="font-mono">#{ticket.id}</span> • {format(new Date(ticket.createdAt), 'MMM dd, yyyy HH:mm')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{ticket.message}</p>
                                    </div>

                                    {ticket.adminResponse && (
                                        <div className="border-t border-gray-100 pt-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                                                    <i className="fa-solid fa-headset text-xs"></i>
                                                </div>
                                                <div className="bg-purple-50 rounded-lg p-4 flex-grow">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-bold text-purple-800">Support Team Response</span>
                                                        {ticket.resolvedAt && (
                                                            <span className="text-[10px] text-purple-600 italic">
                                                                Resolved at: {format(new Date(ticket.resolvedAt), 'MMM dd, HH:mm')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-purple-900">{ticket.adminResponse}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    onClick={() => setPage(prev => Math.max(0, prev - 1))}
                                    disabled={page === 0}
                                    className="px-4 py-2 bg-theme-surface border border-theme-border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-theme-text-secondary font-medium">Page {page + 1} of {totalPages}</span>
                                <button
                                    onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                                    disabled={page === totalPages - 1}
                                    className="px-4 py-2 bg-theme-surface border border-theme-border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTickets;
