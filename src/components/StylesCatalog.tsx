/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Grid3X3, ArrowRight, ArrowLeft, Compass } from "lucide-react";
import { handleImageFallback } from "../utils/imageFallback";
import { getCustomStyleDetails } from "../utils/db";

// StyleCardImage: removes the arrows and runs an autonomous slideshow of exactly 3 images on hover
interface StyleCardImageProps {
  styleId: string;
  styleName: string;
  images: string[];
}

function StyleCardImage({ styleId, styleName, images }: StyleCardImageProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      setActiveIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % 3);
    }, 1200);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full h-full relative"
    >
      <img
        referrerPolicy="no-referrer"
        src={images[activeIdx] || images[0]}
        fetchPriority="high"
        loading="eager"
        decoding="async"
        alt={`${styleName} cover slideshow`}
        className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
        onError={(e) => handleImageFallback(e, 'style', styleId, activeIdx + 1)}
      />

      {/* Pagination dot indicators - only 3 images are visible here as cover slideshow */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20">
        {[0, 1, 2].map((ind) => (
          <div
            key={ind}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              ind === activeIdx ? "bg-[#C5A059] w-3" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Curated local folder photos for the styles
const getStyleImage = (styleId: string, imageIndex: number) => {
  return `/images/styles/${styleId}-${imageIndex}.png`;
};

interface StylesCatalogProps {
  onSelectImage: (imageUrl: string, title: string, description?: string) => void;
  onJumpToArtist: (artistId: string) => void;
  onSelectStyle: (styleId: string) => void;
}

interface StyleSection {
  id: string;
  name: string;
  description: string;
  masters: { name: string; id: string }[];
  images: string[];
}

export default function StylesCatalog({ onSelectImage, onJumpToArtist, onSelectStyle }: StylesCatalogProps) {
  
  // Carousel scrolling tracking states
  const sliderRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);
  const [isHoveringLeft, setIsHoveringLeft] = useState(false);
  const [isHoveringRight, setIsHoveringRight] = useState(false);

  // Track active image index for each style category card (0 to 4)
  const [styleImageIndices, setStyleImageIndices] = useState<Record<string, number>>({});

  const styleSections: StyleSection[] = [
    {
      id: "black-grey-realism",
      name: "Black & Gray Realism",
      description: "Black and grey tattoos with deep shading and stunning realism, perfect for timeless, expressive pieces.",
      masters: [
        { name: "Fede Almanzor", id: "fede-almanzor" },
        { name: "Gkirin", id: "gkirin" },
        { name: "Jordan", id: "jordan" },
        { name: "Toni Garcia", id: "toni-garcia" },
        { name: "Fran Dmenchi", id: "fran-dmenchi" }
      ],
      images: [
        getStyleImage("black-grey-realism", 1),
        getStyleImage("black-grey-realism", 2),
        getStyleImage("black-grey-realism", 3),
        getStyleImage("black-grey-realism", 4),
        getStyleImage("black-grey-realism", 5)
      ]
    },
    {
      id: "black-grey-microrealism",
      name: "Black & Gray Microrealism",
      description: "Tiny, hyper-detailed black and grey tattoos with impressive depth and subtle shading.",
      masters: [
        { name: "Fede Almanzor", id: "fede-almanzor" },
        { name: "Gkirin", id: "gkirin" },
        { name: "Jordan", id: "jordan" },
        { name: "Toni Garcia", id: "toni-garcia" },
        { name: "Fran Dmenchi", id: "fran-dmenchi" }
      ],
      images: [
        getStyleImage("black-grey-microrealism", 1),
        getStyleImage("black-grey-microrealism", 2),
        getStyleImage("black-grey-microrealism", 3),
        getStyleImage("black-grey-microrealism", 4),
        getStyleImage("black-grey-microrealism", 5)
      ]
    },
    {
      id: "black-grey-sculptures",
      name: "Black & Gray Realism Sculptures",
      description: "Hyperrealistic black and grey tattoos inspired by classical sculptures and religious figures.",
      masters: [
        { name: "Fede Almanzor", id: "fede-almanzor" },
        { name: "Gkirin", id: "gkirin" },
        { name: "Jordan", id: "jordan" },
        { name: "Toni Garcia", id: "toni-garcia" },
        { name: "Fran Dmenchi", id: "fran-dmenchi" }
      ],
      images: [
        getStyleImage("black-grey-sculptures", 1),
        getStyleImage("black-grey-sculptures", 2),
        getStyleImage("black-grey-sculptures", 3),
        getStyleImage("black-grey-sculptures", 4),
        getStyleImage("black-grey-sculptures", 5)
      ]
    },
    {
      id: "black-grey-big-pieces",
      name: "Black & Gray Realism Big Pieces",
      description: "Large-scale black and grey tattoos with breathtaking detail and dramatic composition.",
      masters: [
        { name: "Fede Almanzor", id: "fede-almanzor" },
        { name: "Gkirin", id: "gkirin" },
        { name: "Jordan", id: "jordan" },
        { name: "Toni Garcia", id: "toni-garcia" },
        { name: "Fran Dmenchi", id: "fran-dmenchi" }
      ],
      images: [
        getStyleImage("black-grey-big-pieces", 1),
        getStyleImage("black-grey-big-pieces", 2),
        getStyleImage("black-grey-big-pieces", 3),
        getStyleImage("black-grey-big-pieces", 4),
        getStyleImage("black-grey-big-pieces", 5)
      ]
    },
    {
      id: "blackwork",
      name: "Blackwork",
      description: "Bold, high-contrast tattoos made entirely with black ink and graphic shapes.",
      masters: [
        { name: "Fede Almanzor", id: "fede-almanzor" },
        { name: "Gkirin", id: "gkirin" },
        { name: "Jordan", id: "jordan" },
        { name: "Toni Garcia", id: "toni-garcia" },
        { name: "Fran Dmenchi", id: "fran-dmenchi" }
      ],
      images: [
        getStyleImage("blackwork", 1),
        getStyleImage("blackwork", 2),
        getStyleImage("blackwork", 3),
        getStyleImage("blackwork", 4),
        getStyleImage("blackwork", 5)
      ]
    },
    {
      id: "color-original-designs",
      name: "Color Original Designs",
      description: "Creative, expressive tattoos with bold colors and fluid artistic shapes.",
      masters: [
        { name: "Fede Almanzor", id: "fede-almanzor" },
        { name: "Gkirin", id: "gkirin" },
        { name: "Jordan", id: "jordan" },
        { name: "Toni Garcia", id: "toni-garcia" },
        { name: "Fran Dmenchi", id: "fran-dmenchi" }
      ],
      images: [
        getStyleImage("color-original-designs", 1),
        getStyleImage("color-original-designs", 2),
        getStyleImage("color-original-designs", 3),
        getStyleImage("color-original-designs", 4),
        getStyleImage("color-original-designs", 5)
      ]
    },
    {
      id: "color-microrealism",
      name: "Color Microrealism",
      description: "Small, colorful tattoos with fine detail and realistic depth in miniature form.",
      masters: [
        { name: "Fede Almanzor", id: "fede-almanzor" },
        { name: "Gkirin", id: "gkirin" },
        { name: "Jordan", id: "jordan" },
        { name: "Toni Garcia", id: "toni-garcia" },
        { name: "Fran Dmenchi", id: "fran-dmenchi" }
      ],
      images: [
        getStyleImage("color-microrealism", 1),
        getStyleImage("color-microrealism", 2),
        getStyleImage("color-microrealism", 3),
        getStyleImage("color-microrealism", 4),
        getStyleImage("color-microrealism", 5)
      ]
    },
    {
      id: "color-realism",
      name: "Color Realism",
      description: "Vibrant colors and realistic shading perfect for large, eye-catching tattoos and portraits.",
      masters: [
        { name: "Fede Almanzor", id: "fede-almanzor" },
        { name: "Gkirin", id: "gkirin" },
        { name: "Jordan", id: "jordan" },
        { name: "Toni Garcia", id: "toni-garcia" },
        { name: "Fran Dmenchi", id: "fran-dmenchi" }
      ],
      images: [
        getStyleImage("color-realism", 1),
        getStyleImage("color-realism", 2),
        getStyleImage("color-realism", 3),
        getStyleImage("color-realism", 4),
        getStyleImage("color-realism", 5)
      ]
    },
    {
      id: "fineline-conceptual",
      name: "Fineline-Conceptual",
      description: "Delicate, clean lines perfect for minimalistic and highly detailed tattoo designs.",
      masters: [
        { name: "Fede Almanzor", id: "fede-almanzor" },
        { name: "Gkirin", id: "gkirin" },
        { name: "Jordan", id: "jordan" },
        { name: "Toni Garcia", id: "toni-garcia" },
        { name: "Fran Dmenchi", id: "fran-dmenchi" }
      ],
      images: [
        getStyleImage("fineline-conceptual", 1),
        getStyleImage("fineline-conceptual", 2),
        getStyleImage("fineline-conceptual", 3),
        getStyleImage("fineline-conceptual", 4),
        getStyleImage("fineline-conceptual", 5)
      ]
    },
    {
      id: "neotraditional",
      name: "Neotraditional",
      description: "Bold outlines, rich colors, and stylized designs inspired by classic tattoo traditions.",
      masters: [
        { name: "Fede Almanzor", id: "fede-almanzor" },
        { name: "Gkirin", id: "gkirin" },
        { name: "Jordan", id: "jordan" },
        { name: "Toni Garcia", id: "toni-garcia" },
        { name: "Fran Dmenchi", id: "fran-dmenchi" }
      ],
      images: [
        getStyleImage("neotraditional", 1),
        getStyleImage("neotraditional", 2),
        getStyleImage("neotraditional", 3),
        getStyleImage("neotraditional", 4),
        getStyleImage("neotraditional", 5)
      ]
    },
    {
      id: "pet-portraits",
      name: "Pet Portraits",
      description: "Detailed pet portraits that capture your companion’s unique soul and expression.",
      masters: [
        { name: "Fede Almanzor", id: "fede-almanzor" },
        { name: "Gkirin", id: "gkirin" },
        { name: "Jordan", id: "jordan" },
        { name: "Toni Garcia", id: "toni-garcia" },
        { name: "Fran Dmenchi", id: "fran-dmenchi" }
      ],
      images: [
        getStyleImage("pet-portraits", 1),
        getStyleImage("pet-portraits", 2),
        getStyleImage("pet-portraits", 3),
        getStyleImage("pet-portraits", 4),
        getStyleImage("pet-portraits", 5)
      ]
    },
    {
      id: "portraits",
      name: "Portraits",
      description: "Lifelike black and grey and color portraits capturing human emotion and depth with exceptional detail.",
      masters: [
        { name: "Fede Almanzor", id: "fede-almanzor" },
        { name: "Gkirin", id: "gkirin" },
        { name: "Jordan", id: "jordan" },
        { name: "Toni Garcia", id: "toni-garcia" },
        { name: "Fran Dmenchi", id: "fran-dmenchi" }
      ],
      images: [
        getStyleImage("portraits", 1),
        getStyleImage("portraits", 2),
        getStyleImage("portraits", 3),
        getStyleImage("portraits", 4),
        getStyleImage("portraits", 5)
      ]
    }
  ];  const handleUpdateScrollIndicators = () => {
    const el = sliderRef.current;
    if (el) {
      // Hide Left if we are near the very beginning of the scroll container
      setShowLeftBtn(el.scrollLeft > 5);
      // Show Right if we haven't reached the end
      const fullyScrolledToRight = el.scrollLeft >= el.scrollWidth - el.clientWidth - 15;
      setShowRightBtn(!fullyScrolledToRight);
    }
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (el) {
      el.addEventListener("scroll", handleUpdateScrollIndicators);
      // Run once at loading initial state
      handleUpdateScrollIndicators();
      // Additional small delay to ensure rendering context is complete
      const timer = setTimeout(handleUpdateScrollIndicators, 100);
      window.addEventListener("resize", handleUpdateScrollIndicators);
      return () => {
        el.removeEventListener("scroll", handleUpdateScrollIndicators);
        window.removeEventListener("resize", handleUpdateScrollIndicators);
        clearTimeout(timer);
      };
    }
  }, []);

  const slideInDirection = (dir: "left" | "right") => {
    const el = sliderRef.current;
    if (el) {
      // Find out the size of a single card child to scroll precisely by one item + gap
      const card = el.querySelector("[id^='style-card-']");
      const scrollAmt = card ? card.clientWidth + 20 : el.clientWidth;
      const scrollVal = dir === "left" ? -scrollAmt : scrollAmt;
      el.scrollBy({ left: scrollVal, behavior: "smooth" });
      setTimeout(handleUpdateScrollIndicators, 350);
    }
  };

  return (
    <div
      id="styles-catalog-section"
      className="bg-black py-24 md:py-32 text-white border-t border-white/10 relative"
    >
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Centered Heading Section with Increased Text Size */}
        <div className="text-center space-y-6 max-w-3xl mx-auto pb-4">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.4em] text-[#C5A059] flex items-center justify-center gap-2 font-black">
            <Compass className="w-4 h-4 shrink-0 text-[#C5A059] animate-spin-slow" />
            STYLES CATALOG
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif tracking-tight text-white uppercase font-black leading-tight drop-shadow-md">
            Masters in different styles
          </h2>
          <p className="text-neutral-300 font-sans text-xs sm:text-sm md:text-base tracking-wide leading-relaxed max-w-2xl mx-auto font-light">
            Outstanding for mastering the most important styles. Explore our different masterworks in portrait layout and find your perfect inspiration.
          </p>

          {/* Luxury Segmented Toggle with Glassmorphism */}
          <div className="flex items-center justify-center pt-2">
            <div className="bg-white/[0.03] border border-white/10 p-1 flex rounded-xl backdrop-blur-md">
              <button
                id="style-toggle-carousel"
                onClick={() => setViewMode("carousel")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                  viewMode === "carousel"
                    ? "bg-[#C5A059] text-black font-bold shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                Carousel
              </button>
              <button
                id="style-toggle-grid"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#C5A059] text-black font-bold shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                Grid view
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic sliding / grid container wrapper with Left/Right Buttons based on viewMode */}
        <div className="relative group/carousel px-1">
          {/* Absolute Left Scroll Arrow trigger */}
          {viewMode === "carousel" && (
            <div className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-45 flex flex-col items-center">
              <AnimatePresence>
                {isHoveringLeft && showLeftBtn && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className="absolute bottom-12 sm:bottom-16 bg-neutral-950 text-[10px] font-mono border border-[#C5A059] text-[#C5A059] px-3 py-1.5 tracking-widest uppercase rounded shadow-[0_4px_25px_rgba(0,0,0,0.95)] z-40 whitespace-nowrap hidden sm:block"
                  >
                    PREVIOUS STYLE
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {showLeftBtn && (
                  <motion.button
                    id="style-nav-btn-left"
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -10 }}
                    onClick={() => slideInDirection("left")}
                    onMouseEnter={() => setIsHoveringLeft(true)}
                    onMouseLeave={() => setIsHoveringLeft(false)}
                    className="h-10 w-10 sm:h-14 sm:w-14 bg-black/90 backdrop-blur-md border border-[#C5A059] text-[#C5A059] flex items-center justify-center rounded-full hover:bg-[#C5A059] hover:text-black hover:scale-110 active:scale-95 transition-all shadow-2xl cursor-pointer"
                    title="Scroll Left"
                  >
                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Absolute Right Scroll Arrow trigger */}
          {viewMode === "carousel" && (
            <div className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-45 flex flex-col items-center">
              <AnimatePresence>
                {isHoveringRight && showRightBtn && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className="absolute bottom-12 sm:bottom-16 bg-neutral-950 text-[10px] font-mono border border-[#C5A059] text-[#C5A059] px-3 py-1.5 tracking-widest uppercase rounded shadow-[0_4px_25px_rgba(0,0,0,0.95)] z-40 whitespace-nowrap hidden sm:block"
                  >
                    NEXT STYLE
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {showRightBtn && (
                  <motion.button
                    id="style-nav-btn-right"
                    initial={{ opacity: 0, scale: 0.8, x: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 10 }}
                    onClick={() => slideInDirection("right")}
                    onMouseEnter={() => setIsHoveringRight(true)}
                    onMouseLeave={() => setIsHoveringRight(false)}
                    className="h-10 w-10 sm:h-14 sm:w-14 bg-black/90 backdrop-blur-md border border-[#C5A059] text-[#C5A059] flex items-center justify-center rounded-full hover:bg-[#C5A059] hover:text-black hover:scale-110 active:scale-95 transition-all shadow-2xl cursor-pointer"
                    title="Scroll Right"
                  >
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Core Horizontal line scroll-container - 3 elements on tablet, 4 elements on desktop */}
          <div
            id={viewMode === "carousel" ? "styles-inline-series-carousel" : "styles-grid-layout"}
            ref={viewMode === "carousel" ? sliderRef : undefined}
            className={
              viewMode === "carousel"
                ? "flex flex-row gap-5 overflow-x-auto scrollbar-hidden select-none pb-8 pt-2 scroll-smooth"
                : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8 pt-2"
            }
            style={
              viewMode === "carousel"
                ? {
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch",
                  }
                : undefined
            }
          >
            {styleSections.map((style) => {
              const customStyleDetails = getCustomStyleDetails();
              const overrideImages = customStyleDetails?.[style.id]?.portfolioImages || customStyleDetails?.[style.id]?.heroImages;
              const activeImages = (overrideImages && overrideImages.length >= 3) ? overrideImages : style.images;

              return (
                <div
                  id={`style-card-${style.id}`}
                  key={style.id}
                  onClick={() => onSelectStyle(style.id)}
                  className={`${
                    viewMode === "carousel"
                      ? "snap-center shrink-0 w-full sm:w-[280px] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)]"
                      : "w-full"
                  } flex flex-col bg-white/[0.01] backdrop-blur-md border border-white/[0.08] hover:border-[#C5A059]/40 hover:bg-white/[0.02] transition-all duration-300 p-5 min-h-[440px] rounded-2xl relative overflow-hidden text-left justify-start cursor-pointer group`}
                  style={{
                    boxShadow: "5px 5px 15px rgba(0,0,0,0.4), inset -1px -1px 3px rgba(255,255,255,0.01)"
                  }}
                >
                  {/* Backdrop blur effect in background */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#C5A059]/[0.01] blur-xl rounded-full pointer-events-none" />

                  {/* Single representative display image - Tall Portrait Aspect Aspect-[3/4] */}
                  <div
                    id={`style-preview-single-${style.id}`}
                    className="relative w-full aspect-[3/4] max-h-64 bg-[#0c0c0c] border border-white/5 overflow-hidden rounded-xl transition-transform"
                  >
                    <StyleCardImage styleId={style.id} styleName={style.name} images={activeImages} />

                    {/* Top Left Tap to Explore button - visible ONLY on hover as requested */}
                    <div className="absolute top-2.5 left-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <button
                        id={`style-explore-pill-${style.id}`}
                        className="px-2.5 py-1 text-[8px] font-mono uppercase font-black bg-black/70 backdrop-blur-md border border-[#C5A059]/45 text-[#C5A059] rounded-lg shadow-md tracking-wider flex items-center gap-1"
                      >
                        <Sparkles className="w-2.5 h-2.5 shrink-0 animate-pulse" />
                        <span>Tap to explore</span>
                      </button>
                    </div>
                  </div>

                  {/* Info of Style with minimal layout gap and increased font sizes for legibility */}
                  <div className="flex flex-col space-y-1.5 pt-3.5 text-left flex-grow">
                    <h3 className="text-base sm:text-lg md:text-xl font-serif font-black uppercase text-white tracking-wide group-hover:text-[#C5A059] transition-colors leading-tight">
                      {style.name}
                    </h3>

                    <p className="text-neutral-300 font-sans text-[11px] sm:text-[13px] leading-relaxed font-light line-clamp-3">
                      {style.description}
                    </p>
                  </div>

                  {/* Compact Mastered List with tightly squeezed spacing (reduced gap) */}
                  <div 
                    className="pt-2 border-t border-white/[0.04] space-y-1 mt-2"
                    onClick={(e) => e.stopPropagation()} // stop clicks on this container from triggering style detail redirect
                  >
                    <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider block font-bold">
                      Mastered by:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {style.masters.slice(0, 3).map((master) => (
                        <button
                          key={master.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onJumpToArtist(master.id);
                          }}
                          className="px-2 py-0.5 text-[9px] font-mono uppercase bg-white/[0.02] hover:bg-[#C5A059]/10 border border-white/[0.05] hover:border-[#C5A059]/30 text-neutral-300 hover:text-[#C5A059] transition-all duration-200 cursor-pointer rounded-lg font-medium"
                        >
                          {master.name}
                        </button>
                      ))}
                      {style.masters.length > 3 && (
                        <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase self-center bg-white/5 px-1.5 py-0.5 rounded leading-none">
                          +{style.masters.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
