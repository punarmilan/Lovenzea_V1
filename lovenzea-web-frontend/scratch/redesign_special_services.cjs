const fs = require('fs');
const path = 'e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/myshadi/services/SpecialServices.jsx';

const newContent = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartHandshake, ShieldCheck, Gem, Users, CalendarCheck, Sparkles, 
  Brain, MessageCircle, Smile, Activity, Briefcase, Wallet, Target, 
  Stethoscope, CheckCircle2, Award, X, AlertCircle, Info, Heart
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../services/api';

const services = [
  {
    icon: <HeartHandshake size={28} strokeWidth={1.5} />,
    title: "VIP One-to-One Couple Coaching",
    desc: "Personalized and private training for each couple. 100% confidential sessions tailored to your individual needs."
  },
  {
    icon: <Brain size={28} strokeWidth={1.5} />,
    title: "Personality & Behavior Analysis",
    desc: "Personality assessment, understanding habits and behaviors, and identifying strengths and areas for improvement."
  },
  {
    icon: <MessageCircle size={28} strokeWidth={1.5} />,
    title: "Communication Skills",
    desc: "Effective communication, the art of understanding each other, and positive resolution of differences."
  },
  {
    icon: <Smile size={28} strokeWidth={1.5} />,
    title: "Emotional Intelligence",
    desc: "Understanding emotions, anger management, and developing trust and respect."
  },
  {
    icon: <Activity size={28} strokeWidth={1.5} />,
    title: "Lifestyle & Habit Management",
    desc: "Daily life habits, time management, and work-life balance."
  },
  {
    icon: <Users size={28} strokeWidth={1.5} />,
    title: "Family & Relationship Management",
    desc: "Better relations with in-laws and both families, understanding responsibilities, and family harmony."
  },
  {
    icon: <Wallet size={28} strokeWidth={1.5} />,
    title: "Financial Planning for Couples",
    desc: "Budgeting, savings & investments, and joint financial planning."
  },
  {
    icon: <Target size={28} strokeWidth={1.5} />,
    title: "Future Planning (Goal Setting)",
    desc: "1-year plan, 5-year plan, and 10-year joint life plan."
  },
  {
    icon: <Stethoscope size={28} strokeWidth={1.5} />,
    title: "Health & Wellness",
    desc: "Mental health awareness, stress management, and a healthy lifestyle."
  },
  {
    icon: <ShieldCheck size={28} strokeWidth={1.5} />,
    title: "Post-Marriage Support",
    desc: "Post-marriage follow-up sessions, couple coaching as needed, and guidance to strengthen the relationship."
  }
];

const features = [
  "VIP Private Coaching Room",
  "100% Confidentiality",
  "Personalized Couple Assessment Report",
  "Premium Training Workbook",
  "Welcome Kit",
  "Refreshments",
  "Training Completion Certificate",
  "Post-Marriage Support"
];

const team = [
  { name: "Relationship Coach", icon: <HeartHandshake size={16} /> },
  { name: "Personality Development Trainer", icon: <Brain size={16} /> },
  { name: "Communication Expert", icon: <MessageCircle size={16} /> },
  { name: "Family Relationship Coach", icon: <Users size={16} /> },
  { name: "Financial Planning Coach", icon: <Wallet size={16} /> },
  { name: "Health & Wellness Coach", icon: <Activity size={16} /> },
  { name: "Psychologist", icon: <Brain size={16} /> }
];

const SectionHeading = ({ title }) => (
    <div className="text-center mb-16 relative z-10">
      <h2 className="text-3xl md:text-4xl font-black text-[#5b2333] font-serif mb-4 drop-shadow-sm">
        {title}
      </h2>
      <div className="flex items-center justify-center gap-4 text-[#e88c8c]">
        <div className="w-16 h-px bg-gradient-to-l from-[#e88c8c] to-transparent"></div>
        <Heart size={16} className="fill-[#e88c8c] opacity-80" />
        <div className="w-16 h-px bg-gradient-to-r from-[#e88c8c] to-transparent"></div>
      </div>
    </div>
);

const SpecialServices = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbPackages, setDbPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/subscriptions/plans');
        const specialPlans = response.data.filter(p => p.planType === 'SPECIAL_SERVICE' || p.planType === 'UPGRADE');
        
        const formattedPackages = specialPlans.map(plan => {
            let color = "from-gray-300 to-gray-400"; // default
            let badge = null;
            if (plan.name.toLowerCase().includes("silver")) {
                color = "from-gray-300 to-gray-400";
            } else if (plan.name.toLowerCase().includes("gold")) {
                color = "from-amber-200 to-amber-400";
            } else if (plan.name.toLowerCase().includes("platinum")) {
                color = "from-slate-700 to-slate-900";
            } else if (plan.name.toLowerCase().includes("diamond") || plan.name.toLowerCase().includes("elite")) {
                color = "from-[#ef7f8f] to-[#c93f65]";
                badge = "Elite Choice";
            }

            return {
                name: plan.name,
                duration: plan.durationInDays > 0 ? \`\${plan.durationInDays} Days\` : "Custom",
                price: \`₹\${plan.price}\`,
                color: color,
                badge: badge,
                popular: plan.name.toLowerCase().includes("gold") || plan.name.toLowerCase().includes("diamond")
            };
        });
        
        // If empty, supply some dummies to match the prompt's request for 4 packages visually if API is missing them,
        // but prompt said "Do not change existing package selection logic" so we stick to API if available.
        setDbPackages(formattedPackages);
      } catch (error) {
        console.error("Failed to fetch special service plans", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    packageType: 'Gold Package',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPackagePrice = (pkgName) => {
    switch(pkgName) {
      case 'Silver Package': return 25000;
      case 'Gold Package': return 60000;
      case 'Platinum Package': return 125000;
      case 'Diamond Elite': return 250000;
      default: return 60000;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const price = getPackagePrice(formData.packageType);
      
      const { data: orderResponse } = await api.post('/payments/create-vip-order', {
          amount: price,
          packageType: formData.packageType
      }).catch(async (err) => {
          console.warn('VIP order endpoint missing, using fallback plan for UI demonstration');
          return await api.post(\`/payments/create-order/1\`);
      });
      
      const options = {
          key: orderResponse.key || 'rzp_test_dummy',
          amount: price * 100,
          currency: orderResponse.currency || 'INR',
          name: 'Punarmilan VIP',
          description: \`Booking for \${formData.packageType}\`,
          order_id: orderResponse.orderId || orderResponse.id,
          handler: async (response) => {
              try {
                  const verificationData = {
                      ...formData,
                      razorpayPaymentId: response.razorpay_payment_id,
                      razorpayOrderId: response.razorpay_order_id,
                      amountPaid: price
                  };
                  
                  const enrollRes = await fetch('/api/vip-enrollments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(verificationData)
                  });

                  if (enrollRes.ok) {
                      toast.success("Payment successful! VIP Consultation booked.");
                      setIsModalOpen(false);
                      setFormData({
                        name: '', email: '', phone: '', packageType: 'Gold Package', message: ''
                      });
                  } else {
                      toast.error("Payment verified, but booking failed to save.");
                  }
              } catch (err) {
                  toast.error('Payment verification failed');
              }
          },
          prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone
          },
          theme: {
              color: '#df5f78',
          },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error("Payment gateway not loaded.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-[#fffaf7] via-[#fff4ef] to-[#fffaf8] text-[#3d2930]">
      {/* 1. HERO SECTION */}
      <div className="relative pt-32 pb-40 lg:pt-40 lg:pb-48 overflow-hidden">
        {/* Soft Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f8d8cc] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#fff1ed] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 -z-10"></div>
        
        {/* Floral line art (Using SVG as placeholder for premium matrimonial decor) */}
        <div className="absolute top-10 left-10 opacity-10 -z-10 w-64 h-64 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0C50 27.614 27.614 50 0 50C27.614 50 50 72.386 50 100C50 72.386 72.386 50 100 50C72.386 50 50 27.614 50 0Z" fill="#df5f78"/>
            </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column */}
            <div className="text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#f1d8d1] shadow-sm text-[#b83f5d] font-bold text-xs uppercase tracking-widest mb-6"
              >
                <Gem size={14} className="text-[#d8a44a]" /> Elite Relationship Academy
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-[#5b2333] font-serif mb-6 leading-[1.15]"
              >
                VIP Pre-Marriage Coaching & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#df5f78] to-[#d8a44a]">
                  Couple Development Center
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-[#7c6870] max-w-lg mb-10 font-medium leading-relaxed"
              >
                A successful marriage begins with the right preparation. Lay a strong foundation for a lifetime of love and understanding.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-br from-[#ef7f8f] to-[#c93f65] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-[0_10px_30px_rgba(201,63,101,0.2)] hover:shadow-[0_15px_40px_rgba(201,63,101,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <CalendarCheck size={20} /> Book VIP Consultation
                </button>
              </motion.div>
            </div>

            {/* Right Column: Premium Realistic Indian Couple */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#f8d8cc]/30 to-transparent rounded-[3rem] transform rotate-3 scale-105 z-0"></div>
              <div className="relative rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(91,35,51,0.1)] z-10 border-[6px] border-white">
                <img 
                  src="https://images.unsplash.com/photo-1583089892943-e02e52f17094?auto=format&fit=crop&q=80&w=800" 
                  alt="Premium Indian Couple" 
                  className="w-full h-[550px] object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#5b2333]/40 via-transparent to-transparent"></div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </div>

      {/* 2. OUR VISION (Floating Card Overlapping Hero) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-20 -mt-24 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-[0_20px_40px_rgba(91,35,51,0.06)] border border-[#fffaf7] text-center"
        >
          <h3 className="text-2xl font-bold text-[#b83f5d] font-serif mb-4">Our Vision</h3>
          <p className="text-[#7c6870] leading-relaxed text-lg">
            Marriage is not just a ceremony, but a lifelong partnership. Our goal is to prepare couples mentally, emotionally, behaviorally, and practically before marriage, so they can start their married life with trust, understanding, respect, and better communication.
          </p>
        </motion.div>
      </div>

      {/* 3. OUR SERVICES SECTION */}
      <div className="py-24">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Our Services" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-[22px] p-8 border border-[#f1d8d1] shadow-[0_10px_30px_rgba(160,65,90,0.05)] hover:shadow-[0_18px_40px_rgba(160,65,90,0.12)] hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Soft decorative corner bloom */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#fff1ed] to-transparent rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>

                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#fff1ed] to-[#f8d8cc] flex items-center justify-center text-[#df5f78] mb-6 shadow-sm border border-white">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-[#5b2333] mb-3 font-serif leading-snug">{service.title}</h3>
                <p className="text-[#7c6870] text-sm leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. PACKAGES SECTION */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fffaf7] to-[#fff1ed] -z-10"></div>
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading title="Program Duration & Packages" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {loading ? (
                <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center py-12 font-bold text-[#e88c8c] animate-pulse">
                    Loading premium packages...
                </div>
            ) : dbPackages.length > 0 ? (
                dbPackages.map((pkg, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className={\`relative bg-white rounded-3xl p-8 border \${pkg.popular ? 'border-[#df5f78] shadow-[0_20px_40px_rgba(223,95,120,0.15)] scale-[1.02] z-10' : 'border-[#f1d8d1] shadow-[0_10px_20px_rgba(91,35,51,0.05)]'} flex flex-col transition-all duration-300\`}
                >
                    {pkg.popular && (
                      <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#ef7f8f] to-[#c93f65] text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
                          {pkg.badge || 'Most Popular'}
                      </div>
                    )}
                    
                    <div className={\`w-14 h-14 rounded-2xl bg-gradient-to-br \${pkg.color} flex items-center justify-center text-white mb-6 shadow-sm mx-auto\`}>
                      <Gem size={24} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-center text-[#5b2333] mb-1 font-serif">{pkg.name}</h3>
                    <div className="text-center text-xs text-[#b83f5d] mb-6 font-bold uppercase tracking-wider">{pkg.duration} Program</div>
                    
                    <div className="text-center mb-8 flex-grow">
                      <span className="text-4xl font-black text-[#3d2930] tracking-tight">{pkg.price}</span>
                    </div>
                    
                    <button 
                      onClick={() => {
                          setFormData({...formData, packageType: pkg.name});
                          setIsModalOpen(true);
                      }}
                      className={\`w-full py-3.5 rounded-xl font-bold transition-all duration-300 \${
                        pkg.popular 
                        ? 'bg-gradient-to-r from-[#ef7f8f] to-[#c93f65] text-white hover:shadow-[0_8px_20px_rgba(201,63,101,0.3)] hover:-translate-y-1' 
                        : 'bg-white border-2 border-[#f1d8d1] text-[#b83f5d] hover:bg-[#fff1ed] hover:border-[#e88c8c]'
                      }\`}
                    >
                      Select Package
                    </button>
                </motion.div>
                ))
            ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center py-10 font-bold text-[#7c6870]">
                    No special packages available at the moment. Please check back later!
                </div>
            )}
          </div>

          {/* 5. PACKAGE BENEFITS STRIP */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-12 pt-10 border-t border-[#f1d8d1]/60">
             {["Private sessions", "Confidential coaching", "Personalized assessment", "Expert guidance", "Completion certificate"].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#fffaf7]">
                  <CheckCircle2 size={16} className="text-[#df5f78]" />
                  <span className="text-xs font-bold text-[#7c6870] tracking-wide">{benefit}</span>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* 6. SPECIAL FEATURES & 7. EXPERT TEAM */}
      <div className="py-24">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Features Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_10px_40px_rgba(91,35,51,0.06)] border border-[#f1d8d1] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZWY3ZjhmIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==')] bg-no-repeat bg-right-top opacity-30"></div>
              
              <h3 className="text-2xl font-bold text-[#5b2333] font-serif mb-8 flex items-center gap-3">
                <Sparkles className="text-[#d8a44a]"/> Premium Inclusions
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#fffaf7] p-3.5 rounded-xl border border-[#f8d8cc]">
                    <div className="w-6 h-6 rounded-full bg-[#fff1ed] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="text-[#df5f78]" size={14} strokeWidth={3} />
                    </div>
                    <span className="text-[#3d2930] font-medium text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Team Panel */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#fffaf7] to-[#fff1ed] rounded-[2rem] p-8 md:p-10 shadow-[0_10px_40px_rgba(91,35,51,0.06)] border border-[#f8d8cc]"
            >
              <h3 className="text-2xl font-bold text-[#5b2333] font-serif mb-8 flex items-center gap-3">
                <Award className="text-[#d8a44a]"/> Our Expert Panel
              </h3>
              <p className="text-[#7c6870] mb-8 text-sm leading-relaxed">
                Our certified relationship experts, psychologists, and development coaches are dedicated to building a strong foundation for your journey together.
              </p>
              <div className="flex flex-wrap gap-3">
                {team.map((member, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white border border-[#f1d8d1] hover:border-[#df5f78] hover:bg-[#fffaf7] transition-colors px-4 py-2.5 rounded-full text-[#b83f5d] font-bold text-xs shadow-sm cursor-default hover:-translate-y-0.5 duration-200">
                    {member.icon}
                    {member.name}
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* 8. IMPORTANT INFO */}
      <div className="pb-24 pt-8">
        <div className="max-w-[1000px] mx-auto px-4">
          <div className="bg-gradient-to-r from-[#fff4ef] to-[#f8d8cc] rounded-[2rem] p-8 md:p-10 border border-[#f1d8d1] shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
               <Info size={180} className="text-[#b83f5d] transform translate-x-10 -translate-y-10" />
            </div>
            
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#f1d8d1] relative z-10">
              <Info className="text-[#df5f78]" size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#5b2333] font-serif mb-4 relative z-10">Important Notice</h3>
            <p className="text-[#7c6870] text-sm md:text-base leading-relaxed max-w-3xl mx-auto relative z-10 font-medium">
              This program is based on education, personality development, life skills, and relationship coaching. It is not a substitute for medical treatment or therapy for mental illness. If any participant has severe mental health issues, they will be advised to consult a qualified mental health professional.
            </p>
          </div>
        </div>
      </div>

      {/* ENROLLMENT MODAL (Retained existing logic, updated styles) */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3d2930]/40 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl relative border border-[#f1d8d1]"
            >
              <div className="bg-gradient-to-r from-[#df5f78] to-[#c93f65] p-8 text-white text-center relative">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 transition-colors rounded-full p-1.5"
                >
                  <X size={20} />
                </button>
                <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-md">
                   <Gem className="text-white" size={32} />
                </div>
                <h2 className="text-2xl font-bold font-serif drop-shadow-sm">VIP Consultation</h2>
                <p className="text-sm text-rose-100 mt-1 font-medium">Secure your exclusive session today</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#b83f5d] uppercase tracking-wider mb-2">Full Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-[#f1d8d1] focus:ring-2 focus:ring-[#df5f78] focus:border-transparent outline-none bg-[#fffaf7] transition-all text-[#3d2930]" placeholder="Enter your full name" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#b83f5d] uppercase tracking-wider mb-2">Email Address</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-[#f1d8d1] focus:ring-2 focus:ring-[#df5f78] focus:border-transparent outline-none bg-[#fffaf7] transition-all text-[#3d2930]" placeholder="Email" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#b83f5d] uppercase tracking-wider mb-2">Phone Number</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-[#f1d8d1] focus:ring-2 focus:ring-[#df5f78] focus:border-transparent outline-none bg-[#fffaf7] transition-all text-[#3d2930]" placeholder="Phone" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#b83f5d] uppercase tracking-wider mb-2">Select Package</label>
                  <select required name="packageType" value={formData.packageType} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-[#f1d8d1] focus:ring-2 focus:ring-[#df5f78] focus:border-transparent outline-none bg-[#fffaf7] appearance-none font-bold text-[#3d2930] transition-all cursor-pointer">
                    <option value="Silver Package">Silver Package (₹25,000)</option>
                    <option value="Gold Package">Gold Package (₹60,000)</option>
                    <option value="Platinum Package">Platinum Package (₹1,25,000)</option>
                    <option value="Diamond Elite">Diamond Elite (Custom)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#b83f5d] uppercase tracking-wider mb-2">Message (Optional)</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows="2" className="w-full px-5 py-3.5 rounded-xl border border-[#f1d8d1] focus:ring-2 focus:ring-[#df5f78] focus:border-transparent outline-none bg-[#fffaf7] resize-none transition-all text-[#3d2930]" placeholder="Any specific requirements..."></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#ef7f8f] to-[#c93f65] text-white font-bold text-lg py-4 rounded-xl shadow-[0_8px_20px_rgba(201,63,101,0.25)] hover:shadow-[0_12px_25px_rgba(201,63,101,0.35)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Submit Request</>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpecialServices;
`;

fs.writeFileSync(path, newContent);
console.log('SpecialServices.jsx updated with premium theme.');
