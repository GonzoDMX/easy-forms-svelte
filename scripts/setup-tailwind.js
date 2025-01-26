// scripts/setup-tailwind.js
import fs from 'fs';
import path from 'path';

// Tailwind configuration line to add or remove
const configLine = "'./node_modules/easy-forms-svelte/**/*.{svelte,js,ts}'";

function findProjectRoot(dir = process.cwd()) {
	if (fs.existsSync(path.join(dir, 'package.json'))) {
		return dir;
	}
	const parentDir = path.dirname(dir);
	// Stop searching if reached the root directory
	if (parentDir === dir) return null;
	return findProjectRoot(parentDir);
}

function findTailwindConfig() {
	const rootDir = findProjectRoot();
	if (!rootDir) {
		console.error('Project root not found.');
		process.exit(1);
	}
	const possibleFiles = ['tailwind.config.js', 'tailwind.config.ts'];
	for (const file of possibleFiles) {
		const filePath = path.join(rootDir, file);
		if (fs.existsSync(filePath)) {
			return filePath;
		}
	}
	return null;
}

// Add the configuration line
function addConfigLine(filePath) {
	let content = fs.readFileSync(filePath, 'utf8');
	if (!content.includes(configLine)) {
		const contentArray = content.split('\n');
		const index = contentArray.findIndex(line => line.includes('content: ['));
		if (index !== -1) {
			contentArray.splice(index + 1, 0, `\t\t${configLine},`);
			fs.writeFileSync(filePath, contentArray.join('\n'), 'utf8');
			console.log(`Added ${configLine} to ${filePath}`);
		}
	}
}

// Remove the configuration line
function removeConfigLine(filePath) {
	let content = fs.readFileSync(filePath, 'utf8');
	if (content.includes(configLine)) {
		const updatedContent = content
			.split('\n')
			.filter(line => !line.includes(configLine))
			.join('\n');
		fs.writeFileSync(filePath, updatedContent, 'utf8');
		console.log(`Removed ${configLine} from ${filePath}`);
	}
}

// Main script logic
const action = process.argv[2];
if (!action) {
	console.error('No action specified. Use "add" or "remove".');
	process.exit(1);
}

const tailwindConfig = findTailwindConfig();
if (!tailwindConfig) {
	console.error('No Tailwind config file found.');
	process.exit(1);
}

if (action === 'add') {
	addConfigLine(tailwindConfig);
} else if (action === 'remove') {
	removeConfigLine(tailwindConfig);
} else {
	console.error('Invalid action. Use "add" or "remove".');
	process.exit(1);
}
