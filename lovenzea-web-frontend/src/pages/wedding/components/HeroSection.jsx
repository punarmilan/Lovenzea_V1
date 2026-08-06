import React from 'react';
import { motion } from 'framer-motion';

import heroNewBlur from '../../../assets/image/hero_new_blur.png';
import flowerBouquet from '../../../assets/image/flower_bouquet.png';
import couples1 from '../../../assets/image/couples1.jpg';
import couples from '../../../assets/image/couples.jpg';
import couples2 from '../../../assets/image/couples2.jpg';

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden px-4 sm:px-6 lg:px-8 bg-wedding-cream">
      <div className="absolute inset-0 pointer-events-none z-0">
        <img 
          src={heroNewBlur} 
          alt="Hero Background" 
          className="w-full h-full object-cover opacity-60 mix-blend-multiply animate-slow-pan" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-wedding-cream/50 to-wedding-cream"></div>
      </div>

      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Subtle glow */}
        <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-rose-200 rounded-full blur-[120px] transform -translate-x-1/4 -translate-y-1/4 opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-amber-200 rounded-full blur-[150px] transform translate-x-1/4 translate-y-1/4 opacity-20"></div>
        
        {/* Floral Corners */}
        <img 
          src={flowerBouquet} 
          alt="Floral Top Left"
          className="absolute top-0 left-0 w-48 sm:w-64 opacity-80 transform -scale-y-100 scale-x-100 origin-top-left -translate-y-1/4 -translate-x-1/4"
        />
        <img 
          src={flowerBouquet} 
          alt="Floral Top Right"
          className="absolute top-0 right-0 w-48 sm:w-64 opacity-80 transform -scale-y-100 -scale-x-100 origin-top-right -translate-y-1/4 translate-x-1/4"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        {/* STRICT 2-COLUMN GRID LAYOUT (Never stacks) */}
        <div className="grid grid-cols-2 gap-4 items-center w-full">

          {/* Left Side: Text */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="flex flex-col items-start text-left w-full pr-4"
          >
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="mb-4"
            >
              <svg className="w-8 h-8 text-wedding-gold" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
              </svg>
            </motion.div>

            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-wedding-gold tracking-[0.3em] text-xs sm:text-sm uppercase font-semibold mb-4"
            >
              Together With Their Families
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-editorial text-[#4A3728] mb-4 leading-tight whitespace-nowrap drop-shadow-sm"
            >
              Aarav <span className="text-wedding-gold font-royal italic mx-2">&</span> Ananya
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex items-center gap-4 mb-6 text-wedding-gold"
            >
              <div className="h-[1px] w-12 bg-wedding-gold/50"></div>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <div className="h-[1px] w-12 bg-wedding-gold/50"></div>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-wedding-light max-w-md text-sm sm:text-base leading-relaxed mb-8"
            >
              Invite you to share in the joy of their new beginning as they tie the knot in a celebration of love, culture, and tradition.
            </motion.p>

            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="wedding-btn-maroon px-8 py-3 rounded-full text-xs font-semibold tracking-widest flex items-center gap-2 mb-8 uppercase text-white shadow-lg shadow-rose-900/20"
            >
              RSVP NOW
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </motion.button>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-row gap-4"
            >
              <div className="flex items-center gap-2 bg-theme-surface/70 px-4 py-2 rounded-full shadow-sm border border-wedding-gold/20">
                <span className="text-wedding-gold">📅</span>
                <span className="text-[10px] sm:text-xs font-semibold text-[#4A3728] uppercase">12 Dec 2026</span>
              </div>
              
              <div className="flex items-center gap-2 bg-theme-surface/70 px-4 py-2 rounded-full shadow-sm border border-wedding-gold/20">
                <span className="text-wedding-gold">📍</span>
                <span className="text-[10px] sm:text-xs font-semibold text-[#4A3728] uppercase">Jaipur, India</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Image Arch */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex justify-end relative h-[550px] sm:h-[650px] w-full items-center"
          >
            {/* Main Center Arch Image */}
            <div className="relative w-[75%] h-[80%] rounded-t-[300px] overflow-hidden border-[10px] border-white/80 shadow-[0_30px_60px_rgba(90,27,41,0.15)] z-20 backdrop-blur-sm bg-theme-surface/30">
              <img
                src={couples1}
                alt="Couple"
                className="w-full h-full object-cover animate-slow-pan"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Left Floating Arch Image */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute left-[-5%] top-1/4 w-[45%] h-[55%] rounded-t-[200px] rounded-b-[20px] overflow-hidden border-[6px] border-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-10"
            >
              <img
                src={couples}
                alt="Left Image"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Right Floating Arch Image */}
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
              className="absolute right-[-5%] bottom-12 w-[40%] h-[50%] rounded-[30px] overflow-hidden border-[6px] border-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-30"
            >
              <img
                src={couples2}
                alt="Right Image"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
