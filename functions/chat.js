const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://ventracoffee.com.au",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const SYSTEM_PROMPT = `You are a helpful customer service assistant for Ventra Coffee, a managed coffee service built for Australian higher education — two machines, one invoice, fully managed. You serve Sydney and Melbourne.

Your goals are:
1. Answer FAQs about the Ventra Coffee service
2. Capture lead details (name, email, institution) when someone expresses interest
3. Offer to book a consultation appointment for qualified leads

Keep responses concise and friendly. When someone seems interested, naturally ask for their name, email and institution name so we can follow up.`;

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

  try {
    const body = await request.json();
    const messages = body.messages || [];

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
        messages: messages,
      }),
    });

    if (!anthropicResponse.ok) {
      const errorData = await anthropicResponse.json();
      return new Response(JSON.stringify({ error: "Anthropic API error", details: errorData }), {
        status: anthropicResponse.status,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const anthropicData = await anthropicResponse.json();
    const assistantMessage = anthropicData.content[0].text;

    // Extract lead details from conversation
    const leadDetails = extractLeadDetails(messages);

    // Sync to HubSpot if we have enough lead info
    if (leadDetails.email && leadDetails.name) {
      try {
        const contactId = await syncHubSpotContact(leadDetails, env);
        if (contactId && isQualifiedLead(messages)) {
          await createHubSpotAppointment(contactId, leadDetails, env);
        }
      } catch (hubspotError) {
        console.error("HubSpot sync error (non-fatal):", hubspotError.message);
      }
    }

    return new Response(JSON.stringify({ response: assistantMessage }), {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
}

function extractLeadDetails(messages) {
  const fullText = messages
    .filter(m => m.role === "user")
    .map(m => m.content)
    .join(" ");

  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const nameMatch = fullText.match(/(?:I'm|I am|my name is|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  const institutionMatch = fullText.match(/([A-Z][a-zA-Z\s]+(?:University|College|Institute|School|TAFE|Academy))/);

  return {
    email: emailMatch ? emailMatch[0] : null,
    name: nameMatch ? nameMatch[1] : null,
    institution: institutionMatch ? institutionMatch[1] : null,
  };
}

function isQualifiedLead(messages) {
  const fullText = messages
    .filter(m => m.role === "user")
    .map(m => m.content)
    .join(" ")
    .toLowerCase();

  const intentKeywords = ["interested", "demo", "trial", "appointment", "pricing", "proposal", "book", "meeting", "quote", "cost", "how much"];
  return intentKeywords.some(keyword => fullText.includes(keyword));
}

async function syncHubSpotContact(leadDetails, env) {
  const properties = {
    email: leadDetails.email,
    firstname: leadDetails.name.split(" ")[0],
    lastname: leadDetails.name.split(" ").slice(1).join(" ") || "",
    hs_lead_status: "NEW",
    leadsource: "Website Chatbot",
  };

  if (leadDetails.institution) {
    properties.company = leadDetails.institution;
  }

  // Try to create contact
  const createResponse = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.HUBSPOT_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ properties }),
  });

  if (createResponse.ok) {
    const data = await createResponse.json();
    return data.id;
  }

  // If 409 conflict (already exists), patch by email
  if (createResponse.status === 409) {
    const searchResponse = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${leadDetails.email}?idProperty=email`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.HUBSPOT_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({ properties }),
      }
    );
    if (searchResponse.ok) {
      const data = await searchResponse.json();
      return data.id;
    }
  }

  return null;
}

async function createHubSpotAppointment(contactId, leadDetails, env) {
  const appointmentTime = getAppointmentTimestamp();

  const meetingResponse = await fetch("https://api.hubapi.com/crm/v3/objects/meetings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.HUBSPOT_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      properties: {
        hs_timestamp: appointmentTime,
        hs_meeting_title: `Ventra Coffee Consultation — ${leadDetails.name}`,
        hs_meeting_body: `Lead captured via website chatbot. Institution: ${leadDetails.institution || "Not provided"}`,
        hs_internal_meeting_notes: "Auto-booked via chatbot",
        hs_meeting_start_time: appointmentTime,
        hs_meeting_end_time: appointmentTime + 30 * 60 * 1000,
      },
    }),
  });

  if (meetingResponse.ok) {
    const meeting = await meetingResponse.json();

    // Associate meeting with contact
    await fetch(
      `https://api.hubapi.com/crm/v3/objects/meetings/${meeting.id}/associations/contacts/${contactId}/meeting_event_to_contact`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${env.HUBSPOT_ACCESS_TOKEN}`,
        },
      }
    );
  }
}

function getAppointmentTimestamp() {
  const now = new Date();
  let daysAdded = 0;
  while (daysAdded < 3) {
    now.setDate(now.getDate() + 1);
    const day = now.getDay();
    if (day !== 0 && day !== 6) daysAdded++;
  }
  now.setHours(10, 0, 0, 0);
  return now.getTime();
}
