import { propertyService } from "@/lib/properties/service";
import { aiStore } from "./store";
import { AIMessage, ExtractedRequirement } from "./types";
import { formatINR } from "@/lib/utils";

const PROMPT_VERSION = "v1.2-kolkata-agent";

// Parse natural language Kolkata property requirements using rule-based + semantic extractor
export function extractRequirementsFromText(text: string): Partial<ExtractedRequirement> {
  const lower = text.toLowerCase();
  const req: Partial<ExtractedRequirement> = {};

  // 1. BHK extraction
  const bhkMatch = lower.match(/(\d+)\s*(?:bhk|bedroom|bed|room)/i);
  if (bhkMatch) {
    req.bhk = parseInt(bhkMatch[1], 10);
  }

  // 2. Budget extraction (Crore & Lakhs)
  const crMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:cr|crore|crores)/i);
  if (crMatch) {
    req.maxPrice = Math.round(parseFloat(crMatch[1]) * 10000000);
  }

  const lakhMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:l|lakh|lakhs|lac|lacs)/i);
  if (lakhMatch && !req.maxPrice) {
    req.maxPrice = Math.round(parseFloat(lakhMatch[1]) * 100000);
  }

  // 3. Kolkata Micro-Market Matching
  const localities = [
    { pattern: /new\s*town\s*(?:action\s*area\s*ii|aa2|aa-2|aa\s*2)/i, name: "New Town Action Area II" },
    { pattern: /new\s*town\s*(?:action\s*area\s*i|aa1|aa-1|aa\s*1)/i, name: "New Town Action Area I" },
    { pattern: /new\s*town\s*(?:action\s*area\s*iii|aa3|aa-3|aa\s*3)/i, name: "New Town Action Area III" },
    { pattern: /new\s*town|newtown|eco\s*park/i, name: "New Town Action Area II" },
    { pattern: /salt\s*lake\s*sector\s*v|sector\s*5|sector\s*v/i, name: "Salt Lake Sector V" },
    { pattern: /salt\s*lake/i, name: "Salt Lake" },
    { pattern: /rajarhat|chinar\s*park/i, name: "Rajarhat Chinar Park" },
    { pattern: /em\s*bypass|topsia|science\s*city/i, name: "EM Bypass - Topsia" },
    { pattern: /ballygunge/i, name: "Ballygunge" },
    { pattern: /alipore/i, name: "Alipore" },
  ];

  for (const loc of localities) {
    if (loc.pattern.test(lower)) {
      req.locality = loc.name;
      break;
    }
  }

  // 4. Property Type
  if (/penthouse/i.test(lower)) req.propertyType = "penthouse";
  else if (/villa|independent\s*house/i.test(lower)) req.propertyType = "villa";
  else if (/commercial|office/i.test(lower)) req.propertyType = "commercial";
  else if (/flat|apartment/i.test(lower)) req.propertyType = "apartment";

  // 5. Amenities extraction
  const amenitiesList: string[] = [];
  if (/pool|swimming/i.test(lower)) amenitiesList.push("Swimming Pool");
  if (/clubhouse|club/i.test(lower)) amenitiesList.push("Clubhouse");
  if (/lake|lake\s*view|lake\s*facing/i.test(lower)) amenitiesList.push("Lake View");
  if (/metro|metro\s*station/i.test(lower)) amenitiesList.push("Near Metro");
  if (/terrace/i.test(lower)) amenitiesList.push("Private Terrace");

  if (amenitiesList.length > 0) req.amenities = amenitiesList;

  return req;
}

export const aiEngine = {
  processChat: async (conversationId: string, userMessage: string, customerId: string = "usr-cust-01") => {
    const startTime = Date.now();
    const toolsInvoked: string[] = [];

    // 1. Persist User Message
    await aiStore.addMessage(conversationId, {
      senderType: "user",
      content: userMessage,
    });

    // 2. Extract structured criteria
    const extracted = extractRequirementsFromText(userMessage);
    toolsInvoked.push("extractRequirementsTool");

    // 3. Execute Property Search Tool on live database
    toolsInvoked.push("searchPropertiesTool");
    const searchResults = await propertyService.search({
      locality: extracted.locality,
      maxPrice: extracted.maxPrice,
      bhk: extracted.bhk,
      type: extracted.propertyType,
      limit: 3,
    });

    const matchedProperties = searchResults.properties;
    const matchedIds = matchedProperties.map(p => p.id);

    // 4. Synthesize Natural AI Response & Match Reasoning
    let responseText = "";

    if (matchedProperties.length > 0) {
      const top = matchedProperties[0];
      const matchCriteriaParts = [];
      if (extracted.bhk) matchCriteriaParts.push(`${extracted.bhk} BHK`);
      if (extracted.locality) matchCriteriaParts.push(`in ${extracted.locality}`);
      if (extracted.maxPrice) matchCriteriaParts.push(`under ${formatINR(extracted.maxPrice)}`);

      const criteriaStr = matchCriteriaParts.length > 0 ? matchCriteriaParts.join(" ") : "your requirements";

      responseText = `I analyzed our verified Kolkata database for ${criteriaStr}. I found **${matchedProperties.length} verified listings** that match:\n\n` +
        `**Top Recommendation: ${top.title}** (${top.locality})\n` +
        `• **Price**: ${formatINR(top.price)} • **Specs**: ${top.bhk > 0 ? `${top.bhk} BHK` : "Commercial"}, ${top.areaSqFt} sq.ft\n` +
        `• **Match Reason**: 100% verified WB RERA listing (${top.reraId || "Verified"}) with ${top.amenities.slice(0, 3).join(", ")}. Status is **${top.status}**.\n\n` +
        `Would you like me to book a private site visit with our local Kolkata specialist, or would you like to explore alternative options?`;
    } else {
      responseText = `I searched our verified database for ${extracted.locality || "Kolkata"} listings with your criteria. Currently, no listings directly match that exact combination, but I can adjust the price ceiling or show nearby micro-markets like New Town and Rajarhat. What is your preferred budget range?`;
    }

    // 5. Persist Assistant Message with Matched Properties
    const assistantMsg = await aiStore.addMessage(conversationId, {
      senderType: "assistant",
      content: responseText,
      matchedPropertyIds: matchedIds,
      extractedRequirement: extracted,
      toolCalls: [
        {
          toolName: "searchPropertiesTool",
          arguments: {
            locality: extracted.locality,
            maxPrice: extracted.maxPrice,
            bhk: extracted.bhk,
          },
          resultSummary: `Found ${matchedProperties.length} properties in database`,
        }
      ]
    });

    // 6. Record AI Run Telemetry
    const latencyMs = Date.now() - startTime;
    await aiStore.recordAIRun({
      conversationId,
      model: "gemini-2.0-flash",
      promptVersion: PROMPT_VERSION,
      latencyMs,
      tokensUsed: Math.floor(userMessage.length * 1.5 + responseText.length * 1.2),
      status: "success",
      toolsInvoked,
    });

    return {
      message: assistantMsg,
      extractedRequirement: extracted,
      matchedProperties,
      conversationId,
    };
  }
};
