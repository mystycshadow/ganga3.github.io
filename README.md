# Ganga Tattoo Atlanta — Operations Portal & Image Management Guide

Welcome to the **Ganga Tattoo Atlanta** custom booking and studio operational management workspace. This guide provides clear, bite-sized instructions for uploading, organization, and custom image labeling, as well as accessing the immersive cropping workspace built inside your panel.

---

## 🎨 Creative Asset Directory (`/public/`)
To use local static pictures without needing external visual URLs:
1. All assets are located inside the `/public/images/` folder of your project workspace.
2. Put any image files (`.jpg`, `.png`, `.jpeg`, etc.) inside these simple flat folders:
   - **Artist Avatars/Profile Pics:** `/public/images/avatars/[artist-id].png` (e.g. `jordan.png`)
    - **Artist Portfolios:** `/public/images/artists/[artist-id]-portfolio-[num].png` (e.g. `jordan-portfolio-1.png`)
    - **Style Background Slideshow covers:** `/public/images/styles/[style-id]-bg-[num].png` (e.g. `black-grey-realism-bg-1.png`)
    - **Style Detailed Projects:** `/public/images/styles/[style-id]-[num].png` (e.g. `black-grey-realism-1.png`)
3. Since `/public/` serves as the web root, paths can be referenced using simplified literal paths:
   - Avatar URL: `/images/avatars/jordan.png`
   - Portfolio URL: `/images/artists/jordan-portfolio-1.png`

For full step-by-step instructions and list of all available artist IDs, please refer to our comprehensive **[README_IMAGES.md](./README_IMAGES.md)** guide file.

---

## ✂️ Interactive Admin Crop Workbench
We have implemented a high-performance, client-side **HTML5 Canvas image cropping workbench** accessible in the central Operational Admin dashboard.

### How to use it:
1. Navigate to the **Studio Admin Portal** (Default tab in the operations panel).
2. Go to the **Resident Masters** tab OR the **Styles & Sections** tab.
3. Next to any profile image input slot or style/project slide slot, you will find a golden **[Crop]** button.
4. Click the **[Crop]** button to launch the crop modal overlay.
5. In the workbench:
   - **Upload any high-res file** directly from your local machine, or **paste an external image URL** (e.g., from Unsplash) to load it.
   - Adjust the **Zoom** scale slider.
   - Adjust the **Align Horizontal (X)** and **Align Vertical (Y)** center alignment range sliders to align the tattoo artwork or faces precisely within the reticle bounds.
6. The crop workbench handles standard presets automatically:
   - **1:1 Square Ratio** is preset for resident headshots and avatars.
   - **3:4 Portrait Ratio** is preset for masterpieces, styles background slideshow covers, and project showcases to ensure balanced visibility on all mobile layouts.
7. Click **Apply Crop** to instantly generate an optimized Base64 crop that updates your form instantly. Click **Save** to persist changes.

---

## 📍 Labelling and Seed Data References
If you want to edit the default seed listings, open `/src/data/artists.ts` or view the admin dashboard to match. All style elements are displayed as clean, immersive columns that instantly activate a dynamic slideshow cycle when hovered over, replacing static arrow buttons with fluid interaction. Hovering on any resident Master artist highlights their visual card and triggers a soft, fading crossfade showing their first portfolio masterpiece.

Have questions or need custom operational triggers? Feel free to prompt!
