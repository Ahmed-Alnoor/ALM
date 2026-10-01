# District 11 by Al Marwan — Landing Page

Single-file, bilingual (EN / AR, RTL) lead-generation landing page in the District 11 brand:
full-screen scenes on the paper palette, terracotta gradients, the District 11 and Al Marwan logos, Radikal type.
Motion runs on GSAP + ScrollTrigger and Lenis smooth scrolling, inlined in the file (GSAP Standard License, Lenis MIT).

- `index.html` — the whole page (HTML + CSS + JS inline, no frameworks).
- `assets/` — web-optimised media (full-screen daylight hero video, full-page images, D6 floor plans 01–09 and their 3D slab textures).
- `assets/fonts/` — Radikal (UltraThin, Thin, Light, Bold) as WOFF2, converted from the brand files. Arabic uses Noto Kufi Arabic from Google Fonts.

Open `index.html` directly, or host it together with the `assets/` folder.

## Go-live settings
Edit the `CONFIG` block near the top of the `<script>` in `index.html`:

| Key | What it does |
| --- | --- |
| `formEndpoint` | URL that receives leads (CRM webhook, Zapier, Make, HubSpot, Google Apps Script). Empty = demo mode (leads are only logged to the browser console). |
| `phone` / `phoneDisplay` | Click-to-call number and how it is shown. |
| `whatsapp` | WhatsApp number, digits only (e.g. `9715XXXXXXXX`). WhatsApp buttons stay hidden until this is set. |
| `email` | Contact email. |
| `metrikaId` | Yandex Metrika counter (`113254549`). The counter snippet sits at the top of `<head>`; the page also sends the goals `lead` (form submitted) and `contact_call` / `contact_whatsapp` / `contact_email`. Create matching JavaScript-event goals in Metrika to see them as conversions. |

Each lead includes name, phone (with country code), email, buyer type (end user / investor / broker), form,
context (e.g. `suite-605`), level viewed, selected suite, language, page URL and any UTM / gclid / fbclid values.
A `generate_lead` event is pushed to `dataLayer` (GTM) and fired to gtag, Meta Pixel, Snap, TikTok and Yandex Metrika if installed.

## Floor plans
Levels 03, 08 and 09 are the supplied D6 plans. Levels 01, 02 and 04–07 were generated from the typical
level 08 layout with renumbered suites (`assets/d6-floor-0X.webp`) — replace them with the official plans
when available (same file names). Each floor has a tappable marker on its 13 suites; positions and views
are in the `POS` and `VIEW` objects in the script. Visitors change floors from the level list, the arrows on the plan,
a sideways swipe (touch, mouse drag or trackpad) or the left / right arrow keys; the enlarged plan has the same arrows.

Arabic version: add `?lang=ar` to the URL, or use the language toggle.
