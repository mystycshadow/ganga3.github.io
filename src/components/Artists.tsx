/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ARTISTS } from "../data/artists";
import { Artist } from "../types";
import { Calendar, Grid3X3, ChevronDown, ChevronUp, Search, SlidersHorizontal, RotateCcw, Sparkles } from "lucide-react";
import StylesCatalog from "./StylesCatalog";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { handleImageFallback } from "../utils/imageFallback";


interface ArtistsProps {
  artists?: Artist[];
  onSelectImage: (imageUrl: string, title: string, description?: string, artistName?: string) => void;
  onBookWithArtist: (artistId: string) => void;
  onSelectArtist?: (artist: Artist) => void;
  onJumpToArtist: (artistId: string) => void;
  onSelectStyle: (styleId: string) => void;
}

const STYLE_OPTIONS = [
  "Black & Gray Realism",
  "Blackwork",
  "Color Microrealism",
  "Color Realism",
  "Fineline-Conceptual",
  "Neotraditional",
  "Pet Portraits",
  "Portraits"
];

export function getArtistStyles(artist: Artist): string[] {
  if (artist.specialty) {
    const parts = artist.specialty.split(/[,;]+/).map(s => s.trim()).filter(Boolean);
    if (parts.length > 0) return parts;
  }
  const id = artist.id.toLowerCase();
  if (id.includes("fede")) return ["Neotraditional"];
  if (id.includes("gkirin")) return ["Black & Gray Realism"];
  if (id.includes("jordan")) return ["Fineline-Conceptual", "Black & Gray"];
  if (id.includes("toni")) return ["Portraits", "Black & Gray"];
  if (id.includes("fran")) return ["Fineline-Conceptual", "Black & Gray Microrealism"];
  if (id.includes("suan")) return ["Black & Gray Realism"];
  if (id.includes("ivan")) return ["Black & Gray Realism"];
  if (id.includes("cesar")) return ["Color Realism"];
  if (id.includes("bk")) return ["Black & Gray Realism", "Portraits"];
  if (id.includes("honart")) return ["Black & Gray Realism", "Color Realism", "Portraits"];
  if (id.includes("lewis")) return ["Black & Gray Realism", "Portraits"];
  if (id.includes("johan")) return ["Color Original Designs"];
  if (id.includes("dico")) return ["Fineline-Conceptual", "Blackwork", "Black & Gray Microrealism"];
  if (id.includes("guillermo")) return ["Black & Gray Realism", "Color Realism"];
  if (id.includes("hector")) return ["Black & Gray Realism"];
  if (id.includes("timor")) return ["Blackwork"];
  return [artist.specialty || "Black & Gray Realism"];
}

interface ArtistCardProps {
  key?: string;
  artist: Artist;
  onSelectArtist?: (artist: Artist) => void;
}

function ArtistCard({ artist, onSelectArtist }: ArtistCardProps) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Gather all valid image URLs (avatar + portfolio) - custom dynamic selection limited to exactly 3 images
  const images = [
    { url: artist.avatarUrl, type: "avatar" as const, index: undefined },
    ...(artist.portfolio || []).map((p, pIdx) => ({
      url: p.imageUrl,
      type: "portfolio" as const,
      index: pIdx + 1,
    }))
  ].filter(img => img.url).slice(0, 3);

  useEffect(() => {
    if (!isHovered || images.length <= 1) {
      setCurrentImgIdx(0);
      return;
    }
    const timer = setInterval(() => {
      setCurrentImgIdx((prev) => (prev + 1) % images.length);
    }, 1500);

    return () => clearInterval(timer);
  }, [isHovered, images.length]);

  const styles = getArtistStyles(artist);

  return (
    <div
      id={`artist-glass-card-${artist.id}`}
      onClick={() => onSelectArtist?.(artist)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col justify-between bg-black/40 backdrop-blur-xl border border-white/5 hover:border-[#C5A059]/40 rounded-3xl p-5 transition-all duration-500 hover:scale-[1.03] text-center cursor-pointer select-none origin-center relative overflow-hidden"
      style={{
        boxShadow:
          "0 20px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Spotlight glow effect behind the avatar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      {/* Portrait layout picture frame */}
      <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#C5A059]/50 transition-all duration-500 relative bg-[#090909] z-10 shadow-inner">
        {/* Golden gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-500 z-25 pointer-events-none" />

        <div className="absolute inset-0 w-full h-full z-0 bg-[#090909]">
          {images.map((img, idx) => (
            <img
              key={`${artist.id}-img-${idx}`}
              referrerPolicy="no-referrer"
              src={img.url}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              alt={`${artist.name} image ${idx}`}
              className={`absolute inset-0 w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.05] transition-all duration-700 ease-in-out ${
                idx === currentImgIdx ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              onError={(e) => handleImageFallback(e, img.type, artist.id, img.index)}
            />
          ))}
        </div>

        {/* Small gold corner borders */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

        {/* Dynamic cycling Dots overlay inside portrait photo */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {images.map((_, idx) => (
              <div
                key={`dot-${idx}`}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentImgIdx
                    ? "bg-[#C5A059] scale-125"
                    : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Name & Styles tightly coupled under the picture */}
      <div className="mt-5 space-y-1 text-center flex-grow flex flex-col justify-end z-10">
        <h4 className="text-[10px] sm:text-xs md:text-sm font-serif font-black uppercase text-white tracking-widest leading-normal group-hover:text-[#C5A059] transition-colors duration-200">
          {artist.name}
        </h4>
        
        <div className="flex flex-wrap gap-1 justify-center pt-1">
          <span className="text-[7px] sm:text-[8px] md:text-[9px] font-mono uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/20 px-2.5 py-0.5 rounded-full">
            {styles[0]}
          </span>
          {styles.length > 1 && (
            <span className="text-[7px] sm:text-[8px] bg-white/5 text-neutral-400 px-2 py-0.5 font-mono rounded-full leading-none border border-white/5">
              +{styles.length - 1}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Artists({
  artists,
  onSelectImage,
  onBookWithArtist,
  onSelectArtist,
  onJumpToArtist,
  onSelectStyle,
}: ArtistsProps) {
  const activeArtists = artists && artists.length > 0 ? artists : ARTISTS;

  // Search & Filter state
  const [searchText, setSearchText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Pagination count: show 8 artists initially on desktop, 6 on mobile
  const [showAllArtists, setShowAllArtists] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Initialize on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filtering calculation logic
  const filteredArtists = activeArtists.filter((artist) => {
    const matchesSearch = artist.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStyle =
      !selectedStyle ||
      artist.specialty.toLowerCase().includes(selectedStyle.toLowerCase()) ||
      artist.portfolio.some((item) => {
        const formattedCat = item.category.replace(/_/g, " ").toLowerCase();
        return formattedCat.includes(selectedStyle.toLowerCase());
      });

    return matchesSearch && matchesStyle;
  });

  const handleResetFilters = () => {
    setSearchText("");
    setSelectedStyle(null);
  };

  // Limit output based on pagination
  const initialCount = isMobile ? 6 : 8;
  const visibleArtists = showAllArtists ? filteredArtists : filteredArtists.slice(0, initialCount);

  return (
    <div
      id="artists-section"
      className="bg-[#050505] py-10 md:py-16 text-white border-t border-white/10 relative"
    >
      <div className="absolute inset-0 bg-[url('/images/artists/artists_bg_container.png')] bg-cover bg-center opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 space-y-12 relative z-10">
        {/* Meet our artists Heading Section in exact user sequence */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-serif text-white uppercase font-black tracking-wide leading-tight">
            Meet our artists
          </h2>
          <p className="max-w-xl mx-auto text-neutral-300 font-sans text-[10px] sm:text-xs md:text-sm tracking-wide leading-relaxed">
            International artists from all over the world reunite at Ganga Studio. Considered the best tattoo artists in Los Angeles
          </p>
          <div className="h-[1.5px] w-20 bg-[#C5A059] mx-auto mt-4" />
        </div>

        {/* Filter Trigger Row */}
        <div className="flex flex-wrap gap-4 items-center justify-center pt-2">
          {/* Glassy Filter Button */}
          <button
            id="artist-filter-dropdown-btn"
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className={`px-5 py-2.5 text-xs font-mono uppercase tracking-widest border transition-all duration-300 flex items-center gap-2 cursor-pointer rounded-xl ${
              filterDrawerOpen || selectedStyle || searchText
                ? "bg-[#C5A059] text-black border-[#C5A059] font-black"
                : "bg-white/[0.02] border-white/15 hover:border-[#C5A059]/40 text-neutral-200"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter {selectedStyle || searchText ? "(Active)" : ""}</span>
          </button>

          {/* Reset button */}
          <button
            id="artist-filter-reset-btn"
            onClick={handleResetFilters}
            className="px-5 py-2.5 text-xs font-mono uppercase tracking-widest bg-white/[0.02] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-2 cursor-pointer text-neutral-400 hover:text-white rounded-xl"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Filter Drawer panel */}
        <AnimatePresence>
          {filterDrawerOpen && (
            <motion.div
              id="artist-filter-cabinet"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden bg-white/[0.02] backdrop-blur-md border border-white/10 p-6 md:p-8 space-y-6 rounded-2xl"
            >
              {/* Search input bar */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest block font-bold">
                  artist search filter
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    id="artist-name-search-input"
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search by name"
                    className="w-full bg-[#0d0d0d] border border-white/10 py-3.5 pl-11 pr-4 text-sm font-sans tracking-wide text-white focus:outline-none focus:border-[#C5A059]/50 transition-colors rounded-xl"
                  />
                </div>
              </div>

              {/* Style options buttons list */}
              <div className="space-y-3 text-left">
                <label className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest block font-bold">
                  Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {STYLE_OPTIONS.map((styleOpt) => {
                    const isSelected = selectedStyle === styleOpt;
                    return (
                      <button
                        id={`filter-style-chip-${styleOpt.toLowerCase().replace(/\s+/g, "-")}`}
                        key={styleOpt}
                        onClick={() => setSelectedStyle(isSelected ? null : styleOpt)}
                        className={`px-3 py-2 text-[10px] font-mono uppercase tracking-wide border rounded-xl transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-[#C5A059] border-[#C5A059] text-black font-black"
                            : "bg-[#0b0b0b] border-white/10 text-neutral-300 hover:border-white/30"
                        }`}
                      >
                        {styleOpt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4 artists per line (responsive) with 3D glass effect & rounded corners */}
        <div className="space-y-10 pt-4">
          {visibleArtists.length === 0 ? (
            <div
              id="no-matching-artists-plate"
              className="bg-[#0b0b0b] border border-white/5 py-16 text-center space-y-3 rounded-2xl"
            >
              <span className="text-[#C5A059] text-3xl">🎚️</span>
              <h4 className="text-base font-serif font-bold uppercase tracking-wide">
                No Artists Match Your Filters
              </h4>
              <p className="text-xs text-neutral-400 font-sans max-w-sm mx-auto">
                Try resetting the filters to view our complete Los Angeles team list.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 bg-[#C5A059] text-black text-[10px] font-mono uppercase tracking-widest font-black rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {visibleArtists.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  onSelectArtist={onSelectArtist}
                />
              ))}
            </div>
          )}
        </div>



          {/* Show More toggle button at the bottom of the artists list */}
          {filteredArtists.length > initialCount && (
            <div id="more-artists-expand-drawer" className="pt-10 flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A059]">
                More artists
              </span>
              <button
                id="show-more-artists-btn"
                onClick={() => setShowAllArtists(!showAllArtists)}
                className="px-6 py-3.5 border border-white/10 hover:border-[#C5A059]/50 bg-white/[0.02] text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-widest hover:bg-white/[0.04] transition-all rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>{showAllArtists ? "Show less artists" : "Show more artists"}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#C5A059] transition-transform duration-300 ${
                    showAllArtists ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          )}

        <StylesCatalog
          onSelectImage={onSelectImage}
          onJumpToArtist={onJumpToArtist}
          onSelectStyle={onSelectStyle}
        />
      </div>
    </div>
  );
}
