"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, User, Mail, Lock, Phone, MapPin, 
  AlertCircle, Building2, Briefcase, Home, CheckCircle2, ArrowRight
} from "lucide-react";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { UserRole } from "@/lib/auth/types";

const KOLKATA_AREAS = [
  "New Town Action Area I",
  "New Town Action Area II",
  "New Town Action Area III",
  "Salt Lake Sector V",
  "Salt Lake Sector I/II/III",
  "Rajarhat",
  "EM Bypass",
  "Ballygunge",
  "Alipore",
  "Behala"
];

const ROLE_INFO: Record<string, { label: string; icon: any; tagline: string; benefits: string[] }> = {
  customer: {
    label: "Home Buyer",
    icon: User,
    tagline: "Find your dream home in Kolkata with conversational AI",
    benefits: ["Conversational property search", "Instant site visit booking", "Zero broker spam & 100% RERA verified"]
  },
  agent: {
    label: "Partner Agent",
    icon: Briefcase,
    tagline: "Join Kolkata's high-tech broker network and receive pre-qualified leads",
    benefits: ["AI-qualified buyer leads", "Verified MLS inventory access", "Automated commission tracking"]
  },
  developer: {
    label: "Developer Partner",
    icon: Building2,
    tagline: "Showcase multi-unit residential projects directly to high-intent buyers",
    benefits: ["Project & unit command matrix", "Real-time unit availability toggles", "AI buyer inquiry telemetry"]
  },
  owner: {
    label: "Property Owner",
    icon: Home,
    tagline: "List your property directly and connect with serious, verified buyers",
    benefits: ["Direct listing management", "Real-time visit scheduling", "Zero listing fees for owners"]
  }
};

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>(["New Town Action Area II", "Salt Lake Sector V"]);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleArea = (area: string) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter(a => a !== area));
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: role === "developer" && companyName ? `${name} (${companyName})` : name,
          email,
          phone,
          password,
          role,
          serviceAreas: role === "agent" ? selectedAreas : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Registration failed");
      }

      // Smooth redirection to appropriate role dashboard
      if (role === "agent") router.push("/agent/dashboard");
      else if (role === "developer") router.push("/developer/dashboard");
      else if (role === "owner") router.push("/owner/dashboard");
      else if (role === "admin") router.push("/admin");
      else router.push("/customer/profile");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentRoleInfo = ROLE_INFO[role] || ROLE_INFO.customer;

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between">
      <PerspectiveGrid />
      <SpotlightNavbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-10">
        <div className="w-full max-w-xl rounded-[24px] bg-[#111116]/95 border border-zinc-800 shadow-2xl p-6 sm:p-8 backdrop-blur-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Join EstateAI Kolkata</h1>
            <p className="text-xs text-zinc-400 mt-1">{currentRoleInfo.tagline}</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-4 p-1 rounded-xl bg-zinc-900 border border-zinc-800 mb-6 text-center text-xs">
            {(["customer", "agent", "developer", "owner"] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-2 px-1 font-medium capitalize rounded-lg transition-all cursor-pointer ${
                  role === r ? "bg-cyan-500 text-black font-bold shadow-md" : "text-zinc-400 hover:text-white"
                }`}
              >
                {ROLE_INFO[r]?.label || r}
              </button>
            ))}
          </div>

          {/* Role Highlights Banner */}
          <div className="mb-5 p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold block">
              {currentRoleInfo.label} Benefits:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-zinc-300">
              {currentRoleInfo.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  {role === "developer" ? "Authorized Representative" : "Full Name"}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === "developer" ? "Debashis Banerjee" : "Subhashis Mukherjee"}
                    className="w-full rounded-xl bg-zinc-900/90 border border-zinc-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {role === "developer" && (
                <div>
                  <label className="block text-xs font-mono text-cyan-400 mb-1.5">Developer Entity Name</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Shapoorji Pallonji Realcon"
                      className="w-full rounded-xl bg-zinc-900/90 border border-zinc-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}

              <div className={role === "developer" ? "sm:col-span-2" : ""}>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === "developer" ? "contact@realcon-bengal.com" : "user@example.com"}
                    className="w-full rounded-xl bg-zinc-900/90 border border-zinc-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98300 00000"
                    className="w-full rounded-xl bg-zinc-900/90 border border-zinc-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-xl bg-zinc-900/90 border border-zinc-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Agent Service Area Specific Selector */}
            {role === "agent" && (
              <div className="pt-2">
                <label className="block text-xs font-mono text-cyan-400 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Select Your Kolkata Service Micro-Markets</span>
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                  {KOLKATA_AREAS.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleArea(area)}
                      className={`text-left text-[11px] p-2 rounded-lg border transition-all cursor-pointer ${
                        selectedAreas.includes(area)
                          ? "bg-cyan-950/60 border-cyan-500/60 text-cyan-200 font-medium"
                          : "bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all cursor-pointer disabled:opacity-50 mt-4 shadow-lg shadow-cyan-500/20"
            >
              {loading ? "Creating Partner Account..." : `Join as ${currentRoleInfo.label}`}
            </button>
          </form>

          <div className="text-center mt-6 text-xs text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
