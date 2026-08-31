# Spec: Konge-filter (Chrome extension)

## Objective

Build a Manifest V3 Chrome extension that **aggressively hides** the full media wave around the Norwegian king's death — death itself, funeral/memorial coverage, succession, tributes, schedule changes, and related “kongelig overkill” — on six Norwegian news sites, so front pages and article lists stay usable.

**User stories**

- As a reader, I open a supported news site and do not see teasers/cards about the royal death wave.
- As a reader, I can turn the filter off (and preferably per site) when I want the coverage.
- As a Web Store user, I understand what the extension does, what data it touches (none beyond local settings), and how to disable it.

**Supported sites (host permissions)**

| Site | Primary hosts |
|------|----------------|
| VG | `*.vg.no` |
| Dagbladet | `*.dagbladet.no` |
| Aftenposten | `*.aftenposten.no` |
| NRK | `*.nrk.no` |
| TV 2 | `*.tv2.no` |
| Nettavisen | `*.nettavisen.no` |

## Tech Stack

- Chrome Extension Manifest V3
- Vanilla JS (ES modules where practical) — no React/build step required for v1
- Optional: Vitest for pure filter-matching unit tests (Node)
- Packaging: zip of `extension/` for Web Store upload
- Storage: `chrome.storage.sync` for enable/disable + per-site flags

## Commands

```text
Install (dev):   Chrome → chrome://extensions → Developer mode → Load unpacked → select extension/
Test:            npm test
Lint:            npm run lint   # if eslint is added; otherwise skip until Ask first
Pack (store):    npm run pack   # zips extension/ excluding tests/dev files
```

## Project Structure

```text
SPEC.md                 → This specification (source of truth)
docs/intent/            → Confirmed product intent
extension/
  manifest.json         → MV3 manifest
  background.js         → Service worker (defaults, optional messaging)
  content/
    main.js             → Content script entry: observe DOM, hide matches
    hide.js             → Hide / unhide DOM nodes
  lib/
    match.js            → Keyword / phrase matching (pure, testable)
    sites.js            → Site allowlist helpers
  popup/
    popup.html
    popup.js            → Global + per-site toggles
    popup.css
  icons/                → 16 / 48 / 128
privacy.md              → Short privacy policy text for Web Store
tasks/                  → Plan + todo (after SPEC approval)
tests/
  match.test.js         → Unit tests for matching aggressiveness
```

## Code Style

- Small pure functions for matching; DOM side effects only in content scripts
- Norwegian UI copy in popup; English for GitHub/docs/Web Store listing body unless noted
- Prefer data attributes / CSS class `konge-filter-hidden` over deleting nodes (reversible when toggled off)
- Example matching API:

```js
/** @returns {boolean} true if text should be hidden under aggressive mode */
export function shouldHide(text, rules) {
  const normalized = text.toLowerCase().normalize("NFC");
  return rules.some((rule) => rule.test(normalized));
}
```

## Filtering behaviour

### Aggressiveness

**Prefer false positives over false negatives.** When in doubt, hide.

### What to match (v1 rule set — expandable)

Match against teaser/card/headline/lead text (and full article title/body when on article pages), case-insensitive, Norwegian:

- Death / mourning: `død`, `døde`, `bisett`, `begrav`, `minneseremoni`, `sorg`, `landesorg`, …
- King / household in crisis context: `kongen`, `kong harald`, `kongehuset`, `slottet`, `dronning sonja`, `kronprins`, `haakon`, `mette-marit`, …
- Wave framing: `trontale` only if combined with death context is hard — **v1:** broad royal keywords are enough given aggressiveness preference
- Succession / tributes: `tronen`, `ny konge`, `kong haakon`, `hyllest`, `minneord`, …

Exact phrase lists live in `extension/lib/match.js` (or `rules.json`) and are versioned in git. Tuning is expected after live QA on each site.

### What to hide

- List/front-page **cards / teasers / headline rows** whose visible text matches
- On article pages: if title or lead matches, hide main article content and show a short Norwegian placeholder (“Skjult av Konge-filter”) with a link/button to reveal once

### MutationObserver

Re-run on DOM changes (infinite scroll, live updates). Use a single observer per page; debounce lightly.

### Settings

| Setting | Default | Notes |
|---------|---------|--------|
| Global enabled | `true` | Popup toggle |
| Per-site enabled | all `true` | Six checkboxes |
| Reveal-once | n/a | In-page control does not disable the extension |

## Testing Strategy

- **Unit (required):** `tests/match.test.js` — positive cases (death wave copy), aggressive over-hide cases (generic “kongen”), and a small set of must-not-hide if we add allowlist later (none required in v1)
- **Manual QA (required before store):** Load unpacked; visit each of the six homepages (and one article URL per site if available); confirm cards disappear and toggle restores them
- **No e2e browser automation required for v1** unless we later add Playwright

## Boundaries

- **Always:** Keep matching logic pure and unit-tested; never send page content off-device; run `npm test` before commit when tests exist; update SPEC when rule philosophy changes
- **Ask first:** Adding sites beyond the six; adding a build bundler/React; publishing to Chrome Web Store; changing aggressiveness toward precision; collecting any telemetry
- **Never:** Remote code fetch for rules; reading page content into a server; requesting host permissions outside the six domains (+ `chrome.storage`); committing secrets or store API keys

## Success Criteria

1. With filter **on**, a fixture/sample set of death-wave headlines is classified `shouldHide === true` in unit tests.
2. On each of the six sites (homepage), matching teasers are not visible in the layout (hidden via CSS/class), including after scroll/AJAX updates.
3. Global **off** restores previously hidden nodes without reload (or after one reload if unavoidable — prefer without).
4. Per-site off disables filtering only on that host.
5. Manifest V3 loads via “Load unpacked” with no console errors on a clean profile.
6. `privacy.md` + store description draft exist and state: local-only, no accounts, no tracking.
7. Prefer-over-hide is documented and reflected in tests (at least one “borderline royal” string is hidden).

## Open Questions

1. Extension **name** for Web Store (e.g. “Konge-filter”, “Nyhetsro — kongehus”, something more neutral)?
2. Should v1 ship with rules **always active**, or a “only when mourning wave detected” master switch (still aggressive within wave)? Default assumption: **always-on rules** while extension is enabled — user turns extension off when they want coverage.
3. Icon / visual identity — minimal monochrome OK for v1?
