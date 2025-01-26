// scripts/setup-tailwind.js
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const targetPath = './node_modules/easy-forms-svelte/**/*.{svelte,js,ts}';
const possibleConfigs = [
  'tailwind.config.js',
  'tailwind.config.ts',
  'src/tailwind.config.js',
  'src/tailwind.config.ts'
];

try {
  const configPath = possibleConfigs
    .map(p => resolve(process.cwd(), p))
    .find(p => existsSync(p));

  if (!configPath) throw new Error('No tailwind config found');

  const content = readFileSync(configPath, 'utf8');
  if (content.includes(targetPath)) process.exit(0);

  const updatedContent = content.replace(
    /(content:\s*\[)([\s\S]*?)(\])/,
    `$1$2,\n\t\t'${targetPath}'$3`
  );

  writeFileSync(configPath, updatedContent);
} catch (error) {
  console.error('Failed to update tailwind config:', error);
}