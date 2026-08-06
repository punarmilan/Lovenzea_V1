import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { adminDashboardService } from '../services/adminDashboardService';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';
import { 
  Users, 
  CheckCircle2, 
  CreditCard, 
  Flag, 
  Activity, 
  Sparkles, 
  ArrowUpRight, 
  CalendarDays, 
  Image as ImageIcon,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Clock,
  UserCheck
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const AdminDashboard = () => {
  const { admin } = useSelector((state) => state.adminAuth);
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, logsData] = await Promise.all([
        adminDashboardService.getStats(),
        adminDashboardService.getRecentActivity(),
      ]);
      setStats(statsData);
      setRecentLogs(logsData?.content || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Aggregating metrics & platform telemetry..." />;
  }

  // Formatting Pie Chart Data
  const genderData = stats?.genderDistribution
    ? Object.entries(stats.genderDistribution).map(([name, value]) => ({
        name: name.toUpperCase(),
        value: Number(value) || 0,
      }))
    : [
        { name: 'MALE', value: 65 },
        { name: 'FEMALE', value: 35 },
      ];

  const GENDER_COLORS = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b'];

  // Simulated Weekly Growth Trajectory Data
  const growthTrajectory = [
    { day: 'Mon', users: Math.max(10, Math.floor((stats?.totalUsers || 100) * 0.72)), active: 45 },
    { day: 'Tue', users: Math.max(15, Math.floor((stats?.totalUsers || 100) * 0.78)), active: 52 },
    { day: 'Wed', users: Math.max(22, Math.floor((stats?.totalUsers || 100) * 0.84)), active: 61 },
    { day: 'Thu', users: Math.max(28, Math.floor((stats?.totalUsers || 100) * 0.89)), active: 68 },
    { day: 'Fri', users: Math.max(35, Math.floor((stats?.totalUsers || 100) * 0.94)), active: 79 },
    { day: 'Sat', users: Math.max(42, Math.floor((stats?.totalUsers || 100) * 0.98)), active: 95 },
    { day: 'Sun', users: stats?.totalUsers || 100, active: 110 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 glass-card border border-slate-700/80 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-rose-950/40 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold">
              <Sparkles size={14} className="text-rose-400" />
              <span>Real-Time Engine Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good day, {admin?.name || 'Administrator'}
            </h2>
            <p className="text-slate-400 text-sm max-w-xl">
              Here is your centralized telemetry overview for LovenZea Matrimony. Monitor profile verifications, user engagement, and moderation pipelines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/approvals"
              className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-950/60 transition-all cursor-pointer"
            >
              <UserCheck size={16} />
              <span>Verify Profiles ({stats?.pendingApprovals || 0})</span>
            </Link>
            <Link
              to="/photos"
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <ImageIcon size={16} />
              <span>Photo Queue</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Registered Users"
          value={stats?.totalUsers?.toLocaleString() || '0'}
          icon={Users}
          color="rose"
          trend="+14.2%"
          subtitle="All platform accounts"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingApprovals || '0'}
          icon={CheckCircle2}
          color="amber"
          subtitle="KYC verification queue"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats?.activeSubscriptions || '0'}
          icon={CreditCard}
          color="emerald"
          trend="+8.5%"
          subtitle="Premium members"
        />
        <StatCard
          title="Flagged Reports"
          value={stats?.pendingReports || '0'}
          icon={Flag}
          color="indigo"
          subtitle="Awaiting moderation"
        />
      </div>

      {/* Analytics & Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">User Acquisition & Activity</h3>
              <p className="text-xs text-slate-400">Weekly trajectory of new registrations vs active users</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-slate-800 text-rose-400 text-xs font-bold border border-slate-700">
              Live Feed
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthTrajectory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff' }}
                  itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="users" name="Total Users" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#userGrad)" />
                <Area type="monotone" dataKey="active" name="Daily Active" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#activeGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Distribution Donut Chart */}
        <div className="glass-card p-6 rounded-3xl space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Demographics Ratio</h3>
            <p className="text-xs text-slate-400">Gender distribution of registered profiles</p>
          </div>

          <div className="h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff' }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white">{stats?.totalUsers || 0}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profiles</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            {genderData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: GENDER_COLORS[index % GENDER_COLORS.length] }} />
                  <span className="font-semibold text-slate-300">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value} users</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Shortcuts & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Operational Shortcuts */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight">Quick Operations</h3>
          <p className="text-xs text-slate-400">Direct shortcuts to administrative workflows</p>

          <div className="space-y-2.5 pt-2">
            <Link
              to="/users"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">User Directory</p>
                  <p className="text-[11px] text-slate-500">Search, filter and manage accounts</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/events"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">Matchmaking Events</p>
                  <p className="text-[11px] text-slate-500">Manage virtual & offline meetups</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/subscriptions"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Membership Packages</p>
                  <p className="text-[11px] text-slate-500">Configure pricing and perks</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Recent Audit Logs Feed */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Recent Administrative Actions</h3>
              <p className="text-xs text-slate-400">Live feed of moderator approvals, updates, and reviews</p>
            </div>
            <Link to="/logs" className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1">
              <span>View All Logs</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {recentLogs.length > 0 ? (
              recentLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
                      <Clock size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-200 truncate">{log.action}</p>
                      <p className="text-[11px] text-slate-400 truncate">{log.details || `Performed by ${log.adminEmail || 'Admin'}`}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 shrink-0">
                    {new Date(log.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs font-medium">
                No recent activity logged in this cycle.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
