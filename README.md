# District 11 by Al Marwan — Landing Page

Single-file, bilingual (EN / AR, RTL) lead-generation landing page in the District 11 brand:
full-screen scenes on the paper palette with black & white accents and solid black buttons (the floor plans and the payment plan keep the
terracotta of the D6 plans), the District 11 and Al Marwan logos, Radikal type.
Motion runs on GSAP + ScrollTrigger and Lenis smooth scrolling, inlined in the file (GSAP Standard License, Lenis MIT).

- `index.html` — the whole page (HTML + CSS + JS inline, no frameworks).
- `assets/images/` — every image the page uses (WebP only; nothing unused is kept).
- `assets/video/` — every video the page uses (H.264 MP4, no sound).
- `assets/fonts/` — Radikal (UltraThin, Thin, Light, Bold) as WOFF2, converted from the brand files. Arabic uses Noto Kufi Arabic from Google Fonts.

Open `index.html` directly, or host it together with the `assets/` folder.

## Media map
Upright screens (phones, tablets held upright) get the tall `-m` image and the vertical hero film; wider screens get the landscape files.
To swap a picture, replace the file with one of the same name and shape.

| Where | Wide screens | Upright screens |
| --- | --- | --- |
| Hero (video) | `video/hero-desktop.mp4` + `images/hero-desktop-poster.webp` | `video/hero-mobile.mp4` (1080×1920, 18 s loop) + `images/hero-mobile-poster.webp` |
| Story 01 · Arrival | `images/story-1-arrival.webp` | `images/story-1-arrival-m.webp` |
| Story 02 · Bus station | `images/story-2-promenade.webp` | `images/story-2-promenade-m.webp` |
| Story 03 · Daylight | `images/story-3-daylight.webp` | `images/story-3-daylight-m.webp` |
| Story 04 · Gardens | `images/story-4-workspace.webp` | `images/story-4-workspace-m.webp` |
| Story 05 · Lobbies | `images/story-5-lobby.webp` | `images/story-5-lobby-m.webp` |
| Sustainability | `images/green-pavilion-night.webp`, `video/green.mp4` + `images/green-video-poster.webp` | same |
| Concierge scene | `images/reception.webp` | `images/reception-m.webp` |
| Hotel-standards gallery (8 cards) | `images/interior-*.webp` + night shot `images/night-arcades.webp` (tall, used on every screen) | same |
| Aerial scene | `images/aerial.webp` | `images/aerial-m.webp` |
| Location map | `images/location-map.webp`, `images/location-map-sm.webp` | same |
| Final contact | `images/final-masterplan.webp` | `images/final-masterplan-m.webp` |
| Floor plans + 3D slabs | `images/d6-floor-01…09.webp`, `images/d6-slab-01…09.webp` | same |

## Go-live settings
Edit the `CONFIG` block near the top of the `<script>` in `index.html`:

| Key | What it does |
| --- | --- |
| `formEndpoint` | The Google Sheet web app URL that receives leads (see *Leads in Google Sheets* below). **Connected** to the District 11 leads sheet. If emptied, the page falls back to demo mode and leads are **not saved**. |
| `phone` / `phoneDisplay` | Click-to-call number and how it is shown. |
| `whatsapp` | WhatsApp number, digits only (e.g. `9715XXXXXXXX`). WhatsApp buttons stay hidden until this is set. |
| `email` | Contact email. |
| `metrikaId` | Yandex Metrika counter (`113254549`). The counter snippet sits at the top of `<head>`; the page also sends the goals `lead` (form submitted) and `contact_call` / `contact_whatsapp` / `contact_email`. Create matching JavaScript-event goals in Metrika to see them as conversions. |

Each lead includes name, phone (with country code), email, buyer type (end user / investor / broker), form,
context (e.g. `suite-605`), level viewed, selected suite, language, page URL and any UTM / gclid / fbclid values.
On phones and tablets a compact name + mobile form stays pinned to the bottom of the screen once the visitor scrolls past the hero (form `bar`); on large screens the same form docks on the right (form `dock`).
A `generate_lead` event is pushed to `dataLayer` (GTM) and fired to gtag, Meta Pixel, Snap, TikTok and Yandex Metrika if installed.

## Leads in Google Sheets
All five forms send each lead to a Google Sheet through a small Apps Script, `integrations/google-sheet/Code.gs`.
One-time setup (about 5 minutes, in the Google account that should own the leads):

1. Create a new Google Sheet, e.g. **District 11 leads**.
2. In the sheet: **Extensions › Apps Script**. Delete the sample code, paste the whole of `integrations/google-sheet/Code.gs`, and save.
   Optional: put the sales team's email addresses in `NOTIFY_EMAILS` (comma-separated) to get an email for every lead.
3. In the function menu next to **Run**, pick `testLead` and press **Run**. Approve the permissions (if Google says the app isn't verified,
   choose *Advanced › Go to project*: it is your own script). A **Leads** tab appears with one test row; delete that row.
4. **Deploy › New deployment** › type **Web app**. *Execute as:* **Me**. *Who has access:* **Anyone**. Press **Deploy** and copy the
   **Web app URL** (it ends in `/exec`). Opening it in a browser should say *District 11 lead endpoint is running.*
5. Put that URL in `formEndpoint` in the `CONFIG` block of `index.html` and publish the page.

Each row holds: time received (UAE), name, phone, email, buyer type, empty **Status** and **Notes** columns for the sales team,
the form used, context (e.g. `suite-605`), level viewed, suite, language, UTM / gclid / fbclid values, page and referrer.
To change the script later, edit it and use **Deploy › Manage deployments › Edit › New version**, which keeps the same URL.
A hidden trap field in every form filters out simple spam bots. Email alerts are limited by Google
(about 100 a day on a free Gmail account, 1,500 on Google Workspace); rows in the sheet have no such limit in practice.

## Floor plans
Levels 03, 08 and 09 are the supplied D6 plans. Levels 01, 02 and 04–07 were generated from the typical
level 08 layout with renumbered suites (`assets/images/d6-floor-0X.webp`) — replace them with the official plans
when available (same file names). Each floor has a tappable marker on its 13 suites; positions and views
are in the `POS` and `VIEW` objects in the script. Visitors change floors from the level list, the arrows on the plan,
a sideways swipe (touch, mouse drag or trackpad) or the left / right arrow keys; the enlarged plan has the same arrows.

Arabic version: add `?lang=ar` to the URL, or use the language toggle.

Colours: the accent colours are the variables at the top of the `<style>` (`:root`); the terracotta kept in the floor plans
and payment plan is the `.floors,#planBox,.pay` rule at the end of the `<style>`.
