# District 11 by Al Marwan — Landing Page

Single-file, bilingual (EN / AR, RTL) lead-generation landing page in the District 11 brand:
paper and terracotta palette from the D6 floor plans, the District 11 and Al Marwan logos, Radikal type.

- `index.html` — the whole page (HTML + CSS + JS inline, no frameworks).
- `assets/` — web-optimised media (H.264 daylight video loops, WebP images, D6 floor plans).
- `assets/fonts/` — drop the licensed Radikal `.woff2` files here (names in `assets/fonts/README.md`).

Open `index.html` directly, or host it together with the `assets/` folder.

## Go-live settings
Edit the `CONFIG` block near the top of the `<script>` in `index.html`:

| Key | What it does |
| --- | --- |
| `formEndpoint` | URL that receives leads (CRM webhook, Zapier, Make, HubSpot, Google Apps Script). Empty = demo mode (leads are only logged to the browser console). |
| `phone` / `phoneDisplay` | Click-to-call number and how it is shown. |
| `whatsapp` | WhatsApp number, digits only (e.g. `9715XXXXXXXX`). WhatsApp buttons stay hidden until this is set. |
| `email` | Contact email. |

Each lead includes name, phone (with country code), email, interest, form, context (e.g. `suite-905`),
floor plan viewed, selected suite, language, page URL and any UTM / gclid / fbclid values.
A `generate_lead` event is pushed to `dataLayer` (GTM) and fired to gtag, Meta Pixel, Snap and TikTok if installed.

## Floor plans
The D6 plans (levels 03, 08, 09) have a tappable marker on each of the 13 suites. Suite positions and
views are in the `SUITES` and `VIEW` objects in the script; add more floors there.

Arabic version: add `?lang=ar` to the URL, or use the language toggle.
