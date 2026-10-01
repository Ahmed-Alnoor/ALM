# District 11 by Al Marwan — Landing Page

Single-file, bilingual (EN / AR, RTL) lead-generation landing page.

- `index.html` — the whole page (HTML + CSS + JS inline, no frameworks).
- `assets/` — web-optimised media (H.264 video loops, WebP images) referenced by the page.

Open `index.html` directly, or host the file together with the `assets/` folder.

## Go-live settings
Edit the `CONFIG` block near the top of the `<script>` in `index.html`:

| Key | What it does |
| --- | --- |
| `formEndpoint` | URL that receives leads (CRM webhook, Zapier, Make, HubSpot, Google Apps Script). Empty = demo mode (leads are only logged to the browser console). |
| `phone` / `phoneDisplay` | Click-to-call number and how it is shown. |
| `whatsapp` | WhatsApp number, digits only (e.g. `9715XXXXXXXX`). WhatsApp buttons stay hidden until this is set. |
| `email` | Contact email. |

Each lead includes name, phone (with country code), email, interest, form/context, language, page URL and any UTM / gclid / fbclid values.
A `generate_lead` event is pushed to `dataLayer` (GTM) and fired to gtag, Meta Pixel, Snap and TikTok if they are installed.

Arabic version: add `?lang=ar` to the URL (useful for Arabic ad campaigns), or use the language toggle.
