# SketchStep-PhotoReport

## PhotoReport MVP 0.1.0
Node 22: `npm install`, `npm run dev`, `npm run build`. Cloudflare Pages: main, `npm run build`, `dist`.

Import images or downloaded ZIP, enter report title, optionally assign floors/rooms/tags/captions, export PDF or editable ZIP. All processing is browser-local. Browser storage can be evicted; export backups. Restore replaces current draft, not a merge. ZIP limits: 200 MB compressed, 300 MB expanded, 1000 entries. HEIC depends on browser. Original backup images may contain sensitive EXIF. Use synthetic test data only.

See [acceptance gate](docs/ACCEPTANCE.md) and [exchange contract](docs/EXCHANGE.md). Build and browser acceptance not yet verified.
