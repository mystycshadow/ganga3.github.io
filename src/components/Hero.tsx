/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { ArrowRight, MapPin, Sparkles, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeroProps {
  onExploreArtists: () => void;
  onBookNow: () => void;
}

const backgroundImages = [
  "/images/hero/1.png",
  "/images/hero/2.png",
  "/images/hero/3.png",
];

export default function Hero({ onExploreArtists, onBookNow }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="hero-section"
      className="relative min-h-[90vh] flex items-center justify-center bg-black overflow-hidden py-12"
    >
      {/* Cinematic dark textured gradient background overlay */}
      <div className="absolute inset-0 bg-radial-at-c from-neutral-900/30 via-black to-black z-10" />

      {/* Decorative luxury abstract shapes replicating upscale studio lines */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-[#C5A059]/5 blur-[120px] mix-blend-screen animate-pulse" />
      <div className="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] rounded-full bg-[#D4AF37]/3 blur-[140px] mix-blend-screen" />

      {/* High-quality backdrop banner slideshow */}
      {backgroundImages.map((img, index) => (
        <div
          key={img}
          className="absolute inset-0 z-0 bg-cover bg-center select-none scale-105 pointer-events-none brightness-150 transition-opacity ease-in-out"
          style={{
            backgroundImage: `url('${img}')`,
            opacity: index === currentIndex ? 0.7 : 0,
            transitionDuration: "2500ms",
            zIndex: index === currentIndex ? 1 : 0,
          }}
        />
      ))}

      <div className="relative max-w-5xl mx-auto px-6 text-center z-20 space-y-8 md:space-y-10">
        {/* Prestige badge noting migration */}
        <motion.div
          id="hero-badge"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="hidden"
        >
        </motion.div>

        {/* Title Group with cinematic staggered entrances */}
        <div className="space-y-4">
          <motion.h2
            id="hero-subheading"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[10px] md:text-xs font-mono text-white/50 tracking-[0.35em] uppercase font-bold"
          >
            A New Era Of Fine Art
          </motion.h2>

          <motion.h1
            id="hero-main-title"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-[85px] leading-[0.9] font-black tracking-tighter uppercase text-[#F5F5F5]"
          >
            GANGA <br />
            <span className="text-[#C5A059] tracking-tighter select-none font-serif">
              TATTOO
            </span>
          </motion.h1>
        </div>

        {/* Slideshow Dots */}
        <div className="flex gap-2 justify-center">
            {backgroundImages.map((_, index) => (
              <div key={index} className={`w-1.5 h-1.5 rounded-full ${index === currentIndex ? 'bg-[#C5A059]' : 'bg-white/30'}`} />
            ))}
        </div>

        {/* Call to actions */}
        <motion.div
          id="hero-cta-buttons"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-0"
        >
          <button
            id="hero-book-session-btn"
            onClick={onBookNow}
            className="w-full sm:w-auto bg-[#C5A059] text-black px-8 py-3.5 text-[11px] font-black uppercase tracking-widest hover:bg-white mt-0 transition-all duration-300 rounded-none shadow-[5px_5px_15px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            Book Appointment
          </button>
        </motion.div>
      </div>
    </div>
  );
}
