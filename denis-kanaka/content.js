/* =====================================================================
   denis kanaka — EDITABLE CONTENT
   ---------------------------------------------------------------------
   This is the only file you need to touch for routine updates
   (new release, new mix, new project, new testimonial, contact details).
   Save, re-upload / push, done. See README.md for the full workflow.

   Leave a value as "" to hide that link or block.
   ===================================================================== */

window.SITE = {

  /* ---------- Contact & routing ------------------------------------- */
  contact: {
    email: "",                 // e.g. "bookings@deniskanaka.com"  (TBC per brief)
    phone: "",                 // e.g. "+1 518 000 0000"           (TBC per brief)
    instagram: "denis_kanaka", // handle only, no @
    youtube: "",               // full URL
    spotify: "",               // full artist URL
    appleMusic: "",            // full artist URL
    soundcloud: ""             // full URL
  },

  /* Booking form delivery.
     Paste a Formspree / Basin / Getform endpoint here, e.g.
     "https://formspree.io/f/abcdwxyz". Submissions are then emailed to Denis.
     If empty, the form falls back to opening the visitor's email app
     pre-filled to contact.email. If BOTH are empty the form runs in
     preview mode and tells the visitor nothing was sent. */
  formEndpoint: "",

  /* ---------- Showreel (hero "Play showreel" button) ---------------- */
  showreel: {
    // YouTube or Vimeo embed URL, e.g. "https://www.youtube.com/embed/VIDEO_ID"
    embedUrl: ""
  },

  /* ---------- Featured mix (DJ & Events section) -------------------- */
  featuredMix: {
    title: "Featured mix",
    caption: "Add a SoundCloud / Mixcloud embed URL in content.js to show the player here.",
    // SoundCloud: Share → Embed → copy the src="..." value
    // Mixcloud:  Share → Embed → copy the src="..." value
    embedUrl: "",
    link: ""
  },

  /* ---------- Music: newest first ----------------------------------- */
  /* type: "Single" | "EP" | "Freestyle" | "Music video" | "Mix"
     cover: path to a square image in /img, e.g. "img/release-01.jpg"  */
  music: [
    {
      title: "Release title",
      type: "Single",
      year: "2026",
      cover: "",
      links: { spotify: "", apple: "", youtube: "", soundcloud: "" }
    },
    {
      title: "Freestyle title",
      type: "Freestyle",
      year: "2026",
      cover: "",
      links: { youtube: "" }
    },
    {
      title: "Video title",
      type: "Music video",
      year: "2025",
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
      url: ""
    },
    {
      title: "Gorilla Peach",
      tag: "Studio",
      text: "Studio work — recording, production and creative sessions.",
      url: ""
    },
    {
      title: "Strategy & storytelling",
      tag: "Selected projects",
      text: "Creative strategy, brand storytelling and cultural programming. Case studies coming soon.",
      url: ""
    }
  ],

  /* ---------- About: career highlights ------------------------------ */
  /* Short, factual lines. Leave the list empty to hide the block. */
  highlights: [
    // "Resident DJ, Venue Name — 2024–present",
  ],

  /* ---------- Testimonials ------------------------------------------ */
  /* Only add APPROVED quotes. Section stays hidden while this is empty. */
  testimonials: [
    // { quote: "…", name: "Name", role: "Event planner, Albany" },
  ]
};
