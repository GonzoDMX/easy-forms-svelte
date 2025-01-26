// scripts/setup-tailwind.js
import { dirname, join, parse } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const configLine = "'./node_modules/easy-forms-svelte/**/*.{svelte,js,ts}'";

function findTailwindConfig(startDir) {
    let currentDir = startDir;
    while (currentDir !== parse(currentDir).root) {
        for (const file of ['tailwind.config.js', 'tailwind.config.ts']) {
            const configPath = join(currentDir, file);
            if (existsSync(configPath)) return configPath;
        }
        currentDir = dirname(currentDir);
    }
    return null;
}

function addConfigLine(filePath) {
    let content = readFileSync(filePath, 'utf8');
    if (!content.includes(configLine)) {
        const match = content.match(/content:\s*\[(.*?)\]/s);
        if (match) {
            const contentArrayStr = match[1];
            const newContentArrayStr = contentArrayStr.trim().endsWith(',') 
                ? `${contentArrayStr}\n\t\t${configLine},`
                : `${contentArrayStr},\n\t\t${configLine}`;
            
            content = content.replace(/content:\s*\[(.*?)\]/s, `content: [${newContentArrayStr}]`);
            writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Added '${configLine}' to ${filePath}`);
        } else {
            console.error(`❌ Failed to find content array in ${filePath}`);
            process.exit(1);
        }
    } else {
        console.log(`ℹ️ '${configLine}' already exists in ${filePath}`);
    }
}

function removeConfigLine(filePath) {
    let content = readFileSync(filePath, 'utf8');
    if (content.includes(configLine)) {
        content = content.replace(new RegExp(`\\s*${configLine},?\\n?`), '');
        writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Removed '${configLine}' from ${filePath}`);
    } else {
        console.log(`ℹ️ '${configLine}' not found in ${filePath}`);
    }
}

const action = process.argv[2];
if (!action || !['add', 'remove'].includes(action)) {
    console.error('❌ Invalid action. Use "add" or "remove".');
    process.exit(1);
}

const tailwindConfig = findTailwindConfig(process.cwd());
if (!tailwindConfig) {
    console.error('❌ No Tailwind config file found in project root.');
    process.exit(1);
}

if (action === 'add') {
    addConfigLine(tailwindConfig);
} else {
    removeConfigLine(tailwindConfig);
}