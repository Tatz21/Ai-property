export interface SeedProperty {
  id: string;
  title: string;
  type: "apartment" | "villa" | "commercial" | "penthouse";
  bhk: number;
  price: number;
  areaSqFt: number;
  locality: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  status: "available" | "under_offer" | "sold";
  verificationStatus: "verified" | "pending" | "rejected";
  reraId?: string;
  possessionDate: string;
  amenities: string[];
  description: string;
  images: string[];
  tags: string[];
}

export const INITIAL_SEED_PROPERTIES: SeedProperty[] = [
  {
    id: "prop-kol-001",
    title: "Luxury 3 BHK Lake-Facing Sky Villa",
    type: "apartment",
    bhk: 3,
    price: 9500000,
    areaSqFt: 1850,
    locality: "New Town Action Area II",
    city: "Kolkata",
    address: "Block CC, Near Eco Park Gate 2, New Town, Kolkata 700156",
    lat: 22.5855,
    lng: 88.4682,
    status: "available",
    verificationStatus: "verified",
    reraId: "WBRERA/P/NOR/2024/000412",
    possessionDate: "2025-12-01",
    amenities: ["Swimming Pool", "Clubhouse", "24/7 Power Backup", "EV Charging", "EV High Speed Elevators", "Covered Parking"],
    description: "Expansive 3 BHK apartment with unobstructed views of Eco Park Lake. Premium Italian marble flooring, 3 master bedrooms with attached baths, and smart automation system.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
    ],
    tags: ["Eco Park View", "Smart Home", "Luxury", "Ready by 2025"]
  },
  {
    id: "prop-kol-002",
    title: "Modern 2 BHK Urban Residence near Metro",
    type: "apartment",
    bhk: 2,
    price: 4800000,
    areaSqFt: 1050,
    locality: "Rajarhat Chinar Park",
    city: "Kolkata",
    address: "Chinar Park Crossing, Rajarhat Main Road, Kolkata 700136",
    lat: 22.6241,
    lng: 88.4412,
    status: "available",
    verificationStatus: "verified",
    reraId: "WBRERA/P/NOR/2023/000287",
    possessionDate: "Ready to Move",
    amenities: ["Gymnasium", "Children Play Area", "24/7 Security", "Intercom", "Intercom", "Lobby"],
    description: "Vastu compliant 2 BHK flat within 500m of upcoming yellow line metro station. Excellent rental yield for IT professionals working in Sector V and New Town.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Near Metro", "Ready to Move", "High ROI", "IT Corridor"]
  },
  {
    id: "prop-kol-003",
    title: "Premium 4 BHK Duplex Penthouse on EM Bypass",
    type: "penthouse",
    bhk: 4,
    price: 24000000,
    areaSqFt: 3400,
    locality: "EM Bypass - Topsia",
    city: "Kolkata",
    address: "Opposite Science City, EM Bypass, Kolkata 700046",
    lat: 22.5401,
    lng: 88.3972,
    status: "available",
    verificationStatus: "verified",
    reraId: "WBRERA/P/KOL/2023/000109",
    possessionDate: "Ready to Move",
    amenities: ["Private Terrace", "Infinity Pool", "Concierge", "4 Car Parking", "Spa & Sauna", "Home Theatre Room"],
    description: "Ultra-luxury penthouse spanning across 2 floors with private open-to-sky terrace deck. 360-degree panoramic skyline views across central Kolkata and wetlands.",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Penthouse", "Private Pool", "Science City", "High Net Worth"]
  },
  {
    id: "prop-kol-004",
    title: "Grade-A Commercial IT Office Space",
    type: "commercial",
    bhk: 0,
    price: 18500000,
    areaSqFt: 2200,
    locality: "Salt Lake Sector V",
    city: "Kolkata",
    address: "Block EP & GP, Electronics Complex, Salt Lake Sector V, Kolkata 700091",
    lat: 22.5726,
    lng: 88.4312,
    status: "available",
    verificationStatus: "verified",
    reraId: "WBRERA/P/NOR/2023/000991",
    possessionDate: "Ready to Move",
    amenities: ["100% DG Backup", "Multi-tier Fire Safety", "Central AC", "Food Court", "High Speed Fiber"],
    description: "Fully furnished plug-and-play office floor with 45 workstations, 3 executive cabins, and 12-seater conference room right in the heart of Sector V tech hub.",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Plug & Play", "Sector V Tech Hub", "Commercial Office"]
  }
];
