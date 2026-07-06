# CLAUDE.md — Ventra Coffee

Last updated: 6 July 2026 (v2 — reconciled against financial model v7.3.1.2)

## Who I am

Claudio, Founder & CEO of Ventra Coffee, trading under Da Rocha Holdings Pty Ltd (ABN 68 383 577 439 — ABN belongs to the trust, not the company). Solo founder; my partner is co-director. ~15 years in Australian international education (Study Group, Navitas, Study Perth, AIH — most recently senior leadership at AIH covering brand/marketing, student experience, employee experience). Based in Sutherland, Sydney. AI is my primary production resource across legal, financial, operational, and marketing workstreams.

## What Ventra is

Fully managed B2B coffee service targeting the Australian higher education sector. Premium, bespoke-per-client model: equipment, beans, service — one partner, no downtime. All financial modelling is modular (FPOS on/off, machine count variable). Target GM: 40–50% on bundle deals. Hard floor: 35% GM.

Beachhead strategy leverages my higher-ed network and sector expertise. Public launch moment: AIEC 2026 (27–30 October, Sydney).

## Product and model reference (confirmed)

- **Machines:** Franke only, via CWE. A300 for ≤100 cups/day; A600 for >100 cups/day. No staff/student machine split.
- **Roasting partner:** P&R (Pablo & Rusty's), Porter Street blend at $28/kg, dial-in free. Bean dose: **20g** (confirmed in model v7.3.1.2 — supersedes earlier 23g figure).
- **Milk:** **180ml/drink incl spillage** (confirmed v7.3.1.2 — supersedes 190ml). Woolies for Business 3L: Sydney $5.45 incl delivery allocation, Melbourne $5.75. 80% milk:black split assumption. Milk alternatives sourcing in progress.
- **Consumables:** Cups, lids, stirrers via Food Packaging Online (FPO).
- **Equipment pricing (confirmed, per v7.3.1.2):** Franke A300 MS EC W4 plumbed at $7,725 (25% off RRP $10,300, Jan 2026 list — bundle deal contingent on 3-unit simultaneous PO: 2× CSU + 1 demo; net $515/unit below standing wholesale $8,240). SKU still to be reconfirmed in writing by CWE. Milk fridge $700 (±10%). Delivery: Sydney Metro $600; Melbourne $600 + $95 ex-GST surcharge (confirmed in writing). Commissioning $360/site, installation $480/site. BRITA plumbed filtration kit $400.08/site (head $69.60 + C300 $206.40 + fittings $98.80). Franke telemetry modem $400/unit (capitalised with machine). Software licence $100/unit, 5-year term, amortised $20/unit/year. Total upfront cash per site: Sydney $10,665.08, Melbourne $10,760.08.

## CSU pilot (August 2026 target)

- **Deal structure:** 1-year initial term with mutual intent to negotiate 2-year extension (shorter term reduces CSU internal approval burden — per Andrew Knight). $1,300/month base fee per site + $0.75/cup consumption fee billed to CSU. **Year 1 is CSU-funded free access — all cups billed to CSU, students pay nothing, no payment terminal.** Nayax FPOS **deferred to Year 2** (saves $500 capex + $240/yr platform fee per site vs FPOS model).
- **Sites:** One Franke A300 per campus — Sydney North + Melbourne CBD. Both plumbed (Sydney plumbed access confirmed by Andrew via WhatsApp, overriding earlier tank-fill site survey).
- **Volume assumptions (v7.3.1.2):** Sydney 80 cups/day (80% of 100 capacity), Melbourne 40 cups/day. Annual: 15,760 Syd + 8,160 Mel = 23,920 combined (38 teaching weeks + staff consumption in 14 non-teaching weeks: 10 staff × 4 coffees/week per site).
- **Volume economics — DECIDED 6 July 2026:** Variable cost per cup (~$0.97 Syd) exceeds the $0.75 consumption fee, so margin erodes as volume rises above forecast; the base fee carries the deal. Bounded exposure: worst case roughly −$1,700 to −$2,700/yr combined against $15.3k Y1 net contribution. **Decision: wear it for this deal at the agreed $0.75; restructure pricing for deal #2** (see ICP pricing guardrails). Mitigation: monthly telemetry volume-vs-forecast reporting to Andrew from day one — protects CSU budget surprise risk (Melbourne demand doubling would near-double CSU's consumption bill) and the renewal/case-study value.
- **Model headline (v7.3.1.2):** Y1 combined GM 46.1% (Syd 39.0%, Mel 55.0% — both pass 35% floor). Y1 net contribution $15,336; Y2+ $19,111. Payback 15.9 months from contract start. 3-year cumulative net contribution $53,557. Milk-mix sensitivity: floor unbreachable by mix variation alone (breakeven milk % >100%).
- **Academic calendar:** 38 teaching weeks, 14 staff/break weeks per 52-week year. Standalone HTML cost calculator built and calibrated to Andrew's confirmed calendar.
- **Status:** CEO approval pending internally at CSU (Andrew Knight managing).

## Workstream status

### Legal (MSA)
- Original MSA built from an outdated Apex Coffee template, then rebuilt twice. Current version: FPOS/Nayax provisions removed where not applicable, 30-day invoice/EFT terms (replacing direct debit), reporting obligations added, narrowed trademark licence, No Franchise sub-clause, Non-Solicitation and Non-Circumvention clause.
- Solicitor: Harris Jones (replaced Lisa — terminated for unresponsiveness). **Redline due 17 July.**
- **Franchising Code risk:** open question whether the broader Ventra rollout model triggers the Franchising Code of Conduct. Material business-model issue — must be resolved before AIEC. Franchise specialist lawyer already engaged if triggered.

### Financial model (Ventra_CSU_v7_3_1_2.xlsx — current version)
- Near-final. Payback 15.9 months. Built/edited with openpyxl. Eight sheets: Assumptions, Sydney P&L, Melbourne P&L, Blended Summary, CSU Billing Schedule, Consolidated P&L, Ordering & MOQ, Mix Sensitivity.
- Plumbed machine SKU and BRITA plumbed-config pricing now IN the model (previously flagged as pending) — written reconfirmation from CWE still outstanding.
- **Sole unresolved costing input:** hot chocolate dosage/cost from P&R — $0.02/cup placeholder; follow up Wed 8 July if no response.
- **Known fixes pending:** (1) stale narrative note in Consolidated P&L depreciation line cites "$8,240 + $700" — calculated value $1,765/yr is correct ($7,725 + $700 fridge + $400 modem ÷ 5), only the note text is wrong; (2) no Volume Sensitivity sheet — mix sensitivity is near-irrelevant, volume is the risk that matters under current pricing (see CSU volume economics above).

### Insurance
- Youi: confirmed structurally unable to cover equipment at third-party premises. Dead.
- EBM and Upcover: live tracks. **Hard decision point 10 July** on escalating to a third broker. Two binary checks: (1) explicit written cover for unattended equipment at third-party premises, (2) credible bind-by-August timeline.

### Payments
- Amex Business application declined (pre-revenue). Recommended card was Amex Business Gold Plus (200k MR bonus, AccessLine, Qantas/Velocity transfer flexibility) via the Trust structure.
- Bridge: co-director's personal Amex Velocity Platinum for equipment purchases.
- Pay.com.au tested at 1.98% actual fee (1.8% + GST). **Open:** GST treatment (input tax credit vs. deductible) — confirm with Yvette.

### Tax / FY27 strategy
- Instant Asset Write-off applicable pending Yvette's confirmation of threshold eligibility.
- Equipment purchases deliberately delayed to post-1 July 2026 to align deductions with first revenue year.

### AIEC 2026 (27–30 Oct, Sydney)
- 3×2m corner shell-scheme booth confirmed. **Open:** exhibition stand and furniture order.
- Stand design iterated in Canva. Locked copy — back wall: "Coffee, fully managed." Side panel: "Equipment. Beans. Service. One partner, no downtime."
- Franke and P&R logos confirmed for stand, pending P&R clause 4.6 written brand-use approval. CSU/Navitas logos deferred pending written sign-off.
- Full B2B launch campaign playbook: four phases (Ignite, Build, Converge, Harvest), July–mid-November 2026. Targets: 9–15 pre-booked AIEC meetings, 5 SQL follow-up meetings, 3 signed clients by 31 December 2026.

## Supplier and stakeholder map

| Contact | Org | Role / notes |
|---|---|---|
| Michele | CWE | Equipment. 25% discount on 3-unit PO confirmed; modem/software pricing and applicable discounts still to be confirmed in writing. |
| Richard | P&R | Consumables/beans. Clause 4.1 is an active pricing-adjustment mechanism tied to 20kg/week MOQ (not merely a termination reference, contra Richard's characterisation). Negotiating position: 40kg/month rolling 3-month average. Clause 4.6 requires prior written approval for brand use. |
| Andrew Knight | CSU | Client contact; managing internal CEO approval. |
| Yvette | — | Accountant/bookkeeper. Open items: pay.com.au GST treatment, IAWO threshold eligibility. |
| Lily | Franke Oceania | Marketing; AIEC co-branding discussions. |
| Harris Jones | — | Solicitor. MSA redline due 17 July. |

Supplier decisions already made: Danes assessed and rejected (fails 35% GM floor at Sydney site level). Milk keg alternatives explored (The Udder Way, Food and Dairy Co) after early distributor issues — Woolies for Business is current supply.

## Tech infrastructure

- **Ventra CRM:** standalone Express + Vite React project, SQLite (better-sqlite3). Data hierarchy: Groups → Organisations → Sites. Six pipeline stages. Built via a seven-prompt build sequence.
- **AI chatbot:** Cloudflare Worker deployed as Pages Function, integrated with Anthropic API and HubSpot CRM.
- **Marketing site:** ventracoffee.com.au on Cloudflare Pages, GitHub source repo. Staging: ventra-staging.netlify.app watching the staging branch.
- **Marketing system:** seven-agent Claude Code marketing setup (early build).

## Open items (priority order)

1. Insurance shootout decision — **10 July** (EBM vs Upcover vs escalate to third broker; two binary checks: written cover for unattended equipment at third-party premises + credible bind-by-August timeline).
2. MSA redline from Harris Jones — **17 July**.
3. Hot chocolate dosage/cost from P&R — **chase Wed 8 July** — last costing input for v7.3.1.2.
4. Franchising Code risk clarification with Harris Jones — before AIEC.
5. Pay.com.au fee GST treatment — Yvette.
6. CWE written confirmation: plumbed A300 MS EC W4 SKU, BRITA plumbed pricing, modem/software discount applicability.
7. Model housekeeping: fix stale depreciation note; add Volume Sensitivity sheet.
8. Set up monthly telemetry volume-vs-forecast report to Andrew (contract mitigation — do before launch).
9. AIEC stand and furniture order.
10. P&R clause 4.6 written brand-use approval (stand logos).
11. CSU CEO approval — monitor via Andrew Knight.

## Sector context

Market intelligence scan completed on Australian private higher education and the onshore agent commission ban (effective March 2026) — structurally relevant to client-base economics and sales narrative.
