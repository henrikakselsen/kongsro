/**
 * Pure match rules — used by tests (ESM) and copied into content bundle.
 * Prefer false positives over false negatives.
 */

export const RULES = [
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

/**
 * @param {string} text
 * @returns {boolean}
 */
export function shouldHide(text) {
  if (!text || typeof text !== "string") return false;
  const normalized = text
    .toLowerCase()
    .normalize("NFC")
    .replace(/\u00ad/g, "")
    .replace(/[-_/]+/g, " ");
  return RULES.some((rule) => rule.test(normalized));
}
