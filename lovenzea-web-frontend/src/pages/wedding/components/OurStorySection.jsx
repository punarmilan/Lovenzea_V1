import React from 'react';
import { motion } from 'framer-motion';
import heroBg2 from '../../../assets/image/hero_bg2.png';
import flowerBouquet from '../../../assets/image/flower_bouquet.png';

const OurStorySection = () => {
  return (
    <section className="relative w-full py-24 px-4 overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24 max-w-7xl mx-auto">
        
        {/* Left: Text */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col items-start text-left w-full md:w-1/2 relative z-10"
        >
          <span className="text-wedding-gold tracking-[0.3em] text-xs sm:text-sm uppercase font-semibold">
            Our Story
          </span>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-editorial text-[#4A3728] leading-[1.1] mt-4 mb-6">
            Two souls, <br/><span className="text-wedding-gold italic">one journey</span>
          </h2>
          <div className="flex items-center justify-start gap-4 text-wedding-gold w-full mb-6">
            <div className="w-16 h-[1px] bg-wedding-gold/50"></div>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <div className="w-16 h-[1px] bg-wedding-gold/50"></div>
          </div>
          
          <p className="text-wedding-light max-w-md text-sm sm:text-base leading-relaxed mb-10 font-medium">
            From a chance meeting to a lifetime of memories, our journey has been nothing short of magical. We can't wait to celebrate this new chapter with you, our favorite people. Every moment spent together has been a beautiful stroke on the canvas of our lives.
          </p>
          
          <button className="wedding-btn-maroon px-8 py-3 rounded-full font-semibold text-xs tracking-widest uppercase shadow-[0_10px_20px_rgba(90,27,41,0.2)]">
            Read Our Story
          </button>
        </motion.div>

        {/* Right: Image Editorial Style */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative w-full md:w-1/2 flex justify-center md:justify-end"
        >
          <div className="relative w-full max-w-[450px]">
            {/* Elegant Background Shape */}
            <div className="absolute -top-10 -right-10 w-full h-full border-[1px] border-wedding-gold/40 rounded-t-full rounded-b-full transform rotate-3"></div>
            
            {/* Image Container */}
            <div className="relative w-full aspect-[4/5] rounded-t-full rounded-b-full overflow-hidden shadow-2xl z-10 border-[6px] border-white">
              <img 
                src={heroBg2} 
                alt="Couple" 
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wedding-maroon/20 to-transparent mix-blend-multiply"></div>
            </div>
            
            {/* Floral decoration from assets */}
            <motion.div 
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute -bottom-16 -left-16 w-56 h-56 pointer-events-none z-20"
            >
              <img 
                src={flowerBouquet} 
                alt="Floral Decor" 
                className="w-full h-full object-contain opacity-90 drop-shadow-xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OurStorySection;
