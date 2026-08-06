import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AiOutlineHeart, AiOutlineCheckCircle, AiOutlineStar } from 'react-icons/ai';
import { MdShield, MdPeople } from 'react-icons/md';
import { GiSparkles } from 'react-icons/gi';

const EnhancedHeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      setMousePosition({ x: x * 30, y: y * 30 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const floatingVariants2 = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const floatingVariants3 = {
    animate: {
      y: [0, -25, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Trust metrics data
  const trustMetrics = [
    { icon: AiOutlineHeart, label: '50,000+ Happy Matches', value: '50K+' },
    { icon: AiOutlineCheckCircle, label: '100% Verified Profiles', value: '100%' },
    { icon: AiOutlineStar, label: '4.9 Rating', value: '4.9⭐' },
  ];

  // Mini cards data
  const miniCards = [
    { icon: AiOutlineHeart, label: '98% Match', delay: 0 },
    { icon: MdPeople, label: 'Premium Members', delay: 0.2 },
    { icon: GiSparkles, label: 'AI Matchmaking', delay: 0.4 },
    { icon: MdShield, label: 'Verified Profiles', delay: 0.6 },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-[#FFFDF8]"
    >
      {/* Background with overlay and decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/35" />
        </div>

        {/* Animated decorative circles */}
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1), transparent)',
            filter: 'blur(60px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute bottom-32 left-20 w-72 h-72 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(232, 180, 160, 0.12), transparent)',
            filter: 'blur(50px)',
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        {/* Floating sparkles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-theme-surface/60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content container */}
      <div className="relative z-10 h-screen flex items-center justify-center px-4 md:px-8 lg:px-12">
        <motion.div
          className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content Section */}
          <motion.div className="space-y-8 lg:space-y-10 text-center lg:text-left">
            {/* Premium Badge */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center lg:justify-start"
            >
              <motion.div
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 12px 48px rgba(212, 175, 55, 0.15)',
                }}
                transition={{ duration: 0.3 }}
              >
                <GiSparkles className="w-4 h-4 text-white" />
                <span className="text-white/90 font-medium text-sm">
                  India's Trusted Matrimonial Platform
                </span>
              </motion.div>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight">
                Find Your Perfect{' '}
                <motion.span
                  className="bg-gradient-to-r from-[#D4AF37] via-[#E8B4A0] to-[#D4AF37] bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% center', '100% center', '0% center'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                >
                  Life Partner
                </motion.span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-white/80 leading-relaxed max-w-md mx-auto lg:mx-0"
            >
              Join thousands of successful matches and begin your journey towards a meaningful
              relationship through verified profiles, intelligent matchmaking, and genuine
              connections.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
            >
              {/* Primary CTA */}
              <motion.button
                className="group relative px-8 py-4 rounded-full font-semibold text-lg overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #E8B4A0 100%)',
                  boxShadow: '0 20px 40px rgba(212, 175, 55, 0.3)',
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 30px 60px rgba(212, 175, 55, 0.4)',
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <span className="relative z-10 text-white font-semibold">
                  Find Matches
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] via-[#E8B4A0] to-[#D4AF37]"
                  animate={{ backgroundPosition: ['0% center', '100% center', '0% center'] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    backgroundSize: '200% 200%',
                    opacity: 0.2,
                  }}
                />
              </motion.button>

              {/* Secondary CTA */}
              <motion.button
                className="px-8 py-4 rounded-full font-semibold text-lg text-white border-2 border-white/30 hover:border-white/50 transition-colors"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 12px 48px rgba(255, 255, 255, 0.15)',
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                Create Profile
              </motion.button>
            </motion.div>

            {/* Trust Metrics */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8"
            >
              {trustMetrics.map((metric, idx) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={idx}
                    className="p-4 rounded-2xl text-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                    whileHover={{
                      y: -8,
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="w-5 h-5 text-[#D4AF37] mx-auto mb-2" />
                    <p className="text-white/90 font-medium text-sm">{metric.label}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Showcase Section */}
          <motion.div
            className="relative h-full flex items-center justify-center"
            variants={itemVariants}
          >
            {/* Main Profile Card */}
            <motion.div
              className="relative"
              style={{
                transform: `translateX(${mousePosition.x * 0.3}px) translateY(${mousePosition.y * 0.3}px)`,
              }}
              variants={floatingVariants}
              animate="animate"
            >
              <motion.div
                className="relative w-80 h-96 rounded-[32px] overflow-hidden group"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: '0 30px 60px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 40px 80px rgba(212, 175, 55, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Profile Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-[#E8B4A0]/10" />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Profile Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-2xl font-serif font-bold">Priya Sharma</h3>
                      <p className="text-sm text-white/80">Software Engineer, Mumbai</p>
                    </div>
                    <motion.div
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-theme-surface/20 backdrop-blur-md border border-white/30"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs text-white">Online</span>
                    </motion.div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span>Age: 28</span>
                    <span className="text-[#D4AF37] font-semibold">98% Match</span>
                  </div>
                </div>

                {/* Premium Badge */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.div
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{
                      background: 'rgba(255, 215, 0, 0.3)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(212, 175, 55, 0.5)',
                    }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
                  >
                    ✨ Verified
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Mini Cards */}
            {miniCards.map((card, idx) => {
              const Icon = card.icon;
              const variants = [floatingVariants, floatingVariants2, floatingVariants3];
              const variantIndex = idx % 3;
              const animationVariant = variants[variantIndex];

              const positions = [
                { top: '-20px', right: '30px' },
                { bottom: '40px', right: '-30px' },
                { bottom: '-10px', left: '20px' },
                { top: '60px', left: '-40px' },
              ];

              return (
                <motion.div
                  key={idx}
                  className="absolute w-40 p-4 rounded-2xl text-center"
                  style={{
                    ...positions[idx],
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                  }}
                  variants={animationVariant}
                  animate="animate"
                  transition={{
                    ...animationVariant.animate.transition,
                    delay: card.delay,
                  }}
                  whileHover={{
                    scale: 1.08,
                    boxShadow: '0 16px 48px rgba(212, 175, 55, 0.2)',
                  }}
                >
                  <Icon className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
                  <p className="text-white/90 font-semibold text-sm">{card.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-white/60 text-sm">Scroll to explore</div>
      </motion.div>
    </div>
  );
};

export default EnhancedHeroSection;
