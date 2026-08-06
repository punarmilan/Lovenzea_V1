import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { adminLogout } from '../store/adminAuthSlice';
import { X } from 'lucide-react';

const AdminLayout = () => {
  const { admin } = useSelector((state) => state.adminAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // If unauthenticated, redirect to /login
  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090d16] bg-mesh text-slate-100">
      {/* Desktop Sidebar (lg+) */}
      <aside className="hidden lg:flex w-72 h-full shrink-0 flex-col z-20">
        <Sidebar admin={admin} onLogout={handleLogout} />
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Mobile Drawer (sliding from left) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#0d1322] lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileDrawerOpen(false)}
          className="absolute top-5 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 z-10"
        >
          <X size={18} />
        </button>
        <Sidebar 
          admin={admin} 
          onLogout={handleLogout} 
          onCloseMobile={() => setMobileDrawerOpen(false)} 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header 
          admin={admin} 
          onOpenMobileMenu={() => setMobileDrawerOpen(true)} 
        />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
