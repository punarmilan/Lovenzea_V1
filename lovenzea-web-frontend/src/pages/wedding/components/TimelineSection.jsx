import React from 'react';
import { motion } from 'framer-motion';

const TimelineSection = () => {
  const events = [
    { title: 'The First Meeting', date: 'June 15, 2024', desc: 'A coffee date that turned into a lifetime conversation.' },
    { title: 'The Proposal', date: 'February 14, 2025', desc: 'A beautiful surprise under the stars in Jaipur.' },
    { title: 'The Engagement', date: 'August 10, 2025', desc: 'Celebrating our love with our closest family and friends.' },
    { title: 'The Wedding Day', date: 'December 24, 2026', desc: 'The day two souls become one.' }
  ];

  return (
    <section className="relative w-full py-16 px-4">
      <div className="text-center mb-16">
        <span className="text-wedding-gold tracking-[0.4em] text-xs sm:text-sm uppercase font-semibold block mb-4">
          The Journey
        </span>
        <h2 className="text-5xl sm:text-6xl font-editorial text-[#4A3728]">
          Wedding Journey
        </h2>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="timeline-line hidden md:block"></div>
        
        <div className="space-y-12">
          {events.map((event, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className={`relative flex flex-col md:flex-row items-center justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="hidden md:block w-[45%]"></div>
              
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-wedding-gold border-4 border-[#FFFDF7] z-10 shadow-md"></div>
              
              <div className="w-full md:w-[45%] pl-8 md:pl-0">
                <div className="wedding-glass-card p-6 text-left hover:border-wedding-gold/50 transition-colors duration-300 group">
                  <h3 className="text-2xl font-editorial text-wedding-maroon font-bold mb-1">{event.title}</h3>
                  <p className="text-xs text-wedding-gold font-bold uppercase tracking-wider mb-3">{event.date}</p>
                  <p className="text-sm text-[#4A3728] leading-relaxed group-hover:text-black transition-colors">{event.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
