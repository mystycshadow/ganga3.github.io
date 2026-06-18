/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, CheckCircle2, Award, Briefcase, FileText } from "lucide-react";
import { getSiteMedia, SiteMedia } from "../utils/db";

export default function WorkWithUs() {
  const [submitted, setSubmitted] = useState(false);
  const [siteMedia, setSiteMedia] = useState<SiteMedia | null>(null);

  useEffect(() => {
    setSiteMedia(getSiteMedia());
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    instagram: "",
    experienceYears: "5",
    specialty: "Hyperrealism",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "artist_application",
          payload: formData
        })
      });
    } catch (err) {
      console.error("Failed sending artist recruitment notification:", err);
    }
    setSubmitted(true);
  };

  const bgImage = siteMedia?.workWithUsBg || "https://images.unsplash.com/photo-1590246814883-fc7a242c1613?auto=format&fit=crop&q=80&w=2000";

  return (
    <div className="min-h-[85vh] bg-[#050505] text-white py-16 md:py-24 text-left relative overflow-hidden">
      {/* Dynamic Background Image */}
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img 
            src={bgImage} 
            className="w-full h-full object-cover opacity-60"
            alt="Work With Us Background"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative z-10">
        
        {/* Pitch column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#C5A059] font-black block">
              Global Roster Acquisition
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif tracking-tight text-white uppercase font-black leading-tight">
              Join the Elite <br />
              Ganga Roster
            </h1>
            <div className="h-[1.5px] w-20 bg-[#C5A059]" />
          </div>

          <p className="text-neutral-400 font-sans tracking-wide text-xs sm:text-sm leading-relaxed">
            Joaquin Ganga's vision is built on collaborative, transcontinental masterworks. We are continuously searching for the world's most disciplined, outstanding tattoo designers to take residency at our state-of-the-art private lounge in Buckhead, Atlanta.
          </p>

          {/* Core Perquisites */}
          <div className="space-y-4 pt-2">
            <div className="flex gap-4 p-4 bg-[#0a0a0a] border border-white/5">
              <Award className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                  Verified Mastery
                </h3>
                <p className="text-[11px] text-neutral-400 font-sans mt-1 leading-relaxed">
                  Minimum 5 years of intense studio portfolio history specializing in Realism, Portraits, Color, Fine Line, or modern concepts.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-[#0a0a0a] border border-white/5">
              <Briefcase className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                  Clinical Care Standard
                </h3>
                <p className="text-[11px] text-neutral-400 font-sans mt-1 leading-relaxed">
                  Deep respect for medical sterilization standards, patient-practitioner confidentiality, and seamless, comfortable custom mapping.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form column */}
        <div className="lg:col-span-7 bg-[#0c0c0c] border border-white/10 p-6 sm:p-10 relative">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="application-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-5 pt-4 text-left"
              >
                <div className="space-y-1.5">
                  <h3 className="text-lg font-serif font-bold uppercase text-white tracking-wide">
                    Artist Residency Request
                  </h3>
                  <p className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">
                    All applications are treated with strict confidentiality.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Joaquin Ganga"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#050505] border border-white/10 focus:border-[#C5A059] p-3 text-xs font-sans tracking-wide text-white outline-none rounded-none focus:ring-0"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                      Direct Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. artist@gangatattoo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#050505] border border-white/10 focus:border-[#C5A059] p-3 text-xs font-sans tracking-wide text-white outline-none rounded-none focus:ring-0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                      Instagram / Portfolio URL
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. @gangatattoo"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      className="w-full bg-[#050505] border border-white/10 focus:border-[#C5A059] p-3 text-xs font-sans tracking-wide text-white outline-none rounded-none focus:ring-0"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                      Primary Style Focus
                    </label>
                    <select
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="w-full bg-[#050505] border border-white/10 focus:border-[#C5A059] p-3 text-xs font-sans text-neutral-300 outline-none rounded-none focus:ring-0"
                    >
                      <option value="Hyperrealism">Black & Gray Realism</option>
                      <option value="Microrealism">Microrealism</option>
                      <option value="Color Realism">Color Realism</option>
                      <option value="Fine Line">Fine Line / Conceptual</option>
                      <option value="Other">Other Custom Concepts</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                    Years of Active Professional Studio Experience
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full accent-[#C5A059] cursor-pointer"
                  />
                  <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
                    <span>1 year</span>
                    <span className="text-[#C5A059] font-bold">{formData.experienceYears} Years Experience</span>
                    <span>20+ years</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                    Brief Statement of Craft Interest
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your stylistic background and what drives your masterworks..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 focus:border-[#C5A059] p-3 text-xs font-sans tracking-wide text-white outline-none rounded-none focus:ring-0 resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#C5A059] hover:bg-white text-black font-mono text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(197,160,89,0.2)]"
                  >
                    <span>Send Residency Application</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="submitted-state"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-5"
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/5 text-[#C5A059]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A059] font-black">
                    Receipt Acknowledged
                  </span>
                  <h3 className="text-2xl font-serif uppercase tracking-tight font-black text-white">
                    Application Filed Securely
                  </h3>
                  <p className="text-xs text-neutral-400 font-sans max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{formData.name}</strong>. Our transcontinental acquisition panel reviews submissions weekly. We've received your portfolio focus in <strong className="text-white">{formData.specialty}</strong> and will follow up via email if a guestspot or permanent residency is approved.
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        instagram: "",
                        experienceYears: "5",
                        specialty: "Hyperrealism",
                        message: "",
                      });
                    }}
                    className="px-6 py-2 bg-transparent border border-white/15 hover:border-white/40 text-neutral-400 hover:text-white font-mono text-[9px] uppercase tracking-wider transition-colors"
                  >
                    Send Another Response
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
