import React, { useState } from "react";
import { X, Eye, EyeOff, AlertCircle, CheckCircle, Heart, ChevronDown } from "lucide-react";
import { FcBusinessman, FcPhone, FcFeedback, FcLock, FcExport, FcOk, FcPrivacy, FcUnlock, FcCancel } from "react-icons/fc";
import { FaMale, FaFemale } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { register } from "../Slice/UserSlice";
import maleAvatar from "../assets/image/male_avatar.png";
import femaleAvatar from "../assets/image/female_avatar.png";

function Register({ close, openLogin }) {
    const [user, setUser] = useState({
        mobileNumber: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        profileCreatedBy: "",
        gender: ""
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [isCreatedByOpen, setIsCreatedByOpen] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error: reduxError } = useSelector((state) => state.user);

    // Validation functions
    const validateMobile = (mobile) => {
        if (!mobile) return "Mobile number is required";
        if (!/^[6-9][0-9]{9}$/.test(mobile)) return "Enter valid 10-digit mobile number starting with 6-9";
        return "";
    };

    const validateEmail = (email) => {
        if (!email) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Enter valid email address";
        
        // Check for uppercase letters
        if (/[A-Z]/.test(email)) {
            console.log("Validation error (Register): Uppercase letters found:", email);
            return "Please use smallcase only";
        }
        
        return "";
    };

    const validatePassword = (password) => {
        if (!password) return "Password is required";
        if (password.length < 6) return "Password must be at least 6 characters";
        if (!/(?=.*[a-z])/.test(password)) return "Password must contain lowercase letter";
        if (!/(?=.*[A-Z])/.test(password)) return "Password must contain uppercase letter";
        if (!/(?=.*\d)/.test(password)) return "Password must contain a number";
        return "";
    };

    const validateConfirmPassword = (confirm) => {
        if (!confirm) return "Please confirm password";
        if (confirm !== user.password) return "Passwords do not match";
        return "";
    };

    // Password strength checker
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 6) strength += 25;
        if (password.length >= 10) strength += 25;
        if (/(?=.*[a-z])/.test(password)) strength += 15;
        if (/(?=.*[A-Z])/.test(password)) strength += 15;
        if (/(?=.*\d)/.test(password)) strength += 10;
        if (/(?=.*[@$!%*?&#])/.test(password)) strength += 10;

        if (strength <= 30) return { strength, label: 'Weak', color: 'bg-red-500' };
        if (strength <= 60) return { strength, label: 'Fair', color: 'bg-yellow-500' };
        if (strength <= 85) return { strength, label: 'Good', color: 'bg-blue-500' };
        return { strength, label: 'Strong', color: 'bg-theme-success' };
    };

    const passwordStrength = getPasswordStrength(user.password);

    // Handle input change
    function handleChange(e) {
        const { name, value } = e.target;

        // For mobile number, only allow digits
        if (name === "mobileNumber" && value && !/^\d*$/.test(value)) {
            return;
        }

        // For names, only allow alphabets and spaces
        if ((name === "firstName" || name === "lastName") && value && !/^[a-zA-Z\s]*$/.test(value)) {
            return;
        }

        setUser({ ...user, [name]: value });

        // Clear error when user starts typing
        if (touched[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    }

    // Handle blur to show validation errors
    function handleBlur(field) {
        setTouched({ ...touched, [field]: true });

        let error = "";
        if (field === "mobileNumber") {
            error = validateMobile(user.mobileNumber);
        } else if (field === "email") {
            error = validateEmail(user.email);
        } else if (field === "password") {
            error = validatePassword(user.password);
        } else if (field === "confirmPassword") {
            error = validateConfirmPassword(confirmPassword);
        } else if (field === "firstName") {
            error = validateName(user.firstName, "First name");
        } else if (field === "lastName") {
            error = validateName(user.lastName, "Last name");
        } else if (field === "profileCreatedBy") {
            error = validateCreatedBy(user.profileCreatedBy);
        } else if (field === "gender") {
            error = validateGender(user.gender);
        }

        setErrors({ ...errors, [field]: error });
    }

    const validateName = (name, label) => {
        if (!name) return `${label} is required`;
        if (name.length < 2) return `${label} must be at least 2 characters`;
        if (!/^[a-zA-Z\s]*$/.test(name)) return `${label} should only contain alphabets`;
        return "";
    };

    const validateCreatedBy = (value) => {
        if (!value) return "Please select who is creating this profile";
        return "";
    };

    const validateGender = (value) => {
        if (!value) return "Please select your gender";
        return "";
    };

    // Form submission
    async function handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const mobileError = validateMobile(user.mobileNumber);
        const emailError = validateEmail(user.email);
        const passwordError = validatePassword(user.password);
        const confirmError = validateConfirmPassword(confirmPassword);
        const firstNameError = validateName(user.firstName, "First name");
        const lastNameError = validateName(user.lastName, "Last name");
        const createdByError = validateCreatedBy(user.profileCreatedBy);
        const genderError = validateGender(user.gender);

        if (mobileError || emailError || passwordError || confirmError || firstNameError || lastNameError || createdByError || genderError) {
            setErrors({
                mobileNumber: mobileError,
                email: emailError,
                password: passwordError,
                confirmPassword: confirmError,
                firstName: firstNameError,
                lastName: lastNameError,
                profileCreatedBy: createdByError,
                gender: genderError
            });
            setTouched({
                mobileNumber: true,
                email: true,
                password: true,
                confirmPassword: true,
                firstName: true,
                lastName: true,
                profileCreatedBy: true,
                gender: true
            });
            toast.error("Please fix the errors in the form");
            return;
        }

        if (!acceptedTerms) {
            toast.error("Please accept terms and conditions");
            return;
        }

        try {
            const resultAction = await dispatch(register(user));
            if (register.fulfilled.match(resultAction)) {
                toast.success("Registration successful! 🎉 Please login.");
                // Close the modal if it's open, then navigate
                if (close) {
                    close();
                }
                navigate("/login");
            } else {
                toast.error(resultAction.payload || "Registration failed");
            }
        } catch (err) {
            toast.error("An unexpected error occurred");
        }
    }

    // Click outside to close
    function handleBackdropClick(e) {
        if (e.target === e.currentTarget) {
            if (close) {
                close();
            } else {
                navigate("/");
            }
        }
    }

    const onInternalClose = (e) => {
        if (e) e.stopPropagation();
        if (close) {
            close();
        } else {
            navigate("/");
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fadeIn overflow-y-auto"
            onClick={handleBackdropClick}
        >
            {/* Modal Container */}
            <div className="relative w-full max-w-[95%] sm:max-w-md md:max-w-lg my-4 sm:my-8 animate-slideUp">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-rose-400 rounded-3xl blur-2xl opacity-20 animate-pulse" />

                {/* Main Card */}
                <div className="relative bg-theme-surface/95 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                    {/* Header */}
                    {!showSuccessMessage && (
                        <>
                            <button
                                onClick={onInternalClose}
                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 transition-colors z-20 p-2 hover:bg-gray-100 rounded-full bg-theme-surface/50"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>

                            <div className="px-8 pt-8 pb-4 text-center relative z-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-rose-500 shadow-xl mb-4 transform hover:scale-105 transition-transform">
                                    <span className="text-white text-3xl font-black tracking-tighter">P</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-2">
                                    Create Account
                                </h2>
                                <p className="text-sm text-theme-text-secondary font-medium">Join thousands finding their perfect match</p>
                            </div>
                        </>
                    )}

                    {showSuccessMessage ? (
                        <div className="px-6 pb-12 pt-12 text-center space-y-6 animate-scaleIn">
                            <button
                                onClick={onInternalClose}
                                className="absolute right-4 top-4 text-gray-400 hover:text-theme-text-secondary transition-colors p-1 hover:bg-gray-100 rounded-full"
                                aria-label="Close"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="flex justify-center">
                                <div className="bg-rose-50 p-6 rounded-full relative">
                                    <Mail className="w-20 h-20 text-rose-500" />
                                    <div className="absolute top-0 right-0 bg-rose-500 text-white p-2 rounded-full border-4 border-white animate-bounce shadow-lg">
                                        <Send className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                                    Verify Your Email
                                </h2>
                                <p className="text-theme-text-secondary leading-relaxed">
                                    We've sent a verification link to <br />
                                    <span className="font-bold text-gray-900 border-b-2 border-rose-200">{user.email}</span>
                                </p>
                            </div>

                            <div className="bg-rose-50 rounded-2xl p-4 text-sm text-rose-800 font-medium border border-rose-100">
                                Please check your inbox (and spam folder) and click the link to activate your account.
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={() => {
                                        setShowSuccessMessage(false);
                                        if (close) close(); else navigate('/');
                                    }}
                                    className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 rounded-xl font-bold shadow-xl hover:shadow-rose-100 hover:-translate-y-0.5 transition-all text-lg"
                                >
                                    Got it, thanks!
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 bg-theme-surface max-h-[60vh] sm:max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {/* Profile Created By */}
                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-1">
                                    <span>Profile Created By</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div
                                        className={`w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border-2 ${errors.profileCreatedBy && touched.profileCreatedBy
                                            ? "border-red-500 focus:ring-red-400"
                                            : user.profileCreatedBy
                                                ? "border-green-500"
                                                : "border-theme-border"
                                            } rounded-full cursor-pointer flex items-center bg-theme-surface transition-all`}
                                        onClick={() => setIsCreatedByOpen(!isCreatedByOpen)}
                                    >
                                        <FcExport className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className={user.profileCreatedBy ? "text-gray-900" : "text-gray-400"}>
                                            {user.profileCreatedBy || "Select Option"}
                                        </span>
                                        <ChevronDown className={`absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${isCreatedByOpen ? "rotate-180" : ""}`} />
                                    </div>

                                    {isCreatedByOpen && (
                                        <div className="absolute z-30 w-full mt-1 bg-theme-surface border-2 border-gray-100 rounded-xl shadow-xl py-1 animate-slideDown overflow-hidden">
                                            {["Self", "Parent", "Sibling", "Friend", "Relative", "Other"].map((option) => (
                                                <div
                                                    key={option}
                                                    className="px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer text-sm sm:text-base text-gray-700 transition-colors"
                                                    onClick={() => {
                                                        setUser({ ...user, profileCreatedBy: option });
                                                        setErrors({ ...errors, profileCreatedBy: "" });
                                                        setIsCreatedByOpen(false);
                                                    }}
                                                >
                                                    {option}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {errors.profileCreatedBy && touched.profileCreatedBy && (
                                    <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{errors.profileCreatedBy}</span>
                                    </div>
                                )}
                            </div>

                            {/* First & Last Name */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-1">
                                        <span>First Name</span>
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FcBusinessman className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" />
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="First name"
                                            value={user.firstName}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur("firstName")}
                                            className={`w-full pl-10 sm:pl-12 pr-3 py-2.5 sm:py-3 text-sm sm:text-base border-2 ${errors.firstName && touched.firstName
                                                ? "border-red-500 focus:ring-red-400"
                                                : user.firstName
                                                    ? "border-green-500"
                                                    : "border-theme-border"
                                                } rounded-full focus:outline-none focus:ring-4 transition-all bg-theme-surface`}
                                        />
                                    </div>
                                    {errors.firstName && touched.firstName && (
                                        <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                                            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span>{errors.firstName}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-1">
                                        <span>Last Name</span>
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FcBusinessman className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" />
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Last name"
                                            value={user.lastName}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur("lastName")}
                                            className={`w-full pl-10 sm:pl-12 pr-3 py-2.5 sm:py-3 text-sm sm:text-base border-2 ${errors.lastName && touched.lastName
                                                ? "border-red-500 focus:ring-red-400"
                                                : user.lastName
                                                    ? "border-green-500"
                                                    : "border-theme-border"
                                                } rounded-full focus:outline-none focus:ring-4 transition-all bg-theme-surface`}
                                        />
                                    </div>
                                    {errors.lastName && touched.lastName && (
                                        <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                                            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span>{errors.lastName}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-1">
                                    <span>Gender</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUser({ ...user, gender: "Male" });
                                            setErrors({ ...errors, gender: "" });
                                        }}
                                        className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all ${user.gender === "Male"
                                                ? "border-cyan-500 bg-cyan-50 text-cyan-700 font-bold shadow-md ring-2 ring-cyan-200"
                                                : "border-theme-border text-theme-text-secondary hover:border-cyan-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <img src={maleAvatar} alt="Male" className="w-8 h-8 rounded-full object-cover shadow-sm bg-theme-surface" />
                                        <span>Male</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUser({ ...user, gender: "Female" });
                                            setErrors({ ...errors, gender: "" });
                                        }}
                                        className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all ${user.gender === "Female"
                                                ? "border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-md ring-2 ring-rose-200"
                                                : "border-theme-border text-theme-text-secondary hover:border-rose-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <img src={femaleAvatar} alt="Female" className="w-8 h-8 rounded-full object-cover shadow-sm bg-theme-surface" />
                                        <span>Female</span>
                                    </button>
                                </div>
                                {errors.gender && touched.gender && (
                                    <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm mt-1">
                                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{errors.gender}</span>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Number */}
                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-1">
                                    <span>Mobile Number</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative flex items-center">
                                    <FcPhone className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 z-20" />
                                    <div className="absolute left-9 sm:left-11 top-0 bottom-0 flex items-center justify-center px-1 bg-transparent text-theme-text-secondary font-bold z-10">
                                        +91
                                    </div>
                                    <input
                                        type="tel"
                                        name="mobileNumber"
                                        placeholder="Enter 10-digit mobile"
                                        value={user.mobileNumber}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("mobileNumber")}
                                        maxLength="10"
                                        className={`w-full pl-[5rem] sm:pl-[5.5rem] pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 ${errors.mobileNumber && touched.mobileNumber
                                            ? "border-red-500 focus:ring-red-400"
                                            : user.mobileNumber.length === 10
                                                ? "border-green-500 focus:ring-green-400"
                                                : "border-theme-border focus:ring-emerald-400"
                                            } rounded-full focus:outline-none focus:ring-4 transition-all bg-theme-surface`}
                                    />
                                </div>
                                {errors.mobileNumber && touched.mobileNumber ? (
                                    <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{errors.mobileNumber}</span>
                                    </div>
                                ) : user.mobileNumber.length === 10 ? (
                                    <div className="flex items-center gap-1 text-green-600 text-xs sm:text-sm">
                                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>Valid mobile number</span>
                                    </div>
                                ) : null}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-1">
                                    <span>Email Address</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FcFeedback className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter email address"
                                        value={user.email}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("email")}
                                        className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 ${errors.email && touched.email
                                            ? "border-red-500 focus:ring-red-400"
                                            : "border-theme-border focus:ring-emerald-400"
                                            } rounded-full focus:outline-none focus:ring-4 transition-all bg-theme-surface`}
                                    />
                                </div>
                                {errors.email && touched.email && (
                                    <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{errors.email}</span>
                                    </div>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-1">
                                    <span>Password</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FcLock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Create password"
                                        value={user.password}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("password")}
                                        className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border-2 ${errors.password && touched.password
                                            ? "border-red-500 focus:ring-red-400"
                                            : "border-theme-border focus:ring-emerald-400"
                                            } rounded-full focus:outline-none focus:ring-4 transition-all bg-theme-surface`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                        ) : (
                                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                        )}
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {user.password && (
                                    <div className="space-y-1">
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                                            <div
                                                className={`${passwordStrength.color} h-full rounded-full transition-all duration-300`}
                                                style={{ width: `${passwordStrength.strength}%` }}
                                            />
                                        </div>
                                        <p className={`text-xs sm:text-sm font-medium ${passwordStrength.color === 'bg-red-500' ? 'text-red-500' :
                                            passwordStrength.color === 'bg-yellow-500' ? 'text-yellow-600' :
                                                passwordStrength.color === 'bg-blue-500' ? 'text-blue-600' :
                                                    'text-green-600'
                                            }`}>
                                            Password strength: {passwordStrength.label}
                                        </p>
                                    </div>
                                )}

                                {errors.password && touched.password && (
                                    <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{errors.password}</span>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-1">
                                    <span>Confirm Password</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FcLock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Re-enter password"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (touched.confirmPassword) {
                                                setErrors({ ...errors, confirmPassword: "" });
                                            }
                                        }}
                                        onBlur={() => handleBlur("confirmPassword")}
                                        className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border-2 ${errors.confirmPassword && touched.confirmPassword
                                            ? "border-red-500 focus:ring-red-400"
                                            : confirmPassword && user.password === confirmPassword
                                                ? "border-green-500 focus:ring-green-400"
                                                : "border-theme-border focus:ring-emerald-400"
                                            } rounded-full focus:outline-none focus:ring-4 transition-all bg-theme-surface`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? (
                                            <FcPrivacy className="w-4 h-4 sm:w-5 sm:h-5" />
                                        ) : (
                                            <FcUnlock className="w-4 h-4 sm:w-5 sm:h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && touched.confirmPassword ? (
                                    <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                                        <FcCancel className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{errors.confirmPassword}</span>
                                    </div>
                                ) : confirmPassword && user.password === confirmPassword ? (
                                    <div className="flex items-center gap-1 text-green-600 text-xs sm:text-sm">
                                        <FcOk className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>Passwords match</span>
                                    </div>
                                ) : null}
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start space-x-2 sm:space-x-3 bg-gradient-to-r from-emerald-50 to-cyan-50 p-3 sm:p-4 rounded-full border border-emerald-100">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="mt-0.5 sm:mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                                />
                                <label htmlFor="terms" className="text-xs sm:text-sm text-gray-700 cursor-pointer">
                                    I agree to the{" "}
                                    <button type="button" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
                                        Terms & Conditions
                                    </button>{" "}
                                    and{" "}
                                    <button type="button" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
                                        Privacy Policy
                                    </button>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-emerald-600 via-cyan-600 to-teal-600 hover:from-emerald-700 hover:via-cyan-700 hover:to-teal-700 text-white py-3 sm:py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Creating Account...
                                        </span>
                                    ) : (
                                        "Create Account"
                                    )}
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-theme-border"></div>
                                </div>
                                <div className="relative flex justify-center text-xs sm:text-sm">
                                    <span className="px-3 sm:px-4 bg-theme-surface text-theme-text-secondary">Already have an account?</span>
                                </div>
                            </div>

                            {/* Login Link */}
                            <button
                                type="button"
                                onClick={openLogin}
                                className="w-full py-3 sm:py-3.5 border-2 border-emerald-200 text-emerald-600 rounded-lg sm:rounded-xl font-semibold hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
                            >
                                Sign In to Existing Account
                            </button>
                        </form>
                    )}

                    {/* Footer Trust Badge - Only show if not success message for spacing */}
                    {!showSuccessMessage && (
                        <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 bg-gradient-to-b from-white to-gray-50">
                            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-theme-text-secondary">
                                <div className="flex items-center space-x-1">
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                                    <span>Secure</span>
                                </div>
                                <span className="hidden sm:inline">•</span>
                                <div className="flex items-center space-x-1">
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                                    <span>Verified</span>
                                </div>
                                <span className="hidden sm:inline">•</span>
                                <div className="flex items-center space-x-1">
                                    <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500" />
                                    <span>Verified Profiles</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.4s ease-out;
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out forwards;
                }
                
                /* Custom scrollbar for form */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #10b981;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #059669;
                }
            `}</style>
        </div>
    );
}

export default Register;
