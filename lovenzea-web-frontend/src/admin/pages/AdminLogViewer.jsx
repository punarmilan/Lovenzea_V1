import React, { useState, useEffect } from 'react';
import adminLogService from '../services/adminLogService';
import { ClipboardList, User, Shield, Info, Calendar, Clock, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminLogViewer = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        fetchLogs();
    }, [page, size]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await adminLogService.getAllLogs({ page, size });
            setLogs(data.content || []);
            setTotalElements(data.totalElements || 0);
        } catch (error) {
            toast.error('Failed to load activity logs');
        } finally {
            setLoading(false);
        }
    };

    const getActionColor = (action) => {
        if (action.includes('APPROVE')) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        if (action.includes('REJECT') || action.includes('BLOCK') || action.includes('DELETE')) return 'text-rose-600 bg-rose-50 border-rose-100';
        return 'text-blue-600 bg-blue-50 border-blue-100';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-theme-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">System Logs</h2>
                    <p className="text-sm text-theme-text-secondary font-medium">Record of all administrative actions</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100 w-full sm:w-auto">
                    <Search size={18} className="text-gray-400 ml-2 shrink-0" />
                    <input
                        type="text"
                        placeholder="Filter logs..."
                        className="bg-transparent border-none outline-none text-sm font-medium w-full sm:w-48"
                    />
                </div>
            </div>

            <div className="bg-theme-surface rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-4 sm:px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Admin</th>
                                <th className="px-4 sm:px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                <th className="hidden lg:table-cell px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Details</th>
                                <th className="px-4 sm:px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400">Loading logs...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan="4" className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-2 text-gray-300">
                                        <ClipboardList size={48} className="opacity-20" />
                                        <p className="font-bold">No activity logs found</p>
                                    </div>
                                </td></tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 sm:px-6 py-4">
                                            <p className="text-xs sm:text-sm font-bold text-gray-700 truncate max-w-[120px] sm:max-w-none">{log.adminEmail}</p>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4">
                                            <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-black border uppercase tracking-wider ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="hidden lg:table-cell px-6 py-4 text-theme-text-secondary font-medium">
                                            <div className="flex items-center gap-2">
                                                <Info size={14} className="text-gray-300 shrink-0" />
                                                <p className="text-sm">{log.details}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-gray-700 font-bold text-xs sm:text-sm">{new Date(log.createdAt).toLocaleDateString()}</span>
                                                <span className="text-[9px] sm:text-[10px] text-gray-400 font-black">{new Date(log.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalElements > size && (
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center gap-2">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                            className="px-4 py-2 border border-theme-border rounded-xl text-xs font-bold disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            disabled={(page + 1) * size >= totalElements}
                            onClick={() => setPage(page + 1)}
                            className="px-4 py-2 border border-theme-border rounded-xl text-xs font-bold disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLogViewer;
