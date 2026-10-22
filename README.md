# PHILINFO GLOBAL LIMITED — Recruitment Agency Website

*Crossing Borders to Deliver Excellence*

A responsive, multi-page recruitment agency website made of **plain HTML, CSS and JavaScript**.
No Python, no build step, no preprocessors, no dependencies to install.

**To view it:** double-click `index.html`. To publish it: upload the folder to any host
(cPanel/FTP, Netlify drag-and-drop, GitHub Pages, S3). It is already a finished static site.

---

## 1. Company details baked into the site

| Item | Value |
| --- | --- |
| Name | PHILINFO GLOBAL LIMITED |
| Motto | Crossing Borders to Deliver Excellence |
| Phone | +254 724 475 843 (also `tel:+254724475843` links, WhatsApp `wa.me/254724475843`) |
| Email | philinfogloball@gmail.com |
| HQ | Veew Plaza, 2nd Floor Room 201, River Road, Nairobi |
| Mombasa | Apollo Niva, Door 3, near Sacred Heart High School, Archbishop Makarios Rd |
| Eldoret | Komora Centre Building, Main Stage, 3rd Floor, Room 301 |
| Founded | 2011 · licensed by the National Employment Authority (NEA) |
| Countries | Saudi Arabia, Dubai, Oman, Qatar, Kuwait, Bahrain, Europe |

To change any of these, use **Replace in Files** (`Ctrl/Cmd + Shift + H` in VS Code) across all
`.html` files — e.g. search `+254 724 475 843`, `tel:+254724475843`, `philinfogloball@gmail.com`.

---

## 2. Pages

| Page | File | Notes |
| --- | --- | --- |
| Home | `index.html` | light theme · vacancy **poster carousel**, current vacancies, services, sectors |
| Job Seekers | `job-seekers.html` | **all seven job posters** with full requirements, benefits and salaries (incl. Dubai security guards and Dubai construction trades) |
| Services | `services.html` | sidebar + eleven service cards (incl. **Visitors Visa Processing**) + clientele sectors |
| Employers | `employers.html` | **employer/partner landing page + partnership application form** — why hire us, process, roles, commercial terms |
| Contact Us | `contact.html` | form, contact details, three offices, Google map |
| Login | `login.html` | UI only — connect to your auth service |
| Application Form | `apply.html` | real vacancy/destination dropdowns, CV upload, consent |
| Company Overview | `company-overview.html` | mission, vision, services, countries, offices |
| Local Recruitment | `local-recruitment.html` | Kenya-based placements |
| Foreign Recruitment | `foreign-recruitment.html` | Gulf/Europe process, documents, expectations |
| Our Team | `our-team.html` | staff **photos** + names + roles: Phillis Cuani (Director), Cereste Muriithi (Operations, HQ), Regina Muriithi (Accounts/Reception), Garshon Maalim (IT), Joshua (Asst. IT), Raymond Edgar (Branch Manager, Mombasa), Mary Mbugua (Branch Manager, Eldoret) |
| Our Partners | `our-partners.html` | **named partners with since-dates and website links** + NEA/NEAIMS regulator cards + "become a partner" CTA |
| Gallery | `gallery.html` | vacancy posters + **real photo galleries** (office briefings, departure day) — click any tile for the **lightbox** (←/→, Esc) |
| About Us | `about.html` | **full company profile** — story, mission, vision, how we acquire talent, the four advantages, countries, clientele sectors, offices |
| FAQs | `faqs.html` | candidate + employer questions |
| Privacy Policy | `privacy-policy.html` | data handling, NEA reference |

---

## 3. Logo, posters and photos

### Logo (extracted from your supplied file, background removed)

| File | Use |
| --- | --- |
| `assets/img/logo-mark.png` | circular **PGL** mark, transparent — header, footer, login, favicon |
| `assets/img/logo-wordmark.png` | "PHILINFO GLOBAL LIMITED" + motto, transparent |
| `assets/img/favicon.png`, `apple-touch-icon.png` | browser/tab icons |

The header and footer build the full lockup in HTML (mark + wordmark text + gold motto) so it stays
crisp at any size and works on both the light and dark page themes. If you prefer a single flat
image, replace the `<span class="brand-mark-wrap">…</span><span class="brand-text">…</span>` block
in any header with `<img src="assets/img/logo-full.png">` — re-export a full-colour PNG first if you
delete anything.

### Job posters (the five supplied flyers)

| File | Vacancy |
| --- | --- |
| `assets/img/jobs/saudi-baristas.jpg` | Baristas 1,500 SAR · Barista Assistants 1,200 SAR — Saudi Arabia |
| `assets/img/jobs/saudi-nannies.jpg` | Nannies 1,000 SAR — Saudi Arabia |
| `assets/img/jobs/qatar-hiring.jpg` | Housemaids / Lady Drivers / Lady Baristas — Qatar |
| `assets/img/jobs/saudi-cleaners-mass.jpg` | House-to-house Cleaners 850 SAR — Saudi Arabia |
| `assets/img/jobs/saudi-cleaners-urgent.jpg` | Female Cleaners 1,200 SAR (urgent) — Saudi Arabia |
| `assets/img/jobs/dubai-security-guards.jpg` | Security Guards — Dubai (12h duty, 26 days, free accommodation) |
| `assets/img/jobs/dubai-construction.jpg` | Scaffolders / Masons / Carpenters / Helpers — Dubai (1,200 AED + OT) |

They appear in four places: the **home carousel** (7 slides), the **Current Vacancies** grid, the
**Job Seekers** page and the **Gallery**. Everything else on those cards (salary, requirements, benefits) is HTML text
copied from the flyers, so it is searchable by Google and readable by screen readers.

**Adding a new vacancy** — copy one `<article id="…">` block in `job-seekers.html`, drop the new
poster into `assets/img/jobs/`, then optionally add a card to the home page and an entry to
`JOB_PREFILL` in `assets/js/site.js` so `apply.html?job=your-key` preselects it.

### Team photos

| File | Person |
| --- | --- |
| `assets/img/team/phillis-cuani.jpg` | Phillis Cuani — Company Director (at her desk) |
| `assets/img/team/cereste-muriithi.jpg` | Cereste Muriithi — Operations Manager, HQ |
| `assets/img/team/regina-muriithi.jpg` | Regina Muriithi — Accountant / Reception |
| `assets/img/team/garshon-maalim.jpg` | Garshon Maalim — IT Administrator |
| `assets/img/team/joshua.jpg` | Joshua — Assistant IT Administrator |
| `assets/img/team/raymond-edgar.jpg` | Raymond Edgar — Branch Manager, Mombasa |
| `assets/img/team/mary-mbugua.jpg` | Mary Mbugua — Branch Manager, Eldoret |

All seven are square 800 × 800 JPEGs (quality 84) cropped from the supplied portraits, so they
drop straight into the `.team-photo` tile (`aspect-ratio: 1/1`, `object-fit: cover`). Nobody on the
team uses the gradient-monogram fallback (`.team-photo--mono`) any more — it is still in the CSS if
you ever add a member without a photo. To add someone, copy a whole `<li class="team-card card-dark group">`
block and point its `<img>` at a new 800 × 800 file in `assets/img/team/`.

### Gallery photos (the supplied office and airport photographs)

14 photographs live in `assets/img/gallery/`, cropped/normalised so they drop straight into the
gallery grid:

| Files | Section on `gallery.html` | Shape |
| --- | --- | --- |
| `office-briefing-group/hands/seated/wave.jpg`, `office-team-row.jpg`, `office-team-consultant.jpg` | *Briefings & interviews at our office* | 1200 × 800 (3:2) |
| `departures-group.jpg`, `departures-group-2/3/4.jpg` | *Departure day* — group shots | 1200 × 800 (3:2) |
| `departures-trio.jpg`, `departures-sawad-team.jpg`, `departures-traveller.jpg`, `departures-pair.jpg` | *Departure day* — portraits | 662 × 993 (2:3) |

Wide photos use `.gallery-thumb` (4:3 crop); the portrait ones add `.gallery-thumb--portrait`
(2:3). The photo tiles are **caption-free** (`.gallery-item--bare`) — the picture fills the tile, with a
small ⤢ badge appearing on hover/focus. The `data-caption` attribute is still used, but only inside
the lightbox, where it labels the enlarged image.

**Adding a new photo:** save it as a JPEG into `assets/img/gallery/`, then copy one
`<button class="gallery-item gallery-item--bare" data-gallery-item @click="show($el)"
data-full="…" data-caption="…">` block in `gallery.html` and change the two paths, the `alt` and the
caption (remember the `.gallery-zoom` badge span). Keep `width`/`height` accurate — they prevent layout shift.

**Privacy:** the gallery shows identifiable candidates, so the page carries a line stating the
photos were taken with consent, that names are withheld, and an email address for removal
requests. Keep that sentence if you swap photographs.

### Other photography

`hero-1/2/3.jpg`, `banner-handshake.jpg`, `feat-executive.jpg`, `feat-consulting.jpg`,
`parallax-team.jpg`, `video-thumb.jpg`, `cta-office.jpg`, `services-a.jpg` are generic corporate
stock placeholders — replace them with photos of your own offices and staff when you have them
(same filenames, no code changes).

---

## 4. Where to change what

```
assets/css/
├── preflight.css   browser reset (leave alone)
├── site.css        brand & components: buttons, header, cards, forms, footer, carousel
├── utilities.css   utility classes used in the markup
└── custom.css      ← your overrides (loads last) + brand lockup + hero poster styles
```

**Colours.** The brand yellow (`#eab308` / `#facc15`) and the deep blue/indigo in the logo are used
throughout. To recolour the accents, edit the yellow values in `utilities.css`
(`rgb(234 179 8)`, `rgb(251 191 36)`, `rgb(253 224 71)`) — or simply add rules to `custom.css`:

```css
.btn-amber { background-color: #eab308; }
.footer-heading::after { background-color: #eab308; }
.brand-tag { color: #b8860b; }        /* the gold motto */
```

**Theme.** Dark inner pages are `body.theme-dark` (`#222`), the home page is `body.theme-light`.

**Behaviour.** `assets/js/site.js` — vanilla JS + a few Alpine components:

| Function | Does |
| --- | --- |
| `siteHeader()` | switches full ↔ slim header at `scrollY > 60` (500 ms) |
| `heroCarousel(n)` | 8 s autoplay, crossfade, swipe, arrow keys, pause on hover/focus |
| `applyJobPrefill()` | `apply.html?job=barista` preselects role + destination |
| `contactForm()` / `applyForm()` / `loginForm()` / `partnerForm()` | validation + submit states (the employer partnership form posts to the same `formEndpoint`) |
| `galleryBox()` | `gallery.html` lightbox — click/keyboard open, ←/→, Esc, focus restore, scroll lock |
| `videoModal()` | "What we do" video modal |

Config at the top of the file:

```js
window.SITE_CONFIG = {
  formEndpoint: '',                     // POST JSON here (Formspree, Netlify, PHP handler…). Empty = demo mode.
  videoUrl: 'assets/video/VID.mp4'      // the home-page film (YouTube/Vimeo URL also works)
};
```

**The home-page video.** The player already points at `assets/video/VID.mp4`. Put the file in that
folder with exactly that name (`VID.mp4` — the name is case-sensitive on the server) and the *Watch
our film* button plays it. Nothing else to change. Until the file is there, the modal shows a
"film is on the way" card with the phone number and email instead of a broken player. Use MP4/H.264
for the widest support, and keep it 720p/1080p and under ~50 MB.

The contact, application and employer partnership forms validate and show their success state in
demo mode; set `formEndpoint` to have submissions delivered to `philinfogloball@gmail.com` through
whichever service you use (each payload carries `form: 'contact' | 'application' |
'employer-partnership'` so you can route them separately).

**Map.** In `contact.html` the iframe query is `Veew Plaza River Road Nairobi` — refine it with
exact coordinates when you have them: `https://www.google.com/maps?q=<lat>,<lng>&output=embed`.

---

## 5. Adding a utility class (no build step)

`utilities.css` was generated once from the markup and ships as plain CSS. If you add a Tailwind
utility class that is not in the file (e.g. `mt-14`, `max-h-[74vh]`), either:

1. write the equivalent rule in `custom.css` (recommended), or
2. regenerate the utility sheet once with Node installed:

```bash
npx tailwindcss@3.4.17 -i /dev/stdin -o assets/css/utilities.css --minify \
  --content "./*.html,./assets/js/*.js" <<< "@tailwind utilities;"
```

Structural layout on the home hero (`.hero-slide-inner`, `.hero-poster`, `.hero-copy-card`) is
hand-written CSS in `custom.css`, so the most important section never depends on generated classes.

---

## 6. Header & footer are repeated on every page

Each page contains the same header/footer markup between comment markers:

```html
<!-- ==================== HEADER ==================== --> … <!-- /HEADER -->
<!-- ==================== FOOTER ==================== --> … <!-- /FOOTER -->
```

The header repeats **three** navigations, so a new nav item has to be added to all three (on all
16 pages — use *Replace in Files* and anchor on the `employers.html` line):

| Variant | Class | Where |
| --- | --- | --- |
| Full-bar pills | `nav-pill-link` | dark pill row, desktop ≥ 1024 px |
| Slim-bar links | `nav-slim-link` | white bar after scrolling, desktop ≥ 1024 px |
| Mobile dropdown | `rounded-lg px-4 py-3 …` | `#mobile-menu`, < 1024 px |

Current primary nav: **Home · Services · Job Seekers · Employers · Our Team · Gallery · About Us ·
Contact Us** (Apply Now is in the mobile menu; Login sits in the blue button). Because eight labels
are tight at 1024–1359 px, `custom.css` adds `white-space: nowrap` to both link classes plus a
"denser nav" media query — if you add or rename a link, re-check the header at 1024, 1200 and
1440 px.

The active nav item is marked with `aria-current="page"`:

```html
<a href="services.html" class="nav-pill-link" aria-current="page">Services</a>
```

---

## 7. Accessibility & behaviour

* Skip link, semantic landmarks, labelled controls, `aria-current`, `aria-live` form status
* Keyboard-operable carousel (arrows), video modal and gallery lightbox (←/→, Esc, focus restore)
* `prefers-reduced-motion` disables autoplay, Ken Burns, blurred-backdrop animation and hover lifts
* `loading="lazy"` + explicit `width`/`height` on below-the-fold images (no layout shift)
* Mobile-first layouts tested at 390 / 768 / 1024 / 1440 px
* All internal links and asset references verified — no broken files

---

## 8. Deploying

Upload the folder as-is. No build command, no publish step, no environment variables.
