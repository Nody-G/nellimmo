'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setScrollProgress(progress);
      setIsVisible(scrollTop > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Retour en haut de page"
      className="fixed bottom-6 right-6 z-40 p-3 bg-white/95 hover:bg-white text-gray-800 hover:text-[#E12B7B] rounded-full shadow-lg border border-[#F3E8EE] backdrop-blur-md transition-all duration-300 hover:scale-110 group cursor-pointer"
    >
      {/* Circular Progress Ring */}
      <svg className="w-9 h-9 -rotate-90 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <circle
          cx="18"
          cy="18"
          r="16"
          className="stroke-gray-100"
          strokeWidth="2.5"
          fill="transparent"
        />
        <circle
          cx="18"
          cy="18"
          r="16"
          className="stroke-[#E12B7B] transition-all duration-150"
          strokeWidth="2.5"
          strokeDasharray={100}
          strokeDashoffset={100 - scrollProgress}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
}
