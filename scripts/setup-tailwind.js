// scripts/setup-tailwind.js
import fs from 'fs';
import path from 'path';

const configPath = path.resolve(process.env.INIT_CWD, 'tailwind.config.js');

if (fs.existsSync(configPath)) {
  let config = fs.readFileSync(configPath, 'utf8');
  if (!config.includes('easy-forms-svelte')) {
    config = config.replace(
      /content:\s*\[([\s\S]*?)\]/,
      `content: [$1, './node_modules/easy-forms-svelte/**/*.{html,js,svelte,ts}']`
    );
    fs.writeFileSync(configPath, config);
  }
}