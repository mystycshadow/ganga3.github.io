/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ARTISTS } from "../data/artists";
import { AppointmentBooking, Artist, TattooPlacement, TattooStyle } from "../types";
import { addBooking } from "../utils/db";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Instagram,
  Phone,
  Mail,
  UploadCloud,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  FileText,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
  Search,
  Check
} from "lucide-react";
import React, { useState, useRef, DragEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { handleImageFallback } from "../utils/imageFallback";

interface BookingSystemProps {
  artists?: Artist[];
  preselectedArtistId?: string;
  preselectedStyleId?: string;
  onBookingComplete: () => void;
}

export default function BookingSystem({
  artists,
  preselectedArtistId,
  preselectedStyleId,
  onBookingComplete,
}: BookingSystemProps) {
  const activeArtists = artists && artists.length > 0 ? artists : ARTISTS;

  // Booking progress state
  const [step, setStep] = useState(1);

  // Form Fields
  const [selectedArtistId, setSelectedArtistId] = useState<string>(() => {
    if (preselectedArtistId) return preselectedArtistId;
    return activeArtists[0]?.id || "fede-almanzor";
  });
  const [placement, setPlacement] = useState<TattooPlacement>("forearm");
  const [markerPos, setMarkerPos] = useState({ x: 26, y: 70 }); // interactive forearm front coordinate
  const [activeView, setActiveView] = useState<"front" | "back">("front");
  const [isHoldingMarker, setIsHoldingMarker] = useState(false);

  // Synchronize button clicks with marker positions on body map
  const handleSelectPlacement = (p: TattooPlacement) => {
    setPlacement(p);
    switch (p) {
      case "forearm":
        setMarkerPos({ x: 26, y: 70 });
        setActiveView("front");
        break;
      case "bicep":
        setMarkerPos({ x: 22, y: 42 });
        setActiveView("front");
        break;
      case "chest":
        setMarkerPos({ x: 55, y: 40 });
        setActiveView("front");
        break;
      case "back":
        setMarkerPos({ x: 145, y: 48 }); // Back side coordinates centered (offset x +100 for back panel)
        setActiveView("back");
        break;
      case "ribs":
        setMarkerPos({ x: 62, y: 52 });
        setActiveView("front");
        break;
      case "thigh":
        setMarkerPos({ x: 42, y: 105 });
        setActiveView("front");
        break;
      case "calf":
        setMarkerPos({ x: 145, y: 130 }); // Back side calf
        setActiveView("back");
        break;
      default:
        setMarkerPos({ x: 55, y: 80 });
        setActiveView("front");
        break;
    }
  };

  const handleMapInteract = (x: number, y: number, view: "front" | "back") => {
    setMarkerPos({ x, y });
    setActiveView(view);
    
    if (view === "back") {
      if (y < 35) {
        setPlacement("other");
      } else if (y < 85) {
        setPlacement("back");
      } else if (y < 120) {
        setPlacement("thigh");
      } else {
        setPlacement("calf");
      }
    } else { // front
      if (y < 28) {
        setPlacement("other");
      } else if (y >= 28 && y < 80) {
        if (x < 38 || x > 72) {
          if (y < 48) {
            setPlacement("bicep");
          } else {
            setPlacement("forearm");
          }
        } else {
          if (y < 48) {
            setPlacement("chest");
          } else {
            setPlacement("ribs");
          }
        }
      } else {
        if (y < 118) {
          setPlacement("thigh");
        } else {
          setPlacement("calf");
        }
      }
    }
  };
  const [style, setStyle] = useState<TattooStyle>(() => {
    if (!preselectedStyleId) return "hyperrealism";
    if (["black-grey-realism", "black-grey-sculptures", "black-grey-big-pieces", "portraits", "pet-portraits"].includes(preselectedStyleId)) {
      return "black_and_grey";
    }
    if (["black-grey-microrealism", "color-microrealism"].includes(preselectedStyleId)) {
      return "microrealism";
    }
    if (["color-realism", "color-original-designs"].includes(preselectedStyleId)) {
      return "color_realism";
    }
    if (["fineline-conceptual"].includes(preselectedStyleId)) {
      return "fine_line";
    }
    return "hyperrealism";
  });
  const [sizeInches, setSizeInches] = useState<number>(6);
  const [conceptDescription, setConceptDescription] = useState<string>("");
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [savedTattoos, setSavedTattoos] = useState<{
    placement: TattooPlacement;
    style: TattooStyle;
    sizeInches: number;
    markerPos: { x: number; y: number };
    activeView: "front" | "back";
  }[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("2026-06-18");
  const [selectedTime, setSelectedTime] = useState<string>("10:00 AM");

  // Client Info Form
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [clientInstagram, setClientInstagram] = useState<string>("");
  const [vipNotes, setVipNotes] = useState<string>("");
  const [isVipRequest, setIsVipRequest] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<AppointmentBooking | null>(null);

  // Drag and Drop File States
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleSvgInteraction = (
    e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>
  ) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;
    
    if ("touches" in e) {
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        return;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Calculate the absolute SVG relative coordinates (0 to 200 for x, -20 to 160 for y)
    const xPct = ((clientX - rect.left) / rect.width) * 200;
    const yPct = -20 + ((clientY - rect.top) / rect.height) * 180;
    
    const x = Math.max(5, Math.min(195, xPct));
    const y = Math.max(5, Math.min(155, yPct));
    
    const view = x >= 100 ? "back" : "front";
    handleMapInteract(Math.round(x), Math.round(y), view);
  };

  // Date Slots helper
  const dateSlots = [
    { label: "Thu, Jun 18", value: "2026-06-18" },
    { label: "Fri, Jun 19", value: "2026-06-19" },
    { label: "Sat, Jun 20", value: "2026-06-20" },
    { label: "Mon, Jun 22", value: "2026-06-22" },
    { label: "Tue, Jun 23", value: "2026-06-23" },
    { label: "Wed, Jun 24", value: "2026-06-24" },
  ];

  const timeSlots = ["8:00 AM", "10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM (VIP Spot)"];

  const placements: { value: TattooPlacement; label: string }[] = [
    { value: "forearm", label: "Forearm Sleeve" },
    { value: "bicep", label: "Bicep / Full Shoulder" },
    { value: "chest", label: "Chest Panel" },
    { value: "back", label: "Full Backpiece" },
    { value: "ribs", label: "Rib cage (Sensitive)" },
    { value: "thigh", label: "Thigh Canopy" },
    { value: "calf", label: "Calf Masterpiece" },
    { value: "other", label: "Other Specify" },
  ];

  const styles: { value: TattooStyle; label: string; desc: string }[] = [
    { value: "hyperrealism", label: "Hyperrealism", desc: "Photorealistic reproduction with flawless detailing." },
    { value: "black_and_grey", label: "Black & Grey", desc: "Classic smooth shading, diluted custom washes." },
    { value: "fine_line", label: "Fine Line", desc: "Ultra-discrete single needle geometry & minimalist art." },
    { value: "microrealism", label: "Microrealism", desc: "Intricate miniature details utilizing micro needles." },
    { value: "color_realism", label: "Color Realism", desc: "High-saturation vibrant light rendering." },
  ];

  // Drag & drop handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      appendFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = () => {
    if (fileInputRef.current?.files) {
      appendFiles(fileInputRef.current.files);
    }
  };

  const appendFiles = (files: FileList) => {
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Generate a mock base64 for preview purposes
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setReferenceImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReferenceImage = (idxToRemove: number) => {
    setReferenceImages((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleBookSubmit = async () => {
    if (!clientName || !clientEmail || !clientPhone) {
      alert("Please configure your required contact details (Name, Email, Phone).");
      return;
    }
    setIsSubmitting(true);
    const chosenArtist = activeArtists.find((a) => a.id === selectedArtistId) || activeArtists[0];

    // Combine saved selections into the explanation payload
    const savedSpecsSummary = savedTattoos.length > 0 
      ? `\n\n--- MULTI-TATTOO SPECIFICATIONS (${savedTattoos.length}) ---\n` + 
        savedTattoos.map((t, i) => `Tattoo #${i + 1}: Style="${t.style}", Placement="${t.placement}", Size=${t.sizeInches} inches, View=${t.activeView}`).join("\n")
      : "";

    // Convert or download reference images to permanent static backend paths
    const uploadedReferences: string[] = [];
    const clientSafeName = clientName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    
    for (let i = 0; i < referenceImages.length; i++) {
      const img = referenceImages[i];
      if (img.startsWith("data:") || img.startsWith("http")) {
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              base64: img.startsWith("data:") ? img : undefined,
              url: img.startsWith("http") ? img : undefined,
              type: "booking_ref",
              id: `${clientSafeName}-${Date.now()}`,
              index: i + 1,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.url) {
              uploadedReferences.push(data.url);
            } else {
              uploadedReferences.push(img);
            }
          } else {
            uploadedReferences.push(img);
          }
        } catch (err) {
          console.error("Failed storing booking ref image locally, using default representation:", err);
          uploadedReferences.push(img);
        }
      } else {
        uploadedReferences.push(img);
      }
    }

    try {
      const result = await addBooking({
        artistId: selectedArtistId,
        artistName: chosenArtist.name,
        date: selectedDate,
        timeSlot: selectedTime,
        placement,
        style,
        estimatedSizeInches: sizeInches,
        description: conceptDescription + savedSpecsSummary,
        referenceImages: uploadedReferences, // saved static file paths on server
        clientName,
        clientEmail,
        clientPhone,
        clientInstagram,
        urgency: (isVipRequest || selectedTime.includes("VIP")) ? "vip" : "standard",
        notes: isVipRequest 
          ? `[VIP SUITE EXPERIENCE REQUESTED]\n${vipNotes}`
          : vipNotes
      });

      // Dispatch email notification to gangatattooatlanta@gmail.com
      try {
        await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "booking",
            payload: result
          })
        });
      } catch (notifyErr) {
        console.error("Notification dispatch failed:", notifyErr);
      }

      setSubmissionResult(result);
      setStep(5);
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSizeFeedback = (inches: number) => {
    if (inches <= 3) return "Micro Fine Piece (~1-2 Hours)";
    if (inches <= 6) return "Medium Forearm Element (~3 Hours)";
    if (inches <= 9) return "Significant Arm/Shoulder Sleeve (~4-5 Hours)";
    return "Elite Multi-session Canvas (Full Day Custom Session)";
  };

  return (
    <div
      id="booking-module-container"
      className="bg-[#050505] min-h-[85vh] py-16 md:py-24 text-white border-t border-white/10"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Title Block */}
        {step < 5 && (
          <div className="text-center space-y-4 mb-12">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#C5A059]">
              Secure Appointment
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif tracking-tight text-white uppercase font-black">
              BOOK NOW
            </h2>
            <p className="text-[10px] sm:text-xs md:text-sm text-neutral-300 font-sans tracking-wide max-w-xl mx-auto">
              Configure your bespoke ink project details in our structured system. Your request will be directly updated in our active studio scheduling database.
            </p>

            {/* Visual Step indicators */}
            <div className="flex items-center justify-center gap-2 pt-6 max-w-md mx-auto font-bold">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <div
                    id={`booking-step-indicator-${s}`}
                    className={`h-1.5 rounded-none flex-1 transition-all duration-500 ${
                      step >= s ? "bg-[#C5A059]" : "bg-neutral-800"
                    }`}
                  />
                </div>
              ))}
            </div>
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest pt-2">
              Step {step} of 4:{" "}
              {step === 1 && "Choose Resident Artist"}
              {step === 2 && "Configure Design & Body Placement"}
              {step === 3 && "Secure Date & Hour slot"}
              {step === 4 && "Review & Submit Contact"}
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: SELECT ARTISTS */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-left"
            >
              <h3 className="text-lg font-serif uppercase tracking-wider text-white border-b border-white/10 pb-2 font-black">
                1. Select Master Specialist
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Dynamic Studio choice */}
                <button
                  id="artist-select-studio"
                  onClick={() => {
                    setSelectedArtistId("any-resident");
                    setStep(2);
                  }}
                  className={`p-5 rounded-none border text-left transition-all duration-300 relative ${
                    selectedArtistId === "any-resident"
                      ? "bg-[#111111] border-[#C5A059] shadow-[0_4px_20px_rgba(197,160,89,0.15)]"
                      : "bg-[#111111]/40 border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-none bg-[#050505] flex items-center justify-center border border-[#C5A059]/30 font-serif text-[#C5A059] font-bold text-sm">
                      G
                    </div>
                    <div>
                      <h4 className="text-sm font-serif font-black uppercase tracking-wider text-white">
                        First Available Resident
                      </h4>
                      <p className="text-xs text-neutral-400 font-sans mt-0.5">
                        Assign the soonest date slot to any available resident artist
                      </p>
                    </div>
                  </div>
                  {selectedArtistId === "any-resident" && (
                    <div className="absolute top-4 right-4 text-[#C5A059]">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>

                {activeArtists.map((artist) => (
                  <button
                    id={`booking-artist-btn-${artist.id}`}
                    key={artist.id}
                    onClick={() => {
                      setSelectedArtistId(artist.id);
                      setStep(2);
                    }}
                    className={`p-5 rounded-none border text-left transition-all duration-300 relative flex items-center gap-4 ${
                      selectedArtistId === artist.id
                        ? "bg-[#111111] border-[#C5A059] shadow-[0_4px_20px_rgba(197,160,89,0.15)]"
                        : "bg-[#111111]/40 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="w-11 h-11 rounded-none overflow-hidden shrink-0 border border-white/10 relative">
                      <img
                        referrerPolicy="no-referrer"
                        src={artist.avatarUrl}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                        onError={(e) => handleImageFallback(e, 'avatar', artist.id)}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-serif font-black uppercase tracking-wider text-white">
                        {artist.name}
                      </h4>
                      <p className="text-xs text-[#C5A059] font-mono truncate mt-0.5">
                        {artist.specialty}
                      </p>
                    </div>
                    {selectedArtistId === artist.id && (
                      <div className="absolute top-5 right-5 text-[#C5A059]">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Dynamic Warning Card */}
              {selectedArtistId === "joaquin-ganga" && (
                <div className="p-4 bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-none text-xs text-neutral-300 leading-relaxed font-sans">
                  ⚠️ <span className="text-[#C5A059] font-black uppercase tracking-wider">VIP Priority Notice:</span> Joaquin Ganga is highly requested. Initial sessions booked with Ganga require direct reference validation and a phone consultation to confirm size and layout constraints.
                </div>
              )}

              {/* Action */}
              <div className="flex justify-end pt-8">
                <button
                  id="booking-next-step-1"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-[#C5A059] hover:bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-none transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 text-black" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: DESIGN DETAILS & BODY PLACEMENT */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 text-left"
            >
              <h3 className="text-lg font-serif uppercase tracking-wider text-white border-b border-white/10 pb-2 font-black">
                2. Custom Design & Interactive Body Placement
              </h3>

              {/* Styles Column */}
              <div className="space-y-3">
                <p className="text-xs font-mono uppercase text-[#C5A059] tracking-widest pl-0.5">
                  Artistic Style Select
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {styles.map((s) => (
                    <button
                      id={`style-select-btn-${s.value}`}
                      key={s.value}
                      onClick={() => setStyle(s.value)}
                      className={`p-4 rounded-none border text-left transition-colors duration-300 flex flex-col justify-between ${
                        style === s.value
                          ? "bg-[#111111] border-[#C5A059]"
                          : "bg-[#0A0A0A] border-white/10 hover:bg-neutral-900/50"
                      }`}
                    >
                      <span className="text-xs font-serif font-black uppercase tracking-wider text-white block">
                        {s.label}
                      </span>
                      <span className="text-[10px] text-neutral-450 font-sans block leading-relaxed mt-2">
                        {s.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Body placement Selection containing dynamic selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  <p className="text-xs font-mono uppercase text-[#C5A059] tracking-widest pl-0.5">
                    Interactive Body Mapping
                  </p>
                  <p className="text-xs text-neutral-450 font-sans leading-relaxed">
                    Select a section on the interactive panel. This sets your tattoo's target placement area synchronously.
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    {placements.map((p) => (
                      <button
                        id={`placement-select-btn-${p.value}`}
                        key={p.value}
                        onClick={() => handleSelectPlacement(p.value)}
                        className={`py-3 px-4 rounded-none border text-xs tracking-wider font-mono transition-all duration-300 uppercase flex items-center justify-between ${
                          placement === p.value
                            ? "bg-[#C5A059]/15 border-[#C5A059] text-[#C5A059]"
                            : "bg-[#0A0A0A] border-white/10 text-neutral-400 hover:border-white/20"
                        }`}
                      >
                        <span>{p.label}</span>
                        {placement === p.value && <div className="h-1.5 w-1.5 bg-[#C5A059]" />}
                      </button>
                    ))}
                  </div>

                  {/* Move Estimated Tattoo Size Slider directly right below the placements area */}
                  <div className="space-y-3 pt-4 border-t border-white/[0.05]">
                    <div className="flex justify-between items-center pl-0.5">
                      <p className="text-xs font-mono uppercase text-[#C5A059] tracking-widest font-black">
                        Estimated Tattoo Size
                      </p>
                      <span className="text-xs font-mono text-white font-bold">
                        {sizeInches} Inches ({sizeInches * 2.5} cm)
                      </span>
                    </div>
                    <input
                      id="size-range-slider"
                      type="range"
                      min="2"
                      max="15"
                      value={sizeInches}
                      onChange={(e) => setSizeInches(parseInt(e.target.value))}
                      className="w-full h-1 bg-[#111111] border border-white/10 rounded-none appearance-none cursor-pointer accent-[#C5A059]"
                    />
                    <p className="text-[10px] font-mono text-neutral-500 pl-0.5">
                      Category: {getSizeFeedback(sizeInches)}
                    </p>
                  </div>

                  {/* Save Tattoo Selection button allowing up to 4 tattoos */}
                  <div className="pt-2">
                    <button
                      type="button"
                      id="save-tattoo-spec-btn"
                      onClick={() => {
                        if (savedTattoos.length >= 4) {
                          alert("You can add a maximum of 4 tattoos to your custom booking.");
                          return;
                        }
                        const exists = savedTattoos.some(
                          (t) => t.placement === placement && t.style === style && t.sizeInches === sizeInches
                        );
                        if (exists) {
                          alert("This tattoo specification has already been added.");
                          return;
                        }
                        setSavedTattoos((prev) => [
                          ...prev,
                          { placement, style, sizeInches, markerPos, activeView }
                        ]);
                      }}
                      disabled={savedTattoos.length >= 4}
                      className="w-full py-3 bg-neutral-900 border border-dashed border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059]/10 hover:border-[#C5A059] font-mono text-[10px] uppercase font-black tracking-widest transition-all rounded-none cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <span>Save Tattoo Selection</span>
                      <span className="px-1.5 py-0.5 bg-[#C5A059]/20 text-[#C5A059] font-sans font-bold text-[9px] rounded">
                        {savedTattoos.length}/4
                      </span>
                    </button>
                    {savedTattoos.length >= 4 && (
                      <p className="text-[9px] font-mono text-neutral-500 mt-1 pl-0.5">
                        Maximum of 4 saved tattoos reached.
                      </p>
                    )}
                  </div>
                </div>

                {/* High-End Realistic Interactive Dual-Silhouette Body Map with Shading */}
                <div className="space-y-4">
                  <div className="p-5 bg-neutral-950/90 border border-white/[0.08] rounded-none flex flex-col items-center justify-center relative select-none">
                    {/* Grid background effect */}
                    <div className="absolute inset-0 bg-[radial-gradient(#C5A059_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-10 pointer-events-none" />
                    
                    <div className="relative w-full flex flex-col items-center z-10">
                      <div className="w-full flex justify-between items-center mb-3">
                        <span className="text-[9px] font-mono text-[#C5A059] uppercase tracking-widest font-black flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                          INTERACTIVE CANVAS
                        </span>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase">
                          Drag Pin or Click Anywhere
                        </span>
                      </div>

                      <svg
                        id="interactive-silhouette-map"
                        ref={svgRef}
                        viewBox="0 -20 200 180"
                        onMouseDown={(e) => {
                          setIsHoldingMarker(true);
                          handleSvgInteraction(e);
                        }}
                        onMouseMove={(e) => {
                          if (isHoldingMarker) {
                            handleSvgInteraction(e);
                          }
                        }}
                        onMouseUp={() => setIsHoldingMarker(false)}
                        onMouseLeave={() => setIsHoldingMarker(false)}
                        onTouchStart={(e) => {
                          setIsHoldingMarker(true);
                          handleSvgInteraction(e);
                        }}
                        onTouchMove={(e) => {
                          if (isHoldingMarker) {
                            handleSvgInteraction(e);
                          }
                        }}
                        onTouchEnd={() => setIsHoldingMarker(false)}
                        className="w-full h-64 md:h-72 cursor-crosshair select-none"
                      >
                        <defs>
                          {/* Shading representing size coverage - color and strength increases as size goes up */}
                          <radialGradient id="tattoo-radial-shading" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#C5A059" stopOpacity={Math.min(0.7, 0.35 + (sizeInches / 30))} />
                            <stop offset="65%" stopColor="#C5A059" stopOpacity={Math.min(0.3, 0.15 + (sizeInches / 70))} />
                            <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
                          </radialGradient>
                        </defs>

                        {/* FRONT VIEW SILHOUETTE */}
                        <g id="front-view-body" className={activeView === "front" ? "opacity-100 transition-opacity" : "opacity-40 transition-opacity"}>
                          {/* Added 20px space between the title label and silhouette head (y=-8, head starts at 11) */}
                          <text x="55" y="-8" textAnchor="middle" className="fill-neutral-500 font-mono text-[8.5px] tracking-[0.25em] font-black">FRONT VIEW</text>
                          {/* Reference cross axes */}
                          <line x1="20" y1="40" x2="90" y2="40" stroke="white" strokeWidth="0.1" strokeDasharray="1,2" className="opacity-20" />
                          <line x1="55" y1="18" x2="55" y2="150" stroke="white" strokeWidth="0.1" strokeDasharray="1,2" className="opacity-20" />
                          
                          {/* Head */}
                          <circle cx="55" cy="18" r="7" className="fill-neutral-900 stroke-neutral-700 stroke-[0.8]" />
                          
                          {/* Dynamic contours representing high realistic curves for Front */}
                          <path d="M55 25 c-2.2 0 -3 2.5 -5 4.5 c-3.5 1 -7 3 -9 6 c-2 3 -2.8 7.5 -3.5 11 c-1.5 5 -2.5 11 -3.2 21 c0 3.5 0.8 9.5 1.5 14 c0.5 3.5 0.8 7 0.8 10 c0 3.5 -0.8 7 -1.5 10 c-0.4 1 -0.8 1.8 -0.8 2.6 c0 1 0.8 1.8 1.5 1.8 c0.8 0 1.5 -0.8 2.2 -2.6 c0.8 -1.8 1.5 -5 1.5 -8.8 c0.8 -5 1.5 -13 1.5 -19 c0.8 -2.6 1.5 -5 2.2 -6 c0.8 0 1.5 0.8 1.5 1.8 v42 c0 4.5 -0.8 10.5 -0.8 15 c0 3.5 0.8 7 1.5 8.5 c0.8 1.8 1.8 1.8 2.6 1 c0.8 -1 1.5 -4.5 2.2 -8.5 c0.8 -5 0.8 -13 0.8 -19.5 v-17.5 h8.5 v17.5 c0 6.5 0 14.5 0.8 19.5 c0.8 4 1.5 7.5 2.2 8.5 c0.8 0.8 1.8 0.8 2.6 -1 c0.8 -1.5 1.5 -5 1.5 -8.5 c0 -4.5 -0.8 -10.5 -0.8 -15 v-42 c0 -1 0.8 -1.8 1.5 -1.8 c0.8 1 1.5 3.4 2.2 6 c0 6 0.8 14 1.5 19 c0 3.8 0.8 7 1.5 8.8 c0.8 1.8 1.5 2.6 2.2 2.6 c0.8 0 1.5 -0.8 1.5 -1.8 c0 -0.8 -0.4 -1.6 -0.8 -2.6 c-0.8 -3 -1.5 -6.5 -1.5 -10 c0 -3 0.4 -6.5 0.8 -10 c0.8 -4.5 1.5 -10.5 1.5 -14 c-0.7 -10 -1.7 -16 -3.2 -21 c-0.7 -3.5 -1.5 -8 -3.5 -11 c-2 -3 -5.5 -5 -9 -6 c-2 -2 -2.8 -4.5 -5 -4.5 Z" className="fill-neutral-900 stroke-neutral-700 stroke-[0.8]" />
                          
                          {/* Anatomical Highlights on front */}
                          <path d="M47 34 h16 v14 h-16 z" className={`transition-opacity duration-300 pointer-events-none fill-[#C5A059]/10 ${placement === "chest" ? "opacity-100 fill-[#C5A059]/40 stroke-[#C5A059] stroke-[0.5]" : "opacity-0"}`} />
                          <path d="M48 48 h14 v16 h-14 z" className={`transition-opacity duration-300 pointer-events-none fill-[#C5A059]/10 ${placement === "ribs" ? "opacity-100 fill-[#C5A059]/40 stroke-[#C5A059] stroke-[0.5]" : "opacity-0"}`} />
                          <path d="M36 34 c0 0-2.5 5-3.5 13 h4 c0 0 0.8 -8 1.8 -13 z M71 34 c0 0 2.5 5 3.5 13 h-4 c0 0 -0.8 -8 -1.8 -13 z" className={`transition-opacity duration-300 pointer-events-none fill-[#C5A059]/10 ${placement === "bicep" ? "opacity-100 fill-[#C5A059]/40 stroke-[#C5A059] stroke-[0.5]" : "opacity-0"}`} />
                          <path d="M31 50 l3 20 h3.5 l-1-20 z M69 50 l-3 20 h-3.5 l1-20 z" className={`transition-opacity duration-300 pointer-events-none fill-[#C5A059]/10 ${placement === "forearm" ? "opacity-100 fill-[#C5A059]/40 stroke-[#C5A059] stroke-[0.5]" : "opacity-0"}`} />
                          <path d="M41 82 h9.5 v24 h-9.5 z M60 82 h9.5 v24 h-9.5 z" className={`transition-opacity duration-300 pointer-events-none fill-[#C5A059]/10 ${placement === "thigh" ? "opacity-100 fill-[#C5A059]/40 stroke-[#C5A059] stroke-[0.5]" : "opacity-0"}`} />
                        </g>

                        {/* BACK VIEW SILHOUETTE */}
                        <g id="back-view-body" className={activeView === "back" ? "opacity-100 transition-opacity" : "opacity-40 transition-opacity"}>
                          {/* Added 20px space between the title label and silhouette head (y=-8, head starts at 11) */}
                          <text x="145" y="-8" textAnchor="middle" className="fill-neutral-500 font-mono text-[8.5px] tracking-[0.25em] font-black">BACK VIEW</text>
                          {/* Reference cross axes */}
                          <line x1="110" y1="40" x2="180" y2="40" stroke="white" strokeWidth="0.1" strokeDasharray="1,2" className="opacity-20" />
                          <line x1="145" y1="18" x2="145" y2="150" stroke="white" strokeWidth="0.1" strokeDasharray="1,2" className="opacity-20" />
                          
                          {/* Head Back */}
                          <circle cx="145" cy="18" r="7" className="fill-neutral-900 stroke-neutral-700 stroke-[0.8]" />
                          
                          {/* Back curves template */}
                          <path d="M145 25 c-2.2 0 -3 2.5 -5 4.5 c-3.5 1 -7 3 -9 6 c-2 3 -2.8 7.5 -3.5 11 c-1.5 5 -2.5 11 -3.2 21 c0 3.5 0.8 9.5 1.5 14 c0.5 3.5 0.8 7 0.8 10 c0 3.5 -0.8 7 -1.5 10 c-0.4 1 -0.8 1.8 -0.8 2.6 c0 1 0.8 1.8 1.5 1.8 c0.8 0 1.5 -0.8 2.2 -2.6 c0.8 -1.8 1.5 -5 1.5 -8.8 c0.8 -5 1.5 -13 1.5 -19 c0.8 -2.6 1.5 -5 2.2 -6 c0.8 0 1.5 0.8 1.5 1.8 v42 c0 4.5 -0.8 10.5 -0.8 15 c0 3.5 0.8 7 1.5 8.5 c0.8 1.8 1.8 1.8 2.6 1 c0.8 -1 1.5 -4.5 2.2 -8.5 c0.8 -5 0.8 -13 0.8 -19.5 v-17.5 h8.5 v17.5 c0 6.5 0 14.5 0.8 19.5 c0.8 4 1.5 7.5 2.2 8.5 c0.8 0.8 1.8 0.8 2.6 -1 c0.8 -1.5 1.5 -5 1.5 -8.5 c0 -4.5 -0.8 -10.5 -0.8 -15 v-42 c0 -1 0.8 -1.8 1.5 -1.8 c0.8 1 1.5 3.4 2.2 6 c0 6 0.8 14 1.5 19 c0 3.8 0.8 7 1.5 8.8 c0.8 1.8 1.5 2.6 2.2 2.6 c0.8 0 1.5 -0.8 1.5 -1.8 c0 -0.8 -0.4 -1.6 -0.8 -2.6 c-0.8 -3 -1.5 -6.5 -1.5 -10 c0 -3 0.4 -6.5 0.8 -10 c0.8 -4.5 1.5 -10.5 1.5 -14 c-0.7 -10 -1.7 -16 -3.2 -21 c-0.7 -3.5 -1.5 -8 -3.5 -11 c-2 -3 -5.5 -5 -9 -6 c-2 -2 -2.8 -4.5 -5 -4.5 Z" className="fill-neutral-900 stroke-neutral-700 stroke-[0.8]" />
                          
                          {/* Highlights Back panels */}
                          <path d="M136 34 h18 v38 h-18 z" className={`transition-opacity duration-300 pointer-events-none fill-[#C5A059]/10 ${placement === "back" ? "opacity-100 fill-[#C5A059]/40 stroke-[#C5A059] stroke-[0.5]" : "opacity-0"}`} />
                          <path d="M131 116 h8 v24 h-8 z M151 116 h8 v24 h-8 z" className={`transition-opacity duration-300 pointer-events-none fill-[#C5A059]/10 ${placement === "calf" ? "opacity-100 fill-[#C5A059]/40 stroke-[#C5A059] stroke-[0.5]" : "opacity-0"}`} />
                        </g>

                        {/* LIVE TATTOO SHADING INNER OVERLAY - Radius scales directly with selected size range */}
                        <circle
                          cx={markerPos.x}
                          cy={markerPos.y}
                          r={Math.max(6, sizeInches * 1.65)}
                          fill="url(#tattoo-radial-shading)"
                          className="pointer-events-none transition-all duration-150"
                        />

                        {/* Glowing boundary representing visual limitations scale */}
                        <circle
                          cx={markerPos.x}
                          cy={markerPos.y}
                          r={Math.max(6, sizeInches * 1.65)}
                          fill="none"
                          stroke="#C5A059"
                          strokeWidth="0.6"
                          strokeDasharray="2,2"
                          className="pointer-events-none transition-all duration-150 animate-pulse"
                        />

                        {/* Precise Crosshair target */}
                        <g transform={`translate(${markerPos.x}, ${markerPos.y})`} className="pointer-events-none">
                          <circle cx="0" cy="0" r="3.5" fill="#ffffff" stroke="#C5A059" strokeWidth="0.8" className="animate-ping opacity-60" />
                          <circle cx="0" cy="0" r="2" fill="#C5A059" stroke="#ffffff" strokeWidth="0.5" />
                          <line x1="-8" y1="0" x2="8" y2="0" stroke="#C5A059" strokeWidth="0.4" />
                          <line x1="0" y1="-8" x2="0" y2="8" stroke="#C5A059" strokeWidth="0.4" />
                        </g>
                      </svg>

                      <div className="w-full mt-4 flex justify-between items-center px-2 py-1 bg-[#111111]/80 border-t border-white/5 font-mono text-[9px]">
                        <span className="text-neutral-400">
                          COORDINATES: <span className="text-white">X:{markerPos.x} Y:{markerPos.y}</span>
                        </span>
                        <span className="text-[#C5A059] font-black uppercase tracking-wider">
                          AIMED AT: <span className="text-white">{placements.find((p) => p.value === placement)?.label}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Specifications appear directly below the body mapping */}
                  {savedTattoos.length > 0 && (
                    <div className="mt-4 p-4 bg-neutral-950/80 border border-white/[0.08] space-y-3">
                      <p className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest pl-0.5 font-bold flex items-center justify-between">
                        <span>SAVED TATTOO SPECIFICATIONS ({savedTattoos.length} of 4)</span>
                        <span className="h-2 w-2 rounded-full bg-[#C5A059]" />
                      </p>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {savedTattoos.map((saved, idx) => {
                          const styleLabel = styles.find((st) => st.value === saved.style)?.label || saved.style;
                          const placementLabel = placements.find((pl) => pl.value === saved.placement)?.label || saved.placement;
                          return (
                            <div
                              id={`saved-tattoo-item-${idx}`}
                              key={idx}
                              className="p-3 bg-[#0A0A0A] border border-white/5 flex items-center justify-between text-xs transition-colors hover:border-[#C5A059]/30"
                            >
                              <div className="space-y-1">
                                <span className="font-mono text-[9px] text-[#C5A059] uppercase tracking-wider block font-black">
                                  Tattoo Selection #{idx + 1}
                                </span>
                                <div className="flex flex-wrap gap-2 text-white items-center">
                                  <span className="font-semibold uppercase text-[10px] font-mono">{placementLabel}</span>
                                  <span className="text-neutral-600 font-mono">•</span>
                                  <span className="text-neutral-300 capitalize text-[11px]">{styleLabel}</span>
                                  <span className="text-neutral-600 font-mono">•</span>
                                  <span className="text-[#C5A059] font-mono text-[10px] font-bold">{saved.sizeInches}"</span>
                                  <span className="text-neutral-500 text-[9px] font-mono uppercase">({saved.activeView})</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                id={`btn-remove-saved-${idx}`}
                                onClick={() => setSavedTattoos((prev) => prev.filter((_, i) => i !== idx))}
                                className="px-2 py-1 bg-red-950/80 border border-red-500/25 text-red-400 hover:text-white hover:bg-red-900 font-mono text-[9px] uppercase tracking-wider transition-all rounded-none cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Concept description details */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-mono uppercase text-[#C5A059] tracking-widest pl-0.5">
                  Design Concept Description
                </p>
                <textarea
                  id="concept-desc-input"
                  value={conceptDescription}
                  onChange={(e) => setConceptDescription(e.target.value)}
                  placeholder="Describe your design, elements to include (e.g., skulls, angels, geometric lines), placement description, and any specific inspiration or references..."
                  rows={4}
                  className="w-full bg-[#0A0A0A] border border-white/10 focus:border-white/20 rounded-none p-4 text-xs font-sans placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-white/10 text-[#DDD] leading-relaxed"
                />
              </div>

              {/* Drag & Drop File Upload */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-mono uppercase text-[#C5A059] tracking-widest pl-0.5">
                  Reference Images (Drag & Drop or Click)
                </p>

                <div
                  id="upload-dropzone"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border border-dashed p-6 rounded-none text-center cursor-pointer transition-colors duration-300 ${
                    isDragging
                      ? "border-[#C5A059] bg-[#C5A059]/5 text-[#C5A059]"
                      : "border-white/10 hover:border-[#C5A059]/50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onClick={(e) => e.stopPropagation()} // avoid container double clicks
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <UploadCloud className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
                  <p className="text-xs font-serif font-semibold text-white">
                    Drag and drop your reference files here
                  </p>
                  <p className="text-[10px] text-neutral-500 font-sans mt-1">
                    Or select from file systems • PNG or JPG formats
                  </p>
                </div>

                {/* Previews */}
                {referenceImages.length > 0 && (
                  <div className="grid grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
                    {referenceImages.map((src, idx) => (
                      <div
                        id={`upload-preview-frame-${idx}`}
                        key={idx}
                        className="relative h-16 w-16 bg-neutral-900 border border-white/10 rounded-none overflow-hidden"
                      >
                        <img src={src} className="w-full h-full object-cover font-bold" />
                        <button
                          id={`upload-remove-btn-${idx}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeReferenceImage(idx);
                          }}
                          className="absolute top-1 right-1 bg-red-600 p-0.5 rounded-none text-white text-[10px] font-bold"
                          title="Remove Reference"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex justify-between pt-8 border-t border-white/10">
                <button
                  id="booking-prev-step-2"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 border border-white/10 hover:border-white/30 text-white font-semibold uppercase tracking-[0.2em] text-[10px] rounded-none transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                  Back
                </button>
                <button
                  id="booking-next-step-2"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-[#C5A059] hover:bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-none transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 text-black" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SCHEDULE DATE SLOT */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 text-left"
            >
              <h3 className="text-lg font-serif uppercase tracking-wider text-white border-b border-white/10 pb-2 font-black">
                3. Choose Date & Time
              </h3>

              {/* Date selection list */}
              <div className="space-y-3">
                <p className="text-xs font-mono uppercase text-[#C5A059] tracking-widest pl-0.5">
                  Calendar Available Dates
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {dateSlots.map((d) => (
                    <button
                      id={`date-select-btn-${d.value}`}
                      key={d.value}
                      onClick={() => setSelectedDate(d.value)}
                      className={`p-4 rounded-none border text-left transition-colors flex items-center justify-between duration-300 ${
                        selectedDate === d.value
                          ? "bg-[#111111] border-[#C5A059]"
                          : "bg-[#0A0A0A] border-white/10 hover:bg-neutral-900/50"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-mono text-white block uppercase">
                          {d.label}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-sans block mt-1">
                          Atlanta Studio
                        </span>
                      </div>
                      <CalendarIcon className="w-4 h-4 text-[#C5A059]/40" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Hour time slot */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-mono uppercase text-[#C5A059] tracking-widest pl-0.5">
                  Available Slots
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((t) => (
                    <button
                      id={`time-select-btn-${t.replace(/\s+/g, "-")}`}
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`p-4 rounded-none border text-left transition-colors flex items-center justify-between duration-300 ${
                        selectedTime === t
                          ? "bg-[#111111] border-[#C5A059]"
                          : "bg-[#0A0A0A] border-white/10 hover:bg-neutral-900/50"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-mono text-white block">
                          {t}
                        </span>
                        <span className="text-[10px] text-[#C5A059] font-sans mt-0.5 block">
                          {t.includes("VIP") ? "⚡ Express VIP Booking slot" : "Standard booking spot"}
                        </span>
                      </div>
                      <Clock className="w-4 h-4 text-[#C5A059]/40" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#111111] border border-white/10 rounded-none space-y-2">
                <p className="text-xs font-mono text-neutral-400">
                  📅 Selected: <span className="text-white font-bold">{selectedDate}</span> at{" "}
                  <span className="text-[#C5A059] font-bold">{selectedTime}</span>
                </p>
                <p className="text-[11px] text-neutral-450 font-sans leading-relaxed">
                  The studio will lock this time slot for you for up to 30 minutes until full contact submission is confirmed. Zero booking deposit is required during preview.
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-8 border-t border-white/10">
                <button
                  id="booking-prev-step-3"
                  onClick={() => setStep(2)}
                  className="px-5 py-3 border border-white/10 hover:border-white/30 text-white font-semibold uppercase tracking-[0.2em] text-[10px] rounded-none transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                  Back
                </button>
                <button
                  id="booking-next-step-3"
                  onClick={() => setStep(4)}
                  className="px-6 py-3 bg-[#C5A059] hover:bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-none transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 text-black" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: GUEST DETAILS & CONFIRM */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-left"
            >
              <h3 className="text-lg font-serif uppercase tracking-wider text-white border-b border-white/10 pb-2 font-black">
                4. Enter Client Details & Confirm
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-neutral-450 tracking-wider">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="client-name-input"
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-[#0A0A0A] border border-white/10 focus:border-[#C5A059] rounded-none py-2.5 pl-9 pr-4 text-xs font-sans placeholder-neutral-600 focus:outline-none transition-colors"
                    />
                    <User className="absolute left-3 top-3.5 w-3.5 h-3.5 text-neutral-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-neutral-450 tracking-wider">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="client-email-input"
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="e.g. john@domain.com"
                      className="w-full bg-[#0A0A0A] border border-white/10 focus:border-[#C5A059] rounded-none py-2.5 pl-9 pr-4 text-xs font-sans placeholder-neutral-600 focus:outline-none transition-colors"
                    />
                    <Mail className="absolute left-3 top-3.5 w-3.5 h-3.5 text-neutral-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-neutral-450 tracking-wider">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="client-phone-input"
                      type="text"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="e.g. +1 (404) 555-0199"
                      className="w-full bg-[#0A0A0A] border border-white/10 focus:border-[#C5A059] rounded-none py-2.5 pl-9 pr-4 text-xs font-sans placeholder-neutral-600 focus:outline-none transition-colors"
                    />
                    <Phone className="absolute left-3 top-3.5 w-3.5 h-3.5 text-neutral-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-neutral-450 tracking-wider">
                    Instagram Username (Highly Recommended)
                  </label>
                  <div className="relative">
                    <input
                      id="client-insta-input"
                      type="text"
                      value={clientInstagram}
                      onChange={(e) => setClientInstagram(e.target.value)}
                      placeholder="e.g. johndoe_art"
                      className="w-full bg-[#0A0A0A] border border-[#000]/0 border-b border-white/10 focus:border-[#C5A059] rounded-none py-2.5 pl-9 pr-4 text-xs font-sans placeholder-neutral-600 focus:outline-none transition-all duration-300"
                    />
                    <Instagram className="absolute left-3 top-3.5 w-3.5 h-3.5 text-neutral-500" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2.5 px-3 bg-white/[0.02] border border-white/5">
                <input
                  id="client-vip-checkbox"
                  type="checkbox"
                  checked={isVipRequest}
                  onChange={(e) => setIsVipRequest(e.target.checked)}
                  className="w-4 h-4 rounded-none bg-black border border-white/20 text-[#C5A059] focus:ring-0 focus:outline-none cursor-pointer accent-[#C5A059]"
                />
                <label
                  htmlFor="client-vip-checkbox"
                  className="text-[11px] md:text-xs font-mono uppercase tracking-wider text-neutral-350 select-none cursor-pointer hover:text-white transition-colors"
                >
                  Require VIP suite session (Optional)
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-neutral-450 tracking-wider">
                  Special Notes / Accessibility Requests
                </label>
                <textarea
                  id="client-notes-textarea"
                  value={vipNotes}
                  onChange={(e) => setVipNotes(e.target.value)}
                  placeholder="Need private space accommodations, special security check, or double artist scheduling specifications?"
                  rows={2}
                  className="w-full bg-[#0A0A0A] border border-white/10 focus:border-[#C5A059] rounded-none p-3 text-xs font-sans placeholder-neutral-600 focus:outline-none transition-colors"
                />
              </div>

              {/* Full booking Summary before submit */}
              <div className="mt-8 p-5 bg-[#111111] rounded-none border border-white/10 space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#C5A059] border-b border-white/10 pb-2 font-black">
                  Review Booking Details
                </h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[12px]">
                  <div>
                    <span className="text-neutral-500 font-sans block text-[10px] uppercase tracking-wide">Specialist Artist</span>
                    <span className="text-white font-serif uppercase tracking-wider font-black">
                      {activeArtists.find((a) => a.id === selectedArtistId)?.name || "First Available Master"}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-sans block text-[10px] uppercase tracking-wide">Design Style Mode</span>
                    <span className="text-white font-mono uppercase">
                      {styles.find((s) => s.value === style)?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-sans block text-[10px] uppercase tracking-wide">Target Placement</span>
                    <span className="text-white font-mono uppercase">
                      {placements.find((p) => p.value === placement)?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-sans block text-[10px] uppercase tracking-wide">Requested Size</span>
                    <span className="text-white font-mono">
                      {sizeInches} Inches
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-neutral-500 font-sans block text-[10px] uppercase tracking-wide">Estimated Date Slot</span>
                    <span className="text-white font-mono uppercase tracking-wider">
                      {selectedDate} at {selectedTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-8 border-t border-white/10">
                <button
                  id="booking-prev-step-4"
                  onClick={() => setStep(3)}
                  disabled={isSubmitting}
                  className="px-5 py-3 border border-white/10 hover:border-white/30 text-white font-semibold uppercase tracking-[0.2em] text-[10px] rounded-none transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                  Back
                </button>
                <button
                  id="booking-confirm-submit-btn"
                  onClick={handleBookSubmit}
                  disabled={isSubmitting}
                  className="px-7 py-3.5 bg-[#C5A059] hover:bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-none transition-all duration-300 flex items-center gap-2 select-none cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Confirm & Submit
                      <CheckCircle className="w-4 h-4 text-black" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: TICKET RECEIPT CONFIRMATION */}
          {step === 5 && submissionResult && (
            <motion.div
              key="step5"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-8"
            >
              {/* Receipt Ticket Graphic styled as a luxury airline boarding pass */}
              <div className="bg-[#111111] rounded-none overflow-hidden border border-[#C5A059]/30 shadow-[0_10px_40px_rgba(0,0,0,0.85)] max-w-lg mx-auto text-left relative">
                {/* Gold trim side margin bars */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C5A059]" />

                {/* Top Header */}
                <div className="p-6 border-b border-white/10 bg-[#050505]/40 flex justify-between items-center pl-8">
                  <div>
                    <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-[#C5A059] font-bold">
                      Ganga Tattoo Atlanta
                    </p>
                    <h3 className="text-lg font-serif font-black text-white tracking-widest uppercase mt-0.5">
                      Priority Pass
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-black border border-emerald-500/30 text-emerald-400 font-mono text-[10px] tracking-widest uppercase font-black">
                    Saved DB
                  </span>
                </div>

                {/* Content body layout */}
                <div className="p-6 md:p-8 space-y-6 pl-8">
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="space-y-1">
                      <span className="text-neutral-500 uppercase text-[9px] tracking-wider block">
                        Client Host
                      </span>
                      <span className="text-white text-sm font-semibold truncate block">
                        {submissionResult.clientName}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-neutral-500 uppercase text-[9px] tracking-wider block">
                        Booking Ticket ID
                      </span>
                      <span className="text-[#C5A059] text-sm font-bold block select-all">
                        {submissionResult.id}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-neutral-500 uppercase text-[9px] tracking-wider block">
                        Ink Specialist
                      </span>
                      <span className="text-white text-xs font-semibold block uppercase">
                        {submissionResult.artistName}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-neutral-500 uppercase text-[9px] tracking-wider block">
                        Design parameters
                      </span>
                      <span className="text-white text-xs block uppercase">
                        {submissionResult.style.replace("_", " ")} • {submissionResult.estimatedSizeInches}"
                      </span>
                    </div>

                    <div className="col-span-2 space-y-1 py-1 border-y border-white/10">
                      <span className="text-neutral-500 uppercase text-[9px] tracking-wider block">
                        Location Coordinates
                      </span>
                      <span className="text-white text-xs block">
                        Buckhead Private Lounge, Atlanta GA
                      </span>
                    </div>

                    <div className="col-span-2 space-y-1">
                      <span className="text-neutral-500 uppercase text-[9px] tracking-wider block">
                        Reserved slot (EST)
                      </span>
                      <span className="text-white text-sm font-bold block uppercase tracking-wider">
                        {submissionResult.date} at {submissionResult.timeSlot}
                      </span>
                    </div>
                  </div>

                  {/* Decorative Barcode vector replicating upscale studio credentials */}
                  <div className="pt-6 border-t border-white/10 space-y-2">
                    <div className="h-10 bg-black border border-white/5 flex items-stretch overflow-hidden select-none opacity-80">
                      {Array.from({ length: 42 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="bg-[#C5A059]/80"
                          style={{
                            width: `${(idx % 4 === 0 ? 3 : idx % 3 === 0 ? 1.5 : idx % 2 === 0 ? 1 : 2.5) * 1.5}px`,
                            marginRight: `${idx % 5 === 0 ? 4 : 2}px`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-mono text-neutral-500 uppercase tracking-widest pl-1">
                      <span>System Secured Sync</span>
                      <span>{submissionResult.createdAt.slice(0, 10)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* End Panel Screen Guidance */}
              <div className="space-y-4 text-center max-w-sm mx-auto">
                <p className="text-sm font-sans text-neutral-455">
                  🎉 <span className="text-emerald-400 font-bold uppercase tracking-wider text-xs">Success!</span> Your appointment request was saved with Ticket ID <strong className="text-[#C5A059]">{submissionResult.id}</strong>.
                </p>
                <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                  A studio coordinator will contact you via your email (<span className="text-white">{submissionResult.clientEmail}</span>) within 24 hours to confirm your references.
                </p>
                <div className="pt-4 flex flex-col gap-2.5">
                  <button
                    id="booking-confirm-complete-btn"
                    onClick={() => {
                      onBookingComplete();
                      setStep(1);
                      setSubmissionResult(null);
                    }}
                    className="w-full py-3 bg-[#C5A059] hover:bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-none transition-colors duration-300 cursor-pointer"
                  >
                    Done • Back to Studio
                  </button>
                  <button
                    id="booking-book-another-btn"
                    onClick={() => {
                      setStep(1);
                      setSubmissionResult(null);
                    }}
                    className="w-full py-2.5 bg-transparent border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white text-[10px] font-mono uppercase tracking-[0.15em] rounded-none transition-colors cursor-pointer"
                  >
                    Register Another Ink Spot
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
