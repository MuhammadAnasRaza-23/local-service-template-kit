const catalog = window.templateCatalog || [];
const defaults = window.siteDefaults || {
  brand: "YOUR BRAND",
  mark: "YB",
  phone: "(555) 123-4567",
  phoneHref: "+15551234567",
  email: "hello@yourbrand.com",
  location: "[City]"
};

const iconPaths = {
  road: '<path d="M8 22 10 2h4l2 20M12 5v3m0 3v3m0 3v3"/>',
  car: '<path d="m5 16-2-2 2-6h14l2 6-2 2M6 16v3m12-3v3M5 13h14M8 10h8"/>',
  wrench: '<path d="M14 7a5 5 0 0 0-6-5l3 3-3 3-3-3a5 5 0 0 0 5 6l8 8 2-2-8-8"/>',
  layers: '<path d="m3 9 9-5 9 5-9 5-9-5Zm0 5 9 5 9-5"/>',
  building: '<path d="M4 22V5l8-3v20M12 8h8v14M7 7v2m0 3v2m0 3v2m8-7h2m-2 4h2"/>',
  home: '<path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7"/>',
  deck: '<path d="M3 10h18M5 10v11m14-11v11M2 21h20M7 6h10M9 3h6"/>',
  panel: '<path d="M4 3h16v18H4zM4 9h16M10 3v18"/>',
  fence: '<path d="M4 22V5l2-3 2 3v17M16 22V5l2-3 2 3v17M8 9h8M8 17h8"/>',
  bin: '<path d="M4 7h16M9 3h6l1 4M6 7l1 14h10l1-14M10 11v6m4-6v6"/>',
  blueprint: '<path d="M5 3h14v18H5zM8 7h8M8 11h3v6H8zm6 0h2v2h-2zm0 5h2"/>',
  tools: '<path d="m14 4 6 6M17 3l4 4-3 3-4-4zM3 21l8-8M8 5l3 3-3 3-3-3z"/>',
  truck: '<path d="M3 6h11v11H3zM14 10h4l3 4v3h-7M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>',
  paint: '<path d="M5 3h11v6H5zM16 6h3v5h-7v3M12 14v7H9v-7z"/>',
  sparkle: '<path d="m12 2 1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2Zm7 13 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z"/>',
  roof: '<path d="m3 12 9-8 9 8M6 10v10h12V10M9 20v-6h6v6"/>',
  snow: '<path d="M12 2v20M4 7l16 10M4 17 20 7M9 4l3 3 3-3M9 20l3-3 3 3"/>',
  tow: '<path d="M3 6h10v10H3zM13 10h4l3 3v3h-7M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm11 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM6 9h4"/>',
  tree: '<path d="M12 22v-7M7 21h10M12 3c-5 0-8 4-6 8-2 3 1 6 4 5 1 2 4 2 5 0 4 1 6-4 3-6 1-4-2-7-6-7Z"/>',
  leaf: '<path d="M20 4C10 4 5 8 5 14c0 3 2 5 5 5 7 0 10-7 10-15ZM4 21c3-6 7-9 13-12"/>'
};

function icon(name, className = "") {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.tools}</svg>`;
}

function renderCatalog() {
  const grid = document.querySelector("#template-grid");
  if (!grid) return;

  const search = document.querySelector("#template-search");
  const filters = document.querySelector("#filter-row");
  const empty = document.querySelector("#empty-state");
  const sectors = ["All", ...new Set(catalog.map(item => item.sector))];
  let activeSector = "All";

  filters.innerHTML = sectors.map(sector => `<button class="filter-chip${sector === "All" ? " active" : ""}" type="button" data-sector="${sector}">${sector}</button>`).join("");

  function draw() {
    const query = search.value.trim().toLowerCase();
    const visible = catalog.filter(item => {
      const matchesSector = activeSector === "All" || item.sector === activeSector;
      const matchesQuery = `${item.category} ${item.sector} ${item.services.flat().join(" ")}`.toLowerCase().includes(query);
      return matchesSector && matchesQuery;
    });

    grid.innerHTML = visible.map((item, index) => `
      <article class="template-card theme-${item.theme}" style="--delay:${index * 35}ms">
        <div class="template-preview preview-${item.layout}">
          <div class="preview-top"><span class="preview-logo">YB</span><i></i><i></i></div>
          <div class="preview-copy">
            <span>${item.kicker}</span>
            <strong>${item.headline}</strong>
            <i></i>
          </div>
          <div class="preview-icon">${icon(item.icon)}</div>
          <div class="preview-service-row"><i></i><i></i><i></i></div>
        </div>
        <div class="template-card-body">
          <div class="template-card-meta"><span>${item.sector}</span><span>${String(catalog.indexOf(item) + 1).padStart(2, "0")}</span></div>
          <h3>${item.category}</h3>
          <p>${item.description}</p>
          <a href="site.html?id=${item.id}">View full template <span aria-hidden="true">→</span></a>
        </div>
      </article>
    `).join("");
    empty.hidden = visible.length > 0;
  }

  filters.addEventListener("click", event => {
    const button = event.target.closest("button[data-sector]");
    if (!button) return;
    activeSector = button.dataset.sector;
    filters.querySelectorAll("button").forEach(item => item.classList.toggle("active", item === button));
    draw();
  });
  search.addEventListener("input", draw);
  draw();
}

function projectVisual(item, label, index) {
  return `
    <article class="project-card project-${index + 1}">
      <div class="project-art" aria-hidden="true">
        ${icon(item.icon, "project-icon")}
        <span class="art-line art-line-one"></span>
        <span class="art-line art-line-two"></span>
        <span class="art-dot"></span>
      </div>
      <div class="project-caption"><span>Featured work ${String(index + 1).padStart(2, "0")}</span><strong>${label}</strong></div>
    </article>`;
}

function renderSite() {
  const root = document.querySelector("#site-root");
  if (!root) return;

  const id = new URLSearchParams(window.location.search).get("id");
  const item = catalog.find(template => template.id === id) || catalog[0];
  if (!item) return;
  document.title = `${item.category} Website Template — LocalSite Kit`;
  document.documentElement.dataset.theme = item.theme;

  root.innerHTML = `
    <div class="site-shell theme-${item.theme} layout-${item.layout}">
      <div class="demo-bar">
        <a href="index.html">← All templates</a>
        <span>Template preview — replace all placeholder details before publishing</span>
        <a href="#contact">Customize this site</a>
      </div>
      <header class="site-header">
        <a class="site-brand" href="#top">
          <span class="site-logo">${defaults.mark}</span>
          <span><strong>${defaults.brand}</strong><small>${item.category}</small></span>
        </a>
        <button class="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="site-nav"><span></span><span></span></button>
        <nav class="site-nav" id="site-nav">
          <a href="#services">Services</a><a href="#why-us">Why us</a><a href="#work">Our work</a><a href="#process">Process</a>
        </nav>
        <a class="header-call" href="tel:${defaults.phoneHref}"><small>Call for a free estimate</small><strong>${defaults.phone}</strong></a>
      </header>

      <main id="top">
        <section class="site-hero">
          <div class="hero-copy">
            <p class="site-kicker"><span></span>${item.kicker}</p>
            <h1>${item.headline}</h1>
            <p class="hero-description">${item.description}</p>
            <div class="hero-actions">
              <a class="site-button site-button-primary" href="#contact">Get a free estimate</a>
              <a class="text-link" href="#work">See our work <span>→</span></a>
            </div>
            <div class="hero-rating">
              <span class="rating-score">4.9</span>
              <span class="rating-stars" aria-label="4.9 out of 5 stars">★★★★★</span>
              <span>Trusted by local customers</span>
            </div>
          </div>
          <div class="hero-visual" aria-hidden="true">
            <div class="hero-shape hero-shape-one"></div><div class="hero-shape hero-shape-two"></div>
            <div class="hero-line-art">${icon(item.icon)}</div>
            <div class="hero-badge"><span>Locally owned</span><strong>Licensed<br>& insured</strong></div>
            <div class="hero-quote-card"><span>Free, no-pressure estimates</span><strong>Clear scope.<br>Clear price.</strong><i>→</i></div>
          </div>
        </section>

        <section class="trust-strip" aria-label="Company highlights">
          ${item.stats.map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join("")}
          <div class="trust-seal">${icon(item.icon)}<span>Local professionals</span></div>
        </section>

        <section class="site-section services-section" id="services">
          <div class="section-heading">
            <div><p class="site-kicker"><span></span>What we do</p><h2>Expert service.<br>Built around you.</h2></div>
            <p>From the first conversation to the final walkthrough, expect practical guidance, professional workmanship, and a result made to last.</p>
          </div>
          <div class="services-grid">
            ${item.services.map(([title, text], index) => `<article class="service-card"><span>0${index + 1}</span>${icon(item.icon)}<h3>${title}</h3><p>${text}</p><a href="#contact" aria-label="Ask about ${title}">Learn more →</a></article>`).join("")}
          </div>
        </section>

        <section class="site-section why-section" id="why-us">
          <div class="why-visual" aria-hidden="true">
            <div class="why-grid"></div>${icon(item.icon, "why-icon")}
            <div class="why-note"><strong>Work done right.</strong><span>Details handled from start to finish.</span></div>
          </div>
          <div class="why-copy">
            <p class="site-kicker"><span></span>Why choose us</p>
            <h2>Professional work should feel professional.</h2>
            <p>That means showing up when promised, communicating clearly, protecting your property, and standing behind the finished work.</p>
            <ul>${item.benefits.map(benefit => `<li><i>✓</i>${benefit}</li>`).join("")}</ul>
            <a class="site-button site-button-outline" href="#contact">Plan your project</a>
          </div>
        </section>

        <section class="site-section projects-section" id="work">
          <div class="section-heading compact">
            <div><p class="site-kicker"><span></span>Selected projects</p><h2>Proof is in the work.</h2></div>
            <a class="text-link" href="#contact">Start your project <span>→</span></a>
          </div>
          <div class="projects-grid">${item.projects.map((label, index) => projectVisual(item, label, index)).join("")}</div>
        </section>

        <section class="testimonial-section">
          <div class="quote-mark">“</div>
          <blockquote>${item.testimonial}</blockquote>
          <div class="quote-person"><span>J</span><p><strong>Jordan M.</strong><small>Verified local customer</small></p></div>
        </section>

        <section class="site-section process-section" id="process">
          <div class="section-heading">
            <div><p class="site-kicker"><span></span>Simple process</p><h2>A clear path to a finished project.</h2></div>
            <p>No runaround and no confusing handoffs. You will always know what comes next.</p>
          </div>
          <div class="process-grid">
            ${item.process.map(([number, title, text]) => `<article><span>${number}</span><div><h3>${title}</h3><p>${text}</p></div></article>`).join("")}
          </div>
        </section>

        <section class="contact-section" id="contact">
          <div class="contact-copy">
            <p class="site-kicker light"><span></span>Start with a conversation</p>
            <h2>Tell us what you need. We’ll make the next step clear.</h2>
            <p>Share a few details and we will follow up within one business day.</p>
            <div class="contact-details"><a href="tel:${defaults.phoneHref}">${defaults.phone}</a><a href="mailto:${defaults.email}">${defaults.email}</a><span>Serving ${defaults.location} and surrounding areas</span></div>
          </div>
          <form class="estimate-form">
            <label><span>Your name</span><input name="name" required placeholder="Jane Smith"></label>
            <label><span>Phone number</span><input name="phone" type="tel" required placeholder="(555) 000-0000"></label>
            <label class="form-wide"><span>Email address</span><input name="email" type="email" required placeholder="jane@example.com"></label>
            <label class="form-wide"><span>How can we help?</span><textarea name="message" rows="3" required placeholder="Tell us a little about your project..."></textarea></label>
            <button class="site-button site-button-primary form-wide" type="submit">Request my free estimate</button>
            <p class="form-status form-wide" role="status"></p>
          </form>
        </section>
      </main>

      <footer class="site-footer">
        <div class="site-brand"><span class="site-logo">${defaults.mark}</span><span><strong>${defaults.brand}</strong><small>${item.category}</small></span></div>
        <p>Professional ${item.category.toLowerCase()} for ${defaults.location} and nearby communities.</p>
        <div><a href="#services">Services</a><a href="#work">Work</a><a href="#contact">Contact</a></div>
        <small>© ${new Date().getFullYear()} ${defaults.brand}. All rights reserved.</small>
      </footer>
    </div>`;

  const toggle = root.querySelector(".menu-toggle");
  const nav = root.querySelector(".site-nav");
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("open", !isOpen);
  });
  nav.addEventListener("click", event => {
    if (event.target.matches("a")) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
  root.querySelector(".estimate-form").addEventListener("submit", event => {
    event.preventDefault();
    const status = event.currentTarget.querySelector(".form-status");
    status.textContent = "Demo form submitted. Connect this form to your preferred email or CRM service before publishing.";
  });
}

renderCatalog();
renderSite();
