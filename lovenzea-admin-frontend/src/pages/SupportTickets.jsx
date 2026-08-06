import React, { useState, useEffect } from 'react';
import adminSupportService from '../services/adminSupportService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { 
  HelpCircle, 
  Send, 
  MessageSquare, 
  User, 
  CheckCircle, 
  Clock, 
  Sparkles,
  Inbox 
} from 'lucide-react';
import toast from 'react-hot-toast';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Response dialog
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [page, size]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await adminSupportService.getAllTickets({ page, size });
      setTickets(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResponse = async () => {
    if (!replyText) {
      toast.error('Please compose a response message');
      return;
    }
    try {
      await adminSupportService.respondToTicket(selectedTicket.id, replyText);
      toast.success('Response dispatched to user');
      setSelectedTicket(null);
      setReplyText('');
      fetchTickets();
    } catch (error) {
      toast.error('Failed to dispatch response');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <HelpCircle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Customer Support Desk</h2>
            <p className="text-xs text-slate-400">Respond to user assistance tickets, queries, and technical inquiries</p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 self-start sm:self-auto">
          {totalElements} Tickets Tracked
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <LoadingSpinner text="Connecting to helpdesk queue..." />
      ) : tickets.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No Open Support Tickets"
          message="All customer support inquiries have been resolved."
        />
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400">Ticket #{ticket.id}</span>
                  <Badge variant={ticket.status === 'RESOLVED' ? 'success' : 'primary'}>
                    {ticket.status || 'OPEN'}
                  </Badge>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(ticket.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">{ticket.subject || 'Support Request'}</h4>
                <p className="text-xs text-slate-300 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
                  {ticket.message || ticket.description}
                </p>
              </div>

              {ticket.adminResponse && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                  <span className="font-bold text-emerald-400">Admin Response:</span>
                  <p className="text-slate-300">{ticket.adminResponse}</p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <span>User: {ticket.userName || `User #${ticket.userId || 'N/A'}`}</span>
                
                <button
                  onClick={() => setSelectedTicket(ticket)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Send size={14} />
                  <span>{ticket.adminResponse ? 'Reply Again' : 'Compose Reply'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => {
          setSelectedTicket(null);
          setReplyText('');
        }}
        title="Compose Ticket Response"
        subtitle={`Replying to ticket #${selectedTicket?.id}`}
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-500 block mb-1 font-bold">Inquiry Message:</span>
            <p className="text-slate-300">{selectedTicket?.message || selectedTicket?.description}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Your Response</label>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your official administrative reply..."
              className="w-full p-3 rounded-xl glass-input text-xs font-medium"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setSelectedTicket(null);
                setReplyText('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleSendResponse}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold shadow-lg"
            >
              Send Response
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SupportTickets;
