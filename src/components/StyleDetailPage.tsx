/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Calendar, Sparkles, Check, Play, Pause, X } from "lucide-react";
import { handleImageFallback } from "../utils/imageFallback";
import { getCustomStyleDetails } from "../utils/db";


interface StyleDetailPageProps {
  styleId: string;
  onBack: () => void;
  onBookNow: (styleValue: string) => void;
  onSelectImage: (
    imageUrl: string,
    title: string,
    description?: string,
    artistName?: string,
    items?: { imageUrl: string; title: string; description?: string; artistName?: string }[],
    currentIndex?: number
  ) => void;
}

interface StyleDetailInfo {
  title1: string;
  subtitle: string;
  description: string;
  featuredHeading: string;
  bookingLabel: string;
  heroImages: string[]; // 3 portrait photos that should cover the page
  portfolioImages: string[]; // for the projects below (at least 5 images)
}

const STYLE_DETAILS_MAP: Record<string, StyleDetailInfo> = {
  "black-grey-realism": {
    title1: "Black & Gray Realism",
    subtitle: "Black & Gray Realism, The Most Popular Style.",
    description: "B&G Realism uses smooth gradients and precise details to create lifelike images in black and grey. It's ideal for emotional portraits, religious iconography, and fine-art-inspired tattoos with a dramatic, elegant look that ages beautifully over time.",
    featuredHeading: "Featured Black & Gray Realism projects.",
    bookingLabel: "BOOK BLACK & GRAY REALISM",
    heroImages: [
      "/images/styles/black-grey-realism-bg-1.png",
      "/images/styles/black-grey-realism-bg-2.png",
      "/images/styles/black-grey-realism-bg-3.png"
    ],
    portfolioImages: [
      "/images/styles/black-grey-realism-1.png",
      "/images/styles/black-grey-realism-2.png",
      "/images/styles/black-grey-realism-3.png",
      "/images/styles/black-grey-realism-4.png",
      "/images/styles/black-grey-realism-5.png"
    ]
  },
  "black-grey-microrealism": {
    title1: "Black & Gray Microrealism",
    subtitle: "Black & Grey Microrealism, The Most Popular Style.",
    description: "Black & Grey Microrealism focuses on creating ultra-detailed designs at a smaller scale. Using fine lines and soft gradients, this style is perfect for minimalist yet realistic portraits or delicate symbolic pieces with remarkable precision.",
    featuredHeading: "Featured Black & Gray Microrealism Projects.",
    bookingLabel: "BOOK BLACK & GRAY MICROREALISM",
    heroImages: [
      "/images/styles/black-grey-microrealism-bg-1.png",
      "/images/styles/black-grey-microrealism-bg-2.png",
      "/images/styles/black-grey-microrealism-bg-3.png"
    ],
    portfolioImages: [
      "/images/styles/black-grey-microrealism-1.png",
      "/images/styles/black-grey-microrealism-2.png",
      "/images/styles/black-grey-microrealism-3.png",
      "/images/styles/black-grey-microrealism-4.png",
      "/images/styles/black-grey-microrealism-5.png"
    ]
  },
  "black-grey-sculptures": {
    title1: "Black & Gray Realism Sculptures",
    subtitle: "Black & Gray Realism Focused on Sculptures.",
    description: "This substyle captures the depth and texture of statues and sacred imagery with soft shading and precision. Perfect for honoring faith or classical art, these pieces recreate marble, stone, and spiritual icons in stunning black and grey.",
    featuredHeading: "Featured Black & Gray Realism Sculptures Projects.",
    bookingLabel: "BOOK BLACK & GRAY REALISM SCULPTURES",
    heroImages: [
      "/images/styles/black-grey-sculptures-bg-1.png",
      "/images/styles/black-grey-sculptures-bg-2.png",
      "/images/styles/black-grey-sculptures-bg-3.png"
    ],
    portfolioImages: [
      "/images/styles/black-grey-sculptures-1.png",
      "/images/styles/black-grey-sculptures-2.png",
      "/images/styles/black-grey-sculptures-3.png",
      "/images/styles/black-grey-sculptures-4.png",
      "/images/styles/black-grey-sculptures-5.png"
    ]
  },
  "black-grey-big-pieces": {
    title1: "Black & Gray Realism Big Pieces",
    subtitle: "Large-scale black and grey masterworks.",
    description: "Breathtaking backpieces, chestpieces, and full sleeves that map across muscle groups with maximum artistic flow. Heavy saturation, structural depth, and highly optimized dimensions.",
    featuredHeading: "Featured Black & Gray Realism Big Pieces Projects.",
    bookingLabel: "BOOK BLACK & GRAY REALISM BIG PIECES",
    heroImages: [
      "/images/styles/black-grey-big-pieces-bg-1.png",
      "/images/styles/black-grey-big-pieces-bg-2.png",
      "/images/styles/black-grey-big-pieces-bg-3.png"
    ],
    portfolioImages: [
      "/images/styles/black-grey-big-pieces-1.png",
      "/images/styles/black-grey-big-pieces-2.png",
      "/images/styles/black-grey-big-pieces-3.png",
      "/images/styles/black-grey-big-pieces-4.png",
      "/images/styles/black-grey-big-pieces-5.png"
    ]
  },
  "blackwork": {
    title1: "Blackwork",
    subtitle: "Blackwork, A Striking Style.",
    description: "Blackwork is a striking style that uses solid black ink to create bold, graphic designs. From geometric patterns to symbolic imagery, this approach offers a powerful visual impact with minimalist or intricate execution.",
    featuredHeading: "Featured Blackwork Projects.",
    bookingLabel: "BOOK BLACKWORK",
    heroImages: [
      "/images/styles/blackwork-bg-1.png",
      "/images/styles/blackwork-bg-2.png",
      "/images/styles/blackwork-bg-3.png"
    ],
    portfolioImages: [
      "/images/styles/blackwork-1.png",
      "/images/styles/blackwork-2.png",
      "/images/styles/blackwork-3.png",
      "/images/styles/blackwork-4.png",
      "/images/styles/blackwork-5.png"
    ]
  },
  "color-original-designs": {
    title1: "Color Original Designs",
    subtitle: "Color Original Designs, A Colorful Yet Unique Style.",
    description: "Color Abstract is a modern, expressive style that blends bold pigments with artistic freedom. Perfect for those who want something unique, this style breaks traditional rules to create vibrant, flowing designs full of personality and movement.",
    featuredHeading: "Featured Color Original Designs Projects.",
    bookingLabel: "BOOK COLOR ORIGINAL DESIGNS",
    heroImages: [
      "/images/styles/color-original-designs-bg-1.png",
      "/images/styles/color-original-designs-bg-2.png",
      "/images/styles/color-original-designs-bg-3.png"
    ],
    portfolioImages: [
      "/images/styles/color-original-designs-1.png",
      "/images/styles/color-original-designs-2.png",
      "/images/styles/color-original-designs-3.png",
      "/images/styles/color-original-designs-4.png",
      "/images/styles/color-original-designs-5.png"
    ]
  },
  "color-microrealism": {
    title1: "Color Microrealism",
    subtitle: "Color Microrealism, A Unique And Detailed Style.",
    description: "Color Microrealism delivers hyper-realistic designs in compact formats. Ideal for subtle tattoos with emotional impact, this style combines vibrant hues and precise technique to create miniature works of art with stunning realism.",
    featuredHeading: "Featured Color Microrealism Projects.",
    bookingLabel: "BOOK COLOR MICROREALISM",
    heroImages: [
      "/images/styles/color-microrealism-bg-1.png",
      "/images/styles/color-microrealism-bg-2.png",
      "/images/styles/color-microrealism-bg-3.png"
    ],
    portfolioImages: [
      "/images/styles/color-microrealism-1.png",
      "/images/styles/color-microrealism-2.png",
      "/images/styles/color-microrealism-3.png",
      "/images/styles/color-microrealism-4.png",
      "/images/styles/color-microrealism-5.png"
    ]
  },
  "color-realism": {
    title1: "Color Realism",
    subtitle: "Color Realism, A Lifelike And Vibrant Style.",
    description: "Color Realism uses rich, vivid tones and advanced shading techniques to recreate lifelike images on the skin. Whether it's a large-scale composition or a vibrant portrait, this style brings out incredible realism through color depth and detail.",
    featuredHeading: "Featured Color Realism Projects.",
    bookingLabel: "BOOK COLOR REALISM",
    heroImages: [
      "/images/styles/color-realism-bg-1.png",
      "/images/styles/color-realism-bg-2.png",
      "/images/styles/color-realism-bg-3.png"
    ],
    portfolioImages: [
      "/images/styles/color-realism-1.png",
      "/images/styles/color-realism-2.png",
      "/images/styles/color-realism-3.png",
      "/images/styles/color-realism-4.png",
      "/images/styles/color-realism-5.png"
    ]
  },
  "fineline-conceptual": {
    title1: "Fineline-Conceptual",
    subtitle: "Fineline tattoos, The Most Hyped Style.",
    description: "Fineline tattoos are characterized by their ultra-thin lines and refined detail. Ideal for minimalistic art, script, or intricate patterns, this style emphasizes subtlety, elegance, and precision, making it perfect for timeless, sophisticated pieces.",
    featuredHeading: "Featured Fineline-Conceptual Projects.",
    bookingLabel: "BOOK FINELINE-CONCEPTUAL",
    heroImages: [
      "/images/styles/fineline-conceptual-bg-1.png",
      "/images/styles/fineline-conceptual-bg-2.png",
      "/images/styles/fineline-conceptual-bg-3.png"
    ],
    portfolioImages: [
      "/images/styles/fineline-conceptual-1.png",
      "/images/styles/fineline-conceptual-2.png",
      "/images/styles/fineline-conceptual-3.png",
      "/images/styles/fineline-conceptual-4.png",
      "/images/styles/fineline-conceptual-5.png"
    ]
  },
  "neotraditional": {
    title1: "Neotraditional",
    subtitle: "Neotraditional, A Modern Twist On Classic Tattoos.",
    description: "Neotraditional blends the bold lines of traditional tattoos with modern flair and realism. Featuring strong shading, elegant details, and vibrant color palettes, this style brings a fresh twist to classic imagery with depth and attitude.",
    featuredHeading: "Featured Neotraditional Projects.",
    bookingLabel: "BOOK NEOTRADITIONAL",
    heroImages: [
      "/images/styles/neotraditional-bg-1.png",
      "/images/styles/neotraditional-bg-2.png",
      "/images/styles/neotraditional-bg-3.png"
    ],
    portfolioImages: [
      "/images/styles/neotraditional-1.png",
      "/images/styles/neotraditional-2.png",
      "/images/styles/neotraditional-3.png",
      "/images/styles/neotraditional-4.png",
      "/images/styles/neotraditional-5.png"
    ]
  },
  "pet-portraits": {
    title1: "Pet Portraits",
    subtitle: "Pet Portraits, A Heartfelt Tribute To Your Best Friend.",
    description: "These tattoos memorialize or celebrate pets with realistic shading and fine detail. Whether it’s the glint in the eyes or the texture of fur, B&G and color pet portraits turn beloved animals into lasting art on your skin.",
    featuredHeading: "Featured Pet Portraits Projects.",
    bookingLabel: "BOOK PET PORTRAITS",
    heroImages: [
      "/images/styles/pet-portraits-bg-1.png",
      "/images/styles/pet-portraits-bg-2.png",
      "/images/styles/pet-portraits-bg-3.png"
    ],
    portfolioImages: [
      "/images/styles/pet-portraits-1.png",
      "/images/styles/pet-portraits-2.png",
      "/images/styles/pet-portraits-3.png",
      "/images/styles/pet-portraits-4.png",
      "/images/styles/pet-portraits-5.png"
    ]
  },
  "portraits": {
    title1: "Portraits",
    subtitle: "Portraits, A Timeless Tribute To Human Emotion.",
    description: "Portraits focus on emotion and personality, using light and shadow to highlight every expression. This style is perfect for tributes to loved ones, icons, or artistic representations with timeless elegance.",
    featuredHeading: "Featured Portraits Projects.",
    bookingLabel: "BOOK PORTRAITS",
    heroImages: [
      "/images/styles/portraits-bg-1.png",
      "/images/styles/portraits-bg-2.png",
      "/images/styles/portraits-bg-3.png"
    ],
    portfolioImages: [
      "/images/styles/portraits-1.png",
      "/images/styles/portraits-2.png",
      "/images/styles/portraits-3.png",
      "/images/styles/portraits-4.png",
      "/images/styles/portraits-5.png"
    ]
  }
};

export default function StyleDetailPage({ styleId, onBack, onBookNow, onSelectImage }: StyleDetailPageProps) {
  const customStyleDetails = getCustomStyleDetails();
  const rawDetails = (customStyleDetails && customStyleDetails[styleId]) 
    ? customStyleDetails[styleId] 
    : (STYLE_DETAILS_MAP[styleId] || STYLE_DETAILS_MAP["black-grey-realism"]);
  
  // Merge default values with any custom overrides
  const details = {
    ...(STYLE_DETAILS_MAP["black-grey-realism"] || {}),
    ...(STYLE_DETAILS_MAP[styleId] || {}),
    ...(rawDetails || {})
  };

  
  // Standard state

  return (
    <div id="style-detail-view" className="bg-black text-white min-h-screen font-sans text-left relative selection:bg-[#C5A059] selection:text-neutral-900">
      
      {/* Absolute Back Button */}
      <div className="absolute top-6 left-6 z-40">
        <button
          id="btn-style-detail-back"
          onClick={onBack}
          className="flex items-center gap-2.5 px-4 py-2 bg-black/70 backdrop-blur-md border border-white/10 text-white hover:text-[#C5A059] hover:border-[#C5A059] font-mono text-xs uppercase tracking-widest transition-all rounded-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Studio</span>
        </button>
      </div>

      {/* 
        HERO SECTION: 100vh height
        "the page should have 3 different potrait photos that i will upload the images should cover the whole page from up and down and across." 
      */}
      <div className="relative h-screen w-full overflow-hidden flex flex-col justify-end">
        
        {/* The 3 PORTRAIT photos side by side covering the whole viewport */}
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3 h-full w-full">
          {details.heroImages.map((imgUrl, index) => (
            <div key={index} className="relative h-full w-full overflow-hidden border-r border-white/10 bg-neutral-950 flex flex-col justify-center items-center">
              {/* Subtle visual gradient tint on each image column */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/90 z-10" />
              <img
                src={imgUrl}
                referrerPolicy="no-referrer"
                fetchPriority="high"
                loading="eager"
                decoding="async"
                alt={`${details.title1} Portrait Showcase ${index + 1}`}
                className="h-full w-full object-cover scale-100 hover:scale-105 duration-1000 transition-transform ease-out opacity-100"
                onError={(e) => handleImageFallback(e, 'style-bg', styleId, index + 1)}
              />
              
              {/* Removed overlay */}
            </div>
          ))}
        </div>

        {/* 
          OVERLAY HERO FOOTER: 100% visible before the user starts scrolling!
          "then almost at the bottom but not very low will be the title1 for the style then below that a button for ' BOOK( STYLE NAME)' All this should be seen before the user starts scrolling."
        */}
        <div className="relative z-20 pb-20 md:pb-24 pt-32 px-6 text-center max-w-4xl mx-auto space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-1"
          >
            <span className="text-[10px] sm:text-xs font-mono text-[#C5A059] uppercase tracking-[0.35em] font-black block">
              EXPERIENCE THE MASTERWORK
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black uppercase text-white tracking-tight leading-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
              {details.title1}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex justify-center"
          >
            <button
              id={`hero-book-style-btn`}
              onClick={() => onBookNow(styleId)}
              className="bg-[#C5A059] text-black px-10 py-4 text-[11px] font-mono font-black uppercase tracking-[0.2em] hover:bg-white hover:scale-102 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.9)] cursor-pointer"
            >
              {details.bookingLabel}
            </button>
          </motion.div>
        </div>

        {/* Atmospheric ambient line highlighting the end of the fold screen */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent z-20" />
      </div>

      {/* 
        BODY CONTENT SECTION Revealed upon scrolling 
      */}
      <div className="bg-black py-20 md:py-28 relative">
        <div className="max-w-5xl mx-auto px-6 space-y-16">
          
          {/* Style Explanation Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-white/5 pb-14">
            <div className="md:col-span-5 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-black block">
                ABOUT THE STYLE
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white uppercase tracking-tight leading-snug">
                {details.subtitle}
              </h2>
            </div>
            
            <div className="md:col-span-7">
              <p className="text-neutral-300 font-sans text-sm md:text-base leading-relaxed tracking-wide font-light">
                {details.description}
              </p>
            </div>
          </div>

          {/* Portfolio Presentation Area */}
          <div className="space-y-10">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif uppercase tracking-tight font-black text-white">
                {details.featuredHeading}
              </h3>
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                Exclusively compiled high-resolution captures from Atlanta sessions. Click any photo to enlarge.
              </p>
            </div>

            {/* Showcase Portfolio View Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-6xl mx-auto pt-6">
              {details.portfolioImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => {
                    const items = details.portfolioImages.map((src, idx) => ({
                      imageUrl: src,
                      title: `${details.title1} Masterpiece ${idx + 1}`,
                    }));
                    onSelectImage(img, `${details.title1} Masterpiece ${i + 1}`, undefined, undefined, items, i);
                  }}
                  className="aspect-[4/5] bg-[#0A0A0A] border border-white/10 hover:border-[#C5A059]/50 hover:shadow-[0_0_35px_rgba(197,160,89,0.4)] rounded-2xl overflow-hidden relative group cursor-pointer transition-all duration-500 shadow-xl"
                >
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors z-10" />
                  <img
                    src={img}
                    referrerPolicy="no-referrer"
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    alt={`Project masterpiece ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 duration-700 transition-transform opacity-90 group-hover:opacity-100"
                    onError={(e) => handleImageFallback(e, 'style', styleId, i + 1)}
                  />
                </div>
              ))}
            </div>

          </div>

          {/* Quick Reserve Footer inside style page */}
          <div className="bg-[#0c0c0c] border border-white/5 p-8 md:p-12 text-center rounded-sm relative overflow-hidden space-y-4">
            <h4 className="text-xl sm:text-2xl font-serif text-white uppercase font-bold tracking-wide">
              Secure This Signature Style in Atlanta
            </h4>
            <p className="text-xs text-neutral-400 font-sans max-w-xl mx-auto leading-relaxed">
              Our roster of elite resident masters are booking limited slots in late Spring. Connect for a secure booking of {details.title1} with personalized, custom-tailored mapping.
            </p>
            <div className="pt-2">
              <button
                id="btn-style-detail-direct-reserve"
                onClick={() => onBookNow(styleId)}
                className="px-8 py-3.5 bg-neutral-900 border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059] hover:text-black font-mono text-[10px] uppercase font-black tracking-widest transition-all duration-300"
              >
                BOOK {details.title1} DIRECTLY
              </button>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}
