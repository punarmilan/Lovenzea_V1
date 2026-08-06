import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { HiHeart, HiStar, HiShieldCheck, HiSparkles, HiCash, HiBadgeCheck, HiLightningBolt, HiShieldExclamation, HiSearch, HiChat, HiPencilAlt, HiPhone, HiVideoCamera, HiChatAlt2 } from 'react-icons/hi'
import { FaMale, FaFemale, FaApple, FaGooglePlay } from 'react-icons/fa'
import Login from "../components/Login"
import Register from "../components/Register"

import ceremony10 from '../assets/image/marriage-ceremony10.jpg';
import sunnyFloral from '../assets/image/sunny-floral-path.png';
import couplesImg from '../assets/image/couples.jpg';
import ceremony2 from '../assets/image/marriage-ceremony2.jpg';
import exp3 from '../assets/image/experience-3.jpg';
import appScreen from '../assets/image/matrimony_dashboard.png';
import { HiX, HiArrowLeft } from "react-icons/hi"
import heroImg from '../assets/image/hero_bg.jpg'
import heroImg2 from '../assets/image/hero_bg2.png'
import heroImg3 from '../assets/image/hero_bg3.png'
import heroImg4 from '../assets/image/hero_bg_new.png'
import heroImg5 from '../assets/image/hero_bg5.png'
import projectLogo from '../assets/image/project_logo_transperent.png'
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const slideLeft = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const slideRight = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const imageReveal = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const rotateIn = {
    hidden: { opacity: 0, rotate: -5, scale: 0.9 },
    show: { opacity: 1, rotate: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

function Home() {
    const navigate = useNavigate()
    const { user, token } = useSelector(state => state.user)
    const isLoggedIn = !!token

    /* ---------------- MODAL STATES ---------------- */
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const [showMatchModal, setShowMatchModal] = useState(false)
    const [showGuestAlert, setShowGuestAlert] = useState(false)

    /* ---------------- HERO SLIDESHOW STATE ---------------- */
    const heroImages = [heroImg4, heroImg2, heroImg5, heroImg3];
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000); // Change image every 5 seconds
        return () => clearInterval(interval);
    }, [heroImages.length]);

    /* ---------------- SEARCH FORM STATE ---------------- */
    const [searchForm, setSearchForm] = useState({
        lookingFor: '',
        ageRange: '',
        religion: '',
        location: '',
    })

    /* ---------------- STEP CONTROL ---------------- */
    const [step, setStep] = useState(1)

    /* ---------------- ONBOARDING DATA (TEMP) ---------------- */
    const [formData, setFormData] = useState({
        profileFor: "Myself",
        gender: "Male",
        firstName: "",
        lastName: "",
        day: "",
        month: "",
        year: "",
        religion: "Hindu",
        community: "Hindi",
        country: "India",
    })

    /* ---------------- HANDLERS ---------------- */
    const handleChange = (e) => {
        const { name, value } = e.target

        // For names, only allow alphabets and spaces
        if ((name === "firstName" || name === "lastName") && value && !/^[a-zA-Z\s]*$/.test(value)) {
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSearchFormChange = (field, value) => {
        setSearchForm(prev => ({ ...prev, [field]: value }))
    }

    const handleSearchSubmit = () => {
        const hasSelection = Object.values(searchForm).some(v => v !== '')
        if (!isLoggedIn) {
            setShowGuestAlert(true)
            return
        }
        // If logged in, navigate to matches page with filters
        const params = new URLSearchParams()
        if (searchForm.lookingFor) params.set('gender', searchForm.lookingFor)
        if (searchForm.ageRange) params.set('age', searchForm.ageRange)
        if (searchForm.religion) params.set('religion', searchForm.religion)
        if (searchForm.location) params.set('location', searchForm.location)
        navigate(`/my-shadi/matches?${params.toString()}`)
    }

    const openMatchModal = () => {
        setShowLogin(false)
        setShowRegister(false)
        setStep(1)
        setShowMatchModal(true)
    }

    const closeMatchModal = () => {
        setShowMatchModal(false)
        setStep(1)
    }

    const nextStep = () => {
        if (step < 3) {
            setStep(step + 1)
        } else {
            // AFTER STEP 3 → OPEN REGISTER
            setShowMatchModal(false)
            setShowRegister(true)
        }
    }

    const prevStep = () => {
        if (step > 1) setStep(step - 1)
    }













    return (
        <div className="min-h-screen">


            {showLogin && (
                <Login
                    close={() => setShowLogin(false)}
                    openRegister={() => {
                        setShowLogin(false)
                        setShowRegister(true)
                    }}
                />
            )}

            {/* ================= REGISTER POPUP ================= */}
            {showRegister && (
                <Register
                    close={() => setShowRegister(false)}
                    openLogin={() => {
                        setShowRegister(false)
                        setShowLogin(true)
                    }}
                />
            )}

            {/* ================= GUEST ALERT MODAL ================= */}
            {showGuestAlert && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowGuestAlert(false)}>
                    <div
                        className="bg-theme-surface rounded-3xl shadow-2xl p-8 max-w-sm w-full relative overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Decorative top gradient */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d94f73] via-rose-400 to-orange-400 rounded-t-3xl"></div>

                        {/* Heart icon */}
                        <div className="flex justify-center mb-5">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#d94f73] to-orange-400 flex items-center justify-center shadow-lg shadow-rose-300">
                                <HiHeart className="w-10 h-10 text-white fill-current" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 text-center mb-2">
                            <span className="text-slate-900">Loven</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d94f73] to-rose-500">Zea</span> awaits you!
                        </h2>
                        <p className="text-slate-500 text-sm text-center mb-6 leading-relaxed">
                            Create a free account to search verified profiles and find your perfect life partner.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => { setShowGuestAlert(false); setShowRegister(true) }}
                                className="w-full py-3.5 bg-gradient-to-r from-[#d94f73] to-rose-500 text-white rounded-2xl font-bold text-base shadow-lg shadow-rose-200 hover:shadow-rose-300 hover:-translate-y-0.5 transition-all"
                            >
                                ❤️ Register Now — It's Free!
                            </button>
                            <button
                                onClick={() => { setShowGuestAlert(false); setShowLogin(true) }}
                                className="w-full py-3 border-2 border-rose-100 text-[#d94f73] rounded-2xl font-bold text-sm hover:bg-rose-50 transition-colors"
                            >
                                Already a member? Login
                            </button>
                            <button
                                onClick={() => setShowGuestAlert(false)}
                                className="w-full py-2.5 text-slate-400 rounded-xl font-medium text-sm hover:text-slate-600 transition-colors"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= MATCH STEPS POPUP ================= */}

            {/* ================= MATCH STEPS POPUP ================= */}
            {showMatchModal && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-theme-surface text-black w-full max-w-lg rounded-2xl p-6 relative">

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-4">
                            {step > 1 ? (
                                <button onClick={prevStep}>
                                    <HiArrowLeft className="w-6 h-6" />
                                </button>
                            ) : <div />}

                            <button onClick={closeMatchModal}>
                                <HiX className="w-6 h-6" />
                            </button>
                        </div>

                        {/* ---------- STEP 1 ---------- */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold">This Profile is for</h2>

                                <div className="grid grid-cols-2 gap-3">
                                    {["Myself", "My Son", "My Daughter", "My Brother", "My Sister", "My Friend", "My Relative"].map(item => (
                                        <button
                                            key={item}
                                            onClick={() => setFormData({ ...formData, profileFor: item })}
                                            className={`border rounded-full py-2 ${formData.profileFor === item
                                                ? "bg-cyan-500 text-white"
                                                : "border-gray-300"
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>

                                <h3 className="font-bold">Gender</h3>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setFormData({ ...formData, gender: "Male" })}
                                        className={`flex flex-1 items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${formData.gender === "Male"
                                            ? "border-emerald-500 bg-emerald-50 text-emerald-600 font-bold shadow-md"
                                            : "border-theme-border text-theme-text-secondary hover:border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <FaMale className="w-5 h-5" />
                                        Male
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, gender: "Female" })}
                                        className={`flex flex-1 items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${formData.gender === "Female"
                                            ? "border-pink-500 bg-pink-50 text-pink-600 font-bold shadow-md"
                                            : "border-theme-border text-theme-text-secondary hover:border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <FaFemale className="w-5 h-5" />
                                        Female
                                    </button>
                                </div>

                                <button
                                    onClick={nextStep}
                                    className="w-full bg-cyan-500 text-white py-3 rounded-full"
                                >
                                    Continue
                                </button>
                            </div>
                        )}

                        {/* ---------- STEP 2 ---------- */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold">Your Name</h2>

                                <input
                                    name="firstName"
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full border p-3 rounded"
                                />

                                <input
                                    name="lastName"
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full border p-3 rounded"
                                />

                                <h3 className="font-bold">Date of Birth</h3>
                                <div className="flex gap-2">
                                    <input
                                        name="day"
                                        placeholder="DD"
                                        value={formData.day}
                                        onChange={handleChange}
                                        className="border p-2 w-full text-center"
                                    />
                                    <input
                                        name="month"
                                        placeholder="MM"
                                        value={formData.month}
                                        onChange={handleChange}
                                        className="border p-2 w-full text-center"
                                    />
                                    <input
                                        name="year"
                                        placeholder="YYYY"
                                        value={formData.year}
                                        onChange={handleChange}
                                        className="border p-2 w-full text-center"
                                    />
                                </div>

                                <button
                                    onClick={nextStep}
                                    className="w-full bg-cyan-500 text-white py-3 rounded-full"
                                >
                                    Continue
                                </button>
                            </div>
                        )}

                        {/* ---------- STEP 3 ---------- */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold">Your Religion</h2>

                                <select
                                    name="religion"
                                    value={formData.religion}
                                    onChange={handleChange}
                                    className="w-full border p-3 rounded"
                                >
                                    <option>Hindu</option>
                                    <option>Muslim</option>
                                    <option>Christian</option>
                                </select>

                                <h3 className="font-bold">Community</h3>
                                <select
                                    name="community"
                                    value={formData.community}
                                    onChange={handleChange}
                                    className="w-full border p-3 rounded"
                                >
                                    <option>Hindi</option>
                                    <option>Marathi</option>
                                </select>

                                <h3 className="font-bold">Living in</h3>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full border p-3 rounded"
                                >
                                    <option>India</option>
                                    <option>USA</option>
                                </select>


                                <button
                                    onClick={nextStep}
                                    className="w-full bg-cyan-500 text-white py-3 rounded-full"
                                >
                                    Continue
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            )}
            {/* Premium Matrimonial Hero Section */}
            <section className="relative min-h-screen lg:h-screen w-full flex flex-col justify-between overflow-hidden">
                {/* Full-Screen Background Image Slideshow (No Blur) */}
                <div className="absolute inset-0 z-0 bg-slate-900">
                    <AnimatePresence>
                        {heroImages.map((imgSrc, index) => (
                            index === currentHeroIndex && (
                                <motion.img
                                    key={index}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    src={imgSrc}
                                    alt={`Hero Slide ${index + 1}`}
                                    className={`absolute inset-0 w-full h-full object-cover ${(index === 0 || index === 2) ? 'object-[75%_center]' : 'object-[35%_center]'} sm:object-center`}
                                />
                            )
                        ))}
                    </AnimatePresence>
                    {/* Subtle Gradient Overlay for Text Readability (left side only) */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent sm:w-2/3 lg:w-1/2"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent"></div>
                </div>

                {/* ── Navbar ── */}
                <header className="relative z-30 w-full max-w-[1600px] mx-auto px-6 sm:px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-0 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => navigate('/')}>
                        <img src={projectLogo} alt="LovenZea Logo" className="w-14 h-14 sm:w-16 sm:h-16 object-cover drop-shadow-xl hover:scale-105 transition-transform duration-300" />
                        <span className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-900 drop-shadow-sm flex items-center ml-[1px]">
                            Loven<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d94f73] to-rose-500">Zea</span>
                        </span>
                    </div>


                    {/* Right: Login/Register buttons */}
                    <div className="flex items-center gap-1.5 sm:gap-3">
                        {!isLoggedIn ? (
                            <>
                                <button
                                    onClick={() => setShowLogin(true)}
                                    className="px-3 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-800 hover:text-slate-900 bg-theme-surface/40 hover:bg-theme-surface/60 backdrop-blur-md rounded-full border border-white/50 shadow-sm transition-all"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => setShowRegister(true)}
                                    className="px-3 py-1.5 sm:px-6 sm:py-2.5 bg-gradient-to-r from-[#d94f73] to-rose-500 hover:opacity-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-[#d94f73]/20 hover:shadow-[#d94f73]/35 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Join Free
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/my-shadi"
                                className="px-6 py-2.5 bg-gradient-to-r from-[#d94f73] to-rose-500 hover:opacity-95 text-white text-sm font-bold rounded-xl shadow-lg shadow-[#d94f73]/20 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                My Profile
                            </Link>
                        )}
                    </div>
                </header>

                {/* ── Main Hero Content Area ── */}
                <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 sm:px-8 flex-1 flex items-center">
                    {/* Left Content Overlay */}
                    <div className="w-full max-w-2xl flex flex-col items-start text-left space-y-6 pt-10 pb-16">
                        {/* Trusted Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50/80 backdrop-blur-sm border border-rose-100/60 shadow-sm"
                        >
                            <HiStar className="text-[#d94f73] w-4 h-4 fill-[#d94f73]" />
                            <span className="text-[11px] font-black uppercase tracking-wider text-[#d94f73]">Trusted by Millions</span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black font-serif text-[#1e293b] leading-[1.05]"
                        >
                            Find your <br />
                            <span className="text-[#d94f73] font-serif italic pr-4 relative">
                                forever
                                <span className="text-[#d94f73] font-serif not-italic ml-2">♡</span>
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                            className="text-base sm:text-lg md:text-xl text-slate-700 max-w-lg font-medium leading-relaxed"
                        >
                            Discover meaningful connections and a world beyond matrimony.
                        </motion.p>

                        {/* CTA button */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 1.1 }}
                            className="pt-2"
                        >
                            <button
                                onClick={() => setShowRegister(true)}
                                className="px-10 py-4 bg-gradient-to-r from-[#d94f73] to-rose-500 text-white font-bold rounded-full shadow-[0_10px_35px_rgba(217,79,115,0.35)] hover:shadow-[0_15px_45px_rgba(217,79,115,0.5)] transition-all duration-300 hover:scale-105 transform flex items-center gap-2 group text-base tracking-wide"
                            >
                                Find Your Match
                                <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

      {/* 1. Match Search Section */}
      <section id="home" className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-amber-200/40 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              variants={slideLeft} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
              className="space-y-6"
            >
                <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 text-rose-600 font-semibold text-sm tracking-wider shadow-sm uppercase border border-rose-200">Quick Access</span>
                <h5 className="text-amber-600 font-bold tracking-widest uppercase text-sm">#1 Trusted Matrimony Platform</h5>
                <h1 className="text-5xl lg:text-6xl font-extrabold text-[#291907] leading-tight font-serif">
                    Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Right Match</span> here
                </h1>
                <p className="text-lg text-[#5c4a3d] leading-relaxed">
                    Discover genuine, verified Indian matrimonial profiles and start your
                    beautiful journey with confidence, trust and family values.
                </p>
                <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex flex-wrap gap-4 pt-4">
                    <motion.button variants={fadeUp} onClick={() => setShowRegister(true)} className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-bold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all hover:-translate-y-1">
                        Register for free
                    </motion.button>
                    <motion.div variants={fadeUp} className="flex items-center gap-3 text-sm font-semibold text-amber-700 bg-theme-surface/60 backdrop-blur-md px-4 py-2 rounded-full border border-white">
                        <HiShieldCheck className="w-5 h-5 text-amber-500" />
                        Verified Profiles
                    </motion.div>
                    <motion.div variants={fadeUp} className="flex items-center gap-3 text-sm font-semibold text-rose-700 bg-theme-surface/60 backdrop-blur-md px-4 py-2 rounded-full border border-white">
                        <HiHeart className="w-5 h-5 text-rose-500" />
                        Family Trusted
                    </motion.div>
                </motion.div>
            </motion.div>

            <motion.div 
              variants={slideRight} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-theme-surface/40 backdrop-blur-xl border border-white/40 shadow-xl shadow-rose-100/50 p-8 rounded-[32px] relative"
            >
                <h3 className="text-2xl font-bold text-[#291907] mb-6 font-serif border-b border-rose-200/50 pb-4">Find your perfect partner</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                    {/* I am looking for */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#5c4a3d]">I am looking for</label>
                        <select
                            value={searchForm.lookingFor}
                            onChange={e => handleSearchFormChange('lookingFor', e.target.value)}
                            className="w-full bg-theme-surface/70 backdrop-blur-md border border-white/60 rounded-xl px-4 py-3 text-[#291907] outline-none focus:ring-2 focus:ring-rose-400 transition-shadow cursor-pointer"
                        >
                            <option value="">Select I am looking for</option>
                            <option value="Bride">Bride</option>
                            <option value="Groom">Groom</option>
                        </select>
                    </div>

                    {/* Age */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#5c4a3d]">Age</label>
                        <select
                            value={searchForm.ageRange}
                            onChange={e => handleSearchFormChange('ageRange', e.target.value)}
                            className="w-full bg-theme-surface/70 backdrop-blur-md border border-white/60 rounded-xl px-4 py-3 text-[#291907] outline-none focus:ring-2 focus:ring-rose-400 transition-shadow cursor-pointer"
                        >
                            <option value="">Select Age</option>
                            <option value="18-22">18 – 22 years</option>
                            <option value="23-27">23 – 27 years</option>
                            <option value="28-32">28 – 32 years</option>
                            <option value="33-37">33 – 37 years</option>
                            <option value="38-42">38 – 42 years</option>
                            <option value="43+">43+ years</option>
                        </select>
                    </div>

                    {/* Religion */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#5c4a3d]">Religion</label>
                        <select
                            value={searchForm.religion}
                            onChange={e => handleSearchFormChange('religion', e.target.value)}
                            className="w-full bg-theme-surface/70 backdrop-blur-md border border-white/60 rounded-xl px-4 py-3 text-[#291907] outline-none focus:ring-2 focus:ring-rose-400 transition-shadow cursor-pointer"
                        >
                            <option value="">Select Religion</option>
                            <option value="Hindu">Hindu</option>
                            <option value="Muslim">Muslim</option>
                            <option value="Christian">Christian</option>
                            <option value="Sikh">Sikh</option>
                            <option value="Jain">Jain</option>
                            <option value="Buddhist">Buddhist</option>
                            <option value="Parsi">Parsi</option>
                            <option value="Jewish">Jewish</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#5c4a3d]">Location</label>
                        <select
                            value={searchForm.location}
                            onChange={e => handleSearchFormChange('location', e.target.value)}
                            className="w-full bg-theme-surface/70 backdrop-blur-md border border-white/60 rounded-xl px-4 py-3 text-[#291907] outline-none focus:ring-2 focus:ring-rose-400 transition-shadow cursor-pointer"
                        >
                            <option value="">Select Location</option>
                            <option value="Mumbai">Mumbai, Maharashtra</option>
                            <option value="Delhi">Delhi / NCR</option>
                            <option value="Bangalore">Bangalore, Karnataka</option>
                            <option value="Hyderabad">Hyderabad, Telangana</option>
                            <option value="Chennai">Chennai, Tamil Nadu</option>
                            <option value="Kolkata">Kolkata, West Bengal</option>
                            <option value="Pune">Pune, Maharashtra</option>
                            <option value="Ahmedabad">Ahmedabad, Gujarat</option>
                            <option value="Jaipur">Jaipur, Rajasthan</option>
                            <option value="Lucknow">Lucknow, Uttar Pradesh</option>
                        </select>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSearchSubmit}
                    className="w-full py-4 bg-gradient-to-r from-[#d94f73] to-rose-500 text-white rounded-xl font-bold shadow-xl shadow-rose-200 hover:shadow-rose-300 transition-all flex items-center justify-center gap-2 mb-6"
                >
                    <HiSearch className="w-5 h-5" />
                    Search Profiles
                </motion.button>

                <div className="grid grid-cols-2 gap-4">
                    <motion.img whileHover={{ scale: 1.05 }} src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=80" className="w-full h-32 object-cover rounded-2xl shadow-sm border border-white/40" />
                    <motion.img whileHover={{ scale: 1.05 }} src="https://images.unsplash.com/photo-1625038032515-308ab14d10b9?auto=format&fit=crop&w=700&q=80" className="w-full h-32 object-cover rounded-2xl shadow-sm border border-white/40" />
                </div>
            </motion.div>
        </div>
      </section>

      {/* ── Bottom Glass Feature Bar (Moved here to overlap between 2nd and 3rd sections) ── */}
      <div className="relative z-30 w-full max-w-[1600px] mx-auto px-6 sm:px-8 -mt-12 sm:-mt-16 -mb-12 sm:-mb-16">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full bg-theme-surface/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 md:p-6 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200/50"
          >
              {/* Feature 1 */}
              <div className="flex items-center gap-3.5 pl-0 md:pl-2 pt-0">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-50 to-pink-100/60 flex items-center justify-center text-[#d94f73] border border-rose-200/40 shrink-0">
                      <HiShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                      <h4 className="text-xs font-bold text-slate-800 leading-tight">100% Verified</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Authentic Profiles</p>
                  </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3.5 pl-0 md:pl-6 pt-4 md:pt-0">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-50 to-indigo-100/60 flex items-center justify-center text-indigo-500 border border-indigo-200/40 shrink-0">
                      <HiShieldExclamation className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                      <h4 className="text-xs font-bold text-slate-800 leading-tight">Privacy First</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Your safety is our priority</p>
                  </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3.5 pl-0 md:pl-6 pt-4 md:pt-0">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-50 to-orange-100/60 flex items-center justify-center text-amber-500 border border-amber-200/40 shrink-0">
                      <HiLightningBolt className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                      <h4 className="text-xs font-bold text-slate-800 leading-tight">Smart Matches</h4>
                      <p className="text-[10px] text-slate-500 font-medium">AI-powered compatibility</p>
                  </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-3.5 pl-0 md:pl-6 pt-4 md:pt-0">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-green-50 to-emerald-100/60 flex items-center justify-center text-emerald-500 border border-emerald-200/40 shrink-0">
                      <HiChat className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                      <h4 className="text-xs font-bold text-slate-800 leading-tight">24/7 Support</h4>
                      <p className="text-[10px] text-slate-500 font-medium">We're here for you</p>
                  </div>
              </div>
          </motion.div>
      </div>

      {/* 2. Premium Services */}
      <section id="services" className="relative py-28 px-4 bg-[#050816] overflow-hidden border-t border-white/5">
        
        {/* Photographic Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1920&q=80" alt="Premium Services Background" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-[#050816]/70"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-[#050816]"></div>
        </div>

        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] rounded-full bg-purple-900/15 blur-[140px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] rounded-full bg-pink-900/15 blur-[140px] pointer-events-none z-0"></div>
        
        {/* Subtle Dots Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,45,117,0.02)_1px,transparent_1px),radial-gradient(circle_at_70%_60%,rgba(79,140,255,0.02)_1px,transparent_1px)] bg-[length:32px_32px] pointer-events-none z-0"></div>

        <div className="max-w-[1400px] mx-auto relative z-10 text-center flex flex-col items-center">
          {/* Badge */}
          <motion.div 
            variants={fadeUp} 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-theme-surface/[0.03] backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(255,45,117,0.15)] mb-6 hover:border-pink-500/30 transition-all cursor-default"
          >
            <span className="text-[#ff2d75] font-black text-xs tracking-widest uppercase">✨ OUR FEATURES</span>
          </motion.div>

          {/* Heading */}
          <motion.h2 
            variants={fadeUp} 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold font-serif mb-6 tracking-wide"
            style={{ fontSize: '64px' }}
          >
            <span className="text-white">Premium </span>
            <span className="bg-gradient-to-r from-[#ff2d75] to-rose-400 bg-clip-text text-transparent">Services</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p 
            variants={fadeUp} 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-[700px] leading-relaxed mb-16 font-sans"
          >
            Everything you need to search, connect and begin your marriage journey in style.
          </motion.p>

          {/* Cards Grid */}
          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full"
          >
            {/* Card 1 */}
            <motion.div 
              variants={fadeUp}
              whileHover={{ y: -12, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="group relative flex flex-col justify-between items-start text-left p-8 h-[370px] rounded-[28px] border border-white/20 hover:border-[#ff2d75]/50 hover:shadow-[0_20px_50px_rgba(255,45,117,0.25)] transition-all duration-300 overflow-hidden"
            >
              {/* Glassmorphic Background Image */}
              <div className="absolute inset-0 z-0">
                  <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80" alt="Verified Matches" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-[#050816]/70 backdrop-blur-md group-hover:bg-[#050816]/50 transition-colors duration-500"></div>
              </div>

              {/* Radial card glow */}
              <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-[#ff2d75]/10 blur-3xl pointer-events-none group-hover:bg-[#ff2d75]/20 transition-colors z-0"></div>
              
              <div className="w-full relative z-10">
                {/* 3D Gradient Icon */}
                <div className="w-[72px] h-[72px] rounded-xl bg-theme-surface/[0.03] border border-white/10 flex items-center justify-center mb-5 shadow-inner relative group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#ff2d75]/20 to-rose-500/20 blur-md group-hover:opacity-100 transition-opacity"></div>
                  <svg className="w-9 h-9 text-[#ff2d75] drop-shadow-[0_0_8px_rgba(255,45,117,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="14" r="7" strokeWidth="2"/>
                    <path d="M12 2l3 5H9l3-5z" strokeWidth="2" strokeLinejoin="round" fill="currentColor"/>
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2 font-serif">Verified Matches</h3>
                
                {/* Small glowing line */}
                <div className="w-12 h-[2px] bg-gradient-to-r from-[#ff2d75] to-transparent shadow-[0_0_8px_rgba(255,45,117,0.8)] mb-3.5"></div>
                
                <p className="text-gray-400 text-sm leading-relaxed max-w-[280px] font-sans">
                  <span className="text-[#ff2d75] font-semibold">100%</span> verified profiles for a secure and genuine matchmaking experience.
                </p>
              </div>

              {/* Decorative elements bottom left */}
              <div className="flex gap-1.5 mt-auto relative z-10">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff2d75]/50 shadow-[0_0_8px_#ff2d75]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff2d75]/30"></span>
                <span className="w-1 h-1 rounded-full bg-[#ff2d75]/20"></span>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              variants={fadeUp}
              whileHover={{ y: -12, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="group relative flex flex-col justify-between items-start text-left p-8 h-[370px] rounded-[28px] border border-white/20 hover:border-[#8b5cf6]/50 hover:shadow-[0_20px_50px_rgba(139,92,246,0.25)] transition-all duration-300 overflow-hidden"
            >
              {/* Glassmorphic Background Image */}
              <div className="absolute inset-0 z-0">
                  <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" alt="Premium Support" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-[#050816]/70 backdrop-blur-md group-hover:bg-[#050816]/50 transition-colors duration-500"></div>
              </div>

              {/* Radial card glow */}
              <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-[#8b5cf6]/10 blur-3xl pointer-events-none group-hover:bg-[#8b5cf6]/20 transition-colors z-0"></div>

              <div className="w-full relative z-10">
                {/* 3D Gradient Icon */}
                <div className="w-[72px] h-[72px] rounded-xl bg-theme-surface/[0.03] border border-white/10 flex items-center justify-center mb-5 shadow-inner relative group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#8b5cf6]/20 to-purple-500/20 blur-md group-hover:opacity-100 transition-opacity"></div>
                  <svg className="w-9 h-9 text-[#8b5cf6] drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 font-serif">Premium Support</h3>
                
                {/* Small glowing line */}
                <div className="w-12 h-[2px] bg-gradient-to-r from-[#8b5cf6] to-transparent shadow-[0_0_8px_rgba(139,92,246,0.8)] mb-3.5"></div>

                <p className="text-gray-400 text-sm leading-relaxed max-w-[280px] font-sans">
                  Dedicated relationship managers to help you find the perfect match.
                </p>
              </div>

              {/* Decorative abstract curved lines */}
              <div className="absolute bottom-4 right-4 w-16 h-16 opacity-30 pointer-events-none group-hover:opacity-60 transition-opacity z-10">
                <svg viewBox="0 0 100 100" fill="none" stroke="#8b5cf6" strokeWidth="2">
                  <path d="M10 90 Q 50 50 90 90" />
                  <path d="M20 90 Q 50 60 80 90" />
                </svg>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              variants={fadeUp}
              whileHover={{ y: -12, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="group relative flex flex-col justify-between items-start text-left p-8 h-[370px] rounded-[28px] border border-white/20 hover:border-[#4f8cff]/50 hover:shadow-[0_20px_50px_rgba(79,140,255,0.25)] transition-all duration-300 overflow-hidden"
            >
              {/* Glassmorphic Background Image */}
              <div className="absolute inset-0 z-0">
                  <img src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=600&q=80" alt="Privacy Control" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-[#050816]/70 backdrop-blur-md group-hover:bg-[#050816]/50 transition-colors duration-500"></div>
              </div>

              {/* Radial card glow */}
              <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-[#4f8cff]/10 blur-3xl pointer-events-none group-hover:bg-[#4f8cff]/20 transition-colors z-0"></div>

              <div className="w-full relative z-10">
                {/* 3D Gradient Icon */}
                <div className="w-[72px] h-[72px] rounded-xl bg-theme-surface/[0.03] border border-white/10 flex items-center justify-center mb-5 shadow-inner relative group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#4f8cff]/20 to-blue-500/20 blur-md group-hover:opacity-100 transition-opacity"></div>
                  <svg className="w-9 h-9 text-[#4f8cff] drop-shadow-[0_0_8px_rgba(79,140,255,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 font-serif">Privacy Control</h3>
                
                {/* Small glowing line */}
                <div className="w-12 h-[2px] bg-gradient-to-r from-[#4f8cff] to-transparent shadow-[0_0_8px_rgba(79,140,255,0.8)] mb-3.5"></div>

                <p className="text-gray-400 text-sm leading-relaxed max-w-[280px] font-sans">
                  Complete control over your photos, contact details, and visibility.
                </p>
              </div>

              {/* Decorative elements bottom left */}
              <div className="flex gap-1.5 mt-auto relative z-10">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4f8cff]/50 shadow-[0_0_8px_#4f8cff]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4f8cff]/30"></span>
                <span className="w-1 h-1 rounded-full bg-[#4f8cff]/20"></span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* 3. Trusted by 1500+ Couples */}
      <section className="relative py-28 px-4 bg-gradient-to-br from-rose-50 via-white to-amber-50 overflow-hidden">

        {/* Ambient glows */}
        <div className="absolute top-[-10%] left-[-5%] w-[] h-[500px] rounded-full bg-rose-200/30 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[] h-[400px] rounded-full bg-amber-200/30 blur-[120px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,79,115,0.03)_1px,transparent_1px)] bg-[length:28px_28px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">

          {/* ---- LEFT: Image with floating decorations ---- */}
          <motion.div
            variants={imageReveal} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="relative group"
          >
            {/* Rotating ring glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#d94f73]/40 to-amber-400/30 rounded-[40px] transform rotate-3 scale-105 opacity-60 blur-2xl transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110"></div>

            {/* Image frame */}
            <div className="relative bg-theme-surface/60 backdrop-blur-xl p-3 rounded-[40px] border border-white/80 shadow-2xl shadow-rose-100/50 overflow-hidden">
              <img
                src={ceremony10}
                alt="Happy Couple"
                className="w-full h-[520px] rounded-[32px] object-cover object-top group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              {/* Sheen overlay */}
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-tl from-transparent via-white/5 to-transparent pointer-events-none"></div>
            </div>

            {/* Floating badge — top left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
              className="absolute -left-6 top-10 bg-theme-surface/80 backdrop-blur-xl border border-white/90 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#d94f73] to-orange-400 flex items-center justify-center text-white shadow-md">
                <HiHeart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-slate-900 font-black text-lg leading-none">1500+</p>
                <p className="text-slate-500 text-xs font-medium">Happy Couples</p>
              </div>
            </motion.div>

            {/* Floating badge — bottom right */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              viewport={{ once: true }}
              className="absolute -right-6 bottom-12 bg-theme-surface/80 backdrop-blur-xl border border-white/90 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-white shadow-md text-xl">
                ⭐
              </div>
              <div>
                <p className="text-slate-900 font-black text-lg leading-none">4.9/5</p>
                <p className="text-slate-500 text-xs font-medium">Platform Rating</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ---- RIGHT: Text + Testimonial Cards ---- */}
          <div className="space-y-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 border border-rose-200 text-rose-600 font-bold text-xs tracking-widest uppercase mb-4">
                <HiShieldCheck className="w-3.5 h-3.5" /> Trusted Brand
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#291907] font-serif mb-4 leading-tight">
                Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d94f73] to-rose-400">1500+</span> Couples
              </h2>
              <p className="text-lg text-[#5c4a3d] leading-relaxed">Our platform helps families and individuals find meaningful matches with transparency and care.</p>
            </motion.div>

            <motion.div
              variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {[
                { txt: "Amazing experience and genuine profiles.", name: "Riya & Arjun", city: "Mumbai" },
                { txt: "Easy to use and very helpful support.", name: "Priya & Rahul", city: "Delhi" },
                { txt: "Found the right match for our family.", name: "Sneha & Vikram", city: "Pune" },
                { txt: "Best platform for serious marriage search.", name: "Anjali & Rohan", city: "Bangalore" }
              ].map((review, i) => (
                <motion.div
                  variants={fadeUp}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="relative p-5 bg-theme-surface/70 backdrop-blur-xl border border-rose-100 rounded-2xl shadow-lg hover:border-rose-300 hover:shadow-[0_8px_30px_rgba(217,79,115,0.12)] transition-all duration-300 group overflow-hidden"
                  key={i}
                >
                  {/* Subtle top glow on hover */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Stars */}
                  <div className="flex gap-0.5 text-amber-400 mb-3">
                    {[...Array(5)].map((_, s) => <HiStar key={s} className="w-4 h-4" />)}
                  </div>

                  <p className="text-[#5c4a3d] font-medium italic mb-4 text-sm leading-relaxed">"{review.txt}"</p>

                  <div className="flex items-center gap-2.5 mt-auto">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#d94f73] to-orange-400 flex items-center justify-center text-white text-xs font-bold shadow">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[#291907] font-bold text-xs">{review.name}</p>
                      <p className="text-[#5c4a3d]/60 text-[10px]">{review.city}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>


      {/* 4. Why Choose Us */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-[#1a0f07] to-[#0a0502] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(196,140,70,0.15)_0%,transparent_70%)] rounded-full z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center mb-16">
          <motion.span variants={fadeUp} initial="hidden" whileInView="show" className="inline-block px-4 py-1.5 rounded-full bg-amber-900/50 text-amber-400 font-bold text-sm tracking-widest border border-amber-700/50 uppercase mb-4 shadow-[0_0_15px_rgba(196,140,70,0.3)]">#1 Wedding Website</motion.span>
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" className="text-4xl md:text-5xl font-extrabold text-white font-serif mb-4">Why choose us</motion.h2>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            ["🏅", "Genuine Profiles", "Connect with verified members and serious families."],
            ["🤝", "Most Trusted", "A reliable platform for meaningful matrimonial search."],
            ["💍", "2000+ Weddings", "Thousands of successful matches and happy couples."],
          ].map((item, i) => (
            <motion.div variants={fadeUp} whileHover={{ y: -8 }} className="relative p-8 bg-theme-surface/10 backdrop-blur-xl border border-white/10 rounded-[32px] text-center hover:shadow-[0_0_30px_rgba(196,140,70,0.2)] transition-all duration-500 group" key={i}>
              <motion.div variants={scaleIn} className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-200 to-amber-500 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-[0_10px_20px_rgba(196,140,70,0.4)] border border-amber-100 group-hover:rotate-6 transition-transform">
                {item[0]}
              </motion.div>
              <h3 className="text-2xl font-bold text-white font-serif mb-3">{item[1]}</h3>
              <p className="text-amber-100/70 font-medium leading-relaxed">{item[2]}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5. Welcome to Wedding Matrimony */}
      <section className="relative pt-28 pb-48 px-4 bg-gradient-to-br from-[#fff8f2] via-white to-rose-50 overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute top-[10%] left-[5%] w-[] h-[500px] bg-rose-200/25 rounded-full blur-[100px] z-0 pointer-events-none"></div>
        <div className="absolute bottom-[5%] right-[5%] w-[] h-[400px] bg-amber-200/25 rounded-full blur-[80px] z-0 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">

          {/* ---- LEFT: 3-photo modern collage ---- */}
          <motion.div
            variants={imageReveal} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="relative h-[580px]"
          >
            {/* Main large photo — bottom foreground */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 w-[68%] z-20"
            >
              <div className="bg-theme-surface p-2.5 rounded-[28px] shadow-2xl shadow-rose-200/60 border border-rose-100/60 rotate-[-3deg] hover:rotate-0 transition-transform duration-700 group">
                <img
                  src={sunnyFloral}
                  alt="Wedding Ceremony"
                  className="w-full h-[320px] object-cover object-top rounded-[20px] group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>

            {/* Secondary photo — top right */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-[60%] z-10"
            >
              <div className="bg-theme-surface p-2.5 rounded-[28px] shadow-xl shadow-amber-200/50 border border-amber-100/60 rotate-[3deg] hover:rotate-0 transition-transform duration-700 group">
                <img
                  src={couplesImg}
                  alt="Happy Couple"
                  className="w-full h-[280px] object-cover object-top rounded-[20px] group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>

            {/* Small accent photo — middle overlap */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-[36%] left-[30%] w-[42%] z-30"
            >
              <div className="bg-theme-surface p-2 rounded-[20px] shadow-2xl shadow-rose-300/40 border border-white rotate-[1deg] hover:rotate-0 transition-transform duration-700 group">
                <img
                  src={ceremony2}
                  alt="Marriage"
                  className="w-full h-[180px] object-cover object-center rounded-[14px] group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>

            {/* 4th accent photo — top left, behind badge */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-0 left-0 w-[48%] z-[5]"
            >
              <div className="bg-theme-surface p-2 rounded-[22px] shadow-xl shadow-rose-200/40 border border-rose-100/50 rotate-[-5deg] hover:rotate-0 transition-transform duration-700 group">
                <img
                  src={exp3}
                  alt="Wedding Experience"
                  className="w-full h-[200px] object-cover object-top rounded-[16px] group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>

            {/* Floating stat pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
              viewport={{ once: true }}
              className="absolute top-6 left-2 z-40 bg-theme-surface/90 backdrop-blur-xl border border-rose-100 rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#d94f73] to-orange-400 flex items-center justify-center shadow-md">
                <HiHeart className="w-5 h-5 text-white fill-current" />
              </div>
              <div>
                <p className="text-[#291907] font-black text-base leading-none">2000+</p>
                <p className="text-[#5c4a3d]/60 text-[11px] font-medium">Weddings</p>
              </div>
            </motion.div>

            {/* Floating verified pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5, type: "spring" }}
              viewport={{ once: true }}
              className="absolute bottom-6 right-2 z-40 bg-theme-surface/90 backdrop-blur-xl border border-amber-100 rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-md text-lg">
                ⭐
              </div>
              <div>
                <p className="text-[#291907] font-black text-base leading-none">4.9 / 5</p>
                <p className="text-[#5c4a3d]/60 text-[11px] font-medium">Member Rating</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ---- RIGHT: Content ---- */}
          <div className="space-y-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 border border-rose-200 text-rose-600 font-bold text-xs tracking-widest uppercase mb-5 shadow-sm">
                <HiSparkles className="w-3.5 h-3.5" /> Welcome
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#291907] font-serif mb-5 leading-tight">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d94f73] to-rose-400">Wedding</span> Matrimony
              </h2>
              <p className="text-lg text-[#5c4a3d] leading-relaxed">
                Start your matrimony journey with a modern, safe and user-friendly platform designed for Indian families and serious marriage seekers.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 15px 35px rgba(217,79,115,0.4)" }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowRegister(true)}
                className="px-8 py-4 bg-gradient-to-r from-[#d94f73] to-rose-500 text-white rounded-full font-bold shadow-lg shadow-rose-300/40 transition-all"
              >
                Start your profile now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowLogin(true)}
                className="px-8 py-4 bg-theme-surface border-2 border-rose-200 text-[#d94f73] rounded-full font-bold hover:bg-rose-50 transition-all"
              >
                Sign In
              </motion.button>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { num: "2K", label: "Couples", icon: "💑" },
                { num: "4K+", label: "Members", icon: "👥" },
                { num: "1600+", label: "Mens", icon: "👨" },
                { num: "2000+", label: "Womens", icon: "👩" }
              ].map((stat, i) => (
                <motion.div
                  variants={scaleIn}
                  key={i}
                  whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(217,79,115,0.12)" }}
                  className="bg-theme-surface border border-rose-100/80 shadow-md p-5 rounded-3xl text-center group transition-all duration-300 cursor-default"
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <h3 className="text-3xl font-black text-[#d94f73] font-serif mb-1 group-hover:scale-110 transition-transform duration-300">{stat.num}</h3>
                  <p className="text-[#5c4a3d] font-semibold text-xs uppercase tracking-widest">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* App Download Promo Section (Floating Banner) */}
      <div className="relative z-30 max-w-[1200px] mx-auto px-4 lg:px-8 -mt-36 -mb-36 pointer-events-none">
        <section className="relative bg-[#ffe8e6] rounded-[40px] shadow-2xl p-10 md:p-14 overflow-visible pointer-events-auto flex flex-col lg:flex-row items-center gap-12 border border-white">
            
            {/* Left Content */}
            <div className="text-gray-900 space-y-4 flex-1 text-center lg:text-left z-20">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight text-[#1a2b4c]">
                Download the LovenZea app
              </h2>
              <p className="text-[#3b4c6d] text-lg font-medium">Connect with your matches anytime, anywhere</p>

              <div className="bg-theme-surface rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 max-w-lg mx-auto lg:mx-0 mt-10">
                 <div className="text-center sm:text-left flex-1">
                     <p className="text-[#1a2b4c] text-sm font-medium mb-4 text-center">Point your phone camera at the QR code or use one of the download links below</p>
                     <div className="flex items-center justify-center gap-4">
                         <div className="w-24 h-24 bg-theme-surface p-1 rounded-xl shadow-sm border border-theme-border shrink-0">
                            {/* Dummy QR Code */}
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://lovenzea.com" alt="QR Code" className="w-full h-full object-contain" />
                         </div>
                         <div className="flex flex-col gap-3">
                             <a href="#" className="flex items-center gap-2 bg-black hover:bg-gray-800 transition-colors px-4 py-2 rounded-xl text-white">
                               <FaGooglePlay className="text-2xl text-emerald-400" />
                               <div className="text-left">
                                 <div className="text-[8px] uppercase tracking-wider text-gray-300 leading-none">GET IT ON</div>
                                 <div className="text-sm font-bold leading-tight">Google Play</div>
                               </div>
                             </a>
                             <a href="#" className="flex items-center gap-2 bg-black hover:bg-gray-800 transition-colors px-4 py-2 rounded-xl text-white">
                               <FaApple className="text-2xl" />
                               <div className="text-left">
                                 <div className="text-[8px] uppercase tracking-wider text-gray-300 leading-none">Download on the</div>
                                 <div className="text-sm font-bold leading-tight">App Store</div>
                               </div>
                             </a>
                         </div>
                     </div>
                 </div>
              </div>
            </div>

            {/* Right Content - Mobile UIs */}
            <div className="relative h-[450px] w-full max-w-[450px] block md:block z-10 shrink-0 mt-12 lg:mt-0 mx-auto transform scale-75 sm:scale-100 origin-top">
               
               {/* Phone 1 (Back - Matches List) */}
               <motion.div 
                 initial={{ opacity: 0, x: 20, y: -20, rotate: 0 }}
                 whileInView={{ opacity: 1, x: 80, y: 0, rotate: 6 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8 }}
                 className="absolute right-10 top-0 w-[230px] h-[460px] bg-theme-surface rounded-[40px] border-[8px] border-theme-border shadow-xl overflow-hidden z-10"
               >
                 {/* Dummy Background for Phone 1 */}
                 <div className="w-full h-12 bg-gray-50 flex items-center justify-between px-4 border-b border-theme-border">
                    <div className="w-20 h-3 bg-gray-200 rounded-full"></div>
                    <div className="flex gap-2">
                       <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                       <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                    </div>
                 </div>
                 <img src={appScreen} alt="App Screen" className="w-full h-full object-cover rounded-b-[32px]" />
               </motion.div>

               {/* Phone 2 (Front - Profile Detail) */}
               <motion.div 
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 20 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="absolute left-10 top-5 w-[240px] h-[480px] bg-[#1a1a1a] rounded-[45px] border-[10px] border-[#111] shadow-[0_20px_40px_rgba(0,0,0,0.3)] overflow-hidden z-20"
               >
                  <div className="relative w-full h-[100%]">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80" alt="Profile" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    
                    <div className="absolute bottom-6 left-4 right-4 text-white">
                       <h3 className="text-xl font-bold font-serif">Ayushi Gupta, 27 <HiBadgeCheck className="inline text-blue-400 w-5 h-5"/></h3>
                       <p className="text-[10px] text-gray-300 mt-1">5'4" • New Delhi • Bania-Khandelwal</p>
                       <p className="text-[10px] text-gray-300 mt-0.5">Software Professional • Earns 20-25 Lacs p.a.</p>
                       <div className="flex gap-2 mt-4">
                          <button onClick={() => setShowRegister(true)} className="flex-1 py-2 rounded-full bg-rose-500 text-white text-[10px] font-bold">Send Interest</button>
                          <button onClick={() => setShowRegister(true)} className="flex-1 py-2 rounded-full border border-gray-400 text-white text-[10px] font-bold">Chat</button>
                       </div>
                    </div>
                  </div>
               </motion.div>

               {/* Floating Bubbles */}
               <motion.div
                 initial={{ opacity: 0, scale: 0.8 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.6, duration: 0.5 }}
                 className="absolute left-[-10px] top-[150px] bg-theme-surface rounded-full px-4 py-2 shadow-lg z-30 font-semibold text-xs text-gray-800 border border-gray-100"
               >
                  Easy Verification
               </motion.div>
               
               <motion.div
                 initial={{ opacity: 0, scale: 0.8 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.8, duration: 0.5 }}
                 className="absolute right-[-10px] top-[240px] bg-theme-surface rounded-full px-4 py-2 shadow-lg z-30 font-semibold text-xs text-gray-800 border border-gray-100"
               >
                  Voice & Video Calls
               </motion.div>

               <motion.div
                 initial={{ opacity: 0, scale: 0.8 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 1.0, duration: 0.5 }}
                 className="absolute left-[30px] bottom-[20px] bg-theme-surface rounded-full px-4 py-2 shadow-lg z-30 font-semibold text-xs text-gray-800 border border-gray-100"
               >
                  10M+ downloads
               </motion.div>
            </div>
        </section>
      </div>

      {/* 6. How It Works - Timeline Layout */}
      <section id="how" className="relative py-28 px-4 bg-[#050816] overflow-hidden border-t border-white/5">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] rounded-full bg-purple-900/10 blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] rounded-full bg-pink-900/10 blur-[140px] pointer-events-none"></div>
        
        {/* Subtle Dots Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,45,117,0.02)_1px,transparent_1px),radial-gradient(circle_at_85%_60%,rgba(79,140,255,0.02)_1px,transparent_1px)] bg-[length:32px_32px] pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto relative z-10 text-center flex flex-col items-center">
          {/* Badge */}
          <motion.div 
            variants={fadeUp} 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-theme-surface/[0.03] backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(255,45,117,0.15)] mb-6 hover:border-pink-500/30 transition-all cursor-default"
          >
            <span className="text-[#ff2d75] font-black text-xs tracking-widest uppercase">✦ TIMELINE ✦</span>
          </motion.div>

          {/* Heading */}
          <motion.h2 
            variants={fadeUp} 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold font-serif mb-6 tracking-wide"
            style={{ fontSize: '64px' }}
          >
            <span className="text-white">How it </span>
            <span className="bg-gradient-to-r from-[#ff2d75] to-rose-400 bg-clip-text text-transparent">works</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p 
            variants={fadeUp} 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-[700px] leading-relaxed mb-20 font-sans"
          >
            Create your profile, find matches and connect with families in simple steps.
          </motion.p>

          {/* Cards Grid */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="relative w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-6"
          >
            {/* Card 1 */}
            <motion.div 
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.4 }}
              className="group relative flex flex-col items-center text-center p-8 h-[380px] w-full lg:w-[30%] rounded-[28px] bg-theme-surface/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#ff2d75]/40 hover:bg-theme-surface/[0.04] hover:shadow-[0_20px_50px_rgba(255,45,117,0.12)] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-[#ff2d75]/5 blur-3xl pointer-events-none group-hover:bg-[#ff2d75]/10 transition-colors"></div>

              {/* 3D Circular Gradient Icon */}
              <div className="w-[100px] h-[100px] rounded-full bg-theme-surface/[0.03] border border-white/10 flex items-center justify-center mb-6 shadow-inner relative group-hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ff2d75]/20 to-rose-500/20 blur-md group-hover:opacity-100 transition-opacity"></div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#ff2d75]/15 to-transparent flex items-center justify-center">
                  <svg className="w-9 h-9 text-[#ff2d75] drop-shadow-[0_0_8px_rgba(255,45,117,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
              </div>

              {/* Badge Step */}
              <div className="px-4 py-1 rounded-full bg-theme-surface/[0.03] border border-white/10 text-xs font-bold text-gray-300 mb-4 tracking-wider">
                01
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 font-serif">Create Profile</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[280px] font-sans">
                Register for free and create your detailed matrimony profile with photos.
              </p>

              {/* Dot Indicators */}
              <div className="absolute bottom-6 left-6 flex gap-1.5 opacity-40">
                <span className="w-2 h-2 rounded-full bg-[#ff2d75]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff2d75]"></span>
              </div>
            </motion.div>

            {/* Connecting Arrow 1 */}
            <motion.div 
              variants={fadeUp}
              className="hidden lg:flex items-center justify-center w-12 h-12 rounded-full border border-pink-500/20 bg-theme-surface/[0.01] backdrop-blur-md text-pink-400 relative z-20 hover:border-pink-500/40 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.4 }}
              className="group relative flex flex-col items-center text-center p-8 h-[380px] w-full lg:w-[30%] rounded-[28px] bg-theme-surface/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#8b5cf6]/40 hover:bg-theme-surface/[0.04] hover:shadow-[0_20px_50px_rgba(139,92,246,0.12)] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-[#8b5cf6]/5 blur-3xl pointer-events-none group-hover:bg-[#8b5cf6]/10 transition-colors"></div>

              {/* 3D Circular Gradient Icon */}
              <div className="w-[100px] h-[100px] rounded-full bg-theme-surface/[0.03] border border-white/10 flex items-center justify-center mb-6 shadow-inner relative group-hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#8b5cf6]/20 to-purple-500/20 blur-md group-hover:opacity-100 transition-opacity"></div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#8b5cf6]/15 to-transparent flex items-center justify-center">
                  <svg className="w-9 h-9 text-[#8b5cf6] drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Badge Step */}
              <div className="px-4 py-1 rounded-full bg-theme-surface/[0.03] border border-white/10 text-xs font-bold text-gray-300 mb-4 tracking-wider">
                02
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 font-serif">Search Matches</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[280px] font-sans">
                Browse thousands of verified profiles matching your preferences.
              </p>

              {/* Curved lines style accent inside Card 2 */}
              <div className="absolute bottom-4 right-4 w-12 h-12 opacity-10 pointer-events-none group-hover:opacity-30 transition-opacity">
                <svg viewBox="0 0 100 100" fill="none" stroke="#8b5cf6" strokeWidth="2">
                  <path d="M10 90 Q 50 50 90 90" />
                  <path d="M20 90 Q 50 60 80 90" />
                </svg>
              </div>
            </motion.div>

            {/* Connecting Arrow 2 */}
            <motion.div 
              variants={fadeUp}
              className="hidden lg:flex items-center justify-center w-12 h-12 rounded-full border border-blue-500/20 bg-theme-surface/[0.01] backdrop-blur-md text-blue-400 relative z-20 hover:border-blue-500/40 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.4 }}
              className="group relative flex flex-col items-center text-center p-8 h-[380px] w-full lg:w-[30%] rounded-[28px] bg-theme-surface/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#4f8cff]/40 hover:bg-theme-surface/[0.04] hover:shadow-[0_20px_50px_rgba(79,140,255,0.12)] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-[#4f8cff]/5 blur-3xl pointer-events-none group-hover:bg-[#4f8cff]/10 transition-colors"></div>

              {/* 3D Circular Gradient Icon */}
              <div className="w-[100px] h-[100px] rounded-full bg-theme-surface/[0.03] border border-white/10 flex items-center justify-center mb-6 shadow-inner relative group-hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#4f8cff]/20 to-blue-500/20 blur-md group-hover:opacity-100 transition-opacity"></div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#4f8cff]/15 to-transparent flex items-center justify-center">
                  <svg className="w-9 h-9 text-[#4f8cff] drop-shadow-[0_0_8px_rgba(79,140,255,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>

              {/* Badge Step */}
              <div className="px-4 py-1 rounded-full bg-theme-surface/[0.03] border border-white/10 text-xs font-bold text-gray-300 mb-4 tracking-wider">
                03
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 font-serif">Connect & Marry</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[280px] font-sans">
                Connect with matches, chat, meet and find your perfect life partner.
              </p>

              {/* Dot Indicators */}
              <div className="absolute bottom-6 right-6 flex gap-1.5 opacity-40">
                <span className="w-2 h-2 rounded-full bg-[#4f8cff]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4f8cff]"></span>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom verified badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-16 px-6 py-2.5 rounded-full bg-theme-surface/[0.02] border border-white/10 backdrop-blur-md flex items-center gap-2 hover:border-[#ff2d75]/30 hover:bg-theme-surface/[0.04] transition-all"
          >
            <span className="text-[#ff2d75] text-xs font-black tracking-wider uppercase">100% Verified Profiles</span>
            <span className="text-theme-text-secondary text-xs">•</span>
            <span className="text-gray-400 text-xs font-bold font-sans">
              <span className="text-green-400">Safe</span> • <span className="text-purple-400">Secure</span> • <span className="text-blue-400">Trusted</span>
            </span>
          </motion.div>
        </div>
      </section>

      {/* 7. Recent Couples */}
      <section id="couples" className="relative py-24 px-4 bg-[#fdfbf7] overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center mb-16">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100/80 text-amber-700 font-bold text-sm tracking-widest shadow-sm uppercase mb-4 border border-amber-200">Success Stories</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#291907] font-serif mb-4">Recent Couples</h2>
          </motion.div>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {[
            { img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80", name: "Aarav & Priya", loc: "Pune, Maharashtra" },
            { img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80", name: "Rohan & Sneha", loc: "Mumbai, Maharashtra" },
            { img: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=700&q=80", name: "Vikram & Anjali", loc: "Delhi, India" },
            { img: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=700&q=80", name: "Karan & Neha", loc: "Bangalore, Karnataka" }
          ].map((couple, i) => (
            <motion.div variants={fadeUp} className="relative group cursor-pointer" key={i}>
              <div className="relative w-full h-[400px] rounded-[32px] overflow-hidden shadow-xl border border-white/50 group-hover:shadow-2xl transition-all duration-500">
                  <img src={couple.img} alt={couple.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                  
                  {/* Gradient Overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Text Content */}
                  <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="font-bold text-white font-serif text-2xl mb-1.5">{couple.name}</h3>
                      <div className="flex items-center gap-1.5 text-white/90">
                          <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          <p className="text-sm font-medium tracking-wide">{couple.loc}</p>
                      </div>
                  </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>


      {/* Premium Services Section */}


      {/* 8. Immersive Memories */}
      <section className="relative py-24 px-4 bg-[#0a0502] overflow-hidden">
        <div className="absolute top-0 right-0 w-[] h-[600px] bg-rose-500/10 rounded-full blur-[120px] z-0"></div>
        <div className="absolute bottom-0 left-0 w-[] h-[600px] bg-amber-500/10 rounded-full blur-[120px] z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center mb-16">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-rose-900/50 border border-rose-500/50 text-rose-300 font-bold text-sm tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(244,63,94,0.3)]">XR Experience</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white font-serif mb-4">Immersive Memories</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">Experience beautiful moments in AR/VR before you take the big step.</p>
          </motion.div>
        </div>

        <div className="relative w-full overflow-hidden z-10 py-10 flex gap-6">
          <motion.div 
            className="flex gap-6 shrink-0"
            animate={{ x: ["0%", "calc(-100% - 1.5rem)"] }}
            transition={{ duration: 35, ease: "linear", repeat: Infinity }}
          >
            {[
              "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=900&q=80",
              "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=700&q=80",
              "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=700&q=80",
              "https://images.unsplash.com/photo-1509610973147-232dfea52a97?auto=format&fit=crop&w=700&q=80",
              "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80",
              "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=700&q=80",
              "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=700&q=80",
              "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=700&q=80"
            ].map((img, i) => (
              <div className="relative group w-full max-w-[350px] md:w-full max-w-[450px] h-[400px] flex-shrink-0 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(251,191,36,0.1)]" key={i}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10 pointer-events-none transition-opacity group-hover:opacity-80"></div>
                <img src={img} className="w-full h-full object-cover transform transition-all duration-1000 group-hover:scale-110 group-hover:brightness-110" />
                <div className="absolute top-4 left-4 z-20 pointer-events-none">
                    <span className="bg-theme-surface/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-xs rounded-full text-white tracking-widest">{i % 2 === 0 ? 'AR View' : 'VR Moment'}</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div>
                        <h3 className="text-white font-bold font-serif text-xl mb-1">Interactive Scene</h3>
                        <p className="text-amber-400 text-xs tracking-widest uppercase">Hover to Explore</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-amber-400 flex items-center justify-center bg-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.5)]">
                        <HiSearch className="text-amber-400 w-5 h-5" />
                    </div>
                </div>
              </div>
            ))}
          </motion.div>
          
          {/* Duplicated for seamless infinite scroll */}
          <motion.div 
            className="flex gap-6 shrink-0"
            animate={{ x: ["0%", "calc(-100% - 1.5rem)"] }}
            transition={{ duration: 35, ease: "linear", repeat: Infinity }}
          >
            {[
              "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=900&q=80",
              "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=700&q=80",
              "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=700&q=80",
              "https://images.unsplash.com/photo-1509610973147-232dfea52a97?auto=format&fit=crop&w=700&q=80",
              "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80",
              "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=700&q=80",
              "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=700&q=80",
              "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=700&q=80"
            ].map((img, i) => (
              <div className="relative group w-full max-w-[350px] md:w-full max-w-[450px] h-[400px] flex-shrink-0 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(251,191,36,0.1)]" key={i}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10 pointer-events-none transition-opacity group-hover:opacity-80"></div>
                <img src={img} className="w-full h-full object-cover transform transition-all duration-1000 group-hover:scale-110 group-hover:brightness-110" />
                <div className="absolute top-4 left-4 z-20 pointer-events-none">
                    <span className="bg-theme-surface/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-xs rounded-full text-white tracking-widest">{i % 2 === 0 ? 'AR View' : 'VR Moment'}</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div>
                        <h3 className="text-white font-bold font-serif text-xl mb-1">Interactive Scene</h3>
                        <p className="text-amber-400 text-xs tracking-widest uppercase">Hover to Explore</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-amber-400 flex items-center justify-center bg-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.5)]">
                        <HiSearch className="text-amber-400 w-5 h-5" />
                    </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

        </div>
    )
}

export default Home;