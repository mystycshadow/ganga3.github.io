/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Artists from "./components/Artists";
import Celebrities from "./components/Celebrities";
import StudioTour from "./components/StudioTour";
import BookingSystem from "./components/BookingSystem";
import AdminDashboard from "./components/AdminDashboard";
import ArtistDetailPage from "./components/ArtistDetailPage";
import StyleDetailPage from "./components/StyleDetailPage";
import NoPain from "./components/NoPain";
import WorkWithUs from "./components/WorkWithUs";
import Contact from "./components/Contact";
import Lightbox from "./components/Lightbox";
import StylesCatalog from "./components/StylesCatalog";
import { Mail, Phone, MapPin, Clock, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { getCleanArtists, saveCleanArtists, getStudioContact } from "./utils/db";
import { Artist } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [artists, setArtists] = useState<Artist[]>(() => getCleanArtists());
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [backTargetTab, setBackTargetTab] = useState<string | null>(null);
  const currentContact = getStudioContact();

  const handleUpdateArtists = (updatedArtists: Artist[]) => {
    setArtists(updatedArtists);
    saveCleanArtists(updatedArtists);
  };

  const [tabHistory, setTabHistory] = useState<string[]>(["home"]);

  const handleSetActiveTab = (tab: string) => {
    setTabHistory((prev) => {
      if (prev[prev.length - 1] === tab) return prev;
      return [...prev, tab];
    });
    setActiveTab(tab);
    setSelectedArtist(null); // Swapping tabs resets detail views
    setSelectedStyleId(null);
  };

  const scrollToSection = (id: string) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  };

  const handleGoBack = () => {
    if (selectedArtist) {
      setSelectedArtist(null);
      if (backTargetTab) {
        setActiveTab(backTargetTab);
      }
      scrollToSection("artists-section");
      return;
    }
    if (selectedStyleId) {
      setSelectedStyleId(null);
      if (backTargetTab) {
        setActiveTab(backTargetTab);
      }
      scrollToSection("styles-catalog-section");
      return;
    }

    if (tabHistory.length > 1) {
      const newHistory = [...tabHistory];
      newHistory.pop(); // remove current tab
      const prevTab = newHistory[newHistory.length - 1] || "home";
      setTabHistory(newHistory);
      setActiveTab(prevTab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setActiveTab("home");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Lightbox overlay state. Any visual image clicked inside the app routes here!
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    description?: string;
    artistName?: string;
    items?: { imageUrl: string; title: string; description?: string; artistName?: string }[];
    startIndex?: number;
  }>({
    isOpen: false,
    imageUrl: "",
    title: "",
    description: "",
    artistName: "",
    items: [],
    startIndex: 0,
  });

  const handleOpenLightbox = (
    imageUrl: string,
    title: string,
    description?: string,
    artistName?: string,
    items?: { imageUrl: string; title: string; description?: string; artistName?: string }[],
    currentIndex?: number
  ) => {
    setLightbox({
      isOpen: true,
      imageUrl,
      title,
      description,
      artistName,
      items,
      startIndex: currentIndex || 0,
    });
  };

  const handleCloseLightbox = () => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
  };

  const handleBookWithArtistDirect = (artistId: string) => {
    setActiveTab("bookings");
    setSelectedArtist(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-[#C5A059] selection:text-neutral-900">
      {/* Prime Sticky Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        selectedArtistName={selectedArtist?.name}
      />

      {/* Main Container Viewport routing */}
      <main className="flex-grow">
        {activeTab !== "home" && activeTab !== "admin" && !selectedArtist && !selectedStyleId && (
          <div className="max-w-7xl mx-auto px-6 pt-6 -mb-2">
            <button
              id="global-universal-back-btn"
              onClick={handleGoBack}
              className="group flex items-center gap-2.5 px-4 py-2 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-md border border-white/10 hover:border-[#C5A059]/40 text-neutral-400 hover:text-[#C5A059] font-mono text-[10px] md:text-xs uppercase tracking-widest transition-all cursor-pointer rounded-none"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform animate-pulse" />
              <span>Back to Previous Page</span>
            </button>
          </div>
        )}
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {selectedStyleId ? (
                <StyleDetailPage
                  styleId={selectedStyleId}
                  onBack={() => {
                    setSelectedStyleId(null);
                    if (backTargetTab) {
                      setActiveTab(backTargetTab);
                    }
                    scrollToSection("styles-catalog-section");
                  }}
                  onBookNow={(styleIdVal) => {
                    setActiveTab("bookings");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onSelectImage={handleOpenLightbox}
                />
              ) : (
                <>
                  {/* Home comprises the unified brand clone presentation */}
                  <Hero
                    onExploreArtists={() => setActiveTab("artists")}
                    onBookNow={() => setActiveTab("bookings")}
                  />
                  <Artists
                    artists={artists}
                    onSelectImage={handleOpenLightbox}
                    onBookWithArtist={handleBookWithArtistDirect}
                    onSelectArtist={(artist) => {
                      setSelectedArtist(artist);
                      setActiveTab("artists");
                      setBackTargetTab("home");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onJumpToArtist={(artistId) => {
                      const target = artists.find((a) => a.id === artistId);
                      if (target) {
                        setSelectedArtist(target);
                        setActiveTab("artists");
                        setBackTargetTab("home");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      } else {
                        setActiveTab("artists");
                        setBackTargetTab("home");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    onSelectStyle={(styleId) => {
                      setSelectedStyleId(styleId);
                      setBackTargetTab("home");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />

                  {/* High-End Mid-page Call Action Section */}
                  <About />
                  <Celebrities
                    onSelectImage={handleOpenLightbox}
                    onBookWithArtist={handleBookWithArtistDirect}
                  />
                </>
              )}
            </motion.div>
          )}

          {activeTab === "artists" && (
            <motion.div
              key="artists-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {selectedArtist ? (
                <ArtistDetailPage
                  artist={selectedArtist}
                  onBack={() => {
                    setSelectedArtist(null);
                    if (backTargetTab) {
                      setActiveTab(backTargetTab);
                    }
                    scrollToSection("artists-section");
                  }}
                  onBook={(artistId) => {
                    setActiveTab("bookings");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onSelectImage={handleOpenLightbox}
                />
              ) : (
                <Artists
                  artists={artists}
                  onSelectImage={handleOpenLightbox}
                  onBookWithArtist={handleBookWithArtistDirect}
                  onSelectArtist={(artist) => {
                    setSelectedArtist(artist);
                    setBackTargetTab("artists");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onJumpToArtist={(artistId) => {
                    const target = artists.find((a) => a.id === artistId);
                    if (target) {
                      setSelectedArtist(target);
                      setBackTargetTab("artists");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    } else {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  onSelectStyle={(styleId) => {
                    setSelectedStyleId(styleId);
                    setActiveTab("home");
                    setBackTargetTab("home");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              )}
            </motion.div>
          )}

          {activeTab === "styles" && (
            <motion.div
              key="styles-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {selectedStyleId ? (
                <StyleDetailPage
                  styleId={selectedStyleId}
                  onBack={() => {
                    setSelectedStyleId(null);
                    if (backTargetTab) {
                      setActiveTab(backTargetTab);
                    }
                    scrollToSection("styles-catalog-section");
                  }}
                  onBookNow={(styleIdVal) => {
                    setActiveTab("bookings");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onSelectImage={handleOpenLightbox}
                />
              ) : (
                <div className="py-12 bg-black min-h-screen">
                  <StylesCatalog
                    onSelectImage={handleOpenLightbox}
                    onSelectStyle={(styleId) => {
                      setSelectedStyleId(styleId);
                      setBackTargetTab("styles");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onJumpToArtist={(artistId) => {
                      const target = artists.find((a) => a.id === artistId);
                      if (target) {
                        setSelectedArtist(target);
                        setActiveTab("artists");
                        setBackTargetTab("styles");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      } else {
                        setActiveTab("artists");
                        setBackTargetTab("styles");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                  />
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "nopain" && (
            <motion.div
              key="nopain-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <NoPain
                onBookNow={() => {
                  setActiveTab("bookings");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </motion.div>
          )}

          {activeTab === "studio" && (
            <motion.div
              key="studio-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <StudioTour 
                onSelectImage={handleOpenLightbox} 
                onBookClick={() => {
                  setActiveTab("bookings");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onExploreArtists={() => {
                  setActiveTab("artists");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </motion.div>
          )}

          {activeTab === "workwithus" && (
            <motion.div
              key="workwithus-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <WorkWithUs />
            </motion.div>
          )}

          {activeTab === "contact" && (
            <motion.div
              key="contact-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Contact />
            </motion.div>
          )}

          {activeTab === "bookings" && (
            <motion.div
              key="bookings-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <BookingSystem
                artists={artists}
                preselectedArtistId={selectedArtist?.id || undefined}
                preselectedStyleId={selectedStyleId || undefined}
                onBookingComplete={() => {
                  setActiveTab("home");
                  setSelectedArtist(null);
                  setSelectedStyleId(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </motion.div>
          )}

          {activeTab === "admin" && (
            <motion.div
              key="admin-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <AdminDashboard
                artists={artists}
                onUpdateArtists={handleUpdateArtists}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Interactive Lightbox Overlay */}
      <Lightbox
        isOpen={lightbox.isOpen}
        imageUrl={lightbox.imageUrl}
        title={lightbox.title}
        description={lightbox.description}
        artistName={lightbox.artistName}
        items={lightbox.items}
        startIndex={lightbox.startIndex}
        onClose={handleCloseLightbox}
        onBookWithArtist={() => {
          handleCloseLightbox();
          setActiveTab("bookings");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Elegant footer */}
      <footer className="bg-black text-white border-t border-white/[0.08] pt-16 pb-12 text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
          {/* Logo Brand portion */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex flex-col cursor-pointer" onClick={() => handleSetActiveTab("home")}>
              <span className="text-2xl font-serif font-black text-white tracking-[0.05em] uppercase">
                GANGA <span className="text-[#C5A059]">TATTOO</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-[0.35em] text-[#C5A059] mt-0.5 font-bold">
                Atlanta
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-sans tracking-wide leading-relaxed max-w-sm">
              We continue Joaquin Ganga's absolute premium standards, creating beautiful customized physical masterpieces tailored for the world's most selective curators.
            </p>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#C5A059]">
              Explore
            </h4>
            <div className="flex flex-col gap-2.5 text-xs font-mono tracking-widest text-neutral-400">
              <button
                id="footer-lnk-about"
                onClick={() => {
                  handleSetActiveTab("home");
                  setTimeout(() => {
                    document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="text-left hover:text-white transition-colors cursor-pointer"
              >
                About Studio
              </button>
              <button
                id="footer-lnk-artists"
                onClick={() => {
                  handleSetActiveTab("artists");
                }}
                className="text-left hover:text-white transition-colors cursor-pointer"
              >
                Resident Masters
              </button>
              <button
                id="footer-lnk-celebrities"
                onClick={() => {
                  handleSetActiveTab("celebrities");
                }}
                className="text-left hover:text-white transition-colors cursor-pointer"
              >
                VIP Portfolio
              </button>
              <button
                id="footer-lnk-bookings"
                onClick={() => {
                  handleSetActiveTab("bookings");
                }}
                className="text-left hover:text-[#C5A059] text-[#C5A059] font-semibold transition-colors uppercase cursor-pointer"
              >
                Reserve Session
              </button>
            </div>
          </div>

          {/* Coordinates section */}
          <div className="md:col-span-5 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#C5A059]">
              Atlanta Coordinates
            </h4>
            <div className="space-y-3.5 text-xs font-sans text-neutral-400">
              <p className="flex items-start gap-2 max-w-sm">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{currentContact.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A059]" />
                <span>{currentContact.email}</span>
              </p>
              {currentContact.showPhone !== false && (
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C5A059]" />
                  <span>{currentContact.phone}</span>
                </p>
              )}
              <p className="flex items-center gap-2 text-neutral-500 font-mono text-[10px]">
                <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>OPEN DAILY: 8:00 AM – 8:00 PM</span>
              </p>
            </div>
          </div>
        </div>

        {/* Closing copyright */}
        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 font-mono">
          <p>© {new Date().getFullYear()} Ganga Tattoo Atlanta Studio. All Rights Reserved.</p>
          <div className="flex gap-4">
            <button
              id="footer-admin-mode-toggle"
              onClick={() => {
                setIsAdmin(!isAdmin);
                setActiveTab(isAdmin ? "home" : "admin");
              }}
              className="hover:text-[#C5A059] transition-colors cursor-pointer text-[10px] uppercase font-mono tracking-wider flex items-center gap-1 opacity-60 hover:opacity-100"
            >
              <span>{isAdmin ? "Exit Portal" : "Staff Portal"}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
