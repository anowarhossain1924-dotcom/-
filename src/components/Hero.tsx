import React, { useState, useEffect } from 'react';
import { BannerSlide } from '../types';
import { ChevronLeft, ChevronRight, Award, Users, Calendar, BookOpen, GraduationCap } from 'lucide-react';

interface HeroProps {
  banners: BannerSlide[];
  setView: (view: string) => void;
}

export default function Hero({ banners, setView }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (banners.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-gray-50 no-print">
      {/* Banner Slides Carousel */}
      <div className="relative h-[300px] sm:h-[450px] md:h-[520px] w-full bg-blue-950">
        {banners.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Dark tint overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-blue-900/60 to-transparent z-10" />
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover object-center transform scale-102 hover:scale-100 transition-transform duration-[6000ms]"
              referrerPolicy="no-referrer"
            />
            
            {/* Banner Text Overlay */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl text-white space-y-4 md:space-y-6">
                  <span className="inline-block bg-amber-500 text-blue-950 font-bold px-3 py-1 rounded text-xs sm:text-sm tracking-wide">
                    আদর্শ শিশু কানন স্কুল
                  </span>
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight font-sans drop-shadow-md">
                    {slide.title}
                  </h2>
                  <p className="text-sm sm:text-lg text-blue-100 font-medium leading-relaxed drop-shadow-sm max-w-xl">
                    {slide.subtitle}
                  </p>
                  
                  {/* Banner CTA Buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => setView('admission')}
                      className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold text-sm sm:text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 cursor-pointer"
                    >
                      <GraduationCap size={18} />
                      <span>অনলাইন ভর্তি আবেদন</span>
                    </button>
                    <button
                      onClick={() => setView('school-info')}
                      className="px-5 py-3 bg-blue-700/80 hover:bg-blue-600/95 text-white font-semibold text-sm sm:text-base rounded-lg border border-white/20 hover:border-white/50 backdrop-blur-sm transition-all duration-300 cursor-pointer"
                    >
                      আমাদের সম্পর্কে জানুন
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Manual Navigation Controls */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-sm transition-colors cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-sm transition-colors cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight size={24} />
            </button>
            
            {/* Slider Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex ? 'bg-amber-400 w-6' : 'bg-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Highlights - Stats Ribbon (Bento-style layout overlaying the fold slightly) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 z-30 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl p-5 sm:p-6 shadow-xl border border-blue-100/50">
          
          {/* Stat 1 */}
          <div className="flex items-center space-x-3 p-3 border-r border-gray-100 last:border-0 md:border-r">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-900">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-blue-950 font-sans">৩৫০+</p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">কোমলমতি শিক্ষার্থী</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center space-x-3 p-3 md:border-r border-gray-100 last:border-0">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-700">
              <Award size={24} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-blue-950 font-sans">২০+</p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">দক্ষ শিক্ষক-শিক্ষিকা</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center space-x-3 p-3 border-r border-gray-100 last:border-0 md:border-r">
            <div className="p-3 bg-green-100 rounded-xl text-green-700">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-blue-950 font-sans">২০১১</p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">প্রতিষ্ঠা সাল</p>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center space-x-3 p-3 last:border-0">
            <div className="p-3 bg-purple-100 rounded-xl text-purple-700">
              <BookOpen size={24} />
                </div>
                <div>
              <p className="text-xl sm:text-2xl font-extrabold text-blue-950 font-sans">১০০%</p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">মেধাবিকাশ ও যত্ন</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
