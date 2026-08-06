import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import img from '../../assets/image/couples.jpg';
import img1 from '../../assets/image/couples1.jpg';
import img2 from '../../assets/image/couples2.jpg';

function TestimonialCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    const testimonials = [
        {
            id: 1,
            name: "Prithviraj & Poulomi",
            story: "We were complete strangers until LovenZea.com brought us together. What started as an arranged match turned out to be the most beautiful love story of our lives. Today, we're not just partners but best friends who support each other through everything.",
            image: img
        },
        {
            id: 2,
            name: "Rahul & Priya",
            story: "Finding the right match seemed impossible until we found each other on LovenZea.com. Our families are now connected and we couldn't be happier with our journey together. Every moment spent together feels like a blessing.",
            image: img1
        },
        {
            id: 3,
            name: "Arjun & Meera",
            story: "Thanks to LovenZea Premium, we discovered compatibility beyond our expectations. What began as profiles on a screen has blossomed into a lifetime partnership filled with love, laughter, and endless memories.",
            image: img2
        }
    ];

    // Auto-play functionality
    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, [testimonials.length]);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        setIsAutoPlaying(false); // Stop auto-play when user manually navigates
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false); // Stop auto-play when user manually selects a slide
    };

    const handleNextSlide = () => {
        nextSlide();
        setIsAutoPlaying(false); // Stop auto-play when user manually navigates
    };

    // Auto-play effect
    useEffect(() => {
        if (!isAutoPlaying || isPaused) return;

        const intervalId = setInterval(() => {
            nextSlide();
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(intervalId);
    }, [isAutoPlaying, isPaused, nextSlide]);

    // Pause on hover
    const handleMouseEnter = () => {
        setIsPaused(true);
    };

    const handleMouseLeave = () => {
        setIsPaused(false);
    };

    return (
        <div className="bg-transparent py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-700 text-center mb-6 sm:mb-8 md:mb-12 px-2 sm:px-4 leading-tight">
                    With <span className="text-gray-900">LovenZea Premium</span> they found their perfect match and so can you
                </h2>

                {/* Carousel Container */}
                <div
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Main Card */}
                    <div className="dashboard-card-bg border border-white/50 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden transition-all duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Image Section */}
                            <div className="relative h-48 sm:h-56 md:h-80 lg:h-96 bg-gray-200 overflow-hidden">
                                <img
                                    src={testimonials[currentSlide].image}
                                    alt={testimonials[currentSlide].name}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                                    key={currentSlide} // Force re-render for smooth transition
                                />
                                {/* Purple dot indicator */}
                                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-purple-500 rounded-full shadow-lg animate-pulse"></div>

                                {/* Image overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>

                            {/* Content Section */}
                            <div className="relative p-5 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center min-h-[280px] sm:min-h-[320px] md:min-h-0">
                                {/* Quote Icon */}
                                <div className="text-teal-300 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif leading-none mb-3 sm:mb-4 opacity-80">
                                    "
                                </div>

                                {/* Names */}
                                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 transition-all duration-500">
                                    {testimonials[currentSlide].name}
                                </h3>

                                {/* Story */}
                                <p className="text-theme-text-secondary text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-5 md:mb-6 line-clamp-4 sm:line-clamp-5 md:line-clamp-none transition-all duration-500">
                                    {testimonials[currentSlide].story}
                                </p>

                                {/* Read More Link */}
                                <a
                                    href="#"
                                    className="text-teal-500 font-semibold hover:text-teal-600 transition-colors text-sm sm:text-base inline-flex items-center group"
                                >
                                    Read more
                                    <svg
                                        className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>

                                {/* Decorative Wave */}
                                <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 pointer-events-none opacity-50">
                                    <svg
                                        viewBox="0 0 1200 120"
                                        preserveAspectRatio="none"
                                        className="w-full h-full"
                                    >
                                        <path
                                            d="M0,60 C300,90 900,30 1200,60 L1200,120 L0,120 Z"
                                            fill="#D1F4E8"
                                            opacity="0.5"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 sm:left-0 md:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 bg-theme-surface hover:bg-gray-50 rounded-full p-2 sm:p-2.5 md:p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-theme-text-secondary" />
                    </button>

                    <button
                        onClick={handleNextSlide}
                        className="absolute right-2 sm:right-0 md:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 bg-theme-surface hover:bg-gray-50 rounded-full p-2 sm:p-2.5 md:p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-theme-text-secondary" />
                    </button>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center items-center gap-2 sm:gap-3 mt-6 sm:mt-8">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${currentSlide === index
                                ? 'w-6 sm:w-8 h-2.5 sm:h-3 bg-teal-500 shadow-md'
                                : 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                            aria-current={currentSlide === index ? 'true' : 'false'}
                        />
                    ))}
                </div>

                {/* Auto-play indicator (optional) */}
                <div className="flex justify-center mt-4 sm:mt-6">
                    <button
                        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                        className="text-xs sm:text-sm text-theme-text-secondary hover:text-gray-700 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-200"
                    >
                    </button>
                </div>
            </div>

            {/* CSS for line-clamp (add to your global CSS if needed) */}
            <style>{`
                .line-clamp-4 {
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-5 {
                    display: -webkit-box;
                    -webkit-line-clamp: 5;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}

export default TestimonialCarousel;
