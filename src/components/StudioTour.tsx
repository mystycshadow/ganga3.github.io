/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldAlert, Sparkles, Building, ArrowUpRight, Film, MapPin, Calendar, Heart } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { getStudioVideos, StudioVideo, getStudioLayoutConfig, StudioLayoutConfig } from "../utils/db";

interface StudioTourProps {
  onSelectImage: (imageUrl: string, title: string, description?: string) => void;
  onBookClick?: () => void;
  onExploreArtists?: () => void;
}

export default function StudioTour({ onSelectImage, onBookClick, onExploreArtists }: StudioTourProps) {
  const [videos, setVideos] = useState<StudioVideo[]>([]);
  const [config, setConfig] = useState<StudioLayoutConfig | null>(null);

  useEffect(() => {
    setVideos(getStudioVideos());
    setConfig(getStudioLayoutConfig());
  }, []);

  const handleBookRedirect = () => {
    if (onBookClick) {
      onBookClick();
    } else {
      const form = document.getElementById("booking-system-section");
      if (form) {
        form.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleArtistsRedirect = () => {
    if (onExploreArtists) {
      onExploreArtists();
    } else {
      const artSec = document.getElementById("artists-section");
      if (artSec) {
        artSec.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (!config) return null;

  return (
    <div
      id="studio-tour-section"
      className="bg-[#050505] text-white"
    >
      {/* 1. WELCOME TO THE STUDIO: Large bg covers screen */}
      <div 
        className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-center px-6"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(5,5,5,0.7), rgba(5,5,5,0.9)), url(${config.welcomeBg})` }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl space-y-6"
        >
          <Building className="w-12 h-12 text-[#C5A059] mx-auto animate-pulse" />
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-black tracking-widest uppercase text-white leading-tight">
            Welcome to <br /> the studio
          </h1>
          <div className="h-[2px] w-24 bg-[#C5A059] mx-auto" />
          <p className="text-[#C5A059] font-mono tracking-[0.4em] text-xs sm:text-sm uppercase font-bold">
            Ganga Tattoo buckhead • Buckhead Elite
          </p>
        </motion.div>
        
        {/* Subtle scroll down indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Scroll to explore</span>
          <div className="w-[1px] h-10 bg-[#C5A059]/40 animate-bounce" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        
        {/* 2. HEART OF ATLANTA & BEST TATTOO PLACE IN ATLANTA */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.35em] text-[#C5A059] font-bold block">
            • Heart of Atlanta •
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-tight text-white uppercase font-black">
            Best Tattoo place in Atlanta
          </h2>
          <div className="h-[1px] w-12 bg-[#C5A059]/40 mx-auto mt-2" />
        </div>

        {/* 3. DECENT LANDSCAPE IMAGE: CENTERED */}
        <div className="flex justify-center">
          <div 
            id="studio-centered-landscape"
            onClick={() => onSelectImage(config.landscapeCentered, "Buckhead Sanctuary Centered Dome")}
            className="w-full max-w-4xl aspect-[16/9] overflow-hidden bg-neutral-900 border border-white/10 hover:border-[#C5A059]/50 transition-all duration-500 cursor-zoom-in relative group"
            title="Click to Zoom Landscape"
          >
            <img 
              referrerPolicy="no-referrer"
              src={config.landscapeCentered} 
              alt="Atlanta Gallery Dome Design" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700 pointer-events-none"
            />
            <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-transparent transition-colors duration-300" />
            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 text-[9px] font-mono uppercase tracking-wider text-[#C5A059] border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
              Zoom Sanctuary Space
            </div>
          </div>
        </div>

        {/* 4. CIRCULAR SHAPE TEXT & VISIT US BUTTON */}
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <p className="text-sm font-sans italic text-neutral-300 leading-relaxed max-w-xl mx-auto tracking-wide">
            "The design of the space in a circular shape and the dome that rises imposingly"
          </p>
          <button
            id="studio-visit-us-cta"
            onClick={handleBookRedirect}
            className="px-8 py-4 bg-[#C5A059] hover:bg-white text-black font-mono font-black uppercase text-xs tracking-widest transition-all duration-300 pointer-events-auto cursor-pointer hover:shadow-[0_4px_25px_rgba(197,160,89,0.3)] animate-pulse"
          >
            VISIT US
          </button>
        </div>

        {/* 5. TWO LANDSCAPE IMAGES SIDE BY SIDE (some space right, middle, left) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-12 md:px-16">
          <div 
            id="studio-landscape-left"
            onClick={() => onSelectImage(config.landscapeLeft, "Private Lounge View A")}
            className="aspect-[16/10] overflow-hidden bg-neutral-900 border border-white/10 hover:border-[#C5A059]/40 transition-all duration-500 cursor-zoom-in group relative"
          >
            <img 
              referrerPolicy="no-referrer"
              src={config.landscapeLeft} 
              alt="Studio Angle Left" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.01] transition-all duration-500 pointer-events-none"
            />
          </div>
          <div 
            id="studio-landscape-right"
            onClick={() => onSelectImage(config.landscapeRight, "Treatment Chamber View B")}
            className="aspect-[16/10] overflow-hidden bg-neutral-900 border border-white/10 hover:border-[#C5A059]/40 transition-all duration-500 cursor-zoom-in group relative"
          >
            <img 
              referrerPolicy="no-referrer"
              src={config.landscapeRight} 
              alt="Studio Angle Right" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.01] transition-all duration-500 pointer-events-none"
            />
          </div>
        </div>

        {/* 6. OUR GOALS: SUBTITLE AND PARAGRAPH */}
        <div className="text-center space-y-4 max-w-2xl mx-auto pt-6">
          <h3 className="text-xs font-mono uppercase tracking-[0.4em] text-[#C5A059] font-bold">
            Our goals
          </h3>
          <p className="text-sm md:text-base font-serif text-neutral-300 leading-relaxed font-light tracking-wide max-w-xl mx-auto">
            Materialize the inspiration of our artists and clients, offer the best client experience and establish quality and improvement as main values.
          </p>
          <div className="pt-6">
            <button
              id="studio-book-goals-cta"
              onClick={handleBookRedirect}
              className="px-6 py-3.5 bg-transparent border border-white/20 hover:border-[#C5A059] text-white hover:text-[#C5A059] font-mono text-xs uppercase tracking-widest transition-all cursor-pointer"
            >
              BOOK NOW
            </button>
          </div>
        </div>

        {/* 7. SECTION FOR 4 IMAGES (2, 2 dynamic side by side pairs with decent space) */}
        <div className="space-y-8">
          {/* Pair 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-12">
            <div 
              id="studio-img-four-1"
              onClick={() => onSelectImage(config.imgFour1, "Bespoke Lounge Area Details")}
              className="aspect-square md:aspect-[4/3] overflow-hidden bg-neutral-900 border border-white/10 hover:border-[#C5A059]/30 transition-all duration-500 cursor-zoom-in group"
            >
              <img 
                referrerPolicy="no-referrer"
                src={config.imgFour1} 
                alt="Workspace Luxury Item 1" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none"
              />
            </div>
            <div 
              id="studio-img-four-2"
              onClick={() => onSelectImage(config.imgFour2, "Autoclave Sterility Lab setup")}
              className="aspect-square md:aspect-[4/3] overflow-hidden bg-neutral-900 border border-white/10 hover:border-[#C5A059]/30 transition-all duration-500 cursor-zoom-in group"
            >
              <img 
                referrerPolicy="no-referrer"
                src={config.imgFour2} 
                alt="Workspace Luxury Item 2" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none"
              />
            </div>
          </div>
          {/* Pair 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-12">
            <div 
              id="studio-img-four-3"
              onClick={() => onSelectImage(config.imgFour3, "Contemporary Fine Art Framing")}
              className="aspect-square md:aspect-[4/3] overflow-hidden bg-neutral-900 border border-white/10 hover:border-[#C5A059]/30 transition-all duration-500 cursor-zoom-in group"
            >
              <img 
                referrerPolicy="no-referrer"
                src={config.imgFour3} 
                alt="Workspace Luxury Item 3" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none"
              />
            </div>
            <div 
              id="studio-img-four-4"
              onClick={() => onSelectImage(config.imgFour4, "Elite Buckhead Ceiling Architecture")}
              className="aspect-square md:aspect-[4/3] overflow-hidden bg-neutral-900 border border-white/10 hover:border-[#C5A059]/30 transition-all duration-500 cursor-zoom-in group"
            >
              <img 
                referrerPolicy="no-referrer"
                src={config.imgFour4} 
                alt="Workspace Luxury Item 4" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* 8. WE ARE THE DIFFERENCE */}
        <div className="text-center space-y-6 max-w-3xl mx-auto border-t border-white/5 pt-16">
          <h3 className="text-2xl sm:text-3xl font-serif font-black uppercase text-white tracking-widest">
            We are the difference
          </h3>
          <p className="text-xs sm:text-sm text-neutral-450 leading-relaxed font-sans max-w-2xl mx-auto tracking-wide">
            We bring together several of the best tattooists on the planet, including the CEO and founder of the brand Joaquín Ganga, who occupies the main chair of the circle. The studio's location is on Santa Monica Blvd, one of the main West Hollywood avenues, a prime location in Los Angeles.
          </p>
          <div className="pt-4">
            <button
              id="studio-explore-artists-cta"
              onClick={handleArtistsRedirect}
              className="px-6 py-3 border border-white/10 hover:border-[#C5A059] text-[10px] font-mono tracking-widest uppercase text-white hover:text-[#C5A059] transition-colors cursor-pointer"
            >
              EXPLORE ALL ARTISTS
            </button>
          </div>
        </div>

        {/* 9. TWO PANORAMIC/WIDE LANDSCAPE IMAGES (fits complete screen height together, with small gap) */}
        <div className="space-y-4 pt-10">
          <div 
            id="studio-widescreen-1"
            onClick={() => onSelectImage(config.wideScreen1, "Buckhead Grand Galleria Panorama")}
            className="w-full h-[32vh] sm:h-[38vh] md:h-[45vh] overflow-hidden bg-neutral-900 border border-white/10 hover:border-[#C5A059]/40 transition-all duration-500 cursor-zoom-in group relative"
          >
            <img 
              referrerPolicy="no-referrer"
              src={config.wideScreen1} 
              alt="Panoramic View A" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none scale-100 group-hover:scale-[1.01] duration-700"
            />
          </div>
          <div 
            id="studio-widescreen-2"
            onClick={() => onSelectImage(config.wideScreen2, "Exclusive Surgical Tattoo Bay")}
            className="w-full h-[32vh] sm:h-[38vh] md:h-[45vh] overflow-hidden bg-neutral-900 border border-white/10 hover:border-[#C5A059]/40 transition-all duration-500 cursor-zoom-in group relative"
          >
            <img 
              referrerPolicy="no-referrer"
              src={config.wideScreen2} 
              alt="Panoramic View B" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none scale-100 group-hover:scale-[1.01] duration-700"
            />
          </div>
        </div>

      </div>

      {/* 10. LARGE BOTTOM BG FOR BOOK NOW / THANK US LATER */}
      <div 
        className="relative py-32 md:py-48 flex flex-col items-center justify-center bg-cover bg-center text-center px-6 border-t border-white/10"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(5,5,5,0.75), rgba(5,5,5,0.85)), url(${config.bookingBg})` }}
      >
        <div className="max-w-xl space-y-4">
          <h2 className="text-4xl sm:text-6xl font-serif font-black tracking-widest uppercase text-white">
            Book now
          </h2>
          <p className="text-xs font-mono uppercase tracking-[0.4em] text-[#C5A059] font-bold">
            Thank us later
          </p>
          <div className="pt-8">
            <button
              id="studio-footer-book-cta"
              onClick={handleBookRedirect}
              className="px-8 py-4 bg-[#C5A059] hover:bg-white text-black font-mono font-black uppercase text-xs tracking-widest transition-all duration-300 cursor-pointer hover:shadow-[0_4px_30px_rgba(197,160,89,0.4)]"
            >
              BOOK PREMIUM SLOT
            </button>
          </div>
        </div>
      </div>

      {/* 11. Immersive Video Showreels loop section at the end */}
      {videos.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 space-y-12">
          <div className="space-y-3 text-left">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] flex items-center gap-2 font-bold">
              <Film className="w-4 h-4 text-[#C5A059]" />
              Cinematic Reels
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-black uppercase text-white tracking-widest leading-none">
              Live Studio Creations
            </h3>
            <p className="text-neutral-400 font-sans text-xs sm:text-sm tracking-wide max-w-xl font-light">
              Immerse yourself into masterclass sessions and closeups of high-end ink art directly created inside Ganga Atlanta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((vid) => (
              <div
                id={`studio-vid-${vid.id}`}
                key={vid.id}
                className="bg-[#111111]/80 border border-white/10 rounded-2xl p-5 space-y-4 hover:border-[#C5A059]/20 transition-all shadow-xl"
              >
                <div className="aspect-video w-full overflow-hidden bg-black rounded-xl border border-white/5 relative">
                  <video
                    src={vid.videoUrl}
                    controls
                    preload="auto"
                    muted
                    loop
                    className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="text-sm font-serif font-black uppercase tracking-wider text-[#C5A059]">
                    {vid.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-sans leading-relaxed font-light">
                    {vid.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sterile guidelines badge standard to preserve luxury */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="p-6 md:p-8 bg-[#111111]/90 rounded-2xl border border-red-500/10 flex flex-col sm:flex-row items-center gap-5 text-left shadow-lg">
          <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
            <ShieldAlert className="w-6 h-6 text-red-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-[10px] sm:text-xs md:text-sm font-mono uppercase tracking-widest text-red-300 font-black">
              Medical Sterilization Standard Enforced
            </h4>
            <p className="text-[10px] sm:text-xs text-neutral-400 font-sans leading-relaxed max-w-3xl font-light">
              Ganga Tattoo Atlanta employs hospital-grade infection prevention parameters. All resident master systems use sealed disposable cartridge needles, continuous sanitization cycles, vacuum-sealed sterilization indicators, and are certified under top strict Georgia Environmental Sanitation laws.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
