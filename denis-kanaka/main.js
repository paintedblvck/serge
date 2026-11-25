/* denis kanaka — site behaviour. Content lives in content.js. */
(function () {
  "use strict";
  var S = window.SITE || {};
  var C = S.contact || {};
  var TODO = S.showPlaceholders !== false;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  /* Visible "… goes here" marker (or nothing when placeholders are off). */
  function todo(text, cls) { return TODO ? '<span class="todo' + (cls ? " " + cls : "") + '">' + esc(text) + "</span>" : ""; }

  /* ---------- Analytics hook ----------------------------------------
     Works with Plausible, GA4 (gtag) or Google Tag Manager if present. */
  function track(name, label) {
    try {
      if (window.plausible) window.plausible(name, { props: { label: label || "" } });
      if (window.gtag) window.gtag("event", name, { event_label: label || "" });
      (window.dataLayer = window.dataLayer || []).push({ event: name, label: label || "" });
    } catch (e) { /* never block the UI on analytics */ }
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-track]");
    if (t) track(t.getAttribute("data-track"), t.getAttribute("data-track-label"));
  });

  /* ---------- Light / dark theme ---------- */
  var root = document.documentElement, themeBtn = $(".theme-btn"), metaTheme = $('meta[name="theme-color"]');
  function applyTheme(t, save) {
    root.setAttribute("data-theme", t);
    themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
    if (metaTheme) metaTheme.setAttribute("content", t === "dark" ? "#171713" : "#F1E8D6");
    if (save) { try { localStorage.setItem("dk-theme", t); } catch (e) {} }
  }
  applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark", false);
  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next, true);
    track("theme_toggle", next);
  });

  /* ---------- Header + mobile nav ---------- */
  var header = $(".site-header");
  var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  var menuBtn = $(".menu-btn"), nav = $("#nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  $$("#nav a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---------- Images: swap placeholders for real files when present ---------- */
  $$("[data-img]").forEach(function (el) {
    var src = el.getAttribute("data-img"), img = new Image();
    img.onload = function () { el.style.backgroundImage = "url('" + src + "')"; el.classList.add("has-img"); };
    img.src = src;
  });
  if (!TODO) $$(".ph-label").forEach(function (el) { el.hidden = true; });

  /* ---------- Simple text bindings ---------- */
  $$("[data-bind]").forEach(function (el) {
    var v = el.getAttribute("data-bind").split(".").reduce(function (o, k) { return o ? o[k] : ""; }, S);
    if (v) el.textContent = v;
  });

  /* ---------- Featured mix ---------- */
  var mix = S.featuredMix || {};
  var player = $("#mixPlayer");
  if (mix.embedUrl) {
    player.innerHTML = '<iframe title="' + esc(mix.title || "Featured mix") + '" loading="lazy" allow="encrypted-media" src="' + esc(mix.embedUrl) + '"></iframe>';
  } else if (!TODO) {
    $("#mix").hidden = true;
  }

  /* ---------- Music ---------- */
  var LINK_NAMES = { spotify: "Spotify", apple: "Apple Music", youtube: "YouTube", soundcloud: "SoundCloud", bandcamp: "Bandcamp", tidal: "Tidal" };
  var rel = $("#releases");
  (S.music || []).forEach(function (m) {
    if (!TODO && !m.title) return;
    var keys = Object.keys(m.links || {});
    var links = keys.map(function (k) {
      var name = LINK_NAMES[k] || k;
      return m.links[k]
        ? '<a class="chip" href="' + esc(m.links[k]) + '" target="_blank" rel="noopener" data-track="music_click" data-track-label="' + esc((m.title || "release") + " / " + k) + '">' + esc(name) + "</a>"
        : todo(name + " link goes here", "chip");
    }).join("");
    var label = (m.type || "Release").toLowerCase();
    var title = m.title ? esc(m.title) : (TODO ? '<span class="todo">' + esc(m.type || "Release") + " title goes here</span>" : "");
    var art = document.createElement("article");
    art.className = "release reveal";
    art.innerHTML =
      '<div class="cover' + (m.cover ? " has-img" : "") + '"' +
        (m.cover ? ' style="background-image:url(\'' + esc(m.cover) + '\')" role="img" aria-label="' + esc(m.title) + ' cover art"' : ' aria-hidden="true"') +
        '><span class="cover-mark">kanaka</span>' + (!m.cover && TODO ? '<span class="cover-todo">Cover art goes here</span>' : "") + "</div>" +
      '<div class="release-meta"><h3 class="release-title">' + title + '</h3><span class="release-type">' + esc(m.type) + (m.year ? " · " + esc(m.year) : (TODO ? " · year" : "")) + "</span></div>" +
      '<div class="release-links">' + links + "</div>";
    rel.appendChild(art);
  });

  /* Artist-level streaming / social links */
  var socials = [
    ["Instagram", C.instagram ? "https://www.instagram.com/" + C.instagram + "/" : ""],
    ["Spotify", C.spotify], ["Apple Music", C.appleMusic], ["SoundCloud", C.soundcloud], ["YouTube", C.youtube]
  ];
  $("#streamLinks").innerHTML = socials.filter(function (s) { return s[0] !== "Instagram"; }).map(function (s) {
    return s[1]
      ? '<a class="chip" href="' + esc(s[1]) + '" target="_blank" rel="noopener" data-track="music_click" data-track-label="artist-' + esc(s[0]) + '">' + esc(s[0]) + " ↗</a>"
      : todo(s[0] + " profile link goes here", "chip");
  }).join("");
  $("#footerLinks").innerHTML = socials.filter(function (s) { return s[1]; }).map(function (s) {
    return '<a href="' + esc(s[1]) + '" target="_blank" rel="noopener" data-track="social_click" data-track-label="footer-' + esc(s[0]) + '">' + esc(s[0]) + "</a>";
  }).join("") + '<a href="#book" data-track="book_click" data-track-label="footer">Bookings</a>';

  /* ---------- Projects ---------- */
  $("#projects").innerHTML = (S.projects || []).map(function (p) {
    var tag = p.url ? "a" : "div";
    var attrs = p.url ? ' href="' + esc(p.url) + '" target="_blank" rel="noopener" data-track="project_click" data-track-label="' + esc(p.title) + '"' : "";
    return "<" + tag + ' class="project reveal"' + attrs + '>' +
      '<p class="label">' + esc(p.tag) + "</p><h3>" + esc(p.title) + "</h3><p>" + esc(p.text) + "</p>" +
      (p.url ? '<span class="go">Visit ↗</span>' : todo(p.title + " link goes here")) + "</" + tag + ">";
  }).join("");

  /* ---------- Highlights ---------- */
  var hl = $("#highlights"), H = S.highlights || [];
  if (H.length) {
    hl.innerHTML = H.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("");
  } else if (TODO) {
    hl.innerHTML = [1, 2, 3].map(function (n) { return '<li class="todo-li">' + todo("Career highlight " + n + " goes here") + "</li>"; }).join("");
  } else {
    hl.hidden = true;
  }

  /* ---------- Testimonials ---------- */
  var T = S.testimonials || [];
  if (T.length) {
    $("#quotes").innerHTML = T.map(function (t) {
      return '<figure class="quote reveal"><blockquote>“' + esc(t.quote) + '”</blockquote><figcaption><strong>' + esc(t.name) + "</strong>" + (t.role ? " · " + esc(t.role) : "") + "</figcaption></figure>";
    }).join("");
  } else if (TODO) {
    $("#quotes").innerHTML = [1, 2].map(function () {
      return '<figure class="quote is-todo reveal"><blockquote>' + todo("Approved testimonial goes here") + "</blockquote><figcaption>" + todo("Client name & role go here") + "</figcaption></figure>";
    }).join("");
  } else {
    $("#testimonials").hidden = true;
  }

  /* ---------- Direct contact details ---------- */
  var direct = $("#direct");
  direct.insertAdjacentHTML("afterbegin", '<div><dt>Email</dt><dd>' + (C.email
    ? '<a href="mailto:' + esc(C.email) + '" data-track="email_click">' + esc(C.email) + "</a>"
    : todo("Email goes here")) + "</dd></div>");
  if (C.phone || TODO) direct.insertAdjacentHTML("beforeend", '<div><dt>Phone</dt><dd>' + (C.phone
    ? '<a href="tel:' + esc(C.phone.replace(/[^\d+]/g, "")) + '" data-track="phone_click">' + esc(C.phone) + "</a>"
    : todo("Phone number goes here")) + "</dd></div>");
  if (!C.email && !TODO) direct.firstElementChild.remove();

  $("#year").textContent = new Date().getFullYear();

  /* ---------- Showreel modal (never autoplays audio on load) ---------- */
  var modal = $("#reelModal"), reelBody = $("#reelBody");
  $$("[data-showreel]").forEach(function (b) {
    b.addEventListener("click", function () {
      track("showreel_play", "hero");
      var url = S.showreel && S.showreel.embedUrl;
      reelBody.innerHTML = url
        ? '<iframe title="Denis Kanaka showreel" allow="autoplay; encrypted-media; fullscreen" allowfullscreen src="' + esc(url) + (url.indexOf("?") > -1 ? "&" : "?") + 'autoplay=1"></iframe>'
        : TODO
          ? '<p><span class="todo">Showreel video link goes here</span><br><br>Add a YouTube / Vimeo embed URL to showreel.embedUrl in content.js.</p>'
          : "<p>Showreel coming soon.<br>In the meantime, follow @" + esc(C.instagram || "denis_kanaka") + " for recent sets.</p>";
      if (modal.showModal) modal.showModal(); else modal.setAttribute("open", "");
    });
  });
  function closeModal() { reelBody.innerHTML = ""; if (modal.close) modal.close(); else modal.removeAttribute("open"); }
  $(".modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  modal.addEventListener("close", function () { reelBody.innerHTML = ""; });

  /* ---------- Row arrows pre-select event type ---------- */
  var typeSel = $("#f-type");
  $$("[data-event]").forEach(function (a) {
    a.addEventListener("click", function () { typeSel.value = a.getAttribute("data-event"); });
  });

  /* ---------- Booking form ---------- */
  var form = $("#bookingForm"), status = $("#formStatus"), done = $("#formDone"), hint = $("#contactHint");
  var dateInput = $("#f-date");
  var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  dateInput.min = d.toISOString().slice(0, 10);

  function fieldOf(el) { return el.closest(".field"); }
  function validate() {
    var ok = true;
    ["#f-name", "#f-type", "#f-date"].forEach(function (s) {
      var el = $(s), bad = !el.value.trim();
      fieldOf(el).classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    var email = $("#f-email"), phone = $("#f-phone");
    var emailBad = email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    var none = !email.value.trim() && !phone.value.trim();
    fieldOf(email).classList.toggle("invalid", none || emailBad);
    fieldOf(phone).classList.toggle("invalid", none);
    hint.classList.toggle("invalid", none || emailBad);
    hint.textContent = emailBad ? "That email address doesn’t look right." : "Email or phone required, whichever is easier for you.";
    if (none || emailBad) ok = false;
    return ok;
  }
  form.addEventListener("input", function () { if (form.dataset.tried) validate(); });

  function showDone(text) {
    if (text) $("#doneText").textContent = text;
    form.hidden = true; done.hidden = false; done.focus();
  }
  $("#formReset").addEventListener("click", function () {
    form.reset(); delete form.dataset.tried; status.textContent = "";
    done.hidden = true; form.hidden = false; $("#f-name").focus();
  });

  /* Where inquiries go: explicit endpoint first, else FormSubmit → contact.email */
  var endpoint = S.formEndpoint || (C.email ? "https://formsubmit.co/ajax/" + encodeURIComponent(C.email) : "");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    form.dataset.tried = "1";
    if (!validate()) {
      status.textContent = "Please fill in the highlighted fields.";
      var first = $(".field.invalid input, .field.invalid select", form); if (first) first.focus();
      return;
    }
    if (form._gotcha.value) return; // bot
    status.textContent = "";

    if (!endpoint) {
      status.innerHTML = '<span class="todo">Booking email goes here</span> This form isn’t connected yet, so nothing was sent. Set contact.email (or formEndpoint) in content.js.';
      return;
    }

    var data = new FormData(form);
    data.delete("_gotcha");
    data.append("_subject", "Booking inquiry: " + data.get("event_type") + " on " + data.get("date"));
    data.append("_template", "table");
    data.append("_captcha", "false");
    if (data.get("email")) data.append("_replyto", data.get("email"));
    track("booking_submit", data.get("event_type"));

    var btn = $("button[type=submit]", form);
    btn.disabled = true; btn.textContent = "Sending…";
    fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json().catch(function () { return {}; }); })
      .then(function (j) {
        if (j && (j.success === false || j.success === "false")) throw new Error(j.message || "rejected");
        showDone();
      })
      .catch(function () {
        status.textContent = "Something went wrong sending your inquiry." + (C.email ? " Please email " + C.email + " directly." : " Please try again or message @" + (C.instagram || "denis_kanaka") + " on Instagram.");
      })
      .finally(function () { btn.disabled = false; btn.textContent = "Send inquiry"; });
  });

  /* ---------- Reveal on scroll ---------- */
  $$(".section-head, .row, .mix, .about-copy, .frame, .book-intro, .form, .fact").forEach(function (el) { el.classList.add("reveal"); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("in"); });
  }
})();
