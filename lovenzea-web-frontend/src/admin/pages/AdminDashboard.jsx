import React, { useState, useEffect } from 'react';
import { adminDashboardService } from '../services/adminDashboardService';
import { useSelector } from 'react-redux';
import { CheckCircle, Users, Activity, BarChart3, TrendingUp, PieChart, Flag, Bell, CalendarDays } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart as RePieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-theme-surface p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-3xl font-black text-gray-900">{value}</h3>
            </div>
            <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-xl`}>
                <Icon size={24} className={color.replace('bg-', 'text-').replace('-600', '-500')} />
            </div>
        </div>
        {trend && (
            <div className="mt-4 flex items-center text-[10px] font-bold">
                <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <TrendingUp size={10} /> {trend}
                </span>
                <span className="text-gray-400 ml-2 uppercase tracking-tighter">vs last month</span>
            </div>
        )}
    </div>
);

const AdminDashboard = () => {
    const { admin } = useSelector((state) => state.adminAuth);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminDashboardService.getStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
    );

    const pieData = stats?.genderDistribution ? Object.entries(stats.genderDistribution).map(([name, value]) => ({ name, value })) : [];
    const COLORS = ['#EC4899', '#6366F1', '#10B981', '#F59E0B'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Top Bar / Welcome */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-theme-text-secondary font-medium text-sm sm:text-base">Welcome back, Admin! Here's what's happening today.</p>
                </div>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                    <button className="p-2 sm:p-3 bg-theme-surface rounded-2xl border border-gray-100 shadow-sm text-gray-400 hover:text-pink-500 transition-colors">
                        <Bell size={20} />
                    </button>
                    <div className="flex-1 sm:flex-none justify-center bg-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-pink-100 flex items-center gap-2">
                        <Activity size={18} />
                        Live Status
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_SUB_ADMIN', 'ROLE_KYC_VERIFIER'].includes(admin.role) && (
                    <StatCard
                        title="Total Registered"
                        value={stats?.totalUsers || 0}
                        icon={Users}
                        color="bg-pink-600"
                        trend="+12.5%"
                    />
                )}
                {['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_KYC_VERIFIER'].includes(admin.role) && (
                    <StatCard
                        title="Pending Verifications"
                        value={stats?.pendingApprovals || 0}
                        icon={CheckCircle}
                        color="bg-amber-600"
                    />
                )}
                {['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_SUB_ADMIN'].includes(admin.role) && (
                    <StatCard
                        title="Active Subscriptions"
                        value={stats?.activeSubscriptions || 0}
                        icon={BarChart3}
                        color="bg-purple-600"
                        trend="+5.2%"
                    />
                )}
                {['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_SUB_ADMIN', 'ROLE_MODERATOR'].includes(admin.role) && (
                    <StatCard
                        title="Active Reports"
                        value={stats?.reportedProfiles || 0}
                        icon={Flag}
                        color="bg-rose-600"
                    />
                )}
                {['ROLE_EVENT_MANAGER', 'ROLE_SUPER_ADMIN', 'ROLE_SUB_ADMIN'].includes(admin.role) && (
                    <StatCard
                        title="Total Events"
                        value="Manage Events"
                        icon={CalendarDays}
                        color="bg-indigo-600"
                    />
                )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Growth Chart */}
                {['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_SUB_ADMIN'].includes(admin.role) && (
                    <div className="lg:col-span-2 bg-theme-surface p-4 sm:p-8 rounded-[24px] sm:rounded-[32px] shadow-sm border border-gray-100">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                            <div>
                                <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">User Growth</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Growth over time</p>
                            </div>
                            <select className="w-full sm:w-auto bg-gray-50 border-none rounded-xl text-[10px] sm:text-xs font-black p-2 outline-none">
                                <option>Last 30 Days</option>
                                <option>Last 6 Months</option>
                            </select>
                        </div>
                        <div className="h-60 sm:h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.userGrowth || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#EC4899" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#9ca3af' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#9ca3af' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke="#EC4899" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Distribution Chart */}
                {['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_SUB_ADMIN'].includes(admin.role) && (
                    <div className="bg-theme-surface p-4 sm:p-8 rounded-[24px] sm:rounded-[32px] shadow-sm border border-gray-100 flex flex-col">
                        <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight mb-1">Gender Dist.</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6 sm:mb-8">Demographic Split</p>
                        <div className="flex-1 h-56 sm:h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-2 mt-4">
                            {pieData.map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-[10px] sm:text-xs font-bold">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                        <span className="text-theme-text-secondary uppercase">{item.name}</span>
                                    </div>
                                    <span className="text-gray-900">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Section */}
            <div className={`grid grid-cols-1 ${['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_SUB_ADMIN'].includes(admin.role) ? 'lg:grid-cols-2' : ''} gap-6 sm:gap-8`}>
                {/* Pending Actions */}
                {['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_KYC_VERIFIER', 'ROLE_SUB_ADMIN'].includes(admin.role) && (
                    <div className="bg-theme-surface p-4 sm:p-8 rounded-[24px] sm:rounded-[32px] shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-5 sm:mb-6">
                            <h2 className="text-lg sm:text-xl font-black text-gray-900">Priority Actions</h2>
                            <button className="text-[10px] font-black text-pink-600 uppercase">View All</button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: 'New Profile Verification', count: stats?.pendingApprovals || 0, color: 'text-amber-500 bg-amber-50', allowed: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_KYC_VERIFIER'] },
                                { title: 'Pending Photo Moderation', count: stats?.pendingPhotoApprovals || 0, color: 'text-blue-500 bg-blue-50', allowed: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_KYC_VERIFIER'] },
                                { title: 'New User Reports', count: stats?.reportedProfiles || 0, color: 'text-rose-500 bg-rose-50', allowed: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_SUB_ADMIN'] }
                            ].filter(a => a.allowed.includes(admin.role)).map((action, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold text-gray-700">{action.title}</span>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${action.color}`}>
                                            {action.count} Items
                                        </span>
                                        <Activity size={14} className="text-gray-300 group-hover:text-pink-500 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* System Health / Revenue */}
                {['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_SUB_ADMIN'].includes(admin.role) && (
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-[32px] shadow-xl text-white">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h2 className="text-2xl font-black leading-tight">System Performance</h2>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Platform Status: Active</p>
                            </div>
                            <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl text-xs font-black uppercase">Healthy</div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-theme-text-secondary uppercase tracking-widest">Est. Revenue</p>
                                <h4 className="text-3xl font-black tracking-tighter">₹{stats?.totalRevenue?.toLocaleString() || '0.00'}</h4>
                                <p className="text-[10px] text-gray-400 font-medium italic">Based on active subscriptions</p>
                            </div>
                            <div className="space-y-2 text-right">
                                <p className="text-[10px] font-black text-theme-text-secondary uppercase tracking-widest">Success Match Rate</p>
                                <h4 className="text-3xl font-black tracking-tighter">18.4%</h4>
                                <div className="flex justify-end gap-1">
                                    {[1, 2, 3, 4, 5].map(i => <div key={i} className={`h-1 w-4 rounded-full ${i <= 4 ? 'bg-pink-500' : 'bg-gray-700'}`}></div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default AdminDashboard;
