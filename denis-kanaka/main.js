/* denis kanaka — site behaviour. Content lives in content.js. */
(function () {
  "use strict";
  var S = window.SITE || {};
  var C = S.contact || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

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

  /* ---------- Simple text bindings ---------- */
  $$("[data-bind]").forEach(function (el) {
    var v = el.getAttribute("data-bind").split(".").reduce(function (o, k) { return o ? o[k] : ""; }, S);
    if (v) el.textContent = v;
  });

  /* ---------- Featured mix ---------- */
  var mix = S.featuredMix || {};
  if (mix.embedUrl) {
    var player = $("#mixPlayer");
    player.innerHTML = '<iframe title="' + esc(mix.title || "Featured mix") + '" loading="lazy" allow="encrypted-media" src="' + esc(mix.embedUrl) + '"></iframe>';
    if (mix.caption && /Add a SoundCloud/.test(mix.caption)) $("[data-bind='featuredMix.caption']").textContent = "";
  }

  /* ---------- Music ---------- */
  var LINK_NAMES = { spotify: "Spotify", apple: "Apple Music", youtube: "YouTube", soundcloud: "SoundCloud", bandcamp: "Bandcamp", tidal: "Tidal" };
  var rel = $("#releases");
  (S.music || []).forEach(function (m) {
    var links = Object.keys(m.links || {}).filter(function (k) { return m.links[k]; }).map(function (k) {
      return '<a class="chip" href="' + esc(m.links[k]) + '" target="_blank" rel="noopener" data-track="music_click" data-track-label="' + esc(m.title + " / " + k) + '">' + esc(LINK_NAMES[k] || k) + "</a>";
    }).join("");
    if (!links) links = '<span class="chip soon">Links coming soon</span>';
    var art = document.createElement("article");
    art.className = "release reveal";
    art.innerHTML =
      '<div class="cover' + (m.cover ? " has-img" : "") + '"' +
        (m.cover ? ' style="background-image:url(\'' + esc(m.cover) + '\')" role="img" aria-label="' + esc(m.title) + ' cover art"' : ' aria-hidden="true"') +
        '><span class="cover-mark">kanaka</span></div>' +
      '<div class="release-meta"><h3 class="release-title">' + esc(m.title) + '</h3><span class="release-type">' + esc(m.type) + (m.year ? " · " + esc(m.year) : "") + "</span></div>" +
      '<div class="release-links">' + links + "</div>";
    rel.appendChild(art);
  });

  /* Artist-level streaming / social links */
  var socials = [
    ["Instagram", C.instagram ? "https://www.instagram.com/" + C.instagram + "/" : ""],
    ["Spotify", C.spotify], ["Apple Music", C.appleMusic], ["SoundCloud", C.soundcloud], ["YouTube", C.youtube]
  ].filter(function (s) { return s[1]; });
  $("#streamLinks").innerHTML = socials.filter(function (s) { return s[0] !== "Instagram"; }).map(function (s) {
    return '<a class="chip" href="' + esc(s[1]) + '" target="_blank" rel="noopener" data-track="music_click" data-track-label="artist-' + esc(s[0]) + '">' + esc(s[0]) + " ↗</a>";
  }).join("");
  $("#footerLinks").innerHTML = socials.map(function (s) {
    return '<a href="' + esc(s[1]) + '" target="_blank" rel="noopener" data-track="social_click" data-track-label="footer-' + esc(s[0]) + '">' + esc(s[0]) + "</a>";
  }).join("") + '<a href="#book" data-track="book_click" data-track-label="footer">Bookings</a>';

  /* ---------- Projects ---------- */
  $("#projects").innerHTML = (S.projects || []).map(function (p) {
    var tag = p.url ? "a" : "div";
    var attrs = p.url ? ' href="' + esc(p.url) + '" target="_blank" rel="noopener" data-track="project_click" data-track-label="' + esc(p.title) + '"' : "";
    return "<" + tag + ' class="project reveal"' + attrs + '>' +
      '<p class="label">' + esc(p.tag) + "</p><h3>" + esc(p.title) + "</h3><p>" + esc(p.text) + "</p>" +
      (p.url ? '<span class="go">Visit ↗</span>' : "") + "</" + tag + ">";
  }).join("");

  /* ---------- Highlights & testimonials (hidden when empty) ---------- */
  if ((S.highlights || []).length) {
    var hl = $("#highlights");
    hl.innerHTML = S.highlights.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("");
    hl.hidden = false;
  }
  if ((S.testimonials || []).length) {
    $("#quotes").innerHTML = S.testimonials.map(function (t) {
      return '<figure class="quote reveal"><blockquote>“' + esc(t.quote) + '”</blockquote><figcaption><strong>' + esc(t.name) + "</strong>" + (t.role ? " · " + esc(t.role) : "") + "</figcaption></figure>";
    }).join("");
    $("#testimonials").hidden = false;
  }

  /* ---------- Direct contact details ---------- */
  var direct = $("#direct");
  if (C.email) direct.insertAdjacentHTML("afterbegin", '<div><dt>Email</dt><dd><a href="mailto:' + esc(C.email) + '" data-track="email_click">' + esc(C.email) + "</a></dd></div>");
  if (C.phone) direct.insertAdjacentHTML("beforeend", '<div><dt>Phone</dt><dd><a href="tel:' + esc(C.phone.replace(/[^\d+]/g, "")) + '" data-track="phone_click">' + esc(C.phone) + "</a></dd></div>");

  $("#year").textContent = new Date().getFullYear();

  /* ---------- Showreel modal (never autoplays audio on load) ---------- */
  var modal = $("#reelModal"), reelBody = $("#reelBody");
  $$("[data-showreel]").forEach(function (b) {
    b.addEventListener("click", function () {
      track("showreel_play", "hero");
      var url = S.showreel && S.showreel.embedUrl;
      reelBody.innerHTML = url
        ? '<iframe title="Denis Kanaka showreel" allow="autoplay; encrypted-media; fullscreen" allowfullscreen src="' + esc(url) + (url.indexOf("?") > -1 ? "&" : "?") + 'autoplay=1"></iframe>'
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
  dateInput.min = new Date().toISOString().slice(0, 10);

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
    var data = new FormData(form);
    data.delete("_gotcha");
    track("booking_submit", data.get("event_type"));

    if (S.formEndpoint) {
      var btn = $("button[type=submit]", form);
      btn.disabled = true; btn.textContent = "Sending…";
      fetch(S.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); showDone(); })
        .catch(function () {
          status.textContent = "Something went wrong sending your inquiry." + (C.email ? " Please email " + C.email + " directly." : " Please try again or message @" + (C.instagram || "denis_kanaka") + " on Instagram.");
        })
        .finally(function () { btn.disabled = false; btn.textContent = "Send inquiry"; });
      return;
    }

    if (C.email) {
      var body = [];
      data.forEach(function (v, k) { if (v) body.push(k.replace(/_/g, " ") + ": " + v); });
      window.location.href = "mailto:" + C.email + "?subject=" + encodeURIComponent("Booking inquiry: " + data.get("event_type") + " on " + data.get("date")) + "&body=" + encodeURIComponent(body.join("\n"));
      showDone("Your email app should have opened with the details filled in. Hit send and Denis will be in touch.");
      return;
    }

    // Preview mode: nothing configured yet.
    console.warn("[denis kanaka] No formEndpoint or contact.email set in content.js. Inquiry NOT sent.", Object.fromEntries(data));
    showDone("Preview mode: this form isn’t connected yet, so nothing was sent. Please reach Denis on Instagram @" + (C.instagram || "denis_kanaka") + ".");
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
