import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import dotenv from 'dotenv';
import {
  generateAdaptivePlan,
  generateGuardianAdvice,
  generateGentleMercy,
  generateWeeklyReport,
} from './src/server/geminiHandler.ts';

dotenv.config();

function apiServerPlugin(): Plugin {
  return {
    name: 'api-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/ai/')) {
          return next();
        }

        const readBody = (): Promise<any> =>
          new Promise((resolve) => {
            let data = '';
            req.on('data', (chunk) => {
              data += chunk;
            });
            req.on('end', () => {
              try {
                resolve(data ? JSON.parse(data) : {});
              } catch {
                resolve({});
              }
            });
          });

        res.setHeader('Content-Type', 'application/json');

        try {
          const body = await readBody();
          const endpoint = req.url.replace('/api/ai/', '').split('?')[0];

          if (endpoint === 'onboarding-plan') {
            const result = await generateAdaptivePlan(body);
            res.statusCode = 200;
            res.end(JSON.stringify(result));
            return;
          }

          if (endpoint === 'guardian-advice') {
            const result = await generateGuardianAdvice(body);
            res.statusCode = 200;
            res.end(JSON.stringify(result));
            return;
          }

          if (endpoint === 'gentle-mercy') {
            const result = await generateGentleMercy(body);
            res.statusCode = 200;
            res.end(JSON.stringify(result));
            return;
          }

          if (endpoint === 'weekly-report') {
            const result = await generateWeeklyReport(body);
            res.statusCode = 200;
            res.end(JSON.stringify(result));
            return;
          }

          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Endpoint not found' }));
        } catch (error: any) {
          console.error('API Error:', error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: error?.message || 'Server error' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

