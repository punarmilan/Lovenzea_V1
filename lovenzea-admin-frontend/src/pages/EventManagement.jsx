import React, { useState, useEffect } from 'react';
import adminEventService from '../services/adminEventService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { 
  CalendarDays, 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Sparkles,
  Video 
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  // Registrants view
  const [selectedEventForRegistrants, setSelectedEventForRegistrants] = useState(null);
  const [registrants, setRegistrants] = useState([]);
  const [loadingRegistrants, setLoadingRegistrants] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    location: '',
    meetingLink: '',
    isOnline: false,
    maxAttendees: 50,
    price: 0,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await adminEventService.getAllEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load matrimony events');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      eventDate: '',
      eventTime: '',
      location: '',
      meetingLink: '',
      isOnline: false,
      maxAttendees: 50,
      price: 0,
    });
    setIsEventModalOpen(true);
  };

  const handleOpenEditModal = (evt) => {
    setEditingEvent(evt);
    setFormData({
      title: evt.title || '',
      description: evt.description || '',
      eventDate: evt.eventDate || '',
      eventTime: evt.eventTime || '',
      location: evt.location || '',
      meetingLink: evt.meetingLink || '',
      isOnline: evt.isOnline || false,
      maxAttendees: evt.maxAttendees || 50,
      price: evt.price || 0,
    });
    setIsEventModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.eventDate) {
      toast.error('Please enter a title and event date');
      return;
    }

    try {
      if (editingEvent) {
        await adminEventService.updateEvent(editingEvent.id, formData);
        toast.success('Event updated successfully');
      } else {
        await adminEventService.createEvent(formData);
        toast.success('New matrimony meetup scheduled');
      }
      setIsEventModalOpen(false);
      fetchEvents();
    } catch (err) {
      toast.error('Failed to save event');
    }
  };

  const handleDeleteEvent = async (id, title) => {
    const result = await Swal.fire({
      title: 'Cancel Event?',
      text: `Are you sure you want to cancel and delete "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, Cancel Event',
      background: '#0f172a',
      color: '#f8fafc',
    });

    if (result.isConfirmed) {
      try {
        await adminEventService.deleteEvent(id);
        toast.success('Event removed');
        fetchEvents();
      } catch (err) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleViewRegistrants = async (evt) => {
    setSelectedEventForRegistrants(evt);
    setLoadingRegistrants(true);
    try {
      const data = await adminEventService.getEventRegistrants(evt.id);
      setRegistrants(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load registrants');
    } finally {
      setLoadingRegistrants(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <CalendarDays size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Matchmaking Events & Speed Dating</h2>
            <p className="text-xs text-slate-400">Organize virtual webinars, matrimonial meets, and speed-matching sessions</p>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-950/40 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Host New Event</span>
        </button>
      </div>

      {/* Events Grid */}
      {loading ? (
        <LoadingSpinner text="Retrieving scheduled meetups..." />
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No Scheduled Events"
          message="No virtual or offline matrimony events have been scheduled."
          action={
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
            >
              Host First Event
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800 flex flex-col justify-between hover:border-purple-500/40 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                    {evt.title}
                  </h4>
                  <Badge variant={evt.isOnline ? 'info' : 'purple'} size="xs">
                    {evt.isOnline ? 'VIRTUAL' : 'OFFLINE'}
                  </Badge>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {evt.description || 'Community matrimonial mixer for verified candidates.'}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-rose-400 shrink-0" />
                    <span>{evt.eventDate} {evt.eventTime ? `at ${evt.eventTime}` : ''}</span>
                  </div>
                  
                  {evt.isOnline ? (
                    <div className="flex items-center gap-2">
                      <Video size={14} className="text-cyan-400 shrink-0" />
                      <span className="truncate">{evt.meetingLink || 'Virtual Room Link'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-emerald-400 shrink-0" />
                      <span className="truncate">{evt.location || 'Venue TBD'}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-amber-400 shrink-0" />
                    <span>Max {evt.maxAttendees || 50} Attendees • {evt.price ? `₹${evt.price}` : 'Free Entry'}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleViewRegistrants(evt)}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                >
                  <Users size={14} />
                  <span>View Registrants</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(evt)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(evt.id, evt.title)}
                    className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Event Modal */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title={editingEvent ? 'Edit Matrimony Event' : 'Host New Matrimony Event'}
        subtitle="Configure schedule, venue, and attendee capacity"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Event Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Sunday Virtual Speed Dating (Age 24-30)"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Event Date</label>
              <input
                type="date"
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Event Time</label>
              <input
                type="time"
                value={formData.eventTime}
                onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 py-1">
            <input
              type="checkbox"
              id="isOnlineCheckbox"
              checked={formData.isOnline}
              onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
            />
            <label htmlFor="isOnlineCheckbox" className="text-xs font-bold text-slate-200 cursor-pointer">
              This is a Virtual Online Meeting (Zoom / Google Meet)
            </label>
          </div>

          {formData.isOnline ? (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Meeting URL / Link</label>
              <input
                type="url"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                placeholder="https://meet.google.com/xyz-abc-def"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Physical Venue Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Grand Ballroom, Marriott Hotel, Mumbai"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Maximum Attendees</label>
              <input
                type="number"
                value={formData.maxAttendees}
                onChange={(e) => setFormData({ ...formData, maxAttendees: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Entry Fee (₹ 0 for free)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Description & Agenda</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide event details, dress code, age criteria..."
              className="w-full p-3 rounded-xl glass-input text-xs font-medium"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEventModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold shadow-lg"
            >
              Save Event
            </button>
          </div>
        </form>
      </Modal>

      {/* Registrants View Modal */}
      <Modal
        isOpen={!!selectedEventForRegistrants}
        onClose={() => setSelectedEventForRegistrants(null)}
        title="Event Registrants"
        subtitle={`Attendees registered for "${selectedEventForRegistrants?.title}"`}
      >
        {loadingRegistrants ? (
          <LoadingSpinner text="Loading attendee list..." />
        ) : registrants.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No candidates have registered for this event yet.
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {registrants.map((reg, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {(reg.name || 'U').charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{reg.name || `User #${reg.userId}`}</p>
                    <p className="text-slate-400 text-[11px]">{reg.email} • {reg.phone || 'N/A'}</p>
                  </div>
                </div>
                <Badge variant="success" size="xs">Confirmed</Badge>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EventManagement;
