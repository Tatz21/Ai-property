export interface GuideArticle {
  slug: string;
  title: string;
  category: "Legal & RERA" | "Financing & Loans" | "Market Analysis" | "Buyer Advice";
  readTime: string;
  publishDate: string;
  summary: string;
  metaDescription: string;
  keywords: string[];
  contentHtml: string;
  keyTakeaways: string[];
  faqs: { question: string; answer: string }[];
}

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    slug: "wbrera-compliance-guide-kolkata",
    title: "The Ultimate Guide to WBRERA Compliance for Homebuyers in West Bengal",
    category: "Legal & RERA",
    readTime: "7 min read",
    publishDate: "2026-03-15",
    summary: "Everything you need to know about checking West Bengal Real Estate Regulatory Authority (WBRERA) registration, builder obligations, escrow rules, and filing complaints.",
    metaDescription: "Learn how to verify WBRERA registration numbers in Kolkata, check project completion status, escrow rules, and safeguard your property investment.",
    keywords: ["wbrera kolkata", "west bengal rera registration", "check rera property kolkata", "rera approved projects new town"],
    keyTakeaways: [
      "Any project over 500 sq. meters or more than 8 apartments must be registered with WBRERA.",
      "70% of buyer payments must be deposited in a designated escrow bank account.",
      "Builders cannot advertise or take booking amounts >10% before formal Agreement for Sale.",
      "Check authenticity at wbrera.wb.gov.in using the project registration ID."
    ],
    faqs: [
      {
        question: "How do I verify a project's WBRERA number?",
        answer: "Visit the official West Bengal RERA portal (wbrera.wb.gov.in), navigate to 'Registered Projects', and search by the developer name or the WBRERA registration code (e.g. WBRERA/P/NOR/2023/...)."
      },
      {
        question: "What compensation does WBRERA mandate for project delays?",
        answer: "Under WBRERA rules, if a promoter fails to deliver possession on the promised date, the buyer is entitled to interest at SBI Highest Marginal Cost of Lending Rate (MCLR) + 2% per annum."
      }
    ],
    contentHtml: `
      <h2>1. What is WBRERA?</h2>
      <p>The West Bengal Real Estate Regulatory Authority (WBRERA) is the statutory body regulating the real estate sector across West Bengal. It ensures transparency, protects consumer interests, and enforces strict delivery schedules for developers.</p>
      
      <h2>2. Key Protections for Kolkata Home Buyers</h2>
      <ul>
        <li><strong>Escrow Account Rule:</strong> 70% of funds collected from allottees must be held in a dedicated escrow account, drawn only in proportion to construction milestones certified by an engineer and CA.</li>
        <li><strong>Carpet Area Pricing:</strong> Properties can only be sold on clear Carpet Area (internal usable area), eliminating opaque Super Built-up calculations.</li>
        <li><strong>5-Year Structural Defect Liability:</strong> Promoters are legally obligated to repair any structural defect or poor workmanship for 5 years after handover at zero cost.</li>
      </ul>

      <h2>3. Red Flags to Watch Out For</h2>
      <p>Never transfer a token advance to any project that cannot provide an active WBRERA registration certificate or claims that 'RERA is applied for'.</p>
    `
  },
  {
    slug: "kolkata-property-registration-stamp-duty-guide",
    title: "Kolkata Property Registration & Stamp Duty Rates (2026 Updated)",
    category: "Legal & RERA",
    readTime: "6 min read",
    publishDate: "2026-03-10",
    summary: "Comprehensive breakdown of stamp duty and registration fees in Kolkata Municipal Corporation (KMC), Bidhannagar (Salt Lake), and New Town (NKDA) jurisdictions.",
    metaDescription: "Current stamp duty rates and registration fees in Kolkata, KMC, NKDA New Town, and Salt Lake. Calculate total transaction costs before buying a home.",
    keywords: ["stamp duty in kolkata", "property registration charges west bengal", "kmc flat registration cost", "nkda stamp duty"],
    keyTakeaways: [
      "Stamp duty in Urban Municipal areas (KMC, Bidhannagar, NKDA) is 6% for properties <= ₹1 Crore and 7% for properties > ₹1 Crore.",
      "Registration fee is fixed at 1% of the market value across West Bengal.",
      "E-assessment slips can be generated online through the Directorate of Registration and Stamp Revenue (wbregistration.gov.in).",
      "Nominal rebate may apply depending on annual state budget notifications."
    ],
    faqs: [
      {
        question: "What is the total overhead cost for flat registration in Kolkata?",
        answer: "Total registration overhead is typically 7% to 8% of the circle rate / market value (6-7% Stamp Duty + 1% Registration fee) plus incidental legal documentation fees."
      },
      {
        question: "Can property registration be completed online in West Bengal?",
        answer: "The e-Deed drafting, valuation assessment, and stamp duty payment are done online via wbregistration.gov.in. The buyer and seller must visit the Sub-Registrar / ARA office for biometric verification and final deed execution."
      }
    ],
    contentHtml: `
      <h2>1. Current Stamp Duty Slab in Kolkata</h2>
      <p>Properties located in Kolkata Municipal Corporation (KMC), Bidhannagar Municipal Corporation (BMC), and New Town Kolkata Development Authority (NKDA) are classified as Urban Areas.</p>
      
      <table>
        <thead>
          <tr>
            <th>Property Valuation</th>
            <th>Urban Stamp Duty Rate</th>
            <th>Registration Fee</th>
            <th>Total Gov Charges</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Up to ₹1 Crore</td>
            <td>6.0%</td>
            <td>1.0%</td>
            <td>7.0%</td>
          </tr>
          <tr>
            <td>Above ₹1 Crore</td>
            <td>7.0%</td>
            <td>1.0%</td>
            <td>8.0%</td>
          </tr>
        </tbody>
      </table>

      <h2>2. Essential Documents Checklist</h2>
      <ol>
        <li>Original Title Deed / Conveyance Deed.</li>
        <li>Sanctioned Building Plan approved by KMC / NKDA.</li>
        <li>WBRERA Certificate and Allocation Letter.</li>
        <li>No-Objection Certificate (NOC) from Society / Developer.</li>
        <li>PAN Card, Aadhaar Card, and 2 passport photos of all parties.</li>
      </ol>
    `
  },
  {
    slug: "home-loan-interest-rates-tax-benefits-india",
    title: "Home Loan Interest Rates, EMI Optimization & Tax Benefits (Section 80C & 24b)",
    category: "Financing & Loans",
    readTime: "8 min read",
    publishDate: "2026-03-01",
    summary: "How to maximize home loan tax exemptions under Section 80C, Section 24(b), and Section 80EEA while negotiating the lowest repo-linked lending rates in India.",
    metaDescription: "Master home loan tax deductions in India. Save up to ₹3.5 Lakh annually on principal and interest repayments under old and new tax regimes.",
    keywords: ["home loan tax benefits", "section 24b interest deduction", "home loan emi calculator kolkata", "sbi home loan rates kolkata"],
    keyTakeaways: [
      "Deduct up to ₹2,00,000 per financial year on home loan interest under Section 24(b) for self-occupied homes.",
      "Deduct up to ₹1,50,000 on principal repayment under Section 80C (Old Tax Regime).",
      "Co-borrowing with a spouse enables double tax deductions up to ₹7 Lakh combined.",
      "Opt for Repo Rate Linked Lending (RLLR) for transparent, immediate rate cuts."
    ],
    faqs: [
      {
        question: "Can both husband and wife claim tax exemption on a joint home loan?",
        answer: "Yes! If both are co-owners and co-borrowers contributing to the EMI, each can claim up to ₹2 Lakh on interest under Section 24(b) and up to ₹1.5 Lakh under Section 80C, yielding up to ₹7 Lakh total deduction."
      },
      {
        question: "How does pre-payment affect long-term interest in home loans?",
        answer: "Paying just 1 extra EMI every year or increasing your EMI by 5% annually can reduce a 20-year loan tenure by 5 to 7 years and save hundreds of thousands in total interest."
      }
    ],
    contentHtml: `
      <h2>1. Tax Savings Breakdown</h2>
      <p>Real estate remains one of the highest tax-advantaged asset classes in India when financed through a formal banking institution.</p>
      
      <ul>
        <li><strong>Section 24(b) — Interest Component:</strong> Maximum deduction of ₹2,00,000 per financial year for self-occupied properties.</li>
        <li><strong>Section 80C — Principal Repayment:</strong> Up to ₹1,50,000 deduction on the principal portion of your EMIs as well as stamp duty paid during the year.</li>
        <li><strong>Section 80EEA:</strong> Additional ₹1,50,000 interest deduction for first-time buyers of affordable homes (stamp value <= ₹45 Lakh).</li>
      </ul>
    `
  },
  {
    slug: "new-town-metro-growth-corridor-analysis",
    title: "New Town & Rajarhat: Metro Growth Corridor & Real Estate Appreciation Analysis",
    category: "Market Analysis",
    readTime: "9 min read",
    publishDate: "2026-02-20",
    summary: "In-depth micro-market study on Kolkata's eastern growth corridor: Orange Line (Kavi Subhash to NSCBI Airport) and Yellow Line impact on property valuations.",
    metaDescription: "Analysis of New Town Action Area 1, 2, 3 and Rajarhat real estate price trends, rental yields, and infrastructure milestones through 2026-2030.",
    keywords: ["new town metro station real estate", "property price trend new town kolkata", "action area 2 flats investment", "kolkata real estate market report"],
    keyTakeaways: [
      "Orange Line Metro connects Airport to New Town, Sector V, and South Kolkata.",
      "Silicon Valley Bengal in Action Area II has brought over 25+ tech campus commitments.",
      "Average residential rental yield in New Town stands at 3.8% - 4.5%, highest in Kolkata.",
      "Capital appreciation in Action Area II & III has outpaced traditional central Kolkata by 24% over 3 years."
    ],
    faqs: [
      {
        question: "Which Action Area in New Town is best for real estate investment?",
        answer: "Action Area II offers the optimal balance of commercial IT growth (Silicon Valley), social infrastructure, and premium residential gated societies. Action Area I is best for immediate rental returns."
      }
    ],
    contentHtml: `
      <h2>1. The Infrastructure Catalyst</h2>
      <p>New Town Kolkata is Bengal's premier planned smart city. The operational commissioning of the Orange Line Metro (Line 6) linking Netaji Subhash Chandra Bose International Airport to Ruby, Garia, and Sector V is transforming daily commute times.</p>
      
      <h2>2. Micro-Market Breakdown</h2>
      <p><strong>Action Area I:</strong> Highest density, adjacent to Salt Lake Sector V, ideal for working professionals seeking short commutes.</p>
      <p><strong>Action Area II:</strong> The Silicon Valley and convention hub with master-planned township high-rises, wide boulevards, and premium amenities.</p>
      <p><strong>Action Area III:</strong> Long-term luxury and institutional zone, hosting premier universities (St. Xavier's, Amity, Presidency) and green residential enclaves.</p>
    `
  }
];
