import React from 'react';
import { motion } from 'framer-motion';

import ceremony4 from '../../../assets/image/marriage-ceremony4.png';
import ceremony8 from '../../../assets/image/marriage-ceremony8.avif';
import ceremony9 from '../../../assets/image/marriage-ceremony9.avif';
import ceremony10 from '../../../assets/image/marriage-ceremony10.jpg';

const galleryImages = [
  { src: ceremony4, style: "col-span-2 row-span-2 aspect-[4/5]", objectPos: "object-top" },
  { src: ceremony8, style: "col-span-1 row-span-1 aspect-square", objectPos: "object-center" },
  { src: ceremony9, style: "col-span-1 row-span-1 aspect-square mt-8", objectPos: "object-center" },
  { src: ceremony10, style: "col-span-2 row-span-1 aspect-[2/1]", objectPos: "object-[center_20%]" },
];

const GallerySection = () => {
  return (
    <section className="relative w-full py-24 px-4 bg-wedding-cream-dark">
      <div className="text-center mb-16">
        <h2 className="text-5xl sm:text-6xl font-editorial text-wedding-gold-dark mb-6">
          A Glimpse of Us
        </h2>
        <div className="flex justify-center">
          <svg className="w-5 h-5 fill-current text-wedding-gold" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      </div>

      {/* Masonry-style Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 px-4">
        {galleryImages.map((img, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15, duration: 0.8 }}
            className={`relative rounded-[30px] overflow-hidden group shadow-2xl ${img.style}`}
          >
            <img 
              src={img.src} 
              alt={`Gallery ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${img.objectPos}`}
            />
            <div className="absolute inset-0 bg-wedding-maroon/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-3 border border-white/30 rounded-[20px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center">
        <button className="wedding-btn-gold px-10 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-3">
          VIEW FULL GALLERY
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default GallerySection;
