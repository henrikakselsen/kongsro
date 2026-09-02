# Kongsro

Chrome extension that hides royal media overkill (including death-wave coverage) on major Norwegian news sites.

Filtering runs **entirely in your browser**. No accounts, no analytics, no cloud AI.

## Install

- **Users:** [Chrome Web Store](https://chromewebstore.google.com/detail/kongsro/ocgpaecakgdkiojnfepfbllkedhhhclp)
- **Developers:** Chrome → `chrome://extensions` → Developer mode → Load unpacked → select `extension/`

## Supported sites

VG, Dagbladet, Aftenposten, NRK, TV 2, Nettavisen, E24, ABC Nyheter, Dagsavisen.

## Privacy

- Policy (GitHub Pages): https://henrikakselsen.github.io/kongsro/privacy/
- Source copy: [`privacy.md`](./privacy.md)

## Development

```bash
npm test
npm run pack   # zip extension/ → dist/kongsro.zip
```

Store screenshots (1280×800):

```bash
npm run screenshots
```

## License

MIT — see [`LICENSE`](./LICENSE).
