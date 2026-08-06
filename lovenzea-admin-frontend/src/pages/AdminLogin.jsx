import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../store/adminAuthSlice';
import { Lock, Mail, ShieldCheck, Eye, EyeOff, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import projectLogo from '../assets/project_logo_transperent.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.adminAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password');
      return;
    }

    try {
      const res = await dispatch(adminLogin({ email, password }));
      if (adminLogin.fulfilled.match(res)) {
        toast.success('Authentication successful! Welcome back.');
        navigate('/dashboard');
      } else {
        toast.error(res.payload || 'Invalid administrator credentials');
      }
    } catch (err) {
      toast.error('An unexpected connection error occurred');
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    toast.success(`Filled credentials for ${demoEmail}`);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-4 sm:p-6 bg-login-pattern relative overflow-hidden">
      {/* Background Animated Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '3s' }} />

      <div className="relative w-full max-w-lg z-10">
        {/* Card Header with Glowing Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-rose-950/40 mb-4 group hover:scale-105 transition-transform duration-300">
            <img 
              src={projectLogo} 
              alt="LovenZea Logo" 
              className="w-16 h-16 object-contain drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]" 
            />
          </div>
          <div className="flex items-center justify-center gap-1 font-black text-3xl sm:text-4xl text-white tracking-tight">
            <span>Loven</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-500 to-rose-600">Zea</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-rose-400 mt-1">
            Enterprise Admin Portal
          </p>
          <p className="text-slate-400 text-xs mt-2">
            Secure administrative and moderation command center
          </p>
        </div>

        {/* Login Form Card */}
        <div className="glass-card bg-slate-900/85 backdrop-blur-2xl rounded-3xl border border-slate-700/80 p-6 sm:p-10 shadow-2xl shadow-black/80">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@lovenzea.online"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl glass-input text-sm font-medium transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl glass-input text-sm font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-600 text-white font-extrabold text-sm tracking-wide shadow-xl shadow-rose-950/60 hover:shadow-rose-900/80 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In To Command Center</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Access Helper Pills */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-3 text-center">
              Quick Autofill Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@punarmilan.com', 'admin123')}
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all text-xs group cursor-pointer"
              >
                <div className="font-bold text-slate-200 group-hover:text-rose-400">Default Super Admin</div>
                <div className="text-[10px] text-slate-500 truncate">admin@punarmilan.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@lovenzea.online', 'admin123')}
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all text-xs group cursor-pointer"
              >
                <div className="font-bold text-slate-200 group-hover:text-pink-400">Production Admin</div>
                <div className="text-[10px] text-slate-500 truncate">admin@lovenzea.online</div>
              </button>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>256-Bit SSL Encrypted Administrative Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
