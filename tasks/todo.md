# Todo: kongsro v1

## Task 1: Extension scaffold

**Description:** Create `extension/manifest.json` (MV3), minimal background, empty content stub, `package.json` with test script placeholder so “Load unpacked” works.

**Acceptance criteria:**
- [ ] Manifest names the extension `Kongsro` and lists the six host patterns
- [ ] Load unpacked succeeds with no errors on `chrome://extensions`

**Verification:**
- [ ] Manual: Load unpacked → status OK
- [ ] Files under `extension/` only for runtime

**Dependencies:** None

**Files likely touched:**
- `extension/manifest.json`
- `extension/background.js`
- `package.json`
- `.gitignore`

**Estimated scope:** Small

---

## Task 2: Match engine + unit tests

**Description:** Implement pure `shouldHide` / rule list and Vitest (or Node test runner) covering death-wave and borderline “kongen” over-hide cases.

**Acceptance criteria:**
- [ ] Death-wave sample headlines → hide
- [ ] Borderline royal string → hide (aggressive)
- [ ] `npm test` passes

**Verification:**
- [ ] `npm test`

**Dependencies:** Task 1

**Files likely touched:**
- `extension/lib/match.js`
- `tests/match.test.js`
- `package.json`

**Estimated scope:** Medium

---

## Checkpoint: After Tasks 1–2

- [ ] Load unpacked OK
- [ ] `npm test` green

---

## Task 3: Content script hide + observer

**Description:** Scan page for card/teaser text, apply `kongsro-hidden`, observe mutations (debounced). Wire match module into content script.

**Acceptance criteria:**
- [ ] Matching teasers hidden on a supported homepage
- [ ] New nodes from scroll/AJAX get evaluated
- [ ] Hidden nodes use reversible CSS class (not removed)

**Verification:**
- [ ] Manual: VG or NRK front page with filter forced on
- [ ] Toggle class removal restores visibility (devtool or later popup)

**Dependencies:** Task 2

**Files likely touched:**
- `extension/content/main.js`
- `extension/content/hide.js`
- `extension/content/hide.css`
- `extension/manifest.json`

**Estimated scope:** Medium

---

## Task 4: Settings (global + per-site)

**Description:** Persist enable flags in `chrome.storage.sync`; content script skips work when global or current host is off; live update on storage change.

**Acceptance criteria:**
- [ ] Defaults: global on, all six sites on
- [ ] Disabling global stops hiding / unhides
- [ ] Disabling one site only affects that host

**Verification:**
- [ ] Manual: flip storage via popup (Task 5) or temporary debug
- [ ] No network calls

**Dependencies:** Task 3

**Files likely touched:**
- `extension/lib/settings.js`
- `extension/content/main.js`
- `extension/background.js`

**Estimated scope:** Medium

---

## Task 5: Popup UI

**Description:** Norwegian popup with global toggle and six per-site checkboxes.

**Acceptance criteria:**
- [ ] Controls read/write `chrome.storage.sync`
- [ ] Changes apply without requiring extension reload

**Verification:**
- [ ] Manual: toggle while frontpage open → cards show/hide

**Dependencies:** Task 4

**Files likely touched:**
- `extension/popup/popup.html`
- `extension/popup/popup.js`
- `extension/popup/popup.css`
- `extension/manifest.json`

**Estimated scope:** Medium

---

## Checkpoint: After Tasks 3–5

- [ ] Hide + toggles work on ≥1 live site
- [ ] `npm test` still green

---

## Task 6: Article placeholder + reveal-once

**Description:** On article pages, if title/lead matches, hide main content and show “Skjult av Kongsro” with reveal control.

**Acceptance criteria:**
- [ ] Matching article shows placeholder
- [ ] Reveal shows content once for that page load (extension stays on)

**Verification:**
- [ ] Manual: open one matching article URL (or fixture HTML if easier)

**Dependencies:** Task 3

**Files likely touched:**
- `extension/content/main.js`
- `extension/content/article.js`

**Estimated scope:** Small–Medium

---

## Task 7: Icons, privacy, store listing, pack

**Description:** Minimal icons (incl. 128); `privacy.md`; `docs/store-listing.md`; `npm run pack` zip for Web Store upload. Do **not** publish without Ask first.

**Acceptance criteria:**
- [ ] Toolbar icon visible
- [ ] Privacy + store listing drafts ready to paste
- [ ] `npm run pack` produces uploadable zip of `extension/`

**Verification:**
- [ ] Manual: Load unpacked still OK
- [ ] `npm test`
- [ ] Zip opens / contains manifest

**Dependencies:** Tasks 1–5

**Files likely touched:**
- `extension/icons/*`
- `privacy.md`
- `docs/store-listing.md`
- `package.json`

**Estimated scope:** Medium

---

## Checkpoint: Store-ready (not published)

- [ ] Manual QA on all six homepages
- [ ] Pack zip + privacy + listing ready
- [ ] SPEC success criteria 1–8 addressed or explicitly deferred with reason
- [ ] Explicit user go before Web Store submit
