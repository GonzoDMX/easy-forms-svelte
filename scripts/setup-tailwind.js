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
            console.log('\n✅ Tailwind configuration has been updated successfully!');
            console.log(`Added the following line to ${filePath}:`);
            console.log(`   ${configLine}\n`);
        } else {
            console.error(`❌ Failed to find content array in ${filePath}`);
            displayTailwindInstructions();
        }
    } else {
        console.log(`\nℹ️  The required configuration is already present in ${filePath}\n`);
    }
}

function displayTailwindInstructions() {
    console.log('\n⚠️  Important: For full library features, please manually add the following line');
    console.log('   to the content array in your tailwind.config.js/ts file:');
    console.log(`   ${configLine}\n`);
}

function displayI18nInstructions() {
    console.log('\n📘 Internationalization Support:');
    console.log('   For full internationalization compatibility, please install these packages:');
    console.log('   - svelte-i18n');
    console.log('   - i18n-iso-countries\n');
    console.log('   Check the Internationalization section in our docs for usage examples:');
    console.log('   https://www.npmjs.com/package/easy-forms-svelte\n');
}

function displayUninstallNote() {
    console.log('\nℹ️  Note: If you later remove this library from your project,');
    console.log('   remember to manually remove this line from your tailwind.config file:\n');
    console.log(configLine);
}

// Main execution
const tailwindConfig = findTailwindConfig(process.cwd());

if (tailwindConfig) {
    addConfigLine(tailwindConfig);
} else {
    console.log('\n⚠️  No Tailwind config file found in the project directory.');
    displayTailwindInstructions();
}

// Display additional information
displayI18nInstructions();
displayUninstallNote();
