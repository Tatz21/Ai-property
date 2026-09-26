export const SITE_CONFIG = {
  name: "EstateAI Kolkata",
  legalName: "EstateAI Technologies Private Limited",
  domain: "https://estateai-kolkata.in",
  description: "West Bengal's #1 RERA-verified AI-powered real estate intelligence & property discovery engine.",
  tagline: "Find verified flats, apartments & commercial spaces across Kolkata with AI.",
  author: "EstateAI Intelligence Team",
  localityList: [
    {
      slug: "new-town",
      name: "New Town",
      tagline: "Smart City Hub — Action Area I, II & III",
      avgPricePerSqFt: "₹5,400 - ₹8,200",
      description: "Kolkata's most modern smart city destination with planned IT corridors, Eco Park, premier hospitals, and rapid metro expansion.",
      popularCategories: ["2 BHK", "3 BHK", "Luxury Villas", "IT Park Offices"],
      highlights: ["Eco Park & Silicon Valley Hub", "Upcoming Yellow & Orange Metro Lines", "Tata Medical Center & Ohio Cardiology", "Biswa Bangla Convention Centre"],
      keywords: ["flats in new town kolkata", "new town action area 2 flats", "rera flats in new town", "buy apartment new town kolkata"]
    },
    {
      slug: "salt-lake",
      name: "Salt Lake (Bidhannagar)",
      tagline: "IT Capital & Green Residential Hub",
      avgPricePerSqFt: "₹6,800 - ₹11,500",
      description: "Prime planned township hosting Sector V IT epicenter, renowned schools, Salt Lake Stadium, and seamless Green Line Metro connectivity.",
      popularCategories: ["3 BHK", "4 BHK Luxury", "Commercial Sector V", "Bungalows"],
      highlights: ["Sector V Tech Park corridor", "East-West Metro Green Line connected", "Apollo Gleneagles & AMRI Hospitals", "Salt Lake Central Park"],
      keywords: ["flats in salt lake sector 5", "salt lake bidhannagar apartments", "buy 3 bhk salt lake", "properties near sector 5 kolkata"]
    },
    {
      slug: "rajarhat",
      name: "Rajarhat",
      tagline: "High-Growth Airport Expressway Corridor",
      avgPricePerSqFt: "₹4,200 - ₹6,500",
      description: "Rapidly expanding residential corridor offering high rental yields, proximity to NSCBI Airport, and lifestyle gated complexes.",
      popularCategories: ["2 BHK Budget", "3 BHK Gated", "Studio Apartments"],
      highlights: ["10 mins to Netaji Subhash Chandra Bose Airport", "Direct Chinar Park & City Centre II access", "High rental ROI for IT professionals"],
      keywords: ["affordable flats rajarhat kolkata", "flats near chinar park", "rajarhat main road property", "gated society rajarhat"]
    },
    {
      slug: "em-bypass",
      name: "EM Bypass",
      tagline: "Arterial Luxury & Healthcare Corridor",
      avgPricePerSqFt: "₹8,500 - ₹16,000",
      description: "The premier north-south arterial expressway of Kolkata, featuring ultra-luxury high-rises, 5-star hotels, and apex super-specialty hospitals.",
      popularCategories: ["3 BHK Luxury", "4 BHK High Rise", "Penthouse"],
      highlights: ["Orange Line Metro along the corridor", "Peerless, Medica, Ruby & Fortis Healthcare hub", "JW Marriott & ITC Sonar / Royal Bengal"],
      keywords: ["luxury flats on em bypass", "high rise apartments em bypass", "buy penthouse kolkata em bypass", "flats near ruby general hospital"]
    },
    {
      slug: "ballygunge",
      name: "Ballygunge",
      tagline: "South Kolkata's Heritage & Elite Enclave",
      avgPricePerSqFt: "₹12,000 - ₹22,000",
      description: "Iconic South Kolkata residential neighborhood renowned for premier cultural institutions, quiet leafy avenues, and aristocratic luxury.",
      popularCategories: ["3 BHK Premium", "4 BHK Heritage Luxury", "Independent Floors"],
      highlights: ["South Point & CCFC Club proximity", "Quest Mall & Gariahat shopping district", "High capital appreciation and status address"],
      keywords: ["luxury apartments in ballygunge", "flats near quest mall kolkata", "ballygunge circular road flats", "south kolkata premium homes"]
    },
    {
      slug: "alipore",
      name: "Alipore",
      tagline: "The Billionaires' Row of Eastern India",
      avgPricePerSqFt: "₹18,000 - ₹35,000",
      description: "India's prestigious ultra-prime neighborhood surrounded by lush greenery, Kolkata Zoo, National Library, and palatial mansions.",
      popularCategories: ["4 BHK Ultra Luxury", "Duplex Penthouses", "Exclusive Bungalows"],
      highlights: ["Alipore Zoological Gardens & National Library", "Highest capital appreciation & ultra-HNI enclave", "Unmatched security and serene environment"],
      keywords: ["ultra luxury flats in alipore", "alipore kolkata apartments", "buy penthouse alipore", "costliest properties in kolkata"]
    }
  ],
  intents: [
    {
      slug: "2-bhk-flats-in-kolkata",
      title: "2 BHK Flats for Sale in Kolkata — Verified RERA Properties",
      metaDescription: "Explore 2 BHK verified apartments for sale in Kolkata across New Town, Rajarhat, Salt Lake & EM Bypass with floor plans, RERA approvals, and 0% brokerage options.",
      bhk: 2,
      priceRange: "₹38 Lakh - ₹85 Lakh",
      targetKeywords: ["2 bhk flats in kolkata", "buy 2 bhk apartment kolkata", "affordable 2 bhk new town"]
    },
    {
      slug: "3-bhk-luxury-apartments-kolkata",
      title: "3 BHK Luxury Flats & Apartments in Kolkata",
      metaDescription: "Find premium 3 BHK gated communities and high-rises in Kolkata. 100% WBRERA registered with clubhouse, swimming pool, and prime connectivity.",
      bhk: 3,
      priceRange: "₹75 Lakh - ₹2.5 Crore",
      targetKeywords: ["3 bhk luxury flats kolkata", "3 bhk apartments em bypass", "3 bhk gated society salt lake"]
    },
    {
      slug: "luxury-penthouses-in-kolkata",
      title: "Luxury Penthouses & Ultra-Premium Homes in Kolkata",
      metaDescription: "Discover exclusive penthouses and duplex apartments in Alipore, Ballygunge, and EM Bypass with panoramic city views and private decks.",
      bhk: 4,
      priceRange: "₹3 Crore - ₹15 Crore",
      targetKeywords: ["penthouses in kolkata", "ultra luxury homes alipore", "duplex flats kolkata"]
    },
    {
      slug: "ready-to-move-flats-kolkata",
      title: "Ready to Move Flats in Kolkata — Immediate Possession",
      metaDescription: "Browse ready-to-move apartments in Kolkata with OC (Occupancy Certificate) and WBRERA registration. Move in immediately without construction delays.",
      bhk: 0,
      priceRange: "₹45 Lakh - ₹4 Crore",
      targetKeywords: ["ready to move flats kolkata", "immediate possession apartments new town", "flats with occupancy certificate"]
    }
  ]
};
