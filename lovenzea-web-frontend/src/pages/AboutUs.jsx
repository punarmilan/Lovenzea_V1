import React from 'react';
import Header from '../components/Headers';
import { ShieldCheck, Globe, MessageCircle, Sparkles } from 'lucide-react';
import bannerImg from '../assets/image/about-banner.png';
import { Link } from 'react-router-dom';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#e91e63] selection:text-white">
            <Header />

            {/* Hero Section with Glassmorphism Overlay */}
            <section className="relative min-h-[80vh] py-32 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={bannerImg}
                        alt="Join LovenZea"
                        className="w-full h-full object-cover object-[center_20%] scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/30 to-slate-50"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-theme-surface/10 backdrop-blur-md border border-white/20 text-white mb-8 animate-fade-in-up">
                        <Sparkles className="w-4 h-4 text-rose-400" />
                        <span className="text-sm font-bold uppercase tracking-widest text-[#e91e63]">Premium Matchmaking</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight drop-shadow-2xl">
                        Uniting <span className="text-[#e91e63]">Souls</span>,<br />Creating <span className="underline decoration-[#e91e63]/50 underline-offset-8">Legacies</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-100 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-lg mb-12">
                        LovenZea is more than a platform; it's a sanctuary for those who believe in the enduring power of love and shared traditions.
                    </p>

                </div>
            </section>

            {/* Our Philosophy Grid */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div>
                            <span className="text-[#e91e63] font-black uppercase tracking-[0.3em] text-sm mb-6 block">Our Philosophy</span>
                            <h2 className="text-5xl font-black text-slate-900 mb-10 tracking-tight leading-[1.1]">
                                We don't just find matches. We nurture <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e91e63] to-rose-400">commitments.</span>
                            </h2>

                            <div className="space-y-10">
                                {[
                                    { icon: <Globe className="text-blue-500" />, title: "Cultural Harmony", desc: "Respecting diverse traditions while embracing modern compatibility. Our algorithm balances lifestyle, values, and family backgrounds." },
                                    { icon: <MessageCircle className="text-indigo-500" />, title: "Open Communication", desc: "Fostering an environment where transparency leads to trust. We provide secure channels for meaningful connections." },
                                    { icon: <ShieldCheck className="text-emerald-500" />, title: "Unwavering Privacy", desc: "Your data is sacred. We employ military-grade encryption and manual profile screening for ultimate peace of mind." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-theme-surface shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-slate-100">
                                            {React.cloneElement(item.icon, { className: 'w-7 h-7' })}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-slate-900 mb-2">{item.title}</h4>
                                            <p className="text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="grid grid-cols-2 gap-6 relative z-10">
                                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600" className="rounded-[2.5rem] shadow-2xl h-80 object-cover mt-12" alt="Success Story 1" />
                                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600" className="rounded-[2.5rem] shadow-2xl h-80 object-cover" alt="Success Story 2" />
                            </div>
                            {/* Decorative background element */}
                            <div className="absolute -top-12 -right-12 w-64 h-64 bg-slate-200 rounded-full blur-[80px] -z-10 opacity-60"></div>
                            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-rose-200 rounded-full blur-[80px] -z-10 opacity-60"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Statistics - Dark Section */}
            <section className="py-24 bg-[#0a0e1b] overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute top-[20%] left-[10%] w-[80vw] h-[80vw] border border-white rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { label: "Matches Made", value: "250K+" },
                            { label: "Success Rate", value: "94%" },
                            { label: "Daily Signups", value: "1200+" },
                            { label: "Awards Won", value: "15+" }
                        ].map((stat, i) => (
                            <div key={i} className="group cursor-default">
                                <div className="text-5xl md:text-6xl font-black text-white mb-4 group-hover:text-[#e91e63] transition-colors duration-300">
                                    {stat.value}
                                </div>
                                <div className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial Quote */}
            <section className="py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="bg-theme-surface rounded-[4rem] p-12 md:p-24 shadow-2xl border border-slate-100 flex flex-col items-center text-center relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#e91e63] rounded-full flex items-center justify-center shadow-xl">
                            <span className="text-white text-5xl font-serif">"</span>
                        </div>
                        <p className="text-2xl md:text-4xl font-serif italic text-slate-800 leading-snug mb-12">
                            "Finding a partner on LovenZea felt different. It wasn't about swiping; it was about understanding. The platform's respect for our values made the journey as beautiful as the destination."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden shadow-md">
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" alt="Sarah & Rohan" className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left">
                                <div className="font-black text-slate-900 text-lg">Sarah & Rohan K.</div>
                                <div className="text-slate-500 text-sm font-bold uppercase">Married June 2026</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center text-slate-900">
                    <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tight">
                        Your Soulmate is <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">Waiting Here.</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto font-medium mb-16 px-4 leading-relaxed">
                        Don't let distance or hesitation stand in the way of a lifetime of togetherness.
                    </p>
                    <Link to="/">
                        <button className="bg-slate-900 text-white px-12 py-6 rounded-[2rem] text-2xl font-black hover:bg-[#e91e63] transition-all duration-500 shadow-2xl shadow-slate-900/20 hover:shadow-rose-500/30 transform hover:-translate-y-2">
                            Create Your Free Profile Today
                        </button>
                    </Link>
                </div>
            </section>

            
        </div>
    );
};

export default AboutUs;
