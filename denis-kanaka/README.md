# denis kanaka — website

A static site built from the *Denis Kanaka Web / Creative Brief*. It is one page with sections for Home, DJ & Events, Music, Creative Work, About and Bookings. Each section can later become its own page.

There is no build step and no dependencies. Upload the folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages). All of them provide HTTPS for free.

## Files

| File | What it is |
|---|---|
| `index.html` | Page structure, SEO meta tags, structured data |
| `styles.css` | Brand palette and type from the brief (Paper/Ink base, Ember accent) |
| `content.js` | **Everything you update routinely**: music, mix, projects, testimonials, contact details |
| `main.js` | Behaviour: form, nav, showreel, analytics events |
| `img/` | Photos go here |

## Light / dark mode

Dark is the default design. The sun/moon button in the header switches to the light version, and the visitor's choice is remembered. Both themes use only the brief's palette.

## Placeholders

Any missing data shows on the page as a dashed **"… goes here"** marker: email, phone, links, cover art, photos, mix, showreel, testimonials and highlights. Each one disappears as soon as the matching field in `content.js` is filled in. Before launch, set `showPlaceholders: false` so that any item still empty is hidden rather than marked.

## How to update content

All routine updates happen in `content.js`:

- **New release:** add an entry at the top of the `music` list and drop the cover art in `img/`.
- **New mix:** paste the SoundCloud or Mixcloud embed `src` URL into `featuredMix.embedUrl`.
- **Showreel:** paste a YouTube or Vimeo embed URL into `showreel.embedUrl`. Video plays only when a visitor clicks; nothing autoplays.
- **Testimonials and highlights:** add entries to `testimonials` and `highlights`. Until you do, they show placeholders (or are hidden when `showPlaceholders` is false). Add only approved quotes.

## Photos

These two images replace the placeholders automatically once the files exist:

- `img/hero.jpg`: performance photo, portrait orientation (about 1200×1500)
- `img/portrait.jpg`: portrait for the About section (about 1200×1500)
- `img/og-image.jpg`: 1200×630 image used for social previews

## Before launch: open items

1. **Booking form delivery.** The form works as soon as `contact.email` is set. Inquiries are then sent to that address through FormSubmit.co, and Denis must click a one-time activation email after the first inquiry. For spam filtering and a dashboard, paste a [Formspree](https://formspree.io) endpoint into `formEndpoint` instead. Until one of the two is set, the form refuses to submit and says so.
2. **Contact details and domain** (marked TBC in the brief). Set `contact.email` and `contact.phone`. Replace `DOMAIN-GOES-HERE.com` in `index.html` (canonical and `og:*` tags) with the real domain.
3. **Streaming links.** Add Spotify, Apple Music and YouTube URLs to `contact` and to each release.
4. **Studio links.** Add the URLs for Jisho Visuals and Gorilla Peach in `projects`.
5. **Analytics.** Paste a Plausible or GA4 snippet into the `<head>`. `main.js` already sends these events:
   - `book_click`, with a label for where on the page the click happened
   - `booking_submit`
   - `music_click`
   - `social_click`
   - `showreel_play`
   - `project_click`

## Outside this build

The brief asks for "editable admin access / simple CMS". The current update workflow is editing `content.js`. If Denis needs a point-and-click admin, a git-based CMS such as Decap CMS can sit on top of these same files. That decision belongs with the platform, cost and maintenance choices the brief says to confirm before build.
