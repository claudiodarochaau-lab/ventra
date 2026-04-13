# Ventra Marketing Agent Team
# Setup Guide & Operating Manual

---

## What This Is

A team of 7 AI marketing specialists built in Claude Code, designed to operate like a high-performing B2B marketing team for Ventra. You direct the Head of Marketing with weekly priorities; they plan and execute across the specialist team.

---

## The Team

| Agent | Skill File | What They Do |
|-------|-----------|-------------|
| Head of Marketing | skills/head-of-marketing/SKILL.md | Receives your weekly brief, plans the sprint, orchestrates the team |
| SEO & AEO Specialist | skills/seo-aeo-specialist/SKILL.md | Organic search rankings + AI answer engine visibility |
| Product Marketing Manager | skills/product-marketing/SKILL.md | Positioning, messaging, launch strategy, battlecards |
| Copywriting & Content Lead | skills/copywriting-content/SKILL.md | Blog, email, social, sales copy, thought leadership |
| B2B Sales Strategist | skills/b2b-sales-strategist/SKILL.md | Outbound sequences, sales enablement, ABM, pipeline strategy |
| CRO Specialist | skills/cro-specialist/SKILL.md | Conversion optimisation across all funnel stages |
| HubSpot CRM Magician | skills/hubspot-crm/SKILL.md | HubSpot setup, automation, sequences, reporting |

---

## How to Use It Each Week

### Step 1 — Update CLAUDE.md if anything has changed
- New supplier confirmed? Add it.
- Pricing locked? Update the pricing table.
- New ICP insight? Add it to the ICP section.
- This takes 2–5 minutes and keeps every agent current.

### Step 2 — Fill in your weekly brief
- Copy `weekly-briefs/TEMPLATE-weekly-brief.md`
- Rename it `weekly-briefs/week-of-YYYY-MM-DD.md`
- Write your priorities in plain language — rough is fine

### Step 3 — Open Claude Code and start
Open the `ventra-marketing/` folder and use one of these prompts:

**For planning only:**
> "Read my weekly brief in weekly-briefs/week-of-[DATE].md and act as Head of Marketing. Build the full sprint plan."

**For planning + immediate execution:**
> "Read my weekly brief in weekly-briefs/week-of-[DATE].md, act as Head of Marketing, build the sprint plan, then execute the highest priority task end-to-end."

**For a specific task:**
> "Act as [Agent Name] and [specific task]. Reference CLAUDE.md for Ventra context."

---

## Keeping Knowledge Current

**Update frequency guide:**

| What changed | Where to update | How often |
|-------------|----------------|-----------|
| New supplier confirmed | CLAUDE.md — Products section | As it happens |
| Pricing locked | CLAUDE.md — Pricing table | As it happens |
| ICP validated / refined | CLAUDE.md — ICP section | Weekly or as learned |
| New competitor intel | CLAUDE.md — Competitors section | As discovered |
| Brand voice refined | CLAUDE.md — Brand Voice + copywriting/SKILL.md | When positioning evolves |
| New HubSpot property added | hubspot-crm/SKILL.md — Setup Priorities | When CRM changes |
| Outbound sequence learning | b2b-sales-strategist/SKILL.md | Monthly or after each test |

**The rule:** CLAUDE.md is the single source of truth for business facts. Individual SKILL.md files contain how the agent works. Don't scatter Ventra facts across skill files — that creates contradictions when things change.

---

## Connecting to the Ventra Claude Project

Your full Ventra project history, research, and artifacts live at:
https://claude.ai/project/019cc676-f827-7020-8235-44162a71d1d0

**To bring knowledge from there into here:**
1. Open the Ventra project on claude.ai
2. Find the relevant artifact or chat output
3. Copy the key content into the appropriate section of CLAUDE.md
4. This bridges the project intelligence into the agent system

Over time, CLAUDE.md will become a curated distillation of the most important things from your project — exactly what the agents need, without needing to read everything.

---

## File Structure

```
ventra-marketing/
├── CLAUDE.md                          ← Master business context (update here first)
├── README.md                          ← This file
├── skills/
│   ├── head-of-marketing/
│   │   └── SKILL.md
│   ├── seo-aeo-specialist/
│   │   └── SKILL.md
│   ├── product-marketing/
│   │   └── SKILL.md
│   ├── copywriting-content/
│   │   └── SKILL.md
│   ├── b2b-sales-strategist/
│   │   └── SKILL.md
│   ├── cro-specialist/
│   │   └── SKILL.md
│   └── hubspot-crm/
│       └── SKILL.md
└── weekly-briefs/
    ├── TEMPLATE-weekly-brief.md
    └── [week-of-DATE.md files go here]
```

---

## First Session Checklist

Before your first working session, do these three things:

- [ ] Fill in the ⚠️ PROVISIONAL sections of CLAUDE.md with what you know now
- [ ] Add key artifacts from your Ventra claude.ai project into relevant CLAUDE.md sections
- [ ] Run your first session with: *"Act as Head of Marketing and review CLAUDE.md. Tell me what's missing or unclear that would affect your ability to produce high-quality marketing output."* — this gives you a gap analysis before you start executing.
