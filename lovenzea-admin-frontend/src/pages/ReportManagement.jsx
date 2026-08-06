import React, { useState, useEffect } from 'react';
import adminReportService from '../services/adminReportService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { 
  Flag, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  MessageSquare, 
  User, 
  Eye, 
  Sparkles 
} from 'lucide-react';
import toast from 'react-hot-toast';

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Resolving modal
  const [resolvingItem, setResolvingItem] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    fetchReports();
  }, [page, size]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await adminReportService.getAllReports({ page, size });
      setReports(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load incident reports');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmResolve = async () => {
    if (!adminNote) {
      toast.error('Please enter an action note');
      return;
    }
    try {
      await adminReportService.resolveReport(resolvingItem.id, adminNote);
      toast.success('Incident resolved successfully');
      setResolvingItem(null);
      setAdminNote('');
      fetchReports();
    } catch (error) {
      toast.error('Failed to resolve report');
    }
  };

  const handleDismiss = async (id) => {
    try {
      await adminReportService.dismissReport(id);
      toast.success('Report dismissed as invalid');
      fetchReports();
    } catch (error) {
      toast.error('Failed to dismiss report');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">PENDING REVIEW</Badge>;
      case 'RESOLVED':
        return <Badge variant="success">RESOLVED</Badge>;
      case 'DISMISSED':
        return <Badge variant="default">DISMISSED</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Flag size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Abuse & Safety Reports</h2>
            <p className="text-xs text-slate-400">Review flagged interactions, fake profiles, and harassment claims</p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 self-start sm:self-auto">
          {totalElements} Total Incidents Logged
        </div>
      </div>

      {/* Reports Feed */}
      {loading ? (
        <LoadingSpinner text="Retrieving moderation reports..." />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="Safe Community!"
          message="No active user violation reports currently filed."
        />
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-400">Incident #{report.id}</span>
                  {getStatusBadge(report.status || 'PENDING')}
                </div>
                <span className="text-xs text-slate-500">
                  Filed: {new Date(report.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Reported User */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">Reported Account</span>
                  <p className="text-sm font-bold text-white">{report.reportedUserName || `User #${report.reportedUserId}`}</p>
                  <p className="text-slate-400 text-xs">ID: #{report.reportedUserId}</p>
                </div>

                {/* Reporting User */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Reported By</span>
                  <p className="text-sm font-bold text-slate-300">{report.reporterName || `User #${report.reporterId}`}</p>
                  <p className="text-slate-500 text-xs">ID: #{report.reporterId}</p>
                </div>
              </div>

              {/* Reason & Details */}
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-1 text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Alleged Violation</span>
                <p className="text-sm font-semibold text-rose-300">{report.reason || 'Unspecified reason'}</p>
                {report.description && (
                  <p className="text-slate-400 mt-1">{report.description}</p>
                )}
              </div>

              {/* Admin Note if resolved */}
              {report.adminNote && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                  <span className="font-bold">Moderator Action: </span>
                  <span>{report.adminNote}</span>
                </div>
              )}

              {/* Actions */}
              {report.status !== 'RESOLVED' && report.status !== 'DISMISSED' && (
                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    onClick={() => handleDismiss(report.id)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Dismiss (Invalid)
                  </button>
                  <button
                    onClick={() => setResolvingItem(report)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer"
                  >
                    Take Action & Resolve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Resolve Incident Modal */}
      <Modal
        isOpen={!!resolvingItem}
        onClose={() => {
          setResolvingItem(null);
          setAdminNote('');
        }}
        title="Resolve Abuse Incident"
        subtitle={`Actioning report #${resolvingItem?.id}`}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Moderator Resolution Note</label>
            <textarea
              rows={3}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="e.g. Account suspended for 7 days, warning sent regarding profanity..."
              className="w-full p-3 rounded-xl glass-input text-xs font-medium"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setResolvingItem(null);
                setAdminNote('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmResolve}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg"
            >
              Confirm Resolution
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportManagement;
