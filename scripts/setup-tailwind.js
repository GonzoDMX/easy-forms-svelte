// scripts/setup-tailwind.js
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

try {
  const configPath = resolve(process.cwd(), 'tailwind.config.js');
  if (existsSync(configPath)) {
    let config = readFileSync(configPath, 'utf8');
    if (!config.includes('easy-forms-svelte')) {
      // Handle different content array formats
      const contentPattern = /content:\s*\[([\s\S]*?)\]/;
      const match = config.match(contentPattern);
      if (match) {
        const newContent = `content: [${match[1]},\n\t\t'./node_modules/easy-forms-svelte/**/*.{svelte,js,ts}']`;
        config = config.replace(contentPattern, newContent);
        writeFileSync(configPath, config);
        console.log('Updated Tailwind config');
      }
    }
  }
} catch (err) {
  console.error('Error updating Tailwind config:', err);
}