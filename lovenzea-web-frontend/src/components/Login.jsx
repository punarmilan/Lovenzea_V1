import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff, Mail, Lock, AlertCircle, ChevronRight, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { login, loginWithOtp, clearError } from "../Slice/UserSlice";
import api from "../services/api";

function Login({ close, openRegister }) {
    const [loginMethod, setLoginMethod] = useState("PASSWORD"); // "PASSWORD" or "OTP"
    
    // Form state
    const [user, setUser] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [stayLoggedIn, setStayLoggedIn] = useState(true);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    
    // OTP specific state
    const [otpStep, setOtpStep] = useState(1); // 1 = request, 2 = verify
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isRequestingOtp, setIsRequestingOtp] = useState(false);
    const [loginType, setLoginType] = useState(""); // "EMAIL" or "MOBILE"

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error: reduxError } = useSelector((state) => state.user);

    // Load saved credentials on mount
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        const savedPassword = localStorage.getItem("rememberedPassword");
        if (savedEmail && savedPassword) {
            setUser({ email: savedEmail, password: savedPassword });
            setStayLoggedIn(true);
        }
    }, []);

    // Clear errors when switching tabs
    useEffect(() => {
        setErrors({});
        setTouched({});
        if (reduxError) {
            dispatch(clearError());
        }
    }, [loginMethod, dispatch]);

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!email) return "Email or Mobile number is required";
        if (/[A-Z]/.test(email) && emailRegex.test(email.toLowerCase())) {
            return "Please use smallcase only for email";
        }
        if (!emailRegex.test(email) && !phoneRegex.test(email)) {
            return "Enter valid email or 10-digit mobile number";
        }
        return "";
    };

    const validatePassword = (password) => {
        if (loginMethod === "OTP") return "";
        if (!password) return "Password is required";
        if (password.length < 6) return "Password must be at least 6 characters";
        return "";
    };

    function handleChange(e) {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });

        if (touched[name]) setErrors({ ...errors, [name]: "" });
        if (reduxError) dispatch(clearError());
    }

    function handleBlur(field) {
        setTouched({ ...touched, [field]: true });
        let error = "";
        if (field === "email") error = validateEmail(user.email);
        else if (field === "password") error = validatePassword(user.password);
        setErrors({ ...errors, [field]: error });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        if (loginMethod === "OTP") {
            if (otpStep === 1) {
                handleRequestOtp();
            } else {
                handleVerifyOtp();
            }
            return;
        }

        const emailError = validateEmail(user.email);
        const passwordError = validatePassword(user.password);

        if (emailError || passwordError) {
            setErrors({ email: emailError, password: passwordError });
            setTouched({ email: true, password: true });
            if (emailError) toast.error(emailError);
            else if (passwordError) toast.error(passwordError);
            return;
        }

        try {
            const resultAction = await dispatch(login(user));
            if (login.fulfilled.match(resultAction)) {
                if (stayLoggedIn) {
                    localStorage.setItem("rememberedEmail", user.email);
                    localStorage.setItem("rememberedPassword", user.password);
                } else {
                    localStorage.removeItem("rememberedEmail");
                    localStorage.removeItem("rememberedPassword");
                }
                toast.success("Login successful! 🎉");
                try {
                    const profileRes = await api.get('/profiles/me');
                    if (profileRes.data && (profileRes.data.profileComplete || (profileRes.data.religion && profileRes.data.caste))) {
                        navigate('/my-shadi');
                    } else {
                        navigate('/complete-profile');
                    }
                } catch (e) {
                    navigate('/complete-profile');
                }
                close && close();
                setTimeout(() => window.location.reload(), 1000);
            } else {
                handleLoginError(resultAction.payload);
            }
        } catch (err) {
            toast.error("An unexpected error occurred. Please try again.");
        }
    }
    
    // OTP Logic
    const handleRequestOtp = async () => {
        const emailError = validateEmail(user.email);
        if (emailError) {
            setErrors({ email: emailError });
            setTouched({ email: true });
            toast.error(emailError);
            return;
        }

        const type = /^[0-9]{10}$/.test(user.email) ? "MOBILE" : "EMAIL";
        setLoginType(type);
        setIsRequestingOtp(true);

        try {
            await api.post('/auth/login-otp/request', {
                identifier: user.email,
                type: type
            });
            toast.success(`OTP sent to your ${type.toLowerCase()}!`);
            setOtpStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setIsRequestingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        if (otpString.length < 6) {
            toast.error("Please enter the complete 6-digit OTP");
            return;
        }

        try {
            const resultAction = await dispatch(loginWithOtp({
                identifier: user.email,
                otp: otpString,
                type: loginType
            }));

            if (loginWithOtp.fulfilled.match(resultAction)) {
                toast.success("Login successful! 🎉");
                try {
                    const profileRes = await api.get('/profiles/me');
                    if (profileRes.data && (profileRes.data.profileComplete || (profileRes.data.religion && profileRes.data.caste))) {
                        navigate('/my-shadi');
                    } else {
                        navigate('/complete-profile');
                    }
                } catch (e) {
                    navigate('/complete-profile');
                }
                close && close();
                setTimeout(() => window.location.reload(), 1000);
            } else {
                handleLoginError(resultAction.payload);
            }
        } catch (err) {
            toast.error("An unexpected error occurred. Please try again.");
        }
    };

    const handleLoginError = (errorMessage) => {
        if (!errorMessage) errorMessage = "Login failed";
        if (errorMessage.toLowerCase().includes("not found")) {
            toast.error("User not found. Please register first.");
        } else if (errorMessage.toLowerCase().includes("password")) {
            toast.error("Invalid password. Please try again.");
        } else {
            toast.error(errorMessage);
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`login-otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };
    
    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            const prevInput = document.getElementById(`login-otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    function handleBackdropClick(e) {
        if (e.target === e.currentTarget) {
            close ? close() : navigate("/");
        }
    }

    const onInternalClose = (e) => {
        if (e) e.stopPropagation();
        close ? close() : navigate("/");
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
            onClick={handleBackdropClick}
        >
            <div className="relative w-full max-w-[95%] sm:max-w-md animate-slideUp">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-rose-400 rounded-3xl blur-2xl opacity-20 animate-pulse" />
                
                <div className="relative bg-theme-surface/95 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                    <button
                        onClick={onInternalClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 transition-colors z-20 p-2 hover:bg-gray-100 rounded-full bg-theme-surface/50"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="px-8 pt-8 pb-4 text-center relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-rose-500 shadow-xl mb-4 transform hover:scale-105 transition-transform">
                            <span className="text-white text-3xl font-black tracking-tighter">P</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-sm text-theme-text-secondary font-medium">Please login to continue</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-theme-border/60 relative z-10">
                        <button
                            type="button"
                            onClick={() => { setLoginMethod("PASSWORD"); setOtpStep(1); }}
                            className={`flex-1 py-4 text-sm font-semibold transition-all duration-300 relative ${loginMethod === "PASSWORD" ? "text-cyan-600 bg-cyan-50/50" : "text-theme-text-secondary hover:bg-gray-50/50 hover:text-gray-700"}`}
                        >
                            Password
                            {loginMethod === "PASSWORD" && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-600 shadow-sm" />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginMethod("OTP")}
                            className={`flex-1 py-4 text-sm font-semibold transition-all duration-300 relative ${loginMethod === "OTP" ? "text-rose-600 bg-rose-50/50" : "text-theme-text-secondary hover:bg-gray-50/50 hover:text-gray-700"}`}
                        >
                            OTP
                            {loginMethod === "OTP" && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-rose-400 to-rose-600 shadow-sm" />
                            )}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 relative z-10">
                        {reduxError && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-start gap-3 text-sm animate-fadeIn shadow-sm">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span className="font-medium">{reduxError}</span>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Email or Mobile <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative group flex items-center">
                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-cyan-500'}`} />
                                
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="Enter registered email or mobile"
                                    value={user.email}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("email")}
                                    disabled={loginMethod === "OTP" && otpStep === 2}
                                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-2 rounded-xl text-sm font-medium transition-all outline-none ${
                                        errors.email && touched.email
                                            ? "border-red-300 focus:border-red-500 focus:bg-theme-surface"
                                            : "border-transparent focus:border-cyan-400 focus:bg-theme-surface"
                                    } text-gray-800 placeholder:text-gray-400`}
                                />
                            </div>
                            {errors.email && touched.email && (
                                <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                                </p>
                            )}
                        </div>

                        {loginMethod === "PASSWORD" && (
                            <div className="space-y-1.5 animate-fadeIn">
                                <div className="flex justify-between items-center">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Password <span className="text-rose-500">*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => { close(); navigate("/forgot-password"); }}
                                        className="text-xs font-semibold text-cyan-600 hover:text-cyan-800 transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-cyan-500'}`} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Enter password"
                                        value={user.password}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("password")}
                                        className={`w-full pl-12 pr-12 py-3.5 bg-gray-50/50 border-2 rounded-xl text-sm font-medium transition-all outline-none ${
                                            errors.password && touched.password
                                                ? "border-red-300 focus:border-red-500 focus:bg-theme-surface"
                                                : "border-transparent focus:border-cyan-400 focus:bg-theme-surface"
                                        } text-gray-800 placeholder:text-gray-400`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-600 transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && touched.password && (
                                    <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">
                                        <AlertCircle className="w-3.5 h-3.5" /> {errors.password}
                                    </p>
                                )}
                            </div>
                        )}

                        {loginMethod === "OTP" && otpStep === 2 && (
                            <div className="space-y-3 animate-slideUp">
                                <div className="flex justify-between items-center">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Enter OTP
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setOtpStep(1)}
                                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
                                    >
                                        Change ID
                                    </button>
                                </div>
                                <div className="flex justify-between gap-2">
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`login-otp-${i}`}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                            className="w-12 h-14 bg-gray-50/50 border-2 border-transparent focus:border-rose-400 focus:bg-theme-surface rounded-xl text-center text-xl font-bold text-gray-800 outline-none transition-all shadow-sm"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || isRequestingOtp}
                            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
                                ${loginMethod === "PASSWORD" ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-cyan-500/30" : "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-rose-500/30"}
                            `}
                        >
                            {(loading || isRequestingOtp) ? (
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                loginMethod === "PASSWORD" ? "Login Securely" : (otpStep === 1 ? "Send OTP" : "Verify & Login")
                            )}
                        </button>

                        <div className="pt-2 text-center border-t border-gray-100">
                            <span className="text-theme-text-secondary text-sm">New to LovenZea? </span>
                            <button
                                type="button"
                                onClick={openRegister}
                                className="text-cyan-600 hover:text-cyan-800 font-bold text-sm transition-colors inline-flex items-center gap-0.5"
                            >
                                Sign Up Free <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
