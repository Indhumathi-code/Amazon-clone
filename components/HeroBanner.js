'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    gradientClass: 'from-[#fceef2] via-[#fbdbe2] to-[#f8c9d4]',
    textColor: 'text-gray-900',
    title: 'Bestselling kurtas',
    boldText: 'Under ₹399',
    subTextLeft: (
      <div>
        <div className="font-bold text-gray-800 text-xs">TOP</div>
        <div className="text-gray-500 font-semibold text-[10px]">BRANDS</div>
      </div>
    ),
    subTextRight: (
      <div>
        <div className="font-bold text-gray-800 text-xs">LATEST</div>
        <div className="text-gray-500 font-semibold text-[10px]">TRENDS</div>
      </div>
    ),
    hasPromoCard: true,
    image: '/bestselling_kurtas.png',
  },
  {
    gradientClass: 'from-[#e3f2fd] via-[#cce6f8] to-[#b3d7f2]',
    textColor: 'text-gray-900',
    title: 'Appliances for your home',
    boldText: 'Up to 55% off',
    subTextLeft: (
      <div>
        <div className="font-bold text-gray-800 text-xs">SMART</div>
        <div className="text-gray-500 font-semibold text-[10px]">TECH</div>
      </div>
    ),
    subTextRight: (
      <div>
        <div className="font-bold text-gray-800 text-xs">BEST</div>
        <div className="text-gray-500 font-semibold text-[10px]">DEALS</div>
      </div>
    ),
    hasPromoCard: false,
    image: '/home_appliances.png',
  },
  {
    gradientClass: 'from-[#e8f5e9] via-[#d4eed6] to-[#bce2c0]',
    textColor: 'text-gray-955',
    title: 'Latest smartphones',
    boldText: 'Starting ₹9,999',
    subTextLeft: (
      <div>
        <div className="font-bold text-gray-800 text-xs">5G</div>
        <div className="text-gray-500 font-semibold text-[10px]">PHONES</div>
      </div>
    ),
    subTextRight: (
      <div>
        <div className="font-bold text-gray-800 text-xs">EXCHANGE</div>
        <div className="text-gray-500 font-semibold text-[10px]">OFFERS</div>
      </div>
    ),
    hasPromoCard: false,
    image: '/mobiles_banner.png',
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (!isHovered) {
      startTimer();
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [isHovered]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-[250px] md:h-[350px] lg:h-[400px] w-full overflow-hidden select-none bg-gray-150"
    >
      {/* Slides Container */}
      <div className="w-full h-full relative">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              className={`absolute inset-0 bg-gradient-to-r ${slide.gradientClass} transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
                }`}
            >
              {/* Centered Content Container aligned with Navbar max-width */}
              <div className="max-w-[1500px] mx-auto px-12 md:px-16 flex items-start justify-between h-full relative py-6 md:py-10">

                {/* Left Content Area */}
                <div
                  className={`z-20 mt-2 flex flex-col max-w-[55%] md:max-w-[50%] transition-all duration-700 delay-100 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                >
                  <h2 className={`text-sm md:text-xl font-light ${slide.textColor} tracking-wide`}>
                    {slide.title}
                  </h2>

                  <h1 className="text-xl md:text-4xl lg:text-5xl font-extrabold text-black leading-tight mt-1 tracking-tight">
                    {slide.boldText}
                  </h1>

                  {/* Subtaglines */}
                  <div className="flex items-center gap-4 mt-3 md:mt-5 text-[10px] md:text-xs tracking-wider">
                    {slide.subTextLeft}
                    <div className="w-px h-6 bg-gray-400" />
                    {slide.subTextRight}
                  </div>

                  {/* Promo Card Detail */}
                  {slide.hasPromoCard && (
                    <div className="mt-4 md:mt-6 hidden sm:block">
                      <div className="flex items-center bg-white/95 border border-gray-200/80 rounded-xl p-2 md:p-3 w-fit shadow-xs gap-3">
                        <div className="bg-[#232f3e] text-white rounded-lg px-2.5 py-1 text-[9px] font-bold tracking-tighter uppercase shrink-0">
                          amazon<span className="text-[#FF9900]">pay</span>
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-800 leading-tight">
                          <div className="font-bold text-gray-900">Unlimited 5%* cashback</div>
                          <div className="text-gray-500 font-medium">with Amazon Pay ICICI card</div>
                        </div>
                      </div>
                      <div className="text-[9px] text-gray-450 mt-1 pl-1">*T&C apply</div>
                    </div>
                  )}
                </div>

                {/* Right Image Area */}
                <div
                  className={`absolute right-12 md:right-16 top-6 bottom-16 w-[40%] md:w-[45%] flex items-center justify-center z-10 transition-all duration-700 delay-200 ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-sm"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls - Simple chevrons on absolute borders with no background circle */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-[45%] -translate-y-1/2 text-gray-650 hover:text-black hover:scale-105 z-30 transition-all cursor-pointer focus:outline-none bg-transparent"
        aria-label="Previous slide"
      >
        <ChevronLeft size={44} strokeWidth={1} />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-3 top-[45%] -translate-y-1/2 text-gray-650 hover:text-black hover:scale-105 z-30 transition-all cursor-pointer focus:outline-none bg-transparent"
        aria-label="Next slide"
      >
        <ChevronRight size={44} strokeWidth={1} />
      </button>

      {/* Bottom Gradient Fade Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-[100px] md:h-[180px] bg-gradient-to-t from-[#EAEDED] via-[#EAEDED]/85 to-transparent z-20 pointer-events-none" />
    </div>
  );
}