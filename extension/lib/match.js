/**
 * Aggressive keyword matching for royal death-wave / overkill coverage.
 * Prefer false positives over false negatives.
 */

const RULES = [
  // Death / mourning
  /kongen\s+er\s+død/,
  /\bdøde?\b.*\bkong/,
  /\bkong.*\bdøde?\b/,
  /\bbisett/,
  /\bbegrav/,
  /\bminneseremoni\b/,
  /\blandesorg\b/,
  /\bbortgang\b/,
  /\bminneord\b/,
  /\bhyllest\b/,
  // Household / succession (aggressive)
  /\bkong harald\b/,
  /\bkongen\b/,
  /\bkongehuset\b/,
  /\bkonge\b/,
  /\bdronning sonja\b/,
  /\bkronprins\b/,
  /\bhaakon\b/,
  /\bmette-?marit\b/,
  /\btronen\b/,
  /\bny konge\b/,
  /\bslottet\b/,
];

/**
 * @param {string} text
 * @returns {boolean}
 */
export function shouldHide(text) {
  if (!text || typeof text !== "string") return false;
  const normalized = text.toLowerCase().normalize("NFC");
  return RULES.some((rule) => rule.test(normalized));
}

export { RULES };
