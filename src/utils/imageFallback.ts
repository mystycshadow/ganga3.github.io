/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

// Premium, curated Unsplash portraits matching the personality and specialty of each of the 31 resident masters.
export const ARTIST_AVATAR_PLACEHOLDERS: Record<string, string> = {
  "fede-almanzor": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
  "gkirin": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
  "jordan": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
  "toni-garcia": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
  "fran-dmenchi": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400",
  "suan": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  "ivan-morant": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400",
  "cesar-pinto": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
  "bk": "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&q=80&w=400",
  "honart": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400",
  "lewis": "https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=400",
  "johan-castillo": "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=400",
  "diconeme": "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=400",
  "guillermo": "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?auto=format&fit=crop&q=80&w=400",
  "hector": "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=400",
  "timor": "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=400",
  "henry": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
  "may-soria": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
  "avecilla": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400",
  "mammon": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400",
  "anthony": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
  "henko": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
  "alan": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400",
  "parse": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
  "lola-bueno": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
  "katya": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
  "abigail": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  "jenni": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
  "yatzil": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400",
  "albert-quintero": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
  "titos": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400"
};

// Premium, curated real-world tattoo masterpiece images from Unsplash to ensure awesome galleries even if local files are missing.
export const TATTOO_PROJECT_PLACEHOLDERS: string[] = [
  "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=500", // Piece 1 - Full Realistic Detail Sleeve
  "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=500", // Piece 2 - Dynamic Geometry Linework
  "https://images.unsplash.com/photo-1560707854-fb9a10ebc8e4?auto=format&fit=crop&q=80&w=500", // Piece 3 - Abstract Floral Concept
  "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&q=80&w=500"  // Piece 4 - Rich Contrast Neotraditional
];

/**
 * Robust image error handler that chains multiple file formats (.png -> .jpg -> .jpeg -> uppercase variations),
 * and if all local file variations fail, it falls back to a gorgeous Unsplash placeholder based on the type.
 *
 * @param e React SyntheticEvent for HTMLImageElement
 * @param type Section type: 'avatar' | 'portfolio' | 'style'
 * @param id The artist identifier (such as 'jordan') or styling key
 * @param index Optional index identifier (e.g. for tattoo portfolio 1, 2, 3, 4)
 */
export function handleImageFallback(
  e: React.SyntheticEvent<HTMLImageElement>,
  type: 'avatar' | 'portfolio' | 'style' | 'style-bg',
  id: string,
  index?: number
) {
  const target = e.target as HTMLImageElement;

  // Prevent infinite loops if fallback has already been triggered and also failed
  if (target.dataset.fallbackTriggered === "true") {
    return;
  }

  // Initialize resolution step
  if (!target.dataset.resolveStep) {
    target.dataset.resolveStep = "1";
  }

  const step = parseInt(target.dataset.resolveStep, 10);
  const extensions = ['.png', '.jpg', '.jpeg', '.JPG', '.PNG', '.JPEG'];

  if (type === 'avatar') {
    // Try /images/avatars/ folder then /images/artists/ folder across all standard image extensions
    if (step <= 6) {
      // Step 1 - 6: Try in /images/avatars/ with various extensions
      const ext = extensions[step - 1];
      target.dataset.resolveStep = String(step + 1);
      target.src = `/images/avatars/${id}${ext}`;
      return;
    } else if (step <= 12) {
      // Step 7 - 12: Try in /images/artists/ with various extensions
      const ext = extensions[step - 7];
      target.dataset.resolveStep = String(step + 1);
      target.src = `/images/artists/${id}${ext}`;
      return;
    }
  } else if (type === 'portfolio') {
    // Try multiple file structures for portfolios
    const defaultIndex = index !== undefined ? index : 1;
    if (step <= 6) {
      // Step 1 - 6: Try flat naming structure in /images/artists/ (e.g. jordan-portfolio-1.png)
      const ext = extensions[step - 1];
      target.dataset.resolveStep = String(step + 1);
      target.src = `/images/artists/${id}-portfolio-${defaultIndex}${ext}`;
      return;
    } else if (step <= 12) {
      // Step 7 - 12: Try nested structure (e.g. /images/artists/jordan/tattoo_1.png)
      const ext = extensions[step - 7];
      target.dataset.resolveStep = String(step + 1);
      target.src = `/images/artists/${id}/tattoo_${defaultIndex}${ext}`;
      return;
    } else if (step <= 18) {
      // Step 13 - 18: Try legacy nested featured structure (e.g. /images/artists/jordan/featured/tattoo_1.png)
      const ext = extensions[step - 13];
      target.dataset.resolveStep = String(step + 1);
      target.src = `/images/artists/${id}/featured/tattoo_${defaultIndex}${ext}`;
      return;
    }
  } else if (type === 'style') {
    const defaultIndex = index !== undefined ? index : 1;
    if (step <= 6) {
      // Step 1 - 6: Try flat styles folder (e.g. /images/styles/blackwork-1.png)
      const ext = extensions[step - 1];
      target.dataset.resolveStep = String(step + 1);
      target.src = `/images/styles/${id}-${defaultIndex}${ext}`;
      return;
    } else if (step <= 12) {
      // Step 7 - 12: Try legacy style nesting path (e.g. /images/masters/blackwork/style_image_1.png)
      const ext = extensions[step - 7];
      target.dataset.resolveStep = String(step + 1);
      target.src = `/images/masters/${id}/style_image_${defaultIndex}${ext}`;
      return;
    }
  } else if (type === 'style-bg') {
    const defaultIndex = index !== undefined ? index : 1;
    if (step <= 6) {
      // Try flat style bg path (e.g. /images/styles/blackwork-bg-1.png)
      const ext = extensions[step - 1];
      target.dataset.resolveStep = String(step + 1);
      target.src = `/images/styles/${id}-bg-${defaultIndex}${ext}`;
      return;
    }
  }

  // All resolution steps failed. Fall back to curated premium Unsplash presets
  target.dataset.fallbackTriggered = "true";

  if (type === "avatar") {
    const unsplashUrl = ARTIST_AVATAR_PLACEHOLDERS[id];
    if (unsplashUrl) {
      target.src = unsplashUrl;
      return;
    }
  } else if (type === "portfolio" || type === "style") {
    const defaultIndex = index !== undefined ? (index - 1) % 4 : 0;
    const unsplashUrl = TATTOO_PROJECT_PLACEHOLDERS[defaultIndex];
    if (unsplashUrl) {
      target.src = unsplashUrl;
      return;
    }
  } else if (type === 'style-bg') {
    const defaultIndex = index !== undefined ? (index - 1) % 3 : 0;
    const bgDefaults = [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&q=80&w=800"
    ];
    target.src = bgDefaults[defaultIndex];
    return;
  }

  // Fallback of last resort: Hide image and render custom "AVATAR NOT FOUND" banner
  target.style.display = 'none';
  const parent = target.parentElement;
  if (parent) {
    // Check if error-msg element already exists
    const existingMsg = parent.querySelector('.error-msg');
    if (!existingMsg) {
      const err = document.createElement('div');
      err.className = 'error-msg absolute inset-0 flex flex-col items-center justify-center text-[10px] text-zinc-500 font-mono text-center p-4 bg-zinc-950 z-0 border border-zinc-900';
      
      const label = type === 'avatar' ? 'AVATAR NOT FOUND' : 'PROJECT NOT FOUND';
      err.innerHTML = `
        <span class="text-neutral-600 text-lg mb-1">🖼️</span>
        <span class="tracking-widest font-black uppercase text-center">${label}</span>
        <span class="text-[8px] text-neutral-600 mt-1 uppercase">${id}</span>
      `;
      parent.appendChild(err);
    }
  }
}
