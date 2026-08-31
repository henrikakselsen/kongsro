# Plan: konge-filter v1

Approved SPEC: `SPEC.md` (GitHub-only, always-on rules, six sites, aggressive hide).

## Dependency graph

```text
scaffold (manifest + empty load)
    │
    ├── match engine + unit tests
    │       │
    │       └── content: hide + MutationObserver
    │               │
    │               ├── chrome.storage settings (global + per-site)
    │               │       │
    │               │       └── popup UI
    │               │
    │               └── article-page placeholder + reveal-once
    │
    └── README + icons + optional pack zip
```

## Approach

1. **Vanilla MV3, no bundler** — ES modules only if Chrome content-script constraints allow; otherwise classic scripts + shared `lib/match.js` loaded via `importScripts` / duplicate-free script list in manifest. Prefer the simplest pattern that unit-tests `shouldHide` in Node (extract pure match module without `chrome.*`).
2. **Generic DOM strategy first** — walk likely teaser containers (article, li, [class*="teaser"], links with headlines); hide closest card ancestor. Tune per-site only if QA shows misses.
3. **CSS class hide** — `.konge-filter-hidden { display: none !important; }` for reversible toggles.
4. **Ship order** — working Load unpacked + tests before polish (icon/README).

## Risks

| Risk | Mitigation |
|------|------------|
| Site DOM differs / paywall shells | Manual QA per site; tighten selectors only where needed |
| Aggressive rules hide sports “kongen” etc. | Accepted by SPEC; document in README |
| ES modules in content scripts | Fall back to non-module scripts if needed |
| Infinite-scroll reinsertion | MutationObserver + debounce |

## Verification checkpoints

- After Tasks 1–2: extension loads; `npm test` green for match
- After Tasks 3–4: hide works on at least one live front page; settings respected
- After Tasks 5–7: full six-site manual QA + README install path

## Out of plan (v1)

Chrome Web Store, cloud rules, social/apps, ML.
