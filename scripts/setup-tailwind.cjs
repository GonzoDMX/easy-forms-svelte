// scripts/setup-tailwind.cjs
const fs = require('fs');
const path = require('path');

const targetPath = './node_modules/easy-forms-svelte/**/*.{svelte,js,ts}';
const possibleConfigs = ['tailwind.config.js', 'tailwind.config.ts'];

try {
  const configPath = possibleConfigs
    .map(p => path.resolve(process.cwd(), p))
    .find(p => fs.existsSync(p));

  if (!configPath) throw new Error('No config found');

  const content = fs.readFileSync(configPath, 'utf8');
  if (content.includes(targetPath)) process.exit(0);

  const updatedContent = content.replace(
    /(content:\s*\[)([\s\S]*?)(\])/,
    `$1$2,\n\t\t'${targetPath}'$3`
  );

  fs.writeFileSync(configPath, updatedContent);
} catch (error) {
  console.error('Failed:', error);
}