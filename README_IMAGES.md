# GANGA STUDIO - IMAGE UPLOADS GUIDE

All image pathways in Ganga Studio have been redesigned and simplified to be completely flat—**no nested folders or complex structures needed**. Just upload files directly to simple directories with easy names.

Our image engine automatically checks for all standard extensions (`.png`, `.jpg`, `.jpeg`, `.JPG`, `.PNG`) and loads beautiful curated Unsplash fallbacks if they are missing.

---

## 🚀 1. Hero Slideshow
Upload folder: `/public/images/hero/`
- [ ] `1.png` (Slide 1 Cover)
- [ ] `2.png` (Slide 2 Cover)
- [ ] `3.png` (Slide 3 Cover)

---

## 🌟 2. Celebrity & VIP Clients
Upload folder: `/public/images/celebrities/`
- [ ] `post-malone.png`
- [ ] `lebron-james.png`
- [ ] `kai-cenat.png`
- [ ] `lil-uzi-vert.png`

---

## 🎨 3. Resident Master Artists (Avatars & Portfolios)
Upload all your custom master artist profile pictures (avatars) and portfolios to these folders:

### 👤 Profile Pictures (Avatars)
Upload folder: `/public/images/avatars/`
Name files exactly: `[artist-id].png` (e.g. `jordan.png`)

### 🖼️ Masterpieces (Portfolios 1 to 4)
Upload folder: `/public/images/artists/`
Name files exactly: `[artist-id]-portfolio-[number].png` (e.g. `jordan-portfolio-1.png`)

### All master IDs for reference:
- `fede-almanzor` (Avatar: `/public/images/avatars/fede-almanzor.png`, Portfolios: `/public/images/artists/fede-almanzor-portfolio-1.png` to `-4.png`)
- `gkirin`
- `jordan`
- `toni-garcia`
- `fran-dmenchi`
- `suan`
- `ivan-morant`
- `cesar-pinto`
- `bk`
- `honart`
- `lewis`
- `johan-castillo`
- `diconeme`
- `guillermo`
- `hector`
- `timor`
- `henry`
- `may-soria`
- `avecilla`
- `mammon`
- `anthony`
- `henko`
- `alan`
- `parse`
- `lola-bueno`
- `katya`
- `abigail`
- `jenni`
- `yatzil`
- `albert-quintero`
- `titos`

---

## 🔍 4. Tattoo Style Showcase Collections & Slideshows
Upload folder: `/public/images/styles/`

Each style category utilizes two sets of assets:
1. **Dynamic Background Slideshow Covers**: Represent the 3 main slide images that rotate smoothly on hover in the Styles catalog list.
   * Pathway structure: `/public/images/styles/[style-id]-bg-[1-3].png` (e.g. `black-grey-realism-bg-1.png`, `black-grey-realism-bg-2.png`, `black-grey-realism-bg-3.png`)
2. **Curated Showcase Portfolio Work**: Represent the 5 interactive gallery project images displayed inside the Style's Detail overlay views.
   * Pathway structure: `/public/images/styles/[style-id]-[1-5].png` (e.g. `black-grey-realism-1.png` through `black-grey-realism-5.png`)

### ⚡ 🚀 Unified Admin Dashboard Control (RECOMMENDED):
Instead of uploading manually, simply open the **Studio Admin URL**, choose the **"Styles & Sections"** tab, select your target style category, and use our **Bespoke Crop Workbench** to upload, crop, and save your visual assets instantly.

### All Style IDs for reference:
- `black-grey-realism` (Background: `black-grey-realism-bg-1.png` to `-bg-3.png`, Projects: `black-grey-realism-1.png` to `-5.png`)
- `black-grey-microrealism`
- `black-grey-sculptures`
- `black-grey-big-pieces`
- `blackwork`
- `color-original-designs`
- `color-microrealism`
- `color-realism`
- `fineline-conceptual`
- `neotraditional`
- `pet-portraits`
- `portraits`

---

## 🎨 5. Dynamic Hover Crossfades
- **Artists list**: Hovering on any resident master card instantly triggers a beautiful crossfade, loading their first uploaded project showcase (`[artist-id]-portfolio-1.png`) directly in the frame.
- **Styles Catalog**: Hovering over any style preview triggers an elegant automatic slide rotation cycle across the 3 main background slideshow covers so clients can explore style designs dynamically on-screen.

---

## 🎬 6. Cinematic Tour Videos
Upload folder: `/public/videos/`
- [ ] `studio_tour_1.mp4`
- [ ] `studio_tour_2.mp4`
