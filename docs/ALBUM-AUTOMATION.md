# Google Photos automatic album download — research gate

Production stays browser-local. Google removed the shared album API in March 2025. Official Picker requires user authorization and selection; it does not accept arbitrary shared album URLs. Cloudflare Browser Run supports CDP and Playwright, but actual remote ZIP retrieval from Google Photos must be proven.

## Probe (not a production endpoint)
Install dev tooling locally: npm install --no-save @playwright/test@1.51.1; npx playwright install chromium. Run node experiments/album-download-probe.mjs. First test the synthetic ZIP. For Cloudflare set PHOTOREPORT_CDP_ENDPOINT to an authorized Browser Run CDP WebSocket endpoint per Cloudflare docs; never commit or print it. Then rerun. To test an actual album, create a public synthetic test album with noncustomer images, set PHOTOREPORT_TEST_ALBUM and PHOTOREPORT_TEST_OUTPUT (new output file), rerun. Never use customer photos in this probe. No sign-in or CAPTCHA bypass; fail closed on unexpected controls. The script is unexecuted at commit time.

## Production release gate
- Prove byte retrieval and valid ZIP, compare image count and hashes against manual download, verify HEIC/EXIF.
- Test unavailable/private albums, revoked links, timeouts, large ZIP and concurrency; keep manual import available.
- Before any public endpoint: explicit user consent, no credentials, restrictive URL/redirect validation and egress, authenticated or abuse-limited use, no raw link logging, bounded streaming with archive validation, resource and cost caps, ephemeral cleanup and privacy review. Do not store customer albums in R2 or logs by default.
- No server feature enabled in this revision.

References: https://developers.cloudflare.com/browser-run/cdp/playwright/ ; https://developers.google.com/photos/support/updates ; https://playwright.dev/docs/api/class-download
