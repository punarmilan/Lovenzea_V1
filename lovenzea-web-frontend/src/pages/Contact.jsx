import React, { useState } from 'react';
import Header from '../components/Headers';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare, User, Smartphone, Tag } from 'lucide-react';
import contactService from '../services/contactService';
import { toast } from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await contactService.submitMessage(formData);
            toast.success('Your message has been sent successfully! Our team will contact you soon.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#e91e63] selection:text-white">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-[#0a0e1b] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[20%] left-[10%] w-[60vw] h-[60vw] border border-white rounded-full"></div>
                    <div className="absolute -bottom-[10%] -right-[5%] w-[40vw] h-[40vw] border border-rose-500 rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                        We're Here to <span className="text-[#e91e63]">Help</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        Have questions about our premium matchmaking? Our dedicated support team is ready to assist you in finding your perfect partner.
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-24 relative -mt-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        
                        {/* Contact Info Cards */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-theme-surface p-8 rounded-[2.5rem] shadow-xl border border-slate-100 group hover:-translate-y-2 transition-all duration-500">
                                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <Phone className="w-8 h-8 text-[#e91e63]" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">Call Us</h3>
                                <p className="text-slate-500 font-medium mb-4">Available 10 AM - 7 PM</p>
                                <a href="tel:+91 9923400442" className="text-lg font-black text-[#e91e63] hover:underline">+91 9923400442</a>
                            </div>

                            <div className="bg-theme-surface p-8 rounded-[2.5rem] shadow-xl border border-slate-100 group hover:-translate-y-2 transition-all duration-500">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <Mail className="w-8 h-8 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">Email Us</h3>
                                <p className="text-slate-500 font-medium mb-4">We reply within 24 hours</p>
                                <a href="mailto:lovenzea2@gmail.com" className="text-lg font-black text-blue-600 hover:underline">lovenzea2@gmail.com</a>
                            </div>

                            <div className="bg-theme-surface p-8 rounded-[2.5rem] shadow-xl border border-slate-100 group hover:-translate-y-2 transition-all duration-500">
                                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <MapPin className="w-8 h-8 text-amber-500" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">Visit Us</h3>
                                <p className="text-slate-500 font-medium mb-4">Our corporate office</p>
                                <address className="text-lg font-black text-slate-800 not-italic">Pune, Maharashtra, India</address>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-8 bg-theme-surface p-10 md:p-14 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-[4rem] -z-10"></div>
                            
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-10 tracking-tight">
                                Send us a <span className="text-[#e91e63]">Message</span>
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Your Name</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-[#e91e63] transition-colors">
                                                <User className="w-5 h-5 text-slate-300" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-[#e91e63] transition-all font-medium text-slate-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-[#e91e63] transition-colors">
                                                <Mail className="w-5 h-5 text-slate-300" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Enter your email"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-[#e91e63] transition-all font-medium text-slate-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-[#e91e63] transition-colors">
                                                <Smartphone className="w-5 h-5 text-slate-300" />
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Your mobile number"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-[#e91e63] transition-all font-medium text-slate-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-[#e91e63] transition-colors">
                                                <Tag className="w-5 h-5 text-slate-300" />
                                            </div>
                                            <input
                                                type="text"
                                                name="subject"
                                                required
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="Inquiry about..."
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-[#e91e63] transition-all font-medium text-slate-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Your Message</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows="6"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="How can we help you today?"
                                        className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-[#e91e63] transition-all font-medium text-slate-700 resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-slate-900 text-white px-10 py-5 rounded-[2rem] text-xl font-black hover:bg-[#e91e63] transition-all duration-500 shadow-2xl flex items-center justify-center gap-4 group hover:shadow-rose-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Send Your Inquiry
                                            <Send className="w-6 h-6 transform group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            
        </div>
    );
};

export default Contact;
