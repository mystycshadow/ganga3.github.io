/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getCelebrities } from "../utils/db";
import { CelebrityClient } from "../types";
import { ArrowUpRight, Award, Quote, Sparkles, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

interface CelebritiesProps {
  onSelectImage: (imageUrl: string, title: string, description?: string, artistName?: string) => void;
  onBookWithArtist: (artistId: string) => void;
}

export default function Celebrities({ onSelectImage, onBookWithArtist }: CelebritiesProps) {
  const [celebList, setCelebList] = useState<CelebrityClient[]>([]);

  useEffect(() => {
    setCelebList(getCelebrities());
  }, []);

  return (
    <div
      id="celebrities-section"
      className="bg-[#050505] py-20 md:py-28 text-white border-t border-white/10"
    >
      <div className="max-w-5xl mx-auto px-6 space-y-12 md:space-y-16">
        {/* Section Heading */}
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif tracking-tight text-white uppercase font-black">
            Chosen BY <br /> Global <br /> Celebrities
          </h2>
          <p className="max-w-md text-neutral-300 font-sans text-xs md:text-sm tracking-wide leading-relaxed">
            The most personal canvas of world-class celebrities, entrusted to us.
          </p>
        </div>

        {/* Bento grid layout for elite celebrities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {celebList.map((client) => (
            <motion.div
              id={`celebrity-card-${client.id}`}
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group bg-[#111111] border border-white/10 p-4 hover:border-[#C5A059]/40 rounded-2xl flex flex-col justify-between hover:shadow-[0_4px_30px_rgba(0,0,0,0.8)] transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Media frame click-to-zoom target */}
                <div
                  id={`celebrity-image-click-${client.id}`}
                  onClick={() =>
                    onSelectImage(
                      client.imageUrl,
                      `${client.name} Custom Tattoo Artwork`,
                      client.tattooDescription,
                      "Joaquin Ganga"
                    )
                  }
                  className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#050505] cursor-zoom-in group-hover:shadow-[0_0_20px_rgba(197,160,89,0.15)] transition-shadow duration-500 border border-white/10"
                  title="Click to Zoom Artwork"
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={client.imageUrl}
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    alt={client.name}
                    className="w-full h-full object-cover object-top opacity-75 group-hover:opacity-90 group-hover:scale-[1.03] transition-all duration-700 pointer-events-none"
                  />
                  {/* Decorative badge overlay */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 bg-black/85 backdrop-blur-md rounded-lg border border-[#C5A059]/35 text-[9px] font-mono tracking-widest text-[#C5A059] uppercase select-none">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>VIP Client Custom</span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent opacity-50" />
                </div>

                {/* Text Context */}
                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-serif font-black tracking-wide text-white uppercase group-hover:text-[#C5A059] transition-colors">
                        {client.name}
                      </h3>
                      <p className="text-[10px] text-[#C5A059] font-mono tracking-widest uppercase mt-0.5">
                        {client.role}
                      </p>
                    </div>

                    <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                      By: Joaquin Ganga
                    </p>
                  </div>

                  <p className="text-[11px] text-neutral-400 font-sans tracking-wide leading-relaxed">
                    {client.tattooDescription}
                  </p>
                </div>
              </div>

              {/* Client Quote Panel */}
              {client.quote && (
                <div className="mt-4 pt-4 border-t border-white/10 bg-[#050505]/40 p-3 rounded-xl text-left border border-white/5">
                  <Quote className="w-4 h-4 text-[#C5A059]/40 shrink-0 inline-block align-top -mt-1 mr-2" />
                  <p className="text-[11px] italic text-neutral-300 font-sans leading-relaxed inline-block max-w-[90%]">
                    "{client.quote}"
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* High-profile flight session callout */}
        <div className="p-4 md:p-6 bg-[#111111] rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-left hover:border-[#C5A059]/30 duration-300 transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/3 blur-[120px] rounded-full pointer-events-none" />
          <div className="space-y-3 relative z-10">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-[#C5A059]" />
              Signature Air Service
            </p>
            <h3 className="text-xl md:text-2xl font-serif tracking-tight text-white uppercase font-black">
              Want the Elite Private Jet Custom Session?
            </h3>
            <p className="text-xs md:text-sm text-neutral-400 font-sans leading-relaxed max-w-xl">
              We offer bespoke luxury flight-sessions, flying a private jet equipped with professional mobile medical sterile chambers directly to your city coordinates. Your favorite resident artists will complete your hyperdetailed projects in active flight.
            </p>
          </div>
          <button
            id="celebrity-private-jet-btn"
            onClick={() => onBookWithArtist("joaquin-ganga")}
            className="px-6 py-3.5 bg-transparent hover:bg-white border border-white/20 hover:border-white text-white hover:text-black font-black uppercase tracking-widest text-[10px] rounded-lg transition-all duration-300 whitespace-nowrap cursor-pointer relative z-10"
          >
            Inquire VIP Flight
          </button>
        </div>
      </div>
    </div>
  );
}
