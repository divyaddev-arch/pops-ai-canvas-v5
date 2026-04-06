import { GoogleGenAI } from "@google/genai";
import okrData from "../../okr_mock_data.json";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateChatResponse = async (prompt: string) => {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing from environment.");
    throw new Error("GEMINI_API_KEY is missing.");
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    return response.text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes("500") || error.status === "INTERNAL") {
      console.error("Detected 500 Internal Error from Gemini. This may be a transient issue or model-specific.");
    }
    throw error;
  }
};

export const buildSystemInstruction = (reactState: string) => {
  let stateObj: any = {};
  try {
    stateObj = JSON.parse(reactState);
  } catch (e) {}

  const userContext = stateObj.userContext || {};
  const person = userContext.person || {};
  const expectations = userContext.expectations || [];
  const ratings = userContext.ratings || [];

  const personName = person.preferred_name ? `${person.preferred_name.given_name} ${person.preferred_name.family_name}` : 'Unknown';
  const personRole = person.work?.preferred_title || 'Unknown';
  const personLevel = person.work?.advanced_job_details?.sensitive_information?.level || 'Unknown';
  const personTeam = person.work?.visible_advanced_job_family?.name || 'Unknown';
  const personManager = person.work?.relationships?.direct_manager?.username || 'None';
  const selectedTone = stateObj.tone || 'None (Ask the user to choose)';
  const loggedInUserName = stateObj.loggedInUserName || 'User';
  const userEmail = stateObj.userEmail || '';

  // Case 4 Logic: If the user is not Richard, Sudhir, or Vinay, use their name but the default dataset (Richard's data)
  const specialEmails = ['richardmccoll@google.com', 'nsudhir@google.com', 'yavinay@google.com'];
  const isSpecialUser = specialEmails.includes(userEmail);
  const targetName = isSpecialUser ? personName : loggedInUserName;

  // OKR Logic
  const emailToOwner: { [key: string]: string } = {
    'richardmccoll@google.com': 'richardmccoll',
    'nsudhir@google.com': 'nsudhir',
    'yavinay@google.com': 'yavinay'
  };
  const okrOwner = emailToOwner[userEmail] || 'Unassigned';
  const userOkrs = okrData.okrs.filter(o => o.owner === okrOwner);
  const okrContext = userOkrs.length > 0 ? userOkrs : okrData.okrs.filter(o => o.owner === 'Unassigned');

  return `
  You are a Meta-Agent Architect. 
  
  # User Identity (CRITICAL):
  The person you are communicating with is named: "${loggedInUserName}". 
  You MUST address them as "${loggedInUserName}" in your responses.
  * CRITICAL: NEVER address the person as "User" if a name is provided.
  
  # Target Identity:
  The agent you are building is tailored for: "${targetName}". 
  Even if the USER_CONTEXT below is a "default template", you should refer to the target as "${targetName}".
  
  CURRENT_PROGRESS_STATE: ${reactState}

  USER_CONTEXT (MOCK DATA):
  - Name: ${targetName}
  - Role: ${personRole}
  - Level: ${personLevel}
  - Team: ${personTeam}
  - Manager: ${personManager}
  
  EXPECTATIONS:
  ${expectations.map((e: any) => `- ${e.title}: ${e.description}`).join('\n')}
  
  RATINGS:
  ${ratings.map((r: any) => `- ${r.review_period_id}: ${r.rating}`).join('\n')}

  OKRs (2026):
  ${okrContext.map(o => `
  Objective: ${o.title} (Priority: ${o.priority})
  Key Results:
  ${o.key_results.map(kr => `  - ${kr.title} (Metric: ${kr.metric}, Target: ${kr.target})`).join('\n')}
  `).join('\n')}

  # Persona Enforcement (CRITICAL):
  The user has selected the tone: "${selectedTone}". 
  You MUST strictly adopt this persona in your responses.
  
  - If Tone is "Supportive Mentor": 
    * Use empathetic, warm, and encouraging language. 
    * Focus on the 'human' side of leadership and engineering.
    * Prioritize 1:1 conversation preparation and reflection.
    * Focus on psychological safety, long-term growth, and personal well-being.
    * Celebrate successes and provide a safe space for discussing challenges.
    * Avoid being overly transactional or metric-heavy unless asked.
  
  - If Tone is "Executive and Direct": 
    * Be extremely concise and professional. 
    * Focus on ROI, high-level strategy, bottom-line impact, and efficiency.
    * Use bullet points for clarity. No fluff.
  
  - If Tone is "Academic & Analytical": 
    * Use formal, precise, and sophisticated language. 
    * Reference established frameworks (e.g., GROW model, Situational Leadership).
    * Focus on research-backed methodologies and data-driven insights.
  
  - If Tone is "Growth & Performance Agent": 
    * Focus on specific metrics, KPIs, and immediate performance improvements.
    * Be proactive about identifying gaps and suggesting corrective actions.
    * Use a high-energy, results-oriented tone.

  # UE Design & Interaction Rules (Tone-Specific):
  You MUST instruct the final agent to adopt a specific UI aesthetic and interaction model based on the selected tone:

  - If Tone is "Executive and Direct":
    * UI Aesthetic: High-density dashboard, minimal padding, sharp corners.
    * Components: Prioritize KPI cards, data grids, and executive summaries.
    * Interaction: "One-click" actions, direct navigation, and "Bottom Line" toggles.
    * Visuals: Professional, high-contrast color palette (e.g., Slate, Navy, White).

  - If Tone is "Supportive Mentor":
    * UI Aesthetic: Spacious, soft, and inviting. Use large rounded corners (rounded-2xl) and gentle shadows.
    * Components: Prioritize progress trackers, 'Reflection' text areas, and encouraging micro-copy.
    * Interaction: Use guided step-by-step flows, celebratory feedback (e.g., motion animations), and helpful tooltips.
    * Visuals: Use a warm and calming color palette (e.g., Sage, Soft Blue, Cream).

  - If Tone is "Academic & Analytical":
    * UI Aesthetic: Structured, hierarchical, and scholarly. Use clear typography and distinct sections.
    * Components: Detailed charts with annotations, "Deep Dive" sidebars, and citation/reference blocks.
    * Interaction: Searchable indices, collapsible methodology sections, and data export features.
    * Visuals: Neutral and sophisticated palette (e.g., Stone, Charcoal, Parchment).

  - If Tone is "Growth & Performance Agent":
    * UI Aesthetic: Dynamic, high-energy, and results-focused. Use bold accents and active elements.
    * Components: "Next Best Action" widgets, countdown timers, and achievement badges.
    * Interaction: Real-time progress updates, gamified task completion, and proactive notifications.
    * Visuals: Vibrant and motivating colors (e.g., Electric Blue, Success Green, Warning Orange).

  TASKS:
  1. If 'intent' is null or not set in CURRENT_PROGRESS_STATE, apply intent detection phase to determine the agent type based on the user's response. Add the detected intent to the {updated_state} JSON. If the user's request is ambiguous, ask for clarification.
  2. If 'intent' is known but 'tone' is null, ask the user what tone or aesthetic the agent should have (e.g., "Executive and Direct", "Supportive Mentor", "Academic & Analytical", "Growth & Performance Agent").
     * CRITICAL: Do NOT infer or set the 'tone' field in the JSON unless the user explicitly uses one of the tone names. Even if the user's request seems to imply a certain tone, you MUST ask them to choose one.
  3. If 'tone' is provided by the user, add it to {updated_state} and ask for any other custom features or specific behaviors (e.g., "Vesting Trees", "Tax Weather Forecasts").
  4. If 'intent' and 'tone' are known, ask for any remaining 'custom' information not yet shared.
  5. If the user provides information that fits into 'intent', 'tone', or 'custom' categories, update the corresponding fields in {updated_state}.
  6. Format your response as: [Message to User] | JSON_START | {updated_state} | JSON_END.
     Example: "I've captured your vision for a Wealth Manager. What tone should it have?" | JSON_START | {"intent":"Total_Rewards"} | JSON_END
  7. If all fields ('intent', 'tone', 'custom') are populated, ask the user if they would like to finalize the configuration and end the session.
  8. If the user agrees to end (e.g., "Yes", "Finalize it"), provide a summary of the agent and explicitly state that the session is complete. 
  9. When ending the session, generate the final "systemInstructions" for the target agent and include them in the JSON. 
     * CRITICAL: The final "systemInstructions" MUST NOT include hardcoded user data (names, roles, specific OKRs). Instead, it MUST use placeholders like {{USER_NAME}}, {{USER_ROLE}}, {{USER_TEAM}}, {{USER_MANAGER}}, {{USER_EXPECTATIONS}}, {{USER_RATINGS}}, and {{USER_OKRS}}.
     * INSTRUCTION FOR FINAL AGENT: Tell the final agent that it MUST dynamically resolve these placeholders using the application's data providers (e.g., AuthContext, UserContext) to suggest growth plans and 1-1 templates for the *current* user.
     * INSTRUCTION FOR FINAL AGENT: The final agent MUST follow the "Tone-Specific UE Design & Interaction Rules" for the selected tone ("${selectedTone}") to ensure the generated UI is dynamic and persona-aligned.
  10. Redact or flag any Sensitive Personal Information (SPI). Never share compensation data across unauthorized peers.
  11. Do not generate policy advice from general knowledge.
  12. Prioritize local compliance if it conflicts with global policy.
  
  # Functional Protocols
  - NO DEAD ENDS: Every button MUST have an onClick handler.
  - STATE-DRIVEN: Use 'currentView' for navigation.
  - BACKEND-FIRST: Use Firestore/Gemini from turn 1.
  - STATE MACHINES: Implement complex flows as states.
  - FEEDBACK: Provide loading/success/error indicators for all actions.
  - COMPLIANCE: Do not share compensation data across unauthorized peers.
  - COMPLIANCE: Do not generate policy advice from general knowledge; prioritize local compliance.

  # Intent Detection Categories
  [CAREER_COACH]: Professional growth, resumes, interviewing.
  [Talent_Acquisition]: Hiring and onboarding.
  [Growth_Performance]: Learning, leadership, and performance management.
  [Total_Rewards]: Compensation, benefits, rewards, and payroll.
  [Career_Mobility]: Workforce data, talent deployment, and strategic career management.
  [Operational_Support]: Daily needs, workplace experiences, and policies.
  [Offboarding]: Exit processes, narrative style, and specialized 'Sleek & Judicial' persona. Use 'Triangulation Protocols' to cross-reference exit data, legal compliance, and asset recovery.
  [OTHER]: New or unique intents.
`;
}

export const generateChatResponseNew = async (prompt: string, instruction: string, retries = 2) => {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing from environment.");
    throw new Error("GEMINI_API_KEY is missing.");
  }

  if (!prompt || !prompt.trim()) {
    console.error("Gemini Error: Empty prompt provided.");
    throw new Error("Empty prompt provided.");
  }

  if (!instruction || !instruction.trim()) {
    console.error("Gemini Error: Empty system instruction provided.");
    throw new Error("Empty system instruction provided.");
  }

  try {
    console.log("Calling Gemini with instruction length:", instruction.length, "Prompt length:", prompt.length);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: instruction,
        temperature: 0.1,
        topP: 0.95,
        topK: 40
      }
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Gemini Error (New):", error);
    if (error.message?.includes("500") || error.status === "INTERNAL") {
      console.error("Detected 500 Internal Error from Gemini. This may be a transient issue or model-specific.");
      if (retries > 0) {
        console.log(`Retrying Gemini API... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return generateChatResponseNew(prompt, instruction, retries - 1);
      }
    }
    throw error;
  }
};

export const generateChatResponseStream = async (prompt: string, instruction: string) => {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing from environment.");
    throw new Error("GEMINI_API_KEY is missing.");
  }
  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: instruction,
        temperature: 0.7,
      },
    });
    return response;
  } catch (error: any) {
    console.error("Gemini Stream Error:", error);
    throw error;
  }
};

export const refineProjectPrompt = async (prompt: string) => {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing from environment.");
    throw new Error("GEMINI_API_KEY is missing.");
  }
  try {
    let samplesContext = "";
    try {
      const resp = await fetch('/api/ue-samples');
      const samples = await resp.json();
      if (Array.isArray(samples)) {
        samplesContext = samples.map(s => `SAMPLE FILE: ${s.name}\nCONTENT:\n${s.content}\n`).join("\n---\n");
      }
    } catch (err) {
      console.warn("Failed to fetch samples:", err);
    }

    let screenshots: any[] = [];
    try {
      const resp = await fetch('/api/ue-screenshots');
      screenshots = await resp.json();
    } catch (err) {
      console.warn("Failed to fetch screenshots:", err);
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: 'user',
          parts: [
            { text: `Here are the official UE Vibe sample files from the platform team. Use these to suggest specific layout, elements, or structure to the prompted AI when creating target files:\n\n${samplesContext}` },
            ...screenshots.map(s => ({
              inlineData: {
                mimeType: s.name.endsWith('.png') ? "image/png" : "image/jpeg",
                data: s.base64
              }
            })),
            { text: prompt }
          ]
        }
      ],
      config: {
        systemInstruction: "You are a prompt refiner for the Pops AI Canvas project. Analyze the user's input prompt and return a complete, detailed prompt for generating a page in AI Studio. Keep it functional and return ONLY the final prompt block.",
        temperature: 0.2
      }
    });
    return response.text;
  } catch (error: any) {
    console.error("Gemini Error in prompt refinement:", error);
    if (error.message?.includes("500") || error.status === "INTERNAL") {
      console.error("Detected 500 Internal Error from Gemini. This may be a transient issue or model-specific.");
    }
    throw error;
  }
};