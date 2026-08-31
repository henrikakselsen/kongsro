export const HIDDEN_CLASS = "kongsro-hidden";
export const MARK_ATTR = "data-kongsro";

/**
 * @param {Element} el
 */
export function hideElement(el) {
  if (!(el instanceof Element)) return;
  el.classList.add(HIDDEN_CLASS);
  el.setAttribute(MARK_ATTR, "1");
}

/**
 * @param {ParentNode} [root]
 */
export function unhideAll(root = document) {
  root.querySelectorAll(`.${HIDDEN_CLASS}[${MARK_ATTR}]`).forEach((el) => {
    el.classList.remove(HIDDEN_CLASS);
    el.removeAttribute(MARK_ATTR);
  });
}
