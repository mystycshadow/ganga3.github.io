/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PortfolioItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  category: "realism" | "portrait" | "fineline" | "custom";
}

export interface Artist {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  specialty: string;
  bio: string;
  instagram: string;
  nextAvailable: string;
  portfolio: PortfolioItem[];
}

export interface CelebrityClient {
  id: string;
  name: string;
  role: string;
  tattooDescription: string;
  imageUrl: string;
  artistId: string;
  quote?: string;
}

export type TattooPlacement =
  | "forearm"
  | "bicep"
  | "shoulder"
  | "chest"
  | "back"
  | "ribs"
  | "thigh"
  | "calf"
  | "other";

export type TattooStyle =
  | "hyperrealism"
  | "black_and_grey"
  | "fine_line"
  | "microrealism"
  | "color_realism";

export interface AppointmentBooking {
  id: string;
  artistId: string;
  artistName: string;
  date: string;
  timeSlot: string;
  placement: TattooPlacement;
  style: TattooStyle;
  estimatedSizeInches: number;
  description: string;
  referenceImages: string[];
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientInstagram: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  urgency: "vip" | "standard";
  notes?: string;
}

export interface StudioContact {
  address: string;
  addressSubtitle: string;
  email: string;
  emailSubtitle: string;
  phone: string;
  showPhone?: boolean;
  instagramName: string;
  instagramUrl: string;
  whatsappNumber: string;
  whatsappLabel: string;
  bgUrl?: string;
}

export interface StudioReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  source: string;
}
