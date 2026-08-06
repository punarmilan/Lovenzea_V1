import React from 'react';
import { Shield, Lock, AlertTriangle, EyeOff, UserCheck, MessageCircle, AlertOctagon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Headers';

const safetyTips = [
  {
    icon: <Lock size={28} className="text-[#d94f73]" />,
    title: "Protect Your Personal Information",
    description: "Never share sensitive details like your bank account, credit card, Aadhaar, or address immediately. Share only what is necessary on your profile.",
    bgColor: "bg-pink-50 border-pink-100"
  },
  {
    icon: <AlertTriangle size={28} className="text-orange-500" />,
    title: "Beware of Money Requests",
    description: "If a match asks for money for any emergency, travel, or medical reasons, it is a major red flag. Stop communication and report the profile immediately.",
    bgColor: "bg-orange-50 border-orange-100"
  },
  {
    icon: <UserCheck size={28} className="text-emerald-500" />,
    title: "Verify Before You Trust",
    description: "Look for the 'Verified Badge' on our platform. Do your own background check on social media or LinkedIn before committing.",
    bgColor: "bg-emerald-50 border-emerald-100"
  },
  {
    icon: <MessageCircle size={28} className="text-purple-500" />,
    title: "Communicate on Platform",
    description: "Use our secure chat system as long as possible before moving to WhatsApp or personal phone calls. Our platform has built-in safety filters.",
    bgColor: "bg-purple-50 border-purple-100"
  },
  {
    icon: <EyeOff size={28} className="text-rose-500" />,
    title: "Control Profile Visibility",
    description: "Use our privacy settings to control who sees your photos and contact details. You can restrict access to accepted matches only.",
    bgColor: "bg-rose-50 border-rose-100"
  },
  {
    icon: <AlertOctagon size={28} className="text-red-500" />,
    title: "Report Suspicious Activity",
    description: "If someone is harassing you, using abusive language, or seems fake, use the 'Report' button on their profile right away.",
    bgColor: "bg-red-50 border-red-100"
  }
];

const BeSafeOnline = () => {
  return (
    <div className="min-h-screen bg-[#FFFDFB] font-sans">
      <Header />
      
      {/* Hero Section */}
      <div className="pt-36 pb-24 px-4 text-center relative overflow-hidden bg-gradient-to-br from-[#FFF5F7] via-[#FFF9F0] to-[#F5F9FF]">
        <div className="absolute inset-0 z-0 bg-theme-surface/20 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="w-24 h-24 bg-theme-surface text-[#d94f73] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-pink-100 border border-pink-100">
            <Shield size={48} />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-6 font-serif tracking-tight">
            Be <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d94f73] to-rose-400">Safe Online</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium px-4">
            Your safety and privacy are our top priorities. Follow these essential guidelines to ensure a secure and beautiful matchmaking experience.
          </p>
        </div>
      </div>

      {/* Safety Tips Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {safetyTips.map((tip, index) => (
            <div 
              key={index}
              className="bg-theme-surface rounded-3xl p-8 border border-rose-50 shadow-[0_8px_30px_rgba(217,79,115,0.06)] hover:shadow-[0_15px_40px_rgba(217,79,115,0.12)] transition-all duration-300 hover:-translate-y-1.5 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-50/50 to-transparent rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-150"></div>
              
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border ${tip.bgColor} shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                {tip.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 font-serif">
                {tip.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {tip.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action for Help */}
        <div className="mt-20 bg-gradient-to-r from-[#d94f73] to-rose-500 rounded-[2.5rem] p-10 md:p-14 text-center shadow-xl shadow-pink-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-theme-surface rounded-full opacity-10 blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black rounded-full opacity-5 blur-3xl -ml-20 -mb-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-4 font-serif text-white tracking-wide">Need Help or Found a Fake Profile?</h2>
            <p className="text-pink-50 mb-10 max-w-2xl mx-auto text-lg font-medium">
              Our trust and safety team works 24/7. Don't hesitate to reach out if you feel uncomfortable or notice suspicious behavior.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact" className="bg-theme-surface text-[#d94f73] font-bold px-8 py-4 rounded-xl hover:bg-pink-50 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300">
                Contact Support
              </Link>
              <Link to="/about-us" className="bg-rose-600/30 text-white border border-rose-300/50 font-bold px-8 py-4 rounded-xl hover:bg-rose-600/50 transition-colors backdrop-blur-md shadow-sm hover:shadow-md hover:-translate-y-1 transform duration-300">
                Read Our Policies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeSafeOnline;
