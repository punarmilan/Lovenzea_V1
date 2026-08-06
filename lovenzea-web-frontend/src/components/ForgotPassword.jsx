import React, { useState } from "react";
import { Mail, AlertCircle, ArrowLeft, CheckCircle, Lock, Key } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { forgotPassword, verifyForgotPasswordOtp, resetPasswordWithOtp } from "../Slice/UserSlice";

function ForgotPassword() {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.user);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return "Email is required";
        if (!emailRegex.test(email)) return "Enter valid email address";
        return "";
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        const emailError = validateEmail(email);

        if (emailError) {
            setError(emailError);
            toast.error(emailError);
            return;
        }

        setError("");

        try {
            const resultAction = await dispatch(forgotPassword({ email }));
            if (forgotPassword.fulfilled.match(resultAction)) {
                setStep(2);
                toast.success("OTP sent successfully! Check your email.");
            } else {
                const errorMessage = resultAction.payload || "Failed to send OTP";
                toast.error(errorMessage);
            }
        } catch (err) {
            console.error("Forgot password error:", err);
            toast.error("An unexpected error occurred. Please try again.");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        
        if (otpString.length < 6) {
            setError("Please enter the complete 6-digit OTP");
            toast.error("Please enter the complete 6-digit OTP");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            toast.error("Passwords do not match");
            return;
        }

        setError("");

        try {
            const resultAction = await dispatch(resetPasswordWithOtp({ 
                email, 
                otp: otpString, 
                newPassword 
            }));
            if (resetPasswordWithOtp.fulfilled.match(resultAction)) {
                setStep(3);
                toast.success("Password reset successfully!");
            } else {
                const errorMessage = resultAction.payload || "Failed to reset password";
                toast.error(errorMessage);
            }
        } catch (err) {
            console.error("Reset password error:", err);
            toast.error("An unexpected error occurred. Please try again.");
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`forgot-otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };
    
    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            const prevInput = document.getElementById(`forgot-otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    if (step === 3) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
                <div className="max-w-md w-full space-y-8 bg-theme-surface p-8 rounded-2xl shadow-xl text-center">
                    <div className="flex justify-center">
                        <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Password Reset Complete</h2>
                    <p className="mt-2 text-sm text-theme-text-secondary">
                        Your password has been successfully reset. You can now login with your new password.
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-cyan-600 hover:text-cyan-500 flex items-center justify-center gap-2 bg-cyan-50 p-3 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Return to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-theme-surface p-8 rounded-2xl shadow-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {step === 1 ? "Forgot password?" : "Reset Password"}
                    </h2>
                    <p className="mt-2 text-center text-sm text-theme-text-secondary">
                        {step === 1 ? "No worries, we'll send you an OTP to reset your password." : `Enter the OTP sent to ${email} and choose a new password.`}
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={step === 1 ? handleSendOtp : handleResetPassword}>
                    {step === 1 ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`appearance-none rounded-lg relative block w-full px-10 py-3 border ${error ? "border-red-500" : "border-gray-300"
                                            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm`}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {error && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {error}
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-2 text-center">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Enter 6-Digit OTP
                                </label>
                                <div className="flex justify-center gap-2">
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`forgot-otp-${i}`}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                            className="w-12 h-14 bg-gray-50 border-2 border-gray-300 focus:border-cyan-400 focus:bg-theme-surface rounded-xl text-center text-xl font-bold text-gray-800 outline-none transition-all shadow-sm"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                                        placeholder="Enter new password"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="mt-1 text-xs text-red-500 flex items-center justify-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {error}
                                </p>
                            )}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                        >
                            {loading ? "Processing..." : step === 1 ? "Send OTP" : "Reset Password"}
                        </button>
                    </div>

                    <div className="text-center flex justify-between items-center mt-4">
                        {step === 2 && (
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-sm font-medium text-theme-text-secondary hover:text-gray-900 flex items-center gap-1"
                            >
                                <ArrowLeft className="w-4 h-4" /> Change Email
                            </button>
                        )}
                        <Link
                            to="/login"
                            className="text-sm font-medium text-cyan-600 hover:text-cyan-500 flex items-center gap-1 ml-auto"
                        >
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
