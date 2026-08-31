/** @typedef {{ enabled: boolean, sites: Record<string, boolean> }} KongsroSettings */

export const DEFAULT_SETTINGS = {
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

/**
 * @param {string} hostname
 * @returns {string | null} canonical site key e.g. vg.no
 */
export function siteKeyFromHost(hostname) {
  const host = hostname.replace(/^www\./, "").toLowerCase();
  return SITE_HOSTS.find((site) => host === site || host.endsWith(`.${site}`)) ?? null;
}

/**
 * @param {KongsroSettings} settings
 * @param {string} hostname
 */
export function isFilteringActive(settings, hostname) {
  if (!settings?.enabled) return false;
  const key = siteKeyFromHost(hostname);
  if (!key) return false;
  return settings.sites[key] !== false;
}

/**
 * @returns {Promise<KongsroSettings>}
 */
export function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (data) => {
      resolve({
        enabled: data.enabled !== false,
        sites: { ...DEFAULT_SETTINGS.sites, ...(data.sites || {}) },
      });
    });
  });
}

export { SITE_HOSTS };
