import fs from 'node:fs/promises'
import express from 'express'
import path from 'node:path'
import argv from 'node:process';

// Constants
const isProduction = argv.argv[2] !== "dev"
if (isProduction) {
    console.log("Running in production mode")
} else {
    console.log("Running in development mode")
}

const port = isProduction ? 3000 : 5173
const base = '/'

// Cached production assets
const templatePath = isProduction
    ? path.resolve('./dist/client/index.html')
    : path.resolve('./index.html');

const ssrManifestPath = isProduction
    ? path.resolve('./dist/client/.vite/ssr-manifest.json')
    : undefined;

const templateHtml = isProduction
    ? await fs.readFile(templatePath, 'utf-8')
    : '';
const ssrManifest = isProduction
    ? await fs.readFile(ssrManifestPath, 'utf-8')
    : undefined;

// Create http server
const app = express()

// Add Vite or respective production middlewares
let vite
if (!isProduction) {
    const { createServer } = await import('vite')
    vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
        base
    })
    app.use(vite.middlewares)
} else {
    const compression = (await import('compression')).default
    const sirv = (await import('sirv')).default
    app.use(compression())
    app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Serve HTML
app.use('*', async (req, res) => {
    try {
        const url = req.originalUrl.replace(base, '')

        let template
        let render
        if (!isProduction) {
            // Always read fresh template in development
            template = await fs.readFile('./index.html', 'utf-8')
            template = await vite.transformIndexHtml(url, template)
            render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
        } else {
            template = templateHtml
            render = (await import('./dist/server/entry-server.js')).render
        }
        console.log(`Rendering: ${url}`)
        const rendered = await render(req.originalUrl)
        const html = template
            .replace(`<!--app-html-->`, rendered.html ?? '')
            .replace(
                `<!--preloaded-state-->`,
                `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(rendered.preloadedState).replace(
                    /</g,
                    '\\u003c'
                  )}</script>`
              );

        res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
    } catch (e) {
        vite?.ssrFixStacktrace(e)
        console.log(e.stack)
        res.status(500).end(e.stack)
    }
})

// Start http server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})
