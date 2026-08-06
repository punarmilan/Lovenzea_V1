import React from 'react';
import { X, Calendar, Clock, MapPin, Users, CheckCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EventDetailsModal = ({ isOpen, onClose, event, isRegistered, onRegister }) => {
    if (!event) return null;

    const formatEventDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTimeRange = (start, end) => {
        const formatTime = (timeStr) => {
            const time = new Date(timeStr);
            return time.toLocaleString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }).toLowerCase();
        };
        return `${formatTime(start)} - ${formatTime(end)}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-3xl bg-theme-surface rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20"
                    >
                        {/* Header Image/Gradient Block */}
                        <div className="relative h-48 sm:h-64 bg-gradient-to-br from-rose-500 via-rose-600 to-orange-500 overflow-hidden">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-theme-surface/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/20 rounded-full -ml-16 -mb-16 blur-2xl" />
                            
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 z-20 w-12 h-12 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-2xl flex items-center justify-center transition-all active:scale-90"
                            >
                                <X size={24} />
                            </button>

                            {/* Event Type Badge */}
                            <div className="absolute top-6 left-6 z-20">
                                <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                                    event.eventType === 'ONLINE' 
                                        ? 'bg-indigo-500 text-white shadow-indigo-500/30' 
                                        : 'bg-emerald-500 text-white shadow-emerald-500/30'
                                }`}>
                                    {event.eventType} Event
                                </span>
                            </div>

                            {/* Title Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black/60 to-transparent">
                                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                                    {event.title}
                                </h2>
                            </div>
                        </div>

                        {/* Scrollable Body */}
                        <div className="flex-1 overflow-y-auto subtle-scrollbar p-8 sm:p-10 space-y-10">
                            {/* Event Fast Facts */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100/50">
                                    <div className="w-12 h-12 rounded-2xl bg-theme-surface border border-rose-100 flex items-center justify-center text-rose-500 shrink-0 shadow-sm">
                                        <Calendar size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</p>
                                        <p className="text-sm font-bold text-slate-700">{formatEventDate(event.startTime)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100/50">
                                    <div className="w-12 h-12 rounded-2xl bg-theme-surface border border-rose-100 flex items-center justify-center text-rose-500 shrink-0 shadow-sm">
                                        <Clock size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time</p>
                                        <p className="text-sm font-bold text-slate-700 font-mono tracking-tight">{formatTimeRange(event.startTime, event.endTime)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100/50">
                                    <div className="w-12 h-12 rounded-2xl bg-theme-surface border border-rose-100 flex items-center justify-center text-rose-500 shrink-0 shadow-sm">
                                        <MapPin size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</p>
                                        <p className="text-sm font-bold text-slate-700">{event.eventType === 'ONLINE' ? 'Virtual Session' : event.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100/50">
                                    <div className="w-12 h-12 rounded-2xl bg-theme-surface border border-rose-100 flex items-center justify-center text-rose-500 shrink-0 shadow-sm">
                                        <Users size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Atmosphere</p>
                                        <p className="text-sm font-bold text-slate-700">{event.registeredCount || 0}+ People Joining</p>
                                    </div>
                                </div>
                            </div>

                            {/* About Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-black text-slate-900 border-l-4 border-rose-500 pl-4 uppercase tracking-widest">
                                    About Event
                                </h3>
                                <div className="text-slate-500 leading-relaxed space-y-4 font-medium">
                                    {event.description?.split('\n').map((para, i) => (
                                        <p key={i}>{para}</p>
                                    )) || (
                                        <p>Join us for an exclusive LovenZea community gathering. Our events are designed to create a comfortable, safe, and engaging environment where singles can meet, interact, and build meaningful connections beyond digital profiles.</p>
                                    )}
                                </div>
                            </div>

                            {/* Important Info */}
                            <div className="p-6 bg-rose-50/50 rounded-3xl border border-rose-100/50 space-y-3">
                                <h4 className="text-xs font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle size={14} /> Participation Guidelines
                                </h4>
                                <ul className="text-slate-500 text-sm font-medium space-y-2">
                                    <li className="flex items-center gap-2">• Please arrive/join at least 10 minutes early.</li>
                                    <li className="flex items-center gap-2">• Proper profile verification is required for all attendees.</li>
                                    <li className="flex items-center gap-2">• Respect all participants and follow the host's instructions.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="hidden sm:block">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Status</p>
                                <div className="flex items-center gap-2">
                                    {isRegistered ? (
                                        <span className="text-emerald-600 font-bold flex items-center gap-1.5 text-sm">
                                            <CheckCircle size={16} /> Spot Confirmed
                                        </span>
                                    ) : (
                                        <span className="text-slate-500 font-bold text-sm">Available</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                {isRegistered ? (
                                    <>
                                        {event.eventType === 'ONLINE' && event.meetingLink && (
                                            <a 
                                                href={event.meetingLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="flex-1 sm:flex-none"
                                            >
                                                <button className="w-full sm:w-auto h-14 px-8 bg-slate-900 hover:bg-black text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 transition-all active:scale-95 flex items-center justify-center gap-2">
                                                    Join Live <ExternalLink size={18} />
                                                </button>
                                            </a>
                                        )}
                                        <div className="flex-1 sm:flex-none h-14 px-8 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest shadow-sm">
                                            Reserved
                                        </div>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => onRegister(event.id)}
                                        className="w-full sm:w-48 h-14 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-500/25 transition-all active:scale-95"
                                    >
                                        Book My Spot
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EventDetailsModal;
