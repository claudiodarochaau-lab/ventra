# Ventra — Website Shot List

For a half-day commissioned shoot (or curation from the equipment supplier's
press kit — **usage rights to be confirmed in writing before any press-kit
image ships**). Every image follows BRAND.md photography direction:

- **Monochrome first.** All primary imagery ships black and white. Shoot in
  colour, convert in post — keep RAWs.
- **Precision framing.** Tight, considered crops. Machine details, hands with
  cups, steam, interfaces. Environment over people; people as context, never
  subjects. No grinning faces, no barista culture, no coffee bags, no latte art.
- **No visible third-party logos** (machine badges, roaster branding) until
  written brand-use approvals land. Frame around them or retouch.

## The shots

| # | Shot | Fills slot | Aspect | Framing notes |
|---|------|-----------|--------|---------------|
| 1 | **Machine detail, macro** | Future home-hero background option | 16:9 | Clinical close-up of the group/dispense area mid-pour, steam visible, hard side light. Shallow depth. The "engineering authority" hero shot. |
| 2 | **Campus corridor, wide** | Home → sector credibility (`img-slot--4x3`, currently AI placeholder) | 4:3 | Machine stationed in a real campus corridor or atrium edge. Long perspective lines, one or two people soft-blurred in motion. Ordered, calm. |
| 3 | **Student space in use** | Higher-ed → calendar section (`img-slot--4x3`, currently AI placeholder) | 4:3 | Machine in a student common room or library entrance. Hands collecting a finished cup; no faces in focus. Natural daylight. |
| 4 | **The cup moment** | CTA band background option; social | 16:9 | Single finished flat white on a clean surface beside the machine, steam rising. Nothing else in frame. |
| 5 | **Founder portrait, environmental** | About → founder slot (`img-slot--3x4`, currently empty placeholder) | 3:4 | Claudio beside an installed machine or on campus. Not a corporate headshot: working context, direct gaze, monochrome. This is the site's only person-as-subject image. |
| 6 | **Hands at work: one-button clean** | How-it-works → step 04 support; social | 4:3 | A hand pressing the machine's cleaning control. Ties directly to the "coffee champion, one button daily" copy. |
| 7 | **Staff room context** | Higher-ed → staff experience card background option | 4:3 | Machine in a staff kitchen/common room, mugs nearby, ordered and real. No staged people. |
| 8 | **Telemetry/reporting** | How-it-works → telemetry row; LinkedIn | 16:9 | Laptop or phone showing a volume chart beside the machine (screen content can be our own reporting UI mock — nothing fabricated presented as client data). |
| 9 | **Install in progress** | How-it-works → step 02 support | 4:3 | Technician's hands connecting filtration or levelling the machine. Craft and precision, not hi-vis chaos. |
| 10 | **Detail set: texture** | Trace-adjacent accents, OG/social variety | 1:1 | 3–4 macro details: beans in the hopper, water line, drip tray steel, cup stack. Shot as a consistent series, same light. |

## Delivery pipeline (for whoever processes the shoot)

1. Export each selected frame as AVIF + WebP + JPEG fallback at 1600w and 800w.
2. Convert to monochrome in post (do not shoot B&W); keep a consistent curve
   across the whole set.
3. Drop files into `assets/images/`, replace the `img-slot` placeholder or
   temporary AI-generated image, and update the `<picture>` sources (AVIF
   first, then WebP). Each slot's `<img>` keeps `loading="lazy"`, real
   `width`/`height`, and descriptive alt text.
4. Regenerate the LQIP background for each slot: `sips -s format jpeg -Z 24
   <image> --out lqip.jpg`, base64-encode, inline as the slot's
   `background-image`.
5. The AI-generated Gemini images currently in `assets/images/` are interim
   only — every one of them is replaced by this list.
