import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { cpSync, existsSync, readdirSync } from 'node:fs'
import { resolve, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const pages = readdirSync(fileURLToPath(new URL('.', import.meta.url))).filter(file => file.endsWith('.html'))

// Match the clean page URLs used by navigation during local development too.
function cleanPageURLs(server) {
    server.middlewares.use((req, _res, next) => {
        const url = new URL(req.url, 'http://localhost')
        const page = `${url.pathname.slice(1)}.html`
        if (pages.includes(page)) req.url = `/${page}${url.search}`
        next()
    })
}

export default defineConfig({
    publicDir: false,
    plugins: [
        tailwindcss(),
        {
            name: 'static-site-pages',
            configureServer: cleanPageURLs,
            configurePreviewServer: cleanPageURLs,
            writeBundle(options) {
                // Publish web assets and downloads, retaining originals only in source.
                const unusedFrameDirectories = new Set(['v3_frames', 'v4_frames', 'v4_frames_web'])
                cpSync('public', options.dir, {
                    recursive: true,
                    filter(source) {
                        if (unusedFrameDirectories.has(basename(source))) return false
                        if (/\.(jpe?g|png)$/i.test(source) && existsSync(resolve('public/optimized', `${basename(source)}.webp`))) return false
                        return true
                    }
                })
                // These files are fetched at runtime rather than imported.
                for (const path of ['components', 'profiles', 'news_updates', 'curriculum.json', 'updates.json', 'CNAME']) {
                    if (existsSync(path)) cpSync(path, resolve(options.dir, path), { recursive: true })
                }
            }
        }
    ],
    build: {
        rollupOptions: {
            input: Object.fromEntries(pages.map(file => [file.replace('.html', ''), resolve(file)]))
        }
    }
})
