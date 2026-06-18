/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppointmentBooking, Artist, StudioContact, CelebrityClient } from "../types";
import { ARTISTS } from "../data/artists";
import { CELEBRITY_CLIENTS } from "../data/celebrities";

// Dynamic loading to prevent compile errors when firebase config hasn't been provisioned yet
let dbInstance: any = null;
let authInstance: any = null;
let isFirebaseReady = false;

export async function getFirebase() {
  if (isFirebaseReady) {
    return { db: dbInstance, auth: authInstance, ready: true };
  }
  try {
    // 1. Fetch `/firebase-applet-config.json` using a standard fetch call.
    // This is extremely safe because if the file doesn't exist or returns 404/HTML (due to SPA routing redirects),
    // we can easily inspect the content-type and text content before parsing, entirely avoiding browser console MIME type 
    // and SyntaxError violations that break script evaluation.
    const response = await fetch("/firebase-applet-config.json").catch(() => null);
    if (response && response.ok) {
      const contentType = response.headers.get("content-type") || "";
      if (contentType.toLowerCase().includes("application/json")) {
        const text = await response.text();
        // Defensive check: is it actually JSON? (i.e. starts with '{')
        if (text.trim().startsWith("{")) {
          const config = JSON.parse(text);
          if (config && config.apiKey) {
            const { initializeApp } = await import("firebase/app");
            const { getFirestore } = await import("firebase/firestore");
            const { getAuth } = await import("firebase/auth");

            const app = initializeApp(config);
            // Use firestoreDatabaseId if specified in config, otherwise default
            const dbId = (config as any).firestoreDatabaseId;
            dbInstance = getFirestore(app, dbId);
            authInstance = getAuth(app);
            isFirebaseReady = true;
            console.log("🔥 Firebase initialized successfully on client via dynamic fetch!");
            return { db: dbInstance, auth: authInstance, ready: true };
          }
        }
      }
    }
  } catch (error) {
    // Expected when Firebase has not been provisioned in user workspace yet
    console.log("ℹ️ Firebase not provisioned or terms pending. Operating in safe Local Storage mode.", error);
  }
  return { db: null, auth: null, ready: false };
}

// Error Handling block following 'firebase-integration' requirements
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  auth: any
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Seed bookings so that the admin board has interactive demo data immediately
const SEED_BOOKINGS: AppointmentBooking[] = [
  {
    id: "BKG-9841",
    artistId: "joaquin-ganga",
    artistName: "Joaquin Ganga",
    date: "2026-06-18",
    timeSlot: "10:00 AM",
    placement: "back",
    style: "hyperrealism",
    estimatedSizeInches: 12,
    description: "Multi-artist sequential session for high-contrast portrait realism representing Greek mythological statues.",
    referenceImages: [],
    clientName: "Marcus Vance",
    clientEmail: "marcus@atlstar.com",
    clientPhone: "+1 (404) 555-0192",
    clientInstagram: "marcus_vance",
    status: "confirmed",
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    urgency: "vip",
    notes: "Requires private VIP room setup. Client prefers absolute privacy and high-end security."
  },
  {
    id: "BKG-3420",
    artistId: "jose-contreras",
    artistName: "Jose Contreras",
    date: "2026-06-19",
    timeSlot: "1:00 PM",
    placement: "forearm",
    style: "black_and_grey",
    estimatedSizeInches: 8,
    description: "Detailed rendering of a mechanical biomechanical gear pattern blending arm muscles into 3D metallic structures.",
    referenceImages: [],
    clientName: "Nadia Croft",
    clientEmail: "nadia.croft@design.io",
    clientPhone: "+1 (770) 555-8821",
    clientInstagram: "nadia_croft",
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    urgency: "standard"
  },
  {
    id: "BKG-5521",
    artistId: "stefano-alcantara",
    artistName: "Stefano Alcantara",
    date: "2026-06-21",
    timeSlot: "4:00 PM",
    placement: "shoulder",
    style: "fine_line",
    estimatedSizeInches: 6,
    description: "Renaissance angel ascending into high-definition realistic smoke clouds, soft Diluted wash shading.",
    referenceImages: [],
    clientName: "Chris Paulson",
    clientEmail: "cpaulson@atldrive.com",
    clientPhone: "+1 (678) 555-3211",
    clientInstagram: "cpaulson32",
    status: "confirmed",
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    urgency: "standard"
  },
  {
    id: "BKG-1120",
    artistId: "luis-bonilla",
    artistName: "Luis Bonilla",
    date: "2026-06-15",
    timeSlot: "10:00 AM",
    placement: "thigh",
    style: "color_realism",
    estimatedSizeInches: 10,
    description: "Vivid high-density color representation of a wild Bengal tiger head with bright saturated emerald green eyes.",
    referenceImages: [],
    clientName: "Elena Rostova",
    clientEmail: "elena.rostova@gmail.com",
    clientPhone: "+1 (404) 555-5243",
    clientInstagram: "elena_inc",
    status: "completed",
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    urgency: "standard"
  }
];

// Local Storage layer
function getLocalBookings(): AppointmentBooking[] {
  const stored = localStorage.getItem("ganga_bookings");
  if (!stored) {
    localStorage.setItem("ganga_bookings", JSON.stringify(SEED_BOOKINGS));
    return SEED_BOOKINGS;
  }
  try {
    return JSON.parse(stored);
  } catch (err) {
    console.error("Failed to parse bookings from cache, resetting", err);
    return SEED_BOOKINGS;
  }
}

function saveLocalBookings(bookings: AppointmentBooking[]) {
  localStorage.setItem("ganga_bookings", JSON.stringify(bookings));
}

// Global API facing the app components
export async function getBookings(): Promise<AppointmentBooking[]> {
  const { db, auth, ready } = await getFirebase();
  if (ready && db) {
    try {
      const { collection, getDocs, orderBy, query } = await import("firebase/firestore");
      const path = "bookings";
      const q = query(collection(db, path), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const bookings: AppointmentBooking[] = [];
      snapshot.forEach((docSnap) => {
        bookings.push({ id: docSnap.id, ...docSnap.data() } as AppointmentBooking);
      });
      return bookings;
    } catch (err) {
      console.warn("Failed retrieving bookings from Firestore, falling back to LocalStorage.", err);
      return getLocalBookings();
    }
  }
  return getLocalBookings();
}

export async function addBooking(booking: Omit<AppointmentBooking, "id" | "createdAt" | "status">): Promise<AppointmentBooking> {
  const { db, auth, ready } = await getFirebase();
  const id = `BKG-${Math.floor(1000 + Math.random() * 9000)}`;
  const createdAt = new Date().toISOString();
  const newBooking: AppointmentBooking = {
    ...booking,
    id,
    createdAt,
    status: "pending"
  };

  if (ready && db) {
    try {
      const { doc, setDoc } = await import("firebase/firestore");
      const path = "bookings";
      await setDoc(doc(db, path, id), newBooking);
      console.log(`Successfully added booking ${id} in Firestore`);
    } catch (err) {
      console.warn("Failed saving state in Firestore, saving in LocalStorage.", err);
      const local = getLocalBookings();
      local.unshift(newBooking);
      saveLocalBookings(local);
    }
  } else {
    const local = getLocalBookings();
    local.unshift(newBooking);
    saveLocalBookings(local);
  }
  return newBooking;
}

export async function updateBookingStatus(id: string, status: AppointmentBooking["status"]): Promise<boolean> {
  const { db, auth, ready } = await getFirebase();
  let success = false;

  if (ready && db) {
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      const path = "bookings";
      await updateDoc(doc(db, path, id), { status });
      success = true;
    } catch (err) {
      console.warn("Failed updating booking status in Firestore, applying locally.", err);
    }
  }

  // Always apply locally for robust fallback
  const local = getLocalBookings();
  const index = local.findIndex((b) => b.id === id);
  if (index !== -1) {
    local[index].status = status;
    saveLocalBookings(local);
    success = true;
  }
  return success;
}

export async function deleteBooking(id: string): Promise<boolean> {
  const { db, auth, ready } = await getFirebase();
  let success = false;

  if (ready && db) {
    try {
      const { doc, deleteDoc } = await import("firebase/firestore");
      const path = "bookings";
      await deleteDoc(doc(db, path, id));
      success = true;
    } catch (err) {
      console.warn("Failed deleting booking from Firestore, applying locally.", err);
    }
  }

  const local = getLocalBookings();
  const filtered = local.filter((b) => b.id !== id);
  if (filtered.length !== local.length) {
    saveLocalBookings(filtered);
    success = true;
  }
  return success;
}

export async function validateFirebaseConnection(): Promise<boolean> {
  const { db, ready } = await getFirebase();
  if (!ready || !db) return false;
  try {
    const { doc, getDocFromServer } = await import("firebase/firestore");
    await getDocFromServer(doc(db, "test", "connection"));
    return true;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("the client is offline")) {
      console.error("Connection validation failed: client is offline.");
    }
    return false;
  }
}

export function getCleanArtists(): Artist[] {
  const stored = typeof window !== "undefined" ? localStorage.getItem("ganga_artists") : null;
  if (!stored) {
    if (typeof window !== "undefined") {
      localStorage.setItem("ganga_artists", JSON.stringify(ARTISTS));
    }
    return ARTISTS;
  }
  try {
    return JSON.parse(stored);
  } catch (err) {
    return ARTISTS;
  }
}

export function saveCleanArtists(artists: Artist[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("ganga_artists", JSON.stringify(artists));
  }
}

// Studio Video management definitions
export interface StudioVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
}

const DEFAULT_VIDEOS: StudioVideo[] = [
  {
    id: "vid-1",
    title: "BLACK & GREY MASTERCLASS PROGRESS",
    description: "Witness the creation of ultra-fine gradient ink layers on custom chest-pieces directly in Atlanta.",
    videoUrl: "/videos/studio_tour_1.mp4"
  },
  {
    id: "vid-2",
    title: "PRIVATE SUITE TOUR REEL",
    description: "A virtual walkthrough showing how our Buckhead sanctuary combines museum interior layout principles with safety.",
    videoUrl: "/videos/studio_tour_2.mp4"
  }
];

export function getStudioVideos(): StudioVideo[] {
  const stored = typeof window !== "undefined" ? localStorage.getItem("ganga_videos") : null;
  if (!stored) {
    if (typeof window !== "undefined") {
      localStorage.setItem("ganga_videos", JSON.stringify(DEFAULT_VIDEOS));
    }
    return DEFAULT_VIDEOS;
  }
  try {
    return JSON.parse(stored);
  } catch (err) {
    return DEFAULT_VIDEOS;
  }
}

export function saveStudioVideos(videos: StudioVideo[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("ganga_videos", JSON.stringify(videos));
  }
}

// Persist custom settings or uploaded images for different sections (like styles)
export function getCustomStyleDetails(): Record<string, any> | null {
  const stored = typeof window !== "undefined" ? localStorage.getItem("ganga_custom_style_details") : null;
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
}

export function saveCustomStyleDetails(details: Record<string, any>): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("ganga_custom_style_details", JSON.stringify(details));
  }
}

const DEFAULT_STUDIO_CONTACT: StudioContact = {
  address: "3120 Peachtree Rd NE, Buckhead, Atlanta, GA 30305",
  addressSubtitle: "Bespoke secure private lounge. Valet parking on-site.",
  email: "atlanta@gangatattoo.com",
  emailSubtitle: "Our intake team usually responds within 24 hours.",
  phone: "+1 (404) 555-0105",
  showPhone: false,
  instagramName: "@gangatattoo_atl",
  instagramUrl: "https://www.instagram.com/gangatattoo_atl",
  whatsappNumber: "+14045550105",
  whatsappLabel: "+1 (404) 555-0105",
  bgUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1200"
};

export function getStudioContact(): StudioContact {
  const stored = typeof window !== "undefined" ? localStorage.getItem("ganga_studio_contact") : null;
  if (!stored) {
    if (typeof window !== "undefined") {
      localStorage.setItem("ganga_studio_contact", JSON.stringify(DEFAULT_STUDIO_CONTACT));
    }
    return DEFAULT_STUDIO_CONTACT;
  }
  try {
    return { ...DEFAULT_STUDIO_CONTACT, ...JSON.parse(stored) };
  } catch (err) {
    return DEFAULT_STUDIO_CONTACT;
  }
}

export function saveStudioContact(contact: StudioContact): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("ganga_studio_contact", JSON.stringify(contact));
  }
}

export interface SiteMedia {
  workWithUsBg: string;
  noPainBgFirst: string;
  noPainHeroLandscape: string;
  noPainTile1: string;
  noPainTile2: string;
  noPainTile3: string;
  noPainTile4: string;
  noPainTile5: string;
  noPainTile6: string;
  noPainBgSecond: string;
}

const DEFAULT_SITE_MEDIA: SiteMedia = {
  workWithUsBg: '',
  noPainBgFirst: '/images/nopain/bg-1.png',
  noPainHeroLandscape: '/images/nopain/hero.png',
  noPainTile1: '/images/nopain/1.png',
  noPainTile2: '/images/nopain/2.png',
  noPainTile3: '/images/nopain/3.png',
  noPainTile4: '/images/nopain/4.png',
  noPainTile5: '/images/nopain/5.png',
  noPainTile6: '/images/nopain/6.png',
  noPainBgSecond: '/images/nopain/bg-2.png'
};

export function getSiteMedia(): SiteMedia {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('ganga_site_media') : null;
  if (!stored) return DEFAULT_SITE_MEDIA;
  try {
    return { ...DEFAULT_SITE_MEDIA, ...JSON.parse(stored) };
  } catch(e) {
    return DEFAULT_SITE_MEDIA;
  }
}

export function saveSiteMedia(media: SiteMedia): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ganga_site_media', JSON.stringify(media));
  }
}

export interface StudioImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const DEFAULT_STUDIO_IMAGES: StudioImage[] = [
  {
    id: 'std-1',
    title: 'Buckhead Elite Lounge',
    description: 'Our elegant stone waiting lounge styled with designer custom furniture, contemporary sculptures, and a high-end private refreshment bar.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'std-2',
    title: 'Bespoke Treatment Suites',
    description: 'Private single-patient rooms equipped with luxury Italian leather chairs, multi-joint medical lighting, and personalized dynamic sound systems.',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'std-3',
    title: 'Hospital-Grade Sterilization Unit',
    description: 'Our state-of-the-art laboratory where medical autoclaves sterilize every single instrument to zero-contamination margins.',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'std-4',
    title: 'Contemporary Abstract Gallery',
    description: 'Custom commissioned murals and fine canvases framing our studio walls, curated to combine tattoo culture with modern museum aesthetics.',
    imageUrl: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=600'
  }
];

export function getStudioImages(): StudioImage[] {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('ganga_studio_images') : null;
  if (!stored) return DEFAULT_STUDIO_IMAGES;
  try {
    return JSON.parse(stored);
  } catch(e) {
    return DEFAULT_STUDIO_IMAGES;
  }
}

export function saveStudioImages(imgs: StudioImage[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ganga_studio_images', JSON.stringify(imgs));
  }
}

// Global Celebrity Clients management helpers
export function getCelebrities(): CelebrityClient[] {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('ganga_celebrities') : null;
  if (!stored) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ganga_celebrities', JSON.stringify(CELEBRITY_CLIENTS));
    }
    return CELEBRITY_CLIENTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return CELEBRITY_CLIENTS;
  }
}

export function saveCelebrities(list: CelebrityClient[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ganga_celebrities', JSON.stringify(list));
  }
}

export interface StudioLayoutConfig {
  welcomeBg: string;
  landscapeCentered: string;
  landscapeLeft: string;
  landscapeRight: string;
  imgFour1: string;
  imgFour2: string;
  imgFour3: string;
  imgFour4: string;
  wideScreen1: string;
  wideScreen2: string;
  bookingBg: string;
}

const DEFAULT_STUDIO_LAYOUT_CONFIG: StudioLayoutConfig = {
  welcomeBg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600",
  landscapeCentered: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=1000",
  landscapeLeft: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
  landscapeRight: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800",
  imgFour1: "https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&q=80&w=600",
  imgFour2: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600",
  imgFour3: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=600",
  imgFour4: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600",
  wideScreen1: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=1200",
  wideScreen2: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200",
  bookingBg: "https://images.unsplash.com/photo-1542241647-9cbb2225278b?auto=format&fit=crop&q=80&w=1600"
};

export function getStudioLayoutConfig(): StudioLayoutConfig {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('ganga_studio_layout_config') : null;
  if (!stored) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ganga_studio_layout_config', JSON.stringify(DEFAULT_STUDIO_LAYOUT_CONFIG));
    }
    return DEFAULT_STUDIO_LAYOUT_CONFIG;
  }
  try {
    return { ...DEFAULT_STUDIO_LAYOUT_CONFIG, ...JSON.parse(stored) };
  } catch (e) {
    return DEFAULT_STUDIO_LAYOUT_CONFIG;
  }
}

export function saveStudioLayoutConfig(config: StudioLayoutConfig): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ganga_studio_layout_config', JSON.stringify(config));
  }
}


