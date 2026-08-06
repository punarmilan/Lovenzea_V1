import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './wedding-invite.css';

import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import CountdownSection from './components/CountdownSection';
import OurStorySection from './components/OurStorySection';
import TimelineSection from './components/TimelineSection';
import WeddingEvents from './components/WeddingEvents';
import GallerySection from './components/GallerySection';
import LoveQuotes from './components/LoveQuotes';
import RSVPSection from './components/RSVPSection';
import Header from '../../components/Headers';

const WeddingInvite = () => {
  const pageRef = React.useRef(null);

  useEffect(() => {
    // Scroll to top on mount
    if (pageRef.current) {
      pageRef.current.scrollTo(0, 0);
    }
  }, []);

  return (
    <div ref={pageRef} className="wedding-page relative w-full h-screen overflow-y-auto overflow-x-hidden">
      <Header />


      <div className="relative z-10 flex flex-col items-center w-full">
        <HeroSection />
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto flex flex-col gap-12 py-16">
          <StatsSection />
          <CountdownSection />
          <OurStorySection />
          <TimelineSection />
          <WeddingEvents />
          <GallerySection />
          <LoveQuotes />
          <RSVPSection />
        </div>
      </div>
    </div>
  );
};

export default WeddingInvite;
