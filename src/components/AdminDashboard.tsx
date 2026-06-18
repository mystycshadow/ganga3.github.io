/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppointmentBooking, Artist, CelebrityClient } from "../types";
import {
  getBookings,
  updateBookingStatus,
  deleteBooking,
  getCleanArtists,
  getStudioVideos,
  saveStudioVideos,
  StudioVideo,
  getCustomStyleDetails,
  saveCustomStyleDetails,
  getStudioContact,
  saveStudioContact,
  getSiteMedia,
  saveSiteMedia,
  SiteMedia,
  getStudioImages,
  saveStudioImages,
  StudioImage,
  getCelebrities,
  saveCelebrities,
  getStudioLayoutConfig,
  saveStudioLayoutConfig,
  StudioLayoutConfig
} from "../utils/db";
import {
  Shield,
  Activity,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  RefreshCw,
  Sparkles,
  Award,
  Sliders,
  UserCheck,
  Film,
  PlusCircle,
  Image as ImageIcon,
  Crop,
  ChevronRight,
  LogOut,
  Lock,
  KeyRound,
  Phone,
  MapPin,
  Mail,
  Link,
  Save,
  Upload
} from "lucide-react";
import ImageCropperModal from "./ImageCropperModal";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { handleImageFallback } from "../utils/imageFallback";

interface AdminDashboardProps {
  artists?: Artist[];
  onUpdateArtists?: (updated: Artist[]) => void;
}

export default function AdminDashboard({ artists = [], onUpdateArtists }: AdminDashboardProps) {
  // Authentication states
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("ganga_admin_authenticated") === "true";
    }
    return false;
  });
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === "G4ng4" && loginPassword === "G4nga419") {
      setIsAdminAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("ganga_admin_authenticated", "true");
      }
      setLoginError("");
      triggerToast("Access Granted. Welcome back, Master.");
    } else {
      setLoginError("Invalid staff credentials. Access Denied.");
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("ganga_admin_authenticated");
    }
    setLoginUsername("");
    setLoginPassword("");
    triggerToast("Logged out successfully.");
  };

  const [activeAdminTab, setActiveAdminTab] = useState<"bookings" | "artists" | "videos" | "styles" | "contact" | "media" | "celebrities" | "studio">("bookings");
  const [bookings, setBookings] = useState<AppointmentBooking[]>([]);
  const [filterText, setFilterText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Studio and Channel contact details
  const [contactAddress, setContactAddress] = useState("");
  const [contactAddressSubtitle, setContactAddressSubtitle] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactEmailSubtitle, setContactEmailSubtitle] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactShowPhone, setContactShowPhone] = useState<boolean>(false);
  const [contactInstagramName, setContactInstagramName] = useState("");
  const [contactInstagramUrl, setContactInstagramUrl] = useState("");
  const [contactWhatsappNumber, setContactWhatsappNumber] = useState("");
  const [contactWhatsappLabel, setContactWhatsappLabel] = useState("");
  const [contactBgUrl, setContactBgUrl] = useState("");
  const [downloadingBg, setDownloadingBg] = useState(false);

  // Artist editor form state
  const activeArtists = artists && artists.length > 0 ? artists : getCleanArtists();
  const [selectedArtistId, setSelectedArtistId] = useState<string>(activeArtists[0]?.id || "fede-almanzor");
  const [nextAvailableInput, setNextAvailableInput] = useState("");
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [specialtyInput, setSpecialtyInput] = useState("");
  
  // Dynamic Artist Portfolio items
  const [artistPortfolio, setArtistPortfolio] = useState<{ id: string; imageUrl: string; title: string; category: string; description?: string }[]>([]);

  // 4 Portfolio image URL slots (for backwards compatibility if referenced)
  const [work1UrlInput, setWork1UrlInput] = useState("");
  const [work2UrlInput, setWork2UrlInput] = useState("");
  const [work3UrlInput, setWork3UrlInput] = useState("");
  const [work4UrlInput, setWork4UrlInput] = useState("");

  // Studio Videos state
  const [videosList, setVideosList] = useState<StudioVideo[]>([]);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoDesc, setNewVideoDesc] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");

  // Site Media state
  const [siteMedia, setSiteMedia] = useState<SiteMedia | null>(null);
  const [studioImages, setStudioImages] = useState<StudioImage[]>([]);

  // Celebrities and Customizable Studio page states
  const [celebritiesList, setCelebritiesList] = useState<CelebrityClient[]>([]);
  const [studioConfig, setStudioConfig] = useState<StudioLayoutConfig | null>(null);

  // Style Details Map editor states
  const [selectedStyleId, setSelectedStyleId] = useState("black-grey-realism");
  const [styleTitle, setStyleTitle] = useState("");
  const [styleSubtitle, setStyleSubtitle] = useState("");
  const [styleDesc, setStyleDesc] = useState("");
  const [styleFeaturedHeading, setStyleFeaturedHeading] = useState("");

  const [styleHero1Input, setStyleHero1Input] = useState("");
  const [styleHero2Input, setStyleHero2Input] = useState("");
  const [styleHero3Input, setStyleHero3Input] = useState("");

  // Dynamic Styles project images
  const [stylePortfolioImages, setStylePortfolioImages] = useState<string[]>([]);

  // Single properties (backwards compatible fallbacks)
  const [styleProj1Input, setStyleProj1Input] = useState("");
  const [styleProj2Input, setStyleProj2Input] = useState("");
  const [styleProj3Input, setStyleProj3Input] = useState("");
  const [styleProj4Input, setStyleProj4Input] = useState("");
  const [styleProj5Input, setStyleProj5Input] = useState("");

  // Crop workbench state machines
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropTarget, setCropTarget] = useState<string>("avatar");
  const [cropPreset, setCropPreset] = useState<"square" | "portrait">("square");
  const [cropSuccessCallback, setCropSuccessCallback] = useState<((croppedBase64: string) => void) | null>(null);

  const handleOpenCropper = (
    target: string,
    callback?: (base64String: string) => void,
    presetOverride?: "square" | "portrait"
  ) => {
    setCropTarget(target);
    setCropPreset(presetOverride || (target === "avatar" ? "square" : "portrait"));
    if (callback) {
      setCropSuccessCallback(() => callback);
    } else {
      setCropSuccessCallback(null);
    }
    setIsCropperOpen(true);
  };

  const uploadCroppedAssetToServer = async (base64: string, target: string): Promise<string> => {
    try {
      let type = "avatar";
      let id = selectedArtistId;
      let index = 1;

      if (target === "avatar") {
        type = "avatar";
      } else if (target.startsWith("artist-work-")) {
        type = "work";
        index = (parseInt(target.replace("artist-work-", ""), 10) || 0) + 1;
      } else if (target.startsWith("style_hero_")) {
        type = "style-bg";
        id = selectedStyleId;
        index = parseInt(target.replace("style_hero_", ""), 10) || 1;
      } else if (target.startsWith("style-proj-")) {
        type = "style";
        id = selectedStyleId;
        index = (parseInt(target.replace("style-proj-", ""), 10) || 0) + 1;
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base64,
          type,
          id,
          index,
        }),
      });

      if (!res.ok) {
        throw new Error("Backend upload failed");
      }

      const data = await res.json();
      if (data && data.url) {
        return data.url;
      }
      throw new Error("No URL returned from server");
    } catch (err) {
      console.error("Asset upload failed, falling back to Base64 in state:", err);
      return base64;
    }
  };

  const fetchAndConvertToBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP fetch error! Status: ${response.status}`);
      const blob = await response.blob();
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to read blob as Base64 string"));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.warn("Client-side URL to base64 conversion failed (usually CORS blocked). Keeping external Link:", err);
      return url;
    }
  };

  const handleAutoDownloadAndConvert = async (url: string, key: string, type: string, index: number = 1): Promise<string> => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      try {
        triggerToast("Downloading and converting external image link...");
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url,
            type,
            id: key.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase(),
            index,
          }),
        }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json();
          if (data && data.url) {
            triggerToast(`Successfully saved: ${data.url}`);
            return data.url;
          }
        }

        // Backend upload route failed/missing (e.g. static Netlify environment)
        console.log("No backend server found. Executing secure client-side Base64 local compilation instead...");
        const base64 = await fetchAndConvertToBase64(url);
        if (base64 !== url) {
          triggerToast("Successfully converted and saved image locally inside state!");
        }
        return base64;
      } catch (err) {
        console.error("Link conversion failed:", err);
      }
    }
    return url;
  };

  const handleCropComplete = async (base64String: string) => {
    triggerToast("Saving image to server folder...");
    const rawSavedUrl = await uploadCroppedAssetToServer(base64String, cropTarget);
    const savedUrl = `${rawSavedUrl}?t=${Date.now()}`;

    if (cropSuccessCallback) {
      cropSuccessCallback(savedUrl);
    } else {
      switch (cropTarget) {
        case "avatar":
          setAvatarUrlInput(savedUrl);
          break;
        case "work1":
          setWork1UrlInput(savedUrl);
          break;
        case "work2":
          setWork2UrlInput(savedUrl);
          break;
        case "work3":
          setWork3UrlInput(savedUrl);
          break;
        case "work4":
          setWork4UrlInput(savedUrl);
          break;
      }
    }
    triggerToast("Image file saved successfully!");
  };

  // Load studio and channel contact details on mount
  useEffect(() => {
    const contactSettings = getStudioContact();
    setContactAddress(contactSettings.address || "");
    setContactAddressSubtitle(contactSettings.addressSubtitle || "");
    setContactEmail(contactSettings.email || "");
    setContactEmailSubtitle(contactSettings.emailSubtitle || "");
    setContactPhone(contactSettings.phone || "");
    setContactShowPhone(contactSettings.showPhone ?? false);
    setContactInstagramName(contactSettings.instagramName || "");
    setContactInstagramUrl(contactSettings.instagramUrl || "");
    setContactWhatsappNumber(contactSettings.whatsappNumber || "");
    setContactWhatsappLabel(contactSettings.whatsappLabel || "");
    setContactBgUrl(contactSettings.bgUrl || "");
    setSiteMedia(getSiteMedia());
    setStudioImages(getStudioImages());
  }, []);

  const handleSaveContactDetails = () => {
    let cleanedWhatsapp = contactWhatsappNumber.replace(/[^0-9]/g, "");
    if (cleanedWhatsapp.length === 10 && !cleanedWhatsapp.startsWith("1")) {
      cleanedWhatsapp = "1" + cleanedWhatsapp;
    }

    let formattedInstaUrl = contactInstagramUrl.trim();
    if (formattedInstaUrl && !formattedInstaUrl.startsWith("http://") && !formattedInstaUrl.startsWith("https://")) {
      const handle = formattedInstaUrl.replace(/^@/, "");
      formattedInstaUrl = `https://www.instagram.com/${handle}`;
    }

    let formattedInstaName = contactInstagramName.trim();
    if (formattedInstaName && !formattedInstaName.startsWith("@")) {
      formattedInstaName = "@" + formattedInstaName;
    }

    if (!formattedInstaUrl && formattedInstaName) {
      formattedInstaUrl = `https://www.instagram.com/${formattedInstaName.replace(/^@/, "")}`;
    }

    saveStudioContact({
      address: contactAddress,
      addressSubtitle: contactAddressSubtitle,
      email: contactEmail,
      emailSubtitle: contactEmailSubtitle,
      phone: contactPhone,
      showPhone: contactShowPhone,
      instagramName: formattedInstaName,
      instagramUrl: formattedInstaUrl,
      whatsappNumber: cleanedWhatsapp || contactWhatsappNumber,
      whatsappLabel: contactWhatsappLabel || contactPhone,
      bgUrl: contactBgUrl
    });

    setContactInstagramUrl(formattedInstaUrl);
    setContactInstagramName(formattedInstaName);
    setContactWhatsappNumber(cleanedWhatsapp || contactWhatsappNumber);

    triggerToast("Studio Contact & Channel details saved and formatted successfully!");
  };

  // Load selected artist data for editing
  useEffect(() => {
    const currentArtist = activeArtists.find((a) => a.id === selectedArtistId);
    if (currentArtist) {
      setNextAvailableInput(currentArtist.nextAvailable);
      setAvatarUrlInput(currentArtist.avatarUrl);
      setSpecialtyInput(currentArtist.specialty || "");
      // Gather dynamic portfolio slots
      setArtistPortfolio(currentArtist.portfolio || []);
      // Maintain old state compatibility
      setWork1UrlInput(currentArtist.portfolio[0]?.imageUrl || "");
      setWork2UrlInput(currentArtist.portfolio[1]?.imageUrl || "");
      setWork3UrlInput(currentArtist.portfolio[2]?.imageUrl || "");
      setWork4UrlInput(currentArtist.portfolio[3]?.imageUrl || "");
    }
  }, [selectedArtistId, artists]);

  // Load style customized information on style select (allows cropping of styles and project images)
  useEffect(() => {
    const customMap = getCustomStyleDetails();
    if (customMap && customMap[selectedStyleId]) {
      const cur = customMap[selectedStyleId];
      setStyleTitle(cur.title1 || "");
      setStyleSubtitle(cur.subtitle || "");
      setStyleDesc(cur.description || "");
      setStyleFeaturedHeading(cur.featuredHeading || "");
      setStyleHero1Input(cur.heroImages?.[0] || "");
      setStyleHero2Input(cur.heroImages?.[1] || "");
      setStyleHero3Input(cur.heroImages?.[2] || "");
      // Dynamic profile list
      setStylePortfolioImages(cur.portfolioImages || []);
      // Backward compatible fallbacks
      setStyleProj1Input(cur.portfolioImages?.[0] || "");
      setStyleProj2Input(cur.portfolioImages?.[1] || "");
      setStyleProj3Input(cur.portfolioImages?.[2] || "");
      setStyleProj4Input(cur.portfolioImages?.[3] || "");
      setStyleProj5Input(cur.portfolioImages?.[4] || "");
    } else {
      const nameMap: Record<string, string> = {
        "black-grey-realism": "Black & Gray Realism",
        "black-grey-microrealism": "Black & Gray Microrealism",
        "black-grey-sculptures": "Black & Gray Realism Sculptures",
        "black-grey-big-pieces": "Black & Gray Realism Big Pieces",
        "blackwork": "Blackwork",
        "color-original-designs": "Color Original Designs",
        "color-microrealism": "Color Microrealism",
        "color-realism": "Color Realism",
        "fineline-conceptual": "Fineline-Conceptual",
        "neotraditional": "Neotraditional",
        "pet-portraits": "Pet Portraits",
        "portraits": "Portraits",
      };
      const title = nameMap[selectedStyleId] || selectedStyleId.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      setStyleTitle(title);
      setStyleSubtitle(`${title}, highly popular contemporary masterwork style.`);
      setStyleDesc("Classic bespoke craftsmanship showing intricate layers and precision shading.");
      setStyleFeaturedHeading(`Featured ${title} Projects`);
      setStyleHero1Input(`/images/styles/${selectedStyleId}-bg-1.png`);
      setStyleHero2Input(`/images/styles/${selectedStyleId}-bg-2.png`);
      setStyleHero3Input(`/images/styles/${selectedStyleId}-bg-3.png`);
      // Default 5 curated slots for styles
      const defaultProjs = [
        `/images/styles/${selectedStyleId}-1.png`,
        `/images/styles/${selectedStyleId}-2.png`,
        `/images/styles/${selectedStyleId}-3.png`,
        `/images/styles/${selectedStyleId}-4.png`,
        `/images/styles/${selectedStyleId}-5.png`,
      ];
      setStylePortfolioImages(defaultProjs);
      setStyleProj1Input(defaultProjs[0]);
      setStyleProj2Input(defaultProjs[1]);
      setStyleProj3Input(defaultProjs[2]);
      setStyleProj4Input(defaultProjs[3]);
      setStyleProj5Input(defaultProjs[4]);
    }
  }, [selectedStyleId]);

  const handleSaveStyleDetails = async () => {
    triggerToast("Saving style specifications... Inspecting links...");

    // Convert hero cover images from external URLs if needed
    let finalHero1 = styleHero1Input;
    let finalHero2 = styleHero2Input;
    let finalHero3 = styleHero3Input;

    if (styleHero1Input && (styleHero1Input.startsWith("http://") || styleHero1Input.startsWith("https://"))) {
      finalHero1 = await handleAutoDownloadAndConvert(styleHero1Input, `${selectedStyleId}_hero_1`, "style-bg", 1);
      setStyleHero1Input(finalHero1);
    }
    if (styleHero2Input && (styleHero2Input.startsWith("http://") || styleHero2Input.startsWith("https://"))) {
      finalHero2 = await handleAutoDownloadAndConvert(styleHero2Input, `${selectedStyleId}_hero_2`, "style-bg", 2);
      setStyleHero2Input(finalHero2);
    }
    if (styleHero3Input && (styleHero3Input.startsWith("http://") || styleHero3Input.startsWith("https://"))) {
      finalHero3 = await handleAutoDownloadAndConvert(styleHero3Input, `${selectedStyleId}_hero_3`, "style-bg", 3);
      setStyleHero3Input(finalHero3);
    }

    // Convert Showcase portfolio dynamic lists
    const convertedPortfolio = await Promise.all(
      stylePortfolioImages.map(async (imageUrl, idx) => {
        if (imageUrl && (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))) {
          return await handleAutoDownloadAndConvert(imageUrl, `${selectedStyleId}_portfolio`, "style", idx + 1);
        }
        return imageUrl;
      })
    );

    setStylePortfolioImages(convertedPortfolio);

    const customMap = getCustomStyleDetails() || {};
    customMap[selectedStyleId] = {
      title1: styleTitle,
      subtitle: styleSubtitle,
      description: styleDesc,
      featuredHeading: styleFeaturedHeading,
      bookingLabel: `BOOK ${styleTitle.toUpperCase()}`,
      heroImages: [finalHero1, finalHero2, finalHero3],
      portfolioImages: convertedPortfolio
    };
    saveCustomStyleDetails(customMap);
    triggerToast(`Style "${styleTitle}" customized portfolio saved!`);
  };

  const addStylePortfolioImage = () => {
    setStylePortfolioImages((prev) => [...prev, ""]);
  };

  const deleteStylePortfolioImage = (indexToDelete: number) => {
    setStylePortfolioImages((prev) => prev.filter((_, i) => i !== indexToDelete));
  };

  const updateStylePortfolioImage = (indexToUpdate: number, newVal: string) => {
    setStylePortfolioImages((prev) =>
      prev.map((img, i) => (i === indexToUpdate ? newVal : img))
    );
  };

  // Load studio videos list
  useEffect(() => {
    setVideosList(getStudioVideos());
    setCelebritiesList(getCelebrities());
    setStudioConfig(getStudioLayoutConfig());
  }, []);

  // Trigger loading bookings
  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const records = await getBookings();
      setBookings(records);
    } catch (err) {
      console.error("Failed loading admin bookings list:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleUpdateStatus = async (id: string, status: AppointmentBooking["status"]) => {
    try {
      const ok = await updateBookingStatus(id, status);
      if (ok) {
        triggerToast(`Booking ${id} status updated to: ${status}`);
        loadRecords();
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!confirm(`Are you sure you want to permanently delete booking ${id}? This is irreversible.`)) {
      return;
    }
    try {
      const ok = await deleteBooking(id);
      if (ok) {
        triggerToast(`Booking ${id} permanently removed.`);
        loadRecords();
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  const handleResetSeeds = () => {
    localStorage.removeItem("ganga_bookings");
    localStorage.removeItem("ganga_artists");
    localStorage.removeItem("ganga_videos");
    localStorage.removeItem("ganga_celebrities");
    localStorage.removeItem("ganga_studio_layout_config");
    triggerToast("Database reset to pristine seed data.");
    loadRecords();
    setVideosList(getStudioVideos());
    setCelebritiesList(getCelebrities());
    setStudioConfig(getStudioLayoutConfig());
    if (onUpdateArtists) {
      onUpdateArtists(getCleanArtists());
    }
  };

  const addArtistPortfolioSlot = () => {
    setArtistPortfolio((prev) => [
      ...prev,
      {
        id: `custom-slot-${Date.now()}`,
        imageUrl: "",
        title: `Masterpiece ${prev.length + 1}`,
        category: specialtyInput.split(",")[0]?.trim() || "Black & Gray Realism",
        description: "Bespoke customized mastery artwork design."
      }
    ]);
  };

  const deleteArtistPortfolioSlot = (indexToDelete: number) => {
    setArtistPortfolio((prev) => prev.filter((_, i) => i !== indexToDelete));
  };

  const updateArtistPortfolioUrl = (indexToUpdate: number, newUrl: string) => {
    setArtistPortfolio((prev) =>
      prev.map((item, i) => (i === indexToUpdate ? { ...item, imageUrl: newUrl } : item))
    );
  };

  // Save modified Artist details
  const handleSaveArtistProfile = async () => {
    const artistToUpdate = activeArtists.find((a) => a.id === selectedArtistId);
    if (!artistToUpdate) return;

    triggerToast("Saving artist profile... Inspecting and converting any external links...");

    // Auto-convert primary avatar if it is external
    let finalAvatarUrl = avatarUrlInput;
    if (avatarUrlInput && (avatarUrlInput.startsWith("http://") || avatarUrlInput.startsWith("https://"))) {
      finalAvatarUrl = await handleAutoDownloadAndConvert(avatarUrlInput, `avatar_${selectedArtistId}`, "avatar");
      setAvatarUrlInput(finalAvatarUrl);
    }

    // Auto-convert any external urls in key portfolio items
    const convertedPortfolio = await Promise.all(
      artistPortfolio.map(async (item, idx) => {
        if (item.imageUrl && (item.imageUrl.startsWith("http://") || item.imageUrl.startsWith("https://"))) {
          const finalItemUrl = await handleAutoDownloadAndConvert(item.imageUrl, `${selectedArtistId}_portfolio`, "portfolio", idx + 1);
          return { ...item, imageUrl: finalItemUrl };
        }
        return item;
      })
    );

    setArtistPortfolio(convertedPortfolio);

    const updatedList = activeArtists.map((a) => {
      if (a.id === selectedArtistId) {
        const cloned = { ...a };
        cloned.nextAvailable = nextAvailableInput;
        cloned.avatarUrl = finalAvatarUrl;
        cloned.specialty = specialtyInput;
        
        // Save dynamic artist portfolio array
        cloned.portfolio = convertedPortfolio.map((item, index) => {
          return {
            id: item.id || `${selectedArtistId}-${index + 1}`,
            imageUrl: item.imageUrl,
            title: item.title || `Masterpiece ${index + 1}`,
            category: item.category || specialtyInput || "Black & Gray Realism",
            description: item.description || "Prestige custom master tattoo placement."
          };
        });

        return cloned;
      }
      return a;
    });

    if (onUpdateArtists) {
      onUpdateArtists(updatedList);
    } else {
      localStorage.setItem("ganga_artists", JSON.stringify(updatedList));
    }

    triggerToast(`Master ${artistToUpdate.name}'s specialities & portfolio updated successfully!`);
  };

  // Video management handlers
  const handleAddVideo = async () => {
    if (!newVideoTitle || !newVideoUrl) {
      alert("Please fill out at least a Title and Video URL.");
      return;
    }

    let finalVideoUrl = newVideoUrl;
    if (newVideoUrl.startsWith("http://") || newVideoUrl.startsWith("https://")) {
      triggerToast("Downloading and converting showreel video... This may take several seconds.");
      finalVideoUrl = await handleAutoDownloadAndConvert(newVideoUrl, `video_reel_${Date.now()}`, "video");
    }

    const newVid: StudioVideo = {
      id: `vid-${Date.now()}`,
      title: newVideoTitle.toUpperCase(),
      description: newVideoDesc || "No dynamic reel description provided.",
      videoUrl: finalVideoUrl
    };

    const updated = [...videosList, newVid];
    saveStudioVideos(updated);
    setVideosList(updated);

    setNewVideoTitle("");
    setNewVideoDesc("");
    setNewVideoUrl("");
    triggerToast("Showcase video added and stored successfully!");
  };

  const handleDeleteVideo = (id: string) => {
    if (!confirm("Are you sure you want to delete this showcase video?")) return;
    const filtered = videosList.filter((v) => v.id !== id);
    saveStudioVideos(filtered);
    setVideosList(filtered);
    triggerToast("Showcase video removed.");
  };

  // Filter listings
  const filteredBookings = bookings.filter((b) => {
    const text = filterText.toLowerCase();
    return (
      b.clientName.toLowerCase().includes(text) ||
      b.id.toLowerCase().includes(text) ||
      b.artistName.toLowerCase().includes(text) ||
      b.style.toLowerCase().includes(text) ||
      b.placement.toLowerCase().includes(text)
    );
  });

  // Calculate statistics metrics
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const totalSizeVolume = bookings.reduce((sum, b) => sum + b.estimatedSizeInches, 0);

  const currentlyEditingArtist = activeArtists.find((a) => a.id === selectedArtistId);

  if (!isAdminAuthenticated) {
    return (
      <div 
        id="admin-login-overlay" 
        className="bg-black min-h-[75vh] flex items-center justify-center py-16 px-4 border-t border-white/[0.04] text-left"
      >
        {/* Toast Notification Banner inside Login in case of notifications */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              id="login-toast-banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#C5A059] text-neutral-950 px-6 py-3.5 rounded-none shadow-xl font-mono text-xs font-semibold tracking-wider border border-[#C5A059] flex items-center gap-2 uppercase animate-pulse"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-neutral-950 border border-[#C5A059]/30 p-8 rounded-2xl shadow-2xl relative overflow-hidden"
        >
          {/* Subtle gold accent bg glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center space-y-3 mb-8">
            <div className="w-12 h-12 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto border border-[#C5A059]/20">
              <Shield className="w-5 h-5 text-[#C5A059]" />
            </div>
            <h2 className="font-serif font-black text-2xl uppercase tracking-wider text-white">
              Studio Portal
            </h2>
            <p className="text-[10px] font-mono tracking-widest uppercase text-[#C5A059] font-bold">
              Secure Staff Login Required
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-500/10 border border-red-500/30 text-red-500 p-3.5 text-xs text-center rounded-xl font-medium"
              >
                {loginError}
              </motion.div>
            )}

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold block">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-[#0c0c0c] border border-white/10 focus:border-[#C5A059] focus:outline-none transition-colors duration-300 py-3.5 pl-10 pr-4 text-xs font-sans text-white rounded-xl"
                  placeholder="Enter staff username"
                />
                <Lock className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold block">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-[#0c0c0c] border border-white/10 focus:border-[#C5A059] focus:outline-none transition-colors duration-300 py-3.5 pl-10 pr-4 text-xs font-sans text-white rounded-xl"
                  placeholder="••••••••••••"
                />
                <KeyRound className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-4 bg-[#C5A059] hover:bg-white text-black font-mono text-xs uppercase font-black tracking-widest transition-all duration-300 rounded-xl cursor-pointer hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-black" />
              <span>Authorize Access</span>
            </button>
          </form>

          <p className="text-center text-[9px] text-neutral-500 mt-6 font-mono tracking-wider">
            GANGA TATTOO ATLANTA • OPERATIONAL STANDARDS SECURED
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      id="admin-dashboard-container"
      className="bg-black min-h-[85vh] py-16 md:py-20 text-white border-t border-white/[0.04] text-left"
    >
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Toast Notification Banner */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              id="admin-toast-banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#C5A059] text-neutral-950 px-6 py-3.5 rounded-none shadow-xl font-mono text-xs font-semibold tracking-wider border border-[#C5A059] flex items-center gap-2 uppercase"
            >
              <Sparkles className="w-4 h-4 animate-spin text-black" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Title Panel: Sticky on top of screen */}
        <div className="sticky top-0 bg-black/95 backdrop-blur-md z-40 py-4 border-b border-white/[0.08] flex flex-col md:flex-row md:items-end justify-between gap-6 -mx-6 px-6">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#C5A059] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Studio Operations Portal
            </span>
            <h1 className="text-2xl md:text-4xl font-serif font-black tracking-wide border-none uppercase text-white">
              Studio Admin Portal
            </h1>
            <p className="text-[11px] text-neutral-400 font-sans tracking-wide">
              Real-time administration controls for Ganga Tattoo scheduling, available slots, masters specialties, and showcase videos.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              id="admin-reset-db-btn"
              onClick={handleResetSeeds}
              className="px-4 py-2 bg-neutral-900 border border-white/10 hover:border-white/30 rounded-none text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-white transition-colors duration-300 flex items-center gap-2 cursor-pointer text-left"
              title="Reset Database to seed data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
            <button
              id="admin-refresh-list-btn"
              onClick={loadRecords}
              className="px-4 py-2 bg-neutral-900 border border-white/10 hover:border-white/30 rounded-none text-xs font-mono uppercase tracking-widest text-[#C5A059] transition-colors duration-300 flex items-center gap-2 cursor-pointer text-left"
              title="Reload database lists"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Bookings</span>
            </button>
            <button
              id="admin-logout-btn"
              onClick={handleLogout}
              className="px-4 py-2 bg-red-950/20 border border-red-500/20 hover:border-red-500/50 hover:bg-red-500 hover:text-black rounded-none text-xs font-mono uppercase tracking-widest text-red-400 transition-colors duration-300 flex items-center gap-2 cursor-pointer text-left"
              title="Logout from operations portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Selection Row */}
        <div className="flex border-b border-white/10 gap-4 flex-wrap">
          <button
            id="admin-tab-bookings-trigger"
            onClick={() => setActiveAdminTab("bookings")}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              activeAdminTab === "bookings"
                ? "border-[#C5A059] text-white font-black"
                : "border-transparent text-neutral-500 hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4 inline-block mr-2" />
            Appointments ({bookings.length})
          </button>
          <button
            id="admin-tab-artists-trigger"
            onClick={() => setActiveAdminTab("artists")}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              activeAdminTab === "artists"
                ? "border-[#C5A059] text-white font-black"
                : "border-transparent text-neutral-500 hover:text-white"
            }`}
          >
            <UserCheck className="w-4 h-4 inline-block mr-2" />
            Resident Masters ({activeArtists.length})
          </button>
          <button
            id="admin-tab-videos-trigger"
            onClick={() => setActiveAdminTab("videos")}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              activeAdminTab === "videos"
                ? "border-[#C5A059] text-white font-black"
                : "border-transparent text-neutral-500 hover:text-white"
            }`}
          >
            <Film className="w-4 h-4 inline-block mr-2" />
            Studio Videos ({videosList.length})
          </button>
          <button
            id="admin-tab-styles-trigger"
            onClick={() => setActiveAdminTab("styles")}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              activeAdminTab === "styles"
                ? "border-[#C5A059] text-white font-black"
                : "border-transparent text-neutral-500 hover:text-white"
            }`}
          >
            <ImageIcon className="w-4 h-4 inline-block mr-2" />
            Styles & Sections (12)
          </button>
          <button
            id="admin-tab-contact-trigger"
            onClick={() => setActiveAdminTab("contact")}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              activeAdminTab === "contact"
                ? "border-[#C5A059] text-white font-black"
                : "border-transparent text-neutral-500 hover:text-white"
            }`}
          >
            <Phone className="w-4 h-4 inline-block mr-2 text-[#C5A059]" />
            Contact & Channel Details
          </button>
          <button
            id="admin-tab-media-trigger"
            onClick={() => setActiveAdminTab("media")}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              activeAdminTab === "media"
                ? "border-[#C5A059] text-white font-black"
                : "border-transparent text-neutral-500 hover:text-white"
            }`}
          >
            <ImageIcon className="w-4 h-4 inline-block mr-2 text-[#C5A059]" />
            Site Media
          </button>
          <button
            id="admin-tab-celebrities-trigger"
            onClick={() => setActiveAdminTab("celebrities")}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              activeAdminTab === "celebrities"
                ? "border-[#C5A059] text-[#C5A059] font-black"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <Award className="w-4 h-4 inline-block mr-2 text-[#C5A059]" />
            Celebrity Clients ({celebritiesList.length})
          </button>
          <button
            id="admin-tab-studio-trigger"
            onClick={() => setActiveAdminTab("studio")}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              activeAdminTab === "studio"
                ? "border-[#C5A059] text-[#C5A059] font-black"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <ImageIcon className="w-4 h-4 inline-block mr-2 text-[#C5A059]" />
            Studio Page Design (11)
          </button>
        </div>

        {/* Tab 1: Bookings ledger */}
        {activeAdminTab === "bookings" && (
          <div id="admin-ledger-pane" className="space-y-8">
            {/* Quick Stats Grid widgets */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-neutral-950 border border-white/[0.04] p-5 rounded-none hover:border-[#C5A059]/15 duration-300 transition-colors text-left">
                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                  Total Requests
                </p>
                <p className="text-3xl font-serif text-white tracking-wide mt-2 font-black">
                  {totalBookings}
                </p>
                <p className="text-[10px] text-neutral-500 font-sans mt-1">
                  Active operations ledger
                </p>
              </div>

              <div className="bg-neutral-950 border border-white/[0.04] p-5 rounded-none hover:border-yellow-500/15 duration-300 transition-colors text-left">
                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-yellow-500" />
                  Pending Review
                </p>
                <p className="text-3xl font-serif text-yellow-500 tracking-wide mt-2 font-black">
                  {pendingCount}
                </p>
                <p className="text-[10px] text-neutral-500 font-sans mt-1">
                  Awaiting studio contact
                </p>
              </div>

              <div className="bg-neutral-950 border border-white/[0.04] p-5 rounded-none hover:border-emerald-500/15 duration-300 transition-colors text-left">
                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Confirmed Slots
                </p>
                <p className="text-3xl font-serif text-emerald-500 tracking-wide mt-2 font-black">
                  {confirmedCount}
                </p>
                <p className="text-[10px] text-neutral-500 font-sans mt-1">
                  Booked on artist calendars
                </p>
              </div>

              <div className="bg-neutral-950 border border-white/[0.04] p-5 rounded-none hover:border-[#C5A059]/15 duration-300 transition-colors text-left">
                <p className="text-[10px] font-mono text-[#C5A059] uppercase tracking-widest flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                  Total Sized Area
                </p>
                <p className="text-3xl font-serif text-white tracking-wide mt-2 font-black">
                  {totalSizeVolume}"
                </p>
                <p className="text-[10px] text-neutral-500 font-sans mt-1">
                  Cumulative project inches
                </p>
              </div>
            </div>

            {/* Database Filters Bar */}
            <div className="bg-neutral-950 p-4 border border-white/[0.04] rounded-none flex flex-col md:flex-row items-center gap-4 justify-between text-left magnet-box">
              <div className="relative w-full md:w-96">
                <input
                  id="admin-search-input"
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Search by client, artist, style, placement..."
                  className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#C5A059] rounded-none py-2.5 pl-9 pr-4 text-xs font-sans placeholder-neutral-600 focus:outline-none transition-colors text-white"
                />
                <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-neutral-500" />
              </div>

              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                Showing <strong className="text-white">{filteredBookings.length}</strong> of{" "}
                {bookings.length} Registered entries
              </div>
            </div>

            {/* Bookings rows */}
            {isLoading ? (
              <div className="py-20 text-center text-neutral-400 font-mono text-xs flex justify-center items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
                Reading central scheduler databases...
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="py-16 text-center text-neutral-500 bg-[#0a0a0a] border border-white/5 font-sans">
                No appointment applications match your active filters.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((bk) => (
                  <motion.div
                    key={bk.id}
                    layout
                    id={`row-card-${bk.id}`}
                    className="p-5 md:p-6 bg-white/[0.01] backdrop-blur-md border border-white/[0.06] hover:border-white/15 transition-colors text-left flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="space-y-4 flex-1">
                      {/* Ticket header details */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 bg-[#101010] border border-white/10 text-[9px] font-mono text-neutral-300 uppercase select-all">
                          {bk.id}
                        </span>
                        
                        {/* Status badges */}
                        <span className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-bold ${
                          bk.status === "pending" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                          bk.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          bk.status === "completed" ? "bg-blue-500/10 text-blue-400 border border-emerald-500/20" :
                          "bg-neutral-800 text-neutral-400 border border-white/5"
                        }`}>
                          {bk.status}
                        </span>

                        <span className="text-[10px] text-neutral-500 font-mono">
                          {new Date(bk.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Main client query parameters info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/[0.04] pt-4">
                        <div className="space-y-1">
                          <span className="text-neutral-500 text-[10px] font-mono uppercase">Client contact</span>
                          <h4 className="font-serif font-black uppercase text-sm tracking-wide text-white">
                            {bk.clientName}
                          </h4>
                          <p className="text-xs text-neutral-400 font-sans">{bk.clientEmail}</p>
                          <p className="text-xs text-neutral-400 font-sans">{bk.clientPhone}</p>
                          {bk.clientInstagram && (
                            <p className="text-[10px] text-[#C5A059] font-mono flex items-center gap-1.5">
                              @{bk.clientInstagram}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <span className="text-neutral-500 text-[10px] font-mono uppercase">Session specifics</span>
                          <p className="text-xs text-neutral-200">
                            Artist: <strong className="text-[#C5A059]">{bk.artistName}</strong>
                          </p>
                          <p className="text-xs text-neutral-200">
                            Placement: <strong className="uppercase">{bk.placement}</strong>
                          </p>
                          <p className="text-xs text-neutral-200">
                            Design: <strong className="uppercase">{bk.style.replace(/_/g, " ")} {bk.estimatedSizeInches}"</strong>
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-neutral-500 text-[10px] font-mono uppercase">Scheduled Date/Slot</span>
                          <p className="text-xs text-white uppercase font-bold flex items-center gap-1">
                            {bk.date}
                          </p>
                          <p className="text-xs text-neutral-300 font-mono">{bk.timeSlot}</p>
                          <span className={`inline-block px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase mt-1 ${
                            bk.urgency === "vip" ? "bg-[#C5A059]/15 text-[#C5A059]" : "bg-white/5 text-neutral-400"
                          }`}>
                            {bk.urgency} priority
                          </span>
                        </div>
                      </div>

                      {/* Text descriptions and files uploaded */}
                      <div className="space-y-2 pt-2 border-t border-white/[0.04] text-xs font-sans text-neutral-300">
                        <p className="leading-relaxed text-left">
                          <span className="text-neutral-500 font-mono text-[10px] uppercase block">Concept notes:</span>
                          {bk.description || "No layout description provided."}
                        </p>

                        {/* References */}
                        {bk.referenceImages && bk.referenceImages.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-neutral-500 font-mono text-[10px] uppercase block">Client references:</span>
                            <div className="flex gap-2.5">
                              {bk.referenceImages.map((src, i) => (
                                <img
                                  key={i}
                                  src={src}
                                  alt="Reference preview thumbnail"
                                  className="h-10 w-10 object-cover border border-white/10 hover:border-[#C5A059] transition-colors"
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {bk.notes && (
                          <div className="bg-yellow-500/5 p-3 rounded-none text-[11px] text-yellow-300 font-sans border border-yellow-500/10 leading-relaxed text-left">
                            ⚠️ Custom Notes: {bk.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Operations control parameters on right */}
                    <div className="flex lg:flex-col gap-2.5 w-full lg:w-auto self-stretch lg:justify-start justify-end shrink-0 border-t lg:border-t-0 border-white/[0.04] pt-4 lg:pt-0">
                      {bk.status === "pending" && (
                        <button
                          id={`row-btn-confirm-${bk.id}`}
                          onClick={() => handleUpdateStatus(bk.id, "confirmed")}
                          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-mono uppercase tracking-widest text-[9px] rounded-none transition-colors flex items-center justify-center gap-1.5 font-bold cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Confirm Spot
                        </button>
                      )}

                      {bk.status === "confirmed" && (
                        <button
                          id={`row-btn-complete-${bk.id}`}
                          onClick={() => handleUpdateStatus(bk.id, "completed")}
                          className="px-3.5 py-2 bg-blue-700 hover:bg-blue-600 text-white font-mono uppercase tracking-widest text-[9px] rounded-none transition-colors flex items-center justify-center gap-1.5 font-bold cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Mark Completed
                        </button>
                      )}

                      {bk.status !== "cancelled" && bk.status !== "completed" && (
                        <button
                          id={`row-btn-cancel-${bk.id}`}
                          onClick={() => handleUpdateStatus(bk.id, "cancelled")}
                          className="px-3.5 py-2 bg-neutral-900 hover:bg-red-950/40 border border-white/5 hover:border-red-900/50 text-neutral-400 hover:text-red-400 font-mono uppercase tracking-widest text-[9px] rounded-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Cancel Spot
                        </button>
                      )}

                      <button
                        id={`row-btn-delete-${bk.id}`}
                        onClick={() => handleDeleteRecord(bk.id)}
                        className="p-2 bg-neutral-900 hover:bg-red-600 border border-white/5 hover:border-red-600 text-red-500 hover:text-white rounded-none transition-colors flex items-center justify-center lg:mt-auto cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Resident Masters management panel */}
        {activeAdminTab === "artists" && (
          <div id="admin-artists-editor" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Left Column: Selector of artists (glass-like) */}
            <div className="lg:col-span-4 bg-[#0a0a0a] border border-white/10 p-5 space-y-4 rounded-2xl">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#C5A059] border-b border-white/5 pb-2 font-bold flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#C5A059]" />
                Select Resident
              </h3>
              
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                {activeArtists.map((m) => {
                  const isCur = m.id === selectedArtistId;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedArtistId(m.id)}
                      className={`w-full text-left px-3 py-2.5 text-xs font-sans tracking-wide transition-all uppercase flex items-center gap-3 border rounded-xl cursor-pointer ${
                        isCur
                          ? "bg-[#C5A059] text-black border-[#C5A059] font-black shadow-md"
                          : "bg-transparent text-neutral-300 border-white/5 hover:bg-white/[0.03] hover:border-white/10"
                      }`}
                    >
                      <div className="w-6 h-6 shrink-0 rounded-lg overflow-hidden bg-white/10 border border-white/5 relative">
                        <img
                          src={m.avatarUrl}
                          alt="avatar"
                          className="w-full h-full object-cover"
                          onError={(e) => handleImageFallback(e, 'avatar', m.id)}
                        />
                      </div>
                      <span className="truncate">{m.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Edit form fields with added specialty selector! */}
            <div className="lg:col-span-8 bg-white/[0.01] backdrop-blur-md border border-white/[0.08] p-6 md:p-8 space-y-6 rounded-2xl">
              <div className="border-b border-white/5 pb-4">
                <h3 className="font-serif font-black text-xl md:text-2xl uppercase tracking-wider text-white">
                  Profile Editor — <span className="text-[#C5A059]">{currentlyEditingArtist?.name}</span>
                </h3>
                <p className="text-[11px] font-sans text-neutral-400 mt-1">
                  Update this resident master's portfolio pictures, general specialties, skills, and profile available spot text.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Available Slot text field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block font-bold">
                    Calendar Available Slot status
                  </label>
                  <input
                    id="edit-field-nextAvailable"
                    type="text"
                    value={nextAvailableInput}
                    onChange={(e) => setNextAvailableInput(e.target.value)}
                    placeholder="e.g. In 3 Days, In 1 Week"
                    className="w-full bg-[#0c0c0c] border border-white/10 py-3.5 px-4 text-sm font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                  />
                  <p className="text-[9px] text-neutral-500 font-sans">
                    Configures the emerald pulse status displayed on the public artists profiles page.
                  </p>
                </div>

                {/* Main Avatar profile photo */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block font-bold">
                    Primary Portrait image Url
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="edit-field-avatarUrl"
                      type="text"
                      value={avatarUrlInput}
                      onChange={(e) => setAvatarUrlInput(e.target.value)}
                      placeholder="Unsplash / external image URL"
                      className="flex-1 bg-[#0c0c0c] border border-white/10 py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                    />
                    <button
                      id="btn-crop-avatar"
                      type="button"
                      onClick={() => handleOpenCropper("avatar")}
                      className="px-4 py-2 bg-[#C5A059] hover:bg-white text-black text-xs font-mono font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Upload and Crop Portrait"
                    >
                      <Crop className="w-3.5 h-3.5 text-black" />
                      <span>Crop</span>
                    </button>
                  </div>
                  <p className="text-[9px] text-neutral-500 font-sans">
                    Absolute path for the resident's headshot thumbnail portrait.
                  </p>
                </div>
              </div>

              {/* COMMAS SEPARATED SPECIALTIER / SKILL FORM (Satisfies: "admin should be able to change the skills of each artist.") */}
              <div className="space-y-2 pt-4 border-t border-white/5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block font-bold">
                  SKILLS & SPECIALTIES (comma-separated list of styles)
                </label>
                <input
                  id="edit-field-specialty"
                  type="text"
                  value={specialtyInput}
                  onChange={(e) => setSpecialtyInput(e.target.value)}
                  placeholder="e.g. Neotraditional, Blackwork, Color Realism"
                  className="w-full bg-[#0c0c0c] border border-white/10 py-3.5 px-4 text-sm font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                />
                <p className="text-[9px] text-neutral-500 font-sans">
                  The primary style names. If you specify multiple comma-separated styles (e.g. <strong className="text-[#C5A059]">"Neotraditional, Blackwork, Fineline"</strong>), the grid layout automatically parses them and displays summaries (e.g. <strong className="text-white">"Neotraditional +2"</strong>).
                </p>
              </div>

              {/* Dynamic Masterpiece portfolio images editing slots */}
              <div className="space-y-4 pt-4 border-t border-white/5 text-left">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-black flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                    Curated Portfolio Masterpieces ({artistPortfolio.length} Images)
                  </h4>
                  <button
                    type="button"
                    onClick={addArtistPortfolioSlot}
                    className="px-3 py-1.5 bg-neutral-900 border border-[#C5A059]/30 hover:border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black text-[9px] font-mono uppercase tracking-widest transition-all rounded-lg flex items-center gap-1.5 cursor-pointer font-black"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Slot</span>
                  </button>
                </div>

                {artistPortfolio.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                    <p className="text-xs text-neutral-500 font-mono">No masterpiece slots yet. Click "Add Slot" to add dynamic portfolio items.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {artistPortfolio.map((item, idx) => (
                      <div key={item.id || idx} className="bg-black/35 border border-white/5 p-4 rounded-2xl space-y-3 relative group">
                        {/* Title and delete action bar */}
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono text-[#C5A059] uppercase tracking-wider">
                            Masterpiece #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteArtistPortfolioSlot(idx)}
                            className="p-1 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors"
                            title="Delete this masterpiece slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Image URL with Crop option */}
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono uppercase text-neutral-500">Image Asset URL</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={item.imageUrl}
                              onChange={(e) => updateArtistPortfolioUrl(idx, e.target.value)}
                              placeholder="/images/artists/... or Unsplash"
                              className="flex-1 bg-[#0c0c0c] border border-white/10 py-2 px-3 text-[11px] font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                            />
                            <button
                              type="button"
                              onClick={() => handleOpenCropper(`artist-work-${idx}`, (croppedBase64) => updateArtistPortfolioUrl(idx, croppedBase64), "portrait")}
                              className="px-3 bg-neutral-900 border border-white/10 text-neutral-450 hover:text-black hover:bg-[#C5A059] hover:border-[#C5A059] text-xs rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 gap-1"
                              title={`Upload & Crop Masterpiece ${idx + 1}`}
                            >
                              <Crop className="w-3.5 h-3.5" />
                              <span className="text-[10px] uppercase font-mono font-black">Crop</span>
                            </button>
                          </div>
                        </div>

                        {/* Quick thumbnail preview inside the editor card */}
                        {item.imageUrl && (
                          <div className="w-16 h-20 bg-black/50 border border-white/10 rounded-xl overflow-hidden mt-1 relative">
                            <img key={item.imageUrl} src={item.imageUrl} alt="preview" className="w-full h-full object-cover" onError={(e) => handleImageFallback(e, 'portfolio', selectedArtistId, idx + 1)} />
                            <div className="absolute top-1 right-1 bg-black/70 rounded px-1.5 py-0.5 text-[7px] text-[#C5A059] font-mono">
                              PREVIEW
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action and Live preview rows */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-4 text-left">
                  {/* Live mini preview of updated avatar */}
                  {avatarUrlInput && (
                    <div className="w-12 h-12 bg-white/20 border border-white/10 overflow-hidden rounded-xl shrink-0" title="Updated Photo preview">
                      <img key={avatarUrlInput} src={avatarUrlInput} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <p className="text-[10px] text-neutral-400 font-sans max-w-xs">
                    Review your modifications in the live layouts before clicking Save.
                  </p>
                </div>

                <button
                  id="admin-save-artist-profile-btn"
                  onClick={handleSaveArtistProfile}
                  className="w-full md:w-auto px-6 py-3 bg-[#C5A059] hover:bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all select-none flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-black animate-pulse" />
                  <span>Save configurations</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Dedicated Studio Videos management panel! (Satisfies: "admin should also be able to upload videos.") */}
        {activeAdminTab === "videos" && (
          <div id="admin-video-mngr-container" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
              {/* Left Column: Form to upload a video */}
              <div className="lg:col-span-5 bg-white/[0.01] border border-white/10 p-6 md:p-8 space-y-6 rounded-2xl">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-[#C5A059] font-black flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-[#C5A059]" />
                    Add Showcase Video
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-sans mt-1">
                    Register a new MP4 video clip to display on the Studio Tour cinematic looping section.
                  </p>
                </div>

                {/* Form Inputs */}
                <div className="space-y-4">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Reel Title</label>
                    <input
                      type="text"
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                      placeholder="e.g. Masterwork Sleeves Loop"
                      className="w-full bg-[#0c0c0c] border border-white/10 py-3 px-3 text-xs font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                    />
                  </div>

                  {/* Video URL */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Video URL (direct link to MP4)</label>
                    <input
                      type="text"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      placeholder="https://assets.mixkit.co/... .mp4"
                      className="w-full bg-[#0c0c0c] border border-white/10 py-3 px-3 text-xs font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl shadow-inner"
                    />
                    <span className="text-[8px] text-neutral-500 font-sans block leading-relaxed">
                      Must be an absolute hyperlink to a media streaming server or direct loopable video block.
                    </span>
                  </div>

                  {/* Local Video File Uploader */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Or Upload Video file</label>
                    <div className="relative group border border-dashed border-white/10 hover:border-[#C5A059]/40 bg-[#0c0c0c] rounded-xl p-4 transition-all duration-300">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          if (file.size > 40 * 1024 * 1024) {
                            alert("Video file size is too large (maximum 40MB). Please compress the video.");
                            return;
                          }

                          triggerToast("Reading local video file...");
                          const reader = new FileReader();
                          reader.onload = async (event) => {
                            const base64 = event.target?.result as string;
                            if (!base64) return;

                            triggerToast("Uploading video file to server...");
                            try {
                              const res = await fetch("/api/upload", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  base64,
                                  type: "video",
                                  id: `vid-${file.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}-${Date.now()}`,
                                  index: 1,
                                }),
                              }).catch(() => null);

                              if (res && res.ok) {
                                const data = await res.json();
                                if (data && data.url) {
                                  setNewVideoUrl(data.url);
                                  triggerToast("Video saved successfully on server!");
                                } else {
                                  setNewVideoUrl(base64);
                                  triggerToast("Video saved inside client local state successfully!");
                                }
                              } else {
                                setNewVideoUrl(base64);
                                triggerToast("Video initialized in local browser state!");
                              }
                            } catch (err) {
                              console.error("Video local save error:", err);
                              setNewVideoUrl(base64);
                              triggerToast("Video uploaded successfully!");
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center space-y-1.5 text-center pointer-events-none">
                        <Upload className="w-5 h-5 text-neutral-500 group-hover:text-[#C5A059] transition-colors" />
                        <span className="text-[10px] text-neutral-400">Click to select local video file</span>
                        <span className="text-[8px] text-neutral-600">Max size: 40MB (.mp4,.webm,.mov)</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Description Caption</label>
                    <textarea
                      value={newVideoDesc}
                      onChange={(e) => setNewVideoDesc(e.target.value)}
                      placeholder="Write brief cinematic details..."
                      rows={3}
                      className="w-full bg-[#0c0c0c] border border-[#ff]/10 border-white/10 py-2.5 px-3 text-xs font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl resize-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddVideo}
                  className="w-full py-3.5 bg-[#C5A059] hover:bg-white text-black text-xs font-black uppercase tracking-widest transition-colors rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Upload Showreel Video</span>
                </button>
              </div>

              {/* Right Column: List of current videos */}
              <div className="lg:col-span-7 bg-[#0a0a0a] border border-white/10 p-6 md:p-8 space-y-6 rounded-2xl">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-[#C5A059] font-black">
                    Saved Showreel Loop Catalog ({videosList.length})
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-sans mt-1">
                    Registered loopable videos playing natively inside the immersive Studio Tour section.
                  </p>
                </div>

                {videosList.length === 0 ? (
                  <div className="py-20 text-center text-neutral-500 font-sans text-xs border border-white/[0.03] rounded-xl">
                    No cinematic showreel loops uploaded. Put visual details inside.
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {videosList.map((vid) => (
                      <div
                        key={vid.id}
                        className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex items-start gap-4 hover:border-white/15 transition-all"
                      >
                        <div className="aspect-video w-24 shrink-0 bg-neutral-950 rounded-lg overflow-hidden border border-white/10 relative">
                          <video src={vid.videoUrl} preload="metadata" className="w-full h-full object-cover pointer-events-none" />
                        </div>
                        <div className="flex-1 space-y-1 text-left">
                          <h4 className="text-xs font-serif font-black uppercase tracking-wide text-white">
                            {vid.title}
                          </h4>
                          <p className="text-[10px] text-neutral-450 leading-relaxed font-sans line-clamp-2">
                            {vid.description}
                          </p>
                          <span className="text-[8px] font-mono text-[#C5A059] truncate block max-w-sm select-all">
                            {vid.videoUrl}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteVideo(vid.id)}
                          className="p-1.5 bg-neutral-900 border border-white/5 text-red-400 hover:text-white hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Delete Showcase Video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Styles & Categories dynamic management panel */}
        {activeAdminTab === "styles" && (
          <div id="admin-styles-editor-pane" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left text-white">
            {/* Left Column: Styles Selector list */}
            <div className="lg:col-span-4 bg-[#0a0a0a] border border-white/10 p-5 space-y-4 rounded-2xl">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#C5A059] border-b border-white/5 pb-2 font-bold flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#C5A059]" />
                Select Style Category
              </h3>
              
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                {[
                  { id: "black-grey-realism", name: "Black & Gray Realism" },
                  { id: "black-grey-microrealism", name: "Black & Gray Microrealism" },
                  { id: "black-grey-sculptures", name: "Black & Gray Realism Sculptures" },
                  { id: "black-grey-big-pieces", name: "Black & Gray Realism Big Pieces" },
                  { id: "blackwork", name: "Blackwork" },
                  { id: "color-original-designs", name: "Color Original Designs" },
                  { id: "color-microrealism", name: "Color Microrealism" },
                  { id: "color-realism", name: "Color Realism" },
                  { id: "fineline-conceptual", name: "Fineline-Conceptual" },
                  { id: "neotraditional", name: "Neotraditional" },
                  { id: "pet-portraits", name: "Pet Portraits" },
                  { id: "portraits", name: "Portraits" }
                ].map((st) => {
                  const isCur = st.id === selectedStyleId;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setSelectedStyleId(st.id)}
                      className={`w-full text-left px-4 py-3 text-xs font-sans tracking-wide transition-all uppercase flex items-center justify-between border rounded-xl cursor-pointer ${
                        isCur
                          ? "bg-[#C5A059] text-black border-[#C5A059] font-black shadow-md shadow-[#C5A059]/10"
                          : "bg-transparent text-neutral-300 border-white/5 hover:bg-white/[0.03] hover:border-white/10"
                      }`}
                    >
                      <span className="truncate">{st.name}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Style customization fields */}
            <div className="lg:col-span-8 bg-white/[0.01] backdrop-blur-md border border-white/[0.08] p-6 md:p-8 space-y-6 rounded-2xl">
              <div className="border-b border-white/5 pb-4">
                <h3 className="font-serif font-black text-xl md:text-2xl uppercase tracking-wider text-[#C5A059]">
                  Style Configuration & Uploader List
                </h3>
                <p className="text-[11px] font-sans text-neutral-400 mt-1">
                  Upload, paste or use custom-framed crops to define main background images, narrative titles, and at least 5 showcases for your gallery pages.
                </p>
              </div>

              {/* General Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block font-bold">Style Display Name</label>
                  <input
                    type="text"
                    value={styleTitle}
                    onChange={(e) => setStyleTitle(e.target.value)}
                    className="w-full bg-[#0c0c0c] border border-white/10 py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block font-bold">Hero Subtitle</label>
                  <input
                    type="text"
                    value={styleSubtitle}
                    onChange={(e) => setStyleSubtitle(e.target.value)}
                    className="w-full bg-[#0c0c0c] border border-white/10 py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block font-bold">Comprehensive Narrative Description</label>
                <textarea
                  value={styleDesc}
                  onChange={(e) => setStyleDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-[#0c0c0c] border border-white/10 py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block font-bold">Featured Projects Heading</label>
                <input
                  type="text"
                  value={styleFeaturedHeading}
                  onChange={(e) => setStyleFeaturedHeading(e.target.value)}
                  className="w-full bg-[#0c0c0c] border border-white/10 py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                />
              </div>

              {/* SECTION: Hero Cover Background Images (3 Images) */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-black flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                  Main Dynamic Slideshow Backgrounds (3 Slots)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Slot Hero 1 */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono uppercase text-neutral-400">Main Cover Slide 1 Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={styleHero1Input}
                        onChange={(e) => setStyleHero1Input(e.target.value)}
                        className="flex-1 bg-[#0c0c0c] border border-white/10 py-2 px-3 text-[11px] font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => handleOpenCropper("style_hero_1", (val) => setStyleHero1Input(val), "portrait")}
                        className="px-2.5 bg-neutral-900 border border-white/10 text-neutral-400 hover:text-black hover:bg-[#C5A059] hover:border-[#C5A059] text-[10px] rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                        title="Crop Cover Slide 1"
                      >
                        <Crop className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Slot Hero 2 */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono uppercase text-neutral-400">Main Cover Slide 2 Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={styleHero2Input}
                        onChange={(e) => setStyleHero2Input(e.target.value)}
                        className="flex-1 bg-[#0c0c0c] border border-white/10 py-2 px-3 text-[11px] font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => handleOpenCropper("style_hero_2", (val) => setStyleHero2Input(val), "portrait")}
                        className="px-2.5 bg-neutral-900 border border-white/10 text-neutral-400 hover:text-black hover:bg-[#C5A059] hover:border-[#C5A059] text-[10px] rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                        title="Crop Cover Slide 2"
                      >
                        <Crop className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Slot Hero 3 */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono uppercase text-neutral-400">Main Cover Slide 3 Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={styleHero3Input}
                        onChange={(e) => setStyleHero3Input(e.target.value)}
                        className="flex-1 bg-[#0c0c0c] border border-white/10 py-2 px-3 text-[11px] font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl relative"
                      />
                      <button
                        type="button"
                        onClick={() => handleOpenCropper("style_hero_3", (val) => setStyleHero3Input(val), "portrait")}
                        className="px-2.5 bg-neutral-900 border border-white/10 text-neutral-400 hover:text-black hover:bg-[#C5A059] hover:border-[#C5A059] text-[10px] rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                        title="Crop Cover Slide 3"
                      >
                        <Crop className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: Dynamic Featured Projects (Showcase Images) */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-black flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                    Curated Featured Project Images ({stylePortfolioImages.length} Images)
                  </h4>
                  <button
                    type="button"
                    onClick={addStylePortfolioImage}
                    className="px-3 py-1.5 bg-neutral-900 border border-[#C5A059]/30 hover:border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black text-[9px] font-mono uppercase tracking-widest transition-all rounded-lg flex items-center gap-1.5 cursor-pointer font-black"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Project Image Slot</span>
                  </button>
                </div>

                {stylePortfolioImages.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                    <p className="text-xs text-neutral-500 font-mono">No featured project images added yet. Click "Add Project Image Slot" to configure showcase images.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stylePortfolioImages.map((imageUrl, idx) => (
                      <div key={idx} className="bg-[#0c0c0c]/80 border border-white/5 p-3.5 rounded-2xl space-y-3 relative group">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono text-[#C5A059] uppercase tracking-wider">
                            Project Showcase #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteStylePortfolioImage(idx)}
                            className="p-1 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors"
                            title="Delete this Showcase image slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-mono uppercase text-neutral-550 block">Showcase Image URL</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={imageUrl}
                              onChange={(e) => updateStylePortfolioImage(idx, e.target.value)}
                              placeholder="/images/styles/... or Unsplash"
                              className="flex-1 bg-black border border-white/10 py-1.5 px-2.5 text-[10px] font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                            />
                            <button
                              type="button"
                              onClick={() => handleOpenCropper(`style-proj-${idx}`, (croppedBase64) => updateStylePortfolioImage(idx, croppedBase64), "portrait")}
                              className="px-2 bg-neutral-900 border border-white/10 text-neutral-400 hover:text-black hover:bg-[#C5A059] hover:border-[#C5A059] text-[10px] rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 gap-1"
                              title={`Crop and upload Project Showcase ${idx + 1}`}
                            >
                              <Crop className="w-3 h-3 text-current" />
                              <span className="text-[9px] font-mono font-black uppercase">Crop</span>
                            </button>
                          </div>
                        </div>

                        {/* Thumbnail card for clarity */}
                        {imageUrl && (
                          <div className="w-14 h-16 bg-black border border-white/10 rounded-lg overflow-hidden mt-1 relative">
                            <img src={imageUrl} alt="preview style" className="w-full h-full object-cover" onError={(e) => handleImageFallback(e, 'style', selectedStyleId, idx + 1)} />
                            <div className="absolute top-0.5 right-0.5 bg-black/80 rounded px-1 text-[6.5px] text-[#C5A059] font-mono uppercase">
                              Active
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pt-6 border-t border-white/5 gap-4">
                <p className="text-[10px] text-neutral-400 max-w-sm">
                  Clicking "Save Layout Specifications" saves all background images, cover slideshows, and portfolio projects to the dynamic styles catalog.
                </p>
                <button
                  type="button"
                  onClick={handleSaveStyleDetails}
                  className="px-6 py-3 bg-[#C5A059] hover:bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 justify-center cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Save Layout Specifications</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Contact details customizer */}
        {activeAdminTab === "contact" && (
          <div id="admin-contact-pane" className="space-y-6">
            <div className="bg-[#060606]/95 border border-white/5 py-8 px-6 md:px-10 rounded-none text-left space-y-8 shadow-2xl relative">
              
              <div>
                <h3 className="font-serif text-xl text-white tracking-wider flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#C5A059]" />
                  Studio Contact & Channels Settings
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Manage physical studio listings, click-to-chat links, and primary representative handles.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Physical and Communications details */}
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-2">
                    <h4 className="text-xs font-mono uppercase text-[#C5A059] tracking-widest font-black">
                      Office Communications
                    </h4>
                  </div>

                  {/* Physical Address */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      Physical Street Address
                    </label>
                    <input
                      type="text"
                      value={contactAddress}
                      onChange={(e) => setContactAddress(e.target.value)}
                      placeholder="e.g. Carrer de l'Argenteria, 23, 08003 Barcelona, Spain"
                      className="w-full bg-[#0c0c0c] border border-white/10 py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                    />
                  </div>

                  {/* Physical Subtitle */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                      Address Subtitle/MTR Details
                    </label>
                    <input
                      type="text"
                      value={contactAddressSubtitle}
                      onChange={(e) => setContactAddressSubtitle(e.target.value)}
                      placeholder="e.g. Near El Born Cathedral, ground level storefront."
                      className="w-full bg-[#0c0c0c] border border-white/10 py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                    />
                  </div>

                  {/* Public Email */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neutral-500" />
                      Client Inquiry Email Address
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. gangatattoobarcelona@gmail.com"
                      className="w-full bg-[#0c0c0c] border border-white/10 py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                    />
                  </div>

                  {/* Email Subtitle */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                      Email Subtitle / Response Time Window
                    </label>
                    <input
                      type="text"
                      value={contactEmailSubtitle}
                      onChange={(e) => setContactEmailSubtitle(e.target.value)}
                      placeholder="e.g. Expect callback within 24-48 business hours"
                      className="w-full bg-[#0c0c0c] border border-white/10 py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                    />
                  </div>

                  {/* Direct phone line */}
                  <div className="space-y-1.5 pb-2">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-500" />
                      Studio Landline / Phone
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g. +1 (404) 555-0105"
                      className="w-full bg-[#0c0c0c] border border-white/10 py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                    />
                    <div className="flex items-center gap-2 mt-2 pt-1 border-t border-white/[0.03]">
                      <input
                        id="contact-show-phone-chk"
                        type="checkbox"
                        checked={contactShowPhone}
                        onChange={(e) => setContactShowPhone(e.target.checked)}
                        className="w-3.5 h-3.5 bg-black border border-white/20 text-[#C5A059] focus:ring-0 rounded-sm cursor-pointer accent-[#C5A059]"
                      />
                      <label 
                        htmlFor="contact-show-phone-chk" 
                        className="text-[10px] font-mono uppercase text-neutral-400 select-none cursor-pointer hover:text-white transition-colors"
                      >
                        Enable Direct Telephone line publicly on contact side
                      </label>
                    </div>
                  </div>
                </div>

                {/* Social Channels & Messaging shortcuts */}
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-2">
                    <h4 className="text-xs font-mono uppercase text-[#C5A059] tracking-widest font-black">
                      Interactive Channels
                    </h4>
                  </div>

                  {/* Instagram Username */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block flex items-center gap-1.5">
                      <Link className="w-3.5 h-3.5 text-neutral-500" />
                      Instagram Username Label
                    </label>
                    <input
                      type="text"
                      value={contactInstagramName}
                      onChange={(e) => setContactInstagramName(e.target.value)}
                      placeholder="e.g. @gangatattoo"
                      className="w-full bg-[#0c0c0c] border border-[#C5A059]/20 py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                    />
                  </div>

                  {/* Instagram Target Redirect URL */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                      Instagram Redirect Link URL
                    </label>
                    <input
                      type="text"
                      value={contactInstagramUrl}
                      onChange={(e) => setContactInstagramUrl(e.target.value)}
                      placeholder="e.g. https://www.instagram.com/gangatattoo"
                      className="w-full bg-[#0c0c0c] border border-white/10 py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                    />
                  </div>

                  {/* WhatsApp Direct Number */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-500" />
                      WhatsApp Client Mobile (with Country Code)
                    </label>
                    <input
                      type="text"
                      value={contactWhatsappNumber}
                      onChange={(e) => setContactWhatsappNumber(e.target.value)}
                      placeholder="e.g. 17861234567"
                      className="w-full bg-[#0c0c0c] border border-[#C5A059]/20 py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                    />
                    <p className="text-[9px] text-neutral-450 font-sans">
                      International numeric only e.g. <span className="text-[#C5A059]">34600111222</span> (Do not use +, spaces, or dashes). Translates into a secure dynamic redirect click action.
                    </p>
                  </div>

                  {/* WhatsApp display description/label */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                      WhatsApp Display Label text
                    </label>
                    <input
                      type="text"
                      value={contactWhatsappLabel}
                      onChange={(e) => setContactWhatsappLabel(e.target.value)}
                      placeholder="e.g. Instant Representative Chat"
                      className="w-full bg-[#0c0c0c] border border-white/10 py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#C5A059] rounded-xl"
                    />
                  </div>

                  {/* Contact Background wallpaper customiser / upload slot */}
                  <div className="space-y-3 pt-3 border-t border-white/[0.05]">
                    <h5 className="text-[10px] font-mono uppercase text-[#C5A059] tracking-wider font-black">
                      Direct Concierge Background Wallpaper
                    </h5>
                    <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-950 border border-white/10 rounded-xl relative">
                      {contactBgUrl ? (
                        <img src={contactBgUrl} alt="Contact background preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-neutral-550 font-mono">
                          No Custom Background Uploaded
                        </div>
                      )}
                      {downloadingBg && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center space-y-2 z-10">
                          <div className="w-6 h-6 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-[9px] font-mono text-[#C5A059] uppercase tracking-wider animate-pulse">Downloading Live Link...</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              const base64 = reader.result as string;
                              try {
                                const res = await fetch("/api/upload", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    base64,
                                    type: "contact",
                                    id: "bg",
                                    index: 1,
                                  }),
                                });
                                if (!res.ok) throw new Error("Upload failed");
                                const data = await res.json();
                                if (data && data.url) {
                                  setContactBgUrl(data.url);
                                }
                              } catch (err) {
                                console.error("Contact background image upload error", err);
                                setContactBgUrl(base64);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="text-[9px] w-full bg-neutral-900 border border-white/10 text-white p-2 file:bg-[#C5A059] file:text-black file:border-none file:px-2 file:py-0.5 file:font-mono file:uppercase file:cursor-pointer rounded-md"
                      />
                      <input
                        type="text"
                        value={contactBgUrl}
                        onChange={async (e) => {
                          const val = e.target.value;
                          setContactBgUrl(val);
                          if (val && (val.startsWith("http://") || val.startsWith("https://"))) {
                            setDownloadingBg(true);
                            try {
                              const res = await fetch("/api/upload", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  url: val,
                                  type: "contact",
                                  id: "bg",
                                  index: 1,
                                }),
                              });
                              if (!res.ok) throw new Error("Remote download failed");
                              const data = await res.json();
                              if (data && data.url) {
                                setContactBgUrl(data.url);
                              }
                            } catch (err) {
                              console.error("Auto-download for URL failed:", err);
                            } finally {
                              setDownloadingBg(false);
                            }
                          }
                        }}
                        placeholder="Paste custom wallpaper picture URL (automatically downloaded & saved locally)"
                        className="w-full bg-[#0c0c0c] border border-white/10 py-2.5 px-3 text-[10px] text-white focus:outline-none focus:border-[#C5A059] rounded-lg"
                      />
                      {downloadingBg && (
                        <p className="text-[9px] text-[#C5A059] font-mono animate-pulse">
                          ⏳ Fetching image stream & direct-transferring into /public/images/contact/ folder...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action and Save Confirmation */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pt-6 border-t border-white/5 gap-4">
                <p className="text-[10px] text-neutral-400 max-w-md">
                  Click 'Save Studio & Social Coordinates' to apply these contact, WhatsApp, and Instagram links across all public user-facing Contact panels globally.
                </p>
                <button
                  type="button"
                  onClick={handleSaveContactDetails}
                  className="px-6 py-3 bg-[#C5A059] hover:bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 justify-center cursor-pointer shadow-lg active:scale-95"
                >
                  <Save className="w-4 h-4 text-black" />
                  <span>Save Studio & Social Coordinates</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Tab 6: Media Manager */}
        {activeAdminTab === "media" && (
          <div id="admin-media-pane" className="space-y-6">
            <div className="bg-[#060606]/95 border border-white/5 py-8 px-6 md:px-10 rounded-none text-left space-y-8 shadow-2xl relative">
              <div>
                <h3 className="font-serif text-xl text-white tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#C5A059]" />
                  Site Wide Media
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Manage static site imagery like Work With Us and No Pain backgrounds.
                </p>
              </div>

              {siteMedia && (
                <div className="space-y-6">
                  {Object.entries(siteMedia).map(([key, value]) => (
                    <div key={key} className="space-y-1.5 flex flex-col md:flex-row gap-4 items-center border border-white/5 p-4 bg-[#0a0a0a]">
                      <div className="w-full md:w-1/3">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block break-words">
                          {key}
                        </label>
                        <p className="text-[9px] text-neutral-500 mt-1 uppercase font-mono">Current path/base64</p>
                      </div>
                      <div className="w-full md:w-1/3 overflow-hidden">
                         <img src={value} alt={key} className="w-24 h-24 object-cover border border-white/10" />
                      </div>
                      <div className="w-full md:w-1/3 flex flex-col gap-2">
                        <input
                           type="file"
                           accept="image/*"
                           onChange={async (e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                               const reader = new FileReader();
                               reader.onloadend = async () => {
                                 const base64 = reader.result as string;
                                 try {
                                   const res = await fetch("/api/upload", {
                                     method: "POST",
                                     headers: { "Content-Type": "application/json" },
                                     body: JSON.stringify({
                                       base64,
                                       type: "sitemedia",
                                       id: key.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase(),
                                       index: 1,
                                     }),
                                   });
                                   if (!res.ok) throw new Error("Upload failed");
                                   const data = await res.json();
                                   if (data && data.url) {
                                     setSiteMedia((prev) => prev ? { ...prev, [key]: data.url } : null);
                                   } else {
                                     throw new Error("No URL returned");
                                   }
                                 } catch (err) {
                                   console.error("Site media upload failed, falling back to local base64", err);
                                   setSiteMedia((prev) => prev ? { ...prev, [key]: base64 } : null);
                                 }
                               };
                               reader.readAsDataURL(file);
                             }
                           }}
                           className="text-[10px] bg-neutral-900 border border-white/10 text-white p-2 file:bg-[#C5A059] file:text-black file:border-none file:px-3 file:py-1 file:font-mono file:uppercase file:cursor-pointer"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={async (e) => {
                            const val = e.target.value;
                            setSiteMedia((prev) => prev ? { ...prev, [key]: val } : null);
                            if (val.startsWith("http://") || val.startsWith("https://")) {
                              const convertedUrl = await handleAutoDownloadAndConvert(val, key, "sitemedia", 1);
                              setSiteMedia((prev) => prev ? { ...prev, [key]: convertedUrl } : null);
                            }
                          }}
                          className="bg-[#0c0c0c] border border-white/10 py-2 px-3 text-[10px] text-white focus:outline-none focus:border-[#C5A059]"
                          placeholder="Or paste image URL"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (siteMedia) {
                          saveSiteMedia(siteMedia);
                        }
                        if (studioImages) {
                          saveStudioImages(studioImages);
                        }
                        triggerToast("Site media saved successfully!");
                      }}
                      className="px-6 py-3 bg-[#C5A059] hover:bg-white text-black text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4 text-black" />
                      <span>Save Media</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Studio Images array */}
              <div className="pt-8 border-t border-white/10 mt-8">
                <h3 className="font-serif text-xl text-white tracking-wider flex items-center gap-2 mb-6">
                  <ImageIcon className="w-5 h-5 text-[#C5A059]" />
                  Studio Tour Gallery
                </h3>
                <div className="space-y-6">
                  {studioImages.map((img, idx) => (
                    <div key={img.id} className="space-y-4 border border-white/5 p-4 bg-[#0a0a0a]">
                      <div className="flex gap-4">
                        <div className="w-1/3">
                          <img src={img.imageUrl} alt={img.title} className="w-full aspect-video object-cover border border-white/10" />
                        </div>
                        <div className="w-2/3 space-y-3">
                          <input
                            type="text"
                            value={img.title}
                            onChange={(e) => {
                               const newImgs = [...studioImages];
                               newImgs[idx].title = e.target.value;
                               setStudioImages(newImgs);
                            }}
                            className="w-full bg-[#0c0c0c] border border-white/10 py-2 px-3 text-[10px] text-white focus:outline-none focus:border-[#C5A059]"
                            placeholder="Image Title"
                          />
                          <textarea
                            value={img.description}
                            onChange={(e) => {
                               const newImgs = [...studioImages];
                               newImgs[idx].description = e.target.value;
                               setStudioImages(newImgs);
                            }}
                            className="w-full bg-[#0c0c0c] border border-white/10 py-2 px-3 text-[10px] text-white focus:outline-none focus:border-[#C5A059] min-h-[60px]"
                            placeholder="Image Description"
                          />
                          <div className="flex gap-2">
                             <input
                               type="file"
                               accept="image/*"
                               onChange={(e) => {
                                 const file = e.target.files?.[0];
                                 if (file) {
                                   const reader = new FileReader();
                                   reader.onloadend = async () => {
                                     const base64 = reader.result as string;
                                     try {
                                       const res = await fetch("/api/upload", {
                                         method: "POST",
                                         headers: { "Content-Type": "application/json" },
                                         body: JSON.stringify({
                                           base64,
                                           type: "sitemedia",
                                           id: `studio_tour_${img.id}`,
                                           index: 1,
                                         }),
                                       });
                                       if (!res.ok) throw new Error("Upload failed");
                                       const data = await res.json();
                                       if (data && data.url) {
                                         const newImgs = [...studioImages];
                                         newImgs[idx].imageUrl = data.url;
                                         setStudioImages(newImgs);
                                       }
                                     } catch (err) {
                                       console.error("Studio image upload failed, falling back to base64", err);
                                       const newImgs = [...studioImages];
                                       newImgs[idx].imageUrl = base64;
                                       setStudioImages(newImgs);
                                     }
                                   };
                                   reader.readAsDataURL(file);
                                 }
                               }}
                               className="text-[10px] bg-neutral-900 border border-white/10 text-white p-2 file:bg-[#C5A059] file:text-black file:border-none file:px-3 file:py-1 file:font-mono file:uppercase file:cursor-pointer flex-1"
                             />
                             <input
                               type="text"
                               value={img.imageUrl}
                               onChange={async (e) => {
                                  const val = e.target.value;
                                  const newImgs = [...studioImages];
                                  newImgs[idx].imageUrl = val;
                                  setStudioImages(newImgs);
                                  if (val.startsWith("http://") || val.startsWith("https://")) {
                                    const convertedUrl = await handleAutoDownloadAndConvert(val, `studio_tour_${img.id}`, "sitemedia", idx + 1);
                                    const updatedImgs = [...studioImages];
                                    updatedImgs[idx].imageUrl = convertedUrl;
                                    setStudioImages(updatedImgs);
                                  }
                               }}
                               className="bg-[#0c0c0c] border border-white/10 py-2 px-3 text-[10px] text-white focus:outline-none focus:border-[#C5A059] flex-1"
                               placeholder="Or paste URL"
                             />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (studioImages) {
                          saveStudioImages(studioImages);
                          triggerToast("Studio images saved successfully!");
                        }
                      }}
                      className="px-6 py-3 bg-[#C5A059] hover:bg-white text-black text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4 text-black" />
                      <span>Save Studio Views</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 7: Celebrities Manager */}
        {activeAdminTab === "celebrities" && (
          <div id="admin-celebrities-pane" className="space-y-6">
            <div className="bg-[#060606]/95 border border-white/5 py-8 px-6 md:px-10 rounded-none text-left space-y-6 shadow-2xl relative">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-serif text-xl text-white tracking-wider flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#C5A059]" />
                    Celebrity Clients Settings
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage profiles, names, quotes, and custom portfolio items for top tier public figures.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newCeleb: CelebrityClient = {
                      id: `celeb-${Date.now()}`,
                      name: "New Client",
                      role: "Artist / Actor",
                      quote: "The attention to detail here is on an entirely different level.",
                      tattooDescription: "Custom bespoke realism sleeve",
                      imageUrl: "https://images.unsplash.com/photo-1542241647-9cbb2225278b?auto=format&fit=crop&q=80&w=500",
                      artistId: "fede-almanzor"
                    };
                    setCelebritiesList((prev) => [...prev, newCeleb]);
                  }}
                  className="px-4 py-2 bg-neutral-900 border border-[#C5A059]/40 hover:border-[#C5A059] text-[#C5A059] hover:text-white text-[10px] font-mono uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add Client Card
                </button>
              </div>

              <div className="space-y-8 pt-4">
                {celebritiesList.map((celeb, idx) => (
                  <div key={celeb.id} className="border border-white/5 p-6 bg-[#0a0a0a] rounded-xl relative space-y-3">
                    <div className="absolute top-4 right-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove ${celeb.name} client card permanently?`)) {
                            setCelebritiesList((prev) => prev.filter((c) => c.id !== celeb.id));
                          }
                        }}
                        className="p-2 bg-red-950/20 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 hover:bg-red-900 transition-colors cursor-pointer text-xs uppercase"
                        title="Delete card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-3 space-y-2">
                        <label className="text-[10px] font-mono uppercase text-neutral-500 font-bold block">Preview Image</label>
                        <div className="aspect-[3/4] max-w-[150px] overflow-hidden border border-white/10 bg-neutral-900">
                          <img src={celeb.imageUrl} alt={celeb.name} className="w-full h-full object-cover" />
                        </div>
                      </div>

                      <div className="md:col-span-9 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-[#C5A059] font-bold block">Celebrity Name</label>
                            <input
                              type="text"
                              value={celeb.name}
                              onChange={(e) => {
                                const updated = [...celebritiesList];
                                updated[idx].name = e.target.value;
                                setCelebritiesList(updated);
                              }}
                              className="w-full bg-[#0c0c0c] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#C5A059] rounded-lg"
                              placeholder="e.g. Joaquín Ganga"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-[#C5A059] font-bold block">Role / Status</label>
                            <input
                              type="text"
                              value={celeb.role}
                              onChange={(e) => {
                                const updated = [...celebritiesList];
                                updated[idx].role = e.target.value;
                                setCelebritiesList(updated);
                              }}
                              className="w-full bg-[#0c0c0c] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#C5A059] rounded-lg"
                              placeholder="e.g. CEO / Realism Pioneer"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-[#C5A059] font-bold block">Preferred Artist</label>
                            <select
                              value={celeb.artistId || "fede-almanzor"}
                              onChange={(e) => {
                                const updated = [...celebritiesList];
                                updated[idx].artistId = e.target.value;
                                setCelebritiesList(updated);
                              }}
                              className="w-full bg-[#0c0c0c] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#C5A059] rounded-lg"
                            >
                              {activeArtists.map((art) => (
                                <option key={art.id} value={art.id} className="bg-black text-white">
                                  {art.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">Tattoo Core Description</label>
                          <input
                            type="text"
                            value={celeb.tattooDescription}
                            onChange={(e) => {
                              const updated = [...celebritiesList];
                              updated[idx].tattooDescription = e.target.value;
                              setCelebritiesList(updated);
                            }}
                            className="w-full bg-[#0c0c0c] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#C5A059] rounded-lg"
                            placeholder="e.g. Custom full back piece & biomech micro chest"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">Client Statement / Quote</label>
                          <textarea
                            value={celeb.quote}
                            onChange={(e) => {
                              const updated = [...celebritiesList];
                              updated[idx].quote = e.target.value;
                              setCelebritiesList(updated);
                            }}
                            className="w-full bg-[#0c0c0c] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#C5A059] rounded-lg min-h-[60px]"
                            placeholder="Ganga is the absolute king..."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-neutral-500 font-bold block">Media Image File / URL</label>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = async () => {
                                    const base64 = reader.result as string;
                                    try {
                                      const res = await fetch("/api/upload", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                          base64,
                                          type: "sitemedia",
                                          id: `celeb_${celeb.id}`,
                                          index: 1,
                                        }),
                                      });
                                      if (!res.ok) throw new Error("Upload failed");
                                      const data = await res.json();
                                      if (data && data.url) {
                                        const updated = [...celebritiesList];
                                        updated[idx].imageUrl = data.url;
                                        setCelebritiesList(updated);
                                      }
                                    } catch (err) {
                                      console.error("Celebrity image failed, saving base64", err);
                                      const updated = [...celebritiesList];
                                      updated[idx].imageUrl = base64;
                                      setCelebritiesList(updated);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="text-[10px] bg-neutral-900 border border-white/10 text-white p-2 file:bg-[#C5A059] file:text-black file:border-none file:px-3 file:py-1 file:font-mono file:uppercase file:cursor-pointer flex-1"
                            />
                            <input
                              type="text"
                              value={celeb.imageUrl}
                              onChange={async (e) => {
                                const val = e.target.value;
                                const updated = [...celebritiesList];
                                updated[idx].imageUrl = val;
                                setCelebritiesList(updated);
                                if (val.startsWith("http://") || val.startsWith("https://")) {
                                  const convertedUrl = await handleAutoDownloadAndConvert(val, `celeb_${celeb.id}`, "sitemedia", idx + 1);
                                  const refreshed = [...celebritiesList];
                                  refreshed[idx].imageUrl = convertedUrl;
                                  setCelebritiesList(refreshed);
                                }
                              }}
                              className="bg-[#0c0c0c] border border-white/10 py-2 px-3 text-[10px] text-white focus:outline-none focus:border-[#C5A059] flex-1 rounded-lg"
                              placeholder="Or paste external celebrity image URL"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={() => {
                    saveCelebrities(celebritiesList);
                    triggerToast("Elite celebrities list saved successfully!");
                  }}
                  className="px-6 py-3 bg-[#C5A059] hover:bg-white text-black text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer rounded-lg hover:shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                >
                  <Save className="w-4 h-4 text-black" />
                  <span>Save Celebrity Clients</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: Studio Design Settings */}
        {activeAdminTab === "studio" && studioConfig && (
          <div id="admin-studio-pane" className="space-y-6">
            <div className="bg-[#060606]/95 border border-white/5 py-8 px-6 md:px-10 rounded-none text-left space-y-6 shadow-2xl relative">
              <div>
                <h3 className="font-serif text-xl text-white tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#C5A059]" />
                  Studio Design Layout Configuration
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Fine-tune the 11 high-resolution images utilized in the Studio Tour page.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {Object.entries(studioConfig).map(([key, value]) => {
                  const labelMap: Record<string, string> = {
                    welcomeBg: "1. Top Header Welcome Background (Cover)",
                    landscapeCentered: "2. Centered Sanctuary Landscape Photo",
                    landscapeLeft: "3. Side-by-Side Landscape Photo (Left)",
                    landscapeRight: "4. Side-by-Side Landscape Photo (Right)",
                    imgFour1: "5. Quad-Bento Photo (Pair A - Left)",
                    imgFour2: "6. Quad-Bento Photo (Pair A - Right)",
                    imgFour3: "7. Quad-Bento Photo (Pair B - Left)",
                    imgFour4: "8. Quad-Bento Photo (Pair B - Right)",
                    wideScreen1: "9. Panoramic Screening Photo 1 (Fits Full Width)",
                    wideScreen2: "10. Panoramic Screening Photo 2 (Fits Full Width)",
                    bookingBg: "11. Bottom Book Now Wallpaper Background"
                  };
                  return (
                    <div key={key} className="border border-white/5 p-4 bg-[#0a0a0a] rounded-lg space-y-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] block font-bold">
                          {labelMap[key] || key}
                        </span>
                      </div>
                      <div className="aspect-video w-full overflow-hidden bg-neutral-900 border border-white/10 rounded-md">
                        <img src={value} alt={key} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = async () => {
                                const base64 = reader.result as string;
                                try {
                                  const res = await fetch("/api/upload", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      base64,
                                      type: "sitemedia",
                                      id: `studio_cfg_${key}`,
                                      index: 1,
                                    }),
                                  });
                                  if (!res.ok) throw new Error("Upload failed");
                                  const data = await res.json();
                                  if (data && data.url) {
                                    setStudioConfig((prev) => prev ? { ...prev, [key]: data.url } : null);
                                  }
                                } catch (err) {
                                  console.error("Studio configuration image update failed, falling back to base64", err);
                                  setStudioConfig((prev) => prev ? { ...prev, [key]: base64 } : null);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="text-[9px] w-full bg-neutral-900 border border-white/10 text-white p-2 file:bg-[#C5A059] file:text-black file:border-none file:px-2 file:py-0.5 file:font-mono file:uppercase file:cursor-pointer rounded-md"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={async (e) => {
                            const val = e.target.value;
                            setStudioConfig((prev) => prev ? { ...prev, [key]: val } : null);
                            if (val.startsWith("http://") || val.startsWith("https://")) {
                              const convertedUrl = await handleAutoDownloadAndConvert(val, `studio_cfg_${key}`, "sitemedia", 1);
                              setStudioConfig((prev) => prev ? { ...prev, [key]: convertedUrl } : null);
                            }
                          }}
                          className="w-full bg-[#0c0c0c] border border-white/10 py-2 px-3 text-[10px] text-white focus:outline-none focus:border-[#C5A059] rounded-md"
                          placeholder="Or paste custom image URL"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={() => {
                    if (studioConfig) {
                      saveStudioLayoutConfig(studioConfig);
                      triggerToast("Studio layouts design settings preserved!");
                    }
                  }}
                  className="px-6 py-3 bg-[#C5A059] hover:bg-white text-black text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer rounded-lg hover:shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                >
                  <Save className="w-4 h-4 text-black" />
                  <span>Save Layout Configuration</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <ImageCropperModal
          isOpen={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          onCropComplete={handleCropComplete}
          aspectRatioPreset={cropPreset}
          title={`Bespoke Crop Workbench (${cropTarget.toUpperCase()})`}
        />
      </div>
    </div>
  );
}
