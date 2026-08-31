import { DEFAULT_SETTINGS, loadSettings } from "../lib/settings.js";

const enabledEl = document.getElementById("enabled");
const siteInputs = Array.from(document.querySelectorAll("input[data-site]"));

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
