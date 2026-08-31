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

const enabledEl = document.getElementById("enabled");
const siteInputs = Array.from(document.querySelectorAll("input[data-site]"));

function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (data) => {
      resolve({
        enabled: data.enabled !== false,
        sites: { ...DEFAULT_SETTINGS.sites, ...(data.sites || {}) },
      });
    });
  });
}

async function refresh() {
  const settings = await loadSettings();
  enabledEl.checked = settings.enabled;
  siteInputs.forEach((input) => {
    const key = input.getAttribute("data-site");
    input.checked = settings.sites[key] !== false;
  });
}

enabledEl.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: enabledEl.checked });
});

siteInputs.forEach((input) => {
  input.addEventListener("change", async () => {
    const settings = await loadSettings();
    const key = input.getAttribute("data-site");
    const sites = { ...DEFAULT_SETTINGS.sites, ...settings.sites, [key]: input.checked };
    chrome.storage.sync.set({ sites });
  });
});

refresh();
