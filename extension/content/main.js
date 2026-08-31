import { shouldHide } from "../lib/match.js";
import { isFilteringActive, loadSettings } from "../lib/settings.js";
import { hideElement, unhideAll } from "./hide.js";
import { scanAndHide } from "./scan.js";
import { articleLooksLikeWave, showArticlePlaceholder } from "./article.js";

let active = false;
let observer = null;
let debounceTimer = null;
let articleHandled = false;

function runScan() {
  if (!active) return;
  scanAndHide(document, hideElement);
  maybeHandleArticle();
}

function maybeHandleArticle() {
  if (articleHandled || !active) return;
  const path = location.pathname || "";
  // Heuristic: article URLs are deeper than bare homepage
  if (path === "/" || path.length < 8) return;

  const { titleText, leadText } = articleLooksLikeWave();
  if (shouldHide(titleText) || shouldHide(leadText)) {
    articleHandled = true;
    showArticlePlaceholder(() => {
      /* revealed once for this load */
    });
  }
}

function scheduleScan() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runScan, 120);
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
  if (shouldRun) {
    active = true;
    runScan();
    startObserver();
  } else {
    active = false;
    stopObserver();
    unhideAll();
    document.getElementById("kongsro-article-placeholder")?.remove();
    articleHandled = false;
  }
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;
  if (changes.enabled || changes.sites) {
    applySettings();
  }
});

applySettings();
