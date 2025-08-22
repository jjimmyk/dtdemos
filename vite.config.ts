import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// If deploying to GitHub Pages under jjimmyk/pratusdemos, set base accordingly.
// You can override with BASE="/" for local dev; vite handles this automatically.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/pratusdemos/' : '/',
});


