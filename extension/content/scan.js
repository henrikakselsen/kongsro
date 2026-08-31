import { shouldHide } from "../lib/match.js";

const CARD_SELECTORS = [
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
 * @param {ParentNode} root
 * @param {(el: Element) => void} hideFn
 */
export function scanAndHide(root, hideFn) {
  const seen = new Set();
  for (const el of collectCandidates(root)) {
    const text = (el.innerText || el.textContent || "").trim();
    if (!shouldHide(text)) continue;
    const card = findCard(el);
    if (seen.has(card)) continue;
    seen.add(card);
    hideFn(card);
  }
}
