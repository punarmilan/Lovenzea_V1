import React, { useState, useEffect } from 'react';
import contactService from '../../services/contactService';
import { MessageSquare, Clock, CheckCircle2, User, Info, X, Calendar, Phone, Mail, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const data = await contactService.getAllMessages();
            // Sort by date descending
            const sortedData = (data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setMessages(sortedData);
        } catch (error) {
            toast.error('Failed to load contact messages');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await contactService.updateStatus(id, status);
            toast.success(`Message marked as ${status.toLowerCase()}`);
            if (selectedMessage && selectedMessage.id === id) {
                setSelectedMessage({ ...selectedMessage, status });
            }
            fetchMessages();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'NEW': return 'text-rose-600 bg-rose-50 border-rose-100';
            case 'READ': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'RESPONDED': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            default: return 'text-theme-text-secondary bg-gray-50';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-theme-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 leading-tight">Contact Inquiries</h2>
                    <p className="text-sm text-theme-text-secondary font-medium">Manage public messages and inquiries</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-none px-4 py-2 bg-rose-50 text-rose-700 rounded-xl text-[10px] font-black uppercase text-center">
                        {messages.filter(m => m.status === 'NEW').length} New
                    </div>
                </div>
            </div>

            <div className="bg-theme-surface rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-4 sm:px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Inquiry Details</th>
                                <th className="hidden sm:table-cell px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Info</th>
                                <th className="hidden md:table-cell px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-4 sm:px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400">Loading messages...</td></tr>
                            ) : messages.length === 0 ? (
                                <tr><td colSpan="4" className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-2 text-gray-300">
                                        <MessageSquare size={48} className="opacity-20" />
                                        <p className="font-bold">No inquiry messages yet.</p>
                                    </div>
                                </td></tr>
                            ) : (
                                messages.map((message) => (
                                    <tr key={message.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 sm:px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="text-sm font-bold text-gray-800 truncate">{message.subject}</p>
                                                    <span className={`sm:hidden px-1.5 py-0.5 rounded-md text-[8px] font-black border uppercase tracking-widest ${getStatusStyle(message.status)}`}>
                                                        {message.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-theme-text-secondary line-clamp-1">{message.message}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                                    <Calendar size={10} /> {new Date(message.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden sm:table-cell px-6 py-4">
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-gray-700">{message.name}</p>
                                                <p className="text-[10px] text-theme-text-secondary">{message.email}</p>
                                                {message.phone && <p className="text-[10px] text-theme-text-secondary">{message.phone}</p>}
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(message.status)}`}>
                                                {message.status}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedMessage(message);
                                                    if (message.status === 'NEW') handleUpdateStatus(message.id, 'READ');
                                                }}
                                                className="px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="h-full w-full sm:max-w-xl bg-theme-surface shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
                        <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center">
                            <div className="min-w-0">
                                <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-none truncate">Inquiry Details</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">ID: MSG-{selectedMessage.id}</p>
                            </div>
                            <button onClick={() => setSelectedMessage(null)} className="p-2.5 sm:p-3 bg-gray-50 text-gray-400 rounded-2xl hover:text-gray-900 transition-colors">
                                <X size={20} className="sm:size-6" />
                            </button>
                        </div>

                        <div className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
                            {/* Status and Action Row */}
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(selectedMessage.status)}`}>
                                    {selectedMessage.status}
                                </span>
                                <div className="flex gap-2">
                                    {selectedMessage.status !== 'RESPONDED' && (
                                        <button 
                                            onClick={() => handleUpdateStatus(selectedMessage.id, 'RESPONDED')}
                                            className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-emerald-700"
                                        >
                                            Mark Responded
                                        </button>
                                    )}
                                    {selectedMessage.status === 'RESPONDED' && (
                                        <button 
                                            onClick={() => handleUpdateStatus(selectedMessage.id, 'READ')}
                                            className="px-3 py-1.5 bg-amber-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-amber-700"
                                        >
                                            Mark Read
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Contact Info Section */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Information</label>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center gap-4 p-4 bg-theme-surface border border-gray-100 rounded-2xl shadow-sm">
                                        <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center shrink-0">
                                            <User className="w-5 h-5 text-pink-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-gray-400 font-black uppercase">Sender Name</p>
                                            <p className="text-sm font-bold text-gray-800 truncate">{selectedMessage.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-theme-surface border border-gray-100 rounded-2xl shadow-sm">
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                            <Mail className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-gray-400 font-black uppercase">Email Address</p>
                                            <p className="text-sm font-bold text-gray-800 truncate">{selectedMessage.email}</p>
                                        </div>
                                    </div>
                                    {selectedMessage.phone && (
                                        <div className="flex items-center gap-4 p-4 bg-theme-surface border border-gray-100 rounded-2xl shadow-sm">
                                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                                                <Phone className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] text-gray-400 font-black uppercase">Phone Number</p>
                                                <p className="text-sm font-bold text-gray-800 truncate">{selectedMessage.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-pink-500" />
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject & Message</label>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-lg font-black text-gray-800 leading-tight">{selectedMessage.subject}</h4>
                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedMessage.message}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-tight pl-2">
                                        <Clock size={12} /> Received on {new Date(selectedMessage.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 border-t border-gray-100">
                            <button 
                                onClick={() => handleUpdateStatus(selectedMessage.id, 'RESPONDED')}
                                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                <CheckCircle2 size={18} /> Query Resolved
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactMessages;
