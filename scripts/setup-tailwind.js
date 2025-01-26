// scripts/setup-tailwind.js
import fs from 'fs';
import path from 'path';

// Tailwind configuration line to add or remove
const configLine = "'./node_modules/easy-forms-svelte/**/*.{svelte,js,ts}'";

// Function to find the Tailwind config file in the project root
function findTailwindConfig() {
	// Start search from the current working directory
	let dir = process.cwd();

	// Ensure we are at the project root by checking for a package.json
	while (!fs.existsSync(path.join(dir, 'package.json'))) {
		const parentDir = path.dirname(dir);
		if (parentDir === dir) {
			// Stop if we've reached the filesystem root
			return null;
		}
		dir = parentDir;
	}

	// Possible Tailwind config files
	const possibleFiles = ['tailwind.config.js', 'tailwind.config.ts'];

	// Check for each possible file
	for (const file of possibleFiles) {
		const configPath = path.join(dir, file);
		if (fs.existsSync(configPath)) {
			return configPath;
		}
	}

	// Return null if no config file is found
	return null;
}

// Function to add the configuration line to the Tailwind config
function addConfigLine(filePath) {
	let content = fs.readFileSync(filePath, 'utf8');

	// Check if the line already exists
	if (!content.includes(configLine)) {
		// Insert the new line into the "content" array
		const contentArray = content.split('\n');
		const index = contentArray.findIndex(line => line.includes('content: ['));
		if (index !== -1) {
			contentArray.splice(index + 1, 0, `\t\t${configLine},`);
			fs.writeFileSync(filePath, contentArray.join('\n'), 'utf8');
			console.log(`✅ Added '${configLine}' to ${filePath}`);
		} else {
			console.error(`❌ Failed to find 'content: [' in ${filePath}`);
		}
	} else {
		console.log(`ℹ️ '${configLine}' already exists in ${filePath}`);
	}
}

// Function to remove the configuration line from the Tailwind config
function removeConfigLine(filePath) {
	let content = fs.readFileSync(filePath, 'utf8');

	// Remove the line if it exists
	if (content.includes(configLine)) {
		const updatedContent = content
			.split('\n')
			.filter(line => !line.includes(configLine))
			.join('\n');
		fs.writeFileSync(filePath, updatedContent, 'utf8');
		console.log(`✅ Removed '${configLine}' from ${filePath}`);
	} else {
		console.log(`ℹ️ '${configLine}' does not exist in ${filePath}`);
	}
}

// Main script logic
const action = process.argv[2];
if (!action) {
	console.error('❌ No action specified. Use "add" or "remove".');
	process.exit(1);
}

const tailwindConfig = findTailwindConfig();
if (!tailwindConfig) {
	console.error('❌ No Tailwind config file found. Ensure it exists in the root of your project.');
	process.exit(1);
}

if (action === 'add') {
	addConfigLine(tailwindConfig);
} else if (action === 'remove') {
	removeConfigLine(tailwindConfig);
} else {
	console.error('❌ Invalid action. Use "add" or "remove".');
	process.exit(1);
}
