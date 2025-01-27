// scripts/setup-tailwind.js
import { dirname, join, parse } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const configLine = "'./node_modules/easy-forms-svelte/**/*.{svelte,js,ts}'";

function log(message) {
    process.stdout.write(message + '\n');
}

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

function formatContentArray(contentStr, newLine) {
    // Remove any trailing commas and whitespace
    contentStr = contentStr.trim().replace(/,\s*$/, '');
    
    // Check if it's a single-line or multi-line array
    const isMultiLine = contentStr.includes('\n');
    
    if (isMultiLine) {
        // Handle multi-line format
        const lines = contentStr.split('\n').map(line => line.trim()).filter(line => line);
        return `[\n\t\t${lines.join(',\n\t\t')},\n\t\t${newLine}\n\t]`;
    } else {
        // Convert single-line to multi-line format
        const items = contentStr.slice(1, -1).split(',').map(item => item.trim()).filter(item => item);
        items.push(newLine);
        return `[\n\t\t${items.join(',\n\t\t')}\n\t]`;
    }
}

function addConfigLine(filePath) {
    let content = readFileSync(filePath, 'utf8');
    if (!content.includes(configLine)) {
        const match = content.match(/content:\s*\[([\s\S]*?)\]/);
        if (match) {
            const contentArrayStr = match[1];
            const newContentArray = formatContentArray(contentArrayStr, configLine);
            
            content = content.replace(/content:\s*\[([\s\S]*?)\]/, `content: ${newContentArray}`);
            writeFileSync(filePath, content, 'utf8');
            log('\n✅ Tailwind configuration has been updated successfully!');
            log(`Added the following line to ${filePath}:`);
            log(`   ${configLine}\n`);
            return true;
        } else {
            log(`\n❌ Failed to find content array in ${filePath}`);
            return false;
        }
    } else {
        log(`\nℹ️  The required configuration is already present in ${filePath}\n`);
        return true;
    }
}

function displayTailwindInstructions() {
    log('\n⚠️  Important: For full library features, please manually add the following line');
    log('   to the content array in your tailwind.config.js/ts file:');
    log(`   ${configLine}\n`);
}

function displayI18nInstructions() {
    log('\n📘 Internationalization Support:');
    log('   For full internationalization compatibility, please install these packages:');
    log('   - svelte-i18n');
    log('   - i18n-iso-countries\n');
    log('   Check the Internationalization section in our docs for usage examples:');
    log('   https://www.npmjs.com/package/easy-forms-svelte\n');
}

function displayUninstallNote() {
    log('\nℹ️  Note: If you later remove this library from your project,');
    log('   remember to manually remove this line from your tailwind.config file:');
    log(`   ${configLine}\n`);
}

// Main execution
try {
    log('\n=== Easy Forms Svelte Setup ===\n');
    
    const tailwindConfig = findTailwindConfig(process.cwd());

    if (tailwindConfig) {
        const success = addConfigLine(tailwindConfig);
        if (!success) {
            displayTailwindInstructions();
        }
    } else {
        log('\n⚠️  No Tailwind config file found in the project directory.');
        displayTailwindInstructions();
    }

    // Always display these messages
    displayI18nInstructions();
    displayUninstallNote();

    log('=== Setup Complete ===\n');
    process.exit(0);
} catch (error) {
    log('\n❌ An error occurred during setup:');
    log(error.message);
    process.exit(1);
}