import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUpcomingEvents } from '../Slice/EventSlice';
import { Users, Clock, MapPin, Calendar, CheckCircle, Info } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import EventDetailsModal from './EventDetailsModal';

const EventsSection = () => {
    const dispatch = useDispatch();
    const { items: events, loading } = useSelector((state) => state.events);
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const [registrations, setRegistrations] = React.useState({});
    const [selectedEvent, setSelectedEvent] = React.useState(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    React.useEffect(() => {
        dispatch(fetchUpcomingEvents());
    }, [dispatch]);

    React.useEffect(() => {
        if (isAuthenticated && user && events.length > 0) {
            checkAllRegistrations();
        }
    }, [isAuthenticated, user, events]);

    const checkAllRegistrations = async () => {
        if (!events || events.length === 0) return;
        
        const registrationStatus = {};
        for (const event of events) {
            // Safeguard: Check if event.id exists to avoid calling /api/events/check-registration/undefined
            if (!event || !event.id || event.id === "undefined") continue;
            
            try {
                const response = await api.get(`/events/check-registration/${event.id}`, {
                    params: { userId: user.id }
                });
                registrationStatus[event.id] = response.data;
            } catch (error) {
                console.error(`Error checking registration for event ${event.id}`, error);
            }
        }
        setRegistrations(registrationStatus);
    };

    const handleRegister = async (eventId) => {
        if (!isAuthenticated) {
            toast.error('Please login to register for events');
            return;
        }

        try {
            await api.post(`/events/register/${eventId}`, null, {
                params: { userId: user.id }
            });
            toast.success('Successfully registered for the event!');
            setRegistrations(prev => ({ ...prev, [eventId]: true }));
            dispatch(fetchUpcomingEvents());
        } catch (error) {
            console.error('Registration failed', error);
            toast.error(error.response?.data?.message || 'Failed to register');
        }
    };

    const openEventDetails = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const formatEventDate = (dateString) => {
        const date = new Date(dateString);
        return {
            month: date.toLocaleString('default', { month: 'short' }),
            day: date.getDate().toString().padStart(2, '0')
        };
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

    const calculateDaysLeft = (startTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const diffTime = start - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? `${diffDays} Day${diffDays > 1 ? 's' : ''} Left` : 'Started';
    };

    if (loading && events.length === 0) {
        return (
            <div className="bg-theme-surface rounded-3xl p-10 flex flex-col items-center justify-center min-h-[300px] shadow-sm border border-slate-100">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500 mb-4"></div>
                <p className="text-slate-500 font-bold">Discovering events...</p>
            </div>
        );
    }

    if (!loading && events.length === 0) {
        return null;
    }

    return (
        <div className='w-full px-2 sm:px-4 md:px-0 space-y-6 font-sans mb-12'>
            <div className="dashboard-card-bg rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 p-6 md:p-10">
                {/* Header with improved aesthetics */}
                <div className="flex items-end justify-between mb-12">
                    <div className="space-y-1">
                        <div className="inline-flex items-center px-4 py-1.5 bg-rose-50 rounded-full border border-rose-100 mb-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">
                                Curated Gatherings
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                            Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Events</span>
                        </h2>
                        <p className="text-slate-500 text-lg font-medium mt-2">Connect with potential matches beyond the screen</p>
                    </div>
                    <div className="hidden sm:flex bg-theme-surface shadow-xl shadow-rose-500/10 p-5 rounded-[2rem] text-rose-500 border border-slate-50">
                        <Calendar className="w-10 h-10" />
                    </div>
                </div>

                {/* Event Cards */}
                <div className="space-y-4">
                    {events.map((event) => {
                        const { month, day } = formatEventDate(event.startTime);
                        const isRegistered = registrations[event.id];

                        return (
                            <div
                                key={event.id}
                                onClick={() => openEventDetails(event)}
                                className="group bg-theme-surface hover:bg-rose-50/30 rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-rose-200 transition-all duration-300 hover:shadow-lg cursor-pointer"
                            >
                                {/* Mobile: stacked, Desktop: single row */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                                    {/* Left: Date Badge */}
                                    <div className="flex sm:flex-col items-center justify-center sm:w-16 sm:h-16 px-3 py-1.5 sm:p-0 bg-slate-900 group-hover:bg-rose-600 rounded-xl text-white transition-colors duration-300 shrink-0 self-start sm:self-center">
                                        <span className="text-[9px] font-bold uppercase tracking-wider opacity-80 sm:mb-0">{month}</span>
                                        <span className="text-2xl font-black ml-2 sm:ml-0 sm:-mt-1">{day}</span>
                                    </div>

                                    {/* Center: Title + Meta */}
                                    <div className="flex-1 min-w-0 space-y-2">
                                        {/* Title row with badges */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-rose-700 transition-colors leading-snug">
                                                {event.title}
                                            </h3>
                                            {event.isNew && (
                                                <span className="bg-rose-500 text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0">NEW</span>
                                            )}
                                            <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                                                event.eventType === 'ONLINE'
                                                    ? 'bg-indigo-100 text-indigo-700'
                                                    : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                                {event.eventType}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-1">
                                            {event.description || 'Join us for this amazing community gathering.'}
                                        </p>

                                        {/* Inline Meta Details */}
                                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={13} className="text-slate-400" />
                                                {formatTimeRange(event.startTime, event.endTime)}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <MapPin size={13} className="text-slate-400" />
                                                {event.eventType === 'ONLINE' ? 'Virtual/Live' : event.location}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Users size={13} className="text-slate-400" />
                                                {event.registeredCount || 0}+ Joined
                                            </span>
                                            <span className="flex items-center gap-1.5 text-rose-500 font-semibold">
                                                <Calendar size={13} />
                                                {calculateDaysLeft(event.startTime)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right: Action Button */}
                                    <div className="flex items-center gap-2 shrink-0 sm:ml-4">
                                        {event.eventType === 'ONLINE' && event.meetingLink && isRegistered && (
                                            <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                                <button className="h-10 px-4 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95">
                                                    Join
                                                </button>
                                            </a>
                                        )}

                                        {isRegistered ? (
                                            <div className="h-10 px-5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                                                <CheckCircle size={14} />
                                                Booked
                                            </div>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRegister(event.id);
                                                }}
                                                className="h-10 px-5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-rose-500/20 transition-all active:scale-95 whitespace-nowrap"
                                            >
                                                Book Spot
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Event Details Modal */}
            <EventDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                event={selectedEvent}
                isRegistered={selectedEvent ? registrations[selectedEvent.id] : false}
                onRegister={handleRegister}
            />
        </div>
    );
};

export default EventsSection;
