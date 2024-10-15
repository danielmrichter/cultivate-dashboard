import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'

// This is the WIP PWA Configuration. This is using a plugin
// called vite-pwa. It uses vite's build to generate a manifest and all the
// necessary service workers. It's not implemented since some implementation
// details are beyond the scope of this app.
//  Read more: https://vite-pwa-org.netlify.app/guide/

// This is the current config. It goes in the plugins property, as part of the plugins.
// VitePWA({registerType: 'autoUpdate', injectRegister: 'inline'})

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
        },
        server: {
            proxy: {
                "/api":'http://localhost:5001',
            }
        },
        plugins: [react(), ]
    };
});
