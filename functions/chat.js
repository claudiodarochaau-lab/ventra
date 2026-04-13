const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://ventracoffee.com.au",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const SYSTEM_PROMPT =
  "You are a helpful customer service assistant for Ventra Coffee, a managed coffee service built for Australian higher education ‚Äî two machines, one invoice, fully managed. You serve Sydney and Melbourne. Your goals are: answer FAQs about the service, capture lead details (name, email, institution) when someone expresses interest, and offer to book a consultation appointment for qualified leads. Keep responses concise and friendly.";

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } 

  let body;
  try {
    body = await request.json();
  } catch (e) {
    const detail = e?.message ?? String(e);
    console.error("JSON parse error:", detail);
    return new Response(JSON.stringify({ error: "Invalid JSON body", detail }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "messages array is required" }),
      {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Call Anthropic API
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      console.error("Anthropic API error:", anthropicResponse.status, errText);
      return new Response(
        JSON.stringify({
          error: "Anthropic API error",
          status: anthropicResponse.status,
          detail: errText,
        }),
        {
          status: 502,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    const anthropicData = await anthropicResponse.json();
    const assistantMessage = anthropicData.content?.[0]?.text ?? "";

    // Extract lead details from the full conversation (all messages + new assistant reply)
    const fullConversation = [
      ...messages,
      { role: "assistant", content: assistantMessage },
    ];
    const leadDetails = extractLeadDetails(fullConversation);

    if (leadDetails.email && leadDetails.name) {
      try {
        await syncHubSpotContact(env.HUBSPOT_ACCESS_TOKEN, leadDetails);
        if (isQualifiedLead(fullConversation)) {
          await createHubSpotAppointment(env.HUBSPOT_ACCESS_TOKEN, leadDetails);
        }
      } catch (hsErr) {
        // HubSpot errors are non-fatal ‚Äî log but don't break the response
        console.error("HubSpot error:", hsErr?.message ?? String(hsErr));
      }
    }

    return new Response(JSON.stringify({ response: assistantMessage }), {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });

  } catch (e) {
    const detail = e?.message ?? String(e);
    console.error("Unhandled error in onRequest:", detail);
    return new Response(
      JSON.stringify({ error: "Internal server error", detail }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }
}

// ---------------------------------------------------------------------------
// Lead extraction
// ---------------------------------------------------------------------------

/**
 * Scans the conversation for a name and email address.
 * Returns { name, email, institution } ‚Äî any field may be undefined.
 */
function extractLeadDetails(messages) {
  const fullText = messages
    .filter((m) => m.role === "user")
    .map((m) => (typeof m.content === "string" ? m.content : ""))
    .join("\n");

  const emailMatch = fullText.match(
    /\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/
  );

  // Simple heuristic: look for "I'm <Name>", "my name is <Name>", or "This is <Name>"
  const nameMatch = fullText.match(
    /(?:i(?:'m| am)|my name is|this is|name[:\s]+)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i
  );

  // Look for institution ‚Äî common patterns: "at <Uni>", "from <Uni>", "I work at <Uni>"
  const institutionMatch = fullText.match(
    /(?:at|from|with|for|represent(?:ing)?|work(?:ing)? at)\s+([A-Z][A-Za-z\s&']+(?:College|University|Institute|Academy|Education|School))/
  );

  return {
    name: nameMatch?.[1]?.trim(),
    email: emailMatch?.[0]?.toLowerCase(),
    institution: institutionMatch?.[1]?.trim(),
  };
}

/**
 * Checks whether the conversation suggests genuine interest (qualified lead).
 * Looks for intent signals beyond just providing contact details.
 */
function isQualifiedLead(messages) {
  const interestKeywords =
    /\b(interested|demo|trial|appointment|meeting|call|quote|pricing|proposal|sign[\s-]?up|book|schedule|consult)\b/i;

  return messages
    .filter((m) => m.role === "user")
    .some((m) =>
      interestKeywords.test(typeof m.content === "string" ? m.content : "")
    );
}

// ---------------------------------------------------------------------------
// HubSpot helpers
// ---------------------------------------------------------------------------

async function syncHubSpotContact(token, { name, email, institution }) {
  const [firstname, ...rest] = (name ?? "").split(" ");
  const lastname = rest.join(" ") || undefined;

  const properties = {
    email,
    ...(firstname && { firstname }),
    ...(lastname && { lastname }),
    ...(institution && { company: institution }),
    hs_lead_status: "NEW",
    lead_source: "Website Chatbot",
  };

  // Try to create; if contact already exists (409) update by email instead
  const createRes = await fetch(
    "https://api.hubapi.com/crm/v3/objects/contacts",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ properties }),
    }
  );

  if (createRes.status === 409) {
    // Contact exists ‚Äî patch by email
    await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ properties }),
      }
    );
  } else if (!createRes.ok) {
    const err = await createRes.text();
    console.error("HubSpot create contact error:", err);
  }
}

async function createHubSpotAppointment(token, { name, email }) {
  // Schedule the appointment 3 business days from now at 10:00 AEST (UTC+10)
  const appointmentDate = getAppointmentTimestamp();

  const engagementRes = await fetch(
    "https://api.hubapi.com/crm/v3/objects/meetings",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          hs_timestamp: String(appointmentDate),
          hs_meeting_title: `Ventra Coffee Consultation ‚Äî ${name ?? email}`,
          hs_meeting_body:
            "Consultation request via website chatbot. Prospect expressed interest in Ventra managed coffee service.",
          hs_internal_meeting_notes: `Lead source: Website Chatbot\nContact: ${name ?? ""} <${email}>`,
          hs_meeting_outcome: "SCHEDULED",
        },
      }),
    }
  );

  if (!engagementRes.ok) {
    const err = await engagementRes.text();
    console.error("HubSpot create meeting error:", err);
    return;
  }

  const meeting = await engagementRes.json();
  const meetingId = meeting.id;

  // Associate the meeting with the contact
  await fetch(
    `https://api.hubapi.com/crm/v3/objects/meetings/${meetingId}/associations/contacts/${encodeURIComponent(email)}/meeting_to_contact`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}

/** Returns a Unix timestamp (ms) for 10:00 AEST, ~3 business days from now. */
function getAppointmentTimestamp() {
  const now = new Date();
  let daysAdded = 0;
  const target = new Date(now);

  while (daysAdded < 3) {
    target.setDate(target.getDate() + 1);
    const day = target.getUTCDay();
    // Skip weekends (Saturday=6, Sunday=0)
    if (day !== 0 && day !== 6) daysAdded++;
  }

  // Set to 10:00 AEST = 00:00 UTC
  target.setUTCHours(0, 0, 0, 0);
  return target.getTime();
}
