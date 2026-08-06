import React, { useState, useEffect } from 'react';
import adminContactService from '../services/adminContactService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import { 
  MessageSquare, 
  Mail, 
  CheckCircle, 
  Eye, 
  Clock, 
  Sparkles,
  Inbox,
  ExternalLink 
} from 'lucide-react';
import toast from 'react-hot-toast';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await adminContactService.getAllMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load contact inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await adminContactService.updateStatus(id, newStatus);
      toast.success(`Message marked as ${newStatus}`);
      fetchMessages();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <MessageSquare size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Public Inquiries & Contact Messages</h2>
            <p className="text-xs text-slate-400">Direct inquiries submitted from website contact forms and landing pages</p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 self-start sm:self-auto">
          {messages.length} Messages Logged
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <LoadingSpinner text="Retrieving inquiries..." />
      ) : messages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No Contact Inquiries"
          message="No inquiries have been received yet."
        />
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                    {msg.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{msg.name || 'Anonymous Sender'}</h4>
                    <a 
                      href={`mailto:${msg.email}`} 
                      className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                    >
                      <Mail size={12} />
                      <span>{msg.email}</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={msg.status === 'RESOLVED' || msg.status === 'RESPONDED' ? 'success' : 'primary'}>
                    {msg.status || 'NEW'}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    {new Date(msg.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                {msg.subject && <h5 className="font-bold text-slate-200">{msg.subject}</h5>}
                <p className="text-slate-300 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 leading-relaxed">
                  {msg.message}
                </p>
              </div>

              {/* Status Update Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 text-xs">
                {msg.status !== 'RESPONDED' && (
                  <button
                    onClick={() => handleUpdateStatus(msg.id, 'RESPONDED')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-semibold transition-colors cursor-pointer"
                  >
                    Mark as Responded
                  </button>
                )}
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'LovenZea Inquiry')}`}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink size={12} />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
