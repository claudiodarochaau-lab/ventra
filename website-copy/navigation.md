# VENTRA — Navigation Update Specification
> Deliverable: Navigation update to include Higher Education tab
> Brief date: April 2026
> Status: Ready for implementation

---

## CURRENT NAVIGATION (assumed)

Home · How It Works · Pricing · Contact

---

## UPDATED NAVIGATION

Home · How It Works · Pricing · Higher Education · Contact

---

## SPECIFICATION

**New nav item:**
- Label: `Higher Education`
- URL: `/higher-education`
- Position: Between "Pricing" and "Contact"
- Behaviour: Standard navigation link (no dropdown required)

**Mobile nav:**
- Same label and link
- Standard position in mobile menu stack: Home / How It Works / Pricing / Higher Education / Contact

**Active state:**
- Apply active/current styling when visitor is on `/higher-education`

**No other structural or layout changes are required.**

---

## FOOTER NAV UPDATE

Add "Higher Education" to the footer navigation links list:

`Home · How It Works · Pricing · Higher Education · Contact`

---

## INTERNAL LINK SUMMARY
> All internal links to /higher-education that should exist across the site:

| Location | Link text | Destination |
|---|---|---|
| Home — How It Works Step 5 callout | "Higher Education? See our campus model →" | /higher-education |
| Home — Sector Callout strip | "Higher Education →" | /higher-education |
| Pricing — tap-to-drink add-on callout | "See the campus model →" | /higher-education |
| Main navigation | "Higher Education" | /higher-education |
| Footer navigation | "Higher Education" | /higher-education |

---

## SITEMAP

Add `/higher-education` to sitemap.xml with:
- `<priority>0.8</priority>`
- `<changefreq>monthly</changefreq>`

---

*End of navigation specification.*
