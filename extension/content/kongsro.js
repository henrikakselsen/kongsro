/**
 * Kongsro content script — classic (non-module) so Chrome always injects it.
 * Keep in sync with extension/lib/match.js rules used by unit tests.
 */
(() => {
  const RULES = [
    /kongen\s+er\s+død/,
    /døde?.*kong/,
    /kong.*døde?/,
    /bisett/,
    /begrav/,
    /gravferd/,
    /minneseremoni/,
    /landesorg/,
    /bortgang/,
    /minneord/,
    /hyllest/,
    /dødsfall/,
    /sorg/,
    /farvel/,
    /kong\s*harald/,
    /kongen/,
    /kongehus/,
    /kongefam/,
    /kongelig/,
    /\bkonge\b/,
    /dronning\s*sonja/,
    /kronprins/,
    /haakon/,
    /mette-?marit/,
    /tronen/,
    /ny\s+konge/,
    /slottet/,
    /slottsplass/,
    /slottskapell/,
    /prins/,
    /sverre/,
    /kondolanse/,
    /blomsterhav/,
  ];

  const HIDDEN = "kongsro-hidden";
  const MARK = "data-kongsro";
  const DEFAULT_SETTINGS = {
    enabled: true,
    sites: {
      "vg.no": true,
      "dagbladet.no": true,
      "aftenposten.no": true,
      "nrk.no": true,
      "tv2.no": true,
      "nettavisen.no": true,
    },
  };
  const SITE_HOSTS = Object.keys(DEFAULT_SETTINGS.sites);
  // Whole blocks to evaluate/hide (VG bundles, Dagbladet stripes, Nettavisen packages, TV2 mourning, NRK kur, etc.)
  const BLOCK_SELECTOR = [
    "section.bundle",
    ".bundle",
    "[class*='bundle']",
    "[class*='_bundle_']",
    "section.rodimus-complex-front",
    ".rodimus-complex-front",
    "brick-teaser-group-v0",
    "brick-teaser-v23",
    "section.two-columns--mourning",
    "section[class*='--mourning']",
    "div.two-columns--mourning",
    "div[class*='--mourning']",
    "div.mourning__wrapper",
    "div.mourning__content",
    "div.mourning",
    "article.bg-mourning",
    "article[class*='mourning']",
    "div.kur-top-floors",
    "section.kur-floor--top",
    "section.kur-floor",
    "div.kur-room-wrapper",
    "div.kur-room",
    ".column.stripe",
    "[class*='stripe']",
    "article.preview",
    "article.column.preview",
    "article.b-teaser-container",
    "[class*='kingCondolences']",
    "[class*='Condolence']",
    "[class*='condolence']",
    "[class*='teaser']",
    "[class*='Teaser']",
    "[class*='article']",
    "[class*='card']",
    "[class*='Card']",
    "[data-article-id]",
  ].join(", ");
  const CARD_SELECTORS = [
    "div.kur-top-floors",
    "section.kur-floor--top",
    "section.kur-floor",
    "div.kur-room-wrapper",
    "div.kur-room",
    "section.two-columns--mourning",
    "section[class*='--mourning']",
    "section.rodimus-complex-front",
    ".rodimus-complex-front",
    "brick-teaser-group-v0",
    "brick-teaser-v23",
    "section.bundle",
    ".bundle",
    "[class*='bundle']",
    "[class*='_bundle_']",
    ".column.stripe",
    "[class*='stripe']",
    "article.b-teaser-container",
    "article.bg-mourning",
    "article.preview",
    "article",
    "[data-article-id]",
    "[class*='teaser']",
    "[class*='Teaser']",
    "[class*='article']",
    "[class*='story']",
    "[class*='card']",
    "[class*='preview']",
    "li",
  ];

  function shouldHide(text) {
    if (!text || typeof text !== "string") return false;
    // Strip soft hyphens (NRK etc.) so "Konge­familien" matches
    const normalized = text
      .toLowerCase()
      .normalize("NFC")
      .replace(/\u00ad/g, "")
      .replace(/[-_/]+/g, " ");
    return RULES.some((rule) => rule.test(normalized));
  }

  /**
   * Visible text + link URLs (Dagbladet clickbait often only has keywords in the slug).
   * @param {Element} el
   */
  function matchBlob(el) {
    const text = (el.innerText || el.textContent || "").slice(0, 4000);
    const hrefs = Array.from(el.querySelectorAll("a[href]"))
      .map((a) => {
        try {
          return decodeURIComponent(a.getAttribute("href") || a.href || "");
        } catch (_) {
          return a.getAttribute("href") || "";
        }
      })
      .join(" ");
    const selfHref =
      el instanceof HTMLAnchorElement ? el.getAttribute("href") || el.href || "" : "";
    return `${text} ${hrefs} ${selfHref}`;
  }

  function elementMatches(el) {
    return shouldHide(matchBlob(el));
  }

  function siteKeyFromHost(hostname) {
    const host = hostname.replace(/^www\./, "").toLowerCase();
    return SITE_HOSTS.find((site) => host === site || host.endsWith(`.${site}`)) || null;
  }

  function isFilteringActive(settings, hostname) {
    if (!settings || settings.enabled === false) return false;
    const key = siteKeyFromHost(hostname);
    if (!key) return false;
    return settings.sites[key] !== false;
  }

  function loadSettings() {
    return new Promise((resolve) => {
      try {
        chrome.storage.sync.get(DEFAULT_SETTINGS, (data) => {
          resolve({
            enabled: data.enabled !== false,
            sites: { ...DEFAULT_SETTINGS.sites, ...(data.sites || {}) },
          });
        });
      } catch (_) {
        resolve(DEFAULT_SETTINGS);
      }
    });
  }

  function hideElement(el) {
    if (!(el instanceof Element)) return;
    el.classList.add(HIDDEN);
    el.setAttribute(MARK, "1");
    // Nettavisen: also hide brick wrappers around the teaser
    const brick = el.closest?.("brick-teaser-v23, brick-teaser-group-v0");
    if (brick && brick !== el) {
      brick.classList.add(HIDDEN);
      brick.setAttribute(MARK, "1");
    }
    // NRK: climb to room / floor card
    const room = el.closest?.(".kur-room-wrapper, .kur-room");
    if (room && room !== el) {
      room.classList.add(HIDDEN);
      room.setAttribute(MARK, "1");
    }
  }

  function unhideAll() {
    document.querySelectorAll(`.${HIDDEN}[${MARK}]`).forEach((el) => {
      el.classList.remove(HIDDEN);
      el.removeAttribute(MARK);
    });
  }

  function findCard(el) {
    for (const sel of CARD_SELECTORS) {
      const card = el.closest(sel);
      if (card && card !== document.body && card !== document.documentElement) {
        return card;
      }
    }
    return el;
  }

  /**
   * Hide remaining teasers in a grid row / teaser group when any sibling matches
   * (clickbait with no keywords next to royal coverage). Aggressive by design.
   */
  function hideRowNeighbours() {
    document.querySelectorAll("div.row").forEach((row) => {
      const arts = Array.from(row.querySelectorAll("article"));
      if (arts.length < 2 || arts.length > 10) return;

      const matchCount = arts.filter(
        (a) => a.classList.contains(HIDDEN) || elementMatches(a)
      ).length;
      if (matchCount < 1) return;
      arts.forEach((a) => hideElement(a));
    });

    // Nettavisen brick groups + royal front packages
    document
      .querySelectorAll("brick-teaser-group-v0, section.rodimus-complex-front")
      .forEach((group) => {
        const arts = Array.from(group.querySelectorAll("article"));
        if (!arts.length) return;
        const matchCount = arts.filter(
          (a) => a.classList.contains(HIDDEN) || elementMatches(a)
        ).length;
        if (matchCount < 1) return;
        hideElement(group);
        arts.forEach((a) => hideElement(a));
      });

    // NRK kur floors: wipe top floor (or any floor with several matches)
    document.querySelectorAll("section.kur-floor").forEach((floor) => {
      const rooms = Array.from(floor.querySelectorAll(".kur-room-wrapper, .kur-room"));
      if (!rooms.length) return;
      const matchCount = rooms.filter(
        (r) => r.classList.contains(HIDDEN) || elementMatches(r)
      ).length;
      const isTop = floor.classList.contains("kur-floor--top");
      if (!(isTop || matchCount >= 2 || (rooms.length && matchCount / rooms.length >= 0.3))) {
        return;
      }
      if (matchCount < 1 && !elementMatches(floor)) return;
      hideElement(floor);
      rooms.forEach((r) => hideElement(r));
    });
  }

  function scanAndHide() {
    const seen = new Set();

    document.querySelectorAll(BLOCK_SELECTOR).forEach((block) => {
      if (!(block instanceof Element)) return;
      // Never hide the whole document chrome
      if (block === document.body || block === document.documentElement) return;
      if (block.matches("main, .main-section, .page-content, header, nav, footer")) return;
      if (block.closest(`.${HIDDEN}`)) return;
      // TV2 mourning / NRK top floor packages: hide the block itself
      const isPackageBlock =
        (/\bmourning\b|--mourning|bg-mourning/i.test(block.className || "") ||
          /\bkur-floor--top\b|\bkur-top-floors\b/i.test(block.className || "")) &&
        /^(SECTION|DIV|ARTICLE)$/i.test(block.tagName);
      if (!isPackageBlock && !elementMatches(block)) return;
      if (isPackageBlock || elementMatches(block)) {
        seen.add(block);
        hideElement(block);
      }
    });

    const nodes = document.querySelectorAll(
      "h1, h2, h3, h4, a[href], [class*='headline'], [class*='title'], [class*='Title']"
    );
    nodes.forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      if (el.closest("[data-kongsro-ui]")) return;
      if (el.closest(`.${HIDDEN}`)) return;
      const text = (el.innerText || el.textContent || "").trim();
      const href = el instanceof HTMLAnchorElement ? el.href || "" : "";
      if (text.length < 8 && !href) return;
      if (text.length > 500 && !shouldHide(href)) return;
      if (!shouldHide(`${text} ${href}`)) return;
      const card = findCard(el);
      if (seen.has(card) || card.closest(`.${HIDDEN}`)) return;
      for (const s of seen) {
        if (s.contains(card)) return;
      }
      seen.add(card);
      hideElement(card);
    });

    document.querySelectorAll("article").forEach((article) => {
      if (article.closest(`.${HIDDEN}`) || seen.has(article)) return;
      if (!elementMatches(article)) return;
      seen.add(article);
      hideElement(article);
    });

    hideRowNeighbours();
  }

  function showArticlePlaceholder() {
    if (document.getElementById("kongsro-article-placeholder")) return;
    const path = location.pathname || "";
    if (path === "/" || path.length < 8) return;
    const titleText = (document.querySelector("h1")?.innerText || document.title || "").trim();
    const lead = document.querySelector(
      "[class*='lead'], [class*='ingress'], [class*='standfirst'], .article-lead, p"
    );
    const leadText = (lead?.innerText || "").trim().slice(0, 400);
    if (!shouldHide(titleText) && !shouldHide(leadText)) return;

    const targets = [];
    const main =
      document.querySelector("main, article, [role='main'], .article-body, .article__body") ||
      null;
    if (main && main !== document.body) targets.push(main);
    else document.querySelectorAll("article, .article, [class*='article-body']").forEach((el) => targets.push(el));
    targets.forEach((el) => {
      el.classList.add(HIDDEN);
      el.setAttribute(MARK, "article");
    });

    const box = document.createElement("div");
    box.id = "kongsro-article-placeholder";
    box.setAttribute("data-kongsro-ui", "1");
    box.style.cssText =
      "max-width:40rem;margin:2rem auto;padding:1.5rem;font-family:system-ui,sans-serif;border:1px solid #ccc;border-radius:8px;";
    box.innerHTML =
      "<p style='margin:0 0 1rem'><strong>Skjult av Kongsro</strong></p>" +
      "<p style='margin:0 0 1rem;color:#444'>Denne artikkelen ser ut til å handle om kongelig mediestorm.</p>" +
      "<button type='button' style='padding:0.5rem 1rem;cursor:pointer'>Vis likevel</button>";
    box.querySelector("button")?.addEventListener("click", () => {
      targets.forEach((el) => {
        el.classList.remove(HIDDEN);
        el.removeAttribute(MARK);
      });
      box.remove();
    });
    (document.querySelector("main, [role='main']") || document.body).prepend(box);
  }

  let active = false;
  let observer = null;
  let debounceTimer = null;

  function runScan() {
    if (!active) return;
    scanAndHide();
    showArticlePlaceholder();
  }

  function scheduleScan() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runScan, 80);
  }

  function startObserver() {
    if (observer) return;
    observer = new MutationObserver(() => scheduleScan());
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function stopObserver() {
    observer?.disconnect();
    observer = null;
  }

  async function applySettings() {
    const settings = await loadSettings();
    const shouldRun = isFilteringActive(settings, location.hostname);
    console.debug("[Kongsro]", { shouldRun, host: location.hostname, settings });
    if (shouldRun) {
      active = true;
      runScan();
      startObserver();
    } else {
      active = false;
      stopObserver();
      unhideAll();
      document.getElementById("kongsro-article-placeholder")?.remove();
    }
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && (changes.enabled || changes.sites)) applySettings();
  });

  applySettings();
})();
