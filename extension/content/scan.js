import { shouldHide } from "../lib/match.js";

/** Prefer largest site-specific containers first (VG bundles). */
const CARD_SELECTORS = [
  "section.bundle",
  ".bundle",
  "[class*='_bundle_']",
  "article",
  "[data-article-id]",
  "[class*='teaser']",
  "[class*='Teaser']",
  "[class*='story']",
  "[class*='Story']",
  "[class*='card']",
  "[class*='Card']",
  "li",
];

const BUNDLE_SELECTOR = "section.bundle, .bundle, [class*='_bundle_']";

/**
 * Find a reasonable card/teaser ancestor for a text-bearing node.
 * @param {Element} el
 * @returns {Element}
 */
export function findCard(el) {
  for (const sel of CARD_SELECTORS) {
    const card = el.closest(sel);
    if (card && card !== document.body && card !== document.documentElement) {
      return card;
    }
  }
  return el;
}

/**
 * Collect candidate elements that look like headlines/teasers.
 * @param {ParentNode} root
 * @returns {Element[]}
 */
export function collectCandidates(root = document) {
  const nodes = root.querySelectorAll(
    "h1, h2, h3, h4, a[href], [class*='headline'], [class*='title'], [class*='Title']"
  );
  return Array.from(nodes).filter((el) => {
    if (!(el instanceof HTMLElement)) return false;
    if (el.closest("[data-kongsro-ui]")) return false;
    const text = (el.innerText || el.textContent || "").trim();
    return text.length >= 8 && text.length < 500;
  });
}

/**
 * Hide entire VG-style bundles when their combined text matches.
 * @param {ParentNode} root
 * @param {(el: Element) => void} hideFn
 * @param {Set<Element>} seen
 */
function hideMatchingBundles(root, hideFn, seen) {
  if (!root.querySelectorAll) return;
  for (const bundle of root.querySelectorAll(BUNDLE_SELECTOR)) {
    if (seen.has(bundle)) continue;
    const text = (bundle.innerText || "").slice(0, 4000);
    if (!shouldHide(text)) continue;
    seen.add(bundle);
    hideFn(bundle);
  }
}

/**
 * @param {ParentNode} root
 * @param {(el: Element) => void} hideFn
 */
export function scanAndHide(root, hideFn) {
  const seen = new Set();

  // VG: collapse whole feature bundles (e.g. class="bundle _bundle_…")
  hideMatchingBundles(root, hideFn, seen);

  for (const el of collectCandidates(root)) {
    const text = (el.innerText || el.textContent || "").trim();
    if (!shouldHide(text)) continue;
    const card = findCard(el);
    // Skip if already covered by a hidden ancestor bundle/card
    if (card.closest?.(`.kongsro-hidden`) || seen.has(card)) continue;
    let covered = false;
    for (const s of seen) {
      if (s.contains(card)) {
        covered = true;
        break;
      }
    }
    if (covered) continue;
    seen.add(card);
    hideFn(card);
  }
}
