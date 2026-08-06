import React from 'react';
import { motion } from 'framer-motion';

const LoveQuotes = () => {
  return (
    <section className="relative w-full py-20 px-4 overflow-hidden flex justify-center text-center">
      <div className="absolute inset-0 pointer-events-none opacity-10 flex justify-center items-center">
        <svg viewBox="0 0 200 200" className="w-full max-w-[800px] h-[800px] text-wedding-gold" fill="currentColor">
          <path d="M100 180c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80zm0-150c-38.6 0-70 31.4-70 70s31.4 70 70 70 70-31.4 70-70-31.4-70-70-70z"/>
        </svg>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-3xl relative z-10"
      >
        <div className="text-6xl sm:text-8xl font-serif text-wedding-gold opacity-40 leading-none h-10">"</div>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#4A3728] leading-relaxed italic mt-4 mb-8">
          Whatever our souls are made of, his and mine are the same.
        </h3>
        <p className="text-wedding-gold uppercase tracking-[0.3em] font-semibold text-xs sm:text-sm">
          — Emily Brontë
        </p>
      </motion.div>
    </section>
  );
};

export default LoveQuotes;
