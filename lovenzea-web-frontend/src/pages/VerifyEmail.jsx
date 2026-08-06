import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, XCircle, Loader2, Home, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link. Token is missing.');
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await api.get(`/auth/verify-email?token=${token}`);
                setStatus('success');
                setMessage(response.data.message || 'Email verified successfully!');
                toast.success('Email verified successfully!');
            } catch (error) {
                setStatus('error');
                const errorMessage = error.response?.data?.message || 'Verification failed. The link may be expired or invalid.';
                setMessage(errorMessage);
                toast.error(errorMessage);
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-theme-surface rounded-3xl shadow-2xl p-8 text-center animate-fadeIn">
                {/* Logo/Icon Area */}
                <div className="mb-8 flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <span className="text-white text-4xl font-bold italic">P</span>
                    </div>
                </div>

                {/* Status Content */}
                {status === 'loading' && (
                    <div className="space-y-4 animate-pulse">
                        <div className="flex justify-center">
                            <Loader2 className="w-16 h-16 text-rose-500 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Verifying Your Email</h2>
                        <p className="text-theme-text-secondary">Please wait while we confirm your account...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6 animate-scaleIn">
                        <div className="flex justify-center">
                            <div className="bg-green-100 p-4 rounded-full">
                                <CheckCircle className="w-16 h-16 text-green-500" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Success!</h2>
                        <p className="text-theme-text-secondary font-medium">{message}</p>
                        <p className="text-sm text-theme-text-secondary">
                            Your account is now active. You may log in to start finding your perfect match.
                        </p>
                        <div className="flex flex-col gap-3 pt-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-rose-200 transition-all flex items-center justify-center gap-2"
                            >
                                <LogIn className="w-5 h-5" />
                                Go to Login
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-theme-surface border-2 border-rose-500 text-rose-500 py-3 rounded-xl font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Home className="w-5 h-5" />
                                Back to Home
                            </button>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6 animate-shake">
                        <div className="flex justify-center">
                            <div className="bg-red-100 p-4 rounded-full">
                                <XCircle className="w-16 h-16 text-red-500" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Verification Failed</h2>
                        <p className="text-red-500 font-medium">{message}</p>
                        <p className="text-sm text-theme-text-secondary">
                            Try registering again or contact support if the problem persists.
                        </p>
                        <div className="flex flex-col gap-3 pt-4">
                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-rose-500 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-rose-600 transition-all"
                            >
                                Register Again
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-gray-100 text-theme-text-secondary py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
                .animate-scaleIn { animation: scaleIn 0.4s ease-out; }
                .animate-shake { animation: shake 0.4s ease-in-out; }
            `}</style>
        </div>
    );
};

export default VerifyEmail;
