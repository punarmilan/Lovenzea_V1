import React from 'react';
import bannerBg from '../../../assets/image/banner-bg.png';
import InterestRequestCard from '../../../components/InterestRequestCard';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

function InterestsPage() {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-5xl mx-auto pb-8 px-0 sm:px-4"
        >
            {/* Header Area */}
            <div className="bg-white/80 backdrop-blur-md border border-white rounded-[28px] p-6 md:px-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 relative overflow-hidden mt-3 h-[140px] flex flex-col justify-center" style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
              {/* Blurred Background Overlay */}
              <div className="absolute inset-0 z-0 pointer-events-none"></div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#F8D6CB]/50 rounded-full blur-[60px] opacity-60 pointer-events-none"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#E88C8C]/30 rounded-full blur-[60px] opacity-60 pointer-events-none"></div>
                
                <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#B54768] to-[#E88C8C] mb-2 flex items-center gap-3 drop-shadow-sm tracking-tight relative z-10">
                    My Interests
                    <motion.div 
                        animate={{ rotate: [0, 15, -15, 0] }} 
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    >
                        <Sparkles className="text-[#B54768] w-6 h-6" />
                    </motion.div>
                </h1>
                <p className="text-sm text-gray-600 font-medium max-w-2xl leading-relaxed relative z-10">
                    View and manage all your pending, accepted, and declined connection requests in one beautifully organized place.
                </p>
            </div>

            {/* Main Component */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative z-10"
            >
                <InterestRequestCard />
            </motion.div>
        </motion.div>
    );
}

export default InterestsPage;
