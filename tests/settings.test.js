import { describe, expect, it } from "vitest";
import { isFilteringActive, siteKeyFromHost } from "../extension/lib/settings.js";

describe("siteKeyFromHost", () => {
  it("maps www and apex hosts", () => {
    expect(siteKeyFromHost("www.vg.no")).toBe("vg.no");
    expect(siteKeyFromHost("vg.no")).toBe("vg.no");
    expect(siteKeyFromHost("www.nrk.no")).toBe("nrk.no");
  });

  it("returns null for unsupported hosts", () => {
    expect(siteKeyFromHost("example.com")).toBe(null);
  });
});

describe("isFilteringActive", () => {
  const settings = {
    enabled: true,
    sites: {
      "vg.no": true,
      "dagbladet.no": false,
      "aftenposten.no": true,
      "nrk.no": true,
      "tv2.no": true,
      "nettavisen.no": true,
    },
  };

  it("respects global off", () => {
    expect(isFilteringActive({ ...settings, enabled: false }, "vg.no")).toBe(false);
  });

  it("respects per-site off", () => {
    expect(isFilteringActive(settings, "www.dagbladet.no")).toBe(false);
    expect(isFilteringActive(settings, "www.vg.no")).toBe(true);
  });
});
