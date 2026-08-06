import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Calendar, Clock, MapPin, Users, Plus, Edit2, Trash2, X, Check, Search, Filter, ChevronRight, MoreHorizontal, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import adminApi from '../../admin/services/adminApi';

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showRegistrants, setShowRegistrants] = useState(false);
    const [selectedEventForRegistrants, setSelectedEventForRegistrants] = useState(null);
    const [registrants, setRegistrants] = useState([]);
    const [registrantsLoading, setRegistrantsLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
        status: 'UPCOMING',
        registeredCount: 0,
        isNew: true,
        eventType: 'OFFLINE',
        meetingLink: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await adminApi.get('/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Failed to fetch events', error);
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCreateNew = () => {
        setEditingEvent(null);
        setFormData({
            title: '',
            description: '',
            startTime: '',
            endTime: '',
            location: '',
            status: 'UPCOMING',
            registeredCount: 0,
            isNew: true,
            eventType: 'OFFLINE',
            meetingLink: ''
        });
        setShowForm(true);
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            ...event,
            startTime: event.startTime ? event.startTime.substring(0, 16) : '',
            endTime: event.endTime ? event.endTime.substring(0, 16) : ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!(await Swal.fire({ title: 'Are you sure?', text: 'Are you sure you want to delete this event?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#8C6D39', cancelButtonColor: '#d33', confirmButtonText: 'Yes' }).then(r => r.isConfirmed))) return;

        try {
            await adminApi.delete(`/events/${id}`);
            toast.success('Event deleted successfully');
            fetchEvents();
        } catch (error) {
            console.error('Error deleting event', error);
            toast.error('Failed to delete event');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                await adminApi.put(`/events/${editingEvent.id}`, formData);
                toast.success('Event updated successfully');
            } else {
                await adminApi.post('/events', formData);
                toast.success('Event created successfully');
            }
            setShowForm(false);
            fetchEvents();
        } catch (error) {
            console.error('Error saving event', error);
            toast.error(error.response?.data?.message || 'Failed to save event');
        }
    };

    const handleViewRegistrants = async (event) => {
        setSelectedEventForRegistrants(event);
        setShowRegistrants(true);
        setRegistrantsLoading(true);
        try {
            const response = await adminApi.get(`/events/${event.id}/registrants`);
            setRegistrants(response.data);
        } catch (error) {
            console.error('Error fetching registrants', error);
            toast.error('Failed to load registrants');
        } finally {
            setRegistrantsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'UPCOMING': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'ONGOING': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'COMPLETED': return 'bg-slate-50 text-slate-600 border-slate-100';
            case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const filteredEvents = events.filter(e => 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.eventType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: events.length,
        active: events.filter(e => e.status === 'UPCOMING' || e.status === 'ONGOING').length,
        registrations: events.reduce((sum, e) => sum + (e.registeredCount || 0), 0)
    };

    return (
        <div className="p-4 sm:p-8 bg-[#f8fafc] min-h-screen font-sans">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Events</h1>
                    <p className="text-slate-500 mt-1 font-medium text-sm">Control center for gatherings</p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="w-full sm:w-auto group bg-rose-500 hover:bg-rose-600 px-6 py-3 rounded-xl text-white font-bold flex items-center justify-center transition-all shadow-lg shadow-rose-500/25 active:scale-95"
                >
                    <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" /> 
                    New Event
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {[
                    { label: 'Total Events', value: stats.total, icon: Calendar, color: 'blue' },
                    { label: 'Active Events', value: stats.active, icon: Clock, color: 'emerald' },
                    { label: 'Total Registrations', value: stats.registrations, icon: Users, color: 'rose' }
                ].map((stat, i) => (
                    <div key={i} className="bg-theme-surface p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                                <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
                            </div>
                            <div className={`p-4 bg-${stat.color}-50 text-${stat.color}-500 rounded-2xl`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Card */}
            <div className="bg-theme-surface rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                {/* Search and Filters */}
                <div className="p-4 sm:p-6 border-b border-slate-50 flex flex-col lg:flex-row gap-4 lg:items-center justify-between bg-slate-50/30">
                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search events, locations, types..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all bg-theme-surface"
                        />
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto">
                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-theme-surface border border-slate-200 rounded-xl text-slate-600 text-xs sm:text-sm font-bold hover:bg-slate-50 transition-colors">
                            <Filter size={16} /> Filters
                        </button>
                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-theme-surface border border-slate-200 rounded-xl text-slate-600 text-xs sm:text-sm font-bold hover:bg-slate-50 transition-colors text-rose-500 border-rose-100 bg-rose-50/30">
                            <Download size={16} /> Export
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 text-center">
                            <div className="animate-spin w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-slate-500 font-bold">Fetching events data...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="py-4 sm:py-5 px-4 sm:px-6 text-slate-400 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">Info</th>
                                    <th className="hidden sm:table-cell py-5 px-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">Date & Time</th>
                                    <th className="hidden lg:table-cell py-5 px-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">Location</th>
                                    <th className="hidden md:table-cell py-5 px-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">Status</th>
                                    <th className="py-4 sm:py-5 px-4 sm:px-6 text-slate-400 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] border-b border-slate-100 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredEvents.map((event) => (
                                    <tr key={event.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 sm:py-5 px-4 sm:px-6">
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-[10px] sm:text-xs font-black ${
                                                    event.eventType === 'ONLINE' ? 'bg-indigo-50 text-indigo-500' : 'bg-orange-50 text-orange-500'
                                                }`}>
                                                    {event.eventType === 'ONLINE' ? 'ON' : 'OFF'}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-extrabold text-slate-900 group-hover:text-rose-500 transition-colors text-sm sm:text-base truncate">{event.title}</h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <p className="text-slate-400 text-[10px] sm:text-xs font-bold">{event.registeredCount || 0} Reg</p>
                                                        <span className={`sm:hidden px-1.5 py-0.5 rounded-md text-[8px] font-black border uppercase tracking-widest ${getStatusColor(event.status)}`}>
                                                            {event.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden sm:table-cell py-5 px-6">
                                            <div className="flex flex-col min-w-[120px]">
                                                <span className="text-slate-700 font-bold text-xs sm:text-sm">
                                                    {new Date(event.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                                <span className="text-slate-400 text-[10px] sm:text-xs font-medium mt-1">
                                                    {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="hidden lg:table-cell py-5 px-6">
                                            <div className="flex items-center gap-2 text-slate-600 font-medium max-w-[150px]">
                                                <MapPin size={14} className="text-slate-300 shrink-0" />
                                                <span className="text-sm truncate">{event.eventType === 'ONLINE' ? 'Virtual' : event.location}</span>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell py-5 px-6">
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black border border-dashed uppercase tracking-widest ${getStatusColor(event.status)}`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="py-4 sm:py-5 px-4 sm:px-6">
                                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                                                <button onClick={() => handleViewRegistrants(event)} className="p-1.5 sm:p-2 hover:bg-purple-50 text-purple-400 hover:text-purple-600 rounded-lg transition-all" title="View Registrants">
                                                    <Users size={16} className="sm:size-[18px]" />
                                                </button>
                                                <button onClick={() => handleEdit(event)} className="p-1.5 sm:p-2 hover:bg-blue-50 text-blue-400 hover:text-blue-600 rounded-lg transition-all" title="Edit">
                                                    <Edit2 size={16} className="sm:size-[18px]" />
                                                </button>
                                                <button onClick={() => handleDelete(event.id)} className="p-1.5 sm:p-2 hover:bg-rose-50 text-rose-300 hover:text-rose-500 rounded-lg transition-all" title="Delete">
                                                    <Trash2 size={16} className="sm:size-[18px]" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/40 animate-in fade-in transition-all">
                    <div className="bg-theme-surface rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{editingEvent ? 'Edit' : 'Create'} Event</h2>
                                <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">Platform Gatherings</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="p-2 sm:p-3 bg-theme-surface text-slate-400 hover:text-slate-900 rounded-xl transition-all shadow-sm">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto max-h-[80vh]">
                            <div className="space-y-5 sm:space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-700 bg-slate-50/30 text-sm"
                                        placeholder="Event name..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                    <textarea
                                        name="description"
                                        rows="2"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-700 bg-slate-50/30 text-sm"
                                        placeholder="Event details..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                                        <input
                                            type="datetime-local"
                                            name="startTime"
                                            required
                                            value={formData.startTime}
                                            onChange={handleInputChange}
                                            className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-700 bg-slate-50/30 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Time</label>
                                        <input
                                            type="datetime-local"
                                            name="endTime"
                                            required
                                            value={formData.endTime}
                                            onChange={handleInputChange}
                                            className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-700 bg-slate-50/30 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                                        <select
                                            name="eventType"
                                            value={formData.eventType}
                                            onChange={handleInputChange}
                                            className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-700 bg-slate-50/30 text-sm"
                                        >
                                            <option value="OFFLINE">Offline</option>
                                            <option value="ONLINE">Online</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-700 bg-slate-50/30 text-sm"
                                        >
                                            <option value="UPCOMING">Upcoming</option>
                                            <option value="ONGOING">Ongoing</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        {formData.eventType === 'ONLINE' ? 'Link' : 'Location'}
                                    </label>
                                    <input
                                        type="text"
                                        name={formData.eventType === 'ONLINE' ? 'meetingLink' : 'location'}
                                        required
                                        value={formData.eventType === 'ONLINE' ? formData.meetingLink : formData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-700 bg-slate-50/30 text-sm"
                                        placeholder={formData.eventType === 'ONLINE' ? 'Meeting link...' : 'Venue name...'}
                                    />
                                </div>
                            </div>
 
                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="order-2 sm:order-1 px-8 py-3.5 rounded-xl sm:rounded-2xl text-slate-500 font-extrabold hover:bg-slate-50 transition-all text-xs sm:text-sm uppercase tracking-widest"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    className="order-1 sm:order-2 px-8 py-3.5 bg-slate-900 hover:bg-black text-white rounded-xl sm:rounded-2xl font-extrabold shadow-xl shadow-slate-900/10 transition-all text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center min-w-[140px]"
                                >
                                    {editingEvent ? 'Save' : 'Launch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Registrants Modal */}
            {showRegistrants && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/60 animate-in fade-in transition-all">
                    <div className="bg-theme-surface rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 sm:p-8 bg-slate-900 text-white flex justify-between items-center">
                            <div className="min-w-0">
                                <h2 className="text-xl sm:text-2xl font-black truncate">{selectedEventForRegistrants?.title}</h2>
                                <p className="text-slate-400 text-[10px] sm:text-xs font-bold mt-1 uppercase tracking-widest">Attendance</p>
                            </div>
                            <button onClick={() => setShowRegistrants(false)} className="p-2.5 sm:p-3 hover:bg-theme-surface/10 rounded-xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                            {registrantsLoading ? (
                                <div className="p-10 text-center">
                                    <div className="animate-spin w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full mx-auto mb-2"></div>
                                    <p className="text-slate-500 font-bold">Listing participants...</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {registrants.length === 0 ? (
                                        <div className="py-20 text-center bg-slate-50 rounded-[2rem]">
                                            <Users size={48} className="mx-auto text-slate-200 mb-4" />
                                            <p className="text-slate-500 font-bold text-lg">No registrations yet</p>
                                        </div>
                                    ) : (
                                        registrants.map((reg, idx) => (
                                            <div key={reg.id} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center font-black text-slate-500">{idx + 1}</div>
                                                    <div>
                                                        <p className="font-extrabold text-slate-900">{reg.userName}</p>
                                                        <p className="text-xs font-bold text-slate-400">{reg.userEmail}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-rose-500 uppercase tracking-tighter">Member</p>
                                                    <p className="text-[10px] font-bold text-slate-400">Joined platform</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className="p-8 border-t border-slate-100 flex justify-center bg-slate-50/50">
                            <button onClick={() => setShowRegistrants(false)} className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-black shadow-lg shadow-slate-900/10 active:scale-95 transition-all text-sm uppercase tracking-widest">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventManagement;
