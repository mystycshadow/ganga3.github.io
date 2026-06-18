/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, ZoomIn, ZoomOut, Maximize, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LightboxItem {
  imageUrl: string;
  title: string;
  description?: string;
  artistName?: string;
}

interface LightboxProps {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  description?: string;
  artistName?: string;
  items?: LightboxItem[];
  startIndex?: number;
  onClose: () => void;
  onBookWithArtist?: () => void;
}

export default function Lightbox({
  isOpen,
  imageUrl: initialImageUrl,
  title: initialTitle,
  description: initialDescription,
  artistName: initialArtistName,
  items: initialItems = [],
  startIndex = 0,
  onClose,
  onBookWithArtist,
}: LightboxProps) {
  const [zoomScale, setZoomScale] = useState(1);
  const [isMaximized, setIsMaximized] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  // Guarantee we always have a helper list of items
  const items = initialItems && initialItems.length > 0 
    ? initialItems 
    : [{ imageUrl: initialImageUrl, title: initialTitle, description: initialDescription, artistName: initialArtistName }];

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(startIndex);
      setZoomScale(1);
      setIsMaximized(false);
    }
  }, [isOpen, startIndex, initialItems]);

  const handleNext = () => {
    if (items.length > 1 && currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setZoomScale(1); // Reset zoom on swap
    }
  };

  const handlePrev = () => {
    if (items.length > 1 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setZoomScale(1); // Reset zoom on swap
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, items]);

  if (!isOpen) return null;

  const currentItem = items[currentIndex] || { imageUrl: initialImageUrl, title: initialTitle, description: initialDescription, artistName: initialArtistName };

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 0.25, 1));
  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    setZoomScale(1);
  };

  return (
    <AnimatePresence>
      <motion.div
        id="lightbox-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col md:flex-row items-center justify-center bg-black/95 backdrop-blur-md p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Top bar controls */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
          {items.length > 1 && (
            <span className="text-[10px] font-mono text-[#C5A059] border border-[#C5A059]/30 px-2 py-1 bg-black/50 tracking-widest uppercase">
              {currentIndex + 1} / {items.length}
            </span>
          )}
          <button
            id="lightbox-zoom-in"
            onClick={handleZoomIn}
            className="p-2.5 bg-[#111111]/80 hover:bg-neutral-800 text-white border border-white/10 hover:border-white/30 rounded-none transition-all duration-300 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            id="lightbox-zoom-out"
            onClick={handleZoomOut}
            className="p-2.5 bg-[#111111]/80 hover:bg-neutral-800 text-white border border-white/10 hover:border-white/30 rounded-none transition-all duration-300 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            id="lightbox-maximize"
            onClick={toggleMaximize}
            className="p-2.5 bg-[#111111]/80 hover:bg-neutral-800 text-white border border-white/10 hover:border-white/30 rounded-none transition-all duration-300 cursor-pointer"
            title="Toggle Normal View"
          >
            <Maximize className="w-5 h-5" />
          </button>
          <button
            id="lightbox-close"
            onClick={() => {
              setZoomScale(1);
              setIsMaximized(false);
              onClose();
            }}
            className="p-2.5 bg-neutral-900/80 hover:bg-[#C5A059] text-white hover:text-neutral-950 border border-white/10 hover:border-[#C5A059] rounded-none transition-all duration-300 cursor-pointer"
            title="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area */}
        <div 
          className="flex-grow flex items-center justify-center w-full h-[55vh] md:h-full relative overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Previous Button inside central view, hidden if currentIndex === 0 (not accessible) */}
          {items.length > 1 && currentIndex > 0 && (
            <button
              id="lightbox-prev-btn"
              onClick={handlePrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 p-4 bg-neutral-900/80 hover:bg-[#C5A059] text-white hover:text-black border border-white/10 hover:border-[#C5A059] rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 active:scale-95 animate-fadeIn"
              title="Previous Image"
            >
              <ChevronLeft className="w-6 h-6 animate-pulse" />
            </button>
          )}

          {/* Next Button inside central view */}
          {items.length > 1 && currentIndex < items.length - 1 && (
            <button
              id="lightbox-next-btn"
              onClick={handleNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 p-4 bg-neutral-900/80 hover:bg-[#C5A059] text-white hover:text-black border border-white/10 hover:border-[#C5A059] rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 active:scale-95"
              title="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <motion.div
            key={currentIndex}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="relative flex items-center justify-center max-w-full max-h-full p-2"
          >
            <img
              id="lightbox-image"
              referrerPolicy="no-referrer"
              src={currentItem.imageUrl}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              alt={currentItem.title}
              className={`object-contain transition-all duration-350 select-none pointer-events-none rounded-none shadow-2xl ${
                isMaximized ? "w-screen h-screen max-w-none max-h-none" : "max-w-[75vw] max-h-[70vh] md:max-h-[80vh]"
              }`}
              style={{ transform: `scale(${zoomScale})` }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes("unsplash.com")) {
                  target.src = "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800";
                }
              }}
            />
          </motion.div>
        </div>

        {/* Info panel on side */}
        <motion.div
          id="lightbox-sidebar"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full md:w-[350px] bg-neutral-950/90 border-t md:border-t-0 md:border-l border-white/[0.08] hover:border-white/[0.15] p-6 md:p-8 flex flex-col justify-center gap-6 self-stretch transition-colors duration-300 z-10 overflow-y-auto text-center"
        >
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#C5A059]">
              {currentItem.artistName ? `${currentItem.artistName}'s Masterpiece` : "Portfolio Showcase"}
            </span>
          </div>

          {onBookWithArtist && (
             <div>
              <button
                id="lightbox-cta-book"
                onClick={() => {
                  setZoomScale(1);
                  setIsMaximized(false);
                  onBookWithArtist();
                }}
                className="w-full py-3 bg-[#C5A059] hover:bg-[#E5C079] text-neutral-950 text-xs font-black uppercase tracking-[0.15em] rounded-none transition-all duration-300 hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Calendar className="w-4 h-4 transition-transform group-hover:scale-110 text-neutral-950" />
                Book Session
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
