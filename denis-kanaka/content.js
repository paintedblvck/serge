/* =====================================================================
   denis kanaka — EDITABLE CONTENT
   ---------------------------------------------------------------------
   This is the only file you need to touch for routine updates
   (new release, new mix, new project, new testimonial, contact details).
   Save, re-upload / push, done. See README.md for the full workflow.

   Anything left as "" shows a dashed "… goes here" marker on the page,
   so you can see at a glance what is still missing.
   Before launch, set showPlaceholders to false: empty items are then
   hidden instead of marked.
   ===================================================================== */

window.SITE = {

  showPlaceholders: true,

  /* ---------- Contact & routing ------------------------------------- */
  contact: {
    email: "",                 // EMAIL GOES HERE   e.g. "bookings@yourdomain.com"
    phone: "",                 // PHONE GOES HERE   e.g. "+1 518 000 0000"
    instagram: "denis_kanaka", // handle only, no @
    youtube: "",               // YOUTUBE CHANNEL LINK GOES HERE
    spotify: "",               // SPOTIFY ARTIST LINK GOES HERE
    appleMusic: "",            // APPLE MUSIC ARTIST LINK GOES HERE
    soundcloud: ""             // SOUNDCLOUD LINK GOES HERE
  },

  /* Booking form delivery — the form works as soon as ONE of these is set:
     1. formEndpoint: a Formspree / Basin / Getform URL, e.g.
        "https://formspree.io/f/abcdwxyz"  (recommended: spam filtering + dashboard)
     2. contact.email above: inquiries are sent through FormSubmit.co to
        that address. The very first inquiry triggers a one-time
        "activate this form" email that Denis must click. */
  formEndpoint: "",            // FORM ENDPOINT GOES HERE (optional)

  /* ---------- Showreel (hero "Play showreel" button) ---------------- */
  showreel: {
    embedUrl: ""               // SHOWREEL LINK GOES HERE  e.g. "https://www.youtube.com/embed/VIDEO_ID"
  },

  /* ---------- Featured mix (DJ & Events section) -------------------- */
  featuredMix: {
    title: "Featured mix",
    caption: "Press play for a taste of a full set.",
    embedUrl: "",              // MIX EMBED LINK GOES HERE (SoundCloud / Mixcloud → Share → Embed → src="…")
    link: ""
  },

  /* ---------- Music: newest first ----------------------------------- */
  /* type: "Single" | "EP" | "Freestyle" | "Music video" | "Mix"
     cover: path to a square image in /img, e.g. "img/release-01.jpg"
     links: any of spotify, apple, youtube, soundcloud, bandcamp, tidal */
  music: [
    {
      title: "",               // RELEASE TITLE GOES HERE
      type: "Single",
      year: "",
      cover: "",
      links: { spotify: "", apple: "", youtube: "" }
    },
    {
      title: "",               // FREESTYLE TITLE GOES HERE
      type: "Freestyle",
      year: "",
      cover: "",
      links: { youtube: "" }
    },
    {
      title: "",               // MUSIC VIDEO TITLE GOES HERE
      type: "Music video",
      year: "",
      cover: "",
      links: { youtube: "" }
    }
  ],

  /* ---------- Creative work ----------------------------------------- */
  projects: [
    {
      title: "Jisho Visuals",
      tag: "Photo / Video",
      text: "Photography and film — documenting performance, people and culture.",
      url: ""                  // JISHO VISUALS LINK GOES HERE
    },
    {
      title: "Gorilla Peach",
      tag: "Studio",
      text: "Studio work — recording, production and creative sessions.",
      url: ""                  // GORILLA PEACH LINK GOES HERE
    },
    {
      title: "Strategy & storytelling",
      tag: "Selected projects",
      text: "Creative strategy, brand storytelling and cultural programming. Case studies coming soon.",
      url: ""                  // CASE STUDY LINK GOES HERE
    }
  ],

  /* ---------- About: career highlights ------------------------------ */
  highlights: [
    // "Resident DJ, Venue Name — 2024–present",
  ],

  /* ---------- Testimonials ------------------------------------------ */
  /* Only add APPROVED quotes. */
  testimonials: [
    // { quote: "…", name: "Name", role: "Event planner, Albany" },
  ]
};
