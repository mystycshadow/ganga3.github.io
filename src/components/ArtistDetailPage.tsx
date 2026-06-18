/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Artist } from "../types";
import { ArrowLeft, Calendar, HelpCircle, X, ChevronRight, Minimize2, Maximize2, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { handleImageFallback } from "../utils/imageFallback";

interface ArtistDetailPageProps {
  artist: Artist;
  onBack: () => void;
  onBook: (artistId: string) => void;
  onSelectImage: (
    imageUrl: string, 
    title: string, 
    description?: string, 
    artistName?: string,
    items?: { imageUrl: string; title: string; description?: string; artistName?: string }[],
    currentIndex?: number
  ) => void;
}

// Map real-world origins for resident masters
const ARTIST_ORIGINS: Record<string, string> = {
  "fede-almanzor": "Spain",
  "gkirin": "Korea",
  "jordan": "USA",
  "toni-garcia": "Spain",
  "fran-dmenchi": "Spain",
  "suan": "Spain",
  "ivan-morant": "Spain",
  "cesar-pinto": "Spain",
  "bk": "USA",
  "honart": "Spain",
  "lewis": "USA",
  "johan-castillo": "Colombia",
  "diconeme": "Spain",
  "guillermo": "Spain",
  "hector": "Spain",
  "timor": "Germany",
  "henry": "USA",
  "may-soria": "Spain",
  "avecilla": "Spain",
  "mammon": "Spain",
  "anthony": "USA",
  "henko": "Spain",
  "alan": "Spain",
  "parse": "Spain",
  "lola-bueno": "Spain",
  "katya": "USA",
  "abigail": "USA",
  "jenni": "USA",
  "yatzil": "Mexico",
  "albert-quintero": "Spain",
  "titos": "Spain"
};

export default function ArtistDetailPage({
  artist,
  onBack,
  onBook,
  onSelectImage,
}: ArtistDetailPageProps) {
  const [isFullscreenGallery, setIsFullscreenGallery] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to leftmost index on open so user can scroll right-to-left
  useEffect(() => {
    if (isFullscreenGallery && scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      // Position scroll fully to the right so scrolling from right-to-left is perfect!
      setTimeout(() => {
        el.scrollLeft = el.scrollWidth - el.clientWidth;
      }, 100);
    }
  }, [isFullscreenGallery]);

  const origin = ARTIST_ORIGINS[artist.id] || "International";
  const shortName = artist.name.split(" ")[0];

  return (
    <div
      id={`artist-detail-page-${artist.id}`}
      className="bg-black text-white min-h-screen py-12 md:py-20 text-left relative"
    >
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        {/* Subtle Breadcrumb back action */}
        <button
          id="detail-back-to-team-btn"
          onClick={onBack}
          className="group flex items-center gap-2 text-neutral-400 hover:text-[#C5A059] transition-colors font-mono text-xs uppercase tracking-widest cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Resident Masters</span>
        </button>

        {/* Outer Split Card featuring Glass-morphic effect */}
        <div className="border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-3xl p-6 md:p-10 space-y-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Subtle glowing ambient lights inside detail card */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#C5A059]/[0.02] blur-[120px] rounded-full pointer-events-none" />

          {/* Core artist parameter layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative z-10">
            {/* Sidebar metadata (Left 4 cols) */}
            <div className="md:col-span-4 space-y-6 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-8">
              {/* Parameter Block 1: Styles */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C5A059] block font-bold">
                  Styles
                </span>
                <p className="text-xl font-serif text-white font-black uppercase tracking-wide">
                  {artist.specialty}
                </p>
              </div>

              {/* Parameter Block 2: Origin */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C5A059] block font-bold">
                  Origin
                </span>
                <p className="text-lg font-serif text-neutral-200 tracking-wide font-medium">
                  {origin}
                </p>
              </div>

              {/* Parameter Block 3: Availability */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C5A059] block font-bold">
                  Availability
                </span>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-sans text-neutral-200">
                    Available for bookings
                  </span>
                </div>
              </div>

              {/* Direct book callout label */}
              <div className="pt-4">
                <button
                  id={`detail-sidebar-book-${artist.id}`}
                  onClick={() => onBook(artist.id)}
                  className="w-full py-4 px-6 bg-[#C5A059] hover:bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book with {shortName}</span>
                </button>
              </div>
            </div>

            {/* Core text block elements (Right 8 cols) */}
            <div className="md:col-span-8 space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-normal text-white">
                  {artist.name}
                </h1>
                <p className="text-[#C5A059] font-mono text-xs uppercase tracking-widest font-black">
                  A recognized {artist.specialty} artist in Los Angeles
                </p>
              </div>

              <p className="text-neutral-300 font-sans text-sm md:text-base tracking-wide leading-relaxed select-text font-light">
                {artist.bio}
              </p>

              {/* Live Availability Details Indicator */}
              <div className="p-4 bg-white/[0.01] border border-white/5 whitespace-normal rounded-xl flex items-center gap-3">
                <span className="text-xs font-mono text-neutral-400 tracking-wider">
                  Next session open slot status:{" "}
                  <strong className="text-emerald-400 font-bold uppercase ml-1">
                    {artist.nextAvailable}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Featured projects showcase gallery */}
          <div className="space-y-6 pt-10 border-t border-white/10 relative z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-black uppercase tracking-wider text-white">
                Featured projects
              </h3>
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                {artist.portfolio.length} pieces
              </span>
            </div>

            {/* Core preview slider grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {artist.portfolio.map((work, idx) => (
                <div
                  id={`detail-project-card-${work.id}`}
                  key={work.id}
                  onClick={(e) => {
                    const img = e.currentTarget.querySelector("img");
                    const currentSrc = img ? img.getAttribute("src") || work.imageUrl : work.imageUrl;
                    const items = artist.portfolio.map((w) => {
                      const wImg = document.querySelector(`#detail-project-card-${w.id} img`);
                      return {
                        imageUrl: wImg ? wImg.getAttribute("src") || w.imageUrl : w.imageUrl,
                        title: w.title,
                        description: w.description,
                        artistName: artist.name
                      };
                    });
                    onSelectImage(currentSrc, work.title, work.description, artist.name, items, idx);
                  }}
                  className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-zoom-in border border-white/5 hover:border-[#C5A059]/40 transition-all duration-300"
                  title="Click to Zoom Project"
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={work.imageUrl}
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    alt={work.title}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none"
                    onError={(e) => handleImageFallback(e, 'portfolio', artist.id, idx + 1)}
                  />
                </div>
              ))}
            </div>

            {/* Immersive landscape fullscreen controls */}
            <div className="pt-6 flex justify-center">
              <button
                id="detail-immersive-full-view-btn"
                onClick={() => setIsFullscreenGallery(true)}
                className="px-6 py-3.5 border border-white/10 hover:border-[#C5A059]/40 bg-white/[0.03] hover:bg-white/[0.08] text-neutral-200 hover:text-white text-xs font-mono uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Maximize2 className="w-4 h-4 text-[#C5A059]" />
                <span>Full View Showcase</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Fullscreen scrolling carousel view (scrolling from right to left) */}
      <AnimatePresence>
        {isFullscreenGallery && (
          <motion.div
            id="fullscreen-scroller-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#020202]/98 backdrop-blur-2xl z-50 flex flex-col justify-between p-6 overflow-hidden text-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsFullscreenGallery(false);
            }}
          >
            {/* Top action controls Row containing the interactive slider exit switch */}
            <div className="flex items-center justify-between max-w-7xl mx-auto w-full py-4 border-b border-white/[0.08]">
              {/* Title elements */}
              <div className="text-left">
                <h4 className="text-lg font-serif font-black uppercase text-white tracking-wider">
                  {artist.name} Full View Showcase
                </h4>
                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
                  Scroll right-to-left to view complete portfolio pieces
                </p>
              </div>

              {/* Slider switch container to mimic "Exit Full Screen that moves the switch to the left" */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                  Exit Full Screen
                </span>
                
                {/* Switch design button */}
                <button
                  id="exit-fullscreen-slider-switch"
                  onClick={() => setIsFullscreenGallery(false)}
                  className="w-14 h-7 bg-[#C5A059] rounded-full p-0.5 relative flex items-center justify-end transition-all duration-300 overflow-hidden shadow-inner cursor-pointer"
                  title="Toggle off Full View"
                >
                  {/* Thumb starts at the right (active) and moves off to the left on exit! */}
                  <motion.div
                    layoutId="fullscreenSwitchThumb"
                    className="w-6 h-6 bg-black rounded-full shadow-md flex items-center justify-center"
                    initial={{ x: 0 }}
                    animate={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <X className="w-3.5 h-3.5 text-[#C5A059]" />
                  </motion.div>
                </button>
              </div>
            </div>

            {/* Immersive Scroll Viewport */}
            <div
              id="immersive-horizontal-slider"
              ref={scrollContainerRef}
              className="flex-1 w-full flex items-center overflow-x-auto scrollbar-hidden snap-x snap-mandatory py-10"
              style={{
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsFullscreenGallery(false);
              }}
            >
              <div 
                className="flex flex-row gap-12 px-[15vw]"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setIsFullscreenGallery(false);
                }}
              >
                {artist.portfolio.map((work, idx) => (
                  <div
                    key={work.id}
                    className="snap-center shrink-0 w-[60vw] md:w-[45vw] lg:w-[35vw] aspect-[3/4] bg-[#0c0c0c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group-card flex flex-col justify-between"
                  >
                    <img
                      referrerPolicy="no-referrer"
                      src={work.imageUrl}
                      fetchPriority="high"
                      loading="eager"
                      decoding="async"
                      alt={work.title}
                      className="w-full h-full object-cover opacity-90"
                      onError={(e) => handleImageFallback(e, 'portfolio', artist.id, idx + 1)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom visual indicator row */}
            <div className="max-w-7xl mx-auto w-full py-4 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-neutral-500 font-mono">
              <span>Scroll right or swipe left ⟵</span>
              <button
                className="hover:text-white uppercase transition-colors"
                onClick={() => setIsFullscreenGallery(false)}
              >
                Close View [ESC]
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
