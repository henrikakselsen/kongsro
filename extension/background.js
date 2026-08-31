/**
 * Service worker: ensure default settings exist on install.
 */
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

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(null, (existing) => {
    if (existing.enabled === undefined) {
      chrome.storage.sync.set(DEFAULT_SETTINGS);
    }
  });
});
