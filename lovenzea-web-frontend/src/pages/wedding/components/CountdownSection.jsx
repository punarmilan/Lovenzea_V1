import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CountdownSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Target date: Dec 24, 2026 17:00:00
    const targetDate = new Date('2026-12-24T17:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <section className="relative w-full py-12 px-4 flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-serif text-[#4A3728]">
          Our Big Day
        </h2>
        <div className="w-16 h-[1px] bg-wedding-gold mx-auto mt-4"></div>
      </div>

      <div className="flex gap-4 sm:gap-8 justify-center">
        {timeBlocks.map((block, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-20 sm:w-24 sm:h-28 wedding-glass-card flex items-center justify-center border-wedding-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.15)] mb-3">
              <span className="text-2xl sm:text-4xl font-serif text-wedding-maroon font-bold">
                {block.value.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-wedding-light uppercase tracking-widest font-semibold">
              {block.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CountdownSection;
