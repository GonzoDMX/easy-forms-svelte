// scripts/setup-tailwind.js
import { dirname, join, parse } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const configLine = "'./node_modules/easy-forms-svelte/**/*.{svelte,js,ts}'";

function log(message) {
    console.error(message);
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
    // First, let's clean up the input string by removing outer brackets and any whitespace
    const cleanContent = contentStr.trim().replace(/^\[|\]$/g, '').trim();
    
    // Split by commas but handle potential empty entries and clean up whitespace
    const entries = cleanContent
        .split(',')
        .map(entry => entry.trim())
        .filter(entry => entry.length > 0);  // Remove any empty entries

    // Add our new line
    entries.push(newLine);

    // Check if we need multi-line format (if there's more than one entry or existing entries contain newlines)
    const needsMultiLine = entries.length > 1 || cleanContent.includes('\n');

    if (needsMultiLine) {
        // Create multi-line format with proper indentation
        return `[\n\t\t${entries.join(',\n\t\t')}\n\t]`;
    } else {
        // Single line format
        return `[${entries.join(', ')}]`;
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