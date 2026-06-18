/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ShieldCheck, Sparkles, Instagram, MessageCircle } from "lucide-react";
import { getStudioContact } from "../utils/db";
import { StudioContact } from "../types";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [contact, setContact] = useState<StudioContact>({
    address: "3120 Peachtree Rd NE, Buckhead, Atlanta, GA 30305",
    addressSubtitle: "Bespoke secure private lounge. Valet parking on-site.",
    email: "atlanta@gangatattoo.com",
    emailSubtitle: "Our intake team usually responds within 24 hours.",
    phone: "+1 (404) 555-0105",
    instagramName: "@gangatattoo_atl",
    instagramUrl: "https://www.instagram.com/gangatattoo_atl",
    whatsappNumber: "+14045550105",
    whatsappLabel: "+1 (404) 555-0105"
  });

  useEffect(() => {
    setContact(getStudioContact());
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Inquiry regarding session",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          payload: formData
        })
      });
    } catch (err) {
      console.error("Failed sending contact notification:", err);
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-[85vh] bg-[#050505] text-white py-16 md:py-24 text-left">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Contact info column */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A059] font-black block">
              Direct Contact & Location
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-white uppercase font-black leading-tight">
              Connect With Us
            </h1>
            <div className="h-[1.5px] w-20 bg-[#C5A059]" />
          </div>

          <p className="text-neutral-400 font-sans tracking-wide text-sm leading-relaxed">
            Have questions regarding an upcoming session, clinical anesthesiology, or custom tattoo maps? Get in touch with our Atlanta service concierge directly.
          </p>

          {/* Core Contacts */}
          <div className="space-y-6">
            {/* 1. WHATSAPP DIRECT CHAT COMPONENT */}
            <a 
              href={contact.whatsappNumber && (contact.whatsappNumber.startsWith("http://") || contact.whatsappNumber.startsWith("https://")) ? contact.whatsappNumber : `https://wa.me/${(contact.whatsappNumber || "").replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 group cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-[#C5A059] group-hover:text-green-500 group-hover:scale-110 transition-all shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold group-hover:text-green-400 transition-colors">
                  WhatsApp Direct Chat
                </h4>
                <p className="text-sm text-emerald-400 font-mono mt-1 group-hover:underline">
                  {contact.whatsappLabel}
                </p>
                <p className="text-[10px] text-neutral-500 font-sans mt-0.5">
                  Instant response. Direct booking chat link.
                </p>
              </div>
            </a>

            {/* 2. DIRECT TELEPHONE (Optional visibility) */}
            {contact.showPhone !== false && (
              <div className="flex gap-4">
                <Phone className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                    Direct Telephone
                  </h4>
                  <p className="text-sm text-neutral-350 font-sans mt-1">
                    {contact.phone}
                  </p>
                </div>
              </div>
            )}

            {/* 3. INSTAGRAM LINK COMPONENT */}
            <a 
              href={contact.instagramUrl && (contact.instagramUrl.startsWith("http://") || contact.instagramUrl.startsWith("https://")) ? contact.instagramUrl : `https://www.instagram.com/${(contact.instagramUrl || "").replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 group cursor-pointer"
            >
              <Instagram className="w-5 h-5 text-[#C5A059] group-hover:text-pink-500 group-hover:scale-110 transition-all shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold group-hover:text-pink-450 transition-colors">
                  Official Instagram
                </h4>
                <p className="text-sm text-[#C5A059] font-mono mt-1 group-hover:underline">
                  {contact.instagramName}
                </p>
                <p className="text-[10px] text-neutral-500 font-sans mt-0.5">
                  Follow us to witness Atlanta masterpieces. Click to view channel.
                </p>
              </div>
            </a>

            {/* 4. EMAIL COMMUNICATIONS */}
            <div className="flex gap-4">
              <Mail className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                  Email Communications
                </h4>
                <p className="text-sm text-neutral-350 font-sans mt-1">
                  {contact.email}
                </p>
                {contact.emailSubtitle && (
                  <p className="text-[10px] text-neutral-500 font-sans mt-0.5">
                    {contact.emailSubtitle}
                  </p>
                )}
              </div>
            </div>

            {/* 5. OPERATING HOURS */}
            <div className="flex gap-4">
              <Clock className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                  Operating Hours
                </h4>
                <p className="text-sm text-neutral-350 font-sans mt-1 uppercase">
                  Open Daily: 8:00 AM – 8:00 PM
                </p>
              </div>
            </div>

            {/* 6. ATLANTA ADDRESS / LOCATION */}
            <div className="flex gap-4">
              <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                  Atlanta Address
                </h4>
                <p className="text-sm text-neutral-350 font-sans mt-1">
                  {contact.address}
                </p>
                {contact.addressSubtitle && (
                  <p className="text-[10px] text-neutral-500 font-sans mt-0.5">
                    {contact.addressSubtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Message form column */}
        <div className="lg:col-span-7 bg-[#0c0c0c] border border-white/10 p-6 sm:p-10 relative overflow-hidden">
          {contact.bgUrl && (
            <div className="absolute inset-0 z-0 pointer-events-none select-none animate-fade-in">
              <img 
                src={contact.bgUrl} 
                alt="Contact Background Wallpaper" 
                className="w-full h-full object-cover opacity-15"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/80 via-[#0c0c0c]/60 to-[#0c0c0c]/90" />
            </div>
          )}

          {!contact.bgUrl && (
            <div className="absolute top-4 left-4 bg-black/95 border border-[#C5A059]/40 px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-[#C5A059] z-10">
              Upload Slot: /public/images/contact/ (Directory)
            </div>
          )}

          <div className="relative z-10">
            <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-5 pt-4 text-left"
              >
                <div className="space-y-1.5">
                  <h3 className="text-lg font-serif font-bold uppercase text-white tracking-wide">
                    Direct Concierge Inquiry
                  </h3>
                  <p className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">
                    Receive premium consultation details and secure appointment timelines.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Woodolf"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 focus:border-[#C5A059] p-3 text-xs font-sans tracking-wide text-white outline-none rounded-none focus:ring-0"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#C5A059] tracking-wider font-bold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. client@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#050505] border border-white/10 focus:border-[#C5A059] p-3 text-xs font-sans tracking-wide text-white outline-none rounded-none focus:ring-0"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +1 (404) 555-0199"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#050505] border border-white/10 focus:border-[#C5A059] p-3 text-xs font-sans tracking-wide text-white outline-none rounded-none focus:ring-0"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 focus:border-[#C5A059] p-3 text-xs font-sans text-neutral-300 outline-none rounded-none focus:ring-0"
                  >
                    <option value="Inquiry regarding session">Inquiry regarding future session</option>
                    <option value="Anesthetic inquiry">No Pain (Anesthesiology) questions</option>
                    <option value="Prestige corporate request">Private rental / media request</option>
                    <option value="Tattoo care & aftercare">Tattoo mapping & advice</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                    Detailed Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your tattoo ideas, preferred style, desired body placement, and timing..."
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
                    <span>Send Inquiry</span>
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
                    Inquiry Transmitted
                  </span>
                  <h3 className="text-2xl font-serif uppercase tracking-tight font-black text-white">
                    Message Sent Successfully
                  </h3>
                  <p className="text-xs text-neutral-400 font-sans max-w-md mx-auto leading-relaxed">
                    Thank you for connecting, <strong className="text-white">{formData.name}</strong>. Our Atlanta intake concierge has received your request regarding <strong className="text-white">"{formData.subject}"</strong>. A direct response has been queued for your inbox (<span className="text-white">{formData.email}</span>).
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        subject: "Inquiry regarding session",
                        phone: "",
                        message: "",
                      });
                    }}
                    className="px-6 py-2 bg-transparent border border-white/15 hover:border-white/40 text-neutral-400 hover:text-white font-mono text-[9px] uppercase tracking-wider transition-colors"
                  >
                    Send Another message
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
