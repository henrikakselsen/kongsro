import { describe, expect, it } from "vitest";
import { isFrontPage } from "../extension/lib/frontpage.js";

describe("isFrontPage", () => {
  it("allows site homepages", () => {
    expect(isFrontPage("/")).toBe(true);
    expect(isFrontPage("")).toBe(true);
    expect(isFrontPage("/index.html")).toBe(true);
    expect(isFrontPage("/?utm=1".split("?")[0])).toBe(true);
  });

  it("rejects article and section URLs", () => {
    expect(
      isFrontPage("/sport/i/PdmRBb/tangerer-overgangsrekord-enzo-klar-for-manchester-city")
    ).toBe(false);
    expect(isFrontPage("/kjendis/ma-gjennom-sikkerhetskontroll/85091235")).toBe(false);
    expect(isFrontPage("/nyheter/dode-en-dag-for-bryllupsdagen/19171174/")).toBe(false);
    expect(isFrontPage("/sport/")).toBe(false);
    expect(isFrontPage("/norge/kongefamilen-motte-folket-1.18009547")).toBe(false);
  });
});
