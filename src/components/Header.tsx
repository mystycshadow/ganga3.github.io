/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Calendar, User, Eye, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  selectedArtistName?: string | null;
}

export default function Header({
  activeTab,
  setActiveTab,
  isAdmin,
  setIsAdmin,
  selectedArtistName,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const showAdminToggle = typeof window !== "undefined" && window.location.search.includes("admin=true");

  const navigationItems = [
    { id: "artists", label: "Artists" },
    { id: "styles", label: "Styles" },
    { id: "nopain", label: "No Pain" },
    { id: "studio", label: "Studio" },
    { id: "workwithus", label: "Work With Us" },
    { id: "contact", label: "Contact" },
  ];

  // Dynamically change book button to "Book [First Name]" if an artist is selected, or default to "Book now"
  const shortArtistName = selectedArtistName ? selectedArtistName.split(" ")[0] : "";
  const bookCtaText = shortArtistName ? `Book ${shortArtistName}` : "Book now";

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-20 flex items-center justify-between gap-2 overflow-hidden">
        {/* Logo Branding */}
        <motion.div
          id="logo-container"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col cursor-pointer select-none text-left shrink-0"
          onClick={() => {
            setActiveTab("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="text-[12px] sm:text-base md:text-xl lg:text-2xl font-serif font-black text-white tracking-[0.05em] uppercase hover:text-[#C5A059] transition-colors duration-300">
            GANGA <span className="text-[#C5A059] drop-shadow-[0_2px_10px_rgba(197,160,89,0.2)]">TATTOO</span>
          </span>
          <span className="text-[8px] sm:text-[10px] uppercase font-mono tracking-[0.25em] sm:tracking-[0.35em] text-[#C5A059] mt-0.5 font-bold">
            Atlanta
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 md:gap-6 lg:gap-8 text-[10px] md:text-[11px] uppercase tracking-[0.10em] lg:tracking-[0.2em] font-medium opacity-80 text-[#B3B3B3]">
          {navigationItems.map((item) => (
            <button
              id={`nav-${item.id}`}
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`relative py-2 transition-colors duration-300 hover:text-white uppercase inline-block whitespace-nowrap ${
                activeTab === item.id ? "text-[#C5A059]" : ""
              }`}
            >
              {item.label}
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C5A059]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Action Controls & Mobile Menu Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Studio admin portal switch */}
          {showAdminToggle && (
            <button
              id="toggle-admin-portal"
              onClick={() => {
                setIsAdmin(!isAdmin);
                setActiveTab(isAdmin ? "artists" : "admin");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`hidden sm:flex px-3 py-1.5 text-[9px] uppercase tracking-wider font-mono border rounded-none transition-all duration-300 items-center gap-1.5 cursor-pointer ${
                isAdmin
                  ? "bg-[#C5A059]/15 border-[#C5A059] text-[rgb(197,160,89)]"
                  : "bg-transparent border-white/10 text-white hover:bg-white/5 hover:border-white/35"
              }`}
            >
              {isAdmin ? (
                <>
                  <Eye className="w-3 h-3 animate-pulse" />
                  <span>Client View</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3" />
                  <span>Admin</span>
                </>
              )}
            </button>
          )}

          <button
            id="header-cta-book"
            onClick={() => {
              setActiveTab("bookings");
              setIsAdmin(false);
            }}
            className="bg-white text-black px-4 py-2 text-[10px] uppercase font-mono font-bold tracking-wider hover:bg-[#C5A059] hover:text-black transition-all duration-300 hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{bookCtaText}</span>
            <span className="sm:hidden">Book</span>
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-[#050505] border-b border-white/10"
          >
            <nav className="flex flex-col items-center py-6 gap-6 text-[11px] uppercase tracking-[0.2em] font-medium text-[#B3B3B3]">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`transition-colors duration-300 hover:text-white uppercase ${
                    activeTab === item.id ? "text-[#C5A059]" : ""
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
