import React from 'react';
import { motion } from 'framer-motion';

import ceremony2 from '../../../assets/image/marriage-ceremony2.jpg';
import ceremony5 from '../../../assets/image/marriage-ceremony5.jpg';
import ceremony7 from '../../../assets/image/marriage-ceremony7.webp';

const events = [
  {
    id: 'haldi',
    title: 'The Haldi',
    desc: 'A splash of yellow, love, and laughter to start the celebrations.',
    image: ceremony2,
    time: '10:00 AM'
  },
  {
    id: 'sangeet',
    title: 'The Sangeet',
    desc: 'An evening of music, dance, and unforgettable performances.',
    image: ceremony5,
    time: '07:30 PM'
  },
  {
    id: 'wedding',
    title: 'The Wedding',
    desc: 'The sacred vows and the beginning of forever.',
    image: ceremony7,
    time: '06:00 PM'
  }
];

const WeddingEvents = () => {
  return (
    <section className="relative w-full py-24 px-4 bg-wedding-cream">
      <div className="text-center mb-16">
        <span className="text-wedding-gold tracking-[0.4em] text-xs sm:text-sm uppercase font-semibold block mb-4">
          Celebrations
        </span>
        <h2 className="text-5xl sm:text-6xl font-editorial text-wedding-maroon">
          Wedding Events
        </h2>
        <div className="flex items-center justify-center gap-4 mt-6 text-wedding-gold">
          <div className="w-12 h-[1px] bg-wedding-gold/50"></div>
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <div className="w-12 h-[1px] bg-wedding-gold/50"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 z-10 relative">
          {events.map((event, index) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="group relative rounded-t-full rounded-b-3xl overflow-hidden shadow-2xl h-[450px] cursor-pointer"
            >
              {/* Background Image */}
              <img 
                src={event.image} 
                alt={event.title} 
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#3a111a]/90 via-[#3a111a]/40 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>
              
              {/* Border */}
              <div className="absolute inset-3 border border-white/20 rounded-t-full rounded-b-[20px] pointer-events-none z-20"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-center text-white z-30 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-wedding-gold font-bold tracking-widest uppercase text-xs mb-2 block opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{event.time}</span>
                <h3 className="text-4xl font-editorial mb-3 text-white">
                  {event.title}
                </h3>
                <p className="text-sm text-white/80 font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  {event.desc}
                </p>
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
                  <span className="inline-block border-b border-wedding-gold text-wedding-gold text-[10px] uppercase tracking-widest pb-1">View Details</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeddingEvents;
