# easy-forms-svelte

This is a form components library for Svelte 5. It prioritizes simplicity over flexibility. The primary goals of this library are to do the following:

- Reduce boilerplate in form creation
- Provide pre-styled, accessible form components
- Integrate well with internationalization
- Maintains Svelte's reactivity model with bind:value
- Allows for customization while providing sensible defaults
- Integrates with your tailwind configuration

## Installation

```bash
pnpm add easy-forms-svelte
```

#### Setup Tailwind.config
Then add this line to 'tailwind.config.ts' or 'tailwind.config.js' depending on your project setup.

```js
import forms from '@tailwindcss/forms';
import type { Config } from 'tailwindcss';

export default {
	content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/easy-forms-svelte/**/*.{svelte,js,ts}' // <- Add this
    ],

	theme: {
		extend: {}
	},

	plugins: [forms]
} satisfies Config;
```

## Uninstall 

```bash
pnpm remove easy-forms-svelte
```

Then remove the following line from 'tailwind.config.ts' or 'tailwind.config.js':
```json
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/easy-forms-svelte/**/*.{svelte,js,ts}' <- REMOVE
	],
	...
}
```

## Basic Usage

```svelte
<script lang="ts">
  import { Form, TextInput } from 'easy-forms-svelte';

  let email = $state('');
  
  function handleSubmit(event: SubmitEvent) {
    // Handle form submission
  }
</script>

<Form on_submit={handleSubmit}>
  <TextInput
    name="email"
    type="email"
    label="Email"
    bind:value={email}
    required
  />
</Form>
```

## Internationalization

### Basic Usage
The library works out of the box in English without any additional setup.

### Full i18n Support
For multi-language support, install the optional dependencies:

```bash
npm install i18n-iso-countries svelte-i18n
```

Register languages in your app's entry point:

```typescript
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json' assert { type: 'json' };
import fr from 'i18n-iso-countries/langs/fr.json' assert { type: 'json' };

countries.registerLocale(en);
countries.registerLocale(fr);
```

Set up svelte-i18n:

```typescript
import { locale } from 'svelte-i18n';

// Set initial locale
locale.set('en');

// Switch language
locale.set('fr');
```

Components like CountryInput will automatically display content in the active locale.

## Components

- Form - Base form container
- TextInput - Text, email, URL, tel inputs
- NumberInput - Numeric input with optional formatting
- MultilineTextInput - Textarea with auto-resize
- DateInput - Date picker
- DateRangeInput - Date range selector
- CheckboxGroup - Group of checkboxes
- ConsentCheckbox - Single checkbox with text
- DropdownSelect - Select dropdown
- CountryInput - Country selector with ISO code normalization

## Development

```bash
pnpm install
pnpm run storybook
```
