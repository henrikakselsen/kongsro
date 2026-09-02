/**
 * Front-page only filtering — article URLs must never be filtered.
 * @param {string} pathname
 * @returns {boolean}
 */
export function isFrontPage(pathname) {
  const path = (pathname || "/").split("?")[0].replace(/\/+$/, "") || "/";
  return path === "/" || path === "/index.html" || path === "/index.htm";
}
