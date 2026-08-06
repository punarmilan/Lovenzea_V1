import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { adminLogout } from './store/adminAuthSlice';
import { LayoutDashboard, Users, CheckCircle, Image, Flag, LogOut, CreditCard, HelpCircle, History, CalendarDays, Menu, X, MessageCircle, Smartphone } from 'lucide-react';
import projectLogo from '../assets/image/project_logo_transperent.png';

const AdminLayout = () => {
    const { admin } = useSelector((state) => state.adminAuth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const drawerRef = useRef(null);

    if (!admin) {
        return <Navigate to="/admin/login" replace />;
    }

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Close drawer on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (mobileMenuOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [mobileMenuOpen]);

    const handleLogout = () => {
        dispatch(adminLogout());
        navigate('/admin/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_SUB_ADMIN', 'ROLE_KYC_VERIFIER', 'ROLE_EVENT_MANAGER'] },
        { name: 'User Management', path: '/admin/users', icon: Users, roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_SUB_ADMIN'] },
        { name: 'Mobile Users', path: '/admin/mobile-users', icon: Smartphone, roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_SUB_ADMIN'] },
        { name: 'Events', path: '/admin/events', icon: CalendarDays, roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_EVENT_MANAGER', 'ROLE_SUB_ADMIN'] },
        { name: 'Profile Approvals', path: '/admin/approvals', icon: CheckCircle, roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_KYC_VERIFIER', 'ROLE_SUB_ADMIN'] },
        { name: 'Photo Moderation', path: '/admin/photos', icon: Image, roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_KYC_VERIFIER', 'ROLE_SUB_ADMIN'] },
        { name: 'Reports', path: '/admin/reports', icon: Flag, roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_SUB_ADMIN'] },
        { name: 'Subscriptions', path: '/admin/subscriptions', icon: CreditCard, roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_SUB_ADMIN'] },
        { name: 'Support', path: '/admin/support', icon: HelpCircle, roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_SUB_ADMIN'] },
        { name: 'Contact Messages', path: '/admin/contacts', icon: MessageCircle, roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_SUB_ADMIN'] },
        { name: 'Activity Logs', path: '/admin/logs', icon: History, roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_SUB_ADMIN'] },
    ];

    const filteredMenuItems = menuItems.filter(item => item.roles.includes(admin.role));

    /** Reusable sidebar content — shared between desktop & mobile drawer */
    const SidebarContent = () => (
        <>
            <div className="p-5 sm:p-6 border-b border-gray-800">
                <div className="flex items-center gap-3">

                            <div className="flex items-center gap-0">
                                <img src={projectLogo} alt="LovenZea Logo" className="w-14 h-14 sm:w-16 sm:h-16 object-cover drop-shadow-xl hover:scale-105 transition-transform duration-300" />
                                <span className="text-2xl sm:text-3xl font-black tracking-tighter text-white drop-shadow-sm flex items-center ml-[1px]">
                                    Loven<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d94f73] to-rose-500">Zea</span>
                                </span>
                            </div>

                </div>
                <div className="flex items-center gap-2 mt-2 ml-1">
                    <p className="text-pink-500 text-[10px] font-black uppercase tracking-widest">Admin Panel</p>
                    <span className="h-1 w-1 bg-gray-600 rounded-full" />
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{admin.role.replace('ROLE_', '').replace('_', ' ')}</p>
                </div>
            </div>

            <nav className="flex-1 mt-4 sm:mt-6 px-3 sm:px-4 space-y-1 overflow-y-auto">
                {filteredMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-pink-600 text-white shadow-lg'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <Icon className={`w-5 h-5 mr-3 transition-colors shrink-0 ${isActive ? 'text-white' : 'group-hover:text-pink-500'}`} />
                            <span className="font-medium text-sm sm:text-base">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 sm:p-4 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 sm:px-4 py-2.5 sm:py-3 text-gray-400 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200"
                >
                    <LogOut className="w-5 h-5 mr-3 shrink-0" />
                    <span className="font-medium text-sm sm:text-base">Sign Out</span>
                </button>
                <div className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-gray-800 rounded-lg">
                    <p className="text-xs text-theme-text-secondary">Logged in as</p>
                    <p className="text-sm text-gray-300 font-medium truncate">{admin.email}</p>
                </div>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* ===== Desktop Sidebar (md+) ===== */}
            <aside className="w-64 bg-gray-900 shadow-xl hidden md:flex flex-col">
                <SidebarContent />
            </aside>

            {/* ===== Mobile Drawer Overlay (<md) ===== */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm md:hidden transition-opacity" />
            )}

            {/* ===== Mobile Drawer (<md) ===== */}
            <aside
                ref={drawerRef}
                className={`fixed inset-y-0 left-0 z-[9999] w-72 max-w-[85vw] bg-gray-900 shadow-2xl flex flex-col md:hidden transform transition-transform duration-300 ease-in-out ${
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Close button inside drawer */}
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
                >
                    <X className="w-6 h-6" />
                </button>
                <SidebarContent />
            </aside>

            {/* ===== Main Content ===== */}
            <main className="flex-1 flex flex-col overflow-hidden min-w-0">
                <header className="bg-theme-surface shadow-sm h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 md:px-12 shrink-0">
                    <div className="flex items-center min-w-0">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden mr-3 text-theme-text-secondary hover:text-gray-900 transition-colors p-1"
                            aria-label="Open menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">
                            {menuItems.find(item => item.path === location.pathname)?.name || 'Admin'}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
                        <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold border-2 border-pink-200 text-sm">
                            {admin.name.charAt(0)}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
