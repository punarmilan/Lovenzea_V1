import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import bannerBg from '../../../assets/image/banner-bg.png';
import {
  User,
  Phone,
  Filter,
  Star,
  Bell,
  Shield,
  Video,
  Trash2,
  MessageCircle,
  Settings as SettingsIcon,
  Sparkles,
  Lock,
  CheckCircle2,
  ArrowRight,
  X,
  Edit3
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProfile, updateProfile } from '../../../Slice/ProfileSlice';
import { logout } from '../../../Slice/UserSlice';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import AccountSettings from './AccountSettings';
import MyContactSettings from './MyContactSettings';
import AstroDetails from './AstroDetails';
import AlertsSettings from './AlertsSettings';
import PrivacyOptions from './PrivacyOptions';
import LovenZeaLive from './LovenZeaLive';
import DeleteHide from './DeleteHide';
import Messages from './Messages';

const Settings = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { profile, loading } = useSelector((state) => state.profile);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    if (!profile) {
      dispatch(fetchMyProfile());
    }
  }, [dispatch, profile]);

  useEffect(() => {
    if (location.state?.openSection) {
      setActiveSection(location.state.openSection);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleUpdateProfile = async (updates) => {
    try {
      const isSensitiveUpdate = updates.email || updates.mobileNumber;
      await dispatch(updateProfile(updates)).unwrap();

      if (isSensitiveUpdate) {
        toast.success(
          `${updates.email ? 'Email' : 'Mobile number'} updated successfully. Please login again with your new credentials.`
        );

        setTimeout(() => {
          dispatch(logout());
          navigate('/');
        }, 2000);
      } else {
        toast.success('Settings updated successfully');
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
      toast.error(err || 'Failed to update settings');
    }
  };

  const sections = [
    {
      id: 'account',
      label: 'Account Settings',
      desc: 'Manage email, password and login security',
      icon: User,
      accent: 'from-pink-500 to-rose-500',
      component: <AccountSettings email={profile?.email} onUpdate={handleUpdateProfile} />,
    },
    {
      id: 'contact',
      label: 'Contact Settings',
      desc: 'Control who can view your mobile number',
      icon: Phone,
      accent: 'from-purple-500 to-fuchsia-500',
      component: <MyContactSettings profile={profile} onUpdate={handleUpdateProfile} />,
    },
    {
      id: 'filters',
      label: 'Contact Filters',
      desc: 'Age, religion, city and partner preferences',
      icon: Filter,
      accent: 'from-amber-500 to-orange-500',
      isLink: true,
      action: () => navigate('/my-shadi/my-contact/contact-filters'),
    },
    {
      id: 'astro',
      label: 'Astro Details',
      desc: 'Horoscope details and matching preferences',
      icon: Star,
      accent: 'from-yellow-500 to-amber-500',
      component: <AstroDetails profile={profile} onUpdate={handleUpdateProfile} />,
    },
    {
      id: 'alerts',
      label: 'Email / SMS Alerts',
      desc: 'Notification and reminder preferences',
      icon: Bell,
      accent: 'from-sky-500 to-cyan-500',
      component: <AlertsSettings profile={profile} onUpdate={handleUpdateProfile} />,
    },
    {
      id: 'privacy',
      label: 'Privacy Options',
      desc: 'Profile, photo and visibility controls',
      icon: Shield,
      accent: 'from-emerald-500 to-teal-500',
      component: <PrivacyOptions profile={profile} onUpdate={handleUpdateProfile} />,
    },
    {
      id: 'live',
      label: 'LovenZea Live',
      desc: 'Video meeting and live interaction settings',
      icon: Video,
      accent: 'from-red-500 to-pink-500',
      isNew: true,
      component: <LovenZeaLive profile={profile} onUpdate={handleUpdateProfile} />,
    },
    {
      id: 'messages',
      label: 'Messages',
      desc: 'Chat privacy and inbox rules',
      icon: MessageCircle,
      accent: 'from-indigo-500 to-violet-500',
      component: <Messages profile={profile} onUpdate={handleUpdateProfile} />,
    },
    {
      id: 'delete',
      label: 'Hide / Delete',
      desc: 'Hide, deactivate or delete your profile',
      icon: Trash2,
      accent: 'from-slate-600 to-slate-900',
      component: <DeleteHide profile={profile} onUpdate={handleUpdateProfile} />,
    },
  ];

  const quickStats = [
    { label: 'Profile Safety', value: 'High', icon: Shield },
    { label: 'Contact Control', value: 'On', icon: Lock },
    { label: 'Synced', value: loading ? 'Now' : 'Ready', icon: CheckCircle2 },
  ];

  if (!profile && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff7fb] via-[#fffdf8] to-[#f8f2ff]">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-theme-surface/80 px-10 py-8 shadow-[0_20px_70px_rgba(190,24,93,0.12)] border border-white/70 backdrop-blur-xl">
          <div className="relative">
            <div className="w-11 h-11 rounded-full border-4 border-pink-100 border-t-pink-500 animate-spin" />
            <Sparkles className="w-4 h-4 text-pink-500 absolute -right-1 -top-1 animate-pulse" />
          </div>
          <p className="text-xs font-semibold text-slate-500 tracking-wide">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent font-sans pb-20">
      <div className="pointer-events-none absolute -top-32 -left-28 h-80 w-80 rounded-full bg-pink-200/20 blur-3xl" />
      <div className="pointer-events-none absolute top-28 -right-24 h-80 w-80 rounded-full bg-purple-200/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-amber-100/30 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:pt-10"
      >
        <div className="relative mb-6 overflow-hidden rounded-[32px] border border-white/70 dashboard-card-bg shadow-[0_22px_70px_rgba(190,24,93,0.06)]" style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="relative p-6 sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(236,72,153,0.14),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(168,85,247,0.14),transparent_35%)]" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4 lg:w-[45%] xl:w-1/2">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-xl shadow-pink-500/30 ring-4 ring-pink-50">
                  <SettingsIcon size={24} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                      Settings Hub
                    </h1>
                    {loading && (
                      <span className="rounded-full bg-pink-100/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-pink-700 shadow-sm">
                        Syncing
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 max-w-xl text-sm font-medium leading-relaxed text-slate-500">
                    Manage your account, privacy, contact visibility and alerts from one beautifully designed control center.
                  </p>
                </div>
              </div>

              <div className="flex overflow-x-auto sm:grid sm:grid-cols-3 gap-3 w-full lg:w-[50%] xl:w-[45%] pb-2 sm:pb-0 shrink-0">
                {quickStats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-[20px] border border-white/80 bg-theme-surface/80 px-4 py-3.5 text-center shadow-sm backdrop-blur transition-transform hover:scale-[1.02] min-w-[120px] sm:min-w-0 flex-shrink-0"
                    >
                      <Icon className="mx-auto mb-1.5 h-5 w-5 text-pink-500 drop-shadow-sm" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                      <p className="mt-0.5 text-[13px] font-extrabold text-slate-800">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sections.map((section, index) => {
            const Icon = section.icon;

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                onClick={() => section.isLink ? section.action() : setActiveSection(section.id)}
                className="group relative overflow-hidden rounded-[24px] border border-white/90 bg-theme-surface/60 p-4 sm:p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:bg-theme-surface hover:shadow-[0_15px_40px_rgba(236,72,153,0.12)] cursor-pointer"
              >
                <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-pink-50 text-pink-600">
                    {section.isLink ? <ArrowRight size={12} /> : <Edit3 size={12} />}
                  </div>
                </div>

                <div className={`mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br ${section.accent} text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:shadow-pink-500/25`}>
                  <Icon size={18} />
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[14px] font-extrabold text-slate-800 group-hover:text-pink-600 transition-colors">
                    {section.label}
                  </h3>
                  {section.isNew && (
                    <span className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-1.5 py-[1px] text-[8px] font-black uppercase tracking-wider text-white shadow-sm">
                      New
                    </span>
                  )}
                </div>
                
                <p className="text-[11px] sm:text-xs font-medium leading-relaxed text-slate-500 pr-2">
                  {section.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 rounded-3xl border border-white/80 bg-theme-surface/50 p-5 text-center text-xs font-semibold text-slate-400 shadow-sm backdrop-blur-xl">
          Your privacy matters. Sensitive changes like email or mobile update may require login again.
        </div>
      </motion.div>

      {/* Edit Modal Popup */}
      {createPortal(
        <AnimatePresence>
          {activeSection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md"
              onClick={() => setActiveSection(null)}
            >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl overflow-hidden rounded-[32px] bg-theme-surface shadow-2xl ring-1 ring-black/5 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-5">
                <div className="flex items-center gap-3">
                  {(() => {
                    const section = sections.find((s) => s.id === activeSection);
                    const Icon = section?.icon;
                    return section ? (
                      <>
                        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${section.accent} text-white shadow-md`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <h2 className="text-lg font-extrabold text-slate-800 leading-none">{section.label}</h2>
                          <p className="text-[11px] font-medium text-slate-400 mt-1">{section.desc}</p>
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>
                <button
                  onClick={() => setActiveSection(null)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-slate-200/50 text-slate-500 transition-colors hover:bg-rose-100 hover:text-rose-600"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="overflow-y-auto p-6 scrollbar-hide">
                {sections.find((s) => s.id === activeSection)?.component}
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default Settings;
