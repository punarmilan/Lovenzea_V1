import React from 'react';
import { motion } from 'framer-motion';
import flowerBouquet from '../../../assets/image/flower_bouquet.png';

const RSVPSection = () => {
  return (
    <section className="relative w-full py-16 px-4 flex justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="wedding-glass-card w-full max-w-4xl p-8 sm:p-12 relative overflow-hidden text-center"
      >
        {/* Background floral left & right */}
        <div className="absolute top-0 left-0 w-32 sm:w-48 h-full opacity-30 pointer-events-none" style={{ backgroundImage: `url(${flowerBouquet})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'left center' }}></div>
        <div className="absolute top-0 right-0 w-32 sm:w-48 h-full opacity-30 pointer-events-none transform scale-x-[-1]" style={{ backgroundImage: `url(${flowerBouquet})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'left center' }}></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-wedding-cream flex items-center justify-center text-wedding-gold mb-6 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-wedding-maroon mb-2">
            Kindly RSVP
          </h2>
          
          <p className="text-wedding-light text-sm sm:text-base mb-8">
            Your presence will make our day even more special.
          </p>
          
          <button className="wedding-btn-maroon px-8 py-3 rounded-full text-xs font-semibold tracking-widest uppercase flex items-center gap-2">
            RSVP NOW
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default RSVPSection;
