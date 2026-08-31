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

  it("matches TV2 dode- URL clickbait", () => {
    expect(
      shouldHide(
        "– Hun har betydd alt for meg https://www.tv2.no/nyheter/dode-en-dag-for-bryllupsdagen-har-betydd-alt-for-meg/19171174/"
      )
    ).toBe(true);
  });

  it("matches Slottskapellet clickbait slugs", () => {
    expect(
      shouldHide(
        "Historiske bilder: - Må være veldig tøft https://www.dagbladet.no/kjendis/fraktes-til-slottskapellet/85090129"
      )
    ).toBe(true);
  });

  it("matches NRK gallery / condolence slugs", () => {
    expect(shouldHide("Sterkt preget av blomsterhavet")).toBe(true);
    expect(
      shouldHide(
        "Se bildene https://www.nrk.no/norge/kongefamilen-motte-folket-pa-slottsplassen-1.18009547"
      )
    ).toBe(true);
  });

  it("matches keywords in URL slugs (clickbait teasers)", () => {
    expect(
      shouldHide(
        "Ble stående igjen alene https://www.dagbladet.no/kjendis/kongefamilien-gar-ut-pa-slottsplassen/85090768"
      )
    ).toBe(true);
    expect(
      shouldHide("SE NÅ: - Bryter med tradisjonene /video/dukket-opp-kongefamilien-takket-folket/")
    ).toBe(true);
    expect(
      shouldHide(
        "– Det har skjedd noe med ham https://www.nettavisen.no/nyheter/prins-sverre-magnus-ekspert-det-har-skjedd-noe-med-ham/s/1"
      )
    ).toBe(true);
    expect(
      shouldHide(
        "Hotell stenger dørene https://www.nettavisen.no/nyheter/kong-haralds-gravferd-hoteller-i-oslo-stenges/s/1"
      )
    ).toBe(true);
  });

  it("does not hide unrelated news", () => {
    expect(shouldHide("Renter på boliglån synker")).toBe(false);
    expect(shouldHide("Fotball: Norge vant 2–1")).toBe(false);
    expect(shouldHide("Været: sol og regn i Oslo")).toBe(false);
  });
});
