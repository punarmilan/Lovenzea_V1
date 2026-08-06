import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Users, MapPin, Calendar, Heart, Utensils, Camera, Award, Crown, Map, CheckCircle } from 'lucide-react';
import flowerBouquet from '../../../assets/image/flower_bouquet.png';

// --- DATA ARRAYS ---
const heroPhotos = [
  "https://images.unsplash.com/photo-1597026779313-05b6fa726054?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=600&q=80"
];

const saveTheDatePhotos = [
  { img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80", date: "Engagement", title: "The Beginning" },
  { img: "https://images.unsplash.com/photo-1597026779313-05b6fa726054?auto=format&fit=crop&w=400&q=80", date: "Sangeet", title: "Musical Night" },
  { img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80", date: "Wedding", title: "The Big Day" },
];

const timelineData = [
  { 
    title: "Ganesh Sthapana", 
    time: "9:00 AM", 
    desc: "Join us in invoking Lord Ganesha's blessings for a joyous and obstacle-free wedding celebration.", 
    icon: <Crown size={28} className="text-[#800000]" />,
    align: "left"
  },
  { 
    title: "Haldi Ceremony", 
    time: "11:30 AM", 
    desc: "A beautiful morning filled with laughter, colors, and the traditional turmeric ceremony.", 
    icon: <Heart size={28} className="text-[#800000]" />,
    align: "right"
  },
  { 
    title: "Wedding Baraat", 
    time: "6:00 PM", 
    desc: "Dance to the beats of the dhol as the groom's procession arrives in grand style.", 
    icon: <Users size={28} className="text-[#800000]" />,
    align: "left"
  },
  { 
    title: "Phere & Sindoor", 
    time: "8:00 PM", 
    desc: "The sacred vows around the holy fire, binding two souls together for eternity.", 
    icon: <CheckCircle size={28} className="text-[#800000]" />,
    align: "right"
  },
];

const galleryPhotos = [
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1597026779313-05b6fa726054?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80"
];

// --- HOOKS & UTILS ---
const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;
      if (distance < 0) {
        clearInterval(intervalId);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [targetDate]);
  return timeLeft;
};

// --- COMPONENTS ---
const FloralCorner = ({ position }) => {
  const classes = {
    'top-left': 'top-0 left-0 transform -translate-x-8 -translate-y-8 md:-translate-x-12 md:-translate-y-12',
    'top-right': 'top-0 right-0 transform scale-x-[-1] translate-x-8 -translate-y-8 md:translate-x-12 md:-translate-y-12',
    'bottom-left': 'bottom-0 left-0 transform scale-y-[-1] -translate-x-8 translate-y-8 md:-translate-x-12 md:translate-y-12',
    'bottom-right': 'bottom-0 right-0 transform rotate-180 translate-x-8 translate-y-8 md:translate-x-12 md:translate-y-12',
  };
  
  return (
    <img 
      src={flowerBouquet} 
      alt="Floral Decor" 
      className={`absolute w-32 h-32 md:w-56 md:h-56 object-contain opacity-60 pointer-events-none z-0 ${classes[position]}`} 
    />
  );
};

const MandalaBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.03]">
    <div className="absolute top-[-20%] left-[-10%] w-[] h-[600px] bg-[radial-gradient(circle,rgba(128,0,0,0.8)_0%,transparent_70%)] rounded-full blur-[80px]" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[] h-[600px] bg-[radial-gradient(circle,rgba(212,175,55,0.8)_0%,transparent_70%)] rounded-full blur-[80px]" />
    <svg className="absolute w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <pattern id="mandala" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="4" fill="none" stroke="#800000" strokeWidth="0.2" />
          <circle cx="5" cy="5" r="2" fill="none" stroke="#d4af37" strokeWidth="0.2" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#mandala)" />
    </svg>
  </div>
);

export default function Wedding() {
  const timeLeft = useCountdown('2026-12-12T09:00:00');

  return (
    <div className="font-sans text-[#6a4a3c] bg-[#fffdd0] min-h-screen overflow-x-hidden pt-8">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full bg-gradient-to-b from-[#fffdd0] to-[#fdf8ed] rounded-b-[4rem] pb-32 pt-16 px-4 md:px-8 overflow-hidden z-10 border-b border-[#d4af37]/20">
        <MandalaBackground />
        <FloralCorner position="top-left" />
        <FloralCorner position="top-right" />

        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
             {/* Lotus Icon Placeholder */}
             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
                <path d="M12 22C12 22 17 19 19 14C21 9 17 4 17 4C17 4 18 10 16 12C14 14 12 16 12 16C12 16 10 14 8 12C6 10 7 4 7 4C7 4 3 9 5 14C7 19 12 22 12 22Z" fill="#d4af37"/>
                <path d="M12 22C12 22 14 18 14 12C14 6 12 2 12 2C12 2 10 6 10 12C10 18 12 22 12 22Z" fill="#d94f73"/>
             </svg>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm md:text-base font-bold tracking-[0.25em] uppercase text-[#800000] mb-6"
          >
            Together with their families
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#6a4a3c] mb-6 font-medium tracking-tight"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            Aarav <span className="text-[#d4af37] text-4xl md:text-6xl mx-2">&</span> Ananya
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[#6a4a3c]/80 mb-8 text-base md:text-lg font-light max-w-xl mx-auto"
          >
            Invite you to share in the joy of their new beginning as they tie the knot in a celebration of love, culture, and tradition.
          </motion.p>
          
          {/* Gold Divider */}
          <motion.div 
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="w-40 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mb-10"
          ></motion.div>
          
          <motion.button 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-[#800000] to-[#d94f73] text-white px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:shadow-[0_10px_30px_rgba(128,0,0,0.3)] border border-[#d4af37] flex items-center gap-3 mb-16 transition-all relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">RSVP Now <Heart size={16} className="fill-white" /></span>
          </motion.button>

          {/* Pill Cards */}
          <div className="flex flex-col sm:flex-row gap-5 mb-24 text-sm font-bold text-[#800000] uppercase tracking-wider">
            <motion.div whileHover={{ y: -3 }} className="flex items-center gap-3 bg-theme-surface/90 backdrop-blur-md px-8 py-4 rounded-full border border-[#d4af37]/30 shadow-[0_10px_30px_rgba(212,175,55,0.1)]">
              <Calendar size={18} className="text-[#d4af37]" />
              12 Dec 2026
            </motion.div>
            <motion.div whileHover={{ y: -3 }} className="flex items-center gap-3 bg-theme-surface/90 backdrop-blur-md px-8 py-4 rounded-full border border-[#d4af37]/30 shadow-[0_10px_30px_rgba(212,175,55,0.1)] cursor-pointer">
              <MapPin size={18} className="text-[#d4af37]" />
              Jaipur, India
            </motion.div>
          </div>
        </div>

        {/* Jharokha Image Collage */}
        <div className="relative max-w-5xl mx-auto h-[400px] md:h-[550px] flex justify-center items-end px-4 mt-10">
           {/* Left Image */}
           <motion.div 
             initial={{ rotate: -10, x: -60, opacity: 0 }}
             animate={{ rotate: -6, x: 30, opacity: 1 }}
             whileHover={{ rotate: -3, y: -15, scale: 1.05, zIndex: 30 }}
             transition={{ duration: 0.9, delay: 0.6 }}
             className="absolute left-0 md:left-16 bottom-0 w-[45%] md:w-72 bg-theme-surface p-3 shadow-[0_20px_40px_rgba(128,0,0,0.1)] z-10 border border-[#d4af37]/20 rounded-t-[100px]"
           >
             <img src={heroPhotos[0]} alt="Bride" className="w-full aspect-[4/5] object-cover rounded-t-[100px] rounded-b-md" />
           </motion.div>
           
           {/* Center Image (Jharokha style) */}
           <motion.div 
             initial={{ y: 60, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             whileHover={{ y: -20, scale: 1.05, zIndex: 40 }}
             transition={{ duration: 0.9, delay: 0.7 }}
             className="absolute left-1/2 -translate-x-1/2 bottom-8 md:bottom-12 w-[60%] md:w-96 bg-theme-surface p-4 shadow-[0_30px_60px_rgba(128,0,0,0.15)] z-20 border-2 border-[#d4af37] rounded-t-full rounded-b-xl"
           >
             <img src={heroPhotos[1]} alt="Couple" className="w-full aspect-[3/4] object-cover rounded-t-full rounded-b-lg" />
           </motion.div>

           {/* Right Image */}
           <motion.div 
             initial={{ rotate: 10, x: 60, opacity: 0 }}
             animate={{ rotate: 6, x: -30, opacity: 1 }}
             whileHover={{ rotate: 3, y: -15, scale: 1.05, zIndex: 30 }}
             transition={{ duration: 0.9, delay: 0.8 }}
             className="absolute right-0 md:right-16 bottom-0 w-[45%] md:w-72 bg-theme-surface p-3 shadow-[0_20px_40px_rgba(128,0,0,0.1)] z-10 border border-[#d4af37]/20 rounded-t-[100px]"
           >
             <img src={heroPhotos[2]} alt="Groom" className="w-full aspect-[4/5] object-cover rounded-t-[100px] rounded-b-md" />
           </motion.div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="relative z-30 max-w-6xl mx-auto px-4 -mt-16">
        <div className="bg-theme-surface/95 backdrop-blur-2xl border border-[#d4af37]/30 shadow-[0_25px_50px_rgba(128,0,0,0.08)] rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 relative overflow-hidden">
          
          <div className="flex-1 flex flex-col items-center text-center relative z-10 w-full">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#f8c8dc] to-[#fffdd0] flex items-center justify-center mb-5 border border-[#d4af37]/40 shadow-sm">
               <Users className="text-[#800000]" size={24} strokeWidth={2} />
            </div>
            <p className="font-serif text-3xl md:text-4xl font-bold text-[#800000] mb-2">5,000+</p>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6a4a3c]/70">Happy Families</p>
          </div>
          
          <div className="hidden md:block w-px h-28 bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent"></div>

          <div className="flex-1 flex flex-col items-center text-center relative z-10 w-full">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#f8c8dc] to-[#fffdd0] flex items-center justify-center mb-5 border border-[#d4af37]/40 shadow-sm">
               <Heart className="text-[#800000] fill-[#800000]/20" size={24} strokeWidth={2} />
            </div>
            <p className="font-serif text-3xl md:text-4xl font-bold text-[#800000] mb-2">12,000+</p>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6a4a3c]/70">Successful Matches</p>
          </div>

          <div className="hidden md:block w-px h-28 bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent"></div>

          <div className="flex-1 flex flex-col items-center text-center relative z-10 w-full">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#f8c8dc] to-[#fffdd0] flex items-center justify-center mb-5 border border-[#d4af37]/40 shadow-sm">
               <Award className="text-[#800000]" size={24} strokeWidth={2} />
            </div>
            <p className="font-serif text-3xl md:text-4xl font-bold text-[#800000] mb-2">15+</p>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6a4a3c]/70">Years of Trust</p>
          </div>
          
          <div className="hidden md:block w-px h-28 bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent"></div>

          <div className="flex-1 flex flex-col items-center text-center relative z-10 w-full">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#f8c8dc] to-[#fffdd0] flex items-center justify-center mb-5 border border-[#d4af37]/40 shadow-sm">
               <Map className="text-[#800000]" size={24} strokeWidth={2} />
            </div>
            <p className="font-serif text-3xl md:text-4xl font-bold text-[#800000] mb-2">50+</p>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6a4a3c]/70">Global Cities</p>
          </div>

        </div>
      </section>

      {/* 3. COUNTDOWN CARD */}
      <section className="py-24 max-w-5xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-[#f8c8dc]/80 to-[#fffdd0]/90 backdrop-blur-xl border border-[#d4af37]/50 shadow-[0_20px_50px_rgba(128,0,0,0.06)] rounded-[3rem] p-12 md:p-20 text-center overflow-hidden"
        >
          {/* Corner gold borders */}
          <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-[#d4af37] opacity-60"></div>
          <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-[#d4af37] opacity-60"></div>
          <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-[#d4af37] opacity-60"></div>
          <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-[#d4af37] opacity-60"></div>

          <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] mb-10 text-[#800000]">Awaiting the Auspicious Day</h3>
          
          <div className="flex justify-center gap-6 md:gap-20 mb-10">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Secs', value: timeLeft.seconds },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-5xl md:text-8xl font-serif text-[#6a4a3c] mb-3 font-medium tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-[#800000]/70">{item.label}</span>
              </div>
            ))}
          </div>
          
          <div className="w-64 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto opacity-80"></div>
        </motion.div>
      </section>

      {/* 4. SAVE THE DATE SECTION */}
      <section className="py-20 max-w-6xl mx-auto px-4 text-center relative z-10">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-[#d4af37]">Celebrations</h3>
        <h2 className="text-5xl md:text-6xl font-serif mb-6 text-[#800000]" style={{ fontFamily: "'Playfair Display', serif" }}>Wedding Events</h2>
        <Heart size={20} className="text-[#d94f73] fill-[#d94f73]/20 mx-auto mb-16" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           {saveTheDatePhotos.map((story, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.2, duration: 0.8 }}
               className="flex flex-col items-center group cursor-pointer bg-theme-surface p-6 rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-[#d4af37]/20 hover:border-[#d4af37]/60 hover:-translate-y-4 hover:shadow-[0_25px_50px_rgba(128,0,0,0.1)] transition-all duration-500"
             >
               <div className="w-full max-w-[300px] aspect-[4/5] rounded-[2rem] overflow-hidden mb-8 relative border-4 border-[#fffdd0] ring-1 ring-[#d4af37]/30">
                 <img src={story.img} alt={story.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#800000]/80 via-transparent to-transparent opacity-60"></div>
                 
                 {/* Date Chip over image */}
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-theme-surface/95 backdrop-blur-md px-6 py-2 rounded-full shadow-lg border border-[#d4af37]/50 whitespace-nowrap">
                   <span className="text-xs font-bold uppercase tracking-wider text-[#800000]">{story.date}</span>
                 </div>
               </div>
               
               <h4 className="font-serif text-3xl text-[#6a4a3c] mb-2">{story.title}</h4>
               <p className="text-[#6a4a3c]/60 text-sm font-light">Join us for a magical evening.</p>
             </motion.div>
           ))}
        </div>
      </section>

      {/* 5. WEDDING TIMELINE SECTION */}
      <section className="py-28 relative z-10 bg-[#fdf8ed]">
        <div className="text-center mb-24">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-[#d4af37]">The Schedule</h3>
          <h2 className="text-4xl md:text-6xl font-serif text-[#800000] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Wedding Timeline</h2>
          <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 relative">
          {/* Center Timeline Gold Line */}
          <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#fdf8ed] via-[#d4af37]/60 to-[#fdf8ed] -translate-x-1/2"></div>
          
          {timelineData.map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`relative flex items-center justify-between md:justify-normal w-full mb-12 md:mb-20 group ${item.align === 'right' ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Timeline Gold Dot */}
              <div className="absolute left-[30px] md:left-1/2 top-10 md:top-1/2 w-5 h-5 rounded-full bg-[#800000] border-4 border-[#fffdd0] ring-2 ring-[#d4af37] -translate-x-1/2 md:-translate-y-1/2 z-10 shadow-lg group-hover:scale-125 transition-all duration-300"></div>
              
              <div className="w-full md:w-[45%] pl-16 md:pl-0 text-left flex flex-col justify-center">
                 <div className={`p-8 md:p-10 rounded-[2rem] bg-theme-surface shadow-[0_15px_40px_rgba(128,0,0,0.06)] border border-[#d4af37]/20 hover:border-[#d4af37]/60 hover:-translate-y-2 transition-all duration-300 relative ${item.align === 'right' ? 'md:mr-10 md:text-left' : 'md:ml-10 md:text-right'}`}>
                   
                   <div className={`mb-4 inline-block bg-[#f8c8dc]/30 border border-[#d94f73]/20 text-[#800000] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm`}>
                      {item.time}
                   </div>

                   <h3 className="font-serif text-3xl mb-3 text-[#6a4a3c]">{item.title}</h3>
                   <p className="text-[#6a4a3c]/70 leading-relaxed font-light text-sm md:text-base">{item.desc}</p>
                 </div>
              </div>
              
              <div className="hidden md:flex w-[10%] justify-center"></div>
              
              <div className={`hidden md:flex w-[45%] justify-center ${item.align === 'right' ? 'justify-end pr-16' : 'justify-start pl-16'}`}>
                <div className={`w-24 h-24 bg-gradient-to-br from-[#fffdd0] to-white shadow-xl rounded-full flex items-center justify-center border-2 border-[#d4af37]/40 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                  {item.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. PHOTO GALLERY SECTION */}
      <section className="py-28 relative z-10 px-4 md:px-8 bg-[#fffdd0]">
        <div className="max-w-7xl mx-auto bg-theme-surface/60 backdrop-blur-2xl border border-[#d4af37]/30 shadow-[0_25px_60px_rgba(128,0,0,0.05)] rounded-[3rem] p-10 md:p-16">
          
          <div className="text-center mb-16 relative z-10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-[#d4af37]">Beautiful Memories</h3>
            <h2 className="text-4xl md:text-6xl font-serif text-[#800000] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Photo Gallery</h2>
            <Camera size={24} className="text-[#d94f73] mx-auto opacity-80" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {galleryPhotos.map((img, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="relative group rounded-2xl overflow-hidden shadow-md border-2 border-[#d4af37]/20 hover:border-[#d4af37] hover:shadow-xl cursor-pointer transition-all duration-300"
              >
                <img src={img} alt="Wedding Moment" className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#800000]/70 via-[#800000]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <Heart size={20} className="text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100" />
                  <p className="text-white font-serif text-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">View Photo</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
