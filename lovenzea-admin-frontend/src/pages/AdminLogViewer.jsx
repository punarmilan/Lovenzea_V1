import React, { useState, useEffect } from 'react';
import adminLogService from '../services/adminLogService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import { 
  History, 
  Search, 
  Clock, 
  User, 
  ShieldAlert, 
  Filter,
  CheckCircle,
  Inbox 
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [page, size]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await adminLogService.getAllLogs({ page, size });
      setLogs(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeVariant = (action = '') => {
    if (action.includes('APPROVE') || action.includes('RESOLVE') || action.includes('UNBLOCK')) return 'success';
    if (action.includes('REJECT') || action.includes('DELETE') || action.includes('BLOCK')) return 'danger';
    if (action.includes('CREATE') || action.includes('UPDATE')) return 'info';
    return 'default';
  };

  const filteredLogs = logs.filter((log) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (log.action && log.action.toLowerCase().includes(q)) ||
      (log.adminEmail && log.adminEmail.toLowerCase().includes(q)) ||
      (log.details && log.details.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <History size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">System & Audit Trails</h2>
            <p className="text-xs text-slate-400">Immutable ledger of all administrative interventions, verifications and moderation events</p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 self-start sm:self-auto">
          {totalElements} Events Recorded
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs by action, admin, details..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs font-medium"
          />
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <LoadingSpinner text="Retrieving audit stream..." />
      ) : filteredLogs.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No Audit Logs Found"
          message="No records match your search criteria."
        />
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Administrator</th>
                  <th className="py-4 px-6">Action Executed</th>
                  <th className="py-4 px-6">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap text-slate-400">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock size={13} className="text-slate-500" />
                        <span>{new Date(log.createdAt || Date.now()).toLocaleString()}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold text-rose-400">
                          {(log.adminEmail || 'A').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-white">{log.adminEmail || 'System'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                    </td>

                    <td className="py-4 px-6 text-slate-300 font-medium max-w-md truncate">
                      {log.details || 'Operational record updated'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Page {page + 1} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminLogViewer;
