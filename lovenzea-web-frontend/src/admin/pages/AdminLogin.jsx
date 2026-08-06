import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../store/adminAuthSlice';
import { toast } from 'react-hot-toast';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.adminAuth);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const b = await dispatch(adminLogin(credentials));
            if (adminLogin.fulfilled.match(b)) {
                toast.success('Admin Login Success');
                navigate('/admin/dashboard');
            } else {
                console.error('Admin login failed:', b.payload);
                toast.error(b.payload || 'Invalid Credentials');
            }
        } catch (err) {
            console.error('Error during admin login dispatch:', err);
            toast.error('An unexpected error occurred');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-3 sm:p-4">
            <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">LovenZea Admin</h1>
                    <p className="text-gray-400">Please sign in to your administrator account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                            placeholder="admin@lovenzea.com"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg shadow-lg transform active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-theme-text-secondary italic">Secure administrator access only</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
