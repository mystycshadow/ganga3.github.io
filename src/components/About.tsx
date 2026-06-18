/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, Award, Eye, Crosshair } from "lucide-react";
import { motion } from "motion/react";

export default function About() {
  const pillars = [
    {
      icon: <Award className="w-6 h-6 text-[#C5A059]" />,
      title: "World-Class Roster",
      description: "Our roster features award-winning hand-selected resident masters from West Hollywood, Madrid, Milan, and Buenos Aires. Each ink specialist is a verified authority in hyperrealistic detail, mythological portrait wash, or geometric fine line blueprinting."
    },
    {
      icon: <Crosshair className="w-6 h-6 text-[#C5A059]" />,
      title: "Absolute Precision",
      description: "We employ exclusive single-needle lining techniques and custom silver pigments developed directly by founder Joaquin Ganga. Shading gradients are transitionally calculated and contoured individually to flow naturally with body musculature."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#C5A059]" />,
      title: "Sterile Medical Luxury",
      description: "The Ganga standard exceeds standard industrial cleanliness requirements. Our private procedure suites incorporate continuous air filtration, bespoke hospital-grade stainless steel fixtures, and sealed medical sanitization protocols."
    }
  ];

  return (
    <div
      id="about-section"
      className="bg-[#050505] py-20 md:py-28 text-white border-t border-white/10"
    >
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        {/* Textual Narrative & Pillars Grid */}
        <div className="space-y-12">
          <div className="space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A059]">
              The Studio Standard
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif tracking-tight text-white uppercase font-black leading-tight">
              Redefining Ink as <br className="hidden md:block"/> Exclusive Luxury Art
            </h2>
            <div className="h-[1px] w-20 bg-[#C5A059] mt-4" />
          </div>

          <p className="text-neutral-450 font-sans tracking-wide text-xs sm:text-sm leading-relaxed max-w-4xl">
            Established in West Hollywood, Ganga Tattoo earned its global prestige through Joaquin Ganga's commitment to flawless craftsmanship and custom patient-practitioner consultation. From tattooing celebrities on transcontinental flights to implementing multi-artist full-day sleep-anesthesia backpieces, we continue pushing the limits of physical expression. 
            <span className="block mt-4 text-[#C5A059] font-sans font-medium">
              Now operating fully from our new private location in Buckhead, Atlanta — bookings are extremely exclusive.
            </span>
          </p>

          {/* Pillars List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="p-6 bg-white/[0.02] backdrop-blur-lg border border-white/10 flex flex-col items-start gap-4 hover:border-[#C5A059]/40 hover:bg-white/[0.05] hover:shadow-[0_10px_35px_rgba(197,160,89,0.05)] transition-all duration-500 group rounded-none"
              >
                <div className="p-3 bg-[#050505] border border-white/10 rounded-none shrink-0 text-[#C5A059]">
                  {pillar.icon}
                </div>
                <div className="space-y-2 text-left">
                  <h3 className="text-sm font-serif font-black uppercase tracking-wide text-white group-hover:text-[#C5A059] transition-colors duration-300">
                    {pillar.title}
                  </h3>
                  <p className="text-[11px] text-neutral-450 leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
