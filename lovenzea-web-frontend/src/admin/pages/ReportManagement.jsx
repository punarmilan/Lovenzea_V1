import React, { useState, useEffect } from 'react';
import adminReportService from '../services/adminReportService';
import { AlertCircle, CheckCircle, XCircle, Trash2, Eye, MessageSquare, Flag } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [resolvingId, setResolvingId] = useState(null);
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
        } catch (error) {
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async () => {
        if (!adminNote) {
            toast.error('Please provide an admin note');
            return;
        }
        try {
            await adminReportService.resolveReport(resolvingId, adminNote);
            toast.success('Report resolved');
            setResolvingId(null);
            setAdminNote('');
            fetchReports();
        } catch (error) {
            toast.error('Failed to resolve report');
        }
    };

    const handleDismiss = async (id) => {
        try {
            await adminReportService.dismissReport(id);
            toast.success('Report dismissed');
            fetchReports();
        } catch (error) {
            toast.error('Failed to dismiss report');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'RESOLVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'DISMISSED': return 'bg-gray-50 text-theme-text-secondary border-gray-100';
            default: return 'bg-gray-50 text-theme-text-secondary';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-theme-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">Report & Moderation</h2>
                    <p className="text-xs sm:text-sm text-theme-text-secondary font-medium">Review reported accounts and content</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-none px-4 py-2 bg-rose-50 text-rose-700 rounded-xl text-[10px] sm:text-xs font-black uppercase text-center">
                        {reports.filter(r => r.status === 'PENDING').length} New Reports
                    </div>
                </div>
            </div>

            <div className="bg-theme-surface rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-4 sm:px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail</th>
                                <th className="hidden sm:table-cell px-4 sm:px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Reported Profile</th>
                                <th className="hidden md:table-cell px-4 sm:px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-4 sm:px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400 font-medium">Loading reports...</td></tr>
                            ) : reports.length === 0 ? (
                                <tr><td colSpan="4" className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-2 text-gray-300">
                                        <Flag size={48} className="opacity-20" />
                                        <p className="font-bold">No reports found</p>
                                    </div>
                                </td></tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 sm:px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-[10px] font-black text-rose-500 uppercase">{report.reason}</span>
                                                    <span className="text-[9px] text-gray-400">• {new Date(report.createdAt).toLocaleDateString()}</span>
                                                    <span className={`sm:hidden px-1.5 py-0.5 rounded-md text-[8px] font-black border uppercase ${getStatusStyle(report.status)}`}>
                                                        {report.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-theme-text-secondary line-clamp-2">{report.description}</p>
                                                <div className="sm:hidden mt-2 p-2 bg-gray-50 rounded-lg">
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase">Target: {report.reportedUserName}</p>
                                                </div>
                                                <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium truncate">By: {report.reporterName}</p>
                                            </div>
                                        </td>
                                        <td className="hidden sm:table-cell px-4 sm:px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 text-xs font-bold shrink-0">
                                                    {report.reportedUserName?.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs sm:text-sm font-bold text-gray-800 truncate">{report.reportedUserName}</p>
                                                    <p className="text-[9px] sm:text-[10px] font-black text-pink-600 uppercase tracking-widest">{report.reportedUserProfileId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell px-4 sm:px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-wider ${getStatusStyle(report.status)}`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-right">
                                            {report.status === 'PENDING' ? (
                                                <div className="flex justify-end gap-1.5 sm:gap-2">
                                                    <button
                                                        onClick={() => setResolvingId(report.id)}
                                                        className="p-1.5 sm:p-2 bg-emerald-50 text-emerald-600 rounded-lg sm:rounded-xl hover:bg-emerald-100 transition-colors"
                                                        title="Resolve Report"
                                                    >
                                                        <CheckCircle size={16} className="sm:size-[18px]" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDismiss(report.id)}
                                                        className="p-1.5 sm:p-2 bg-gray-50 text-theme-text-secondary rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors"
                                                        title="Dismiss Report"
                                                    >
                                                        <XCircle size={16} className="sm:size-[18px]" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="text-[10px] text-gray-400 font-medium italic">Processed {new Date(report.resolvedAt).toLocaleDateString()}</p>
                                            )}
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

            {/* Resolve Modal */}
            {resolvingId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
                    <div className="bg-theme-surface rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
                        <div className="bg-rose-600 p-5 sm:p-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <AlertCircle size={20} className="sm:size-6" />
                                <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight">Resolve Report</h3>
                            </div>
                            <button onClick={() => setResolvingId(null)} className="text-white/80 hover:text-white">
                                <XCircle size={20} className="sm:size-6" />
                            </button>
                        </div>
                        <div className="p-6 sm:p-8 space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Resolution Note</label>
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="Explain action taken..."
                                    className="w-full h-32 px-4 py-3 border border-theme-border rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 outline-none resize-none"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <button
                                    onClick={handleResolve}
                                    className="order-1 sm:order-none flex-1 bg-rose-600 text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-rose-50 hover:bg-rose-700 active:scale-95 transition-all"
                                >
                                    Confirm Action
                                </button>
                                <button
                                    onClick={() => setResolvingId(null)}
                                    className="order-2 sm:order-none px-6 bg-gray-100 text-theme-text-secondary py-3 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportManagement;
