/**
 * /api/contact — Cloudflare Pages Function handling the contact form.
 *
 * Flow: honeypot check → (optional) Turnstile verify → forward to HubSpot
 * Forms API → 303 redirect to /thank-you.
 *
 * Configuration (Pages → Settings → Environment variables):
 *   TURNSTILE_SECRET  — optional. If unset, Turnstile verification is
 *                       skipped (honeypot still enforced). Set it when the
 *                       Turnstile widget is enabled on /contact.
 *   HUBSPOT_PORTAL_ID — defaults to 442945735 (existing Ventra portal).
 *   HUBSPOT_FORM_GUID — defaults to the existing "Get a Quote" form.
 *                       TODO [HUBSPOT]: verify field mapping below matches
 *                       the form's fields in HubSpot (name/email/company/
 *                       jobtitle/message). Add a custom property for
 *                       campus_count if reporting on it matters.
 *
 * NOTE: This runs on Cloudflare Pages only. The Netlify staging mirror
 * serves static files and will 404 on POST /api/contact — test form
 * submission on a Cloudflare Pages preview deploy, not on Netlify.
 */

const DEFAULT_PORTAL = '442945735';
const DEFAULT_FORM = 'bf7f1301-db8d-4c1c-9710-d8d3b6ea26d8';

export async function onRequestPost(context) {
  const { request, env } = context;

  let form;
  try {
    form = await request.formData();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  // 1. Honeypot — the visually hidden "website" field must be empty.
  if ((form.get('website') || '').toString().trim() !== '') {
    // Pretend success so bots learn nothing.
    return Response.redirect(new URL('/thank-you', request.url), 303);
  }

  // 2. Turnstile — verified only when a secret is configured.
  if (env.TURNSTILE_SECRET) {
    const token = form.get('cf-turnstile-response');
    if (!token) return new Response('Verification required', { status: 403 });
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET,
        response: token,
        remoteip: request.headers.get('CF-Connecting-IP'),
      }),
    });
    const outcome = await verify.json();
    if (!outcome.success) return new Response('Verification failed', { status: 403 });
  }

  // 3. Minimal validation.
  const name = (form.get('name') || '').toString().trim();
  const email = (form.get('email') || '').toString().trim();
  const organisation = (form.get('organisation') || '').toString().trim();
  if (!name || !email.includes('@') || !organisation) {
    return new Response('Missing required fields', { status: 400 });
  }
  const [firstname, ...rest] = name.split(/\s+/);
  const lastname = rest.join(' ') || '—';

  // 4. Forward to HubSpot Forms API.
  const portalId = env.HUBSPOT_PORTAL_ID || DEFAULT_PORTAL;
  const formGuid = env.HUBSPOT_FORM_GUID || DEFAULT_FORM;
  const messageParts = [
    (form.get('message') || '').toString().trim(),
    `Enquiry type: ${form.get('enquiry') || 'discovery'}`,
    `Campus count: ${form.get('campus_count') || 'unspecified'}`,
    `Role: ${form.get('role') || 'unspecified'}`,
  ].filter(Boolean);

  const submission = {
    fields: [
      { name: 'firstname', value: firstname },
      { name: 'lastname', value: lastname },
      { name: 'email', value: email },
      { name: 'company', value: organisation },
      { name: 'message', value: messageParts.join('\n') },
    ],
    context: {
      pageUri: request.headers.get('Referer') || 'https://ventracoffee.com.au/contact',
      pageName: 'Contact — Book a discovery meeting',
    },
  };

  const hsRes = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    }
  );

  if (!hsRes.ok) {
    // Don't lose the lead silently — surface a retryable error to the user.
    return new Response(
      'Something went wrong sending your message. Please email info@ventracoffee.com.au directly.',
      { status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
  }

  return Response.redirect(new URL('/thank-you', request.url), 303);
}
