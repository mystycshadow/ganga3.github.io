/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { getSiteMedia, SiteMedia } from "../utils/db";

interface NoPainProps {
  onBookNow: () => void;
}

export default function NoPain({ onBookNow }: NoPainProps) {
  const [siteMedia, setSiteMedia] = useState<SiteMedia | null>(null);

  useEffect(() => {
    setSiteMedia(getSiteMedia());
  }, []);

  // We'll set up realistic image pathways which can also load fallback high-quality Unsplash images
  // so the user can see a gorgeous app immediately, while knowing exactly where to insert local files!
  const images = {
    bgFirst: siteMedia?.noPainBgFirst || "/images/nopain/bg-1.png",
    heroLandscape: siteMedia?.noPainHeroLandscape || "/images/nopain/hero.png",
    tileLeftSquare: siteMedia?.noPainTile1 || "/images/nopain/1.png",
    tileRightLandscape: siteMedia?.noPainTile2 || "/images/nopain/2.png",
    tileRightSquare1: siteMedia?.noPainTile3 || "/images/nopain/3.png",
    tileRightSquare2: siteMedia?.noPainTile4 || "/images/nopain/4.png",
    tileLeftLandscapeNew: siteMedia?.noPainTile5 || "/images/nopain/5.png",
    tileRightSquareEnd: siteMedia?.noPainTile6 || "/images/nopain/6.png",
    bgSecond: siteMedia?.noPainBgSecond || "/images/nopain/bg-2.png",

    // Gorgeous fallback imagery from Unsplash for instant visual aesthetic:
    fallbackBgFirst: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=1800",
    fallbackHeroLandscape: "https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&q=80&w=1500",
    fallbackLeftSquare: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800",
    fallbackRightLandscape: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=1200",
    fallbackRightSquare1: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&q=80&w=800",
    fallbackRightSquare2: "https://images.unsplash.com/photo-1560707854-fb9a10ebc8e4?auto=format&fit=crop&q=80&w=800",
    fallbackLeftLandscapeNew: "https://images.unsplash.com/photo-1590246814883-fc7a242c1613?auto=format&fit=crop&q=80&w=1200",
    fallbackRightSquareEnd: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=800",
    fallbackBgSecond: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=1800",
  };

  return (
    <div id="no-pain-root" className="min-h-screen bg-[#050505] text-white">
      
      {/* 
        SECTION 1: Large landscape bg image covering the whole page (100vh height fold)
        Labled beautifully so user knows where to drop in images.
      */}
      <section 
        id="nopain-hero-section" 
        className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center"
      >
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img 
            src={images.bgFirst}
            onError={(e) => {
              // Smooth fallback to gorgeous high-resolution unsplash image
              const target = e.target as HTMLImageElement;
              target.src = images.fallbackBgFirst;
            }}
            referrerPolicy="no-referrer"
            alt="No Pain First Background"
            className="w-full h-full object-cover"
          />
          {/* Transparent color tint overlays for high-contrast elite luxury feel */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-[#0c0c0c]" />
        </div>

        {/* Content Centered just below the center */}
        <div className="relative z-10 text-center max-w-4xl px-6 mt-20 flex flex-col items-center space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-neutral-300 font-sans text-sm sm:text-base md:text-lg tracking-wide font-light max-w-2xl leading-relaxed"
          >
            Breaking the conventional barriers of the tattoo industry
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-6xl md:text-8xl font-serif font-black uppercase text-white tracking-tight leading-none"
          >
            No Pain <span className="text-[#C5A059] block sm:inline">by Ganga.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-4"
          >
            <button
              id="nopain-hero-book-btn"
              onClick={onBookNow}
              className="px-10 py-4 bg-[#C5A059] hover:bg-white text-black font-mono text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_5px_25px_rgba(197,160,89,0.35)] cursor-pointer"
            >
              Book Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* 
        SECTION 2: Centered block with 3/4 height landscape image below the button.
      */}
      <section 
        id="nopain-experience-header"
        className="relative bg-[#0c0c0c] py-12 md:py-20 flex flex-col items-center px-4"
      >
        <div className="w-full max-w-6xl relative rounded-sm overflow-hidden border border-white/5 shadow-2xl">
          {/* Height about 3/4 of the first background (75vh height) */}
          <div className="relative h-[65vh] w-full flex items-center justify-center">
            <img 
              src={images.heroLandscape}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = images.fallbackHeroLandscape;
              }}
              referrerPolicy="no-referrer"
              alt="No Pain Hero Landscape"
              className="w-full h-full object-cover"
            />
            {/* Elegant luxury overlay to ensure premium readability */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Custom centered content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto space-y-6 z-10">
              <span className="text-[10px] font-mono text-[#C5A059] tracking-[0.3em] uppercase block">
                Exclusive Anesthetic Protocols
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black text-white uppercase tracking-tight leading-tight">
                LARGE TATTOOS DONE WITHOUT PAIN.<br />
                FOUR SESSIONS NOW ALL IN ONE
              </h2>
              <div className="w-20 h-[1.5px] bg-[#C5A059]/60" />
              <p className="text-sm sm:text-base text-neutral-300 font-sans font-light leading-relaxed max-w-2xl">
                Pain has been associated with tattoos since the industry was born. Historically, larger-scale pieces required multiple sessions over several weeks in order to avoid uncomfortable client experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 
        SECTION 3: Tile Mosaic Grid (Maintaining our dark gray color immediately below the image)
        "leave no spaces after the images on this section."
        Let's construct the precise grid requested by the user:
        - "in no pain, all images reach the edge from where the images begin then tile 1 on line 2 left . tile 2 on 1 right aligned. tile 3, 4 and 5 are okay tile 6 on the next line after tile 5."
        - There is absolutely no outer container margins/padding, ensuring images touch the window boundary edges flush.
      */}
      <section 
        id="nopain-tile-gallery"
        className="bg-[#0c0c0c] w-full p-0 m-0 overflow-x-hidden border-t border-b border-white/5"
      >
        <div className="w-full p-0 m-0 text-neutral-200">
          
          <div className="flex flex-col w-full">
            
            {/* ROW 1: 
                - Left: Surgical branding text info block (40%)
                - Right: Tile 2 right aligned on Line 1 (60%)
            */}
            <div className="flex flex-col md:flex-row w-full items-stretch p-0 m-0">
              {/* Row 1 Left (40%): Branding space */}
              <div className="w-full md:w-[40%] bg-[#080808] p-8 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[300px]">
                <div className="font-mono text-xs sm:text-sm text-[#C5A059] uppercase tracking-[0.25em] font-extrabold mb-4">
                  Ganga "No Pain Technique"
                </div>
                <div className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase font-bold mb-2">
                  Surgical Luxury Comfort
                </div>
                <h4 className="text-white text-xl md:text-2xl font-serif font-black uppercase tracking-wide leading-tight max-w-sm">
                  WAKE UP WITH YOUR COMPLETED CANVAS
                </h4>
                <p className="text-xs md:text-sm text-neutral-400 font-sans mt-4 leading-relaxed max-w-xs mx-auto">
                  We walk you through a custom tranquil process. Our qualified practitioners handle the medical comfort so our elite artists can focus purely on creating art without compromise.
                </p>
              </div>

              {/* Row 1 Right (60%): Tile 2 (tile_2_landscape.png) */}
              <div className="relative w-full md:w-[60%] aspect-[16/10] bg-[#0c0c0c] overflow-hidden flex flex-col justify-center items-center group">
                <img 
                  src={images.tileRightLandscape}
                  onError={(e) => { e.target && ((e.target as HTMLImageElement).src = images.fallbackRightLandscape); }}
                  referrerPolicy="no-referrer"
                  alt="No Pain Landscape Right (Tile 2)"
                  className="w-full h-full object-cover scale-100 hover:scale-102 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300 z-10" />
                {/* Overlay text removed */}
              </div>
            </div>

            {/* ROW 2:
                - Left: Tile 1 square Left (40%)
                - Right: Tile 3 & Tile 4 combined right aligned (60%)
            */}
            <div className="flex flex-col md:flex-row w-full items-stretch p-0 m-0">
              {/* Row 2 Left (40%): Tile 1 Square (tile_1_square.png) */}
              <div className="relative w-full md:w-[40%] aspect-square bg-[#080808] overflow-hidden flex flex-col justify-center items-center group">
                <img 
                  src={images.tileLeftSquare}
                  onError={(e) => { e.target && ((e.target as HTMLImageElement).src = images.fallbackLeftSquare); }}
                  referrerPolicy="no-referrer"
                  alt="No Pain Square Left (Tile 1)"
                  className="w-full h-full object-cover scale-100 hover:scale-102 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300 z-10" />
                {/* Overlay text removed */}
              </div>

              {/* Row 2 Right (60%): 2 square images (Tile 3 & Tile 4 combined) */}
              <div className="w-full md:w-[60%] flex flex-col sm:flex-row items-stretch p-0 m-0 bg-black gap-0">
                {/* Square Sub-image 1 (Tile 3) */}
                <div className="relative flex-1 aspect-square bg-[#0a0a0a] overflow-hidden flex flex-col justify-center items-center group">
                  <img 
                    src={images.tileRightSquare1}
                    onError={(e) => { e.target && ((e.target as HTMLImageElement).src = images.fallbackRightSquare1); }}
                    referrerPolicy="no-referrer"
                    alt="No Pain Square Right 1 (Tile 3)"
                    className="w-full h-full object-cover scale-100 hover:scale-102 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300 z-10" />
                </div>

                {/* Square Sub-image 2 (Tile 4) */}
                <div className="relative flex-1 aspect-square bg-[#0c0c0c] overflow-hidden flex flex-col justify-center items-center group">
                  <img 
                    src={images.tileRightSquare2}
                    onError={(e) => { e.target && ((e.target as HTMLImageElement).src = images.fallbackRightSquare2); }}
                    referrerPolicy="no-referrer"
                    alt="No Pain Square Right 2 (Tile 4)"
                    className="w-full h-full object-cover scale-100 hover:scale-102 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300 z-10" />
                </div>
              </div>
            </div>

            {/* ROW 3:
                - Left: Tile 5 landscape (60%)
                - Right: Clinical Sterile branding block (40%)
            */}
            <div className="flex flex-col md:flex-row w-full items-stretch p-0 m-0">
              {/* Row 3 Left (60%): Tile 5 Landscape (tile_5_landscape_left_new.png) */}
              <div className="relative w-full md:w-[60%] aspect-[16/10] bg-[#0c0c0c] overflow-hidden flex flex-col justify-center items-center group">
                <img 
                  src={images.tileLeftLandscapeNew}
                  onError={(e) => { e.target && ((e.target as HTMLImageElement).src = images.fallbackLeftLandscapeNew); }}
                  referrerPolicy="no-referrer"
                  alt="No Pain Landscape Left (Tile 5)"
                  className="w-full h-full object-cover scale-100 hover:scale-102 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300 z-10" />
              </div>

              {/* Row 3 Right (40%): Surgical sterilisation block */}
              <div className="w-full md:w-[40%] bg-[#0d0d0d] p-8 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[300px]">
                <div className="font-mono text-xs sm:text-sm text-[#C5A059] uppercase tracking-[0.25em] font-extrabold mb-4">
                  Industrial Safety Sanitation
                </div>
                <div className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase font-bold mb-2">
                  Medical Grade Standard
                </div>
                <h4 className="text-white text-xl md:text-2xl font-serif font-black uppercase tracking-wide leading-tight max-w-sm">
                  PERFECT ASEPTIC ENVIRONMENT
                </h4>
                <p className="text-xs md:text-sm text-neutral-400 font-sans mt-4 leading-relaxed max-w-xs mx-auto">
                  We deploy hospital-grade negative pressure air scrubbers, sterilized disposable materials, and surgical anesthetics to maximize security and precision.
                </p>
              </div>
            </div>

            {/* ROW 4:
                - Left: Dark branding/styling block (60%)
                - Right: Tile 6 square (40%)
            */}
            <div className="flex flex-col md:flex-row w-full items-stretch p-0 m-0">
              {/* Row 4 Left (60%): Branding space */}
              <div className="w-full md:w-[60%] bg-[#080808] p-8 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[300px]">
                <div className="font-mono text-xs sm:text-sm text-[#C5A059] uppercase tracking-[0.25em] font-extrabold mb-4">
                  Four Sessions in One
                </div>
                <div className="text-[10px] font-mono tracking-[0.2em] text-[#C5A059] uppercase font-bold mb-2">
                  Effortless Large scale Masterpieces
                </div>
                <h4 className="text-white text-xl md:text-2xl font-serif font-black uppercase tracking-wide leading-tight max-w-xl">
                  CONQUER MASSIVE CANVAS DESIGNS
                </h4>
                <p className="text-xs md:text-sm text-neutral-400 font-sans mt-4 leading-relaxed max-w-md mx-auto">
                  Historically, half-body or backpiece tattoos meant months of continuous pain and recovery. At Ganga Tattoo, we consolidate this timeline, letting you achieve full saturation safely in a single dream session.
                </p>
              </div>

              {/* Row 4 Right (40%): Tile 6 Square (tile_6_square_right_end.png) */}
              <div className="relative w-full md:w-[40%] aspect-square bg-[#0a0a0a] overflow-hidden flex flex-col justify-center items-center group">
                <img 
                  src={images.tileRightSquareEnd}
                  onError={(e) => { e.target && ((e.target as HTMLImageElement).src = images.fallbackRightSquareEnd); }}
                  referrerPolicy="no-referrer"
                  alt="No Pain Square End (Tile 6)"
                  className="w-full h-full object-cover scale-100 hover:scale-102 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300 z-10" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 
        SECTION 4: Large image that covers the page as a background with Medical team copy and Book Now CTA
        "below all that leave a small gap then insert a large image that will cover the page as a bg."
      */}
      <section 
        id="nopain-medical-section" 
        className="relative min-h-[90vh] w-full overflow-hidden flex flex-col justify-center items-center mt-12 px-6 py-20"
      >
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img 
            src={images.bgSecond}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = images.fallbackBgSecond;
            }}
            referrerPolicy="no-referrer"
            alt="No Pain Medical Background"
            className="w-full h-full object-cover"
          />
          {/* Subtle color darkening mask */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black" />
        </div>

        {/* Informative text & Button */}
        <div className="relative z-10 text-center max-w-4xl space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] sm:text-xs font-mono text-[#C5A059] uppercase tracking-[0.3em] font-black block">
              100% STERILE CLINICAL ANESTHESIOLOGY 
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black uppercase text-white tracking-tight leading-tight">
              Qualified medical personnel.
            </h2>
          </div>
          
          <p className="text-sm sm:text-base md:text-lg text-neutral-300 font-sans font-light leading-relaxed max-w-3xl mx-auto">
            Under the care of qualified medical facility personnel, No Pain by Ganga clients undergo anesthesia that is specifically prepared for this unique type of work environment. Our team works on large surfaces of the body for extended periods of time and we often have multiple artists working at the same time. Our clients are able to leave their session with incredible large-scale tattoos done in just a few hours with no pain at all.
          </p>

          <div className="pt-6">
            <button
              id="nopain-medical-book-btn"
              onClick={onBookNow}
              className="px-10 py-4 bg-[#C5A059] hover:bg-white text-black font-mono text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_5px_22px_rgba(197,160,89,0.3)] cursor-pointer"
            >
              Book Now
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
