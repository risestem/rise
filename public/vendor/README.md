# Browser libraries

These pinned distributions let the site render without external script CDNs.
They are unmodified files from the integrity-verified npm packages:

- `alpinejs@3.17.4`: `dist/cdn.min.js` (MIT, see alpine-LICENSE.md)
- `marked@18.1.0`: `lib/marked.umd.js` (MIT, see marked-LICENSE)

When upgrading, copy the distribution and license from the new npm package,
update the versioned script references, and run the browser smoke tests.
