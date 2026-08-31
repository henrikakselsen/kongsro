import { describe, expect, it } from "vitest";
import { shouldHide } from "../extension/lib/match.js";

describe("shouldHide", () => {
  it("hides explicit death-wave headlines", () => {
    expect(shouldHide("Kongen er død – landet i sorg")).toBe(true);
    expect(shouldHide("Bisettelsen av Kong Harald")).toBe(true);
    expect(shouldHide("Hyllest til kongen: Slik husker vi ham")).toBe(true);
    expect(shouldHide("Kronprins Haakon blir ny konge")).toBe(true);
    expect(shouldHide("Landesorg etter kongens bortgang")).toBe(true);
  });

  it("hides VG-style wave headlines (stems, not only exact words)", () => {
    expect(shouldHide("Kongens gravferd: En rekke cupkamper må flyttes")).toBe(true);
    expect(shouldHide("Kongefamilien la ned blomster på Slottsplassen")).toBe(true);
    expect(shouldHide("6,4 millioner kroner for pynt ved kongelig dødsfall")).toBe(true);
    expect(shouldHide("Slik kan du ta farvel med kong Harald")).toBe(true);
    expect(shouldHide("Dronning Sonjas hilsen til ektemannen")).toBe(true);
  });

  it("hides borderline royal overkill (aggressive mode)", () => {
    expect(shouldHide("Kongen åpnet Stortinget")).toBe(true);
    expect(shouldHide("Nytt fra kongehuset")).toBe(true);
    expect(shouldHide("Dronning Sonja i sorg")).toBe(true);
  });

  it("strips soft hyphens used by NRK", () => {
    expect(shouldHide("Konge\u00adfamilien kom ut og takket folket")).toBe(true);
  });

  it("does not hide unrelated news", () => {
    expect(shouldHide("Renter på boliglån synker")).toBe(false);
    expect(shouldHide("Fotball: Norge vant 2–1")).toBe(false);
    expect(shouldHide("Været: sol og regn i Oslo")).toBe(false);
  });
});
