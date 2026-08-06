import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

function OtpVerification() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    
    const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
    const [mobileOtp, setMobileOtp] = useState(['', '', '', '', '', '']);
    
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isMobileVerified, setIsMobileVerified] = useState(false);
    const [verifyingEmail, setVerifyingEmail] = useState(false);
    const [verifyingMobile, setVerifyingMobile] = useState(false);
    
    useEffect(() => {
        if (!location.state || !location.state.email || !location.state.mobileNumber) {
            toast.error("Invalid state. Redirecting to home.");
            navigate("/");
        } else {
            setEmail(location.state.email);
            setMobileNumber(location.state.mobileNumber);
        }
    }, [location.state, navigate]);

    const handleOtpChange = (type, index, value) => {
        if (!/^[0-9]?$/.test(value)) return;
        
        const newOtp = type === 'EMAIL' ? [...emailOtp] : [...mobileOtp];
        newOtp[index] = value;
        
        if (type === 'EMAIL') {
            setEmailOtp(newOtp);
        } else {
            setMobileOtp(newOtp);
        }

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${type}-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };
    
    const handleKeyDown = (type, index, e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            const prevInput = document.getElementById(`otp-${type}-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const verifyOtp = async (type) => {
        const otpArray = type === 'EMAIL' ? emailOtp : mobileOtp;
        const otpString = otpArray.join('');
        const identifier = type === 'EMAIL' ? email : mobileNumber;
        
        if (otpString.length < 6) {
            toast.error("Please enter the complete 6-digit OTP");
            return;
        }

        try {
            if (type === 'EMAIL') setVerifyingEmail(true);
            else setVerifyingMobile(true);

            await api.post('/auth/verify-otp', {
                identifier,
                otp: otpString,
                type
            });

            toast.success(`${type === 'EMAIL' ? 'Email' : 'Mobile'} verified successfully!`);
            
            if (type === 'EMAIL') {
                setIsEmailVerified(true);
            } else {
                setIsMobileVerified(true);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP");
        } finally {
            if (type === 'EMAIL') setVerifyingEmail(false);
            else setVerifyingMobile(false);
        }
    };

    const resendOtp = async (type) => {
        const identifier = type === 'EMAIL' ? email : mobileNumber;
        try {
            await api.post(`/auth/resend-otp?identifier=${identifier}&type=${type}`);
            toast.success(`OTP resent to your ${type === 'EMAIL' ? 'email' : 'mobile'}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend OTP");
        }
    };

    useEffect(() => {
        if (isEmailVerified && isMobileVerified) {
            toast.success("All verifications complete. Redirecting...");
            setTimeout(() => {
                navigate("/login"); // Redirect to login
            }, 2000);
        }
    }, [isEmailVerified, isMobileVerified, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-theme-surface rounded-2xl shadow-xl w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Verification Required</h2>
                
                {/* Email Verification Section */}
                <div className="mb-8 p-4 border rounded-xl bg-gray-50 relative">
                    {isEmailVerified && (
                        <div className="absolute inset-0 bg-theme-surface/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                            <div className="text-green-600 flex items-center gap-2 font-bold text-lg">
                                <span>Email Verified</span>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                        </div>
                    )}
                    <h3 className="font-semibold text-gray-700 mb-2">Email Verification</h3>
                    <p className="text-sm text-theme-text-secondary mb-4">Enter the 6-digit code sent to {email}</p>
                    
                    <div className="flex gap-2 justify-center mb-4">
                        {emailOtp.map((digit, i) => (
                            <input
                                key={i}
                                id={`otp-EMAIL-${i}`}
                                type="text"
                                maxLength="1"
                                className="w-10 h-12 text-center text-xl font-bold border-2 rounded-lg focus:border-rose-500 focus:outline-none"
                                value={digit}
                                onChange={(e) => handleOtpChange('EMAIL', i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown('EMAIL', i, e)}
                            />
                        ))}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={() => verifyOtp('EMAIL')}
                            disabled={verifyingEmail}
                            className="w-full bg-rose-600 text-white py-2 rounded-lg font-medium hover:bg-rose-700 disabled:opacity-50"
                        >
                            {verifyingEmail ? 'Verifying...' : 'Verify Email OTP'}
                        </button>
                        <button 
                            onClick={() => resendOtp('EMAIL')}
                            className="text-sm text-rose-600 font-medium hover:underline text-center"
                        >
                            Resend Email OTP
                        </button>
                    </div>
                </div>

                {/* Mobile Verification Section */}
                <div className="p-4 border rounded-xl bg-gray-50 relative">
                    {isMobileVerified && (
                        <div className="absolute inset-0 bg-theme-surface/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                            <div className="text-green-600 flex items-center gap-2 font-bold text-lg">
                                <span>Mobile Verified</span>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                        </div>
                    )}
                    <h3 className="font-semibold text-gray-700 mb-2">Mobile Verification</h3>
                    <p className="text-sm text-theme-text-secondary mb-4">Enter the 6-digit code sent to {mobileNumber}</p>
                    
                    <div className="flex gap-2 justify-center mb-4">
                        {mobileOtp.map((digit, i) => (
                            <input
                                key={i}
                                id={`otp-MOBILE-${i}`}
                                type="text"
                                maxLength="1"
                                className="w-10 h-12 text-center text-xl font-bold border-2 rounded-lg focus:border-rose-500 focus:outline-none"
                                value={digit}
                                onChange={(e) => handleOtpChange('MOBILE', i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown('MOBILE', i, e)}
                            />
                        ))}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={() => verifyOtp('MOBILE')}
                            disabled={verifyingMobile}
                            className="w-full bg-rose-600 text-white py-2 rounded-lg font-medium hover:bg-rose-700 disabled:opacity-50"
                        >
                            {verifyingMobile ? 'Verifying...' : 'Verify Mobile OTP'}
                        </button>
                        <button 
                            onClick={() => resendOtp('MOBILE')}
                            className="text-sm text-rose-600 font-medium hover:underline text-center"
                        >
                            Resend Mobile OTP
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default OtpVerification;
