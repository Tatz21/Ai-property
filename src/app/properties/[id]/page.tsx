"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { 
  ShieldCheck, MapPin, Calendar, BedDouble, Maximize2, 
  Building2, CheckCircle, ArrowLeft, Phone, CalendarCheck, Share2, Sparkles, Heart
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { PropertyRecord } from "@/lib/properties/types";
import { generateRealEstateListingSchema } from "@/lib/seo/schema";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [property, setProperty] = useState<PropertyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [visitBooked, setVisitBooked] = useState(false);
  const [bookingDate, setBookingDate] = useState("2026-10-02");
  const [bookingTime, setBookingTime] = useState("11:00 AM");
  const [isShortlisted, setIsShortlisted] = useState(false);

  useEffect(() => {
    async function loadProperty() {
      try {
        setLoading(true);
        const res = await fetch(`/api/properties/${id}`);
        const data = await res.json();
        if (res.ok && data.property) {
          setProperty(data.property);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadProperty();
  }, [id]);

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    setVisitBooked(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center font-mono text-xs text-zinc-500">
        Loading property details...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-white mb-2">Property Not Found</h2>
        <p className="text-xs text-zinc-400 mb-6">The requested listing does not exist or has been removed.</p>
        <Link href="/properties" className="px-4 py-2 rounded-xl bg-zinc-800 text-xs text-white">
          Back to Search
        </Link>
      </div>
    );
  }

  const propertySchema = generateRealEstateListingSchema({
    id: property.id,
    title: property.title,
    description: property.description,
    price: property.price,
    locality: property.locality,
    address: property.address,
    bhk: property.bhk,
    areaSqFt: property.areaSqFt,
    media: property.media,
    reraId: property.reraId,
    possessionDate: property.possessionDate,
  });

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
      />
      <PerspectiveGrid />
      <SpotlightNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full z-10">
        {/* Back Link */}
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-cyan-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all Kolkata properties</span>
        </Link>

        {/* Title & Top Metadata */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {property.verificationStatus === "verified" ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  RERA VERIFIED
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  VERIFICATION PENDING
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 uppercase">
                {property.status}
              </span>
              {property.reraId && (
                <span className="text-[11px] font-mono text-zinc-400">
                  RERA: <span className="text-zinc-300">{property.reraId}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {property.title}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{property.address}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsShortlisted(!isShortlisted)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isShortlisted
                  ? "bg-red-950/60 border-red-500/60 text-red-400"
                  : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              <Heart className={`w-5 h-5 ${isShortlisted ? "fill-red-400" : ""}`} />
            </button>

            <div className="text-right">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">Listed Price</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {formatINR(property.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Media Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2 rounded-[20px] bg-zinc-900 overflow-hidden h-[360px] sm:h-[420px] relative border border-zinc-800">
            {property.media.length > 0 ? (
              <img
                src={property.media[selectedImage]?.url || property.media[0].url}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                No imagery available
              </div>
            )}
          </div>

          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto">
            {property.media.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSelectedImage(idx)}
                className={`relative rounded-xl overflow-hidden h-24 lg:h-32 w-36 lg:w-full shrink-0 border-2 transition-all cursor-pointer ${
                  selectedImage === idx ? "border-cyan-500" : "border-zinc-800 hover:border-zinc-600 opacity-70"
                }`}
              >
                <img src={item.url} alt={item.altText} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Content & Booking Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Specifications */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 rounded-2xl bg-[#111116] border border-zinc-800">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Bedrooms</span>
                <span className="text-sm font-bold text-white font-mono">
                  {property.bhk > 0 ? `${property.bhk} BHK` : "Commercial"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Super Area</span>
                <span className="text-sm font-bold text-white font-mono">{property.areaSqFt} sq.ft</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Property Type</span>
                <span className="text-sm font-bold text-white font-mono capitalize">{property.type}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Possession</span>
                <span className="text-sm font-bold text-cyan-300 font-mono">{property.possessionDate}</span>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl bg-[#111116] border border-zinc-800 p-6">
              <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-3">
                Property Overview
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="rounded-2xl bg-[#111116] border border-zinc-800 p-6">
              <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-4">
                Verified Amenities & Facilities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-xs text-zinc-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location & Coordinates */}
            <div className="rounded-2xl bg-[#111116] border border-zinc-800 p-6">
              <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-2">
                Geospatial Location
              </h2>
              <p className="text-xs text-zinc-400 mb-3">
                Coordinates: <span className="font-mono text-cyan-300">{property.lat}° N, {property.lng}° E</span>
              </p>
              <div className="h-40 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-500 font-mono">
                [ Interactive PostGIS Map: {property.locality}, Kolkata ]
              </div>
            </div>
          </div>

          {/* Action Sidebar: Visit Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-[24px] bg-[#111116] border border-zinc-800 p-6 shadow-2xl space-y-6">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
                  <CalendarCheck className="w-4 h-4" />
                  <span>Direct Site Inspection</span>
                </div>
                <h3 className="text-lg font-bold text-white">Schedule Private Visit</h3>
                <p className="text-xs text-zinc-400">Accompanied by verified local property specialist</p>
              </div>

              {visitBooked ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 space-y-2">
                  <div className="font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Visit Scheduled!</span>
                  </div>
                  <p className="text-zinc-300">
                    Slot confirmed for <span className="text-emerald-300 font-mono">{bookingDate}</span> at <span className="text-emerald-300 font-mono">{bookingTime}</span>.
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Assigned specialist <span className="text-white font-medium">Sanjay Bhattacharya</span> will meet you at the property.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookVisit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Select Inspection Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Select Time Slot</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="10:00 AM">10:00 AM - Morning Slot</option>
                      <option value="11:30 AM">11:30 AM - Morning Slot</option>
                      <option value="02:30 PM">02:30 PM - Afternoon Slot</option>
                      <option value="04:30 PM">04:30 PM - Golden Hour / Sunset Slot</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    Confirm Site Visit Request
                  </button>
                </form>
              )}

              <div className="pt-4 border-t border-zinc-800/80">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-2">Dedicated Specialist</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-cyan-300">
                    SB
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Sanjay Bhattacharya</h4>
                    <p className="text-[11px] text-zinc-400">Kolkata Micro-Market Specialist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© 2026 EstateAI Kolkata. Property Detail Experience.</p>
      </footer>
    </div>
  );
}
